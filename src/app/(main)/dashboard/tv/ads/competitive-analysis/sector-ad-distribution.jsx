"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for sector ad distribution by TV channel
const sampleData = {
  weeks: [
    {
      week: "Week 1",
      data: [
        {
          sector: "Construction",
          stations: [
            { station: "Nepal Television", adCount: 50, airtime: 1200 },
            { station: "Kantipur TV", adCount: 40, airtime: 1000 },
            { station: "Avenues TV", adCount: 30, airtime: 800 },
          ],
        },
        {
          sector: "Telecommunications",
          stations: [
            { station: "Nepal Television", adCount: 45, airtime: 1100 },
            { station: "Kantipur TV", adCount: 35, airtime: 900 },
            { station: "Avenues TV", adCount: 25, airtime: 700 },
          ],
        },
        {
          sector: "Manufacturing",
          stations: [
            { station: "Nepal Television", adCount: 30, airtime: 800 },
            { station: "Kantipur TV", adCount: 25, airtime: 600 },
            { station: "Avenues TV", adCount: 20, airtime: 500 },
          ],
        },
      ],
    },
    {
      week: "Week 2",
      data: [
        {
          sector: "Construction",
          stations: [
            { station: "Nepal Television", adCount: 48, airtime: 1150 },
            { station: "Kantipur TV", adCount: 38, airtime: 950 },
            { station: "Avenues TV", adCount: 28, airtime: 750 },
          ],
        },
        {
          sector: "Telecommunications",
          stations: [
            { station: "Nepal Television", adCount: 43, airtime: 1050 },
            { station: "Kantipur TV", adCount: 33, airtime: 850 },
            { station: "Avenues TV", adCount: 23, airtime: 650 },
          ],
        },
        {
          sector: "Manufacturing",
          stations: [
            { station: "Nepal Television", adCount: 28, airtime: 750 },
            { station: "Kantipur TV", adCount: 23, airtime: 550 },
            { station: "Avenues TV", adCount: 18, airtime: 450 },
          ],
        },
      ],
    },
    {
      week: "Week 3",
      data: [
        {
          sector: "Construction",
          stations: [
            { station: "Nepal Television", adCount: 52, airtime: 1250 },
            { station: "Kantipur TV", adCount: 42, airtime: 1050 },
            { station: "Avenues TV", adCount: 32, airtime: 850 },
          ],
        },
        {
          sector: "Telecommunications",
          stations: [
            { station: "Nepal Television", adCount: 47, airtime: 1150 },
            { station: "Kantipur TV", adCount: 37, airtime: 950 },
            { station: "Avenues TV", adCount: 27, airtime: 750 },
          ],
        },
        {
          sector: "Manufacturing",
          stations: [
            { station: "Nepal Television", adCount: 32, airtime: 850 },
            { station: "Kantipur TV", adCount: 27, airtime: 650 },
            { station: "Avenues TV", adCount: 22, airtime: 550 },
          ],
        },
      ],
    },
  ],
  sectors: [
    { name: "Construction", color: "#ff6b6b" },
    { name: "Telecommunications", color: "#4ecdc4" },
    { name: "Manufacturing", color: "#45b7d1" },
  ],
};

