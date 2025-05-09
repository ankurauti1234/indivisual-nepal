import React, { useState } from "react";
import { TrendingUp, Radio, BarChart3, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const TopContentAdPlacements = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [contentType, setContentType] = useState("songs");
  const [selectedStation, setSelectedStation] = useState("all");

  // Dummy data for top songs/programs with ad metrics
  const contentData = {
    songs: [
      {
        title: "Anti-Hero - Taylor Swift",
        totalPlays: 42,
        adsBeforeCount: 28,
        adsAfterCount: 24,
        avgAdRevenue: 1240,
        peakHours: "8AM-11AM",
        genre: "Pop",
        stations: ["Radio City FM", "Radio Mirchi"],
      },
      {
        title: "Cruel Summer - Taylor Swift",
        totalPlays: 38,
        adsBeforeCount: 25,
        adsAfterCount: 22,
        avgAdRevenue: 1180,
        peakHours: "4PM-7PM",
        genre: "Pop",
        stations: ["Radio City FM", "Big FM"],
      },
      {
        title: "Flowers - Miley Cyrus",
        totalPlays: 35,
        adsBeforeCount: 24,
        adsAfterCount: 20,
        avgAdRevenue: 1080,
        peakHours: "2PM-5PM",
        genre: "Pop",
        stations: ["Radio Mirchi", "Red FM"],
      },
      {
        title: "Last Night - Morgan Wallen",
        totalPlays: 32,
        adsBeforeCount: 20,
        adsAfterCount: 18,
        avgAdRevenue: 950,
        peakHours: "1PM-4PM",
        genre: "Country",
        stations: ["Big FM", "Rainbow FM"],
      },
      {
        title: "Unstoppable - Sia",
        totalPlays: 30,
        adsBeforeCount: 18,
        adsAfterCount: 16,
        avgAdRevenue: 840,
        peakHours: "9AM-12PM",
        genre: "Pop",
        stations: ["Radio City FM", "Red FM"],
      },
    ],
    programs: [
      {
        title: "Morning Drive Show",
        totalPlays: 7,
        adsBeforeCount: 35,
        adsAfterCount: 32,
        avgAdRevenue: 2800,
        peakHours: "6AM-10AM",
        type: "Talk Show",
        stations: ["Radio City FM", "Radio Mirchi"],
      },
      // Add more program data here
    ],
  };

  const stations = [
    "all",
    "Radio City FM",
    "Radio Mirchi",
    "Red FM",
    "Big FM",
    "Rainbow FM",
  ];

  const getMaxAdCount = () => {
    return Math.max(
      ...contentData[contentType].map((item) =>
        Math.max(item.adsBeforeCount, item.adsAfterCount)
      )
    );
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Top Content Ad Performance
              </CardTitle>
              <CardDescription className="text-gray-500">
                Analysis of highest performing content and associated ad
                placements
              </CardDescription>
            </div>
          </div>
          <BarChart3 className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="space-x-2">
            <button
              onClick={() => setTimeFrame("daily")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === "daily"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeFrame("weekly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === "weekly"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setContentType("songs")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                contentType === "songs"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Songs
            </button>
            <button
              onClick={() => setContentType("programs")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                contentType === "programs"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Programs
            </button>
          </div>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            {stations.map((station) => (
              <option key={station} value={station}>
                {station === "all" ? "All Stations" : station}
              </option>
            ))}
          </select>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {contentData[contentType]
            .filter(
              (item) =>
                selectedStation === "all" ||
                item.stations.includes(selectedStation)
            )
            .map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {contentType === "songs" ? item.genre : item.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">
                      ${item.avgAdRevenue}
                    </p>
                    <p className="text-xs text-gray-500">Avg. Daily Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  {/* Ads Before Bar */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">
                      Ads Before ({item.adsBeforeCount})
                    </div>
                    <div className="h-4 relative bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary/70 rounded-full transition-all"
                        style={{
                          width: `${
                            (item.adsBeforeCount / getMaxAdCount()) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Ads After Bar */}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">
                      Ads After ({item.adsAfterCount})
                    </div>
                    <div className="h-4 relative bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${
                            (item.adsAfterCount / getMaxAdCount()) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div>Peak Hours: {item.peakHours}</div>
                  <div>Total Plays: {item.totalPlays}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-gray-600">
                Top Genre: {contentType === "songs" ? "Pop" : "Talk Show"}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">Peak Revenue: 6AM-10AM</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopContentAdPlacements;
