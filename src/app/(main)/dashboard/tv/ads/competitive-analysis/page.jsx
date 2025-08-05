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
// import ChannelMixAnalysis from "./channel-mix-analysis";
import CompetitiveAdRotation from "./competitive-ad-rotation";
import NewAdvertisersPanel from "./new-advertisers";
import SectorAdDistributionBar from "./sector-ad-distribution";
import CompetitiveBattlecardView from "./battle-card";
import OptimalAdPlacementPlanner from "./ad-placement-planner";
import AdFatigueTracker from "./ad-fatigue";
import AdClutterAlertSystem from "./ad-clutter";
import SponsorshipROIMeter from "./sponsorship-roi";
import CrossChannelSyncMap from "./cross-channel-sync";
import TopAdvertisersPanel from "./channel-mix-analysis";

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
        <ShareOfVoice />
        <DaypartDistribution />
        <AdDurationMix />
        <AdPodPositioning />
        <CompetitiveFlightingPatterns />
        <ProgramAffinityIndex />
        <CategoryConcentration />
        <TopAdvertisersPanel />
        <CompetitiveAdRotation />
        <NewAdvertisersPanel />
        <SectorAdDistributionBar />
        <CompetitiveBattlecardView/>
        <OptimalAdPlacementPlanner/>
        <AdFatigueTracker/>
        <AdClutterAlertSystem/>
        <CrossChannelSyncMap/>
        <SponsorshipROIMeter/>
      </div>
    </ReportLayout>
  );
};

export default CompetitiveAnalysisPage;
