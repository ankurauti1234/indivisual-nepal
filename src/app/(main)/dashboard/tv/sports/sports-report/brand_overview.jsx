"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

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

const COLORS = { bar: "#6366f1" };

/* ---------- Helpers ---------- */
function formatSeconds(n) {
  if (n == null) return "-";
  return `${n.toLocaleString()}s`;
}
function percentToValue(pct, scale = 100) {
  return Math.max(0.001, (pct || 0) * scale);
}
function buildStackedFromCompetitors(data = []) {
  const brands = new Set();
  for (const row of data) {
    Object.keys(row).forEach((k) => {
      if (k === "category") return;
      brands.add(k);
    });
  }
  const brandList = Array.from(brands);
  const out = data.map((row) => {
    const o = { category: row.category };
    for (const b of brandList) {
      o[b] = (row[b] && row[b].duration) || 0;
    }
    return o;
  });
  return { out, brandList };
}
function getValueForMetric(item, metric) {
  if (!item) return 0;
  if (metric === "duration") {
    if (typeof item.duration === "number") return item.duration;
    if (typeof item.percentage_duration === "number")
      return percentToValue(item.percentage_duration, 100);
    return 0;
  } else {
    if (typeof item.count === "number") return item.count;
    if (typeof item.percentage_count === "number")
      return percentToValue(item.percentage_count, 100);
    return 0;
  }
}

