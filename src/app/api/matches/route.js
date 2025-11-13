import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { log } from "console";

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const PREFIX = process.env.AWS_S3_PREFIX;


export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
      Delimiter: "/",
    });

    console.log(PREFIX);
    
    const response = await s3.send(command);

    // Extract folder names from CommonPrefixes
    const folders = (response.CommonPrefixes || [])
      .map((cp) => cp.Prefix)
      .map((prefix) => prefix.slice(PREFIX.length).replace("/", ""))
      .filter(Boolean);
    console.log(folders)
    return NextResponse.json(folders);
  } catch (error) {
    console.error("S3 Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch match folders" },
      { status: 500 }
    );
  }
}
