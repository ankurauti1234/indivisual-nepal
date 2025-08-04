"use client";

import { LineChart as LineChartIcon } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
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

// Sample data for ad creative frequencies
const creativeData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  dayparts: ["Morning", "Afternoon", "Evening", "Night"],
  creatives: [
    { id: "Creative1", name: "Brand Ad A", color: "#ff6b6b" },
    { id: "Creative2", name: "Brand Ad B", color: "#4ecdc4" },
    { id: "Creative3", name: "Brand Ad C", color: "#45b7d1" },
  ],
  frequencies: [
    {
      date: "2025-07-23",
      channel: "Nepal Television",
      daypart: "Morning",
      Creative1: 10,
      Creative2: 5,
      Creative3: 3,
    },
    {
      date: "2025-07-23",
      channel: "Nepal Television",
      daypart: "Afternoon",
      Creative1: 8,
      Creative2: 6,
      Creative3: 4,
    },
    {
      date: "2025-07-23",
      channel: "Nepal Television",
      daypart: "Evening",
      Creative1: 12,
      Creative2: 7,
      Creative3: 5,
    },
    {
      date: "2025-07-23",
      channel: "Nepal Television",
      daypart: "Night",
      Creative1: 6,
      Creative2: 4,
      Creative3: 2,
    },
    {
      date: "2025-07-24",
      channel: "Nepal Television",
      daypart: "Morning",
      Creative1: 9,
      Creative2: 6,
      Creative3: 4,
    },
    {
      date: "2025-07-24",
      channel: "Nepal Television",
      daypart: "Afternoon",
      Creative1: 7,
      Creative2: 5,
      Creative3: 3,
    },
    {
      date: "2025-07-24",
      channel: "Nepal Television",
      daypart: "Evening",
      Creative1: 11,
      Creative2: 8,
      Creative3: 6,
    },
    {
      date: "2025-07-24",
      channel: "Nepal Television",
      daypart: "Night",
      Creative1: 5,
      Creative2: 3,
      Creative3: 2,
    },
    {
      date: "2025-07-23",
      channel: "Kantipur TV",
      daypart: "Morning",
      Creative1: 8,
      Creative2: 4,
      Creative3: 2,
    },
    {
      date: "2025-07-23",
      channel: "Kantipur TV",
      daypart: "Afternoon",
      Creative1: 6,
      Creative2: 5,
      Creative3: 3,
    },
    {
      date: "2025-07-23",
      channel: "Kantipur TV",
      daypart: "Evening",
      Creative1: 10,
      Creative2: 6,
      Creative3: 4,
    },
    {
      date: "2025-07-23",
      channel: "Kantipur TV",
      daypart: "Night",
      Creative1: 4,
      Creative2: 3,
      Creative3: 1,
    },
    {
      date: "2025-07-24",
      channel: "Kantipur TV",
      daypart: "Morning",
      Creative1: 7,
      Creative2: 5,
      Creative3: 3,
    },
    {
      date: "2025-07-24",
      channel: "Kantipur TV",
      daypart: "Afternoon",
      Creative1: 5,
      Creative2: 4,
      Creative3: 2,
    },
    {
      date: "2025-07-24",
      channel: "Kantipur TV",
      daypart: "Evening",
      Creative1: 9,
      Creative2: 7,
      Creative3: 5,
    },
    {
      date: "2025-07-24",
      channel: "Kantipur TV",
      daypart: "Night",
      Creative1: 3,
      Creative2: 2,
      Creative3: 1,
    },
    {
      date: "2025-07-23",
      channel: "Avenues TV",
      daypart: "Morning",
      Creative1: 6,
      Creative2: 3,
      Creative3: 2,
    },
    {
      date: "2025-07-23",
      channel: "Avenues TV",
      daypart: "Afternoon",
      Creative1: 5,
      Creative2: 4,
      Creative3: 2,
    },
    {
      date: "2025-07-23",
      channel: "Avenues TV",
      daypart: "Evening",
      Creative1: 8,
      Creative2: 5,
      Creative3: 3,
    },
    {
      date: "2025-07-23",
      channel: "Avenues TV",
      daypart: "Night",
      Creative1: 3,
      Creative2: 2,
      Creative3: 1,
    },
    {
      date: "2025-07-24",
      channel: "Avenues TV",
      daypart: "Morning",
      Creative1: 5,
      Creative2: 4,
      Creative3: 2,
    },
    {
      date: "2025-07-24",
      channel: "Avenues TV",
      daypart: "Afternoon",
      Creative1: 4,
      Creative2: 3,
      Creative3: 1,
    },
    {
      date: "2025-07-24",
      channel: "Avenues TV",
      daypart: "Evening",
      Creative1: 7,
      Creative2: 6,
      Creative3: 4,
    },
    {
      date: "2025-07-24",
      channel: "Avenues TV",
      daypart: "Night",
      Creative1: 2,
      Creative2: 1,
      Creative3: 0,
    },
  ],
};

export default function AdFatigueTracker() {
  const [selectedChannels, setSelectedChannels] = useState(creativeData.channels);
  const [selectedDaypart, setSelectedDaypart] = useState("All");

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : creativeData.channels;
    });
  };

  // Aggregate data by date
  const aggregatedData = creativeData.frequencies
    .filter(
      (data) =>
        selectedChannels.includes(data.channel) &&
        (selectedDaypart === "All" || data.daypart === selectedDaypart)
    )
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.date === curr.date);
      const creativeIds = creativeData.creatives.map((c) => c.id);
      if (existing) {
        creativeIds.forEach((id) => {
          existing[id] = (existing[id] || 0) + (curr[id] || 0);
        });
      } else {
        acc.push({
          date: curr.date,
          ...creativeIds.reduce((obj, id) => {
            obj[id] = curr[id] || 0;
            return obj;
          }, {}),
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Custom Tooltip for Line Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry) => {
              const creative = creativeData.creatives.find((c) => c.id === entry.dataKey) || {
                name: entry.dataKey,
                color: "#000000",
              };
              return (
                <p key={entry.dataKey} className="text-sm">
                  <span
                    className="inline-block w-3 h-3 mr-1"
                    style={{ backgroundColor: creative.color }}
                  ></span>
                  {creative.name}: {entry.value} plays
                </p>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend for Line Chart
  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {creativeData.creatives.map((creative) => (
        <div key={creative.id} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: creative.color }}
          />
          <span className="truncate">{creative.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<LineChartIcon className="w-6 h-6" />}
      title="Ad Fatigue & Creative Performance Tracker"
      description="Creative Play Frequency by Channel and Daypart"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === creativeData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {creativeData.channels.map((channel) => (
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
            value={selectedDaypart}
            onValueChange={setSelectedDaypart}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select daypart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {creativeData.dayparts.map((daypart) => (
                <SelectItem key={daypart} value={daypart}>
                  {daypart}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={aggregatedData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.6} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Play Frequency",
                angle: -90,
                position: "insideLeft",
                offset: 0,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {creativeData.creatives.map((creative) => (
              <Line
                key={creative.id}
                type="monotone"
                dataKey={creative.id}
                name={creative.name}
                stroke={creative.color}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          High-frequency creatives may indicate ad fatigue risk. Rotate creatives to maintain viewer engagement.
        </p>
      }
    />
  );
}