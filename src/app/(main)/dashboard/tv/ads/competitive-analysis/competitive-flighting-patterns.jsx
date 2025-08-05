"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";

// Data for ad counts by day and advertiser
const rawData = {
  television: {
    daily: [
      {
        period: "7/23",
        Sprite: 81,
        Asianpaints: 78,
        "Air Purifier": 78,
        CG: 76,
        Minto: 75,
        Closeup: 73,
        Lux: 72,
        "Right Path": 71,
        "Microwave Oven": 70,
        "Photex Power": 69,
        cinthol: 69,
        TATA: 67,
        LG: 66,
        Toffichoo: 66,
        Dabur: 65,
        "Citizen Life": 64,
        "OK laundry soap": 60,
        "Dermi cool": 57,
        Dove: 55,
        "E Sewa": 55,
        Fanta: 54,
      },
      {
        period: "7/24",
        Sprite: 82,
        "Microwave Oven": 81,
        cinthol: 78,
        Minto: 76,
        Lux: 74,
        TATA: 72,
        "E Sewa": 71,
        "Right Path": 70,
        "OK laundry soap": 69,
        Asianpaints: 68,
        CG: 68,
        Dabur: 68,
        Toffichoo: 68,
        "Citizen Life": 65,
        "Dermi cool": 64,
        Fanta: 63,
        "Photex Power": 63,
        Closeup: 62,
        LG: 61,
        Dove: 60,
        "Air Purifier": 58,
      },
      {
        period: "7/25",
        Lux: 84,
        "Air Purifier": 77,
        CG: 77,
        "Dermi cool": 74,
        cinthol: 74,
        "Citizen Life": 74,
        "Photex Power": 72,
        Minto: 70,
        TATA: 70,
        "Microwave Oven": 69,
        "OK laundry soap": 69,
        LG: 69,
        Toffichoo: 69,
        "Right Path": 67,
        Dove: 65,
        "E Sewa": 65,
        Asianpaints: 65,
        Sprite: 63,
        Fanta: 62,
        Closeup: 62,
        Dabur: 56,
      },
      {
        period: "7/26",
        "OK laundry soap": 96,
        Dove: 96,
        "Photex Power": 84,
        "Citizen Life": 78,
        Closeup: 76,
        Asianpaints: 76,
        cinthol: 74,
        TATA: 72,
        Dabur: 71,
        "Right Path": 68,
        Sprite: 65,
        Lux: 65,
        Fanta: 64,
        Minto: 63,
        CG: 63,
        "Air Purifier": 62,
        LG: 59,
        Toffichoo: 58,
        "Dermi cool": 57,
        "E Sewa": 56,
        "Microwave Oven": 53,
      },
      {
        period: "7/27",
        "Right Path": 84,
        CG: 78,
        LG: 75,
        Closeup: 75,
        "Dermi cool": 73,
        "Photex Power": 70,
        Fanta: 70,
        Sprite: 69,
        Asianpaints: 69,
        "Citizen Life": 68,
        TATA: 68,
        Lux: 66,
        "Microwave Oven": 65,
        "Air Purifier": 64,
        Dabur: 63,
        Dove: 63,
        Toffichoo: 62,
        Minto: 60,
        "OK laundry soap": 57,
        cinthol: 57,
        "E Sewa": 53,
      },
      {
        period: "7/28",
        Fanta: 86,
        Minto: 84,
        Sprite: 80,
        Dove: 79,
        Asianpaints: 74,
        "Dermi cool": 72,
        "Photex Power": 71,
        "Citizen Life": 71,
        CG: 70,
        TATA: 69,
        "Microwave Oven": 69,
        Toffichoo: 68,
        "OK laundry soap": 68,
        Dabur: 67,
        Closeup: 66,
        LG: 65,
        "E Sewa": 64,
        cinthol: 59,
        "Air Purifier": 57,
        "Right Path": 56,
        Lux: 55,
      },
      {
        period: "7/29",
        "Photex Power": 80,
        Minto: 79,
        Dabur: 78,
        "Citizen Life": 77,
        "Microwave Oven": 74,
        Dove: 73,
        CG: 73,
        Toffichoo: 70,
        "Dermi cool": 70,
        TATA: 68,
        Asianpaints: 64,
        Closeup: 64,
        cinthol: 63,
        "Air Purifier": 62,
        Lux: 60,
        "Right Path": 59,
        Sprite: 58,
        Fanta: 57,
        "OK laundry soap": 55,
        "E Sewa": 54,
        LG: 54,
      },
    ],
  },
};

// Color palette for advertisers
const colors = {
  Sprite: "#FF6B6B",
  Asianpaints: "#4ECDC4",
  "Air Purifier": "#45B7D1",
  CG: "#96CEB4",
  Minto: "#FFEEAD",
  Closeup: "#D4A5A5",
  Lux: "#9B59B6",
  "Right Path": "#3498DB",
  "Microwave Oven": "#E74C3C",
  "Photex Power": "#2ECC71",
  cinthol: "#F1C40F",
  TATA: "#E67E22",
  LG: "#1ABC9C",
  Toffichoo: "#8E44AD",
  Dabur: "#C0392B",
  "Citizen Life": "#27AE60",
  "OK laundry soap": "#F39C12",
  "Dermi cool": "#2980B9",
  Dove: "#D35400",
  "E Sewa": "#16A085",
  Fanta: "#7F8C8D",
};

export default function CompetitiveFlightingPatterns() {
  const [selectedChannel, setSelectedChannel] = useState("television");
  const [granularity, setGranularity] = useState("daily");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-800">{`Date: ${payload[0].payload.period}/2025`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm text-gray-600"
              style={{ color: entry.stroke }}
            >
              {`${entry.name}: ${entry.value} ads`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 px-4 text-sm">
      {Object.keys(colors).map((advertiser) => (
        <div key={advertiser} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[advertiser] }}
          />
          <span className="truncate text-gray-700">{advertiser}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<PieChartIcon className="w-7 h-7 text-blue-500" />}
      title="Competitive Flighting Patterns"
      description="Ad Occurrence Trends (July 2025)"
      action={
        <div className="flex justify-end gap-4">
          {/* <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48 bg-white border-gray-200">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="television">Television</SelectItem>
            </SelectContent>
          </Select> */}
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={800}>
          <LineChart
            data={rawData[selectedChannel][granularity]}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `Jul ${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
              align="center"
            />
            {Object.keys(colors).map((advertiser) => (
              <Line
                key={advertiser}
                type="monotone"
                dataKey={advertiser}
                stroke={colors[advertiser]}
                strokeWidth={2}
                dot={{ r: 4, fill: colors[advertiser] }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing {granularity} ad flighting patterns for{" "}
          {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
        </p>
      }
    />
  );
}