"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { FaExternalLinkAlt } from "react-icons/fa";

interface Audience {
  _id: string;
  title: string;
  rating: string;
  reviews: string;
  category: string;
  address: string;
  website: string;
  phoneNumber: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
}

const AudienceContent: React.FC = () => {
  const { user } = useUser();
  const [audience, setAudience] = useState<Audience[]>([]);
  const [filteredAudience, setFilteredAudience] = useState<Audience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchAudience = useCallback(async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/audience/audienceList", {
        userId: user.id,
      });

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        setAudience(response.data);
        setFilteredAudience(response.data);
      } else {
        setAudience([]);
        setFilteredAudience([]);
      }
    } catch (error: any) {
      

          console.error("Error fetching audience:", error.response?.data || error.message);
          setError(error.message || "Failed to fetch audience data");
        
      
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchAudience();
    }
  }, [user, fetchAudience]);

  useEffect(() => {
    const filtered = audience.filter((item) =>
      item.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAudience(filtered);
  }, [searchQuery, audience]);

  const handleWebsiteRedirect = (website: string) => {
    if (website === "N/A") {
      window.location.reload();
    } else {
      window.open(website, "_blank");
    }
  };
  console.log(error);
  return (
    <div className="max-w-[1400px] bg-slate-50 rounded-lg p-4">
      {loading ? (
        <p>Loading audience...</p>
      ) : (
        <>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
            <Input
              placeholder="Search by address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Table Section */}
          <div className="max-h-[550px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Website</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAudience.length > 0 ? (
                  filteredAudience.map((audienceItem) => (
                    <TableRow key={audienceItem._id} className="h-[30px]">
                      <TableCell>
                        <div className="truncate max-w-xs">{audienceItem.title}</div>
                      </TableCell>
                      <TableCell>{audienceItem.rating}</TableCell>
                      <TableCell>{audienceItem.reviews}</TableCell>
                      <TableCell>{audienceItem.category}</TableCell>
                      <TableCell className="font-medium hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate max-w-[250px]">{audienceItem.address}</div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-100 text-black p-4 rounded-lg shadow-md max-w-[300px]">
                              <p>{audienceItem.address}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{audienceItem.project.projectName}</TableCell>
                      <TableCell>{audienceItem.phoneNumber}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWebsiteRedirect(audienceItem.website)}
                        >
                          <FaExternalLinkAlt className="h-5 w-5 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No audience data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default AudienceContent;
