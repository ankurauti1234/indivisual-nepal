import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Blocks, ChevronLeft, Info } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

const COLORS = {
  "Home Improvement & Decor": "#FF6B6B",
  "Food & Beverages": "#4ECDC4",
  "Media & Entertainment": "#45B7D1",
  "Financial Services": "#96CEB4",
  Telecommunications: "#FFEEAD",
  FMCG: "#D4A5A5",
  "Construction Materials": "#9B786F",
};

const data = {
  id: "Total GRP",
  color: "hsl(201, 70%, 50%)",
  children: [
    {
      id: "Home Improvement & Decor",
      color: "hsl(45, 70%, 50%)",
      children: [
        { id: "Wall Paints", value: 20, color: "hsl(45, 70%, 60%)" },
        { id: "Wood Finishes", value: 15, color: "hsl(45, 70%, 65%)" },
        {
          id: "Waterproofing Solutions",
          value: 12,
          color: "hsl(45, 70%, 70%)",
        },
        { id: "Decorative Paints", value: 18, color: "hsl(45, 70%, 75%)" },
        { id: "Industrial Coatings", value: 10, color: "hsl(45, 70%, 80%)" },
      ],
    },
    {
      id: "Food & Beverages",
      color: "hsl(180, 70%, 50%)",
      children: [
        { id: "Instant Noodles", value: 25, color: "hsl(180, 70%, 60%)" },
        { id: "Ready-to-Eat Snacks", value: 20, color: "hsl(180, 70%, 65%)" },
        { id: "Spices", value: 15, color: "hsl(180, 70%, 70%)" },
        {
          id: "Noodle-Based Recipes",
          value: 18,
          color: "hsl(180, 70%, 75%)",
        },
        { id: "Condiments & Sauces", value: 12, color: "hsl(180, 70%, 80%)" },
      ],
    },
    {
      id: "Media & Entertainment",
      color: "hsl(120, 70%, 50%)",
      children: [
        { id: "DTH Services", value: 22, color: "hsl(120, 70%, 60%)" },
        { id: "HD Channel Packages", value: 18, color: "hsl(120, 70%, 65%)" },
        { id: "Internet Services", value: 20, color: "hsl(120, 70%, 70%)" },
        { id: "VOD Services", value: 15, color: "hsl(120, 70%, 75%)" },
        { id: "IPTV", value: 12, color: "hsl(120, 70%, 80%)" },
      ],
    },
    {
      id: "Financial Services",
      color: "hsl(0, 70%, 50%)",
      children: [
        { id: "Retail Banking", value: 30, color: "hsl(0, 70%, 60%)" },
        { id: "Corporate Banking", value: 25, color: "hsl(0, 70%, 65%)" },
        { id: "Insurance Services", value: 20, color: "hsl(0, 70%, 70%)" },
        { id: "Investment Banking", value: 15, color: "hsl(0, 70%, 75%)" },
        {
          id: "Digital Payment Solutions",
          value: 18,
          color: "hsl(0, 70%, 80%)",
        },
      ],
    },
    {
      id: "Telecommunications",
      color: "hsl(270, 70%, 50%)",
      children: [
        { id: "Mobile Services", value: 35, color: "hsl(270, 70%, 60%)" },
        { id: "Broadband Internet", value: 30, color: "hsl(270, 70%, 65%)" },
        {
          id: "Value-Added Services",
          value: 20,
          color: "hsl(270, 70%, 70%)",
        },
        {
          id: "Enterprise Solutions",
          value: 25,
          color: "hsl(270, 70%, 75%)",
        },
        {
          id: "Satellite Communication",
          value: 15,
          color: "hsl(270, 70%, 80%)",
        },
      ],
    },
    {
      id: "FMCG",
      color: "hsl(90, 70%, 50%)",
      children: [
        { id: "Personal Care", value: 40, color: "hsl(90, 70%, 60%)" },
        { id: "Home Care", value: 35, color: "hsl(90, 70%, 65%)" },
        { id: "Packaged Foods", value: 30, color: "hsl(90, 70%, 70%)" },
        { id: "Oral Care", value: 25, color: "hsl(90, 70%, 75%)" },
        { id: "Baby Care Products", value: 20, color: "hsl(90, 70%, 80%)" },
      ],
    },
    {
      id: "Construction Materials",
      color: "hsl(135, 70%, 50%)",
      children: [
        { id: "OPC", value: 25, color: "hsl(135, 70%, 60%)" },
        { id: "PPC", value: 20, color: "hsl(135, 70%, 65%)" },
        { id: "Ready-Mix Concrete", value: 18, color: "hsl(135, 70%, 70%)" },
        { id: "Specialty Cement", value: 15, color: "hsl(135, 70%, 75%)" },
        { id: "Cement Accessories", value: 12, color: "hsl(135, 70%, 80%)" },
      ],
    },
  ],
};

const GRPSunburstChart = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("chart-container");
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: Math.min(600, window.innerHeight - 200),
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateTotalValue = (node) => {
    if (node.value) return node.value;
    return node.children.reduce(
      (sum, child) => sum + calculateTotalValue(child),
      0
    );
  };

  const getCurrentNode = () => {
    let currentNode = data;
    for (const pathItem of currentPath) {
      currentNode = currentNode.children.find((child) => child.id === pathItem);
    }
    return currentNode;
  };

  const createArc = (startAngle, endAngle, innerRadius, outerRadius) => {
    const start = {
      x: centerX + Math.cos(startAngle) * outerRadius,
      y: centerY + Math.sin(startAngle) * outerRadius,
    };
    const end = {
      x: centerX + Math.cos(endAngle) * outerRadius,
      y: centerY + Math.sin(endAngle) * outerRadius,
    };
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    return [
      `M ${centerX + Math.cos(startAngle) * innerRadius} ${
        centerY + Math.sin(startAngle) * innerRadius
      }`,
      `L ${start.x} ${start.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `L ${centerX + Math.cos(endAngle) * innerRadius} ${
        centerY + Math.sin(endAngle) * innerRadius
      }`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
        centerX + Math.cos(startAngle) * innerRadius
      } ${centerY + Math.sin(startAngle) * innerRadius}`,
      "Z",
    ].join(" ");
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const renderLegend = () => {
    const currentNode = getCurrentNode();
    return (
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {currentNode.children?.map((child) => (
          <div
            key={child.id}
            className="flex items-center gap-2"
            onMouseEnter={() => setHoveredSlice(child)}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: child.color }}
            />
            <span className="text-sm font-medium">{child.id}</span>
            <span className="text-sm text-gray-500">
              ({calculateTotalValue(child)})
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderSlices = () => {
    const currentNode = getCurrentNode();
    const total = calculateTotalValue(currentNode);
    let currentAngle = -Math.PI / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.7;
    const innerRadius = baseRadius * 0.4;
    const outerRadius = baseRadius;

    return currentNode.children?.map((child) => {
      const childValue = calculateTotalValue(child);
      const sliceAngle = (2 * Math.PI * childValue) / total;
      const nextAngle = currentAngle + sliceAngle;
      const path = createArc(currentAngle, nextAngle, innerRadius, outerRadius);

      const slice = (
        <g
          key={child.id}
          onClick={() =>
            child.children && setCurrentPath([...currentPath, child.id])
          }
          onMouseEnter={() => setHoveredSlice(child)}
          onMouseLeave={() => setHoveredSlice(null)}
          onMouseMove={handleMouseMove}
          style={{ cursor: child.children ? "pointer" : "default" }}
          className="transition-all duration-200"
        >
          <path
            d={path}
            fill={child.color}
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-200"
            style={{
              opacity: hoveredSlice === child ? 0.9 : 0.8,
              filter:
                hoveredSlice === child
                  ? "drop-shadow(0 0 8px rgba(0,0,0,0.2))"
                  : "none",
            }}
          />
          <text
            x={
              centerX +
              Math.cos(currentAngle + sliceAngle / 2) *
                (innerRadius + (outerRadius - innerRadius) / 2)
            }
            y={
              centerY +
              Math.sin(currentAngle + sliceAngle / 2) *
                (innerRadius + (outerRadius - innerRadius) / 2)
            }
            textAnchor="middle"
            fill="white"
            fontSize="12"
            className="font-medium pointer-events-none select-none"
            transform={`rotate(${
              ((currentAngle + sliceAngle / 2) * 180) / Math.PI
            }, 
              ${
                centerX +
                Math.cos(currentAngle + sliceAngle / 2) *
                  (innerRadius + (outerRadius - innerRadius) / 2)
              }, 
              ${
                centerY +
                Math.sin(currentAngle + sliceAngle / 2) *
                  (innerRadius + (outerRadius - innerRadius) / 2)
              })`}
          >
            {child.id}
          </text>
        </g>
      );

      currentAngle = nextAngle;
      return slice;
    });
  };

  return (
    <ChartCard
      icon={<Blocks className="w-6 h-6" />}
      title="GRP Distribution treemap"
      // description="Most performing channels this year"
      action={
          <div className="flex items-center justify-end gap-2">
            {currentPath.length > 0 && (
              <Button
                variant="outline"
                className="h-8 px-2 text-gray-600 hover:text-gray-900"
                onClick={() => setCurrentPath(currentPath.slice(0, -1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <div className="text-sm text-gray-500">
              {currentPath.length > 0 ? currentPath.join(" > ") : "Overview"}
            </div>

  
          {hoveredSlice && (
            <div
              className="absolute bg-white p-4 rounded-lg shadow-lg border border-gray-200/50 backdrop-blur-sm"
              style={{
                left: `${tooltipPosition.x + 10}px`,
                top: `${tooltipPosition.y + 10}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 50,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: hoveredSlice.color }}
                />
                <span className="font-medium">{hoveredSlice.id}</span>
              </div>
              
            </div>
          )}
        </div>
      }
      chart={
        <div
          id="chart-container"
          className="relative w-full flex flex-col items-center"
          style={{ height: `${dimensions.height}px` }}
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="overflow-visible"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {renderSlices()}
          </svg>
          
        </div>
      }
      footer={
        renderLegend()
      }
    />
  );
};

export default GRPSunburstChart;
