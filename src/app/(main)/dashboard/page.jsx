'use client'
import React, { useEffect } from "react";
import Link from "next/link";
import {
  Building,
  Target,
  Globe,
  TrendingUp,
  Radio,
  Tv,
  BarChart2,
  Users,
  Activity,
  ArrowUpRight,
  Newspaper,
  Smartphone,
  Hash,
  Share2,
  Mic2,
  PlayCircle,
  Rss,
  LineChart,
  PieChart,
  Award
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigationLinks = [
  {
    section: "Television",
    icon: Tv,
    links: [
      {
        href: "/dashboard/tv/broadcasters",
        label: "TV Broadcasters",
        description: "Channel performance and viewer engagement analytics",
        icon: Building,
        stats: { label: "Active Channels", value: "50+" },
      },
      {
        href: "/dashboard/tv/ads",
        label: "TV Advertising",
        description: "Campaign tracking and ROI measurement tools",
        icon: Target,
        stats: { label: "Active Campaigns", value: "120+" },
      },
      {
        href: "/dashboard/tv/programs",
        label: "Program Analytics",
        description: "Show ratings and audience demographics",
        icon: PlayCircle,
        stats: { label: "Programs Tracked", value: "450+" },
      },
    ],
  },
  {
    section: "Radio",
    icon: Radio,
    links: [
      {
        href: "/dashboard/radio/broadcasters",
        label: "Radio Stations",
        description: "Station metrics and listener engagement data",
        icon: Mic2,
        stats: { label: "Active Stations", value: "120+" },
      },
      {
        href: "/dashboard/radio/shows",
        label: "Show Analytics",
        description: "Show performance and listener demographics",
        icon: Rss,
        stats: { label: "Shows Tracked", value: "250+" },
      },
      {
        href: "/dashboard/radio/ads",
        label: "Radio Advertising",
        description: "Ad performance and audience reach analytics",
        icon: Target,
        stats: { label: "Live Campaigns", value: "95+" },
      },
    ],
  },
  {
    section: "Digital Media",
    icon: Smartphone,
    links: [
      {
        href: "/dashboard/digital/social",
        label: "Social Media",
        description: "Cross-platform social media engagement tracking",
        icon: Share2,
        stats: { label: "Platforms", value: "8" },
      },
      {
        href: "/dashboard/digital/streaming",
        label: "Streaming Analytics",
        description: "OTT and streaming platform performance metrics",
        icon: LineChart,
        stats: { label: "Services", value: "12+" },
      },
      {
        href: "/dashboard/digital/online",
        label: "Online News",
        description: "Digital news reach and engagement analytics",
        icon: Newspaper,
        stats: { label: "News Sites", value: "75+" },
      },
    ],
  },
];

const QuickStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[
      { icon: Users, label: "Total Daily Audience", value: "4.3M+" },
      { icon: Activity, label: "Platform Uptime", value: "99.9%" },
      { icon: PieChart, label: "Market Share", value: "32%" },
      { icon: TrendingUp, label: "YoY Growth", value: "24%" },
    ].map((stat, index) => (
      <Card key={index} className="border-none shadow-lg bg-card hover:bg-accent/5 transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const TrendingTopics = () => (
  <Card className="mb-10 border-none shadow-lg bg-card">
    <CardHeader>
      <CardTitle className="text-xl">Trending Topics</CardTitle>
      <CardDescription>Most discussed subjects across all media</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          { topic: "#WorldNews", mentions: "125K+", growth: "+25%" },
          { topic: "#Technology", mentions: "98K+", growth: "+15%" },
          { topic: "#Entertainment", mentions: "87K+", growth: "+32%" },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{item.topic}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{item.mentions} mentions</span>
              <span className="text-sm text-emerald-600">{item.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PerformanceHighlights = () => (
  <Card className="mb-10 border-none shadow-lg bg-card">
    <CardHeader>
      <CardTitle className="text-xl">Performance Highlights</CardTitle>
      <CardDescription>Top performing channels and campaigns</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[
          {
            title: "Evening News",
            metric: "2.1M viewers",
            platform: "Television",
            icon: Tv,
            trend: "+12%",
          },
          {
            title: "Morning Show",
            metric: "850K listeners",
            platform: "Radio",
            icon: Radio,
            trend: "+8%",
          },
          {
            title: "Digital Campaign",
            metric: "3.5M impressions",
            platform: "Social Media",
            icon: Share2,
            trend: "+18%",
          },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.platform}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{item.metric}</span>
              <span className="text-xs text-emerald-600">{item.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const NavigationSection = ({ section, icon: Icon, links }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 px-2">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground">{section}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {links.map((link, index) => (
        <Link key={index} href={link.href} className="block">
          <Card className="h-full border border-border/40 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <link.icon className="w-4 h-4 text-primary" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              <CardTitle className="text-lg mt-3 text-foreground">{link.label}</CardTitle>
              <CardDescription className="text-muted-foreground/90">{link.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{link.stats.value}</span>{" "}
                <span className="text-muted-foreground">{link.stats.label}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);

const DashboardPage = () => {

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/authentication");
    }
  }, [user, router]);

  if (!user) return null;


  return (
    <div className="min-h-screen bg-background">
      <div className=" flex justify-between bg-card items-center p-2 rounded-lg shadow-md">
        <h1 className="text-2xl font-medium">Welcome, {user.email}</h1>
        {/* <p className="mb-4">Your role: {user.role}</p> */}
        <Button onClick={logout}>Logout</Button>
      </div>
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Media Analytics Platform</h1>
          <p className="text-lg text-muted-foreground">Comprehensive insights across traditional and digital media channels</p>
        </div>

        {/* Quick Stats Overview */}
        <QuickStats />

        {/* Trending Topics */}
        <TrendingTopics />

        {/* Performance Highlights */}
        <PerformanceHighlights />

        {/* Navigation Sections */}
        <div className="space-y-10">
          {navigationLinks.map((section, index) => (
            <NavigationSection key={index} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;