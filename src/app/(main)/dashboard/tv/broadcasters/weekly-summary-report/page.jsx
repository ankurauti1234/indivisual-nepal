"use client";

import {
  TrendingUp,
  Users,
  Tv,
  Share2,
  Map,
  BarChartIcon as ChartBar,
  Download,
  BarChart2,
  PieChartIcon,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChartCard from "@/components/card/charts-card";
import ReportLayout from "@/components/layout/report-layout";
import GenderDistributionChart from "./gender-distribution-chart";
import RatingTable from "./rating-table";
import ChannelShareChart from "./channel-share-pie";

const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--chart-2))",
  accent1: "hsl(var(--chart-3))",
  accent2: "hsl(var(--chart-4))",
  accent3: "hsl(var(--chart-5))",
  muted: "hsl(var(--chart-6))",
};

// Static data
const data = {
  topPrograms: [
  { "program_title": "Indreni: Nepal's Musical Extravaganza", "viewer_percentage": 18.5 },
  { "program_title": "Prime Time News Bulletin", "viewer_percentage": 16.2 },
  { "program_title": "Voice of Nepal: Singing Star", "viewer_percentage": 14.8 },
  { "program_title": "Bhunti: A Journey of Joy", "viewer_percentage": 12.5 },
  { "program_title": "Aanadi: Family Drama Series", "viewer_percentage": 11.3 },
  { "program_title": "Sakkigo Ni: Comedy Nights", "viewer_percentage": 10.1 },
  { "program_title": "Sidha Kura Janata Sanga: Public Voice", "viewer_percentage": 8.9 },
  { "program_title": "Janata Janna Chahanxa: Investigative Reports", "viewer_percentage": 7.5 },
  { "program_title": "Nepal Idol: The Ultimate Talent Hunt", "viewer_percentage": 6.3 },
  { "program_title": "Idea Studio: Innovate Nepal", "viewer_percentage": 5.1 }
],
  channelShares: [
    { channel_name: "Kantipur TV", share_percentage: 22 },
    { channel_name: "Nepal Television", share_percentage: 20 },
    { channel_name: "AP1 TV", share_percentage: 15 },
    { channel_name: "Himalaya TV", share_percentage: 13 },
    { channel_name: "News 24 Nepal", share_percentage: 11 },
    { channel_name: "Image Channel", share_percentage: 10 },
    { channel_name: "Avenues Television", share_percentage: 9 },
    { channel_name: "Sagarmatha Television", share_percentage: 4 },
    { channel_name: "ABC TV", share_percentage: 4 },
    { channel_name: "Prime TV", share_percentage: 4 },
  ],
"ageDistribution": [
    { "channel_name": "ABC TV", "age_group": "16-24", "percentage": 2.1 },
    { "channel_name": "ABC TV", "age_group": "25-34", "percentage": 1.2 },
    { "channel_name": "ABC TV", "age_group": "35-44", "percentage": 2.6 },
    { "channel_name": "ABC TV", "age_group": "45-59", "percentage": 2.0 },
    { "channel_name": "ABC TV", "age_group": "60+", "percentage": 0.6 },
    { "channel_name": "Avenues TV", "age_group": "16-24", "percentage": 3.7 },
    { "channel_name": "Avenues TV", "age_group": "25-34", "percentage": 5.9 },
    { "channel_name": "Avenues TV", "age_group": "35-44", "percentage": 9.9 },
    { "channel_name": "Avenues TV", "age_group": "45-59", "percentage": 8.0 },
    { "channel_name": "Avenues TV", "age_group": "60+", "percentage": 8.0 },
    { "channel_name": "AP1 TV", "age_group": "16-24", "percentage": 19.4 },
    { "channel_name": "AP1 TV", "age_group": "25-34", "percentage": 11.7 },
    { "channel_name": "AP1 TV", "age_group": "35-44", "percentage": 10.9 },
    { "channel_name": "AP1 TV", "age_group": "45-59", "percentage": 5.0 },
    { "channel_name": "AP1 TV", "age_group": "60+", "percentage": 2.5 },
    { "channel_name": "Himalayan TV", "age_group": "16-24", "percentage": 33.0 },
    { "channel_name": "Himalayan TV", "age_group": "25-34", "percentage": 30.1 },
    { "channel_name": "Himalayan TV", "age_group": "35-44", "percentage": 26.6 },
    { "channel_name": "Himalayan TV", "age_group": "45-59", "percentage": 29.1 },
    { "channel_name": "Himalayan TV", "age_group": "60+", "percentage": 35.0 },
    { "channel_name": "Image TV", "age_group": "16-24", "percentage": 5.8 },
    { "channel_name": "Image TV", "age_group": "25-34", "percentage": 12.1 },
    { "channel_name": "Image TV", "age_group": "35-44", "percentage": 12.8 },
    { "channel_name": "Image TV", "age_group": "45-59", "percentage": 11.0 },
    { "channel_name": "Image TV", "age_group": "60+", "percentage": 14.7 },
    { "channel_name": "Kantipur TV", "age_group": "16-24", "percentage": 51.8 },
    { "channel_name": "Kantipur TV", "age_group": "25-34", "percentage": 49.6 },
    { "channel_name": "Kantipur TV", "age_group": "35-44", "percentage": 52.6 },
    { "channel_name": "Kantipur TV", "age_group": "45-59", "percentage": 45.5 },
    { "channel_name": "Kantipur TV", "age_group": "60+", "percentage": 39.9 },
    { "channel_name": "Nepal Television", "age_group": "16-24", "percentage": 21.5 },
    { "channel_name": "Nepal Television", "age_group": "25-34", "percentage": 23.4 },
    { "channel_name": "Nepal Television", "age_group": "35-44", "percentage": 23.0 },
    { "channel_name": "Nepal Television", "age_group": "45-59", "percentage": 26.8 },
    { "channel_name": "Nepal Television", "age_group": "60+", "percentage": 17.8 },
    { "channel_name": "News 24 TV", "age_group": "16-24", "percentage": 8.4 },
    { "channel_name": "News 24 TV", "age_group": "25-34", "percentage": 11.3 },
    { "channel_name": "News 24 TV", "age_group": "35-44", "percentage": 13.9 },
    { "channel_name": "News 24 TV", "age_group": "45-59", "percentage": 13.4 },
    { "channel_name": "News 24 TV", "age_group": "60+", "percentage": 10.4 },
    { "channel_name": "Prime TV", "age_group": "16-24", "percentage": 5.2 },
    { "channel_name": "Prime TV", "age_group": "25-34", "percentage": 5.9 },
    { "channel_name": "Prime TV", "age_group": "35-44", "percentage": 7.7 },
    { "channel_name": "Prime TV", "age_group": "45-59", "percentage": 7.0 },
    { "channel_name": "Prime TV", "age_group": "60+", "percentage": 3.1 },
    { "channel_name": "Sagarmatha TV", "age_group": "16-24", "percentage": 3.1 },
    { "channel_name": "Sagarmatha TV", "age_group": "25-34", "percentage": 1.6 },
    { "channel_name": "Sagarmatha TV", "age_group": "35-44", "percentage": 2.6 },
    { "channel_name": "Sagarmatha TV", "age_group": "45-59", "percentage": 5.7 },
    { "channel_name": "Sagarmatha TV", "age_group": "60+", "percentage": 5.5 }
  ],
"regionDistribution": [
    { "channel_name": "ABC TV", "region": "Koshi", "percentage": 0.4 },
    { "channel_name": "ABC TV", "region": "Madhesh", "percentage": 4.0 },
    { "channel_name": "ABC TV", "region": "Bagmati", "percentage": 1.7 },
    { "channel_name": "ABC TV", "region": "Gandaki", "percentage": 3.9 },
    { "channel_name": "ABC TV", "region": "Lumbini", "percentage": 2.9 },
    { "channel_name": "ABC TV", "region": "Karnali", "percentage": 0.0 },
    { "channel_name": "ABC TV", "region": "Sudurpaschim", "percentage": 0.0 },
    { "channel_name": "Avenues TV", "region": "Koshi", "percentage": 4.7 },
    { "channel_name": "Avenues TV", "region": "Madhesh", "percentage": 6.9 },
    { "channel_name": "Avenues TV", "region": "Bagmati", "percentage": 9.9 },
    { "channel_name": "Avenues TV", "region": "Gandaki", "percentage": 0.0 },
    { "channel_name": "Avenues TV", "region": "Lumbini", "percentage": 8.3 },
    { "channel_name": "Avenues TV", "region": "Karnali", "percentage": 4.1 },
    { "channel_name": "Avenues TV", "region": "Sudurpaschim", "percentage": 11.0 },
    { "channel_name": "AP1 TV", "region": "Koshi", "percentage": 6.3 },
    { "channel_name": "AP1 TV", "region": "Madhesh", "percentage": 6.9 },
    { "channel_name": "AP1 TV", "region": "Bagmati", "percentage": 11.9 },
    { "channel_name": "AP1 TV", "region": "Gandaki", "percentage": 7.8 },
    { "channel_name": "AP1 TV", "region": "Lumbini", "percentage": 9.3 },
    { "channel_name": "AP1 TV", "region": "Karnali", "percentage": 10.2 },
    { "channel_name": "AP1 TV", "region": "Sudurpaschim", "percentage": 16.5 },
    { "channel_name": "Himalayan TV", "region": "Koshi", "percentage": 30.2 },
    { "channel_name": "Himalayan TV", "region": "Madhesh", "percentage": 16.8 },
    { "channel_name": "Himalayan TV", "region": "Bagmati", "percentage": 34.5 },
    { "channel_name": "Himalayan TV", "region": "Gandaki", "percentage": 34.0 },
    { "channel_name": "Himalayan TV", "region": "Lumbini", "percentage": 30.4 },
    { "channel_name": "Himalayan TV", "region": "Karnali", "percentage": 28.6 },
    { "channel_name": "Himalayan TV", "region": "Sudurpaschim", "percentage": 24.8 },
    { "channel_name": "Image TV", "region": "Koshi", "percentage": 11.4 },
    { "channel_name": "Image TV", "region": "Madhesh", "percentage": 3.0 },
    { "channel_name": "Image TV", "region": "Bagmati", "percentage": 15.5 },
    { "channel_name": "Image TV", "region": "Gandaki", "percentage": 12.6 },
    { "channel_name": "Image TV", "region": "Lumbini", "percentage": 11.3 },
    { "channel_name": "Image TV", "region": "Karnali", "percentage": 6.1 },
    { "channel_name": "Image TV", "region": "Sudurpaschim", "percentage": 6.4 },
    { "channel_name": "Kantipur TV", "region": "Koshi", "percentage": 53.7 },
    { "channel_name": "Kantipur TV", "region": "Madhesh", "percentage": 47.5 },
    { "channel_name": "Kantipur TV", "region": "Bagmati", "percentage": 54.4 },
    { "channel_name": "Kantipur TV", "region": "Gandaki", "percentage": 44.7 },
    { "channel_name": "Kantipur TV", "region": "Lumbini", "percentage": 44.1 },
    { "channel_name": "Kantipur TV", "region": "Karnali", "percentage": 18.4 },
    { "channel_name": "Kantipur TV", "region": "Sudurpaschim", "percentage": 40.4 },
    { "channel_name": "Nepal Television", "region": "Koshi", "percentage": 25.1 },
    { "channel_name": "Nepal Television", "region": "Madhesh", "percentage": 13.9 },
    { "channel_name": "Nepal Television", "region": "Bagmati", "percentage": 24.6 },
    { "channel_name": "Nepal Television", "region": "Gandaki", "percentage": 20.4 },
    { "channel_name": "Nepal Television", "region": "Lumbini", "percentage": 22.5 },
    { "channel_name": "Nepal Television", "region": "Karnali", "percentage": 8.2 },
    { "channel_name": "Nepal Television", "region": "Sudurpaschim", "percentage": 32.1 },
    { "channel_name": "News 24 TV", "region": "Koshi", "percentage": 3.9 },
    { "channel_name": "News 24 TV", "region": "Madhesh", "percentage": 10.9 },
    { "channel_name": "News 24 TV", "region": "Bagmati", "percentage": 12.4 },
    { "channel_name": "News 24 TV", "region": "Gandaki", "percentage": 16.5 },
    { "channel_name": "News 24 TV", "region": "Lumbini", "percentage": 16.2 },
    { "channel_name": "News 24 TV", "region": "Karnali", "percentage": 10.2 },
    { "channel_name": "News 24 TV", "region": "Sudurpaschim", "percentage": 17.4 },
    { "channel_name": "Prime TV", "region": "Koshi", "percentage": 5.1 },
    { "channel_name": "Prime TV", "region": "Madhesh", "percentage": 7.9 },
    { "channel_name": "Prime TV", "region": "Bagmati", "percentage": 6.4 },
    { "channel_name": "Prime TV", "region": "Gandaki", "percentage": 3.9 },
    { "channel_name": "Prime TV", "region": "Lumbini", "percentage": 6.9 },
    { "channel_name": "Prime TV", "region": "Karnali", "percentage": 6.1 },
    { "channel_name": "Prime TV", "region": "Sudurpaschim", "percentage": 6.4 },
    { "channel_name": "Sagarmatha TV", "region": "Koshi", "percentage": 3.9 },
    { "channel_name": "Sagarmatha TV", "region": "Madhesh", "percentage": 1.0 },
    { "channel_name": "Sagarmatha TV", "region": "Bagmati", "percentage": 2.8 },
    { "channel_name": "Sagarmatha TV", "region": "Gandaki", "percentage": 5.8 },
    { "channel_name": "Sagarmatha TV", "region": "Lumbini", "percentage": 3.4 },
    { "channel_name": "Sagarmatha TV", "region": "Karnali", "percentage": 4.1 },
    { "channel_name": "Sagarmatha TV", "region": "Sudurpaschim", "percentage": 6.4 }
  ]
};

