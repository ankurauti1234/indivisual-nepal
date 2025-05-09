"use client";

import { BarChart2, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from "recharts";
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

// Sample data for different channels
const channelData = {
  nepal_television: {
    name: "Nepal Television",
    data: [
      { genre: "drama", spend: 1870000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2500000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1500000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 900000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 450000, fill: "hsl(var(--chart-5))" },
    ],
  },
  kantipur: {
    name: "Kantipur TV",
    data: [
      { genre: "drama", spend: 2100000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2800000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1800000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 750000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 380000, fill: "hsl(var(--chart-5))" },
    ],
  },
  image_tv: {
    name: "Image TV",
    data: [
      { genre: "drama", spend: 1650000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2200000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1350000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 680000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 420000, fill: "hsl(var(--chart-5))" },
    ],
  },
};

const chartConfig = {
  spend: {
    label: "Ad Spend",
  },
  drama: {
    label: "Drama",
    color: "hsl(var(--chart-1))",
  },
  news: {
    label: "News",
    color: "hsl(var(--chart-2))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-3))",
  },
  sports: {
    label: "Sports",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export default function GenreAdSpend() {
  const [selectedChannel, setSelectedChannel] = useState("nepal_television");

  const formatCurrency = (value) => {
    return `NPR ${(value / 1000000).toFixed(2)}M`;
  };

  const calculateGrowth = () => {
    const currentData = channelData[selectedChannel].data;
    const maxSpend = Math.max(...currentData.map((item) => item.spend));
    const secondMaxSpend = Math.max(
      ...currentData.map((item) =>
        item.spend === maxSpend ? -Infinity : item.spend
      )
    );
    const growth = (
      ((maxSpend - secondMaxSpend) / secondMaxSpend) *
      100
    ).toFixed(1);
    return growth;
  };

    return (
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Genre-wise Ad Spend"
        description="Channel Analysis 2024"
        action={
          <div className=" flex justify-end">
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nepal_television">
                  Nepal Television
                </SelectItem>
                <SelectItem value="kantipur">Kantipur TV</SelectItem>
                <SelectItem value="image_tv">Image TV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={channelData[selectedChannel].data}
              margin={{
                top: 16,
                right: 16,
                bottom: 16,
                left: 16,
              }}
              height={300}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="genre"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartConfig[value]?.label}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    valueFormatter={formatCurrency}
                  />
                }
              />
              <Bar
                dataKey="spend"
                strokeWidth={2}
                radius={16}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Showing ad spend distribution for{" "}
            {channelData[selectedChannel].name}
          </p>
        }
      />
    );
}
