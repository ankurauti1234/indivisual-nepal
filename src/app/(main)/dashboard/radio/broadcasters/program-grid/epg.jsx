"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { epgData, timeToMinutes } from "./epg-data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CustomRangeSlider from "./custom-range-slider";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgramDialog from "./program-dialog";
import DownloadDialog from "./download-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";

const MINUTES_IN_DAY = 24 * 60;
const FIXED_WIDTH = 9600;

// Dummy data for radio stations and cities
const radioStations = ["Radio Mirchi", "Suryan FM", "Hello FM", "Big FM"];
const cities = ["Trichy", "Chennai", "Madurai", "Coimbatore"];

const getUniqueChannels = (data, selectedDate) => {
  const filteredPrograms = data.filter((item) => item.date === selectedDate);
  return [...new Set(filteredPrograms.map((item) => item.channel))];
};
const getUniqueBrands = (data) => [...new Set(data.filter((item) => item.type === "ad").map((item) => item.brand).filter(Boolean))];
const getUniqueContentTypes = (data) => [...new Set(data.map((item) => item.type))];

// Utility to format minutes to HH:mm:ss for URL
const formatTimeForURL = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
};

// Utility to parse HH:mm:ss to minutes
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

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
    <div className="h-12 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-y border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
      {hours.map((hour) => {
        const left = (hour * 60 - timeRange[0]) * pixelsPerMinute;
        return (
          <div key={hour} className="absolute" style={{ left: `${left}px` }}>
            <div className="absolute h-12 w-px bg-zinc-300/70 dark:bg-zinc-600/70" />
            <div className="absolute -left-8 top-2 w-16 text-center">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{formatMinute(hour, 0)}</span>
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
                      isQuarter ? "h-8 bg-zinc-300/50 dark:bg-zinc-600/50" : isFive ? "h-4 bg-zinc-200/40 dark:bg-zinc-700/40" : isVeryZoomedIn ? "h-2 bg-zinc-200/30 dark:bg-zinc-700/30" : ""
                    }`}
                  />
                  {((isVeryZoomedIn && minute % 1 === 0) || (isZoomedIn && isFive) || (isSlightlyZoomedIn && isQuarter)) && (
                    <div className="absolute -left-8 top-2 w-16 text-center">
                      <span className={`text-[10px] text-zinc-500 dark:text-zinc-400 ${isQuarter ? "font-medium" : ""}`}>{formatMinute(hour, minute)}</span>
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const initialStart = parseTimeToMinutes(searchParams.get("start")) || 0;
  const initialEnd = parseTimeToMinutes(searchParams.get("end")) || MINUTES_IN_DAY;

  const [timeRange, setTimeRange] = useState([initialStart, initialEnd]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");
  const [selectedRadioStation, setSelectedRadioStation] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const channels = getUniqueChannels(epgData, selectedDate);
  const brands = getUniqueBrands(epgData);
  const contentTypes = getUniqueContentTypes(epgData);

  const minutesInRange = timeRange[1] - timeRange[0];
  const pixelsPerMinute = FIXED_WIDTH / minutesInRange;
  const adjustedEndTime = Math.ceil(timeRange[1] / 60) * 60;
  const dynamicWidth = (adjustedEndTime - timeRange[0]) * pixelsPerMinute;

  // Update URL with date, start, and end times
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("date", selectedDate);
    params.set("start", formatTimeForURL(timeRange[0]));
    params.set("end", formatTimeForURL(timeRange[1]));
    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedDate, timeRange, router, searchParams]);

  // Handle time range changes from slider
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  // Filter data (relaxed filtering for radio station and city)
  const filteredData = epgData.filter((program) => {
    const matchesDate = program.date === selectedDate;
    const matchesBrand = selectedBrand === "all" || program.brand === selectedBrand;
    const matchesContentType = selectedContentType === "all" || program.type === selectedContentType;
    // Only apply radio station and city filters if explicitly supported by data
    const matchesRadioStation = selectedRadioStation === "all" || program.channel === selectedRadioStation;
    const matchesCity = selectedCity === "all" || program.channel.includes(selectedCity);
    return matchesDate && matchesBrand && matchesContentType && matchesRadioStation && matchesCity;
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

  const handleDatePickerChange = (e) => {
    const newDate = e.target.value;
    if (newDate) {
      setSelectedDate(newDate);
      setIsDatePickerOpen(false);
    }
  };

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const squircle = (cornerRadius) => (angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return { x: Math.sign(cos) * Math.pow(Math.abs(cos), 2 / cornerRadius), y: Math.sign(sin) * Math.pow(Math.abs(sin), 2 / cornerRadius) };
  };
  const squircleClipPath = (width, height, cornerRadius = 4) =>
    new Array(360)
      .fill(0)
      .map((_, i) => i)
      .map(toRadians)
      .map(squircle(cornerRadius))
      .map(({ x, y }) => ({ x: Math.round(((x * width) / 2 + width / 2) * 50) / 50, y: Math.round(((y * height) / 2 + height / 2) * 10) / 10 }))
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
    const isAd = program.type === "advertisement";
    const isProgram = program.type === "program";
    const isJingle = program.type === "jingle";
    const isNotDetected = program.type === "not detected";

    const isVeryNarrow = width < 80;
    const isNarrow = width < 120;

    const typeStyles = {
      song: "bg-gradient-to-br from-indigo-200 to-indigo-300 dark:from-indigo-700 dark:to-indigo-900 text-indigo-800 dark:text-indigo-100",
      advertisement: "bg-gradient-to-br from-rose-200 to-rose-300 dark:from-rose-700 dark:to-rose-900 text-rose-800 dark:text-rose-100",
      program: "bg-gradient-to-br from-teal-200 to-teal-300 dark:from-teal-700 dark:to-teal-900 text-teal-800 dark:text-teal-100",
      jingle: "bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-900 text-yellow-800 dark:text-yellow-100",
      notDetected: "bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300",
    };

    return (
      <motion.div
        key={program.id}
        className={`absolute h-28 overflow-hidden rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group ${
          isNotDetected ? typeStyles.notDetected : isSong ? typeStyles.song : isAd ? typeStyles.advertisement : isProgram ? typeStyles.program : typeStyles.jingle
        } ${isVeryNarrow ? "p-1" : "p-2"}`}
        style={{ left: `${left}px`, width: `${width}px` }}
        onClick={isNotDetected ? undefined : () => setSelectedProgram(program)}
        whileHover={{ scale: 1.02 }}
      >
        <div className="h-full flex flex-col justify-between">
          {!isVeryNarrow && (
            <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:line-clamp-none">{program.program}</h3>
          )}
          {isVeryNarrow && (
            <div className="tooltip-container">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-lg">•</span>
              </div>
              <div className="absolute hidden group-hover:block z-50 bg-white/95 dark:bg-zinc-800/95 shadow-xl rounded-lg p-3 -left-2 top-8 w-56 border border-zinc-200/50 dark:border-zinc-700/50">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">{program.program}</p>
              </div>
            </div>
          )}
          <div className={`flex items-center gap-1 text-xs ${isVeryNarrow ? "flex-col" : ""}`}>
            <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-zinc-800/80">{`${program.start} - ${program.end}`}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      <header className="p-6 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 border-b border-zinc-200/50 dark:border-zinc-700/50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Radio Program Guide</h1>
          <div className="flex items-center gap-4">
            <DownloadDialog channels={channels} selectedDate={selectedDate} />
            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 rounded-xl p-2 shadow-md">
              <Button onClick={handlePrevDate} size="icon" className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-lg font-medium text-zinc-800 dark:text-zinc-100 px-4">
                {new Date(selectedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <Button onClick={handleNextDate} size="icon" className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsDatePickerOpen(true)}
                size="icon"
                className="bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <Calendar className="h-5 w-5" />
              </Button>
              {isDatePickerOpen && (
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDatePickerChange}
                  onBlur={() => setIsDatePickerOpen(false)}
                  className="absolute mt-2 p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100"
                  autoFocus
                />
              )}
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
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">Ad Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by Ad Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ad Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">Content Type</label>
                <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Content Types</SelectItem>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">Radio Station</label>
                <Select value={selectedRadioStation} onValueChange={setSelectedRadioStation}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by Radio Station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Radio Stations</SelectItem>
                    {radioStations.map((station) => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-2">
                <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                    <SelectValue placeholder="Filter by City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-6">
          <CustomRangeSlider min={0} max={MINUTES_IN_DAY} step={1} value={timeRange} onChange={handleTimeRangeChange} />
        </div>
      </header>

      <ProgramDialog selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 flex-shrink-0 bg-zinc-50 dark:bg-zinc-800/50 border-r border-zinc-200/50 dark:border-zinc-700/50">
          <div className="h-12" />
          {channels.map((channel, index) => (
            <div key={index} className="h-28 flex items-center px-4 border-b border-zinc-200/20 dark:border-zinc-700/20">
              <img
                src={`/images/${channel.toLowerCase().trim().replace(/\s+/g, "-")}.png`}
                alt={channel}
                className="h-12 w-12 rounded-lg shadow-md mr-3"
                style={{ clipPath: `polygon(${squircleClipPath(48, 48, 4)})` }}
              />
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{channel}</span>
            </div>
          ))}
        </div>
        <ScrollArea className="flex-1 bg-zinc-100 dark:bg-zinc-900">
          <div className="relative" style={{ width: `${dynamicWidth}px`, height: `${channels.length * 112}px` }}>
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
                <div key={channel} className="absolute left-0 right-0 h-28 top-[48px]" style={{ top: `${channelIndex * 112 + 48}px` }}>
                  {channelPrograms.map((program) => renderProgramBlock(program, timeRange))}
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="bg-zinc-200/50 dark:bg-zinc-800/50" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default EPG;