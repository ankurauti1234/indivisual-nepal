"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Calendar,
  CreditCard,
  Users,
  CheckSquare,
  ScrollText,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const StatCards = () => {
  const summaryCards = [
    {
      title: "Highest AD Count",
      value: "201",
      trend: "+8.2%",
      isPositive: true,
      icon: <ScrollText className="text-gray-600" size={20} />,
    },
    {
      title: "Top Radio Station",
      value: "Radio Mirchi",
      trend: "+3.4%",
      isPositive: true,
      icon: <CheckSquare className="text-gray-600" size={20} />,
    },
    {
      title: "Top Sector",
      value: "FMCGA",
      trend: "+4%",
      isPositive: true,
      icon: <Users className="text-gray-600" size={20} />,
    },
    {
      title: "Total ADs Duration",
      value: "270 minutes",
      icon: <BarChart className="text-gray-600" size={20} />,
    },
    {
      title: "Popular Songs",
      items: [
        "Aaj Ki Raat (Stree 2)",
        "Kesariya (Brahmastra)",
        "Apna Bana Le (Bhediya)",
      ],
      icon: <Calendar className="text-gray-600" size={20} />,
      trend: "+2.1%",
      isPositive: true,
    },
    {
      title: "Popular Program",
      items: ["Hum Tum", "Salam Ahmednagar", "Happy Evening"],
      trend: "-0.2%",
      isPositive: false,
      icon: <CreditCard className="text-gray-600" size={20} />,
    },
  ];

  const renderTrend = (trend, isPositive) => {
    if (!trend) return null;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const Icon = isPositive ? ArrowUp : ArrowDown;
    return (
      <div className={`flex items-center text-sm ${color} mt-2`}>
        <Icon size={16} className="mr-1" />
        <span>{trend}</span>
        <span className="text-gray-400 text-xs ml-1">since last month</span>
      </div>
    );
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-4 ">
        {/* Left side: 2x2 grid */}
        <div className="grid grid-cols-2 lg:col-span-2">
          {summaryCards.slice(0, 4).map((card, index) => (
            <Card key={index} className="bg-white rounded-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                    {renderTrend(card.trend, card.isPositive)}
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">{card.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right side: Popular Songs and Popular Program */}
        <div className="grid grid-cols-2 lg:col-span-2">
          {summaryCards.slice(4).map((card, index) => (
            <Card key={index} className="bg-white rounded-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {card.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 font-medium"
                        >
                          {idx + 1}. {item}
                        </li>
                      ))}
                    </ul>
                    {renderTrend(card.trend, card.isPositive)}
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">{card.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCards;
