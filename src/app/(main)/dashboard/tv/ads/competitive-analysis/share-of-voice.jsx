"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

// Data sets
const data = {
  television: [
    { name: "Shivam Cement", value: 38.1, color: "#ff6b6b" },
    { name: "N Cell", value: 28.6, color: "#4ecdc4" },
    { name: "Asian Paints", value: 19.0, color: "#45b7d1" },
    { name: "Nike", value: 9.5, color: "#96ceb4" },
    { name: "Others", value: 4.8, color: "#ddd111" },
  ],
  radio: [
    { name: "Shivam Cement", value: 31.4, color: "#ff6b6b" },
    { name: "N Cell", value: 27.5, color: "#4ecdc4" },
    { name: "Asian Paints", value: 19.6, color: "#45b7d1" },
    { name: "Nike", value: 15.7, color: "#96ceb4" },
    { name: "Others", value: 5.8, color: "#ddd111" },
  ],
  digital: [
    { name: "Shivam Cement", value: 35.3, color: "#ff6b6b" },
    { name: "N Cell", value: 25.9, color: "#4ecdc4" },
    { name: "Asian Paints", value: 18.8, color: "#45b7d1" },
    { name: "Nike", value: 14.1, color: "#96ceb4" },
    { name: "Others", value: 5.9, color: "#ddd111" },
  ],
};

export default function ShareOfVoice() {
  const [selectedCategory, setSelectedCategory] = useState("television");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border rounded shadow">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`Share: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {data[selectedCategory].map((entry) => (
        <div key={entry.name} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate">{entry.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Share of Voice (SoV)"
      description="Market Share Analysis 2024"
      action={
        <div className="flex justify-end">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
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
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data[selectedCategory]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              label={({ name, value }) => `${name}: ${value}%`}
              animationBegin={0}
              animationDuration={1000}
            >
              {data[selectedCategory].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend />}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing Share of Voice for{" "}
          {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </p>
      }
    />
  );
}