/* ---------- Component ---------- */
export default function BrandOverview({
  selectedMatch,
  componentFolder = "brand-overview",
  apiPath = "/api/matches-files",
}) {
  const [metric, setMetric] = useState("duration"); // global metric: 'duration' or 'count'
  const [apiFiles, setApiFiles] = useState([]);
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);

  /* Fetch list of files from your API */
  useEffect(() => {
    let mounted = true;
    async function fetchFiles() {
      setLoading(true);
      try {
        if (!selectedMatch) {
          if (mounted) {
            setApiFiles([]);
            setFileMap({});
            setLoading(false);
          }
          return;
        }
        const params = new URLSearchParams({
          match: selectedMatch,
          component: componentFolder,
        });
        const res = await fetch(`${apiPath}?${params.toString()}`);
        const json = await res.json();
        if (mounted) setApiFiles(json.files || []);
      } catch (err) {
        console.error("Failed to fetch files from API:", err);
        if (mounted) setApiFiles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchFiles();
    return () => (mounted = false);
  }, [selectedMatch, componentFolder, apiPath]);

  /* Build file map (name -> parsed json) */
  useEffect(() => {
    let mounted = true;
    async function buildMap() {
      const map = {};
      await Promise.all(
        (apiFiles || []).map(async (f) => {
          if (!f || !f.name) return;
          const key = String(f.name).toLowerCase();
          if (f.content) {
            try {
              map[key] =
                typeof f.content === "string"
                  ? JSON.parse(f.content)
                  : f.content;
              return;
            } catch (err) {
              console.warn(
                `Could not JSON.parse file.content for ${f.name}`,
                err
              );
            }
          }
          if (f.url) {
            try {
              const r = await fetch(f.url);
              const txt = await r.text();
              try {
                map[key] = JSON.parse(txt);
              } catch {
                try {
                  map[key] = await r.json();
                } catch (err2) {
                  console.warn(`Failed to parse content at ${f.url}`, err2);
                }
              }
              return;
            } catch (err) {
              console.warn(`Failed to fetch file.url for ${f.name}`, err);
            }
          }
          if (f.content_string) {
            try {
              map[key] = JSON.parse(f.content_string);
              return;
            } catch (err) {
              console.warn("failed parse content_string", err);
            }
          }
        })
      );
      if (mounted) setFileMap(map);
    }
    if ((apiFiles || []).length > 0) buildMap();
    else setFileMap({});
    return () => (mounted = false);
  }, [apiFiles]);

  const getFileByName = (namePart) => {
    const matchKey = Object.keys(fileMap).find((k) =>
      k.includes(namePart.toLowerCase())
    );
    return matchKey ? fileMap[matchKey] : null;
  };

  /* Derive datasets */
  const topCards = useMemo(
    () =>
      getFileByName("brand_overview_top_cards") ||
      getFileByName("top_cards") ||
      {},
    [fileMap]
  );
  const brandShare = useMemo(
    () =>
      getFileByName("brand_overview_brand_share") ||
      getFileByName("brand_share") ||
      [],
    [fileMap]
  );
  const brandScreenTime = useMemo(
    () =>
      getFileByName("brand_overview_brand_screen_time") ||
      getFileByName("brand_screen_time") ||
      [],
    [fileMap]
  );
  const categoryExposure = useMemo(
    () =>
      getFileByName("brand_overview_category_exposure") ||
      getFileByName("category_exposure") ||
      [],
    [fileMap]
  );
  const stackedCompetitors = useMemo(
    () =>
      getFileByName("brand_overview_stacked_competitors") ||
      getFileByName("stacked_competitors") ||
      [],
    [fileMap]
  );

  const brandShareSorted = useMemo(() => {
    if (!Array.isArray(brandShare)) return [];
    const sortKey =
      metric === "duration" ? "percentage_duration" : "percentage_count";
    return [...brandShare]
      .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))
      .slice(0, 8);
  }, [brandShare, metric]);

  const topBrands = useMemo(() => {
    if (!Array.isArray(brandScreenTime)) return [];
    return [...brandScreenTime]
      .sort(
        (a, b) => getValueForMetric(b, metric) - getValueForMetric(a, metric)
      )
      .slice(0, 10)
      .map((d) => ({ ...d, value: getValueForMetric(d, metric) }));
  }, [brandScreenTime, metric]);

  const exposureByCategory = useMemo(() => {
    if (!Array.isArray(categoryExposure)) return [];
    return [...categoryExposure]
      .sort(
        (a, b) => getValueForMetric(b, metric) - getValueForMetric(a, metric)
      )
      .slice(0, 12)
      .map((d) => ({ ...d, value: getValueForMetric(d, metric) }));
  }, [categoryExposure, metric]);

  const stacked = useMemo(
    () =>
      buildStackedFromCompetitors(
        Array.isArray(stackedCompetitors) ? stackedCompetitors : []
      ),
    [stackedCompetitors]
  );

  const topBrandByDuration = topCards?.top_brand_duration || null;
  const topBrandByCount = topCards?.top_brand_count || null;

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading brand overview data...
      </div>
    );

  return (
    <div className="p-4 space-y-6">
      {/* Global metric selector */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Metric (global)
          </label>
          <select
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="duration">Duration (sec)</option>
            <option value="count">Count</option>
          </select>
        </div>

        {/* small top-brand info boxes (unchanged by metric) */}
        <div className="flex gap-3 ml-auto">
          <div className="bg-card rounded-md p-3">
            <div className="text-xs text-gray-500">Top Brand (Duration)</div>
            <div className="text-sm font-semibold">
              {topBrandByDuration?.brand ?? "—"}
            </div>
            <div className="text-xs text-gray-400">
              {formatSeconds(topBrandByDuration?.duration)}
            </div>
          </div>
          <div className="bg-card rounded-md p-3">
            <div className="text-xs text-gray-500">Top Brand (Count)</div>
            <div className="text-sm font-semibold">
              {topBrandByCount?.brand ?? "—"}
            </div>
            <div className="text-xs text-gray-400">
              Count: {topBrandByCount?.count ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Top row - 3 columns: Top duration, Top count, Brand share (pie) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* 1 - Top Brand (Duration) */}
        <div className="bg-card rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Top Brand (Duration)
            </h4>
            <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {topBrandByDuration?.brand ?? "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatSeconds(topBrandByDuration?.duration)}
            </p>
          </div>
        </div>

        {/* 2 - Top Brand (Count) */}
        <div className="bg-card rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Top Brand (Count)
            </h4>
            <p className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {topBrandByCount?.brand ?? "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Count: {topBrandByCount?.count ?? "—"}
            </p>
          </div>
        </div>

        {/* 3 - Brand Share (Pie) - uses global metric */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Brand Share 
            </h4>
          </div>

          <div className="h-52 mt-3">
            {brandShareSorted.length === 0 ? (
              <p className="text-sm text-gray-500">No data</p>
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
                    innerRadius={40}
                    outerRadius={80}
                    label={(entry) => entry.name}
                  >
                    {brandShareSorted.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                  />
                  {/* <Legend /> */}
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Middle area - 2 charts in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Brand Screen Time (horizontal bar) */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Brand Screen Time ({metric})
            </h4>
            <button
              onClick={() => setOpenModal("screen_time")}
              className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Open
            </button>
          </div>
          <div className="h-64 mt-3">
            {topBrands.length === 0 ? (
              <p className="text-sm text-gray-500">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topBrands}
                  margin={{ left: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="brand" type="category" width={180} />
                  <Tooltip
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                  />
                  <Legend />
                  <Bar dataKey="value" name={metric}>
                    {topBrands.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Exposure by Brand Category (vertical bar) */}
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Exposure by Category ({metric})
            </h4>
            <button
              onClick={() => setOpenModal("cat_exposure")}
              className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Open
            </button>
          </div>
          <div className="h-64 mt-3">
            {exposureByCategory.length === 0 ? (
              <p className="text-sm text-gray-500">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                  />
                  <Legend />
                  <Bar dataKey="value" fill={COLORS.bar} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom full-width: Brand Competitor Comparison (stacked full width) */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Brand Competitor Comparison (Stacked)
          </h4>
          <button
            onClick={() => setOpenModal("stacked_full")}
            className="px-2 py-1 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Open
          </button>
        </div>
        <div className="h-96 mt-3">
          {stacked.out.length === 0 ? (
            <p className="text-sm text-gray-500">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stacked.out}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                />
                {/* <Legend /> */}
                {stacked.brandList.map((b, idx) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    stackId="a"
                    fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Modal: expanded charts */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenModal(null)}
          />
          <div className="relative w-full max-w-6xl bg-card rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {openModal}
              </h4>
              <div>
                <button
                  onClick={() => setOpenModal(null)}
                  className="px-2 py-1 rounded-md bg-destructive text-destructive-foreground text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="h-[520px]">
              {openModal === "screen_time" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topBrands}
                    margin={{ left: 140 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="brand" type="category" width={220} />
                    <Tooltip
                      formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    />
                    <Legend />
                    <Bar dataKey="value" name={metric}>
                      {topBrands.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "cat_exposure" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exposureByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    />
                    <Legend />
                    <Bar dataKey="value" fill={COLORS.bar} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "stacked_full" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stacked.out}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip
                      formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    />
                    <Legend />
                    {stacked.brandList.map((b, idx) => (
                      <Bar
                        key={b}
                        dataKey={b}
                        stackId="a"
                        fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "brand_share" && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={brandShareSorted.map((d) => ({
                        name: d.brand,
                        value: getValueForMetric(d, metric),
                      }))}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={160}
                      label
                    >
                      {brandShareSorted.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
