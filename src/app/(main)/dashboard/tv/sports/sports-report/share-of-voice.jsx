'use client';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useState } from 'react';

// Dummy data
const sovByBrandData = [
  { name: 'Nike', value: 35 },
  { name: 'Adidas', value: 25 },
  { name: 'Puma', value: 20 },
  { name: 'Reebok', value: 15 },
  { name: 'Under Armour', value: 5 },
];

const brandConsistencyData = [
  { brand: 'Nike', 'Day 1': 8, 'Day 2': 7, 'Day 3': 9 },
  { brand: 'Adidas', 'Day 1': 6, 'Day 2': 5, 'Day 3': 6 },
  { brand: 'Puma', 'Day 1': 4, 'Day 2': 6, 'Day 3': 5 },
  { brand: 'Reebok', 'Day 1': 3, 'Day 2': 2, 'Day 3': 4 },
];

const categorySOVData = [
  {
    category: 'Sportswear',
    Nike: 35,
    Adidas: 25,
    Puma: 20,
    Reebok: 15,
  },
  { category: 'Beverages', Pepsi: 40, Coke: 30, Sprite: 20 },
  { category: 'Tech', Apple: 50, Samsung: 30 },
];

const sectorDominanceData = [
  { phase: 'Group', Sportswear: 40, Beverages: 30, Tech: 20 },
  { phase: 'Quarter', Sportswear: 35, Beverages: 35, Tech: 25 },
  { phase: 'Semi', Sportswear: 30, Beverages: 40, Tech: 20 },
  { phase: 'Final', Sportswear: 25, Beverages: 45, Tech: 20 },
];

const matchWiseSOVData = [
  { match: 'Match 1', Nike: 40, Adidas: 30, Puma: 20 },
  { match: 'Match 2', Nike: 35, Adidas: 25, Puma: 25 },
  { match: 'Match 3', Nike: 30, Adidas: 35, Puma: 20 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff4d4f'];

export default function ShareOfVoicePage() {
  const [selectedMatch, setSelectedMatch] = useState('Match 1');

  return (
    <div className="space-y-8 p-4">
      {/* Share of Voice by Brand - Pie Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Share of Voice by Brand</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sovByBrandData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {sovByBrandData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Brand Consistency Heatmap - Line Chart Alternative */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Brand Consistency</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={brandConsistencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="Day 1"
              stroke="#8884d8"
              name="Day 1"
            />
            <Line
              type="monotone"
              dataKey="Day 2"
              stroke="#82ca9d"
              name="Day 2"
            />
            <Line
              type="monotone"
              dataKey="Day 3"
              stroke="#ffc658"
              name="Day 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category-Level SOV Distribution - Stacked Horizontal Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Category-Level SOV Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categorySOVData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" />
            <Tooltip />
            <Bar dataKey="Nike" stackId="a" fill="#8884d8" />
            <Bar dataKey="Adidas" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Puma" stackId="a" fill="#ffc658" />
            <Bar dataKey="Reebok" stackId="a" fill="#ff7300" />
            <Bar dataKey="Pepsi" stackId="a" fill="#8884d8" />
            <Bar dataKey="Coke" stackId="a" fill="#82ca9d" />
            <Bar dataKey="Sprite" stackId="a" fill="#ffc658" />
            <Bar dataKey="Apple" stackId="a" fill="#8884d8" />
            <Bar dataKey="Samsung" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector Dominance - Multi-Line Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Sector Dominance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sectorDominanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="phase" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Sportswear"
              stroke="#8884d8"
              name="Sportswear"
            />
            <Line
              type="monotone"
              dataKey="Beverages"
              stroke="#82ca9d"
              name="Beverages"
            />
            <Line type="monotone" dataKey="Tech" stroke="#ffc658" name="Tech" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Match-wise SOV Trend - Interactive Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Match-wise SOV Trend</h2>
        <div className="mb-4">
          <select
            className="p-2 border rounded"
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
          >
            {matchWiseSOVData.map((d) => (
              <option key={d.match} value={d.match}>
                {d.match}
              </option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={matchWiseSOVData.filter((d) => d.match === selectedMatch)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="match" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Nike" fill="#8884d8" />
            <Bar dataKey="Adidas" fill="#82ca9d" />
            <Bar dataKey="Puma" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}