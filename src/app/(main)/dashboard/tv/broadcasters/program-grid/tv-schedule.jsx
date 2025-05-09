"use client";
import { useState, useRef, useEffect, useMemo } from "react";
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
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import { channels, allPrograms } from "./data";
import viewershipData from "./views";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MIN_HOUR_WIDTH = 500;
const MAX_HOUR_WIDTH = 5000;
const TIMELINE_HEIGHT = 60;
const CHANNEL_HEIGHT = 120;
const HOURS_IN_DAY = 12;
const VIEWERSHIP_HEIGHT = 60; // Height for viewership graph
const MINUTE_WIDTH = 2; // 2px per minute

// Helper function to get max viewership across all channels
const getMaxViewership = () => {
  let max = 0;
  Object.keys(viewershipData).forEach((channelId) => {
    viewershipData[channelId].viewership.forEach((point) => {
      if (point.viewers > max) max = point.viewers;
    });
  });
  return max;
};

const formatViewers = (viewers) => {
  if (viewers >= 1000000) {
    return `${(viewers / 1000000).toFixed(1)}M`;
  } else if (viewers >= 1000) {
    return `${(viewers / 1000).toFixed(1)}K`;
  }
  return viewers.toString();
};

// Helper function to get viewership for a specific time
const getViewershipForTime = (channelId, time) => {
  const channel = viewershipData[channelId];
  if (!channel) return 0;

  const timeString = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const viewershipPoint = channel.viewership.find((v) => v.time === timeString);
  return viewershipPoint ? viewershipPoint.viewers : 0;
};

