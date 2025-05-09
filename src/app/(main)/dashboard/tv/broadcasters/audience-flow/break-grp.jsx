import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { LineChart as LineChartIcon, Clock } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

// Channel data
const channels = [
  { name: "NTV", color: "#EB5A3C" },
  { name: "Kantipur TV", color: "#0D92F4" },
  { name: "Image Channel", color: "#A9C46C" },
  { name: "Avenues TV", color: "#9694FF" },
];

// Example GRP data for 4 breaks
const generateGrpData = () => {
  return [
    {
      break: "B1",
      NTV: Math.floor(Math.random() * 100) + 20,
      "Kantipur TV": Math.floor(Math.random() * 100) + 20,
      "Image Channel": Math.floor(Math.random() * 100) + 20,
      "Avenues TV": Math.floor(Math.random() * 100) + 20,
    },
    {
      break: "B2",
      NTV: Math.floor(Math.random() * 100) + 30,
      "Kantipur TV": Math.floor(Math.random() * 100) + 30,
      "Image Channel": Math.floor(Math.random() * 100) + 30,
      "Avenues TV": Math.floor(Math.random() * 100) + 30,
    },
    {
      break: "B3",
      NTV: Math.floor(Math.random() * 100) + 40,
      "Kantipur TV": Math.floor(Math.random() * 100) + 40,
      "Image Channel": Math.floor(Math.random() * 100) + 40,
      "Avenues TV": Math.floor(Math.random() * 100) + 40,
    },
    {
      break: "B4",
      NTV: Math.floor(Math.random() * 100) + 50,
      "Kantipur TV": Math.floor(Math.random() * 100) + 50,
      "Image Channel": Math.floor(Math.random() * 100) + 50,
      "Avenues TV": Math.floor(Math.random() * 100) + 50,
    },
  ];
};

const BreakInfoCard = ({ breakNum, time, description }) => (
  <div className="w-full flex flex-col items-center p-2 rounded-lg bg-secondary/25">
    <div className="flex items-center gap-2 mb-1">
      <Clock className="w-4 h-4 text-gray-600" />
      <span className="font-semibold text-sm">{breakNum}</span>
    </div>
    <div className="text-xs text-gray-600">{time}</div>
    <div className="text-xs text-gray-500 text-center mt-1">{description}</div>
  </div>
);

const GrpLineChart = () => {
  const [grpData, setGrpData] = useState(generateGrpData());
  const [selectedChannel, setSelectedChannel] = useState("NTV");

  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <ChartCard
      icon={<LineChartIcon className="w-6 h-6" />}
      title="GRP Analysis Across 4 Breaks"
      description="View GRP of ads across 4 breaks for different TV channels."
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={grpData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="break"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
            />
            <Tooltip />
            <Legend />
            {channels.map((channel) => (
              <Line
                key={channel.name}
                type="linear"
                dataKey={channel.name}
                stroke={channel.color}
                strokeWidth={4}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={14}
                  fontWeight={600}
                />
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      }
      footer={
        <div className="mt-4 w-full">
          <p className="text-sm font-medium mb-3 text-gray-700">
            Break Schedule Information
          </p>
          <div className="flex w-full gap-4 items-center justify-between">
            <BreakInfoCard
              breakNum="B1"
              time="6:00 - 9:00"
              description="Morning Prime Time"
            />
            <BreakInfoCard
              breakNum="B2"
              time="12:00 - 15:00"
              description="Afternoon Block"
            />
            <BreakInfoCard
              breakNum="B3"
              time="17:00 - 19:00"
              description="Evening Prime Time"
            />
            <BreakInfoCard
              breakNum="B4"
              time="20:00 - 23:00"
              description="Night Block"
            />
          </div>
        </div>
      }
    />
  );
};

export default GrpLineChart;
