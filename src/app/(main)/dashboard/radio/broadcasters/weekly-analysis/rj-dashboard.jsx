import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Radio, Search, Trophy } from "lucide-react";

const RJDashboard = () => {
  const rjData = [
    { name: "RJ Praveen", followers: { ig: 2510230, fb: 1800000, twitter: 9027 },radio:"RedFM" ,username: "rjpraveen" },
    { name: "Rj Kisna", followers: { ig: 1862141, fb: 1400000, twitter: 9950 },radio:"RedFM Delhi" ,username: "rjkisnaa" },
    { name: "RJ Princy Parikh", followers: { ig: 1652500, fb: 1100000, twitter: 800000 },radio:"Radio Nasha" ,username: "princymirchilove" },
    { name: "RJ Anmol 🇮🇳", followers: { ig: 523582, fb: 200000, twitter: 150000 },radio:"Radio Nasha" ,username: "rjanmol27" },
    { name: "Salil", followers: { ig: 367753, fb: 300000, twitter: 200000 },radio:"Radio City Mumbai" ,username: "salilacharya" },
    { name: "Archana L Pania", followers: { ig: 234396, fb: 190000, twitter: 24700 },radio:"Radio City Mumbai" ,username: "archanaapania" },
    { name: "RJ Harsh", followers: { ig: 119036, fb: 90000, twitter: 70000 },radio:"RedFM Ahemdabad" ,username: "loveseharsh" },
    { name: "RJ Raaj", followers: { ig: 54758, fb: 40000, twitter: 30000 },radio:"RedFM Hydrabad" ,username: "ursrjraaj" },
    { name: "RJ Niyati", followers: { ig: 42336, fb: 35000, twitter: 13 },radio:"Radio Mirchi" ,username: "rj_niyati" },
    { name: "Ginnie Mahajan", followers: { ig: 24856, fb: 20000, twitter: 13500 },radio:"Radio City" ,username: "rjginnie" }
  ].sort((a, b) => b.followers.ig - a.followers.ig);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = rjData.filter(rj =>
    rj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rj.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFollowers = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="m">
      <Card className=" mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Radio className="w-8 h-8 text-purple-500" />
              <div>
                <CardTitle className="text-2xl font-bold">Top RJs of India</CardTitle>
                <CardDescription>Social Media Followers Ranking</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Total RJs: {rjData.length}</span>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              className="pl-10 bg-white"
              placeholder="Search by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12 font-semibold">Rank</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Radio Station</TableHead>
                  <TableHead className="font-semibold">Instagram Username</TableHead>
                  <TableHead className="text-right font-semibold">Instagram</TableHead>
                  <TableHead className="text-right font-semibold">Facebook</TableHead>
                  <TableHead className="text-right font-semibold">Twitter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((rj, index) => (
                  <TableRow key={rj.username} className="hover:bg-gray-50">
                    <TableCell className="font-semibold">{index + 1}</TableCell>
                    <TableCell>{rj.name}</TableCell>
                    <TableCell>{rj.radio}</TableCell>
                    <TableCell className="text-blue-600">@{rj.username}</TableCell>
                    <TableCell className="text-right font-semibold">{formatFollowers(rj.followers.ig)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatFollowers(rj.followers.fb)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatFollowers(rj.followers.twitter)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RJDashboard;
