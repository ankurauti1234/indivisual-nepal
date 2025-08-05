import { BarChart3, PieChart } from "lucide-react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useMemo } from "react";

// Real data from the CSV
const rawData = [
  { channel: "Galaxy 4K", brand: "Asianpaints Apex Floor Guard", category: "BUILDING MATERIALS", airtime: 56.58, share: 7.98 },
  { channel: "Galaxy 4K", brand: "Cinthol", category: "PERSONAL CARE -SKINCARE", airtime: 54.9, share: 7.74 },
  { channel: "Galaxy 4K", brand: "Sprite", category: "BEVERAGES", airtime: 50.16, share: 7.07 },
  { channel: "Galaxy 4K", brand: "Samsung Microwave Oven", category: "CONSUMER DURABLES-OVEN", airtime: 45.84, share: 6.46 },
  { channel: "Galaxy 4K", brand: "OK Soap", category: "CLEANING SUPPLIES", airtime: 42.96, share: 6.06 },
  { channel: "Galaxy 4K", brand: "E sewa", category: "DIGITAL PAYMENT", airtime: 41.94, share: 5.91 },
  { channel: "Galaxy 4K", brand: "Right Path", category: "COACHING -EDUCATION", airtime: 41.88, share: 5.9 },
  { channel: "Galaxy 4K", brand: "Minto", category: "FOOD & BEVERAGE", airtime: 41.58, share: 5.86 },
  { channel: "Galaxy 4K", brand: "Closeup", category: "PERSONAL CARE -ORAL CARE PRODUCTS", airtime: 40.74, share: 5.74 },
  { channel: "Galaxy 4K", brand: "Citizen Life", category: "FINANCE-INSURANCE", airtime: 40.08, share: 5.65 },
  { channel: "Galaxy 4K", brand: "Dabur Real Fruit Juice", category: "BEVERAGES", airtime: 38.76, share: 5.46 },
  { channel: "Galaxy 4K", brand: "Lux", category: "PERSONAL CARE -SKINCARE", airtime: 38.64, share: 5.45 },
  { channel: "Galaxy 4K", brand: "Toffichho Eclairs", category: "FOOD & BEVERAGE", airtime: 38.16, share: 5.38 },
  { channel: "Galaxy 4K", brand: "Dove", category: "PERSONAL CARE -SKINCARE", airtime: 28.08, share: 3.96 },
  { channel: "Galaxy 4K", brand: "LG", category: "CONSUMER DURABLES-HOME APPLIANCES", airtime: 26.58, share: 3.75 },
  { channel: "Galaxy 4K", brand: "Photex Power", category: "EV CHARGING INFRASTRUCTURE", airtime: 26.58, share: 3.75 },
  { channel: "Galaxy 4K", brand: "Fanta", category: "BEVERAGES", airtime: 19.98, share: 2.82 },
  { channel: "Galaxy 4K", brand: "Dermi Cool", category: "PERSONAL CARE -HAIRCARE", airtime: 18.24, share: 2.57 },
  { channel: "Galaxy 4K", brand: "Samsung Air Purifier", category: "CONSUMER DURABLES-AIR PURIFIER", airtime: 17.76, share: 2.5 },
  
  { channel: "Ntv Nepal", brand: "LG", category: "CONSUMER DURABLES-HOME APPLIANCES", airtime: 58.08, share: 8.12 },
  { channel: "Ntv Nepal", brand: "Fanta", category: "BEVERAGES", airtime: 55.02, share: 7.69 },
  { channel: "Ntv Nepal", brand: "Citizen Life", category: "FINANCE-INSURANCE", airtime: 54.9, share: 7.67 },
  { channel: "Ntv Nepal", brand: "Dove", category: "PERSONAL CARE -SKINCARE", airtime: 53.88, share: 7.53 },
  { channel: "Ntv Nepal", brand: "Samsung Microwave Oven", category: "CONSUMER DURABLES-OVEN", airtime: 46.02, share: 6.43 },
  { channel: "Ntv Nepal", brand: "Right Path", category: "COACHING -EDUCATION", airtime: 44.82, share: 6.26 },
  { channel: "Ntv Nepal", brand: "Closeup", category: "PERSONAL CARE -ORAL CARE PRODUCTS", airtime: 42.18, share: 5.9 },
  { channel: "Ntv Nepal", brand: "Lux", category: "PERSONAL CARE -SKINCARE", airtime: 41.16, share: 5.75 },
  { channel: "Ntv Nepal", brand: "Minto", category: "FOOD & BEVERAGE", airtime: 38.46, share: 5.38 },
  { channel: "Ntv Nepal", brand: "Asianpaints Apex Floor Guard", category: "BUILDING MATERIALS", airtime: 38.1, share: 5.33 },
  { channel: "Ntv Nepal", brand: "Cinthol", category: "PERSONAL CARE -SKINCARE", airtime: 37.08, share: 5.18 },
  { channel: "Ntv Nepal", brand: "Sprite", category: "BEVERAGES", airtime: 34.08, share: 4.76 },
  { channel: "Ntv Nepal", brand: "Photex Power", category: "EV CHARGING INFRASTRUCTURE", airtime: 34.08, share: 4.76 },
  { channel: "Ntv Nepal", brand: "Dabur Real Fruit Juice", category: "BEVERAGES", airtime: 29.22, share: 4.08 },
  { channel: "Ntv Nepal", brand: "Dermi Cool", category: "PERSONAL CARE -HAIRCARE", airtime: 27.96, share: 3.91 },
  { channel: "Ntv Nepal", brand: "E sewa", category: "DIGITAL PAYMENT", airtime: 25.26, share: 3.53 },
  { channel: "Ntv Nepal", brand: "OK Soap", category: "CLEANING SUPPLIES", airtime: 21.66, share: 3.03 },
  { channel: "Ntv Nepal", brand: "Samsung Air Purifier", category: "CONSUMER DURABLES-AIR PURIFIER", airtime: 17.1, share: 2.39 },
  { channel: "Ntv Nepal", brand: "Toffichho Eclairs", category: "FOOD & BEVERAGE", airtime: 16.38, share: 2.29 },
  
  { channel: "News 24", brand: "Fanta", category: "BEVERAGES", airtime: 59.16, share: 7.73 },
  { channel: "News 24", brand: "Lux", category: "PERSONAL CARE -SKINCARE", airtime: 57.54, share: 7.52 },
  { channel: "News 24", brand: "Dabur Real Fruit Juice", category: "BEVERAGES", airtime: 57.48, share: 7.51 },
  { channel: "News 24", brand: "Minto", category: "FOOD & BEVERAGE", airtime: 57.3, share: 7.49 },
  { channel: "News 24", brand: "Samsung Air Purifier", category: "CONSUMER DURABLES-AIR PURIFIER", airtime: 53.4, share: 6.98 },
  { channel: "News 24", brand: "Closeup", category: "PERSONAL CARE -ORAL CARE PRODUCTS", airtime: 50.04, share: 6.54 },
  { channel: "News 24", brand: "Citizen Life", category: "FINANCE-INSURANCE", airtime: 46.8, share: 6.11 },
  { channel: "News 24", brand: "Cinthol", category: "PERSONAL CARE -SKINCARE", airtime: 42.3, share: 5.53 },
  { channel: "News 24", brand: "E sewa", category: "DIGITAL PAYMENT", airtime: 41.7, share: 5.45 },
  { channel: "News 24", brand: "Toffichho Eclairs", category: "FOOD & BEVERAGE", airtime: 40.44, share: 5.28 },
  { channel: "News 24", brand: "Asianpaints Apex Floor Guard", category: "BUILDING MATERIALS", airtime: 39.78, share: 5.2 },
  { channel: "News 24", brand: "Right Path", category: "COACHING -EDUCATION", airtime: 38.76, share: 5.06 },
  { channel: "News 24", brand: "Dermi Cool", category: "PERSONAL CARE -HAIRCARE", airtime: 37.86, share: 4.95 },
  { channel: "News 24", brand: "Photex Power", category: "EV CHARGING INFRASTRUCTURE", airtime: 34.5, share: 4.51 },
  { channel: "News 24", brand: "LG", category: "CONSUMER DURABLES-HOME APPLIANCES", airtime: 30.9, share: 4.04 },
  { channel: "News 24", brand: "Samsung Microwave Oven", category: "CONSUMER DURABLES-OVEN", airtime: 23.88, share: 3.12 },
  { channel: "News 24", brand: "Dove", category: "PERSONAL CARE -SKINCARE", airtime: 21.78, share: 2.85 },
  { channel: "News 24", brand: "Sprite", category: "BEVERAGES", airtime: 16.38, share: 2.14 },
  { channel: "News 24", brand: "OK Soap", category: "CLEANING SUPPLIES", airtime: 15.48, share: 2.02 },
  
  { channel: "Kantipur Hd Tv", brand: "Dabur Real Fruit Juice", category: "BEVERAGES", airtime: 59.64, share: 7.53 },
  { channel: "Kantipur Hd Tv", brand: "Dove", category: "PERSONAL CARE -SKINCARE", airtime: 57.3, share: 7.24 },
  { channel: "Kantipur Hd Tv", brand: "Closeup", category: "PERSONAL CARE -ORAL CARE PRODUCTS", airtime: 51.96, share: 6.56 },
  { channel: "Kantipur Hd Tv", brand: "Asianpaints Apex Floor Guard", category: "BUILDING MATERIALS", airtime: 50.64, share: 6.4 },
  { channel: "Kantipur Hd Tv", brand: "Toffichho Eclairs", category: "FOOD & BEVERAGE", airtime: 50.34, share: 6.36 },
  { channel: "Kantipur Hd Tv", brand: "Cinthol", category: "PERSONAL CARE -SKINCARE", airtime: 49.68, share: 6.27 },
  { channel: "Kantipur Hd Tv", brand: "Sprite", category: "BEVERAGES", airtime: 49.26, share: 6.22 },
  { channel: "Kantipur Hd Tv", brand: "OK Soap", category: "CLEANING SUPPLIES", airtime: 48.36, share: 6.11 },
  { channel: "Kantipur Hd Tv", brand: "Samsung Microwave Oven", category: "CONSUMER DURABLES-OVEN", airtime: 46.8, share: 5.91 },
  { channel: "Kantipur Hd Tv", brand: "LG", category: "CONSUMER DURABLES-HOME APPLIANCES", airtime: 41.28, share: 5.21 },
  { channel: "Kantipur Hd Tv", brand: "Citizen Life", category: "FINANCE-INSURANCE", airtime: 37.8, share: 4.77 },
  { channel: "Kantipur Hd Tv", brand: "Lux", category: "PERSONAL CARE -SKINCARE", airtime: 36.6, share: 4.62 },
  { channel: "Kantipur Hd Tv", brand: "Samsung Air Purifier", category: "CONSUMER DURABLES-AIR PURIFIER", airtime: 36.42, share: 4.6 },
  { channel: "Kantipur Hd Tv", brand: "Photex Power", category: "EV CHARGING INFRASTRUCTURE", airtime: 35.4, share: 4.47 },
  { channel: "Kantipur Hd Tv", brand: "Right Path", category: "COACHING -EDUCATION", airtime: 34.14, share: 4.31 },
  { channel: "Kantipur Hd Tv", brand: "Minto", category: "FOOD & BEVERAGE", airtime: 33.18, share: 4.19 },
  { channel: "Kantipur Hd Tv", brand: "Fanta", category: "BEVERAGES", airtime: 29.58, share: 3.74 },
  { channel: "Kantipur Hd Tv", brand: "E sewa", category: "DIGITAL PAYMENT", airtime: 22.26, share: 2.81 },
  { channel: "Kantipur Hd Tv", brand: "Dermi Cool", category: "PERSONAL CARE -HAIRCARE", airtime: 21.18, share: 2.67 },
  
  { channel: "Image Channel", brand: "Minto", category: "FOOD & BEVERAGE", airtime: 52.26, share: 8.4 },
  { channel: "Image Channel", brand: "Asianpaints Apex Floor Guard", category: "BUILDING MATERIALS", airtime: 49.68, share: 7.99 },
  { channel: "Image Channel", brand: "Sprite", category: "BEVERAGES", airtime: 48.48, share: 7.8 },
  { channel: "Image Channel", brand: "OK Soap", category: "CLEANING SUPPLIES", airtime: 42.24, share: 6.79 },
  { channel: "Image Channel", brand: "LG", category: "CONSUMER DURABLES-HOME APPLIANCES", airtime: 42.12, share: 6.77 },
  { channel: "Image Channel", brand: "Fanta", category: "BEVERAGES", airtime: 38.28, share: 6.16 },
  { channel: "Image Channel", brand: "Citizen Life", category: "FINANCE-INSURANCE", airtime: 36.06, share: 5.8 },
  { channel: "Image Channel", brand: "Toffichho Eclairs", category: "FOOD & BEVERAGE", airtime: 34.26, share: 5.51 },
  { channel: "Image Channel", brand: "Samsung Air Purifier", category: "CONSUMER DURABLES-AIR PURIFIER", airtime: 33.9, share: 5.45 },
  { channel: "Image Channel", brand: "E sewa", category: "DIGITAL PAYMENT", airtime: 33, share: 5.31 },
  { channel: "Image Channel", brand: "Dove", category: "PERSONAL CARE -SKINCARE", airtime: 31.44, share: 5.06 },
  { channel: "Image Channel", brand: "Lux", category: "PERSONAL CARE -SKINCARE", airtime: 28.02, share: 4.51 },
  { channel: "Image Channel", brand: "Photex Power", category: "EV CHARGING INFRASTRUCTURE", airtime: 26.94, share: 4.33 },
  { channel: "Image Channel", brand: "Samsung Microwave Oven", category: "CONSUMER DURABLES-OVEN", airtime: 24.9, share: 4 },
  { channel: "Image Channel", brand: "Right Path", category: "COACHING -EDUCATION", airtime: 23.04, share: 3.71 },
  { channel: "Image Channel", brand: "Dermi Cool", category: "PERSONAL CARE -HAIRCARE", airtime: 22.14, share: 3.56 },
  { channel: "Image Channel", brand: "Closeup", category: "PERSONAL CARE -ORAL CARE PRODUCTS", airtime: 20.88, share: 3.36 },
  { channel: "Image Channel", brand: "Dabur Real Fruit Juice", category: "BEVERAGES", airtime: 17.88, share: 2.88 },
  { channel: "Image Channel", brand: "Cinthol", category: "PERSONAL CARE -SKINCARE", airtime: 16.32, share: 2.62 }
];

// Color palette for categories
const colors = {
  "BUILDING MATERIALS": "#E74C3C",
  "PERSONAL CARE -SKINCARE": "#3498DB",
  "BEVERAGES": "#2ECC71",
  "CONSUMER DURABLES-OVEN": "#F39C12",
  "CLEANING SUPPLIES": "#9B59B6",
  "DIGITAL PAYMENT": "#1ABC9C",
  "COACHING -EDUCATION": "#E67E22",
  "FOOD & BEVERAGE": "#34495E",
  "PERSONAL CARE -ORAL CARE PRODUCTS": "#E91E63",
  "FINANCE-INSURANCE": "#00BCD4",
  "CONSUMER DURABLES-HOME APPLIANCES": "#FF9800",
  "EV CHARGING INFRASTRUCTURE": "#607D8B",
  "PERSONAL CARE -HAIRCARE": "#795548",
  "CONSUMER DURABLES-AIR PURIFIER": "#8BC34A",
};

export default function CategoryConcentration() {
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [viewMode, setViewMode] = useState("category");

  // Get unique channels from data
  const channels = useMemo(() => {
    const uniqueChannels = [...new Set(rawData.map(item => item.channel))];
    return [
      { value: "all", label: "All Channels" },
      ...uniqueChannels.map(channel => ({
        value: channel,
        label: channel
      }))
    ];
  }, []);

  // Filter data by selected channel
  const filteredData = useMemo(() => {
    if (selectedChannel === "all") {
      return rawData;
    }
    return rawData.filter(item => item.channel === selectedChannel);
  }, [selectedChannel]);

  // Transform data for treemap
  const treemapData = useMemo(() => {
    try {
      if (!Array.isArray(filteredData) || filteredData.length === 0) {
        return [];
      }

      if (viewMode === "category") {
        // Group by category
        const categoryMap = new Map();
        
        filteredData.forEach(item => {
          if (!item || !item.category || typeof item.airtime !== 'number') return;
          
          const categoryName = item.category;
          if (!categoryMap.has(categoryName)) {
            categoryMap.set(categoryName, {
              name: categoryName.replace(/CONSUMER DURABLES-|PERSONAL CARE -/g, ''),
              size: 0,
              categoryName: categoryName,
              isCategory: true,
              brandCount: 0,
              brands: new Set(),
              share: 0
            });
          }
          
          const category = categoryMap.get(categoryName);
          category.size += item.airtime;
          category.share += item.share;
          category.brands.add(item.brand);
          category.brandCount = category.brands.size;
        });

        return Array.from(categoryMap.values()).sort((a, b) => b.size - a.size);
      } else {
        // Show individual brands
        return filteredData
          .map(item => ({
            name: item.brand,
            channel: item.channel,
            size: item.airtime,
            categoryName: item.category,
            isAdvertiser: true,
            share: item.share,
          }))
          .sort((a, b) => b.size - a.size)
          .slice(0, 20); // Top 20 brands
      }
    } catch (error) {
      console.error('Error transforming treemap data:', error);
      return [];
    }
  }, [filteredData, viewMode]);

  // Calculate total airtime
  const totalAirtime = useMemo(() => {
    if (!Array.isArray(treemapData) || treemapData.length === 0) {
      return 0;
    }
    return treemapData.reduce((sum, item) => {
      return sum + (item && typeof item.size === 'number' ? item.size : 0);
    }, 0);
  }, [treemapData]);

  // Enhanced tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const data = payload[0].payload;
    if (!data) return null;

    return (
      <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl backdrop-blur-sm text-sm max-w-xs">
        <p className="font-bold text-gray-800 mb-2">{data.name || 'Unknown'}</p>
        {data.channel && selectedChannel === "all" && (
          <p className="text-gray-600">Channel: {data.channel}</p>
        )}
        {data.brandCount && (
          <p className="text-gray-600">Brands: {data.brandCount}</p>
        )}
        <p className="text-blue-600 font-semibold">
          Airtime: {typeof data.size === 'number' ? data.size.toFixed(1) : '0'}s
        </p>
        <p className="text-green-600 font-semibold">
          Share: {typeof data.share === 'number' ? data.share.toFixed(1) : '0'}%
        </p>
      </div>
    );
  };

  // Custom content for treemap rectangles
  const CustomizedContent = (props) => {
    if (!props) return null;
    
    const { x, y, width, height, name, categoryName, isCategory } = props;
    
    if (typeof x !== 'number' || typeof y !== 'number' || 
        typeof width !== 'number' || typeof height !== 'number' ||
        width <= 0 || height <= 0) {
      return null;
    }
    
    const fillColor = colors[categoryName] || '#8884d8';
    const shouldRenderText = width > 50 && height > 25;
    
    // Calculate text size based on rectangle size
    const fontSize = Math.min(width / 10, height / 3, 11);
    const maxChars = Math.floor(width / (fontSize * 0.55));
    
    let displayName = name || 'Unknown';
    if (displayName.length > maxChars && maxChars > 3) {
      displayName = displayName.substring(0, maxChars - 3) + '...';
    }

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fillColor,
            stroke: "#fff",
            strokeWidth: 1.5,
            strokeOpacity: 1,
            opacity: isCategory ? 0.9 : 0.75,
          }}
          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        />
        {shouldRenderText && fontSize > 6 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={fontSize}
            fontWeight="600"
            dominantBaseline="middle"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              pointerEvents: 'none'
            }}
          >
            {displayName}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">TV Channel Airtime Analysis</h2>
              <p className="text-gray-600">Category & Brand Distribution by Channel</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          {/* Channel Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Channel:</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {channels.map((channel) => (
                <option key={channel.value} value={channel.value}>
                  {channel.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="category">By Category</option>
              <option value="brand">By Brand (Top 20)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        {Array.isArray(treemapData) && treemapData.length > 0 ? (
          <div style={{ height: 500, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No data available</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different channel or view</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with Statistics */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-800">Channel: </span>
              <span className="text-gray-600">{selectedChannel === "all" ? "All Channels" : selectedChannel}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">View: </span>
              <span className="text-gray-600">{viewMode === 'category' ? 'Categories' : 'Top 20 Brands'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Items: </span>
              <span className="text-gray-600">{treemapData.length}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Total Airtime: </span>
              <span className="text-gray-600">{totalAirtime.toFixed(1)}s</span>
            </div>
          </div>
          
          {/* Category Legend */}
          {viewMode === "category" && Array.isArray(treemapData) && treemapData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-800 mb-3">Categories:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {treemapData.slice(0, 8).map((item, index) => {
                  if (!item || !item.categoryName || !item.name) return null;
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: colors[item.categoryName] || '#8884d8' }}
                      />
                      <span className="text-gray-700 truncate" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}