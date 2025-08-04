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
    Industry: [],
    Category: [],
    Advertiser: [],
    "Ad Spend": [0, 5000000],
    GRP: [0, 100],
    "GRP %": [0, 1],
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Get filtered options based on current selections
  const getFilteredOptions = (field) => {
    let filteredData = [...data];

    Object.entries(filters).forEach(([key, value]) => {
      if (key === field) return;
      if (key === "Ad Spend" || key === "GRP" || key === "GRP %") {
        filteredData = filteredData.filter(
          (item) => item[key === "Industry" ? "Sector" : key] >= value[0] && item[key === "Industry" ? "Sector" : key] <= value[1]
        );
      } else if (value && value.length > 0) {
        filteredData = filteredData.filter(
          (item) => value.includes(item[key === "Industry" ? "Sector" : key])
        );
      }
    });

    return [...new Set(filteredData.map((item) => item[field === "Industry" ? "Sector" : field]))];
  };

  // Filter data based on all active filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true;
        if (key === "Ad Spend" || key === "GRP" || key === "GRP %") {
          const dataKey = key === "Industry" ? "Sector" : key;
          return item[dataKey] >= value[0] && item[dataKey] <= value[1];
        }
        const dataKey = key === "Industry" ? "Sector" : key;
        return value.includes(item[dataKey]);
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
      ...(field === "Industry" && {
        Category: [],
        Advertiser: [],
      }),
      ...(field === "Category" && {
        Advertiser: [],
      }),
    }));
  };

  const toggleFilterOption = (field, option) => {
    setCurrentPage(1);
    setFilters((prev) => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(option)
        ? currentValues.filter(v => v !== option)
        : [...currentValues, option];
      
      return {
        ...prev,
        [field]: newValues,
        ...(field === "Industry" && {
          Category: [],
          Advertiser: [],
        }),
        ...(field === "Category" && {
          Advertiser: [],
        }),
      };
    });
  };

  const clearFilter = (field) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      [field]:
        field === "Ad Spend"
          ? [0, 5000000]
          : field === "GRP"
          ? [0, 100]
          : field === "GRP %"
          ? [0, 1]
          : [],
      ...(field === "Industry" && {
        Category: [],
        Advertiser: [],
      }),
      ...(field === "Category" && {
        Advertiser: [],
      }),
    }));
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setFilters({
      Industry: [],
      Category: [],
      Advertiser: [],
      "Ad Spend": [0, 5000000],
      GRP: [0, 100],
      "GRP %": [0, 1],
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
      const max = field === "Ad Spend" ? 5000000 : field === "GRP" ? 100 : 1;
      const step = field === "Ad Spend" ? 100000 : field === "GRP" ? 1 : 0.01;
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
            value=""
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              // Filter options based on search term
            }}
            className="h-8"
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {getFilteredOptions(field).map((value) => {
            const isSelected = filters[field].includes(value);
            return (
              <DropdownMenuItem
                key={value}
                onClick={() => toggleFilterOption(field, value)}
                className={`cursor-pointer flex items-center gap-2 ${
                  isSelected ? 'bg-accent text-accent-foreground' : ''
                }`}
              >
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                  isSelected ? 'bg-primary border-primary' : 'border-input'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {value}
              </DropdownMenuItem>
            );
          })}
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
                          {filters[field] && filters[field].length > 0
                            ? Array.isArray(filters[field])
                              ? filters[field].length === 1
                                ? filters[field][0]
                                : `${filters[field].length} selected`
                              : `${formatNumber(filters[field][0])}${
                                  field === "GRP %" ? "%" : ""
                                } - ${formatNumber(filters[field][1])}${
                                  field === "GRP %" ? "%" : ""
                                }`
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
                {(filters[field] && 
                  ((Array.isArray(filters[field]) && filters[field].length > 0) || 
                   (!Array.isArray(filters[field]) && filters[field] !== ""))) && (
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
                  {header === "Industry" ? "Industry" : header}
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
                    {typeof row[field === "Industry" ? "Sector" : field] === "number"
                      ? `${formatNumber(row[field === "Industry" ? "Sector" : field])}${
                          field === "GRP %" ? "%" : ""
                        }`
                      : row[field === "Industry" ? "Sector" : field]}
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