'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Heatmap,
  Cell,
  Treemap as RechartsTreemap,
} from 'recharts';
import { useState } from 'react';

// Dummy data
const brandCoOccurrenceData = [
  { brand: 'Pepsi', CocaCola: 15, Sprite: 5, Fanta: 2 },
  { brand: 'CocaCola', Pepsi: 15, Sprite: 8, Fanta: 3 },
  { brand: 'Sprite', Pepsi: 5, CocaCola: 8, Fanta: 6 },
  { brand: 'Fanta', Pepsi: 2, CocaCola: 3, Sprite: 6 },
];

const freqDurationData = [
  { brand: 'Pepsi', frequency: 25, duration: 120 },
  { brand: 'CocaCola', frequency: 20, duration: 100 },
  { brand: 'Sprite', frequency: 15, duration: 80 },
  { brand: 'Fanta', frequency: 10, duration: 60 },
];

const adTimingData = [
  { brand: 'Pepsi', prime: 8, nonPrime: 17 },
  { brand: 'CocaCola', prime: 6, nonPrime: 14 },
  { brand: 'Sprite', prime: 4, nonPrime: 11 },
  { brand: 'Fanta', prime: 3, nonPrime: 7 },
];

const sectorClashData = [
  { name: 'Beverages', value: 45, brands: ['Pepsi', 'CocaCola', 'Sprite'] },
  { name: 'Tech', value: 30, brands: ['Apple', 'Samsung'] },
  { name: 'Auto', value: 25, brands: ['Toyota', 'Ford'] },
];

export default function BrandAnalyticsCharts() {
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
        <h2 className="text-xl font-bold mb-4">Frequency and Duration Battle</h2>
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

      {/* Sector vs Sector Clash - Treemap */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Sector vs Sector Clash</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsTreemap
            data={sectorClashData}
            dataKey="value"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip
              formatter={(value, name, props) => [
                `${value}%`,
                `${name} (${props.payload.brands.join(', ')})`,
              ]}
            />
          </RechartsTreemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}