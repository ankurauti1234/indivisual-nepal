import React, { useState } from "react";
import { BarChart, PieChart, Radio, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdDistributionComparison = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [selectedStation, setSelectedStation] = useState("all");
  const [viewType, setViewType] = useState("hourly"); // hourly/category

  // Dummy data for different content types and their ad frequencies
  const hourlyData = [
    {
      hour: "6-7 AM",
      songs: 12,
      news: 8,
      talkShow: 6,
      weather: 4,
      traffic: 5,
    },
    {
      hour: "7-8 AM",
      songs: 15,
      news: 10,
      talkShow: 8,
      weather: 3,
      traffic: 6,
    },
    {
      hour: "8-9 AM",
      songs: 18,
      news: 7,
      talkShow: 9,
      weather: 2,
      traffic: 4,
    },
    {
      hour: "9-10 AM",
      songs: 14,
      news: 6,
      talkShow: 7,
      weather: 3,
      traffic: 3,
    },
    {
      hour: "10-11 AM",
      songs: 16,
      news: 5,
      talkShow: 8,
      weather: 2,
      traffic: 2,
    },
  ];

  const categoryData = [
    {
      name: "Pop Songs",
      adFrequency: 85,
      avgDuration: 25,
      revenue: 1200,
    },
    {
      name: "News Segments",
      adFrequency: 65,
      avgDuration: 30,
      revenue: 980,
    },
    {
      name: "Talk Shows",
      adFrequency: 55,
      avgDuration: 35,
      revenue: 850,
    },
    {
      name: "Weather Updates",
      adFrequency: 25,
      avgDuration: 15,
      revenue: 320,
    },
    {
      name: "Traffic Reports",
      adFrequency: 30,
      avgDuration: 20,
      revenue: 420,
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

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ads`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <BarChart className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Distribution Analysis
              </CardTitle>
              <CardDescription className="text-gray-500">
                Compare ad frequency across different content types
              </CardDescription>
            </div>
          </div>
          <ArrowUpDown className="h-6 w-6 text-primary/60" />
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
              Daily
            </button>
            <button
              onClick={() => setTimeFrame("weekly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === "weekly"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setViewType("hourly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewType === "hourly"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hourly View
            </button>
            <button
              onClick={() => setViewType("category")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewType === "category"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Category View
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

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={viewType === "hourly" ? hourlyData : categoryData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={viewType === "hourly" ? "hour" : "name"}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {viewType === "hourly" ? (
                <>
                  <Bar dataKey="songs" fill="#3B82F6" name="Songs" />
                  <Bar dataKey="news" fill="#6366F1" name="News" />
                  <Bar dataKey="talkShow" fill="#8B5CF6" name="Talk Show" />
                  <Bar dataKey="weather" fill="#A855F7" name="Weather" />
                  <Bar dataKey="traffic" fill="#D946EF" name="Traffic" />
                </>
              ) : (
                <Bar dataKey="adFrequency" fill="#3B82F6" name="Ad Frequency" />
              )}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-gray-600">
                Highest Ad Frequency: Songs (85%)
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">Peak Hours: 8-9 AM</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/40" />
              <span className="text-gray-600">Avg Duration: 25s</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdDistributionComparison;
