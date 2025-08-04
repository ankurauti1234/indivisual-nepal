import React, { useState, useEffect, useRef } from "react";

const CustomRangeSlider = ({ min, max, step, value, onChange }) => {
  const [leftValue, setLeftValue] = useState(value[0]);
  const [rightValue, setRightValue] = useState(value[1]);
  const rangeRef = useRef(null);

  const totalSteps = Math.floor((max - min) / 60); // One tick per hour
  const ticks = Array.from({ length: totalSteps + 1 }, (_, i) => i * 60);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const calculatePosition = (value) => ((value - min) / (max - min)) * 100;

  const handleLeftChange = (e) => {
    const newValue = Math.min(Number(e.target.value), rightValue - step);
    setLeftValue(newValue);
    onChange([newValue, rightValue]);
  };

  const handleRightChange = (e) => {
    const newValue = Math.max(Number(e.target.value), leftValue + step);
    setRightValue(newValue);
    onChange([leftValue, newValue]);
  };

  useEffect(() => {
    setLeftValue(value[0]);
    setRightValue(value[1]);
  }, [value]);

  return (
    <div className="w-full px-6 py-8">
      <div className="relative h-16">
        {/* Track Background */}
        <div className="absolute h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 top-1/2 -translate-y-1/2 shadow-inner" />

        {/* Selected Range */}
        <div
          className="absolute h-2 rounded-full bg-gradient-to-r from-indigo-400 to-teal-400 dark:from-indigo-600 dark:to-teal-600 transition-all duration-300 ease-out shadow-[0_0_8px_rgba(79,70,229,0.5)]"
          style={{
            left: `${calculatePosition(leftValue)}%`,
            width: `${calculatePosition(rightValue) - calculatePosition(leftValue)}%`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        {/* Tick Marks */}
        <div className="absolute w-full top-1/2 -translate-y-1/2">
          {ticks.map((tick) => (
            <div key={tick} className="absolute transform" style={{ left: `${calculatePosition(tick)}%` }}>
              <div className="h-4 w-0.5 bg-zinc-300 dark:bg-zinc-600 mx-auto" />
              <span className="absolute top-5 text-xs font-medium text-zinc-600 dark:text-zinc-400 -translate-x-1/2">{formatTime(tick)}</span>
            </div>
          ))}
        </div>

        {/* Current Values Display */}
        <div className="absolute w-full flex justify-between -top-10">
          <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-1 shadow-md border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:shadow-lg">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{formatTime(leftValue)}</span>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg px-3 py-1 shadow-md border border-zinc-200 dark:border-zinc-700 transition-all duration-200 hover:shadow-lg">
            <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{formatTime(rightValue)}</span>
          </div>
        </div>

        {/* Left Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={leftValue}
          onChange={handleLeftChange}
          className="absolute w-full top-1/2 -translate-y-1/2 h-4 appearance-none bg-transparent pointer-events-none slider-custom"
          style={{ "--thumb-color": "#ffffff", "--thumb-border": "2px solid #4f46e5" }}
        />

        {/* Right Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={rightValue}
          onChange={handleRightChange}
          className="absolute w-full top-1/2 -translate-y-1/2 h-4 appearance-none bg-transparent pointer-events-none slider-custom"
          style={{ "--thumb-color": "#ffffff", "--thumb-border": "2px solid #14b8a6" }}
        />
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: var(--thumb-border);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          pointer-events: auto;
          cursor: grab;
          transition: all 0.2s ease;
        }
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider-custom::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: var(--thumb-border);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          pointer-events: auto;
          cursor: grab;
          transition: all 0.2s ease;
        }
        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default CustomRangeSlider;