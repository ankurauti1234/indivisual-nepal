import React, { useState, useCallback } from "react";

const Brush = ({ width, height, start, end, onChange }) => {
  const [isDragging, setIsDragging] = useState(null);
  const [startPos, setStartPos] = useState(start);
  const [endPos, setEndPos] = useState(end);

  const handleMouseDown = useCallback((e, handle) => {
    setIsDragging(handle);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, width));
      const newPos = Math.round(x / (width / (24 * 60)));

      if (isDragging === "start") {
        setStartPos(Math.min(newPos, endPos - 60));
      } else if (isDragging === "end") {
        setEndPos(Math.max(newPos, startPos + 60));
      } else if (isDragging === "middle") {
        const diff = newPos - startPos;
        const newStart = Math.max(0, startPos + diff);
        const newEnd = Math.min(24 * 60, endPos + diff);
        if (newEnd - newStart >= 60) {
          setStartPos(newStart);
          setEndPos(newEnd);
        }
      }
    },
    [isDragging, startPos, endPos, width]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    onChange(startPos, endPos);
  }, [onChange, startPos, endPos]);

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <rect x={0} y={0} width={width} height={height} fill="#f3f4f6" />
      <rect
        x={(startPos / (24 * 60)) * width}
        y={0}
        width={((endPos - startPos) / (24 * 60)) * width}
        height={height}
        fill="#60a5fa"
        opacity={0.5}
      />
      <rect
        x={(startPos / (24 * 60)) * width}
        y={0}
        width={10}
        height={height}
        fill="#2563eb"
        cursor="ew-resize"
        onMouseDown={(e) => handleMouseDown(e, "start")}
      />
      <rect
        x={(endPos / (24 * 60)) * width - 10}
        y={0}
        width={10}
        height={height}
        fill="#2563eb"
        cursor="ew-resize"
        onMouseDown={(e) => handleMouseDown(e, "end")}
      />
      <rect
        x={(startPos / (24 * 60)) * width + 10}
        y={0}
        width={((endPos - startPos) / (24 * 60)) * width - 20}
        height={height}
        fill="transparent"
        cursor="move"
        onMouseDown={(e) => handleMouseDown(e, "middle")}
      />
    </svg>
  );
};

export default Brush;
