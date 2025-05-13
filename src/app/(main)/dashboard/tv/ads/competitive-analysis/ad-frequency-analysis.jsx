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
      id: "Dabur Nepal",
      data: [
        { x: "Morning", y: 12 },
        { x: "Afternoon", y: 15 },
        { x: "Evening", y: 20 },
        { x: "Night", y: 8 },
      ],
    },
    {
      id: "CG Electronics",
      data: [
        { x: "Morning", y: 14 },
        { x: "Afternoon", y: 18 },
        { x: "Evening", y: 22 },
        { x: "Night", y: 9 },
      ],
    },
    {
      id: "Yeti Airlines",
      data: [
        { x: "Morning", y: 10 },
        { x: "Afternoon", y: 12 },
        { x: "Evening", y: 18 },
        { x: "Night", y: 7 },
      ],
    },
    {
      id: "Nabil Bank",
      data: [
        { x: "Morning", y: 11 },
        { x: "Afternoon", y: 14 },
        { x: "Evening", y: 19 },
        { x: "Night", y: 8 },
      ],
    },
    {
      id: "Wai Wai Noodles",
      data: [
        { x: "Morning", y: 13 },
        { x: "Afternoon", y: 16 },
        { x: "Evening", y: 21 },
        { x: "Night", y: 9 },
      ],
    },
    {
      id: "Goldstar Shoes",
      data: [
        { x: "Morning", y: 10 },
        { x: "Afternoon", y: 13 },
        { x: "Evening", y: 17 },
        { x: "Night", y: 7 },
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
      id: "Dabur Nepal",
      data: [
        { x: "Morning", y: 14 },
        { x: "Afternoon", y: 12 },
        { x: "Evening", y: 15 },
        { x: "Night", y: 4 },
      ],
    },
    {
      id: "CG Electronics",
      data: [
        { x: "Morning", y: 12 },
        { x: "Afternoon", y: 10 },
        { x: "Evening", y: 13 },
        { x: "Night", y: 3 },
      ],
    },
    {
      id: "Yeti Airlines",
      data: [
        { x: "Morning", y: 13 },
        { x: "Afternoon", y: 11 },
        { x: "Evening", y: 14 },
        { x: "Night", y: 4 },
      ],
    },
    {
      id: "Nabil Bank",
      data: [
        { x: "Morning", y: 15 },
        { x: "Afternoon", y: 13 },
        { x: "Evening", y: 16 },
        { x: "Night", y: 5 },
      ],
    },
    {
      id: "Wai Wai Noodles",
      data: [
        { x: "Morning", y: 16 },
        { x: "Afternoon", y: 14 },
        { x: "Evening", y: 17 },
        { x: "Night", y: 6 },
      ],
    },
    {
      id: "Goldstar Shoes",
      data: [
        { x: "Morning", y: 13 },
        { x: "Afternoon", y: 11 },
        { x: "Evening", y: 14 },
        { x: "Night", y: 4 },
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
        0,
        { x: "Afternoon", y: 30 },
        { x: "Evening", y: 30 },
        { x: "Night", y: 15 },
      ],
    },
    {
      id: "Dabur Nepal",
      data: [
        { x: "Morning", y: 20 },
        { x: "Afternoon", y: 25 },
        { x: "Evening", y: 25 },
        { x: "Night", y: 10 },
      ],
    },
    {
      id: "CG Electronics",
      data: [
        { x: "Morning", y: 18 },
        { x: "Afternoon", y: 22 },
        { x: "Evening", y: 23 },
        { x: "Night", y: 9 },
      ],
    },
    {
      id: "Yeti Airlines",
      data: [
        { x: "Morning", y: 22 },
        { x: "Afternoon", y: 27 },
        { x: "Evening", y: 28 },
        { x: "Night", y: 12 },
      ],
    },
    {
      id: "Nabil Bank",
      data: [
        { x: "Morning", y: 19 },
        { x: "Afternoon", y: 24 },
        { x: "Evening", y: 26 },
        { x: "Night", y: 11 },
      ],
    },
    {
      id: "Wai Wai Noodles",
      data: [
        { x: "Morning", y: 21 },
        { x: "Afternoon", y: 26 },
        { x: "Evening", y: 27 },
        { x: "Night", y: 10 },
      ],
    },
    {
      id: "Goldstar Shoes",
      data: [
        { x: "Morning", y: 18 },
        { x: "Afternoon", y: 23 },
        { x: "Evening", y: 24 },
        { x: "Night", y: 9 },
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
        <div style={{ height: 400 }}>
          <ResponsiveHeatMap
            data={frequencyData[selectedChannel]}
            margin={{ top: 20, right: 20, bottom: 60, left: 120 }}
            axisTop={null}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
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
              scheme: "reds",
              minValue: -10,
              maxValue: 70,
            }}
            cellOpacity={1}
            cellBorderColor="#fff"
            labelTextColor="#fff"
            hoverTarget="cell"
            cellHoverOthersOpacity={1.5}
            tooltip={CustomTooltip}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            sizeVariation={false} // Ensures uniform cells
            theme={{
              axis: {
                ticks: {
                  text: {
                    fontSize: 14,
                    fontWeight: 700,
                    fill: "#2d2d2d",
                  },
                },
              },
              labels: {
                text: {
                  fontSize: 14,
                  fontWeight: 700,
                  fill: "#fff",
                },
              },
              tooltip: {
                container: {
                  fontSize: 14,
                  fontWeight: 700,
                },
              },
            }}
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
