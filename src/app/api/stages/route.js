// app/api/stages/route.js
import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const PREFIX_STAGES = process.env.AWS_S3_PREFIX_STAGES || ""; // e.g. "nepal_leauge_analystics/stages/"

export async function GET() {
  try {
    const basePrefix = PREFIX_STAGES.endsWith("/")
      ? PREFIX_STAGES
      : `${PREFIX_STAGES}/`;

    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: basePrefix,
      Delimiter: "/",
      MaxKeys: 1000,
    });

    const resp = await s3.send(cmd);

    const folders = (resp.CommonPrefixes || [])
      .map((cp) => cp.Prefix)
      .map((p) => p.slice(basePrefix.length).replace("/", ""))
      .filter(Boolean);

    return NextResponse.json({ stages: folders });
  } catch (err) {
    console.error("stages API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stages" },
      { status: 500 }
    );
  }
}