const SectorAdDistributionBar = () => {
  const [selectedWeeks, setSelectedWeeks] = useState([sampleData.weeks[0].week]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [showAirtime, setShowAirtime] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [activeSector, setActiveSector] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const chartContainerRef = useRef(null);

  // Derive unique stations from the first week's data
  const allStations = sampleData.weeks[0]?.data[0]?.stations.map((s) => s.station) || [];

  // Handle week selection
  const handleWeekChange = (week) => {
    setSelectedWeeks((prev) => {
      const newWeeks = prev.includes(week)
        ? prev.filter((w) => w !== week)
        : [...prev, week];
      return newWeeks.length > 0 ? newWeeks : [sampleData.weeks[0].week];
    });
  };

  // Handle station selection
  const handleStationChange = (station) => {
    setSelectedStations((prev) => {
      if (station === "all") {
        return prev.includes("all") ? allStations : ["all"];
      }
      const newStations = prev.includes(station)
        ? prev.filter((s) => s !== station && s !== "all")
        : [...prev.filter((s) => s !== "all"), station];
      return newStations.length > 0 ? newStations : ["all"];
    });
  };

  // Prepare chart data
  const stations = selectedStations.includes("all")
    ? allStations
    : selectedStations;
  const chartData = stations.map((station) => {
    const stationData = {
      station,
      _rawValues: {},
      _totalValue: 0,
    };

    // Aggregate data across selected weeks
    const rawValues = {};
    let totalValue = 0;
    sampleData.sectors.forEach((sector) => {
      let sectorValue = 0;
      selectedWeeks.forEach((week) => {
        const weekData = sampleData.weeks.find((w) => w.week === week);
        const stationEntry = weekData?.data
          ?.find((s) => s.sector === sector.name)
          ?.stations.find((s) => s.station === station);
        sectorValue += showAirtime ? stationEntry?.airtime || 0 : stationEntry?.adCount || 0;
      });
      rawValues[sector.name] = sectorValue;
      totalValue += sectorValue;
    });

    // Avoid division by zero
    const total = totalValue || 1;
    sampleData.sectors.forEach((sector) => {
      stationData[sector.name] = (rawValues[sector.name] / total) * 100;
    });
    stationData._rawValues = rawValues;
    stationData._totalValue = totalValue;
    return stationData;
  });

  // Handle mouse events for tooltip
  const handleMouseEnter = (e, station, sector, value, percentage, total, color) => {
    const rect = chartContainerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        visible: true,
        x: e.clientX - rect.left + 10,
        y: e.clientY - rect.top - 50,
        station,
        sector,
        value,
        percentage,
        total,
        color,
      });
    }
  };

  // Handle mouse leave for tooltip
  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Handle sector click to toggle active sector
  const handleSectorClick = (sector) => {
    setActiveSector(activeSector === sector ? null : sector);
  };

  // Calculate chart dimensions
  const barHeight = 60;
  const barGap = 40;
  const chartHeight = stations.length * (barHeight + barGap) - barGap;
  const yAxisWidth = 80;

  return (
    <Card className="p-0 gap-0 w-full">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Sector Ad Distribution by TV Channel</CardTitle>
          <CardDescription>
            {showAirtime ? "Ad airtime (seconds)" : "Ad spots"} for{" "}
            {selectedWeeks.join(", ")}
          </CardDescription>
        </div>
        <div className="flex flex-row items-center justify-between gap-4">
          <Select
            value={selectedWeeks}
            onValueChange={handleWeekChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select weeks">
                {selectedWeeks.length > 0 ? selectedWeeks.join(", ") : "Select weeks"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sampleData.weeks.map((week) => (
                <SelectItem key={week.week} value={week.week}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedWeeks.includes(week.week)}
                      onChange={() => handleWeekChange(week.week)}
                      className="mr-2"
                    />
                    {week.week}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStations}
            onValueChange={handleStationChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedStations.includes("all") ? "All Channels" : selectedStations.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStations.includes("all")}
                    onChange={() => handleStationChange("all")}
                    className="mr-2"
                  />
                  All Channels
                </div>
              </SelectItem>
              {allStations.map((station) => (
                <SelectItem key={station} value={station}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedStations.includes(station)}
                      onChange={() => handleStationChange(station)}
                      className="mr-2"
                    />
                    {station}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Toggle
            pressed={showAirtime}
            onPressedChange={setShowAirtime}
            className="w-full"
          >
            {showAirtime ? "Show Ad spots" : "Show Airtime (s)"}
          </Toggle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-4">
        <div
          ref={chartContainerRef}
          className="relative w-full"
          style={{ height: `${chartHeight + 20}px` }}
        >
          {/* Y-Axis Labels */}
          <div className="absolute left-0 top-0" style={{ width: `${yAxisWidth}px` }}>
            {stations.map((station, index) => (
              <div
                key={station}
                className="text-xs"
                style={{
                  position: "absolute",
                  top: `${index * (barHeight + barGap) + barHeight / 2}px`,
                  transform: "translateY(-50%)",
                  textAlign: "right",
                  paddingRight: "8px",
                  width: `${yAxisWidth}px`,
                }}
              >
                {station}
              </div>
            ))}
          </div>
          {/* Bars */}
          <div
            className="relative"
            style={{ marginLeft: `${yAxisWidth}px`, height: `${chartHeight}px` }}
          >
            {chartData.map((stationData, index) => {
              let currentWidth = 0;
              const totalValue = stationData._totalValue;
              // Sort sectors by percentage in descending order
              const sortedSectors = [...sampleData.sectors].sort((a, b) => {
                const aPercentage = stationData[a.name] || 0;
                const bPercentage = stationData[b.name] || 0;
                return bPercentage - aPercentage;
              });
              return (
                <div
                  key={String(stationData.station)}
                  className="flex relative"
                  style={{
                    position: "absolute",
                    top: `${index * (barHeight + barGap)}px`,
                    height: `${barHeight}px`,
                    width: "100%",
                    transition: "all 0.3s ease",
                  }}
                >
                  {sortedSectors.map((sector) => {
                    const percentage = stationData[sector.name] || 0;
                    const rawValue = stationData._rawValues[sector.name] || 0;
                    if (rawValue === 0) return null;
                    const segmentWidth = `${percentage}%`;
                    const isActive = !activeSector || activeSector === sector.name;
                    const segment = (
                      <div
                        key={sector.name}
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{
                          width: segmentWidth,
                          height: "100%",
                          backgroundColor: sector.color,
                          opacity: isActive ? 1 : 0.3,
                          borderRadius:
                            currentWidth === 0
                              ? "6px 0 0 6px"
                              : currentWidth + percentage >= 99.5
                              ? "0 6px 6px 0"
                              : "0",
                          transition: "width 0.3s ease, opacity 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          handleMouseEnter(
                            e,
                            stationData.station,
                            sector.name,
                            rawValue,
                            percentage,
                            totalValue,
                            sector.color
                          )
                        }
                        onMouseLeave={handleMouseLeave}
                      >
                        <span
                          className="text-white text-xs font-medium"
                          style={{
                            whiteSpace: "nowrap",
                            textShadow: "0 0 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {rawValue} {showAirtime ? "sec" : "spot"}
                        </span>
                      </div>
                    );
                    currentWidth += percentage;
                    return segment;
                  })}
                  {/* Total Value Label */}
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      position: "absolute",
                      top: "-24px",
                      right: "0",
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {totalValue} {showAirtime ? "sec" : "spot"}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute bg-card p-3 border rounded-lg shadow-lg pointer-events-none"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transition: "opacity 0.2s ease",
                opacity: tooltip.visible ? 1 : 0,
              }}
            >
              <p className="font-semibold">{tooltip.station}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className="text-sm text-muted-foreground">{tooltip.sector}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {tooltip.value} {showAirtime ? "sec" : "spot"}
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.round(tooltip.percentage)}% of {tooltip.total} {showAirtime ? "sec" : "spot"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4">
        <Collapsible
          open={isCollapsibleOpen}
          onOpenChange={setIsCollapsibleOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Legend</span>
              {isCollapsibleOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {sampleData.sectors.map((sector) => (
                <button
                  key={sector.name}
                  onClick={() => handleSectorClick(sector.name)}
                  className={`px-2 py-1 rounded-full text-xs font-medium text-white transition-opacity ${
                    activeSector && activeSector !== sector.name
                      ? "opacity-50"
                      : "opacity-100"
                  }`}
                  style={{ backgroundColor: sector.color }}
                >
                  {sector.name}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};

export default SectorAdDistributionBar;