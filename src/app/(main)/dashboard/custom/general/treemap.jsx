import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const ChannelTreemap = () => {
  const data = {
    name: "Channels",
    children: [
      {
        name: "Channel 1",
        size: 35,
        fill: "#8884d8",
      },
      {
        name: "Channel 2",
        size: 25,
        fill: "#83a6ed",
      },
      {
        name: "Channel 3",
        size: 20,
        fill: "#8dd1e1",
      },
      {
        name: "Channel 4",
        size: 15,
        fill: "#82ca9d",
      },
      {
        name: "Channel 5",
        size: 5,
        fill: "#a4de6c",
      },
    ],
  };

  const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, name, size } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={props.fill}
          stroke="#fff"
          strokeWidth={2}
        />
        {width > 50 && height > 50 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            className="text-sm font-medium"
          >
            <tspan x={x + width / 2} dy="-0.5em">
              {name}
            </tspan>
            <tspan x={x + width / 2} dy="1.5em">{`${size}%`}</tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-600">
            Audience Share: {payload[0].payload.size}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Channel Audience Share Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={data.children}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomizedContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          {data.children.map((channel, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: channel.fill }}
              />
              <span className="text-sm">
                {channel.name}: {channel.size}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelTreemap;
