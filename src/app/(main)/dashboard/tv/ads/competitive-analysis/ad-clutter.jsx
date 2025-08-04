"use client";

import { BarChart as BarChartIcon } from "lucide-react";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

// Sample data for ad breaks
const clutterData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  breaks: [
    { channel: "Nepal Television", adsPerBreak: 3, duration: 60, position: "First", date: "2025-07-23" },
    { channel: "Nepal Television", adsPerBreak: 5, duration: 90, position: "Mid", date: "2025-07-23" },
    { channel: "Nepal Television", adsPerBreak: 7, duration: 120, position: "Last", date: "2025-07-23" },
    { channel: "Nepal Television", adsPerBreak: 2, duration: 45, position: "First", date: "2025-07-24" },
    { channel: "Nepal Television", adsPerBreak: 4, duration: 75, position: "Mid", date: "2025-07-24" },
    { channel: "Nepal Television", adsPerBreak: 6, duration: 100, position: "Last", date: "2025-07-24" },
    { channel: "Kantipur TV", adsPerBreak: 4, duration: 80, position: "First", date: "2025-07-23" },
    { channel: "Kantipur TV", adsPerBreak: 6, duration: 110, position: "Mid", date: "2025-07-23" },
    { channel: "Kantipur TV", adsPerBreak: 8, duration: 130, position: "Last", date: "2025-07-23" },
    { channel: "Kantipur TV", adsPerBreak: 3, duration: 60, position: "First", date: "2025-07-24" },
    { channel: "Kantipur TV", adsPerBreak: 5, duration: 90, position: "Mid", date: "2025-07-24" },
    { channel: "Kantipur TV", adsPerBreak: 7, duration: 120, position: "Last", date: "2025-07-24" },
    { channel: "Avenues TV", adsPerBreak: 2, duration: 50, position: "First", date: "2025-07-23" },
    { channel: "Avenues TV", adsPerBreak: 4, duration: 80, position: "Mid", date: "2025-07-23" },
    { channel: "Avenues TV", adsPerBreak: 6, duration: 100, position: "Last", date: "2025-07-23" },
    { channel: "Avenues TV", adsPerBreak: 3, duration: 60, position: "First", date: "2025-07-24" },
    { channel: "Avenues TV", adsPerBreak: 5, duration: 90, position: "Mid", date: "2025-07-24" },
    { channel: "Avenues TV", adsPerBreak: 7, duration: 110, position: "Last", date: "2025-07-24" },
  ],
};

// Clutter level thresholds
const getClutterLevel = (adsPerBreak) => {
  if (adsPerBreak <= 3) return { level: "Low", color: "#22c55e" }; // Green
  if (adsPerBreak <= 5) return { level: "Moderate", color: "#facc15" }; // Yellow
  return { level: "High", color: "#ef4444" }; // Red
};

// Channel colors
const channelColors = {
  "Nepal Television": "#4ecdc4",
  "Kantipur TV": "#ff6b6b",
  "Avenues TV": "#45b7d1",
};

export default function AdClutterAlertSystem() {
  const [selectedChannels, setSelectedChannels] = useState(clutterData.channels);

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : clutterData.channels;
    });
  };

  // Prepare data for violin-like plot (histogram-based distribution)
  const prepareViolinData = () => {
    const maxAds = Math.max(...clutterData.breaks.map((b) => b.adsPerBreak));
    const bins = Array.from({ length: maxAds + 1 }, (_, i) => i); // 0 to max ads
    const violinData = selectedChannels.map((channel) => {
      const counts = bins.map((bin) => ({
        adsPerBreak: bin,
        count: clutterData.breaks.filter(
          (b) => b.channel === channel && Math.floor(b.adsPerBreak) === bin
        ).length,
      }));
      // Normalize counts to simulate violin plot width
      const maxCount = Math.max(...counts.map((c) => c.count));
      return {
        name: channel,
        data: counts.map((c) => ({
          adsPerBreak: c.adsPerBreak,
          count: maxCount > 0 ? c.count / maxCount : 0, // Normalize to 0-1
        })),
      };
    });
    return violinData;
  };

  const violinData = prepareViolinData();

  // Custom Tooltip for Violin-like Plot
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const channel = payload[0].name;
      const breakData = clutterData.breaks.find(
        (b) => b.channel === channel && Math.floor(b.adsPerBreak) === data.adsPerBreak
      );
      const clutter = getClutterLevel(data.adsPerBreak);
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{channel}</p>
          <p className="text-sm">Ads per Break: {data.adsPerBreak}</p>
          <p className="text-sm">Clutter Level: <span style={{ color: clutter.color }}>{clutter.level}</span></p>
          {breakData && (
            <>
              <p className="text-sm">Duration: {breakData.duration} seconds</p>
              <p className="text-sm">Position: {breakData.position}</p>
              <p className="text-sm">Date: {breakData.date}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<BarChartIcon className="w-6 h-6" />}
      title="Real-Time Ad Clutter Alert System"
      description="Distribution of Ad Breaks by Clutter Level"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === clutterData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {clutterData.channels.map((channel) => (
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
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
            <XAxis
              dataKey="adsPerBreak"
              tick={{ fontSize: 12 }}
              label={{ value: "Ads per Break", position: "bottom", offset: 0 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: "Relative Frequency", angle: -90, position: "insideLeft", offset: 0 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {violinData.map((entry) => (
              <Area
                key={entry.name}
                dataKey="count"
                data={entry.data}
                fill={channelColors[entry.name]}
                stroke="#000"
                type="basis"
                fillOpacity={0.4}
                name={entry.name}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          High-clutter breaks (≥6 ads) are riskier. Negotiate exclusivity or bookend positions (First/Last) for better visibility.
        </p>
      }
    />
  );
}