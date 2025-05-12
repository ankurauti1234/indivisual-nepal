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

// Sample data for ad counts by position and advertiser
const rawData = {
  television: [
    { advertiser: "Shivam Cement", First: 40, Middle: 80, Last: 30 },
    { advertiser: "N Cell", First: 35, Middle: 70, Last: 25 },
    { advertiser: "Asian Paints", First: 20, Middle: 60, Last: 20 },
    { advertiser: "Nike", First: 15, Middle: 50, Last: 15 },
    { advertiser: "Others", First: 10, Middle: 30, Last: 10 },
  ],
  radio: [
    { advertiser: "Shivam Cement", First: 45, Middle: 70, Last: 25 },
    { advertiser: "N Cell", First: 30, Middle: 65, Last: 20 },
    { advertiser: "Asian Paints", First: 25, Middle: 55, Last: 15 },
    { advertiser: "Nike", First: 10, Middle: 45, Last: 10 },
    { advertiser: "Others", First: 5, Middle: 25, Last: 5 },
  ],
  digital: [
    { advertiser: "Shivam Cement", First: 50, Middle: 90, Last: 35 },
    { advertiser: "N Cell", First: 40, Middle: 80, Last: 30 },
    { advertiser: "Asian Paints", First: 30, Middle: 70, Last: 20 },
    { advertiser: "Nike", First: 20, Middle: 60, Last: 15 },
    { advertiser: "Others", First: 15, Middle: 40, Last: 10 },
  ],
};

// Color palette for ad positions
const colors = {
  First: "#ff6b6b",
  Middle: "#4ecdc4",
  Last: "#45b7d1",
};

export default function AdPodPositioning() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  // Calculate percentage distribution for each advertiser
  const calculateDistribution = () => {
    const data = rawData[selectedChannel];
    return data.map((item) => {
      const total = item.First + item.Middle + item.Last;
      return {
        advertiser: item.advertiser,
        First: ((item.First / total) * 100).toFixed(1),
        Middle: ((item.Middle / total) * 100).toFixed(1),
        Last: ((item.Last / total) * 100).toFixed(1),
        total: 100, // For waterfall effect reference
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

  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((position) => (
        <div key={position} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[position] }}
          />
          <span className="truncate">{position}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Ad Pod Positioning"
      description="Position Distribution 2024"
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
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={calculateDistribution()}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="advertiser"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            <Bar
              dataKey="First"
              stackId="a"
              fill={colors.First}
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Middle"
              stackId="a"
              fill={colors.Middle}
              barSize={30}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Last"
              stackId="a"
              fill={colors.Last}
              barSize={30}
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad pod positioning for{" "}
          {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
        </p>
      }
    />
  );
}
