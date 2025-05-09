import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { channel_name: "Kantipur TV", Male: 66.67, Female: 33.33 },
  { channel_name: "Nepal Television", Male: 60, Female: 40 },
  { channel_name: "AP1 TV", Male: 45, Female: 55 },
  { channel_name: "Himalaya TV", Male: 76.47, Female: 23.53 },
  { channel_name: "News 24 Nepal", Male: 65, Female: 35 },
  { channel_name: "Image Channel", Male: 50.59, Female: 49.41 },
  { channel_name: "Avenues Television", Male: 31.25, Female: 68.75 },
  { channel_name: "Mountain Television", Male: 82.43, Female: 17.57 },
  { channel_name: "Sagarmatha TV", Male: 85.71, Female: 14.23 },
];

const chartConfig = {
  Male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  Female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
};

export default function Component() {
  return (
    <ChartCard
      icon={<BarChart3 className="w-6 h-6" />}
      title="Gender Distribution by Channel"
      description="Audience distribution by gender"
      chart={
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
            barCategoryGap={4}
          >
            <CartesianGrid horizontal={false} strokeDasharray="4" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickCount={11}
              ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
              fontSize={14}
              stroke="#888"
            />
            <YAxis
              type="category"
              dataKey="channel_name"
              tickLine={false}
              axisLine={false}
              fontSize={14}
              tickMargin={0}
              width={120}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="Female" stackId="a" fill="#FF748B" radius={8}>
              <LabelList
                dataKey="Female"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={14}
                formatter={(value) => `${value} %`}
              />
            </Bar>
            <Bar dataKey="Male" stackId="a" fill="#344CB7" radius={8}>
              <LabelList
                dataKey="Male"
                position="insideRight"
                offset={8}
                className="fill-white"
                fontSize={14}
                formatter={(value) => `${value} %`}
              />
            </Bar>
            <Legend />
          </BarChart>
        </ChartContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Channel gender share percentage distribution
        </p>
      }
    />
  );
}
