// app/api/match-files/route.js
import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const PREFIX = process.env.AWS_S3_PREFIX || ""; // e.g. "radio-playback-files/nepal_leauge_analytics/matches/"

async function streamToString(stream) {
  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const matchParam = url.searchParams.get("match") || "";
    const componentParam = url.searchParams.get("component") || "";

    if (!matchParam || !componentParam) {
      return NextResponse.json(
        { error: "Missing required query params: match and component" },
        { status: 400 }
      );
    }

    // Normalize: ensure there's no leading slash, and ensure trailing slash between parts
    const cleanMatch = matchParam.replace(/^\/+|\/+$/g, "");
    const cleanComp = componentParam.replace(/^\/+|\/+$/g, "");

    // Build S3 prefix to search inside the selected match -> component folder
    // If your PREFIX already includes the 'matches/' part, ensure it ends with a slash.
    const basePrefix = PREFIX.endsWith("/") ? PREFIX : `${PREFIX}/`;
    const searchPrefix = `${basePrefix}${cleanMatch}/${cleanComp}/`;

    // List objects under that prefix
    const listCmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: searchPrefix,
      Delimiter: "/", // optional: we want files under that folder
      MaxKeys: 1000,
    });

    const listResp = await s3.send(listCmd);

    // Collect object keys that look like .json files
    const objectKeys = (listResp.Contents || [])
      .map((o) => o.Key)
      .filter(Boolean)
      .filter((k) => k.toLowerCase().endsWith(".json"));

    // If you prefer to return only file names, map to file names:
    // const fileNames = objectKeys.map(k => k.replace(searchPrefix, ''));

    // Fetch and parse each JSON (in parallel)
    const files = await Promise.all(
      objectKeys.map(async (key) => {
        try {
          const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
          const getResp = await s3.send(getCmd);

          // getResp.Body is a Readable stream in Node
          const bodyStr = await streamToString(getResp.Body);
          let parsed = null;
          try {
            parsed = JSON.parse(bodyStr);
          } catch (err) {
            parsed = null; // keep null if parse fails
          }

          return {
            key,
            name: key.replace(searchPrefix, ""),
            size: getResp.ContentLength ?? null,
            lastModified: getResp.LastModified ?? null,
            content: parsed ?? bodyStr, // parsed object if possible, otherwise raw text
            parsed: parsed !== null,
          };
        } catch (err) {
          // Return error info per file but continue
          return {
            key,
            name: key.replace(searchPrefix, ""),
            error: String(err),
          };
        }
      })
    );

    return NextResponse.json({ files, prefix: searchPrefix });
  } catch (error) {
    console.error("match-files API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files", details: String(error) },
      { status: 500 }
    );
  }
}
