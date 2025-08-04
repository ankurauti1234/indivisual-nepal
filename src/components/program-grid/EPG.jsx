"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomRangeSlider from "./custom-range-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramDialog from "./program-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import TimelineRuler from "./TimelineRuler";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";
import { timeToMinutes, formatTimeForURL, parseTimeToMinutes, getUniqueRegions, getUniqueChannels, getUniqueContentTypes, getDatesWithData, findNearestDateWithData } from "./utils";
import { squircleClipPath } from "./squircle";
import ExportDialog from "./export-dialog";

const MINUTES_IN_DAY = 24 * 60;
const FIXED_WIDTH = 9600;

const EPG = ({region, availableData}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate =
    searchParams.get("date") || new Date().toISOString().split("T")[0];
  const initialStart = parseTimeToMinutes(searchParams.get("start")) || 0;
  const initialEnd =
    parseTimeToMinutes(searchParams.get("end")) || MINUTES_IN_DAY;

  const [timeRange, setTimeRange] = useState([initialStart, initialEnd]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [epgData, setEpgData] = useState([]);
  const [error, setError] = useState(null);
  const [calendarDate, setCalendarDate] = useState(() => {
    const date = new Date(initialDate + 'T00:00:00Z');
    return date;
  });

  const datesWithData = getDatesWithData(availableData);
  const channels = getUniqueChannels(epgData);
  const regions = getUniqueRegions(epgData);
  const contentTypes = getUniqueContentTypes(epgData);

  useEffect(() => {
    console.log("Selected Date:", selectedDate);
    console.log("Dates with Data:", datesWithData);
    console.log("Channels:", channels);
    console.log(
      "Filtered Data:",
      epgData.filter((program) => {
        const matchesContentType =
          selectedContentType === "all" || program.type.toLowerCase() === selectedContentType;
        const matchesChannel =
          selectedChannel === "all" ||
          program.channel === selectedChannel;
        const matchesRegion =
          selectedRegion === "all" || program.region === selectedRegion;
        return matchesContentType && matchesChannel && matchesRegion;
      })
    );
  }, [
    selectedDate,
    datesWithData,
    channels,
    epgData,
    selectedContentType,
    selectedChannel,
    selectedRegion,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stations = Object.keys(availableData).filter((station) =>
          availableData[station].dates.includes(selectedDate)
        );
        console.log("Fetching data for stations:", stations);

        const dataPromises = stations.map(async (station) => {
          const response = await fetch(`https://radio-playback-files.s3.ap-south-1.amazonaws.com/data/${region}/${station}/${selectedDate}.json`);
          console.log(
            `Response for ${station} on ${selectedDate}:`,
            response.status,
            response.statusText
          );
          if (!response.ok)
            throw new Error(
              `Failed to fetch data for ${station} on ${selectedDate}: ${response.statusText}`
            );
          const data = await response.json();
          console.log(`Data fetched for ${station}:`, data);
          return data.map((item) => ({ ...item, channel: station }));
        });

        const results = await Promise.all(dataPromises);
        const combinedData = results.flat();
        setEpgData(combinedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setEpgData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, region, availableData]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("date", selectedDate);
    params.set("start", formatTimeForURL(timeRange[0]));
    params.set("end", formatTimeForURL(timeRange[1]));
    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedDate, timeRange, router, searchParams]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const filteredData = epgData.filter((program) => {
    const matchesContentType =
      selectedContentType === "all" || program.type.toLowerCase() === selectedContentType;
    const matchesChannel =
      selectedChannel === "all" ||
      program.channel === selectedChannel;
    const matchesRegion =
      selectedRegion === "all" || program.region === selectedRegion;
    return matchesContentType && matchesChannel && matchesRegion;
  });

  const handlePrevDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate + 'T00:00:00Z');
      newDate.setUTCDate(newDate.getUTCDate() - 1);
      setCalendarDate(new Date(Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate())));
      return newDate.toISOString().split("T")[0];
    });
  };

  const handleNextDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate + 'T00:00:00Z');
      newDate.setUTCDate(newDate.getUTCDate() + 1);
      setCalendarDate(new Date(Date.UTC(newDate.getUTCFullYear(), newDate.getUTCMonth(), newDate.getUTCDate())));
      return newDate.toISOString().split("T")[0];
    });
  };

  const handleCalendarSelect = (date) => {
    if (date) {
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const formattedDate = utcDate.toISOString().split("T")[0];
      setSelectedDate(formattedDate);
      setCalendarDate(utcDate);
    }
  };

  const handleGoToNearestDate = () => {
    const nearestDate = findNearestDateWithData(selectedDate, datesWithData);
    if (nearestDate) {
      setSelectedDate(nearestDate);
      const utcDate = new Date(nearestDate + 'T00:00:00Z');
      setCalendarDate(new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate())));
    }
  };

  const renderProgramBlock = (program, timeRange) => {
    const startMinutes = timeToMinutes(program.start);
    const endMinutes = timeToMinutes(program.end);
    if (endMinutes <= timeRange[0] || startMinutes >= timeRange[1]) return null;

    const visibleStart = Math.max(startMinutes, timeRange[0]);
    const visibleEnd = Math.min(endMinutes, timeRange[1]);
    const width = (visibleEnd - visibleStart) * pixelsPerMinute;
    const left = (visibleStart - timeRange[0]) * pixelsPerMinute;

    const isProgram = program.type.toLowerCase() === "program";
    const isAdvertisement = program.type.toLowerCase() === "advertisement";

    const isVeryNarrow = width < 80;
    const isNarrow = width < 120;

    const typeStyles = {
      program:
        "bg-gradient-to-br from-teal-200 to-teal-300 dark:from-teal-700 dark:to-teal-900 text-teal-800 dark:text-teal-100",
      advertisement:
        "bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-700 dark:to-rose-900 text-rose-800 dark:text-rose-100",
    };

    return (
      <motion.div
        key={program.id}
        className={`absolute h-28 overflow-hidden rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
          isProgram
            ? typeStyles.program
            : isAdvertisement
            ? typeStyles.advertisement
            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
        } ${isVeryNarrow ? "p-1" : "p-2"}`}
        style={{ left: `${left}px`, width: `${width}px` }}
        onClick={() => setSelectedProgram(program)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="h-full flex flex-col justify-between">
          {!isVeryNarrow && (
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:line-clamp-none">
              {program.title}
            </h3>
          )}
          {isVeryNarrow && (
            <div className="tooltip-container">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-lg">•</span>
              </div>
              <div className="absolute hidden group-hover:block z-50 bg-white/95 dark:bg-zinc-800/95 shadow-xl rounded-lg p-3 -left-2 top-8 w-56 border border-zinc-200/50 dark:border-zinc-700/50">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                  {program.title}
                </p>
              </div>
            </div>
          )}
          <div
            className={`flex items-center gap-1 text-xs ${
              isVeryNarrow ? "flex-col" : ""
            }`}
          >
            <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800/80">{`${program.start} - ${program.end}`}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const minutesInRange = timeRange[1] - timeRange[0];
  const pixelsPerMinute = FIXED_WIDTH / minutesInRange;
  const adjustedEndTime = Math.ceil(timeRange[1] / 60) * 60;
  const dynamicWidth = (adjustedEndTime - timeRange[0]) * pixelsPerMinute;

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      <header className="p-6 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-b border-zinc-200/50 dark:border-zinc-700/50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
            TV Program Guide
          </h1>
          <div className="flex items-center gap-4">
            <ExportDialog
              selectedDate={selectedDate}
              epgData={epgData}
              availableData={availableData}
              regions={regions}
            />
            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl p-2 shadow-md">
              <Button
                onClick={handlePrevDate}
                size="icon"
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-medium bg-white dark:bg-zinc-900 border-none hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  >
                    {format(calendarDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleNextDate}
                size="icon"
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-56 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                Filter Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
              <DropdownMenuLabel>Filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                  Content Type
                </label>
                <Select
                  value={selectedContentType}
                  onValueChange={setSelectedContentType}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content Types</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                  TV Channel
                </label>
                <Select
                  value={selectedChannel}
                  onValueChange={setSelectedChannel}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by TV Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All TV Channels</SelectItem>
                    {Object.keys(availableData).map((station) => (
                      <SelectItem key={station} value={station}>
                        {station.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6">
          <CustomRangeSlider
            min={0}
            max={MINUTES_IN_DAY}
            step={1}
            value={timeRange}
            onChange={handleTimeRangeChange}
          />
        </div>
      </header>

      <ProgramDialog
        selectedProgram={selectedProgram}
        setSelectedProgram={setSelectedProgram}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 flex-shrink-0 bg-zinc-50 dark:bg-zinc-800/50 border-r border-zinc-200/50 dark:border-zinc-700/50">
          <div className="h-12" />
          {channels.map((channel, index) => (
            <div
              key={index}
              className="h-28 flex items-center px-4 border-b border-zinc-200/20 dark:border-zinc-700/20"
            >
              <img
                src={`https://radio-playback-files.s3.ap-south-1.amazonaws.com/logos/${channel
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")}.png`}
                alt={channel}
                className="h-12 w-12 rounded-lg shadow-md mr-3"
                style={{ clipPath: `polygon(${squircleClipPath(48, 48, 4)})` }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 uppercase">
                  {channel.replace(/-/g, " ").replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
                </span>
                {regions && (
                  <span className="text-sm text-muted-foreground">
                    {regions[0]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollArea className="flex-1 bg-zinc-100 dark:bg-zinc-900">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full bg-zinc-100 dark:bg-zinc-900 text-center p-8">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
                Error Loading Data
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
              <Button
                onClick={handleGoToNearestDate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Go to Nearest Date with Data
              </Button>
            </div>
          ) : filteredData.length === 0 ? (
            <EmptyState onGoToNearestDate={handleGoToNearestDate} />
          ) : (
            <div
              className="relative"
              style={{
                width: `${dynamicWidth}px`,
                height: `${channels.length * 112}px`,
              }}
            >
              <TimelineRuler timeRange={timeRange} />
              {channels.map((channel, channelIndex) => {
                const channelPrograms = filteredData
                  .filter((p) => p.channel === channel)
                  .filter((program) => {
                    const startMinutes = timeToMinutes(program.start);
                    const endMinutes = timeToMinutes(program.end);
                    return !(
                      endMinutes <= timeRange[0] || startMinutes >= timeRange[1]
                    );
                  });

                return (
                  <div
                    key={channel}
                    className="absolute left-0 right-0 h-28 top-[48px]"
                    style={{ top: `${channelIndex * 112 + 48}px` }}
                  >
                    {channelPrograms.map((program) =>
                      renderProgramBlock(program, timeRange)
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <ScrollBar
            orientation="horizontal"
            className="bg-zinc-200/50 dark:bg-zinc-800/50"
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default EPG;