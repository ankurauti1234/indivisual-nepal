import React, { useState, useMemo } from "react";
import { Radio, Filter, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RadioSectorAnalysis = () => {
  const [selectedMonths, setSelectedMonths] = useState(["jan24"]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sectors = {
    automotive: { name: "Automotive", color: "#61C988" },
    retail: { name: "Retail", color: "#ED9B40" },
    fmcg: { name: "FMCG", color: "#009DDC" },
    banking: { name: "Banking", color: "#A855F7" },
    entertainment: { name: "Entertainment", color: "#F26430" },
  };

  const months = [
    { value: "jan24", label: "January 2024", shortLabel: "Jan" },
    { value: "feb24", label: "February 2024", shortLabel: "Feb" },
    { value: "mar24", label: "March 2024", shortLabel: "Mar" },
  ];

  const regions = [
    { value: "all", label: "All Regions" },
    { value: "delhi", label: "Delhi" },
    { value: "mumbai", label: "Mumbai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "chennai", label: "Chennai" },
    { value: "bangalore", label: "Bengaluru" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "kochi", label: "Kochi" },
    { value: "pune", label: "Pune" },
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "jaipur", label: "Jaipur" },
    { value: "lucknow", label: "Lucknow" },
  ];

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "hindi", label: "Hindi" },
    { value: "marathi", label: "Marathi" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
    { value: "gujarati", label: "Gujarati" },
    { value: "bengali", label: "Bengali" },
    { value: "english", label: "English" },
  ];

  const rawData = {
    "Radio City": {
      Delhi: {
        region: "delhi",
        language: "hindi",
        monthly: {
          jan24: { automotive: 52, retail: 45, fmcg: 38, banking: 32, entertainment: 28 },
          feb24: { automotive: 54, retail: 47, fmcg: 40, banking: 34, entertainment: 29 },
          mar24: { automotive: 53, retail: 46, fmcg: 39, banking: 33, entertainment: 30 },
        },
      },
      Mumbai: {
        region: "mumbai",
        language: "marathi",
        monthly: {
          jan24: { automotive: 48, retail: 42, fmcg: 35, banking: 30, entertainment: 25 },
          feb24: { automotive: 50, retail: 44, fmcg: 37, banking: 31, entertainment: 26 },
          mar24: { automotive: 49, retail: 43, fmcg: 36, banking: 32, entertainment: 27 },
        },
      },
      Bangalore: {
        region: "bangalore",
        language: "kannada",
        monthly: {
          jan24: { automotive: 45, retail: 39, fmcg: 32, banking: 28, entertainment: 23 },
          feb24: { automotive: 47, retail: 41, fmcg: 34, banking: 29, entertainment: 24 },
          mar24: { automotive: 46, retail: 40, fmcg: 33, banking: 28, entertainment: 25 },
        },
      },
    },
    "Radio Mirchi": {
      Chennai: {
        region: "chennai",
        language: "tamil",
        monthly: {
          jan24: { automotive: 46, retail: 40, fmcg: 33, banking: 28, entertainment: 24 },
          feb24: { automotive: 48, retail: 42, fmcg: 35, banking: 30, entertainment: 25 },
          mar24: { automotive: 47, retail: 41, fmcg: 34, banking: 29, entertainment: 26 },
        },
      },
      Kolkata: {
        region: "kolkata",
        language: "bengali",
        monthly: {
          jan24: { automotive: 44, retail: 38, fmcg: 31, banking: 26, entertainment: 22 },
          feb24: { automotive: 46, retail: 40, fmcg: 33, banking: 28, entertainment: 23 },
          mar24: { automotive: 45, retail: 39, fmcg: 32, banking: 27, entertainment: 24 },
        },
      },
      Hyderabad: {
        region: "hyderabad",
        language: "telugu",
        monthly: {
          jan24: { automotive: 43, retail: 37, fmcg: 30, banking: 25, entertainment: 21 },
          feb24: { automotive: 45, retail: 39, fmcg: 32, banking: 27, entertainment: 22 },
          mar24: { automotive: 44, retail: 38, fmcg: 31, banking: 26, entertainment: 23 },
        },
      },
    },
    "Red FM": {
      Ahmedabad: {
        region: "ahmedabad",
        language: "gujarati",
        monthly: {
          jan24: { automotive: 42, retail: 36, fmcg: 29, banking: 24, entertainment: 20 },
          feb24: { automotive: 44, retail: 38, fmcg: 31, banking: 26, entertainment: 21 },
          mar24: { automotive: 43, retail: 37, fmcg: 30, banking: 25, entertainment: 22 },
        },
      },
      Pune: {
        region: "pune",
        language: "marathi",
        monthly: {
          jan24: { automotive: 41, retail: 35, fmcg: 28, banking: 23, entertainment: 19 },
          feb24: { automotive: 43, retail: 37, fmcg: 30, banking: 25, entertainment: 20 },
          mar24: { automotive: 42, retail: 36, fmcg: 29, banking: 24, entertainment: 21 },
        },
      },
      Lucknow: {
        region: "lucknow",
        language: "hindi",
        monthly: {
          jan24: { automotive: 40, retail: 34, fmcg: 27, banking: 22, entertainment: 18 },
          feb24: { automotive: 42, retail: 36, fmcg: 29, banking: 24, entertainment: 19 },
          mar24: { automotive: 41, retail: 35, fmcg: 28, banking: 23, entertainment: 20 },
        },
      },
    },
    "Big FM": {
      Kochi: {
        region: "kochi",
        language: "malayalam",
        monthly: {
          jan24: { automotive: 39, retail: 33, fmcg: 26, banking: 21, entertainment: 17 },
          feb24: { automotive: 41, retail: 35, fmcg: 28, banking: 23, entertainment: 18 },
          mar24: { automotive: 40, retail: 34, fmcg: 27, banking: 22, entertainment: 19 },
        },
      },
      Jaipur: {
        region: "jaipur",
        language: "hindi",
        monthly: {
          jan24: { automotive: 38, retail: 32, fmcg: 25, banking: 20, entertainment: 16 },
          feb24: { automotive: 40, retail: 34, fmcg: 27, banking: 22, entertainment: 17 },
          mar24: { automotive: 39, retail: 33, fmcg: 26, banking: 21, entertainment: 18 },
        },
      },
    },
  };

  // Convert nested data structure to flat array for filtering
  const flattenedData = Object.entries(rawData).flatMap(([network, stations]) =>
    Object.entries(stations).map(([city, data]) => ({
      station: `${network} ${city}`,
      ...data,
    }))
  );

  // Define filteredData
  const filteredData = useMemo(() => {
    return flattenedData
      .filter((stationData) => {
        const regionMatch =
          selectedRegion === "all" || stationData.region === selectedRegion;
        const languageMatch =
          selectedLanguage === "all" || stationData.language === selectedLanguage;
        const searchMatch = stationData.station
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return regionMatch && languageMatch && searchMatch;
      })
      .map((stationData) => ({
        station: stationData.station,
        monthlyData: selectedMonths.map((month) => ({
          month,
          ads: stationData.monthly[month] || {},
        })),
        region: stationData.region,
        language: stationData.language,
      }));
  }, [selectedMonths, selectedRegion, selectedLanguage, searchTerm, flattenedData]);

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "station") {
          aValue = a.station;
          bValue = b.station;
        } else if (sortConfig.key === "region") {
          aValue = a.region;
          bValue = b.region;
        } else if (sortConfig.key === "language") {
          aValue = a.language;
          bValue = b.language;
        } else {
          // Sort by sector for a specific month
          const [month, sector] = sortConfig.key.split("_");
          const aMonthData = a.monthlyData.find((m) => m.month === month);
          const bMonthData = b.monthlyData.find((m) => m.month === month);
          aValue = aMonthData?.ads[sector] || 0;
          bValue = bMonthData?.ads[sector] || 0;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const formatSelectedMonths = (selected) => {
    if (selected.length === 0) return "Select months";
    if (selected.length === 3) return "Quarter 1";
    return selected
      .map((month) => months.find((m) => m.value === month)?.shortLabel)
      .sort(
        (a, b) =>
          months.findIndex((m) => m.shortLabel === a) -
          months.findIndex((m) => m.shortLabel === b)
      )
      .join("-");
  };

  const handleMonthSelection = (value) => {
    if (selectedMonths.includes(value)) {
      setSelectedMonths(selectedMonths.filter((month) => month !== value));
    } else {
      setSelectedMonths([...selectedMonths, value]);
    }
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className=" p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 shadow-md">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Sector-wise Ad Distribution Table
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Analyze sector performance across regions and languages
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex gap-2 flex-wrap">
                <Select
                  value={selectedMonths[0]}
                  onValueChange={handleMonthSelection}
                >
                  <SelectTrigger className="w-40 bg-white shadow-sm border-gray-200">
                    <SelectValue>{formatSelectedMonths(selectedMonths)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMonths.includes(month.value)}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-36 bg-white shadow-sm border-gray-200">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-36 bg-white shadow-sm border-gray-200">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="sticky left-0 w-40">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("station")}
                    className="flex items-center gap-2"
                  >
                    Station
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-24">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("region")}
                    className="flex items-center gap-2"
                  >
                    Region
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-24">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("language")}
                    className="flex items-center gap-2"
                  >
                    Language
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                {selectedMonths.map((month) =>
                  Object.keys(sectors).map((sector) => (
                    <TableHead key={`${month}_${sector}`} className="text-center">
                      <Button
                        variant="ghost"
                        onClick={() => requestSort(`${month}_${sector}`)}
                        className="flex items-center gap-2 mx-auto"
                      >
                        {months.find((m) => m.value === month)?.shortLabel} -{" "}
                        {sectors[sector].name}
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((station, idx) => (
                <TableRow
                  key={station.station}
                  className={cn(
                    "transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <TableCell className="sticky left-0 bg-inherit w-40 font-medium">
                    {station.station}
                  </TableCell>
                  <TableCell className="w-24">
                    {regions.find((r) => r.value === station.region)?.label}
                  </TableCell>
                  <TableCell className="w-24">
                    {languages.find((l) => l.value === station.language)?.label}
                  </TableCell>
                  {selectedMonths.map((month) =>
                    Object.keys(sectors).map((sector) => {
                      const monthData = station.monthlyData.find(
                        (m) => m.month === month
                      );
                      const value = monthData?.ads[sector] || 0;
                      return (
                        <TableCell
                          key={`${month}_${sector}`}
                          className="text-center text-sm"
                          style={{
                            backgroundColor: value
                              ? `${sectors[sector].color}`
                              : "transparent",
                            color: value ? "#fff" : "#4B5563",
                          }}
                        >
                          {value || "-"}
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-3 justify-center p-6">
          {Object.entries(sectors).map(([key, sector]) => (
            <div
              key={key}
              className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-1 shadow-sm"
            >
              <div
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white"
                style={{ backgroundColor: sector.color }}
              />
              <span className="text-xs font-medium text-gray-700">
                {sector.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioSectorAnalysis;