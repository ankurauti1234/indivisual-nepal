"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Radio,
  Clock,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { channels, allPrograms } from "./data";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MIN_HOUR_WIDTH = 750;
const MAX_HOUR_WIDTH = 7500;
const TIMELINE_HEIGHT = 60;
const CHANNEL_HEIGHT = 120;
const HOURS_IN_DAY = 12; // Changed from 24 to 12 (9am to 9pm)

export function NewTVSchedule() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourWidth, setHourWidth] = useState(7500);
  const scrollContainerRef = useRef(null);
  const now = new Date();

  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date(now);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(21, 0, 0, 0);
    return { start, end };
  });

  const [currentTime, setCurrentTime] = useState(now);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderTimelineMarks = () => {
    const marks = [];
    // 12 hours * 60 minutes per hour = 720 total minutes
    for (let i = 0; i <= HOURS_IN_DAY * 60; i++) {
      const left = (i / 60) * hourWidth;
      let height;

      // Format time for labels
      const formatTimeLabel = (minutes) => {
        const hour = Math.floor(minutes / 60) + 9; // Adjusted to start from 9am
        const minute = minutes % 60;
        const formattedHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? "PM" : "AM";
        return `${formattedHour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")} ${period}`;
      };

      // Hour marks (every 60 minutes)
      if (i % 60 === 0) {
        height = 20;
        marks.push(
          <div
            key={i}
            className="absolute top-0 w-0.5 bg-gray-300 dark:bg-gray-700"
            style={{
              left: `${left}px`,
              height: `${height}px`,
            }}
          />,
          <span
            key={`label-${i}`}
            className="absolute top-6 text-xs font-medium text-gray-500"
            style={{ left: `${left + 4}px` }}
          >
            {formatTimeLabel(i)}
          </span>
        );
      }
      // 15-minute marks
      else if (i % 15 === 0) {
        height = 15;
        marks.push(
          <div
            key={i}
            className="absolute top-0 w-px bg-gray-200 dark:bg-gray-800"
            style={{
              left: `${left}px`,
              height: `${height}px`,
            }}
          />,
          <span
            key={`label-${i}`}
            className="absolute top-4 text-[10px] text-muted-foreground "
            style={{
              left: `${left + 2}px`,
              // transform: "rotate(45deg)",
              transformOrigin: "left top",
            }}
          >
            {formatTimeLabel(i)}
          </span>
        );
      }
      // 5-minute marks
      else if (i % 5 === 0) {
        height = 10;
        marks.push(
          <div
            key={i}
            className="absolute top-0 w-px bg-gray-200 dark:bg-gray-800"
            style={{
              left: `${left}px`,
              height: `${height}px`,
            }}
          />,
          <span
            key={`label-${i}`}
            className="absolute top-3 text-[9px] text-muted-foreground  "
            style={{
              left: `${left + 2}px`,
              // transform: "rotate(-45deg)",
              transformOrigin: "left top",
            }}
          >
            {formatTimeLabel(i)}
          </span>
        );
      }
      // Minute marks
      else {
        height = 5;
        marks.push(
          <div
            key={i}
            className="absolute top-0 w-px bg-gray-100 dark:bg-gray-900"
            style={{
              left: `${left}px`,
              height: `${height}px`,
            }}
          />
        );
      }
    }
    return marks;
  };

  const calculateProgramPosition = (program) => {
    const startTime = timeStringToDate(program.startTime);
    const endTime = timeStringToDate(program.endTime);

    // Handle programs that span across midnight
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    const rangeStart = new Date(timeRange.start);
    rangeStart.setHours(9, 0, 0, 0);

    const left = Math.max(
      0,
      ((startTime.getTime() - rangeStart.getTime()) / (1000 * 60 * 60)) *
        hourWidth
    );
    const width = Math.max(
      0,
      ((endTime.getTime() -
        Math.max(startTime.getTime(), rangeStart.getTime())) /
        (1000 * 60 * 60)) *
        hourWidth
    );

    return { left, width };
  };

  const filteredPrograms = allPrograms.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLive = (program) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    return currentTime >= program.startTime && currentTime <= program.endTime;
  };

  const totalWidth = HOURS_IN_DAY * hourWidth;

  const jumpToLive = () => {
    if (scrollContainerRef.current) {
      const now = new Date();
      const dayStart = new Date(timeRange.start);
      const hoursFromStart = (now - dayStart) / (1000 * 60 * 60);
      const scrollPosition = hoursFromStart * hourWidth;
      scrollContainerRef.current.scrollLeft =
        scrollPosition - scrollContainerRef.current.clientWidth / 2;
    }
  };

  const handleZoom = (zoomIn) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // Calculate the time at the center of the viewport
      const centerTime =
        timeRange.start.getTime() +
        ((scrollLeft + containerWidth / 2) / hourWidth) * (60 * 60 * 1000);

      // Update the hour width
      const oldHourWidth = hourWidth;
      const newHourWidth = Math.min(
        Math.max(zoomIn ? hourWidth + 30 : hourWidth - 30, MIN_HOUR_WIDTH),
        MAX_HOUR_WIDTH
      );

      setHourWidth(newHourWidth);

      // After the state update, adjust scroll position to keep the center time in view
      requestAnimationFrame(() => {
        if (container) {
          const newCenterOffset =
            ((centerTime - timeRange.start.getTime()) / (60 * 60 * 1000)) *
            newHourWidth;
          const newScrollLeft = newCenterOffset - containerWidth / 2;
          container.scrollLeft = newScrollLeft;
        }
      });
    }
  };

  // Add a smooth scroll behavior when hour width changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = "smooth";

      // Reset scroll behavior after animation
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.scrollBehavior = "auto";
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [hourWidth]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    const start = new Date(newDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    setTimeRange({ start, end });
  };

  // Helper function to convert time string to Date object
  const timeStringToDate = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(timeRange.start);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div className="min-h-[50vh] w-full bg-card text-foreground border overflow-hidden">
      {/* Header */}
      <div className="bg-popover backdrop-blur-lg border-b border-border p-6 sticky top-0 z-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <h1 className="text-2xl font-semibold">TV Guide</h1> */}
              <div className="flex items-center gap-2 bg-background border border-border rounded-lg">
                <Button variant="icon" size="sm" onClick={() => changeDate(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2 border-x border-border">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Button variant="icon" size="sm" onClick={() => changeDate(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background border border-border rounded-lg">
              <Button
                variant="icon"
                size="sm"
                onClick={() => handleZoom(false)}
                disabled={hourWidth <= MIN_HOUR_WIDTH}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2 border-x border-border">
                {Math.round((hourWidth / MAX_HOUR_WIDTH) * 100)?.toFixed(0)}%
              </span>
              <Button
                variant="icon"
                size="sm"
                onClick={() => handleZoom(true)}
                disabled={hourWidth >= MAX_HOUR_WIDTH}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={jumpToLive}
              className="flex items-center gap-2 hover:bg-background hover:text-foreground hover:font-bold border border-border rounded-lg"
            >
              <Radio className="h-4 w-4 text-red-500 animate-pulse" />
              Live
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="relative flex h-full">
          {/* Channel sidebar */}
          <div className="w-48 flex-none border-r border-border bg-background/95 backdrop-blur-lg">
            <div
              style={{ height: TIMELINE_HEIGHT }}
              className="border-b border-border"
            />
            {channels.map((channel) => (
              <div
                key={channel.id}
                style={{ height: CHANNEL_HEIGHT }}
                className="flex items-center gap-3 border-b border-border px-4 hover:bg-accent/50 transition-colors"
              >
                <img
                  src={channel.logo || "/placeholder.svg"}
                  alt={channel.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <span className="font-medium">{channel.name}</span>
              </div>
            ))}
          </div>

          {/* Schedule grid */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
          >
            <div className="relative" style={{ width: `${totalWidth}px` }}>
              {/* Timeline */}
              <div
                className="sticky top-0 border-b border-gray-200 dark:border-gray-800 bg-popover/95 dark:bg-black/95 backdrop-blur-xl z-10"
                style={{ height: TIMELINE_HEIGHT }}
              >
                <div className="relative h-full">{renderTimelineMarks()}</div>
              </div>

              {/* Programs */}
              <div className="relative bg-popover/50 dark:bg-black/50">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="relative border-b border-gray-200 dark:border-gray-800"
                    style={{ height: CHANNEL_HEIGHT }}
                  >
                    {filteredPrograms
                      .filter((program) => program.channel === channel.id)
                      .map((program) => {
                        const { left, width } =
                          calculateProgramPosition(program);
                        const isLiveProgram = isLive(program);

                        if (left + width < 0 || left > totalWidth) return null;

                        const adjustedLeft = Math.max(0, left);
                        const adjustedWidth = Math.min(
                          width,
                          totalWidth - left
                        );

                        return (
                          <TooltipProvider key={program.id}>
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`absolute top-3 bottom-3 rounded shadow-inner transition-all duration-300 
                                    ${
                                      isLiveProgram
                                        ? "bg-green-600/50 border border-green-600"
                                        : program.type === "ad"
                                        ? "bg-red-500/50 border border-red-500"
                                        : "bg-primary/15 border border-primary/25"
                                    }
                                    backdrop-blur-sm group overflow-hidden`}
                                  style={{
                                    left: `${adjustedLeft}px`,
                                    width: `${adjustedWidth}px`,
                                  }}
                                >
                                  <div className="flex justify-between items-start h-full p-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-foreground truncate group-hover:whitespace-normal">
                                        {program.title}
                                        {isLiveProgram && (
                                          <span className="ml-2 text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                                            LIVE
                                          </span>
                                        )}
                                      </div>
                                      <div className="mt-1 flex flex-col text-xs truncate group-hover:whitespace-normal">
                                        {program.description}
                                        <span className="mt-1">
                                          {program.startTime} -{" "}
                                          {program.endTime}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="w-80 p-4 space-y-2 bg-popover border-2 border-ring shadow-2xl"
                              >
                                <h3 className="font-semibold text-lg">
                                  {program.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {program.startTime.slice(0, 5)} -{" "}
                                    {program.endTime.slice(0, 5)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {program.date}
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {program.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                  </div>
                ))}

                {/* Current time indicator */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-red-500 shadow-xl z-10"
                  style={{
                    left: `${
                      ((currentTime - timeRange.start) / (1000 * 60 * 60)) *
                      hourWidth
                    }px`,
                  }}
                >
                  <div className="absolute -left-1.5 -top-1.5 h-4 w-4 rounded-full bg-red-500 shadow-lg ring-4 ring-red-200 dark:ring-red-900" />
                  <span
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-xs font-medium bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full border border-red-200 dark:border-red-800"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {currentTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewTVSchedule;
