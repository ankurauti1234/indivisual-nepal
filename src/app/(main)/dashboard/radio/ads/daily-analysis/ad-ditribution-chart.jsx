import React, { useState } from "react";
import { Clock, BarChart3, Activity } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdDistributionChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [selectedStation, setSelectedStation] = useState("all");

  // Dummy data for daily ad distribution
  const dailyData = [
    { time: "12 AM", total: 12, songs: 8, talkShow: 4, peakType: "off-peak" },
    { time: "2 AM", total: 8, songs: 6, talkShow: 2, peakType: "off-peak" },
    { time: "4 AM", total: 10, songs: 7, talkShow: 3, peakType: "off-peak" },
    { time: "6 AM", total: 35, songs: 20, talkShow: 15, peakType: "peak" },
    { time: "8 AM", total: 45, songs: 28, talkShow: 17, peakType: "peak" },
    { time: "10 AM", total: 38, songs: 25, talkShow: 13, peakType: "peak" },
    { time: "12 PM", total: 30, songs: 20, talkShow: 10, peakType: "regular" },
    { time: "2 PM", total: 28, songs: 18, talkShow: 10, peakType: "regular" },
    { time: "4 PM", total: 42, songs: 28, talkShow: 14, peakType: "peak" },
    { time: "6 PM", total: 40, songs: 26, talkShow: 14, peakType: "peak" },
    { time: "8 PM", total: 32, songs: 22, talkShow: 10, peakType: "regular" },
    { time: "10 PM", total: 20, songs: 15, talkShow: 5, peakType: "regular" },
  ];

  // Dummy data for weekly ad distribution
  const weeklyData = [
    {
      time: "Monday",
      total: 320,
      songs: 220,
      talkShow: 100,
      peakType: "regular",
    },
    {
      time: "Tuesday",
      total: 340,
      songs: 230,
      talkShow: 110,
      peakType: "regular",
    },
    {
      time: "Wednesday",
      total: 380,
      songs: 260,
      talkShow: 120,
      peakType: "peak",
    },
    {
      time: "Thursday",
      total: 360,
      songs: 240,
      talkShow: 120,
      peakType: "regular",
    },
    { time: "Friday", total: 420, songs: 280, talkShow: 140, peakType: "peak" },
    {
      time: "Saturday",
      total: 450,
      songs: 300,
      talkShow: 150,
      peakType: "peak",
    },
    {
      time: "Sunday",
      total: 300,
      songs: 200,
      talkShow: 100,
      peakType: "regular",
    },
  ];

  const stations = [
    "all",
    "Radio City FM",
    "Radio Mirchi",
    "Red FM",
    "Big FM",
    "Rainbow FM",
  ];

  const currentData = timeFrame === "daily" ? dailyData : weeklyData;

  // Calculate summary statistics
  const totalAds = currentData.reduce((sum, item) => sum + item.total, 0);
  const peakHourAds = currentData
    .filter((item) => item.peakType === "peak")
    .reduce((sum, item) => sum + item.total, 0);
  const avgAdsPerSlot = Math.round(totalAds / currentData.length);

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Activity className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Distribution Analysis
              </CardTitle>
              <CardDescription className="text-gray-500">
                {timeFrame === "daily" ? "24-hour" : "Weekly"} ad distribution
                patterns
              </CardDescription>
            </div>
          </div>
          <Clock className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="space-x-2">
            <button
              onClick={() => setTimeFrame("daily")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === "daily"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setTimeFrame("weekly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === "weekly"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly View
            </button>
          </div>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            {stations.map((station) => (
              <option key={station} value={station}>
                {station === "all" ? "All Stations" : station}
              </option>
            ))}
          </select>
        </div>

        {/* Main Chart */}
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                className="text-gray-500"
              />
              <YAxis tick={{ fontSize: 12 }} className="text-gray-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="songs"
                stackId="1"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.6}
                name="Songs"
              />
              <Area
                type="monotone"
                dataKey="talkShow"
                stackId="1"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.6}
                name="Talk Shows"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Total Ads</div>
            <div className="text-2xl font-semibold text-primary">
              {totalAds.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Peak Hour Ads</div>
            <div className="text-2xl font-semibold text-primary">
              {peakHourAds.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Avg Ads per Slot</div>
            <div className="text-2xl font-semibold text-primary">
              {avgAdsPerSlot.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-gray-600">
                Peak Hours:{" "}
                {timeFrame === "daily" ? "8-10 AM, 4-6 PM" : "Fri-Sat"}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">
                Songs/Talk Show Ratio: 70/30
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdDistributionChart;
