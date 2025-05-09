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

const MIN_HOUR_WIDTH = 75;
const MAX_HOUR_WIDTH = 500;
const TIMELINE_HEIGHT = 60;
const CHANNEL_HEIGHT = 120;
const HOURS_IN_DAY = 24;
const VIEWERSHIP_HEIGHT = 60; // Height for viewership graph



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
  const [hourWidth, setHourWidth] = useState(240);
  const [hoverInfo, setHoverInfo] = useState(null);
  const scrollContainerRef = useRef(null);
  const now = new Date();
  const maxViewership = getMaxViewership();

  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  });

  const [currentTime, setCurrentTime] = useState(now);

  // Function to render viewership graph for a channel
const renderViewershipGraph = (channelId) => {
  const minutesPerPoint = 5;
  const pointsCount = (24 * 60) / minutesPerPoint;

  // Calculate viewership data points
  const dataPoints = useMemo(() => {
    const points = [];
    let maxViewersForChannel = 0;
    let maxViewersTime = null;
    let totalViewers = 0;

    for (let i = 0; i < pointsCount; i++) {
      const time = new Date(timeRange.start);
      time.setMinutes(time.getMinutes() + i * minutesPerPoint);

      // Only include points up to current time
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
  }, [channelId, timeRange.start, hourWidth, maxViewership, currentTime]); // Add currentTime dependency

  // Generate the path for the area chart up to current time
  const areaPath = dataPoints.points.reduce((acc, point, i) => {
    if (i === 0) {
      return `M ${point.x},${point.y}`;
    }
    // Use cubic bezier curves for smoother lines
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
        x: x,
        y: y,
        time: timeAtX,
        viewers: viewers,
        pageX: e.pageX,
        pageY: e.pageY,
        channelId: channelId,
      });
    };

    const handleMouseLeave = () => {
      setHoverInfo(null);
    };


  // Calculate current time position for the area fill
  const currentX =
    ((currentTime - timeRange.start) / (1000 * 60 * 60)) * hourWidth;

  // Add the bottom part of the area, but only up to current time
  const areaPathClosed = `${areaPath} L ${currentX},${VIEWERSHIP_HEIGHT} L ${dataPoints.points[0].x},${VIEWERSHIP_HEIGHT} Z`;

  // Calculate current viewership
  const currentViewership = getViewershipForTime(channelId, currentTime);
  const currentY =
    VIEWERSHIP_HEIGHT - (currentViewership / maxViewership) * VIEWERSHIP_HEIGHT;

  return (
    <g className="viewership-graph">
      {/* Gradient definition */}
      <defs>
        <linearGradient
          id={`gradient-${channelId}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#FF9D23" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF9D23" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Background grid lines */}
      {[0.25, 0.5, 0.75].map((ratio) => (
        <line
          key={ratio}
          x1="0"
          y1={VIEWERSHIP_HEIGHT * ratio}
          x2={totalWidth}
          y2={VIEWERSHIP_HEIGHT * ratio}
          stroke="#666"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          className="opacity-20"
        />
      ))}

      {/* Area fill up to current time */}
      <path
        d={areaPathClosed}
        fill={`url(#gradient-${channelId})`}
        className="transition-opacity duration-200"
      />

      {/* Line on top up to current time */}
      <path
        d={areaPath}
        fill="none"
        stroke="#FF9D23"
        strokeWidth="2"
        className="opacity-70"
      />

      {/* Current viewership indicator */}
      <g transform={`translate(${currentX},${currentY})`}>
        <circle r="4" fill="#FF9D23" className="animate-pulse z-50" />
        <text
          x="8"
          y="0"
          dy=".3em"
          fill="#FF9D23"
          className="text-xs font-medium"
        >
          {formatViewers(currentViewership)} viewers
        </text>
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
        <Star
          size={22}
          fill="#FFD95A"
          stroke="#FF9D23"
          transform="translate(0 9)"
          className="animate-pulse z-50 -translate-y-8"
        />
        <text
          x="8"
          y="-8"
          fill="#FF9D23"
          className="text-xs font-medium"
          dy=".3em"
        >
          Peak: {formatViewers(dataPoints.maxViewers)}
        </text>
      </g>

      {/* Hover interaction area */}
      <rect
        x="0"
        y="0"
        width={totalWidth}
        height={VIEWERSHIP_HEIGHT}
        fill="transparent"
        className="cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const timeAtX = new Date(
            timeRange.start.getTime() + (x / hourWidth) * 60 * 60 * 1000
          );
          const viewers = getViewershipForTime(channelId, timeAtX);
          // You could update some state here to show a tooltip
        }}
      />
      {/* Hover interaction area with tooltip */}
      <TooltipProvider>
        <rect
          x="0"
          y="0"
          width={totalWidth}
          height={VIEWERSHIP_HEIGHT}
          fill="transparent"
          className="cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {hoverInfo && hoverInfo.channelId === channelId && (
          <>
            {/* Vertical time indicator line */}
            <line
              x1={hoverInfo.x}
              y1="0"
              x2={hoverInfo.x}
              y2={VIEWERSHIP_HEIGHT}
              stroke="#666"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="opacity-50"
            />

            {/* Hover point indicator */}
            <circle
              cx={hoverInfo.x}
              cy={hoverInfo.y}
              r="4"
              fill="#FF9D23"
              className="transition-transform duration-75"
            />

            {/* Tooltip */}
            <foreignObject
              x={hoverInfo.x + 10}
              y={hoverInfo.y - 40}
              width="200"
              height="80"
              className="overflow-visible"
            >
              <div className="bg-popover/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
                <div className="font-medium">
                  {hoverInfo.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Users className="h-3 w-3" />
                  {formatViewers(hoverInfo.viewers)} viewers
                </div>
              </div>
            </foreignObject>
          </>
        )}
      </TooltipProvider>
    </g>
  );
};

  const filteredPrograms = allPrograms.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLive = (program) => {
    const start = new Date(program.startTime);
    const end = new Date(program.endTime);
    return currentTime >= start && currentTime <= end;
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
              <Radio className="h-4 w-4 text-destructive animate-pulse" />
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
                  src={channel.logo}
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
                className="sticky top-0 border-b border-border bg-background/95 backdrop-blur-lg z-10"
                style={{ height: TIMELINE_HEIGHT }}
              >
                <div className="relative h-full">
                  {Array.from({ length: HOURS_IN_DAY + 1 }).map((_, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-full border-l border-border"
                      style={{ left: `${index * hourWidth}px` }}
                    >
                      <span className="absolute left-2 top-4 text-sm font-medium text-muted-foreground">
                        {`${
                          index === 0 ? "12" : index > 12 ? index - 12 : index
                        }:00${index >= 12 ? "PM" : "AM"}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Programs */}
              <div className="relative bg-background/50">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="relative border-b border-border"
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
                        const start = new Date(program.startTime);
                        const end = new Date(program.endTime);
                        const isLiveProgram = isLive(program);

                        const left =
                          ((start - timeRange.start) / (1000 * 60 * 60)) *
                          hourWidth;
                        const width =
                          ((end - start) / (1000 * 60 * 60)) * hourWidth;

                        // Only render if the program should be visible
                        if (left + width < 0 || left > totalWidth) {
                          return null;
                        }

                        return (
                          <div
                            key={program.id}
                            className={`absolute top-2 bottom-2 rounded- shadow-inner cursor-pointer
                                ${
                                  isLiveProgram
                                    ? "bg-green-400/10 hover:bg-green-400/20 border border-green-400/50 dark:bg-green-400/20 dark:hover:bg-green-400/30 dark:border-green-400/50  p-3"
                                    : program.type === "ad"
                                    ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border-red-500/50"
                                    : "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 dark:border-zinc-700  p-3"
                                }

                                backdrop-blur-sm transition-all duration-200 group overflow-hidden`}
                            style={{
                              left: `${Math.max(0, left)}px`,
                              width: `${Math.min(width, totalWidth - left)}px`,
                            }}
                            onClick={() => setSelectedProgram(program)}
                          >
                            <div className="flex justify-between items-start h-full">
                              <div className="flex-1 min-w-0">
                                {program.type === "show" && (
                                  <div className="font-medium truncate group-hover:whitespace-normal">
                                    {program.title}
                                    {isLiveProgram && (
                                      <span className="ml-2 text-xs bg-destructive/40 border border-destructive/50 px-1.5 p-0.5 rounded-lg">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                )}
                                {program.description && (
                                  <div className="mt-1 flex flex-col text-xs text-muted-foreground truncate group-hover:whitespace-normal">
                                    {program.description}
                                    <span>
                                      {new Date(
                                        program.startTime
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}{" "}
                                      -{" "}
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
                  className="absolute top-0 h-full w-0.5 bg-destructive shadow-2xl z-10"
                  style={{
                    left: `${
                      ((currentTime - timeRange.start) / (1000 * 60 * 60)) *
                      hourWidth
                    }px`,
                  }}
                >
                  <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-destructive shadow-lg" />
                  {/* Display current time with seconds */}
                  <span
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-xs text-destructive font-bold bg-card px-2 border rounded-lg"
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
                          selectedProgram.startTime
                        ).toLocaleTimeString()}{" "}
                        -{" "}
                        {new Date(selectedProgram.endTime).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(
                          selectedProgram.startTime
                        ).toLocaleDateString()}
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
                    className="flex-1 bg-destructive hover:bg-destructive/90"
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
