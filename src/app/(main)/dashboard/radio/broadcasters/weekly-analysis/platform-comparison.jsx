import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
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
} from "recharts";
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
} from "lucide-react";

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

const PlatformComparison = () => {
  const [metric, setMetric] = useState("revenue");
  const [platformData, setPlatformData] = useState(generatePlatformData(metric));
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData(metric));
  const [audienceData] = useState(generateAudienceData());
  const insights = useMemo(() => generateInsights(metric), [metric]);

  const handleMetricChange = (value) => {
    setMetric(value);
    setPlatformData(generatePlatformData(value));
    setTimeSeriesData(generateTimeSeriesData(value));
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
        return <DollarSign className="w-5 h-5" />;
      case "engagement":
        return <Users className="w-5 h-5" />;
      case "adCount":
        return <Radio className="w-5 h-5" />;
      case "retention":
        return <Activity className="w-5 h-5" />;
      case "satisfaction":
        return <Award className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 backdrop-blur-lg bg-opacity-90">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {getMetricIcon()}
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Platform Analytics</h1>
                <p className="text-gray-500">Comprehensive performance insights</p>
              </div>
            </div>
            <Select value={metric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-[200px] bg-gray-50">
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Top Platform
              </CardTitle>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-semibold">{insights.topPlatform}</div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Growth Rate
              </CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-semibold text-green-500">
                  {insights.growth}
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Risk Factor
              </CardTitle>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <div className="text-lg font-medium">{insights.risk}</div>
              </div>
            </CardHeader>
          </Card>
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-sm font-medium text-gray-500">
                Opportunity
              </CardTitle>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <div className="text-lg font-medium">{insights.opportunity}</div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Performance Trends</CardTitle>
              <CardDescription>6-month comparison across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatValue(value, metric)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="analog"
                    name="Analog"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="digital"
                    name="Digital"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="youtube"
                    name="YouTube"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audience Demographics */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Audience Demographics</CardTitle>
              <CardDescription>Age distribution by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={audienceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="analog" name="Analog" fill="#8884d8" stackId="a" />
                  <Bar dataKey="digital" name="Digital" fill="#82ca9d" stackId="a" />
                  <Bar dataKey="youtube" name="YouTube" fill="#ffc658" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="col-span-2 bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Platform Analysis</CardTitle>
              <CardDescription>Comprehensive metrics comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Current {metric}</TableHead>
                    <TableHead>Growth Rate</TableHead>
                    <TableHead>Audience Share</TableHead>
                    <TableHead>Peak Performance</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Radio className="w-4 h-4" />
                      Analog Radio
                    </TableCell>
                    <TableCell>{formatValue(platformData[0][metric], metric)}</TableCell>
                    <TableCell className="text-green-500">+12%</TableCell>
                    <TableCell>35%</TableCell>
                    <TableCell>Morning</TableCell>
                    <TableCell><TrendingUp className="w-4 h-4 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Digital Radio
                    </TableCell>
                    <TableCell>{formatValue(platformData[1][metric], metric)}</TableCell>
                    <TableCell className="text-green-500">+18%</TableCell>
                    <TableCell>40%</TableCell>
                    <TableCell>Evening</TableCell>
                    <TableCell><TrendingUp className="w-4 h-4 text-green-500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                      YouTube
                    </TableCell>
                    <TableCell>{formatValue(platformData[2][metric], metric)}</TableCell>
                    <TableCell className="text-green-500">+24%</TableCell>
                    <TableCell>25%</TableCell>
                    <TableCell>Night</TableCell>
                    <TableCell><TrendingUp className="w-4 h-4 text-green-500" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recommendations and Insights */}
          <Card className="col-span-2 bg-white shadow-sm hover:shadow-md transition-shadow backdrop-blur-lg bg-opacity-90">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Strategic Insights</CardTitle>
              <CardDescription>Data-driven recommendations and forecasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
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
                      <span>{insights.recommendation}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-green-100 p-1 mt-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <span>Focus on {insights.topPlatform} growth</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-yellow-100 p-1 mt-1">
                        <Users className="w-4 h-4 text-yellow-500" />
                      </div>
                      <span>Expand audience engagement initiatives</span>
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
                      <div className="flex justify-between text-sm mb-1">
                        <span>Growth Trajectory</span>
                        <span className="text-green-500">{insights.growth}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${parseInt(insights.growth)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Share</span>
                        <span className="text-blue-500">45%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span className="text-yellow-500">92%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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

export default PlatformComparison;