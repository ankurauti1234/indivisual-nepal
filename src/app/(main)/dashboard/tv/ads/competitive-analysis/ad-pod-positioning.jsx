"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";

// Data for ad pod positioning by advertiser
const rawData = {
  television: [
    { advertiser: "Dove", First: 4612, Middle: 8211, Last: 5622 },
    { advertiser: "Microwave Oven", First: 4385, Middle: 7879, Last: 5515 },
    { advertiser: "OK laundry soap", First: 5390, Middle: 6969, Last: 5620 },
    { advertiser: "Closeup", First: 5321, Middle: 8452, Last: 4853 },
    { advertiser: "CG", First: 5776, Middle: 8236, Last: 5350 },
    { advertiser: "Asianpaints", First: 4895, Middle: 8378, Last: 5710 },
    { advertiser: "Air Purifier", First: 4900, Middle: 6826, Last: 5160 },
    { advertiser: "Fanta", First: 4582, Middle: 6617, Last: 5964 },
    { advertiser: "Dermi cool", First: 5551, Middle: 7317, Last: 4232 },
    { advertiser: "Photex Power", First: 5052, Middle: 7871, Last: 6086 },
    { advertiser: "E Sewa", First: 3687, Middle: 7086, Last: 4839 },
    { advertiser: "Lux", First: 4545, Middle: 7609, Last: 5967 },
    { advertiser: "Right Path", First: 4676, Middle: 7076, Last: 5940 },
    { advertiser: "Citizen Life", First: 5211, Middle: 8271, Last: 5148 },
    { advertiser: "Dabur", First: 4084, Middle: 8160, Last: 5603 },
    { advertiser: "Minto", First: 5393, Middle: 8801, Last: 4709 },
    { advertiser: "LG", First: 4158, Middle: 7622, Last: 4978 },
    { advertiser: "TATA", First: 4481, Middle: 8356, Last: 5448 },
    { advertiser: "Sprite", First: 4745, Middle: 7702, Last: 6301 },
    { advertiser: "Toffichoo", First: 5437, Middle: 7232, Last: 4651 },
    { advertiser: "cinthol", First: 4816, Middle: 7390, Last: 5434 },
  ],
};

// Color palette for ad positions
const colors = {
  First: "#FF6B6B",
  Middle: "#4ECDC4",
  Last: "#45B7D1",
};

export default function AdPodPositioning() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  // Calculate percentage distribution for each advertiser
  const calculateDistribution = () => {
    const data = rawData[selectedChannel];
    return data.map((item) => {
      const total = item.First + item.Middle + item.Last;
      return {
        advertiser: item.advertiser,
        First: ((item.First / total) * 100).toFixed(2),
        Middle: ((item.Middle / total) * 100).toFixed(2),
        Last: ((item.Last / total) * 100).toFixed(2),
        total: 100, // For reference
      };
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-semibold text-gray-800">{payload[0].payload.advertiser}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm text-gray-600"
              style={{ color: entry.fill }}
            >
              {`${entry.name}: ${entry.value}% (${rawData[selectedChannel].find(item => item.advertiser === payload[0].payload.advertiser)[entry.name].toFixed(2)} sec)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-3 mt-4 px-4 text-sm">
      {Object.keys(colors).map((position) => (
        <div key={position} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[position] }}
          />
          <span className="truncate text-gray-700">{position}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ChartCard
      icon={<PieChartIcon className="w-7 h-7 text-blue-500" />}
      title="Ad Pod Positioning"
      description="Position Distribution 2025"
      action={
        <div className="flex justify-end">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48 bg-white border-gray-200">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="television">Television</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={calculateDistribution()}
            margin={{ top: 20, right: 30, bottom: 100, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="advertiser"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              angle={45}
              textAnchor="start"
              height={80}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
              align="center"
            />
            <Bar
              dataKey="First"
              stackId="a"
              fill={colors.First}
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Middle"
              stackId="a"
              fill={colors.Middle}
              barSize={30}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="Last"
              stackId="a"
              fill={colors.Last}
              barSize={30}
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing ad pod positioning for{" "}
          {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
        </p>
      }
    />
  );
}