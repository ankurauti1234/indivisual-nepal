"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo, useState, useEffect } from "react";

// shadcn/ui Select (used for the commentator filter)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------------- Brand Icons -------------------------- */
const BrandIcon = ({ brand }) => {
  const icons = {
    Nike: "https://cdn.worldvectorlogo.com/logos/nike-11.svg",
    Adidas: "https://cdn.worldvectorlogo.com/logos/adidas-7.svg",
    Puma: "https://cdn.worldvectorlogo.com/logos/puma-logo.svg",
    Pepsi: "https://cdn.worldvectorlogo.com/logos/pepsi-1.svg",
    Coke: "https://cdn.worldvectorlogo.com/logos/coca-cola-1.svg",
    Apple: "https://cdn.worldvectorlogo.com/logos/apple-14.svg",
    Samsung: "https://cdn.worldvectorlogo.com/logos/samsung-12.svg",
    BMW: "https://cdn.worldvectorlogo.com/logos/bmw-3.svg",
    Audi: "https://cdn.worldvectorlogo.com/logos/audi-1.svg",
    Mercedes: "https://cdn.worldvectorlogo.com/logos/mercedes-benz-15.svg",
    "Harley Davidson":
      "https://cdn.worldvectorlogo.com/logos/harley-davidson-1.svg",
    Ducati: "https://cdn.worldvectorlogo.com/logos/ducati-2.svg",
  };

  const src = icons[brand];
  const fallback = (
    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium flex items-center justify-center mr-2 text-gray-700 dark:text-gray-200">
      {String(brand || "").charAt(0) || "?"}
    </div>
  );

  if (!src) return fallback;

  return (
    <img
      src={src}
      alt={brand}
      className="w-6 h-6 inline-block mr-2 object-contain"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        const parent = e.currentTarget.parentNode;
        if (parent) {
          const fallbackEl = document.createElement("div");
          fallbackEl.className =
            "w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium flex items-center justify-center mr-2 text-gray-700 dark:text-gray-200";
          fallbackEl.textContent = String(brand || "").charAt(0) || "?";
          parent.insertBefore(fallbackEl, e.currentTarget);
        }
      }}
    />
  );
};

/* -------------------------- Colors -------------------------- */
const COLORS = [
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

/* -------------------------- Treemap Custom Content -------------------------- */
const CustomizedContent = (props) => {
  const {
    depth,
    x,
    y,
    width,
    height,
    index,
    name,
    value,
    onNodeClick,
    metric,
  } = props;

  if (width < 4 || height < 4) return null;

  const hasChildren =
    props.hasChildren !== undefined
      ? props.hasChildren
      : props.payload?.hasChildren || false;
  const fillColor = COLORS[index % COLORS.length];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke="#fff"
        strokeWidth={2}
        strokeOpacity={1}
        style={hasChildren ? { cursor: "pointer" } : {}}
        onClick={hasChildren ? () => onNodeClick(name) : undefined}
        className={hasChildren ? "transition-all hover:opacity-80" : ""}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={width > 120 ? 15 : 12}
            fontWeight={600}
            className="pointer-events-none"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fontWeight={500}
            className="pointer-events-none"
          >
            {value}
            {value !== undefined && metric === "duration" ? "s" : ""}
          </text>
        </>
      )}
    </g>
  );
};

