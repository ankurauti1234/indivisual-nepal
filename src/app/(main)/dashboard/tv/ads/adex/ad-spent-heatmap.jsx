import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutTemplate } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

// Function to generate dynamic data
const generateMockData = () => {
  const sectors = [
    "Home Improvement & Decor",
    "Food & Beverages",
    "Media & Entertainment",
    "Financial Services",
    "Telecommunications",
    "Construction Materials",
    "FMCG",
  ];
  const companies = [
    "Asian Paints",
    "Current/Wai Wai/Pepsi",
    "DishHome",
    "Global IME/NIC Asia",
    "Ncell/NTC",
    "Shivam Cement",
    "Unilever",
  ];
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#9B59B6",
    "#E67E22",
    "#2ECC71",
  ];
  const categoryTemplates = {
    "Home Improvement & Decor": [
      "Wall Paints",
      "Wood Finishes",
      "Waterproofing Solutions",
      "Decorative Paints",
      "Industrial Coatings",
    ],
    "Food & Beverages": [
      "Instant Noodles",
      "Ready-to-Eat Snacks",
      "Soft Drinks",
      "Packaged Juices",
      "Energy Drinks",
      "Spices",
      "Frozen Foods",
    ],
    "Media & Entertainment": [
      "DTH Services",
      "HD Channel Packages",
      "Internet Services",
      "VOD Services",
      "IPTV",
    ],
    "Financial Services": [
      "Retail Banking",
      "Corporate Banking",
      "Insurance Services",
      "Digital Payment Solutions",
      "Mobile Banking",
      "Wealth Management",
      "Microfinance",
    ],
    Telecommunications: [
      "Mobile Network Services",
      "Broadband Internet",
      "Value-Added Services",
      "Enterprise Solutions",
      "Prepaid Plans",
      "International Roaming",
    ],
    "Construction Materials": [
      "OPC Cement",
      "PPC Cement",
      "Ready-Mix Concrete",
      "Specialty Cement",
    ],
    FMCG: ["Personal Care", "Home Care", "Packaged Foods", "Oral Care", "Baby Care"],
  };

  return sectors.reduce((acc, sector, index) => {
    const numCategories = Math.floor(Math.random() * 3) + 3; // 3–5 categories
    const categories = categoryTemplates[sector]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCategories)
      .map((name) => ({
        name,
        grp: Math.floor(Math.random() * 50) + 50, // 50–100
        adSpend: Math.floor(Math.random() * 4950000) + 50000, // 50,000–5,000,000
      }));

    acc[sector] = {
      company: companies[index],
      color: colors[index],
      categories,
    };
    return acc;
  }, {});
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

// Spend ranges for the rate filter
const spendRanges = [
  { label: "50K–100K", min: 50000, max: 100000 },
  { label: "100K–500K", min: 100000, max: 500000 },
  { label: "500K–1M", min: 500000, max: 1000000 },
  { label: "1M–2M", min: 1000000, max: 2000000 },
  { label: "2M–5M", min: 2000000, max: 5000000 },
];

const SectorHeatmap = () => {
  const [mockData] = useState(generateMockData());
  const [selectedRate, setSelectedRate] = useState("Ad Spend");
  const [spendRange, setSpendRange] = useState(spendRanges[0].label);

  const selectedRange = spendRanges.find((range) => range.label === spendRange);

  const filteredData = useMemo(() => {
    return Object.keys(mockData).reduce((acc, sector) => {
      const validCategories = mockData[sector].categories.filter(
        (cat) =>
          cat.adSpend >= selectedRange.min && cat.adSpend <= selectedRange.max
      );
      if (validCategories.length > 0) {
        acc[sector] = {
          ...mockData[sector],
          categories: validCategories,
        };
      }
      return acc;
    }, {});
  }, [mockData, selectedRange]);

  const sectorMonthlyData = useMemo(() => {
    return Object.keys(filteredData).reduce((acc, sector) => {
      const baseValue =
        selectedRate === "GRP"
          ? filteredData[sector].categories.reduce(
              (sum, cat) => sum + cat.grp,
              0
            ) / filteredData[sector].categories.length
          : filteredData[sector].categories.reduce(
              (sum, cat) => sum + cat.adSpend,
              0
            ) / 12;
      acc[sector] = generateMonthlyData(baseValue);
      return acc;
    }, {});
  }, [filteredData, selectedRate]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...Object.values(sectorMonthlyData).flatMap((data) =>
        data.map((item) => item.value)
      ),
      1 // Prevent division by zero
    );
  }, [sectorMonthlyData]);

  const getColor = (value) => {
    const intensity = (value / maxValue) * 0.8;
    return `rgb(120, 210, ${Math.floor(255 * (0.2 + intensity))})`;
  };

  return (
    <ChartCard
      icon={<LayoutTemplate className="w-6 h-6" />}
      title="Monthly Performance by Sector"
      action={
        <div className="flex items-center justify-end gap-4">
          <Select value={selectedRate} onValueChange={setSelectedRate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ad Spend">Ad Spend</SelectItem>
              <SelectItem value="GRP">GRP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={spendRange} onValueChange={setSpendRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select spend range" />
            </SelectTrigger>
            <SelectContent>
              {spendRanges.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
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
                      {selectedRate === "Ad Spend"
                        ? `${(item.value / 1000).toFixed(0)}K`
                        : item.value.toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    />
  );
};

const CategoryHeatmap = () => {
  const [mockData] = useState(generateMockData());
  const [selectedSector, setSelectedSector] = useState(Object.keys(mockData)[0]);
  const [selectedRate, setSelectedRate] = useState("Ad Spend");
  const [spendRange, setSpendRange] = useState(spendRanges[0].label);

  const selectedRange = spendRanges.find((range) => range.label === spendRange);

  const categoryData = useMemo(() => {
    const categories = mockData[selectedSector]?.categories.filter(
      (cat) =>
        cat.adSpend >= selectedRange.min && cat.adSpend <= selectedRange.max
    ) || [];
    return categories.reduce((acc, category) => {
      const baseValue =
        selectedRate === "GRP" ? category.grp : category.adSpend / 12;
      acc[category.name] = generateMonthlyData(baseValue);
      return acc;
    }, {});
  }, [mockData, selectedSector, selectedRate, selectedRange]);

  const maxValue = useMemo(() => {
    return Math.max(
      ...Object.values(categoryData).flatMap((data) =>
        data.map((item) => item.value)
      ),
      1 // Prevent division by zero
    );
  }, [categoryData]);

  const getColor = (value) => {
    const intensity = (value / maxValue) * 0.8;
    return `rgb(120, 210, ${Math.floor(255 * (0.2 + intensity))})`;
  };

  return (
    <ChartCard
      icon={<LayoutTemplate className="w-6 h-6" />}
      title="Monthly Performance by Category"
      action={
        <div className="flex items-center justify-end gap-4">
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
          <Select value={selectedRate} onValueChange={setSelectedRate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ad Spend">Ad Spend</SelectItem>
              <SelectItem value="GRP">GRP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={spendRange} onValueChange={setSpendRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select spend range" />
            </SelectTrigger>
            <SelectContent>
              {spendRanges.map((range) => (
                <SelectItem key={range.label} value={range.label}>
                  {range.label}
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
                      {selectedRate === "Ad Spend"
                        ? `${(item.value / 1000).toFixed(0)}K`
                        : item.value.toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
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