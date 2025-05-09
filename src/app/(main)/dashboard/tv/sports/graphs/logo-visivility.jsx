"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Sample data
const placementImpactData = [
  { placement: "Jersey", duration: 180 },
  { placement: "Stumps", duration: 150 },
  { placement: "Boundary", duration: 120 },
  { placement: "Billboard", duration: 90 },
  { placement: "Overlay", duration: 60 },
]

const durationLeaderboardData = [
  { brand: "Brand A", screenTime: 1200, matches: 8 },
  { brand: "Brand B", screenTime: 1000, matches: 7 },
  { brand: "Brand C", screenTime: 900, matches: 6 },
  { brand: "Brand D", screenTime: 800, matches: 7 },
  { brand: "Brand E", screenTime: 700, matches: 5 },
  { brand: "Brand F", screenTime: 600, matches: 6 },
  { brand: "Brand G", screenTime: 500, matches: 4 },
  { brand: "Brand H", screenTime: 400, matches: 5 },
  { brand: "Brand I", screenTime: 300, matches: 3 },
  { brand: "Brand J", screenTime: 200, matches: 2 },
]

// Heatmap data for zones
const zoneHeatmapData = [
  { zone: "Boundary Left", visibility: 85 },
  { zone: "Boundary Right", visibility: 80 },
  { zone: "Stumps", visibility: 70 },
  { zone: "Midfield", visibility: 50 },
  { zone: "Billboard Top", visibility: 40 },
  { zone: "Billboard Side", visibility: 30 },
]

// Chart configurations
const placementConfig = {
  duration: {
    label: "Avg. Duration (s)",
    color: "hsl(var(--chart-1))",
  },
}

const heatmapConfig = {
  visibility: {
    label: "Visibility Score",
    color: "hsl(var(--chart-1))",
  },
}

export function LogoVisibilityDeepDive() {
  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Logo Visibility Deep Dive</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Placement Impact</CardTitle>
            <CardDescription>Average duration by placement type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={placementConfig}>
              <BarChart
                accessibilityLayer
                data={placementImpactData}
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
                <Bar dataKey="duration" fill="var(--color-duration)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Jersey dominates visibility <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing average duration per placement
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zone Heatmap</CardTitle>
            <CardDescription>Visibility across field zones</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={heatmapConfig}>
              <BarChart
                accessibilityLayer
                data={zoneHeatmapData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="zone"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="visibility"
                  fill="var(--color-visibility)"
                  radius={4}
                  fillOpacity={0.8}
                >
                  {zoneHeatmapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(0, 70%, ${100 - entry.visibility / 2}%)`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              Example: Brand X on jersey
              <img
                src="/jersey-example-placeholder.jpg"
                alt="Brand X jersey"
                className="mt-2 w-32 h-auto rounded"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Boundaries lead visibility <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Darker bars indicate higher visibility
            </div>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Duration Leaderboard</CardTitle>
            <CardDescription>Top 10 brands by total screen time</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Screen Time (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {durationLeaderboardData.map((brand, index) => (
                    <TableRow key={brand.brand}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>{brand.brand}</TooltipTrigger>
                          <TooltipContent>
                            Appeared in {brand.matches} matches
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{brand.screenTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              Brand A leads screen time <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Hover for match count details
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}