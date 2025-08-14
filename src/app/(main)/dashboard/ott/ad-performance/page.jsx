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

// Generate realistic ad placements based on platform characteristics
const generateRealisticAdPlacements = (selectedShows, selectedPlatform, realAdNames, platforms) => {
  const platform = platforms.find((p) => p.id === selectedPlatform)
  if (!platform?.hasAds) return []

  const placements = []
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const adCounts = {
    low: { min: 1, max: 2 },
    medium: { min: 2, max: 4 },
    high: { min: 4, max: 6 },
    "very-high": { min: 6, max: 10 },
  }

  const densityConfig = adCounts[platform.adDensity] || adCounts.medium

  selectedShows.forEach((show) => {
    days.forEach((day, dayIndex) => {
      const numAds = Math.floor(Math.random() * (densityConfig.max - densityConfig.min + 1)) + densityConfig.min

      for (let i = 0; i < numAds; i++) {
        const startTime = generateRandomTime()
        const adName = realAdNames[Math.floor(Math.random() * Math.min(8, realAdNames.length))]

        placements.push({
          id: `${show}-${day}-${i}`,
          show,
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

  return placements.sort((a, b) => a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime))
}

export default function OTTAdScheduler() {
  const [selectedWeek, setSelectedWeek] = useState(ottData.weeks[0]?.value || "")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedShows, setSelectedShows] = useState([])
  const [isAllAdsDialogOpen, setIsAllAdsDialogOpen] = useState(false)

  const availableGenres = selectedPlatform ? ottData.genres[selectedPlatform] || [] : []
  const availableShows = selectedPlatform && selectedGenre && ottData.weekSchedules[selectedWeek]
    ? ottData.weekSchedules[selectedWeek].shows[selectedPlatform]?.[selectedGenre] || []
    : []
  const currentPlatform = ottData.platforms.find((p) => p.id === selectedPlatform)

  const adPlacements = useMemo(() => {
    if (!ottData.weekSchedules[selectedWeek] || selectedShows.length === 0) return []
    return generateRealisticAdPlacements(
      selectedShows,
      selectedPlatform,
      ottData.weekSchedules[selectedWeek].realAdNames,
      ottData.platforms
    )
  }, [selectedShows, selectedPlatform, selectedWeek])

  const handleShowSelection = (show) => {
    setSelectedShows((prev) => (prev.includes(show) ? prev.filter((s) => s !== show) : [...prev, show]))
  }

  useMemo(() => {
    if (availableShows.length > 0) {
      setSelectedShows(availableShows)
    }
  }, [availableShows])

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
        {/* Enhanced Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Campaign Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="">
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
                  setSelectedGenre("")
                  setSelectedShows([])
                }}
              >
                <SelectTrigger className="">
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
              <CardTitle className="text-sm font-semibold">Content Genre</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedGenre} onValueChange={setSelectedGenre} disabled={!selectedPlatform}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {availableGenres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Active Shows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold">{selectedShows.length}</span>
                <span className="text-sm text-muted-foreground">selected</span>
              </div>
              {selectedShows.length > 0 && <p className="text-xs text-muted-foreground mt-1">All shows auto-selected</p>}
            </CardContent>
          </Card>
        </div>

        {/* Platform Status Alert */}
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

        {/* Shows Grid */}
        {availableShows.length > 0 && currentPlatform?.hasAds && (
          <Card className="border-gray-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-blue-600" />
                  Top {selectedGenre} Shows on {currentPlatform?.name}
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentPlatform.adDensity?.replace("-", " ")} ad density
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableShows.map((show) => (
                  <div
                    key={show}
                    className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedShows.includes(show)
                        ? "border-blue-500 shadow-md"
                        : "hover:shadow-sm"
                    }`}
                    onClick={() => handleShowSelection(show)}
                  >
                    <div className="aspect-[3/4] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={`/abstract-geometric-shapes.png?height=160&width=120&query=${encodeURIComponent(show + " show poster")}`}
                        alt={`${show} poster`}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center leading-tight">{show}</h3>
                    {selectedShows.includes(show) && (
                      <Badge className="w-full mt-2 bg-blue-600 hover:bg-blue-700 justify-center">✓ Active</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Gantt Chart */}
        {adPlacements.length > 0 && (
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
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Show</TableHead>
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
                                <TableCell>{placement.show}</TableCell>
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
                    <div className="text-sm font-semibold p-3">Show Title</div>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="text-sm font-semibold text-center p-3">
                        <div>{day.slice(0, 3)}</div>
                        <div className="text-xs text-muted-foreground mt-1">All Day</div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Gantt Chart Rows */}
                  {selectedShows.map((show) => {
                    const showPlacements = adPlacements.filter((p) => p.show === show)
                    const placementsByDay = showPlacements.reduce((acc, placement) => {
                      if (!acc[placement.dayIndex]) acc[placement.dayIndex] = []
                      acc[placement.dayIndex].push(placement)
                      return acc
                    }, {})

                    return (
                      <div key={show} className="grid grid-cols-8 gap-3 mb-4 items-start">
                        <div className="p-4 bg-card border rounded-lg shadow-sm">
                          <div className="text-sm font-semibold mb-1">{show}</div>
                          <div className="text-xs text-muted-foreground">{showPlacements.length} ad slots</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(showPlacements.reduce((sum, p) => sum + p.duration, 0) / 60)} min total
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
                                        Ad Placements for {show} on {dayPlacements[0]?.day}
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
                        <span className="font-medium capitalize">{currentPlatform?.adDensity?.replace("-", " ")}</span>
                      </div>
                      <div>
                        Total Duration:{" "}
                        <span className="font-medium">
                          {Math.round(adPlacements.reduce((sum, p) => sum + p.duration, 0) / 60)} minutes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Campaign Summary</h4>
                    <div className="text-sm text-gray-600">
                      <div>
                        Shows: <span className="font-medium">{selectedShows.length}</span>
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