"use client";

import { BarChart2 } from "lucide-react";
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

const timeframeData = {
  weekly: [
    { channel: "Kantipur TV", grp: 28.5 },
    { channel: "Himalaya TV", grp: 25.2 },
    { channel: "Nepal Television", grp: 22.8 },
    { channel: "News 24", grp: 19.4 },
    { channel: "AP1 HD", grp: 16.7 },
    { channel: "Image TV", grp: 14.3 },
    { channel: "Avenues TV", grp: 11.9 },
    { channel: "Prime TV", grp: 9.5 },
    { channel: "Sagarmatha TV", grp: 7.2 },
  ],
  monthly: [
    { channel: "Kantipur TV", grp: 30.1 },
    { channel: "Himalaya TV", grp: 27.0 },
    { channel: "Nepal Television", grp: 24.5 },
    { channel: "News 24", grp: 21.2 },
    { channel: "AP1 HD", grp: 18.6 },
    { channel: "Image TV", grp: 16.0 },
    { channel: "Avenues TV", grp: 13.4 },
    { channel: "Prime TV", grp: 10.8 },
    { channel: "Sagarmatha TV", grp: 8.3 },
  ],
  yearly: [
    { channel: "Kantipur TV", grp: 31.8 },
    { channel: "Himalaya TV", grp: 28.5 },
    { channel: "Nepal Television", grp: 25.9 },
    { channel: "News 24", grp: 22.5 },
    { channel: "AP1 HD", grp: 19.8 },
    { channel: "Image TV", grp: 17.1 },
    { channel: "Avenues TV", grp: 14.2 },
    { channel: "Prime TV", grp: 11.5 },
    { channel: "Sagarmatha TV", grp: 8.8 },
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
        <div className="flex justify-end">
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
              content={<ChartTooltipContent indicator="line" formatter={(value) => `${value}%`} />}
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
          Showing GRP% distribution for {getTimeframeLabel()} (2024)
        </p>
      }
    />
  );
}