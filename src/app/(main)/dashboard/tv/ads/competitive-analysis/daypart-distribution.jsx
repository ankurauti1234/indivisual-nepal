"use client";

import { BarChartIcon } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChartCard from "@/components/card/charts-card";

// Sample data for daypart distribution by channel
const rawData = {
  television: [
    {
      advertiser: "Shivam Cement",
      Morning: 45,
      Afternoon: 30,
      Evening: 60,
      Night: 25,
    },
    {
      advertiser: "N Cell",
      Morning: 35,
      Afternoon: 40,
      Evening: 50,
      Night: 20,
    },
    {
      advertiser: "Asian Paints",
      Morning: 20,
      Afternoon: 25,
      Evening: 35,
      Night: 15,
    },
    {
      advertiser: "Nike",
      Morning: 15,
      Afternoon: 20,
      Evening: 25,
      Night: 10,
    },
    { advertiser: "Others", Morning: 10, Afternoon: 15, Evening: 20, Night: 5 },
  ],
  radio: [
    {
      advertiser: "Shivam Cement",
      Morning: 50,
      Afternoon: 35,
      Evening: 55,
      Night: 20,
    },
    {
      advertiser: "N Cell",
      Morning: 40,
      Afternoon: 45,
      Evening: 40,
      Night: 15,
    },
    {
      advertiser: "Asian Paints",
      Morning: 25,
      Afternoon: 30,
      Evening: 30,
      Night: 10,
    },
    {
      advertiser: "Nike",
      Morning: 20,
      Afternoon: 25,
      Evening: 20,
      Night: 5,
    },
    { advertiser: "Others", Morning: 15, Afternoon: 10, Evening: 15, Night: 3 },
  ],
  digital: [
    {
      advertiser: "Shivam Cement",
      Morning: 60,
      Afternoon: 45,
      Evening: 70,
      Night: 30,
    },
    {
      advertiser: "N Cell",
      Morning: 50,
      Afternoon: 55,
      Evening: 60,
      Night: 25,
    },
    {
      advertiser: "Asian Paints",
      Morning: 30,
      Afternoon: 35,
      Evening: 40,
      Night: 20,
    },
    {
      advertiser: "Nike",
      Morning: 25,
      Afternoon: 30,
      Evening: 30,
      Night: 15,
    },
    {
      advertiser: "Others",
      Morning: 20,
      Afternoon: 25,
      Evening: 25,
      Night: 10,
    },
  ],
};

// Color palette for advertisers
const colors = {
  "Shivam Cement": "#ff6b6b",
  "N Cell": "#4ecdc4",
  "Asian Paints": "#45b7d1",
  Nike: "#96ceb4",
  Others: "#ddd111",
};

// Daypart definitions with time ranges
const dayparts = [
  { key: "Morning", label: "Morning (6am-12pm)" },
  { key: "Afternoon", label: "Afternoon (12pm-5pm)" },
  { key: "Evening", label: "Evening (5pm-10pm)" },
  { key: "Night", label: "Night (10pm-6am)" },
];

export default function DaypartDistribution() {
  const [selectedChannel, setSelectedChannel] = useState("television");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("Shivam Cement");

  // Transform data for Recharts bar chart
  const transformData = () => {
    const data = rawData[selectedChannel];
    const advertiserData = data.find((item) => item.advertiser === selectedAdvertiser);

    if (!advertiserData) {
      return [];
    }

    return dayparts.map((daypart) => ({
      daypart: daypart.key,
      fullLabel: daypart.label,
      impressions: advertiserData[daypart.key],
    }));
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{payload[0].payload.fullLabel}</p>
          <p>{`${payload[0].value} impressions`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
      {Object.keys(colors).map((advertiser) => (
        <div key={advertiser} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[advertiser] }}
          />
          <span className="truncate">{advertiser}</span>
        </div>
      ))}
    </div>
  );

  const chartData = transformData();

  return (
    <ChartCard
      icon={<BarChartIcon className="w-6 h-6" />}
      title="Daypart Distribution"
      description="Advertiser Strategy Analysis 2025"
      action={
        <div className="flex space-x-2 w-full justify-end">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="television">Television</SelectItem>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedAdvertiser} onValueChange={setSelectedAdvertiser}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select advertiser" />
            </SelectTrigger>
            <SelectContent>
              {rawData[selectedChannel].map((item) => (
                <SelectItem key={item.advertiser} value={item.advertiser}>
                  {item.advertiser}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="w-full h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="daypart" />
              <YAxis tickFormatter={(value) => `${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="impressions" name="Impressions">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[selectedAdvertiser]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      footer={
        <div className="mt-2">
          <CustomLegend />
          <p className="text-sm text-gray-500 mt-2">
            {selectedAdvertiser}'s daypart distribution for {selectedChannel} in 2025
          </p>
        </div>
      }
    />
  );
}