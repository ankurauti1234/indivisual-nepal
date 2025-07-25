import ProgramGrid from "@/components/modules/program-grid/program-grid"
import { format } from "date-fns"

const channels = [
  { name: "N TV", type: "News Channel", logo: "/logos/linear/ntv.png" },
  { name: "Himalaya TV", type: "General Channel", logo: "/logos/linear/himalaya.png" },
  { name: "Avenews TV", type: "News Channel", logo: "/logos/linear/avenues.jpg" },
]

// S3 configuration
const S3_BUCKET_URL = process.env.S3_BUCKET_URL || "https://radio-clips.s3.ap-south-1.amazonaws.com"

export default async function ProgramGridPage() {
  const selectedDate = format(new Date(), "yyyy-MM-dd")

  const initialData = await Promise.all(
    channels.map(async (channel) => {
      try {
        // Construct S3 URL - Fixed the double slash issue
        const channelName = channel.name.toLowerCase().replace(/\s+/g, "-")
        const s3Url = `${S3_BUCKET_URL}/linear/data/${channelName}/${selectedDate}.json`
        
        console.log(`Attempting to fetch from S3: ${s3Url}`) // Debug log
        
        const response = await fetch(s3Url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          // Add these options for better compatibility
          mode: 'cors',
          credentials: 'omit',
        })

        if (!response.ok) {
          // More detailed error logging
          console.error(`Fetch failed for ${channel.name}: ${response.status} ${response.statusText}`)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log(`Data for ${channel.name}:`, data) // Debug log
        return data
      } catch (error) {
        console.error(`Error fetching data for ${channel.name} on ${selectedDate}:`, error)
        
        // Try alternative URL structure if first one fails
        try {
          const channelName = channel.name.toLowerCase().replace(/\s+/g, "-")
          const alternativeUrl = `${S3_BUCKET_URL}/data/${channelName}/${selectedDate}.json`
          console.log(`Trying alternative URL: ${alternativeUrl}`)
          
          const altResponse = await fetch(alternativeUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'cors',
            credentials: 'omit',
          })
          
          if (altResponse.ok) {
            const altData = await altResponse.json()
            console.log(`Alternative URL worked for ${channel.name}:`, altData)
            return altData
          }
        } catch (altError) {
          console.error(`Alternative URL also failed for ${channel.name}:`, altError)
        }
        
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