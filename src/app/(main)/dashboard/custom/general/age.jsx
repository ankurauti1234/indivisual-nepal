"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tvProgramData = [
  {
    age: "13-17",
    "Program A": 10,
    "Program B": 15,
    "Program C": 5,
    "Program D": 12,
    "Program E": 8,
  },
  {
    age: "18-24",
    "Program A": 20,
    "Program B": 25,
    "Program C": 15,
    "Program D": 22,
    "Program E": 18,
  },
  {
    age: "25-34",
    "Program A": 35,
    "Program B": 30,
    "Program C": 40,
    "Program D": 32,
    "Program E": 38,
  },
  {
    age: "35-44",
    "Program A": 25,
    "Program B": 20,
    "Program C": 30,
    "Program D": 24,
    "Program E": 26,
  },
  {
    age: "45+",
    "Program A": 10,
    "Program B": 10,
    "Program C": 10,
    "Program D": 10,
    "Program E": 10,
  },
];

export function TVProgramComparisonChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>TV Program Audience Comparison</CardTitle>
        <CardDescription>
          Competitive analysis across age groups
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <BarChart
          layout="vertical"
          width={700}
          height={500}
          data={tvProgramData}
          margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="age" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Program A" fill="hsl(var(--chart-1))">
            <LabelList dataKey="Program A" position="right" />
          </Bar>
          <Bar dataKey="Program B" fill="hsl(var(--chart-2))">
            <LabelList dataKey="Program B" position="right" />
          </Bar>
          <Bar dataKey="Program C" fill="hsl(var(--chart-3))">
            <LabelList dataKey="Program C" position="right" />
          </Bar>
          <Bar dataKey="Program D" fill="hsl(var(--chart-4))">
            <LabelList dataKey="Program D" position="right" />
          </Bar>
          <Bar dataKey="Program E" fill="hsl(var(--chart-5))">
            <LabelList dataKey="Program E" position="right" />
          </Bar>
        </BarChart>
      </CardContent>
      <CardDescription className="text-center mt-4 text-muted-foreground">
        Unique Insight: Labels on bars help identify exact values for better
        readability.
      </CardDescription>
    </Card>
  );
}

export default TVProgramComparisonChart;
