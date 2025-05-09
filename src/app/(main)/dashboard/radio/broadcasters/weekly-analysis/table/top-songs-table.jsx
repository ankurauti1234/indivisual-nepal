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

const generateClusteredData = (timePeriod) => {
  const songs = [
    "Aaj Ki Raat (Stree 2)",
    "Kesariya (Brahmastra)",
    "Apna Bana Le (Bhediya)",
    "Naatu Naatu (RRR)",
    "Ranjha (Shershaah)",
    "Pasoori (Coke Studio)",
  ];

  const baseMultiplier = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  const stationMultiplier = {
    "Radio City": 1.2,
    "Radio Mirchi": 1.1,
    "Red FM": 1.0,
  };

  return songs.map((song) => ({
    name: song,
    "Radio City": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Radio City"]
    ),
    "Radio Mirchi": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Radio Mirchi"]
    ),
    "Red FM": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Red FM"]
    ),
  }));
};

const TopSongsTable = () => {
  const [timePeriod, setTimePeriod] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const data = useMemo(() => {
    return generateClusteredData(timePeriod);
  }, [timePeriod]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = sortConfig.key === "name" ? a.name : a[sortConfig.key];
        let bValue = sortConfig.key === "name" ? b.name : b[sortConfig.key];
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

  const stationColors = {
    "Radio City": "#8884d8",
    "Radio Mirchi": "#82ca9d",
    "Red FM": "#ffc658",
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
                Top Songs by Volume
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Top songs by number of plays across radio stations
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Search Songs
              </p>
              <Input
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 bg-background border-muted"
              />
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
                <TableHead className="w-1/3">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="flex items-center gap-2 text-foreground"
                  >
                    Song
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("Radio City")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Radio City
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("Radio Mirchi")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Radio Mirchi
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("Red FM")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Red FM
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
                      backgroundColor: item["Radio City"]
                        ? `${stationColors["Radio City"]}40`
                        : "transparent",
                      color: item["Radio City"] ? "#232323" : "text-foreground",
                    }}
                  >
                    {item["Radio City"]}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: item["Radio Mirchi"]
                        ? `${stationColors["Radio Mirchi"]}40`
                        : "transparent",
                      color: item["Radio Mirchi"] ? "#232323" : "text-foreground",
                    }}
                  >
                    {item["Radio Mirchi"]}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: item["Red FM"]
                        ? `${stationColors["Red FM"]}40`
                        : "transparent",
                      color: item["Red FM"] ? "#232323" : "text-foreground",
                    }}
                  >
                    {item["Red FM"]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-3 justify-center p-6">
          {Object.entries(stationColors).map(([station, color]) => (
            <div key={station} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-foreground">{station}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t border-muted">
        <p className="text-sm text-muted-foreground">
          Shows top songs ranked by number of plays across different radio
          stations. Data is simulated.
        </p>
      </CardFooter>
    </Card>
  );
};

export default TopSongsTable;