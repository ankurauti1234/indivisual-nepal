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

const radioStations = {
  "radio city": [
    "Morning Show",
    "Evening Drive",
    "Night Cafe",
    "Weekend Special",
    "Lunch Hours",
    "Music Marathon",
  ],
  "radio mirchi": [
    "Super Hits",
    "Mirchi Top 20",
    "Love Guru",
    "Club Mirchi",
    "Bumper Mornings",
    "Sunset Drive",
  ],
  "red fm": [
    "Red Indies",
    "Red Chillies",
    "Morning No.1",
    "Midnight Masala",
    "Retro Sundays",
    "Comedy Nights",
  ],
  "MYFM - Ahmednagar": [
    "Acharya Balkrishna Ji - Swasthya ki Aradhana",
    "RJ Siddhu - Salaam Ahmednagar",
    "RJ Purva - Hum Tum",
    "RJ Suhas - Happy Evening",
    "DJ Elektronomist - Rock the Party",
  ],
  "MangoFM - Kochi": [
    "Superfast",
    "Timepass",
    "Josh Junction",
    "Citylights",
    "Jab We Met",
    "Back to Back",
  ],
  "Radio City - Mumbai": [
    "RJ Salil - Kadak Show",
    "RJ Archana - Mumbai Ka Dil Archu",
    "RJ Gaurav - Kal bhi Aaj bhi",
  ],
};

const generateAdPlacementData = (station, timePeriod) => {
  const baseMultiplier = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  const stationMultiplier = {
    "radio city": 1.2,
    "radio mirchi": 1.1,
    "red fm": 1.0,
    "MYFM - Ahmednagar": 0.9,
    "MangoFM - Kochi": 0.95,
    "Radio City - Mumbai": 1.15,
  };

  const programs = radioStations[station] || [];

  return programs
    .map((program) => ({
      name: program,
      adCount: Math.floor(
        (Math.random() * 15 + 10) *
          baseMultiplier[timePeriod] *
          (stationMultiplier[station] || 1)
      ),
    }))
    .sort((a, b) => b.adCount - a.adCount);
};

const TopProgramsChart = () => {
  const [station, setStation] = useState("MYFM - Ahmednagar");
  const [timePeriod, setTimePeriod] = useState("daily");
  const [adData, setAdData] = useState(
    generateAdPlacementData(station, timePeriod)
  );

  const handleStationChange = (value) => {
    setStation(value);
    setAdData(generateAdPlacementData(value, timePeriod));
  };

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
    setAdData(generateAdPlacementData(station, value));
  };

  return (
    <ChartCard
      icon={<Radio className="w-6 h-6" />}
      title="Top Programs by Ad Placements"
      description="View ad placement statistics across different radio programs and stations"
      action={
        <div className="flex justify-end space-x-4">
          <div>
            <p className="text-sm font-medium mb-2">Select Station</p>
            <Select value={station} onValueChange={handleStationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(radioStations).map((stationName) => (
                  <SelectItem key={stationName} value={stationName}>
                    {stationName}
                  </SelectItem>
                ))}
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
          <BarChart
            data={adData}
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
              formatter={(value) => [`${value} ads`, "Ad Count"]}
            />
            <Legend />
            <Bar dataKey="adCount" fill="#F14A00" name="Ad Count" radius={8} />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Shows top programs ranked by number of ad placements. Revenue data is
          simulated.
        </p>
      }
    />
  );
};

export default TopProgramsChart;