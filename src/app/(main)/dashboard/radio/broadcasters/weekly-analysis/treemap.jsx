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

  // Define colors based on ad count ranges
  const getColorByRange = (size) => {
    if (size >= 31 && size <= 35) return "#FF3B30";      // Red for highest range
    if (size >= 26 && size <= 30) return "#007AFF";      // Blue for high range
    if (size >= 21 && size <= 25) return "#34C759";      // Green for medium range
    if (size >= 15 && size <= 20) return "#5856D6";      // Purple for lower range
    return "#FFCC00";                                    // Yellow for outliers
  };

  const stations = [
    { id: "1", name: "Radio City FM" },
    { id: "2", name: "Radio Mirchi" },
    { id: "3", name: "Red FM" },
    { id: "4", name: "Big FM" },
    { id: "5", name: "Rainbow FM" },
  ];

  // Enhanced station data with dynamic colors based on size
  const stationData = {
    1: {
      name: "Radio City FM",
      children: [
          { name: "Medicinal Products", size: 30, brands: ["Cipla", "Sun Pharma", "Pfizer", "Dr. Reddy's"] },
          { name: "Travel & Tourism", size: 28, brands: ["MakeMyTrip", "Goibibo", "Yatra", "Expedia"] },
          { name: "Automobile - Car", size: 32, brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Honda"] },
          { name: "Dairy Products", size: 25, brands: ["Amul", "Mother Dairy", "Nestle", "Britannia"] },
          { name: "Finance - Loans", size: 27, brands: ["HDFC", "ICICI", "Bajaj Finance", "SBI"] },
          { name: "Public Service Ads", size: 15, brands: ["Ministry of Health", "WHO", "UNICEF", "NITI Aayog"] },
          { name: "Automobile - Dealers", size: 20, brands: ["True Value", "Mahindra First Choice", "Spinny", "Cars24"] },
          { name: "Finance - Bank", size: 30, brands: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"] },
          { name: "Fast Food", size: 26, brands: ["McDonald's", "KFC", "Domino's", "Burger King"] },
          { name: "Building Materials", size: 22, brands: ["Ultratech Cement", "ACC Cement", "Ambuja Cement", "Shree Cement"] },
          { name: "Finance - Insurance", size: 23, brands: ["LIC", "Max Life", "HDFC Life", "Bajaj Allianz"] },
          { name: "Personal Care", size: 25, brands: ["Dove", "Nivea", "Himalaya", "Patanjali"] },
          { name: "Textile and Apparels", size: 21, brands: ["Raymond", "Allen Solly", "Levi's", "Van Heusen"] },
          { name: "Hotel & Restaurants", size: 30, brands: ["Taj Hotels", "Oberoi", "Hyatt", "ITC Hotels"] },
          { name: "Building Material", size: 28, brands: ["L&T", "Godrej Interio", "Asian Paints", "Berger Paints"] },
          { name: "Entertainment", size: 32, brands: ["Netflix", "Amazon Prime", "Disney+", "Sony Liv"] },
          { name: "Accessory - Jewellery", size: 19, brands: ["Tanishq", "Malabar Gold", "Kalyan Jewellers", "CaratLane"] },
          { name: "Healthcare", size: 29, brands: ["Apollo", "Fortis", "Medanta", "Max Healthcare"] },
          { name: "Education", size: 22, brands: ["Byju's", "Unacademy", "Coursera", "Udemy"] },
          { name: "Insurance", size: 27, brands: ["ICICI Prudential", "HDFC Life", "SBI Life", "Tata AIA"] },
          { name: "Fashion", size: 21, brands: ["H&M", "Zara", "Nike", "Adidas"] },
          { name: "Food & Beverage", size: 30, brands: ["Coca-Cola", "PepsiCo", "McDonald's", "KFC"] },
          { name: "Banking", size: 25, brands: ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank"] },
          { name: "Chemical", size: 22, brands: ["Tata Chemicals", "Reliance Chemicals", "UPL", "BASF"] },
          { name: "Construction", size: 28, brands: ["L&T", "Shapoorji Pallonji", "GMR", "HCC"] },
          { name: "Public Works", size: 24, brands: ["NHAI", "PWD", "Indian Railways", "Metro Projects"] },
          { name: "FMCG", size: 27, brands: ["Hindustan Unilever", "Nestle", "ITC", "Dabur"] },
          { name: "Government", size: 20, brands: ["Ministry of Tourism", "Swachh Bharat", "Make in India", "Skill India"] },
          { name: "Real Estate", size: 30, brands: ["DLF", "Godrej Properties", "Prestige", "Lodha"] },
          { name: "Jewellery", size: 19, brands: ["Tanishq", "Kalyan Jewellers", "Malabar Gold", "CaratLane"] },
          { name: "Travel", size: 29, brands: ["IRCTC", "Airbnb", "Expedia", "Yatra"] },
          { name: "Automobile", size: 32, brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra"] }
      ].map(item => ({ ...item, fill: getColorByRange(item.size) }))
  },
  2: {
    name: "Capital Radio",
    children: [
      {
        name: "Entertainment",
        size: 30,
        brands: ["Netflix", "Amazon Prime", "Disney+", "Sony"],
      },
      {
        name: "Fashion",
        size: 25,
        // fill: vibrantColors[1],
        brands: ["H&M", "Zara", "Uniqlo", "Nike"],
      },
      {
        name: "Food & Beverage",
        size: 20,
        // fill: vibrantColors[2],
        brands: ["Coca-Cola", "PepsiCo", "McDonald's", "KFC"],
      },
      {
        name: "Technology",
        size: 15,
        // fill: vibrantColors[3],
        brands: ["Apple", "Samsung", "OnePlus", "Dell"],
      },
      {
        name: "Insurance",
        size: 10,
        // fill: vibrantColors[4],
        brands: ["LIC", "HDFC Life", "Max Life", "SBI Life"],
      },
    ].map(item => ({ ...item, fill: getColorByRange(item.size) })),
  },
  3: {
    name: "Wave FM",
    children: [
      {
        name: "Sports",
        size: 28,
        brands: ["Nike", "Adidas", "Puma", "Under Armour"],
      },
      {
        name: "Beauty",
        size: 22,
        // fill: vibrantColors[1],
        brands: ["L'Oreal", "Maybelline", "MAC", "Lakme"],
      },
      {
        name: "Healthcare",
        size: 18,
        // fill: vibrantColors[2],
        brands: ["Apollo", "Fortis", "Max Healthcare", "Cipla"],
      },
      {
        name: "Education",
        size: 20,
        // fill: vibrantColors[3],
        brands: ["Byju's", "Unacademy", "Coursera", "Udemy"],
      },
      {
        name: "Real Estate",
        size: 12,
        // fill: vibrantColors[4],
        brands: ["DLF", "Godrej Properties", "Prestige", "Lodha"],
      },
    ].map(item => ({ ...item, fill: getColorByRange(item.size) })),
  },
  4: {
    name: "Melody 90.4",
    children: [
      {
        name: "Travel",
        size: 25,
        brands: ["MakeMyTrip", "Yatra", "Airbnb", "IRCTC"],
      },
      {
        name: "Jewelry",
        size: 20,
        // fill: vibrantColors[1],
        brands: ["Tanishq", "Kalyan", "CaratLane", "Malabar Gold"],
      },
      {
        name: "Home Decor",
        size: 15,
        // fill: vibrantColors[2],
        brands: ["IKEA", "Home Centre", "Urban Ladder", "Pepperfry"],
      },
      {
        name: "Electronics",
        size: 22,
        // fill: vibrantColors[3],
        brands: ["Croma", "Reliance Digital", "Vijay Sales", "Amazon"],
      },
      {
        name: "Fitness",
        size: 18,
        // fill: vibrantColors[4],
        brands: ["Cult.fit", "Decathlon", "Gold's Gym", "Fitbit"],
      },
    ].map(item => ({ ...item, fill: getColorByRange(item.size) })),
  },
  5: {
    name: "Rhythm Radio",
    children: [
      {
        name: "Gaming",
        size: 24,
        brands: ["PlayStation", "Xbox", "Nintendo", "EA Sports"],
      },
      {
        name: "Streaming",
        size: 28,
        // fill: vibrantColors[1],
        brands: ["Spotify", "Gaana", "JioSaavn", "Amazon Music"],
      },
      {
        name: "Food Delivery",
        size: 20,
        // fill: vibrantColors[2],
        brands: ["Zomato", "Swiggy", "Domino's", "Pizza Hut"],
      },
      {
        name: "Airlines",
        size: 16,
        // fill: vibrantColors[3],
        brands: ["IndiGo", "Air India", "SpiceJet", "Vistara"],
      },
      {
        name: "Digital Payments",
        size: 12,
        // fill: vibrantColors[4],
        brands: ["Paytm", "PhonePe", "Google Pay", "Amazon Pay"],
      },
    ].map(item => ({ ...item, fill: getColorByRange(item.size) })),
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
                Radio Ads Distribution
              </h2>
              <p className="text-sm text-gray-500 font-normal mt-1">
                Advertisement Distribution by Count Range
              </p>
            </div>
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#5856D6]" />
                <span>15-20</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#34C759]" />
                <span>21-25</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
                <span>26-30</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
                <span>31-35</span>
              </div>
            </div>
            <div className="w-72">
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