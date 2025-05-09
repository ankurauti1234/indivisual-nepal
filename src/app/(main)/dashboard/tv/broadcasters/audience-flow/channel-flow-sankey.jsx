'use client'

import { useState } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ChartCard from '@/components/card/charts-card'
import { LineChartIcon } from 'lucide-react'

// Import the data
const personaFlows = {
  "urban-budget": {
    archetype: "urban-budget",
    nodes: [
      {
        name: "Kantipur TV",
      },
      {
        name: "News24",
      },
      {
        name: "Image Channel",
      },
      {
        name: "AP1 TV",
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: 4993,
        sourceName: "Kantipur TV",
        targetName: "News24",
      },
      {
        source: 0,
        target: 2,
        value: 2820,
        sourceName: "Kantipur TV",
        targetName: "Image Channel",
      },
      {
        source: 0,
        target: 3,
        value: 2440,
        sourceName: "Kantipur TV",
        targetName: "AP1 TV",
      },
      {
        source: 1,
        target: 2,
        value: 3116,
        sourceName: "News24",
        targetName: "Image Channel",
      },
      {
        source: 1,
        target: 3,
        value: 2120,
        sourceName: "News24",
        targetName: "AP1 TV",
      },
      {
        source: 2,
        target: 3,
        value: 5270,
        sourceName: "Image Channel",
        targetName: "AP1 TV",
      },
    ],
  },
  "urban-professional": {
    archetype: "urban-professional",
    nodes: [
      {
        name: "Nepal Television",
      },
      {
        name: "Prime Times",
      },
      {
        name: "Avenues TV",
      },
      {
        name: "Himalaya TV",
      },
      {
        name: "Galaxy 4K",
      },
      {
        name: "ABC News",
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: 1058,
        sourceName: "Nepal Television",
        targetName: "Prime Times",
      },
      {
        source: 0,
        target: 2,
        value: 3096,
        sourceName: "Nepal Television",
        targetName: "Avenues TV",
      },
      {
        source: 0,
        target: 3,
        value: 4808,
        sourceName: "Nepal Television",
        targetName: "Himalaya TV",
      },
      {
        source: 0,
        target: 4,
        value: 2181,
        sourceName: "Nepal Television",
        targetName: "Galaxy 4K",
      },
      {
        source: 0,
        target: 5,
        value: 2107,
        sourceName: "Nepal Television",
        targetName: "ABC News",
      },
      {
        source: 1,
        target: 2,
        value: 5221,
        sourceName: "Prime Times",
        targetName: "Avenues TV",
      },
      {
        source: 1,
        target: 3,
        value: 3521,
        sourceName: "Prime Times",
        targetName: "Himalaya TV",
      },
      {
        source: 1,
        target: 4,
        value: 4773,
        sourceName: "Prime Times",
        targetName: "Galaxy 4K",
      },
      {
        source: 1,
        target: 5,
        value: 5342,
        sourceName: "Prime Times",
        targetName: "ABC News",
      },
      {
        source: 2,
        target: 3,
        value: 4699,
        sourceName: "Avenues TV",
        targetName: "Himalaya TV",
      },
      {
        source: 2,
        target: 4,
        value: 2928,
        sourceName: "Avenues TV",
        targetName: "Galaxy 4K",
      },
      {
        source: 2,
        target: 5,
        value: 5508,
        sourceName: "Avenues TV",
        targetName: "ABC News",
      },
      {
        source: 3,
        target: 4,
        value: 4958,
        sourceName: "Himalaya TV",
        targetName: "Galaxy 4K",
      },
      {
        source: 3,
        target: 5,
        value: 1750,
        sourceName: "Himalaya TV",
        targetName: "ABC News",
      },
      {
        source: 4,
        target: 5,
        value: 5614,
        sourceName: "Galaxy 4K",
        targetName: "ABC News",
      },
    ],
  },
  "rural-aspiring": {
    archetype: "rural-aspiring",
    nodes: [
      {
        name: "NTV",
      },
      {
        name: "Image Channel",
      },
      {
        name: "Mountain TV",
      },
      {
        name: "Nepal Television",
      },
      {
        name: "TV Today",
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: 1277,
        sourceName: "NTV",
        targetName: "Image Channel",
      },
      {
        source: 0,
        target: 2,
        value: 3601,
        sourceName: "NTV",
        targetName: "Mountain TV",
      },
      {
        source: 0,
        target: 3,
        value: 3570,
        sourceName: "NTV",
        targetName: "Nepal Television",
      },
      {
        source: 0,
        target: 4,
        value: 1709,
        sourceName: "NTV",
        targetName: "TV Today",
      },
      {
        source: 1,
        target: 2,
        value: 5416,
        sourceName: "Image Channel",
        targetName: "Mountain TV",
      },
      {
        source: 1,
        target: 3,
        value: 2316,
        sourceName: "Image Channel",
        targetName: "Nepal Television",
      },
      {
        source: 1,
        target: 4,
        value: 2799,
        sourceName: "Image Channel",
        targetName: "TV Today",
      },
      {
        source: 2,
        target: 3,
        value: 4272,
        sourceName: "Mountain TV",
        targetName: "Nepal Television",
      },
      {
        source: 2,
        target: 4,
        value: 1794,
        sourceName: "Mountain TV",
        targetName: "TV Today",
      },
      {
        source: 3,
        target: 4,
        value: 1960,
        sourceName: "Nepal Television",
        targetName: "TV Today",
      },
    ],
  },
  "value-homemaker": {
    archetype: "value-homemaker",
    nodes: [
      {
        name: "Kantipur TV",
      },
      {
        name: "Himalaya TV",
      },
      {
        name: "Prime Times",
      },
      {
        name: "News24",
      },
      {
        name: "Nepal Television",
      },
      {
        name: "ABC News",
      },
      {
        name: "TV Today",
      },
    ],
    links: [
      {
        source: 0,
        target: 1,
        value: 1490,
        sourceName: "Kantipur TV",
        targetName: "Himalaya TV",
      },
      {
        source: 0,
        target: 2,
        value: 5469,
        sourceName: "Kantipur TV",
        targetName: "Prime Times",
      },
      {
        source: 0,
        target: 3,
        value: 2210,
        sourceName: "Kantipur TV",
        targetName: "News24",
      },
      {
        source: 0,
        target: 4,
        value: 2857,
        sourceName: "Kantipur TV",
        targetName: "Nepal Television",
      },
      {
        source: 0,
        target: 5,
        value: 2221,
        sourceName: "Kantipur TV",
        targetName: "ABC News",
      },
      {
        source: 0,
        target: 6,
        value: 3239,
        sourceName: "Kantipur TV",
        targetName: "TV Today",
      },
      {
        source: 1,
        target: 2,
        value: 5893,
        sourceName: "Himalaya TV",
        targetName: "Prime Times",
      },
      {
        source: 1,
        target: 3,
        value: 4871,
        sourceName: "Himalaya TV",
        targetName: "News24",
      },
      {
        source: 1,
        target: 4,
        value: 5022,
        sourceName: "Himalaya TV",
        targetName: "Nepal Television",
      },
      {
        source: 1,
        target: 5,
        value: 5647,
        sourceName: "Himalaya TV",
        targetName: "ABC News",
      },
      {
        source: 1,
        target: 6,
        value: 1271,
        sourceName: "Himalaya TV",
        targetName: "TV Today",
      },
      {
        source: 2,
        target: 3,
        value: 3536,
        sourceName: "Prime Times",
        targetName: "News24",
      },
      {
        source: 2,
        target: 4,
        value: 2672,
        sourceName: "Prime Times",
        targetName: "Nepal Television",
      },
      {
        source: 2,
        target: 5,
        value: 3559,
        sourceName: "Prime Times",
        targetName: "ABC News",
      },
      {
        source: 2,
        target: 6,
        value: 5293,
        sourceName: "Prime Times",
        targetName: "TV Today",
      },
      {
        source: 3,
        target: 4,
        value: 1881,
        sourceName: "News24",
        targetName: "Nepal Television",
      },
      {
        source: 3,
        target: 5,
        value: 5430,
        sourceName: "News24",
        targetName: "ABC News",
      },
      {
        source: 3,
        target: 6,
        value: 4265,
        sourceName: "News24",
        targetName: "TV Today",
      },
      {
        source: 4,
        target: 5,
        value: 5718,
        sourceName: "Nepal Television",
        targetName: "ABC News",
      },
      {
        source: 4,
        target: 6,
        value: 4086,
        sourceName: "Nepal Television",
        targetName: "TV Today",
      },
      {
        source: 5,
        target: 6,
        value: 5583,
        sourceName: "ABC News",
        targetName: "TV Today",
      },
    ],
  },
};



