"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
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

// Sample data for airtime by category and advertiser
const rawData = {
  television: {
    name: "Categories",
    children: [
      {
        name: "Automotive",
        children: [
          { name: "Shivam Cement", airtime: 500 },
          { name: "N Cell", airtime: 400 },
          { name: "Asian Paints", airtime: 300 },
          { name: "Nike", airtime: 200 },
          { name: "Others", airtime: 100 },
        ],
      },
      {
        name: "Electronics",
        children: [
          { name: "Shivam Cement", airtime: 350 },
          { name: "N Cell", airtime: 300 },
          { name: "Asian Paints", airtime: 250 },
          { name: "Nike", airtime: 150 },
          { name: "Others", airtime: 50 },
        ],
      },
      {
        name: "Food & Beverage",
        children: [
          { name: "Shivam Cement", airtime: 400 },
          { name: "N Cell", airtime: 350 },
          { name: "Asian Paints", airtime: 200 },
          { name: "Nike", airtime: 100 },
          { name: "Others", airtime: 50 },
        ],
      },
      {
        name: "Retail",
        children: [
          { name: "Shivam Cement", airtime: 300 },
          { name: "N Cell", airtime: 250 },
          { name: "Asian Paints", airtime: 150 },
          { name: "Nike", airtime: 100 },
          { name: "Others", airtime: 50 },
        ],
      },
    ],
  },
  radio: {
    name: "Categories",
    children: [
      {
        name: "Automotive",
        children: [
          { name: "Shivam Cement", airtime: 400 },
          { name: "N Cell", airtime: 350 },
          { name: "Asian Paints", airtime: 250 },
          { name: "Nike", airtime: 150 },
          { name: "Others", airtime: 50 },
        ],
      },
      {
        name: "Electronics",
        children: [
          { name: "Shivam Cement", airtime: 300 },
          { name: "N Cell", airtime: 250 },
          { name: "Asian Paints", airtime: 200 },
          { name: "Nike", airtime: 100 },
          { name: "Others", airtime: 30 },
        ],
      },
      {
        name: "Food & Beverage",
        children: [
          { name: "Shivam Cement", airtime: 350 },
          { name: "N Cell", airtime: 300 },
          { name: "Asian Paints", airtime: 150 },
          { name: "Nike", airtime: 80 },
          { name: "Others", airtime: 30 },
        ],
      },
      {
        name: "Retail",
        children: [
          { name: "Shivam Cement", airtime: 250 },
          { name: "N Cell", airtime: 200 },
          { name: "Asian Paints", airtime: 100 },
          { name: "Nike", airtime: 80 },
          { name: "Others", airtime: 20 },
        ],
      },
    ],
  },
  digital: {
    name: "Categories",
    children: [
      {
        name: "Automotive",
        children: [
          { name: "Shivam Cement", airtime: 600 },
          { name: "N Cell", airtime: 500 },
          { name: "Asian Paints", airtime: 400 },
          { name: "Nike", airtime: 300 },
          { name: "Others", airtime: 200 },
        ],
      },
      {
        name: "Electronics",
        children: [
          { name: "Shivam Cement", airtime: 450 },
          { name: "N Cell", airtime: 400 },
          { name: "Asian Paints", airtime: 350 },
          { name: "Nike", airtime: 200 },
          { name: "Others", airtime: 100 },
        ],
      },
      {
        name: "Food & Beverage",
        children: [
          { name: "Shivam Cement", airtime: 500 },
          { name: "N Cell", airtime: 450 },
          { name: "Asian Paints", airtime: 300 },
          { name: "Nike", airtime: 150 },
          { name: "Others", airtime: 100 },
        ],
      },
      {
        name: "Retail",
        children: [
          { name: "Shivam Cement", airtime: 400 },
          { name: "N Cell", airtime: 350 },
          { name: "Asian Paints", airtime: 200 },
          { name: "Nike", airtime: 150 },
          { name: "Others", airtime: 100 },
        ],
      },
    ],
  },
};

// Color palette for categories
const colors = {
  Automotive: "#ff6b6b",
  Electronics: "#4ecdc4",
  "Food & Beverage": "#45b7d1",
  Retail: "#96ceb4",
};

export default function CategoryConcentration() {
  const [selectedChannel, setSelectedChannel] = useState("television");

  // Transform data for Recharts Treemap
  const transformDataForRecharts = () => {
    const data = rawData[selectedChannel];
    const totalAirtime = data.children.reduce((sum, category) => {
      return (
        sum +
        category.children.reduce(
          (catSum, advertiser) => catSum + (advertiser.airtime || 0),
          0
        )
      );
    }, 0);

    // Flatten the hierarchy for Recharts
    const flatData = [];

    data.children.forEach((category) => {
      const categoryTotal = category.children.reduce(
        (sum, advertiser) => sum + advertiser.airtime,
        0
      );

      // Add category as a parent node
      flatData.push({
        name: category.name,
        size: categoryTotal,
        categoryName: category.name,
        isCategory: true,
        share: ((categoryTotal / totalAirtime) * 100).toFixed(1),
      });

      // Add each advertiser under this category
      category.children.forEach((advertiser) => {
        flatData.push({
          name: advertiser.name,
          parent: category.name,
          size: advertiser.airtime,
          categoryName: category.name,
          isAdvertiser: true,
          share: ((advertiser.airtime / totalAirtime) * 100).toFixed(1),
        });
      });
    });

    return flatData;
  };

  // Custom tooltip for the Treemap
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{data.name}</p>
          {data.parent && <p>{`Category: ${data.parent}`}</p>}
          <p>{`Airtime Share: ${data.share}%`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2 px-2 text-xs">
      {Object.keys(colors).map((category) => (
        <div key={category} className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors[category] }}
          />
          <span className="truncate">{category}</span>
        </div>
      ))}
    </div>
  );

  // Calculate total airtime for the selected channel
  const totalAirtime = rawData[selectedChannel].children.reduce(
    (sum, category) => {
      return (
        sum +
        category.children.reduce(
          (catSum, advertiser) => catSum + (advertiser.airtime || 0),
          0
        )
      );
    },
    0
  );

  // Custom rendering for treemap rectangles
  const CustomizedContent = (props) => {
    const {
      x,
      y,
      width,
      height,
      root,
      depth,
      index,
      name,
      categoryName,
      isCategory,
    } = props;

    // Only render text if the rectangle is big enough
    const shouldRenderText = width > 30 && height > 20;
    const fillColor = isCategory ? colors[categoryName] : "#ddd111";

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fillColor,
            stroke: "#fff",
            strokeWidth: 2,
            strokeOpacity: 1,
          }}
        />
        {shouldRenderText && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
          >
            {name}
          </text>
        )}
      </g>
    );
  };

  // Render fallback if no valid data
  const treemapData = transformDataForRecharts();
  if (!treemapData.length) {
    return (
      <ChartCard
        icon={<PieChartIcon className="w-6 h-6" />}
        title="Category Concentration"
        description="Airtime Share by Product Category 2024"
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
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              No data available for {selectedChannel}
            </p>
          </div>
        }
        footer={
          <p className="text-sm text-gray-500">
            Showing category concentration for{" "}
            {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
          </p>
        }
      />
    );
  }

  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Category Concentration"
      description="Airtime Share by Product Category 2024"
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
        <div style={{ height: 400, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomizedContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      }
      footer={
        <div>
          <CustomLegend />
          <p className="text-sm text-gray-500 mt-2">
            Showing category concentration for{" "}
            {selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1)}
          </p>
        </div>
      }
    />
  );
}
