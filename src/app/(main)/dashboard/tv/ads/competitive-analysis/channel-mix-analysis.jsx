"use client";

import { TableIcon } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ChartCard from "@/components/card/charts-card";

// Data for top advertisers
const topAdvertisersData = [
  {
    advertiser: "Photex Power",
    sector: "INFRASTRUCTURE",
    "Galaxy 4K": { airtime: 4130, plays: 109 },
    "Image Channel": { airtime: 3309, plays: 87 },
    "Kantipur HD TV": { airtime: 4305, plays: 112 },
    "NTV Nepal": { airtime: 3662, plays: 100 },
    "News 24": { airtime: 3603, plays: 101 },
  },
  {
    advertiser: "Asianpaints",
    sector: "CONSTRUCTION",
    "Galaxy 4K": { airtime: 4138, plays: 105 },
    "Image Channel": { airtime: 3404, plays: 89 },
    "Kantipur HD TV": { airtime: 4355, plays: 111 },
    "NTV Nepal": { airtime: 3621, plays: 96 },
    "News 24": { airtime: 3522, plays: 93 },
  },
  {
    advertiser: "Lux",
    sector: "PERSONAL CARE",
    "Galaxy 4K": { airtime: 3966, plays: 103 },
    "Image Channel": { airtime: 4036, plays: 105 },
    "Kantipur HD TV": { airtime: 3997, plays: 108 },
    "NTV Nepal": { airtime: 3048, plays: 80 },
    "News 24": { airtime: 3074, plays: 80 },
  },
  {
    advertiser: "Right Path",
    sector: "EDUCATION",
    "Galaxy 4K": { airtime: 3832, plays: 102 },
    "Image Channel": { airtime: 3748, plays: 98 },
    "Kantipur HD TV": { airtime: 3220, plays: 91 },
    "NTV Nepal": { airtime: 3391, plays: 92 },
    "News 24": { airtime: 3501, plays: 92 },
  },
  {
    advertiser: "Sprite",
    sector: "FMCG",
    "Galaxy 4K": { airtime: 3754, plays: 101 },
    "Image Channel": { airtime: 3525, plays: 95 },
    "Kantipur HD TV": { airtime: 3885, plays: 101 },
    "NTV Nepal": { airtime: 4226, plays: 108 },
    "News 24": { airtime: 3358, plays: 93 },
  },
  {
    advertiser: "Microwave Oven",
    sector: "CONSUMER DURABLES",
    "Galaxy 4K": { airtime: 3669, plays: 100 },
    "Image Channel": { airtime: 3250, plays: 91 },
    "Kantipur HD TV": { airtime: 2916, plays: 80 },
    "NTV Nepal": { airtime: 3592, plays: 94 },
    "News 24": { airtime: 4352, plays: 116 },
  },
  {
    advertiser: "Dove",
    sector: "PERSONAL CARE",
    "Galaxy 4K": { airtime: 3421, plays: 93 },
    "Image Channel": { airtime: 3780, plays: 104 },
    "Kantipur HD TV": { airtime: 4219, plays: 109 },
    "NTV Nepal": { airtime: 3731, plays: 95 },
    "News 24": { airtime: 3294, plays: 90 },
  },
  {
    advertiser: "Dabur",
    sector: "FMCG",
    "Galaxy 4K": { airtime: 3682, plays: 92 },
    "Image Channel": { airtime: 3923, plays: 103 },
    "Kantipur HD TV": { airtime: 3249, plays: 87 },
    "NTV Nepal": { airtime: 3416, plays: 95 },
    "News 24": { airtime: 3577, plays: 91 },
  },
  {
    advertiser: "Minto",
    sector: "FMCG",
    "Galaxy 4K": { airtime: 3546, plays: 92 },
    "Image Channel": { airtime: 3370, plays: 91 },
    "Kantipur HD TV": { airtime: 3912, plays: 106 },
    "NTV Nepal": { airtime: 4072, plays: 114 },
    "News 24": { airtime: 4003, plays: 104 },
  },
  {
    advertiser: "Citizen Life",
    sector: "FINANCE",
    "Galaxy 4K": { airtime: 3398, plays: 91 },
    "Image Channel": { airtime: 3163, plays: 91 },
    "Kantipur HD TV": { airtime: 3772, plays: 103 },
    "NTV Nepal": { airtime: 4145, plays: 104 },
    "News 24": { airtime: 4152, plays: 108 },
  },
  {
    advertiser: "OK laundry soap",
    sector: "HOUSEHOLD PRODUCTS",
    "Galaxy 4K": { airtime: 3291, plays: 89 },
    "Image Channel": { airtime: 3391, plays: 89 },
    "Kantipur HD TV": { airtime: 4071, plays: 108 },
    "NTV Nepal": { airtime: 3520, plays: 94 },
    "News 24": { airtime: 3749, plays: 94 },
  },
  {
    advertiser: "LG",
    sector: "CONSUMER DURABLES",
    "Galaxy 4K": { airtime: 3326, plays: 88 },
    "Image Channel": { airtime: 3436, plays: 95 },
    "Kantipur HD TV": { airtime: 3045, plays: 77 },
    "NTV Nepal": { airtime: 3339, plays: 92 },
    "News 24": { airtime: 3612, plays: 97 },
  },
  {
    advertiser: "Closeup",
    sector: "PERSONAL CARE",
    "Galaxy 4K": { airtime: 3146, plays: 87 },
    "Image Channel": { airtime: 3540, plays: 86 },
    "Kantipur HD TV": { airtime: 4137, plays: 103 },
    "NTV Nepal": { airtime: 4135, plays: 106 },
    "News 24": { airtime: 3668, plays: 96 },
  },
  {
    advertiser: "Air Purifier",
    sector: "CONSUMER DURABLES",
    "Galaxy 4K": { airtime: 3139, plays: 86 },
    "Image Channel": { airtime: 3169, plays: 90 },
    "Kantipur HD TV": { airtime: 3729, plays: 101 },
    "NTV Nepal": { airtime: 3129, plays: 85 },
    "News 24": { airtime: 3720, plays: 96 },
  },
  {
    advertiser: "Dermi cool",
    sector: "PERSONAL CARE",
    "Galaxy 4K": { airtime: 3286, plays: 86 },
    "Image Channel": { airtime: 4020, plays: 110 },
    "Kantipur HD TV": { airtime: 3459, plays: 99 },
    "NTV Nepal": { airtime: 3275, plays: 89 },
    "News 24": { airtime: 3111, plays: 83 },
  },
  {
    advertiser: "E Sewa",
    sector: "FINANCE",
    "Galaxy 4K": { airtime: 3305, plays: 83 },
    "Image Channel": { airtime: 3286, plays: 89 },
    "Kantipur HD TV": { airtime: 3089, plays: 88 },
    "NTV Nepal": { airtime: 2947, plays: 77 },
    "News 24": { airtime: 2985, plays: 81 },
  },
  {
    advertiser: "Toffichoo",
    sector: "FMCG",
    "Galaxy 4K": { airtime: 3186, plays: 79 },
    "Image Channel": { airtime: 3483, plays: 94 },
    "Kantipur HD TV": { airtime: 3656, plays: 98 },
    "NTV Nepal": { airtime: 3490, plays: 92 },
    "News 24": { airtime: 3505, plays: 98 },
  },
  {
    advertiser: "Fanta",
    sector: "FMCG",
    "Galaxy 4K": { airtime: 2921, plays: 78 },
    "Image Channel": { airtime: 3200, plays: 84 },
    "Kantipur HD TV": { airtime: 3736, plays: 103 },
    "NTV Nepal": { airtime: 3538, plays: 94 },
    "News 24": { airtime: 3768, plays: 97 },
  },
  {
    advertiser: "cinthol",
    sector: "PERSONAL CARE",
    "Galaxy 4K": { airtime: 2821, plays: 76 },
    "Image Channel": { airtime: 3343, plays: 88 },
    "Kantipur HD TV": { airtime: 4017, plays: 108 },
    "NTV Nepal": { airtime: 3733, plays: 100 },
    "News 24": { airtime: 3726, plays: 102 },
  },
];

