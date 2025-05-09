'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useState } from 'react';

// Dummy data
const placementImpactData = [
  { brand: 'Nike', placement: 'Jersey', duration: 120, timeOnScreen: 8 },
  { brand: 'Adidas', placement: 'Boundary', duration: 90, timeOnScreen: 6 },
  { brand: 'Puma', placement: 'Scoreboard', duration: 60, timeOnScreen: 4 },
  { brand: 'Reebok', placement: 'Jersey', duration: 80, timeOnScreen: 5 },
];

const logoDetectionData = [
  { placement: 'Jersey', Nike: 120, Adidas: 50, Puma: 30 },
  { placement: 'Boundary', Nike: 80, Adidas: 90, Puma: 60 },
  { placement: 'Scoreboard', Nike: 40, Adidas: 30, Puma: 60 },
];

const visibilityHeatmapData = [
  { zone: 'Center Pitch', duration: 300 },
  { zone: 'Boundaries', duration: 200 },
  { zone: 'Scoreboard', duration: 150 },
  { zone: 'Crowd', duration: 100 },
];

const durationLeaderboardData = [
  { brand: 'Nike', duration: 240, matches: 3 },
  { brand: 'Adidas', duration: 170, matches: 3 },
  { brand: 'Puma', duration: 150, matches: 2 },
  { brand: 'Reebok', duration: 80, matches: 2 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function BrandVisibilityPage() {
  const [sortConfig, setSortConfig] = useState({
    key: 'duration',
    direction: 'desc',
  });

  const sortedPlacementImpact = [...placementImpactData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] - b[sortConfig.key];
    }
    return b[sortConfig.key] - a[sortConfig.key];
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'desc'
          ? 'asc'
          : 'desc',
    });
  };

  return (
    <div className="space-y-8 p-4">
      {/* Placement Impact Score - Interactive Table */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Placement Impact Score</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort('brand')}
                >
                  Brand
                </th>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort('placement')}
                >
                  Placement
                </th>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort('duration')}
                >
                  Duration (s)
                </th>
                <th
                  className="border p-2 cursor-pointer"
                  onClick={() => handleSort('timeOnScreen')}
                >
                  Avg Time on Screen (s)
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlacementImpact.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{item.brand}</td>
                  <td className="border p-2">{item.placement}</td>
                  <td className="border p-2">{item.duration}</td>
                  <td className="border p-2">{item.timeOnScreen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logo Detection Table - Stacked Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Logo Detection</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={logoDetectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="placement" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Nike" stackId="a" fill="#8884d8" />
            <Bar dataKey="Adidas" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Puma" stackId="a" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Visibility Heatmap - Bar Chart Alternative */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Visibility Heatmap</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visibilityHeatmapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="zone" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="duration" fill="#8884d8">
              {visibilityHeatmapData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.duration > 200
                      ? '#8884d8'
                      : entry.duration > 150
                      ? '#82ca9d'
                      : '#ffc658'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Duration Leaderboard - Horizontal Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Duration Leaderboard</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={durationLeaderboardData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="brand" type="category" />
            <Tooltip
              formatter={(value, name, props) =>
                `${value} sec (${props.payload.matches} matches)`
              }
            />
            <Bar dataKey="duration" fill="#8884d8">
              {durationLeaderboardData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}