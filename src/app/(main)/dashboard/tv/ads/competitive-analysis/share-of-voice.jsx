"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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

// Data processing
const rawData = [
  { name: "CG", totalSeconds: 19350.66, marketShare: 5.13 },
  { name: "Asianpaints", totalSeconds: 19033.92, marketShare: 5.05 },
  { name: "Photex Power", totalSeconds: 19007.88, marketShare: 5.04 },
  { name: "Minto", totalSeconds: 18906.18, marketShare: 5.01 },
  { name: "Sprite", totalSeconds: 18750, marketShare: 4.97 },
  { name: "Citizen Life", totalSeconds: 18634.98, marketShare: 4.94 },
  { name: "Closeup", totalSeconds: 18627, marketShare: 4.94 },
  { name: "Dove", totalSeconds: 18444.6, marketShare: 4.89 },
  { name: "TATA", totalSeconds: 18288.6, marketShare: 4.85 },
  { name: "Lux", totalSeconds: 18122.7, marketShare: 4.81 },
  { name: "OK laundry soap", totalSeconds: 18022.32, marketShare: 4.78 },
  { name: "Dabur", totalSeconds: 17838.24, marketShare: 4.73 },
  { name: "Microwave Oven", totalSeconds: 17782.2, marketShare: 4.72 },
  { name: "Right Path", totalSeconds: 17700.72, marketShare: 4.69 },
  { name: "Cinthol", totalSeconds: 17643.66, marketShare: 4.68 },
  { name: "Toffichoo", totalSeconds: 17321.58, marketShare: 4.59 },
  { name: "Fanta", totalSeconds: 17155.26, marketShare: 4.55 },
  { name: "Dermi cool", totalSeconds: 17154.42, marketShare: 4.55 },
  { name: "Air Purifier", totalSeconds: 16879.8, marketShare: 4.48 },
  { name: "LG", totalSeconds: 16758.96, marketShare: 4.44 },
  { name: "E Sewa", totalSeconds: 15607.5, marketShare: 4.16 },
];

// Colors for pie chart segments
const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",
  "#D4A5A5", "#9B59B6", "#3498DB", "#E74C3C", "#2ECC71",
  "#F1C40F", "#E67E22", "#1ABC9C", "#8E44AD", "#C0392B",
  "#27AE60", "#F39C12", "#2980B9", "#D35400", "#16A085",
  "#7F8C8D"
];

// Prepare data for pie chart
const pieData = rawData.map((item, index) => ({
  name: item.name,
  value: item.marketShare,
  color: COLORS[index % COLORS.length]
}));

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{`Share: ${payload[0].value.toFixed(2)}%`}</p>
        <p className="text-sm text-gray-600">{`Seconds: ${rawData.find(item => item.name === payload[0].name).totalSeconds.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const CustomLegend = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 px-4 text-sm">
    {pieData.map((entry) => (
      <div key={entry.name} className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="truncate text-gray-700">{entry.name}</span>
      </div>
    ))}
  </div>
);

export default function SOVPieChart() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <ChartCard
      icon={<PieChartIcon className="w-7 h-7 text-blue-500" />}
      title="Share of Voice (SoV)"
      description="Market Share Analysis 2025"
      action={
        <div className="flex justify-end">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 bg-white border-gray-200">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              innerRadius={50}
              // paddingAngle={3}
              label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              labelLine={{ stroke: "#666", strokeWidth: 1 }}
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-in-out"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend
              content={<CustomLegend />}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            /> */}
          </PieChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing Share of Voice for All Categories
        </p>
      }
    />
  );
}