// Available filters
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const sectors = [
  "All",
  "INFRASTRUCTURE",
  "CONSTRUCTION",
  "PERSONAL CARE",
  "EDUCATION",
  "FMCG",
  "CONSUMER DURABLES",
  "FINANCE",
  "HOUSEHOLD PRODUCTS",
];
const advertisers = ["All", ...topAdvertisersData.map((data) => data.advertiser)];

export default function TopAdvertisersPanel() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
  const [dataType, setDataType] = useState("airtime"); // airtime or plays
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data based on selections
  const filteredData = topAdvertisersData.filter((item) => {
    const sectorMatch = selectedSector === "All" || item.sector === selectedSector;
    const advertiserMatch = selectedAdvertiser === "All" || item.advertiser === selectedAdvertiser;
    return sectorMatch && advertiserMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <ChartCard
      icon={<TableIcon className="w-7 h-7 text-blue-500" />}
      title="Top Advertisers"
      description="Advertising Metrics by Channel for Top Nepal TV Channels"
      action={
        <div className="flex space-x-2 w-full justify-end">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-24 bg-white border-gray-200">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week) => (
                <SelectItem key={week} value={week}>
                  {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-36 bg-white border-gray-200">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedAdvertiser} onValueChange={setSelectedAdvertiser}>
            <SelectTrigger className="w-36 bg-white border-gray-200">
              <SelectValue placeholder="Select advertiser" />
            </SelectTrigger>
            <SelectContent>
              {advertisers.map((advertiser) => (
                <SelectItem key={advertiser} value={advertiser}>
                  {advertiser}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-24 bg-white border-gray-200">
              <SelectValue placeholder="Data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="airtime">Airtime (s)</SelectItem>
              <SelectItem value="plays">Plays</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
      chart={
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Advertiser</TableHead>
                <TableHead className="font-semibold text-gray-700">Sector</TableHead>
                <TableHead className="font-semibold text-gray-700">Galaxy 4K</TableHead>
                <TableHead className="font-semibold text-gray-700">Image Channel</TableHead>
                <TableHead className="font-semibold text-gray-700">Kantipur HD TV</TableHead>
                <TableHead className="font-semibold text-gray-700">NTV Nepal</TableHead>
                <TableHead className="font-semibold text-gray-700">News 24</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.advertiser} className="hover:bg-gray-100">
                  <TableCell className="text-gray-800">{item.advertiser}</TableCell>
                  <TableCell className="text-gray-600">{item.sector}</TableCell>
                  <TableCell>{item["Galaxy 4K"][dataType].toFixed(2)}</TableCell>
                  <TableCell>{item["Image Channel"][dataType].toFixed(2)}</TableCell>
                  <TableCell>{item["Kantipur HD TV"][dataType].toFixed(2)}</TableCell>
                  <TableCell>{item["NTV Nepal"][dataType].toFixed(2)}</TableCell>
                  <TableCell>{item["News 24"][dataType].toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              className="bg-white border-gray-200 hover:bg-gray-100"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              className="bg-white border-gray-200 hover:bg-gray-100"
            >
              Next
            </Button>
          </div>
        </div>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Showing {dataType} for {selectedSector} sector, {selectedAdvertiser} advertiser in {selectedWeek}
        </p>
      }
    />
  );
}