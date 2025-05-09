"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid } from "recharts"
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
const adClusteringData = [
  { hour: "6 PM", match1: 5, match2: 3, match3: 2, match4: 4 },
  { hour: "7 PM", match1: 15, match2: 12, match3: 10, match4: 14 },
  { hour: "8 PM", match1: 20, match2: 18, match3: 16, match4: 19 },
  { hour: "9 PM", match1: 22, match2: 20, match3: 18, match4: 21 },
  { hour: "10 PM", match1: 18, match2: 15, match3: 14, match4: 17 },
  { hour: "11 PM", match1: 10, match2: 8, match3: 7, match4: 9 },
  { hour: "12 AM", match1: 3, match2: 2, match3: 1, match4: 2 },
]

const reachVsDurationData = [
  { time: "6 PM", duration: 120, reach: 50000 },
  { time: "7 PM", duration: 180, reach: 80000 },
  { time: "8 PM", duration: 200, reach: 100000 },
  { time: "9 PM", duration: 220, reach: 120000 },
  { time: "10 PM", duration: 180, reach: 90000 },
  { time: "11 PM", duration: 150, reach: 70000 },
  { time: "12 AM", duration: 100, reach: 40000 },
]

const topPlacementsData = [
  { placement: "Jersey", visibility: 300 },
  { placement: "Boundary", visibility: 250 },
  { placement: "Billboard", visibility: 200 },
  { placement: "Overlay", visibility: 150 },
  { placement: "Sideline", visibility: 100 },
]

// Chart configurations
const clusteringConfig = {
  match1: { label: "Match 1", color: "hsl(var(--chart-1))" },
  match2: { label: "Match 2", color: "hsl(var(--chart-2))" },
  match3: { label: "Match 3", color: "hsl(var(--chart-3))" },
  match4: { label: "Match 4", color: "hsl(var(--chart-4))" },
}

const reachVsDurationConfig = {
  reach: { label: "Reach", color: "hsl(var(--chart-1))" },
  duration: { label: "Duration", color: "hsl(var(--chart-2))" },
}

const topPlacementsConfig = {
  visibility: { label: "Visibility", color: "hsl(var(--chart-1))" },
}

export function AdBreakStrategy() {
  const [periodFilter, setPeriodFilter] = useState("all")

  // Filter data based on period
  const filteredAdClusteringData = periodFilter === "all" 
    ? adClusteringData 
    : adClusteringData.filter(d => {
        if (periodFilter === "prime") return ["7 PM", "8 PM", "9 PM", "10 PM"].includes(d.hour)
        return d.hour === periodFilter
      })

  const filteredReachVsDurationData = periodFilter === "all"
    ? reachVsDurationData
    : reachVsDurationData.filter(d => {
        if (periodFilter === "prime") return ["7 PM", "8 PM", "9 PM", "10 PM"].includes(d.time)
        return d.time === periodFilter
      })

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Ad Break Strategy</h1>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Periods</SelectItem>
            <SelectItem value="prime">Prime Time (7-11 PM)</SelectItem>
            <SelectItem value="6 PM">6 PM</SelectItem>
            <SelectItem value="7 PM">7 PM</SelectItem>
            <SelectItem value="8 PM">8 PM</SelectItem>
            <SelectItem value="9 PM">9 PM</SelectItem>
            <SelectItem value="10 PM">10 PM</SelectItem>
            <SelectItem value="11 PM">11 PM</SelectItem>
            <SelectItem value="12 AM">12 AM</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ad Clustering</CardTitle>
            <CardDescription>Ad minutes per match hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-2">
              <div />
              <div className="text-center text-sm">Match 1</div>
              <div className="text-center text-sm">Match 2</div>
              <div className="text-center text-sm">Match 3</div>
              <div className="text-center text-sm">Match 4</div>
              {filteredAdClusteringData.map((row, rowIndex) => (
                <>
                  <div key={`hour-${rowIndex}`} className={`text-sm font-medium flex items-center ${["7 PM", "8 PM", "9 PM", "10 PM"].includes(row.hour) ? "bg-primary/10" : ""}`}>
                    {row.hour}
                  </div>
                  {["match1", "match2", "match3", "match4"].map((match, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="h-12 rounded"
                      style={{
                        backgroundColor: `hsl(240, 70%, ${100 - row[match] * 3}%)`,
                      }}
                    />
                  ))}
                </>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Prime time peak at 9 PM <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Darker colors indicate higher ad density
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reach vs. Duration</CardTitle>
            <CardDescription>Ad impact by match time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={reachVsDurationConfig}>
              <ScatterChart
                accessibilityLayer
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid />
                <XAxis
                  type="category"
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis type="number" dataKey="duration" name="Duration (s)" />
                <ZAxis type="number" dataKey="reach" name="Reach" range={[100, 1000]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Scatter name="Ads" data={filteredReachVsDurationData} fill="var(--color-reach)" />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Highest reach at 9 PM <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Bubble size represents reach
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Placements</CardTitle>
            <CardDescription>Ranking by visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={topPlacementsConfig}>
              <BarChart
                accessibilityLayer
                data={topPlacementsData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="placement"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="visibility" fill="var(--color-visibility)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Jersey leads visibility <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing total visibility minutes
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}