"use client";
import React, { useRef, useState, useMemo } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Brush } from "@visx/brush";
import { PatternLines } from "@visx/pattern";
import { Group } from "@visx/group";
import { LinearGradient } from "@visx/gradient";
import { max, extent } from "d3-array";
import genBins from "@visx/mock-data/lib/generators/genBins";
import { HeatmapCircle, HeatmapRect } from "@visx/heatmap";
import { getSeededRandom } from "@visx/mock-data";
import AreaChart from "./AreaChart";

// Sample data for brush chart
const stock = [
  { date: "2020-01-01", close: 100 },
  { date: "2020-01-02", close: 105 },
  { date: "2020-01-03", close: 110 },
  { date: "2020-01-04", close: 108 },
  { date: "2020-01-05", close: 115 },
  { date: "2020-01-06", close: 120 },
  { date: "2020-01-07", close: 118 },
  { date: "2020-01-08", close: 125 },
  { date: "2020-01-09", close: 130 },
  { date: "2020-01-10", close: 128 },
].map((d) => ({ ...d, date: new Date(d.date) }));

// Heatmap constants and data
const hot1 = "#77312f";
const hot2 = "#f33d15";
const cool1 = "#122549";
const cool2 = "#b4fbde";
const background = "#28272c";

const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  16,
  16,
  (idx) => 150 * idx,
  (i, number) => 25 * (number - i) * seededRandom()
);

// Heatmap helper functions
const bins = (d) => d.bins;
const count = (d) => d.count;

const colorMax = Math.max(
  ...binData.map((d) => Math.max(...bins(d).map(count)))
);
const bucketSizeMax = Math.max(...binData.map((d) => bins(d).length));

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = "brush_pattern";
const GRADIENT_ID = "brush_gradient";
export const accentColor = "#f6acc8";
export const background2 = "#af8baf";
const selectedBrushStyle = {
  fill: `url(#${PATTERN_ID})`,
  stroke: "white",
};

// accessors
const getDate = (d) => d.date;
const getStockValue = (d) => d.close;

