"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "recharts";
import {
  Download,
  TrendingUp,
  DollarSign,
  Clock,
  Tv,
  Users,
  AlertTriangle,
  Zap,
  Calendar,
  LineChartIcon,
  Table2,
  BarChart2,
} from "lucide-react";
import ChartCard from "@/components/card/charts-card";
import IndustryAdvertiserPieChart from "./ad-distribution-pie";
import GenreRevenuePieChart from "./genre-revenue-pie";
import ReportLayout from "@/components/layout/report-layout";

// Mock data (replace with actual data in a real application)
const revenueData = [
  { month: "Jan", revenue: 1200000 },
  { month: "Feb", revenue: 1350000 },
  { month: "Mar", revenue: 1500000 },
  { month: "Apr", revenue: 1400000 },
  { month: "May", revenue: 1600000 },
  { month: "Jun", revenue: 1800000 },
  { month: "Jul", revenue: 2000000 },
  { month: "Aug", revenue: 2200000 },
  { month: "Sep", revenue: 2100000 },
  { month: "Oct", revenue: 2300000 },
  { month: "Nov", revenue: 2500000 },
  { month: "Dec", revenue: 2700000 },
];

const genreRevenueData = [
  { genre: "News", revenue: 5000000 },
  { genre: "Entertainment", revenue: 7000000 },
  { genre: "Sports", revenue: 6000000 },
  { genre: "Drama", revenue: 4500000 },
  { genre: "Documentary", revenue: 2500000 },
];

const timeSlotRevenueData = [
  { slot: "Morning (6AM-12PM)", revenue: 4000000 },
  { slot: "Afternoon (12PM-6PM)", revenue: 5500000 },
  { slot: "Prime Time (6PM-10PM)", revenue: 9000000 },
  { slot: "Late Night (10PM-6AM)", revenue: 3500000 },
];

const topAdvertisers = [
  { name: "Nepal Telecom", spend: 1500000 },
  { name: "Ncell", spend: 1300000 },
  { name: "Coca-Cola", spend: 1100000 },
  { name: "Dabur Nepal", spend: 900000 },
  { name: "Unilever Nepal", spend: 800000 },
];

const industryDistribution = [
  { industry: "Telecom", percentage: 25 },
  { industry: "FMCG", percentage: 30 },
  { industry: "Banking", percentage: 15 },
  { industry: "Automotive", percentage: 10 },
  { industry: "E-commerce", percentage: 12 },
  { industry: "Others", percentage: 8 },
];

const topAdvertisersByGenre = [
  { genre: "News", advertiser: "Nepal Telecom", spend: 800000 },
  { genre: "Entertainment", advertiser: "Coca-Cola", spend: 750000 },
  { genre: "Sports", advertiser: "Ncell", spend: 700000 },
  { genre: "Drama", advertiser: "Unilever Nepal", spend: 500000 },
  { genre: "Documentary", advertiser: "Dabur Nepal", spend: 300000 },
];

const topPerformingPrograms = [
  { name: "Prime Time News", revenue: 1200000 },
  { name: "Nepal Idol", revenue: 1000000 },
  { name: "Weekend Movie Special", revenue: 900000 },
  { name: "Morning Show", revenue: 800000 },
  { name: "Sports Highlights", revenue: 750000 },
];

const underperformingPrograms = [
  { name: "Late Night Talk Show", revenue: 200000, potentialRevenue: 400000 },
  { name: "Afternoon Drama", revenue: 300000, potentialRevenue: 500000 },
  { name: "Weekend Documentary", revenue: 150000, potentialRevenue: 300000 },
];

const keyEvents = [
  { event: "New Year's Eve", revenue: 500000, normalRevenue: 200000 },
  { event: "Dashain Festival", revenue: 800000, normalRevenue: 300000 },
  { event: "Cricket World Cup Final", revenue: 1000000, normalRevenue: 400000 },
];

