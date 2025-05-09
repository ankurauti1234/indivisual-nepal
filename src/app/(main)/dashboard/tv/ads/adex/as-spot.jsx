import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";

const AdSpotAnalysis = () => {
  // Sample data - replace with actual data
  const data = [
    {
      brand: "Brand A",
      totalSeconds: 3600,
      totalSpots: 120,
      adSpend: 250000,
      grp: 150,
      avgDuration: 30,
      grpPerSpot: 1.25,
      spendPerSpot: 2083.33,
    },
    {
      brand: "Brand B",
      totalSeconds: 5400,
      totalSpots: 180,
      adSpend: 420000,
      grp: 280,
      avgDuration: 30,
      grpPerSpot: 1.56,
      spendPerSpot: 2333.33,
    },
    {
      brand: "Brand C",
      totalSeconds: 7200,
      totalSpots: 160,
      adSpend: 550000,
      grp: 320,
      avgDuration: 45,
      grpPerSpot: 2,
      spendPerSpot: 3437.5,
    },
  ];

  const formatDuration = (seconds) => `${seconds}s`;
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, type }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-bold text-sm">{data.brand}</p>
          {type === "spots" ? (
            <>
              <p className="text-sm">
                Total Seconds: {formatDuration(data.totalSeconds)}
              </p>
              <p className="text-sm">Total Spots: {data.totalSpots}</p>
              <p className="text-sm">
                Avg Duration: {formatDuration(data.avgDuration)}
              </p>
              <p className="text-sm">
                Ad Spend: {formatCurrency(data.adSpend)}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                GRP per Spot: {data.grpPerSpot.toFixed(2)}
              </p>
              <p className="text-sm">
                Spend per Spot: {formatCurrency(data.spendPerSpot)}
              </p>
              <p className="text-sm">
                Total Ad Spend: {formatCurrency(data.adSpend)}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-blue-600">
              Average Duration per Spot
            </p>
            <p className="text-2xl font-bold text-blue-800">
              {formatDuration(
                data.reduce((acc, curr) => acc + curr.avgDuration, 0) /
                  data.length
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-green-600">
              Average GRP per Spot
            </p>
            <p className="text-2xl font-bold text-green-800">
              {(
                data.reduce((acc, curr) => acc + curr.grpPerSpot, 0) /
                data.length
              ).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-purple-600">
              Average Spend per Spot
            </p>
            <p className="text-2xl font-bold text-purple-800">
              {formatCurrency(
                data.reduce((acc, curr) => acc + curr.spendPerSpot, 0) /
                  data.length
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spots Analysis Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Total Seconds vs Number of Spots</CardTitle>
          <CardDescription>
            Analyzing ad time allocation and frequency patterns. Circle size
            represents ad spend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="totalSeconds"
                  name="Total Seconds"
                  tickFormatter={formatDuration}
                  label={{ value: "Total Seconds of Ad", position: "bottom" }}
                />
                <YAxis
                  dataKey="totalSpots"
                  name="Total Spots"
                  label={{
                    value: "Total Number of Spots",
                    angle: -90,
                    position: "left",
                  }}
                />
                <ZAxis dataKey="adSpend" range={[400, 2000]} />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} type="spots" />}
                />
                <Legend />
                <Scatter
                  name="Brands"
                  data={data}
                  fill="#8884d8"
                  fillOpacity={0.6}
                  stroke="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Analysis Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Efficiency Comparison</CardTitle>
          <CardDescription>
            GRP per Spot vs Ad Spend per Spot. Circle size represents total ad
            spend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="grpPerSpot"
                  name="GRP per Spot"
                  label={{ value: "GRP per Spot", position: "bottom" }}
                />
                <YAxis
                  dataKey="spendPerSpot"
                  name="Spend per Spot"
                  tickFormatter={formatCurrency}
                  label={{
                    value: "Ad Spend per Spot",
                    angle: -90,
                    position: "left",
                  }}
                />
                <ZAxis dataKey="adSpend" range={[400, 2000]} />
                <Tooltip
                  content={(props) => (
                    <CustomTooltip {...props} type="efficiency" />
                  )}
                />
                <Legend />
                <Scatter
                  name="Brands"
                  data={data}
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  stroke="#82ca9d"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSpotAnalysis;
