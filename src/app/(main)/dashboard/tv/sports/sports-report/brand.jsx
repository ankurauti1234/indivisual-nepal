"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Treemap as RechartsTreemap,
} from "recharts";
import { useState } from "react";

// Dummy data
const brandCoOccurrenceData = [
  { brand: "Pepsi", CocaCola: 15, Sprite: 5, Fanta: 2 },
  { brand: "CocaCola", Pepsi: 15, Sprite: 8, Fanta: 3 },
  { brand: "Sprite", Pepsi: 5, CocaCola: 8, Fanta: 6 },
  { brand: "Fanta", Pepsi: 2, CocaCola: 3, Sprite: 6 },
];

const freqDurationData = [
  { brand: "Pepsi", frequency: 25, duration: 120 },
  { brand: "CocaCola", frequency: 20, duration: 100 },
  { brand: "Sprite", frequency: 15, duration: 80 },
  { brand: "Fanta", frequency: 10, duration: 60 },
];

const adTimingData = [
  { brand: "Pepsi", prime: 8, nonPrime: 17 },
  { brand: "CocaCola", prime: 6, nonPrime: 14 },
  { brand: "Sprite", prime: 4, nonPrime: 11 },
  { brand: "Fanta", prime: 3, nonPrime: 7 },
];

// Updated data for treemap: individual brands
const brandClashData = [
  { name: "Pepsi", value: 15, sector: "Beverages" }, // 45 / 3 for Beverages
  { name: "CocaCola", value: 15, sector: "Beverages" },
  { name: "Sprite", value: 15, sector: "Beverages" },
  { name: "Apple", value: 15, sector: "Tech" }, // 30 / 2 for Tech
  { name: "Samsung", value: 15, sector: "Tech" },
  { name: "Toyota", value: 12.5, sector: "Auto" }, // 25 / 2 for Auto
  { name: "Ford", value: 12.5, sector: "Auto" },
];

export default function BrandAnalyticsCharts() {
  const [activeBrand, setActiveBrand] = useState(null);

  // Custom colors for each brand
  const colors = {
    Pepsi: "#8884d8",
    CocaCola: "#82ca9d",
    Sprite: "#ffc658",
    Fanta: "#ff7300",
    Apple: "#a4de6c",
    Samsung: "#d0ed57",
    Toyota: "#ff9f40",
    Ford: "#ff6384",
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, sector } = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold text-lg">{name}</p>
          <p>Sector: {sector}</p>
          <p>Share: {value}%</p>
        </div>
      );
    }
    return null;
  };

  // Custom content for treemap cells
  const CustomizedContent = ({
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    payload,
    name,
    value,
  }) => {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: colors[name] || "#8884d8",
            stroke: "#fff",
            strokeWidth: 2,
            opacity: activeBrand === name ? 1 : 0.8,
            cursor: "pointer",
          }}
          onMouseEnter={() => setActiveBrand(name)}
          onMouseLeave={() => setActiveBrand(null)}
        />
        {width > 60 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            dominantBaseline="middle"
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-8 p-4">
      {/* Brand Co-Occurrence Matrix - Heatmap */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Brand Co-Occurrence Matrix</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brandCoOccurrenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Pepsi" stackId="a" fill="#8884d8" />
            <Bar dataKey="CocaCola" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Sprite" stackId="a" fill="#ffc658" />
            <Bar dataKey="Fanta" stackId="a" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frequency and Duration Battle - Grouped Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Frequency and Duration Battle
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={freqDurationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Bar
              yAxisId="left"
              dataKey="frequency"
              fill="#8884d8"
              name="Frequency"
            />
            <Bar
              yAxisId="right"
              dataKey="duration"
              fill="#82ca9d"
              name="Duration (s)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ad Timing Overlap - Grouped Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Ad Timing Overlap (Prime vs Non-Prime)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={adTimingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="prime" fill="#8884d8" name="Prime Time" />
            <Bar dataKey="nonPrime" fill="#82ca9d" name="Non-Prime Time" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Brand vs Brand Clash - Improved Treemap */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Brand vs Brand Clash</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsTreemap
            data={brandClashData}
            dataKey="value"
            ratio={4 / 3}
            isAnimationActive={true}
            animationDuration={800}
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