const futureEvents = [
  { event: "Tihar Festival", projectedRevenue: 700000, normalRevenue: 300000 },
  {
    event: "National Elections",
    projectedRevenue: 900000,
    normalRevenue: 400000,
  },
  {
    event: "Nepal vs India Cricket Match",
    projectedRevenue: 600000,
    normalRevenue: 250000,
  },
];

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const RevenueInsights = () => {
  const [timeFrame, setTimeFrame] = useState("Monthly");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          <p>{`Revenue: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ReportLayout
      title="Revenue Insights"
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
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 gap-8">
          {/* Revenue Trends */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">1. Revenue Trends</h3>

            <ChartCard
              icon={<LineChartIcon className="w-6 h-6" />}
              title="Revenue Trends"
              // description="View GRP of ads across 4 breaks for different TV channels."
              chart={
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={revenueData}
                    margin={{
                      left: 36,
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
                    {/* <Legend /> */}
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={CHART_COLORS[0]}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              }
              footer={
                <p className="text-sm text-gray-500">
                  This line graph shows an increase in revenue over the months,
                  indicating a positive growth trend.
                </p>
              }
            />
          </div>

          {/* Revenue by Genre and Time Slot */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              2. Revenue by Genre and Industry Distribution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GenreRevenuePieChart />
              <IndustryAdvertiserPieChart />
            </div>
          </div>

          {/* Top Advertisers and Industry Distribution */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">3. Top Advertisers</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                icon={<Table2 className="w-6 h-6" />}
                title="Top Advertisers"
                description="Percentage of Total Revenue"
                chart={
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Advertiser</TableHead>
                        <TableHead>Spend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topAdvertisers.map((advertiser, index) => (
                        <TableRow key={index}>
                          <TableCell>{advertiser.name}</TableCell>
                          <TableCell>
                            ${advertiser.spend.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Top Advertisers Last Year
                  </p>
                }
              />
            </div>
          </div>

          {/* Top and Underperforming Programs */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              4. Top and Underperforming Programs
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Top Performing Programs"
                description="Most performing channels this year"
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topPerformingPrograms} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                      <XAxis
                        type="number"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickCount={3}
                        fontSize={12}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={120}
                        fontSize={12}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        radius={16}
                        dataKey="revenue"
                        fill={CHART_COLORS[2]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Top-performing programs, with "Prime Time News" leading the
                    list, generating the highest revenue.
                  </p>
                }
              />

              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Underperforming Programs"
                description="low performing programms this year"
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={underperformingPrograms}
                      layout="vertical"
                      margin={16}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                      <XAxis
                        type="number"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickCount={3}
                        fontSize={12}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={120}
                        fontSize={12}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        radius={16}
                        dataKey="revenue"
                        fill={CHART_COLORS[3]}
                        name="Current Revenue"
                      />
                      <Bar
                        radius={16}
                        dataKey="potentialRevenue"
                        fill={CHART_COLORS[4]}
                        name="Potential Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Least-performing programs, with "Weekend Documentary"
                  </p>
                }
              />
            </div>
          </div>

          {/* Event-based Revenue Analysis */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              5. Event-based Revenue Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Revenue Spikes During Key Events"
                // description="Most performing channels this year"
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={keyEvents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="event"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickCount={3}
                        fontSize={12}
                        width={120}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        radius={16}
                        dataKey="revenue"
                        fill={CHART_COLORS[5]}
                        name="Event Revenue"
                      />
                      <Bar
                        radius={16}
                        dataKey="normalRevenue"
                        fill={CHART_COLORS[0]}
                        name="Normal Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Most revenue making channles during on going events
                  </p>
                }
              />

              <ChartCard
                icon={<BarChart2 className="w-6 h-6" />}
                title="Projected Revenue for Future Events"
                // description="Most performing channels this year"
                chart={
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={futureEvents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="event"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickCount={3}
                        fontSize={12}
                        width={120}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        radius={16}
                        dataKey="projectedRevenue"
                        fill={CHART_COLORS[1]}
                        name="Projected Event Revenue"
                      />
                      <Bar
                        radius={16}
                        dataKey="normalRevenue"
                        fill={CHART_COLORS[2]}
                        name="Normal Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                }
                footer={
                  <p className="text-sm text-gray-500">
                    Most revenue making channles during on going events
                  </p>
                }
              />
            </div>
          </div>
        </div>
      </section>
    </ReportLayout>
  );
};

export default RevenueInsights;
