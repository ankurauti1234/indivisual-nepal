"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, Play, AlertCircle, BarChart3 } from "lucide-react"
import ottData from "./ott-data.json"

// Utility to generate random time within working hours (10:00 AM to 6:00 AM next day)
const generateRandomTime = (contentDurationMinutes) => {
  const startHour = 10 // 10:00 AM
  const endHour = 30 // 6:00 AM next day (24 + 6)
  const maxStartMinutes = Math.min(contentDurationMinutes, (endHour - startHour) * 60)
  const randomMinutes = Math.floor(Math.random() * maxStartMinutes)
  const hours = Math.floor((startHour * 60 + randomMinutes) / 60) % 24
  const minutes = randomMinutes % 60
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

// Utility to add seconds to a time string (HH:MM:SS)
const addSecondsToTime = (timeStr, seconds) => {
  const [hours, minutes, secs] = timeStr.split(":").map(Number)
  let totalSeconds = hours * 3600 + minutes * 60 + secs + seconds
  const newHours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0")
  totalSeconds %= 3600
  const newMinutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0")
  const newSeconds = (totalSeconds % 60).toString().padStart(2, "0")
  return `${newHours}:${newMinutes}:${newSeconds}`
}

// Calculate ad density based on number of ads per item per day
const calculateAdDensity = (numAdsPerItemPerDay, contentType) => {
  const maxAds = contentType === "movies" ? 4 : 5
  if (numAdsPerItemPerDay === 0) return "false"
  if (numAdsPerItemPerDay <= Math.ceil(maxAds * 0.33)) return "low"
  if (numAdsPerItemPerDay <= Math.ceil(maxAds * 0.66)) return "medium"
  return "high"
}

// Generate deterministic ad placements with random times
const generateAdPlacements = (selectedItems, selectedPlatform, week, contentType, platforms) => {
  const platform = platforms.find((p) => p.id === selectedPlatform)
  if (!platform?.hasAds) return { placements: [], adDensity: "false" }

  const platformAds = ottData.weekSchedules[week]?.platformAds?.[selectedPlatform] || []
  if (platformAds.length === 0) return { placements: [], adDensity: "false" }

  const placements = []
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const adDurations = [15, 21, 27, 33, 41] // Uneven durations up to 45 seconds
  const maxAdsPerDay = contentType === "movies" ? 4 : 5
  const minAdsPerDay = 1

  selectedItems.forEach((item, itemIndex) => {
    // Define content duration
    const contentDurationMinutes = contentType === "movies"
      ? 150 + Math.floor(itemIndex % 4) * 25 // 150, 175, 200, or 225 minutes
      : 180 + Math.floor(itemIndex % 4) * 45 // 180, 225, 270, or 315 minutes (up to 6 hours)

    days.forEach((day, dayIndex) => {
      // Determine number of ads for this item on this day
      const numAds = Math.min(
        minAdsPerDay + Math.floor((itemIndex + dayIndex) % (maxAdsPerDay - minAdsPerDay + 1)),
        platformAds.length
      )

      // Generate unique random start times within content duration
      const usedTimes = new Set()
      for (let i = 0; i < numAds; i++) {
        let startTime
        do {
          startTime = generateRandomTime(contentDurationMinutes)
        } while (usedTimes.has(startTime))
        usedTimes.add(startTime)

        const adIndex = (itemIndex + dayIndex + i) % platformAds.length
        const ad = platformAds[adIndex]
        const adDuration = ad.duration || adDurations[(itemIndex + i) % adDurations.length]
        const endTime = addSecondsToTime(startTime, adDuration)

        placements.push({
          id: `${item}-${day}-${i}`,
          item,
          day,
          dayIndex,
          startTime,
          endTime,
          duration: adDuration,
          platform: selectedPlatform,
          adName: ad.name,
        })
      }
    })
  })

  return { 
    placements: placements.sort((a, b) => a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime)), 
    adDensity: calculateAdDensity(
      Math.max(...selectedItems.map((_, i) => 
        Math.min(minAdsPerDay + Math.floor((i + 0) % (maxAdsPerDay - minAdsPerDay + 1)), platformAds.length)
      )), contentType)
  }
}

