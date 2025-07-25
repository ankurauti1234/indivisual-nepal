import { Suspense } from "react";
import OttProgramGrid from "@/components/modules/program-grid/ott-program-grid";
import { promises as fs } from "fs";
import path from "path";

// Fallback component for Suspense
function OttProgramGridFallback() {
  return <div>Loading OTT Program Grid...</div>;
}

export default async function OttProgramGridPage({ params }) {
  const publicDir = path.join(process.cwd(), "public", "data");
  const platformsFilePath = path.join(publicDir, "ott-platforms.json");

  let platforms = [];
  try {
    const fileContent = await fs.readFile(platformsFilePath, "utf-8");
    platforms = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading OTT platforms data:`, error);
  }

  // Access the dynamic route parameter, e.g., platformId
  const { platformId } = params || {};

  // Find the initial platform based on the platformId from params
  const initialPlatform = platforms.find(platform => platform.id === platformId) || platforms[0] || null;

  return (
    <div className="">
      <Suspense fallback={<OttProgramGridFallback />}>
        <OttProgramGrid platforms={platforms} initialPlatformId={initialPlatform?.id || ""} />
      </Suspense>
    </div>
  );
}