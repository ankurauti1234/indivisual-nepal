"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChartCard from "@/components/card/charts-card";

// Sample data for ad counts by daypart and advertiser with dates
const rawData = {
  "2025-01-01": [
    {
      advertiser: "Shivam Cement",
      Morning: 50,
      Afternoon: 30,
      Evening: 60,
      Night: 25,
    },
    {
      advertiser: "N Cell",
      Morning: 40,
      Afternoon: 35,
      Evening: 50,
      Night: 20,
    },
    {
      advertiser: "Asian Paints",
      Morning: 30,
      Afternoon: 20,
      Evening: 35,
      Night: 15,
    },
    {
      advertiser: "Nike",
      Morning: 20,
      Afternoon: 15,
      Evening: 25,
      Night: 10,
    },
    { advertiser: "Others", Morning: 10, Afternoon: 10, Evening: 15, Night: 5 },
  ],
  "2025-02-01": [
    {
      advertiser: "Shivam Cement",
      Morning: 45,
      Afternoon: 28,
      Evening: 55,
      Night: 22,
    },
    {
      advertiser: "N Cell",
      Morning: 38,
      Afternoon: 32,
      Evening: 48,
      Night: 18,
    },
    {
      advertiser: "Asian Paints",
      Morning: 28,
      Afternoon: 18,
      Evening: 32,
      Night: 12,
    },
    {
      advertiser: "Nike",
      Morning: 18,
      Afternoon: 12,
      Evening: 22,
      Night: 8,
    },
    { advertiser: "Others", Morning: 8, Afternoon: 8, Evening: 12, Night: 3 },
  ],
  "2025-03-01": [
    {
      advertiser: "Shivam Cement",
      Morning: 55,
      Afternoon: 35,
      Evening: 65,
      Night: 28,
    },
    {
      advertiser: "N Cell",
      Morning: 45,
      Afternoon: 40,
      Evening: 55,
      Night: 25,
    },
    {
      advertiser: "Asian Paints",
      Morning: 35,
      Afternoon: 25,
      Evening: 40,
      Night: 20,
    },
    {
      advertiser: "Nike",
      Morning: 25,
      Afternoon: 20,
      Evening: 30,
      Night: 15,
    },
    {
      advertiser: "Others",
      Morning: 15,
      Afternoon: 15,
      Evening: 20,
      Night: 10,
    },
  ],
};

// Color palette for advertisers
const colors = {
  "Shivam Cement": "#ff6b6b",
  "N Cell": "#4ecdc4",
  "Asian Paints": "#45b7d1",
  Nike: "#96ceb4",
  Others: "#ddd111",
};

// Daypart labels and their base positions for x-axis
const dayparts = [
  { key: "Morning", label: "Morning (6am-12pm)" },
  { key: "Afternoon", label: "Afternoon (12pm-5pm)" },
  { key: "Evening", label: "Evening (5pm-10pm)" },
  { key: "Night", label: "Night (10pm-6am)" },
];
const daypartPositions = { Morning: 1, Afternoon: 3, Evening: 5, Night: 7 };

// Available dates for filter
const availableDates = Object.keys(rawData);

export default function ProgramAffinityIndex() {
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);

  // Calculate affinity data with dayparts
  const calculateAffinity = () => {
    const data = rawData[selectedDate];

    // Calculate total ads per daypart
    const daypartTotals = dayparts.reduce((acc, daypart) => {
      acc[daypart.key] = data.reduce((sum, item) => sum + item[daypart.key], 0);
      return acc;
    }, {});

    // Calculate total market share for normalization
    const advertiserTotals = data.reduce((acc, item) => {
      acc[item.advertiser] = dayparts.reduce(
        (sum, daypart) => sum + item[daypart.key],
        0
      );
      return acc;
    }, {});

    const totalMarketSize = Object.values(advertiserTotals).reduce(
      (sum, val) => sum + val,
      0
    );

    // Create data with jitter and variation
    return Object.keys(colors)
      .map((advertiser) => {
        const advertiserData = data.find(
          (item) => item.advertiser === advertiser
        );

        if (!advertiserData) return [];

        return dayparts.map((daypart) => {
          // Calculate metrics for visualization
          const daypartTotal = daypartTotals[daypart.key];
          const advertiserShare = advertiserData[daypart.key];
          const marketPenetration =
            advertiserTotals[advertiser] / totalMarketSize;

          // Calculate affinity (percentage of this daypart's ads from this advertiser)
          const affinity = ((advertiserShare / daypartTotal) * 100).toFixed(1);

          // Add jitter to position
          const jitterX = (Math.random() - 0.5) * 0.6;
          const baseX = daypartPositions[daypart.key];

          // Variable bubble size based on market penetration and actual count
          const bubbleSize = Math.max(
            5,
            Math.sqrt(advertiserShare) * 2 + marketPenetration * 30
          );

          return {
            advertiser,
            daypart: daypart.key,
            fullLabel: daypart.label,
            x: baseX + jitterX,
            y: parseFloat(affinity),
            affinity: parseFloat(affinity),
            rawCount: advertiserShare,
            marketShare: (marketPenetration * 100).toFixed(1),
            size: bubbleSize,
          };
        });
      })
      .flat()
      .filter((item) => item.rawCount > 0);
  };

  // Custom tooltip for the scatter chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{data.advertiser}</p>
          <p className="text-sm font-medium text-gray-800">{`Daypart: ${data.fullLabel}`}</p>
          <div className="mt-1 space-y-1">
            <p className="text-sm">{`Affinity: ${data.affinity}%`}</p>
            <p className="text-sm">{`Ad Count: ${data.rawCount}`}</p>
            <p className="text-sm">{`Market Share: ${data.marketShare}%`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((advertiser) => (
        <div key={advertiser} className="flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[advertiser] }}
          />
          <span className="truncate">{advertiser}</span>
        </div>
      ))}
    </div>
  );

  // Generate the data
  const scatterData = calculateAffinity();

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Daypart Affinity Index"
      description="Daypart Preference Analysis 2025"
      action={
        <div className="flex justify-end">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              opacity={0.6}
            />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 8]}
              ticks={[1, 3, 5, 7]}
              tickFormatter={(value) => {
                const closestDaypart = Object.entries(daypartPositions).find(
                  ([_, pos]) => Math.abs(pos - value) < 0.5
                );
                return closestDaypart ? closestDaypart[0] : "";
              }}
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              name="Daypart"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Affinity"
              domain={[0, "dataMax"]}
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              label={{
                value: "Affinity (%)",
                position: "insideLeft",
                angle: -90,
                style: { textAnchor: "middle" },
                offset: 0,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.keys(colors).map((advertiser) => (
              <Scatter
                key={advertiser}
                name={advertiser}
                data={scatterData.filter((d) => d.advertiser === advertiser)}
                fill={colors[advertiser]}
              >
                {scatterData
                  .filter((d) => d.advertiser === advertiser)
                  .map((entry, index) => (
                    <Cell
                      key={`cell-${advertiser}-${index}`}
                      fill={colors[advertiser]}
                      opacity={0.8}
                      stroke={colors[advertiser]}
                      strokeWidth={0.5}
                      r={entry.size}
                      style={{
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
              </Scatter>
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      }
      footer={<CustomLegend />}
    />
  );
}