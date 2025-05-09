import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Tv,
  Circle,
  Building2,
  Headphones,
  BarChart,
  Clock,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, href }) => (
  <Link href={href}>
    <Card className="group cursor-pointer h-full hover:bg-accent/5 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="p-2 bg-primary/10 rounded-lg w-fit">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300" />
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

const Feature = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2">
    <div className="p-1 bg-primary/10 rounded-lg">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm text-muted-foreground">{title}</span>
  </div>
);

const RadioPage = () => {
  const features = [
    { icon: BarChart, title: "Comprehensive analytics reports" },
    { icon: Clock, title: "Real-time data monitoring" },
  ];

  const cards = [
    {
      icon: Tv,
      title: "Broadcasters",
      description:
        "Access channel performance metrics and detailed audience insights",
      href: "/dashboard/radio/broadcasters",
    },
    {
      icon: Circle,
      title: "Advertisers",
      description:
        "Track campaign ROI and engagement with advanced analytics tools",
      href: "/dashboard/radio/ads",
    },
    {
      icon: Building2,
      title: "Brands",
      description: "Monitor brand visibility and analyze audience demographics",
      href: "/dashboard/radio/brands",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Radio Analytics
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Unlock powerful insights for broadcasters, advertisers, and brands
          with our comprehensive analytics platform.
        </p>
        <div className="flex flex-wrap gap-4">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <FeatureCard key={index} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            <CardTitle>Need Assistance?</CardTitle>
          </div>
          <CardDescription>
            Our support team is here to help you get the most out of your
            analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Contact us for personalized support or to discuss custom analytics
            solutions tailored to your needs.
          </p>
          <div className="flex gap-2">
            <Badge variant="secondary">support@example.com</Badge>
            <Badge variant="outline">24/7 Support</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadioPage;
