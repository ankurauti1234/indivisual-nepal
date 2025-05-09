import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Radio, Info } from "lucide-react";

const AppleStyleTreemap = () => {
  const [selectedStation, setSelectedStation] = useState("1");
  const [hoveredItem, setHoveredItem] = useState(null);

  const vibrantColors = [
    "#FF3B30", // Red
    "#5856D6", // Purple
    "#FF9500", // Orange
    "#34C759", // Green
    "#007AFF", // Blue
    "#AF52DE", // Magenta
    "#5AC8FA", // Light Blue
    "#FFCC00", // Yellow
    "#FF2D55", // Pink
    "#4CD964", // Lime
  ];

  const stations = [
    { id: "1", name: "Radio City FM" },
    { id: "2", name: "Radio Mirchi" },
    { id: "3", name: "Red FM" },
    { id: "4", name: "Big FM" },
    { id: "5", name: "Rainbow FM" },
  ];

  // Enhanced station data with new colors
  const stationData = {
    1: {
      name: "Radio City FM",
      children: [
        {
          name: "Automotive",
          size: 35,
          fill: vibrantColors[0],
          brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra"],
        },
        {
          name: "FMCG",
          size: 28,
          fill: vibrantColors[1],
          brands: ["Hindustan Unilever", "Nestle", "ITC", "Dabur"],
        },
        {
          name: "Telecom",
          size: 22,
          fill: vibrantColors[2],
          brands: ["Airtel", "Jio", "Vodafone Idea", "BSNL"],
        },
        {
          name: "E-commerce",
          size: 18,
          fill: vibrantColors[3],
          brands: ["Amazon", "Flipkart", "Myntra", "Snapdeal"],
        },
        {
          name: "Banking",
          size: 25,
          fill: vibrantColors[4],
          brands: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"],
        },
      ],
    },
    2: {
      name: "Capital Radio",
      children: [
        {
          name: "Entertainment",
          size: 30,
          fill: vibrantColors[0],
          brands: ["Netflix", "Amazon Prime", "Disney+", "Sony"],
        },
        {
          name: "Fashion",
          size: 25,
          fill: vibrantColors[1],
          brands: ["H&M", "Zara", "Uniqlo", "Nike"],
        },
        {
          name: "Food & Beverage",
          size: 20,
          fill: vibrantColors[2],
          brands: ["Coca-Cola", "PepsiCo", "McDonald's", "KFC"],
        },
        {
          name: "Technology",
          size: 15,
          fill: vibrantColors[3],
          brands: ["Apple", "Samsung", "OnePlus", "Dell"],
        },
        {
          name: "Insurance",
          size: 10,
          fill: vibrantColors[4],
          brands: ["LIC", "HDFC Life", "Max Life", "SBI Life"],
        },
      ],
    },
    3: {
      name: "Wave FM",
      children: [
        {
          name: "Sports",
          size: 28,
          fill: vibrantColors[0],
          brands: ["Nike", "Adidas", "Puma", "Under Armour"],
        },
        {
          name: "Beauty",
          size: 22,
          fill: vibrantColors[1],
          brands: ["L'Oreal", "Maybelline", "MAC", "Lakme"],
        },
        {
          name: "Healthcare",
          size: 18,
          fill: vibrantColors[2],
          brands: ["Apollo", "Fortis", "Max Healthcare", "Cipla"],
        },
        {
          name: "Education",
          size: 20,
          fill: vibrantColors[3],
          brands: ["Byju's", "Unacademy", "Coursera", "Udemy"],
        },
        {
          name: "Real Estate",
          size: 12,
          fill: vibrantColors[4],
          brands: ["DLF", "Godrej Properties", "Prestige", "Lodha"],
        },
      ],
    },
    4: {
      name: "Melody 90.4",
      children: [
        {
          name: "Travel",
          size: 25,
          fill: vibrantColors[0],
          brands: ["MakeMyTrip", "Yatra", "Airbnb", "IRCTC"],
        },
        {
          name: "Jewelry",
          size: 20,
          fill: vibrantColors[1],
          brands: ["Tanishq", "Kalyan", "CaratLane", "Malabar Gold"],
        },
        {
          name: "Home Decor",
          size: 15,
          fill: vibrantColors[2],
          brands: ["IKEA", "Home Centre", "Urban Ladder", "Pepperfry"],
        },
        {
          name: "Electronics",
          size: 22,
          fill: vibrantColors[3],
          brands: ["Croma", "Reliance Digital", "Vijay Sales", "Amazon"],
        },
        {
          name: "Fitness",
          size: 18,
          fill: vibrantColors[4],
          brands: ["Cult.fit", "Decathlon", "Gold's Gym", "Fitbit"],
        },
      ],
    },
    5: {
      name: "Rhythm Radio",
      children: [
        {
          name: "Gaming",
          size: 24,
          fill: vibrantColors[0],
          brands: ["PlayStation", "Xbox", "Nintendo", "EA Sports"],
        },
        {
          name: "Streaming",
          size: 28,
          fill: vibrantColors[1],
          brands: ["Spotify", "Gaana", "JioSaavn", "Amazon Music"],
        },
        {
          name: "Food Delivery",
          size: 20,
          fill: vibrantColors[2],
          brands: ["Zomato", "Swiggy", "Domino's", "Pizza Hut"],
        },
        {
          name: "Airlines",
          size: 16,
          fill: vibrantColors[3],
          brands: ["IndiGo", "Air India", "SpiceJet", "Vistara"],
        },
        {
          name: "Digital Payments",
          size: 12,
          fill: vibrantColors[4],
          brands: ["Paytm", "PhonePe", "Google Pay", "Amazon Pay"],
        },
      ],
    },
  };

  const CustomizedContent = (props) => {
    const { x, y, width, height, name, size, fill } = props;
    const isHovered = hoveredItem === name;

    return (
      <g
        onMouseEnter={() => setHoveredItem(name)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          opacity={isHovered ? 0.8 : 1}
          style={{
            transition: "all 0.3s ease",
            cursor: "pointer",
            filter: isHovered ? "brightness(1.1)" : "none",
          }}
          rx={8}
          ry={8}
          stroke="white"
          strokeWidth={3}
        />
        {width > 50 && height > 50 && (
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
              {`${size} Ads`}
            </tspan>
          </text>
        )}
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const industry = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-white/90 p-4 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: industry.fill }}
            />
            <h3 className="font-semibold text-lg">{industry.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Number of Ads: {industry.size}
          </p>
          <div className="space-y-2">
            <p className="font-medium text-sm">Top Brands:</p>
            <div className="grid grid-cols-2 gap-2">
              {industry.brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-50/80 px-3 py-2 rounded-xl text-sm"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const currentStation = stationData[selectedStation];

  return (
    <Card className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <Radio className="w-7 h-7 text-primary animate-pulse" />
            <div>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Radio Analytics
              </h2>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Advertisement Distribution
              </p>
            </div>
          </CardTitle>
          <div className="w-full md:w-72">
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-full h-11 rounded-xl">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">{currentStation.name}</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              {currentStation.children.length} Industries
            </div>
          </div>
          <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={currentStation.children}
                dataKey="size"
                aspectRatio={16 / 9}
                stroke="#fff"
                content={<CustomizedContent />}
                animationDuration={450}
                animationEasing="ease-out"
              >
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "white", strokeWidth: 2 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppleStyleTreemap;
