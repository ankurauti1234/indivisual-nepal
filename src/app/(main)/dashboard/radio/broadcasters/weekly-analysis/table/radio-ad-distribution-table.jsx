import React, { useState, useMemo } from "react";
import { Radio, Info, ArrowUpDown } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RadioAdDistributionTable = () => {
  const [selectedStation, setSelectedStation] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Define colors based on ad count ranges
  const getColorByRange = (size) => {
    if (size >= 31 && size <= 35) return "#FF3B30"; // Red for highest range
    if (size >= 26 && size <= 30) return "#007AFF"; // Blue for high range
    if (size >= 21 && size <= 25) return "#34C759"; // Green for medium range
    if (size >= 15 && size <= 20) return "#5856D6"; // Purple for lower range
    return "#FFCC00"; // Yellow for outliers
  };

  const stations = [
    { id: "1", name: "Radio City FM" },
    { id: "2", name: "Capital Radio" },
    { id: "3", name: "Wave FM" },
    { id: "4", name: "Melody 90.4" },
    { id: "5", name: "Rhythm Radio" },
  ];

  // Station data with dynamic colors
  const stationData = {
    1: {
      name: "Radio City FM",
      children: [
        {
          name: "Medicinal Products",
          size: 30,
          brands: ["Cipla", "Sun Pharma", "Pfizer", "Dr. Reddy's"],
        },
        {
          name: "Travel & Tourism",
          size: 28,
          brands: ["MakeMyTrip", "Goibibo", "Yatra", "Expedia"],
        },
        {
          name: "Automobile - Car",
          size: 32,
          brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Honda"],
        },
        {
          name: "Dairy Products",
          size: 25,
          brands: ["Amul", "Mother Dairy", "Nestle", "Britannia"],
        },
        {
          name: "Finance - Loans",
          size: 27,
          brands: ["HDFC", "ICICI", "Bajaj Finance", "SBI"],
        },
        {
          name: "Public Service Ads",
          size: 15,
          brands: ["Ministry of Health", "WHO", "UNICEF", "NITI Aayog"],
        },
        {
          name: "Automobile - Dealers",
          size: 20,
          brands: ["True Value", "Mahindra First Choice", "Spinny", "Cars24"],
        },
        {
          name: "Finance - Bank",
          size: 30,
          brands: ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank"],
        },
        {
          name: "Fast Food",
          size: 26,
          brands: ["McDonald's", "KFC", "Domino's", "Burger King"],
        },
        {
          name: "Building Materials",
          size: 22,
          brands: [
            "Ultratech Cement",
            "ACC Cement",
            "Ambuja Cement",
            "Shree Cement",
          ],
        },
        {
          name: "Finance - Insurance",
          size: 23,
          brands: ["LIC", "Max Life", "HDFC Life", "Bajaj Allianz"],
        },
        {
          name: "Personal Care",
          size: 25,
          brands: ["Dove", "Nivea", "Himalaya", "Patanjali"],
        },
        {
          name: "Textile and Apparels",
          size: 21,
          brands: ["Raymond", "Allen Solly", "Levi's", "Van Heusen"],
        },
        {
          name: "Hotel & Restaurants",
          size: 30,
          brands: ["Taj Hotels", "Oberoi", "Hyatt", "ITC Hotels"],
        },
        {
          name: "Building Material",
          size: 28,
          brands: ["L&T", "Godrej Interio", "Asian Paints", "Berger Paints"],
        },
        {
          name: "Entertainment",
          size: 32,
          brands: ["Netflix", "Amazon Prime", "Disney+", "Sony Liv"],
        },
        {
          name: "Accessory - Jewellery",
          size: 19,
          brands: ["Tanishq", "Malabar Gold", "Kalyan Jewellers", "CaratLane"],
        },
        {
          name: "Healthcare",
          size: 29,
          brands: ["Apollo", "Fortis", "Medanta", "Max Healthcare"],
        },
        {
          name: "Education",
          size: 22,
          brands: ["Byju's", "Unacademy", "Coursera", "Udemy"],
        },
        {
          name: "Insurance",
          size: 27,
          brands: ["ICICI Prudential", "HDFC Life", "SBI Life", "Tata AIA"],
        },
        {
          name: "Fashion",
          size: 21,
          brands: ["H&M", "Zara", "Nike", "Adidas"],
        },
        {
          name: "Food & Beverage",
          size: 30,
          brands: ["Coca-Cola", "PepsiCo", "McDonald's", "KFC"],
        },
        {
          name: "Banking",
          size: 25,
          brands: ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank"],
        },
        {
          name: "Chemical",
          size: 22,
          brands: ["Tata Chemicals", "Reliance Chemicals", "UPL", "BASF"],
        },
        {
          name: "Construction",
          size: 28,
          brands: ["L&T", "Shapoorji Pallonji", "GMR", "HCC"],
        },
        {
          name: "Public Works",
          size: 24,
          brands: ["NHAI", "PWD", "Indian Railways", "Metro Projects"],
        },
        {
          name: "FMCG",
          size: 27,
          brands: ["Hindustan Unilever", "Nestle", "ITC", "Dabur"],
        },
        {
          name: "Government",
          size: 20,
          brands: [
            "Ministry of Tourism",
            "Swachh Bharat",
            "Make in India",
            "Skill India",
          ],
        },
        {
          name: "Real Estate",
          size: 30,
          brands: ["DLF", "Godrej Properties", "Prestige", "Lodha"],
        },
        {
          name: "Jewellery",
          size: 19,
          brands: ["Tanishq", "Kalyan Jewellers", "Malabar Gold", "CaratLane"],
        },
        {
          name: "Travel",
          size: 29,
          brands: ["IRCTC", "Airbnb", "Expedia", "Yatra"],
        },
        {
          name: "Automobile",
          size: 32,
          brands: ["Maruti Suzuki", "Hyundai", "Tata Motors", "Mahindra"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
    },
    2: {
      name: "Capital Radio",
      children: [
        {
          name: "Entertainment",
          size: 30,
          brands: ["Netflix", "Amazon Prime", "Disney+", "Sony"],
        },
        {
          name: "Fashion",
          size: 25,
          brands: ["H&M", "Zara", "Uniqlo", "Nike"],
        },
        {
          name: "Food & Beverage",
          size: 20,
          brands: ["Coca-Cola", "PepsiCo", "McDonald's", "KFC"],
        },
        {
          name: "Technology",
          size: 15,
          brands: ["Apple", "Samsung", "OnePlus", "Dell"],
        },
        {
          name: "Insurance",
          size: 10,
          brands: ["LIC", "HDFC Life", "Max Life", "SBI Life"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
    },
    3: {
      name: "Wave FM",
      children: [
        {
          name: "Sports",
          size: 28,
          brands: ["Nike", "Adidas", "Puma", "Under Armour"],
        },
        {
          name: "Beauty",
          size: 22,
          brands: ["L'Oreal", "Maybelline", "MAC", "Lakme"],
        },
        {
          name: "Healthcare",
          size: 18,
          brands: ["Apollo", "Fortis", "Max Healthcare", "Cipla"],
        },
        {
          name: "Education",
          size: 20,
          brands: ["Byju's", "Unacademy", "Coursera", "Udemy"],
        },
        {
          name: "Real Estate",
          size: 12,
          brands: ["DLF", "Godrej Properties", "Prestige", "Lodha"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
    },
    4: {
      name: "Melody 90.4",
      children: [
        {
          name: "Travel",
          size: 25,
          brands: ["MakeMyTrip", "Yatra", "Airbnb", "IRCTC"],
        },
        {
          name: "Jewelry",
          size: 20,
          brands: ["Tanishq", "Kalyan", "CaratLane", "Malabar Gold"],
        },
        {
          name: "Home Decor",
          size: 15,
          brands: ["IKEA", "Home Centre", "Urban Ladder", "Pepperfry"],
        },
        {
          name: "Electronics",
          size: 22,
          brands: ["Croma", "Reliance Digital", "Vijay Sales", "Amazon"],
        },
        {
          name: "Fitness",
          size: 18,
          brands: ["Cult.fit", "Decathlon", "Gold's Gym", "Fitbit"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
    },
    5: {
      name: "Rhythm Radio",
      children: [
        {
          name: "Gaming",
          size: 24,
          brands: ["PlayStation", "Xbox", "Nintendo", "EA Sports"],
        },
        {
          name: "Streaming",
          size: 28,
          brands: ["Spotify", "Gaana", "JioSaavn", "Amazon Music"],
        },
        {
          name: "Food Delivery",
          size: 20,
          brands: ["Zomato", "Swiggy", "Domino's", "Pizza Hut"],
        },
        {
          name: "Airlines",
          size: 16,
          brands: ["IndiGo", "Air India", "SpiceJet", "Vistara"],
        },
        {
          name: "Digital Payments",
          size: 12,
          brands: ["Paytm", "PhonePe", "Google Pay", "Amazon Pay"],
        },
      ].map((item) => ({ ...item, fill: getColorByRange(item.size) })),
    },
  };

  const currentStation = stationData[selectedStation];

  // Filtering and sorting logic
  const filteredData = useMemo(() => {
    return currentStation.children.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentStation, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "name") {
          aValue = a.name;
          bValue = b.name;
        } else if (sortConfig.key === "size") {
          aValue = a.size;
          bValue = b.size;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Card className="w-full bg-card text-foreground shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/50 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 shadow-md">
              <Radio className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Radio Ad Distribution Table
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1">
                Advertisement distribution by industry and ad count
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              placeholder="Search industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 bg-background border-muted"
            />
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger className="w-48 bg-background border-muted">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station.id} value={station.id}>
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/3">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("name")}
                    className="flex items-center gap-2 text-foreground"
                  >
                    Industry
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-24 text-center">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("size")}
                    className="flex items-center gap-2 mx-auto text-foreground"
                  >
                    Ad Count
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="w-2/3">Top Brands</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, idx) => (
                <TableRow
                  key={item.name}
                  className={cn(
                    "transition-colors",
                    idx % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    style={{
                      backgroundColor: `${item.fill}`,
                      color: "#fff",
                    }}
                  >
                    {item.size}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {item.brands.map((brand, index) => (
                        <span
                          key={index}
                          className="bg-muted/50 px-2 py-1 rounded-md text-sm text-foreground"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-wrap gap-3 justify-center p-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#5856D6]" />
            <span className="text-sm text-foreground">15-20 Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#34C759]" />
            <span className="text-sm text-foreground">21-25 Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
            <span className="text-sm text-foreground">26-30 Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
            <span className="text-sm text-foreground">31-35 Ads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
            <span className="text-sm text-foreground">Other</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-6 border-t border-muted">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-foreground">
              {currentStation.name}
            </h3>
            <Info className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {currentStation.children.length} Industries
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioAdDistributionTable;