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
  LabelList,
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

/* ---------- Utils ---------- */

// Build flattened rows for event-based charts, deduping events and preserving order
const flattenEventRows = (data, metric) => {
  if (!data || data.length === 0) return [];

  // collect all brand names across events (rows.brands is an array)
  const brands = Array.from(
    new Set(data.flatMap((row) => (row.brands || []).map((b) => b.brand)))
  );

  // preserve first-seen order of events while deduping by event name
  const eventMap = new Map();
  for (const row of data) {
    const ev = row.event;
    if (!eventMap.has(ev)) {
      // shallow clone to avoid mutating original
      eventMap.set(ev, {
        ...row,
        brands: Array.isArray(row.brands) ? [...row.brands] : [],
      });
    } else {
      // merge brands of duplicate event into existing entry
      const existing = eventMap.get(ev);
      existing.brands = [...(existing.brands || []), ...(row.brands || [])];
    }
  }

  const uniqueEventRows = Array.from(eventMap.values());

  return uniqueEventRows.map((row) => {
    const flatRow = { event: row.event };
    brands.forEach((brand) => {
      // If multiple entries for same brand exist in merged brands, sum them
      const matches = (row.brands || []).filter((x) => x.brand === brand);
      if (matches.length === 0) {
        flatRow[brand] = 0;
      } else {
        flatRow[brand] = matches.reduce(
          (s, m) => s + Number(m[metric] ?? 0),
          0
        );
      }
    });
    return flatRow;
  });
};

// Build flattened rows for Exposure by Match Phase (one row per phase, brand columns)
const buildPhaseRows = (rows, metric) => {
  if (!rows || rows.length === 0) return { flatRows: [], brands: [] };

  // ensure uniform field names
  const normalized = rows.map((r) => ({
    match_phase: r.match_phase ?? r.Match_Phase ?? r.phase ?? "Unknown",
    brand: r.brand,
    value: Number(r[metric] ?? r.duration ?? r.count ?? 0),
  }));

  // collect brand names across phases (preserve insertion order)
  const brandSet = new Set();
  normalized.forEach((r) => {
    if (r.brand) brandSet.add(r.brand);
  });
  const brands = Array.from(brandSet);

  // group by phase and aggregate by brand
  const phaseMap = new Map();
  normalized.forEach((r) => {
    const phase = r.match_phase;
    if (!phaseMap.has(phase)) phaseMap.set(phase, {});
    const acc = phaseMap.get(phase);
    acc[r.brand] = (acc[r.brand] || 0) + r.value;
  });

  const flat = [];
  for (const [phase, brandVals] of phaseMap.entries()) {
    const row = { match_phase: phase };
    brands.forEach((b) => {
      row[b] = Number(brandVals[b] || 0);
    });
    flat.push(row);
  }

  return { flatRows: flat, brands };
};

function normalizeHighEmotion(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    brand: r.Brand ?? r.brand ?? null,
    sector: r.sector ?? null,
    duration: Number(r.duration ?? 0),
    count: Number(r.count ?? 0),
  }));
}

function normalizeExposureByPhase(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => ({
    match_phase: r.Match_Phase ?? r.match_phase ?? r.phase ?? "Unknown",
    sector: r.sector ?? null,
    brand: r.brand ?? r.Brand ?? null,
    duration: Number(r.duration ?? 0),
    count: Number(r.count ?? 0),
  }));
}

