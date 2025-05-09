import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChartIcon } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

const industryColors = {
  FMCG: "#FF8A80",
  "Banking/Finance": "#FFD180",
  Telecom: "#80D8FF",
  Automotive: "#A7FFEB",
  "E-commerce": "#CCFF90",
  "Real Estate": "#CF93D9",
  Education: "#FFAB91",
  Healthcare: "#81D4FA",
  Others: "#F48FB1",
};

const industryData = [
  {
    industry: "FMCG",
    percentage: 30,
    fill: industryColors["FMCG"],
  },
  {
    industry: "Banking/Finance",
    percentage: 20,
    fill: industryColors["Banking/Finance"],
  },
  {
    industry: "Telecom",
    percentage: 15,
    fill: industryColors["Telecom"],
  },
  {
    industry: "Automotive",
    percentage: 10,
    fill: industryColors["Automotive"],
  },
  {
    industry: "E-commerce",
    percentage: 8,
    fill: industryColors["E-commerce"],
  },
  {
    industry: "Real Estate",
    percentage: 7,
    fill: industryColors["Real Estate"],
  },
  {
    industry: "Education",
    percentage: 5,
    fill: industryColors["Education"],
  },
  {
    industry: "Healthcare",
    percentage: 3,
    fill: industryColors["Healthcare"],
  },
  {
    industry: "Others",
    percentage: 2,
    fill: industryColors["Others"],
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card p-2 border rounded shadow">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">{`Share: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const Legend = ({ data }) => (
  <div className="grid grid-cols-5 gap-1 mt-2 px-2 text-xs">
    {data.map((entry) => (
      <div key={entry.industry} className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: entry.fill }}
        />
        <span className="truncate">{entry.industry}</span>
      </div>
    ))}
  </div>
);

export default function IndustryAdvertiserPieChart() {
  return (
    <ChartCard
      icon={<PieChartIcon className="w-6 h-6" />}
      title="Industry-wise Advertiser Distribution"
      description="Share of Total Advertising"
      chart={
        <div >
          <PieChart width={550} height={400}>
            <Pie
              data={industryData}
              dataKey="percentage"
              nameKey="industry"
              cx="50%"
              cy="50%"
              outerRadius={160}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </div>
      }
      footer={<Legend data={industryData} />}
    />
  );
}
