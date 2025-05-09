import React, { useState } from "react";
import { Radio, Volume2, Waves } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const RadioAdBarChart = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = [
    { station: "Radio City FM", avgAds: 156, color: "#3B82F6" },
    { station: "Radio Mirchi", avgAds: 142, color: "#6366F1" },
    { station: "Red FM", avgAds: 128, color: "#8B5CF6" },
    { station: "Big FM", avgAds: 115, color: "#A855F7" },
    { station: "Rainbow FM", avgAds: 98, color: "#D946EF" },
  ];

  const maxAds = Math.max(...data.map((d) => d.avgAds));

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Radio className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Frequency Analytics
              </CardTitle>
              <CardDescription className="text-gray-500">
                Daily advertisement distribution across stations
              </CardDescription>
            </div>
          </div>
          <Waves className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-6 space-y-5">
          {data.map((item, index) => (
            <div
              key={item.station}
              className="relative group"
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="flex items-center gap-4">
                <div className="w-36">
                  <div className="text-sm font-medium">{item.station}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Peak: {item.peakHours}
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 w-full bg-gray-100 rounded-xl" />
                  <div
                    className="relative h-16 rounded-xl transition-all duration-300 ease-out flex items-center"
                    style={{
                      width: `${(item.avgAds / maxAds) * 100}%`,
                      background: `linear-gradient(90deg, ${item.color}CC, ${item.color})`,
                      transform:
                        hoveredBar === index ? "scale(1.02)" : "scale(1)",
                      boxShadow:
                        hoveredBar === index
                          ? `0 8px 24px ${item.color}33`
                          : "none",
                    }}
                  >
                    <div
                      className={`absolute left-0 w-full px-4 flex justify-between items-center text-white transition-opacity duration-200 ${
                        hoveredBar === index ? "opacity-100" : "opacity-90"
                      }`}
                    >
                      {/* <Volume2 className="h-4 w-4" /> */}
                      <div className="font-medium">
                        {item.avgAds}
                        <span className="text-sm ml-1 opacity-90">ads/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-gray-600">Peak Hours: 6-10 AM, 4-8 PM</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">Off-Peak: 11 PM - 5 AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioAdBarChart;
