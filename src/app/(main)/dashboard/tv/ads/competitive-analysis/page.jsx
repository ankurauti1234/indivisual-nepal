"use client";
import React from "react";
import ReportLayout from "@/components/layout/report-layout";
import { Button } from "@/components/ui/button";
import ShareOfVoice from "./share-of-voice";
import AdFrequencyAnalysis from "./ad-frequency-analysis";
import DaypartDistribution from "./daypart-distribution";
import AdDurationMix from "./ad-duration-mix";
import ProgramAffinityIndex from "./program-affinity-index";
import AdPodPositioning from "./ad-pod-positioning";
import CompetitiveFlightingPatterns from "./competitive-flighting-patterns";
import CategoryConcentration from "./category-concentration";
import ChannelMixAnalysis from "./channel-mix-analysis";
import CompetitiveAdRotation from "./competitive-ad-rotation";

const CompetitiveAnalysisPage = () => {
  return (
    <ReportLayout
      title="Competitive Analysis"
      description="Comprehensive analysis of channel performance, viewer behavior, and audience metrics"
      action={
        <div className="flex gap-2">
          <Button>Export Report</Button>
        </div>
      }
      footer={
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-sm text-muted-foreground gap-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span>Data source: TV Analytics Platform</span>
            <span className="hidden sm:inline">•</span>
            <span>Report ID: TV-ANALYTICS-2025-01</span>
          </div>
        </div>
      }
    >
      <div className="grid gap-6">
        {/* First row - Share of Voice and Ad Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <ShareOfVoice />
          </div>
          <div className="w-full">
            <AdFrequencyAnalysis />
          </div>
        </div>

        {/* Second row - Daypart Distribution and Ad Duration Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <DaypartDistribution />
          </div>
          <div className="w-full">
            <AdDurationMix />
          </div>
        </div>

        {/* Third row - Ad Pod Positioning and Competitive Flighting Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <AdPodPositioning />
          </div>
          <div className="w-full">
            <CompetitiveFlightingPatterns />
          </div>
        </div>

        {/* Full-width components */}
        <div className="w-full">
          <ProgramAffinityIndex />
        </div>

        <div className="w-full">
          <CategoryConcentration />
        </div>

        {/* Last row - Channel Mix Analysis and Competitive Ad Rotation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <ChannelMixAnalysis />
          </div>
          <div className="w-full">
            <CompetitiveAdRotation />
          </div>
        </div>
      </div>
    </ReportLayout>
  );
};

export default CompetitiveAnalysisPage;