// Helper function to get the correct image path
const getPosterImagePath = (platformId, contentType, item) => {
  const contentFolder = contentType === "movies" ? "Movies" : "Shows"
  // Normalize item name to match file names (remove or adjust extra details)
  let normalizedItem = item
    .replace(/: Season \d+/i, "") // Remove ": Season X"
    .replace(/\(.*?\)/g, "") // Remove years in parentheses, e.g., "(2020)"
    .replace(/ - .*$/, "") // Remove extra details after " - "
    .replace(/SummerSlam: 2025 - SummerSlam 2025 Sunday/i, "Summer Slam 2025") // Special case for SummerSlam
    .replace(/Raw: 2025 - August 4, 2025/i, "RAW") // Special case for RAW
    .trim()

  // Map normalized item names to file names (based on provided directory)
  const imageMap = {
    netflix: {
      Movies: {
        "Aap Jaisa Koi": "Aap Jaisa Koi (2025).jpg",
        "Happy Gilmore 2": "Happy Gilmore 2 (2025).png",
        Jaat: "Jaat (2025).png",
        "KPop Demon Hunters": "KPop Demon Hunters (2025).png",
        "Money Heist": "Money Heist.jpeg",
        "My Oxford Year": "My Oxford Year (2025).jpg",
        "Raid 2": "Raid 2 (2025).jpg",
        Thammudu: "Thammudu (2005).jpeg",
        "Thug Life": "Thug Life (2025).png",
        "Until Dawn": "Until Dawn (2025).jpg",
      },
      Shows: {
        "Beyond the Bar": "Beyond the bar.jpeg",
        "Mandala Murders": "Mandala Murders.jpeg",
        RAW: "RAW.jpeg",
        "Squid Game": "Squid Game 3.jpeg",
        "WWE SummerSlam": "Summer Slam 2025.jpeg",
        "The Great Indian Kapil Show": "The Great Indian Kapil Show (2024).jpg",
        "Unspeakable Sins": "Unspeakable Sins.jpeg",
        UNTAMED: "Untamed.jpeg",
        Wednesday: "Wednesday (2022) - Season 1.png", // Default to Season 1; adjust below for Season 2
      },
    },
    prime: {
      Movies: {
        "3BHK": "3BHK.jpg",
        "Aap Jaisa Koi": "Aap Jaisa Koi (2025).jpg",
        "Housefull 5": "Housefull 5 (2025).jpg",
        Kuberaa: "Kuberaa (2025).jpg",
        Maargan: "Maargan.jpeg",
        "My Oxford Year": "My Oxford Year (2025).jpg",
        "Oh Bhama Ayyo Rama": "Oh Bhama Ayyo Rama.jpeg",
        "Raid 2": "Raid 2 (2025).jpg",
        "Show Time": "Show Time.jpeg",
        Thammudu: "Thammudu (2005).jpeg",
      },
      Shows: {
        Ballard: "Ballard (2025).jpg",
        Countdown: "Countdown (2025).jpg",
        "Dope Girls": "Dope Girls (2025).png",
        "Heads of State": "Heads of State (2025).jpg",
        Mirzapur: "Mirzapur (2018).png",
        Panchayat: "Panchayat (2020) - Season 4.jpg",
        Rangeen: "Rangeen (2025).jpg",
        "The Family Man": "The Family Man (2019).jpg",
        "The Summer I Turned Pretty": "The Summer I Turned Pretty (2022).jpg",
        "The Traitors": "The Traitors.jpeg",
      },
    },
    zee5: {
      Movies: {
        Despatch: "Despatch (2024).jpg",
        Farrey: "Farrey.jpeg",
        "Gadar 2": "Gadar 2 (2023).png",
        Ghoomer: "Ghoomer (2023).jpg",
        Logout: "Logout.jpeg",
        "Main Atal Hoon": "Main Atal Hoon (2024).jpg",
        "Sam Bahadur": "Sam Bahadur (2023).jpg",
        "The Kerala Story": "The Kerala Story.jpeg",
        Vanvaas: "Vanvaas (2024).jpg",
        Vedaa: "Vedaa (2024).jpg",
      },
      Shows: {
        Abhay: "Abhay.jpeg",
        "Bicchoo Ka Khel": "Bicchoo ka khel.jpeg",
        "Jamai 2.0": "Jamai 2.0.jpeg",
        "Jeet Ki Zid": "Jeet Ki Zid.jpeg",
        Kaafir: "Kaafir (2019) - Season 1.jpg",
        Khoj: "Khoj.jpeg",
        "Pyaar Testing": "Pyaar Testing.jpeg",
        "Qubool Hai 2.0": "Qubool Hai 2.0.jpeg",
        "State of Siege": "State of siege.jpeg",
        "The Broken News": "The Broken News (2022).jpg",
      },
    },
  }

  // Special handling for shows with multiple seasons
  if (platformId === "netflix" && contentType === "shows" && item.includes("Wednesday: Season 2")) {
    return "/posters/netflix/Shows/Wednesday (2022) - Season 2.png"
  }

  const fileName = imageMap[platformId]?.[contentFolder]?.[normalizedItem]
  return fileName ? `/posters/${platformId}/${contentFolder}/${fileName}` : "/placeholder.svg"
}

