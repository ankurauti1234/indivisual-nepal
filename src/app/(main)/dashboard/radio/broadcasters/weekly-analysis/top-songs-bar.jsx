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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";
import { Radio } from "lucide-react";

// Generate sample data for radio Songs and their ad counts
const generateClusteredData = (timePeriod) => {
  const Songs = [
    "Aaj Ki Raat (Stree 2)",
    "Kesariya (Brahmastra)",
    "Apna Bana Le (Bhediya)",
    "Naatu Naatu (RRR)",
    "Ranjha (Shershaah)",
    "Pasoori (Coke Studio)",
  ];

  const baseMultiplier = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  // Adjust base ad counts based on station popularity
  const stationMultiplier = {
    "Radio City": 1.2,
    "Radio Mirchi": 1.1,
    "Red FM": 1.0,
  };

  return Songs.map((song) => ({
    name: song,
    "Radio City": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Radio City"]
    ),
    "Radio Mirchi": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Radio Mirchi"]
    ),
    "Red FM": Math.floor(
      (Math.random() * 15 + 10) *
        baseMultiplier[timePeriod] *
        stationMultiplier["Red FM"]
    ),
  })).sort((a, b) => b["Radio City"] - a["Radio City"]);
};

const TopSongsChart = () => {
  const [timePeriod, setTimePeriod] = useState("daily");
  const [data, setData] = useState(generateClusteredData(timePeriod));

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    setData(generateClusteredData(value));
  };

  return (
    <ChartCard
      icon={<Radio className="w-6 h-6" />}
      title="Top Songs by Volume"
      description="View top songs by number of times played across different radio stations"
      action={
        <div className="flex justify-end">
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
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 15, bottom: 5 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={150}
            />
            <Tooltip
              formatter={(value, name) => [
                `${value} plays`,
                `${name}`
              ]}
            />
            <Legend />
            <Bar
              dataKey="Radio City"
              fill="#8884d8"
              name="Radio City"
              radius={[0, 8, 8, 0]}
            />
            <Bar
              dataKey="Radio Mirchi"
              fill="#82ca9d"
              name="Radio Mirchi"
              radius={[0, 8, 8, 0]}
            />
            <Bar
              dataKey="Red FM"
              fill="#ffc658"
              name="Red FM"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Shows top Songs ranked by number of plays across different radio stations. Data is simulated.
        </p>
      }
    />
  );
};

export default TopSongsChart;