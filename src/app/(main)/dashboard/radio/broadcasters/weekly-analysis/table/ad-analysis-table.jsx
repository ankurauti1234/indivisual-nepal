import React, { useState, useMemo } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Clock, PieChart, BarChart, ArrowUpDown } from "lucide-react";
import { radioStationData } from './radio-data';
import { cn } from "@/lib/utils";

const DetailedAdAnalysisTable = () => {
  const [station, setStation] = useState("radio city");
  const [timeFilter, setTimeFilter] = useState("Yesterday");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ tab: null, key: null, direction: "asc" });

  const stationKey = station.replace(" ", "_");
  const scheduleData = radioStationData.adScheduleData[stationKey] || {};

  const handleExport = (type) => {
    alert(`Exporting ${type} data as CSV...`);
  };

  const requestSort = (tab, key) => {
    setSortConfig((prev) => ({
      tab,
      key,
      direction: prev.tab === tab && prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedData = (data, tab) => {
    if (!sortConfig.tab || sortConfig.tab !== tab || !sortConfig.key) return data;

    const sortableData = [...data];
    sortableData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties for schedule tab
      if (tab === "schedule") {
        aValue = a.ad[sortConfig.key];
        bValue = b.ad[sortConfig.key];
        if (sortConfig.key === "program") {
          aValue = a.program;
          bValue = b.program;
        }
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortableData;
  };

  // Prepare schedule data for table rendering
  const scheduleRows = useMemo(() => {
    const rows = [];
    Object.entries(scheduleData).forEach(([program, data]) => {
      data.ads.forEach((ad, adIndex) => {
        rows.push({
          program,
          timeSlot: adIndex === 0 ? data.time : "",
          ad,
        });
      });
    });
    return rows.filter((row) =>
      row.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ad.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ad.advertiser.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scheduleData, searchTerm]);

  // Filter and sort other tab data
  const gapsData = useMemo(() => {
    const data = radioStationData.gapAnalysisData[station] || [];
    return getSortedData(
      data.filter((slot) =>
        slot.timeSlot.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      "gaps"
    );
  }, [station, searchTerm, sortConfig]);

  const typesData = useMemo(() => {
    const data = radioStationData.adTypeDistributionData[station] || [];
    return getSortedData(
      data.filter((type) =>
        type.type.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      "types"
    );
  }, [station, searchTerm, sortConfig]);

  const metricsData = useMemo(() => {
    const data = radioStationData.adMetricsData[station] || [];
    return getSortedData(
      data.filter((metric) =>
        metric.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.source.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      "metrics"
    );
  }, [station, searchTerm, sortConfig]);

  return (
    <div className="mx-auto p-6 space-y-8 bg-muted/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Ad Analysis Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time advertising insights and metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={station} onValueChange={setStation}>
            <SelectTrigger className="w-full sm:w-60 bg-background border-muted">
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radio city">Radio City Pune</SelectItem>
              <SelectItem value="radio mirchi">Radio Mirchi Mumbai</SelectItem>
              <SelectItem value="red fm">Red FM Pune</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-60 bg-background border-muted">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Yesterday">Yesterday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-background rounded-xl p-1">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-muted">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="gaps" className="data-[state=active]:bg-muted">
            <Clock className="w-4 h-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="types" className="data-[state=active]:bg-muted">
            <PieChart className="w-4 h-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-muted">
            <BarChart className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Daily Schedule</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Comprehensive view of today's advertising lineup
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  placeholder="Search schedule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60 bg-background border-muted"
                />
                <Button variant="outline" onClick={() => handleExport("schedule")}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("schedule", "program")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Program
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Time Slot</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("schedule", "time")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Ad Time
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("schedule", "advertiser")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Advertiser
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("schedule", "duration")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Duration
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedData(scheduleRows, "schedule").map((row, index) => (
                      <TableRow
                        key={`${row.program}-${index}`}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="font-medium">{row.program}</TableCell>
                        <TableCell>{row.timeSlot}</TableCell>
                        <TableCell>{row.ad.time}</TableCell>
                        <TableCell className="text-center">{row.ad.advertiser}</TableCell>
                        <TableCell className="text-right">{row.ad.duration}s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps">
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Slot Availability</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Time slot utilization and availability metrics
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  placeholder="Search time slots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60 bg-background border-muted"
                />
                <Button variant="outline" onClick={() => handleExport("gaps")}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("gaps", "timeSlot")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Time Slot
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("gaps", "totalSlots")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Total
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("gaps", "filledSlots")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Filled
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("gaps", "utilization")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Utilization
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gapsData.map((slot, index) => (
                      <TableRow
                        key={index}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20",
                          slot.utilization < 70 ? "bg-red-50/50" : ""
                        )}
                      >
                        <TableCell className="font-medium">{slot.timeSlot}</TableCell>
                        <TableCell className="text-right">{slot.totalSlots}</TableCell>
                        <TableCell className="text-right">{slot.filledSlots}</TableCell>
                        <TableCell className="text-right">{slot.utilization}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Ad Distribution</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Distribution of ad types and associated revenue
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  placeholder="Search ad types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60 bg-background border-muted"
                />
                <Button variant="outline" onClick={() => handleExport("types")}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("types", "type")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Type
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("types", "count")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Count
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("types", "percentage")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Share
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("types", "revenue")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Revenue
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typesData.map((type, index) => (
                      <TableRow
                        key={index}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="font-medium">{type.type}</TableCell>
                        <TableCell className="text-right">{type.count}</TableCell>
                        <TableCell className="text-right">{type.percentage}%</TableCell>
                        <TableCell className="text-right">{type.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-foreground">Performance Metrics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Detailed metrics by product and region
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Input
                  placeholder="Search metrics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-60 bg-background border-muted"
                />
                <Button variant="outline" onClick={() => handleExport("metrics")}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "product")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Product
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "client")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Client
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "category")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Category
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "source")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Region
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "volume")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Volume
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("metrics", "reach")}
                          className="flex items-center gap-2 ml-auto text-foreground"
                        >
                          Reach
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricsData.map((metric) => (
                      <TableRow
                        key={metric.id}
                        className={cn(
                          "transition-colors",
                          metric.id % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="font-medium">{metric.product}</TableCell>
                        <TableCell>{metric.client}</TableCell>
                        <TableCell>{metric.category}</TableCell>
                        <TableCell>{metric.source}</TableCell>
                        <TableCell className="text-right">{metric.volume}</TableCell>
                        <TableCell className="text-right">{metric.reach || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedAdAnalysisTable;