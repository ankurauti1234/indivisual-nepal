"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  BarChart,
  Bar,
  ReferenceArea,
} from "recharts";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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

// Event to Color mapping using your existing palette
const EVENT_COLORS = {
  Toss: "#6366f1", // Indigo
  "Power Play": "#10b981", // Emerald Green
  "Mid Over": "#f59e0b", // Amber

  "Inning Break": "#125670", // Orange
  "Death Over": "#ef4444", // Red
  "Award Ceremony": "#8b5cf6", // Violet
  default: "#64748b",
};

const AGE_GROUPS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];

function VenueMultiSelect({
  venues,
  selected,
  onChange,
  title = "Filter by Venue",
}) {
  const toggleVenue = (venueId) => {
    onChange(
      selected.includes(venueId)
        ? selected.filter((v) => v !== venueId)
        : [...selected, venueId]
    );
  };

  const allSelected = selected.length === venues.length;
  const noneSelected = selected.length === 0;

  return (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue
          placeholder={
            noneSelected
              ? "All venues"
              : `${selected.length} venue${
                  selected.length !== 1 ? "s" : ""
                } selected`
          }
        />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 border-b">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {venues.map((id) => (
            <div
              key={id}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                toggleVenue(id);
              }}
            >
              <Checkbox checked={selected.includes(id)} />
              <span className="text-sm">Venue {id}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-3 py-2 border-t text-xs">
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange(venues);
            }}
            className="text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange([]);
            }}
            className="text-primary hover:underline"
          >
            Clear
          </button>
        </div>
      </SelectContent>
    </Select>
  );
}

function BrandMultiSelect({ brands, selected, onChange }) {
  const toggleBrand = (brand) => {
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand]
    );
  };

  const allSelected = selected.length === brands.length;
  const noneSelected = selected.length === 0;

  return (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue
          placeholder={
            noneSelected
              ? "All brands"
              : `${selected.length} brand${
                  selected.length !== 1 ? "s" : ""
                } selected`
          }
        />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2 border-b">
          <p className="text-xs font-medium text-muted-foreground">
            Filter by Brand
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-accent rounded cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                toggleBrand(brand);
              }}
            >
              <Checkbox checked={selected.includes(brand)} />
              <span className="text-sm">{brand}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-3 py-2 border-t text-xs">
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange(brands);
            }}
            className="text-primary hover:underline"
          >
            Select All
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange([]);
            }}
            className="text-primary hover:underline"
          >
            Clear
          </button>
        </div>
      </SelectContent>
    </Select>
  );
}

