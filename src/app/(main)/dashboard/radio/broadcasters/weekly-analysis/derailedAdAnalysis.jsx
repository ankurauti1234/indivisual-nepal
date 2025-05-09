import React, { useState } from "react";
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
import { Calendar, Download, Clock, PieChart, BarChart } from "lucide-react";
import {radioStationData} from './radio-data'





const DetailedAdAnalysis = () => {
  const [station, setStation] = useState("radio city");

  const stationKey = station.replace(" ", "_");
  const scheduleData = radioStationData.adScheduleData[stationKey] || {};
  
  const handleExport = (type) => {
    alert(`Exporting ${type} data as CSV...`);
  };

  return (
    <div className="mx-auto p-6 space-y-8 bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Ad Analysis Dashboard</h1>
          <p className="text-gray-500 mt-2">Real-time advertising insights and metrics</p>
        </div>
 <div className="flex gap-4">
 <Select value={station} onValueChange={(value) => setStation(value)}>
          <SelectTrigger className="w-[240px] bg-white">
            <SelectValue placeholder="Select station" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="radio city">Radio City Pune</SelectItem>
            <SelectItem value="radio mirchi">Radio Mirchi Mumbai</SelectItem>
            <SelectItem value="red fm">Red FM Pune</SelectItem>
          </SelectContent>
        </Select>

        <Select >
          <SelectTrigger className="w-[240px] bg-white">
            <SelectValue placeholder="Yesterday" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today">Today </SelectItem>
            <SelectItem value="Yesterday">Yesterday</SelectItem>
            {/* <SelectItem value="red fm">Red FM Pune</SelectItem> */}
          </SelectContent>
        </Select>
 </div>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white rounded-xl p-1">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-gray-100">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="gaps" className="data-[state=active]:bg-gray-100">
            <Clock className="w-4 h-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="types" className="data-[state=active]:bg-gray-100">
            <PieChart className="w-4 h-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-gray-100">
            <BarChart className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
        <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-xl font-medium">Daily Schedule</CardTitle>
          <CardDescription className="text-gray-500">
            Comprehensive view of today's advertising lineup
          </CardDescription>
        </div>
        <Button variant="outline" onClick={() => handleExport("schedule")}>
          <Download className="w-4 h-4 mr-2" /> Export Data
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Program</TableHead>
                <TableHead className="font-medium">Time Slot</TableHead>
                <TableHead className="font-medium">Ad Time</TableHead>
                {/* <TableHead className="font-medium">Type</TableHead> */}
                <TableHead className="font-medium text-center">Advertiser</TableHead>
                <TableHead className="font-medium text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(scheduleData).map(([program, data]) =>
                data.ads.map((ad, adIndex) => (
                  <TableRow key={`${program}-${adIndex}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {adIndex === 0 ? program : ""}
                    </TableCell>
                    <TableCell>{adIndex === 0 ? data.time : ""}</TableCell>
                    <TableCell>{ad.time}</TableCell>
                    {/* <TableCell>{ad.adType}</TableCell> */}
                    <TableCell className="text-center">{ad.advertiser}</TableCell>
                    <TableCell className="text-right">{ad.duration}s</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
        </TabsContent>

        <TabsContent value="gaps">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="text-xl font-medium">Slot Availability</CardTitle>
                <CardDescription className="text-gray-500">
                  Time slot utilization and availability metrics
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExport("gaps")}>
                <Download className="w-4 h-4 mr-2" /> Export Data
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Time Slot</TableHead>
                      <TableHead className="font-medium text-right">Total</TableHead>
                      <TableHead className="font-medium text-right">Filled</TableHead>
                      <TableHead className="font-medium text-right">Utilization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {radioStationData.gapAnalysisData[station]?.map((slot, index) => (
                      <TableRow 
                        key={index} 
                        className={`hover:bg-gray-50 ${
                          slot.utilization < 70 ? "bg-red-50" : ""
                        }`}
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
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="text-xl font-medium">Ad Distribution</CardTitle>
                <CardDescription className="text-gray-500">
                  Distribution of ad types and associated revenue
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExport("types")}>
                <Download className="w-4 h-4 mr-2" /> Export Data
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Type</TableHead>
                      <TableHead className="font-medium text-right">Count</TableHead>
                      <TableHead className="font-medium text-right">Share</TableHead>
                      <TableHead className="font-medium text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {radioStationData.adTypeDistributionData[station]?.map((type, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
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
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div>
                <CardTitle className="text-xl font-medium">Performance Metrics</CardTitle>
                <CardDescription className="text-gray-500">
                  Detailed metrics by product and region
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => handleExport("metrics")}>
                <Download className="w-4 h-4 mr-2" /> Export Data
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-medium">Product</TableHead>
                      <TableHead className="font-medium">Category</TableHead>
                      <TableHead className="font-medium">Sector</TableHead>
                      <TableHead className="font-medium">Region</TableHead>
                      <TableHead className="font-medium text-right">Volume</TableHead>
                      {/* <TableHead className="font-medium text-right">Engagement</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {radioStationData.adMetricsData[station]?.map((metric) => (
                      <TableRow key={metric.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{metric.product}</TableCell>
                        <TableCell>{metric.client}</TableCell>
                        <TableCell>{metric.category}</TableCell>
                        <TableCell>{metric.source}</TableCell>
                        <TableCell className="text-right">{metric.volume}</TableCell>
                        {/* <TableCell className="text-right">{metric.engagement}%</TableCell> */}
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

export default DetailedAdAnalysis;