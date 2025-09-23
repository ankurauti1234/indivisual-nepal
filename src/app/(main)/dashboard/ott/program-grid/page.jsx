"use client";
import React, { Suspense } from "react";
import EPG from "@/components/program-grid/EPG";

function ProgramGridContent() {
  const DEVICE_IDS = ["R-2", "R-3", "R-4", "R-5", "R-6","R-7","R-10"];
  const CHANNEL_ALIASES = {
    "R-2": "Youtube",
    "R-3": "Amazon Prime",
    "R-4": "Zee5",
    "R-5": "Netflix",
    "R-6": "Aaj Tak",
    "R-7": "Dangal",
    "R-10": "Jio Hotstar",
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_OTT_URL

  //"https://ott-api.indirex.io/api/v1"

  return (
    <div className="space-y-6 p-4">
      <EPG
        region="india"
        DEVICE_IDS={DEVICE_IDS}
        CHANNEL_ALIASES={CHANNEL_ALIASES}
        baseUrl={baseUrl}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-400"></div>
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
              Loading EPG Data...
            </p>
          </div>
        </div>
      }
    >
      <ProgramGridContent />
    </Suspense>
  );
}
