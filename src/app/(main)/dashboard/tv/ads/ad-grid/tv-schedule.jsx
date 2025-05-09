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
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { tvdata } from "./tvData";
import { Input } from "@/components/ui/input";

const MIN_HOUR_WIDTH = 2500;
const MAX_HOUR_WIDTH = 4500;
const TIMELINE_HEIGHT = 60;
const CHANNEL_HEIGHT = 120;
const HOURS_IN_DAY = 24;

export function TVSchedule() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourWidth, setHourWidth] = useState(2500);
  const scrollContainerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date(currentTime);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  });

  const totalWidth = HOURS_IN_DAY * hourWidth;

  const channels = Object.keys(tvdata).map((id) => ({
    id,
    name: tvdata[id][0].channel_name,
  }));

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

  const isLive = (program) => {
    const start = new Date(selectedDate);
    const [startHours, startMinutes] = program.start_time
      .split(":")
      .map(Number);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(selectedDate);
    const [endHours, endMinutes] = program.end_time.split(":").map(Number);
    end.setHours(endHours, endMinutes, 0, 0);

    return currentTime >= start && currentTime <= end;
  };

  return (
    <div className="min-h-[50vh] w-full bg-card text-foreground border overflow-hidden">
      {/* Header */}
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
                    {tvdata[channel.id]
                      .filter((program) =>
                        program.program_title
                          ? program.program_title
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((program, index) => {
                        const [startHours, startMinutes] = program.start_time
                          .split(":")
                          .map(Number);
                        const [endHours, endMinutes] = program.end_time
                          .split(":")
                          .map(Number);

                        const start = new Date(selectedDate);
                        start.setHours(startHours, startMinutes, 0, 0);

                        const end = new Date(selectedDate);
                        end.setHours(endHours, endMinutes, 0, 0);

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
                            key={index}
                            className={`absolute top-2 bottom-2 rounded-none shadow-inner cursor-pointer
  ${
    isLiveProgram
      ? "bg-green-400/10 hover:bg-green-400/20 border border-green-400/50 dark:bg-green-400/20 dark:hover:bg-green-400/30 dark:border-green-400/50 p-3"
      : program.type === "ad"
      ? isLiveProgram
        ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 dark:bg-red-500/30 dark:hover:bg-red-500/40 dark:border-red-500/60 p-3"
        : "bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border-red-500/50"
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
                                {program.type === "program" ? (
                                  <div className="font-medium truncate group-hover:whitespace-normal">
                                    {program.program_title}
                                    {isLiveProgram && (
                                      <span className="ml-2 text-xs bg-destructive/40 border border-destructive/50 px-1.5 p-0.5 rounded-lg">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="font-medium truncate group-hover:whitespace-normal">
                               
                                      {program.brand_name}

                                      {isLiveProgram && (
                                        <span className="ml-2 text-xs bg-destructive/40 border border-destructive/50 px-1.5 p-0.5 rounded-lg">
                                          LIVE
                                        </span>
                                      )}

                                  </div>
                                )}
                                {program.genre && (
                                  <div className="mt-1 flex flex-col text-xs text-muted-foreground truncate group-hover:whitespace-normal">
                                    {program.genre}
                                    <span>
                                      {program.start_time} - {program.end_time}
                                    </span>
                                  </div>
                                )}

                                {program.industry && (
                                  <div className="mt-1 flex flex-col text-xs text-muted-foreground truncate group-hover:whitespace-normal">
                                    {program.industry}
                                    <span>
                                      {program.start_time} - {program.end_time}
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
                      {selectedProgram.program_title ||
                        selectedProgram.brand_name}
                    </h2>
                    <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedProgram.start_time} -{" "}
                        {selectedProgram.end_time}
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
             
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProgram.genre || selectedProgram.industry}
                </p>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TVSchedule;