export default function OTTAdScheduler() {
  const [selectedWeek, setSelectedWeek] = useState(ottData.weeks[0]?.value || "")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedContentType, setSelectedContentType] = useState("shows")
  const [selectedItems, setSelectedItems] = useState([])
  const [isAllAdsDialogOpen, setIsAllAdsDialogOpen] = useState(false)

  const availableItems = selectedPlatform && ottData.weekSchedules[selectedWeek]
    ? ottData.weekSchedules[selectedWeek][selectedContentType][selectedPlatform] || []
    : []
  const currentPlatform = ottData.platforms.find((p) => p.id === selectedPlatform)

  const { placements: adPlacements, adDensity } = useMemo(() => {
    if (!ottData.weekSchedules[selectedWeek] || selectedItems.length === 0) return { placements: [], adDensity: "false" }
    return generateAdPlacements(
      selectedItems,
      selectedPlatform,
      selectedWeek,
      selectedContentType,
      ottData.platforms
    )
  }, [selectedItems, selectedPlatform, selectedWeek, selectedContentType])

  const handleItemSelection = (item) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]))
  }

  useMemo(() => {
    if (availableItems.length > 0) {
      setSelectedItems(availableItems)
    }
  }, [availableItems])

  return (
    <div className="min-h-screen">
      {/* Professional Header */}
      <div className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">OTT Ad Scheduling Dashboard</h1>
                  <p className="text-sm text-gray-600">
                    Comprehensive ad placement analytics across streaming platforms
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => {
                  const url = "https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/HOR-report.csv";
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "HOR-report.csv";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Campaign Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign week" />
                </SelectTrigger>
                <SelectContent>
                  {ottData.weeks.map((week) => (
                    <SelectItem key={week.value} value={week.value}>
                      {week.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Streaming Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPlatform}
                onValueChange={(value) => {
                  setSelectedPlatform(value)
                  setSelectedItems([])
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {ottData.platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                        <span>{platform.name}</span>
                        {!platform.hasAds && (
                          <Badge variant="secondary" className="text-xs">
                            Ad-Free
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedContentType}
                onValueChange={(value) => {
                  setSelectedContentType(value)
                  setSelectedItems([])
                }}
                disabled={!selectedPlatform}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shows">Shows</SelectItem>
                  <SelectItem value="movies">Movies</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Platform Status Alert for Ad-Free Platforms */}
        {currentPlatform && !currentPlatform.hasAds && (
          <Card className="border-orange-500/50 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">No Ad Inventory Available</h3>
                  <p className="text-sm text-orange-700">
                    {currentPlatform.name} operates on a subscription-only model without advertising placements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        {availableItems.length > 0 && (
          <Card className="border-gray-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-blue-600" />
                  Top {selectedContentType === "shows" ? "Shows" : "Movies"} on {currentPlatform?.name}
                </div>
                {adDensity !== "false" && (
                  <Badge variant="outline" className="text-xs">
                    {adDensity.replace("-", " ")} ad density
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableItems.map((item) => (
                  <div
                    key={item}
                    className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedItems.includes(item)
                        ? "border-blue-500 shadow-md"
                        : "hover:shadow-sm"
                    }`}
                    onClick={() => handleItemSelection(item)}
                  >
                    <div className="aspect-[3/4] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={getPosterImagePath(selectedPlatform, selectedContentType, item)}
                        alt={`${item} poster`}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center leading-tight">{item}</h3>
                    {selectedItems.includes(item) && (
                      <Badge className="w-full mt-2 bg-blue-600 hover:bg-blue-700 justify-center">✓ Active</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Gantt Chart */}
        {adPlacements.length > 0 && currentPlatform?.hasAds && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Dialog open={isAllAdsDialogOpen} onOpenChange={setIsAllAdsDialogOpen}>
                    <DialogTrigger asChild>
                      <Clock className="h-5 w-5 mr-2 text-blue-600 cursor-pointer hover:text-blue-800" />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>All Ad Placements for {currentPlatform?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 h-[75vh] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{selectedContentType === "shows" ? "Show" : "Movie"}</TableHead>
                              <TableHead>Day</TableHead>
                              <TableHead>Start Time</TableHead>
                              <TableHead>End Time</TableHead>
                              <TableHead>Ad Name</TableHead>
                              <TableHead>Duration</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {adPlacements.map((placement) => (
                              <TableRow key={placement.id}>
                                <TableCell>{placement.item}</TableCell>
                                <TableCell>{placement.day}</TableCell>
                                <TableCell>{placement.startTime}</TableCell>
                                <TableCell>{placement.endTime}</TableCell>
                                <TableCell>{placement.adName}</TableCell>
                                <TableCell>{placement.duration}s</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                  Weekly Ad Placement Schedule
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>
                    Total Ads: <strong>{adPlacements.length}</strong>
                  </span>
                  <span>
                    Platform: <strong style={{ color: currentPlatform?.color }}>{currentPlatform?.name}</strong>
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Enhanced Timeline Header */}
                  <div className="grid grid-cols-8 gap-3 mb-6 pb-3 border-b">
                    <div className="text-sm font-semibold p-3">{selectedContentType === "shows" ? "Show" : "Movie"} Title</div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="text-sm font-semibold text-center p-3">
                        <div>{day.slice(0, 3)}</div>
                        <div className="text-xs text-muted-foreground mt-1">All Day</div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Gantt Chart Rows */}
                  <div className="h-[80vh] overflow-auto">
                    {selectedItems.map((item) => {
                      const itemPlacements = adPlacements.filter((p) => p.item === item)
                      const placementsByDay = itemPlacements.reduce((acc, placement) => {
                        if (!acc[placement.dayIndex]) acc[placement.dayIndex] = []
                        acc[placement.dayIndex].push(placement)
                        return acc
                      }, {})

                      return (
                        <div key={item} className="grid grid-cols-8 gap-3 mb-4 items-start">
                          <div className="p-4 bg-card border rounded-lg shadow-sm">
                            <div className="text-sm font-semibold mb-1">{item}</div>
                            <div className="text-xs text-muted-foreground">{itemPlacements.length} ad slots</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {Math.round(itemPlacements.reduce((sum, p) => sum + p.duration, 0) / 60)} min total
                            </div>
                          </div>

                          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                            const dayPlacements = placementsByDay[dayIndex] || []
                            return (
                              <div
                                key={dayIndex}
                                className="min-h-[80px] bg-popover border rounded-lg p-2 relative"
                              >
                                {dayPlacements.length === 0 ? (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                    No ads
                                  </div>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="space-y-1 cursor-pointer">
                                        {dayPlacements.slice(0, 3).map((placement, index) => (
                                          <div
                                            key={placement.id}
                                            className="p-2 rounded-md text-xs text-white hover:opacity-90 transition-all duration-200 shadow-sm"
                                            style={{
                                              backgroundColor: currentPlatform?.color || "#3B82F6",
                                            }}
                                            title={`${placement.adName}\n${placement.startTime} to ${placement.endTime}\nDuration: ${placement.duration}s`}
                                          >
                                            <div className="font-semibold">{placement.startTime}</div>
                                            <div className="text-xs opacity-90 truncate">
                                              {placement.adName?.split(" - ")[0]}
                                            </div>
                                            <div className="text-xs opacity-75">
                                              {placement.duration}s
                                            </div>
                                          </div>
                                        ))}
                                        {dayPlacements.length > 3 && (
                                          <div className="text-xs text-muted-foreground text-center py-1">
                                            +{dayPlacements.length - 3} more
                                          </div>
                                        )}
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Ad Placements for {item} on {dayPlacements[0]?.day}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Start Time</TableHead>
                                              <TableHead>End Time</TableHead>
                                              <TableHead>Ad Name</TableHead>
                                              <TableHead>Duration</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {dayPlacements.map((placement) => (
                                              <TableRow key={placement.id}>
                                                <TableCell>{placement.startTime}</TableCell>
                                                <TableCell>{placement.endTime}</TableCell>
                                                <TableCell>{placement.adName}</TableCell>
                                                <TableCell>{placement.duration}s</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Ad Placement Legend</h4>
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: currentPlatform?.color || "#3B82F6" }}
                      />
                      <span className="text-sm text-gray-600">Active Ad Slot</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Click slot for day-specific ad details</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Platform Insights</h4>
                    <div className="text-sm text-gray-600">
                      <div>
                        Ad Density:{" "}
                        <span className="font-medium capitalize">{adDensity.replace("-", " ")}</span>
                      </div>
                      <div>
                        Total Duration:{" "}
                        <span className="font-medium">
                          {Math.round(adPlacements.reduce((sum, p) => sum + p.duration, 0) / 60) || 0} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Campaign Summary</h4>
                    <div className="text-sm text-gray-600">
                      <div>
                        {selectedContentType === "shows" ? "Shows" : "Movies"}: <span className="font-medium">{selectedItems.length}</span>
                      </div>
                      <div>
                        Total Slots: <span className="font-medium">{adPlacements.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}