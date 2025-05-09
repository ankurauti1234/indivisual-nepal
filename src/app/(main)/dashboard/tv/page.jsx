import React from "react";
import Link from "next/link";
import {
  Tv,
  Target,
  Building,
  Activity,
  BarChart2,
  Clock,
  Users,
  TrendingUp,
  Signal,
  Share2,
  PieChart,
  PlayCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const FeatureCard = ({ icon: Icon, title, description, href, metrics }) => (
  <Link href={href}>
    <Card className="h-full border border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </div>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              <span className="text-sm text-muted-foreground">{metric}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </Link>
);

const StatCard = ({ icon: Icon, value, label, trend }) => (
  <Card className="border-none shadow-lg bg-card hover:bg-accent/5 transition-colors">
    <CardContent className="pt-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            {trend && (
              <span className="text-sm font-medium text-emerald-500">
                {trend}
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {label}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PerformanceCard = ({ title, metrics }) => (
  <Card className="border-none shadow-lg">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {metric.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{metric.value}</span>
              <span
                className={`text-sm ${
                  metric.trend.includes("+")
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TelevisionPage = () => {
  const stats = [
    { icon: Users, value: "2.5M+", label: "Daily Viewers", trend: "+12%" },
    { icon: BarChart2, value: "50+", label: "Active Channels", trend: "+5" },
    { icon: Activity, value: "98%", label: "Platform Uptime" },
    {
      icon: Signal,
      value: "99.9%",
      label: "Broadcast Quality",
      trend: "+0.5%",
    },
  ];

  const features = [
    {
      icon: Building,
      title: "TV Broadcasters",
      description: "Comprehensive channel performance and audience analytics",
      href: "/dashboard/tv/broadcasters",
      metrics: [
        "Real-time Viewer Analytics",
        "Content Performance Tracking",
        "Audience Demographic Analysis",
        "Programming Schedule Optimization",
      ],
    },
    {
      icon: Target,
      title: "TV Advertisers",
      description: "Advanced campaign tracking and audience targeting",
      href: "/dashboard/tv/ads",
      metrics: [
        "Campaign Performance Metrics",
        "Audience Reach & Engagement",
        "ROI & Conversion Analysis",
        "Cross-channel Attribution",
      ],
    },
    {
      icon: Share2,
      title: "Brand Intelligence",
      description: "Competitive analysis and brand share insights",
      href: "/dashboard/tv/brands",
      metrics: [
        "Brand Share Analysis",
        "Competitor Tracking",
        "Industry Trends",
        "Regional Performance",
      ],
    },
  ];

  const performanceMetrics = [
    {
      title: "Channel Performance",
      metrics: [
        { label: "Prime Time Rating", value: "4.8", trend: "+0.3" },
        { label: "Average View Duration", value: "45m", trend: "+5m" },
        { label: "Ad Revenue", value: "$1.2M", trend: "+8%" },
        { label: "Content Engagement", value: "85%", trend: "+2%" },
      ],
    },
    {
      title: "Audience Insights",
      metrics: [
        { label: "Age 18-34", value: "38%", trend: "+5%" },
        { label: "Age 35-54", value: "45%", trend: "-2%" },
        { label: "Digital Viewers", value: "1.2M", trend: "+15%" },
        { label: "Social Engagement", value: "250K", trend: "+12%" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Television Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time insights and analytics for broadcast media performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {performanceMetrics.map((section, index) => (
            <PerformanceCard key={index} {...section} />
          ))}
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TelevisionPage;
