import React, { useState } from "react";
import { BarChart, Clock, Filter, TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const AdPlacementFrequency = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [selectedStation, setSelectedStation] = useState("all");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [hoveredContent, setHoveredContent] = useState(null);

  // Dummy data for content and ad placements
  const contentData = [
    {
      id: 1,
      title: "Morning Drive Show",
      type: "Program",
      timeSlot: "6AM-10AM",
      adFrequency: {
        before: {
          Monday: 12,
          Tuesday: 14,
          Wednesday: 13,
          Thursday: 15,
          Friday: 14,
        },
        after: {
          Monday: 10,
          Tuesday: 12,
          Wednesday: 11,
          Thursday: 13,
          Friday: 12,
        },
      },
      genre: "Talk Show",
      stations: ["Radio City FM", "Radio Mirchi"],
      avgDuration: "240min",
    },
    {
      id: 2,
      title: "Anti-Hero - Taylor Swift",
      type: "Song",
      timeSlot: "10AM-2PM",
      adFrequency: {
        before: {
          Monday: 8,
          Tuesday: 7,
          Wednesday: 9,
          Thursday: 8,
          Friday: 9,
        },
        after: {
          Monday: 6,
          Tuesday: 7,
          Wednesday: 8,
          Thursday: 7,
          Friday: 8,
        },
      },
      genre: "Pop",
      stations: ["Radio City FM", "Big FM"],
      avgDuration: "3:45",
    },
    {
      id: 3,
      title: "Afternoon Request Hour",
      type: "Program",
      timeSlot: "2PM-4PM",
      adFrequency: {
        before: {
          Monday: 10,
          Tuesday: 11,
          Wednesday: 9,
          Thursday: 10,
          Friday: 11,
        },
        after: {
          Monday: 9,
          Tuesday: 10,
          Wednesday: 8,
          Thursday: 9,
          Friday: 10,
        },
      },
      genre: "Interactive",
      stations: ["Radio Mirchi", "Red FM"],
      avgDuration: "120min",
    },
    {
      id: 4,
      title: "Cruel Summer - Taylor Swift",
      type: "Song",
      timeSlot: "4PM-8PM",
      adFrequency: {
        before: {
          Monday: 7,
          Tuesday: 8,
          Wednesday: 6,
          Thursday: 7,
          Friday: 8,
        },
        after: {
          Monday: 6,
          Tuesday: 7,
          Wednesday: 5,
          Thursday: 6,
          Friday: 7,
        },
      },
      genre: "Pop",
      stations: ["Big FM", "Rainbow FM"],
      avgDuration: "3:30",
    },
    {
      id: 5,
      title: "Evening Drive Show",
      type: "Program",
      timeSlot: "8PM-12AM",
      adFrequency: {
        before: {
          Monday: 9,
          Tuesday: 10,
          Wednesday: 8,
          Thursday: 9,
          Friday: 10,
        },
        after: {
          Monday: 8,
          Tuesday: 9,
          Wednesday: 7,
          Thursday: 8,
          Friday: 9,
        },
      },
      genre: "Talk Show",
      stations: ["Radio City FM", "Red FM"],
      avgDuration: "240min",
    },
  ];

  const stations = [
    "all",
    "Radio City FM",
    "Radio Mirchi",
    "Red FM",
    "Big FM",
    "Rainbow FM",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getMaxAdFrequency = () => {
    return Math.max(
      ...contentData.map((item) =>
        Math.max(
          item.adFrequency.before[selectedDay],
          item.adFrequency.after[selectedDay]
        )
      )
    );
  };

  const getHeatMapColor = (value) => {
    const maxValue = getMaxAdFrequency();
    const intensity = (value / maxValue) * 0.8 + 0.2; // Ensures minimum intensity of 0.2
    return `rgba(59, 130, 246, ${intensity})`;
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <BarChart className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Placement Frequency
              </CardTitle>
              <CardDescription className="text-gray-500">
                Analysis of ad distribution across content types
              </CardDescription>
            </div>
          </div>
          <Clock className="h-6 w-6 text-primary/60" />
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

          <div className="flex gap-2 overflow-x-auto">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedDay === day
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Content List with Frequency Visualization */}
        <div className="space-y-4">
          {contentData
            .filter(
              (item) =>
                selectedStation === "all" ||
                item.stations.includes(selectedStation)
            )
            .map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                  hoveredContent === index ? "shadow-md" : ""
                }`}
                onMouseEnter={() => setHoveredContent(index)}
                onMouseLeave={() => setHoveredContent(null)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.genre}</span>
                      <span>•</span>
                      <span>{item.avgDuration}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {item.timeSlot}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-4">
                  {/* Before Ads Frequency */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Ads Before
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {item.adFrequency.before[selectedDay]}x
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${
                            (item.adFrequency.before[selectedDay] /
                              getMaxAdFrequency()) *
                            100
                          }%`,
                          backgroundColor: getHeatMapColor(
                            item.adFrequency.before[selectedDay]
                          ),
                        }}
                      />
                    </div>
                  </div>

                  {/* After Ads Frequency */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Ads After
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {item.adFrequency.after[selectedDay]}x
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${
                            (item.adFrequency.after[selectedDay] /
                              getMaxAdFrequency()) *
                            100
                          }%`,
                          backgroundColor: getHeatMapColor(
                            item.adFrequency.after[selectedDay]
                          ),
                        }}
                      />
                    </div>
                  </div>
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
                Peak Ad Time:{" "}
                {timeFrame === "daily" ? "6AM-10AM" : "Monday-Wednesday"}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">
                Most Ads:{" "}
                {timeFrame === "daily" ? "Morning Drive Show" : "Talk Shows"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdPlacementFrequency;
