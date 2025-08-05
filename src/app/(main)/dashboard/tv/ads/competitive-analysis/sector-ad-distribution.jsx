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

// Data for sector ad distribution by TV channel
const data = {
  weeks: [
    {
      week: "2025-Week-27",
      data: [
        {
          sector: "PERSONAL CARE",
          stations: [
            { station: "Kantipur HD TV", adCount: 527, airtime: 19829.82 },
            { station: "Image Channel", adCount: 493, airtime: 18719.34 },
            { station: "Galaxy 4K", adCount: 445, airtime: 16645.8 },
            { station: "NTV Nepal", adCount: 470, airtime: 17912.88 },
            { station: "News 24", adCount: 451, airtime: 16884.54 },
          ],
        },
        {
          sector: "FMCG",
          stations: [
            { station: "Kantipur HD TV", adCount: 495, airtime: 18430.2 },
            { station: "Image Channel", adCount: 467, airtime: 17497.68 },
            { station: "Galaxy 4K", adCount: 442, airtime: 17087.64 },
            { station: "NTV Nepal", adCount: 503, airtime: 18747.78 },
            { station: "News 24", adCount: 483, airtime: 18207.96 },
          ],
        },
        {
          sector: "CONSUMER DURABLES",
          stations: [
            { station: "Kantipur HD TV", adCount: 258, airtime: 9683.76 },
            { station: "Image Channel", adCount: 276, airtime: 9853.02 },
            { station: "Galaxy 4K", adCount: 274, airtime: 10124.94 },
            { station: "NTV Nepal", adCount: 271, airtime: 10067.52 },
            { station: "News 24", adCount: 309, airtime: 11691.72 },
          ],
        },
        {
          sector: "FINANCE",
          stations: [
            { station: "Kantipur HD TV", adCount: 191, airtime: 6863.7 },
            { station: "Image Channel", adCount: 180, airtime: 6448.68 },
            { station: "Galaxy 4K", adCount: 174, airtime: 6701.64 },
            { station: "NTV Nepal", adCount: 181, airtime: 7089.6 },
            { station: "News 24", adCount: 189, airtime: 7138.86 },
          ],
        },
        {
          sector: "CONSTRUCTION",
          stations: [
            { station: "Kantipur HD TV", adCount: 111, airtime: 4349.7 },
            { station: "Image Channel", adCount: 89, airtime: 3402.96 },
            { station: "Galaxy 4K", adCount: 105, airtime: 4140 },
            { station: "NTV Nepal", adCount: 96, airtime: 3618.84 },
            { station: "News 24", adCount: 93, airtime: 3522.42 },
          ],
        },
        {
          sector: "INFRASTRUCTURE",
          stations: [
            { station: "Kantipur HD TV", adCount: 112, airtime: 4308.78 },
            { station: "Image Channel", adCount: 87, airtime: 3302.7 },
            { station: "Galaxy 4K", adCount: 109, airtime: 4130.28 },
            { station: "NTV Nepal", adCount: 100, airtime: 3661.56 },
            { station: "News 24", adCount: 101, airtime: 3604.56 },
          ],
        },
        {
          sector: "HOUSEHOLD PRODUCTS",
          stations: [
            { station: "Kantipur HD TV", adCount: 108, airtime: 4067.94 },
            { station: "Image Channel", adCount: 89, airtime: 3389.58 },
            { station: "Galaxy 4K", adCount: 89, airtime: 3289.92 },
            { station: "NTV Nepal", adCount: 94, airtime: 3525.06 },
            { station: "News 24", adCount: 94, airtime: 3749.82 },
          ],
        },
        {
          sector: "EDUCATION",
          stations: [
            { station: "Kantipur HD TV", adCount: 91, airtime: 3221.82 },
            { station: "Image Channel", adCount: 98, airtime: 3748.86 },
            { station: "Galaxy 4K", adCount: 102, airtime: 3833.88 },
            { station: "NTV Nepal", adCount: 92, airtime: 3395.46 },
            { station: "News 24", adCount: 92, airtime: 3500.7 },
          ],
        },
      ],
    },
  ],
  sectors: [
    { name: "PERSONAL CARE", color: "#FF6B6B" },
    { name: "FMCG", color: "#4ECDC4" },
    { name: "CONSUMER DURABLES", color: "#45B7D1" },
    { name: "FINANCE", color: "#96CEB4" },
    { name: "CONSTRUCTION", color: "#FFEEAD" },
    { name: "INFRASTRUCTURE", color: "#D4A5A5" },
    { name: "HOUSEHOLD PRODUCTS", color: "#9B59B6" },
    { name: "EDUCATION", color: "#3498DB" },
  ],
};

const SectorAdDistributionBar = () => {
  const [selectedWeeks, setSelectedWeeks] = useState([data.weeks[0].week]);
  const [selectedStations, setSelectedStations] = useState(["all"]);
  const [showAirtime, setShowAirtime] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [activeSector, setActiveSector] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const chartContainerRef = useRef(null);

  // Derive unique stations from the first week's data
  const allStations = data.weeks[0]?.data[0]?.stations.map((s) => s.station) || [];

  // Handle week selection
  const handleWeekChange = (week) => {
    setSelectedWeeks((prev) => {
      const newWeeks = prev.includes(week)
        ? prev.filter((w) => w !== week)
        : [...prev, week];
      return newWeeks.length > 0 ? newWeeks : [data.weeks[0].week];
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
    data.sectors.forEach((sector) => {
      let sectorValue = 0;
      selectedWeeks.forEach((week) => {
        const weekData = data.weeks.find((w) => w.week === week);
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
    data.sectors.forEach((sector) => {
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
  const yAxisWidth = 120; // Increased for longer station names

  return (
    <Card className="p-0 gap-0 w-full shadow-xl rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-2xl font-bold text-gray-800">Sector Ad Distribution by TV Channel</CardTitle>
          <CardDescription className="text-gray-500">
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
            <SelectTrigger className="w-48 bg-white border-gray-200">
              <SelectValue placeholder="Select weeks">
                {selectedWeeks.length > 0 ? selectedWeeks.join(", ") : "Select weeks"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {data.weeks.map((week) => (
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
            <SelectTrigger className="w-48 bg-white border-gray-200">
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
            className="w-full bg-white border-gray-200 hover:bg-gray-100"
          >
            {showAirtime ? "Show Ad Spots" : "Show Airtime (s)"}
          </Toggle>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
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
                className="text-xs font-medium text-gray-700"
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
              const sortedSectors = [...data.sectors].sort((a, b) => {
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
                          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
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
                          {rawValue.toFixed(showAirtime ? 2 : 0)} {showAirtime ? "sec" : "spots"}
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
                    {totalValue.toFixed(showAirtime ? 2 : 0)} {showAirtime ? "sec" : "spots"}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute bg-white p-3 border border-gray-200 rounded-lg shadow-lg pointer-events-none"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
                transition: "opacity 0.2s ease",
                opacity: tooltip.visible ? 1 : 0,
              }}
            >
              <p className="font-semibold text-gray-800">{tooltip.station}</p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tooltip.color }}
                />
                <span className="text-sm text-gray-600">{tooltip.sector}</span>
              </div>
              <p className="text-sm font-medium mt-1">
                {tooltip.value.toFixed(showAirtime ? 2 : 0)} {showAirtime ? "sec" : "spots"}
              </p>
              <p className="text-xs text-gray-600">
                {Math.round(tooltip.percentage)}% of {tooltip.total.toFixed(showAirtime ? 2 : 0)} {showAirtime ? "sec" : "spots"}
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
              <span className="text-sm text-gray-500">Legend</span>
              {isCollapsibleOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.sectors.map((sector) => (
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