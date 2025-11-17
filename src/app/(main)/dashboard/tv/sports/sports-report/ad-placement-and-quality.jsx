"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

/* =============================================================================
   CONFIG & COLORS
============================================================================= */
const OVER_BUCKETS = [
  "1-5",
  "6-10",
  "11-15",
  "16-20",
  "21-25",
  "26-30",
  "31-35",
  "36-40",
];
const TOP_N = 5;

const DEFAULT_PALETTE = [
  "#6ea8fe",
  "#f8b26a",
  "#60d394",
  "#ff6b6b",
  "#a78bfa",
  "#4dd0e1",
  "#f472b6",
  "#cbd5e1",
  "#f59e0b",
  "#10b981",
];

const COLORS = { donut: ["#4f46e5", "#059669"], bar: "#6366f1" };
const HEAT_BUCKET_COLORS = [
  "#eef2ff",
  "#c7d2fe",
  "#a5b4fc",
  "#818cf8",
  "#4f46e5",
];

/* =============================================================================
   COLOR UTILITIES
============================================================================= */
function strHash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h;
}
function hslFromNumber(n, sat = 65, light = 45) {
  const hue = n % 360;
  return `hsl(${hue} ${sat}% ${light}%)`;
}
function buildDynamicColorMap({ datasets = [], palette = DEFAULT_PALETTE }) {
  const names = new Set();
  for (const ds of datasets) {
    if (!Array.isArray(ds)) continue;
    for (const row of ds) {
      if (!row || typeof row !== "object") continue;
      if (row.brand) names.add(String(row.brand));
      Object.keys(row).forEach((k) => {
        if (k === "category" || k === "over_bucket" || k === "match_id") return;
        const v = row[k];
        if (v && typeof v === "object" && ("duration" in v || "count" in v))
          names.add(k);
      });
    }
  }
  const sorted = Array.from(names).sort((a, b) => a.localeCompare(b));
  const colorMap = Object.create(null);
  for (let i = 0; i < sorted.length; i++) {
    const brand = sorted[i];
    colorMap[brand] =
      i < palette.length ? palette[i] : hslFromNumber(strHash(brand));
  }
  return colorMap;
}

/* =============================================================================
   UTILS
============================================================================= */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
      {label && <p className="text-xs font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-xs">
          <span className="font-semibold">{p.name}:</span> {p.value}
          {p.unit || ""}
        </p>
      ))}
    </div>
  );
};

function buildHeatmapMatrix(rows, metric) {
  if (!rows || rows.length === 0)
    return {
      brands: [],
      regions: [],
      matrix: [],
      valueToColor: () => HEAT_BUCKET_COLORS[0],
    };
  const brands = Array.from(new Set(rows.map((r) => r.brand)));
  const regions = Array.from(new Set(rows.map((r) => r.region)));
  const key = metric === "duration" ? "duration" : "count";
  const matrix = regions.map(() => brands.map(() => 0));
  rows.forEach((r) => {
    const ri = regions.indexOf(r.region);
    const ci = brands.indexOf(r.brand);
    if (ri !== -1 && ci !== -1) matrix[ri][ci] += Number(r[key] || 0);
  });
  const allVals = matrix.flat();
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const steps = HEAT_BUCKET_COLORS.length;
  const step = (max - min) / steps || 1;
  const thresholds = new Array(steps)
    .fill(0)
    .map((_, i) => min + step * (i + 1));
  const valueToColor = (v) => {
    if (steps === 1) return HEAT_BUCKET_COLORS[0];
    if (v <= thresholds[0]) return HEAT_BUCKET_COLORS[0];
    if (v <= thresholds[1]) return HEAT_BUCKET_COLORS[1];
    if (v <= thresholds[2]) return HEAT_BUCKET_COLORS[2];
    if (v <= thresholds[3]) return HEAT_BUCKET_COLORS[3];
    return HEAT_BUCKET_COLORS[4];
  };
  return { brands, regions, matrix, valueToColor };
}

/* =============================================================================
   COMPONENTS
============================================================================= */

