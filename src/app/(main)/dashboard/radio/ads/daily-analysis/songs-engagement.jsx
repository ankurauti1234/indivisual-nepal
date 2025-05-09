import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

const SongEngagementDashboard = () => {
  // Sample data - in a real app this would come from an API
  const generateData = () => {
    const songs = [
      "Shape of You",
      "Blinding Lights",
      "Dance Monkey",
      "Someone Like You",
      "Uptown Funk",
      "Despacito",
      "Stay With Me",
      "Rolling in the Deep",
      "Shake It Off",
      "Can't Stop the Feeling",
    ];

    return songs.map((song) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: song,
      artist: `Artist ${Math.floor(Math.random() * 5) + 1}`,
      playCount: Math.floor(Math.random() * 100000) + 50000,
      adFrequency: Math.floor(Math.random() * 10) + 1,
      rating: (Math.random() * 2 + 3).toFixed(1),
      station: `Station ${Math.floor(Math.random() * 3) + 1}`,
      contentType: ["Pop", "Rock", "Hip-Hop"][Math.floor(Math.random() * 3)],
    }));
  };

  const [data, setData] = useState(generateData());
  const [station, setStation] = useState("all");
  const [timeframe, setTimeframe] = useState("daily");
  const [contentType, setContentType] = useState("all");

  // Filter data based on selected filters
  const filteredData = data.filter((item) => {
    return (
      (station === "all" || item.station === station) &&
      (contentType === "all" || item.contentType === contentType)
    );
  });

  // Transform data for scatter plot
  const scatterData = filteredData.map((item) => ({
    x: item.playCount,
    y: item.adFrequency,
    title: item.title,
    artist: item.artist,
  }));

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Song Engagement & Ad Frequency Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Select value={station} onValueChange={setStation}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                <SelectItem value="Station 1">Station 1</SelectItem>
                <SelectItem value="Station 2">Station 2</SelectItem>
                <SelectItem value="Station 3">Station 3</SelectItem>
              </SelectContent>
            </Select>

            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Pop">Pop</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => setData(generateData())} className="ml-auto">
              Refresh Data
            </Button>
          </div>

          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Play Count"
                  label={{ value: "Play Count", position: "bottom" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Ad Frequency"
                  label={{
                    value: "Ad Frequency",
                    angle: -90,
                    position: "left",
                  }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="font-bold">{data.title}</p>
                          <p>Artist: {data.artist}</p>
                          <p>Play Count: {data.x.toLocaleString()}</p>
                          <p>Ad Frequency: {data.y}/hour</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={scatterData} fill="#8884d8" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left border">Title</th>
                  <th className="p-2 text-left border">Artist</th>
                  <th className="p-2 text-left border">Station</th>
                  <th className="p-2 text-left border">Content Type</th>
                  <th className="p-2 text-right border">Play Count</th>
                  <th className="p-2 text-right border">Ad Frequency</th>
                  <th className="p-2 text-right border">Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2 border">{item.title}</td>
                    <td className="p-2 border">{item.artist}</td>
                    <td className="p-2 border">{item.station}</td>
                    <td className="p-2 border">{item.contentType}</td>
                    <td className="p-2 text-right border">
                      {item.playCount.toLocaleString()}
                    </td>
                    <td className="p-2 text-right border">
                      {item.adFrequency}/hour
                    </td>
                    <td className="p-2 text-right border">{item.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SongEngagementDashboard;
