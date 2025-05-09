import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Radio,
  Youtube,
  Smartphone,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  Award,
  TrendingDown,
  Zap,
  Activity,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Enhanced data generation with more metrics
const generatePlatformData = (metric) => {
  const platforms = ["Analog Radio", "Digital Radio", "YouTube"];
  const baseValues = {
    revenue: [15000, 25000, 35000],
    engagement: [2000, 4000, 8000],
    adCount: [150, 200, 250],
    retention: [75, 85, 90],
    satisfaction: [82, 88, 92],
  };

  return platforms.map((platform, index) => ({
    platform,
    [metric]: baseValues[metric]?.[index] + Math.floor(Math.random() * 5000) || Math.floor(Math.random() * 100),
    growth: Math.floor(Math.random() * 20) + 5,
    audienceShare: [35, 40, 25][index],
    peakPerformance: ["Morning", "Evening", "Night"][index],
  }));
};

const generateTimeSeriesData = (metric) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseValues = {
    revenue: [12000, 15000, 18000],
    engagement: [1500, 2000, 2500],
    adCount: [120, 150, 180],
    retention: [70, 80, 85],
    satisfaction: [80, 85, 90],
  };

  return months.map((month) => ({
    month,
    analog: baseValues[metric]?.[0] + Math.floor(Math.random() * 3000) || Math.floor(Math.random() * 100),
    digital: baseValues[metric]?.[1] + Math.floor(Math.random() * 4000) || Math.floor(Math.random() * 100),
    youtube: baseValues[metric]?.[2] + Math.floor(Math.random() * 5000) || Math.floor(Math.random() * 100),
  }));
};

const generateAudienceData = () => {
  return [
    { age: "18-24", analog: 15, digital: 25, youtube: 60 },
    { age: "25-34", analog: 20, digital: 35, youtube: 45 },
    { age: "35-44", analog: 30, digital: 40, youtube: 30 },
    { age: "45-54", analog: 40, digital: 35, youtube: 25 },
    { age: "55+", analog: 50, digital: 30, youtube: 20 },
  ];
};

const generateInsights = (metric) => {
  const insights = {
    revenue: {
      topPlatform: "YouTube",
      growth: "+24%",
      forecast: "Upward trend expected",
      recommendation: "Increase YouTube ad inventory",
      risk: "Market saturation",
      opportunity: "Premium content monetization",
    },
    engagement: {
      topPlatform: "Digital Radio",
      growth: "+18%",
      forecast: "Steady growth",
      recommendation: "Focus on interactive content",
      risk: "Platform fragmentation",
      opportunity: "Social media integration",
    },
    adCount: {
      topPlatform: "Analog Radio",
      growth: "+15%",
      forecast: "Stable performance",
      recommendation: "Optimize ad scheduling",
      risk: "Ad fatigue",
      opportunity: "Dynamic pricing",
    },
    retention: {
      topPlatform: "YouTube",
      growth: "+12%",
      forecast: "Improving",
      recommendation: "Enhance content quality",
      risk: "Platform competition",
      opportunity: "Loyalty programs",
    },
    satisfaction: {
      topPlatform: "Digital Radio",
      growth: "+10%",
      forecast: "Positive trend",
      recommendation: "Personalization features",
      risk: "Technical issues",
      opportunity: "AI-driven recommendations",
    },
  };
  return insights[metric];
};

