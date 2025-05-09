"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ImageOff } from "lucide-react";

const ProgramDialog = ({ selectedProgram, setSelectedProgram }) => {
  const typeStyles = {
    song: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300",
    advertisement: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300",
    program: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300",
    notDetected: "bg-muted text-muted-foreground",
  };

  return (
    <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
      <DialogContent className="max-w-md border border-muted bg-popover p-0 text-foreground shadow-sm sm:rounded-2xl">
        <DialogHeader className="flex flex-row items-center gap-3 border-b border-muted px-4 py-3">
          <img
            src={`/images/${selectedProgram?.channel?.toLowerCase().trim().replace(/\s+/g, "-")}.png`}
            alt={selectedProgram?.channel || "Channel"}
            className="h-8 w-8 rounded-md object-cover"
            onError={(e) => (e.target.src = "/images/placeholder.png")}
          />
          <div>
            <DialogTitle className="text-lg font-medium text-foreground">{selectedProgram?.program}</DialogTitle>
            <span className="text-xs text-muted-foreground">{selectedProgram?.channel}</span>
          </div>
        </DialogHeader>
        <div className="space-y-3 px-4 py-3">
          <Card className={`border-muted ${typeStyles[selectedProgram?.type || "notDetected"]}`}>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Station</span>
                  <p className="font-medium text-foreground">{selectedProgram?.channel}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date</span>
                  <p className="font-medium text-foreground">{selectedProgram?.date}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Time</span>
                  <p className="font-medium text-foreground">{`${selectedProgram?.start} - ${selectedProgram?.end}`}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</span>
                  <p className="font-medium capitalize text-foreground">{selectedProgram?.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedProgram?.audio && (
            <Card className="border-muted">
              <CardContent className="p-3">
                <iframe
                  src={selectedProgram.audio}
                  width="100%"
                  height="60"
                  allow="autoplay"
                  title={`${selectedProgram?.program} Audio`}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
          )}

          <Card className="border-muted">
            <CardContent className="p-3">
              {selectedProgram?.GIF ? (
                <img
                  src={selectedProgram.GIF}
                  alt={`${selectedProgram?.program} GIF`}
                  className="h-auto w-full rounded-md object-contain sm:max-h-40"
                />
              ) : (
                <div className="flex items-center justify-center rounded-md bg-muted py-6">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span className="mt-1 text-xs">No GIF</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDialog;