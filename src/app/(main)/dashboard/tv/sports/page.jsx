import React from "react";
import { FileBarChart, AlertCircle } from "lucide-react";
import ReportCard from "@/components/card/ReportCard";
import { tv_sports_reports } from "@/lib/reports";
import { Card } from "@/components/ui/card";
import Header from "@/components/navigation/header";

const SportsPage = () => {
  const broadcastersReports = tv_sports_reports.filter(
    (report) => report.page === "tv" && report.subpage === "sports"
  );

  const NoReportsMessage = () => (
    <Card className="p-8 text-center">
      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No reports available</h3>
      <p className="text-sm text-muted-foreground">
        Analytics reports are currently being processed
      </p>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <Header
        title="Sports Reports"
        description="Detailed analytics for Sports, including performance, trends, and engagement insights."
        badge="latest"
      />

      {/* Reports Section */}
      <div className="p-4">
        {broadcastersReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {broadcastersReports.map((report) => (
              <div key={report.id} className="h-full">
                <ReportCard {...report} />
              </div>
            ))}
          </div>
        ) : (
          <NoReportsMessage />
        )}
      </div>
    </div>
  );
};

export default SportsPage;
