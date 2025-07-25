"use client"
import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ProgramBlock } from "@/components/modules/program-grid/program-block"
import { DualRangeSlider } from "@/components/dual-range-slider"
import { Separator } from "@/components/ui/separator"
import ReportsDialog from "@/components/report-dialog"
import { OttPlatformSelector } from "@/components/ott-platform-selector"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Series Selector Component
export function OttSeriesSelector({ seriesList, selectedSeriesId, onSelectSeries }) {
  return (
    <Select value={selectedSeriesId} onValueChange={onSelectSeries}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Series" />
      </SelectTrigger>
      <SelectContent>
        {seriesList.map((series) => (
          <SelectItem key={series.id} value={series.id}>
            {series.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const OttProgramGrid = ({ platforms, initialPlatformId }) => {
  const timelineRef = useRef(null)
  const programRef = useRef(null)
  const [timeRange, setTimeRange] = useState([0, 23.5]) // Full 24 hours
  const [selectedPlatformId, setSelectedPlatformId] = useState("")
  const [selectedSeriesId, setSelectedSeriesId] = useState("")
  const [programData, setProgramData] = useState([]) // Array of episode segments (episode parts + ads)
  const [dynamicPixelsPerSecond, setDynamicPixelsPerSecond] = useState(0.1)
  const [currentSeriesList, setCurrentSeriesList] = useState([])
  const [currentEpisodeList, setCurrentEpisodeList] = useState([]) // List of episodes with metadata
  const [errorMessage, setErrorMessage] = useState("")
  const [isFetching, setIsFetching] = useState(false) // Track fetch status

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Memoize currentPlatform and currentSeries to prevent unnecessary changes
  const currentPlatform = useMemo(() => platforms.find((p) => p.id === selectedPlatformId), [platforms, selectedPlatformId])
  const currentSeries = useMemo(() => currentSeriesList.find((s) => s.id === selectedSeriesId), [currentSeriesList, selectedSeriesId])

  // Memoize timeToSeconds to ensure stability
  const timeToSeconds = useMemo(
    () =>
      (time) => {
        try {
          const [hours, minutes, seconds] = time.split(":").map(Number)
          return hours * 3600 + minutes * 60 + (seconds || 0)
        } catch (error) {
          console.error(`Error parsing time: ${time}`, error)
          return 0
        }
      },
    []
  )

  // Initialize platform and series from URL parameters
  useEffect(() => {
    const platformFromUrl = searchParams.get("platform")
    const showFromUrl = searchParams.get("show")

    // Validate platform ID
    const validPlatformId = platforms.find((p) => p.id === platformFromUrl)?.id || initialPlatformId || platforms[0]?.id || ""
    setSelectedPlatformId(validPlatformId)

    // Validate series ID only if platform is valid
    if (validPlatformId) {
      const platform = platforms.find((p) => p.id === validPlatformId)
      const validSeriesId = platform?.series.find((s) => s.id === showFromUrl)?.id || platform?.series[0]?.id || ""
      setSelectedSeriesId(validSeriesId)
    } else {
      setSelectedSeriesId("")
    }
  }, [searchParams, platforms, initialPlatformId])

  // Update URL parameters when platform or series changes
  useEffect(() => {
    if (!selectedPlatformId) return

    const params = new URLSearchParams(searchParams.toString())
    params.set("platform", selectedPlatformId)
    if (selectedSeriesId) {
      params.set("show", selectedSeriesId)
    } else {
      params.delete("show")
    }

    const newUrl = `${pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [selectedPlatformId, selectedSeriesId, router, pathname, searchParams])

  // Calculate range duration in seconds
  const rangeStartSeconds = timeRange[0] * 3600
  const rangeEndSeconds = timeRange[1] * 3600
  const rangeDurationSeconds = rangeEndSeconds - rangeStartSeconds

  // Effect to calculate dynamicPixelsPerSecond
  useEffect(() => {
    const calculateDynamicScale = () => {
      if (programRef.current && rangeDurationSeconds > 0) {
        const availableWidth = programRef.current.offsetWidth
        const newPixelsPerSecond = availableWidth / rangeDurationSeconds
        setDynamicPixelsPerSecond(newPixelsPerSecond)
      } else {
        setDynamicPixelsPerSecond(360 / 3600) // Default 0.1px/sec
      }
    }

    calculateDynamicScale()
    window.addEventListener("resize", calculateDynamicScale)
    return () => window.removeEventListener("resize", calculateDynamicScale)
  }, [timeRange, rangeDurationSeconds])

  const timelineContentWidth = rangeDurationSeconds * dynamicPixelsPerSecond

  // Synchronize scrolling
  const handleTimelineScroll = () => {
    if (timelineRef.current && programRef.current) {
      programRef.current.scrollLeft = timelineRef.current.scrollLeft
    }
  }

  const handleProgramScroll = () => {
    if (timelineRef.current && programRef.current) {
      timelineRef.current.scrollLeft = programRef.current.scrollLeft
    }
  }

  useEffect(() => {
    const timeline = timelineRef.current
    const program = programRef.current
    if (timeline && program) {
      timeline.addEventListener("scroll", handleTimelineScroll)
      program.addEventListener("scroll", handleProgramScroll)
      return () => {
        timeline.removeEventListener("scroll", handleTimelineScroll)
        program.removeEventListener("scroll", handleProgramScroll)
      }
    }
  }, [])

  // Filter programs based on time range
  const filteredData = useMemo(
    () =>
      programData.filter((program) => {
        const startSeconds = timeToSeconds(program.start)
        const endSeconds = timeToSeconds(program.end)
        const isVisible = startSeconds < rangeEndSeconds && endSeconds > rangeStartSeconds
        return isVisible
      }),
    [programData, timeToSeconds, rangeStartSeconds, rangeEndSeconds]
  )

  // Auto-scroll to start of time range
  useEffect(() => {
    if (timelineRef.current && programRef.current) {
      timelineRef.current.scrollLeft = 0
      programRef.current.scrollLeft = 0
    }
  }, [timeRange, dynamicPixelsPerSecond])

  // Fetch data for platform and series with debouncing
  useEffect(() => {
    let timeoutId = null

    const fetchData = async () => {
      if (isFetching) {
        console.log("Fetch already in progress, skipping")
        return
      }

      setIsFetching(true)
      setErrorMessage("")
      setProgramData([]) // Clear previous data
      setCurrentEpisodeList([])

      if (!currentPlatform) {
        console.log("No platform selected, resetting states")
        setCurrentSeriesList([])
        setSelectedSeriesId("")
        setErrorMessage("No platform selected")
        setIsFetching(false)
        return
      }

      console.log(`Fetching data for platform: ${currentPlatform.name}`)
      setCurrentSeriesList(currentPlatform.series)

      if (!currentSeries) {
        console.log("No series selected, resetting episode data")
        setErrorMessage("No series selected")
        setIsFetching(false)
        return
      }

      console.log(`Fetching episodes for series: ${currentSeries.name}`)
      const allEpisodes = []
      const allSegments = []
      let hasError = false

      for (const season of currentSeries.seasons) {
        for (const episode of season.episodes || []) {
          try {
            const url = `${process.env.NEXT_PUBLIC_URL}/data/ott/${selectedPlatformId}/${selectedSeriesId}/${season.id}/${episode.id}.json`
            console.log(`Fetching episode data from: ${url}`)
            const response = await fetch(url)
            if (!response.ok) {
              console.warn(`No data found for ${selectedPlatformId}/${selectedSeriesId}/${season.id}/${episode.id}.json`)
              setErrorMessage(`No data found for ${currentSeries.name} Season ${season.id} Episode ${episode.program}`)
              continue
            }
            const data = await response.json()
            console.log(`Fetched data for Episode ${episode.program}, Season ${season.id}:`, data)

            // Add episode metadata to episode list
            allEpisodes.push({
              id: episode.id,
              program: episode.program,
              name: episode.name,
              channel: `S${season.id.toString().padStart(2, "0")}E${episode.program.toString().padStart(2, "0")}`,
              seasonId: season.id,
            })

            // Add segments (episode parts and ads) to program data
            const segmentsWithEpisodeInfo = data.segments.map((segment, index) => ({
              ...segment,
              id: `${episode.id}-segment-${index}`,
              channel: `S${season.id.toString().padStart(2, "0")}E${episode.program.toString().padStart(2, "0")}`,
              episodeName: episode.name,
              seasonId: season.id,
            }))
            allSegments.push(...segmentsWithEpisodeInfo)
          } catch (error) {
            console.error(`Error fetching data for ${selectedPlatformId}/${selectedSeriesId}/${season.id}/${episode.id}:`, error)
            setErrorMessage(`Error loading ${currentSeries.name} Season ${season.id} Episode ${episode.program}`)
            hasError = true
          }
        }
      }

      if (hasError && allEpisodes.length === 0) {
        setErrorMessage(`Failed to load episodes for ${currentSeries.name}`)
      } else if (allEpisodes.length === 0) {
        setErrorMessage(`No episodes available for ${currentSeries.name}`)
      } else {
        setErrorMessage("")
      }

      // Sort episodes by season and episode number
      const sortedEpisodes = allEpisodes.sort((a, b) => {
        if (a.seasonId !== b.seasonId) {
          return parseInt(a.seasonId) - parseInt(b.seasonId)
        }
        return parseInt(a.program) - parseInt(b.program)
      })

      // Sort segments by start time within each episode
      const sortedSegments = allSegments.sort((a, b) => {
        if (a.seasonId !== b.seasonId) {
          return parseInt(a.seasonId) - parseInt(b.seasonId)
        }
        if (a.program !== b.program) {
          return parseInt(a.program) - parseInt(b.program)
        }
        return timeToSeconds(a.start) - timeToSeconds(b.start)
      })

      console.log("Sorted episodes:", sortedEpisodes)
      console.log("Sorted segments:", sortedSegments)
      setCurrentEpisodeList(sortedEpisodes)
      setProgramData(sortedSegments)
      setIsFetching(false)
    }

    // Debounce fetch with 300ms delay
    timeoutId = setTimeout(() => {
      console.log(`Initiating fetch for platform: ${selectedPlatformId}, series: ${selectedSeriesId}`)
      fetchData()
    }, 300)

    return () => {
      console.log("Cleaning up fetch timeout")
      clearTimeout(timeoutId)
    }
  }, [selectedPlatformId, selectedSeriesId, timeToSeconds])

  return (
    <div className="flex flex-col">
      <div className="bg-card border rounded-lg h-fit mb-2">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl">OTT Program Grid</h1>
          <div className="flex items-center gap-4">
            <OttPlatformSelector
              platforms={platforms}
              selectedPlatformId={selectedPlatformId}
              onSelectPlatform={setSelectedPlatformId}
            />
            <OttSeriesSelector
              seriesList={currentSeriesList}
              selectedSeriesId={selectedSeriesId}
              onSelectSeries={setSelectedSeriesId}
            />
            <ReportsDialog />
          </div>
        </div>
        <Separator />
        <div className="mb-8 p-4 pb-0">
          <DualRangeSlider onValueChange={setTimeRange} />
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 p-4 text-center">
          {errorMessage}
        </div>
      )}
      {isFetching && (
        <div className="text-center p-4">
          Loading...
        </div>
      )}
      <div className="grid grid-cols-7 h-12 border-t border-x rounded-t-lg overflow-hidden divide-x">
        <div className="flex items-center justify-center bg-card">
          <p>Timeline</p>
        </div>
        <div className="col-span-6 bg-muted">
          <div ref={timelineRef} className="overflow-x-auto overflow-y-hidden hide-scrollbar" style={{ width: "100%" }}>
            <div className="flex" style={{ width: `${timelineContentWidth}px` }}>
              {Array.from({ length: Math.ceil(timeRange[1] - timeRange[0]) + 1 }, (_, i) => {
                const hour = Math.floor(timeRange[0] + i)
                const hourSegmentWidth = 3600 * dynamicPixelsPerSecond
                if (hour >= timeRange[0] && hour <= timeRange[1]) {
                  return (
                    <div
                      key={hour}
                      className="flex-none h-12 flex items-center justify-start relative border-l border-gray-200"
                      style={{ width: `${hourSegmentWidth}px` }}
                    >
                      <span className="text-sm font-medium absolute -left-4 bg-muted">{hour}:00</span>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 h-fit border rounded-b-lg overflow-hidden divide-x">
        <div className="h-full bg-card rounded-l-lg flex flex-col divide-y min-w-64">
          {currentEpisodeList.length === 0 && !isFetching && (
            <div className="flex items-center justify-center h-32 p-2 text-muted-foreground">
              No episodes available
            </div>
          )}
          {currentEpisodeList.map((episode) => (
            <div key={episode.id} className="flex gap-2 items-center h-32 p-2 bg-card hover:bg-muted transition-colors">
              <img
                src={episode.image || "/placeholder.svg?height=48&width=48"}
                alt={`${currentSeries?.name} ${episode.channel}`}
                className="h-12 w-12 rounded-lg border object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{episode.channel}</h2>
                <p className="text-muted-foreground text-sm">{episode.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-6 bg-muted">
          <div ref={programRef} className="overflow-x-auto overflow-y-hidden">
            <div
              className="relative"
              style={{
                width: `${timelineContentWidth}px`,
                height: `${currentEpisodeList.length * 8}rem`,
              }}
            >
              {filteredData.length === 0 && currentEpisodeList.length > 0 && !isFetching && (
                <div className="text-center w-full text-muted-foreground absolute inset-0 flex items-center justify-center">
                  No segments in selected time range. Try adjusting the time slider.
                </div>
              )}
              {currentEpisodeList.map((episode) => (
                <div
                  key={episode.id}
                  className="flex items-center h-32 relative"
                >
                  {filteredData
                    .filter((program) => program.channel === episode.channel)
                    .map((program) => (
                      <ProgramBlock
                        key={program.id}
                        type={program.type}
                        name={program.type === "episode" ? episode.name : program.description}
                        description={program.description || "No description available"}
                        startTime={program.start}
                        endTime={program.end}
                        image={program.image}
                        channel={program.channel}
                        brand={program.brand}
                        sector={program.sector}
                        category={program.category}
                        timeRangeStart={rangeStartSeconds}
                        pixelsPerSecond={dynamicPixelsPerSecond}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OttProgramGrid