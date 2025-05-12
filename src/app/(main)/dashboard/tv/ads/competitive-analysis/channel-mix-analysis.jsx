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

// Sample data for channel mix analysis
const channelMixData = {
  // Data for top advertisers across different channels
  advertisers: [
    {
      name: "Shivam Cement",
      television: 45,
      radio: 25,
      digital: 30,
    },
    {
      name: "N Cell",
      television: 35,
      radio: 20,
      digital: 40,
    },
    {
      name: "Asian Paints",
      television: 25,
      radio: 15,
      digital: 50,
    },
    {
      name: "Nike",
      television: 40,
      radio: 30,
      digital: 20,
    },
    {
      name: "Others",
      television: 30,
      radio: 20,
      digital: 35,
    },
  ],

  // Years available for comparison
  years: ["2022", "2023", "2024"],
};

// Better color palette for channels
const channelColors = {
  television: "#4361ee", // Royal blue
  radio: "#3a0ca3", // Purple
  digital: "#7209b7", // Violet
  print: "#f72585", // Pink
  outOfHome: "#4cc9f0", // Light blue
};

export default function ChannelMixAnalysis() {
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("Shivam Cement");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Transform data for Recharts
  const transformDataForChart = () => {
    // Find the selected advertiser's data
    const advertiserData = channelMixData.advertisers.find(
      (adv) => adv.name === selectedAdvertiser
    );

    if (!advertiserData) {
      return [];
    }

    // Transform to Recharts format (array of objects)
    return Object.keys(advertiserData)
      .filter((key) => key !== "name") // Exclude the name property
      .map((channel) => ({
        channel: channel.charAt(0).toUpperCase() + channel.slice(1), // Capitalize channel name
        percentage: advertiserData[channel],
      }))
      .filter((item) => item.percentage > 0); // Only include channels with non-zero values
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{payload[0].payload.channel}</p>
          <p>{`${payload[0].value}% of ad spend`}</p>
        </div>
      );
    }
    return null;
  };

  // Get color for channel
  const getChannelColor = (channel) => {
    const channelKey = channel.toLowerCase();
    return channelColors[channelKey] || "#888888"; // Default color if not found
  };

  // Custom legend component
  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
      {Object.keys(channelColors).map((channel) => (
        <div key={channel} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: channelColors[channel] }}
          />
          <span className="truncate capitalize">{channel}</span>
        </div>
      ))}
    </div>
  );

  const chartData = transformDataForChart();

  return (
    <ChartCard
      icon={<BarChartIcon className="w-6 h-6" />}
      title="Channel Mix Analysis"
      description="Comparing Competitors' Channel Preferences"
      action={
        <div className="flex space-x-2  w-full justify-end ">
          <Select
            value={selectedAdvertiser}
            onValueChange={setSelectedAdvertiser}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select advertiser" />
            </SelectTrigger>
            <SelectContent>
              {channelMixData.advertisers.map((advertiser) => (
                <SelectItem key={advertiser.name} value={advertiser.name}>
                  {advertiser.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {channelMixData.years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="channel" />
              <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" name="Channel Share">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getChannelColor(entry.channel)}
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
            {selectedAdvertiser}'s channel distribution for {selectedYear}
          </p>
        </div>
      }
    />
  );
}
