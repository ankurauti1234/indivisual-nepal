"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
  Cell,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChartCard from "@/components/card/charts-card";

// Sample data for ad rotation analysis
const adRotationData = {
  // Data for various time periods
  timeframes: {
    "Q1 2024": [
      {
        advertiser: "Shivam Cement",
        uniqueCreatives: 48,
        totalAirings: 320,
        refreshRate: 15.0,
      },
      {
        advertiser: "N Cell",
        uniqueCreatives: 35,
        totalAirings: 280,
        refreshRate: 12.5,
      },
      {
        advertiser: "Asian Paints",
        uniqueCreatives: 62,
        totalAirings: 410,
        refreshRate: 15.1,
      },
      {
        advertiser: "Nike",
        uniqueCreatives: 28,
        totalAirings: 245,
        refreshRate: 11.4,
      },
      {
        advertiser: "Coca Cola",
        uniqueCreatives: 43,
        totalAirings: 290,
        refreshRate: 14.8,
      },
      {
        advertiser: "Others",
        uniqueCreatives: 25,
        totalAirings: 180,
        refreshRate: 13.9,
      },
    ],
    "Q2 2024": [
      {
        advertiser: "Shivam Cement",
        uniqueCreatives: 52,
        totalAirings: 340,
        refreshRate: 15.3,
      },
      {
        advertiser: "N Cell",
        uniqueCreatives: 38,
        totalAirings: 295,
        refreshRate: 12.9,
      },
      {
        advertiser: "Asian Paints",
        uniqueCreatives: 58,
        totalAirings: 385,
        refreshRate: 15.1,
      },
      {
        advertiser: "Nike",
        uniqueCreatives: 32,
        totalAirings: 260,
        refreshRate: 12.3,
      },
      {
        advertiser: "Coca Cola",
        uniqueCreatives: 47,
        totalAirings: 310,
        refreshRate: 15.2,
      },
      {
        advertiser: "Others",
        uniqueCreatives: 30,
        totalAirings: 200,
        refreshRate: 15.0,
      },
    ],
    "Q3 2024": [
      {
        advertiser: "Shivam Cement",
        uniqueCreatives: 55,
        totalAirings: 360,
        refreshRate: 15.3,
      },
      {
        advertiser: "N Cell",
        uniqueCreatives: 42,
        totalAirings: 315,
        refreshRate: 13.3,
      },
      {
        advertiser: "Asian Paints",
        uniqueCreatives: 65,
        totalAirings: 425,
        refreshRate: 15.3,
      },
      {
        advertiser: "Nike",
        uniqueCreatives: 30,
        totalAirings: 255,
        refreshRate: 11.8,
      },
      {
        advertiser: "Coca Cola",
        uniqueCreatives: 50,
        totalAirings: 330,
        refreshRate: 15.2,
      },
      {
        advertiser: "Others",
        uniqueCreatives: 32,
        totalAirings: 210,
        refreshRate: 15.2,
      },
    ],
  },

  // Sectors for filtering
  sectors: ["All", "Consumer Goods", "Technology", "Finance", "Retail"],
};

// Better color palette for advertisers
const advertiserColors = {
  "Shivam Cement": "#ff6b6b", // Red
  "N Cell": "#4ecdc4", // Teal
  "Asian Paints": "#45b7d1", // Blue
  Nike: "#96ceb4", // Green
  "Coca Cola": "#7209b7", // Purple
  Others: "#f72585", // Pink
};

export default function CompetitiveAdRotation() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Q3 2024");
  const [selectedSector, setSelectedSector] = useState("All");

  // Custom tooltip for the scatter chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow text-sm">
          <p className="font-medium text-base">{data.advertiser}</p>
          <p className="text-gray-700">
            Unique Creatives: {data.uniqueCreatives}
          </p>
          <p className="text-gray-700">Total Airings: {data.totalAirings}</p>
          <p className="font-medium text-gray-800">
            Refresh Rate: {data.refreshRate}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Get color for advertiser
  const getAdvertiserColor = (advertiser) => {
    return advertiserColors[advertiser] || "#888888"; // Default color if not found
  };

  // Get data for the selected timeframe
  const getChartData = () => {
    return adRotationData.timeframes[selectedTimeframe];
  };

  // Calculate the average refresh rate for comparison
  const calculateAverageRefreshRate = () => {
    const data = getChartData();
    const sum = data.reduce((acc, item) => acc + item.refreshRate, 0);
    return (sum / data.length).toFixed(1);
  };

  // Get the advertiser with highest refresh rate
  const getHighestRefreshRate = () => {
    const data = getChartData();
    return data.reduce((prev, current) =>
      prev.refreshRate > current.refreshRate ? prev : current
    );
  };

  return (
    <ChartCard
      icon={<RefreshCw className="w-6 h-6" />}
      title="Competitive Ad Rotation"
      description="Ad Refresh Rate Comparison"
      action={
        <div className="flex space-x-2 w-full justify-end ">
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(adRotationData.timeframes).map((timeframe) => (
                <SelectItem key={timeframe} value={timeframe}>
                  {timeframe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              {adRotationData.sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="totalAirings"
                name="Total Airings"
                label={{
                  value: "Total Airings",
                  position: "bottom",
                  offset: 0,
                }}
              />
              <YAxis
                type="number"
                dataKey="uniqueCreatives"
                name="Unique Creatives"
                label={{
                  value: "Unique Creatives",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <ZAxis
                type="number"
                dataKey="refreshRate"
                range={[60, 400]}
                name="Refresh Rate"
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: "3 3" }}
              />
              {/* <Legend /> */}
              <Scatter name="Advertisers" data={getChartData()}>
                {getChartData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getAdvertiserColor(entry.advertiser)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      }
      footer={
        <div className="mt-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-500">Average Refresh Rate</p>
              <p className="font-medium">{calculateAverageRefreshRate()}%</p>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-gray-500">Highest Refresh Rate</p>
              <p className="font-medium">
                {getHighestRefreshRate().advertiser} (
                {getHighestRefreshRate().refreshRate}%)
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Refresh Rate = (Unique Creatives / Total Airings) × 100
          </p>
        </div>
      }
    />
  );
}
