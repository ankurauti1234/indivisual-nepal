import React, { useState } from "react";
import { Radio, Clock, Filter } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const AdContentTransition = () => {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Dummy data representing content transitions
  const transitionData = [
    {
      time: "08:00 AM",
      before: "Shape of You - Ed Sheeran",
      adContent: "Coca Cola Summer Campaign",
      after: "Blinding Lights - The Weeknd",
      duration: "Ad: 30s",
      category: "Beverages",
    },
    {
      time: "08:45 AM",
      before: "Stay - Kid Laroi & Justin Bieber",
      adContent: "McDonald's Breakfast Menu",
      after: "Heat Waves - Glass Animals",
      duration: "Ad: 45s",
      category: "Food",
    },
    {
      time: "09:30 AM",
      before: "Good 4 U - Olivia Rodrigo",
      adContent: "Local Car Dealership Sale",
      after: "Levitating - Dua Lipa",
      duration: "Ad: 20s",
      category: "Automotive",
    },
    {
      time: "10:15 AM",
      before: "As It Was - Harry Styles",
      adContent: "Netflix New Series Promo",
      after: "Anti-Hero - Taylor Swift",
      duration: "Ad: 15s",
      category: "Entertainment",
    },
    {
      time: "11:00 AM",
      before: "Shivers - Ed Sheeran",
      adContent: "Bank Credit Card Offer",
      after: "About Damn Time - Lizzo",
      duration: "Ad: 30s",
      category: "Financial",
    },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50/50 to-gray-100/50 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Clock className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-1">
                Ad Content Transitions
              </CardTitle>
              <CardDescription className="text-gray-500">
                Analysis of content played before and after advertisements
              </CardDescription>
            </div>
          </div>
          <Filter className="h-6 w-6 text-primary/60" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
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

        <div className="space-y-4">
          {transitionData.map((item, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="grid grid-cols-[100px_1fr] gap-4">
                <div className="text-sm font-medium text-gray-500">{item.time}</div>
                <div className="flex-1">
                  <div
                    className={`relative p-4 rounded-xl transition-all duration-300 ${
                      hoveredSegment === index
                        ? "bg-primary/5 scale-[1.02]"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500">Before Ad</div>
                        <div className="text-sm font-medium truncate">{item.before}</div>
                      </div>
                      <div className="space-y-1 bg-red-200 p-2 rounded-lg">
                        <div className="text-xs font-medium text-primary">Ad Content</div>
                        <div className="text-sm font-medium truncate">{item.adContent}</div>
                        <div className="text-xs text-gray-500">{item.duration}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500">After Ad</div>
                        <div className="text-sm font-medium truncate">{item.after}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {item.category}
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
              <span className="text-gray-600">Average Ad Duration: 28s</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50/50 rounded-xl p-3">
              <div className="h-2 w-2 rounded-full bg-primary/60" />
              <span className="text-gray-600">Most Common Category: Beverages</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdContentTransition;