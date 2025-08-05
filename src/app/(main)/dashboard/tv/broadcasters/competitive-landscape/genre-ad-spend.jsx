"use client";

import { BarChart2 } from "lucide-react";
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

const channelData = {
  himalaya_tv: {
    name: "Himalaya TV",
    data: [
      { genre: "drama", spend: 3200000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 3800000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 2500000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 1500000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 800000, fill: "hsl(var(--chart-5))" },
    ],
  },
  kantipur: {
    name: "Kantipur TV",
    data: [
      { genre: "drama", spend: 2800000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 3400000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 2200000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 1200000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 650000, fill: "hsl(var(--chart-5))" },
    ],
  },
  nepal_television: {
    name: "Nepal Television",
    data: [
      { genre: "drama", spend: 2600000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 3100000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 2000000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 1100000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 600000, fill: "hsl(var(--chart-5))" },
    ],
  },
  image_tv: {
    name: "Image TV",
    data: [
      { genre: "drama", spend: 2400000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2900000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1800000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 1000000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 550000, fill: "hsl(var(--chart-5))" },
    ],
  },
  news_24: {
    name: "News 24",
    data: [
      { genre: "drama", spend: 2200000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2700000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1600000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 900000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 500000, fill: "hsl(var(--chart-5))" },
    ],
  },
  avenues_tv: {
    name: "Avenues TV",
    data: [
      { genre: "drama", spend: 2000000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2500000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1400000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 850000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 450000, fill: "hsl(var(--chart-5))" },
    ],
  },
  ap1_tv: {
    name: "AP1 TV",
    data: [
      { genre: "drama", spend: 1800000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2300000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1200000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 800000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 400000, fill: "hsl(var(--chart-5))" },
    ],
  },
  ntv: {
    name: "NTV",
    data: [
      { genre: "drama", spend: 1700000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2200000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1100000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 750000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 350000, fill: "hsl(var(--chart-5))" },
    ],
  },
  abc_tv: {
    name: "ABC TV",
    data: [
      { genre: "drama", spend: 1600000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 2000000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 1000000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 700000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 300000, fill: "hsl(var(--chart-5))" },
    ],
  },
  sagarmatha_tv: {
    name: "Sagarmatha TV",
    data: [
      { genre: "drama", spend: 1500000, fill: "hsl(var(--chart-1))" },
      { genre: "news", spend: 1800000, fill: "hsl(var(--chart-2))" },
      { genre: "entertainment", spend: 900000, fill: "hsl(var(--chart-3))" },
      { genre: "sports", spend: 650000, fill: "hsl(var(--chart-4))" },
      { genre: "other", spend: 250000, fill: "hsl(var(--chart-5))" },
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
  const [selectedChannel, setSelectedChannel] = useState("himalaya_tv");

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
        <div className="flex justify-end">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="himalaya_tv">Himalaya TV</SelectItem>
              <SelectItem value="kantipur">Kantipur TV</SelectItem>
              <SelectItem value="nepal_television">Nepal Television</SelectItem>
              <SelectItem value="image_tv">Image TV</SelectItem>
              <SelectItem value="news_24">News 24</SelectItem>
              <SelectItem value="avenues_tv">Avenues TV</SelectItem>
              <SelectItem value="ap1_tv">AP1 TV</SelectItem>
              <SelectItem value="ntv">NTV</SelectItem>
              <SelectItem value="abc_tv">ABC TV</SelectItem>
              <SelectItem value="sagarmatha_tv">Sagarmatha TV</SelectItem>
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
              tickFormatter={formatCurrency}
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
      // footer={
      //   <p className="text-sm text-gray-500">
      //     Showing ad spend distribution for {channelData[selectedChannel].name}
      //   </p>
      // }
    />
  );
}