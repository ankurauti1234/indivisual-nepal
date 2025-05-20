"use client";

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
  LineChart,
  Line,
  Legend,
  Cell
} from "recharts";
import { useState } from "react";

// Dummy data
const adTimelineData = [
  { brand: "Nike", start: 5, end: 7, match: "Match 1", duration: 2 },
  { brand: "Adidas", start: 6, end: 8, match: "Match 1", duration: 2 },
  { brand: "Puma", start: 15, end: 18, match: "Match 1", duration: 3 },
  { brand: "Nike", start: 25, end: 28, match: "Match 2", duration: 3 },
  { brand: "Adidas", start: 26, end: 29, match: "Match 2", duration: 3 },
];

const freqDurationData = [
  { brand: "Nike", frequency: 8, duration: 45 },
  { brand: "Adidas", frequency: 6, duration: 35 },
  { brand: "Puma", frequency: 4, duration: 25 },
  { brand: "Reebok", frequency: 3, duration: 15 },
];

const estimatedReachData = [
  { brand: "Nike", reach: 500000, time: 5 },
  { brand: "Adidas", reach: 450000, time: 6 },
  { brand: "Puma", reach: 300000, time: 15 },
  { brand: "Reebok", reach: 200000, time: 25 },
];

// Brand-specific colors
const brandColors = {
  Nike: "#8884d8",
  Adidas: "#82ca9d",
  Puma: "#ffc658",
  Reebok: "#ff7300",
};

export default function AdBreakPerformancePage() {
  const [activeBrand, setActiveBrand] = useState(null);

  // Custom tooltip for Ad Timeline
  const TimelineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { brand, start, end, match, duration } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{brand}</p>
          <p>Match: {match}</p>
          <p>
            Time: {start}-{end} min
          </p>
          <p>Duration: {duration} min</p>
        </div>
      );
    }
    return null;
  };

  // Custom content for Ad Timeline bars
  const CustomBar = ({ x, y, width, height, fill, payload }) => {
    const { start, end } = payload;
    const durationWidth = (end - start) * (width / 30); // Scale to X-axis domain [0, 30]
    return (
      <rect
        x={x + (start / 30) * width}
        y={y}
        width={durationWidth}
        height={height}
        fill={fill}
        opacity={activeBrand === payload.brand ? 1 : 0.8}
        onMouseEnter={() => setActiveBrand(payload.brand)}
        onMouseLeave={() => setActiveBrand(null)}
      />
    );
  };

  // Custom tooltip for Frequency & Duration
  const FreqDurationTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { brand, frequency, duration } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{brand}</p>
          <p>Frequency: {frequency} ads</p>
          <p>Duration: {duration} seconds</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Estimated Reach (Bubble)
  const ReachBubbleTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { brand, reach, time } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{brand}</p>
          <p>Reach: {reach.toLocaleString()} viewers</p>
          <p>Time: {time} min</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Estimated Reach (Line)
  const ReachLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { brand, reach, time } = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-bold">{brand}</p>
          <p>Reach: {reach.toLocaleString()} viewers</p>
          <p>Time: {time} min</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 p-4">
      {/* Ad Timeline - Gantt-like Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Ad Timeline by Brand and Match
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={adTimelineData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, 30]}
              label={{
                value: "Time (min)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis dataKey="brand" type="category" />
            <Tooltip content={<TimelineTooltip />} />
            <Legend
              formatter={(value) =>
                value === "Match 1" ? "Match 1" : "Match 2"
              }
            />
            <Bar
              dataKey="end"
              stackId="a"
              isAnimationActive={true}
              animationDuration={800}
            >
              {adTimelineData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.match === "Match 1"
                      ? brandColors[entry.brand]
                      : `${brandColors[entry.brand]}80`
                  }
                  shape={<CustomBar />}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frequency & Duration - Grouped Bar Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Ad Frequency & Total Duration
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={freqDurationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
              label={{
                value: "Frequency (ads)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#82ca9d"
              label={{
                value: "Duration (s)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip content={<FreqDurationTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="frequency"
              name="Frequency"
              onMouseEnter={(data) => setActiveBrand(data.brand)}
              onMouseLeave={() => setActiveBrand(null)}
            >
              {freqDurationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={brandColors[entry.brand]}
                  opacity={activeBrand === entry.brand ? 1 : 0.8}
                />
              ))}
            </Bar>
            <Bar
              yAxisId="right"
              dataKey="duration"
              name="Duration (s)"
              onMouseEnter={(data) => setActiveBrand(data.brand)}
              onMouseLeave={() => setActiveBrand(null)}
            >
              {freqDurationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`${brandColors[entry.brand]}80`}
                  opacity={activeBrand === entry.brand ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estimated Reach - Bubble Chart */}
      {/* <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Estimated Ad Reach by Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              name="Time"
              unit=" min"
              domain={[0, 30]}
              label={{
                value: "Time (min)",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              dataKey="reach"
              name="Reach"
              unit=" viewers"
              label={{
                value: "Reach (viewers)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<ReachBubbleTooltip />} />
            <Legend />
            <Scatter name="Brands" data={estimatedReachData}>
              {estimatedReachData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={brandColors[entry.brand]}
                  r={Math.sqrt(entry.reach) / 50}
                  opacity={activeBrand === entry.brand ? 1 : 0.8}
                  onMouseEnter={() => setActiveBrand(entry.brand)}
                  onMouseLeave={() => setActiveBrand(null)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-sm text-gray-500 mt-2">
          Bubble size represents reach magnitude.
        </p>
      </div> */}

      {/* Estimated Reach - Line Chart */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">
          Estimated Reach Over Time by Brand
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={estimatedReachData}
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }} // Added left margin
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              name="Time"
              unit=" min"
              domain={[0, 30]}
              label={{
                value: "Time (min)",
                position: "insideBottom",
                offset: -5,
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              dataKey="reach"
              name="Reach"
              unit=" viewers"
              // label={{
              //   value: "Reach (viewers)",
              //   angle: -90,
              //   position: "insideLeft",
              //   offset: 10,
              //   style: { fontSize: 12 },
              // }}
            />
            <Tooltip content={<ReachLineTooltip />} />
            <Legend />
            {Object.keys(brandColors).map((brand) => (
              <Line
                key={brand}
                type="bump"
                dataKey={(data) => (data.brand === brand ? data.reach : null)}
                stroke={brandColors[brand]}
                strokeWidth={activeBrand === brand ? 3 : 2}
                activeDot={{ r: 6 }}
                dot={{ r: 4, fill: brandColors[brand] }}
                name={brand}
                onMouseEnter={() => setActiveBrand(brand)}
                onMouseLeave={() => setActiveBrand(null)}
                isAnimationActive={false} // Optional: disable animation for responsiveness
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
