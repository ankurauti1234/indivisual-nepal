'use client'
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { BarChart2 } from "lucide-react";

// Example data for channels' average GRP based on genre and time period
const generateAvgGrpData = (genre, timePeriod) => {
  const baseData = {
    NTV: Math.floor(Math.random() * 100) + 50,
    "Kantipur TV": Math.floor(Math.random() * 100) + 50,
    "Image Channel": Math.floor(Math.random() * 100) + 50,
    "Avenues TV": Math.floor(Math.random() * 100) + 50,
    AP1: Math.floor(Math.random() * 100) + 50,
    "Himalayan TV": Math.floor(Math.random() * 100) + 50,
    "News 24": Math.floor(Math.random() * 100) + 50,
    "Sagarmatha": Math.floor(Math.random() * 100) + 50,
  };

  // Adjust values based on genre
  if (genre === "news") {
    baseData["NTV"] += 5;
    baseData["Kantipur TV"] += 5;
    baseData["AP1"] += 5;
  } else if (genre === "entertainment") {
    baseData["Image Channel"] += 5;
    baseData["Avenues TV"] += 5;
    baseData["News 24"] += 5;
    baseData["Sagarmatha"] += 5;
  }

  // Adjust values based on time period
  if (timePeriod === "weekly") {
    for (let key in baseData) {
      baseData[key] = baseData[key] * 7;
    }
  } else if (timePeriod === "monthly") {
    for (let key in baseData) {
      baseData[key] = baseData[key] * 30;
    }
  }

  // Convert to array and sort by GRP to identify top channel
  const sortedData = Object.keys(baseData)
    .map((channel) => ({
      name: channel,
      grp: baseData[channel],
      isTopChannel: false,
    }))
    .sort((a, b) => b.grp - a.grp);

  // Mark the top channel
  sortedData[0].isTopChannel = true;

  return sortedData;
};

const CustomBar = (props) => {
  const { fill, isTopChannel, ...rest } = props;

  if (isTopChannel) {
    return (
      <Rectangle
        {...rest}
        fill={fill}
        stroke="#e7ff85"
        strokeWidth={4}
        strokeDasharray="4 4"
      />
    );
  }

  return <Rectangle {...rest} fill={fill} radius={16} />;
};

const AvgGrpBarChart = () => {
  const [genre, setGenre] = useState("news");
  const [timePeriod, setTimePeriod] = useState("daily");
  const [avgGrpData, setAvgGrpData] = useState(
    generateAvgGrpData(genre, timePeriod)
  );

  const handleGenreChange = (value) => {
    setGenre(value);
    setAvgGrpData(generateAvgGrpData(value, timePeriod));
  };

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    setAvgGrpData(generateAvgGrpData(genre, value));
  };

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Average break GRP for Channels"
      description="View the average GRP for 4 TV channels based on selected genre and
          time period."
      action={
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Select Genre</p>
            <Select value={genre} onValueChange={handleGenreChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Select Time Period</p>
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={avgGrpData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
            />
            {/* <YAxis /> */}
            <Tooltip />
            <Legend />
            <Bar dataKey="grp" fill="#8884d8" radius={16} shape={<CustomBar />}>
              <LabelList
                dataKey="grp"
                position="center"
                offset={8}
                stroke="#ffffff"
                fontSize={14}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Data generated dynamically. Updated based on your selection.
        </p>
      }
    />
  );
};

export default AvgGrpBarChart;