export default function AudienceMeasurment({
  selectedMatch,
  componentFolder = "audience-measurment",
  apiPath = "/api/matches-files",
}) {
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedGenderVenues, setSelectedGenderVenues] = useState([]);
  const [selectedGroupVenues, setSelectedGroupVenues] = useState([]);
  const [selectedEmotionVenues, setSelectedEmotionVenues] = useState([]);
  const [selectedFlowVenues, setSelectedFlowVenues] = useState([]);
  const [selectedPeakVenues, setSelectedPeakVenues] = useState([]);
  const [selectedAgeVenues, setSelectedAgeVenues] = useState([]);
  const [selectedBrandVenues, setSelectedBrandVenues] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedEngagementVenues, setSelectedEngagementVenues] = useState([]);
  const [selectedEventVenues, setSelectedEventVenues] = useState([]);
  const [selectedOcclusionVenues, setSelectedOcclusionVenues] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadFiles() {
      setLoading(true);
      if (!selectedMatch) {
        setFileMap({});
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${apiPath}?match=${selectedMatch}&component=${componentFolder}`
        );
        const { files = [] } = await res.json();

        const map = {};
        await Promise.all(
          files.map(async (f) => {
            if (!f?.name) return;
            const content =
              f.content || (f.url && (await (await fetch(f.url)).json()));
            if (content !== undefined) {
              map[f.name.toLowerCase()] = content;
            }
          })
        );
        if (mounted) setFileMap(map);
      } catch (err) {
        console.error(err);
        if (mounted) setFileMap({});
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFiles();
    return () => {
      mounted = false;
    };
  }, [selectedMatch, componentFolder, apiPath]);

  const getData = (filename) => {
    const key = Object.keys(fileMap).find((k) =>
      k.toLowerCase().includes(filename.toLowerCase())
    );
    const data = key ? fileMap[key] : null;
    return Array.isArray(data) ? data : [];
  };

  const GenderDistributionByVenue = useMemo(
    () => getData("gender_distribution_by_venue.json"),
    [fileMap]
  );
  const GroupDistribution = useMemo(
    () => getData("group_distribution.json"),
    [fileMap]
  );
  const EmotionDistribution = useMemo(
    () => getData("emotion_disribution.json"),
    [fileMap]
  );
  const AudienceFlowAndPeakViewrship = useMemo(
    () => getData("Audince_flow_and_peak_viewrship.json"),
    [fileMap]
  );
  const PeakAudienceComparison = useMemo(
    () => getData("peak_audince_comparison.json"),
    [fileMap]
  );
  const AgeGroupComposition = useMemo(
    () => getData("age_group_composition.json"),
    [fileMap]
  );
  const BrandEngagementData = useMemo(
    () => getData("lighiting_condition_comparison.json"),
    [fileMap]
  );
  const EngagementScoreTrend = useMemo(
    () => getData("engagement_score_trend.json"),
    [fileMap]
  );
  const EventWiseAudienceViewership = useMemo(
    () => getData("event_audince_viwership.json"),
    [fileMap]
  );
  const OcculsionLevelDistribution = useMemo(
    () => getData("occulsion_level_distribution.json"),
    [fileMap]
  );

  const allVenueIds = useMemo(() => {
    const ids = new Set();
    [
      ...GenderDistributionByVenue,
      ...GroupDistribution,
      ...EmotionDistribution,
      ...AudienceFlowAndPeakViewrship,
      ...PeakAudienceComparison,
      ...AgeGroupComposition,
      ...BrandEngagementData,
      ...EngagementScoreTrend,
      ...EventWiseAudienceViewership,
      ...OcculsionLevelDistribution,
    ].forEach((item) => {
      if (item.venue_id) ids.add(item.venue_id);
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [
    GenderDistributionByVenue,
    GroupDistribution,
    EmotionDistribution,
    AudienceFlowAndPeakViewrship,
    PeakAudienceComparison,
    AgeGroupComposition,
    BrandEngagementData,
    EngagementScoreTrend,
    EventWiseAudienceViewership,
    OcculsionLevelDistribution,
  ]);

  useEffect(() => {
    if (allVenueIds.length > 0) {
      const venues = allVenueIds;
      setSelectedGenderVenues(venues);
      setSelectedGroupVenues(venues);
      setSelectedEmotionVenues(venues);
      setSelectedFlowVenues(venues);
      setSelectedPeakVenues(venues);
      setSelectedAgeVenues(venues);
      setSelectedBrandVenues(venues);
      setSelectedEngagementVenues(venues);
      setSelectedEventVenues(venues);
      setSelectedOcclusionVenues(venues);
    }
  }, [allVenueIds]);

  const allBrands = useMemo(() => {
    const brands = [...new Set(BrandEngagementData.map((d) => d.brand))];
    return brands.sort();
  }, [BrandEngagementData]);

  useEffect(() => {
    if (allBrands.length > 0 && selectedBrands.length === 0) {
      setSelectedBrands(allBrands);
    }
  }, [allBrands]);

  const filterByVenues = (data, selected) =>
    selected.length > 0
      ? data.filter((d) => selected.includes(d.venue_id))
      : data;

  const genderPieData = useMemo(() => {
    const filtered = filterByVenues(
      GenderDistributionByVenue,
      selectedGenderVenues
    );
    const total = { male: 0, female: 0 };
    filtered.forEach((d) => {
      total.male += d.male || 0;
      total.female += d.female || 0;
    });
    return total.male + total.female > 0
      ? [
          { name: "Male", value: total.male },
          { name: "Female", value: total.female },
        ]
      : [];
  }, [GenderDistributionByVenue, selectedGenderVenues]);

  const groupPieData = useMemo(() => {
    const filtered = filterByVenues(GroupDistribution, selectedGroupVenues);
    const agg = filtered.reduce((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + (cur.count || 0);
      return acc;
    }, {});
    return Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [GroupDistribution, selectedGroupVenues]);

  const emotionPieData = useMemo(() => {
    const filtered = filterByVenues(EmotionDistribution, selectedEmotionVenues);
    const agg = filtered.reduce((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + (cur.count || 0);
      return acc;
    }, {});
    return Object.entries(agg)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [EmotionDistribution, selectedEmotionVenues]);

  const audienceFlowMultiLineData = useMemo(() => {
    const venues =
      selectedFlowVenues.length > 0 ? selectedFlowVenues : allVenueIds;
    const timeMap = {};

    AudienceFlowAndPeakViewrship.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const time = item.Timestamp;
      if (!timeMap[time]) timeMap[time] = { Timestamp: time };
      timeMap[time][`venue_${item.venue_id}`] = item.total_person_visible || 0;
    });

    return Object.values(timeMap).sort((a, b) =>
      a.Timestamp.localeCompare(b.Timestamp)
    );
  }, [AudienceFlowAndPeakViewrship, selectedFlowVenues, allVenueIds]);

  const flowVenueIds =
    selectedFlowVenues.length > 0 ? selectedFlowVenues : allVenueIds;

  const peakAudienceData = useMemo(() => {
    const venues =
      selectedPeakVenues.length > 0 ? selectedPeakVenues : allVenueIds;
    return PeakAudienceComparison.filter((d) => venues.includes(d.venue_id))
      .map((d) => ({
        venue_id: `Venue ${d.venue_id}`,
        total_viewing_screen: d.total_viewing_screen || 0,
      }))
      .sort((a, b) => a.venue_id.localeCompare(b.venue_id));
  }, [PeakAudienceComparison, selectedPeakVenues, allVenueIds]);

  const ageGroupChartData = useMemo(() => {
    const venues =
      selectedAgeVenues.length > 0 ? selectedAgeVenues : allVenueIds;
    const map = {};

    AgeGroupComposition.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const vid = item.venue_id;
      if (!map[vid]) map[vid] = { venue_id: `Venue ${vid}` };
      Object.keys(item).forEach((key) => {
        if (key !== "venue_id") {
          map[vid][key] = (map[vid][key] || 0) + (item[key] || 0);
        }
      });
    });

    return Object.values(map);
  }, [AgeGroupComposition, selectedAgeVenues, allVenueIds]);

  const brandEngagementChartData = useMemo(() => {
    const venues =
      selectedBrandVenues.length > 0 ? selectedBrandVenues : allVenueIds;
    const brands = selectedBrands.length > 0 ? selectedBrands : allBrands;

    const filtered = BrandEngagementData.filter(
      (d) => venues.includes(d.venue_id) && brands.includes(d.brand)
    );

    const agg = filtered.reduce((acc, cur) => {
      const brand = cur.brand;
      if (!acc[brand]) {
        acc[brand] = { brand, totalScore: 0, count: 0 };
      }
      acc[brand].totalScore += cur.engagement_score || 0;
      acc[brand].count += 1;
      return acc;
    }, {});

    return Object.values(agg)
      .map((item) => ({
        brand: item.brand,
        engagement_score: item.count > 0 ? item.totalScore / item.count : 0,
      }))
      .sort((a, b) => b.engagement_score - a.engagement_score);
  }, [
    BrandEngagementData,
    selectedBrandVenues,
    selectedBrands,
    allVenueIds,
    allBrands,
  ]);

  // ──────────────────────────────────────────────────────────────
  // ENGAGEMENT SCORE TREND – BULLETPROOF VERSION (works with gaps)
  // ──────────────────────────────────────────────────────────────
  const { engagementMultiLineData, eventMap, uniqueEvents } = useMemo(() => {
    const venues =
      selectedEngagementVenues.length > 0
        ? selectedEngagementVenues
        : allVenueIds;
    const times = [
      ...new Set(EngagementScoreTrend.map((d) => d.Timestamp)),
    ].sort();

    const timeMap = {};
    const eventMap = {}; // ← This is now returned

    times.forEach((t) => {
      timeMap[t] = { Timestamp: t };
      venues.forEach((v) => {
        timeMap[t][`venue_${v}`] = null;
      });
    });

    EngagementScoreTrend.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const t = item.Timestamp;
      const key = `venue_${item.venue_id}`;

      if (timeMap[t][key] === null) timeMap[t][key] = item.score;
      else timeMap[t][key] = (timeMap[t][key] + item.score) / 2;

      if (item.event && !eventMap[t]) {
        eventMap[t] = item.event;
      }
    });

    const data = Object.values(timeMap);
    const uniqueEvents = [...new Set(Object.values(eventMap))].sort();

    return {
      engagementMultiLineData: data,
      eventMap, // ← Exposed for X-axis coloring
      uniqueEvents,
    };
  }, [EngagementScoreTrend, selectedEngagementVenues, allVenueIds]);

  const engagementVenueIds =
    selectedEngagementVenues.length > 0
      ? selectedEngagementVenues
      : allVenueIds;

  const eventWiseAudienceData = useMemo(() => {
    const venues =
      selectedEventVenues.length > 0 ? selectedEventVenues : allVenueIds;
    const agg = {};

    EventWiseAudienceViewership.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const tag = item.tag || "Unknown";
      agg[tag] = (agg[tag] || 0) + (item.total || 0);
    });

    return Object.entries(agg)
      .map(([tag, total]) => ({ tag, total }))
      .sort((a, b) => b.total - a.total);
  }, [EventWiseAudienceViewership, selectedEventVenues, allVenueIds]);

  const occlusionLevels = useMemo(() => {
    return [
      ...new Set(OcculsionLevelDistribution.map((d) => d.occlusion_level)),
    ].sort();
  }, [OcculsionLevelDistribution]);

  const occlusionChartData = useMemo(() => {
    const venues =
      selectedOcclusionVenues.length > 0
        ? selectedOcclusionVenues
        : allVenueIds;
    const map = {};

    OcculsionLevelDistribution.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const vid = `Venue ${item.venue_id}`;
      if (!map[vid]) map[vid] = { venue_id: vid };
      map[vid][item.occlusion_level] =
        (map[vid][item.occlusion_level] || 0) + (item.count || 0);
    });

    return Object.values(map);
  }, [OcculsionLevelDistribution, selectedOcclusionVenues, allVenueIds]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading audience data...
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* Gender Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Gender Distribution</CardTitle>
            <Select
              value={String(selectedGenderVenues[0] ?? 1)}
              onValueChange={(value) =>
                setSelectedGenderVenues([Number(value)])
              }
            >
              <SelectTrigger className="w-[150px] h-8 text-sm">
                <SelectValue placeholder="Venue 1" />
              </SelectTrigger>
              <SelectContent>
                {allVenueIds.map((id) => (
                  <SelectItem key={id} value={String(id)}>
                    Venue {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {genderPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {genderPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground pt-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top 5 Brands by Engagement Score */}
        <Card className="bg-card h-94">
          <CardHeader className="flex items-start justify-between gap-3 pb-2">
            <div>
              <CardTitle className="text-xl font-medium">
                Top 5 Brands by Engagement Score
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Highest scoring brands for the selected venue
              </p>
            </div>
            <Select
              value={String(selectedGroupVenues[0] ?? 1)}
              onValueChange={(value) => setSelectedGroupVenues([Number(value)])}
            >
              <SelectTrigger className="w-[150px] h-8 text-sm">
                <SelectValue placeholder="Venue 1" />
              </SelectTrigger>
              <SelectContent>
                {allVenueIds.map((id) => (
                  <SelectItem key={id} value={String(id)}>
                    Venue {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <div className="px-4">
            <div className="border-t border-white/10 my-2" />
          </div>
          <CardContent className="px-4 pb-2 h-[calc(100%-80px)] overflow-hidden">
            {(() => {
              const venueId = selectedGroupVenues[0] ?? 1;
              const gd = Array.isArray(GroupDistribution)
                ? GroupDistribution
                : [];
              const venueObj = gd.find((v) => v?.venue_id === venueId) || {};
              const brands = Array.isArray(venueObj?.brands)
                ? venueObj.brands
                : [];
              const topFive = brands
                .map((b) => ({
                  brand: b?.brand ?? "Unknown",
                  score: typeof b?.score === "number" ? b.score : 0,
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);

              if (topFive.length === 0) {
                return (
                  <p className="text-center text-muted-foreground text-sm">
                    No data available
                  </p>
                );
              }

              return (
                <div className="flex flex-col gap-2">
                  {topFive.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="text-sm font-medium text-[#55b585] truncate">
                        {b.brand}
                      </div>
                      <div className="text-sm font-semibold text-indigo-400">
                        {b.score >= 1
                          ? Math.round(b.score)
                          : b.score.toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Emotion Distribution */}
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Emotion Distribution</CardTitle>
            <Select
              value={String(selectedEmotionVenues[0] ?? 1)}
              onValueChange={(value) =>
                setSelectedEmotionVenues([Number(value)])
              }
            >
              <SelectTrigger className="w-[150px] h-8 text-sm">
                <SelectValue placeholder="Venue 1" />
              </SelectTrigger>
              <SelectContent>
                {allVenueIds.map((id) => (
                  <SelectItem key={id} value={String(id)}>
                    Venue {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {emotionPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emotionPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {emotionPieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground pt-8">
                No data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      Audience Flow Over Time
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Audience Flow Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Each line = one venue
            </p>
          </div>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedFlowVenues}
            onChange={setSelectedFlowVenues}
          />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={audienceFlowMultiLineData}
              margin={{ top: 20, right: 50, left: 40, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
              <XAxis
                dataKey="Timestamp"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                label={{
                  value: "People Visible",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="top" height={46} />
              {flowVenueIds.map((venueId, index) => (
                <Line
                  key={venueId}
                  type="monotone"
                  dataKey={`venue_${venueId}`}
                  name={`Venue ${venueId}`}
                  stroke={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Peak Audience Comparison */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Peak Audience Comparison by Venue
          </CardTitle>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedPeakVenues}
            onChange={setSelectedPeakVenues}
          />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={peakAudienceData}
              margin={{ top: 40, right: 30, left: 40, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="venue_id"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total_viewing_screen"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              >
                <LabelList
                  position="top"
                  formatter={(v) => v}
                  style={{ fontWeight: "bold" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Age Group Composition */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Age Group Composition by Venue
          </CardTitle>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedAgeVenues}
            onChange={setSelectedAgeVenues}
          />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={ageGroupChartData}
              margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="venue_id"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                label={{
                  value: "Number of People",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" />
              {AGE_GROUPS.map((age, index) => (
                <Bar
                  key={age}
                  dataKey={age}
                  name={age}
                  stackId="a"
                  fill={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Brand-wise Engagement Score */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl">
              Brand-wise Engagement Score
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Average engagement score per brand across selected venues
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <VenueMultiSelect
              venues={allVenueIds}
              selected={selectedBrandVenues}
              onChange={setSelectedBrandVenues}
            />
            <BrandMultiSelect
              brands={allBrands}
              selected={selectedBrands}
              onChange={setSelectedBrands}
            />
          </div>
        </CardHeader>
        <CardContent>
          {brandEngagementChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={brandEngagementChartData}
                margin={{ top: 20, right: 30, left: 60, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="brand"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 1]}
                  label={{
                    value: "Engagement Score",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(v) => v.toFixed(3)}
                />
                <Bar
                  dataKey="engagement_score"
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                >
                  {/* <LabelList
                    dataKey="engagement_score"
                    position="top"
                    formatter={(v) => v.toFixed(3)}
                    style={{ fontWeight: "bold" }}
                  /> */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground pt-20">
              No data available
            </p>
          )}
        </CardContent>
      </Card>
      {/* ENGAGEMENT SCORE TREND - UPDATED WITH EVENT COLORS & LEGEND */}
      {/* ENGAGEMENT SCORE TREND - FINAL BEAUTIFUL VERSION */}
      {/* ENGAGEMENT SCORE TREND – X-AXIS TIMESTAMPS COLORED BY EVENT */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Engagement Score Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Average engagement per venue over match time
            </p>
          </div>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedEngagementVenues}
            onChange={setSelectedEngagementVenues}
          />
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={520}>
            <LineChart
              data={engagementMultiLineData}
              margin={{ top: 20, right: 60, left: 50, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

              {/* Custom X-Axis with colored ticks based on event */}
              <XAxis
                dataKey="Timestamp"
                angle={90}
                textAnchor="end"
                height={100}
                tickFormatter={(timestamp) => timestamp}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const timestamp = payload.value;
                  const event = eventMap[timestamp] || "normal";
                  const color = EVENT_COLORS[event] || EVENT_COLORS.default;

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="end"
                        fill={color}
                        fontSize={10}
                        fontWeight="600"
                        angle={30}
                      >
                        {timestamp}
                      </text>
                    </g>
                  );
                }}
              />

              <YAxis
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                tick={{ fill: "#94a3b8" }}
                label={{
                  value: "Engagement Score",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#94a3b8" },
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: 8,
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(v) => (v !== null ? Number(v).toFixed(3) : "—")}
              />

              {/* Venue Lines */}
              {engagementVenueIds.map((venueId, idx) => (
                <Line
                  key={venueId}
                  type="monotone"
                  dataKey={`venue_${venueId}`}
                  name={`Venue ${venueId}`}
                  stroke={DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length]}
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
                  }}
                  activeDot={{ r: 8 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}

              <Legend verticalAlign="top" height={50} />
            </LineChart>
          </ResponsiveContainer>

          {/* EVENT LEGEND BELOW CHART */}
          {uniqueEvents.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10 px-6">
              {uniqueEvents.map((event) => (
                <div key={event} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full shadow-md border border-white/20"
                    style={{
                      backgroundColor:
                        EVENT_COLORS[event] || EVENT_COLORS.default,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-300">
                    {event
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Event-Wise Audience Viewership */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Event-Wise Audience Viewership
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total audience per event tag
            </p>
          </div>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedEventVenues}
            onChange={setSelectedEventVenues}
          />
        </CardHeader>
        <CardContent>
          {eventWiseAudienceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={eventWiseAudienceData}
                margin={{ top: 20, right: 30, left: 60, bottom: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="tag"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: "Total Audience",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  <LabelList
                    position="top"
                    formatter={(v) => v}
                    style={{ fontWeight: "bold" }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground pt-20">
              No data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
