"use client";

import { BarChart2, Grid } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
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

// Sample data for ad spots and density
const adData = {
  tournament1: {
    spots: [
      { match: "Match 1", spots: 15, avgDuration: 30, totalTime: 450 },
      { match: "Match 2", spots: 12, avgDuration: 25, totalTime: 300 },
      { match: "Match 3", spots: 18, avgDuration: 35, totalTime: 630 },
      { match: "Match 4", spots: 10, avgDuration: 20, totalTime: 200 },
    ],
    density: [
      { time: "0-15", powerplay: 5, middle: 2, final: 1 },
      { time: "15-30", powerplay: 3, middle: 4, final: 2 },
      { time: "30-45", powerplay: 2, middle: 6, final: 3 },
      { time: "45-60", powerplay: 1, middle: 3, final: 5 },
    ],
  },
  tournament2: {
    spots: [
      { match: "Match 1", spots: 20, avgDuration: 28, totalTime: 560 },
      { match: "Match 2", spots: 14, avgDuration: 22, totalTime: 308 },
      { match: "Match 3", spots: 16, avgDuration: 30, totalTime: 480 },
      { match: "Match 4", spots: 8, avgDuration: 18, totalTime: 144 },
    ],
    density: [
      { time: "0-15", powerplay: 6, middle: 3, final: 2 },
      { time: "15-30", powerplay: 4, middle: 5, final: 3 },
      { time: "30-45", powerplay: 3, middle: 7, final: 4 },
      { time: "45-60", powerplay: 2, middle: 4, final: 6 },
    ],
  },
};

const chartConfig = {
  spots: {
    label: "Ad Spots",
    color: "hsl(var(--chart-1))",
  },
  avgDuration: {
    label: "Avg Duration (s)",
    color: "hsl(var(--chart-2))",
  },
};

// Heatmap configuration
const phases = ["powerplay", "middle", "final"];
const colors = [
  "hsl(220, 70%, 95%)", // Low intensity
  "hsl(220, 70%, 80%)",
  "hsl(220, 70%, 65%)",
  "hsl(220, 70%, 50%)",
  "hsl(220, 70%, 35%)", // High intensity
];

export default function AdSpotChart() {
  const [tournament, setTournament] = useState("tournament1");
  const [metric, setMetric] = useState("spots");

  const data = adData[tournament];
  const barData = data.spots;
  const densityData = data.density;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateAdStats = () => {
    const totalSpots = barData.reduce((sum, match) => sum + match.spots, 0);
    const avgSpots = (totalSpots / barData.length).toFixed(1);
    return { totalSpots, avgSpots };
  };

  // Transform density data for heatmap
  const heatmapData = densityData.flatMap((entry) =>
    phases.map((phase) => ({
      time: entry.time,
      phase,
      value: entry[phase],
    }))
  );

  // Calculate max value for color scaling
  const maxValue = Math.max(...heatmapData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Bar Chart Card */}
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Ad Spot Frequency & Duration"
        description={getTournamentLabel()}
        action={
          <div className="flex justify-end gap-4">
            aliento
            <Select value={tournament} onValueChange={setTournament}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament1">Tournament 1</SelectItem>
                <SelectItem value="tournament2">Tournament 2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spots">Ad Spots</SelectItem>
                <SelectItem value="avgDuration">Avg Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ChartContainer config={chartConfig}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="match" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey={metric}
                fill={chartConfig[metric].color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey={metric}
                  position="top"
                  formatter={(value) =>
                    metric === "spots" ? value : `${value}s`
                  }
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Spots: {calculateAdStats().totalSpots} | Avg Spots per Match:{" "}
            {calculateAdStats().avgSpots}
          </p>
        }
      />

      {/* Heatmap Card */}
      <ChartCard
        icon={<Grid className="w-6 h-6" />}
        title="Ad Density by Match Phase"
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
                {/* Y-axis: Phases */}
                {phases.map((phase, index) => (
                  <text
                    key={phase}
                    x={-10}
                    y={index * 50 + 25}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-sm fill-foreground"
                  >
                    {phase.charAt(0).toUpperCase() + phase.slice(1)}
                  </text>
                ))}
                {/* X-axis: Time intervals */}
                {densityData.map((entry, index) => (
                  <text
                    key={entry.time}
                    x={index * 100 + 50}
                    y={-10}
                    textAnchor="middle"
                    className="text-sm fill-foreground"
                  >
                    {entry.time}
                  </text>
                ))}
                {/* Heatmap cells */}
                {heatmapData.map((entry, index) => {
                  const timeIndex = densityData.findIndex(
                    (d) => d.time === entry.time
                  );
                  const phaseIndex = phases.indexOf(entry.phase);
                  const colorIndex = Math.min(
                    Math.floor((entry.value / maxValue) * (colors.length - 1)),
                    colors.length - 1
                  );
                  return (
                    <rect
                      key={index}
                      x={timeIndex * 100}
                      y={phaseIndex * 50}
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
                        {`${entry.phase} at ${entry.time}: ${entry.value} ads`}
                      </title>
                    </rect>
                  );
                })}
                {/* Values inside cells */}
                {heatmapData.map((entry, index) => {
                  const timeIndex = densityData.findIndex(
                    (d) => d.time === entry.time
                  );
                  const phaseIndex = phases.indexOf(entry.phase);
                  return (
                    <text
                      key={index}
                      x={timeIndex * 100 + 50}
                      y={phaseIndex * 50 + 25}
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
            Ad density visualized by match phase and time interval
          </p>
        }
      />
    </div>
  );
}
