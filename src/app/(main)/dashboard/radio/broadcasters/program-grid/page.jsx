'use client'
import React, { Suspense } from 'react'
import EPG from './epg'

const Page = () => {
  return (
    <div className="space-y-6 p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-400"></div>
              <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Loading EPG Data...</p>
            </div>
          </div>
        }
      >
        <EPG />
      </Suspense>
    </div>
  )
}

export default Page