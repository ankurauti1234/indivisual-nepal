"use client";

import { TableIcon, TrendingUp } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

// Sample data for sponsor mentions
const mentionData = {
  tournament1: {
    log: [
      {
        time: "12:34",
        brand: "Brand A",
        type: "Title Sponsor",
        context: "Pre-match show mention",
      },
      {
        time: "25:45",
        brand: "Brand B",
        type: "Replay Partner",
        context: "This replay by Brand B",
      },
      {
        time: "43:12",
        brand: "Brand A",
        type: "Title Sponsor",
        context: "Live commentary mention",
      },
      {
        time: "60:05",
        brand: "Brand C",
        type: "Segment Sponsor",
        context: "Post-match analysis",
      },
    ],
    trend: [
      { match: "Match 1", mentions: 10 },
      { match: "Match 2", mentions: 8 },
      { match: "Match 3", mentions: 12 },
      { match: "Match 4", mentions: 6 },
    ],
  },
  tournament2: {
    log: [
      {
        time: "10:15",
        brand: "Brand X",
        type: "Title Sponsor",
        context: "Pre-match show mention",
      },
      {
        time: "30:22",
        brand: "Brand Y",
        type: "Replay Partner",
        context: "This replay by Brand Y",
      },
      {
        time: "50:33",
        brand: "Brand X",
        type: "Title Sponsor",
        context: "Live commentary mention",
      },
      {
        time: "65:40",
        brand: "Brand Z",
        type: "Segment Sponsor",
        context: "Post-match analysis",
      },
    ],
    trend: [
      { match: "Match 1", mentions: 14 },
      { match: "Match 2", mentions: 9 },
      { match: "Match 3", mentions: 11 },
      { match: "Match 4", mentions: 7 },
    ],
  },
};

const chartConfig = {
  mentions: {
    label: "Mentions",
    color: "hsl(var(--chart-1))",
  },
};

export default function SponsorMentionsChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = mentionData[tournament];
  const logData = data.log;
  const trendData = data.trend;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateMentionStats = () => {
    const totalMentions = trendData.reduce(
      (sum, match) => sum + match.mentions,
      0
    );
    const avgMentions = (totalMentions / trendData.length).toFixed(1);
    return { totalMentions, avgMentions };
  };

  return (
    <div className="space-y-6">
      {/* Table Card for Timestamped Log */}
      <ChartCard
        icon={<TableIcon className="w-6 h-6" />}
        title="Sponsor Mentions Log"
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
                  <TableHead>Time</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Context</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>{entry.brand}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.context}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Mentions in Log: {logData.length}
          </p>
        }
      />

      {/* Trend Line Card */}
      <ChartCard
        icon={<TrendingUp className="w-6 h-6" />}
        title="Sponsor Mentions Trend"
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
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="match" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="mentions"
                stroke={chartConfig.mentions.color}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Mentions: {calculateMentionStats().totalMentions} | Avg
            Mentions per Match: {calculateMentionStats().avgMentions}
          </p>
        }
      />
    </div>
  );
}
