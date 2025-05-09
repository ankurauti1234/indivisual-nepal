"use client";

import React from "react";
import ChannelFlowAnalysis from "./channel-gain-loss";
import TVChannelSankeyChart from "./channel-flow-sankey";
import ChannelTimeSpentChart from "./persona-charts";
import PersonaTimeSpentChart from "./channel-persona-chart";
import GrpLineChart from "./break-grp";
import AvgGrpBarChart from "./grp-bar-chart";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import ReportLayout from "@/components/layout/report-layout";
import TVViewingJourney from "./tv-viewing-journey";
import GanttChart from "./gantt";
import IndustryChart from "./industry-chart";

const Page = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

    const tasks = [
      {
        id: 1,
        name: "Task 1",
        start: "2023-01-01T00:00:00",
        end: "2023-01-01T04:00:00",
        color: "#3498db",
      },
      {
        id: 2,
        name: "Task 2",
        start: "2023-01-01T04:30:00",
        end: "2023-01-01T09:00:00",
        color: "#2ecc71",
      },
      {
        id: 3,
        name: "Task 3",
        start: "2023-01-01T10:00:00",
        end: "2023-01-01T14:00:00",
        color: "#e74c3c",
      },
      {
        id: 4,
        name: "Task 4",
        start: "2023-01-01T15:00:00",
        end: "2023-01-01T20:00:00",
        color: "#f39c12",
      },
      {
        id: 5,
        name: "Task 5",
        start: "2023-01-01T21:00:00",
        end: "2023-01-01T23:59:59",
        color: "#9b59b6",
      },
    ];

    const arrows = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ];

  return (
    <ReportLayout
      title="Audience Movement Analytics"
      description="Comprehensive analysis of channel performance, viewer behavior, and audience metrics"
      action={
        <div className="flex gap-4">
          <Button>Export Report</Button>
        </div>
      }
      footer={
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
          <div>Last updated: {currentDate}</div>
          <div className="flex gap-4">
            <span>Data source: TV Analytics Platform</span>
            <span>•</span>
            <span>Report ID: TV-ANALYTICS-2025-01</span>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Channel Flow Analysis</h2>
          <div className="space-y-6">
            
            <TVChannelSankeyChart />
                    {/* <TVViewingJourney /> */}
            <ChannelFlowAnalysis />
          </div>
        </section>

        {/* <GanttChart /> */}
        
        {/* <IndustryChart/> */}

        <section>
          <h2 className="text-xl font-semibold mb-4">Viewing Time Analysis</h2>
          <div className="space-y-6">
            <ChannelTimeSpentChart />
            <PersonaTimeSpentChart />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">GRP Metrics</h2>
          <div className="space-y-6">
            <GrpLineChart />
            <AvgGrpBarChart />
          </div>
        </section>



      </div>
    </ReportLayout>
  );
};

export default Page;
