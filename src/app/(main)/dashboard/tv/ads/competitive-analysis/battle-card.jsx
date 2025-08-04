"use client";

import { BarChart as BarChartIcon } from "lucide-react";
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

// Sample data for competitor ad occurrences and SOV by channel
const battlecardData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  sovData: [
    {
      channel: "Nepal Television",
      YourBrand: 40,
      CompetitorA: 20,
      CompetitorB: 25,
      CompetitorC: 15,
    },
    {
      channel: "Kantipur TV",
      YourBrand: 30,
      CompetitorA: 25,
      CompetitorB: 30,
      CompetitorC: 15,
    },
    {
      channel: "Avenues TV",
      YourBrand: 25,
      CompetitorA: 30,
      CompetitorB: 20,
      CompetitorC: 25,
    },
  ],
};

// Color palette for brands
const colors = {
  YourBrand: "#4ecdc4",
  CompetitorA: "#ff6b6b",
  CompetitorB: "#45b7d1",
  CompetitorC: "#96ceb4",
};

export default function CompetitiveBattlecardView() {
  const [selectedChannels, setSelectedChannels] = useState(battlecardData.channels);

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : battlecardData.channels;
    });
  };

  // Filter SOV data for selected channels
  const filteredSovData = battlecardData.sovData.filter((data) =>
    selectedChannels.includes(data.channel)
  );

  // Custom Tooltip for Stacked Bar Chart
  const CustomSovTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{data.channel}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry) => (
              <p key={entry.name} className="text-sm">
                <span
                  className="inline-block w-3 h-3 mr-1"
                  style={{ backgroundColor: entry.color }}
                ></span>
                {entry.name}: {entry.value}%
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Stacked Bar Chart
  const CustomLegend = () => (
    <div className="grid grid-cols-4 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((brand) => (
        <div key={brand} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[brand] }}
          />
          <span className="truncate">{brand}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<BarChartIcon className="w-6 h-6" />}
      title="Competitive Battlecard View"
      description="Share of Voice by TV Channel"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === battlecardData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {battlecardData.channels.map((channel) => (
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
            data={filteredSovData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
            <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Share of Voice (%)",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
            />
            <Tooltip content={<CustomSovTooltip />} />
            <Legend content={<CustomLegend />} />
            {Object.keys(colors).map((brand) => (
              <Bar
                key={brand}
                dataKey={brand}
                stackId="a"
                fill={colors[brand]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Compare your Share of Voice against competitors across selected TV channels.
        </p>
      }
    />
  );
}