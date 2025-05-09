import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Maximize2,
  Radio,
  Volume2,
  Music2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const ContentAdScheduler = () => {
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedStation, setSelectedStation] = useState("Radio City FM");

  // Dummy data for optimal scheduling
  const schedulingData = {
    timeSlots: [
      {
        hour: "06:00",
        songTitle: "Anti-Hero - Taylor Swift",
        adRevenue: 450,
        listenerCount: 28500,
        adEffectiveness: 92,
        optimalAdLength: 30,
        nextContent: "Morning Show",
      },
      {
        hour: "07:00",
        songTitle: "Morning Drive Show",
        adRevenue: 680,
        listenerCount: 32000,
        adEffectiveness: 95,
        optimalAdLength: 45,
        nextContent: "News Update",
      },
      {
        hour: "08:00",
        songTitle: "Cruel Summer - Taylor Swift",
        adRevenue: 520,
        listenerCount: 30000,
        adEffectiveness: 88,
        optimalAdLength: 30,
        nextContent: "Weather Report",
      },
      {
        hour: "09:00",
        songTitle: "Blank Space - Taylor Swift",
        adRevenue: 490,
        listenerCount: 29000,
        adEffectiveness: 86,
        optimalAdLength: 30,
        nextContent: "Traffic Update",
      },
      {
        hour: "10:00",
        songTitle: "Midday Mix Show",
        adRevenue: 420,
        listenerCount: 25000,
        adEffectiveness: 84,
        optimalAdLength: 30,
        nextContent: "Local News",
      },
      {
        hour: "11:00",
        songTitle: "Flowers - Miley Cyrus",
        adRevenue: 380,
        listenerCount: 23000,
        adEffectiveness: 82,
        optimalAdLength: 30,
        nextContent: "Weather Update",
      },
    ],
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const stations = ["Radio City FM", "Radio Mirchi", "Red FM", "Big FM"];

  const getTimeSlotColor = (adEffectiveness) => {
    if (adEffectiveness >= 90) return "bg-green-500";
    if (adEffectiveness >= 85) return "bg-green-400";
    if (adEffectiveness >= 80) return "bg-green-300";
    return "bg-green-200";
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Calendar className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Smart Ad Schedule Optimizer
              </CardTitle>
              <CardDescription className="text-gray-500">
                Optimize ad placements based on content performance
              </CardDescription>
            </div>
          </div>
          <Clock className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

        {/* Time Slots Grid */}
        <div className="grid grid-cols-2 gap-4">
          {schedulingData.timeSlots.map((slot, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-4 transition-all cursor-pointer ${
                selectedHour === index
                  ? "bg-primary/5 scale-[1.02] shadow-lg"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSelectedHour(index)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{slot.hour}</span>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeSlotColor(
                    slot.adEffectiveness
                  )} bg-opacity-20 text-green-800`}
                >
                  {slot.adEffectiveness}% Effective
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Music2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium truncate">
                    {slot.songTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">
                      Revenue Potential
                    </div>
                    <div className="font-medium">${slot.adRevenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Listeners</div>
                    <div className="font-medium">
                      {(slot.listenerCount / 1000).toFixed(1)}k
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Volume2 className="h-3 w-3 text-gray-400" />
                    <span>Optimal Length: {slot.optimalAdLength}s</span>
                  </div>
                  <div className="text-primary font-medium">
                    Next: {slot.nextContent}
                  </div>
                </div>
              </div>

              <div
                className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${getTimeSlotColor(
                  slot.adEffectiveness
                )}`}
              />
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-gray-600">Peak Time: 7AM-9AM</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-gray-600">Avg. Revenue: $490/hour</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">Best Content: Morning Show</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAdScheduler;
