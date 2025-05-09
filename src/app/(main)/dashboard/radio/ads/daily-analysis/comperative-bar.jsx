import React, { useState } from "react";
import { Radio, PieChart } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const RadioSectorAnalysis = () => {
  const [hoveredStation, setHoveredStation] = useState(null);

  const sectors = {
    automotive: { name: "Automotive", color: "#3B82F6" },
    retail: { name: "Retail", color: "#6366F1" },
    fmcg: { name: "FMCG", color: "#8B5CF6" },
    banking: { name: "Banking", color: "#A855F7" },
    entertainment: { name: "Entertainment", color: "#D946EF" },
  };

  const data = [
    {
      station: "Radio City FM",
      ads: {
        automotive: 45,
        retail: 35,
        fmcg: 30,
        banking: 25,
        entertainment: 21,
      },
    },
    {
      station: "Radio Mirchi",
      ads: {
        automotive: 38,
        retail: 32,
        fmcg: 28,
        banking: 24,
        entertainment: 20,
      },
    },
    {
      station: "Red FM",
      ads: {
        automotive: 35,
        retail: 30,
        fmcg: 25,
        banking: 20,
        entertainment: 18,
      },
    },
    {
      station: "Big FM",
      ads: {
        automotive: 32,
        retail: 28,
        fmcg: 22,
        banking: 18,
        entertainment: 15,
      },
    },
    {
      station: "Rainbow FM",
      ads: {
        automotive: 28,
        retail: 25,
        fmcg: 20,
        banking: 15,
        entertainment: 10,
      },
    },
  ];

  const maxTotalAds = Math.max(
    ...data.map((station) =>
      Object.values(station.ads).reduce((a, b) => a + b, 0)
    )
  );

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
                Sector-wise Ad Distribution
              </CardTitle>
              <CardDescription className="text-gray-500">
                Advertisement spots by industry sectors across radio stations
              </CardDescription>
            </div>
          </div>
          <PieChart className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-6 space-y-5">
          {data.map((station, stationIndex) => (
            <div
              key={station.station}
              className="relative group"
              onMouseEnter={() => setHoveredStation(stationIndex)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              <div className="flex items-center gap-4">
                <div className="w-36">
                  <div className="text-sm font-medium">{station.station}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.values(station.ads).reduce((a, b) => a + b, 0)}{" "}
                    total ads
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 w-full bg-gray-100 rounded-xl" />
                  <div
                    className="relative h-16 rounded-xl flex overflow-hidden transition-all duration-300"
                    style={{
                      width: `${
                        (Object.values(station.ads).reduce((a, b) => a + b, 0) /
                          maxTotalAds) *
                        100
                      }%`,
                      transform:
                        hoveredStation === stationIndex
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                  >
                    {Object.entries(station.ads).map(
                      ([sector, value], index) => (
                        <div
                          key={sector}
                          className="h-full relative group/sector"
                          style={{
                            width: `${
                              (value /
                                Object.values(station.ads).reduce(
                                  (a, b) => a + b,
                                  0
                                )) *
                              100
                            }%`,
                            backgroundColor: sectors[sector].color,
                            transition: "all 0.2s ease-out",
                          }}
                        >
                          <div className="opacity-0 group-hover/sector:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                            {sectors[sector].name}: {value} ads
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {Object.entries(sectors).map(([key, sector]) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: sector.color }}
                />
                <span className="text-gray-600">{sector.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioSectorAnalysis;
