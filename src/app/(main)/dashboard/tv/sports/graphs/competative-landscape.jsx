"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { GanttChart } from "lucide-react"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

// Sample data for charts
const brandBattleData = [
  { brand: "Brand A", frequency: 120, duration: 1800 },
  { brand: "Brand B", frequency: 90, duration: 1500 },
  { brand: "Brand C", frequency: 80, duration: 1200 },
  { brand: "Brand D", frequency: 60, duration: 900 },
  { brand: "Brand E", frequency: 50, duration: 600 },
]

const sectorClashData = [
  { sector: "Tech", brandA: 30, brandB: 20, brandC: 15 },
  { sector: "Retail", brandA: 25, brandB: 15, brandC: 10 },
  { sector: "Auto", brandA: 20, brandB: 10, brandC: 5 },
]

const adOverlapData = [
  { brand: "Brand A", start: 0, end: 300 },
  { brand: "Brand B", start: 200, end: 500 },
  { brand: "Brand C", start: 400, end: 700 },
  { brand: "Brand D", start: 600, end: 900 },
]

// Chart configurations
const brandBattleConfig = {
  frequency: {
    label: "Frequency",
    color: "hsl(var(--chart-1))",
  },
  duration: {
    label: "Duration (s)",
    color: "hsl(var(--chart-2))",
  },
}

const sectorClashConfig = {
  brandA: {
    label: "Brand A",
    color: "hsl(var(--chart-1))",
  },
  brandB: {
    label: "Brand B",
    color: "hsl(var(--chart-2))",
  },
  brandC: {
    label: "Brand C",
    color: "hsl(var(--chart-3))",
  },
}

export function CompetitiveLandscape() {
  const [sectorFilter, setSectorFilter] = useState("all")
  const [matchFilter, setMatchFilter] = useState("match1")

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Competitive Landscape</h1>
        <div className="flex gap-4">
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={matchFilter} onValueChange={setMatchFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select match" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match1">Match 1</SelectItem>
              <SelectItem value="match2">Match 2</SelectItem>
              <SelectItem value="match3">Match 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="brandBattle" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brandBattle">Brand Battle</TabsTrigger>
          <TabsTrigger value="sectorClash">Sector Clash</TabsTrigger>
          <TabsTrigger value="adOverlap">Ad Overlap</TabsTrigger>
        </TabsList>

        <TabsContent value="brandBattle">
          <Card>
            <CardHeader>
              <CardTitle>Brand Battle</CardTitle>
              <CardDescription>Comparing top 5 competing brands</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={brandBattleConfig}  className="h-[450px] w-full" >
                <BarChart accessibilityLayer data={brandBattleData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="brand"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="frequency" fill="var(--color-frequency)" radius={4} />
                  <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Brand A leading in frequency <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing frequency and duration for top competitors
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sectorClash">
          <Card>
            <CardHeader>
              <CardTitle>Sector Clash</CardTitle>
              <CardDescription>Share of ad time by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={sectorClashConfig} className="h-[450px] w-full    ">
                <BarChart accessibilityLayer data={sectorClashData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="sector"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="brandA" stackId="a" fill="var(--color-brandA)" radius={4} />
                  <Bar dataKey="brandB" stackId="a" fill="var(--color-brandB)" radius={4} />
                  <Bar dataKey="brandC" stackId="a" fill="var(--color-brandC)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Tech sector dominates ad time <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing ad time distribution across top sectors
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="adOverlap">
          <Card>
            <CardHeader>
              <CardTitle>Ad Overlap</CardTitle>
              <CardDescription>Timeline of ad crowding for selected match</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="space-y-4">
                    {adOverlapData.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">{item.brand}</div>
                        <div className="flex-1 h-8 bg-muted rounded relative">
                          <div
                            className="h-full rounded bg-primary"
                            style={{
                              marginLeft: `${(item.start / 900) * 100}%`,
                              width: `${((item.end - item.start) / 900) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                High ad overlap detected <GanttChart className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing ad timing for selected match
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}