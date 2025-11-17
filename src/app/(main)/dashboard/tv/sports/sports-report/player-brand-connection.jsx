"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo, useState, useEffect } from "react";

// shadcn/ui imports
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, X } from "lucide-react";

/* ----------------------------- Colors -------------------------------- */
const DEFAULT_PALETTE = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#a78bfa",
  "#f472b6",
];

/* ------------------------- Color Utilities -------------------------- */
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
      if (row.brands && Array.isArray(row.brands)) {
        row.brands.forEach((b) => {
          if (b && b.name) names.add(String(b.name));
        });
      }
    }
  }

  const sorted = Array.from(names).sort((a, b) => a.localeCompare(b));
  const colorMap = {};
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

/* ------------------------- Helpers -------------------------- */
const normalizePlayer = (p) =>
  String(p || "")
    .replace(/\r|\n/g, "")
    .trim();

const getPlayers = (rows) => {
  if (!rows || rows.length === 0) return [];
  return Array.from(new Set(rows.map((r) => normalizePlayer(r.player))))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
};

const getAllBrands = (rows) => {
  if (!rows || rows.length === 0) return [];
  return Array.from(
    new Set(rows.flatMap((p) => (p.brands || []).map((b) => b.name)))
  );
};

/* ------------------------- Modal -------------------------- */
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-[90%] max-w-7xl bg-white dark:bg-gray-900 rounded-xl shadow-xl p-5 z-50">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h4>
          <button
            onClick={onClose}
            className="px-1.5 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/80 text-sm"
          >
            Close
          </button>
        </div>
        <div className="h-[75vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
};

/* ======================= Component ======================= */
export default function PlayerBrandConnection({ selectedMatch }) {
  const [metric, setMetric] = useState("duration");
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [playerFilter, setPlayerFilter] = useState([]);

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
          component: "player-brand-connection",
        });
        const res = await fetch(`/api/matches-files?${params.toString()}`);
        const data = await res.json();
        if (mounted) {
          const file = data.files?.find((f) =>
            String(f.name).toLowerCase().includes("player_brand")
          );
          const normalized = (file?.content || []).map((r) => ({
            ...r,
            player: normalizePlayer(r.player),
          }));
          setApiData(normalized);
        }
      } catch (err) {
        console.error("Error fetching player brand data:", err);
        if (mounted) setApiData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [selectedMatch]);

  const allPlayers = useMemo(() => getPlayers(apiData), [apiData]);

  const filteredApiData = useMemo(() => {
    if (!playerFilter || playerFilter.length === 0) return apiData;
    const setFilter = new Set(playerFilter);
    return apiData.filter((r) => setFilter.has(String(r.player)));
  }, [apiData, playerFilter]);

  const allBrands = useMemo(
    () => getAllBrands(filteredApiData),
    [filteredApiData]
  );

  const brandColorMap = useMemo(() => {
    return buildDynamicColorMap({
      datasets: [filteredApiData],
      palette: DEFAULT_PALETTE,
    });
  }, [filteredApiData]);

  const chartData = useMemo(() => {
    if (!filteredApiData || filteredApiData.length === 0) return [];
    return filteredApiData.map((p) => {
      const row = { player: p.player };
      allBrands.forEach((brand) => {
        const hit = (p.brands || []).find((b) => b.name === brand);
        row[brand] = hit ? Number(hit[metric] || 0) : 0;
      });
      return row;
    });
  }, [metric, allBrands, filteredApiData]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading player brand data...
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

  if (!apiData || apiData.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No player brand connection data available
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Controls row: Metric + Player filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
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

        {/* Multi-Select Players */}
        <div className="ml-auto w-full sm:w-[420px]">
          <div className="bg-card rounded-xl p-3">
            <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">
              Players
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between h-auto py-2 px-3 text-left font-normal"
                >
                  <div className="flex flex-wrap gap-1 max-w-full">
                    {playerFilter.length === 0 ? (
                      <span className="text-muted-foreground">
                        {allPlayers.length === 0
                          ? "No players"
                          : "Select players..."}
                      </span>
                    ) : (
                      playerFilter.map((player) => (
                        <Badge
                          key={player}
                          variant="secondary"
                          className="mr-1 mb-1 text-xs"
                        >
                          {player}
                          <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              setPlayerFilter(
                                playerFilter.filter((p) => p !== player)
                              );
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-full p-0 max-w-[420px]"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search players..." />
                  <CommandEmpty>No player found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    <CommandItem
                      onSelect={() => setPlayerFilter(allPlayers)}
                      className="cursor-pointer"
                    >
                      <span className="font-medium">Select All</span>
                    </CommandItem>
                    <CommandItem
                      onSelect={() => setPlayerFilter([])}
                      className="cursor-pointer"
                    >
                      <span className="font-medium text-destructive">
                        Clear All
                      </span>
                    </CommandItem>

                    <div className="h-px bg-border my-1" />

                    {allPlayers.map((player) => (
                      <CommandItem
                        key={player}
                        onSelect={() => {
                          setPlayerFilter(
                            playerFilter.includes(player)
                              ? playerFilter.filter((p) => p !== player)
                              : [...playerFilter, player]
                          );
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                              playerFilter.includes(player)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-input"
                            }`}
                          >
                            {playerFilter.includes(player) && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="h-3 w-3"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {player}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <p className="text-xs text-gray-500 mt-1">
              You can select multiple players to compare. Leave empty to show
              all.
            </p>
          </div>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-card rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Player–Brand Association (
            {metric === "duration" ? "Duration (s)" : "Count"})
          </h3>
          {/* <button
            onClick={() => setOpenModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md"
          >
            Open Full View
          </button> */}
        </div>

        {chartData.length > 15 && (
          <p className="text-xs text-amber-600 mb-2">
            Showing {chartData.length} players. Consider filtering for clarity.
          </p>
        )}

        <div className="h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 24, left: 8, bottom: 24 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="player" fontSize={8} interval={0} />
              <YAxis
                label={{
                  value: metric === "duration" ? "Duration (s)" : "Count",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--tooltip-bg, #fff)",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => [
                  value,
                  `${name} ${metric === "duration" ? "(s)" : ""}`,
                ]}
              />
              {allBrands.map((brand) => (
                <Bar
                  key={brand}
                  dataKey={brand}
                  stackId="brands"
                  fill={brandColorMap[brand] || DEFAULT_PALETTE[0]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Use the metric dropdown to switch between Duration and Count. Use the
          Players selector to filter which players appear in the chart.
        </p>
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Player–Brand Association Chart"
      >
        <ResponsiveContainer width="100%" height={600}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="player" />
            <YAxis
              label={{
                value: metric === "duration" ? "Duration (s)" : "Count",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "var(--tooltip-bg, #fff)",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => [
                value,
                `${name} ${metric === "duration" ? "(s)" : ""}`,
              ]}
            />
            <Legend />
            {allBrands.map((brand) => (
              <Bar
                key={brand}
                dataKey={brand}
                stackId="brands"
                fill={brandColorMap[brand] || DEFAULT_PALETTE[0]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Modal>
    </div>
  );
}
