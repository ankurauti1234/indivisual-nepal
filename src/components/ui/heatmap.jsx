import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper function to get color for value
const getColor = (value, primaryColor) => {
  const rgb = hexToRgb(primaryColor) || { r: 0, g: 0, b: 255 };
  return `rgb(
    ${255 - (255 - rgb.r) * value},
    ${255 - (255 - rgb.g) * value},
    ${255 - (255 - rgb.b) * value}
  )`;
};

const Heatmap = ({
  data,
  xLabels,
  yLabels,
  primaryColor = "#000233",
}) => {
  const maxValue = Math.max(...data.flat());

  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit">
        {/* Column Headers */}
        <div className="flex">
          <div className="w-full " /> {/* Empty space for row labels */}
          {xLabels.map((label, i) => (
            <div key={i} className="w-full text-center text-sm font-medium  ">
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-12">
          {" "}
          {/* Increased margin to accommodate rotated labels */}
          {data.map((row, i) => (
            <div key={i} className="flex items-center">
              {/* Row Label */}
              <div className="min-w-36 text-sm font-medium pr-">
                {yLabels[i]}
              </div>

              {/* Data Cells */}
              {row.map((value, j) => {
                const normalizedValue = value / maxValue;
                return (
                  <div
                    key={j}
                    className="w-full h-full min-h-12 flex items-center justify-center text-sm border border-gray-200 transition-colors duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: getColor(normalizedValue, primaryColor),
                      color: normalizedValue > 0.5 ? "white" : "black",
                    }}
                  >
                    {value.toFixed(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <div className="h-6 w-64 flex">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-full"
                  style={{
                    backgroundColor: getColor(i / 9, primaryColor),
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between w-64 mx-auto mt-1 text-sm text-gray-600">
            <span>0</span>
            <span>{(maxValue / 2).toFixed(1)}</span>
            <span>{maxValue.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