/* -------------------------- Modal Component -------------------------- */
const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative w-[90%] ${
          wide ? "max-w-7xl" : "max-w-4xl"
        } bg-card rounded-lg shadow-lg p-4`}
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h4>
          <button
            onClick={onClose}
            className="px-1.5 py-1.5 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/80 text-sm"
          >
            Close
          </button>
        </div>
        <div className="h-[70vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
};

/* -------------------------- Main Component -------------------------- */
export default function MentionsAndIndustryView({ selectedMatch }) {
  const [metric, setMetric] = useState("duration");
  const [sort, setSort] = useState({ key: "duration", dir: "desc" });
  const [drillPath, setDrillPath] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openModal, setOpenModal] = useState(null); // 'commentary' | 'treemap' | null

  // commentator filter state
  const [commentatorFilter, setCommentatorFilter] = useState("All");

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
          component: "mentions-and-industry-view",
        });
        const res = await fetch(`/api/matches-files?${params.toString()}`);
        const data = await res.json();
        console.log("Mentions API Response:", data); // Debug log
        console.log("Files array:", data.files); // Debug files array
        if (data.files) {
          console.log(
            "File names:",
            data.files.map((f) => f.name)
          ); // Debug file names
        }
        if (mounted) setApiData(data.files || []);
      } catch (err) {
        console.error("Error fetching mentions data:", err);
        if (mounted) setApiData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => (mounted = false);
  }, [selectedMatch]);

  const getFile = (namePart) => {
    const file = apiData.find((f) => {
      const fileName = String(f.name).toLowerCase();
      return fileName.includes(namePart.toLowerCase());
    });
    console.log(
      `Looking for file with "${namePart}":`,
      file?.name || "Not found"
    );
    return file?.content || [];
  };

  const commentaryMentionsData = getFile("commentary");
  const exposureByCategoryData = getFile("treemap");

  /* --------------------- Commentator options (for the dropdown) --------------------- */
  const commentatorOptions = useMemo(() => {
    if (!commentaryMentionsData || commentaryMentionsData.length === 0)
      return ["All"];
    const names = Array.from(
      new Set(commentaryMentionsData.map((r) => r.name))
    ).filter(Boolean);
    return ["All", ...names.sort((a, b) => a.localeCompare(b))];
  }, [commentaryMentionsData]);

  /* --------------------- Table sorting & filtering --------------------- */
  const tableRows = useMemo(() => {
    if (!commentaryMentionsData || commentaryMentionsData.length === 0)
      return [];
    // apply commentator filter first
    const filtered =
      commentatorFilter === "All"
        ? [...commentaryMentionsData]
        : commentaryMentionsData.filter(
            (r) => String(r.name) === String(commentatorFilter)
          );

    // ensure sort.key is available on rows; default to metric if not
    const sortKey = sort.key || metric;
    filtered.sort((a, b) =>
      sort.dir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
    return filtered;
  }, [commentaryMentionsData, sort, metric, commentatorFilter]);

  /* --------------------- Flatten data for current level --------------------- */
  const currentTreemapData = useMemo(() => {
    if (!exposureByCategoryData || exposureByCategoryData.length === 0)
      return [];

    if (drillPath.length === 0) {
      return exposureByCategoryData.map((sector) => {
        const totalDuration =
          sector.children?.reduce((sum, cat) => {
            return (
              sum +
              (cat.children?.reduce(
                (s, brand) => s + (brand.duration || 0),
                0
              ) || 0)
            );
          }, 0) || 0;
        const totalCount =
          sector.children?.reduce((sum, cat) => {
            return (
              sum +
              (cat.children?.reduce((s, brand) => s + (brand.count || 0), 0) ||
                0)
            );
          }, 0) || 0;
        return {
          name: sector.name,
          duration: totalDuration,
          count: totalCount,
          hasChildren: true,
        };
      });
    }

    if (drillPath.length === 1) {
      const sector = exposureByCategoryData.find(
        (s) => s.name === drillPath[0]
      );
      if (!sector || !sector.children) return [];

      return sector.children.map((category) => {
        const totalDuration =
          category.children?.reduce(
            (s, brand) => s + (brand.duration || 0),
            0
          ) || 0;
        const totalCount =
          category.children?.reduce((s, brand) => s + (brand.count || 0), 0) ||
          0;
        return {
          name: category.name,
          duration: totalDuration,
          count: totalCount,
          hasChildren: true,
        };
      });
    }

    if (drillPath.length === 2) {
      const sector = exposureByCategoryData.find(
        (s) => s.name === drillPath[0]
      );
      if (!sector || !sector.children) return [];

      const category = sector.children.find((c) => c.name === drillPath[1]);
      if (!category || !category.children) return [];

      return category.children.map((brand) => ({
        name: brand.name,
        duration: brand.duration || 0,
        count: brand.count || 0,
        hasChildren: false,
      }));
    }

    return [];
  }, [exposureByCategoryData, drillPath]);

  /* --------------------- Click handling --------------------- */
  const handleNodeClick = (name) => {
    setDrillPath((prev) => [...prev, name]);
  };

  const handleBack = () => {
    setDrillPath((prev) => prev.slice(0, -1));
  };

  const breadcrumb = useMemo(() => {
    const levels = ["All Sectors", ...drillPath];
    return levels.join(" > ");
  }, [drillPath]);

  const levelName = useMemo(() => {
    if (drillPath.length === 0) return "Sectors";
    if (drillPath.length === 1) return "Categories";
    return "Brands";
  }, [drillPath]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading mentions data...
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
    <div className="p-4 space-y-6 bg-card min-h-screen">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Metric
        </label>
        <select
          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-card text-sm focus:ring-2 focus:ring-blue-500"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="duration">Duration (sec)</option>
          <option value="count">Count</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Commentary Table */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start gap-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Commentary Brand Mentions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing only the selected metric:{" "}
                <strong>
                  {metric === "duration" ? "Duration (s)" : "Count"}
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Commentator filter (shadcn Select) */}
              <div className="bg-card rounded-lg p-2">
                <label className="text-xs text-gray-500 block mb-1">
                  Commentator
                </label>
                <Select
                  value={commentatorFilter}
                  onValueChange={setCommentatorFilter}
                >
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {commentatorOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <button
                onClick={() => setOpenModal("commentary")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
              >
                Open
              </button> */}
            </div>
          </div>

          {tableRows.length === 0 ? (
            <p className="text-sm text-gray-500">
              No commentary data available
            </p>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      onClick={() =>
                        setSort((s) => ({
                          key: "brand",
                          dir:
                            s.key === "brand" && s.dir === "desc"
                              ? "asc"
                              : "desc",
                        }))
                      }
                      className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Brand{" "}
                      {sort.key === "brand" &&
                        (sort.dir === "desc" ? "↓" : "↑")}
                    </th>

                    {/* show only the selected metric column */}
                    {metric === "duration" ? (
                      <th
                        onClick={() =>
                          setSort((s) => ({
                            key: "duration",
                            dir:
                              s.key === "duration" && s.dir === "desc"
                                ? "asc"
                                : "desc",
                          }))
                        }
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Duration (s){" "}
                        {sort.key === "duration" &&
                          (sort.dir === "desc" ? "↓" : "↑")}
                      </th>
                    ) : (
                      <th
                        onClick={() =>
                          setSort((s) => ({
                            key: "count",
                            dir:
                              s.key === "count" && s.dir === "desc"
                                ? "asc"
                                : "desc",
                          }))
                        }
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Count{" "}
                        {sort.key === "count" &&
                          (sort.dir === "desc" ? "↓" : "↑")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {tableRows.map((row) => (
                    <tr
                      key={`${row.brand}-${row.name ?? ""}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm flex items-center text-gray-900 dark:text-gray-100">
                        <BrandIcon brand={row.brand} />
                        <div>
                          <div>{row.brand}</div>
                          <div className="text-[11px] text-gray-500">
                            {row.name}
                          </div>
                        </div>
                      </td>

                      {metric === "duration" ? (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {row.duration}
                        </td>
                      ) : (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {row.count}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Treemap */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Market Share by {levelName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {breadcrumb} • {metric === "duration" ? "Duration" : "Count"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {drillPath.length > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              )}

              {/* <button
                onClick={() => setOpenModal("treemap")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
              >
                Open
              </button> */}
            </div>
          </div>

          {currentTreemapData.length === 0 ? (
            <p className="text-sm text-gray-500">No treemap data available</p>
          ) : (
            <div className="h-96 w-full bg-card rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={currentTreemapData}
                  dataKey={metric}
                  stroke="#fff"
                  content={(contentProps) => (
                    <CustomizedContent
                      {...contentProps}
                      onNodeClick={handleNodeClick}
                      metric={metric}
                    />
                  )}
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="text-sm">
                          <p className="font-medium">{d.name}</p>
                          <p className="text-gray-600">
                            {metric === "duration" ? "Duration" : "Count"}:{" "}
                            <strong>
                              {d[metric]}
                              {metric === "duration" ? "s" : ""}
                            </strong>
                          </p>
                          {d.hasChildren && (
                            <p className="text-xs text-gray-500 mt-1">
                              Click to drill down
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            {drillPath.length < 2
              ? "Click on any section to drill down"
              : "Brand level reached"}
          </div>
        </div>
      </div>

      {/* Modals for openable modules */}
      <Modal
        open={openModal === "commentary"}
        onClose={() => setOpenModal(null)}
        title={`Commentary - ${
          metric === "duration" ? "Duration (s)" : "Count"
        }`}
      >
        {/* commentator filter inside modal header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div />
          <div className="bg-card rounded-lg p-2">
            <label className="text-xs text-gray-500 block mb-1">
              Commentator
            </label>
            <Select
              value={commentatorFilter}
              onValueChange={setCommentatorFilter}
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {commentatorOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* reuse the table content inside modal (larger view) */}
        <div>
          {tableRows.length === 0 ? (
            <p className="text-sm text-gray-500">
              No commentary data available
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-card">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {metric === "duration" ? "Duration (s)" : "Count"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                  {tableRows.map((row) => (
                    <tr
                      key={`${row.brand}-${row.name ?? ""}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm flex items-center text-gray-900 dark:text-gray-100">
                        <BrandIcon brand={row.brand} />
                        <div>
                          <div>{row.brand}</div>
                          <div className="text-[11px] text-gray-500">
                            {row.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {metric === "duration" ? row.duration : row.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={openModal === "treemap"}
        wide={true}
        onClose={() => setOpenModal(null)}
        title={`Treemap - ${metric === "duration" ? "Duration" : "Count"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Market Share by {levelName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {breadcrumb} • {metric === "duration" ? "Duration" : "Count"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {drillPath.length > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            )}
          </div>
        </div>
        <div className="h-full">
          {currentTreemapData.length === 0 ? (
            <p className="text-sm text-gray-500">No treemap data available</p>
          ) : (
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={currentTreemapData}
                  dataKey={metric}
                  stroke="#fff"
                  content={(contentProps) => (
                    <CustomizedContent
                      {...contentProps}
                      onNodeClick={handleNodeClick}
                      metric={metric}
                    />
                  )}
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "8px 12px",
                    }}
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="text-sm">
                          <p className="font-medium">{d.name}</p>
                          <p className="text-gray-600">
                            {metric === "duration" ? "Duration" : "Count"}:{" "}
                            <strong>
                              {d[metric]}
                              {metric === "duration" ? "s" : ""}
                            </strong>
                          </p>
                          {d.hasChildren && (
                            <p className="text-xs text-gray-500 mt-1">
                              Click to drill down
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
