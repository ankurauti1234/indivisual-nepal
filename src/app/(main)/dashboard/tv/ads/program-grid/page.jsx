import { promises as fs } from "fs"
import path from "path"
import ProgramGrid from "@/components/modules/program-grid/program-grid"
import { format } from "date-fns"

const channels = [
  { name: "N TV", type: "News Channel", logo: "/placeholder.svg" },
  { name: "Himalaya TV", type: "General Channel", logo: "/placeholder.svg" },
  { name: "Avenews TV", type: "News Channel", logo: "/placeholder.svg" },
]

export default async function ProgramGridPage() {
  const selectedDate = format(new Date(), "yyyy-MM-dd")
  const publicDir = path.join(process.cwd(), "public", "data")

  const initialData = await Promise.all(
    channels.map(async (channel) => {
      try {
        const filePath = path.join(publicDir, channel.name.toLowerCase().replace(" ", "-"), `${selectedDate}.json`)
        console.log(`Attempting to read file: ${filePath}`) // Debug log
        const fileContent = await fs.readFile(filePath, "utf-8")
        const data = JSON.parse(fileContent)
        console.log(`Data for ${channel.name}:`, data) // Debug log
        return data
      } catch (error) {
        console.error(`Error reading data for ${channel.name} on ${selectedDate}:`, error)
        return []
      }
    }),
  )

  return (
    <div className="">
      <ProgramGrid initialData={initialData} channels={channels} selectedDate={selectedDate} />
    </div>
  )
}
