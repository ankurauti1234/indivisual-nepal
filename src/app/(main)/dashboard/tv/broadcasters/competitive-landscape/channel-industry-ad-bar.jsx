import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const generateRandomPercentages = () => {
  // Generate random percentages that sum to 100
  let total = Math.floor(Math.random() * 100);
  const percentages = [];
  const sectors = 6; // Number of sectors (FMCG, banking, etc.)

  for (let i = 0; i < sectors - 1; i++) {
    // Generate a random percentage for each sector
    const maxPercent = total - (sectors - i - 1) * 5; // Ensure minimum 5% for remaining sectors
    const percent = Math.max(
      5,
      Math.min(maxPercent * 0.7, Math.random() * maxPercent)
    );
    percentages.push(Number(percent.toFixed(1)));
    total -= percent;
  }

  // Add the remaining percentage to the last sector
  percentages.push(Number(total.toFixed(1)));

  return {
    fmcg: percentages[0],
    banking: percentages[1],
    telecom: percentages[2],
    automobile: percentages[3],
    education: percentages[4],
  };
};

const generateMonthlyData = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const channels = [
    "Kantipur TV",
    "Himalaya TV",
    "NTV",
    "Avenues TV",
    "News 24",
    "Sagarmatha TV",
  ]; // Added more channels

  const monthlyData = {};

  months.forEach((month) => {
    monthlyData[month.toLowerCase()] = channels.map((channel) => ({
      channel,
      ...generateRandomPercentages(),
    }));
  });

  return monthlyData;
};


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
  healthcare: {
    label: "Healthcare",
    color: "#4aa516",
  },
};

export default function NepalTVSpendChart() {
  const [selectedMonth, setSelectedMonth] = useState("january");
  const monthlyData = React.useMemo(() => generateMonthlyData(), []);
  const data = monthlyData[selectedMonth];

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="TV Advertising Share by Industry"
      description="Percentage distribution across major Nepali channels"
      action={
        <div className="flex items-center justify-end">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
              <SelectItem value="june">June</SelectItem>
              <SelectItem value="july">July</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="october">October</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="december">December</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ChartContainer config={chartConfig}>
          <BarChart height={400} data={data}>
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
              // domain={[0, 100]}
              // ticks={[0, 20, 40, 60, 80, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="fmcg"
              stackId="a"
              fill="var(--color-fmcg)"
              radius={[0, 0, 0, 0]}
            ></Bar>
            <Bar
              dataKey="banking"
              stackId="a"
              fill="var(--color-banking)"
              radius={[0, 0, 0, 0]}
            ></Bar>
            <Bar
              dataKey="telecom"
              stackId="a"
              fill="var(--color-telecom)"
              radius={[0, 0, 0, 0]}
            ></Bar>
            <Bar
              dataKey="automobile"
              stackId="a"
              fill="var(--color-automobile)"
              radius={[0, 0, 0, 0]}
            ></Bar>
            <Bar
              dataKey="education"
              stackId="a"
              fill="var(--color-education)"
              radius={[16, 16, 0, 0]}
            ></Bar>
            
          </BarChart>
        </ChartContainer>
      }
      footer={
        <div className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Showing percentage distribution of advertising spend across
            industries for{" "}
            {selectedMonth.charAt(0).toUpperCase() + selectedMonth.slice(1)}
          </div>
        </div>
      }
    />
  );
}