const TopProgramsChart = () => {
  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Top Programs"
      description="Most watched programs across channels"
      chart={
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            accessibilityLayer
            data={data.topPrograms}
            layout="vertical"
            margin={{
              right: 48,
            }}
          >
            <YAxis
              type="category"
              hide
              dataKey="program_title"
              tickLine={true}
              axisLine={true}
            />
            <XAxis type="number" />
            <Tooltip />
            <Bar dataKey="viewer_percentage" fill={COLORS.primary} radius={16}>
              <LabelList
                dataKey="program_title"
                position="center"
                fontSize={14}
                fontWeight={700}
                fill="white"
              />
              <LabelList
                dataKey="viewer_percentage"
                position="right"
                fontSize={14}
                fontWeight={700}
                className="fill-foreground"
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Showing viewer percentage for top programs
        </p>
      }
    />
  );
};


const ChannelSharesChart = () => (
  <ChartCard
    icon={<PieChartIcon className="w-6 h-6" />}
    title="Channel Shares"
    description="Audience share distribution"
    chart={
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data.channelShares}
            dataKey="share_percentage"
            nameKey="channel_name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={160}
            label
            paddingAngle={5}
          >
           
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    }
    footer={
      <p className="text-sm text-gray-500">
        Channel audience share percentage distribution
      </p>
    }
  />
);

