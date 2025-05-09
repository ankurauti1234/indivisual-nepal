'use client'
import React, { useState } from 'react';
import Overview from './overview';
import { CompetitiveLandscape } from './competative-landscape';
import { ShareOfVoice } from './share-of-voice';
import { AdBreakStrategy } from './ad-break';
import { LogoVisibilityDeepDive } from './logo-visivility';

const leagues = [
  { name: 'NPL Nepal', image: 'https://via.placeholder.com/200x150?text=NPL+Nepal' },
  { name: 'IPL India', image: 'https://via.placeholder.com/200x150?text=IPL+India' },
  { name: 'IPL Nepal', image: 'https://via.placeholder.com/200x150?text=IPL+Nepal' },
  { name: 'NSL Nepal', image: 'https://via.placeholder.com/200x150?text=NSL+Nepal' },
];

const Graphs = () => {
  const [selectedLeague, setSelectedLeague] = useState(leagues[0].name); // Default to first league

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-sans">
      {/* League Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {leagues.map((league) => (
          <div
            key={league.name}
            className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-card ${
              selectedLeague === league.name ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedLeague(league.name)}
          >
            <img
              src={league.image}
              alt={league.name}
              className="w-full h-36 object-cover"
            />
            <h3 className="bg-card bg-opacity-70 flex items-center w-full justify-center text-center py-2 text-sm font-bold">
              {league.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
          {selectedLeague} Analytics
        </h1>
        <Overview content={selectedLeague} />
        <CompetitiveLandscape content={selectedLeague} />
        <ShareOfVoice content={selectedLeague} />
        <AdBreakStrategy content={selectedLeague} />
        <LogoVisibilityDeepDive content={selectedLeague} />
      </div>
    </div>
  );
};

export default Graphs;