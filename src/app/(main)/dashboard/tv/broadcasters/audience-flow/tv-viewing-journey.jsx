import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {  Target } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

const personas = {
  "Young Professional": [
    {
      channel: "Morning News",
      startTime: 7,
      duration: 1,
      companion: "Alone",
      activity: "Breakfast & News",
    },
    {
      channel: "Fitness",
      startTime: 18,
      duration: 1,
      companion: "Alone",
      activity: "Post-work Exercise",
    },
    {
      channel: "Premium Drama",
      startTime: 20,
      duration: 2,
      companion: "Partner",
      activity: "Evening Entertainment",
    },
    {
      channel: "Late Shows",
      startTime: 23,
      duration: 1,
      companion: "Alone",
      activity: "Wind Down",
    },
  ],
  "Remote Worker": [
    {
      channel: "Tech News",
      startTime: 8,
      duration: 1,
      companion: "Alone",
      activity: "Industry Updates",
    },
    {
      channel: "Background TV",
      startTime: 13,
      duration: 2,
      companion: "Alone",
      activity: "Work Background",
    },
    {
      channel: "Documentary",
      startTime: 17,
      duration: 2,
      companion: "Partner",
      activity: "Learning Time",
    },
    {
      channel: "Streaming Series",
      startTime: 21,
      duration: 3,
      companion: "Partner",
      activity: "Prime Time",
    },
  ],
  Parent: [
    {
      channel: "Kids Educational",
      startTime: 8,
      duration: 2,
      companion: "Children",
      activity: "Learning Time",
    },
    {
      channel: "Cooking Shows",
      startTime: 12,
      duration: 1,
      companion: "Children",
      activity: "Lunch Prep",
    },
    {
      channel: "Family Movies",
      startTime: 15,
      duration: 2,
      companion: "Family",
      activity: "Afternoon Break",
    },
    {
      channel: "Prime Time Shows",
      startTime: 19,
      duration: 3,
      companion: "Family",
      activity: "Family Time",
    },
    {
      channel: "Adult Drama",
      startTime: 22,
      duration: 2,
      companion: "Partner",
      activity: "Adult Time",
    },
  ],
  Student: [
    {
      channel: "Educational Content",
      startTime: 10,
      duration: 2,
      companion: "Study Group",
      activity: "Study Session",
    },
    {
      channel: "Sports",
      startTime: 16,
      duration: 2,
      companion: "Friends",
      activity: "Social Time",
    },
    {
      channel: "Gaming Streams",
      startTime: 19,
      duration: 2,
      companion: "Online Friends",
      activity: "Gaming",
    },
    {
      channel: "Binge Watch",
      startTime: 21,
      duration: 3,
      companion: "Roommate",
      activity: "Entertainment",
    },
  ],
  Retiree: [
    {
      channel: "Morning Shows",
      startTime: 6,
      duration: 2,
      companion: "Partner",
      activity: "Morning Routine",
    },
    {
      channel: "News & Current Affairs",
      startTime: 12,
      duration: 2,
      companion: "Alone",
      activity: "Daily Updates",
    },
    {
      channel: "Classic Movies",
      startTime: 15,
      duration: 3,
      companion: "Friends",
      activity: "Social Viewing",
    },
    {
      channel: "Evening News",
      startTime: 19,
      duration: 1,
      companion: "Partner",
      activity: "News Time",
    },
    {
      channel: "Drama Series",
      startTime: 20,
      duration: 2,
      companion: "Partner",
      activity: "Evening Entertainment",
    },
  ],
};

const companionColors = {
  Alone: "#2ED9C3", // Soft Teal
  Partner: "#FF6B8B", // Soft Pink
  Children: "#FFB86B", // Soft Orange
  Family: "#845EF7", // Soft Purple
  Friends: "#51CF66", // Soft Green
  Roommate: "#339AF0", // Soft Blue
  "Study Group": "#FCC419", // Soft Yellow
  "Online Friends": "#FF922B", // Soft Coral
};

