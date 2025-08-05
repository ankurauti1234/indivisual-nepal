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
  Legend,
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
import { Toggle } from "@/components/ui/toggle";
import ChartCard from "@/components/card/charts-card";

// Data for daypart distribution by channel and advertiser
const rawData = {
  byChannel: {
    television: [
      {
        name: "NEPAL TV - KANTIPUR HD TV",
        "Early Morning": 20284.14,
        Morning: 18703.68,
        Afternoon: 19582.32,
        "Late Evening": 19200.18,
      },
      {
        name: "NEPAL TV - GALAXY 4K",
        "Early Morning": 19536,
        Morning: 17215.62,
        Afternoon: 18052.44,
        "Late Evening": 18647.16,
      },
      {
        name: "NEPAL TV - IMAGE CHANNEL",
        "Early Morning": 20396.04,
        Morning: 18979.32,
        Afternoon: 18346.86,
        "Late Evening": 16436.4,
      },
      {
        name: "NEPAL TV - NEWS 24",
        "Early Morning": 18284.1,
        Morning: 18957.48,
        Afternoon: 19390.68,
        "Late Evening": 19499.34,
      },
      {
        name: "NEPAL TV - NTV NEPAL",
        "Early Morning": 19701.54,
        Morning: 18937.68,
        Afternoon: 17869.2,
        "Late Evening": 19011,
      },
    ],
  },
  byAdvertiser: {
    television: [
      {
        name: "Dabur",
        "Early Morning": 4255.56,
        Morning: 4619.4,
        Afternoon: 4821.84,
        "Late Evening": 4141.44,
      },
      {
        name: "Lux",
        "Early Morning": 5147.64,
        Morning: 4659.24,
        Afternoon: 4094.52,
        "Late Evening": 4221.3,
      },
      {
        name: "Dove",
        "Early Morning": 4073.34,
        Morning: 4747.98,
        Afternoon: 4599.3,
        "Late Evening": 5023.98,
      },
      {
        name: "Right Path",
        "Early Morning": 4626.54,
        Morning: 3803.94,
        Afternoon: 4631.28,
        "Late Evening": 4638.96,
      },
      {
        name: "cinthol",
        "Early Morning": 4582.38,
        Morning: 3682.2,
        Afternoon: 4744.98,
        "Late Evening": 4634.1,
      },
      {
        name: "TATA",
        "Early Morning": 4993.56,
        Morning: 4569.36,
        Afternoon: 4341.12,
        "Late Evening": 4384.56,
      },
      {
        name: "Microwave Oven",
        "Early Morning": 3737.34,
        Morning: 4875.6,
        Afternoon: 4516.02,
        "Late Evening": 4653.24,
      },
      {
        name: "Dermi cool",
        "Early Morning": 5048.34,
        Morning: 4580.58,
        Afternoon: 3813.12,
        "Late Evening": 3712.38,
      },
      {
        name: "Minto",
        "Early Morning": 5063.1,
        Morning: 4677.12,
        Afternoon: 4467.24,
        "Late Evening": 4698.72,
      },
      {
        name: "LG",
        "Early Morning": 4736.1,
        Morning: 4051.92,
        Afternoon: 3549.18,
        "Late Evening": 4421.76,
      },
      {
        name: "Closeup",
        "Early Morning": 4591.14,
        Morning: 5138.76,
        Afternoon: 4867.38,
        "Late Evening": 4029.72,
      },
      {
        name: "OK laundry soap",
        "Early Morning": 4678.2,
        Morning: 4123.74,
        Afternoon: 4978.56,
        "Late Evening": 4241.82,
      },
      {
        name: "Photex Power",
        "Early Morning": 5181.36,
        Morning: 4254,
        Afternoon: 4515.54,
        "Late Evening": 5056.98,
      },
      {
        name: "Toffichoo",
        "Early Morning": 4455.72,
        Morning: 4520.28,
        Afternoon: 4143.3,
        "Late Evening": 4202.28,
      },
      {
        name: "Citizen Life",
        "Early Morning": 5283.06,
        Morning: 4523.58,
        Afternoon: 5037.06,
        "Late Evening": 3791.28,
      },
      {
        name: "Asianpaints",
        "Early Morning": 4667.04,
        Morning: 4749.6,
        Afternoon: 4183.74,
        "Late Evening": 5433.54,
      },
      {
        name: "Air Purifier",
        "Early Morning": 4331.7,
        Morning: 4389.3,
        Afternoon: 4423.62,
        "Late Evening": 3735.18,
      },
      {
        name: "Sprite",
        "Early Morning": 4822.56,
        Morning: 4811.94,
        Afternoon: 4539.54,
        "Late Evening": 4575.96,
      },
      {
        name: "E Sewa",
        "Early Morning": 4254.66,
        Morning: 3714.06,
        Afternoon: 3948.18,
        "Late Evening": 3690.6,
      },
      {
        name: "Fanta",
        "Early Morning": 4591.62,
        Morning: 3658.74,
        Afternoon: 3900.66,
        "Late Evening": 5004.24,
      },
      {
        name: "CG",
        "Early Morning": 5080.86,
        Morning: 4642.44,
        Afternoon: 5125.32,
        "Late Evening": 4502.04,
      },
    ],
  },
};

