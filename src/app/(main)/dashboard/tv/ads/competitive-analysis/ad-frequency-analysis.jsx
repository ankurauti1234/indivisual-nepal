"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
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

// Sample data for ad frequency by channel
const frequencyData = {
  television: [
    {
      id: "Shivam Cement",
      data: [
        { x: "Morning", y: 45 },
        { x: "Afternoon", y: 30 },
        { x: "Evening", y: 60 },
        { x: "Night", y: 25 },
      ],
    },
    {
      id: "N Cell",
      data: [
        { x: "Morning", y: 35 },
        { x: "Afternoon", y: 40 },
        { x: "Evening", y: 50 },
        { x: "Night", y: 20 },
      ],
    },
    {
      id: "Asian Paints",
      data: [
        { x: "Morning", y: 20 },
        { x: "Afternoon", y: 25 },
        { x: "Evening", y: 35 },
        { x: "Night", y: 15 },
      ],
    },
    {
      id: "Nike",
      data: [
        { x: "Morning", y: 15 },
        { x: "Afternoon", y: 20 },
        { x: "Evening", y: 25 },
        { x: "Night", y: 10 },
      ],
    },
    {
      id: "Others",
      data: [
        { x: "Morning", y: 10 },
        { x: "Afternoon", y: 15 },
        { x: "Evening", y: 20 },
        { x: "Night", y: 5 },
      ],
    },
  ],
  radio: [
    {
      id: "Shivam Cement",
      data: [
        { x: "Morning", y: 50 },
        { x: "Afternoon", y: 35 },
        { x: "Evening", y: 55 },
        { x: "Night", y: 20 },
      ],
    },
    {
      id: "N Cell",
      data: [
        { x: "Morning", y: 40 },
        { x: "Afternoon", y: 45 },
        { x: "Evening", y: 40 },
        { x: "Night", y: 15 },
      ],
    },
    {
      id: "Asian Paints",
      data: [
        { x: "Morning", y: 25 },
        { x: "Afternoon", y: 30 },
        { x: "Evening", y: 30 },
        { x: "Night", y: 10 },
      ],
    },
    {
      id: "Nike",
      data: [
        { x: "Morning", y: 20 },
        { x: "Afternoon", y: 25 },
        { x: "Evening", y: 20 },
        { x: "Night", y: 5 },
      ],
    },
    {
      id: "Others",
      data: [
        { x: "Morning", y: 15 },
        { x: "Afternoon", y: 10 },
        { x: "Evening", y: 15 },
        { x: "Night", y: 3 },
      ],
    },
  ],
  digital: [
    {
      id: "Shivam Cement",
      data: [
        { x: "Morning", y: 60 },
        { x: "Afternoon", y: 45 },
        { x: "Evening", y: 70 },
        { x: "Night", y: 30 },
      ],
    },
    {
      id: "N Cell",
      data: [
        { x: "Morning", y: 50 },
        { x: "Afternoon", y: 55 },
        { x: "Evening", y: 60 },
        { x: "Night", y: 25 },
      ],
    },
    {
      id: "Asian Paints",
      data: [
        { x: "Morning", y: 30 },
        { x: "Afternoon", y: 35 },
        { x: "Evening", y: 40 },
        { x: "Night", y: 20 },
      ],
    },
    {
      id: "Nike",
      data: [
        { x: "Morning", y: 25 },
        { x: "Afternoon", y: 30 },
        { x: "Evening", y: 30 },
        { x: "Night", y: 15 },
      ],
    },
    {
      id: "Others",
      data: [
        { x: "Morning", y: 20 },
        { x: "Afternoon", y: 25 },
        { x: "Evening", y: 25 },
        { x: "Night", y: 10 },
      ],
    },
  ],
};

export default function AdFrequencyAnalysis() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-2 border rounded shadow">
          <p className="font-medium">{data.id}</p>
          <p className="text-sm">{`Daypart: ${data.x}`}</p>
          <p className="text-sm">{`Ad Count: ${data.y}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Ad Frequency Analysis"
      description="Daypart Distribution 2024"
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
        <div style={{ height: 400 }}>
          <ResponsiveHeatMap
            data={frequencyData[selectedChannel]}
            margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
            axisTop={null}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Advertisers",
              legendPosition: "middle",
              legendOffset: -60,
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Dayparts",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            colors={{
              type: "sequential",
              scheme: "blues",
              minValue: 0,
              maxValue: 70,
            }}
            cellOpacity={1}
            cellBorderColor="#fff"
            labelTextColor="#fff"
            hoverTarget="cell"
            cellHoverOthersOpacity={0.25}
            tooltip={CustomTooltip}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad frequency distribution for{" "}
          {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
        </p>
      }
    />
  );
}
