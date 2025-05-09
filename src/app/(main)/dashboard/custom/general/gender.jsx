import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DivergingStackedChart = () => {
  const data = [
    {
      metric: "Watch Share",
      channel1Male: -35,
      channel2Male: -25,
      channel3Male: -20,
      channel4Male: -15,
      channel5Male: -5,
      channel1Female: 30,
      channel2Female: 25,
      channel3Female: 20,
      channel4Female: 15,
      channel5Female: 10,
    },
  ];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Channel Watch Share by Gender</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              stackOffset="sign"
              margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
            >
              <XAxis
                type="number"
                domain={[-100, 100]}
                ticks={[-80, -60, -40, -20, 0, 20, 40, 60, 80]}
                tickFormatter={(value) => `${Math.abs(value)}%`}
              />
              <YAxis type="category" hide />
              <Tooltip
                formatter={(value, name) => [
                  `${Math.abs(value)}%`,
                  name
                    .replace("Male", " (Male)")
                    .replace("Female", " (Female)")
                    .replace("channel", "Channel "),
                ]}
              />

              {/* Male bars (negative values) */}
              <Bar dataKey="channel1Male" fill="#e34a33" stackId="stack" />
              <Bar dataKey="channel2Male" fill="#fc8d59" stackId="stack" />
              <Bar dataKey="channel3Male" fill="#fdbb84" stackId="stack" />
              <Bar dataKey="channel4Male" fill="#fdd49e" stackId="stack" />
              <Bar dataKey="channel5Male" fill="#fee8c8" stackId="stack" />

              {/* Female bars (positive values) */}
              <Bar dataKey="channel1Female" fill="#084594" stackId="stack" />
              <Bar dataKey="channel2Female" fill="#2171b5" stackId="stack" />
              <Bar dataKey="channel3Female" fill="#4292c6" stackId="stack" />
              <Bar dataKey="channel4Female" fill="#6baed6" stackId="stack" />
              <Bar dataKey="channel5Female" fill="#9ecae1" stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 flex justify-center gap-8">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Male</span>
            <div className="flex gap-1">
              {["#e34a33", "#fc8d59", "#fdbb84", "#fdd49e", "#fee8c8"].map(
                (color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      style={{ backgroundColor: color }}
                      className="w-6 h-6"
                    ></div>
                    <span className="text-xs">Ch {i + 1}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold">Female</span>
            <div className="flex gap-1">
              {["#084594", "#2171b5", "#4292c6", "#6baed6", "#9ecae1"].map(
                (color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      style={{ backgroundColor: color }}
                      className="w-6 h-6"
                    ></div>
                    <span className="text-xs">Ch {i + 1}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DivergingStackedChart;
