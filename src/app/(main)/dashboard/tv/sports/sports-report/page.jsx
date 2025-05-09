'use client';

import React, { useState } from 'react';
import BrandAnalyticsCharts from './brand';
import AdBreakPerformancePage from './ad-performace';
import ShareOfVoicePage from './share-of-voice';
import BrandVisibilityPage from './visibility';

const sections = [
  { id: 'brand-analytics', title: 'Brand Analytics', component: BrandAnalyticsCharts },
  { id: 'ad-performance', title: 'Ad Break Performance', component: AdBreakPerformancePage },
  { id: 'share-of-voice', title: 'Share of Voice', component: ShareOfVoicePage },
  { id: 'brand-visibility', title: 'Brand Visibility', component: BrandVisibilityPage },
];

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="">
      {/* Header */}
      <header className="shadow-sm ">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Brand Performance Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Comprehensive analytics for brand visibility and advertising effectiveness
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className=" border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 overflow-x-auto py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {sections.map((section) => (
          <section
            key={section.id}
            className={`${activeSection === section.id ? 'block' : 'hidden'}`}
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {section.title}
              </h2>
              <section.component />
            </div>
          </section>
        ))}
      </main>

    </div>
  );
};

export default DashboardPage;