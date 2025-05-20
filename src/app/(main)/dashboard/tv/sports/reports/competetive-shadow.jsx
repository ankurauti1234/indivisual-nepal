"use client";

import { AlertCircle, BarChart2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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

// Sample data for competitor shadowing
const shadowingData = {
  tournament1: {
    instances: [
      {
        time: "10:45",
        location: "Pitch-Side LEDs",
        event: "Wicket",
        competitor: "Competitor A",
        description:
          "Your Brand and Competitor A logos on LEDs during wicket replay",
      },
      {
        time: "25:30",
        location: "Boundary Boards",
        event: "Boundary",
        competitor: "Competitor B",
        description:
          "Your Brand and Competitor B logos on boards during boundary shot",
      },
      {
        time: "40:15",
        location: "Stumps",
        event: "Celebration",
        competitor: "Competitor A",
        description:
          "Your Brand and Competitor A logos on stumps during celebration",
      },
    ],
    frequency: [
      { competitor: "Competitor A", occurrences: 2 },
      { competitor: "Competitor B", occurrences: 1 },
      { competitor: "Competitor C", occurrences: 0 },
    ],
  },
  tournament2: {
    instances: [
      {
        time: "12:20",
        location: "Pitch-Side LEDs",
        event: "Boundary",
        competitor: "Competitor B",
        description:
          "Your Brand and Competitor B logos on LEDs during boundary replay",
      },
      {
        time: "30:50",
        location: "Stumps",
        event: "Wicket",
        competitor: "Competitor A",
        description:
          "Your Brand and Competitor A logos on stumps during wicket",
      },
      {
        time: "45:35",
        location: "Boundary Boards",
        event: "Celebration",
        competitor: "Competitor C",
        description:
          "Your Brand and Competitor C logos on boards during team celebration",
      },
    ],
    frequency: [
      { competitor: "Competitor A", occurrences: 1 },
      { competitor: "Competitor B", occurrences: 1 },
      { competitor: "Competitor C", occurrences: 1 },
    ],
  },
};

const chartConfig = {
  occurrences: {
    label: "Occurrences",
    color: "hsl(var(--chart-1))",
  },
};

export default function CompetitorShadowingChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = shadowingData[tournament];
  const instanceData = data.instances;
  const frequencyData = data.frequency;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateShadowingStats = () => {
    const totalInstances = instanceData.length;
    const uniqueCompetitors = [
      ...new Set(
        frequencyData.filter((d) => d.occurrences > 0).map((d) => d.competitor)
      ),
    ].length;
    return { totalInstances, uniqueCompetitors };
  };

  return (
    <div className="space-y-6">
      {/* Instances Table Card */}
      <ChartCard
        icon={<AlertCircle className="w-6 h-6" />}
        title="Competitor Shadowing Instances"
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
                  <TableHead>Location</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instanceData.length > 0 ? (
                  instanceData.map((instance, index) => (
                    <TableRow key={index}>
                      <TableCell>{instance.time}</TableCell>
                      <TableCell>{instance.location}</TableCell>
                      <TableCell>{instance.event}</TableCell>
                      <TableCell>{instance.competitor}</TableCell>
                      <TableCell>{instance.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No competitor shadowing detected
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Instances: {calculateShadowingStats().totalInstances}
          </p>
        }
      />

      {/* Frequency Bar Chart Card */}
      <ChartCard
        icon={<BarChart2 className="w-6 h-6" />}
        title="Competitor Shadowing Frequency"
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
            <BarChart
              data={frequencyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="competitor" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="occurrences"
                fill={chartConfig.occurrences.color}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey="occurrences"
                  position="top"
                  formatter={(value) => `${value}`}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Unique Competitors: {calculateShadowingStats().uniqueCompetitors}
          </p>
        }
      />
    </div>
  );
}
