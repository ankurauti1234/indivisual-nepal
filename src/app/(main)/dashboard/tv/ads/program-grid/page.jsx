"use client";
import React, { Suspense, useState } from "react";
import EPG from "@/components/program-grid/EPG";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CustomRadioGroup({ value, onValueChange, options }) {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={() => onValueChange(option.value)}
            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor={option.value}>{option.label}</Label>
        </div>
      ))}
    </div>
  );
}

function CustomMultiSelect({ selectedValues, onValueChange, options }) {
  const handleChange = (value) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter((v) => v !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2 py-1">
            <input
              type="checkbox"
              id={option.value}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramGridContent() {
  const DEVICE_IDS = ["R-1001", "R-1004", "R-1006", "R-1007"];
  const CHANNEL_ALIASES = {
    "R-1001": "Himalaya TV",
    "R-1004": "Nepal TV",
    "R-1006": "Avenues TV",
    "R-1007": "Kantipur TV",
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_LINEAR_URL;

  const [reportType, setReportType] = useState("daily");
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");

  const radioOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
  ];

  const dateOptions = [
    { value: "11-08-2025", label: "11 Aug 2025" },
    { value: "12-08-2025", label: "12 Aug 2025" },
    { value: "13-08-2025", label: "13 Aug 2025" },
    { value: "14-08-2025", label: "14 Aug 2025" },
    { value: "15-08-2025", label: "15 Aug 2025" },
    { value: "16-08-2025", label: "16 Aug 2025" },
    { value: "17-08-2025", label: "17 Aug 2025" },
  ];

  const weekOptions = [
    { value: "11-aug-17-aug", label: "11 Aug - 17 Aug 2025" },
    // Add more week options if needed
  ];

  const handleDownload = () => {
    if (reportType === "daily" && selectedDates.length > 0) {
      selectedDates.forEach((date) => {
        const url = `https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/daily/${date}.csv`;
        const link = document.createElement("a");
        link.href = url;
        link.download = `HOR-report-${date}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    } else if (reportType === "weekly" && selectedWeek) {
      const url = `https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/${selectedWeek}/raw-linear-report.csv`;
      const link = document.createElement("a");
      link.href = url;
      link.download = `HOR-report-${selectedWeek}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="transition-colors">
            Export Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Export viewing reports for selected dates or weeks. Choose "Daily"
              to download reports for specific dates or "Weekly" for a
              consolidated weekly report. Select multiple dates for daily
              reports if needed.
            </p>
            <CustomRadioGroup
              value={reportType}
              onValueChange={setReportType}
              options={radioOptions}
            />

            {reportType === "daily" ? (
              <CustomMultiSelect
                selectedValues={selectedDates}
                onValueChange={setSelectedDates}
                options={dateOptions}
              />
            ) : (
              <Select
                onValueChange={setSelectedWeek}
                defaultValue={selectedWeek}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                  {weekOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleDownload}
              disabled={
                (reportType === "daily" && selectedDates.length === 0) ||
                (reportType === "weekly" && !selectedWeek)
              }
              className="w-full"
            >
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EPG
        region="india"
        DEVICE_IDS={DEVICE_IDS}
        CHANNEL_ALIASES={CHANNEL_ALIASES}
        baseUrl={baseUrl}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 dark:border-indigo-400"></div>
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-100">
              Loading EPG Data...
            </p>
          </div>
        </div>
      }
    >
      <ProgramGridContent />
    </Suspense>
  );
}
