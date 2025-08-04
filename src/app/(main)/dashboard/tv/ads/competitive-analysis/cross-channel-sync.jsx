"use client";

import {  ScanHeart } from "lucide-react";
import { useState } from "react";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";

// Sample data for multi-channel ad logs
const syncData = {
  channels: ["Nepal Television", "Kantipur TV", "Avenues TV"],
  nodes: [
    { name: "YourBrand" },
    { name: "CompetitorA" },
    { name: "CompetitorB" },
    { name: "Nepal Television" },
    { name: "Kantipur TV" },
    { name: "Avenues TV" },
  ],
  links: [
    { source: 0, target: 3, value: 50, timestamp: "2025-07-23 10:00" }, // YourBrand to Nepal Television
    { source: 0, target: 4, value: 30, timestamp: "2025-07-23 10:00" }, // YourBrand to Kantipur TV
    { source: 0, target: 5, value: 20, timestamp: "2025-07-23 10:00" }, // YourBrand to Avenues TV
    { source: 1, target: 3, value: 40, timestamp: "2025-07-23 10:00" }, // CompetitorA to Nepal Television
    { source: 1, target: 4, value: 50, timestamp: "2025-07-23 10:00" }, // CompetitorA to Kantipur TV
    { source: 1, target: 5, value: 30, timestamp: "2025-07-23 10:00" }, // CompetitorA to Avenues TV
    { source: 2, target: 3, value: 30, timestamp: "2025-07-23 10:00" }, // CompetitorB to Nepal Television
    { source: 2, target: 4, value: 20, timestamp: "2025-07-23 10:00" }, // CompetitorB to Kantipur TV
    { source: 2, target: 5, value: 40, timestamp: "2025-07-23 10:00" }, // CompetitorB to Avenues TV
    { source: 0, target: 3, value: 45, timestamp: "2025-07-23 12:00" },
    { source: 0, target: 4, value: 25, timestamp: "2025-07-23 12:00" },
    { source: 0, target: 5, value: 15, timestamp: "2025-07-23 12:00" },
    { source: 1, target: 3, value: 35, timestamp: "2025-07-23 12:00" },
    { source: 1, target: 4, value: 45, timestamp: "2025-07-23 12:00" },
    { source: 1, target: 5, value: 25, timestamp: "2025-07-23 12:00" },
    { source: 2, target: 3, value: 25, timestamp: "2025-07-23 12:00" },
    { source: 2, target: 4, value: 15, timestamp: "2025-07-23 12:00" },
    { source: 2, target: 5, value: 35, timestamp: "2025-07-23 12:00" },
  ],
};

// Colors for brands
const colors = {
  YourBrand: "#4ecdc4",
  CompetitorA: "#ff6b6b",
  CompetitorB: "#45b7d1",
};

export default function CrossChannelSyncMap() {
  const [selectedChannels, setSelectedChannels] = useState(syncData.channels);

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) => {
      const newChannels = prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel];
      return newChannels.length > 0 ? newChannels : syncData.channels;
    });
  };

  // Filter data by selected channels
  const filteredNodes = syncData.nodes.filter(
    (node) => syncData.channels.includes(node.name) || ["YourBrand", "CompetitorA", "CompetitorB"].includes(node.name)
  );
  const filteredLinks = syncData.links.filter((link) =>
    selectedChannels.includes(syncData.nodes[link.target].name)
  );

  // Custom Tooltip for Sankey Diagram
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">
            {data.source.name} → {data.target.name}
          </p>
          <p className="text-sm">Ad Count: {data.value}</p>
          <p className="text-sm">Timestamp: {data.timestamp}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<ScanHeart className="w-6 h-6" />}
      title="Cross-Channel Synchronization Map"
      description="Ad Placement Flow Across Channels"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <Select
            value={selectedChannels}
            onValueChange={handleChannelChange}
            multiple
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channels">
                {selectedChannels.length === syncData.channels.length
                  ? "All Channels"
                  : selectedChannels.join(", ")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {syncData.channels.map((channel) => (
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
          <Sankey
            data={{
              nodes: filteredNodes,
              links: filteredLinks,
            }}
            nodeWidth={15}
            nodePadding={30}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Tooltip content={<CustomTooltip />} />
            {filteredNodes.map((node, index) => (
              <rect
                key={node.name}
                fill={colors[node.name] || "#999"}
                stroke="#000"
                strokeWidth={1}
              />
            ))}
            {filteredLinks.map((link, index) => (
              <path
                key={index}
                fill="none"
                stroke={colors[syncData.nodes[link.source].name] || "#999"}
                strokeWidth={link.value / 10}
                opacity={0.5}
              />
            ))}
          </Sankey>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Avoid head-to-head battles with competitors in high-traffic channels to maximize mindshare.
        </p>
      }
    />
  );
}