"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { epgData, timeToMinutes } from "./epg-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomRangeSlider from "./custom-range-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramDialog from "./program-dialog";
import DownloadDialog from "./download-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MINUTES_IN_DAY = 24 * 60;
const FIXED_WIDTH = 9600;

const getUniqueChannels = (data) => [...new Set(data.map((item) => item.channel))];
const getUniqueBrands = (data) => [...new Set(data.filter((item) => item.type === "advertisement").map((item) => item.brand).filter(Boolean))];
const getUniqueContentTypes = (data) => [...new Set(data.map((item) => item.type))];

const TimelineRuler = ({ timeRange }) => {
  const startHour = Math.floor(timeRange[0] / 60);
  const endHour = Math.ceil(timeRange[1] / 60);
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const minutesInRange = timeRange[1] - timeRange[0];
  const pixelsPerMinute = FIXED_WIDTH / minutesInRange;

  const isVeryZoomedIn = pixelsPerMinute > 15;
  const isZoomedIn = pixelsPerMinute > 8;
  const isSlightlyZoomedIn = pixelsPerMinute > 4;

  const formatMinute = (hour, minute) => `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

  return (
    <div className="h-10 bg-popover border-y border-muted">
      {hours.map((hour) => {
        const left = (hour * 60 - timeRange[0]) * pixelsPerMinute;
        return (
          <div key={hour} className="absolute" style={{ left: `${left}px` }}>
            <div className="absolute h-10 w-px bg-muted-foreground/30" />
            <div className="absolute -left-6 top-2 w-12 text-center">
              <span className="text-xs font-medium text-foreground">{formatMinute(hour, 0)}</span>
            </div>
            {Array.from({ length: 60 }, (_, minute) => {
              const isQuarter = minute % 15 === 0;
              const isFive = minute % 5 === 0;
              const minuteLeft = minute * pixelsPerMinute;

              if (minute === 0) return null;
              if (!isSlightlyZoomedIn && !isQuarter) return null;
              if (!isZoomedIn && !isQuarter && !isFive) return null;

              return (
                <div key={minute} className="absolute" style={{ left: `${minuteLeft}px` }}>
                  <div
                    className={`absolute w-px transition-all ${
                      isQuarter
                        ? "h-6 bg-muted-foreground/20"
                        : isFive
                        ? "h-3 bg-muted-foreground/10"
                        : isVeryZoomedIn
                        ? "h-2 bg-muted-foreground/10"
                        : ""
                    }`}
                  />
                  {((isVeryZoomedIn && minute % 1 === 0) || (isZoomedIn && isFive) || (isSlightlyZoomedIn && isQuarter)) && (
                    <div className="absolute -left-6 top-2 w-12 text-center">
                      <span className={`text-[10px] text-muted-foreground ${isQuarter ? "font-medium" : ""}`}>
                        {formatMinute(hour, minute)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const EPG = () => {
  const [timeRange, setTimeRange] = useState([0, MINUTES_IN_DAY]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");

  const channels = getUniqueChannels(epgData);
  const brands = getUniqueBrands(epgData);
  const contentTypes = getUniqueContentTypes(epgData);

  const minutesInRange = timeRange[1] - timeRange[0];
  const pixelsPerMinute = FIXED_WIDTH / minutesInRange;
  const adjustedEndTime = Math.ceil(timeRange[1] / 60) * 60;
  const dynamicWidth = (adjustedEndTime - timeRange[0]) * pixelsPerMinute;

  const filteredData = epgData.filter((program) => {
    const matchesDate = program.date === selectedDate;
    const matchesBrand = selectedBrand === "all" || program.brand === selectedBrand;
    const matchesContentType = selectedContentType === "all" || program.type === selectedContentType;
    return matchesDate && matchesBrand && matchesContentType;
  });

  const handlePrevDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate.toISOString().split("T")[0];
    });
  };

  const handleNextDate = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate.toISOString().split("T")[0];
    });
  };

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const squircle = (cornerRadius) => (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: Math.sign(cos) * Math.pow(Math.abs(cos), 2 / cornerRadius),
      y: Math.sign(sin) * Math.pow(Math.abs(sin), 2 / cornerRadius),
    };
  };
  const squircleClipPath = (width, height, cornerRadius = 4) =>
    new Array(360)
      .fill(0)
      .map((_, i) => i)
      .map(toRadians)
      .map(squircle(cornerRadius))
      .map(({ x, y }) => ({
        x: Math.round(((x * width) / 2 + width / 2) * 50) / 50,
        y: Math.round(((y * height) / 2 + height / 2) * 10) / 10,
      }))
      .map(({ x, y }) => `${x}px ${y}px`)
      .join(", ");

  const renderProgramBlock = (program, timeRange) => {
    const startMinutes = timeToMinutes(program.start);
    const endMinutes = timeToMinutes(program.end);
    if (endMinutes <= timeRange[0] || startMinutes >= timeRange[1]) return null;

    const visibleStart = Math.max(startMinutes, timeRange[0]);
    const visibleEnd = Math.min(endMinutes, timeRange[1]);
    const width = (visibleEnd - visibleStart) * pixelsPerMinute;
    const left = (visibleStart - timeRange[0]) * pixelsPerMinute;

    const isSong = program.type === "song";
    const isadvertisement = program.type === "advertisement";
    const isProgram = program.type === "program";
    const isJingle = program.type === "jingle";
    const isNotDetected = program.type === "notDetected";

    const isVeryNarrow = width < 80;
    const isNarrow = width < 120;

    const typeStyles = {
      song: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50",
      advertisement: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-100 dark:border-rose-900/50",
      program: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50",
      jingle: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-300 border-violet-100 dark:border-violet-900/50",
      notDetected: "bg-muted text-muted-foreground border-muted",
    };

    return (
      <motion.div
        key={program.id}
        className={`absolute h-24 overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${
          isNotDetected
            ? typeStyles.notDetected
            : isSong
            ? typeStyles.song
            : isadvertisement
            ? typeStyles.advertisement
            : isProgram
            ? typeStyles.program
            : typeStyles.jingle
        } ${isVeryNarrow ? "p-1" : "p-2"}`}
        style={{ left: `${left}px`, width: `${width}px` }}
        onClick={isNotDetected ? undefined : () => setSelectedProgram(program)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="h-full flex flex-col justify-between">
          {!isVeryNarrow && (
            <h3 className="text-xs font-medium leading-tight line-clamp-2 group-hover:line-clamp-none">
              {program.program}
            </h3>
          )}
          {isVeryNarrow && (
            <div className="tooltip-container">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-lg">•</span>
              </div>
              <div className="absolute hidden group-hover:block z-50 bg-popover shadow-lg rounded-md p-2 -left-2 top-8 w-48 border border-muted">
                <p className="text-xs text-foreground">{program.program}</p>
              </div>
            </div>
          )}
          <div className={`flex items-center gap-1 text-[10px] ${isVeryNarrow ? "flex-col" : ""}`}>
            <span className="px-1.5 py-0.5 rounded-full bg-popover/80">{`${program.start} - ${program.end}`}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-[90vh] flex flex-col rounded-xl border border-muted bg-popover shadow-sm overflow-hidden">
      <header className="p-4 border-b border-muted">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-medium text-foreground">Sports Guide</h1>
          <div className="flex items-center gap-3">
            <DownloadDialog channels={channels} selectedDate={selectedDate} />
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1.5">
              <Button
                onClick={handlePrevDate}
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-foreground px-3">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <Button
                onClick={handleNextDate}
                size="icon"
                variant="ghost"
                className="h-8 w-8 hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-48 bg-popover border-muted text-foreground">
              <SelectValue placeholder="Filter by advertisement Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All advertisement Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger className="w-48 bg-popover border-muted text-foreground">
              <SelectValue placeholder="Filter by Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content Types</SelectItem>
              {contentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3">
          <CustomRangeSlider
            min={0}
            max={MINUTES_IN_DAY}
            step={1}
            value={timeRange}
            onChange={setTimeRange}
          />
        </div>
      </header>

      <ProgramDialog selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 flex-shrink-0 bg-muted/50 border-r border-muted">
          <div className="h-10" />
          {channels.map((channel, index) => (
            <div
              key={index}
              className="h-24 flex items-center px-3 border-b border-muted/50"
            >
              <img
                src={`/images/${channel.toLowerCase().trim().replace(/\s+/g, "-")}.png`}
                alt={channel}
                className="h-8 w-8 rounded-md object-cover mr-2"
                style={{ clipPath: `polygon(${squircleClipPath(32, 32, 4)})` }}
              />
              <span className="text-xs font-medium text-foreground">{channel}</span>
            </div>
          ))}
        </div>
        <ScrollArea className="flex-1 bg-popover">
          <div
            className="relative"
            style={{ width: `${dynamicWidth}px`, height: `${channels.length * 96}px` }}
          >
            <TimelineRuler timeRange={timeRange} />
            {channels.map((channel, channelIndex) => {
              const channelPrograms = filteredData
                .filter((p) => p.channel === channel)
                .filter((program) => {
                  const startMinutes = timeToMinutes(program.start);
                  const endMinutes = timeToMinutes(program.end);
                  return !(endMinutes <= timeRange[0] || startMinutes >= timeRange[1]);
                });

              return (
                <div
                  key={channel}
                  className="absolute left-0 right-0 h-24 top-[40px]"
                  style={{ top: `${channelIndex * 96 + 40}px` }}
                >
                  {channelPrograms.map((program) => renderProgramBlock(program, timeRange))}
                </div>
              );
            })}
          </div>
          <ScrollBar
            orientation="horizontal"
            className="bg-muted/50"
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export default EPG;