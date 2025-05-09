"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
import {
  TrendingUp,
  Users,
  Tv,
  Share2,
  Map,
  BarChart as ChartBar,
  Download,
  PieChartIcon,
  BarChart2,
} from "lucide-react";
import ViewershipMap from "./viwership-map";
import ChartCard from "@/components/card/charts-card";
import ReportLayout from "@/components/layout/report-layout";
import { Button } from "@/components/ui/button";
const CHART_COLORS = {
  blue: "#2563eb",
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#9333ea",
  red: "#dc2626",
  gray: "#6b7280",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-popover p-2 border  rounded-lg shadow-lg">
      <p className="font-medium ">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color || CHART_COLORS.blue }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const AudienceInsightsReport = () => {
  // [All data arrays remain exactly the same as in your original code]
  const primeTimeData = [
    { time: "Prime Time", viewers: 1000000 },
    { time: "Non-Prime Time", viewers: 500000 },
  ];

  const viewershipByRegion = [
    { region: "Bagmati", viewers: 500000 },
    { region: "Gandaki", viewers: 300000 },
    { region: "Lumbini", viewers: 250000 },
    { region: "Janakpur", viewers: 200000 },
    { region: "Karnali", viewers: 150000 },
  ];

  const urbanVsRural = [
    { name: "Urban", value: 700000 },
    { name: "Rural", value: 300000 },
  ];

  const topGenres = [
    { genre: "News", viewers: 400000 },
    { genre: "Entertainment", viewers: 350000 },
    { genre: "Sports", viewers: 300000 },
    { genre: "Comedy", viewers: 250000 },
    { genre: "Documentaries", viewers: 200000 },
  ];

  const seasonalShifts = [
    { month: "Jan", news: 300, entertainment: 200, sports: 150 },
    { month: "Apr", news: 250, entertainment: 300, sports: 200 },
    { month: "Jul", news: 200, entertainment: 350, sports: 300 },
    { month: "Oct", news: 350, entertainment: 250, sports: 150 },
  ];

  const topPrograms = [
    { program: "Breaking News Live", viewers: 500000 },
    { program: "Comedy Hour", viewers: 400000 },
    { program: "Live Sports Roundup", viewers: 350000 },
    { program: "Talk of the Town", viewers: 300000 },
    { program: "Documentary Specials", viewers: 250000 },
  ];

  const newVsOldPrograms = [
    { name: "New Programs", value: 40 },
    { name: "Old Programs", value: 60 },
  ];

  const averageWatchTime = [
    { program: "News", time: 30 },
    { program: "Comedy", time: 45 },
    { program: "Sports", time: 90 },
    { program: "Documentaries", time: 60 },
    { program: "Talk Shows", time: 40 },
  ];

  const dropOffRates = [
    { program: "News", rate: 10 },
    { program: "Comedy", rate: 15 },
    { program: "Sports", rate: 5 },
    { program: "Documentaries", rate: 20 },
    { program: "Talk Shows", rate: 25 },
  ];

  return (
    <ReportLayout
      title="Audience Insights"
      description="Comprehensive analysis of channel performance, viewer behavior, and audience metrics"
      action={
        <div className="flex gap-4">
          <Button>Export Report</Button>
        </div>
      }
      footer={
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          {/* <div>Last updated: {currentDate}</div> */}
          <div className="flex gap-4">
            <span>Data source: TV Analytics Platform</span>
            <span>•</span>
            <span>Report ID: TV-ANALYTICS-2025-01</span>
          </div>
        </div>
      }
    >
      <section >
        <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 gap-8">
          {/* Viewership Distribution */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              1. Viewership Distribution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prime Time Analysis */}

              <ChartCard
                icon={<PieChartIcon className="w-6 h-6" />}
                title="Prime Time vs Non-Prime Time"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={primeTimeData}
                          dataKey="viewers"
                          nameKey="time"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill={CHART_COLORS.blue}
                          paddingAngle={5}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(1)}%`
                          }
                        >
                          {primeTimeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={Object.values(CHART_COLORS)[index]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Prime time viewing accounts for 66.7% of total viewership,
                    indicating strong evening engagement patterns. This suggests
                    optimal scheduling opportunities for premium content.
                  </p>
                }
              />

              {/* Urban vs Rural */}

              <ChartCard
                icon={<PieChartIcon className="w-6 h-6" />}
                title="Urban vs Rural Demographics"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={urbanVsRural}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill={CHART_COLORS.blue}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {urbanVsRural.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={Object.values(CHART_COLORS)[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Urban viewers represent 70% of our audience, highlighting
                    the need for targeted content strategies for rural market
                    penetration.
                  </p>
                }
              />
            </div>
          </div>

          {/* Content Performance */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">2. Content Performance</h3>
            {/* Top Genres */}

            <ChartCard
              icon={<BarChart2 className="w-6 h-6" />}
              title="Genre Performance Analysis"
              // description="View GRP of ads across 4 breaks for different TV channels."
              chart={
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topGenres}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="genre"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      // tickMargin={8}
                      tickCount={8}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="viewers"
                      fill={CHART_COLORS.green}
                      radius={16}
                    >
                      <LabelList
                        position="center"
                        offset={12}
                        className="fill-foreground"
                        fontSize={16}
                        fontWeight={600}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              }
              footer={
                <p className="text-sm text-gray-500">
                  News and entertainment consistently lead viewer engagement,
                  with documentaries showing potential for growth. Sports
                  content shows strong seasonal variations but maintains a loyal
                  viewer base.
                </p>
              }
            />
          </div>

          {/* Regional Analysis */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">3. Regional Analysis</h3>

            <ChartCard
              icon={<Map className="w-6 h-6" />}
              title="Geographic Distribution"
              // description="View GRP of ads across 4 breaks for different TV channels."
              chart={<ViewershipMap data={viewershipByRegion} />}
              footer={
                <p className="text-sm text-gray-500">
                  Bagmati and Gandaki provinces show the highest engagement
                  levels, suggesting opportunities for region-specific content
                  development and marketing initiatives.
                </p>
              }
            />
          </div>

          {/* Program Performance */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">4. Program Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Programs */}

              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Top Performing Programs"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topPrograms} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="program"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={80}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="viewers"
                        fill={CHART_COLORS.blue}
                        radius={16}
                      >
                        <LabelList
                          dataKey="viewers"
                          position="insideRight"
                          offset={8}
                          stroke="#ffffff"
                          fontSize={14}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Breaking News Live and Comedy Hour lead viewership,
                    demonstrating strong audience preference for timely news
                    coverage and entertainment content.
                  </p>
                }
              />

              {/* Program Mix */}
              <ChartCard
                icon={<PieChartIcon className="w-6 h-6" />}
                title="Content Mix Analysis"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={newVsOldPrograms}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill={CHART_COLORS.blue}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {newVsOldPrograms.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={Object.values(CHART_COLORS)[index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    The current programming mix maintains a healthy balance
                    between established shows and new content, ensuring audience
                    retention while allowing for innovation.
                  </p>
                }
              />
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">5. Engagement Metrics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Average Watch Time */}
              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Average Watch Time by Genre"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={averageWatchTime}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="program"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickCount={8}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="time" fill={CHART_COLORS.blue} radius={8}>
                        <LabelList
                          position="center"
                          offset={12}
                          className="fill-foreground"
                          fontSize={16}
                          fontWeight={600}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Sports content maintains the highest average watch time at
                    90 minutes, followed by documentaries at 60 minutes. This
                    indicates strong viewer engagement with long-format content.
                  </p>
                }
              />

              {/* Drop-off Rates */}

              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Content Retention Analysis"
                // description="View GRP of ads across 4 breaks for different TV channels."
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dropOffRates}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="program"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickCount={8}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rate" fill={CHART_COLORS.orange} radius={8}>
                        <LabelList
                          position="center"
                          offset={12}
                          className="fill-foreground"
                          fontSize={16}
                          fontWeight={600}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Sports programming shows the lowest drop-off rate at 5%,
                    while talk shows experience the highest at 25%. This
                    suggests opportunities for format optimization in talk show
                    segments.
                  </p>
                }
              />
            </div>
          </div>

          {/* Seasonal Trends */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">6. Seasonal Trends</h3>

            <ChartCard
              icon={<BarChart2 className="w-6 h-6" />}
              title="Seasonal Content Performance"
              // description="View GRP of ads across 4 breaks for different TV channels."
              chart={
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart
                    data={seasonalShifts}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 34,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickCount={5}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="linear"
                      dataKey="news"
                      stroke={CHART_COLORS.blue}
                      fill={CHART_COLORS.blue + "80"}
                      strokeWidth={2}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Area>
                    <Area
                      type="linear"
                      dataKey="entertainment"
                      stroke={CHART_COLORS.green}
                      fill={CHART_COLORS.green + "80"}
                      strokeWidth={2}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Area>
                    <Area
                      type="linear"
                      dataKey="sports"
                      stroke={CHART_COLORS.orange}
                      fill={CHART_COLORS.orange + "80"}
                      strokeWidth={2}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Area>
                  </AreaChart>
                </ResponsiveContainer>
              }
              footer={
                <p className="text-sm text-gray-500">
                  Entertainment content peaks during summer months, while news
                  viewership shows stronger performance during winter. Sports
                  viewership demonstrates consistent growth through mid-year
                  with a decline in Q4.
                </p>
              }
            />
          </div>
        </div>
      </section>
    </ReportLayout>
  );
};

export default AudienceInsightsReport;
