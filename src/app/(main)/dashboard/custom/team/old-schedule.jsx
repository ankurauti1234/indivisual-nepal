"use client";
import { useState, useRef, useEffect, useMemo } from "react"; 
import { Button } from "@/components/ui/button";
import {
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
const VIEWERSHIP_HEIGHT = 60;

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
  const maxViewership = getMaxViewership();

  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  });

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
        averageViewers: totalViewers / pointsCount,
      };
    }, [channelId, timeRange.start, hourWidth, maxViewership]);

    const areaPath = dataPoints.points.reduce((acc, point, i) => {
      if (i === 0) {
        return `M ${point.x},${point.y}`;
      }
      const prevPoint = dataPoints.points[i - 1];
      const cpX = (point.x - prevPoint.x) / 2;
      return `${acc} C ${prevPoint.x + cpX},${prevPoint.y} ${point.x - cpX},${
        point.y
      } ${point.x},${point.y}`;
    }, "");

    const areaPathClosed = `${areaPath} L ${
      dataPoints.points[dataPoints.points.length - 1].x
    },${VIEWERSHIP_HEIGHT} L ${dataPoints.points[0].x},${VIEWERSHIP_HEIGHT} Z`;

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

    return (
      <g className="viewership-graph">
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

        <path
          d={areaPathClosed}
          fill={`url(#gradient-${channelId})`}
          className="transition-opacity duration-200"
        />

        <path
          d={areaPath}
          fill="none"
          stroke="#FF9D23"
          strokeWidth="2"
          className="opacity-70"
        />

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
          <text x="8" y="-8" fill="#FF9D23" className="text-xs font-medium" dy=".3em">
            Peak: {formatViewers(dataPoints.maxViewers)}
          </text>
        </g>

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

              <circle
                cx={hoverInfo.x}
                cy={hoverInfo.y}
                r="4"
                fill="#FF9D23"
                className="transition-transform duration-75"
              />

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

  const totalWidth = HOURS_IN_DAY * hourWidth;

  const handleZoom = (zoomIn) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      const centerTime =
        timeRange.start.getTime() +
        ((scrollLeft + containerWidth / 2) / hourWidth) * (60 * 60 * 1000);

      const oldHourWidth = hourWidth;
      const newHourWidth = Math.min(
        Math.max(zoomIn ? hourWidth + 30 : hourWidth - 30, MIN_HOUR_WIDTH),
        MAX_HOUR_WIDTH
      );

      setHourWidth(newHourWidth);

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = "smooth";

      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.scrollBehavior = "auto";
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [hourWidth]);

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
      <div className="bg-popover backdrop-blur-lg border-b border-border p-6 sticky top-0 z-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="relative flex h-full">
          <div className="w-48 flex-none border-r border-border bg-background/95 backdrop-blur-lg">
            <div
              style={{ height: TIMELINE_HEIGHT }}
              classNameclassName="border-b border-border"
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

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
          >
            <div className="relative" style={{ width: `${totalWidth}px` }}>
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
                            className={`absolute top-2 bottom-2 rounded-lg shadow-inner cursor-pointer
                                ${
                                  program.type === "ad"
                                    ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border-red-500/50"
                                    : "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 dark:border-zinc-700 p-3"
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
              </div>
            </div>
          </div>
        </div>
      </div>

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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TVSchedule;