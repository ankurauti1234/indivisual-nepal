// app/api/stage-manifests/route.js
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
const PREFIX_STAGES = process.env.AWS_S3_PREFIX_STAGES || "";

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
    const stage = url.searchParams.get("stage");
    if (!stage) {
      return NextResponse.json(
        { error: "Missing stage param" },
        { status: 400 }
      );
    }

    const basePrefix = PREFIX_STAGES.endsWith("/")
      ? PREFIX_STAGES
      : `${PREFIX_STAGES}/`;
    const stagePrefix = `${basePrefix}${stage}/`;

    // list json files under stage (including nested folders)
    const listCmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: stagePrefix,
      MaxKeys: 1000,
    });

    const listResp = await s3.send(listCmd);
    const jsonKeys = (listResp.Contents || [])
      .map((o) => o.Key)
      .filter(Boolean)
      .filter((k) => k.toLowerCase().endsWith(".json"));

    // fetch each json and extract matchId(s)
    const allMatchIds = new Set();

    await Promise.all(
      jsonKeys.map(async (key) => {
        try {
          const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
          const getResp = await s3.send(getCmd);
          const content = await streamToString(getResp.Body);
          let parsed;
          try {
            parsed = JSON.parse(content);
          } catch (e) {
            parsed = null;
          }

          // helper to extract matchId(s) from parsed data (various shapes)
          const extract = (obj) => {
            if (!obj) return [];
            // If array wrapper: e.g. [ { "matchId": [...] }, ... ]
            if (Array.isArray(obj)) {
              return obj.flatMap((el) => extract(el));
            }
            // If object with matchId key
            if (typeof obj === "object") {
              if (obj.matchId !== undefined) {
                const v = obj.matchId;
                if (Array.isArray(v)) return v;
                if (typeof v === "string") return [v];
              }
              // handle if the top-level object is actually an array (rare)
              // also try scanning keys for arrays/strings named like matchId
              const results = [];
              Object.values(obj).forEach((val) => {
                if (Array.isArray(val)) {
                  val.forEach((x) => {
                    if (typeof x === "string") results.push(x);
                    if (typeof x === "object" && x.matchId) {
                      if (Array.isArray(x.matchId)) results.push(...x.matchId);
                      else if (typeof x.matchId === "string")
                        results.push(x.matchId);
                    }
                  });
                } else if (typeof val === "string" && val.match(/match/i)) {
                  // if a simple string that looks like a match id
                  results.push(val);
                }
              });
              return results;
            }
            // fallback: if it's a string and seems like a matchId
            if (typeof obj === "string" && obj.match(/match/i)) return [obj];
            return [];
          };

          const found = extract(parsed);
          found.forEach((m) => allMatchIds.add(m));
        } catch (err) {
          console.warn("error reading manifest file", key, err);
        }
      })
    );

    return NextResponse.json({ matchIds: Array.from(allMatchIds) });
  } catch (err) {
    console.error("stage-manifests API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stage manifests" },
      { status: 500 }
    );
  }
}
