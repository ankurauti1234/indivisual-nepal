"use client"

import { TrendingUp } from "lucide-react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

// Sample data
const brandSOVData = {
  all: [
    { name: "Brand A", value: 35 },
    { name: "Brand B", value: 25 },
    { name: "Brand C", value: 20 },
    { name: "Brand D", value: 10 },
    { name: "Brand E", value: 5 },
    { name: "Others", value: 5 },
  ],
  tech: [
    { name: "Tech A", value: 40 },
    { name: "Tech B", value: 30 },
    { name: "Tech C", value: 20 },
    { name: "Tech D", value: 7 },
    { name: "Tech E", value: 3 },
    { name: "Others", value: 0 },
  ],
  retail: [
    { name: "Retail A", value: 30 },
    { name: "Retail B", value: 25 },
    { name: "Retail C", value: 20 },
    { name: "Retail D", value: 15 },
    { name: "Retail E", value: 8 },
    { name: "Others", value: 2 },
  ],
}

const sectorTrendsData = {
  all: [
    { phase: "Group", tech: 30, retail: 25, auto: 20 },
    { phase: "Knockout", tech: 35, retail: 20, auto: 25 },
    { phase: "Quarterfinals", tech: 40, retail: 22, auto: 18 },
    { phase: "Semifinals", tech: 38, retail: 28, auto: 20 },
    { phase: "Finals", tech: 45, retail: 30, auto: 15 },
  ],
  tech: [
    { phase: "Group", tech: 35, retail: 0, auto: 0 },
    { phase: "Knockout", tech: 40, retail: 0, auto: 0 },
    { phase: "Quarterfinals", tech: 45, retail: 0, auto: 0 },
    { phase: "Semifinals", tech: 42, retail: 0, auto: 0 },
    { phase: "Finals", tech: 50, retail: 0, auto: 0 },
  ],
  retail: [
    { phase: "Group", tech: 0, retail: 30, auto: 0 },
    { phase: "Knockout", tech: 0, retail: 25, auto: 0 },
    { phase: "Quarterfinals", tech: 0, retail: 28, auto: 0 },
    { phase: "Semifinals", tech: 0, retail: 32, auto: 0 },
    { phase: "Finals", tech: 0, retail: 35, auto: 0 },
  ],
}

const heatmapData = {
  all: [
    { brand: "Brand A", match1: 80, match2: 60, match3: 90, match4: 70 },
    { brand: "Brand B", match1: 50, match2: 70, match3: 40, match4: 60 },
    { brand: "Brand C", match1: 30, match2: 20, match3: 50, match4: 40 },
  ],
  tech: [
    { brand: "Tech A", match1: 90, match2: 70, match3: 85, match4: 80 },
    { brand: "Tech B", match1: 60, match2: 80, match3: 50, match4: 70 },
    { brand: "Tech C", match1: 40, match2: 30, match3: 60, match4: 50 },
  ],
  retail: [
    { brand: "Retail A", match1: 70, match2: 50, match3: 80, match4: 60 },
    { brand: "Retail B", match1: 40, match2: 60, match3: 30, match4: 50 },
    { brand: "Retail C", match1: 20, match2: 30, match3: 40, match4: 30 },
  ],
}

// Chart configurations
const sovConfig = {
  value: {
    label: "Share of Voice",
    color: "hsl(var(--chart-1))",
  },
}

const sectorConfig = {
  tech: {
    label: "Tech",
    color: "hsl(var(--chart-1))",
  },
  retail: {
    label: "Retail",
    color: "hsl(var(--chart-2))",
  },
  auto: {
    label: "Auto",
    color: "hsl(var(--chart-3))",
  },
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
]

export function ShareOfVoice() {
  const [viewFilter, setViewFilter] = useState("all")

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Share of Voice</h1>
        <Select value={viewFilter} onValueChange={setViewFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Share of Voice</CardTitle>
            <CardDescription>Top 5 brands + Others</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sovConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={brandSOVData[viewFilter]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {brandSOVData[viewFilter].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Finals spike for Brand A <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Click slices to drill down
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sector Trends</CardTitle>
            <CardDescription>Across match phases</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sectorConfig}>
              <LineChart
                accessibilityLayer
                data={sectorTrendsData[viewFilter]}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="phase"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                {viewFilter === "all" ? (
                  <>
                    <Line type="monotone" dataKey="tech" stroke="var(--color-tech)" />
                    <Line type="monotone" dataKey="retail" stroke="var(--color-retail)" />
                    <Line type="monotone" dataKey="auto" stroke="var(--color-auto)" />
                  </>
                ) : (
                  <Line type="monotone" dataKey={viewFilter} stroke={`var(--color-${viewFilter})`} />
                )}
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Tech peaks in Finals <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing sector dominance trends
            </div>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consistency Heatmap</CardTitle>
            <CardDescription>Exposure across matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-2">
              <div />
              <div className="text-center text-sm">Match 1</div>
              <div className="text-center text-sm">Match 2</div>
              <div className="text-center text-sm">Match 3</div>
              <div className="text-center text-sm">Match 4</div>
              {heatmapData[viewFilter].map((row, rowIndex) => (
                <>
                  <div key={`brand-${rowIndex}`} className="text-sm font-medium flex items-center">
                    {row.brand}
                  </div>
                  {["match1", "match2", "match3", "match4"].map((match, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="h-12 rounded"
                      style={{
                        backgroundColor: `hsl(240, 70%, ${100 - row[match]}%)`,
                      }}
                    />
                  ))}
                </>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Brand A consistent across matches <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Darker colors indicate higher exposure
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}