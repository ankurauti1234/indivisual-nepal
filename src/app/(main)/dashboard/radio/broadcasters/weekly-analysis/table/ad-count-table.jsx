import React, { useState, useMemo } from "react";
import { Radio, Clock, Info, ArrowUpDown } from "lucide-react";
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

const RadioAdTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [timeFilter, setTimeFilter] = useState("all");

  // Sample data structure
  const data = {
    adFrequency: [
      { station: "RADIO CITY FM", hour: "00:00", frequency: 14 },
      { station: "RADIO CITY FM", hour: "01:00", frequency: 17 },
      { station: "RADIO CITY FM", hour: "02:00", frequency: 11 },
      { station: "RADIO CITY FM", hour: "03:00", frequency: 10 },
      { station: "RADIO CITY FM", hour: "04:00", frequency: 19 },
      { station: "RADIO CITY FM", hour: "05:00", frequency: 23 },
      { station: "RADIO CITY FM", hour: "06:00", frequency: 25 },
      { station: "RADIO CITY FM", hour: "07:00", frequency: 22 },
      { station: "RADIO CITY FM", hour: "08:00", frequency: 24 },
      { station: "RADIO CITY FM", hour: "09:00", frequency: 21 },
      { station: "RADIO CITY FM", hour: "10:00", frequency: 16 },
      { station: "RADIO CITY FM", hour: "11:00", frequency: 18 },
      { station: "RADIO CITY FM", hour: "12:00", frequency: 20 },
      { station: "RADIO CITY FM", hour: "13:00", frequency: 15 },
      { station: "RADIO CITY FM", hour: "14:00", frequency: 14 },
      { station: "RADIO CITY FM", hour: "15:00", frequency: 19 },
      { station: "RADIO CITY FM", hour: "16:00", frequency: 23 },
      { station: "RADIO CITY FM", hour: "17:00", frequency: 25 },
      { station: "RADIO CITY FM", hour: "18:00", frequency: 20 },
      { station: "RADIO CITY FM", hour: "19:00", frequency: 17 },
      { station: "RADIO CITY FM", hour: "20:00", frequency: 14 },
      { station: "RADIO CITY FM", hour: "21:00", frequency: 12 },
      { station: "RADIO CITY FM", hour: "22:00", frequency: 10 },
      { station: "RADIO CITY FM", hour: "23:00", frequency: 13 },
      { station: "RED FM", hour: "00:00", frequency: 15 },
      { station: "RED FM", hour: "01:00", frequency: 18 },
      { station: "RED FM", hour: "02:00", frequency: 12 },
      { station: "RED FM", hour: "03:00", frequency: 10 },
      { station: "RED FM", hour: "04:00", frequency: 14 },
      { station: "RED FM", hour: "05:00", frequency: 19 },
      { station: "RED FM", hour: "06:00", frequency: 25 },
      { station: "RED FM", hour: "07:00", frequency: 23 },
      { station: "RED FM", hour: "08:00", frequency: 22 },
      { station: "RED FM", hour: "09:00", frequency: 20 },
      { station: "RED FM", hour: "10:00", frequency: 17 },
      { station: "RED FM", hour: "11:00", frequency: 19 },
      { station: "RED FM", hour: "12:00", frequency: 16 },
      { station: "RED FM", hour: "13:00", frequency: 14 },
      { station: "RED FM", hour: "14:00", frequency: 15 },
      { station: "RED FM", hour: "15:00", frequency: 20 },
      { station: "RED FM", hour: "16:00", frequency: 24 },
      { station: "RED FM", hour: "17:00", frequency: 25 },
      { station: "RED FM", hour: "18:00", frequency: 18 },
      { station: "RED FM", hour: "19:00", frequency: 17 },
      { station: "RED FM", hour: "20:00", frequency: 13 },
      { station: "RED FM", hour: "21:00", frequency: 11 },
      { station: "RED FM", hour: "22:00", frequency: 10 },
      { station: "RED FM", hour: "23:00", frequency: 14 },
      { station: "RADIO MIRCHI FM", hour: "00:00", frequency: 13 },
      { station: "RADIO MIRCHI FM", hour: "01:00", frequency: 11 },
      { station: "RADIO MIRCHI FM", hour: "02:00", frequency: 10 },
      { station: "RADIO MIRCHI FM", hour: "03:00", frequency: 12 },
      { station: "RADIO MIRCHI FM", hour: "04:00", frequency: 14 },
      { station: "RADIO MIRCHI FM", hour: "05:00", frequency: 15 },
      { station: "RADIO MIRCHI FM", hour: "06:00", frequency: 20 },
      { station: "RADIO MIRCHI FM", hour: "07:00", frequency: 23 },
      { station: "RADIO MIRCHI FM", hour: "08:00", frequency: 25 },
      { station: "RADIO MIRCHI FM", hour: "09:00", frequency: 21 },
      { station: "RADIO MIRCHI FM", hour: "10:00", frequency: 16 },
      { station: "RADIO MIRCHI FM", hour: "11:00", frequency: 18 },
      { station: "RADIO MIRCHI FM", hour: "12:00", frequency: 19 },
      { station: "RADIO MIRCHI FM", hour: "13:00", frequency: 15 },
      { station: "RADIO MIRCHI FM", hour: "14:00", frequency: 14 },
      { station: "RADIO MIRCHI FM", hour: "15:00", frequency: 17 },
      { station: "RADIO MIRCHI FM", hour: "16:00", frequency: 23 },
      { station: "RADIO MIRCHI FM", hour: "17:00", frequency: 25 },
      { station: "RADIO MIRCHI FM", hour: "18:00", frequency: 20 },
      { station: "RADIO MIRCHI FM", hour: "19:00", frequency: 15 },
      { station: "RADIO MIRCHI FM", hour: "20:00", frequency: 12 },
      { station: "RADIO MIRCHI FM", hour: "21:00", frequency: 11 },
      { station: "RADIO MIRCHI FM", hour: "22:00", frequency: 10 },
      { station: "RADIO MIRCHI FM", hour: "23:00", frequency: 14 },
      { station: "BIG FM", hour: "00:00", frequency: 15 },
      { station: "BIG FM", hour: "01:00", frequency: 11 },
      { station: "BIG FM", hour: "02:00", frequency: 10 },
      { station: "BIG FM", hour: "03:00", frequency: 12 },
      { station: "BIG FM", hour: "04:00", frequency: 13 },
      { station: "BIG FM", hour: "05:00", frequency: 14 },
      { station: "BIG FM", hour: "06:00", frequency: 18 },
      { station: "BIG FM", hour: "07:00", frequency: 22 },
      { station: "BIG FM", hour: "08:00", frequency: 24 },
      { station: "BIG FM", hour: "09:00", frequency: 20 },
      { station: "BIG FM", hour: "10:00", frequency: 17 },
      { station: "BIG FM", hour: "11:00", frequency: 18 },
      { station: "BIG FM", hour: "12:00", frequency: 19 },
      { station: "BIG FM", hour: "13:00", frequency: 15 },
      { station: "BIG FM", hour: "14:00", frequency: 14 },
      { station: "BIG FM", hour: "15:00", frequency: 20 },
      { station: "BIG FM", hour: "16:00", frequency: 24 },
      { station: "BIG FM", hour: "17:00", frequency: 25 },
      { station: "BIG FM", hour: "18:00", frequency: 18 },
      { station: "BIG FM", hour: "19:00", frequency: 15 },
      { station: "BIG FM", hour: "20:00", frequency: 12 },
      { station: "BIG FM", hour: "21:00", frequency: 11 },
      { station: "BIG FM", hour: "22:00", frequency: 10 },
      { station: "BIG FM", hour: "23:00", frequency: 14 },
      { station: "RAINBOW FM", hour: "00:00", frequency: 20 },
      { station: "RAINBOW FM", hour: "01:00", frequency: 18 },
      { station: "RAINBOW FM", hour: "02:00", frequency: 17 },
      { station: "RAINBOW FM", hour: "03:00", frequency: 15 },
      { station: "RAINBOW FM", hour: "04:00", frequency: 16 },
      { station: "RAINBOW FM", hour: "05:00", frequency: 19 },
      { station: "RAINBOW FM", hour: "06:00", frequency: 23 },
      { station: "RAINBOW FM", hour: "07:00", frequency: 25 },
      { station: "RAINBOW FM", hour: "08:00", frequency: 24 },
      { station: "RAINBOW FM", hour: "09:00", frequency: 22 },
      { station: "RAINBOW FM", hour: "10:00", frequency: 21 },
      { station: "RAINBOW FM", hour: "11:00", frequency: 18 },
      { station: "RAINBOW FM", hour: "12:00", frequency: 19 },
      { station: "RAINBOW FM", hour: "13:00", frequency: 15 },
      { station: "RAINBOW FM", hour: "14:00", frequency: 14 },
      { station: "RAINBOW FM", hour: "15:00", frequency: 20 },
      { station: "RAINBOW FM", hour: "16:00", frequency: 24 },
      { station: "RAINBOW FM", hour: "17:00", frequency: 25 },
      { station: "RAINBOW FM", hour: "18:00", frequency: 23 },
      { station: "RAINBOW FM", hour: "19:00", frequency: 20 },
      { station: "RAINBOW FM", hour: "20:00", frequency: 18 },
      { station: "RAINBOW FM", hour: "21:00", frequency: 17 },
      { station: "RAINBOW FM", hour: "22:00", frequency: 15 },
      { station: "RAINBOW FM", hour: "23:00", frequency: 14 },
    ],
  };
  const processData = (data) => {
    const hours = Array.from(
      { length: 24 },
      (_, i) => `${String(i).padStart(2, "0")}:00`
    );
    const stations = [...new Set(data.map((item) => item.station))];

    const matrix = stations.map((station) => {
      const stationData = { station };
      hours.forEach((hour) => {
        const match = data.find(
          (d) => d.station === station && d.hour === hour
        );
        stationData[hour] = match ? match.frequency : 0;
      });
      return stationData;
    });

    return matrix;
  };

  const matrix = processData(data.adFrequency);
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  const getTimeOfDay = (hour) => {
    const hourNum = parseInt(hour);
    if (hourNum >= 5 && hourNum < 12) return "Morning";
    if (hourNum >= 12 && hourNum < 17) return "Afternoon";
    if (hourNum >= 17 && hourNum < 21) return "Evening";
    return "Night";
  };

  const getColor = (value) => {
    const min = 0;
    const max = 25; // Adjusted based on data
    if (!value) return "bg-gray-50";
    const normalizedValue = (value - min) / (max - min);
    return `bg-[#F26432]/${Math.round(20 + normalizedValue * 80)}`; // Tailwind opacity
  };

  // Sorting logic
  const sortedMatrix = useMemo(() => {
    let sortableMatrix = [...matrix];
    if (sortConfig.key) {
      sortableMatrix.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableMatrix;
  }, [matrix, sortConfig]);

  // Filtering logic
  const filteredMatrix = useMemo(() => {
    let filtered = sortedMatrix;
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        row.station.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (timeFilter !== "all") {
      filtered = filtered.map((row) => {
        const filteredRow = { station: row.station };
        hours.forEach((hour) => {
          if (getTimeOfDay(hour) === timeFilter) {
            filteredRow[hour] = row[hour];
          } else {
            filteredRow[hour] = 0;
          }
        });
        return filteredRow;
      });
    }
    return filtered;
  }, [sortedMatrix, searchTerm, timeFilter]);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="w-full  shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Radio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Radio Ad Frequency Table
              </CardTitle>
              <CardDescription className="text-gray-600">
                24-hour advertisement frequency analysis
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40"
            />
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="Morning">Morning (5-12)</SelectItem>
                <SelectItem value="Afternoon">Afternoon (12-17)</SelectItem>
                <SelectItem value="Evening">Evening (17-21)</SelectItem>
                <SelectItem value="Night">Night (21-5)</SelectItem>
              </SelectContent>
            </Select>
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
                {hours.map((hour) => (
                  <TableHead key={hour} className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort(hour)}
                      className="flex items-center gap-2 mx-auto"
                      title={getTimeOfDay(hour)}
                    >
                      {hour}
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatrix.map((row, idx) => (
                <TableRow
                  key={idx}
                  className={cn(
                    "transition-colors",
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  )}
                >
                  <TableCell className="sticky left-0 bg-inherit w-40 font-medium">
                    {row.station}
                  </TableCell>
                  {hours.map((hour) => (
                    <TableCell
                      key={hour}
                      className={cn(
                        "text-center text-sm",
                        getColor(row[hour]),
                        row[hour] > 0 ? " font-medium" : "text-gray-600"
                      )}
                    >
                      {row[hour] > 0 ? `${row[hour]} min` : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t mt-4 pt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Advertisement frequency analysis across 24-hour broadcast period
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-sm">Frequency:</div>
            <div className="h-4 w-32 rounded-md bg-gradient-to-r from-[#F26432]/20 to-[#F26432]" />
            <div className="text-sm">Higher</div>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" />
            <span>Click headers to sort</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RadioAdTable;