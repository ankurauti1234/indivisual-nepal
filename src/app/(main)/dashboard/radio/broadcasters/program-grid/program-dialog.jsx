"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ProgramDialog = ({ selectedProgram, setSelectedProgram }) => {
  const typeStyles = {
    song: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200",
    ad: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200",
    program: "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200",
    notDetected: "bg-zinc-100 dark:bg-zinc-700/50 text-zinc-600 dark:text-zinc-300",
  };

  return (
    <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
      <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-0">
        <DialogHeader className="p-6 border-b border-zinc-200/50 dark:border-zinc-700/50">
          <DialogTitle className="flex items-center gap-3">
            <img
              src={`/images/${selectedProgram?.channel?.toLowerCase().trim().replace(/\s+/g, "-")}.png`}
              alt={selectedProgram?.channel}
              className="h-12 w-12 rounded-lg shadow-md"
            />
            <div>
              <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram?.program}</h1>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{selectedProgram?.channel}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-lg shadow-md ${typeStyles[selectedProgram?.type || "notDetected"]}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Station</span>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram?.channel}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Date</span>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram?.date}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Time</span>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{`${selectedProgram?.start} - ${selectedProgram?.end}`}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Type</span>
                <p className="mt-1 text-sm font-semibold capitalize text-zinc-800 dark:text-zinc-100">{selectedProgram?.type}</p>
              </div>
            </div>
          </div>
          {selectedProgram?.audio && (
            <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md">
              <audio
                src={selectedProgram.audio}
                controls
                className="w-full rounded-lg"
                title={`${selectedProgram.program} Audio`}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDialog;