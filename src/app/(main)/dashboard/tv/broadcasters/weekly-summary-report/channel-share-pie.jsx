import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { PieChartIcon } from "lucide-react";

const channelColors = {
  "Kantipur TV": "#D32F2F", // Dark Red
  "Nepal Television": "#FF9800", // Dark Orange
  "AP1 TV": "#1976D2", // Dark Blue
  "Himalaya TV": "#0288D1", // Deep Sky Blue
  "News 24 Nepal": "#388E3C", // Dark Green
  "Image Channel": "#7B1FA2", // Dark Purple
  "Avenues Television": "#F57C00", // Dark Amber
  "Mountain Television": "#0288D1", // Deep Blue
  "Sagarmatha TV": "#D81B60", // Dark Pink
};


const channelData = [
  {
    channel_name: "Kantipur TV",
    share_percentage: 20,
    fill: channelColors["Kantipur TV"],
  },
  {
    channel_name: "Nepal Television",
    share_percentage: 18,
    fill: channelColors["Nepal Television"],
  },
  {
    channel_name: "AP1 TV",
    share_percentage: 14,
    fill: channelColors["AP1 TV"],
  },
  {
    channel_name: "Himalaya TV",
    share_percentage: 12,
    fill: channelColors["Himalaya TV"],
  },
  {
    channel_name: "News 24 Nepal",
    share_percentage: 10,
    fill: channelColors["News 24 Nepal"],
  },
  {
    channel_name: "Image Channel",
    share_percentage: 10,
    fill: channelColors["Image Channel"],
  },
  {
    channel_name: "Avenues Television",
    share_percentage: 8,
    fill: channelColors["Avenues Television"],
  },
  {
    channel_name: "Mountain Television",
    share_percentage: 5,
    fill: channelColors["Mountain Television"],
  },
  {
    channel_name: "Sagarmatha TV",
    share_percentage: 3,
    fill: channelColors["Sagarmatha TV"],
  },
];

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

const Legend = ({ data }) => (
  <div className="grid grid-cols-5 gap-1 mt-2 px-2 text-xs">
    {data.map((entry) => (
      <div key={entry.channel_name} className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.fill }}
        />
        <span className="truncate">{entry.channel_name}</span>
      </div>
    ))}
  </div>
);

export default function ChannelSharePieChart() {
    return (
      <ChartCard
        icon={<PieChartIcon className="w-6 h-6" />}
        title="TV Channel Share Distribution"
        description="Market Share Percentage"
        chart={
          <PieChart width={600} height={400} >
            <Pie
              data={channelData}
              dataKey="share_percentage"
              nameKey="channel_name"
              cx="50%"
              cy="50%"
              outerRadius={160}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        }
        footer={<Legend data={channelData} />}
      />
    );
}
