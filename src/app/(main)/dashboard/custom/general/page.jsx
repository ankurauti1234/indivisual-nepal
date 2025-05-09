'use client'
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ABC_SCHEDULE, NBC_SCHEDULE } from "./channelData";
import AgeDistributionViz from "./age";
import ChannelTreemap from "./treemap";
import DivergingStackedChart from "./gender";

const TVScheduleTimeline = () => {
  const processScheduleData = (abcSchedule, nbcSchedule) => {
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;

      const abcProgram = abcSchedule.find((item) => item.time === timeString);
      const nbcProgram = nbcSchedule.find((item) => item.time === timeString);

      timeSlots.push({
        time: timeString,
        ABC: abcProgram ? 1 : 0,
        NBC: nbcProgram ? 1 : 0,
        abcContent: abcProgram?.content || "",
        nbcContent: nbcProgram?.content || "",
        abcIsAd: abcProgram?.isAd || false,
        nbcIsAd: nbcProgram?.isAd || false,
        abcDuration: abcProgram?.duration || 0,
        nbcDuration: nbcProgram?.duration || 0,
      });
    }
    return timeSlots;
  };

  const [data] = useState(processScheduleData(ABC_SCHEDULE, NBC_SCHEDULE));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const channel = payload[0].dataKey === "ABC" ? "ABC" : "NBC";
      const content =
        channel === "ABC"
          ? payload[0].payload.abcContent
          : payload[0].payload.nbcContent;
      const isAd =
        channel === "ABC"
          ? payload[0].payload.abcIsAd
          : payload[0].payload.nbcIsAd;
      const duration =
        channel === "ABC"
          ? payload[0].payload.abcDuration
          : payload[0].payload.nbcDuration;

      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="font-bold">{`Time: ${label}`}</p>
          <p>{`Channel: ${channel}`}</p>
          <p>{`Program: ${content}`}</p>
          <p>{`Type: ${isAd ? "Advertisement" : "Program"}`}</p>
          <p>{`Duration: ${duration} hour${duration !== 1 ? "s" : ""}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>TV Channel Schedule Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
                barGap={0}
                barSize={40}
              >
                <XAxis
                  dataKey="time"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  ticks={["NBC", "ABC"]}
                  tick={{ fontSize: 14 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Brush
                  dataKey="time"
                  height={30}
                  stroke="#8884d8"
                  startIndex={8}
                  endIndex={20}
                />
                <Bar dataKey="ABC" name="ABC">
                  {data.map((entry, index) => (
                    <Cell
                      key={`abc-${index}`}
                      fill={entry.abcIsAd ? "#ff8042" : "#8884d8"}
                    />
                  ))}
                </Bar>
                <Bar dataKey="NBC" name="NBC">
                  {data.map((entry, index) => (
                    <Cell
                      key={`nbc-${index}`}
                      fill={entry.nbcIsAd ? "#ff8042" : "#8884d8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#8884d8]"></div>
              <span>Program</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#ff8042]"></div>
              <span>Advertisement</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AgeDistributionViz />
      
      <ChannelTreemap />
      
      <DivergingStackedChart/>
    </>
  );
};
  
export default TVScheduleTimeline;
