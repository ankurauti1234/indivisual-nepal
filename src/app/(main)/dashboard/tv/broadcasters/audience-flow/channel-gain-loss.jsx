import React, { useState, useEffect } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { LineChartIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";

const allChannels = [
  "Kantipur TV",
  "Nepal Television",
  "NTV",
  "Image Channel",
  "Avenues TV",
  "Himalaya TV",
  "News24",
  "Prime Times",
  "Mountain TV",
  "Galaxy 4K",
];

const ChannelFlowAnalysis = () => {
  const [sourceChannel, setSourceChannel] = useState("Nepal Television");
  const [mainChannel, setMainChannel] = useState("Kantipur TV");
  const [targetChannel, setTargetChannel] = useState("Image Channel");

  const generateFlowData = () => {
    // Generate base audience numbers for each channel
    const targetAudience = Math.floor(Math.random() * 50000) + 30000;
    const mainAudience = Math.floor(Math.random() * 70000) + 50000;
    const sourceAudience = Math.floor(Math.random() * 40000) + 20000;

    // Generate flow numbers
    const targetToMain = Math.floor(Math.random() * 5000) + 3000;
    const mainToSource = Math.floor(Math.random() * 4000) + 2000;

    return {
      nodes: [
        {
          id: targetChannel,
          nodeColor: "#16C47F",
          totalAudience: targetAudience,
        },
        {
          id: mainChannel,
          nodeColor: "#FF9D23",
          totalAudience: mainAudience,
        },
        {
          id: sourceChannel,
          nodeColor: "#F93827",
          totalAudience: sourceAudience,
        },
      ],
      links: [
        {
          source: targetChannel,
          target: mainChannel,
          value: targetToMain,
          gradient: ["#16C47F", "#FF9D23"],
        },
        {
          source: mainChannel,
          target: sourceChannel,
          value: mainToSource,
          gradient: ["#FF9D23", "#F93827"],
        },
      ],
    };
  };

  const [flowData, setFlowData] = useState(generateFlowData());

  useEffect(() => {
    setFlowData(generateFlowData());
  }, [sourceChannel, mainChannel, targetChannel]);

  const getAvailableChannels = (excludeChannels) => {
    return allChannels.filter((channel) => !excludeChannels.includes(channel));
  };

  const customColors = {
    [targetChannel]: "#16C47F",
    [mainChannel]: "#FF9D23",
    [sourceChannel]: "#F93827",
  };

  return (
    <ChartCard
      icon={<LineChartIcon className="w-6 h-6" />}
      title="Channel Audience Flow Analysis"
      description="Analyze audience movement between TV channels"
      action={
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Target Channel (Source)</p>
            <Select value={targetChannel} onValueChange={setTargetChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Select target channel" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableChannels([sourceChannel, mainChannel]).map(
                  (channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Main Channel</p>
            <Select value={mainChannel} onValueChange={setMainChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Select main channel" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableChannels([sourceChannel, targetChannel]).map(
                  (channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Source Channel (Target)</p>
            <Select value={sourceChannel} onValueChange={setSourceChannel}>
              <SelectTrigger>
                <SelectValue placeholder="Select source channel" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableChannels([mainChannel, targetChannel]).map(
                  (channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      chart={
        <div style={{ height: "400px" }}>
          <ResponsiveSankey
            data={flowData}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={(node) => customColors[node.id] || "#000000"}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderColor={{
              from: "color",
              modifiers: [["darker", 0.8]],
            }}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={0.5}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="vertical"
            labelPadding={16}
            label={(node) =>
              `${node.id}\n(${node.totalAudience.toLocaleString()} viewers)`
            }
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1]],
            }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 130,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: "right-to-left",
                itemsSpacing: 2,
                itemTextColor: "#999",
                symbolSize: 14,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
            tooltip={({ node, link }) => (
              <div
                style={{
                  background: "white",
                  padding: "9px 12px",
                  border: "1px solid #ccc",
                }}
              >
                {node ? (
                  <div>
                    <strong>{node.id}</strong>
                    <br />
                    Total Audience: {node.totalAudience.toLocaleString()}{" "}
                    viewers
                  </div>
                ) : (
                  <div>
                    <strong>{link.source.id}</strong> →{" "}
                    <strong>{link.target.id}</strong>
                    <br />
                    Viewers Moved: {link.value.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Data shows total audience per channel and viewer movement between
          channels. Numbers are simulated.
        </p>
      }
    />
  );
};

export default ChannelFlowAnalysis;
