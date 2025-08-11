"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const ProgramDialog = ({ selectedProgram, setSelectedProgram }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0); // Reset to first image when program changes
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedProgram?.image_paths?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          (prevIndex + 1) % selectedProgram.image_paths.length
        );
      }, 500); // Slower transition for better viewing
      return () => clearInterval(interval);
    }
  }, [selectedProgram]);

  const typeStyles = {
    program: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-100",
    advertisement: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100",
    song: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100",
    error: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-100",
  };

  return (
    <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950 rounded-lg shadow-lg border border-zinc-200/10 dark:border-zinc-800/10 p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b border-zinc-200/10 dark:border-zinc-800/10">
          <DialogTitle className="flex items-center gap-3">
            <img
              src={`https://radio-playback-files.s3.ap-south-1.amazonaws.com/logos/${selectedProgram?.channel
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")}.png`}
              alt={selectedProgram?.channel}
              className="h-10 w-10 rounded-md shadow-sm"
            />
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{selectedProgram?.title}</h1>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{selectedProgram?.channel}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className={`p-4 rounded-lg ${typeStyles[selectedProgram?.type.toLowerCase() || "program"]}`}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Channel</span>
                <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{selectedProgram?.channel}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Date</span>
                <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{selectedProgram?.date}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Time</span>
                <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{`${selectedProgram?.start} - ${selectedProgram?.end}`}</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Type</span>
                <p className="mt-1 font-medium capitalize text-zinc-900 dark:text-zinc-100">{selectedProgram?.type}</p>
              </div>
              {selectedProgram?.content && (
                <div className="col-span-2">
                  <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Content</span>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{selectedProgram.content}</p>
                </div>
              )}
              {selectedProgram?.episode_id && (
                <div>
                  <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Episode ID</span>
                  <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{selectedProgram.episode_id}</p>
                </div>
              )}
              {selectedProgram?.season_id && (
                <div>
                  <span className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">Season ID</span>
                  <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{selectedProgram.season_id}</p>
                </div>
              )}
            </div>
          </div>
          {selectedProgram?.image_paths?.length > 0 && (
            <div className="relative rounded-lg bg-white dark:bg-zinc-900/50 shadow-sm border border-zinc-200/10 dark:border-zinc-800/10 overflow-hidden">
              {/* Fixed height container to prevent jumping */}
              <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={selectedProgram.image_paths[currentImageIndex]}
                  alt={`${selectedProgram.title} frame ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => setIsImageLoading(false)}
                  onLoadStart={() => setIsImageLoading(true)}
                />
                
                {/* Loading indicator */}
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                  </div>
                )}
                
                {/* Image counter and controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    {/* Progress dots */}
                    {/* <div className="flex gap-1.5">
                      {selectedProgram.image_paths.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? "bg-white scale-125" 
                              : "bg-white/50 hover:bg-white/70"
                          }`}
                        />
                      ))}
                    </div> */}
                    
                    {/* Counter */}
                    {/* <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {`${currentImageIndex + 1}/${selectedProgram.image_paths.length}`}
                    </div> */}
                  </div>
                  
                </div>
                
                {/* Navigation arrows */}
                {/* {selectedProgram.image_paths.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(
                        currentImageIndex === 0 
                          ? selectedProgram.image_paths.length - 1 
                          : currentImageIndex - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(
                        (currentImageIndex + 1) % selectedProgram.image_paths.length
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    >
                      →
                    </button>
                  </>
                )} */}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDialog;