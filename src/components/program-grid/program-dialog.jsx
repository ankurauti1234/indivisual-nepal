"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ProgramDialog = ({ selectedProgram, setSelectedProgram }) => {
  const typeStyles = {
    program: "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200",
    advertisement: "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200",
  };

  return (
    <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
      <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 border-b border-zinc-200/50 dark:border-zinc-700/50">
          <DialogTitle className="flex items-center gap-3">
            <img
              src={`https://radio-playback-files.s3.ap-south-1.amazonaws.com/logos/${selectedProgram?.channel
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")}.png`}
              alt={selectedProgram?.channel}
              className="h-12 w-12 rounded-lg shadow-md mr-3"
            />
            <div>
              <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram?.title}</h1>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">{selectedProgram?.channel}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-6">
          <div className={`p-4 rounded-lg shadow-md ${typeStyles[selectedProgram?.type.toLowerCase() || "program"]}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Channel</span>
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
              {selectedProgram?.content && (
                <div className="col-span-2">
                  <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Content</span>
                  <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-100">{selectedProgram.content}</p>
                </div>
              )}
              {selectedProgram?.episode_id && (
                <div>
                  <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Episode ID</span>
                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram.episode_id}</p>
                </div>
              )}
              {selectedProgram?.season_id && (
                <div>
                  <span className="text-xs font-medium uppercase text-zinc-700 dark:text-zinc-300 tracking-wide">Season ID</span>
                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{selectedProgram.season_id}</p>
                </div>
              )}
            </div>
          </div>
          {selectedProgram?.image && (
            <div className="p-4 rounded-lg bg-white dark:bg-zinc-800 shadow-md">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-auto rounded-lg"
                title={`${selectedProgram.title} Image`}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDialog;