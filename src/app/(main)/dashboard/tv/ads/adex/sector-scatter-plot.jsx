import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ChartScatter } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

// Extended mock data with more entries and realistic values
const mockData = {
  "Home Improvement & Decor": {
    company: "Asian Paints",
    color: "#FF6B6B",
    categories: [
      { name: "Wall Paints", grp: 85, adSpend: 1200000 },
      { name: "Wood Finishes", grp: 72, adSpend: 800000 },
      { name: "Waterproofing Solutions", grp: 65, adSpend: 600000 },
      { name: "Decorative Paints", grp: 78, adSpend: 900000 },
      { name: "Industrial Coatings", grp: 70, adSpend: 750000 },
    ],
  },
  "Food & Beverages": {
    company: "Current/Wai Wai/Pepsi",
    color: "#4ECDC4",
    categories: [
      { name: "Instant Noodles", grp: 92, adSpend: 1500000 },
      { name: "Ready-to-Eat Snacks", grp: 88, adSpend: 1300000 },
      { name: "Soft Drinks", grp: 95, adSpend: 2000000 },
      { name: "Packaged Juices", grp: 82, adSpend: 900000 },
      { name: "Energy Drinks", grp: 78, adSpend: 800000 },
      { name: "Spices", grp: 70, adSpend: 600000 },
      { name: "Frozen Foods", grp: 65, adSpend: 750000 },
    ],
  },
  "Media & Entertainment": {
    company: "DishHome",
    color: "#45B7D1",
    categories: [
      { name: "DTH Services", grp: 75, adSpend: 1100000 },
      { name: "HD Channel Packages", grp: 70, adSpend: 900000 },
      { name: "Internet Services", grp: 80, adSpend: 1300000 },
      { name: "VOD Services", grp: 85, adSpend: 1500000 },
      { name: "IPTV", grp: 72, adSpend: 1000000 },
    ],
  },
  "Financial Services": {
    company: "Global IME/NIC Asia",
    color: "#96CEB4",
    categories: [
      { name: "Retail Banking", grp: 68, adSpend: 2000000 },
      { name: "Corporate Banking", grp: 55, adSpend: 1500000 },
      { name: "Insurance Services", grp: 62, adSpend: 1800000 },
      { name: "Digital Payment Solutions", grp: 75, adSpend: 2200000 },
      { name: "Mobile Banking", grp: 82, adSpend: 2500000 },
      { name: "Wealth Management", grp: 58, adSpend: 1200000 },
      { name: "Microfinance", grp: 72, adSpend: 900000 },
    ],
  },
  Telecommunications: {
    company: "Ncell/NTC",
    color: "#9B59B6",
    categories: [
      { name: "Mobile Network Services", grp: 88, adSpend: 3000000 },
      { name: "Broadband Internet", grp: 82, adSpend: 2500000 },
      { name: "Value-Added Services", grp: 75, adSpend: 1800000 },
      { name: "Enterprise Solutions", grp: 70, adSpend: 1500000 },
      { name: "Prepaid Plans", grp: 85, adSpend: 2800000 },
      { name: "International Roaming", grp: 65, adSpend: 1200000 },
    ],
  },
  "Construction Materials": {
    company: "Shivam Cement",
    color: "#E67E22",
    categories: [
      { name: "OPC Cement", grp: 78, adSpend: 1800000 },
      { name: "PPC Cement", grp: 72, adSpend: 1500000 },
      { name: "Ready-Mix Concrete", grp: 65, adSpend: 1200000 },
      { name: "Specialty Cement", grp: 60, adSpend: 900000 },
    ],
  },
  FMCG: {
    company: "Unilever",
    color: "#2ECC71",
    categories: [
      { name: "Personal Care", grp: 90, adSpend: 2800000 },
      { name: "Home Care", grp: 85, adSpend: 2500000 },
      { name: "Packaged Foods", grp: 82, adSpend: 2200000 },
      { name: "Oral Care", grp: 78, adSpend: 1900000 },
      { name: "Baby Care", grp: 75, adSpend: 1600000 },
    ],
  },
};

const SectorScatterPlot = () => {
  const [selectedSector, setSelectedSector] = useState("All");

  const formatData = () => {
    if (selectedSector === "All") {
      return Object.entries(mockData).map(([sector, data]) => ({
        id: sector,
        data: data.categories.map((cat) => ({
          x: cat.adSpend,
          y: cat.grp,
          category: cat.name,
          sector: sector,
        })),
        color: data.color,
      }));
    }

    return [
      {
        id: selectedSector,
        data: mockData[selectedSector].categories.map((cat) => ({
          x: cat.adSpend,
          y: cat.grp,
          category: cat.name,
          sector: selectedSector,
        })),
        color: mockData[selectedSector].color,
      },
    ];
  };

  return (

    <ChartCard
      icon={<ChartScatter className="w-6 h-6" />}
      title="Category Performance by Sector"
      // description="Most performing channels this year"
      action={
          <div className="flex items-center justify-end gap-2">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sectors</SelectItem>
            {Object.keys(mockData).map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        </div>
      }
      chart={
        <div className="h-[600px]">
          <ResponsiveScatterPlot
            data={formatData()}
            margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
            xScale={{ type: "linear", min: 0, max: "auto" }}
            yScale={{ type: "linear", min: 0, max: 100 }}
            xFormat=">,.0f"
            yFormat=">,.0f"
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            colors={({ serieId }) => mockData[serieId]?.color || "#000000"}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Ad Spend ($)",
              legendPosition: "middle",
              legendOffset: 46,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "GRP",
              legendPosition: "middle",
              legendOffset: -60,
            }}
            pointSize={10}
            pointBorderWidth={1}
            pointBorderColor={{
              from: "color",
              modifiers: [["darker", 0.3]],
            }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 130,
                translateY: 0,
                itemWidth: 100,
                itemHeight: 12,
                itemsSpacing: 5,
                itemDirection: "left-to-right",
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            tooltip={({ node }) => (
              <div className="bg-white p-2 shadow-lg rounded-lg border">
                <strong>{node.data.category}</strong>
                <div>Sector: {node.data.sector}</div>
                <div>Ad Spend: ${node.data.x.toLocaleString()}</div>
                <div>GRP: {node.data.y}</div>
              </div>
            )}
          />
        </div>
      }
    />

  );
};

export default SectorScatterPlot;
