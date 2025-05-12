"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { tvdata } from "./tvData";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isSameDay, parseISO } from "date-fns";
import ReportDownloadButton from "./download-btn";

const MIN_HOUR_WIDTH = 2500;
const MAX_HOUR_WIDTH = 4500;
const TIMELINE_HEIGHT = 60;
const CHANNEL_HEIGHT = 120;
const HOURS_IN_DAY = 24;
const PLACEHOLDER_GIF =
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmNqaHFiMnd0NjcycHR6NThoaDdyZW16bWQ5NHp1Z3QzN3RlYTg3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v2YxCO2pwHjji/giphy.gif";

export function TVSchedule() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hourWidth, setHourWidth] = useState(2500);
  const scrollContainerRef = useRef(null);
  const [timeRange, setTimeRange] = useState(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  });

  const totalWidth = HOURS_IN_DAY * hourWidth;

  const channels = Object.keys(tvdata).map((id) => ({
    id,
    name: tvdata[id][0]?.channel_name || "Unknown Channel",
  }));

  const handleZoom = (zoomIn) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      const centerTime =
        timeRange.start.getTime() +
        ((scrollLeft + containerWidth / 2) / hourWidth) * (60 * 60 * 1000);

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

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
    updateTimeRange(newDate);
  };

  const updateTimeRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    setTimeRange({ start, end });
  };

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
      updateTimeRange(date);
    }
  };

  const hasDataForDate = (date) => {
    return Object.values(tvdata).some((channel) =>
      channel.some(
        (program) =>
          program.date &&
          isSameDay(parseISO(program.date), date) &&
          program.start_time &&
          program.end_time
      )
    );
  };

  const findNearestDateWithData = () => {
    let forwardDate = new Date(selectedDate);
    let backwardDate = new Date(selectedDate);
    let days = 1;

    while (days <= 30) {
      forwardDate.setDate(selectedDate.getDate() + days);
      if (hasDataForDate(forwardDate)) {
        return new Date(forwardDate);
      }

      backwardDate.setDate(selectedDate.getDate() - days);
      if (hasDataForDate(backwardDate)) {
        return new Date(backwardDate);
      }

      days++;
    }
    return null;
  };

  const hasData = hasDataForDate(selectedDate);

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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm px-2 border-x border-border"
                    >
                      {format(selectedDate, "PPPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="icon" size="sm" onClick={() => changeDate(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
              <ReportDownloadButton />
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
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-muted-foreground">
              No data available for this date
            </p>
            <Button
              onClick={() => {
                const nearestDate = findNearestDateWithData();
                if (nearestDate) {
                  setSelectedDate(nearestDate);
                  updateTimeRange(nearestDate);
                }
              }}
              disabled={!findNearestDateWithData()}
            >
              Go to nearest date with data
            </Button>
          </div>
        ) : (
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
                    {Array.from({ length: HOURS_IN_DAY + 1 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="absolute top-0 h-full border-l border-border"
                          style={{ left: `${index * hourWidth}px` }}
                        >
                          <span className="absolute left-2 top-4 text-sm font-medium text-muted-foreground">
                            {`${
                              index === 0
                                ? "12"
                                : index > 12
                                ? index - 12
                                : index
                            }:00${index >= 12 ? "PM" : "AM"}`}
                          </span>
                        </div>
                      )
                    )}
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
                        .filter((program) => {
                          if (
                            !program?.date ||
                            !program?.start_time ||
                            !program?.end_time
                          ) {
                            return false;
                          }
                          const programDate = parseISO(program.date);
                          return (
                            isSameDay(programDate, selectedDate) &&
                            (program.program_title
                              ? program.program_title
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                              : true)
                          );
                        })
                        .map((program, index) => {
                          if (!program.start_time || !program.end_time) {
                            return null;
                          }

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
                                  program.type === "ad"
                                    ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:border-red-500/50"
                                    : "bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 dark:bg-zinc-800/50 dark:hover:bg-zinc-700/50 dark:border-zinc-700 p-3"
                                }
                                backdrop-blur-sm transition-all duration-200 group overflow-hidden`}
                              style={{
                                left: `${Math.max(0, left)}px`,
                                width: `${Math.min(
                                  width,
                                  totalWidth - left
                                )}px`,
                              }}
                              onClick={() => setSelectedProgram(program)}
                            >
                              <div className="flex justify-between items-start h-full">
                                <div className="flex-1 min-w-0">
                                  {program.type === "program" ? (
                                    <div className="font-medium truncate group-hover:whitespace-normal">
                                      {program.program_title || "Untitled"}
                                    </div>
                                  ) : (
                                    <div className="font-medium truncate group-hover:whitespace-normal">
                                      {program.brand_name || "Unknown Ad"}
                                    </div>
                                  )}
                                  {program.genre && (
                                    <div className="mt-1 flex flex-col text-xs text-muted-foreground truncate group-hover:whitespace-normal">
                                      {program.genre}
                                      <span>
                                        {program.start_time} -{" "}
                                        {program.end_time}
                                      </span>
                                    </div>
                                  )}
                                  {program.industry && (
                                    <div className="mt-1 flex flex-col text-xs text-muted-foreground truncate group-hover:whitespace-normal">
                                      {program.industry}
                                      <span>
                                        {program.start_time} -{" "}
                                        {program.end_time}
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
        )}
      </div>

      {/* Program details dialog */}
      <Dialog
        open={!!selectedProgram}
        onOpenChange={() => setSelectedProgram(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProgram?.program_title ||
                selectedProgram?.brand_name ||
                "Unknown"}
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={selectedProgram?.gif || PLACEHOLDER_GIF}
              alt="Program GIF"
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedProgram?.start_time || "N/A"} -{" "}
                {selectedProgram?.end_time || "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(selectedDate, "PP")}
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {selectedProgram?.genre ||
                selectedProgram?.industry ||
                "No details available"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TVSchedule;