function AdExposureByOverCard({ metric, data, colorMap, selectedSectors }) {
  // Removed category filter here — chart now only respects selectedSectors (global)
  const filteredData = useMemo(() => {
    let result = data;
    if (selectedSectors.length > 0) {
      result = result.filter((r) => selectedSectors.includes(r.sector));
    }
    return result;
  }, [data, selectedSectors]);

  const aggregate = useMemo(() => {
    if (!filteredData.length) return { table: [], brandsToShow: [] };

    const totalsByBrand = new Map();
    filteredData.forEach((r) => {
      const v =
        metric === "duration" ? Number(r.duration || 0) : Number(r.count || 0);
      totalsByBrand.set(r.brand, (totalsByBrand.get(r.brand) || 0) + v);
    });

    const sortedBrands = Array.from(totalsByBrand.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([brand]) => brand);

    // Always show top N brands
    const brandsToShow = sortedBrands.slice(0, TOP_N);

    const table = OVER_BUCKETS.map((bucket) => {
      const row = { over_bucket: bucket };
      brandsToShow.forEach((b) => (row[b] = 0));
      return row;
    });

    filteredData.forEach((r) => {
      if (!brandsToShow.includes(r.brand)) return;
      const idx = OVER_BUCKETS.indexOf(r.over_bucket);
      if (idx === -1) return;
      const v =
        metric === "duration" ? Number(r.duration || 0) : Number(r.count || 0);
      table[idx][r.brand] += v;
    });

    return { table, brandsToShow };
  }, [filteredData, metric]);

  const yLabel = metric === "duration" ? "Airtime (s)" : "Ad Count";

  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Ad Exposure by Over Interval —{" "}
            {metric === "duration" ? "Airtime" : "Count"}
          </h3>
          <p className="text-xs text-gray-500">Top {TOP_N} brands (global).</p>
        </div>
      </div>

      <div className="h-80 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={aggregate.table}
              margin={{ top: 40, right: 30, left: 20, bottom: 42 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="over_bucket"
                tick={{ fontSize: 11 }}
                tickMargin={8}
                height={52}
                label={{
                  value: "Overs",
                  position: "bottom",
                  offset: 0,
                  style: { fontSize: 11 },
                }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 11 },
                }}
                allowDecimals={false}
              />
              <Legend
                verticalAlign="top"
                align="right"
                height={28}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ lineHeight: "20px" }}
              />
              <Tooltip
                formatter={(v, name) => [v, name]}
                labelFormatter={(label) => `Overs ${label}`}
                contentStyle={{ fontSize: 12 }}
              />

              {aggregate.brandsToShow.map((brand) => (
                <Line
                  key={brand}
                  type="monotone"
                  dataKey={brand}
                  name={brand}
                  stroke={colorMap[brand] || DEFAULT_PALETTE[0]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2">
          <div className="grid grid-cols-8 gap-0 h-2">
            {OVER_BUCKETS.map((_, i) => (
              <div
                key={i}
                className="border-t border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>
          <div className="grid grid-cols-8 text-[11px] text-gray-600 dark:text-gray-300 mt-1">
            <div className="col-span-4 text-center font-medium">Innings 1</div>
            <div className="col-span-4 text-center font-medium">Innings 2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionVisibilityHeatmap({ metric, data }) {
  // unchanged — no sector filter
  const { brands, regions, matrix, valueToColor } = useMemo(
    () => buildHeatmapMatrix(data, metric),
    [data, metric]
  );
  // ... rest unchanged (same as original)
  const metricLabel = metric === "duration" ? "Airtime (s)" : "Count";
  const CELL_MIN = 44;
  const CELL_GAP = 8;

  if (brands.length === 0 || regions.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Region Visibility Heatmap —{" "}
          {metric === "duration" ? "Airtime" : "Count"}
        </h3>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        Region Visibility Heatmap —{" "}
        {metric === "duration" ? "Airtime" : "Count"}
      </h3>
      <div className="overflow-x-auto" style={{ paddingBottom: 4 }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `minmax(60px, auto) repeat(${brands.length}, minmax(${CELL_MIN}px, 1fr))`,
            gap: `${CELL_GAP}px`,
            alignItems: "center",
          }}
        >
          <div />
          {brands.map((b) => (
            <div
              key={`hdr-${b}`}
              className="text-[11px] text-gray-400 text-center whitespace-nowrap"
            >
              {b}
            </div>
          ))}
        </div>
        {regions.map((region, ri) => (
          <div
            key={`row-${region}`}
            className="grid mt-2"
            style={{
              gridTemplateColumns: `minmax(60px, auto) repeat(${brands.length}, minmax(${CELL_MIN}px, 1fr))`,
              gap: `${CELL_GAP}px`,
              alignItems: "stretch",
            }}
          >
            <div className="text-[11px] text-gray-400 flex items-center">
              {region}
            </div>
            {brands.map((brand, ci) => {
              const v = matrix[ri][ci] ?? 0;
              const bg = valueToColor(v);
              const isZero = v === 0;
              return (
                <div
                  key={`cell-${region}-${brand}`}
                  className="rounded-lg border border-gray-700/30 flex items-center justify-center"
                  style={{
                    background: bg,
                    height: CELL_MIN,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                  title={`${region} — ${brand}: ${v} ${metricLabel}`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isZero ? "text-gray-500" : "text-white"
                    }`}
                    style={{
                      textShadow: isZero ? "none" : "0 1px 0 rgba(0,0,0,0.25)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 text-[11px]">
        <span className="text-gray-500">Low</span>
        {HEAT_BUCKET_COLORS.map((c, i) => (
          <span
            key={i}
            className="inline-block h-3 w-8 rounded"
            style={{ background: c }}
          />
        ))}
        <span className="text-gray-500">High</span>
        <span className="ml-3 text-gray-400">({metricLabel})</span>
      </div>
    </div>
  );
}

function VisibilityByPlacementType({ metric, data, qualityFilter }) {
  // unchanged — no sector filter
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (qualityFilter === "All") return data;
    return data.filter((row) => row.quality === qualityFilter);
  }, [data, qualityFilter]);

  const chartData = useMemo(() => {
    const map = new Map();
    filteredData.forEach((row) => {
      const key = row.Placement_Type;
      const duration = Number(row.duration || 0);
      const count = Number(row.count || 0);
      if (!map.has(key))
        map.set(key, { Placement_Type: key, duration: 0, count: 0 });
      const entry = map.get(key);
      entry.duration += duration;
      entry.count += count;
    });
    return Array.from(map.values()).sort((a, b) => b[metric] - a[metric]);
  }, [filteredData, metric]);

  const yLabel = metric === "duration" ? "Airtime (s)" : "Ad Count";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 20, left: 40, bottom: 50 }}
      >
        <XAxis
          dataKey="Placement_Type"
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 11 },
          }}
          allowDecimals={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          formatter={(val) => [val, yLabel]}
        />
        <Bar
          dataKey={metric}
          fill={COLORS.bar}
          radius={[6, 6, 0, 0]}
          name={yLabel}
        >
          <LabelList
            dataKey={metric}
            position="top"
            formatter={(v) => (metric === "duration" ? `${v}s` : v)}
            className="fill-primary text-xs"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* =============================================================================
   MAIN PAGE
============================================================================= */
export default function AdPlacementAndQuality({ selectedMatch }) {
  const [metric, setMetric] = useState("duration");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [selectedSectors, setSelectedSectors] = useState([]); // Global sector filter
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openPanel, setOpenPanel] = useState(null);

  // Fetch data
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (!selectedMatch) {
        setApiData([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const params = new URLSearchParams({
          match: selectedMatch,
          component: "ad-placement-quality",
        });
        const res = await fetch(`/api/matches-files?${params.toString()}`);
        const data = await res.json();
        if (mounted) setApiData(data.files || []);
      } catch (err) {
        console.error(err);
        if (mounted) setApiData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => (mounted = false);
  }, [selectedMatch]);

  const getFile = (namePart) =>
    apiData.find((f) => String(f.name).toLowerCase().includes(namePart))
      ?.content || [];

  const adLocationData = getFile("placement_by_placement");
  const regionVisibilitySource = getFile("region_brand");
  const adExposureByOverRaw = getFile("over_raw");

  const availableSectors = useMemo(() => {
    const set = new Set(adExposureByOverRaw.map((r) => r.sector));
    return [...set].sort();
  }, [adExposureByOverRaw]);

  const qualityOptions = useMemo(() => {
    const qualities = Array.from(new Set(adLocationData.map((r) => r.quality)));
    return ["All", ...qualities.sort()];
  }, [adLocationData]);

  const colorMap = useMemo(
    () =>
      buildDynamicColorMap({
        datasets: [adLocationData, regionVisibilitySource, adExposureByOverRaw],
        palette: DEFAULT_PALETTE,
      }),
    [adLocationData, regionVisibilitySource, adExposureByOverRaw]
  );

  const toggleSector = (sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading ad placement data...
      </div>
    );
  if (!selectedMatch)
    return (
      <div className="text-center py-20 text-gray-400">
        Please select a match to view analytics
      </div>
    );

  const Panel = ({ title, children, id, controls }) => (
    <div className="bg-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h4>
        {/* <div className="flex items-center gap-2">
          {controls}
          <button
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            onClick={() => setOpenPanel(id)}
          >
            Open
          </button>
        </div> */}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card rounded-lg p-6 w-[min(1100px,95%)] max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            className="px-3 py-1.5 rounded-md bg-destructive text-white hover:bg-destructive/80 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Global Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Metric
            </label>
            <select
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-card text-sm"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              <option value="duration">Duration (sec)</option>
              <option value="count">Count</option>
            </select>
          </div>

          {/* Global Sector Filter (moved to right side) */}
          <div className="ml-auto">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Sector (applies only to Ad Exposure by Over Interval)
            </label>
            <div className="flex items-center gap-3">
              <Select onValueChange={toggleSector}>
                <SelectTrigger className="w-80">
                  <SelectValue placeholder="Select sectors..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSectors.map((s) => (
                    <SelectItem key={s} value={s}>
                      <div className="flex items-center justify-between w-full">
                        <span>{s}</span>
                        {selectedSectors.includes(s) && (
                          <span className="ml-2 text-green-600 text-xs">
                            Selected
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => setSelectedSectors([])}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSectors.length === 0 ? (
                <span className="text-sm text-muted-foreground">
                  All sectors
                </span>
              ) : (
                selectedSectors.map((s) => (
                  <Badge key={s} variant="secondary" className="px-3 py-1">
                    {s}
                    <button onClick={() => toggleSector(s)} className="ml-2">
                      <X size={14} />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <div className="h-96">
          <Panel
            title="Visibility by Placement Type"
            id="placement"
            controls={
              <div className="text-xs text-gray-500">
                Quality:{" "}
                <strong>
                  {qualityFilter === "All" ? "All" : `${qualityFilter}%`}
                </strong>
              </div>
            }
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end mb-3">
                <div className="bg-card rounded-xl p-3 w-full sm:w-auto">
                  <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                    Quality
                  </label>
                  <Select
                    value={qualityFilter}
                    onValueChange={setQualityFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt === "All" ? "All Quality" : `${opt}%`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex-1">
                <VisibilityByPlacementType
                  metric={metric}
                  data={adLocationData}
                  qualityFilter={qualityFilter}
                />
              </div>
            </div>
          </Panel>
        </div>

        <div className="h-96">
          <Panel title="Region Visibility Heatmap" id="heatmap">
            <div className="h-full">
              <RegionVisibilityHeatmap
                metric={metric}
                data={regionVisibilitySource}
              />
            </div>
          </Panel>
        </div>

        <div className="h-96">
          <Panel title="Ad Exposure by Over Interval" id="exposure">
            <div className="h-full">
              <AdExposureByOverCard
                metric={metric}
                data={adExposureByOverRaw}
                colorMap={colorMap}
                selectedSectors={selectedSectors}
              />
            </div>
          </Panel>
        </div>
      </div>

      {/* Modals remain unchanged */}
      {openPanel === "placement" && (
        <Modal
          title="Visibility by Placement Type"
          onClose={() => setOpenPanel(null)}
        >
          <div className="mb-4 flex justify-end">
            <div className="bg-card rounded-xl p-3 w-full sm:w-auto">
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1">
                Quality
              </label>
              <Select value={qualityFilter} onValueChange={setQualityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qualityOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === "All" ? "All Quality" : `${opt}%`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div style={{ height: 520 }} className="flex flex-col">
            <div className="flex-1">
              <VisibilityByPlacementType
                metric={metric}
                data={adLocationData}
                qualityFilter={qualityFilter}
              />
            </div>
          </div>
        </Modal>
      )}

      {openPanel === "heatmap" && (
        <Modal
          title="Region Visibility Heatmap"
          onClose={() => setOpenPanel(null)}
        >
          <RegionVisibilityHeatmap
            metric={metric}
            data={regionVisibilitySource}
          />
        </Modal>
      )}

      {openPanel === "exposure" && (
        <Modal
          title="Ad Exposure by Over Interval"
          onClose={() => setOpenPanel(null)}
        >
          <div style={{ height: 560 }}>
            <AdExposureByOverCard
              metric={metric}
              data={adExposureByOverRaw}
              colorMap={colorMap}
              selectedSectors={selectedSectors}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
