"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  LineChart,
  Line,
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
  BarChartIcon as ChartBar,
  Download,
  Clock,
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
    <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
      <p className="font-medium text-gray-900">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color || CHART_COLORS.blue }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const DailySummary = () => {
  // Static data for demonstration
  const viewershipByHour = [
    { hour: "00:00", viewers: 50000 },
    { hour: "03:00", viewers: 30000 },
    { hour: "06:00", viewers: 100000 },
    { hour: "09:00", viewers: 200000 },
    { hour: "12:00", viewers: 180000 },
    { hour: "15:00", viewers: 220000 },
    { hour: "18:00", viewers: 350000 },
    { hour: "21:00", viewers: 400000 },
  ];

  const topPrograms = [
    { program: "Evening News", viewers: 400000, share: 20 },
    { program: "Morning Show", viewers: 250000, share: 12.5 },
    { program: "Primetime Drama", viewers: 350000, share: 17.5 },
    { program: "Afternoon Talk Show", viewers: 200000, share: 10 },
    { program: "Late Night Comedy", viewers: 150000, share: 7.5 },
  ];

  const channelShares = [
    { channel: "Channel A", share: 30 },
    { channel: "Channel B", share: 25 },
    { channel: "Channel C", share: 20 },
    { channel: "Channel D", share: 15 },
    { channel: "Others", share: 10 },
  ];

  const demographicData = [
    { age: "13-17", male: 5, female: 7 },
    { age: "18-24", male: 15, female: 18 },
    { age: "25-34", male: 20, female: 22 },
    { age: "35-44", male: 18, female: 20 },
    { age: "45-54", male: 12, female: 13 },
    { age: "55+", male: 10, female: 12 },
  ];

  const regionalViewership = [
    { region: "North", viewers: 300000 },
    { region: "South", viewers: 250000 },
    { region: "East", viewers: 200000 },
    { region: "West", viewers: 220000 },
    { region: "Central", viewers: 280000 },
  ];

  const deviceUsage = [
    { device: "TV", percentage: 60 },
    { device: "Mobile", percentage: 25 },
    { device: "Tablet", percentage: 10 },
    { device: "Desktop", percentage: 5 },
  ];

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900">Daily TV Summary</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
        <p className="mt-4 text-lg text-gray-600">
          Comprehensive analysis of today's viewership patterns, top programs,
          and audience engagement across all channels.
        </p>
      </div>

      {/* Key Metrics */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Total Viewership</h3>
            <p className="text-2xl font-bold text-blue-600">1.53M</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Peak Viewers</h3>
            <p className="text-2xl font-bold text-green-600">400K</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900">Avg. Watch Time</h3>
            <p className="text-2xl font-bold text-orange-600">2.5 hrs</p>
          </div>
        </div>
      </section>

      {/* Viewership Trends */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Viewership Trends</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <CardTitle>24-Hour Viewership Pattern</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewershipByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="viewers"
                    stroke={CHART_COLORS.blue}
                    fill={CHART_COLORS.blue}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Viewership peaks during prime time hours (18:00 - 22:00)
          </CardFooter>
        </Card>
      </section>

      {/* Top Programs */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Top Programs</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              <CardTitle>Most Watched Programs</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPrograms} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="program" type="category" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="viewers" fill={CHART_COLORS.green}>
                    <LabelList
                      dataKey="share"
                      position="right"
                      formatter={(value) => `${value}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Evening News leads with 20% market share
          </CardFooter>
        </Card>
      </section>

      {/* Channel Performance */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Channel Performance</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <CardTitle>Channel Market Share</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelShares}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill={CHART_COLORS.blue}
                    dataKey="share"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {channelShares.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(CHART_COLORS)[
                            index % Object.values(CHART_COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Channel A leads with 30% market share
          </CardFooter>
        </Card>
      </section>

      {/* Audience Demographics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Audience Demographics</h2>
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
                <BarChart data={demographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="male" fill={CHART_COLORS.blue} name="Male" />
                  <Bar
                    dataKey="female"
                    fill={CHART_COLORS.purple}
                    name="Female"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            25-34 age group shows highest engagement across both genders
          </CardFooter>
        </Card>
      </section>

      {/* Regional Viewership */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Regional Viewership</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              <CardTitle>Viewership by Region</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalViewership}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="viewers" fill={CHART_COLORS.orange}>
                    <LabelList
                      dataKey="viewers"
                      position="top"
                      formatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Northern region leads in viewership with 300K viewers
          </CardFooter>
        </Card>
      </section>

      {/* Device Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Device Usage</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tv className="h-4 w-4" />
              <CardTitle>Viewing Device Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill={CHART_COLORS.green}
                    dataKey="percentage"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {deviceUsage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(CHART_COLORS)[
                            index % Object.values(CHART_COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Traditional TV remains the primary viewing device at 60%, followed
            by mobile at 25%
          </CardFooter>
        </Card>
      </section>

      {/* Key Insights */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Peak Viewership
            </h3>
            <p className="text-gray-700">
              Viewership peaked at 400K during the 21:00 hour, coinciding with
              the Evening News broadcast.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">
              Top Program Performance
            </h3>
            <p className="text-gray-700">
              The Evening News captured 20% market share, indicating strong
              audience interest in current events.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">
              Demographic Trends
            </h3>
            <p className="text-gray-700">
              The 25-34 age group showed the highest engagement across both
              genders, suggesting a need for targeted content for this
              demographic.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology Note */}
      <section className="text-sm text-gray-500 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Methodology
        </h2>
        <p>
          This daily summary analyzes viewership data collected through digital
          platforms and traditional rating systems over the past 24 hours. All
          metrics are calculated based on real-time data and may be subject to
          minor adjustments as final numbers are verified.
        </p>
      </section>
    </div>
  );
};

export default DailySummary;
