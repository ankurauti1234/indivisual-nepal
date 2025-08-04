"use client";

import { BarChart as BarChartIcon } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
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

// Sample data for sponsorships
const sponsorshipData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  sponsorships: [
    {
      show: "Morning News",
      channel: "Nepal Television",
      logoCount: 5,
      mentionCount: 3,
      duration: 120,
      prominence: 0.8,
      adValue: 15000,
      date: "2025-07-23",
    },
    {
      show: "Sports Highlights",
      channel: "Nepal Television",
      logoCount: 8,
      mentionCount: 5,
      duration: 180,
      prominence: 0.9,
      adValue: 20000,
      date: "2025-07-23",
    },
    {
      show: "Evening Drama",
      channel: "Nepal Television",
      logoCount: 3,
      mentionCount: 2,
      duration: 90,
      prominence: 0.6,
      adValue: 10000,
      date: "2025-07-24",
    },
    {
      show: "Talk Show",
      channel: "Kantipur TV",
      logoCount: 6,
      mentionCount: 4,
      duration: 150,
      prominence: 0.85,
      adValue: 18000,
      date: "2025-07-23",
    },
    {
      show: "Reality Show",
      channel: "Kantipur TV",
      logoCount: 4,
      mentionCount: 3,
      duration: 120,
      prominence: 0.7,
      adValue: 12000,
      date: "2025-07-24",
    },
    {
      show: "News Bulletin",
      channel: "Avenues TV",
      logoCount: 5,
      mentionCount: 2,
      duration: 100,
      prominence: 0.75,
      adValue: 14000,
      date: "2025-07-23",
    },
    {
      show: "Entertainment Weekly",
      channel: "Avenues TV",
      logoCount: 7,
      mentionCount: 4,
      duration: 140,
      prominence: 0.8,
      adValue: 16000,
      date: "2025-07-24",
    },
  ],
};

export default function SponsorshipROIMeter() {
  const [selectedChannels, setSelectedChannels] = useState(sponsorshipData.channels);

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : sponsorshipData.channels;
    });
  };

  // Filter data by selected channels
  const filteredData = sponsorshipData.sponsorships.filter((data) =>
    selectedChannels.includes(data.channel)
  );

  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{data.show} ({data.channel})</p>
          <p className="text-sm">Logo Count: {data.logoCount}</p>
          <p className="text-sm">Mention Count: {data.mentionCount}</p>
          <p className="text-sm">Duration: {data.duration} seconds</p>
          <p className="text-sm">Prominence: {(data.prominence * 100).toFixed(0)}%</p>
          <p className="text-sm">Ad Value: NPR {data.adValue.toLocaleString()}</p>
          <p className="text-sm">Date: {data.date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<BarChartIcon className="w-6 h-6" />}
      title="Sponsorship & Brand Integration ROI"
      description="Estimated Ad Value of Sponsorships"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === sponsorshipData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sponsorshipData.channels.map((channel) => (
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
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
            <XAxis dataKey="show" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Ad Value (NPR)",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="adValue" fill="#4ecdc4" />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Double down on sponsorships with high ad value (e.g., Sports Highlights) for better visibility.
        </p>
      }
    />
  );
}