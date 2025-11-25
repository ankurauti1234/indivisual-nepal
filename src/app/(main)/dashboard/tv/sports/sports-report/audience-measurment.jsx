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

const AGE_GROUPS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];

// Reusable Multi-Select Venue Filter
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

export default function AudienceMeasurment({
  selectedMatch,
  componentFolder = "audience-measurment",
  apiPath = "/api/matches-files",
}) {
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Multi-select state for each chart
  const [selectedGenderVenues, setSelectedGenderVenues] = useState([]);
  const [selectedGroupVenues, setSelectedGroupVenues] = useState([]);
  const [selectedEmotionVenues, setSelectedEmotionVenues] = useState([]);
  const [selectedFlowVenues, setSelectedFlowVenues] = useState([]);
  const [selectedPeakVenues, setSelectedPeakVenues] = useState([]);
  const [selectedAgeVenues, setSelectedAgeVenues] = useState([]);
  const [selectedLightingVenues, setSelectedLightingVenues] = useState([]);
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
  const LightingConditionComparison = useMemo(
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

  // All venue IDs across all datasets
  const allVenueIds = useMemo(() => {
    const ids = new Set();
    [
      ...GenderDistributionByVenue,
      ...GroupDistribution,
      ...EmotionDistribution,
      ...AudienceFlowAndPeakViewrship,
      ...PeakAudienceComparison,
      ...AgeGroupComposition,
      ...LightingConditionComparison,
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
    LightingConditionComparison,
    EngagementScoreTrend,
    EventWiseAudienceViewership,
    OcculsionLevelDistribution,
  ]);

  // Auto-select all venues on load
  useEffect(() => {
    if (allVenueIds.length > 0) {
      const venues = allVenueIds;
      setSelectedGenderVenues(venues);
      setSelectedGroupVenues(venues);
      setSelectedEmotionVenues(venues);
      setSelectedFlowVenues(venues);
      setSelectedPeakVenues(venues);
      setSelectedAgeVenues(venues);
      setSelectedLightingVenues(venues);
      setSelectedEngagementVenues(venues);
      setSelectedEventVenues(venues);
      setSelectedOcclusionVenues(venues);
    }
  }, [allVenueIds]);

  const filterByVenues = (data, selected) =>
    selected.length > 0
      ? data.filter((d) => selected.includes(d.venue_id))
      : data;

  // Gender Pie (aggregated)
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

  // Group Pie
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

  // Emotion Pie
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

  // Audience Flow Over Time
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

  // Peak Audience
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

  // Age Group Composition
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

  // Lighting Condition
  const lightingConditionChartData = useMemo(() => {
    const venues =
      selectedLightingVenues.length > 0 ? selectedLightingVenues : allVenueIds;
    const map = {};

    LightingConditionComparison.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const vid = item.venue_id;
      if (!map[vid]) map[vid] = { venue_id: `Venue ${vid}` };
      map[vid][item.condition] =
        (map[vid][item.condition] || 0) + (item.total || 0);
    });

    return Object.values(map);
  }, [LightingConditionComparison, selectedLightingVenues, allVenueIds]);

  // Engagement Score Trend
  const engagementMultiLineData = useMemo(() => {
    const venues =
      selectedEngagementVenues.length > 0
        ? selectedEngagementVenues
        : allVenueIds;
    const times = [
      ...new Set(EngagementScoreTrend.map((d) => d.Timestamp)),
    ].sort();
    const timeMap = {};
    const sums = {};
    const counts = {};

    times.forEach((t) => {
      timeMap[t] = { Timestamp: t };
      sums[t] = {};
      counts[t] = {};
      venues.forEach((v) => {
        timeMap[t][`venue_${v}`] = 0;
        sums[t][`venue_${v}`] = 0;
        counts[t][`venue_${v}`] = 0;
      });
    });

    EngagementScoreTrend.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const key = `venue_${item.venue_id}`;
      sums[item.Timestamp][key] += item.score || 0;
      counts[item.Timestamp][key] += 1;
    });

    times.forEach((t) => {
      venues.forEach((v) => {
        const key = `venue_${v}`;
        timeMap[t][key] =
          counts[t][key] > 0 ? sums[t][key] / counts[t][key] : null;
      });
    });

    return Object.values(timeMap);
  }, [EngagementScoreTrend, selectedEngagementVenues, allVenueIds]);

  const engagementVenueIds =
    selectedEngagementVenues.length > 0
      ? selectedEngagementVenues
      : allVenueIds;

  // Event-Wise Audience
  const eventWiseAudienceData = useMemo(() => {
    const venues =
      selectedEventVenues.length > 0 ? selectedEventVenues : allVenueIds;
    const filtered = EventWiseAudienceViewership.filter((d) =>
      venues.includes(d.venue_id)
    );
    const agg = filtered.reduce((acc, cur) => {
      const key = cur.tag || "Unknown";
      acc[key] = (acc[key] || 0) + (cur.total || 0);
      return acc;
    }, {});

    return Object.entries(agg)
      .map(([tag, total]) => ({ tag, total }))
      .sort((a, b) => b.total - a.total);
  }, [EventWiseAudienceViewership, selectedEventVenues, allVenueIds]);

  // Occlusion Level Distribution
  const occlusionLevels = useMemo(() => {
    return [
      ...new Set(OcculsionLevelDistribution.map((d) => d.occlusion_level)),
    ]
      .filter(Boolean)
      .sort();
  }, [OcculsionLevelDistribution]);

  const occlusionChartData = useMemo(() => {
    const venues =
      selectedOcclusionVenues.length > 0
        ? selectedOcclusionVenues
        : allVenueIds;
    const map = {};

    OcculsionLevelDistribution.forEach((item) => {
      if (!venues.includes(item.venue_id)) return;
      const vid = item.venue_id;
      if (!map[vid]) map[vid] = { venue_id: `Venue ${vid}` };
      map[vid][item.occlusion_level] =
        (map[vid][item.occlusion_level] || 0) + (item.count || 0);
    });

    Object.values(map).forEach((row) => {
      occlusionLevels.forEach((level) => {
        if (!(level in row)) row[level] = 0;
      });
    });

    return Object.values(map);
  }, [
    OcculsionLevelDistribution,
    occlusionLevels,
    selectedOcclusionVenues,
    allVenueIds,
  ]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading audience data...
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* 3 Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Gender Distribution</CardTitle>
            <VenueMultiSelect
              venues={allVenueIds}
              selected={selectedGenderVenues}
              onChange={setSelectedGenderVenues}
            />
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
                    {genderPieData.map((_, i) => (
                      <Cell key={i} fill={DEFAULT_PALETTE[i % 2]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground pt-8">No data</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Group Type Distribution</CardTitle>
            <VenueMultiSelect
              venues={allVenueIds}
              selected={selectedGroupVenues}
              onChange={setSelectedGroupVenues}
            />
          </CardHeader>
          <CardContent>
            {groupPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={groupPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {groupPieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground pt-8">No data</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Emotion Distribution</CardTitle>
            <VenueMultiSelect
              venues={allVenueIds}
              selected={selectedEmotionVenues}
              onChange={setSelectedEmotionVenues}
            />
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
                    {emotionPieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground pt-8">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audience Flow Over Time */}
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

      {/* Peak Audience */}
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

      {/* Lighting Condition */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Lighting Condition Comparison by Venue
          </CardTitle>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedLightingVenues}
            onChange={setSelectedLightingVenues}
          />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={lightingConditionChartData}
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
                  value: "Total Count",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="good" name="Good Lighting" fill="#10b981" />
              <Bar dataKey="mixed" name="Mixed Lighting" fill="#f59e0b" />
              <Bar dataKey="low" name="Low Lighting" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Score Trend */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Engagement Score Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              Average per venue over time
            </p>
          </div>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedEngagementVenues}
            onChange={setSelectedEngagementVenues}
          />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={engagementMultiLineData}
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
                formatter={(v) => v?.toFixed(3)}
              />
              <Legend verticalAlign="top" height={46} />
              {engagementVenueIds.map((venueId, index) => (
                <Line
                  key={venueId}
                  type="monotone"
                  dataKey={`venue_${venueId}`}
                  name={`Venue ${venueId}`}
                  stroke={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
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

      {/* Occlusion Level Distribution */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            Occlusion Level Distribution by Venue
          </CardTitle>
          <VenueMultiSelect
            venues={allVenueIds}
            selected={selectedOcclusionVenues}
            onChange={setSelectedOcclusionVenues}
          />
        </CardHeader>
        <CardContent>
          {occlusionChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={occlusionChartData}
                margin={{ top: 20, right: 30, left: 60, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="venue_id"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: "Count of People",
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
                <Legend verticalAlign="top" height={36} />
                {occlusionLevels.map((level, index) => (
                  <Bar
                    key={level}
                    dataKey={level}
                    name={level.charAt(0).toUpperCase() + level.slice(1)}
                    stackId="occlusion"
                    fill={DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground pt-20">
              No occlusion data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
