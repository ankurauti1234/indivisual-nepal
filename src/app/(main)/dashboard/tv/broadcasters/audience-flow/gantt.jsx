"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  channels,
  personas,
  channelPresence,
  channelColors,
  getTimePosition,
  formatTime,
} from "./data";

export default function ChannelMovementGantt() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0].id);
  const personaPresence = channelPresence[selectedPersona];
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Channel Movement Timeline</h1>
        <Select onValueChange={(value) => setSelectedPersona(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a persona" />
          </SelectTrigger>
          <SelectContent>
            {personas.map((persona) => (
              <SelectItem key={persona.id} value={persona.id.toString()}>
                {persona.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative w-full overflow-x-auto shadow-md rounded-lg border">
        <div className="min-w-[800px]">
          {/* Timeline header */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <div className="w-32 flex-shrink-0 p-2 font-medium">Channel</div>
            <div className="flex-grow flex">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 text-center text-xs text-gray-600 py-2"
                >
                  {hour.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>

          {/* Channel rows */}
          {channels.map((channel) => (
            <div
              key={channel}
              className="flex items-center border-b border-gray-200"
            >
              <div className="w-32 flex-shrink-0 p-2 font-medium">
                {channel}
              </div>
              <div className="flex-grow h-16 relative">
                {/* Background grid */}
                <div className="absolute inset-0 grid grid-cols-24 border-l border-gray-200">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-r border-gray-200" />
                  ))}
                </div>

                {/* Channel presence bars */}
                {personaPresence
                  .filter((presence) => presence.channel === channel)
                  .map((presence, idx) => (
                    <div
                      key={idx}
                      className={`absolute h-8 ${channelColors[channel]} rounded-md border flex items-center justify-center text-white text-xs font-medium shadow-sm`}
                      style={{
                        left: `${getTimePosition(presence.start) * 100}%`,
                        width: `${
                          (getTimePosition(presence.end) -
                            getTimePosition(presence.start)) *
                          100
                        }%`,
                        top: "16px",
                      }}
                    >
                      {formatTime(presence.start)} - {formatTime(presence.end)}
                    </div>
                  ))}

                {/* Transition arrows */}
                {personaPresence.map((presence, idx) => {
                  const nextPresence = personaPresence[idx + 1];
                  if (!nextPresence) return null;

                  const startX = getTimePosition(presence.end) * 100;
                  const endX = getTimePosition(nextPresence.start) * 100;

                  const startY = channels.indexOf(presence.channel) * 64 + 32;
                  const endY = channels.indexOf(nextPresence.channel) * 64 + 32;

                  return (
                    <svg
                      key={`arrow-${idx}`}
                      className="absolute pointer-events-none"
                      style={{
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "192px",
                        overflow: "visible",
                      }}
                    >
                      <defs>
                        <marker
                          id={`arrowhead-${idx}`}
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                        </marker>
                      </defs>
                      <path
                        d={`M ${startX}% ${startY} C ${
                          (startX + endX) / 2
                        }% ${startY}, ${
                          (startX + endX) / 2
                        }% ${endY}, ${endX}% ${endY}`}
                        fill="none"
                        stroke="#6B7280"
                        strokeWidth="2"
                        markerEnd={`url(#arrowhead-${idx})`}
                      />
                    </svg>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
