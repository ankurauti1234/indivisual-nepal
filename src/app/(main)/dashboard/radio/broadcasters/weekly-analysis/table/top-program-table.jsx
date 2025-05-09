import React, { useState, useMemo } from "react";
import { Radio, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const radioStations = {
  "radio city": [
    "Morning Show",
    "Evening Drive",
    "Night Cafe",
    "Weekend Special",
    "Lunch Hours",
    "Music Marathon",
  ],
  "radio mirchi": [
    "Super Hits",
    "Mirchi Top 20",
    "Love Guru",
    "Club Mirchi",
    "Bumper Mornings",
    "Sunset Drive",
  ],
  "red fm": [
    "Red Indies",
    "Red Chillies",
    "Morning No.1",
    "Midnight Masala",
    "Retro Sundays",
    "Comedy Nights",
  ],
  "MYFM - Ahmednagar": [
    "Acharya Balkrishna Ji - Swasthya ki Aradhana",
    "RJ Siddhu - Salaam Ahmednagar",
    "RJ Purva - Hum Tum",
    "RJ Suhas - Happy Evening",
    "DJ Elektronomist - Rock the Party",
  ],
  "MangoFM - Kochi": [
    "Superfast",
    "Timepass",
    "Josh Junction",
    "Citylights",
    "Jab We Met",
    "Back to Back",
  ],
  "Radio City - Mumbai": [
    "RJ Salil - Kadak Show",
    "RJ Archana - Mumbai Ka Dil Archu",
    "RJ Gaurav - Kal bhi Aaj bhi",
  ],
};

const generateAdPlacementData = (station, timePeriod) => {
  const baseMultiplier = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  const stationMultiplier = {
    "radio city": 1.2,
    "radio mirchi": 1.1,
    "red fm": 1.0,
    "MYFM - Ahmednagar": 0.9,
    "MangoFM - Kochi": 0.95,
    "Radio City - Mumbai": 1.15,
  };

  const programs = radioStations[station] || [];

  return programs.map((program) => ({
    name: program,
    adCount: Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        (stationMultiplier[station] || 1)
    ),
  }));
};

const TopProgramsTable = () => {
  const [station, setStation] = useState("MYFM - Ahmednagar");
  const [timePeriod, setTimePeriod] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const adData = useMemo(() => {
    return generateAdPlacementData(station, timePeriod);
  }, [station, timePeriod]);

  const filteredData = useMemo(() => {
    return adData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [adData, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = sortConfig.key === "name" ? a.name : a.adCount;
        let bValue = sortConfig.key === "name" ? b.name : b.adCount;
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="w-full bg-card text-foreground shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 shadow-md">
              <Radio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Top Programs by Ad Placements
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Ad placement statistics across radio programs and stations
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Search Programs
              </p>
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 bg-background border-muted"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Select Station
              </p>
              <Select value={station} onValueChange={setStation}>
                <SelectTrigger className="w-48 bg-background border-muted">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(radioStations).map((stationName) => (
                    <SelectItem key={stationName} value={stationName}>
                      {stationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Select Time Period
              </p>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32 bg-background border-muted">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-2/3">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="flex items-center gap-2 text-foreground"
                  >
                    Program
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-1/3 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("adCount")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Ad Count
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, idx) => (
                <TableRow
                  key={item.name}
                  className={cn(
                    "transition-colors",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: item.adCount ? "#ddd" : "transparent",
                      color: item.adCount ? "#232323" : "text-foreground",
                    }}
                  >
                    {item.adCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t border-muted">
        <p className="text-sm text-muted-foreground">
          Shows top programs ranked by number of ad placements. Data is simulated.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TopProgramsTable;