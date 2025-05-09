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
    <div className="w-full px-4 py-3">
      <div className="relative h-12">
        {/* Track Background */}
        <div className="absolute h-1 w-full rounded-full bg-muted top-1/2 -translate-y-1/2" />

        {/* Selected Range */}
        <div
          className="absolute h-1 rounded-full bg-indigo-400 dark:bg-indigo-500 transition-all duration-300"
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
              <div className="h-3 w-px bg-muted-foreground/30 mx-auto" />
              <span className="absolute top-3 text-[10px] font-medium text-muted-foreground -translate-x-1/2">
                {formatTime(tick)}
              </span>
            </div>
          ))}
        </div>

        {/* Current Values Display */}
        <div className="absolute w-full flex justify-between -top-3">
          <div className="bg-popover rounded-md px-2 py-0.5 border border-muted shadow-sm hover:shadow-md transition-shadow duration-200">
            <span className="text-xs font-medium text-foreground">{formatTime(leftValue)}</span>
          </div>
          <div className="bg-popover rounded-md px-2 py-0.5 border border-muted shadow-sm hover:shadow-md transition-shadow duration-200">
            <span className="text-xs font-medium text-foreground">{formatTime(rightValue)}</span>
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
          style={{ "--thumb-color": "#ffffff", "--thumb-border": "1px solid #4f46e5" }}
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
          style={{ "--thumb-color": "#ffffff", "--thumb-border": "1px solid #4f46e5" }}
        />
      </div>

      <style jsx>{`
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: var(--thumb-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
          cursor: grab;
          transition: all 0.2s ease;
        }
        .slider-custom::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider-custom::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
        .slider-custom::-moz-range-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: var(--thumb-color);
          border: var(--thumb-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
          cursor: grab;
          transition: all 0.2s ease;
        }
        .slider-custom::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
        .slider-custom::-moz-range-thumb:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default CustomRangeSlider;