// Color palette for entities (channels and advertisers)
const colors = {
  "NEPAL TV - KANTIPUR HD TV": "#FF6B6B",
  "NEPAL TV - GALAXY 4K": "#4ECDC4",
  "NEPAL TV - IMAGE CHANNEL": "#45B7D1",
  "NEPAL TV - NEWS 24": "#96CEB4",
  "NEPAL TV - NTV NEPAL": "#FFEEAD",
  Dabur: "#D4A5A5",
  Lux: "#9B59B6",
  Dove: "#3498DB",
  "Right Path": "#E74C3C",
  cinthol: "#2ECC71",
  TATA: "#F1C40F",
  "Microwave Oven": "#E67E22",
  "Dermi cool": "#1ABC9C",
  Minto: "#8E44AD",
  LG: "#C0392B",
  Closeup: "#27AE60",
  "OK laundry soap": "#F39C12",
  "Photex Power": "#2980B9",
  Toffichoo: "#D35400",
  "Citizen Life": "#16A085",
  Asianpaints: "#7F8C8D",
  "Air Purifier": "#E91E63",
  Sprite: "#00BCD4",
  "E Sewa": "#9C27B0",
  Fanta: "#FF9800",
  CG: "#4CAF50",
};

// Daypart definitions with time ranges
const dayparts = [
  { key: "Early Morning", label: "Early Morning (00:00-05:00)" },
  { key: "Morning", label: "Morning (06:00-11:00)" },
  { key: "Afternoon", label: "Afternoon (12:00-17:00)" },
  { key: "Late Evening", label: "Late Evening (18:00-23:00)" },
];

export default function DaypartDistribution() {
  const [viewMode, setViewMode] = useState("byChannel"); // Toggle between byChannel and byAdvertiser
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("Dabur");

  // Transform data for Recharts bar chart
  const transformData = () => {
    if (viewMode === "byChannel") {
      return dayparts.map((daypart) => {
        const dataPoint = { daypart: daypart.key, fullLabel: daypart.label };
        rawData.byChannel.television.forEach((channel) => {
          dataPoint[channel.name] = channel[daypart.key];
        });
        return dataPoint;
      });
    } else {
      const advertiserData = rawData.byAdvertiser.television.find(
        (item) => item.name === selectedAdvertiser
      );
      if (!advertiserData) {
        return [];
      }
      return dayparts.map((daypart) => ({
        daypart: daypart.key,
        fullLabel: daypart.label,
        seconds: advertiserData[daypart.key],
      }));
    }
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg backdrop-blur-sm text-sm">
          <p className="font-semibold text-gray-800">{payload[0].payload.fullLabel}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-gray-600"
              style={{ color: colors[entry.name] }}
            >
              {`${entry.name}: ${entry.value.toFixed(2)} seconds`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 px-4 text-sm">
      {rawData[viewMode].television.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[item.name] }}
          />
          <span className="truncate text-gray-700">{item.name}</span>
        </div>
      ))}
    </div>
  );

  const chartData = transformData();

  return (
    <ChartCard
      icon={<BarChartIcon className="w-7 h-7 text-blue-500" />}
      title="Daypart Distribution"
      description="Strategy Analysis 2025"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Toggle
            pressed={viewMode === "byAdvertiser"}
            onPressedChange={() => {
              setViewMode(viewMode === "byChannel" ? "byAdvertiser" : "byChannel");
            }}
            className="bg-white border-gray-200 hover:bg-gray-100"
          >
            {viewMode === "byChannel" ? "Show Advertisers" : "Show Channels"}
          </Toggle>
          {viewMode === "byAdvertiser" && (
            <Select value={selectedAdvertiser} onValueChange={setSelectedAdvertiser}>
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <SelectValue placeholder="Select advertiser" />
              </SelectTrigger>
              <SelectContent>
                {rawData.byAdvertiser.television.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      }
      chart={
        <div className="w-full h-96 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              barGap={2}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="daypart" tickMargin={10} />
              <YAxis
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} verticalAlign="bottom" align="center" />
              {viewMode === "byChannel" ? (
                rawData.byChannel.television.map((channel) => (
                  <Bar
                    key={channel.name}
                    dataKey={channel.name}
                    name={channel.name}
                    fill={colors[channel.name]}
                    barSize={30}
                    radius={[4, 4, 0, 0]}
                    style={{ transition: "all 0.3s ease" }}
                  />
                ))
              ) : (
                <Bar dataKey="seconds" name={selectedAdvertiser} fill={colors[selectedAdvertiser]}  barSize={60} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[selectedAdvertiser]}
                      style={{ transition: "all 0.3s ease" }}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
      footer={
        <div className="mt-2">
          <p className="text-sm text-gray-500 mt-2">
            {viewMode === "byChannel"
              ? "Daypart distribution across channels for television in 2025"
              : `${selectedAdvertiser}'s daypart distribution for television in 2025`}
          </p>
        </div>
      }
    />
  );
}