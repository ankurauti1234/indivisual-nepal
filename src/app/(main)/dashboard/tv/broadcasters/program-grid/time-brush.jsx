import React, { useState, useEffect, useRef } from 'react';
import { scaleTime } from 'd3-scale';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';



export const TimeBrush = ({
  timeRange,
  brushTimeRange,
  onBrushChange,
}) => {
  const svgRef = useRef(null);
  const brushRef = useRef(null);

  const margin = { top: 10, right: 20, bottom: 20, left: 20 };
  const width = 800 - margin.left - margin.right;
  const height = 100 - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);

    const x = scaleTime()
      .domain([timeRange.start, timeRange.end])
      .range([0, width]);

    const xAxis = axisBottom(x)
      .ticks(24)
      .tickFormat((d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    svg.select('.x-axis').call(xAxis);

    const brush = brushX()
      .extent([[0, 0], [width, height]])
      .on('end', brushed);

    if (!brushRef.current) {
      brushRef.current = svg.select('.brush').call(brush);
    }

    function brushed(event) {
      if (!event.selection) return;
      const [x0, x1] = event.selection.map(x.invert);
      onBrushChange(x0, x1);
    }

    // Set initial brush position
    const initialSelection = [
      x(brushTimeRange.start),
      x(brushTimeRange.end),
    ];
    brushRef.current.call(brush.move, initialSelection);
  }, [timeRange, brushTimeRange, onBrushChange]);

  return (
    <svg
      ref={svgRef}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      className="mx-auto"
    >
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g className="x-axis" transform={`translate(0,${height})`} />
        <g className="brush" />
      </g>
    </svg>
  );
};

