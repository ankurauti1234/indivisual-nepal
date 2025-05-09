import React, { useState, useMemo } from "react";
import { LayoutPanelLeft, ArrowUpDown } from "lucide-react";
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

const DATA = {
  "MYFM - Ahmednagar": {
    daily: [
      {
        name: "Swasthya ki Aradhana",
        before: 5,
        during: 10,
        after: 4,
      },
      {
        name: "Salaam Ahmednagar",
        before: 6,
        during: 12,
        after: 5,
      },
      {
        name: "Hum Tum",
        before: 4,
        during: 9,
        after: 3,
      },
      {
        name: "Happy Evening",
        before: 7,
        during: 14,
        after: 6,
      },
      {
        name: "Rock the Party",
        before: 8,
        during: 16,
        after: 7,
      },
    ],
    weekly: [
      {
        name: "Swasthya ki Aradhana",
        before: 35,
        during: 70,
        after: 28,
      },
      {
        name: "Salaam Ahmednagar",
        before: 42,
        during: 84,
        after: 35,
      },
      {
        name: "Hum Tum",
        before: 28,
        during: 63,
        after: 21,
      },
      {
        name: "Happy Evening",
        before: 49,
        during: 98,
        after: 42,
      },
      {
        name: "Rock the Party",
        before: 56,
        during: 112,
        after: 49,
      },
    ],
    monthly: [
      {
        name: "Swasthya ki Aradhana",
        before: 150,
        during: 300,
        after: 120,
      },
      {
        name: "Salaam Ahmednagar",
        before: 180,
        during: 360,
        after: 150,
      },
      {
        name: "Hum Tum",
        before: 120,
        during: 270,
        after: 90,
      },
      {
        name: "Happy Evening",
        before: 210,
        during: 420,
        after: 180,
      },
      {
        name: "Rock the Party",
        before: 240,
        during: 480,
        after: 210,
      },
    ],
  },
  "MangoFM - Kochi": {
    daily: [
      {
        name: "Superfast",
        before: 3,
        during: 6,
        after: 2,
      },
      {
        name: "Timepass",
        before: 4,
        during: 8,
        after: 3,
      },
      {
        name: "Josh Junction",
        before: 5,
        during: 10,
        after: 4,
      },
      {
        name: "Citylights",
        before: 6,
        during: 12,
        after: 5,
      },
      {
        name: "Jab We Met",
        before: 7,
        during: 14,
        after: 6,
      },
      {
        name: "Back to Back",
        before: 8,
        during: 16,
        after: 7,
      },
    ],
    weekly: [
      {
        name: "Superfast",
        before: 21,
        during: 42,
        after: 14,
      },
      {
        name: "Timepass",
        before: 28,
        during: 56,
        after: 21,
      },
      {
        name: "Josh Junction",
        before: 35,
        during: 70,
        after: 28,
      },
      {
        name: "Citylights",
        before: 42,
        during: 84,
        after: 35,
      },
      {
        name: "Jab We Met",
        before: 49,
        during: 98,
        after: 42,
      },
      {
        name: "Back to Back",
        before: 56,
        during: 112,
        after: 49,
      },
    ],
    monthly: [
      {
        name: "Superfast",
        before: 90,
        during: 180,
        after: 60,
      },
      {
        name: "Timepass",
        before: 120,
        during: 240,
        after: 90,
      },
      {
        name: "Josh Junction",
        before: 150,
        during: 300,
        after: 120,
      },
      {
        name: "Citylights",
        before: 180,
        during: 360,
        after: 150,
      },
      {
        name: "Jab We Met",
        before: 210,
        during: 420,
        after: 180,
      },
      {
        name: "Back to Back",
        before: 240,
        during: 480,
        after: 210,
      },
    ],
  },
};

const AdPlacementFrequencyTable = () => {
  const [station, setStation] = useState("MYFM - Ahmednagar");
  const [timePeriod, setTimePeriod] = useState("daily");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const data = useMemo(() => {
    return DATA[station][timePeriod];
  }, [station, timePeriod]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (sortConfig.key === "name") {
          aValue = a.name;
          bValue = b.name;
        }
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

  const placementColors = {
    before: "#8884d8",
    during: "#82ca9d",
    after: "#ffc658",
  };

  return (
    <Card className="w-full bg-card text-foreground shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 shadow-md">
              <LayoutPanelLeft className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Ad Placement Frequency by Content
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Ad distribution before, during, and after programs
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
                  <SelectItem value="MYFM - Ahmednagar">
                    MYFM - Ahmednagar
                  </SelectItem>
                  <SelectItem value="MangoFM - Kochi">MangoFM - Kochi</SelectItem>
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
                <TableHead className="w-1/3">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="flex items-center gap-2 text-foreground"
                  >
                    Program
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("before")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Before
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("during")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    During
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/9 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("after")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    After
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
                      backgroundColor: item.before
                        ? `${placementColors.before}40`
                        : "transparent",
                      color: item.before ? "#232323" : "text-foreground",
                    }}
                  >
                    {item.before}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: item.during
                        ? `${placementColors.during}40`
                        : "transparent",
                      color: item.during ? "#232323" : "text-foreground",
                    }}
                  >
                    {item.during}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: item.after
                        ? `${placementColors.after}40`
                        : "transparent",
                      color: item.after ? "#232323" : "text-foreground",
                    }}
                  >
                    {item.after}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-3 justify-center p-6">
          {Object.entries(placementColors).map(([placement, color]) => (
            <div key={placement} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-foreground">
                {placement.charAt(0).toUpperCase() + placement.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t border-muted">
        <p className="text-sm text-muted-foreground">
          Displays distribution of ads across different program segments for{" "}
          {station}. Data shown for {timePeriod} frequency.
        </p>
      </CardFooter>
    </Card>
  );
};

export default AdPlacementFrequencyTable;