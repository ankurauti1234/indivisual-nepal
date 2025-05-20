"use client";

import { Shirt, BarChart2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { ResponsiveContainer } from "recharts";

// Sample data for jersey logo exposure
const exposureData = {
  tournament1: {
    zones: [
      { zone: "Chest", clear: 120, obstructed: 30 },
      { zone: "Sleeve", clear: 80, obstructed: 20 },
      { zone: "Shoulder", clear: 60, obstructed: 15 },
    ],
    players: [
      { player: "Player A", visibility: 150 },
      { player: "Player B", visibility: 130 },
      { player: "Player C", visibility: 100 },
      { player: "Player D", visibility: 90 },
      { player: "Player E", visibility: 80 },
    ],
  },
  tournament2: {
    zones: [
      { zone: "Chest", clear: 140, obstructed: 35 },
      { zone: "Sleeve", clear: 90, obstructed: 25 },
      { zone: "Shoulder", clear: 70, obstructed: 20 },
    ],
    players: [
      { player: "Player X", visibility: 160 },
      { player: "Player Y", visibility: 140 },
      { player: "Player Z", visibility: 110 },
      { player: "Player W", visibility: 95 },
      { player: "Player V", visibility: 85 },
    ],
  },
};

const chartConfig = {
  visibility: {
    label: "Visibility (s)",
    color: "hsl(var(--chart-1))",
  },
};

// Heatmap configuration
const zones = ["Chest", "Sleeve", "Shoulder"];
const visibilityTypes = ["Clear", "Obstructed"];
const colors = [
  "hsl(220, 70%, 95%)", // Low intensity
  "hsl(220, 70%, 80%)",
  "hsl(220, 70%, 65%)",
  "hsl(220, 70%, 50%)",
  "hsl(220, 70%, 35%)", // High intensity
];

export default function JerseyLogoExposureChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = exposureData[tournament];
  const zoneData = data.zones;
  const playerData = data.players;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateExposureStats = () => {
    const totalExposure = playerData.reduce(
      (sum, player) => sum + player.visibility,
      0
    );
    const avgExposure = (totalExposure / playerData.length).toFixed(1);
    return { totalExposure, avgExposure };
  };

  // Transform zone data for heatmap
  const heatmapData = zoneData.flatMap((entry) =>
    visibilityTypes.map((type) => ({
      zone: entry.zone,
      type: type.toLowerCase(),
      value: entry[type.toLowerCase()],
    }))
  );

  // Calculate max value for color scaling
  const maxValue = Math.max(...heatmapData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Heatmap Card */}
      <ChartCard
        icon={<Shirt className="w-6 h-6" />}
        title="Jersey Logo Exposure by Zone"
        description={getTournamentLabel()}
        action={
          <div className="flex justify-end">
            <Select value={tournament} onValueChange={setTournament}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament1">Tournament 1</SelectItem>
                <SelectItem value="tournament2">Tournament 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ResponsiveContainer width="100%" height={200}>
            <svg width="100%" height="100%">
              <g transform="translate(60, 20)">
                {/* Y-axis: Zones */}
                {zones.map((zone, index) => (
                  <text
                    key={zone}
                    x={-10}
                    y={index * 50 + 25}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-sm fill-foreground"
                  >
                    {zone}
                  </text>
                ))}
                {/* X-axis: Visibility Types */}
                {visibilityTypes.map((type, index) => (
                  <text
                    key={type}
                    x={index * 100 + 50}
                    y={-10}
                    textAnchor="middle"
                    className="text-sm fill-foreground"
                  >
                    {type}
                  </text>
                ))}
                {/* Heatmap cells */}
                {heatmapData.map((entry, index) => {
                  const zoneIndex = zones.indexOf(entry.zone);
                  const typeIndex = visibilityTypes
                    .map((t) => t.toLowerCase())
                    .indexOf(entry.type);
                  const colorIndex = Math.min(
                    Math.floor((entry.value / maxValue) * (colors.length - 1)),
                    colors.length - 1
                  );
                  return (
                    <rect
                      key={index}
                      x={typeIndex * 100}
                      y={zoneIndex * 50}
                      width={100}
                      height={50}
                      fill={colors[colorIndex]}
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <title>
                        {`${entry.zone} (${entry.type}): ${entry.value}s`}
                      </title>
                    </rect>
                  );
                })}
                {/* Values inside cells */}
                {heatmapData.map((entry, index) => {
                  const zoneIndex = zones.indexOf(entry.zone);
                  const typeIndex = visibilityTypes
                    .map((t) => t.toLowerCase())
                    .indexOf(entry.type);
                  return (
                    <text
                      key={index}
                      x={typeIndex * 100 + 50}
                      y={zoneIndex * 50 + 25}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className="text-sm fill-foreground"
                    >
                      {entry.value}
                    </text>
                  );
                })}
              </g>
            </svg>
          </ResponsiveContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Exposure: {calculateExposureStats().totalExposure}s
          </p>
        }
      />

      {/* Player Ranking Card */}
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Top 5 Players by Logo Visibility"
        description={getTournamentLabel()}
        action={
          <div className="flex justify-end">
            <Select value={tournament} onValueChange={setTournament}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament1">Tournament 1</SelectItem>
                <SelectItem value="tournament2">Tournament 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ChartContainer config={chartConfig}>
            <BarChart
              data={playerData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="player" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="visibility"
                fill={chartConfig.visibility.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="visibility"
                  position="top"
                  formatter={(value) => `${value}s`}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Avg Visibility per Player: {calculateExposureStats().avgExposure}s
          </p>
        }
      />
    </div>
  );
}