const PlatformComparisonTable = () => {
  const [metric, setMetric] = useState("revenue");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ section: null, key: null, direction: "asc" });
  const [platformData, setPlatformData] = useState(generatePlatformData(metric));
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData(metric));
  const [audienceData] = useState(generateAudienceData());
  const insights = useMemo(() => generateInsights(metric), [metric]);

  const handleMetricChange = (value) => {
    setMetric(value);
    setPlatformData(generatePlatformData(value));
    setTimeSeriesData(generateTimeSeriesData(value));
    setSearchTerm(""); // Reset search when metric changes
    setSortConfig({ section: null, key: null, direction: "asc" }); // Reset sort
  };

  const formatValue = (value, metricType) => {
    switch (metricType) {
      case "revenue":
        return `$${value.toLocaleString()}`;
      case "engagement":
        return `${value.toLocaleString()} interactions`;
      case "adCount":
        return `${value.toLocaleString()} ads`;
      case "retention":
        return `${value}%`;
      case "satisfaction":
        return `${value}%`;
      default:
        return value;
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case "revenue":
        return <DollarSign className="w-5 h-5 text-primary" />;
      case "engagement":
        return <Users className="w-5 h-5 text-primary" />;
      case "adCount":
        return <Radio className="w-5 h-5 text-primary" />;
      case "retention":
        return <Activity className="w-5 h-5 text-primary" />;
      case "satisfaction":
        return <Award className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const requestSort = (section, key) => {
    setSortConfig((prev) => ({
      section,
      key,
      direction:
        prev.section === section && prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedData = (data, section) => {
    if (sortConfig.section !== section || !sortConfig.key) return data;

    const sortableData = [...data];
    sortableData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sortableData;
  };

  // Filter and sort data
  const filteredTimeSeriesData = useMemo(() => {
    const data = timeSeriesData.filter((item) =>
      item.month.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return getSortedData(data, "timeSeries");
  }, [timeSeriesData, searchTerm, sortConfig]);

  const filteredAudienceData = useMemo(() => {
    const data = audienceData.filter((item) =>
      item.age.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return getSortedData(data, "audience");
  }, [audienceData, searchTerm, sortConfig]);

  const filteredPlatformData = useMemo(() => {
    const data = platformData.filter((item) =>
      item.platform.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return getSortedData(data, "platform");
  }, [platformData, searchTerm, sortConfig]);

  const platformColors = {
    Analog: "#8884d8",
    Digital: "#82ca9d",
    YouTube: "#ffc658",
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <Card className="bg-card shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">{getMetricIcon()}</div>
              <div>
                <h1 className="text-3xl font-semibold text-foreground">Platform Analytics</h1>
                <p className="text-muted-foreground">Comprehensive performance insights</p>
              </div>
            </div>
            <Select value={metric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full sm:w-60 bg-background border-muted">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="adCount">Ad Count</SelectItem>
                <SelectItem value="retention">Retention Rate</SelectItem>
                <SelectItem value="satisfaction">Satisfaction Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Platform
              </CardTitle>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-semibold text-foreground">{insights.topPlatform}</div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Growth Rate
              </CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-semibold text-green-500">{insights.growth}</div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Risk Factor
              </CardTitle>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div className="text-lg font-medium text-foreground">{insights.risk}</div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-card shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Opportunity
              </CardTitle>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <div className="text-lg font-medium text-foreground">{insights.opportunity}</div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Performance Trends
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  6-month comparison across platforms
                </CardDescription>
              </div>
              <Input
                placeholder="Search months..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 bg-background border-muted"
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("timeSeries", "month")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Month
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("timeSeries", "analog")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Analog
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("timeSeries", "digital")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Digital
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("timeSeries", "youtube")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          YouTube
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimeSeriesData.map((item, index) => (
                      <TableRow
                        key={item.month}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="font-medium">{item.month}</TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.analog ? `${platformColors.Analog}40` : "transparent",
                            color: item.analog ? "#fff" : "text-foreground",
                          }}
                        >
                          {formatValue(item.analog, metric)}
                        </TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.digital ? `${platformColors.Digital}40` : "transparent",
                            color: item.digital ? "#fff" : "text-foreground",
                          }}
                        >
                          {formatValue(item.digital, metric)}
                        </TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.youtube ? `${platformColors.YouTube}40` : "transparent",
                            color: item.youtube ? "#fff" : "text-foreground",
                          }}
                        >
                          {formatValue(item.youtube, metric)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap gap-3 justify-center p-6">
                {Object.entries(platformColors).map(([platform, color]) => (
                  <div key={platform} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-foreground">{platform}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Demographics */}
          <Card className="bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Audience Demographics
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Age distribution by platform
                </CardDescription>
              </div>
              <Input
                placeholder="Search age groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 bg-background border-muted"
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("audience", "age")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Age Group
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("audience", "analog")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Analog
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("audience", "digital")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Digital
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("audience", "youtube")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          YouTube
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudienceData.map((item, index) => (
                      <TableRow
                        key={item.age}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="font-medium">{item.age}</TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.analog ? `${platformColors.Analog}40` : "transparent",
                            color: item.analog ? "#fff" : "text-foreground",
                          }}
                        >
                          {item.analog}%
                        </TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.digital ? `${platformColors.Digital}40` : "transparent",
                            color: item.digital ? "#fff" : "text-foreground",
                          }}
                        >
                          {item.digital}%
                        </TableCell>
                        <TableCell
                          className="text-center"
                          style={{
                            backgroundColor: item.youtube ? `${platformColors.YouTube}40` : "transparent",
                            color: item.youtube ? "#fff" : "text-foreground",
                          }}
                        >
                          {item.youtube}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-wrap gap-3 justify-center p-6">
                {Object.entries(platformColors).map(([platform, color]) => (
                  <div key={platform} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-foreground">{platform}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Analysis */}
          <Card className="col-span-1 lg:col-span-2 bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Platform Analysis
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Comprehensive metrics comparison
                </CardDescription>
              </div>
              <Input
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-60 bg-background border-muted"
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("platform", "platform")}
                          className="flex items-center gap-2 text-foreground"
                        >
                          Platform
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("platform", metric)}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Current {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("platform", "growth")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Growth Rate
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("platform", "audienceShare")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Audience Share
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("platform", "peakPerformance")}
                          className="flex items-center gap-2 mx-auto text-foreground"
                        >
                          Peak Performance
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlatformData.map((item, index) => (
                      <TableRow
                        key={item.platform}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                      >
                        <TableCell className="flex items-center gap-2">
                          {item.platform === "Analog Radio" && <Radio className="w-4 h-4" />}
                          {item.platform === "Digital Radio" && (
                            <Smartphone className="w-4 h-4" />
                          )}
                          {item.platform === "YouTube" && <Youtube className="w-4 h-4" />}
                          {item.platform}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatValue(item[metric], metric)}
                        </TableCell>
                        <TableCell className="text-center text-green-500">
                          +{item.growth}%
                        </TableCell>
                        <TableCell className="text-center">{item.audienceShare}%</TableCell>
                        <TableCell className="text-center">{item.peakPerformance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Insights */}
          <Card className="col-span-1 lg:col-span-2 bg-card shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-muted/50 p-6">
              <CardTitle className="text-lg font-bold text-foreground">
                Strategic Insights
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Data-driven recommendations and forecasts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    Key Recommendations
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-100 p-1 mt-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                      <span className="text-foreground">{insights.recommendation}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-foreground">Focus on {insights.topPlatform} growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-yellow-100 p-1 mt-1">
                        <Users className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span className="text-foreground">Expand audience engagement initiatives</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-foreground">
                        <span>Growth Trajectory</span>
                        <span className="text-green-500">{insights.growth}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${parseInt(insights.growth)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-foreground">
                        <span>Market Share</span>
                        <span className="text-blue-500">45%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1 text-foreground">
                        <span>Customer Satisfaction</span>
                        <span className="text-yellow-500">92%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: "92%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Future Outlook
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-700 mb-2">Forecast</h4>
                      <p className="text-orange-600">{insights.forecast}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-700 mb-2">Risk Factors</h4>
                      <p className="text-red-600">{insights.risk}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">Opportunities</h4>
                      <p className="text-green-600">{insights.opportunity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlatformComparisonTable;