'use client'
import React from "react";
import { ResponsiveContainer, Sankey } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SankeyChart = () => {
  // Sample data
  const data = {
    nodes: [
      { name: "Website Visits" },
      { name: "Product Views" },
      { name: "Add to Cart" },
      { name: "Checkout" },
      { name: "Purchase" },
      { name: "Abandoned" },
    ],
    links: [
      { source: 0, target: 1, value: 1000 },
      { source: 1, target: 2, value: 600 },
      { source: 2, target: 3, value: 400 },
      { source: 3, target: 4, value: 200 },
      { source: 1, target: 5, value: 400 },
      { source: 2, target: 5, value: 200 },
      { source: 3, target: 5, value: 200 },
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Flow Sankey Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={data}
              nodePadding={50}
              nodeWidth={10}
              linkCurvature={0.5}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              link={{ stroke: "#344CB7" }}
            >
              <defs>
                <linearGradient id="linkGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </Sankey>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SankeyChart;
