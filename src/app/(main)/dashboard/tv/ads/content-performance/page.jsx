"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  LabelList,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  SkipForward,
  BarChartIcon as ChartBar,
  Download,
} from "lucide-react";

const CHART_COLORS = {
  blue: "hsl(var(--chart-1))",
  green: "hsl(var(--chart-2))",
  orange: "hsl(var(--chart-3))",
  purple: "hsl(var(--chart-4))",
  red: "hsl(var(--chart-5))",
  gray: "hsl(var(--chart-6))",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-popover p-2 border rounded-lg shadow-lg">
      <p className="font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color || CHART_COLORS.blue }}>
          {entry.name}: {entry.value.toLocaleString()}
          {entry.unit ? entry.unit : ""}
        </p>
      ))}
    </div>
  );
};

const ContentPerformance = () => {
  const topPerformingAds = [
    { name: "Holiday Special", revenue: 150000 },
    { name: "Prime Time News", revenue: 120000 },
    { name: "Sports Finals", revenue: 100000 },
    { name: "Morning Show", revenue: 80000 },
    { name: "Weekend Movie", revenue: 70000 },
  ];

  const programAdEffectiveness = [
    { program: "Evening News", targetReach: 85 },
    { program: "Morning Show", targetReach: 75 },
    { program: "Prime Time Drama", targetReach: 70 },
    { program: "Sports Live", targetReach: 65 },
    { program: "Late Night Show", targetReach: 55 },
  ];

  const programImpactOnAdSpend = [
    { name: "New Programs", value: 65, spend: "650000" },
    { name: "Old Programs", value: 35, spend: "350000" },
  ];

  const averageWatchTime = [
    { program: "News", time: 45, adViews: 40 },
    { program: "Drama", time: 55, adViews: 50 },
    { program: "Sports", time: 120, adViews: 110 },
    { program: "Reality", time: 40, adViews: 35 },
    { program: "Movies", time: 90, adViews: 80 },
  ];

  const adSkipRates = [
    { timeSlot: "Morning", rate: 25 },
    { timeSlot: "Afternoon", rate: 30 },
    { timeSlot: "Evening", rate: 15 },
    { timeSlot: "Prime Time", rate: 10 },
    { timeSlot: "Late Night", rate: 35 },
  ];

  const genreAdPerformance = [
    { genre: "News", impact: 85, revenue: 120000 },
    { genre: "Sports", impact: 90, revenue: 150000 },
    { genre: "Drama", impact: 75, revenue: 100000 },
    { genre: "Reality", impact: 70, revenue: 90000 },
    { genre: "Movies", impact: 80, revenue: 110000 },
  ];

  return (
    <div className="container mx-auto p-8 bg-popover shadow-inner rounded-lg border">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            Content Performance
          </h1>
          <Button className="flex items-center gap-2 p-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Comprehensive analysis of advertising performance across various
          programs, genres, and time slots.
        </p>
      </div>

      {/* Executive Summary */}
      <section className="mb-12 bg-card border p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <p className="text-foreground/75 mb-4">
          Our analysis reveals strong performance for holiday specials and prime
          time news ads. Sports content shows high engagement and revenue
          potential. New programs are driving a significant portion of ad spend,
          indicating successful content strategies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Top Performing Ad</h3>
            <p className="text-2xl font-bold text-blue-600">Holiday Special</p>
          </div>
          <div className="bg-emerald-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">
              Highest Target Reach
            </h3>
            <p className="text-2xl font-bold text-green-600">
              Evening News (85%)
            </p>
          </div>
          <div className="bg-amber-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">
              Lowest Ad Skip Rate
            </h3>
            <p className="text-2xl font-bold text-orange-600">
              Prime Time (10%)
            </p>
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 gap-8">
          {/* Ad Performance */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">1. Ad Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <CardTitle>Top Performing Ads</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topPerformingAds} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="revenue"
                          fill={CHART_COLORS.blue}
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <CardTitle>Target Reach by Program</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={programAdEffectiveness}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="program" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                          dataKey="targetReach"
                          fill={CHART_COLORS.green}
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            content={({ value }) => `${value}%`}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Program Impact */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">2. Program Impact</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <CardTitle>New vs Old Program Ad Spend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={programImpactOnAdSpend}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill={CHART_COLORS.blue}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {programImpactOnAdSpend.map((entry, index) => (
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <CardTitle>Average Watch Time vs Ad Views</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={averageWatchTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="program" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="time"
                          name="Watch Time (min)"
                          fill={CHART_COLORS.blue}
                          radius={8}
                        />
                        <Bar
                          dataKey="adViews"
                          name="Ad Views (min)"
                          fill={CHART_COLORS.green}
                          radius={8}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ad Engagement */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">3. Ad Engagement</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <SkipForward className="h-4 w-4" />
                    <CardTitle>Ad Skip Rates</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={adSkipRates}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeSlot" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke={CHART_COLORS.red}
                          fill={CHART_COLORS.red + "80"}
                          strokeWidth={2}
                        >
                          <LabelList
                            position="top"
                            content={({ value }) => `${value}%`}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Area>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ChartBar className="h-4 w-4" />
                    <CardTitle>Genre Impact on Ad Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genreAdPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="genre" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="impact"
                          name="Impact Score"
                          fill={CHART_COLORS.purple}
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            content={({ value }) => `${value}%`}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                        <Bar
                          yAxisId="right"
                          dataKey="revenue"
                          name="Revenue"
                          fill={CHART_COLORS.orange}
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mb-12 bg-card border p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-600/25 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Ad Placement Strategy
            </h3>
            <p className="text-foreground/75">
              Focus on placing high-value ads during prime time slots and sports
              events to maximize revenue and minimize skip rates.
            </p>
          </div>
          <div className="p-4 bg-emerald-600/25 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              Content Development
            </h3>
            <p className="text-foreground/75">
              Invest in creating more new programs, as they are driving a
              significant portion of ad spend and viewer engagement.
            </p>
          </div>
          <div className="p-4 bg-amber-600/25 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">Genre Focus</h3>
            <p className="text-foreground/75">
              Prioritize sports and news content, as these genres show the
              highest impact scores and revenue generation potential.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="text-sm text-muted-foreground mt-8">
        <h2 className="text-lg font-semibold mb-2">Methodology</h2>
        <p>
          This report analyzes advertising performance data collected across all
          channels and platforms. Metrics include revenue generation, target
          audience reach, ad skip rates, and genre-specific performance. The
          data covers the most recent quarter and is compared against historical
          averages where applicable.
        </p>
      </section>
    </div>
  );
};

export default ContentPerformance;
