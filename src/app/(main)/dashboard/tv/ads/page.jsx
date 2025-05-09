import ReportCard from "@/components/card/ReportCard";
import Header from "@/components/navigation/header";
import { tv_ads_reports } from "@/lib/reports";

export default function Adspage() {
  // Filter reports for the ads section
  const adsReports = tv_ads_reports.filter(
    (report) => report.page === "tv" && report.subpage === "ads"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        title="Ads Reports"
        description="Detailed analytics for TV ads, including performance, trends, and engagement insights."
        badge="latest"
      />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adsReports.map((report) => (
            <ReportCard key={report.id} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
}
