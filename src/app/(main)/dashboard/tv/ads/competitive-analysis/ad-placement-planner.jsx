"use client";

import { ScatterChart as ScatterChartIcon } from "lucide-react";
import { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

// Sample data for ad spots by program genre and channel
const placementData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  genres: ["Sports", "News", "Entertainment", "Drama"],
  adSpots: [
    {
      channel: "Nepal Television",
      genre: "Sports",
      adFrequency: 50,
      audienceQuality: 0.9,
      primeCost: 10000,
      nonPrimeCost: 6000,
      timeSlot: "Prime",
    },
    {
      channel: "Nepal Television",
      genre: "News",
      adFrequency: 60,
      audienceQuality: 0.7,
      primeCost: 8000,
      nonPrimeCost: 5000,
      timeSlot: "Prime",
    },
    {
      channel: "Nepal Television",
      genre: "Entertainment",
      adFrequency: 40,
      audienceQuality: 0.6,
      primeCost: 7000,
      nonPrimeCost: 4000,
      timeSlot: "Prime",
    },
    {
      channel: "Nepal Television",
      genre: "Drama",
      adFrequency: 30,
      audienceQuality: 0.5,
      primeCost: 6000,
      nonPrimeCost: 3500,
      timeSlot: "Prime",
    },
    {
      channel: "Nepal Television",
      genre: "Sports",
      adFrequency: 30,
      audienceQuality: 0.8,
      primeCost: 10000,
      nonPrimeCost: 6000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Nepal Television",
      genre: "News",
      adFrequency: 40,
      audienceQuality: 0.65,
      primeCost: 8000,
      nonPrimeCost: 5000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Nepal Television",
      genre: "Entertainment",
      adFrequency: 25,
      audienceQuality: 0.55,
      primeCost: 7000,
      nonPrimeCost: 4000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Nepal Television",
      genre: "Drama",
      adFrequency: 20,
      audienceQuality: 0.45,
      primeCost: 6000,
      nonPrimeCost: 3500,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Sports",
      adFrequency: 45,
      audienceQuality: 0.85,
      primeCost: 11000,
      nonPrimeCost: 6500,
      timeSlot: "Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "News",
      adFrequency: 55,
      audienceQuality: 0.75,
      primeCost: 9000,
      nonPrimeCost: 5500,
      timeSlot: "Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Entertainment",
      adFrequency: 35,
      audienceQuality: 0.65,
      primeCost: 7500,
      nonPrimeCost: 4500,
      timeSlot: "Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Drama",
      adFrequency: 25,
      audienceQuality: 0.55,
      primeCost: 6500,
      nonPrimeCost: 4000,
      timeSlot: "Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Sports",
      adFrequency: 25,
      audienceQuality: 0.75,
      primeCost: 11000,
      nonPrimeCost: 6500,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "News",
      adFrequency: 35,
      audienceQuality: 0.6,
      primeCost: 9000,
      nonPrimeCost: 5500,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Entertainment",
      adFrequency: 20,
      audienceQuality: 0.5,
      primeCost: 7500,
      nonPrimeCost: 4500,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Kantipur TV",
      genre: "Drama",
      adFrequency: 15,
      audienceQuality: 0.4,
      primeCost: 6500,
      nonPrimeCost: 4000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Sports",
      adFrequency: 40,
      audienceQuality: 0.8,
      primeCost: 9500,
      nonPrimeCost: 5500,
      timeSlot: "Prime",
    },
    {
      channel: "Avenues TV",
      genre: "News",
      adFrequency: 50,
      audienceQuality: 0.7,
      primeCost: 8500,
      nonPrimeCost: 5000,
      timeSlot: "Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Entertainment",
      adFrequency: 30,
      audienceQuality: 0.6,
      primeCost: 7000,
      nonPrimeCost: 4000,
      timeSlot: "Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Drama",
      adFrequency: 20,
      audienceQuality: 0.5,
      primeCost: 6000,
      nonPrimeCost: 3500,
      timeSlot: "Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Sports",
      adFrequency: 20,
      audienceQuality: 0.7,
      primeCost: 9500,
      nonPrimeCost: 5500,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Avenues TV",
      genre: "News",
      adFrequency: 30,
      audienceQuality: 0.6,
      primeCost: 8500,
      nonPrimeCost: 5000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Entertainment",
      adFrequency: 15,
      audienceQuality: 0.5,
      primeCost: 7000,
      nonPrimeCost: 4000,
      timeSlot: "Non-Prime",
    },
    {
      channel: "Avenues TV",
      genre: "Drama",
      adFrequency: 10,
      audienceQuality: 0.4,
      primeCost: 6000,
      nonPrimeCost: 3500,
      timeSlot: "Non-Prime",
    },
  ],
};

