"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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

const DEFAULT_PALETTE = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f97316", // orange
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#a78bfa", // purple
  "#f472b6", // pink
  "#94a3b8", // slate
];

const AGE_GROUPS = ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"];

export default function AudienceMeasurment({
  selectedMatch,
  componentFolder = "audience-measurment",
  apiPath = "/api/matches-files",
}) {
  const [fileMap, setFileMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedGenderVenue, setSelectedGenderVenue] = useState(null);
  const [selectedGroupVenue, setSelectedGroupVenue] = useState(null);
  const [selectedEmotionVenue, setSelectedEmotionVenue] = useState(null);

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

  // Venue lists
  const genderVenues = useMemo(
    () =>
      [...new Set(GenderDistributionByVenue.map((d) => d.venue_id))]
        .filter(Boolean)
        .sort((a, b) => a - b),
    [GenderDistributionByVenue]
  );
  const groupVenues = useMemo(
    () =>
      [...new Set(GroupDistribution.map((d) => d.venue_id))]
        .filter(Boolean)
        .sort((a, b) => a - b),
    [GroupDistribution]
  );
  const emotionVenues = useMemo(
    () =>
      [...new Set(EmotionDistribution.map((d) => d.venue_id))]
        .filter(Boolean)
        .sort((a, b) => a - b),
    [EmotionDistribution]
  );

  useEffect(() => {
    if (genderVenues.length > 0 && !selectedGenderVenue)
      setSelectedGenderVenue(genderVenues[0]);
    if (groupVenues.length > 0 && !selectedGroupVenue)
      setSelectedGroupVenue(groupVenues[0]);
    if (emotionVenues.length > 0 && !selectedEmotionVenue)
      setSelectedEmotionVenue(emotionVenues[0]);
  }, [genderVenues, groupVenues, emotionVenues]);

  // Pie Charts Data
  const genderPieData = useMemo(() => {
    if (!selectedGenderVenue) return [];
    const row = GenderDistributionByVenue.find(
      (d) => d.venue_id === selectedGenderVenue
    );
    return row
      ? [
          { name: "Male", value: row.male || 0 },
          { name: "Female", value: row.female || 0 },
        ]
      : [];
  }, [GenderDistributionByVenue, selectedGenderVenue]);

  const groupPieData = useMemo(() => {
    if (!selectedGroupVenue) return [];
    const filtered = GroupDistribution.filter(
      (d) => d.venue_id === selectedGroupVenue
    );
    const agg = filtered.reduce((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + (cur.count || 0);
      return acc;
    }, {});
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [GroupDistribution, selectedGroupVenue]);

  const emotionPieData = useMemo(() => {
    if (!selectedEmotionVenue) return [];
    const filtered = EmotionDistribution.filter(
      (d) => d.venue_id === selectedEmotionVenue
    );
    const agg = filtered.reduce((acc, cur) => {
      acc[cur.type] = (acc[cur.type] || 0) + (cur.count || 0);
      return acc;
    }, {});
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [EmotionDistribution, selectedEmotionVenue]);

  // Audience Flow (Multi-line)
  const audienceFlowMultiLineData = useMemo(() => {
    const venueIds = [
      ...new Set(AudienceFlowAndPeakViewrship.map((d) => d.venue_id)),
    ].sort((a, b) => a - b);
    const timeMap = {};
    AudienceFlowAndPeakViewrship.forEach((item) => {
      const time = item.Timestamp;
      if (!timeMap[time]) timeMap[time] = { Timestamp: time };
      timeMap[time][`venue_${item.venue_id}`] = item.total_person_visible || 0;
    });
    return Object.values(timeMap).sort((a, b) =>
      a.Timestamp.localeCompare(b.Timestamp)
    );
  }, [AudienceFlowAndPeakViewrship]);

  const flowVenueIds = useMemo(
    () =>
      [...new Set(AudienceFlowAndPeakViewrship.map((d) => d.venue_id))].sort(
        (a, b) => a - b
      ),
    [AudienceFlowAndPeakViewrship]
  );

  // Peak Audience
  const peakAudienceData = useMemo(() => {
    return PeakAudienceComparison.map((d) => ({
      venue_id: `Venue ${d.venue_id}`,
      total_viewing_screen: d.total_viewing_screen || 0,
    })).sort((a, b) => a.venue_id.localeCompare(b.venue_id));
  }, [PeakAudienceComparison]);

  // NEW: Age Group Composition - Stacked Bar Chart
  const ageGroupChartData = useMemo(() => {
    const venueMap = {};
    AgeGroupComposition.forEach((item) => {
      if (!venueMap[item.venue_id]) {
        venueMap[item.venue_id] = { venue_id: `Venue ${item.venue_id}` };
      }
      const ageKey = Object.keys(item).find((k) => k !== "venue_id");
      venueMap[item.venue_id][ageKey] = item[ageKey];
    });
    return Object.values(venueMap);
  }, [AgeGroupComposition]);

  // NEW: Lighting Condition - Clustered Bar Chart
  const lightingConditionChartData = useMemo(() => {
    const venueMap = {};
    LightingConditionComparison.forEach((item) => {
      if (!venueMap[item.venue_id]) {
        venueMap[item.venue_id] = { venue_id: `Venue ${item.venue_id}` };
      }
      venueMap[item.venue_id][item.condition] = item.total;
    });
    return Object.values(venueMap);
  }, [LightingConditionComparison]);

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
        {/* Gender */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            {genderVenues.length > 0 && (
              <Select
                value={selectedGenderVenue?.toString()}
                onValueChange={(v) => setSelectedGenderVenue(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {genderVenues.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      Venue {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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

        {/* Group & Emotion - unchanged */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Group Type Distribution</CardTitle>
            {groupVenues.length > 0 && (
              <Select
                value={selectedGroupVenue?.toString()}
                onValueChange={(v) => setSelectedGroupVenue(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {groupVenues.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      Venue {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            {emotionVenues.length > 0 && (
              <Select
                value={selectedEmotionVenue?.toString()}
                onValueChange={(v) => setSelectedEmotionVenue(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {emotionVenues.map((id) => (
                    <SelectItem key={id} value={id.toString()}>
                      Venue {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
        <CardHeader>
          <CardTitle className="text-xl">
            Audience Flow Over Time — All Venues
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Each line represents one venue
          </p>
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
              {flowVenueIds.map((venueId, i) => (
                <Line
                  key={venueId}
                  type="monotone"
                  dataKey={`venue_${venueId}`}
                  name={`Venue ${venueId}`}
                  stroke={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
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
        <CardHeader>
          <CardTitle className="text-xl">
            Peak Audience Comparison by Venue
          </CardTitle>
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

      {/* NEW: Age Group Composition - Stacked Bar Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl">
            Age Group Composition by Venue
          </CardTitle>
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
              {AGE_GROUPS.map((age, i) => (
                <Bar
                  key={age}
                  dataKey={age}
                  name={age}
                  stackId="a"
                  fill={DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* NEW: Lighting Condition Comparison - Clustered Bar Chart */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl">
            Lighting Condition Comparison by Venue
          </CardTitle>
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
    </div>
  );
}
