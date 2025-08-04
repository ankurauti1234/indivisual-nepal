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

// Sample data for top advertisers
const topAdvertisersData = [
  {
    advertiser: "Shivam Cement",
    sector: "Construction",
    "Nepal Television": { airtime: 1200, plays: 45 },
    "Kantipur TV": { airtime: 900, plays: 35 },
    "Avenues TV": { airtime: 600, plays: 25 },
  },
  {
    advertiser: "N Cell",
    sector: "Telecommunications",
    "Nepal Television": { airtime: 1000, plays: 40 },
    "Kantipur TV": { airtime: 800, plays: 30 },
    "Avenues TV": { airtime: 500, plays: 20 },
  },
  {
    advertiser: "Asian Paints",
    sector: "Manufacturing",
    "Nepal Television": { airtime: 800, plays: 30 },
    "Kantipur TV": { airtime: 700, plays: 25 },
    "Avenues TV": { airtime: 400, plays: 15 },
  },
  {
    advertiser: "Nike",
    sector: "Retail",
    "Nepal Television": { airtime: 1100, plays: 42 },
    "Kantipur TV": { airtime: 850, plays: 32 },
    "Avenues TV": { airtime: 550, plays: 22 },
  },
  {
    advertiser: "Others",
    sector: "Miscellaneous",
    "Nepal Television": { airtime: 950, plays: 38 },
    "Kantipur TV": { airtime: 750, plays: 28 },
    "Avenues TV": { airtime: 450, plays: 18 },
  },
];

// Available filters
const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
const sectors = ["All", "Construction", "Telecommunications", "Manufacturing", "Retail", "Miscellaneous"];
const advertisers = ["All", ...topAdvertisersData.map((data) => data.advertiser)];

export default function TopAdvertisersPanel() {
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("All");
  const [dataType, setDataType] = useState("airtime"); // airtime or plays
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
      icon={<TableIcon className="w-6 h-6" />}
      title="Top Advertisers"
      description="Advertising Metrics by Channel for Top Nepal TV Channels"
      action={
        <div className="flex space-x-2 w-full justify-end">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-24">
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
            <SelectTrigger className="w-36">
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
            <SelectTrigger className="w-36">
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
            <SelectTrigger className="w-24">
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
              <TableRow>
                <TableHead>Advertiser</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Nepal Television</TableHead>
                <TableHead>Kantipur TV</TableHead>
                <TableHead>Avenues TV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.advertiser}>
                  <TableCell>{item.advertiser}</TableCell>
                  <TableCell>{item.sector}</TableCell>
                  <TableCell>{item["Nepal Television"][dataType]}</TableCell>
                  <TableCell>{item["Kantipur TV"][dataType]}</TableCell>
                  <TableCell>{item["Avenues TV"][dataType]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
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