"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Legend,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

/* ---------- Colors ---------- */
const DEFAULT_PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#a78bfa",
  "#f472b6",
  "#94a3b8",
];

/* ---------- Helpers ---------- */
function formatSeconds(n) {
  if (n == null) return "-";
  return `${n.toLocaleString()}s`;
}
function getValueForMetric(item, metric) {
  if (!item) return 0;
  if (metric === "duration") {
    return item.duration ?? item.percentage_duration ?? 0;
  }
  return item.count ?? item.percentage_count ?? 0;
}

/**
 * Build stacked data by category.
 */
function buildStackedByCategory(
  data = [],
  metric = "duration",
  selectedCategories = []
) {
  const filtered =
    selectedCategories.length === 0
      ? data
      : data.filter((d) => selectedCategories.includes(d.category));

  const map = new Map();
  const brands = new Set();

  filtered.forEach((row) => {
    const cat = row.category ?? "Unknown";
    const brand = row.brand_name ?? "Unknown";
    const val = metric === "duration" ? row.duration || 0 : row.count || 0;

    brands.add(brand);
    if (!map.has(cat)) map.set(cat, new Map());
    const brandMap = map.get(cat);
    brandMap.set(brand, (brandMap.get(brand) || 0) + val);
  });

  const brandList = Array.from(brands);
  const out = Array.from(map.entries()).map(([category, brandMap]) => {
    const o = { category };
    brandList.forEach((b) => {
      o[b] = brandMap.get(b) || 0;
    });
    return o;
  });

  out.sort((a, b) => {
    const sa = brandList.reduce((s, br) => s + (a[br] || 0), 0);
    const sb = brandList.reduce((s, br) => s + (b[br] || 0), 0);
    return sb - sa;
  });

  return { out, brandList };
}

/**
 * Build stacked data by sector.
 */
function buildStackedFromSectors(
  data = [],
  selectedSectors = [],
  metric = "duration"
) {
  if (!Array.isArray(data) || data.length === 0)
    return { out: [], brandList: [] };

  // normalize sectors (trim, remove nan)
  const filtered = data
    .map((r) => {
      if (!r || !r.sector) return null;

      const sector = String(r.sector).trim();
      if (!sector || sector.toLowerCase() === "nan") return null;

      // clone row with trimmed keys
      const cleaned = { sector };
      Object.keys(r).forEach((key) => {
        if (key !== "sector") cleaned[String(key).trim()] = r[key];
      });
      return cleaned;
    })
    .filter(Boolean)
    .filter((r) =>
      selectedSectors.length === 0 ? true : selectedSectors.includes(r.sector)
    );

  // collect all brand names
  const brandSet = new Set();
  filtered.forEach((row) => {
    Object.keys(row).forEach((k) => {
      if (k !== "sector") brandSet.add(k);
    });
  });
  const brandList = [...brandSet];

  // extract value from nested objects
  const extract = (cell) => {
    if (!cell) return 0;

    if (typeof cell === "number") return cell;

    if (typeof cell === "string") {
      const n = Number(cell.replace(/,/g, ""));
      return Number.isFinite(n) ? n : 0;
    }

    if (typeof cell === "object") {
      if (metric === "duration") {
        if (cell.duration != null) return cell.duration;
        if (cell.percentage_duration != null) return cell.percentage_duration;
      }
      if (metric === "count") {
        if (cell.count != null) return cell.count;
        if (cell.percentage_count != null) return cell.percentage_count;
      }

      // fallback: sum all numeric nested values
      const nums = Object.values(cell)
        .map((v) =>
          typeof v === "string"
            ? Number(v.replace(/,/g, ""))
            : typeof v === "number"
            ? v
            : NaN
        )
        .filter((n) => Number.isFinite(n));

      return nums.reduce((s, n) => s + n, 0) || 0;
    }

    return 0;
  };

  const outRaw = filtered.map((row) => {
    const obj = { sector: row.sector };

    brandList.forEach((brand) => {
      obj[brand] = extract(row[brand]);
    });

    return obj;
  });

  // remove sectors with all zero values
  const out = outRaw.filter((row) =>
    brandList.some((b) => row[b] && row[b] > 0)
  );

  // sort by total
  out.sort((a, b) => {
    const sa = brandList.reduce((s, br) => s + (a[br] || 0), 0);
    const sb = brandList.reduce((s, br) => s + (b[br] || 0), 0);
    return sb - sa;
  });

  return { out, brandList };
}

