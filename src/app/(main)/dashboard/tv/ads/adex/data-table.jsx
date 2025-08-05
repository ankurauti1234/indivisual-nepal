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
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, ChevronLeft, ChevronRight, Table2, Search, Filter, TrendingUp, Download } from "lucide-react";
import { tableData } from "./tableData";

const ITEMS_PER_PAGE = 10;

const ChartCard = ({ icon, title, action, chart }) => (
  <div className="w-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
    <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {title}
            </h3>
          </div>
        </div>
        {action}
      </div>
    </div>
    <div className="p-6">{chart}</div>
  </div>
);

const DataTable = () => {
  const [filters, setFilters] = useState({
    Industry: [],
    Category: [],
    Advertiser: [],
    "Ad Spend": [0, 5000000],
    GRP: [0, 100],
    "GRP %": [0, 1],
    "Time Slot": [],
    Channel: [],
    "Ad Duration": []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerms, setSearchTerms] = useState({});

  // Enhanced data with calculated columns
  const enhancedData = useMemo(() => {
    return tableData.map(item => {
      const cprp = item["Ad Spend"] / item.GRP;
      const frequency = Math.random() * 6 + 1; // Mock frequency data
      const uniqueReach = Math.floor(Math.random() * 1000000 + 500000); // Mock reach data
      
      return {
        ...item,
        CPRP: cprp,
        Frequency: frequency,
        "Unique Reach": uniqueReach
      };
    });
  }, []);

  // Get filtered options based on current selections and search
  const getFilteredOptions = (field) => {
    let filteredData = [...enhancedData];
    const searchTerm = searchTerms[field]?.toLowerCase() || '';

    Object.entries(filters).forEach(([key, value]) => {
      if (key === field) return;
      if (key === "Ad Spend" || key === "GRP" || key === "GRP %" || key === "CPRP" || key === "Frequency") {
        filteredData = filteredData.filter(
          (item) => {
            const fieldValue = item[key === "Industry" ? "Sector" : key];
            return fieldValue >= value[0] && fieldValue <= value[1];
          }
        );
      } else if (value && value.length > 0) {
        filteredData = filteredData.filter(
          (item) => value.includes(item[key === "Industry" ? "Sector" : key])
        );
      }
    });

    const options = [...new Set(filteredData.map((item) => item[field === "Industry" ? "Sector" : field]))];
    
    if (searchTerm) {
      return options.filter(option => 
        option.toString().toLowerCase().includes(searchTerm)
      );
    }
    
    return options;
  };

  // Filter data based on all active filters
  const filteredData = useMemo(() => {
    return enhancedData.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return true;
        if (key === "Ad Spend" || key === "GRP" || key === "GRP %" || key === "CPRP" || key === "Frequency") {
          const dataKey = key === "Industry" ? "Sector" : key;
          return item[dataKey] >= value[0] && item[dataKey] <= value[1];
        }
        const dataKey = key === "Industry" ? "Sector" : key;
        return value.includes(item[dataKey]);
      });
    });
  }, [enhancedData, filters]);

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
          : field === "CPRP"
          ? [0, 100000]
          : field === "Frequency"
          ? [0, 10]
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
      "Time Slot": [],
      Channel: [],
      "Ad Duration": [],
      CPRP: [0, 100000],
      Frequency: [0, 10]
    });
    setSearchTerms({});
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getChannelBadgeColor = (channel) => {
    const colors = {
      'Kantipur': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'Himalayan': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'NTV': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'Prime TV': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Image TV': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[channel] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getTimeSlotBadgeColor = (timeSlot) => {
    const colors = {
      'Prime Time': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Morning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Evening': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'Late Night': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
    };
    return colors[timeSlot] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const handleExportData = () => {
    const s3Url = "https://radio-playback-files.s3.ap-south-1.amazonaws.com/reports/grp-report.csv";
    window.open(s3Url, "_blank");
  };

  const renderFilter = (field) => {
    const isNumericFilter = ["Ad Spend", "GRP", "GRP %", "CPRP", "Frequency"].includes(field);
    
    if (isNumericFilter) {
      const maxValues = {
        "Ad Spend": 5000000,
        "GRP": 100,
        "GRP %": 1,
        "CPRP": 100000,
        "Frequency": 10
      };
      
      const steps = {
        "Ad Spend": 100000,
        "GRP": 1,
        "GRP %": 0.01,
        "CPRP": 1000,
        "Frequency": 0.1
      };
      
      const max = maxValues[field];
      const step = steps[field];
      
      return (
        <div className="space-y-4 p-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-blue-600 dark:text-blue-400">
              {formatNumber(filters[field][0])}
              {field === "GRP %" ? "%" : ""}
            </span>
            <span className="text-purple-600 dark:text-purple-400">
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
        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${field}...`}
              value={searchTerms[field] || ''}
              onChange={(e) => setSearchTerms(prev => ({
                ...prev,
                [field]: e.target.value
              }))}
              className="pl-10 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>
        <div className="max-h-[250px] overflow-y-auto">
          {getFilteredOptions(field).map((value) => {
            const isSelected = filters[field].includes(value);
            return (
              <DropdownMenuItem
                key={value}
                onClick={() => toggleFilterOption(field, value)}
                className={`cursor-pointer flex items-center gap-3 py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : ''
                }`}
              >
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{value}</span>
              </DropdownMenuItem>
            );
          })}
        </div>
      </div>
    );
  };

  const tableColumns = [
    { key: "Advertiser", label: "Advertiser", width: "w-40" },
    { key: "Industry", label: "Industry", width: "w-36" },
    { key: "Category", label: "Category", width: "w-36" },
    { key: "Ad Spend", label: "Ad Spend (₹)", width: "w-32" },
    { key: "GRP", label: "GRP", width: "w-24" },
    { key: "GRP %", label: "GRP %", width: "w-24" },
    { key: "CPRP", label: "CPRP", width: "w-28" },
    { key: "Frequency", label: "Frequency", width: "w-28" },
    { key: "Time Slot", label: "Time Slot", width: "w-32" },
    { key: "Channel", label: "Channel", width: "w-28" },
    { key: "Ad Duration", label: "Duration (s)", width: "w-28" }
  ];

  return (
    <ChartCard
      icon={<Table2 className="w-6 h-6" />}
      title="GRP Analytics Dashboard"
      action={
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            {filteredData.length} Records
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      }
      chart={
        <div className="space-y-6">
          {/* Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-purple-50/40 dark:from-gray-800/60 dark:via-blue-900/20 dark:to-purple-900/20 border border-gray-200/60 dark:border-gray-700/60 shadow-inner">
            {Object.keys(filters).map((field) => (
              <div key={field} className="group">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between h-auto py-3 px-4 bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-600/80 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {field}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-32">
                            {filters[field] && filters[field].length > 0
                              ? Array.isArray(filters[field])
                                ? filters[field].length === 1
                                  ? filters[field][0]
                                  : `${filters[field].length} selected`
                                : `${formatNumber(filters[field][0])} - ${formatNumber(filters[field][1])}`
                              : "All"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-80 p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-gray-200/60 dark:border-gray-700/60 shadow-xl" 
                      align="start"
                    >
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
                      className="p-1 h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Table Section */}
          <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gradient-to-r from-gray-50 via-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20">
                  <TableRow className="hover:bg-transparent border-gray-200/60 dark:border-gray-700/60">
                    {tableColumns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={`font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider py-4 ${column.width}`}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((row, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200 border-gray-200/40 dark:border-gray-700/40"
                    >
                      <TableCell className="py-4 font-semibold text-gray-900 dark:text-gray-100">
                        {row.Advertiser}
                      </TableCell>
                      <TableCell className="py-4 text-gray-700 dark:text-gray-300">
                        {row.Sector}
                      </TableCell>
                      <TableCell className="py-4 text-gray-700 dark:text-gray-300">
                        {row.Category}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-green-700 dark:text-green-400 font-semibold">
                        ₹{formatNumber(row["Ad Spend"])}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-blue-700 dark:text-blue-400 font-semibold">
                        {formatNumber(row.GRP)}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-purple-700 dark:text-purple-400 font-semibold">
                        {(row["GRP %"] * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="py-4 font-mono text-orange-700 dark:text-orange-400 font-semibold">
                        ₹{formatNumber(row.CPRP)}
                      </TableCell>
                      <TableCell className="py-4 font-mono text-teal-700 dark:text-teal-400 font-semibold">
                        {formatNumber(row.Frequency)}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={getTimeSlotBadgeColor(row["Time Slot"])}>
                          {row["Time Slot"]}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={getChannelBadgeColor(row.Channel)}>
                          {row.Channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 font-mono text-gray-700 dark:text-gray-300">
                        {row["Ad Duration"]}s
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Section */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-purple-50/40 dark:from-gray-800/60 dark:via-blue-900/20 dark:to-purple-900/20 border-t border-gray-200/60 dark:border-gray-700/60 rounded-b-2xl">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {pageStart + 1} to {Math.min(pageEnd, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-600/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 p-0 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500"
                        : "bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-600/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 bg-white/80 dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-600/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default DataTable;