import OttProgramGrid from "@/components/modules/program-grid/ott-program-grid"
import { promises as fs } from "fs"
import path from "path"


export default async function OttProgramGridPage() {
  const publicDir = path.join(process.cwd(), "public", "data")
  const platformsFilePath = path.join(publicDir, "ott-platforms.json")

  let platforms = []
  try {
    const fileContent = await fs.readFile(platformsFilePath, "utf-8")
    platforms = JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error reading OTT platforms data:`, error)
  }

  // Determine initial platform selection
  const initialPlatform = platforms[0] || null

  return (
    <div className="">
      <OttProgramGrid platforms={platforms} initialPlatformId={initialPlatform?.id || ""} />
    </div>
  )
}
