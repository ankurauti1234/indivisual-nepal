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

// Sample data for ad counts by genre and advertiser
const rawData = {
  television: [
    {
      advertiser: "Shivam Cement",
      Drama: 50,
      News: 30,
      Entertainment: 20,
      Sports: 10,
    },
    {
      advertiser: "N Cell",
      Drama: 40,
      News: 35,
      Entertainment: 25,
      Sports: 15,
    },
    {
      advertiser: "Asian Paints",
      Drama: 30,
      News: 20,
      Entertainment: 30,
      Sports: 20,
    },
    {
      advertiser: "Nike",
      Drama: 20,
      News: 15,
      Entertainment: 25,
      Sports: 10,
    },
    { advertiser: "Others", Drama: 10, News: 10, Entertainment: 15, Sports: 5 },
  ],
  radio: [
    {
      advertiser: "Shivam Cement",
      Drama: 40,
      News: 25,
      Entertainment: 15,
      Sports: 10,
    },
    {
      advertiser: "N Cell",
      Drama: 35,
      News: 30,
      Entertainment: 20,
      Sports: 10,
    },
    {
      advertiser: "Asian Paints",
      Drama: 25,
      News: 15,
      Entertainment: 25,
      Sports: 15,
    },
    {
      advertiser: "Nike",
      Drama: 15,
      News: 10,
      Entertainment: 20,
      Sports: 5,
    },
    { advertiser: "Others", Drama: 5, News: 5, Entertainment: 10, Sports: 3 },
  ],
  digital: [
    {
      advertiser: "Shivam Cement",
      Drama: 60,
      News: 40,
      Entertainment: 30,
      Sports: 20,
    },
    {
      advertiser: "N Cell",
      Drama: 50,
      News: 45,
      Entertainment: 35,
      Sports: 25,
    },
    {
      advertiser: "Asian Paints",
      Drama: 35,
      News: 25,
      Entertainment: 40,
      Sports: 20,
    },
    {
      advertiser: "Nike",
      Drama: 25,
      News: 20,
      Entertainment: 30,
      Sports: 15,
    },
    {
      advertiser: "Others",
      Drama: 15,
      News: 15,
      Entertainment: 20,
      Sports: 10,
    },
  ],
};

// Color palette for advertisers with adjusted transparency
const colors = {
  "Shivam Cement": "#ff6b6b",
  "N Cell": "#4ecdc4",
  "Asian Paints": "#45b7d1",
  Nike: "#96ceb4",
  Others: "#ddd111",
};

// Genre labels and their base positions for x-axis
const genres = ["Drama", "News", "Entertainment", "Sports"];
const genrePositions = { Drama: 1, News: 3, Entertainment: 5, Sports: 7 };

export default function ProgramAffinityIndex() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  // Add some natural jitter and improved data transformation
  const calculateAffinity = () => {
    const data = rawData[selectedChannel];

    // Calculate total ads per genre
    const genreTotals = genres.reduce((acc, genre) => {
      acc[genre] = data.reduce((sum, item) => sum + item[genre], 0);
      return acc;
    }, {});

    // Calculate total market share for normalization
    const advertiserTotals = data.reduce((acc, item) => {
      acc[item.advertiser] = genres.reduce(
        (sum, genre) => sum + item[genre],
        0
      );
      return acc;
    }, {});

    const totalMarketSize = Object.values(advertiserTotals).reduce(
      (sum, val) => sum + val,
      0
    );

    // Create data with jitter and more natural variation
    return Object.keys(colors)
      .map((advertiser) => {
        const advertiserData = data.find(
          (item) => item.advertiser === advertiser
        );

        if (!advertiserData) return [];

        return genres.map((genre) => {
          // Calculate metrics for visualization
          const genreTotal = genreTotals[genre];
          const advertiserShare = advertiserData[genre];
          const marketPenetration =
            advertiserTotals[advertiser] / totalMarketSize;

          // Calculate affinity (percentage of this genre's ads from this advertiser)
          const affinity = ((advertiserShare / genreTotal) * 100).toFixed(1);

          // Add jitter to position (more jitter for smaller values)
          const jitterX = (Math.random() - 0.5) * 0.6;
          const baseX = genrePositions[genre];

          // Variable bubble size based on market penetration and actual count
          const bubbleSize = Math.max(
            5,
            Math.sqrt(advertiserShare) * 2 + marketPenetration * 30
          );

          return {
            advertiser,
            genre,
            x: baseX + jitterX, // Add jitter to x position
            y: parseFloat(affinity),
            affinity: parseFloat(affinity),
            rawCount: advertiserShare,
            marketShare: (marketPenetration * 100).toFixed(1),
            size: bubbleSize,
          };
        });
      })
      .flat()
      .filter((item) => item.rawCount > 0); // Remove zero-value items
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium text-base">{data.advertiser}</p>
          <p className="text-sm font-medium text-gray-800">{`Genre: ${data.genre}`}</p>
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

  // Generate the data once for this render
  const scatterData = calculateAffinity();

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Program Affinity Index"
      description="Genre Preference Analysis 2024"
      action={
        <div className="flex justify-end">
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="television">Television</SelectItem>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
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
                const closestGenre = Object.entries(genrePositions).find(
                  ([_, pos]) => Math.abs(pos - value) < 0.5
                );
                return closestGenre ? closestGenre[0] : "";
              }}
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              name="Genre"
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
