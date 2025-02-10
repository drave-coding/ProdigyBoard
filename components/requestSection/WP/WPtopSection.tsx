"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

import WPForm from "./WPform";
import axios from "@/lib/axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const WPTopSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [projects, setProjects] = useState<{ _id: string; projectName: string }[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated.");
        }

        const response = await axios.post("/projects/allDetails", {
          userId: user.id,
        });

        setProjects(response.data);
      } catch (error: any) {
        
        console.error("Error fetching projects:", error.response?.data || error.message);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      await axios.post("/requests/WP/add", {
        ...formData,
        userId: user.id,
      });

      window.location.reload();
    } catch (error: any) {
      console.error("Error submitting WP form:", error.response?.data || error.message);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full pr-4 rounded-lg">
      <div className="flex justify-between items-end">
        <div></div>
        <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
          <DialogTrigger asChild>
            <button className="border border-black-500 text-black px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-gray-500 hover:text-white active:scale-95 flex items-center shadow-md">
              <FaPlus />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Make a Detailed Request for WhatsApp Bulker</DialogTitle>
            </DialogHeader>
            <WPForm userId={user?.id || ""} projects={projects} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default WPTopSection;
