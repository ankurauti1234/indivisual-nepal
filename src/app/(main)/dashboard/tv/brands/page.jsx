import ReportCard from "@/components/card/ReportCard";
import Header from "@/components/navigation/header";
import { tv_brands_reports } from "@/lib/reports";

export default function Adspage() {
  // Filter reports for the brands section
  const brandsReports = tv_brands_reports.filter(
    (report) => report.page === "tv" && report.subpage === "brands"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        title="Brands Reports"
        description="Detailed analytics for TV brands, including performance, trends, and engagement insights."
        badge="latest"
      />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandsReports.map((report) => (
            <ReportCard key={report.id} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
}
