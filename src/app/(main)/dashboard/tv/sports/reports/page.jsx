import React from 'react'
import AdSpotChart from './ad-spot'
import SponsorMentionsChart from './sponsor-mentions'
import BreakTimeShareChart from './break-time-share'
import JerseyLogoExposureChart from './jersy-logo-exposure'
import GroundBoundaryAdvertisingChart from './grounded-boundry-ads'
import KeyMomentVisibilityChart from './key-movement-visibility'
import CompetitorShadowingChart from './competetive-shadow'

const Reports = () => {
  return (
      <div>
          <AdSpotChart />
          <SponsorMentionsChart />
          <BreakTimeShareChart />
          <JerseyLogoExposureChart />
          <GroundBoundaryAdvertisingChart />
          <KeyMomentVisibilityChart />
          <CompetitorShadowingChart/>
    </div>
  )
}

export default Reports