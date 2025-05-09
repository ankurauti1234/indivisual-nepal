"use client";

import { BarChart2, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
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

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";

// Sample data for different timeframes
const timeframeData = {
  weekly: [
    { channel: "Nepal Television", grp: 28.5 },
    { channel: "Kantipur TV", grp: 25.2 },
    { channel: "Image TV", grp: 20.8 },
    { channel: "AP1 HD", grp: 18.4 },
    { channel: "News24", grp: 15.6 },
    { channel: "Himalaya TV", grp: 12.9 },
    { channel: "ABC News", grp: 10.5 },
    { channel: "Mountain TV", grp: 8.7 },
  ],
  monthly: [
    { channel: "Nepal Television", grp: 30.2 },
    { channel: "Kantipur TV", grp: 27.8 },
    { channel: "Image TV", grp: 22.4 },
    { channel: "AP1 HD", grp: 19.9 },
    { channel: "News24", grp: 16.8 },
    { channel: "Himalaya TV", grp: 14.2 },
    { channel: "ABC News", grp: 11.6 },
    { channel: "Mountain TV", grp: 9.5 },
  ],
  yearly: [
    { channel: "Nepal Television", grp: 32.1 },
    { channel: "Kantipur TV", grp: 29.5 },
    { channel: "Image TV", grp: 24.7 },
    { channel: "AP1 HD", grp: 21.3 },
    { channel: "News24", grp: 18.2 },
    { channel: "Himalaya TV", grp: 15.8 },
    { channel: "ABC News", grp: 12.9 },
    { channel: "Mountain TV", grp: 10.4 },
  ],
};

const chartConfig = {
  grp: {
    label: "GRP%",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

export default function CostPerGRP() {
  const [timeframe, setTimeframe] = useState("monthly");

  const data = timeframeData[timeframe];

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "weekly":
        return "Last Week";
      case "monthly":
        return "Last Month";
      case "yearly":
        return "Last Year";
      default:
        return "Last Month";
    }
  };

  const calculateGrowth = () => {
    const currentData = timeframeData[timeframe];
    // Simple growth calculation based on top channel
    const growth = (
      ((currentData[0].grp - currentData[1].grp) / currentData[1].grp) *
      100
    ).toFixed(1);
    return growth;
  };

    return (
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Nepal TV Channels GRP%"
        description={getTimeframeLabel()}
        action={
          <div className=" flex justify-end">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                right: 32,
                left: 0,
                top: 16,
                bottom: 16,
              }}
              height={400}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="channel"
                type="category"
                tickLine={false}
                axisLine={false}
                width={150}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="grp" fill="hsl(var(--chart-1))" radius={8}>
                <LabelList
                  dataKey="grp"
                  position="right"
                  formatter={(value) => `${value}%`}
                  className="fill-foreground"
                  fontSize={14}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Data generated dynamically. Updated based on your selection.
          </p>
        }
      />
    );
}
