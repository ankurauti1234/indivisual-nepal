'use client'
import React from 'react'
import GRPSunburstChart from './sub-brust-grp'
import GRPStats from './grp-stats'
// import WaterfallChart from './waterfall'
import AdSpendDashboard from "./ad-spent-heatmap";
import SectorScatterPlot from './sector-scatter-plot'
import AdSpentBars from './sd-spent-bar';
import BrandRadarChart from './brannd-radar';
import GRPvsSpendChart from './GRPvsSpendChart';
import AdSpotAnalysis from './as-spot';
import { tableData } from "./tableData";
import DataTable from './data-table';

const page = () => {
  return (
    <div className='space-y-6'>
      <GRPStats />
      <GRPSunburstChart />
      <SectorScatterPlot />
      <AdSpendDashboard />
      <AdSpentBars />
      <BrandRadarChart />
      {/* <GRPvsSpendChart /> */}
      {/* <AdSpotAnalysis /> */}
      <DataTable data={tableData} />
    </div>
  );
}

export default page
