"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
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

// Sample data for ad duration counts by channel
const rawData = {
  television: [
    { advertiser: "Shivam Cement", "15s": 50, "30s": 70, "60s": 20 },
    { advertiser: "N Cell", "15s": 40, "30s": 60, "60s": 30 },
    { advertiser: "Asian Paints", "15s": 30, "30s": 50, "60s": 10 },
    { advertiser: "Nike", "15s": 20, "30s": 40, "60s": 15 },
    { advertiser: "Dabur Nepal", "15s": 15, "30s": 25, "60s": 8 },
    { advertiser: "CG Electronics", "15s": 18, "30s": 30, "60s": 10 },
    { advertiser: "Yeti Airlines", "15s": 12, "30s": 20, "60s": 7 },
    { advertiser: "Nabil Bank", "15s": 14, "30s": 22, "60s": 8 },
    { advertiser: "Wai Wai Noodles", "15s": 16, "30s": 28, "60s": 9 },
    { advertiser: "Goldstar Shoes", "15s": 13, "30s": 20, "60s": 7 },
  ],
  radio: [
    { advertiser: "Shivam Cement", "15s": 60, "30s": 50, "60s": 15 },
    { advertiser: "N Cell", "15s": 45, "30s": 55, "60s": 20 },
    { advertiser: "Asian Paints", "15s": 35, "30s": 45, "60s": 10 },
    { advertiser: "Nike", "15s": 25, "30s": 35, "60s": 10 },
    { advertiser: "Dabur Nepal", "15s": 12, "30s": 20, "60s": 5 },
    { advertiser: "CG Electronics", "15s": 10, "30s": 18, "60s": 4 },
    { advertiser: "Yeti Airlines", "15s": 11, "30s": 19, "60s": 5 },
    { advertiser: "Nabil Bank", "15s": 13, "30s": 22, "60s": 6 },
    { advertiser: "Wai Wai Noodles", "15s": 15, "30s": 24, "60s": 7 },
    { advertiser: "Goldstar Shoes", "15s": 11, "30s": 19, "60s": 5 },
  ],
  digital: [
    { advertiser: "Shivam Cement", "15s": 70, "30s": 80, "60s": 25 },
    { advertiser: "N Cell", "15s": 55, "30s": 65, "60s": 30 },
    { advertiser: "Asian Paints", "15s": 40, "30s": 50, "60s": 15 },
    { advertiser: "Nike", "15s": 30, "30s": 40, "60s": 20 },
    { advertiser: "Dabur Nepal", "15s": 20, "30s": 30, "60s": 10 },
    { advertiser: "CG Electronics", "15s": 18, "30s": 28, "60s": 8 },
    { advertiser: "Yeti Airlines", "15s": 22, "30s": 32, "60s": 12 },
    { advertiser: "Nabil Bank", "15s": 19, "30s": 29, "60s": 10 },
    { advertiser: "Wai Wai Noodles", "15s": 21, "30s": 31, "60s": 11 },
    { advertiser: "Goldstar Shoes", "15s": 18, "30s": 27, "60s": 9 },
  ],
};


// Color palette for duration buckets
const colors = {
  "15s": "#ff6b6b",
  "30s": "#4ecdc4",
  "60s": "#45b7d1",
};

export default function AdDurationMix() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  // Calculate percentage distribution for each advertiser
  const calculateDistribution = () => {
    const data = rawData[selectedChannel];
    return data.map((item) => {
      const total = item["15s"] + item["30s"] + item["60s"];
      return {
        advertiser: item.advertiser,
        "15s": ((item["15s"] / total) * 100).toFixed(1),
        "30s": ((item["30s"] / total) * 100).toFixed(1),
        "60s": ((item["60s"] / total) * 100).toFixed(1),
      };
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border rounded shadow">
          <p className="font-medium">{payload[0].payload.advertiser}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
            >{`${entry.name}: ${entry.value}%`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Competitive Ad Duration Mix"
      description="Duration Breakdown 2024"
      action={
        <div className="flex justify-end">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="television">Television</SelectItem>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
            </SelectContent>
          </Select>

          <Select value="weekly">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={800}>
          <BarChart
            data={calculateDistribution()}
            layout="vertical"
            margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
            barCategoryGap={30}
            barGap={0}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <YAxis
              dataKey="advertiser"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            <Bar
              dataKey="15s"
              name="15s"
              fill={colors["15s"]}
              barSize={20}
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="30s"
              name="30s"
              fill={colors["30s"]}
              barSize={20}
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="60s"
              name="60s"
              fill={colors["60s"]}
              barSize={20}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad duration mix for{" "}
          {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
        </p>
      }
    />
  );
}
