"use client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ReportDownloadButton() {
  const handleDownload = () => {
    const url =
      "https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/tv_content_monitoring_report.csv";
    const link = document.createElement("a");
    link.href = url;
    link.download = "tv_content_monitoring_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Report
    </Button>
  );
}

export default ReportDownloadButton;
