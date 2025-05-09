import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { epgData } from "./epg-data";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DownloadDialog = ({ selectedDate }) => {
  const [fileFormat, setFileFormat] = useState("csv");
  const [date, setDate] = useState(selectedDate || format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [noDataAlert, setNoDataAlert] = useState(false);
  const { toast } = useToast();

  // Get unique channels for the selected date
  const getAvailableChannels = (data, selectedDate) => {
    const filteredPrograms = data.filter((item) => item.date === selectedDate);
    return [...new Set(filteredPrograms.map((item) => item.channel))];
  };
  const availableChannels = getAvailableChannels(epgData, date);

  // Validate time range and check for data availability
  const validateAndCheckData = () => {
    if (!date || !startTime || !endTime) return false;
    
    const filteredData = epgData.filter((item) => {
      if (item.date !== date) return false;
      if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;

      const itemStartTime = item.start;
      const itemEndTime = item.end;

      return (
        (itemStartTime >= startTime && itemStartTime <= endTime) ||
        (itemEndTime >= startTime && itemEndTime <= endTime) ||
        (startTime >= itemStartTime && endTime <= itemEndTime)
      );
    });

    setNoDataAlert(filteredData.length === 0);
    return filteredData.length > 0;
  };

  // Update no-data alert whenever date, time, or channel changes
  useEffect(() => {
    validateAndCheckData();
  }, [date, startTime, endTime, selectedChannel]);

  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      // Filter epgData based on date, time, and channel
      const filteredData = epgData.filter((item) => {
        if (item.date !== date) return false;
        if (selectedChannel !== "all" && item.channel !== selectedChannel) return false;

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

      // Prepare data for export
      const exportData = filteredData.map((item) => ({
        Channel: item.channel,
        Date: item.date,
        Start: item.start,
        End: item.end,
        Type: item.type,
        Program: item.program,
        GIF: item.GIF || "",
      }));

      // Generate file name
      const channelPart = selectedChannel === "all" ? "all-channels" : selectedChannel.toLowerCase().replace(/\s+/g, "-");
      const fileName = `epg_${date}_${channelPart}_${startTime.replace(/:/g, "")}_${endTime.replace(/:/g, "")}.${fileFormat}`;

      if (fileFormat === "csv") {
        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
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

      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message || "An error occurred while generating the file.",
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
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Export EPG Data</DialogTitle>
          </DialogHeader>

          {noDataAlert && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg">
              <AlertDescription>
                No data available for the selected date, time range, or channel.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                required
              />
            </div>

            {/* Channel Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Channel</Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100">
                  <SelectItem value="all">All Channels</SelectItem>
                  {availableChannels.length > 0 ? (
                    availableChannels.map((channel) => (
                      <SelectItem key={channel} value={channel}>
                        {channel}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-channels" disabled>
                      No channels available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Time Range Selection */}
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

            {/* File Format Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">File Format</Label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger className="w-full bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                  <SelectValue placeholder="Select file format" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 rounded-b-xl">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || noDataAlert}
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDialog;