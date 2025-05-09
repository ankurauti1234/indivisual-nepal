import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MarketingAnalyticsDashboard = () => {
  // Sample data structure organized by timeline
  const timelineData = [
    {
      time: "6:00",
      period: "Morning",
      "Tech-Apple-Social-Video": 400,
      "Tech-Apple-TV-Commercial": 0,
      "Tech-Microsoft-Digital-Static": 600,
      "Fashion-Nike-Social-Video": 500,
    },
    {
      time: "12:00",
      period: "Afternoon",
      "Tech-Apple-Social-Carousel": 300,
      "Tech-Microsoft-Digital-Static": 400,
      "Fashion-Nike-Social-Video": 300,
    },
    {
      time: "18:00",
      period: "Evening",
      "Tech-Apple-Social-Video": 800,
      "Tech-Apple-TV-Commercial": 1000,
      "Fashion-Nike-Social-Video": 900,
    },
    {
      time: "00:00",
      period: "Night",
      "Tech-Apple-Social-Carousel": 500,
      "Tech-Apple-TV-Commercial": 700,
      "Fashion-Nike-Social-Video": 600,
    },
  ];

  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedContent, setSelectedContent] = useState("All");

  // Extract unique values for filters
  const industries = ["All", "Tech", "Fashion"];
  const brands = ["All", "Apple", "Microsoft", "Nike"];
  const channels = ["All", "Social Media", "TV", "Digital Ads"];
  const contentTypes = ["All", "Video", "Carousel", "Commercial", "Static"];

  // Get filtered metrics based on selections
  const getFilteredMetrics = () => {
    const allMetrics = Object.keys(timelineData[0]).filter(
      (key) => key !== "time" && key !== "period"
    );

    return allMetrics.filter((metric) => {
      const [industry, brand, channel, content] = metric.split("-");
      return (
        (selectedIndustry === "All" || industry === selectedIndustry) &&
        (selectedBrand === "All" || brand === selectedBrand) &&
        (selectedChannel === "All" || channel === selectedChannel) &&
        (selectedContent === "All" || content === selectedContent)
      );
    });
  };

  // Generate lines for each filtered metric
  const getLines = () => {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F"];
    return getFilteredMetrics().map((metric, index) => (
      <Line
        key={metric}
        type="monotone"
        dataKey={metric}
        stroke={colors[index % colors.length]}
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />
    ));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name.split("-").join(" ")}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Marketing Analytics Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select Channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel} value={channel}>
                  {channel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedContent} onValueChange={setSelectedContent}>
            <SelectTrigger>
              <SelectValue placeholder="Select Content Type" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((content) => (
                <SelectItem key={content} value={content}>
                  {content}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" padding={{ left: 30, right: 30 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {getLines()}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingAnalyticsDashboard;
