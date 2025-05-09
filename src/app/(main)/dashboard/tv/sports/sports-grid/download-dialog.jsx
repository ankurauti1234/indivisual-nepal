import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import Papa from "papaparse"; // For CSV generation
import * as XLSX from "xlsx"; // For XLSX generation
import { epgData } from "./epg-data";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DownloadDialog = ({ selectedDate }) => {
  const [fileFormat, setFileFormat] = useState("csv");
  const [date, setDate] = useState(selectedDate || format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [noDataAlert, setNoDataAlert] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    setIsDownloading(true);
    setNoDataAlert(false);
    
    try {
      // Filter epgData based on date/time 
      const filteredData = epgData.filter((item) => {
        // Match the date
        if (item.date !== date) return false;
        
        // Parse times for comparison
        const itemStartTime = item.start;
        const itemEndTime = item.end;
        
        // Include if times overlap with selected range
        return (
          itemStartTime >= startTime && itemStartTime <= endTime ||
          itemEndTime >= startTime && itemEndTime <= endTime ||
          startTime >= itemStartTime && endTime <= itemEndTime
        );
      });

      // Check if we have data to export
      if (filteredData.length === 0) {
        setNoDataAlert(true);
        setIsDownloading(false);
        return;
      }

      // Prepare data for export - convert to flat structure
      const exportData = filteredData.map((item) => ({
        Channel: item.channel,
        Date: item.date,
        Start: item.start,
        End: item.end,
        Type: item.type,
        Program: item.program,
        GIF: item.GIF || ""
      }));

      // Generate file name
      const fileName = `epg_${date}_${startTime.replace(/:/g, "")}_${endTime.replace(/:/g, "")}.${fileFormat}`;

      if (fileFormat === "csv") {
        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); // Needed for Firefox
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
      
      // Keep dialog open for a moment so user can see success message
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
        <Button className="bg-popover text-foreground hover:bg-muted rounded-md shadow-sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md bg-popover text-foreground rounded-md border border-muted shadow-sm p-0">
        <div className="p-4 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-foreground">Export EPG Data</DialogTitle>
          </DialogHeader>
          
          {noDataAlert && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
              <AlertDescription>
                No data available for the selected date and time range
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {/* Date Selection with standard date input */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-popover border-muted text-foreground rounded-md"
              />
            </div>

            {/* Time Range Selection with seconds */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Time Range (24-hour format)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  step="1" // Enable seconds selection
                  className="bg-popover border-muted text-foreground rounded-md text-xs"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  step="1" // Enable seconds selection
                  className="bg-popover border-muted text-foreground rounded-md text-xs"
                />
              </div>
            </div>

            {/* File Format Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">File Format</Label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger className="w-full bg-popover border-muted text-foreground text-xs">
                  <SelectValue placeholder="Select file format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 bg-muted/50 border-t border-muted">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full rounded-md bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
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