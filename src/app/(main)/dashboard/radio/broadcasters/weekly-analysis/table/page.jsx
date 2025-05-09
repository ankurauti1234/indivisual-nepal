'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import RadioAdTable from './ad-count-table'
import RadioSectorAnalysis from './sector-ad-distribution-table'
import RadioAdDistributionTable from './radio-ad-distribution-table'
import TopProgramsTable from './top-program-table'
import TopSongsTable from './top-songs-table'
import AdPlacementFrequencyTable from './ad-placement-table'
import DetailedAdAnalysis from '../derailedAdAnalysis'
import PlatformComparisonTable from './performace-comparison'

const TableView = () => {
  return (
    <div className='space-y-4'>
      <div className="flex justify-start">
        <Link href="/dashboard/radio/broadcasters/weekly-analysis">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </div>
      <RadioAdTable />
      <RadioSectorAnalysis />
      <RadioAdDistributionTable />
      <TopProgramsTable />
      <TopSongsTable />
      <AdPlacementFrequencyTable />
      <DetailedAdAnalysis />
      <PlatformComparisonTable />
    </div>
  )
}

export default TableView