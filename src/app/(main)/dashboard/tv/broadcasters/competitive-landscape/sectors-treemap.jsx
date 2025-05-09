import React, { useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowLeft, Tv } from "lucide-react";
import ChartCard from "@/components/card/charts-card";
import { Button } from "@/components/ui/button";

const TVChannelTreemap = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

const mockData = {
  "Nepal Television": {
    color: "#FF6B6B",
    share: 20,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 30,
        categories: {
          "Instant Noodles": {
            share: 40,
            brands: [
              { name: "Wai Wai", share: 45 },
              { name: "2PM", share: 35 },
              { name: "Rara", share: 20 },
            ],
          },
          "Soft Drinks": {
            share: 60,
            brands: [
              { name: "Coca Cola", share: 50 },
              { name: "Pepsi", share: 35 },
              { name: "Fanta", share: 15 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 25,
        categories: {
          "Mobile Services": {
            share: 60,
            brands: [
              { name: "Ncell", share: 55 },
              { name: "NTC", share: 45 },
            ],
          },
          "Internet Services": {
            share: 40,
            brands: [
              { name: "WorldLink", share: 60 },
              { name: "Vianet", share: 40 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 15,
        categories: {
          "Personal Banking": {
            share: 60,
            brands: [
              { name: "NIC Asia", share: 55 },
              { name: "Global IME", share: 45 },
            ],
          },
          "Credit Cards": {
            share: 40,
            brands: [
              { name: "Nabil Bank", share: 60 },
              { name: "Standard Chartered", share: 40 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 30,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 60 },
              { name: "P&G", share: 40 },
            ],
          },
        },
      },
    },
  },
  "Kantipur TV": {
    color: "#2ECC71",
    share: 18,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 28,
        categories: {
          "Instant Noodles": {
            share: 45,
            brands: [
              { name: "Wai Wai", share: 50 },
              { name: "2PM", share: 30 },
              { name: "Rara", share: 20 },
            ],
          },
          "Soft Drinks": {
            share: 55,
            brands: [
              { name: "Coca Cola", share: 45 },
              { name: "Pepsi", share: 40 },
              { name: "Fanta", share: 15 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 27,
        categories: {
          "Mobile Services": {
            share: 55,
            brands: [
              { name: "Ncell", share: 52 },
              { name: "NTC", share: 48 },
            ],
          },
          "Internet Services": {
            share: 45,
            brands: [
              { name: "WorldLink", share: 55 },
              { name: "Vianet", share: 45 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 65,
            brands: [
              { name: "NIC Asia", share: 52 },
              { name: "Global IME", share: 48 },
            ],
          },
          "Credit Cards": {
            share: 35,
            brands: [
              { name: "Nabil Bank", share: 58 },
              { name: "Standard Chartered", share: 42 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 55 },
              { name: "P&G", share: 45 },
            ],
          },
        },
      },
    },
  },
  "Himalaya TV": {
    color: "#E74C3C",
    share: 15,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 35,
        categories: {
          "Instant Noodles": {
            share: 50,
            brands: [
              { name: "Wai Wai", share: 40 },
              { name: "2PM", share: 40 },
              { name: "Rara", share: 20 },
            ],
          },
          "Soft Drinks": {
            share: 50,
            brands: [
              { name: "Coca Cola", share: 40 },
              { name: "Pepsi", share: 40 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 20,
        categories: {
          "Mobile Services": {
            share: 70,
            brands: [
              { name: "Ncell", share: 50 },
              { name: "NTC", share: 50 },
            ],
          },
          "Internet Services": {
            share: 30,
            brands: [
              { name: "WorldLink", share: 65 },
              { name: "Vianet", share: 35 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 70,
            brands: [
              { name: "NIC Asia", share: 50 },
              { name: "Global IME", share: 50 },
            ],
          },
          "Credit Cards": {
            share: 30,
            brands: [
              { name: "Nabil Bank", share: 55 },
              { name: "Standard Chartered", share: 45 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 50 },
              { name: "P&G", share: 50 },
            ],
          },
        },
      },
    },
  },
  "News 24": {
    color: "#3498DB",
    share: 12,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 25,
        categories: {
          "Instant Noodles": {
            share: 40,
            brands: [
              { name: "Wai Wai", share: 45 },
              { name: "2PM", share: 35 },
              { name: "Rara", share: 20 },
            ],
          },
          "Soft Drinks": {
            share: 60,
            brands: [
              { name: "Coca Cola", share: 45 },
              { name: "Pepsi", share: 35 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 30,
        categories: {
          "Mobile Services": {
            share: 65,
            brands: [
              { name: "Ncell", share: 55 },
              { name: "NTC", share: 45 },
            ],
          },
          "Internet Services": {
            share: 35,
            brands: [
              { name: "WorldLink", share: 60 },
              { name: "Vianet", share: 40 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 60,
            brands: [
              { name: "NIC Asia", share: 55 },
              { name: "Global IME", share: 45 },
            ],
          },
          "Credit Cards": {
            share: 40,
            brands: [
              { name: "Nabil Bank", share: 60 },
              { name: "Standard Chartered", share: 40 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 55 },
              { name: "P&G", share: 45 },
            ],
          },
        },
      },
    },
  },
  "Avenues TV": {
    color: "#9B59B6",
    share: 10,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 30,
        categories: {
          "Instant Noodles": {
            share: 45,
            brands: [
              { name: "Wai Wai", share: 40 },
              { name: "2PM", share: 35 },
              { name: "Rara", share: 25 },
            ],
          },
          "Soft Drinks": {
            share: 55,
            brands: [
              { name: "Coca Cola", share: 40 },
              { name: "Pepsi", share: 40 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 25,
        categories: {
          "Mobile Services": {
            share: 60,
            brands: [
              { name: "Ncell", share: 50 },
              { name: "NTC", share: 50 },
            ],
          },
          "Internet Services": {
            share: 40,
            brands: [
              { name: "WorldLink", share: 55 },
              { name: "Vianet", share: 45 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 65,
            brands: [
              { name: "NIC Asia", share: 50 },
              { name: "Global IME", share: 50 },
            ],
          },
          "Credit Cards": {
            share: 35,
            brands: [
              { name: "Nabil Bank", share: 55 },
              { name: "Standard Chartered", share: 45 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 60 },
              { name: "P&G", share: 40 },
            ],
          },
        },
      },
    },
  },
  "Image TV": {
    color: "#1ABC9C",
    share: 10,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 35,
        categories: {
          "Instant Noodles": {
            share: 50,
            brands: [
              { name: "Wai Wai", share: 45 },
              { name: "2PM", share: 30 },
              { name: "Rara", share: 25 },
            ],
          },
          "Soft Drinks": {
            share: 50,
            brands: [
              { name: "Coca Cola", share: 45 },
              { name: "Pepsi", share: 35 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 20,
        categories: {
          "Mobile Services": {
            share: 70,
            brands: [
              { name: "Ncell", share: 55 },
              { name: "NTC", share: 45 },
            ],
          },
          "Internet Services": {
            share: 30,
            brands: [
              { name: "WorldLink", share: 60 },
              { name: "Vianet", share: 40 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 60,
            brands: [
              { name: "NIC Asia", share: 55 },
              { name: "Global IME", share: 45 },
            ],
          },
          "Credit Cards": {
            share: 40,
            brands: [
              { name: "Nabil Bank", share: 60 },
              { name: "Standard Chartered", share: 40 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 55 },
              { name: "P&G", share: 45 },
            ],
          },
        },
      },
    },
  },
  Sagarmatha: {
    color: "#34495E",
    share: 8,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 30,
        categories: {
          "Instant Noodles": {
            share: 45,
            brands: [
              { name: "Wai Wai", share: 40 },
              { name: "2PM", share: 35 },
              { name: "Rara", share: 25 },
            ],
          },
          "Soft Drinks": {
            share: 55,
            brands: [
              { name: "Coca Cola", share: 45 },
              { name: "Pepsi", share: 35 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 25,
        categories: {
          "Mobile Services": {
            share: 65,
            brands: [
              { name: "Ncell", share: 50 },
              { name: "NTC", share: 50 },
            ],
          },
          "Internet Services": {
            share: 35,
            brands: [
              { name: "WorldLink", share: 55 },
              { name: "Vianet", share: 45 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 70,
            brands: [
              { name: "NIC Asia", share: 50 },
              { name: "Global IME", share: 50 },
            ],
          },
          "Credit Cards": {
            share: 30,
            brands: [
              { name: "Nabil Bank", share: 55 },
              { name: "Standard Chartered", share: 45 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 55 },
              { name: "P&G", share: 45 },
            ],
          },
        },
      },
    },
  },
  "AP1 TV": {
    color: "#D35400",
    share: 7,
    sectors: {
      "Food & Beverages": {
        color: "#4ECDC4",
        share: 30,
        categories: {
          "Instant Noodles": {
            share: 40,
            brands: [
              { name: "Wai Wai", share: 45 },
              { name: "2PM", share: 35 },
              { name: "Rara", share: 20 },
            ],
          },
          "Soft Drinks": {
            share: 60,
            brands: [
              { name: "Coca Cola", share: 40 },
              { name: "Pepsi", share: 40 },
              { name: "Fanta", share: 20 },
            ],
          },
        },
      },
      Telecommunications: {
        color: "#9B59B6",
        share: 25,
        categories: {
          "Mobile Services": {
            share: 60,
            brands: [
              { name: "Ncell", share: 55 },
              { name: "NTC", share: 45 },
            ],
          },
          "Internet Services": {
            share: 40,
            brands: [
              { name: "WorldLink", share: 60 },
              { name: "Vianet", share: 40 },
            ],
          },
        },
      },
      Banking: {
        color: "#3498DB",
        share: 25,
        categories: {
          "Personal Banking": {
            share: 65,
            brands: [
              { name: "NIC Asia", share: 55 },
              { name: "Global IME", share: 45 },
            ],
          },
          "Credit Cards": {
            share: 35,
            brands: [
              { name: "Nabil Bank", share: 60 },
              { name: "Standard Chartered", share: 40 },
            ],
          },
        },
      },
      FMCG: {
        color: "#F1C40F",
        share: 20,
        categories: {
          "Personal Care": {
            share: 100,
            brands: [
              { name: "Unilever", share: 60 },
              { name: "P&G", share: 40 },
            ],
          },
        },
      },
    },
  },
};

  const getCurrentLevel = () => {
    if (selectedCategory) return "brands";
    if (selectedSector) return "categories";
    if (selectedChannel) return "sectors";
    return "channels";
  };

  const getTitle = () => {
    if (selectedCategory) {
      return `${selectedCategory} Brands Share`;
    }
    if (selectedSector) {
      return `${selectedSector} Categories Share`;
    }
    if (selectedChannel) {
      return `${selectedChannel} Sectors Share`;
    }
    return "TV Channels Market Share";
  };

  const getData = () => {
    if (selectedCategory) {
      return mockData[selectedChannel].sectors[selectedSector].categories[
        selectedCategory
      ].brands.map((brand) => ({
        name: brand.name,
        size: brand.share,
        color: mockData[selectedChannel].sectors[selectedSector].color,
      }));
    }
    if (selectedSector) {
      return Object.entries(
        mockData[selectedChannel].sectors[selectedSector].categories
      ).map(([name, data]) => ({
        name,
        size: data.share,
        color: mockData[selectedChannel].sectors[selectedSector].color,
      }));
    }
    if (selectedChannel) {
      return Object.entries(mockData[selectedChannel].sectors).map(
        ([name, data]) => ({
          name,
          size: data.share,
          color: data.color,
        })
      );
    }
    return Object.entries(mockData).map(([name, data]) => ({
      name,
      size: data.share,
      color: data.color,
    }));
  };

  const handleClick = (name) => {
    const level = getCurrentLevel();
    if (level === "channels") {
      setSelectedChannel(name);
    } else if (level === "sectors") {
      setSelectedSector(name);
    } else if (level === "categories") {
      setSelectedCategory(name);
    }
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (selectedSector) {
      setSelectedSector(null);
    } else if (selectedChannel) {
      setSelectedChannel(null);
    }
  };

  const CustomizedContent = ({ x, y, width, height, name, color }) => {
    const isHovered = hoveredItem === name;
    const display = width > 50 && height > 50;
    const level = getCurrentLevel();

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
        onClick={() => level !== "brands" && handleClick(name)}
        style={{ cursor: level !== "brands" ? "pointer" : "default" }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={color}
          opacity={isHovered ? 0.8 : 1}
          style={{
            transition: "all 0.3s ease",
            filter: isHovered ? "brightness(1.1)" : "none",
          }}
          rx={8}
          ry={8}
          stroke="white"
          strokeWidth={2}
        />
        {display && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#FFFFFF"
            style={{
              fontSize: width > 100 ? "16px" : "12px",
              fontWeight: "500",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
              opacity: isHovered ? 1 : 0.9,
            }}
          >
            <tspan x={x + width / 2} dy="-0.5em">
              {name}
            </tspan>
            <tspan
              x={x + width / 2}
              dy="1.5em"
              style={{
                fontSize: width > 100 ? "14px" : "11px",
                fontWeight: "400",
              }}
            >
              {((width * height) / 5000).toFixed(1)}%
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <h3 className="font-semibold text-lg">{data.name}</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Market Share: {data.size}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartCard
      icon={<Tv className="w-6 h-6" />}
      title={getTitle()}
      description="View market share distribution across channels, sectors, categories, and brands"
      action={
        <div className="flex w-full justify-end">
          {(selectedChannel || selectedSector || selectedCategory) && (
            <Button onClick={handleBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to{" "}
              {selectedCategory
                ? "Categories"
                : selectedSector
                ? "Sectors"
                : "Channels"}
            </Button>
          )}
        </div>
      }
      chart={
        <ResponsiveContainer width="100%" height={600}>
          <Treemap
            data={getData()}
            dataKey="size"
            aspectRatio={16 / 9}
            stroke="#fff"
            content={<CustomizedContent />}
            animationEasing="ease-out"
          >
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "white", strokeWidth: 2 }}
            />
          </Treemap>
        </ResponsiveContainer>
      }
      footer={
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span
            className={`hover:text-primary cursor-pointer ${
              !selectedChannel ? "text-primary font-medium" : ""
            }`}
            onClick={() => {
              setSelectedChannel(null);
              setSelectedSector(null);
              setSelectedCategory(null);
            }}
          >
            Channels
          </span>
          {selectedChannel && (
            <>
              <span>→</span>
              <span
                className={`hover:text-primary cursor-pointer ${
                  selectedChannel && !selectedSector
                    ? "text-primary font-medium"
                    : ""
                }`}
                onClick={() => {
                  setSelectedSector(null);
                  setSelectedCategory(null);
                }}
              >
                {selectedChannel}
              </span>
            </>
          )}
          {selectedSector && (
            <>
              <span>→</span>
              <span
                className={`hover:text-primary cursor-pointer ${
                  selectedSector && !selectedCategory
                    ? "text-primary font-medium"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCategory(null);
                }}
              >
                {selectedSector}
              </span>
            </>
          )}
          {selectedCategory && (
            <>
              <span>→</span>
              <span className="text-primary font-medium">
                {selectedCategory}
              </span>
            </>
          )}
        </div>
      }
    />
  );
};

export default TVChannelTreemap;