function BrushChart({
  compact = false,
  width = 800,
  height = 800, // Increased height to accommodate heatmap
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}) {
  const brushRef = useRef(null);
  const [filteredStock, setFilteredStock] = useState(stock);

  const onBrushChange = (domain) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;
    const stockCopy = stock.filter((s) => {
      const x = getDate(s).getTime();
      const y = getStockValue(s);
      return x > x0 && x < x1 && y > y0 && y < y1;
    });
    setFilteredStock(stockCopy);
  };

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = compact
    ? chartSeparation / 2
    : chartSeparation + 10;
  const topChartHeight = 0.4 * innerHeight - topChartBottomMargin;
  const bottomChartHeight = 0.2 * innerHeight - chartSeparation;
  const heatmapHeight = 0.4 * innerHeight;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);
  const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
  const yBrushMax = Math.max(
    bottomChartHeight - brushMargin.top - brushMargin.bottom,
    0
  );

  // scales for brush chart
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xMax],
        domain: extent(filteredStock, getDate),
      }),
    [xMax, filteredStock]
  );

  const stockScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        domain: [0, max(filteredStock, getStockValue) || 0],
        nice: true,
      }),
    [yMax, filteredStock]
  );

  const brushDateScale = useMemo(
    () =>
      scaleTime({
        range: [0, xBrushMax],
        domain: extent(stock, getDate),
      }),
    [xBrushMax]
  );

  const brushStockScale = useMemo(
    () =>
      scaleLinear({
        range: [yBrushMax, 0],
        domain: [0, max(stock, getStockValue) || 0],
        nice: true,
      }),
    [yBrushMax]
  );

  // scales for heatmap
  const xHeatmapScale = scaleLinear({
    domain: [0, binData.length],
    range: [0, xMax / 2],
  });

  const yHeatmapScale = scaleLinear({
    domain: [0, bucketSizeMax],
    range: [heatmapHeight, 0],
  });

  const circleColorScale = scaleLinear({
    range: [hot1, hot2],
    domain: [0, colorMax],
  });

  const rectColorScale = scaleLinear({
    range: [cool1, cool2],
    domain: [0, colorMax],
  });

  const opacityScale = scaleLinear({
    range: [0.1, 1],
    domain: [0, colorMax],
  });

  const initialBrushPosition = useMemo(
    () => ({
      start: { x: brushDateScale(getDate(stock[0])) },
      end: { x: brushDateScale(getDate(stock[Math.floor(stock.length / 3)])) },
    }),
    [brushDateScale]
  );

  const handleClearClick = () => {
    if (brushRef?.current) {
      setFilteredStock(stock);
      brushRef.current.reset();
    }
  };

  const handleResetClick = () => {
    if (brushRef?.current) {
      const updater = (prevBrush) => {
        const newExtent = brushRef.current.getExtent(
          initialBrushPosition.start,
          initialBrushPosition.end
        );

        return {
          ...prevBrush,
          start: { y: newExtent.y0, x: newExtent.x0 },
          end: { y: newExtent.y1, x: newExtent.x1 },
          extent: newExtent,
        };
      };
      brushRef.current.updateBrush(updater);
    }
  };

  const binWidth = xMax / 2 / binData.length;
  const binHeight = heatmapHeight / bucketSizeMax;
  const radius = Math.min(binWidth, binHeight) / 2;

  return (
    <div>
      <svg width={width} height={height}>
        <LinearGradient
          id={GRADIENT_ID}
          from={background}
          to={background2}
          rotate={45}
        />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${GRADIENT_ID})`}
          rx={14}
        />

        {/* Area Chart */}
        <AreaChart
          hideBottomAxis={compact}
          data={filteredStock}
          width={width}
          margin={{ ...margin, bottom: topChartBottomMargin }}
          yMax={yMax}
          xScale={dateScale}
          yScale={stockScale}
          gradientColor={background2}
        />

        {/* Brush Chart */}
        <AreaChart
          hideBottomAxis
          hideLeftAxis
          data={stock}
          width={width}
          yMax={yBrushMax}
          xScale={brushDateScale}
          yScale={brushStockScale}
          margin={brushMargin}
          top={topChartHeight + topChartBottomMargin + margin.top}
          gradientColor={background2}
        >
          <PatternLines
            id={PATTERN_ID}
            height={8}
            width={8}
            stroke={accentColor}
            strokeWidth={1}
            orientation={["diagonal"]}
          />
          <Brush
            xScale={brushDateScale}
            yScale={brushStockScale}
            width={xBrushMax}
            height={yBrushMax}
            margin={brushMargin}
            handleSize={8}
            innerRef={brushRef}
            resizeTriggerAreas={["left", "right"]}
            brushDirection="horizontal"
            initialBrushPosition={initialBrushPosition}
            onChange={onBrushChange}
            onClick={() => setFilteredStock(stock)}
            selectedBoxStyle={selectedBrushStyle}
            useWindowMoveEvents
            renderBrushHandle={(props) => <BrushHandle {...props} />}
          />
        </AreaChart>

        {/* Heatmap Section */}
        <Group
          top={topChartHeight + bottomChartHeight + margin.top + 60}
          left={margin.left}
        >
          <HeatmapCircle
            data={binData}
            xScale={(d) => xHeatmapScale(d) ?? 0}
            yScale={(d) => yHeatmapScale(d) ?? 0}
            colorScale={circleColorScale}
            opacityScale={opacityScale}
            radius={radius}
            gap={2}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => (
                  <circle
                    key={`heatmap-circle-${bin.row}-${bin.column}`}
                    className="visx-heatmap-circle"
                    cx={bin.cx}
                    cy={bin.cy}
                    r={bin.r}
                    fill={bin.color}
                    fillOpacity={bin.opacity}
                  />
                ))
              )
            }
          </HeatmapCircle>
        </Group>

        <Group
          top={topChartHeight + bottomChartHeight + margin.top + 60}
          left={xMax / 2 + margin.left + 20}
        >
          <HeatmapRect
            data={binData}
            xScale={(d) => xHeatmapScale(d) ?? 0}
            yScale={(d) => yHeatmapScale(d) ?? 0}
            colorScale={rectColorScale}
            opacityScale={opacityScale}
            binWidth={binWidth}
            binHeight={binHeight}
            gap={2}
          >
            {(heatmap) =>
              heatmap.map((heatmapBins) =>
                heatmapBins.map((bin) => (
                  <rect
                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                    className="visx-heatmap-rect"
                    width={bin.width}
                    height={bin.height}
                    x={bin.x}
                    y={bin.y}
                    fill={bin.color}
                    fillOpacity={bin.opacity}
                  />
                ))
              )
            }
          </HeatmapRect>
        </Group>
      </svg>
      <button onClick={handleClearClick}>Clear</button>&nbsp;
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
}

function BrushHandle({ x, height, isBrushActive }) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: "ew-resize" }}
      />
    </Group>
  );
}

export default BrushChart;
