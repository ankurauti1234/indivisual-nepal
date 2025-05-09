import React from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { PieChartIcon } from "lucide-react";

const genreColors = {
  News: "#FF8A80",
  Entertainment: "#FFD180",
  Sports: "#80D8FF",
  Movies: "#A7FFEB",
  Series: "#CCFF90",
  Documentary: "#CF93D9",
  "Reality Shows": "#FFAB91",
  Music: "#81D4FA",
};

const genreData = [
  {
    genre: "News",
    revenue: 35,
    fill: genreColors["News"],
  },
  {
    genre: "Entertainment",
    revenue: 25,
    fill: genreColors["Entertainment"],
  },
  {
    genre: "Sports",
    revenue: 15,
    fill: genreColors["Sports"],
  },
  {
    genre: "Movies",
    revenue: 10,
    fill: genreColors["Movies"],
  },
  {
    genre: "Series",
    revenue: 5,
    fill: genreColors["Series"],
  },
  {
    genre: "Documentary",
    revenue: 4,
    fill: genreColors["Documentary"],
  },
  {
    genre: "Reality Shows",
    revenue: 4,
    fill: genreColors["Reality Shows"],
  },
  {
    genre: "Music",
    revenue: 2,
    fill: genreColors["Music"],
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border rounded shadow">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Revenue: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Legend = ({ data }) => (
  <div className="grid grid-cols-5 gap-1 mt-2 px-2 text-xs">
    {data.map((entry) => (
      <div key={entry.genre} className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.fill }}
        />
        <span className="truncate">{entry.genre}</span>
      </div>
    ))}
  </div>
);

export default function GenreRevenuePieChart() {
  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Revenue Distribution by Genre"
      description="Percentage of Total Revenue"
      chart={
        <PieChart width={500} height={400}>
          <Pie
            data={genreData}
            dataKey="revenue"
            nameKey="genre"
            cx="50%"
            cy="50%"
            outerRadius={160}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      }
      footer={<Legend data={genreData} />}
    />
  );
}
