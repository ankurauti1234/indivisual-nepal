"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Play, AlertCircle, BarChart3 } from "lucide-react";
import ottData from "./ott-data.json";
import primeData from "./prime.json";
import zee5Data from "./zee5.json";
import netflixData from "./netflix.json";
import primeMoviesData from "./prime-movies.json";
import zee5MoviesData from "./zee5-movies.json";

// Utility to parse duration string to seconds
function parseDuration(dur) {
  const [h, m, s] = dur.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

// Calculate ad density based on number of ads per item per day
const calculateAdDensity = (numAdsPerItemPerDay, contentType) => {
  const maxAds = contentType === "movies" ? 4 : 5;
  if (numAdsPerItemPerDay === 0) return "false";
  if (numAdsPerItemPerDay <= Math.ceil(maxAds * 0.33)) return "low";
  if (numAdsPerItemPerDay <= Math.ceil(maxAds * 0.66)) return "medium";
  return "high";
};

function CustomRadioGroup({ value, onValueChange, options }) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={() => onValueChange(option.value)}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}

export default function OTTAdScheduler() {
  const [selectedWeek, setSelectedWeek] = useState(
    ottData.weeks[0]?.value || ""
  );
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedContentType, setSelectedContentType] = useState("shows");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllAdsDialogOpen, setIsAllAdsDialogOpen] = useState(false);
  const [selectedExportWeek, setSelectedExportWeek] = useState("");
  const [exportPlatform, setExportPlatform] = useState("");

  const availableItems =
    selectedPlatform && ottData.weekSchedules[selectedWeek]
      ? ottData.weekSchedules[selectedWeek][selectedContentType][
          selectedPlatform
        ] || []
      : [];
  const currentPlatform = ottData.platforms.find(
    (p) => p.id === selectedPlatform
  );

  // Map platform and content type to the appropriate JSON data
  const platformData = {
    prime: {
      shows: primeData,
      movies: primeMoviesData,
    },
    zee5: {
      shows: zee5Data,
      movies: zee5MoviesData,
    },
    netflix: {
      shows: netflixData,
      movies: netflixData,
    },
  };

  const { placements: adPlacements, adDensity } = useMemo(() => {
    if (!ottData.weekSchedules[selectedWeek] || selectedItems.length === 0) {
      return { placements: [], adDensity: "false" };
    }

    const data = platformData[selectedPlatform]?.[selectedContentType] || [];
    if (!currentPlatform?.hasAds || data.length === 0) {
      return { placements: [], adDensity: "false" };
    }

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const dayAds = {};
    data.forEach((ad) => {
      const day = ad.Day;
      if (!dayAds[day]) dayAds[day] = [];
      dayAds[day].push(ad);
    });

    const placements = [];
    Object.keys(dayAds).forEach((day) => {
      const ads = dayAds[day];
      const dayIndex = days.indexOf(day);
      if (dayIndex === -1) return;

      ads.forEach((ad, index) => {
        const itemIndex = index % selectedItems.length;
        const item = selectedItems[itemIndex].name;
        const duration = parseDuration(ad.Duration);

        placements.push({
          id: ad.unique_id,
          item,
          day,
          dayIndex,
          startTime: ad.Begin,
          endTime: ad.End,
          duration,
          platform: selectedPlatform,
          adName: ad.Title,
        });
      });
    });

    placements.sort(
      (a, b) =>
        a.dayIndex - b.dayIndex || a.startTime.localeCompare(b.startTime)
    );

    const counts = {};
    placements.forEach((p) => {
      const key = `${p.item}-${p.dayIndex}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    const maxAds = Math.max(...Object.values(counts), 0);

    return {
      placements,
      adDensity: calculateAdDensity(maxAds, selectedContentType),
    };
  }, [
    selectedItems,
    selectedPlatform,
    selectedWeek,
    selectedContentType,
    currentPlatform,
  ]);

  const handleItemSelection = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.name === item.name);
      return isSelected
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item];
    });
  };

  useMemo(() => {
    if (availableItems.length > 0) {
      setSelectedItems(availableItems);
    }
  }, [availableItems]);

  const weekOptions = ottData.weeks.map((week) => ({
    value: week.value,
    label: week.label,
  }));

  const platformOptions = ottData.platforms.map((platform) => ({
    value: platform.id,
    label: platform.name,
  }));

  const handleDownload = () => {
    if (selectedExportWeek && exportPlatform) {
      const url = `https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/ott/${exportPlatform}.csv`;
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportPlatform}-report-${selectedExportWeek}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Professional Header */}
      <div className="border-b shadow-sm bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    OTT Ad Scheduling Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Comprehensive ad placement analytics across streaming platforms
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="transition-colors hover:bg-blue-50 dark:hover:bg-gray-700"
                  >
                    Export Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Export Weekly Report
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Export ad placement reports for a selected week and platform.
                    </p>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Select Platform
                      </Label>
                      <Select
                        onValueChange={setExportPlatform}
                        value={exportPlatform}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900 dark:text-white">
                        Select Week
                      </Label>
                      <Select
                        onValueChange={setSelectedExportWeek}
                        value={selectedExportWeek}
                      >
                        <SelectTrigger className="bg-white dark:bg-gray-700">
                          <SelectValue placeholder="Select a week" />
                        </SelectTrigger>
                        <SelectContent>
                          {weekOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleDownload}
                      disabled={!selectedExportWeek || !exportPlatform}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      Download Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Campaign Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="bg-white dark:bg-gray-700">
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

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Streaming Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedPlatform}
                onValueChange={(value) => {
                  setSelectedPlatform(value);
                  setSelectedItems([]);
                }}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700">
                  <SelectValue placeholder="Choose platform" />
                </SelectTrigger>
                <SelectContent>
                  {ottData.platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: platform.color }}
                        />
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

          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Content Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedContentType}
                onValueChange={(value) => {
                  setSelectedContentType(value);
                  setSelectedItems([]);
                }}
                disabled={!selectedPlatform}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700">
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
          <Card className="border-orange-500/50 mb-8 bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-400">
                    No Ad Inventory Available
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {currentPlatform.name} operates on a subscription-only model
                    without advertising placements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items Grid */}
        {availableItems.length > 0 && (
          <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <Play className="h-5 w-5 mr-2 text-blue-600" />
                  Top {selectedContentType === "shows"
                    ? "Shows"
                    : "Movies"} on {currentPlatform?.name}
                </div>
                {adDensity !== "false" && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {adDensity.replace("-", " ")} Ad Density
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {availableItems.map((item) => (
                  <div
                    key={item.name}
                    className={`group p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedItems.some((i) => i.name === item.name)
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 dark:border-gray-600 hover:shadow-lg"
                    }`}
                    onClick={() => handleItemSelection(item)}
                  >
                    <div className="aspect-[3/4] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={`${item.name} poster`}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center leading-tight text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    {selectedItems.some((i) => i.name === item.name) && (
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

        {/* Enhanced Gantt Chart */}
        {adPlacements.length > 0 && currentPlatform?.hasAds && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center justify-between text-gray-900 dark:text-white">
                <div className="flex items-center">
                  <Dialog
                    open={isAllAdsDialogOpen}
                    onOpenChange={setIsAllAdsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Clock className="h-5 w-5 mr-2 text-blue-600 cursor-pointer hover:text-blue-800 transition-colors" />
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                          All Ad Placements for {currentPlatform?.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-gray-900 dark:text-white">
                                {selectedContentType === "shows"
                                  ? "Show"
                                  : "Movie"}
                              </TableHead>
                              <TableHead className="text-gray-900 dark:text-white">Day</TableHead>
                              <TableHead className="text-gray-900 dark:text-white">Start Time</TableHead>
                              <TableHead className="text-gray-900 dark:text-white">End Time</TableHead>
                              <TableHead className="text-gray-900 dark:text-white">Ad Name</TableHead>
                              <TableHead className="text-gray-900 dark:text-white">Duration</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {adPlacements.map((placement) => (
                              <TableRow key={placement.id}>
                                <TableCell className="text-gray-900 dark:text-white">{placement.item}</TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{placement.day}</TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{placement.startTime}</TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{placement.endTime}</TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{placement.adName}</TableCell>
                                <TableCell className="text-gray-900 dark:text-white">{placement.duration}s</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                  Weekly Ad Placement Schedule
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    Total Ads: <strong>{adPlacements.length}</strong>
                  </span>
                  <span>
                    Platform:{" "}
                    <strong style={{ color: currentPlatform?.color }}>
                      {currentPlatform?.name}
                    </strong>
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Enhanced Timeline Header */}
                  <div className="grid grid-cols-8 gap-3 mb-6 pb-3 border-b border-gray-200 dark:border-gray-600">
                    <div className="text-sm font-semibold p-3 text-gray-900 dark:text-white">
                      {selectedContentType === "shows" ? "Show" : "Movie"} Title
                    </div>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <div
                        key={day}
                        className="text-sm font-semibold text-center p-3 text-gray-900 dark:text-white"
                      >
                        <div>{day.slice(0, 3)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          All Day
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced Gantt Chart Rows */}
                  <div className="max-h-[80vh] overflow-auto">
                    {selectedItems.map((item) => {
                      const itemPlacements = adPlacements.filter(
                        (p) => p.item === item.name
                      );
                      const placementsByDay = itemPlacements.reduce(
                        (acc, placement) => {
                          if (!acc[placement.dayIndex])
                            acc[placement.dayIndex] = [];
                          acc[placement.dayIndex].push(placement);
                          return acc;
                        },
                        {}
                      );

                      return (
                        <div
                          key={item.name}
                          className="grid grid-cols-8 gap-3 mb-4 items-start"
                        >
                          <div className="p-4 bg-white dark:bg-gray-700 border rounded-lg shadow-sm">
                            <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {itemPlacements.length} ad slots
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {Math.round(
                                itemPlacements.reduce(
                                  (sum, p) => sum + p.duration,
                                  0
                                ) / 60
                              )}{" "}
                              min total
                            </div>
                          </div>

                          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                            const dayPlacements =
                              placementsByDay[dayIndex] || [];
                            return (
                              <div
                                key={dayIndex}
                                className="min-h-[80px] bg-gray-50 dark:bg-gray-700 border rounded-lg p-2 relative"
                              >
                                {dayPlacements.length === 0 ? (
                                  <div className="flex items-center justify-center h-full text-xs text-gray-400 dark:text-gray-500">
                                    No ads
                                  </div>
                                ) : (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div className="space-y-1 cursor-pointer">
                                        {dayPlacements
                                          .slice(0, 3)
                                          .map((placement, index) => (
                                            <div
                                              key={placement.id}
                                              className="p-2 rounded-md text-xs text-white hover:opacity-90 transition-all duration-200 shadow-sm"
                                              style={{
                                                backgroundColor:
                                                  currentPlatform?.color ||
                                                  "#3B82F6",
                                              }}
                                              title={`${placement.adName}\n${placement.startTime} to ${placement.endTime}\nDuration: ${placement.duration}s`}
                                            >
                                              <div className="font-semibold">
                                                {placement.startTime}
                                              </div>
                                              <div className="text-xs opacity-90 truncate">
                                                {
                                                  placement.adName?.split(
                                                    " - "
                                                  )[0]
                                                }
                                              </div>
                                              <div className="text-xs opacity-75">
                                                {placement.duration}s
                                              </div>
                                            </div>
                                          ))}
                                        {dayPlacements.length > 3 && (
                                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                                            +{dayPlacements.length - 3} more
                                          </div>
                                        )}
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl bg-white dark:bg-gray-800">
                                      <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                          Ad Placements for {item.name} on{" "}
                                          {dayPlacements[0]?.day}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead className="text-gray-900 dark:text-white">Start Time</TableHead>
                                              <TableHead className="text-gray-900 dark:text-white">End Time</TableHead>
                                              <TableHead className="text-gray-900 dark:text-white">Ad Name</TableHead>
                                              <TableHead className="text-gray-900 dark:text-white">Duration</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {dayPlacements.map((placement) => (
                                              <TableRow key={placement.id}>
                                                <TableCell className="text-gray-900 dark:text-white">{placement.startTime}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-white">{placement.endTime}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-white">{placement.adName}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-white">{placement.duration}s</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Ad Placement Legend
                    </h4>
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: currentPlatform?.color || "#3B82F6",
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Active Ad Slot
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Click slot for day-specific ad details
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Platform Insights
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        Ad Density:{" "}
                        <span className="font-medium capitalize">
                          {adDensity.replace("-", " ")}
                        </span>
                      </div>
                      <div>
                        Total Duration:{" "}
                        <span className="font-medium">
                          {Math.round(
                            adPlacements.reduce(
                              (sum, p) => sum + p.duration,
                              0
                            ) / 60
                          ) || 0}{" "}
                          minutes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
                      Campaign Summary
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <div>
                        {selectedContentType === "shows" ? "Shows" : "Movies"}:{" "}
                        <span className="font-medium">
                          {selectedItems.length}
                        </span>
                      </div>
                      <div>
                        Total Slots:{" "}
                        <span className="font-medium">
                          {adPlacements.length}
                        </span>
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
  );
}