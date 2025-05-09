import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";
import { BarChart2 } from "lucide-react";

// Persona descriptions
const personaDescriptions = {
  "urban-budget":
    "Urban Budget Shopper (Female-Focused): Shows compact viewing pattern focused on news and entertainment, with strong preference for mainstream channels",
  "urban-professional":
    "Urban Young Professional (Male-Focused): Demonstrates sophisticated viewing pattern across premium channels with high engagement in news and lifestyle content",
  "rural-aspiring":
    "Rural Aspiring Consumer (Male-Focused): Exhibits traditional viewing habits with strong loyalty to regional content and gradual transition to mainstream channels",
  "value-homemaker":
    "Value-Seeking Homemaker (Female-Focused): Shows diverse viewing pattern across multiple channels with focus on entertainment and news content",
};

// Channel data
const channels = [
  { name: "NTV", color: "#EB5A3C" },
  { name: "Kantipur TV", color: "#0D92F4" },
  { name: "Image Channel", color: "#A9C46C" },
  { name: "Avenues TV", color: "#9694FF" },
  { name: "Himalaya TV", color: "#F3C623" },
];


const PersonaTimeSpentChart = () => {
  const [selectedChannel, setSelectedChannel] = useState("NTV");

  // Example data (replace with real data fetching logic)
  const generatePersonaTimeSpentData = (channel) => {
    const personaData = Object.keys(personaDescriptions).map((persona) => ({
      name: persona.replace("-", " ").toUpperCase(),
      timeSpent: Math.floor(Math.random() * 100) + 1, // Random time spent data (in minutes)
    }));

    return personaData;
  };

  const personaTimeSpentData = generatePersonaTimeSpentData(selectedChannel);

  return (
    <ChartCard
      icon={<BarChart2 className="w-6 h-6" />}
      title="Time Spent by Personas on Channel"
      description="View time spent by personas on the selected channel."
      action={
        <div>
          <p className="text-sm font-medium mb-2">Select Channel</p>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              {channels.map((channel) => (
                <SelectItem key={channel.name} value={channel.name}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={personaTimeSpentData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
              tickFormatter={(value) => `${value} m`}
            />
            <Tooltip formatter={(value) => `${value} minutes`} />
            {/* <Legend /> */}
            <Bar
              dataKey="timeSpent"
              className="fill-primary"
              name="Time Spent (mins)"
              radius={16}
            >
              <LabelList
                position="center"
                offset={12}
                className="fill-foreground/75"
                fontSize={16}
                fontWeight={600}
                formatter={(value) => `${value} mins`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Data generated dynamically. Updated based on your selection.
        </p>
      }
    />
  );
};

export default PersonaTimeSpentChart;