const AgeDistributionChart = () => {
  const processData = (data) => {
    const ageGroups = ["16-24", "25-34", "35-44", "45-59", "60+"];
    const channels = [...new Set(data.map((item) => item.channel_name))];

    const matrix = channels.map((channel) => {
      const channelData = {};
      channelData.channel = channel;

      ageGroups.forEach((age) => {
        const match = data.find(
          (d) => d.channel_name === channel && d.age_group === age
        );
        channelData[age] = match ? match.percentage : 0;
      });

      return channelData;
    });

    return matrix;
  };

  const matrix = processData(data.ageDistribution);
  const { min, max } = {
    min: Math.min(
      ...matrix.flatMap((item) =>
        Object.values(item).filter((v) => typeof v === "number")
      )
    ),
    max: Math.max(
      ...matrix.flatMap((item) =>
        Object.values(item).filter((v) => typeof v === "number")
      )
    ),
  };

  const getColor = (value) => {
    const normalizedValue = (value - min) / (max - min);
    const hue = 210;
    const saturation = 80;
    const lightness = 90 - normalizedValue * 60;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <ChartCard
      icon={<LayoutDashboard className="w-6 h-6" />}
      title="Age Distribution Heatmap"
      description="Viewer age demographics across channels"
      chart={
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="font-bold p-2">Channel</div>
              {["16-24", "25-34", "35-44", "45-59", "60+"].map((age) => (
                <div key={age} className="font-bold p-2 text-center">
                  {age}
                </div>
              ))}
            </div>

            {matrix.map((row, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-1 mb-1">
                <div className="py-5 font-medium text-center">
                  {row.channel}
                </div>
                {["16-24", "25-34", "35-44", "45-59", "60+"].map((age) => (
                  <div
                    key={age}
                    className="p-2 text-center transition-colors duration-200 rounded-lg"
                    style={{
                      backgroundColor: getColor(row[age]),
                      color:
                        row[age] > (max - min) / 2 + min ? "white" : "black",
                    }}
                  >
                    {row[age].toFixed(1)}%
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="text-sm">Lower</div>
              <div className="h-4 w-32 bg-gradient-to-r from-[hsl(210,80%,90%)] to-[hsl(210,80%,30%)]" />
              <div className="text-sm">Higher</div>
            </div>
          </div>
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Percentage of viewers by age group for each channel
        </p>
      }
    />
  );
};

const RegionDistributionChart = () => {
  const processData = (data) => {
    const regions = [
      "Koshi",
      "Madhesh",
      "Bagmati",
      "Gandaki",
      "Lumbini",
      "Karnali",
      "Sudurpaschim",
    ];
    const channels = [...new Set(data.map((item) => item.channel_name))];

    const matrix = channels.map((channel) => {
      const channelData = { channel_name: channel };

      regions.forEach((region) => {
        const match = data.find(
          (d) => d.channel_name === channel && d.region === region
        );
        channelData[region] = match ? match.percentage : 0;
      });

      return channelData;
    });

    return matrix;
  };

  const matrix = processData(data.regionDistribution);
  const { min, max } = {
    min: Math.min(
      ...matrix.flatMap((item) =>
        Object.values(item).filter((v) => typeof v === "number")
      )
    ),
    max: Math.max(
      ...matrix.flatMap((item) =>
        Object.values(item).filter((v) => typeof v === "number")
      )
    ),
  };

  const getColor = (value) => {
    const normalizedValue = (value - min) / (max - min);
    const hue = 32;
    const saturation = 90;
    const lightness = 90 - normalizedValue * 60;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <ChartCard
      icon={<LayoutDashboard className="w-6 h-6" />}
      title="Regional Distribution Heatmap"
      description="Viewer distribution by province across channels"
      chart={
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="font-bold p-2">Channel</div>
              {[
                "Koshi",
                "Madhesh",
                "Bagmati",
                "Gandaki",
                "Lumbini",
                "Karnali",
                "Sudurpaschim",
              ].map((region) => (
                <div key={region} className="font-bold p-2 text-center">
                  {region}
                </div>
              ))}
            </div>

            {matrix.map((row, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-1 mb-1">
                <div className="py-2 font-medium text-center">
                  {row.channel_name}
                </div>
                {[
                  "Koshi",
                  "Madhesh",
                  "Bagmati",
                  "Gandaki",
                  "Lumbini",
                  "Karnali",
                  "Sudurpaschim",
                ].map((region) => (
                  <div
                    key={region}
                    className="p-2 py-3  text-center transition-colors duration-200  rounded-lg"
                    style={{
                      backgroundColor: getColor(row[region]),
                      color:
                        row[region] > (max - min) / 2 + min ? "white" : "black",
                    }}
                  >
                    {row[region].toFixed(1)}%
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="text-sm">Lower</div>
              <div className="h-4 w-48 bg-gradient-to-r from-[hsl(32,90%,90%)] to-[hsl(32,90%,30%)]" />
              <div className="text-sm">Higher</div>
            </div>
          </div>
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Percentage of viewers by province for each channel
        </p>
      }
    />
  );
};



const DailySummary = () => {
  return (
    <ReportLayout
      title="Weekly Summary"
      description="Comprehensive analysis of channel performance, viewer behavior, and audience metrics"
      action={
        <div className="flex gap-4">
          <Button variant="outline" disabled>
            <Calendar className="mr-2 h-4 w-4" />
            Week 32
          </Button>
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
      <div className="space-y-8">
        {/* Key Findings */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Findings</h2>
          <div className="grid grid-cols-1 gap-8">
            {/* Channel Performance */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">1. Channel Performance</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* <ChannelRatingsChart /> */}
                <RatingTable/>
                <ChannelShareChart />
              </div>
            </div>

            {/* Audience Demographics */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                2. Audience Demographics
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <AgeDistributionChart />
                <GenderDistributionChart />
              </div>
            </div>

            {/* Regional Analysis */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">4. Regional Analysis</h3>
              <RegionDistributionChart />
            </div>

            {/* Top Programs */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">3. Top Programs</h3>
              <TopProgramsChart />
            </div>
          </div>
        </section>
      </div>
    </ReportLayout>
  );
};

export default DailySummary;
