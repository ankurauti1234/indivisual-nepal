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
import { Checkbox } from "@/components/ui/checkbox";
import ChartCard from "@/components/card/charts-card";

// Sample data for new advertisers
const newAdvertisersData = {
  "Week 1": {
    television: [
      { advertiser: "Everest Spices", sector: "Food", adCount: 30, spend: 50000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 25, spend: 45000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 20, spend: 40000 },
    ],
    radio: [
      { advertiser: "Everest Spices", sector: "Food", adCount: 20, spend: 30000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 15, spend: 25000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 10, spend: 20000 },
    ],
    digital: [
      { advertiser: "Everest Spices", sector: "Food", adCount: 40, spend: 60000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 35, spend: 55000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 30, spend: 50000 },
    ],
  },
  "Week 2": {
    television: [
      { advertiser: "Narayani Motors", sector: "Automotive", adCount: 28, spend: 48000 },
      { advertiser: "Surya Nepal", sector: "Retail", adCount: 22, spend: 42000 },
      { advertiser: "Everest Spices", sector: "Food", adCount: 25, spend: 45000 },
    ],
    radio: [
      { advertiser: "Narayani Motors", sector: "Automotive", adCount: 18, spend: 28000 },
      { advertiser: "Surya Nepal", sector: "Retail", adCount: 12, spend: 22000 },
      { advertiser: "Everest Spices", sector: "Food", adCount: 15, spend: 25000 },
    ],
    digital: [
      { advertiser: "Narayani Motors", sector: "Automotive", adCount: 38, spend: 58000 },
      { advertiser: "Surya Nepal", sector: "Retail", adCount: 32, spend: 52000 },
      { advertiser: "Everest Spices", sector: "Food", adCount: 35, spend: 55000 },
    ],
  },
  "Week 3": {
    television: [
      { advertiser: "Nepal Telecom", sector: "Telecommunications", adCount: 35, spend: 60000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 23, spend: 43000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 27, spend: 47000 },
    ],
    radio: [
      { advertiser: "Nepal Telecom", sector: "Telecommunications", adCount: 25, spend: 40000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 13, spend: 23000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 17, spend: 27000 },
    ],
    digital: [
      { advertiser: "Nepal Telecom", sector: "Telecommunications", adCount: 45, spend: 70000 },
      { advertiser: "Yeti Airlines", sector: "Travel", adCount: 33, spend: 53000 },
      { advertiser: "Himalayan Bank", sector: "Finance", adCount: 37, spend: 57000 },
    ],
}
};

// Available weeks and channels
const weeks = ["Week 1", "Week 2", "Week 3"];
const channels = ["television", "radio", "digital"];

export default function NewAdvertisersPanel() {
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);
  const [selectedChannels, setSelectedChannels] = useState(channels);

  // Handle channel selection
  const handleChannelChange = (channel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel]
    );
  };

  // Aggregate data for selected channels
  const getAggregatedData = () => {
    const data = newAdvertisersData[selectedWeek];
    const advertisers = new Set();

    // Collect unique advertisers across selected channels
    selectedChannels.forEach((channel) => {
      data[channel].forEach((item) => advertisers.add(item.advertiser));
    });

    // Aggregate adCount and spend for each advertiser
    return Array.from(advertisers).map((advertiser) => {
      const aggregated = { advertiser, sector: "", adCount: 0, spend: 0 };

      selectedChannels.forEach((channel) => {
        const advertiserData = data[channel].find((item) => item.advertiser === advertiser);
        if (advertiserData) {
          aggregated.sector = advertiserData.sector; // Use sector from first found instance
          aggregated.adCount += advertiserData.adCount;
          aggregated.spend += advertiserData.spend;
        }
      });

      return aggregated;
    }).sort((a, b) => b.spend - a.spend); // Sort by spend descending
  };

  const tableData = getAggregatedData();

  return (
    <ChartCard
      icon={<TableIcon className="w-6 h-6" />}
      title="New Advertisers"
      description="New Advertiser Activity by Week"
      action={
        <div className="flex space-x-2 w-full justify-end items-center">
          <div className="flex space-x-4">
            {channels.map((channel) => (
              <div key={channel} className="flex items-center space-x-1">
                <Checkbox
                  id={channel}
                  checked={selectedChannels.includes(channel)}
                  onCheckedChange={() => handleChannelChange(channel)}
                />
                <label
                  htmlFor={channel}
                  className="text-sm capitalize"
                >
                  {channel}
                </label>
              </div>
            ))}
          </div>
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
        </div>
      }
      chart={
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Advertiser</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Ad Count</TableHead>
                <TableHead>Spend (NPR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.advertiser}>
                  <TableCell>{item.advertiser}</TableCell>
                  <TableCell>{item.sector}</TableCell>
                  <TableCell>{item.adCount}</TableCell>
                  <TableCell>{item.spend.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      }
      footer={
        <p className="text-sm text-gray-500 mt-2">
          Showing new advertisers for {selectedWeek} across {selectedChannels.length} channel{selectedChannels.length !== 1 ? 's' : ''}
        </p>
      }
    />
  );
}