"use client";
import React, { useState } from "react";
import { Group } from "@visx/group";
import {
  Treemap,
  hierarchy,
  stratify,
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
} from "@visx/hierarchy";
import { scaleLinear } from "@visx/scale";

// Sample Shakespeare data
const shakespeare = [
  {
    id: "root",
    parent: null,
  },
  {
    id: "plays",
    parent: "root",
  },
  {
    id: "histories",
    parent: "plays",
  },
  {
    id: "comedies",
    parent: "plays",
  },
  {
    id: "tragedies",
    parent: "plays",
  },
  {
    id: "henry4",
    parent: "histories",
    size: 500,
  },
  {
    id: "henry5",
    parent: "histories",
    size: 450,
  },
  {
    id: "richard3",
    parent: "histories",
    size: 480,
  },
  {
    id: "midsummer",
    parent: "comedies",
    size: 400,
  },
  {
    id: "tempest",
    parent: "comedies",
    size: 380,
  },
  {
    id: "muchado",
    parent: "comedies",
    size: 420,
  },
  {
    id: "hamlet",
    parent: "tragedies",
    size: 600,
  },
  {
    id: "macbeth",
    parent: "tragedies",
    size: 550,
  },
  {
    id: "othello",
    parent: "tragedies",
    size: 520,
  },
];

export const color1 = "#f3e9d2";
const color2 = "#4281a4";
export const background = "#114b5f";

const colorScale = scaleLinear({
  domain: [
    0,
    Math.max(...shakespeare.filter((d) => d.size).map((d) => d.size ?? 0)),
  ],
  range: [color2, color1],
});

const data = stratify()
  .id((d) => d.id)
  .parentId((d) => d.parent)(shakespeare)
  .sum((d) => d.size ?? 0);

const tileMethods = {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
};

const defaultMargin = { top: 10, left: 10, right: 10, bottom: 10 };

export default function TreemapDemo({
  width = 800, // default width
  height = 400, // default height
  margin = defaultMargin,
}) {
  const [tileMethod, setTileMethod] = useState("treemapSquarify");
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const root = hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0));

  return width < 10 ? null : (
    <div className="relative">
      <div className="mb-4">
        <label className="mr-2">Tile method:</label>
        <select
          className="p-2 border rounded"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setTileMethod(e.target.value)}
          value={tileMethod}
        >
          {Object.keys(tileMethods).map((tile) => (
            <option key={tile} value={tile}>
              {tile}
            </option>
          ))}
        </select>
      </div>
      <div>
        <svg width={width} height={height}>
          <rect width={width} height={height} rx={14} fill={background} />
          <Treemap
            top={margin.top}
            root={root}
            size={[xMax, yMax]}
            tile={tileMethods[tileMethod]}
            round
          >
            {(treemap) => (
              <Group>
                {treemap
                  .descendants()
                  .reverse()
                  .map((node, i) => {
                    const nodeWidth = node.x1 - node.x0;
                    const nodeHeight = node.y1 - node.y0;
                    return (
                      <Group
                        key={`node-${i}`}
                        top={node.y0 + margin.top}
                        left={node.x0 + margin.left}
                      >
                        {node.depth === 1 && (
                          <rect
                            width={nodeWidth}
                            height={nodeHeight}
                            stroke={background}
                            strokeWidth={4}
                            fill="transparent"
                          />
                        )}
                        {node.depth > 2 && (
                          <>
                            <rect
                              width={nodeWidth}
                              height={nodeHeight}
                              stroke={background}
                              fill={colorScale(node.value || 0)}
                            />
                            {nodeWidth > 30 && nodeHeight > 30 && (
                              <text
                                x={nodeWidth / 2}
                                y={nodeHeight / 2}
                                textAnchor="middle"
                                dy=".3em"
                                fontSize={12}
                                fill={background}
                              >
                                {node.data.id}
                              </text>
                            )}
                          </>
                        )}
                      </Group>
                    );
                  })}
              </Group>
            )}
          </Treemap>
        </svg>
      </div>
    </div>
  );
}