/* ---------- shadcn Select import (kept if present) ---------- */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MatchMomentsAndTiming({ selectedMatch }) {
  const [metric, setMetric] = useState("duration");
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state for modals / openable modules
  const [openModal, setOpenModal] = useState(null);

  // Global sector filter state (multi-select)
  const [selectedSectors, setSelectedSectors] = useState([]);

  function toggleSector(sector) {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  }

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

  /* ---------------------------
     available sectors (global)
     --------------------------- */
  const availableSectors = useMemo(() => {
    const s = new Set();
    (eventBasedVisibilityBase || []).forEach((row) =>
      (row.brands || []).forEach((b) => b.sector && s.add(b.sector))
    );
    (highEmotionRaw || []).forEach((r) => r.sector && s.add(r.sector));
    (exposureByPhaseRaw || []).forEach((r) => r.sector && s.add(r.sector));
    return Array.from(s).sort();
  }, [eventBasedVisibilityBase, highEmotionRaw, exposureByPhaseRaw]);

  /* ---------------------------
     apply sector filter to raw sources
     --------------------------- */

  // Filter event-based rows by keeping only brands that match selected sectors (if any)
  const eventBasedFiltered = useMemo(() => {
    if (!eventBasedVisibilityBase || eventBasedVisibilityBase.length === 0)
      return [];
    if (!selectedSectors || selectedSectors.length === 0)
      return eventBasedVisibilityBase;

    return eventBasedVisibilityBase.map((row) => ({
      ...row,
      brands: (row.brands || []).filter((b) =>
        selectedSectors.includes(b.sector)
      ),
    }));
  }, [eventBasedVisibilityBase, selectedSectors]);

  // Filter high-emotion rows by sector
  const highEmotionFilteredRaw = useMemo(() => {
    if (!highEmotionRaw || highEmotionRaw.length === 0) return [];
    if (!selectedSectors || selectedSectors.length === 0) return highEmotionRaw;
    return highEmotionRaw.filter((r) => selectedSectors.includes(r.sector));
  }, [highEmotionRaw, selectedSectors]);

  // Filter exposure-by-phase by sector
  const exposureByPhaseFilteredRaw = useMemo(() => {
    if (!exposureByPhaseRaw || exposureByPhaseRaw.length === 0) return [];
    if (!selectedSectors || selectedSectors.length === 0)
      return exposureByPhaseRaw;
    return exposureByPhaseRaw.filter((r) => selectedSectors.includes(r.sector));
  }, [exposureByPhaseRaw, selectedSectors]);

  /* ---------------------------
     normalized + memoized data
     --------------------------- */
  const highEmotionVisibilityData = useMemo(
    () => normalizeHighEmotion(highEmotionFilteredRaw),
    [highEmotionFilteredRaw]
  );

  const exposureByPhaseData = useMemo(
    () => normalizeExposureByPhase(exposureByPhaseFilteredRaw),
    [exposureByPhaseFilteredRaw]
  );

  // eventRows flattened after filtering brands inside each event row (deduping implemented)
  const eventRows = useMemo(
    () => flattenEventRows(eventBasedFiltered, metric),
    [eventBasedFiltered, metric]
  );

  // event brands for legend (after applying sector filter)
  const eventBrands = useMemo(() => {
    if (!eventBasedFiltered || eventBasedFiltered.length === 0) return [];
    return Array.from(
      new Set(
        eventBasedFiltered.flatMap((row) =>
          (row.brands || []).map((b) => b.brand)
        )
      )
    );
  }, [eventBasedFiltered]);

  // color map for event brands
  const colorMap = useMemo(() => {
    const map = Object.create(null);
    (eventBrands || []).forEach((b, i) => {
      map[b] = DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
    });
    return map;
  }, [eventBrands]);

  // Sorted high-emotion by metric
  const sortedHighEmotion = useMemo(() => {
    return [...highEmotionVisibilityData].sort((a, b) => b[metric] - a[metric]);
  }, [highEmotionVisibilityData, metric]);

  // Default visible in card: Top 5
  const visibleHighEmotionData = useMemo(() => {
    return sortedHighEmotion.slice(0, 5);
  }, [sortedHighEmotion]);

  // modal version shows all (already filtered by sector)
  const highEmotionModalData = sortedHighEmotion;

  /* ---------------------------
     Exposure by Phase flattened for brand-level bars
     --------------------------- */
  const { flatRows: phaseRows, brands: phaseBrands } = useMemo(
    () => buildPhaseRows(exposureByPhaseData, metric),
    [exposureByPhaseData, metric]
  );

  const phaseColorMap = useMemo(() => {
    const map = {};
    (phaseBrands || []).forEach((b, i) => {
      map[b] = DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
    });
    return map;
  }, [phaseBrands]);

  /* ---------------------------
     Filtered tooltip (hide zero-value series)
     - defined here so it can access `metric` state for unit formatting
     --------------------------- */
  const FilteredTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    // keep only series with value > 0
    const filtered = payload.filter((p) => Number(p.value || 0) !== 0);
    if (!filtered.length) return null;

    const unit = metric === "duration" ? "s" : "";

    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        {label && <p className="text-xs font-semibold mb-1">{label}</p>}
        {filtered.map((p, i) => (
          <p key={i} className="text-xs">
            <span className="font-semibold">{p.name}:</span> {p.value}
            {unit}
          </p>
        ))}
      </div>
    );
  };

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
      <div className="flex flex-wrap items-center gap-3">
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

        {/* Global Sector Filter on the right */}
        <div className="ml-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Sector
          </label>
          <div className="flex items-center gap-2">
            <Select onValueChange={(val) => toggleSector(val)}>
              <SelectTrigger className="w-64">
                <SelectValue
                  placeholder={
                    selectedSectors.length
                      ? `${selectedSectors.length} selected`
                      : "Select sectors..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSectors.map((s) => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{s}</span>
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
              className="px-2 py-1 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Clear
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSectors.length === 0 ? (
              <div className="text-sm text-muted-foreground">All sectors</div>
            ) : (
              selectedSectors.map((s) => (
                <div
                  key={s}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded bg-muted text-xs"
                >
                  <span>{s}</span>
                  <button onClick={() => toggleSector(s)} className="text-xs">
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Event Based Visibility */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Event Based Visibility
            </h3>
            {/* <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("event")}
              >
                Open
              </button>
            </div> */}
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventRows} margin={{ right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<FilteredTooltip />} />
                <Legend className="text-sm" />
                {eventBrands.map((b) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    fill={colorMap[b] || DEFAULT_PALETTE[0]}
                    barSize={26}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Emotion Visibility - no per-chart filter, respects global sector */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              High Emotion Visibility
            </h3>
            {/* <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("highemotion")}
              >
                Open
              </button>
            </div> */}
          </div>

          <div
            style={{
              height: Math.min(
                72 * Math.max(visibleHighEmotionData.length, 1) + 80,
                700
              ),
            }}
            className="transition-all duration-300"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={visibleHighEmotionData}
                margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
                barGap={8}
                barCategoryGap={8}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="brand"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={160}
                  interval={0}
                />
                <Tooltip />
                <Bar
                  dataKey={metric}
                  name={metric === "duration" ? "Duration (sec)" : "Count"}
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                >
                  {visibleHighEmotionData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                    />
                  ))}
                  <LabelList
                    dataKey={metric}
                    position="right"
                    formatter={(v) => (metric === "duration" ? `${v}s` : v)}
                    className="text-xs fill-primary"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exposure by Match Phase - brand-level bars */}
        <div className="bg-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Exposure by Match Phase
            </h3>
            {/* <div className="flex gap-2">
              <button
                className="px-1.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={() => setOpenModal("phase")}
              >
                Open
              </button>
            </div> */}
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={phaseRows} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="match_phase" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<FilteredTooltip />} />
                <Legend />
                {phaseBrands.map((b) => (
                  <Bar
                    key={b}
                    dataKey={b}
                    fill={phaseColorMap[b] || DEFAULT_PALETTE[0]}
                    barSize={24}
                  >
                    {/* LabelList removed to avoid clutter in grouped layout */}
                  </Bar>
                ))}
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
                    <Tooltip content={<FilteredTooltip />} />
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
                    data={highEmotionModalData}
                    margin={{ left: 120, right: 30, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="brand"
                      type="category"
                      width={200}
                      interval={0}
                    />
                    <Tooltip />
                    <Bar
                      dataKey={metric}
                      name={metric === "duration" ? "Duration (sec)" : "Count"}
                      radius={[0, 6, 6, 0]}
                      barSize={16}
                    >
                      {highEmotionModalData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {openModal === "phase" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={phaseRows} margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="match_phase" />
                    <YAxis />
                    <Tooltip content={<FilteredTooltip />} />
                    <Legend />
                    {phaseBrands.map((b) => (
                      <Bar
                        key={b}
                        dataKey={b}
                        fill={phaseColorMap[b] || DEFAULT_PALETTE[0]}
                      />
                    ))}
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
