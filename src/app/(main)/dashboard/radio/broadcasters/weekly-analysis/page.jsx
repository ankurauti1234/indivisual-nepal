'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { Table } from "lucide-react"
import Link from "next/link"
import StatCards from './stat-cards'
import RadioAdHeatmap from './ad-count-heatmap'
import TopProgramsChart from './top-program-bar'
import TopSongsChart from './top-songs-bar'
import AdPlacementFrequencyChart from './ad-placement-frequency'
import DetailedAdAnalysis from './derailedAdAnalysis'
import PlatformComparison from './platform-comparison'
import AppleStyleTreemap from './treemap'
import RadioSectorAnalysis from './comperative-bar'
import RJDashboard from './rj-dashboard'

const RadioDashboard = () => {
  return (
    <div className='space-y-6'>
      <div className="flex justify-end">
        <Link href="/dashboard/radio/broadcasters/weekly-analysis/table">
          <Button variant="outline" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            See in Table View
          </Button>
        </Link>
      </div>
      <StatCards />
      <RJDashboard />
      <RadioAdHeatmap />
      <RadioSectorAnalysis />
      <AppleStyleTreemap />
      <div className='flex gap-4'>
        <TopProgramsChart />
        <TopSongsChart />
      </div>
      <AdPlacementFrequencyChart />
      <DetailedAdAnalysis />
      <PlatformComparison />
    </div>
  );
}

export default RadioDashboard