// Color palette for genres
const genreColors = {
  Sports: "#ff6b6b",
  News: "#4ecdc4",
  Entertainment: "#45b7d1",
  Drama: "#96ceb4",
};

export default function OptimalAdPlacementPlanner() {
  const [selectedChannels, setSelectedChannels] = useState(placementData.channels);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("All");

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : placementData.channels;
    });
  };

  // Filter data based on selected channels and time slot
  const filteredData = placementData.adSpots.filter(
    (data) =>
      selectedChannels.includes(data.channel) &&
      (selectedTimeSlot === "All" || data.timeSlot === selectedTimeSlot)
  ).map((data) => ({
    ...data,
    genreValue: data.adFrequency * data.audienceQuality,
  }));

  // Custom Tooltip for Bubble Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{data.genre} ({data.channel})</p>
          <p className="text-sm">Ad Frequency: {data.adFrequency}</p>
          <p className="text-sm">Audience Quality: {(data.audienceQuality * 100).toFixed(0)}%</p>
          <p className="text-sm">Genre Value: {data.genreValue.toFixed(2)}</p>
          <p className="text-sm">
            Cost: NPR {data.timeSlot === "Prime" ? data.primeCost.toLocaleString() : data.nonPrimeCost.toLocaleString()} ({data.timeSlot})
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Bubble Chart
  const CustomLegend = () => (
    <div className="grid grid-cols-4 gap-2 mt-2 px-2 text-xs">
      {placementData.genres.map((genre) => (
        <div key={genre} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: genreColors[genre] }}
          />
          <span className="truncate">{genre}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<ScatterChartIcon className="w-6 h-6" />}
      title="Optimal Ad Placement Planner"
      description="Genre Value by Channel and Time Slot"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === placementData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {placementData.channels.map((channel) => (
                <SelectItem key={channel} value={channel}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel)}
                      onChange={() => handleChannelChange(channel)}
                      className="mr-2"
                    />
                    {channel}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedTimeSlot}
            onValueChange={setSelectedTimeSlot}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select time slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Prime">Prime</SelectItem>
              <SelectItem value="Non-Prime">Non-Prime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
            <XAxis
              dataKey="adFrequency"
              name="Ad Frequency"
              tick={{ fontSize: 12 }}
              label={{
                value: "Ad Frequency",
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              dataKey="audienceQuality"
              name="Audience Quality"
              tick={{ fontSize: 12 }}
              label={{
                value: "Audience Quality",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {placementData.genres.map((genre) => (
              <Scatter
                key={genre}
                name={genre}
                data={filteredData.filter((d) => d.genre === genre)}
                fill={genreColors[genre]}
              >
                {filteredData
                  .filter((d) => d.genre === genre)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      r={Math.sqrt(entry.genreValue) * 10} // Bubble size based on genre value
                      fill={genreColors[genre]}
                    />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Larger bubbles indicate higher genre value (ad frequency × audience quality). Allocate budget to high-value genres like Sports for performance ads.
        </p>
      }
    />
  );
}