import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

const mockData = {
  "Home Improvement & Decor": {
    company: "Asian Paints",
    color: "#FF6B6B",
    categories: [
      { name: "Wall Paints", grp: 85, adSpend: 1200000 },
      { name: "Wood Finishes", grp: 72, adSpend: 800000 },
      { name: "Waterproofing Solutions", grp: 65, adSpend: 600000 },
      { name: "Decorative Paints", grp: 78, adSpend: 900000 },
      { name: "Industrial Coatings", grp: 70, adSpend: 750000 },
    ],
  },
  "Food & Beverages": {
    company: "Current/Wai Wai/Pepsi",
    color: "#4ECDC4",
    categories: [
      { name: "Instant Noodles", grp: 92, adSpend: 1500000 },
      { name: "Ready-to-Eat Snacks", grp: 88, adSpend: 1300000 },
      { name: "Soft Drinks", grp: 95, adSpend: 2000000 },
      { name: "Packaged Juices", grp: 82, adSpend: 900000 },
      { name: "Energy Drinks", grp: 78, adSpend: 800000 },
      { name: "Spices", grp: 70, adSpend: 600000 },
      { name: "Frozen Foods", grp: 65, adSpend: 750000 },
    ],
  },
  "Media & Entertainment": {
    company: "DishHome",
    color: "#45B7D1",
    categories: [
      { name: "DTH Services", grp: 75, adSpend: 1100000 },
      { name: "HD Channel Packages", grp: 70, adSpend: 900000 },
      { name: "Internet Services", grp: 80, adSpend: 1300000 },
      { name: "VOD Services", grp: 85, adSpend: 1500000 },
      { name: "IPTV", grp: 72, adSpend: 1000000 },
    ],
  },
  "Financial Services": {
    company: "Global IME/NIC Asia",
    color: "#96CEB4",
    categories: [
      { name: "Retail Banking", grp: 68, adSpend: 2000000 },
      { name: "Corporate Banking", grp: 55, adSpend: 1500000 },
      { name: "Insurance Services", grp: 62, adSpend: 1800000 },
      { name: "Digital Payment Solutions", grp: 75, adSpend: 2200000 },
      { name: "Mobile Banking", grp: 82, adSpend: 2500000 },
      { name: "Wealth Management", grp: 58, adSpend: 1200000 },
      { name: "Microfinance", grp: 72, adSpend: 900000 },
    ],
  },
  Telecommunications: {
    company: "Ncell/NTC",
    color: "#9B59B6",
    categories: [
      { name: "Mobile Network Services", grp: 88, adSpend: 3000000 },
      { name: "Broadband Internet", grp: 82, adSpend: 2500000 },
      { name: "Value-Added Services", grp: 75, adSpend: 1800000 },
      { name: "Enterprise Solutions", grp: 70, adSpend: 1500000 },
      { name: "Prepaid Plans", grp: 85, adSpend: 2800000 },
      { name: "International Roaming", grp: 65, adSpend: 1200000 },
    ],
  },
  "Construction Materials": {
    company: "Shivam Cement",
    color: "#E67E22",
    categories: [
      { name: "OPC Cement", grp: 78, adSpend: 1800000 },
      { name: "PPC Cement", grp: 72, adSpend: 1500000 },
      { name: "Ready-Mix Concrete", grp: 65, adSpend: 1200000 },
      { name: "Specialty Cement", grp: 60, adSpend: 900000 },
    ],
  },
  FMCG: {
    company: "Unilever",
    color: "#2ECC71",
    categories: [
      { name: "Personal Care", grp: 90, adSpend: 2800000 },
      { name: "Home Care", grp: 85, adSpend: 2500000 },
      { name: "Packaged Foods", grp: 82, adSpend: 2200000 },
      { name: "Oral Care", grp: 78, adSpend: 1900000 },
      { name: "Baby Care", grp: 75, adSpend: 1600000 },
    ],
  },
};

// Helper function to generate monthly data
const generateMonthlyData = (baseValue) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    month,
    value: baseValue * (0.5 + Math.random()),
  }));
};

// Generate sector monthly data
const sectorMonthlyData = Object.keys(mockData).reduce((acc, sector) => {
  acc[sector] = generateMonthlyData(
    mockData[sector].categories.reduce((sum, cat) => sum + cat.adSpend, 0) / 12
  );
  return acc;
}, {});

const SectorHeatmap = () => {
  const maxValue = useMemo(() => {
    return Math.max(
      ...Object.values(sectorMonthlyData).flatMap((data) =>
        data.map((item) => item.value)
      )
    );
  }, []);

  const getColor = (value) => {
    const intensity = (value / maxValue) * 0.8; // Max 80% intensity to keep colors visible
    return `rgb(120, 210, ${Math.floor(255 * (0.2 + intensity))})`;
  };

  return (
    <ChartCard
      icon={<LayoutTemplate className="w-6 h-6" />}
      title="Monthly Ad Spend by Sector"
      // description="Most performing channels this year"
      // action={
        
      // }
      chart={
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border">Sector</th>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <th key={month} className="p-2 border text-center">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(sectorMonthlyData).map(([sector, data]) => (
                <tr key={sector}>
                  <td className="p-2 border font-medium">{sector}</td>
                  {data.map((item, idx) => (
                    <td
                      key={idx}
                      className="p-2 border text-center"
                      style={{
                        backgroundColor: getColor(item.value),
                        color: item.value > maxValue * 0.5 ? "white" : "black",
                      }}
                    >
                      {(item.value / 1000).toFixed(0)}K
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      // footer={
      //   renderLegend()
      // }
    />
  );
};

const CategoryHeatmap = () => {
  const [selectedSector, setSelectedSector] = useState(
    Object.keys(mockData)[0]
  );

  const categoryData = useMemo(() => {
    return mockData[selectedSector].categories.reduce((acc, category) => {
      acc[category.name] = generateMonthlyData(category.adSpend / 12);
      return acc;
    }, {});
  }, [selectedSector]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...Object.values(categoryData).flatMap((data) =>
        data.map((item) => item.value)
      )
    );
  }, [categoryData]);

  const getColor = (value) => {
    const intensity = (value / maxValue) * 0.8;
return `rgb(120, 210, ${Math.floor(255 * (0.2 + intensity))})`;
  };

  return (
    <ChartCard
      icon={<LayoutTemplate className="w-6 h-6" />}
      title="Monthly Ad Spend by Category"
      // description="Most performing channels this year"
      action={
        <div className="flex itc justify-end">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(mockData).map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-2 border">Category</th>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <th key={month} className="p-2 border text-center">
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryData).map(([category, data]) => (
                <tr key={category}>
                  <td className="p-2 border font-medium">{category}</td>
                  {data.map((item, idx) => (
                    <td
                      key={idx}
                      className="p-2 border text-center"
                      style={{
                        backgroundColor: getColor(item.value),
                        color: item.value > maxValue * 0.5 ? "white" : "black",
                      }}
                    >
                      {(item.value / 1000).toFixed(0)}K
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      // footer={
      //   renderLegend()
      // }
    />
  );
};

const AdSpendDashboard = () => {
  return (
    <div className="p-4 space-y-8">
      <SectorHeatmap />
      <CategoryHeatmap />
    </div>
  );
};

export default AdSpendDashboard;
