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
  { name: "Kantipur TV", rating: 4.99 },
  { name: "Himalayan TV", rating: 3.44},
  { name: "Nepal Television", rating: 2.53},
  { name: "News 24 Nepal", rating: 1.51},
  { name: "AP1 TV", rating: 1.08 },
  { name: "Image Channel", rating: 1.07 },
  { name: "Avenues Television", rating: 0.79 },
  { name: "Prime TV", rating: 0.77 },
  { name: "Sagarmatha Television", rating: 0.43 },
  { name: "ABC TV", rating: 0.18 },
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
