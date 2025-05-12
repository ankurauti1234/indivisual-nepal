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

// Sample data for ad counts by week/month and advertiser
const rawData = {
  television: {
    weekly: [
      {
        period: "Week 1",
        "Shivam Cement": 50,
        "N Cell": 40,
        "Asian Paints": 30,
        Nike: 20,
        Others: 10,
      },
      {
        period: "Week 2",
        "Shivam Cement": 60,
        "N Cell": 45,
        "Asian Paints": 35,
        Nike: 25,
        Others: 15,
      },
      {
        period: "Week 3",
        "Shivam Cement": 30,
        "N Cell": 50,
        "Asian Paints": 40,
        Nike: 15,
        Others: 5,
      },
      {
        period: "Week 4",
        "Shivam Cement": 70,
        "N Cell": 35,
        "Asian Paints": 20,
        Nike: 30,
        Others: 20,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 200,
        "N Cell": 160,
        "Asian Paints": 120,
        Nike: 80,
        Others: 40,
      },
      {
        period: "Feb",
        "Shivam Cement": 240,
        "N Cell": 180,
        "Asian Paints": 140,
        Nike: 100,
        Others: 60,
      },
      {
        period: "Mar",
        "Shivam Cement": 120,
        "N Cell": 200,
        "Asian Paints": 160,
        Nike: 60,
        Others: 20,
      },
      {
        period: "Apr",
        "Shivam Cement": 280,
        "N Cell": 140,
        "Asian Paints": 80,
        Nike: 120,
        Others: 80,
      },
    ],
  },
  radio: {
    weekly: [
      {
        period: "Week 1",
        "Shivam Cement": 40,
        "N Cell": 35,
        "Asian Paints": 25,
        Nike: 15,
        Others: 5,
      },
      {
        period: "Week 2",
        "Shivam Cement": 50,
        "N Cell": 40,
        "Asian Paints": 30,
        Nike: 20,
        Others: 10,
      },
      {
        period: "Week 3",
        "Shivam Cement": 25,
        "N Cell": 45,
        "Asian Paints": 35,
        Nike: 10,
        Others: 3,
      },
      {
        period: "Week 4",
        "Shivam Cement": 60,
        "N Cell": 30,
        "Asian Paints": 15,
        Nike: 25,
        Others: 15,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 160,
        "N Cell": 140,
        "Asian Paints": 100,
        Nike: 60,
        Others: 20,
      },
      {
        period: "Feb",
        "Shivam Cement": 200,
        "N Cell": 160,
        "Asian Paints": 120,
        Nike: 80,
        Others: 40,
      },
      {
        period: "Mar",
        "Shivam Cement": 100,
        "N Cell": 180,
        "Asian Paints": 140,
        Nike: 40,
        Others: 12,
      },
      {
        period: "Apr",
        "Shivam Cement": 240,
        "N Cell": 120,
        "Asian Paints": 60,
        Nike: 100,
        Others: 60,
      },
    ],
  },
  digital: {
    weekly: [
      {
        period: "Week 1",
        "Shivam Cement": 60,
        "N Cell": 50,
        "Asian Paints": 40,
        Nike: 30,
        Others: 20,
      },
      {
        period: "Week 2",
        "Shivam Cement": 70,
        "N Cell": 55,
        "Asian Paints": 45,
        Nike: 35,
        Others: 25,
      },
      {
        period: "Week 3",
        "Shivam Cement": 40,
        "N Cell": 60,
        "Asian Paints": 50,
        Nike: 20,
        Others: 10,
      },
      {
        period: "Week 4",
        "Shivam Cement": 80,
        "N Cell": 45,
        "Asian Paints": 30,
        Nike: 40,
        Others: 30,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 240,
        "N Cell": 200,
        "Asian Paints": 160,
        Nike: 120,
        Others: 80,
      },
      {
        period: "Feb",
        "Shivam Cement": 280,
        "N Cell": 220,
        "Asian Paints": 180,
        Nike: 140,
        Others: 100,
      },
      {
        period: "Mar",
        "Shivam Cement": 160,
        "N Cell": 240,
        "Asian Paints": 200,
        Nike: 80,
        Others: 40,
      },
      {
        period: "Apr",
        "Shivam Cement": 320,
        "N Cell": 180,
        "Asian Paints": 120,
        Nike: 160,
        Others: 120,
      },
    ],
  },
};

// Color palette for advertisers
const colors = {
  "Shivam Cement": "#ff6b6b",
  "N Cell": "#4ecdc4",
  "Asian Paints": "#45b7d1",
  Nike: "#96ceb4",
  Others: "#ddd111",
};

export default function CompetitiveFlightingPatterns() {
  const [selectedChannel, setSelectedChannel] = useState("television");
  const [granularity, setGranularity] = useState("weekly");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border rounded shadow">
          <p className="font-medium">{`Period: ${payload[0].payload.period}`}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
            >{`${entry.name}: ${entry.value} ads`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((advertiser) => (
        <div key={advertiser} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[advertiser] }}
          />
          <span className="truncate">{advertiser}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Competitive Flighting Patterns"
      description="Ad Occurrence Trends 2024"
      action={
        <div className="flex justify-end gap-4">
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
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={rawData[selectedChannel][granularity]}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm">{value}</span>}
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
