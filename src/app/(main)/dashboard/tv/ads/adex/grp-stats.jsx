import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Users } from "lucide-react";

const GRPStats = () => {
  const calculateTopSector = () => ({
    name: "FMCG",
    value: "150 GRPs",
    change: "+12.5%",
  });

  const calculateEfficientCategory = () => ({
    name: "Mobile Services",
    value: "₹850/GRP",
    change: "-15%",
  });

  const calculateTopAdvertiser = () => ({
    name: "TechCorp Inc.",
    value: "₹45.2M",
    change: "+8.3%",
  });

  const stats = [
    {
      title: "Top Sector by GRP",
      metric: calculateTopSector(),
      icon: TrendingUp,
      description: "Based on total GRP delivery",
    },
    {
      title: "Most Cost-Efficient Category",
      metric: calculateEfficientCategory(),
      icon: Award,
      description: "Lowest cost per GRP",
    },
    {
      title: "Highest Spending Advertiser",
      metric: calculateTopAdvertiser(),
      icon: Users,
      description: "By total media investment",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="group relative rounded-3xl overflow-hidden border-none bg-gradient-to-br from-background to-muted/50 hover:shadow-xl transition-all duration-300 ease-in-out"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <div className="p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                <stat.icon className="h-4 w-4 text-primary/80" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-semibold tracking-tight text-foreground">
                  {stat.metric.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl text-muted-foreground font-medium">
                    {stat.metric.value}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.metric.change.startsWith("+")
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {stat.metric.change}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/80 font-medium">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GRPStats;
