"use client";
import React from "react";
import { AreaClosed } from "@visx/shape";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";

export default function AreaChart({
  data,
  width,
  yMax,
  margin,
  xScale,
  yScale,
  hideBottomAxis = false,
  hideLeftAxis = false,
  top,
  left,
  children,
  gradientColor,
}) {
  if (width < 10) return null;

  return (
    <Group left={margin.left} top={top || margin.top}>
      <LinearGradient
        id="gradient"
        from={gradientColor}
        to={gradientColor}
        fromOpacity={0.4}
        toOpacity={0.1}
      />
      <AreaClosed
        data={data}
        x={(d) => xScale(new Date(d.date)) || 0}
        y={(d) => yScale(d.close) || 0}
        yScale={yScale}
        fill="url(#gradient)"
        stroke={gradientColor}
        strokeWidth={1}
      />
      {!hideBottomAxis && (
        <AxisBottom
          top={yMax}
          scale={xScale}
          numTicks={width > 520 ? 10 : 5}
          stroke={gradientColor}
          tickStroke={gradientColor}
          tickLabelProps={{
            fill: gradientColor,
            fontSize: 11,
            textAnchor: "middle",
          }}
        />
      )}
      {!hideLeftAxis && (
        <AxisLeft
          scale={yScale}
          numTicks={5}
          stroke={gradientColor}
          tickStroke={gradientColor}
          tickLabelProps={{
            fill: gradientColor,
            fontSize: 11,
            textAnchor: "end",
            dx: -4,
            dy: 4,
          }}
        />
      )}
      {children}
    </Group>
  );
}
