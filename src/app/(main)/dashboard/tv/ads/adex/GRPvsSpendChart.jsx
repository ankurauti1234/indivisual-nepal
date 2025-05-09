import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

const GRPvsSpendChart = () => {
  // Sample data - replace with actual data
  const data = [
    { brand: "Brand A", grp: 150, adSpend: 250000, costPerGRP: 1666.67 },
    { brand: "Brand B", grp: 280, adSpend: 420000, costPerGRP: 1500 },
    { brand: "Brand C", grp: 320, adSpend: 550000, costPerGRP: 1718.75 },
    { brand: "Brand D", grp: 200, adSpend: 380000, costPerGRP: 1900 },
    { brand: "Brand E", grp: 420, adSpend: 680000, costPerGRP: 1619.05 },
    { brand: "Brand F", grp: 180, adSpend: 290000, costPerGRP: 1611.11 },
    { brand: "Brand G", grp: 250, adSpend: 450000, costPerGRP: 1800 },
    { brand: "Brand H", grp: 380, adSpend: 600000, costPerGRP: 1578.95 },
  ];

  // Calculate trendline using least squares regression
  const calculateTrendline = useMemo(() => {
    const n = data.length;
    const sumX = data.reduce((acc, point) => acc + point.grp, 0);
    const sumY = data.reduce((acc, point) => acc + point.adSpend, 0);
    const sumXY = data.reduce(
      (acc, point) => acc + point.grp * point.adSpend,
      0
    );
    const sumXX = data.reduce((acc, point) => acc + point.grp * point.grp, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...data.map((point) => point.grp));
    const maxX = Math.max(...data.map((point) => point.grp));

    return [
      { grp: minX, adSpend: slope * minX + intercept },
      { grp: maxX, adSpend: slope * maxX + intercept },
    ];
  }, [data]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatGRP = (value) => {
    return `${value} GRP`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border">
          <p className="font-bold text-sm">{data.brand}</p>
          <p className="text-sm">GRP: {formatGRP(data.grp)}</p>
          <p className="text-sm">Ad Spend: {formatCurrency(data.adSpend)}</p>
          <p className="text-sm">
            Cost per GRP: {formatCurrency(data.costPerGRP)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>GRP vs Ad Spend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="grp"
                name="GRP"
                tickFormatter={formatGRP}
                label={{
                  value: "Gross Rating Points (GRP)",
                  position: "bottom",
                  offset: 0,
                }}
              />
              <YAxis
                type="number"
                dataKey="adSpend"
                name="Ad Spend"
                tickFormatter={formatCurrency}
                label={{
                  value: "Ad Spend",
                  angle: -90,
                  position: "left",
                  offset: 0,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Brands"
                data={data}
                fill="#8884d8"
                shape="circle"
                legendType="none"
              />
              <Scatter
                name="Trendline"
                data={calculateTrendline}
                line={{ stroke: "#ff7300", strokeWidth: 2 }}
                lineType="fitting"
                shape={null}
                legendType="none"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm font-medium">Average Cost per GRP</p>
            <p className="text-lg font-bold">
              {formatCurrency(
                data.reduce((acc, curr) => acc + curr.costPerGRP, 0) /
                  data.length
              )}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm font-medium">Total Ad Spend</p>
            <p className="text-lg font-bold">
              {formatCurrency(
                data.reduce((acc, curr) => acc + curr.adSpend, 0)
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GRPvsSpendChart;
