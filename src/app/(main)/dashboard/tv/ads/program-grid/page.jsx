"use client";
import React, { Suspense } from "react";
import EPG from "@/components/program-grid/EPG";
import { Button } from "@/components/ui/button";

function ProgramGridContent() {
  const DEVICE_IDS = ["R-1001", "R-1004", "R-1006", "R-1007"];
  const CHANNEL_ALIASES = {
    "R-1001": "Himalaya TV",
    "R-1004": "Nepal TV",
    "R-1006": "Avenues TV",
    "R-1007": "Kantipur TV",
  };
  const baseUrl = "https://nepal-api.indirex.io/api/v1";

  return (
    <div className="space-y-6 p-4">
            <Button
              variant="outline"
              className=" transition-colors"
              onClick={() => {
                const url = "https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/HOR-linear-report.csv";
                const link = document.createElement("a");
                link.href = url;
                link.download = "HOR-report.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Export Report
            </Button>

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
