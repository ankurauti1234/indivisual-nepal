"use client";

import React, { useState } from "react";
import { Radio, BarChart3 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const AdStackedChart = () => {
  const [hoveredSection, setHoveredSection] = useState(null);

  // Vibrant Apple-inspired colors
const colors = {
  Automotive: "#F4A261", // Light orange
  FMCG: "#2A9D8F", // Teal
  Telecom: "#E9C46A", // Mustard yellow
  Entertainment: "#F4A3E6", // Pink
  Sports: "#5E60CE", // Purple
  Healthcare: "#E76F51", // Red-orange
};




  const data = [
    {
      station: "Radio City FM",
      Automotive: 30,
      FMCG: 18,
      Telecom: 12,
      Entertainment: 20,
      Sports: 10,
      Healthcare: 25,
      total: 115,
    },
    {
      station: "Radio Mirchi",
      Automotive: 22,
      FMCG: 15,
      Telecom: 18,
      Entertainment: 30,
      Sports: 12,
      Healthcare: 23,
      total: 120,
    },
    {
      station: "Red FM",
      Automotive: 28,
      FMCG: 25,
      Telecom: 20,
      Entertainment: 22,
      Sports: 18,
      Healthcare: 30,
      total: 143,
    },
    {
      station: "Big FM",
      Automotive: 35,
      FMCG: 17,
      Telecom: 10,
      Entertainment: 28,
      Sports: 12,
      Healthcare: 20,
      total: 122,
    },
    {
      station: "Rainbow FM",
      Automotive: 25,
      FMCG: 23,
      Telecom: 16,
      Entertainment: 23,
      Sports: 20,
      Healthcare: 18,
      total: 125,
    },
  ];

  // Get all unique industries
  const industries = Object.keys(colors);

  const calculateTotalAds = () => {
    return data.reduce((total, station) => total + station.total, 0);
  };

  const CustomTooltip = ({ station, industry, value, total }) => (
    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-10">
      <div className="backdrop-blur-xl bg-white/95 p-4 rounded-2xl shadow-lg border border-gray-200 w-64">
        <h3 className="font-semibold text-lg mb-2">{station}</h3>
        <div className="flex items-center gap-2 bg-gray-50/80 px-3 py-2 rounded-xl mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors[industry] }}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{industry}</span>
            <span className="text-xs text-gray-600">
              {value} Ads ({((value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Daily Average: {(value / 7).toFixed(1)} ads/day
        </p>
        <p className="text-sm text-gray-500">
          Weekly Share: {((value / total) * 100).toFixed(1)}% of station's ads
        </p>
      </div>
    </div>
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
                Ad Frequency Analytics
              </CardTitle>
              <CardDescription className="text-gray-500">
                Weekly advertisement distribution across stations
              </CardDescription>
            </div>
          </div>
          <BarChart3 className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-6 space-y-5">
          {data.map((item, index) => (
            <div key={item.station} className="relative group">
              <div className="flex items-center gap-4">
                <div className="w-36">
                  <div className="text-sm font-medium">{item.station}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {item.total} ads/week
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 w-full bg-gray-100 rounded-xl" />
                  <div
                    className="relative h-16 rounded-xl transition-all duration-300 ease-out flex items-center overflow-hidden"
                    style={{
                      width: `${
                        (item.total / Math.max(...data.map((d) => d.total))) *
                        100
                      }%`,
                    }}
                  >
                    {industries.map((industry) => (
                      <div
                        key={industry}
                        className="h-full relative group"
                        style={{
                          width: `${(item[industry] / item.total) * 100}%`,
                          backgroundColor: colors[industry],
                        }}
                        onMouseEnter={() =>
                          setHoveredSection({
                            station: item.station,
                            industry,
                            value: item[industry],
                            total: item.total,
                          })
                        }
                        onMouseLeave={() => setHoveredSection(null)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center  text-xs font-medium  transition-opacity duration-200">
                          {item[industry]}
                        </div>
                        {hoveredSection &&
                          hoveredSection.station === item.station &&
                          hoveredSection.industry === industry && (
                            <CustomTooltip {...hoveredSection} />
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            {industries.map((industry) => (
              <div
                key={industry}
                className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3"
              >
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: colors[industry] }}
                />
                <span className="text-gray-600">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdStackedChart;
