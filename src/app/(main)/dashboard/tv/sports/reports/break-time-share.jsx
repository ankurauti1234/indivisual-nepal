"use client";

import { PieChartIcon, AlertTriangle } from "lucide-react";
import { Pie, PieChart, Label } from "recharts";
import { useState } from "react";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ChartCard from "@/components/card/charts-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data for break-time share and alerts
const breakTimeData = {
  tournament1: {
    shares: [
      { name: "Your Brand", value: 60, fill: "hsl(var(--chart-1))" },
      { name: "Competitor A", value: 25, fill: "hsl(var(--chart-2))" },
      { name: "Competitor B", value: 15, fill: "hsl(var(--chart-3))" },
    ],
    alerts: [
      { match: "Match 2", share: 45, timestamp: "2025-05-18 14:30" },
      { match: "Match 4", share: 40, timestamp: "2025-05-19 10:15" },
    ],
  },
  tournament2: {
    shares: [
      { name: "Your Brand", value: 55, fill: "hsl(var(--chart-1))" },
      { name: "Competitor A", value: 30, fill: "hsl(var(--chart-2))" },
      { name: "Competitor B", value: 15, fill: "hsl(var(--chart-3))" },
    ],
    alerts: [
      { match: "Match 1", share: 48, timestamp: "2025-05-17 16:45" },
      { match: "Match 3", share: 42, timestamp: "2025-05-18 12:20" },
    ],
  },
};

const chartConfig = {
  value: {
    label: "Break-Time Share (%)",
  },
  "Your Brand": {
    label: "Your Brand",
    color: "hsl(var(--chart-1))",
  },
  "Competitor A": {
    label: "Competitor A",
    color: "hsl(var(--chart-2))",
  },
  "Competitor B": {
    label: "Competitor B",
    color: "hsl(var(--chart-3))",
  },
};

export default function BreakTimeShareChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = breakTimeData[tournament];
  const shareData = data.shares;
  const alertData = data.alerts;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateShareStats = () => {
    const yourBrandShare =
      shareData.find((d) => d.name === "Your Brand")?.value || 0;
    const totalAlerts = alertData.length;
    return { yourBrandShare, totalAlerts };
  };

  return (
    <div className="space-y-6">
      {/* Donut Chart Card */}
      <ChartCard
        icon={<PieChartIcon className="w-6 h-6" />}
        title="Break-Time Share"
        description={getTournamentLabel()}
        action={
          <div className="flex justify-end">
            <Select value={tournament} onValueChange={setTournament}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament1">Tournament 1</SelectItem>
                <SelectItem value="tournament2">Tournament 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={shareData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {calculateShareStats().yourBrandShare}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Your Brand
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Your Brand Share: {calculateShareStats().yourBrandShare}%
          </p>
        }
      />

      {/* Alerts Table Card */}
      <ChartCard
        icon={<AlertTriangle className="w-6 h-6" />}
        title="Low Share Alerts (<50%)"
        description={getTournamentLabel()}
        action={
          <div className="flex justify-end">
            <Select value={tournament} onValueChange={setTournament}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tournament1">Tournament 1</SelectItem>
                <SelectItem value="tournament2">Tournament 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        chart={
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Share (%)</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertData.length > 0 ? (
                  alertData.map((alert, index) => (
                    <TableRow key={index}>
                      <TableCell>{alert.match}</TableCell>
                      <TableCell>{alert.share}%</TableCell>
                      <TableCell>{alert.timestamp}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No alerts: Share ≥ 50% in all matches
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Alerts: {calculateShareStats().totalAlerts}
          </p>
        }
      />
    </div>
  );
}