/* ---------- Component ---------- */
export default function BrandOverview({
  selectedMatch,
  componentFolder = "brand-overview",
  apiPath = "/api/matches-files",
}) {
  const [metric, setMetric] = useState("duration");
  const [apiFiles, setApiFiles] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Global Sector Filter
  const [selectedSectors, setSelectedSectors] = useState([]); // [] = all

  // Category multi-select filter for exposure stacked chart
  const [selectedCategories, setSelectedCategories] = useState([]);

  /* Fetch & Parse Files */
  useEffect(() => {
    let mounted = true;
    async function fetchFiles() {
      setLoading(true);
      if (!selectedMatch) {
        if (mounted) {
          setApiFiles([]);
          setFileMap({});
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch(
          `${apiPath}?match=${selectedMatch}&component=${componentFolder}`
        );
        const json = await res.json();
        if (mounted) setApiFiles(json.files || []);
      } catch (err) {
        console.error(err);
        if (mounted) setApiFiles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchFiles();
    return () => (mounted = false);
  }, [selectedMatch, componentFolder, apiPath]);

  useEffect(() => {
    let mounted = true;
    async function buildMap() {
      const map = {};
      await Promise.all(
        apiFiles.map(async (f) => {
          if (!f?.name) return;
          let content =
            f.content || (f.url && (await (await fetch(f.url)).json()));
          if (content) map[f.name.toLowerCase()] = content;
        })
      );
      if (mounted) setFileMap(map);
    }
    if (apiFiles.length) buildMap();
    return () => (mounted = false);
  }, [apiFiles]);

  const getFile = (namePart) =>
    Object.keys(fileMap).find((k) => k.includes(namePart.toLowerCase()))
      ? fileMap[
          Object.keys(fileMap).find((k) => k.includes(namePart.toLowerCase()))
        ]
      : null;

  /* Raw Data */
  const topCards = useMemo(() => getFile("top_cards") || {}, [fileMap]);
  const brandShareRaw = useMemo(() => getFile("brand_share") || [], [fileMap]);
  const brandScreenTimeRaw = useMemo(
    () => getFile("brand_screen_time") || [],
    [fileMap]
  );
  const categoryExposureRaw = useMemo(
    () => getFile("category_exposure") || [],
    [fileMap]
  );
  const stackedCompetitorsRaw = useMemo(
    () => getFile("stacked_competitors") || [],
    [fileMap]
  );

  /* Available Sectors (union of stackedCompetitorsRaw + brandScreenTimeRaw) */
  const availableSectors = useMemo(() => {
    const s1 = Array.isArray(stackedCompetitorsRaw)
      ? stackedCompetitorsRaw.map((r) =>
          r && r.sector ? String(r.sector).trim() : null
        )
      : [];
    const s2 = Array.isArray(brandScreenTimeRaw)
      ? brandScreenTimeRaw.map((r) =>
          r && r.sector ? String(r.sector).trim() : null
        )
      : [];

    const all = [...s1, ...s2]
      .filter(Boolean)
      .map((s) => s.trim())
      .filter((s) => s.toLowerCase() !== "nan");
    return [...new Set(all)].sort();
  }, [stackedCompetitorsRaw, brandScreenTimeRaw]);

  /* Available Categories (for category filter) */
  const availableCategories = useMemo(() => {
    if (!Array.isArray(categoryExposureRaw)) return [];
    return [...new Set(categoryExposureRaw.map((r) => r.category))].sort();
  }, [categoryExposureRaw]);

  /* Filtered Data (only for 3 charts) */
  const filteredBrandShare = useMemo(
    () =>
      selectedSectors.length === 0
        ? brandShareRaw
        : brandShareRaw.filter((d) =>
            selectedSectors.includes(String(d.sector).trim())
          ),
    [brandShareRaw, selectedSectors]
  );

  /**
   * FIXED: Filter brand screen-time rows directly by their `sector` field.
   * This avoids fragile name-matching against stackedCompetitors.
   */
  const filteredScreenTimeBrands = useMemo(() => {
    if (!Array.isArray(brandScreenTimeRaw)) return [];
    if (selectedSectors.length === 0) return brandScreenTimeRaw;

    const selectedSet = new Set(selectedSectors.map((s) => String(s).trim()));
    return brandScreenTimeRaw.filter((d) => {
      if (!d || d.sector == null) return false;
      const sector = String(d.sector).trim();
      if (!sector || sector.toLowerCase() === "nan") return false;
      return selectedSet.has(sector);
    });
  }, [brandScreenTimeRaw, selectedSectors]);

  // Pass `metric` into the helper here
  const { out: stackedData, brandList: stackedBrands } = useMemo(
    () =>
      buildStackedFromSectors(stackedCompetitorsRaw, selectedSectors, metric),
    [stackedCompetitorsRaw, selectedSectors, metric]
  );

  /* Derived Chart Data */
  const brandShareSorted = useMemo(() => {
    const key =
      metric === "duration" ? "percentage_duration" : "percentage_count";
    return [...filteredBrandShare]
      .sort((a, b) => (b[key] || 0) - (a[key] || 0))
      .slice(0, 8);
  }, [filteredBrandShare, metric]);

  const topBrands = useMemo(() => {
    const aggregated = filteredScreenTimeBrands.reduce((acc, cur) => {
      const existing = acc.find((i) => i.brand === cur.brand);
      if (existing) {
        existing.duration = (existing.duration || 0) + (cur.duration || 0);
        existing.count = (existing.count || 0) + (cur.count || 0);
      } else acc.push({ ...cur });
      return acc;
    }, []);
    return aggregated
      .sort(
        (a, b) => getValueForMetric(b, metric) - getValueForMetric(a, metric)
      )
      .slice(0, 10)
      .map((d) => ({ ...d, value: getValueForMetric(d, metric) }));
  }, [filteredScreenTimeBrands, metric]);

  // SIMPLE AGGREGATION (previous single-value exposure)
  const exposureByCategory = useMemo(
    () =>
      [...categoryExposureRaw]
        .sort(
          (a, b) => getValueForMetric(b, metric) - getValueForMetric(a, metric)
        )
        .map((d) => ({ ...d, value: getValueForMetric(d, metric) })),
    [categoryExposureRaw, metric]
  );

  // NEW: stacked data by category (brands stacked inside each category)
  const { out: stackedCategoryData, brandList: stackedCategoryBrands } =
    useMemo(
      () =>
        buildStackedByCategory(categoryExposureRaw, metric, selectedCategories),
      [categoryExposureRaw, metric, selectedCategories]
    );

  const topBrandDuration = topCards?.top_brand_duration;
  const topBrandCount = topCards?.top_brand_count;

  const toggleSector = (s) =>
    setSelectedSectors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const toggleCategory = (c) =>
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading brand overview data...
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      {/* Global Controls */}
      <div className="flex flex-wrap items-end justify-between gap-6 bg-card/50 -m-6 mb-6 p-6 border-b">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-background text-sm"
          >
            <option value="duration">Duration (sec)</option>
            <option value="count">Count</option>
          </select>
        </div>

        {/* Global Sector Filter */}
        <div className="flex items-center gap-3">
          {/* give Select a key based on selectedSectors so it is remounted when cleared */}
          <Select
            key={
              selectedSectors.length === 0
                ? "all-sectors"
                : selectedSectors.join(",")
            }
            value={
              selectedSectors.length === 0
                ? "__ALL__"
                : selectedSectors[selectedSectors.length - 1]
            }
            onValueChange={(val) => toggleSector(val)}
          >
            <SelectTrigger className="w-80">
              <SelectValue>
                {selectedSectors.length === 0
                  ? "All Sectors"
                  : selectedSectors.join(", ")}
              </SelectValue>
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

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedSectors([])} // keep [] = all sectors
          >
            Clear
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedSectors.length === 0 ? (
            <span className="text-sm text-muted-foreground">All sectors</span>
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

      {/* Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Top Brand Duration */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Top Brand
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-400">
                Duration
              </span>
            </div>
            <div>
              <div className="text-sm text-gray-400">Brand</div>
              <div className="mt-1 text-2xl font-semibold">
                {topBrandDuration?.brand ?? "—"}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
              <span>Total Duration</span>
              <span className="font-medium text-gray-100">
                {formatSeconds(topBrandDuration?.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Brand Count */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-lime-400/10" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Top Brand
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                Count
              </span>
            </div>
            <div>
              <div className="text-sm text-gray-400">Brand</div>
              <div className="mt-1 text-2xl font-semibold">
                {topBrandCount?.brand ?? "—"}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
              <span>Total Appearances</span>
              <span className="font-medium text-gray-100">
                {topBrandCount?.count ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Share Pie */}
        <div className="rounded-2xl bg-card border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="h-52 mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Brand Share
            </h4>
            {brandShareSorted.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-gray-500">No data</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandShareSorted.map((d) => ({
                      name: d.brand,
                      value: getValueForMetric(d, metric),
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    labelLine={false}
                    label={(entry) => entry.name}
                  >
                    {brandShareSorted.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Brand Screen Time */}
      <div className="bg-card rounded-xl p-4">
        <div className="h-96 mt-3 overflow-visible">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Brand Screen Time
          </h4>
          {topBrands.length === 0 ? (
            <p className="text-sm text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topBrands}
                margin={{ top: 5, right: 30, bottom: 5, left: 160 }}
              >
                <XAxis type="number" />
                <YAxis
                  dataKey="brand"
                  type="category"
                  width={160}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                />
                <Bar dataKey="value">
                  {topBrands.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    className="text-xs fill-primary"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Exposure by Category - STACKED BY BRAND WITH CATEGORY MULTI-FILTER */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Exposure by Brand Category (Stacked by Brand)
          </h4>

          {/* Category multi-select (shadcn) */}
          <div className="flex items-center gap-3">
            <Select onValueChange={(val) => toggleCategory(val)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter categories..." />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    <div className="flex items-center justify-between w-full">
                      <span>{c}</span>
                      {selectedCategories.includes(c) && (
                        <span className="ml-2 text-green-600 text-xs">
                          Selected
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedCategories([])}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="h-96 mt-3">
          {stackedCategoryData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No data for selected categories
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />

                {/* Custom Tooltip - Hides brands with 0 value */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const filteredPayload = payload
                        .filter((item) => item.value > 0)
                        .sort((a, b) => b.value - a.value);

                      if (filteredPayload.length === 0) return null;

                      return (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-sm">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">
                            {label}
                          </p>
                          {filteredPayload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{entry.name}</span>
                              </div>
                              <span className="font-medium">
                                {metric === "duration"
                                  ? `${entry.value}s`
                                  : entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* <Legend wrapperStyle={{ fontSize: 12 }} /> */}
                {stackedCategoryBrands.map((b, i) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    stackId="a"
                    fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Brand Competitor Comparison - FILTERED BY SECTOR */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Brand Competitor Comparison
          </h4>
        </div>
        <div className="h-96 mt-3">
          {stackedData.length === 0 ? (
            <p className="text-sm text-gray-500">
              No data for selected sectors
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sector"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-50}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />

                {/* Custom Tooltip - Hides brands with 0 value */}
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const filteredPayload = payload
                        .filter((item) => item.value > 0) // Only show if value > 0
                        .sort((a, b) => b.value - a.value); // Optional: sort by value

                      if (filteredPayload.length === 0) return null;

                      return (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-sm">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">
                            {label}
                          </p>
                          {filteredPayload.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span>{entry.name}</span>
                              </div>
                              <span className="font-medium">
                                {metric === "duration"
                                  ? `${entry.value}s`
                                  : entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {stackedBrands.map((b, i) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    stackId="a"
                    fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
