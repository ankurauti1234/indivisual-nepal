"use client";

import { Map, BarChart2 } from "lucide-react";
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

// Sample data for ground/boundary advertising
const advertisingData = {
  tournament1: {
    zones: [
      { zone: "Near Crease", static: 300, dynamic: 150, competitor: 50 },
      { zone: "Pitch-Side LEDs", static: 200, dynamic: 250, competitor: 100 },
      { zone: "Stumps", static: 150, dynamic: 100, competitor: 30 },
      { zone: "Boundary Boards", static: 180, dynamic: 120, competitor: 70 },
    ],
    comparison: [
      { brand: "Your Brand", airtime: 870 },
      { brand: "Competitor A", airtime: 250 },
      { brand: "Competitor B", airtime: 150 },
    ],
  },
  tournament2: {
    zones: [
      { zone: "Near Crease", static: 320, dynamic: 170, competitor: 60 },
      { zone: "Pitch-Side LEDs", static: 220, dynamic: 270, competitor: 120 },
      { zone: "Stumps", static: 160, dynamic: 110, competitor: 40 },
      { zone: "Boundary Boards", static: 190, dynamic: 130, competitor: 80 },
    ],
    comparison: [
      { brand: "Your Brand", airtime: 920 },
      { brand: "Competitor A", airtime: 300 },
      { brand: "Competitor B", airtime: 180 },
    ],
  },
};

const chartConfig = {
  airtime: {
    label: "Airtime (s)",
    color: "hsl(var(--chart-1))",
  },
  "Your Brand": {
    label: "Your Brand",
    color: "hsl(var(--chart-1))",
  },
  "Competitor A": {
    label: "Competitor A",
    color: "hsl(var(--chart-2))",
  },
  "Competitor B": {
    label: "Competitor B",
    color: "hsl(var(--chart-3))",
  },
};

// Heatmap configuration
const zones = ["Near Crease", "Pitch-Side LEDs", "Stumps", "Boundary Boards"];
const metrics = ["Static", "Dynamic", "Competitor"];
const colors = [
  "hsl(220, 70%, 95%)", // Low intensity
  "hsl(220, 70%, 80%)",
  "hsl(220, 70%, 65%)",
  "hsl(220, 70%, 50%)",
  "hsl(220, 70%, 35%)", // High intensity
];

export default function GroundBoundaryAdvertisingChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = advertisingData[tournament];
  const zoneData = data.zones;
  const comparisonData = data.comparison;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateAirtimeStats = () => {
    const yourBrandAirtime =
      comparisonData.find((d) => d.brand === "Your Brand")?.airtime || 0;
    const totalAirtime = comparisonData.reduce((sum, d) => sum + d.airtime, 0);
    const yourBrandShare = ((yourBrandAirtime / totalAirtime) * 100).toFixed(1);
    return { yourBrandAirtime, yourBrandShare };
  };

  // Transform zone data for heatmap
  const heatmapData = zoneData.flatMap((entry) =>
    metrics.map((metric) => ({
      zone: entry.zone,
      metric: metric.toLowerCase(),
      value: entry[metric.toLowerCase()],
    }))
  );

  // Calculate max value for color scaling
  const maxValue = Math.max(...heatmapData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Stadium Map Overlay (Heatmap) Card */}
      <ChartCard
        icon={<Map className="w-6 h-6" />}
        title="Stadium High-Exposure Zones"
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
          <ResponsiveContainer width="100%" height={250}>
            <svg width="100%" height="100%">
              <g transform="translate(80, 20)">
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
                {/* X-axis: Metrics */}
                {metrics.map((metric, index) => (
                  <text
                    key={metric}
                    x={index * 100 + 50}
                    y={-10}
                    textAnchor="middle"
                    className="text-sm fill-foreground"
                  >
                    {metric}
                  </text>
                ))}
                {/* Heatmap cells */}
                {heatmapData.map((entry, index) => {
                  const zoneIndex = zones.indexOf(entry.zone);
                  const metricIndex = metrics
                    .map((m) => m.toLowerCase())
                    .indexOf(entry.metric);
                  const colorIndex = Math.min(
                    Math.floor((entry.value / maxValue) * (colors.length - 1)),
                    colors.length - 1
                  );
                  return (
                    <rect
                      key={index}
                      x={metricIndex * 100}
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
                        {`${entry.zone} (${entry.metric}): ${entry.value}s`}
                      </title>
                    </rect>
                  );
                })}
                {/* Values inside cells */}
                {heatmapData.map((entry, index) => {
                  const zoneIndex = zones.indexOf(entry.zone);
                  const metricIndex = metrics
                    .map((m) => m.toLowerCase())
                    .indexOf(entry.metric);
                  return (
                    <text
                      key={index}
                      x={metricIndex * 100 + 50}
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
            Your Brand Airtime: {calculateAirtimeStats().yourBrandAirtime}s
          </p>
        }
      />

      {/* Side-by-Side Comparison Card */}
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Brand Airtime Comparison"
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
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="brand" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="airtime" radius={[4, 4, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="airtime"
                    fill={chartConfig[entry.brand].color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
                <LabelList
                  dataKey="airtime"
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
            Your Brand Share: {calculateAirtimeStats().yourBrandShare}%
          </p>
        }
      />
    </div>
  );
}
