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
import { timeToMinutes, formatTimeForURL, parseTimeToMinutes, getUniqueRegions, getUniqueChannels, getUniqueContentTypes, getDatesWithData, findNearestDateWithData, unixToTime } from "./utils";
import { squircleClipPath } from "./squircle";
import ExportDialog from "./export-dialog";

const MINUTES_IN_DAY = 24 * 60;
const FIXED_WIDTH = 9600;
const DEVICE_IDS = ["R-1","R-3","R-4", "R-5"];

const EPG = ({ region, availableData }) => {
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
        const baseUrl = "https://ott-api.indirex.io/api/v1";
        const stations = Object.keys(availableData).filter((station) =>
          availableData[station].dates.includes(selectedDate)
        );
        const deviceIds = DEVICE_IDS.filter((id) => stations.includes(id));

        console.log("Fetching data for device IDs:", deviceIds);

        const dataPromises = deviceIds.map(async (deviceId) => {
          const response = await fetch(
            `${baseUrl}/labels/program-guides/${selectedDate}/${deviceId}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(
            `Response for ${deviceId} on ${selectedDate}:`,
            response.status,
            response.statusText
          );
          if (!response.ok)
            throw new Error(
              `Failed to fetch data for ${deviceId} on ${selectedDate}: ${response.statusText}`
            );
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.message || "Failed to fetch program guide");
          }
          return result.data.labels.map((item) => ({
            id: item.id,
            type: item.label_type === "ad" ? "advertisement" : item.label_type,
            channel: item.device_id,
            region: region,
            title:
              item.label_type === "ad"
                ? item.ad?.product || "Advertisement"
                : item.label_type === "program"
                ? item.program?.program_name || "Program"
                : item.label_type === "song"
                ? item.song?.title || "Song"
                : "Error",
            start: unixToTime(item.start_time),
            end: unixToTime(item.end_time),
            date: result.data.date,
            content:
              item.label_type === "ad"
                ? item.ad?.category
                : item.label_type === "program"
                ? item.program?.description
                : item.label_type === "song"
                ? item.song?.artist
                : item.error?.message,
            image_paths: item.image_paths || [], // Store all images
            episode_id: item.program?.episode_id,
            season_id: item.program?.season_id,
          }));
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

    const isVeryNarrow = width < 80;

    const typeStyles = {
      program: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100",
      advertisement: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100",
      song: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100",
      error: "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100",
    };

    return (
      <motion.div
        key={program.id}
        className={`absolute h-28 overflow-hidden rounded-lg border border-zinc-200/20 dark:border-zinc-700/20 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${typeStyles[program.type.toLowerCase()]} ${isVeryNarrow ? "p-1" : "p-2"}`}
        style={{ left: `${left}px`, width: `${width}px` }}
        onClick={() => setSelectedProgram(program)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="h-full flex flex-col justify-between">
          {!isVeryNarrow && (
            <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:line-clamp-none">
              {program.title}
            </h3>
          )}
          {isVeryNarrow && (
            <div className="tooltip-container">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-lg">•</span>
              </div>
              <div className="absolute hidden group-hover:block z-50 bg-white/95 dark:bg-zinc-900/95 shadow-lg rounded-lg p-3 -left-2 top-8 w-56 border border-zinc-200/20 dark:border-zinc-700/20">
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
            <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-zinc-900/80">{`${program.start} - ${program.end}`}</span>
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
    <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200/10 dark:border-zinc-800/10 overflow-hidden">
      <header className="p-4 bg-white dark:bg-zinc-950 border-b border-zinc-200/10 dark:border-zinc-800/10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Program Guide
          </h1>
          <div className="flex items-center gap-3">
            <ExportDialog
              selectedDate={selectedDate}
              epgData={epgData}
              availableData={availableData}
              regions={regions}
            />
            <div className="flex items-center gap-2 bg-white/50 dark:bg-zinc-900/50 rounded-lg p-1.5 shadow-sm">
              <Button
                onClick={handlePrevDate}
                size="icon"
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-48 text-sm font-medium bg-white dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg"
                  >
                    {format(calendarDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20 rounded-lg">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                    className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleNextDate}
                size="icon"
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
              >
                <ChevronRight className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-48 text-sm font-medium bg-white dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/20 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg">
                Filter Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20 rounded-lg">
              <DropdownMenuLabel className="text-sm text-zinc-700 dark:text-zinc-300">Filters</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-200/20 dark:bg-zinc-800/20" />
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Content Type
                </label>
                <Select
                  value={selectedContentType}
                  onValueChange={setSelectedContentType}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20 text-zinc-900 dark:text-zinc-100 rounded-lg">
                    <SelectValue placeholder="Filter by Content Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20">
                    <SelectItem value="all">All Content Types</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="song">Song</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  TV Channel
                </label>
                <Select
                  value={selectedChannel}
                  onValueChange={setSelectedChannel}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20 text-zinc-900 dark:text-zinc-100 rounded-lg">
                    <SelectValue placeholder="Filter by TV Channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200/20 dark:border-zinc-800/20">
                    <SelectItem value="all">All TV Channels</SelectItem>
                    {DEVICE_IDS.map((deviceId) => (
                      <SelectItem key={deviceId} value={deviceId}>
                        {deviceId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
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
        <div className="w-48 flex-shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200/10 dark:border-zinc-800/10">
          <div className="h-12" />
          {channels.map((channel, index) => (
            <div
              key={index}
              className="h-28 flex items-center px-3 border-b border-zinc-200/10 dark:border-zinc-800/10"
            >
              <img
                src={`https://radio-playback-files.s3.ap-south-1.amazonaws.com/logos/${channel
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")}.png`}
                alt={channel}
                className="h-10 w-10 rounded-md shadow-sm mr-2"
                style={{ clipPath: `polygon(${squircleClipPath(40, 40, 4)})` }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {channel}
                </span>
                {regions && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {regions[0]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <ScrollArea className="flex-1 bg-white dark:bg-zinc-950">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-zinc-950 text-center p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Error Loading Data
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{error}</p>
              <Button
                onClick={handleGoToNearestDate}
                className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg"
              >
                Go to Nearest Date
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
            className="bg-zinc-200/20 dark:bg-zinc-800/20"
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default EPG;