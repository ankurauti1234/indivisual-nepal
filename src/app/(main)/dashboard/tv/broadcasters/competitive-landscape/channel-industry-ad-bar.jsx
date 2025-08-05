import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import { BarChart2 } from "lucide-react";

const chartConfig = {
  fmcg: {
    label: "FMCG",
    color: "hsl(var(--chart-1))",
  },
  banking: {
    label: "Banking & Finance",
    color: "hsl(var(--chart-2))",
  },
  telecom: {
    label: "Telecom",
    color: "hsl(var(--chart-3))",
  },
  automobile: {
    label: "Automobile",
    color: "hsl(var(--chart-4))",
  },
  education: {
    label: "Education",
    color: "hsl(var(--chart-5))",
  },
};

const weeklyData = [
  { channel: "Himalaya TV", fmcg: 30, banking: 25, telecom: 25, automobile: 15, education: 5, total: 100 },
  { channel: "Kantipur TV", fmcg: 25, banking: 20, telecom: 20, automobile: 15, education: 10, total: 90 },
  { channel: "NTV", fmcg: 20, banking: 20, telecom: 20, automobile: 15, education: 10, total: 85 },
  { channel: "Avenues TV", fmcg: 20, banking: 15, telecom: 20, automobile: 15, education: 10, total: 80 },
  { channel: "News 24", fmcg: 15, banking: 15, telecom: 20, automobile: 15, education: 10, total: 75 },
  { channel: "Sagarmatha TV", fmcg: 10, banking: 15, telecom: 15, automobile: 10, education: 10, total: 60 },
];

export default function NepalTVSpendChart() {
  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="TV Advertising Share by Industry"
      description="Percentage distribution across major Nepali channels for the week"
      chart={
        <ChartContainer config={chartConfig}>
          <BarChart height={400} data={weeklyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#121212"
            />
            <XAxis
              dataKey="channel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="fmcg"
              stackId="a"
              fill="var(--color-fmcg)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="banking"
              stackId="a"
              fill="var(--color-banking)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="telecom"
              stackId="a"
              fill="var(--color-telecom)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="automobile"
              stackId="a"
              fill="var(--color-automobile)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="education"
              stackId="a"
              fill="var(--color-education)"
              radius={[16, 16, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      }
      footer={
        <div className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing percentage distribution of advertising spend across industries for the week
          </div>
        </div>
      }
    />
  );
}