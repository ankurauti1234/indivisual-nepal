import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, X, ChevronLeft, ChevronRight, Table2 } from "lucide-react";
import ChartCard from "@/components/card/charts-card";

const ITEMS_PER_PAGE = 10;

const DataTable = ({ data }) => {
  const [filters, setFilters] = useState({
    Sector: "",
    Category: "",
    Advertiser: "",
    Region: "",
    "Ad Spend": [0, 50000],
    GRP: [0, 1000],
    "GRP %": [0, 10],
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Get filtered options based on current selections
  const getFilteredOptions = (field) => {
    let filteredData = [...data];

    Object.entries(filters).forEach(([key, value]) => {
      if (key === field) return;
      if (key === "Ad Spend" || key === "GRP" || key === "GRP %") {
        filteredData = filteredData.filter(
          (item) => item[key] >= value[0] && item[key] <= value[1]
        );
      } else if (value) {
        filteredData = filteredData.filter(
          (item) => item[key].toString().toLowerCase() === value.toLowerCase()
        );
      }
    });

    return [...new Set(filteredData.map((item) => item[field]))];
  };

  // Filter data based on all active filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "Ad Spend" || key === "GRP" || key === "GRP %") {
          return item[key] >= value[0] && item[key] <= value[1];
        }
        return item[key].toString().toLowerCase() === value.toLowerCase();
      });
    });
  }, [data, filters]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd = pageStart + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(pageStart, pageEnd);

  const handleFilterChange = (field, value) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "Sector" && {
        Category: "",
        Advertiser: "",
      }),
      ...(field === "Category" && {
        Advertiser: "",
      }),
    }));
  };

  const clearFilter = (field) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]:
        field === "Ad Spend"
          ? [0, 50000]
          : field === "GRP"
          ? [0, 1000]
          : field === "GRP %"
          ? [0, 10]
          : "",
      ...(field === "Sector" && {
        Category: "",
        Advertiser: "",
      }),
      ...(field === "Category" && {
        Advertiser: "",
      }),
    }));
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setFilters({
      Sector: "",
      Category: "",
      Advertiser: "",
      Region: "",
      "Ad Spend": [0, 50000],
      GRP: [0, 1000],
      "GRP %": [0, 10],
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const renderFilter = (field) => {
    if (field === "Ad Spend" || field === "GRP" || field === "GRP %") {
      const max = field === "Ad Spend" ? 50000 : field === "GRP" ? 1000 : 10;
      const step = field === "Ad Spend" ? 1000 : field === "GRP" ? 10 : 1;
      return (
        <div className="space-y-4 p-4">
          <div className="flex justify-between">
            <span>
              {formatNumber(filters[field][0])}
              {field === "GRP %" ? "%" : ""}
            </span>
            <span>
              {formatNumber(filters[field][1])}
              {field === "GRP %" ? "%" : ""}
            </span>
          </div>
          <Slider
            defaultValue={[0, max]}
            max={max}
            step={step}
            value={filters[field]}
            onValueChange={(value) => handleFilterChange(field, value)}
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="p-2">
          <Input
            placeholder={`Search ${field}...`}
            value={filters[field]}
            onChange={(e) => handleFilterChange(field, e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {getFilteredOptions(field).map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleFilterChange(field, value.toString())}
              className="cursor-pointer"
            >
              {value}
            </DropdownMenuItem>
          ))}
        </div>
      </div>
    );
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between border-t px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{pageStart + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pageEnd, filteredData.length)}
            </span>{" "}
            of <span className="font-medium">{filteredData.length}</span>{" "}
            results
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (

    <ChartCard
      icon={<Table2 className="w-6 h-6" />}
      title="Ads GRP Catogorized Data"
      // description="Most performing channels this year"
      action={
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </Button>
        </div>
      }
      chart={
        <div className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2  border-2 rounded-lg bg-muted/20">
          {Object.keys(filters).map((field) => (
            <div key={field} className="w-full">
              <div className="flex items-center gap-2 group">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-background border-border/40 hover:bg-accent/5 group-hover:border-border transition-colors"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">
                          {field}
                        </span>
                        <span className="text-sm truncate">
                          {filters[field]
                            ? Array.isArray(filters[field])
                              ? `${formatNumber(filters[field][0])}${
                                  field === "GRP %" ? "%" : ""
                                } - ${formatNumber(filters[field][1])}${
                                  field === "GRP %" ? "%" : ""
                                }`
                              : filters[field]
                            : "All"}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[280px] p-2" align="start">
                    {renderFilter(field)}
                  </DropdownMenuContent>
                </DropdownMenu>
                {filters[field] && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter(field)}
                    className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
          
            {/* Table Section */}
      <div className="rounded-xl border border-gray-500/25 overflow-hidden bg-card shadow-inner">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {Object.keys(filters).map((header) => (
                <TableHead
                  key={header}
                  className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/30 transition-colors"
              >
                {Object.keys(filters).map((field) => (
                  <TableCell key={field} className="py-4 text-sm">
                    {typeof row[field] === "number"
                      ? `${formatNumber(row[field])}${
                          field === "GRP %" ? "%" : ""
                        }`
                      : row[field]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{pageStart + 1}</span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {Math.min(pageEnd, filteredData.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {filteredData.length}
          </span>{" "}
          results
        </p>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:bg-accent/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 ${
                    currentPage === pageNum
                      ? "bg-accent/30 hover:bg-accent/40"
                      : "hover:bg-accent/5"
                  }`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="hover:bg-accent/5"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
        </div>
      }
      // footer={
      //   renderLegend()
      // }
    />
  );
};

export default DataTable;
