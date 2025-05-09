"use client";

import React, { useState } from "react";
import { RadarIcon, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";

const brandData = {
  "Wai Wai": {
    color: "#FF6B6B",
    metrics: {
      GRP: 85,
      "Ad Spend": 1200000,
      "Reach per Ad spot": 78,
      "Total No. of Spots": 450,
    },
  },
  Pepsi: {
    color: "#0074D9",
    metrics: {
      GRP: 92,
      "Ad Spend": 1500000,
      "Reach per Ad spot": 85,
      "Total No. of Spots": 580,
    },
  },
  Current: {
    color: "#2ECC40",
    metrics: {
      GRP: 78,
      "Ad Spend": 900000,
      "Reach per Ad spot": 72,
      "Total No. of Spots": 320,
    },
  },
  "CG Foods": {
    color: "#FF851B",
    metrics: {
      GRP: 88,
      "Ad Spend": 1100000,
      "Reach per Ad spot": 82,
      "Total No. of Spots": 420,
    },
  },
};

export default function Component() {
  const [selectedBrand, setSelectedBrand] = useState("Wai Wai");

  // Transform the data for the radar chart
  const chartData = Object.keys(brandData[selectedBrand].metrics).map(
    (metric) => ({
      metric,
      value: brandData[selectedBrand].metrics[metric],
    })
  );

  // Normalize values to 0-100 scale for better visualization
  const maxValues = {
    GRP: 100,
    "Ad Spend": 1500000,
    "Reach per Ad spot": 100,
    "Total No. of Spots": 600,
  };

  const normalizedChartData = chartData.map((item) => ({
    metric: item.metric,
    value: (item.value / maxValues[item.metric]) * 100,
  }));

  const chartConfig = {
    performance: {
      label: "Performance",
      color: brandData[selectedBrand].color,
    },
  };

  return (
      <ChartCard
      icon={<RadarIcon className="w-6 h-6" />}
      title="Channel Performance Analysis"
      description="Comparing key performance metrics across channels."
      action={<div className="flex items-center justify-end">
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(brandData).map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>}
      chart={
       <ChartContainer
          config={chartConfig}
          className="flex items-center justify-center w-full max-h-[450px]"
        >
          <RadarChart data={normalizedChartData} margin={40}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-current opacity-20" />
            <PolarAngleAxis dataKey="metric" />
            <Radar
              dataKey="value"
              fill={brandData[selectedBrand].color}
              fillOpacity={0.5}
              stroke={brandData[selectedBrand].color}
            />
          </RadarChart>
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