const RadialTimeline = () => {
  const [selectedPersona, setSelectedPersona] = useState("Young Professional");
  const [hoveredSession, setHoveredSession] = useState(null);

  const radius = 160;
  const center = { x: 250, y: 250 };

  const timeToAngle = (time) => ((time / 24) * 360 - 90) * (Math.PI / 180);

  const getPointOnCircle = (time, offset = 0) => {
    const angle = timeToAngle(time);
    return {
      x: center.x + (radius + offset) * Math.cos(angle),
      y: center.y + (radius + offset) * Math.sin(angle),
    };
  };

  const createArcPath = (startTime, endTime, offset = 0) => {
    const start = getPointOnCircle(startTime, offset);
    const end = getPointOnCircle(endTime, offset);
    const startAngle = timeToAngle(startTime);
    const endAngle = timeToAngle(endTime);
    const largeArcFlag = endTime - startTime > 12 ? 1 : 0;

    return `M ${start.x} ${start.y} A ${radius + offset} ${
      radius + offset
    } 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  const hourMarkers = Array.from({ length: 24 }, (_, i) => {
    const point = getPointOnCircle(i, 20);
    const isMainHour = i % 3 === 0;
    return (
      <g key={i}>
        <line
          x1={center.x + radius * Math.cos(timeToAngle(i))}
          y1={center.y + radius * Math.sin(timeToAngle(i))}
          x2={
            center.x +
            (radius + (isMainHour ? 15 : 8)) * Math.cos(timeToAngle(i))
          }
          y2={
            center.y +
            (radius + (isMainHour ? 15 : 8)) * Math.sin(timeToAngle(i))
          }
          stroke={isMainHour ? "#666" : "#999"}
          strokeWidth={isMainHour ? "2" : "1"}
        />
        {isMainHour && (
          <text
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-gray-600"
          >
            {i === 0 ? "24" : i}
          </text>
        )}
      </g>
    );
  });

  return (
    <ChartCard
      icon={<Target className="w-6 h-6" />}
      title="TV Viewing Patterns"
      description="Explore different viewing habits across various lifestyle patterns"
      action={
        <div className="flex justify-end">
          <Select
            onValueChange={setSelectedPersona}
            defaultValue={selectedPersona}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select a persona" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(personas).map((persona) => (
                <SelectItem key={persona} value={persona}>
                  {persona}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="flex flex-col items-center">
          <div className="relative w-full h-[500px]">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              {/* Background circles */}
              <circle
                cx={center.x}
                cy={center.y}
                r={radius + 30}
                fill="none"
                stroke="#808080"
                strokeWidth="1"
              />
              <circle
                cx={center.x}
                cy={center.y}
                r={radius}
                fill="none"
                stroke="#888888"
                strokeWidth="1"
              />

              {/* Hour markers */}
              {hourMarkers}

              {/* Viewing sessions */}
              {personas[selectedPersona].map((session, index) => {
                const endTime = (session.startTime + session.duration) % 24;
                const arcPath = createArcPath(session.startTime, endTime);
                const isHovered = hoveredSession === index;

                return (
                  <g key={index}>
                    <path
                      d={arcPath}
                      fill="none"
                      stroke={companionColors[session.companion]}
                      strokeWidth={isHovered ? "32" : "20"}
                      strokeLinecap="round"
                      className="transition-all duration-200 opacity-80 hover:opacity-100"
                      onMouseEnter={() => setHoveredSession(index)}
                      onMouseLeave={() => setHoveredSession(null)}
                    />
                    {isHovered && (
                      <foreignObject
                        x={center.x - 100}
                        y={center.y - 60}
                        width="200"
                        height="120"
                      >
                        <div className="bg-card backdrop-blur-sm p-4 rounded-xl shadow-lg border text-sm">
                          <p className="font-semibold text-primary">
                            {session.channel}
                          </p>
                          <p className="text-foreground/75">
                            {session.activity}
                          </p>
                          <p className="text-foreground/50">
                            {session.startTime}:00 - {endTime}:00 (
                            {session.duration}h)
                          </p>
                          <p className="text-gray-500">
                            With: {session.companion}
                          </p>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}

              {/* Center info icon */}
              {/* <g transform={`translate(${center.x - 12}, ${center.y - 12})`}>
              <Info className="w-6 h-6 text-gray-400" />
            </g> */}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3  bg-popover shadow-inner border-2 p-2 rounded-lg w-fit">
            {Object.entries(companionColors).map(([companion, color]) => (
              <div
                key={companion}
                className="px-3 py-1 flex gap-2 text-sm transition-all duration-200 hover:scale-105"
              >
                <div className="h-4 w-4" style={{ backgroundColor: color }} />
                <p style={{ color: color }}>{companion}</p>
              </div>
            ))}
          </div>
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Data generated dynamically. Updated based on your selection.
        </p>
      }
    />
  );
};

export default RadialTimeline;
