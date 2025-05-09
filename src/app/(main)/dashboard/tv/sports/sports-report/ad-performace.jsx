'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { useState } from 'react';

// Dummy data
const adTimelineData = [
  { brand: 'Nike', start: 5, end: 7, match: 'Match 1' },
  { brand: 'Adidas', start: 6, end: 8, match: 'Match 1' },
  { brand: 'Puma', start: 15, end: 18, match: 'Match 1' },
  { brand: 'Nike', start: 25, end: 28, match: 'Match 2' },
  { brand: 'Adidas', start: 26, end: 29, match: 'Match 2' },
];

const freqDurationData = [
  { brand: 'Nike', frequency: 8, duration: 45 },
  { brand: 'Adidas', frequency: 6, duration: 35 },
  { brand: 'Puma', frequency: 4, duration: 25 },
  { brand: 'Reebok', frequency: 3, duration: 15 },
];

const estimatedReachData = [
  { brand: 'Nike', reach: 500000, time: 5 },
  { brand: 'Adidas', reach: 450000, time: 6 },
  { brand: 'Puma', reach: 300000, time: 15 },
  { brand: 'Reebok', reach: 200000, time: 25 },
];

export default function AdBreakPerformancePage() {
  return (
    <div className="space-y-8 p-4">
      {/* Ad Timeline - Gantt-like Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Ad Timeline</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={adTimelineData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 30]} label="Time (min)" />
            <YAxis dataKey="brand" type="category" />
            <Tooltip
              formatter={(value, name, props) => [
                `${props.payload.start}-${props.payload.end} min`,
                props.payload.brand,
              ]}
            />
            <Bar
              dataKey="end"
              fill="#8884d8"
              barSize={20}
              stackId="a"
              isAnimationActive={false}
            >
              {adTimelineData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.start < 10 ? '#8884d8' : '#82ca9d'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frequency & Duration - Grouped Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Frequency & Duration</h2>
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

      {/* Estimated Reach - Bubble Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Estimated Reach</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" name="Time (min)" unit=" min" />
            <YAxis dataKey="reach" name="Reach" unit=" viewers" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name, props) => [
                value,
                `${props.payload.brand}: ${name}`,
              ]}
            />
            <Scatter name="Brands" data={estimatedReachData} fill="#8884d8">
              {estimatedReachData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.reach > 400000
                      ? '#8884d8'
                      : entry.reach > 300000
                      ? '#82ca9d'
                      : '#ffc658'
                  }
                  r={Math.sqrt(entry.reach) / 100}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Alternative: Estimated Reach - Area Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Estimated Reach (Over Time)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={estimatedReachData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="reach"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}