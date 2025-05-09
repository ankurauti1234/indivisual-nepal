import React from "react";
import { Star, StarHalf, Table2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartCard from "@/components/card/charts-card";

const channels = [
  { name: "Kantipur TV", rating: 4.5, viewers: "2.8M" },
  { name: "Nepal Television", rating: 4.2, viewers: "2.4M" },
  { name: "AP1 TV", rating: 4.0, viewers: "2.1M" },
  { name: "Himalaya TV", rating: 3.8, viewers: "1.9M" },
  { name: "News 24 Nepal", rating: 3.7, viewers: "1.7M" },
  { name: "Image Channel", rating: 3.5, viewers: "1.5M" },
  { name: "Avenues Television", rating: 3.3, viewers: "1.3M" },
  { name: "Mountain Television", rating: 3.2, viewers: "1.2M" },
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf size={16} className="fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} size={16} className="text-gray-200" />
      ))}
      <span className="ml-2 text-sm text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function RatingTable() {
    return (
      <ChartCard
        icon={<Table2 className="w-6 h-6" />}
        title="Top TV Channels Rating"
        description="Ranked by viewer ratings and engagement"
        chart={
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] ">Channel</TableHead>
                <TableHead className="">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel, index) => (
                <TableRow key={channel.name} className="  h-12">
                  <TableCell className="font-medium ">{channel.name}</TableCell>
                  <TableCell>
                    {/* <StarRating rating={channel.rating} /> */}
                    {channel.rating}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
        footer={<p className="text-sm text-gray-500">Channel ratings</p>}
      />
    );
}
