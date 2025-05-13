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
        "Dabur Nepal": 15,
        "CG Electronics": 18,
        "Yeti Airlines": 12,
        "Nabil Bank": 14,
        "Wai Wai Noodles": 16,
        "Goldstar Shoes": 13,
      },
      {
        period: "Week 2",
        "Shivam Cement": 60,
        "N Cell": 45,
        "Asian Paints": 35,
        Nike: 25,
        "Dabur Nepal": 20,
        "CG Electronics": 22,
        "Yeti Airlines": 15,
        "Nabil Bank": 18,
        "Wai Wai Noodles": 20,
        "Goldstar Shoes": 16,
      },
      {
        period: "Week 3",
        "Shivam Cement": 30,
        "N Cell": 50,
        "Asian Paints": 40,
        Nike: 15,
        "Dabur Nepal": 10,
        "CG Electronics": 12,
        "Yeti Airlines": 8,
        "Nabil Bank": 10,
        "Wai Wai Noodles": 11,
        "Goldstar Shoes": 9,
      },
      {
        period: "Week 4",
        "Shivam Cement": 70,
        "N Cell": 35,
        "Asian Paints": 20,
        Nike: 30,
        "Dabur Nepal": 25,
        "CG Electronics": 28,
        "Yeti Airlines": 20,
        "Nabil Bank": 22,
        "Wai Wai Noodles": 24,
        "Goldstar Shoes": 20,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 200,
        "N Cell": 160,
        "Asian Paints": 120,
        Nike: 80,
        "Dabur Nepal": 60,
        "CG Electronics": 72,
        "Yeti Airlines": 48,
        "Nabil Bank": 56,
        "Wai Wai Noodles": 64,
        "Goldstar Shoes": 52,
      },
      {
        period: "Feb",
        "Shivam Cement": 240,
        "N Cell": 180,
        "Asian Paints": 140,
        Nike: 100,
        "Dabur Nepal": 80,
        "CG Electronics": 88,
        "Yeti Airlines": 60,
        "Nabil Bank": 72,
        "Wai Wai Noodles": 80,
        "Goldstar Shoes": 64,
      },
      {
        period: "Mar",
        "Shivam Cement": 120,
        "N Cell": 200,
        "Asian Paints": 160,
        Nike: 60,
        "Dabur Nepal": 40,
        "CG Electronics": 48,
        "Yeti Airlines": 32,
        "Nabil Bank": 40,
        "Wai Wai Noodles": 44,
        "Goldstar Shoes": 36,
      },
      {
        period: "Apr",
        "Shivam Cement": 280,
        "N Cell": 140,
        "Asian Paints": 80,
        Nike: 120,
        "Dabur Nepal": 100,
        "CG Electronics": 112,
        "Yeti Airlines": 80,
        "Nabil Bank": 88,
        "Wai Wai Noodles": 96,
        "Goldstar Shoes": 80,
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
        "Dabur Nepal": 10,
        "CG Electronics": 8,
        "Yeti Airlines": 7,
        "Nabil Bank": 9,
        "Wai Wai Noodles": 11,
        "Goldstar Shoes": 7,
      },
      {
        period: "Week 2",
        "Shivam Cement": 50,
        "N Cell": 40,
        "Asian Paints": 30,
        Nike: 20,
        "Dabur Nepal": 15,
        "CG Electronics": 12,
        "Yeti Airlines": 10,
        "Nabil Bank": 12,
        "Wai Wai Noodles": 14,
        "Goldstar Shoes": 10,
      },
      {
        period: "Week 3",
        "Shivam Cement": 25,
        "N Cell": 45,
        "Asian Paints": 35,
        Nike: 10,
        "Dabur Nepal": 7,
        "CG Electronics": 6,
        "Yeti Airlines": 5,
        "Nabil Bank": 7,
        "Wai Wai Noodles": 8,
        "Goldstar Shoes": 5,
      },
      {
        period: "Week 4",
        "Shivam Cement": 60,
        "N Cell": 30,
        "Asian Paints": 15,
        Nike: 25,
        "Dabur Nepal": 20,
        "CG Electronics": 18,
        "Yeti Airlines": 15,
        "Nabil Bank": 16,
        "Wai Wai Noodles": 18,
        "Goldstar Shoes": 14,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 160,
        "N Cell": 140,
        "Asian Paints": 100,
        Nike: 60,
        "Dabur Nepal": 40,
        "CG Electronics": 32,
        "Yeti Airlines": 28,
        "Nabil Bank": 36,
        "Wai Wai Noodles": 44,
        "Goldstar Shoes": 28,
      },
      {
        period: "Feb",
        "Shivam Cement": 200,
        "N Cell": 160,
        "Asian Paints": 120,
        Nike: 80,
        "Dabur Nepal": 60,
        "CG Electronics": 48,
        "Yeti Airlines": 40,
        "Nabil Bank": 48,
        "Wai Wai Noodles": 56,
        "Goldstar Shoes": 40,
      },
      {
        period: "Mar",
        "Shivam Cement": 100,
        "N Cell": 180,
        "Asian Paints": 140,
        Nike: 40,
        "Dabur Nepal": 28,
        "CG Electronics": 24,
        "Yeti Airlines": 20,
        "Nabil Bank": 28,
        "Wai Wai Noodles": 32,
        "Goldstar Shoes": 20,
      },
      {
        period: "Apr",
        "Shivam Cement": 240,
        "N Cell": 120,
        "Asian Paints": 60,
        Nike: 100,
        "Dabur Nepal": 80,
        "CG Electronics": 72,
        "Yeti Airlines": 60,
        "Nabil Bank": 64,
        "Wai Wai Noodles": 72,
        "Goldstar Shoes": 56,
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
        "Dabur Nepal": 20,
        "CG Electronics": 18,
        "Yeti Airlines": 22,
        "Nabil Bank": 19,
        "Wai Wai Noodles": 21,
        "Goldstar Shoes": 18,
      },
      {
        period: "Week 2",
        "Shivam Cement": 70,
        "N Cell": 55,
        "Asian Paints": 45,
        Nike: 35,
        "Dabur Nepal": 25,
        "CG Electronics": 22,
        "Yeti Airlines": 27,
        "Nabil Bank": 24,
        "Wai Wai Noodles": 26,
        "Goldstar Shoes": 23,
      },
      {
        period: "Week 3",
        "Shivam Cement": 40,
        "N Cell": 60,
        "Asian Paints": 50,
        Nike: 20,
        "Dabur Nepal": 15,
        "CG Electronics": 13,
        "Yeti Airlines": 17,
        "Nabil Bank": 14,
        "Wai Wai Noodles": 16,
        "Goldstar Shoes": 13,
      },
      {
        period: "Week 3",
        "Shivam Cement": 40,
        "N Cell": 60,
        "Asian Paints": 50,
        Nike: 20,
        "Dabur Nepal": 15,
        "CG Electronics": 13,
        "Yeti Airlines": 17,
        "Nabil Bank": 14,
        "Wai Wai Noodles": 16,
        "Goldstar Shoes": 13,
      },
      {
        period: "Week 4",
        "Shivam Cement": 80,
        "N Cell": 45,
        "Asian Paints": 30,
        Nike: 40,
        "Dabur Nepal": 30,
        "CG Electronics": 28,
        "Yeti Airlines": 32,
        "Nabil Bank": 29,
        "Wai Wai Noodles": 31,
        "Goldstar Shoes": 28,
      },
    ],
    monthly: [
      {
        period: "Jan",
        "Shivam Cement": 240,
        "N Cell": 200,
        "Asian Paints": 160,
        Nike: 120,
        "Dabur Nepal": 80,
        "CG Electronics": 72,
        "Yeti Airlines": 88,
        "Nabil Bank": 76,
        "Wai Wai Noodles": 84,
        "Goldstar Shoes": 72,
      },
      {
        period: "Feb",
        "Shivam Cement": 280,
        "N Cell": 220,
        "Asian Paints": 180,
        Nike: 140,
        "Dabur Nepal": 100,
        "CG Electronics": 88,
        "Yeti Airlines": 108,
        "Nabil Bank": 96,
        "Wai Wai Noodles": 104,
        "Goldstar Shoes": 92,
      },
      {
        period: "Mar",
        "Shivam Cement": 160,
        "N Cell": 240,
        "Asian Paints": 200,
        Nike: 80,
        "Dabur Nepal": 60,
        "CG Electronics": 52,
        "Yeti Airlines": 68,
        "Nabil Bank": 56,
        "Wai Wai Noodles": 64,
        "Goldstar Shoes": 52,
      },
      {
        period: "Apr",
        "Shivam Cement": 320,
        "N Cell": 180,
        "Asian Paints": 120,
        Nike: 160,
        "Dabur Nepal": 120,
        "CG Electronics": 112,
        "Yeti Airlines": 128,
        "Nabil Bank": 116,
        "Wai Wai Noodles": 124,
        "Goldstar Shoes": 112,
      },
    ],
  },
};

const colors = {
  "Shivam Cement": "#ff6b6b",
  "N Cell": "#4ecdc4",
  "Asian Paints": "#45b7d1",
  Nike: "#96ceb4",
  "Dabur Nepal": "#FF9F1C",
  "CG Electronics": "#6A4E94",
  "Yeti Airlines": "#00A896",
  "Nabil Bank": "#F4A261",
  "Wai Wai Noodles": "#E63946",
  "Goldstar Shoes": "#457B9D",
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
