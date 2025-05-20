"use client";

import { Video,  Timer } from "lucide-react";
import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

// Sample data for key moment visibility
const keyMomentData = {
  tournament1: {
    clips: [
      {
        time: "15:23",
        event: "Wicket",
        brand: "Your Brand",
        description: "Logo on stumps during wicket celebration",
      },
      {
        time: "32:45",
        event: "Boundary",
        brand: "Your Brand",
        description: "Logo on boundary boards during 4-run shot",
      },
      {
        time: "48:10",
        event: "Celebration",
        brand: "Your Brand",
        description: "Logo on jersey during player celebration",
      },
    ],
    timeline: [
      { time: 15.38, event: "Wicket", brand: "Your Brand" },
      { time: 32.75, event: "Boundary", brand: "Your Brand" },
      { time: 48.17, event: "Celebration", brand: "Your Brand" },
      { time: 25.5, event: "Wicket", brand: null }, // Non-branded event
      { time: 40.2, event: "Boundary", brand: null },
    ],
  },
  tournament2: {
    clips: [
      {
        time: "10:12",
        event: "Wicket",
        brand: "Your Brand",
        description: "Logo on pitch-side LEDs during wicket",
      },
      {
        time: "28:30",
        event: "Celebration",
        brand: "Your Brand",
        description: "Logo on jersey during team celebration",
      },
      {
        time: "50:55",
        event: "Boundary",
        brand: "Your Brand",
        description: "Logo on boundary boards during 6-run shot",
      },
    ],
    timeline: [
      { time: 10.2, event: "Wicket", brand: "Your Brand" },
      { time: 28.5, event: "Celebration", brand: "Your Brand" },
      { time: 50.92, event: "Boundary", brand: "Your Brand" },
      { time: 20.33, event: "Wicket", brand: null },
      { time: 45.67, event: "Celebration", brand: null },
    ],
  },
};

const chartConfig = {
  event: {
    label: "Match Events",
  },
};

export default function KeyMomentVisibilityChart() {
  const [tournament, setTournament] = useState("tournament1");

  const data = keyMomentData[tournament];
  const clipData = data.clips;
  const timelineData = data.timeline;

  const getTournamentLabel = () => {
    return tournament === "tournament1" ? "Tournament 1" : "Tournament 2";
  };

  const calculateVisibilityStats = () => {
    const totalClips = clipData.length;
    const brandedEvents = timelineData.filter((d) => d.brand).length;
    return { totalClips, brandedEvents };
  };

  // Transform timeline data for scatter chart
  const scatterData = timelineData.map((entry, index) => ({
    time: entry.time,
    event: entry.event,
    brand: entry.brand,
    y: entry.brand ? 1 : 0.5, // Branded events higher on Y-axis
  }));

  return (
    <div className="space-y-6">
      {/* Event-Tagged Clips Card */}
      <ChartCard
        icon={<Video className="w-6 h-6" />}
        title="Event-Tagged Brand Clips"
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
                  <TableHead>Event</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clipData.length > 0 ? (
                  clipData.map((clip, index) => (
                    <TableRow key={index}>
                      <TableCell>{clip.time}</TableCell>
                      <TableCell>{clip.event}</TableCell>
                      <TableCell>{clip.brand}</TableCell>
                      <TableCell>{clip.description}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No branded clips detected
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        }
        footer={
          <p className="text-sm text-gray-500">
            Total Branded Clips: {calculateVisibilityStats().totalClips}
          </p>
        }
      />

      {/* Match Timeline Card */}
      <ChartCard
        icon={<Timer className="w-6 h-6" />}
        title="Match Timeline with Logo Appearances"
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
            <ScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              height={200}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="time"
                name="Time (min)"
                unit="m"
                domain={[0, 60]}
                tickFormatter={(value) =>
                  `${Math.floor(value)}:${Math.round((value % 1) * 60)
                    .toString()
                    .padStart(2, "0")}`
                }
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Event"
                hide
                domain={[0, 1.5]}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <ChartTooltipContent
                        label={`${data.event} at ${Math.floor(
                          data.time
                        )}:${Math.round((data.time % 1) * 60)
                          .toString()
                          .padStart(2, "0")}`}
                        payload={[
                          {
                            name: "Brand",
                            value: data.brand || "None",
                            color: data.brand
                              ? "hsl(var(--chart-1))"
                              : "hsl(var(--muted))",
                          },
                        ]}
                      />
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Events"
                data={scatterData}
                fill="hsl(var(--chart-1))"
              >
                {scatterData.map((entry, index) => (
                  <Scatter
                    key={index}
                    cx={entry.time}
                    cy={entry.y}
                    r={entry.brand ? 6 : 4}
                    fill={
                      entry.brand ? "hsl(var(--chart-1))" : "hsl(var(--muted))"
                    }
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ChartContainer>
        }
        footer={
          <p className="text-sm text-gray-500">
            Branded Events: {calculateVisibilityStats().brandedEvents} of{" "}
            {timelineData.length}
          </p>
        }
      />
    </div>
  );
}