export function TVSchedule() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("grid");
  const [hourWidth, setHourWidth] = useState(450);
  const [hoverInfo, setHoverInfo] = useState(null);
  const scrollContainerRef = useRef(null);
  const now = new Date();
  const maxViewership = getMaxViewership();

  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date(now);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setHours(21, 0, 0, 0);
    return { start, end };
  });

  const [brushStart, setBrushStart] = useState(null);
  const [brushEnd, setBrushEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [currentTime, setCurrentTime] = useState(now);

  const handleBrushStart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setBrushStart(x);
    setBrushEnd(x);
    setIsDragging(true);
  };

  const handleBrushMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, totalWidth));
      setBrushEnd(x);
    }
  };

  const handleBrushEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (brushStart !== null && brushEnd !== null) {
        const startTime = new Date(
          timeRange.start.getTime() +
            (brushStart / totalWidth) * 24 * 60 * 60 * 1000
        );
        const endTime = new Date(
          timeRange.start.getTime() +
            (brushEnd / totalWidth) * 24 * 60 * 60 * 1000
        );
        setTimeRange({ start: startTime, end: endTime });
        setHourWidth((totalWidth / (endTime - startTime)) * (60 * 60 * 1000));
      }
      setBrushStart(null);
      setBrushEnd(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleBrushEnd);
    return () => {
      document.removeEventListener("mouseup", handleBrushEnd);
    };
  }, [isDragging]);

  const renderTimelineMarks = () => {
    const marks = [];
    for (let i = 0; i <= HOURS_IN_DAY * 12; i++) {
      const left = (i / 12) * hourWidth;
      const height =
        i % 12 === 0 ? 20 : i % 6 === 0 ? 15 : i % 3 === 0 ? 10 : 5;
      marks.push(
        <div
          key={i}
          className="absolute top-0 w-px bg-gray-200 dark:bg-gray-800"
          style={{
            left: `${left}px`,
            height: `${height}px`,
          }}
        />
      );
      if (i % 12 === 0) {
        const hour = i / 12 + 9; // Adjusted to start from 9am
        marks.push(
          <span
            key={`label-${i}`}
            className="absolute top-6 text-xs font-medium text-gray-500"
            style={{ left: `${left + 4}px` }}
          >
            {`${hour === 12 ? "12" : hour > 12 ? hour - 12 : hour}${
              hour >= 12 ? "PM" : "AM"
            }`}
          </span>
        );
      }
    }
    return marks;
  };

  // Function to render viewership graph for a channel
  const renderViewershipGraph = (channelId) => {
    const minutesPerPoint = 5;
    const pointsCount = (24 * 60) / minutesPerPoint;

    const dataPoints = useMemo(() => {
      const points = [];
      let maxViewersForChannel = 0;
      let maxViewersTime = null;
      let totalViewers = 0;

      for (let i = 0; i < pointsCount; i++) {
        const time = new Date(timeRange.start);
        time.setMinutes(time.getMinutes() + i * minutesPerPoint);

        if (time > currentTime) break;

        const viewers = getViewershipForTime(channelId, time);

        totalViewers += viewers;
        if (viewers > maxViewersForChannel) {
          maxViewersForChannel = viewers;
          maxViewersTime = time;
        }

        points.push({
          time,
          viewers,
          x: ((i * minutesPerPoint) / 60) * hourWidth,
          y: VIEWERSHIP_HEIGHT - (viewers / maxViewership) * VIEWERSHIP_HEIGHT,
        });
      }

      return {
        points,
        maxViewers: maxViewersForChannel,
        maxViewersTime,
        averageViewers: totalViewers / points.length,
      };
    }, [channelId, timeRange.start, hourWidth, maxViewership, currentTime]);

    // Generate smooth line path
    const linePath = dataPoints.points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prevPoint = dataPoints.points[i - 1];
      const cpX = (point.x - prevPoint.x) / 2;
      return `${acc} C ${prevPoint.x + cpX},${prevPoint.y} ${point.x - cpX},${
        point.y
      } ${point.x},${point.y}`;
    }, "");

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const timeAtX = new Date(
        timeRange.start.getTime() + (x / hourWidth) * 60 * 60 * 1000
      );
      const viewers = getViewershipForTime(channelId, timeAtX);
      const y =
        VIEWERSHIP_HEIGHT - (viewers / maxViewership) * VIEWERSHIP_HEIGHT;

      setHoverInfo({
        x,
        y,
        time: timeAtX,
        viewers,
        pageX: e.pageX,
        pageY: e.pageY,
        channelId,
      });
    };

    const handleMouseLeave = () => setHoverInfo(null);

    const currentX =
      ((currentTime - timeRange.start) / (1000 * 60 * 60)) * hourWidth;
    const currentViewership = getViewershipForTime(channelId, currentTime);
    const currentY =
      VIEWERSHIP_HEIGHT -
      (currentViewership / maxViewership) * VIEWERSHIP_HEIGHT;

    return (
      <g className="viewership-graph">
        {/* Base line */}
        <line
          x1="0"
          y1={VIEWERSHIP_HEIGHT}
          x2={totalWidth}
          y2={VIEWERSHIP_HEIGHT}
          stroke="#374151"
          strokeWidth="4"
          className="opacity-20 hidden"
        />

        {/* Main line graph */}
        <path
          d={linePath}
          fill="none"
          stroke="#EB8317"
          strokeWidth="2.5"
          className="opacity-100"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current viewership dot and label */}
        <g transform={`translate(${currentX},${currentY})`}>
          <circle r="4" fill="#EB8317" className="animate-pulse" />
          <circle r="6" fill="#EB8317" className="opacity-20" />
          {/* <text
          x="8"
          y="0"
          dy=".3em"
          fill="#EB8317"
          className="text-xs font-medium"
        >
          {formatViewers(currentViewership)} viewers
        </text> */}
        </g>

        {/* Peak viewership indicator */}
        <g
          transform={`translate(${
            ((dataPoints.maxViewersTime - timeRange.start) / (1000 * 60 * 60)) *
            hourWidth
          },${
            VIEWERSHIP_HEIGHT -
            (dataPoints.maxViewers / maxViewership) * VIEWERSHIP_HEIGHT
          })`}
        >
          <Sparkles
            size={25}
            fill="#FFE700"
            stroke="#EB8317"
            strokeWidth={1.5}
            className="animate-pulse"
          />
          <text
            x="0"
            y="0"
            fill="#006BFF"
            className="text-xs font-bold "
            dy=".3em"
          >
            Peak: {formatViewers(dataPoints.maxViewers)}
          </text>
        </g>
      </g>
    );
  };

  const filteredPrograms = allPrograms.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLive = (program) => {
    const now = new Date();
    const start = new Date(
      `${selectedDate.toDateString()} ${program.startTime}`
    );
    const end = new Date(`${selectedDate.toDateString()} ${program.endTime}`);

    // Handle programs that end after midnight
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    return now >= start && now <= end;
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

  const toggleFavorite = (programId) => {
    setFavorites((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

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
                // onMouseDown={handleBrushStart}
                // onMouseMove={handleBrushMove}
              >
                <div className="relative h-full">
                  {renderTimelineMarks()}
                  {brushStart !== null && brushEnd !== null && (
                    <div
                      className="absolute top-0 h-full bg-blue-200 dark:bg-blue-800 opacity-50"
                      style={{
                        left: `${Math.min(brushStart, brushEnd)}px`,
                        width: `${Math.abs(brushEnd - brushStart)}px`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Programs */}
              <div className="relative bg-popover/50 dark:bg-black/50">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="relative border-b border-gray-200 dark:border-gray-800"
                    style={{ height: CHANNEL_HEIGHT }}
                  >
                    <svg
                      className="absolute top-5 left-0 h-full w-full z-50"
                      style={{ height: VIEWERSHIP_HEIGHT }}
                      preserveAspectRatio="none"
                    >
                      {renderViewershipGraph(channel.id)}
                    </svg>

                    {filteredPrograms
                      .filter((program) => program.channel === channel.id)
                      .map((program) => {
                        const start = new Date(
                          `${selectedDate.toDateString()} ${program.startTime}`
                        );
                        const end = new Date(
                          `${selectedDate.toDateString()} ${program.endTime}`
                        );

                        // Handle programs that end after midnight
                        if (end < start) {
                          end.setDate(end.getDate() + 1);
                        }

                        const isLiveProgram = isLive(program);

                        const left =
                          ((start - timeRange.start) / (1000 * 60 * 60)) *
                          hourWidth;
                        const width =
                          ((end - start) / (1000 * 60 * 60)) * hourWidth;

                        if (left + width < 0 || left > totalWidth) {
                          return null;
                        }

                        return (
                          <div
                            key={program.id}
                            className={`absolute top-3 bottom-3 rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:z-10
                                ${
                                  isLiveProgram
                                    ? "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800"
                                    : program.type === "ad"
                                    ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800"
                                    : "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                }
                                backdrop-blur-sm group overflow-hidden`}
                            style={{
                              left: `${Math.max(0, left)}px`,
                              width: `${Math.min(width, totalWidth - left)}px`,
                            }}
                            onClick={() => setSelectedProgram(program)}
                          >
                            <div className="flex justify-between items-start h-full p-3">
                              <div className="flex-1 min-w-0">
                                {program.type === "show" && (
                                  <div className="font-medium truncate group-hover:whitespace-normal">
                                    {program.title}
                                    {isLiveProgram && (
                                      <span className="ml-2 text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded-full">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                )}
                                {program.description && (
                                  <div className="mt-1 flex flex-col text-xs text-gray-500 truncate group-hover:whitespace-normal">
                                    {program.description}
                                    <span className="mt-1 text-gray-400">
                                      {new Date(
                                        program.startTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                      {" - "}
                                      {new Date(
                                        program.endTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
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

      {/* Program details modal */}
      {selectedProgram && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative h-48 bg-gradient-to-b from-muted to-background">
              <Button
                variant="icon"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setSelectedProgram(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {selectedProgram.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(
                          `${selectedDate.toDateString()} ${
                            selectedProgram.startTime
                          }`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                        {" - "}
                        {new Date(
                          `${selectedDate.toDateString()} ${
                            selectedProgram.endTime
                          }`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {selectedDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {selectedProgram.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProgram.description}
                </p>
              )}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    alert("Reminder set for " + selectedProgram.title);
                    setSelectedProgram(null);
                  }}
                >
                  Set Reminder
                </Button>
                {isLive(selectedProgram) && (
                  <Button
                    variant="default"
                    className="flex-1 bg-red-500 hover:bg-red-500/90"
                    onClick={() => {
                      alert("Launching " + selectedProgram.title);
                      setSelectedProgram(null);
                    }}
                  >
                    Watch Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TVSchedule;
