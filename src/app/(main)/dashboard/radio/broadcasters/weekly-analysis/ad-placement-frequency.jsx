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
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartCard from "@/components/card/charts-card";
import { LayoutPanelLeft } from "lucide-react";

const DATA = {
  "MYFM - Ahmednagar": {
    "daily": [
      {
        "name": "Swasthya ki Aradhana",
        "before": 5,
        "during": 10,
        "after": 4
      },
      {
        "name": "Salaam Ahmednagar",
        "before": 6,
        "during": 12,
        "after": 5
      },
      {
        "name": "Hum Tum",
        "before": 4,
        "during": 9,
        "after": 3
      },
      {
        "name": "Happy Evening",
        "before": 7,
        "during": 14,
        "after": 6
      },
      {
        "name": "Rock the Party",
        "before": 8,
        "during": 16,
        "after": 7
      }
    ],
    "weekly": [
      {
        "name": "Swasthya ki Aradhana",
        "before": 35,
        "during": 70,
        "after": 28
      },
      {
        "name": "Salaam Ahmednagar",
        "before": 42,
        "during": 84,
        "after": 35
      },
      {
        "name": "Hum Tum",
        "before": 28,
        "during": 63,
        "after": 21
      },
      {
        "name": "Happy Evening",
        "before": 49,
        "during": 98,
        "after": 42
      },
      {
        "name": "Rock the Party",
        "before": 56,
        "during": 112,
        "after": 49
      }
    ],
    "monthly": [
      {
        "name": "Swasthya ki Aradhana",
        "before": 150,
        "during": 300,
        "after": 120
      },
      {
        "name": "Salaam Ahmednagar",
        "before": 180,
        "during": 360,
        "after": 150
      },
      {
        "name": "Hum Tum",
        "before": 120,
        "during": 270,
        "after": 90
      },
      {
        "name": "Happy Evening",
        "before": 210,
        "during": 420,
        "after": 180
      },
      {
        "name": "Rock the Party",
        "before": 240,
        "during": 480,
        "after": 210
      }
    ]
  },
  "MangoFM - Kochi": {
    "daily": [
      {
        "name": "Superfast",
        "before": 3,
        "during": 6,
        "after": 2
      },
      {
        "name": "Timepass",
        "before": 4,
        "during": 8,
        "after": 3
      },
      {
        "name": "Josh Junction",
        "before": 5,
        "during": 10,
        "after": 4
      },
      {
        "name": "Citylights",
        "before": 6,
        "during": 12,
        "after": 5
      },
      {
        "name": "Jab We Met",
        "before": 7,
        "during": 14,
        "after": 6
      },
      {
        "name": "Back to Back",
        "before": 8,
        "during": 16,
        "after": 7
      }
    ],
    "weekly": [
      {
        "name": "Superfast",
        "before": 21,
        "during": 42,
        "after": 14
      },
      {
        "name": "Timepass",
        "before": 28,
        "during": 56,
        "after": 21
      },
      {
        "name": "Josh Junction",
        "before": 35,
        "during": 70,
        "after": 28
      },
      {
        "name": "Citylights",
        "before": 42,
        "during": 84,
        "after": 35
      },
      {
        "name": "Jab We Met",
        "before": 49,
        "during": 98,
        "after": 42
      },
      {
        "name": "Back to Back",
        "before": 56,
        "during": 112,
        "after": 49
      }
    ],
    "monthly": [
      {
        "name": "Superfast",
        "before": 90,
        "during": 180,
        "after": 60
      },
      {
        "name": "Timepass",
        "before": 120,
        "during": 240,
        "after": 90
      },
      {
        "name": "Josh Junction",
        "before": 150,
        "during": 300,
        "after": 120
      },
      {
        "name": "Citylights",
        "before": 180,
        "during": 360,
        "after": 150
      },
      {
        "name": "Jab We Met",
        "before": 210,
        "during": 420,
        "after": 180
      },
      {
        "name": "Back to Back",
        "before": 240,
        "during": 480,
        "after": 210
      }
    ]
  }
};

const AdPlacementFrequencyChart = () => {
  const [station, setStation] = useState("MYFM - Ahmednagar");
  const [timePeriod, setTimePeriod] = useState("daily");

  const handleStationChange = (value) => {
    setStation(value);
  };

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);
  };

  return (
    <ChartCard
      icon={<LayoutPanelLeft className="w-6 h-6" />}
      title="Ad Placement Frequency by Content"
      description="View ad distribution before, during, and after programs"
      action={
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Select Station</p>
            <Select value={station} onValueChange={handleStationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MYFM - Ahmednagar">MYFM - Ahmednagar</SelectItem>
                <SelectItem value="MangoFM - Kochi">MangoFM - Kochi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Select Time Period</p>
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
             barSize={120}
            data={DATA[station][timePeriod]}
            margin={{ top: 5, right: 30, left: 15, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              height={80}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              label={{
                value: "Number of Ads",
                angle: -90,
                position: "insideLeft",
                offset: -5,
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                const formattedName =
                  name.charAt(0).toUpperCase() + name.slice(1);
                return [`${value} ads`, `${formattedName} Program`];
              }}
            />
            <Legend />
            <Bar
              radius={8}
              dataKey="before"
              stackId="a"
              fill="#8884d8"
              name="Before Program"
            />
            <Bar
              radius={8}
              dataKey="during"
              stackId="a"
              fill="#82ca9d"
              name="During Program"
            />
            <Bar
              radius={8}
              dataKey="after"
              stackId="a"
              fill="#ffc658"
              name="After Program"
            />
          </BarChart>
        </ResponsiveContainer>
      }
      footer={
        <p className="text-sm text-gray-500">
          Displays distribution of ads across different program segments for {station}.
          Data shown for {timePeriod} frequency.
        </p>
      }
    />
  );
};

export default AdPlacementFrequencyChart;