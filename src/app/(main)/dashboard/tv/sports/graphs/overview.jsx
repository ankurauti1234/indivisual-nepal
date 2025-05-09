"use client";

import { Card, CardContent } from "@/components/ui/card";

const data = [
  {
    name: "Total Brand Detections",
    stat: "24,876",
    description: "Sum of all logo/audio appearances"
  },
  {
    name: "Top Sector by Exposure",
    stat: "Beverages",
    description: "42% of total exposure time"
  },
  {
    name: "Most Aggressive Brand",
    stat: "SportTech",
    description: "186 appearances, 42min total"
  },
  {
    name: "Prime Time Dominance",
    stat: "68.3%",
    description: "Ads during peak match hours"
  },
  {
    name: "Highest Visibility Placement",
    stat: "Sideline Boards",
    description: "73% viewership retention"
  },
  {
    name: "Tournament Reach Estimate",
    stat: "1.2B",
    description: "Projected audience exposure"
  },
];

export default function Overview() {
  return (
    <div className="flex items-center justify-center p-6 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {data.map((item) => (
          <Card key={item.name} className="p-4 py-3">
            <CardContent className="p-0">
              <dt className="text-sm font-medium text-muted-foreground">
                {item.name}
              </dt>
              <dd className="mt-2">
                <span className="text-2xl font-semibold text-foreground">
                  {item.stat}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </dd>
            </CardContent>
          </Card>
        ))}
      </dl>
    </div>
  );
}