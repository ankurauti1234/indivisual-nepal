'use client'
import React from 'react'
import ChannelTreemap from './treemap'
import DistributionChart from './Heatmap'
import RadioAdBarChart from './AdBarChart'
import AdStackedChart from './AdStackedChart'
import AdContentTransition from './ad-content-transition'
import TopContentAdPlacements from './content-ad-placement'
import AdPlacementFrequency from './ad-placement-frequency'
import AdDistributionChart from './ad-ditribution-chart'
import AdDistributionComparison from './ad-distribution-comparison'
import ContentAdScheduler from './conted-ad-scheduler'
import SongEngagementDashboard from './songs-engagement'

const page = () => {
  return (
    <div className='space-y-4'>
      <DistributionChart />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        <ChannelTreemap/>
    
      <AdStackedChart />
      </div>

      <RadioAdBarChart />

      <AdContentTransition />
      
      <TopContentAdPlacements/>

      <AdPlacementFrequency />

      <AdDistributionChart/>

      <AdDistributionComparison />

      <ContentAdScheduler/>

      <SongEngagementDashboard />

    </div>
  );
}

export default page
