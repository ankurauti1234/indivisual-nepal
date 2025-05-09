"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  PieChart,
  Pie,
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
  Users,
  Map,
  Clock,
  Activity,
  BarChartIcon as ChartBar,
  PieChartIcon as ChartPie,
  Download,
} from "lucide-react";

const CHART_COLORS = {
  blue: "hsl(var(--chart-1))",
  green: "hsl(var(--chart-2))",
  orange: "hsl(var(--chart-3))",
  purple: "hsl(var(--chart-4))",
  red: "hsl(var(--chart-5))",
  yellow: "hsl(var(--chart-6))",
  gray: "hsl(var(--muted))",
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
        </p>
      ))}
    </div>
  );
};

const AudienceDemographics = () => {
  const ageGenderData = [
    { age: "13-17", male: 15000, female: 18000 },
    { age: "18-24", male: 45000, female: 48000 },
    { age: "25-34", male: 65000, female: 62000 },
    { age: "35-44", male: 40000, female: 38000 },
    { age: "45-54", male: 25000, female: 28000 },
    { age: "55+", male: 20000, female: 22000 },
  ];

  const urbanRuralData = [
    { name: "Urban", value: 65 },
    { name: "Rural", value: 35 },
  ];

  const genreReachData = [
    { genre: "News", reach: 850000 },
    { genre: "Entertainment", reach: 720000 },
    { genre: "Sports", reach: 650000 },
    { genre: "Drama", reach: 580000 },
    { genre: "Documentary", reach: 420000 },
  ];

  const timeOfDayData = [
    { time: "6AM", viewers: 25000 },
    { time: "9AM", viewers: 45000 },
    { time: "12PM", viewers: 65000 },
    { time: "3PM", viewers: 55000 },
    { time: "6PM", viewers: 85000 },
    { time: "9PM", viewers: 95000 },
    { time: "12AM", viewers: 35000 },
  ];

  const regionHeatmapData = [
    { region: "Bagmati", reach: 450000 },
    { region: "Gandaki", reach: 280000 },
    { region: "Lumbini", reach: 220000 },
    { region: "Karnali", reach: 180000 },
    { region: "Sudurpashchim", reach: 170000 },
  ];

  const engagementRateData = [
    { platform: "TV", rate: 75 },
    { platform: "Mobile", rate: 85 },
    { platform: "Web", rate: 65 },
    { platform: "Tablet", rate: 55 },
  ];

  return (
    <div className="container mx-auto p-8 bg-popover shadow-inner rounded-lg border">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">
            Audience Demographics
          </h1>
          <Button className="flex items-center gap-2 p-2 bg-primary text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">
          Comprehensive analysis of viewer demographics, preferences, and
          engagement across various platforms and regions.
        </p>
      </div>

      {/* Executive Summary */}
      <section className="mb-12 bg-card border p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <p className="text-foreground/75 mb-4">
          Our audience analysis reveals a diverse viewership with strong
          engagement across multiple platforms. The 25-34 age group shows the
          highest participation, with a slight gender balance favoring females.
          Urban areas dominate viewership, and news remains the most popular
          genre.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Peak Viewing Time</h3>
            <p className="text-2xl font-bold text-blue-600">9PM</p>
          </div>
          <div className="bg-emerald-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Highest Engagement</h3>
            <p className="text-2xl font-bold text-green-600">Mobile (85%)</p>
          </div>
          <div className="bg-amber-600/25 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">Top Region</h3>
            <p className="text-2xl font-bold text-orange-600">Bagmati</p>
          </div>
        </div>
      </section>

      {/* Key Findings */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 gap-8">
          {/* Demographic Distribution */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              1. Demographic Distribution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <CardTitle>Age and Gender Distribution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageGenderData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="male"
                          fill={CHART_COLORS.blue}
                          name="Male"
                        />
                        <Bar
                          dataKey="female"
                          fill={CHART_COLORS.purple}
                          name="Female"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4" />
                    <CardTitle>Urban vs Rural Reach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={urbanRuralData}
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
                          {urbanRuralData.map((entry, index) => (
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
            </div>
          </div>

          {/* Content Preferences */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">2. Content Preferences</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ChartBar className="h-4 w-4" />
                    <CardTitle>Top Genres by Audience Reach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genreReachData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="genre" type="category" />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="reach" fill={CHART_COLORS.green}>
                          <LabelList
                            position="right"
                            fill="#000"
                            formatter={(value) =>
                              `${(value / 1000).toFixed(0)}K`
                            }
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <CardTitle>Time of Day Audience Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timeOfDayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="viewers"
                          stroke={CHART_COLORS.orange}
                          fill={CHART_COLORS.orange + "80"}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Regional Analysis */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">3. Regional Analysis</h3>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  <CardTitle>Regional Viewership</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionHeatmapData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="reach" fill={CHART_COLORS.purple}>
                        <LabelList
                          position="top"
                          fill="#000"
                          formatter={(value) => `${(value / 1000).toFixed(0)}K`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Engagement */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">4. Platform Engagement</h3>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <CardTitle>Platform Engagement Rate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rate" fill={CHART_COLORS.red}>
                        <LabelList
                          position="top"
                          fill="#000"
                          formatter={(value) => `${value}%`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="mb-12 bg-card border p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-600/25 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Content Strategy
            </h3>
            <p className="text-foreground/75">
              Focus on developing more news and entertainment content, as these
              genres show the highest audience reach. Consider creating
              cross-genre programs that blend elements of news with
              entertainment to capture a wider audience.
            </p>
          </div>
          <div className="p-4 bg-emerald-600/25 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              Mobile Optimization
            </h3>
            <p className="text-foreground/75">
              Given the high engagement rate on mobile platforms, prioritize
              mobile-first content strategies. Develop short-form content and
              interactive features that cater to mobile users' preferences and
              viewing habits.
            </p>
          </div>
          <div className="p-4 bg-amber-600/25 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">
              Regional Content
            </h3>
            <p className="text-foreground/75">
              Increase content production tailored to the Bagmati region to
              capitalize on its high viewership. Additionally, create targeted
              content for underserved regions like Karnali and Sudurpashchim to
              boost engagement and expand the audience base.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="text-sm text-muted-foreground mt-8">
        <h2 className="text-lg font-semibold mb-2">Methodology</h2>
        <p>
          This report analyzes audience data collected through various digital
          platforms, traditional surveys, and viewership tracking systems. The
          data covers the most recent quarter and is compared against historical
          trends where applicable. All metrics are calculated based on a
          representative sample of our total audience across different regions
          and platforms.
        </p>
      </section>
    </div>
  );
};

export default AudienceDemographics;
