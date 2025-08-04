"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ExportDialog = ({ selectedDate, epgData, availableData, regions }) => {
  const [open, setOpen] = useState(false);
  const [exportType, setExportType] = useState("report");
  const [date, setDate] = useState(selectedDate);
  const [region, setRegion] = useState("");
  const [station, setStation] = useState("");
  const [fileFormat, setFileFormat] = useState("csv");
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [isDownloading, setIsDownloading] = useState(false);
  const [noDataAlert, setNoDataAlert] = useState(false);
  const { toast } = useToast();

  // Derive reportStations from availableData
  const reportStations = Object.keys(availableData);

  // Get available dates for the selected station in report mode or all stations in EPG mode
  const getAvailableDates = () => {
    if (exportType === "report" && station && availableData[station]) {
      return availableData[station].dates;
    }
    return [
      ...new Set(
        Object.values(availableData).flatMap((station) => station.dates)
      ),
    ].sort();
  };

  // Available stations for EPG export based on selected date
  const availableStations = Object.keys(availableData).filter((station) =>
    availableData[station].dates.includes(date)
  );

  // Get unique regions from epgData for EPG export
  const epgRegions = [...new Set(epgData.map((item) => item.region).filter(Boolean))];

  // Sync date state with selectedDate prop and ensure it's valid
  useEffect(() => {
    setDate(selectedDate);
    // Validate if the selected date is available for the current station
    if (exportType === "report" && station) {
      const validDates = availableData[station]?.dates || [];
      if (!validDates.includes(selectedDate)) {
        // Set to the first available date for the station or clear date
        setDate(validDates[0] || "");
      }
    }
  }, [selectedDate, station, exportType]);

  // Validate data for EPG export
  useEffect(() => {
    if (exportType === "epg") {
      const filteredData = epgData.filter((item) => {
        if (item.date !== date) return false;
        if (station && station !== "all" && item.channel !== station) return false;
        if (region !== "all" && item.region !== region) return false;
        const itemStartTime = item.start;
        const itemEndTime = item.end;
        return (
          (itemStartTime >= startTime && itemStartTime <= endTime) ||
          (itemEndTime >= startTime && itemEndTime <= endTime) ||
          (startTime >= itemStartTime && endTime <= itemEndTime)
        );
      });
      setNoDataAlert(filteredData.length === 0);
    } else {
      setNoDataAlert(false);
    }
  }, [exportType, date, startTime, endTime, station, region, epgData]);

  const handleDownload = async () => {
    if (exportType === "report" && (!region || !station || !date)) {
      toast({
        title: "Selection Required",
        description: "Please select region, station, and date.",
        variant: "destructive",
      });
      return;
    }
    if (exportType === "epg" && (!date || !startTime || !endTime)) {
      toast({
        title: "Selection Required",
        description: "Please select date and time range.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      if (exportType === "report") {
        const formattedDate = new Date(date).toISOString().split("T")[0];
        const fileName = `${station}_${formattedDate}_report.csv`;
        const fileUrl = `https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/${region}/${encodeURIComponent(station)}/${formattedDate}.csv`;

        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("No reports available for this date");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.sandbox = "allow-downloads";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Download Complete",
          description: `Report for ${station} on ${formattedDate} downloaded successfully.`,
        });
      } else {
        const filteredData = epgData.filter((item) => {
          if (item.date !== date) return false;
          if (station && station !== "all" && item.channel !== station) return false;
          if (region !== "all" && item.region !== region) return false;
          const itemStartTime = item.start;
          const itemEndTime = item.end;
          return (
            (itemStartTime >= startTime && itemStartTime <= endTime) ||
            (itemEndTime >= startTime && itemEndTime <= endTime) ||
            (startTime >= itemStartTime && endTime <= itemEndTime)
          );
        });

        if (filteredData.length === 0) {
          setNoDataAlert(true);
          setIsDownloading(false);
          return;
        }

        const exportData = filteredData.map((item) => ({
          Date: item.date,
          Channel: item.channel,
          Region: item.region || "",
          Type: item.type,
          Program: item.program,
          Start: item.start,
          End: item.end,
        }));

        const channelPart = station === "all" || !station ? "all-channels" : station.toLowerCase().replace(/\s+/g, "-");
        const regionPart = region === "all" || !region ? "all-regions" : region.toLowerCase().replace(/\s+/g, "-");
        const fileName = `epg_${date}_${channelPart}_${regionPart}_${startTime.replace(/:/g, "")}_${endTime.replace(/:/g, "")}.${fileFormat}`;

        if (fileFormat === "csv") {
          const csv = Papa.unparse(exportData);
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.sandbox = "allow-downloads";
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } else if (fileFormat === "xlsx") {
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "EPG Data");
          XLSX.writeFile(wb, fileName);
        }

        toast({
          title: "Download Complete",
          description: `File ${fileName} downloaded successfully with ${filteredData.length} records.`,
        });
      }

      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message || "An error occurred while downloading the file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md shadow-sm flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-0">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {exportType === "report" ? "Download Processed Report" : "Export EPG Data"}
            </DialogTitle>
          </DialogHeader>

          {/* {exportType === "epg" && noDataAlert && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg">
              <AlertDescription>
                No data available for the selected date, time range, channel, or region.
              </AlertDescription>
            </Alert>
          )} */}

          <div className="space-y-4">
            {/* Export Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Export Type</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Select export type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Processed Report</SelectItem>
                  <SelectItem value="epg">Raw Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</Label>
              <Select
                value={date}
                onValueChange={setDate}
                disabled={exportType === "report" && !station}
              >
                <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().length > 0 ? (
                    getAvailableDates().map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-dates" disabled>
                      No dates available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {exportType === "report" ? (
              <>
                {/* Region Selection for Report */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Station Selection for Report */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Station</Label>
                  <Select value={station} onValueChange={setStation}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportStations.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                {/* Region Selection for EPG */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {epgRegions.length > 0 ? (
                        epgRegions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-regions" disabled>
                          No regions available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Station Selection for EPG */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Station</Label>
                  <Select value={station} onValueChange={setStation}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                      <SelectValue placeholder="Select station" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stations</SelectItem>
                      {availableStations.length > 0 ? (
                        availableStations.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-stations" disabled>
                          No stations available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range Selection for EPG */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Time Range (24-hour format)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      step="1"
                      className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                      required
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">to</span>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      step="1"
                      className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* File Format Selection for EPG */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">File Format</Label>
                  <Select value={fileFormat} onValueChange={setFileFormat}>
                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg">
                      <SelectValue placeholder="Select file format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 rounded-b-xl">
          <Button
            onClick={handleDownload}
            disabled={
              isDownloading ||
              (exportType === "report" && (!region || !station || !date)) ||
              (exportType === "epg" && (noDataAlert || !date || !startTime || !endTime))
            }
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;