// Define a color map for the channels
const channelColors = {
  "Kantipur TV": "#1F77B4", // Strong blue
  News24: "#FF7F0E", // Bright orange
  "Image Channel": "#2CA02C", // Fresh green
  "AP1 TV": "#D62728", // Vivid red
  "Nepal Television": "#9467BD", // Rich purple
  "Prime Times": "#8C564B", // Earthy brown
  "Avenues TV": "#E377C2", // Soft pink
  "Himalaya TV": "#17BECF", // Cool cyan
  "Galaxy 4K": "#BCBD22", // Olive yellow
  "ABC News": "#AEC7E8", // Light blue
  NTV: "#FF9896", // Peach
  "Mountain TV": "#C5B0D5", // Lavender
  "TV Today": "#98DF8A", // Pastel green
};


// Helper function to format the persona key for display
const formatPersonaName = (key) => {
  return key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export default function TVChannelSankeyChart() {
  const [selectedPersona, setSelectedPersona] = useState("urban-budget")

  // Transform the data for the selected persona to match Nivo's expected format
  const transformData = (persona) => {
    return {
      nodes: persona.nodes.map((node, index) => ({
        id: node.name,
        color: channelColors[node.name] || '#000000'
      })),
      links: persona.links.map(link => ({
        source: link.sourceName,
        target: link.targetName,
        value: link.value
      }))
    }
  }

  const data = transformData(personaFlows[selectedPersona])

  return (
    <ChartCard
      icon={<LineChartIcon className="w-6 h-6" />}
      title="TV Channel Audience Flow"
      description="Visualizing audience flow across TV channels for various personas"
      action={
        <Select
          onValueChange={setSelectedPersona}
          defaultValue={selectedPersona}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a persona" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(personaFlows).map((persona) => (
              <SelectItem key={persona} value={persona}>
                {formatPersonaName(persona)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
      chart={
        <div style={{ height: "500px" }}>
          <ResponsiveSankey
            data={data}
            margin={{ top: 40, right: 150, bottom: 40, left: 150 }}
            align="justify"
            sort="auto"
            colors={(node) => node.color || "#000000"}
            nodeOpacity={100}
            nodeThickness={18}
            nodeInnerPadding={3}
            nodeSpacing={24}
            nodeBorderWidth={0}
            linkOpacity={0.75}
            linkHoverOthersOpacity={0.1}
            // enableLinkGradient={true}
            labelPosition="inside"
            labelOrientation="vertical"
            labelPadding={16}
            labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
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
                {link ? (
                  <>
                    <strong>{link.source}</strong> →{" "}
                    <strong>{link.target}</strong>:{" "}
                    {link.value.toLocaleString()} viewers
                  </>
                ) : (
                  <>
                    <strong>{node.id}</strong>: {node.value.toLocaleString()}{" "}
                    viewers
                  </>
                )}
              </div>
            )}
          />
        </div>
      }
      footer={
        <p className="text-sm text-gray-500">
          Data generated dynamically. Updated based on your selection.
        </p>
      }
    />
  );
}

