'use client'
import React from 'react'
import SectorTreemap from './sectors-treemap'
import GenreAdSpend from './genre-ad-spend'
import CostPerGRP from './cost-per-grp'
import ReportLayout from '@/components/layout/report-layout'
import { Button } from '@/components/ui/button'
import NepalTVSpendChart from './channel-industry-ad-bar'

const page = () => {
    return (
      <ReportLayout
        title="Competetive Landscape"
        description="Comprehensive analysis of channel performance, viewer behavior, and audience metrics"
        action={
          <div className="flex gap-4">
            <Button>Export Report</Button>
          </div>
        }
        footer={
          <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
            {/* <div>Last updated: {currentDate}</div> */}
            <div className="flex gap-4">
              <span>Data source: TV Analytics Platform</span>
              <span>•</span>
              <span>Report ID: TV-ANALYTICS-2025-01</span>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <NepalTVSpendChart />
          <SectorTreemap />

          <div className="flex flex-row gap-6">
            <GenreAdSpend />
            <CostPerGRP />
          </div>
        </div>
      </ReportLayout>
    );

}

export default page
