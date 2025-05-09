import { format } from "date-fns"

export const generatePlatformData = (metric) => {
  const platforms = ["Analog Radio", "Digital Radio", "YouTube"]
  const baseValues = {
    revenue: [15000, 25000, 35000],
    engagement: [2000, 4000, 8000],
    adCount: [150, 200, 250],
  }

  return platforms.map((platform, index) => ({
    platform,
    [metric]: baseValues[metric][index] + Math.floor(Math.random() * 5000),
    growth: Math.floor(Math.random() * 20) + 5,
  }))
}

export const generateTimeSeriesData = (metric) => {
  const baseValues = {
    revenue: [12000, 15000, 18000],
    engagement: [1500, 2000, 2500],
    adCount: [120, 150, 180],
  }

  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - 5 + i)
    return {
      date: format(date, "MMM"),
      analog: baseValues[metric][0] + Math.floor(Math.random() * 3000),
      digital: baseValues[metric][1] + Math.floor(Math.random() * 4000),
      youtube: baseValues[metric][2] + Math.floor(Math.random() * 5000),
    }
  })
}

export const generateInsights = (metric) => {
  const insights = {
    revenue: {
      topPlatform: "YouTube",
      growth: "+24%",
      forecast: "Upward trend expected",
      recommendation: "Increase YouTube ad inventory",
    },
    engagement: {
      topPlatform: "Digital Radio",
      growth: "+18%",
      forecast: "Steady growth",
      recommendation: "Focus on interactive content",
    },
    adCount: {
      topPlatform: "Analog Radio",
      growth: "+15%",
      forecast: "Stable performance",
      recommendation: "Optimize ad scheduling",
    },
  }
  return insights[metric]
}

export const formatValue = (value, metricType) => {
  switch (metricType) {
    case "revenue":
      return `$${value.toLocaleString()}`
    case "engagement":
      return `${value.toLocaleString()} interactions`
    case "adCount":
      return `${value.toLocaleString()} ads`
    default:
      return value
  }
}

