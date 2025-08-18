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

// Utility to generate random time in HH:MM format
const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, "0")
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// Calculate ad density based on number of ads per show per day
const calculateAdDensity = (numAdsPerShowPerDay) => {
  if (numAdsPerShowPerDay === 0) return "false"
  if (numAdsPerShowPerDay <= 3) return "low"
  if (numAdsPerShowPerDay <= 6) return "medium"
  if (numAdsPerShowPerDay <= 9) return "high"
  return "very-high"
}

// Generate realistic ad placements based on platform characteristics
const generateRealisticAdPlacements = (selectedItems, selectedPlatform, week, platforms) => {
  const platform = platforms.find((p) => p.id === selectedPlatform)
  if (!platform?.hasAds) return { placements: [], adDensity: "false" }

  const platformAds = ottData.weekSchedules[week]?.platformAds?.[selectedPlatform] || []
  if (platformAds.length === 0) return { placements: [], adDensity: "false" }

  const placements = []
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Determine number of ads per item per day based on platform ad array length
  const totalAds = platformAds.length
  const numItems = selectedItems.length
  const numDays = days.length
  // Base number of ads per item per day, scaled by platform
  const baseAdsPerItemPerDay = {
    prime: 4, // Medium density: ~4 ads/day/item
    zee5: 6, // Medium-high density: ~6 ads/day/item
    hotstar: 8, // High density: ~8 ads/day/item
    mxplayer: 12 // Very-high density: ~12 ads/day/item
  }[selectedPlatform] || 4
  // Adjust based on available ads, cap at 15 for "very-high"
  const maxAdsPerItemPerDay = Math.min(Math.ceil(totalAds / (numItems * numDays)) + baseAdsPerItemPerDay, 15)
  
  // Calculate ad density
  const adDensity = calculateAdDensity(maxAdsPerItemPerDay)

  selectedItems.forEach((item) => {
    days.forEach((day, dayIndex) => {
      // Randomly assign 50-100% of maxAdsPerItemPerDay to create variation
      const numAds = Math.floor(Math.random() * (maxAdsPerItemPerDay / 2)) + Math.ceil(maxAdsPerItemPerDay / 2)

      for (let i = 0; i < numAds; i++) {
        const startTime = generateRandomTime()
        const adName = platformAds[Math.floor(Math.random() * platformAds.length)]

        placements.push({
          id: `${item}-${day}-${i}`,
          item,
          day,
          dayIndex,
          startTime,
          endTime: startTime,
          duration: [15, 30, 45][Math.floor(Math.random() * 3)],
          platform: selectedPlatform,
          adType: ["Pre-roll", "Mid-roll", "Post-roll"][Math.floor(Math.random() * 3)],
          adName,
          repetitionCount: Math.floor(Math.random() * 5) + 1,
        })
      }
    })
  })

  return { 
    placements: placements.sort((a, b) => a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime)), 
    adDensity 
  }
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
  const hasPlatformAds = selectedPlatform && ottData.weekSchedules[selectedWeek]?.platformAds?.[selectedPlatform]?.length > 0

  const { placements: adPlacements, adDensity } = useMemo(() => {
    if (!ottData.weekSchedules[selectedWeek] || selectedItems.length === 0) return { placements: [], adDensity: "false" }
    return generateRealisticAdPlacements(
      selectedItems,
      selectedPlatform,
      selectedWeek,
      ottData.platforms
    )
  }, [selectedItems, selectedPlatform, selectedWeek])

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
      {/* Header */}
      <header className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 " />
              </div>
              <div>
                <h1 className="text-2xl font-bold ">OTT Weekly Ad Performance</h1>
                <p className="text-sm text-muted-foreground">Plan and analyze ad placements across streaming platforms</p>
              </div>
            </div>
            <Button
              variant="outline"
              className=" transition-colors"
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-semibold  flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Campaign Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="border-gray-300 focus:ring-blue-500">
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

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-semibold ">Streaming Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPlatform}
                onValueChange={(value) => {
                  setSelectedPlatform(value)
                  setSelectedItems([])
                }}
              >
                <SelectTrigger className="border-gray-300 focus:ring-blue-500">
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {ottData.platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                        <span>{platform.name}</span>
                        {!platform.hasAds && (
                          <Badge variant="secondary" className="text-xs bg-gray-100">
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

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-semibold ">Content Type</CardTitle>
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
                <SelectTrigger className="border-gray-300 focus:ring-blue-500">
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

        {/* Empty State for No Selection */}
        {(!selectedPlatform || availableItems.length === 0 || selectedItems.length === 0) && (
          <Card className="border-gray-200 shadow-sm mb-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ad Placements Available</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Please select a platform, week, and content type to view ad placements, or choose a platform with available ads.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Platform Status Alert for Ad-Free Platforms */}
        {selectedPlatform && currentPlatform && !currentPlatform.hasAds && availableItems.length > 0 && (
          <Card className="border-orange-500/50 mb-8 shadow-sm">
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
        {availableItems.length > 0 && selectedItems.length > 0 && currentPlatform?.hasAds && (
          <Card className="border-gray-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-blue-600" />
                  Top {selectedContentType === "shows" ? "Shows" : "Movies"} on {currentPlatform?.name}
                </div>
                {adDensity !== "false" && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-600 capitalize">
                    {adDensity.replace("-", " ")} ad density
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableItems.map((item) => (
                  <div
                    key={item}
                    className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedItems.includes(item)
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:shadow-md"
                    }`}
                    onClick={() => handleItemSelection(item)}
                  >
                    <div className="aspect-[3/4] rounded-lg mb-3 overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt={`${item} poster`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center">{item}</h3>
                    {selectedItems.includes(item) && (
                      <Badge className="w-full mt-2 bg-blue-600 hover:bg-blue-700 justify-center">
                        ✓ Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer for No Ads in Platform */}
        {selectedPlatform && currentPlatform?.hasAds && availableItems.length > 0 && selectedItems.length > 0 && !hasPlatformAds && (
          <Card className="border-red-500/50 mb-8 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">No Ads Available</h3>
                  <p className="text-sm text-red-700">
                    Weekly Ad Placement Schedule cannot be presented as no ads are available for {currentPlatform.name} during the selected week.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gantt Chart */}
        {adPlacements.length > 0 && currentPlatform?.hasAds && hasPlatformAds && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center">
                  <Dialog open={isAllAdsDialogOpen} onOpenChange={setIsAllAdsDialogOpen}>
                    <DialogTrigger asChild>
                      <Clock className="h-5 w-5 mr-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>All Ad Placements for {currentPlatform?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 max-h-[60vh] overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{selectedContentType === "shows" ? "Show" : "Movie"}</TableHead>
                              <TableHead>Day</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Ad Name</TableHead>
                              <TableHead>Ad Type</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Repetition</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {adPlacements.map((placement) => (
                              <TableRow key={placement.id}>
                                <TableCell>{placement.item}</TableCell>
                                <TableCell>{placement.day}</TableCell>
                                <TableCell>{placement.startTime}</TableCell>
                                <TableCell>{placement.adName}</TableCell>
                                <TableCell>{placement.adType}</TableCell>
                                <TableCell>{placement.duration}s</TableCell>
                                <TableCell>{placement.repetitionCount}x</TableCell>
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
                  <span>Total Ads: <strong>{adPlacements.length}</strong></span>
                  <span>
                    Platform: <strong style={{ color: currentPlatform?.color }}>{currentPlatform?.name}</strong>
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Timeline Header */}
                  <div className="grid grid-cols-8 gap-3 mb-6 pb-3 border-b border-gray-200">
                    <div className="text-sm font-semibold  p-3">{selectedContentType === "shows" ? "Show" : "Movie"} Title</div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="text-sm font-semibold  text-center p-3">
                        <div>{day.slice(0, 3)}</div>
                        <div className="text-xs text-muted-foreground mt-1">All Day</div>
                      </div>
                    ))}
                  </div>

                  {/* Gantt Chart Rows */}
                  <div className="max-h-[60vh] overflow-auto">
                    {selectedItems.map((item) => {
                      const itemPlacements = adPlacements.filter((p) => p.item === item)
                      const placementsByDay = itemPlacements.reduce((acc, placement) => {
                        if (!acc[placement.dayIndex]) acc[placement.dayIndex] = []
                        acc[placement.dayIndex].push(placement)
                        return acc
                      }, {})

                      return (
                        <div key={item} className="grid grid-cols-8 gap-3 mb-4 items-start">
                          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="text-sm font-semibold text-gray-900 mb-1">{item}</div>
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
                                className="min-h-[80px] bg-gray-50 border border-gray-200 rounded-lg p-2"
                              >
                                {dayPlacements.length === 0 ? (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                    No ads
                                  </div>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="space-y-1 cursor-pointer">
                                        {dayPlacements.slice(0, 3).map((placement) => (
                                          <div
                                            key={placement.id}
                                            className="p-2 rounded-md text-xs text-white hover:opacity-90 transition-all duration-200 shadow-sm"
                                            style={{
                                              backgroundColor: currentPlatform?.color || "#3B82F6",
                                            }}
                                            title={`${placement.adName}\n${placement.adType} - ${placement.startTime}\nDuration: ${placement.duration}s\nRepeated: ${placement.repetitionCount}x this week`}
                                          >
                                            <div className="font-semibold">{placement.startTime}</div>
                                            <div className="text-xs opacity-90 truncate">
                                              {placement.adName?.split(" - ")[0]}
                                            </div>
                                            <div className="text-xs opacity-75">
                                              {placement.duration}s • {placement.adType}
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
                                              <TableHead>Time</TableHead>
                                              <TableHead>Ad Name</TableHead>
                                              <TableHead>Ad Type</TableHead>
                                              <TableHead>Duration</TableHead>
                                              <TableHead>Repetition</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {dayPlacements.map((placement) => (
                                              <TableRow key={placement.id}>
                                                <TableCell>{placement.startTime}</TableCell>
                                                <TableCell>{placement.adName}</TableCell>
                                                <TableCell>{placement.adType}</TableCell>
                                                <TableCell>{placement.duration}s</TableCell>
                                                <TableCell>{placement.repetitionCount}x</TableCell>
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

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Ad Placement Legend</h4>
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
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Platform Insights</h4>
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
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Campaign Summary</h4>
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
      </main>
    </div>
  )
}