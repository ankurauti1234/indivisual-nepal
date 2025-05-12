"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

// Enhanced color palette with opacity options
const colors = {
  "Shivam Cement": {
    stroke: "#ff6b6b",
    fill: "#ff6b6b",
  },
  "N Cell": {
    stroke: "#4ecdc4",
    fill: "#4ecdc4",
  },
  "Asian Paints": {
    stroke: "#45b7d1",
    fill: "#45b7d1",
  },
  Nike: {
    stroke: "#96ceb4",
    fill: "#96ceb4",
  },
  Others: {
    stroke: "#ddd111",
    fill: "#ddd111",
  },
};

// Daypart definitions with time ranges for better context
const dayparts = [
  { key: "Morning", label: "Morning (6am-12pm)" },
  { key: "Afternoon", label: "Afternoon (12pm-5pm)" },
  { key: "Evening", label: "Evening (5pm-10pm)" },
  { key: "Night", label: "Night (10pm-6am)" },
];

export default function DaypartDistribution() {
  const [selectedChannel, setSelectedChannel] = useState("television");
  const [highlightedAdvertiser, setHighlightedAdvertiser] = useState(null);

  // Calculate industry average for benchmarking
  const calculateIndustryAverage = () => {
    const data = rawData[selectedChannel];
    const daypartKeys = ["Morning", "Afternoon", "Evening", "Night"];

    // Calculate total impressions by daypart across all advertisers
    const totalsByDaypart = daypartKeys.reduce((acc, daypart) => {
      acc[daypart] = data.reduce((sum, item) => sum + item[daypart], 0);
      return acc;
    }, {});

    // Get total impressions overall
    const totalImpressions = Object.values(totalsByDaypart).reduce(
      (sum, val) => sum + val,
      0
    );

    // Calculate average percentage for each daypart
    return daypartKeys.reduce((acc, daypart) => {
      acc[daypart] = (totalsByDaypart[daypart] / totalImpressions) * 100;
      return acc;
    }, {});
  };

  // Transform data for Recharts radar chart with improved metrics
  const transformData = () => {
    const data = rawData[selectedChannel];
    const industryAvg = calculateIndustryAverage();

    // Create radar chart data with percentage of total ads per daypart
    return dayparts.map((daypart) => {
      const entry = {
        daypart: daypart.key,
        fullLabel: daypart.label,
        industryAvg: parseFloat(industryAvg[daypart.key].toFixed(1)),
      };

      data.forEach((item) => {
        // Calculate total ads for this advertiser
        const total = item.Morning + item.Afternoon + item.Evening + item.Night;

        // Calculate what percentage of this advertiser's ads run during this daypart
        const percentage = ((item[daypart.key] / total) * 100).toFixed(1);

        // Store raw count for tooltip context
        entry[`${item.advertiser}Raw`] = item[daypart.key];

        // Store percentage for radar display
        entry[item.advertiser] = parseFloat(percentage);

        // Calculate index vs industry average (>100 means over-indexed)
        const indexVsIndustry = (
          (percentage / industryAvg[daypart.key]) *
          100
        ).toFixed(0);
        entry[`${item.advertiser}Index`] = parseInt(indexVsIndustry);
      });

      return entry;
    });
  };

  // Enhanced tooltip for radar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const daypartData = payload[0].payload;

      return (
        <div className="bg-white p-3 border rounded shadow-lg text-sm">
          <p className="font-medium text-base">{daypartData.fullLabel}</p>
          <p className="text-xs text-gray-500 mb-2">
            Industry Average: {daypartData.industryAvg}%
          </p>

          <div className="space-y-1.5">
            {payload
              .filter(
                (entry) =>
                  !entry.dataKey.includes("Raw") &&
                  !entry.dataKey.includes("Index") &&
                  entry.dataKey !== "industryAvg"
              )
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => {
                const advertiser = entry.dataKey;
                const rawCount = daypartData[`${advertiser}Raw`];
                const indexValue = daypartData[`${advertiser}Index`];
                const indexClass =
                  indexValue > 110
                    ? "text-green-600"
                    : indexValue < 90
                    ? "text-red-600"
                    : "text-gray-600";

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-100 pb-1 last:border-0"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{ backgroundColor: colors[advertiser].fill }}
                      />
                      <span className="font-medium">{advertiser}</span>
                    </div>
                    <div className="flex space-x-3">
                      <span>{entry.value}%</span>
                      <span className="text-gray-500">({rawCount})</span>
                      <span className={indexClass}>
                        {indexValue > 100 ? "+" : ""}
                        {indexValue - 100}%
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend with interactive highlighting
  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((advertiser) => (
        <div
          key={advertiser}
          className="flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50"
          onMouseEnter={() => setHighlightedAdvertiser(advertiser)}
          onMouseLeave={() => setHighlightedAdvertiser(null)}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[advertiser].fill }}
          />
          <span className="truncate">{advertiser}</span>
        </div>
      ))}
    </div>
  );

  const chartData = transformData();

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Daypart Distribution"
      description="Advertiser Strategy Analysis 2024"
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
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius={140}>
              <PolarGrid
                stroke="#e0e0e0"
                strokeDasharray="3 3"
                gridType="circle"
              />
              <PolarAngleAxis
                dataKey="daypart"
                tick={{ fontSize: 12, fill: "#666" }}
                tickLine={false}
                stroke="#888"
                tickFormatter={(value) => {
                  const daypart = dayparts.find((d) => d.key === value);
                  return daypart ? daypart.key : value;
                }}
              />
              <PolarRadiusAxis
                angle={45}
                domain={[0, 60]}
                tickCount={5}
                stroke="#888"
                tickLine={false}
                tick={{ fontSize: 10, fill: "#666" }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Industry average line */}
              <Radar
                name="Industry Avg"
                dataKey="industryAvg"
                stroke="#888888"
                fill="#888888"
                fillOpacity={0.1}
                strokeDasharray="5 5"
                strokeWidth={1}
              />

              {/* Advertiser lines */}
              {Object.keys(colors).map((advertiser) => (
                <Radar
                  key={advertiser}
                  name={advertiser}
                  dataKey={advertiser}
                  stroke={colors[advertiser].stroke}
                  fill={colors[advertiser].fill}
                  fillOpacity={
                    highlightedAdvertiser === null
                      ? 0.2
                      : highlightedAdvertiser === advertiser
                      ? 0.5
                      : 0.05
                  }
                  strokeWidth={highlightedAdvertiser === advertiser ? 2 : 1}
                  strokeOpacity={
                    highlightedAdvertiser === null
                      ? 0.8
                      : highlightedAdvertiser === advertiser
                      ? 1
                      : 0.3
                  }
                  animationDuration={500}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      }
      footer={<CustomLegend />}
    />
  );
}
