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

const COLORS = {
  bar: "#6366f1",
  grouped: ["#6366f1", "#10b981", "#f59e0b", "#f97316", "#ef4444"],
};

/* ---------- Color Utilities ---------- */
function strHash(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
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
      if (row.Brand) names.add(String(row.Brand));
      if (row.brand) names.add(String(row.brand));
      Object.keys(row).forEach((k) => {
        if (k === "event" || k === "phase") return;
        const v = row[k];
        if (v && typeof v === "object" && ("duration" in v || "count" in v)) {
          names.add(k);
        }
      });
    }
  }

  const sorted = Array.from(names).sort((a, b) => a.localeCompare(b));
  const colorMap = Object.create(null);
  for (let i = 0; i < sorted.length; i++) {
    const brand = sorted[i];
    if (i < palette.length) colorMap[brand] = palette[i];
    else {
      const hash = strHash(brand);
      colorMap[brand] = hslFromNumber(hash);
    }
  }
  return colorMap;
}

/* ---------- Utils ---------- */
const flattenEventRows = (data, metric) => {
  if (!data || data.length === 0) return [];

  const brands = Array.from(
    new Set(data.flatMap((row) => Object.keys(row.brands || {})))
  );

  return data.map((row) => {
    const flatRow = { event: row.event };
    brands.forEach((brand) => {
      flatRow[brand] = row.brands?.[brand]?.[metric] ?? 0;
    });
    return flatRow;
  });
};

function normalizeHighEmotion(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    brand: r.Brand ?? r.brand ?? null,
    duration: Number(r.duration ?? 0),
    count: Number(r.count ?? 0),
  }));
}

function normalizeExposureByPhase(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    match_phase: r.Match_Phase ?? r.match_phase ?? r.phase ?? "Unknown",
    duration: Number(r.duration ?? 0),
    count: Number(r.count ?? 0),
  }));
}

export default function MatchMomentsAndTiming({ selectedMatch }) {
  const [metric, setMetric] = useState("duration");
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state for modals / openable modules
  const [openModal, setOpenModal] = useState(null);

  // Brand filter for other widgets (if required later)
  const [selectedBrand, setSelectedBrand] = useState("__all__");

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
          component: "match-movement-and-timings",
        });
        const res = await fetch(`/api/matches-files?${params.toString()}`);
        const data = await res.json();
        if (mounted) setApiData(data.files || []);
      } catch (err) {
        console.error("Error fetching match movement data:", err);
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

  const eventBasedVisibilityBase = getFile("event_based");
  const highEmotionRaw = getFile("high_emotion");
  const exposureByPhaseRaw = getFile("by_phase");

  const highEmotionVisibilityData = useMemo(
    () => normalizeHighEmotion(highEmotionRaw),
    [highEmotionRaw]
  );

  const exposureByPhaseData = useMemo(
    () => normalizeExposureByPhase(exposureByPhaseRaw),
    [exposureByPhaseRaw]
  );

  const eventRows = useMemo(
    () => flattenEventRows(eventBasedVisibilityBase, metric),
    [eventBasedVisibilityBase, metric]
  );

  const eventBrands = useMemo(() => {
    if (!eventBasedVisibilityBase || eventBasedVisibilityBase.length === 0)
      return [];
    return Array.from(
      new Set(
        eventBasedVisibilityBase.flatMap((row) => Object.keys(row.brands || {}))
      )
    );
  }, [eventBasedVisibilityBase]);

  const colorMap = useMemo(() => {
    return buildDynamicColorMap({
      datasets: [eventBasedVisibilityBase, highEmotionVisibilityData],
      palette: DEFAULT_PALETTE,
    });
  }, [eventBasedVisibilityBase, highEmotionVisibilityData]);

  // Event color map (random but deterministic per event)
  const eventColorMap = useMemo(() => {
    const map = Object.create(null);
    (eventRows || []).forEach((r, i) => {
      const hash = strHash(String(r.event ?? i));
      map[r.event] = hslFromNumber(hash, 70, 50);
    });
    return map;
  }, [eventRows]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading match movement data...
      </div>
    );
  }

  if (!selectedMatch) {
    return (
      <div className="text-center py-20 text-gray-400">
        Please select a match to view analytics
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Metric
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Based Visibility */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Event Based Visibility
            </h3>
            <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("event")}
              >
                Open
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventRows} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {eventBrands.map((b) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    fill={colorMap[b] || DEFAULT_PALETTE[0]}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Emotion Visibility (brands on y-axis) */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              High Emotion Visibility
            </h3>
            <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("highemotion")}
              >
                Open
              </button>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={highEmotionVisibilityData}
                margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="brand"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={90}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar
                  dataKey="duration"
                  name="Duration (sec)"
                  radius={[0, 6, 6, 0]}
                >
                  {highEmotionVisibilityData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={colorMap[entry.brand] || COLORS.grouped[0]}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="count"
                  name="Count"
                  fill={COLORS.grouped[1]}
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exposure by Match Phase */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Exposure by Match Phase
            </h3>
            <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("phase")}
              >
                Open
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureByPhaseData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match_phase" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey={metric} fill={COLORS.bar} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simple modal / openable module */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenModal(null)}
          />

          <div className="relative w-full max-w-4xl bg-card rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {openModal === "event" && "Event Based Visibility"}
                {openModal === "highemotion" && "High Emotion Visibility"}
                {openModal === "phase" && "Exposure by Match Phase"}
              </h4>
              <div>
                <button
                  onClick={() => setOpenModal(null)}
                  className="px-1.5 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/80 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="h-[520px]">
              {openModal === "event" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventRows} margin={{ right: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {eventBrands.map((b) => (
                      <Bar
                        key={b}
                        dataKey={b}
                        fill={colorMap[b] || DEFAULT_PALETTE[0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "highemotion" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={highEmotionVisibilityData}
                    margin={{ left: 120 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="brand" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="duration" name="Duration">
                      {highEmotionVisibilityData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            colorMap[entry.brand] ||
                            DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
                          }
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="count" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "phase" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exposureByPhaseData} margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match_phase" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey={metric} fill={COLORS.bar} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
