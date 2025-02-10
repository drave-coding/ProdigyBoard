"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

 // Import the AIForm component
import axios from "@/lib/axios"; // Import your Axios instance
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DSForm from "./DSform";

const DSTopSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // Get user info
  const [projects, setProjects] = useState<{ _id: string; projectName: string }[]>([]); // Store projects

  useEffect(() => {
    // Fetch the user's projects when the component mounts
    const fetchProjects = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated.");
        }

        const response = await axios.post("/projects/allDetails", {
          userId: user.id, // Send user ID to the server
        });

        setProjects(response.data); // Set projects from the response
      } catch (error: any) {
        
        console.error("Error fetching projects:", error.response?.data || error.message);
        // Handle error (e.g., display a notification)
      }
    };

    if (user) {
      fetchProjects(); // Fetch projects if user is authenticated
    }
  }, [user]);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      // Send request data to the server
      const response = await axios.post('/requests/DS/add', {
        ...formData,
        userId: user.id, // Pass user ID from Clerk
      });

      window.location.reload(); // Refresh the page to show the updated request
      console.log('RequestAI saved:', response.status);
    } catch (error: any) {
      console.error('Error submitting AI form:', error.response?.data || error.message);
      // Handle error (e.g., display a notification)
    } finally {
      setIsOpen(false); // Close the form dialog
    }
  };

  return (
    <div className="flex flex-col w-full pr-4 rounded-lg">
      <div className="flex justify-between items-end">
        <div></div>
        <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
          <DialogTrigger asChild>
            <button className=" border border-black-500 text-black px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-gray-500 hover:text-white active:scale-95 flex items-center shadow-md">
              <FaPlus className="" />
            </button>
          </DialogTrigger>

          {/* Dialog Content */}
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Make A Detailed Request For Data Scraper</DialogTitle>
            </DialogHeader>
            <DSForm 
              userId={user?.id || ""} 
              projects={projects} 
              onSubmit={handleFormSubmit} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DSTopSection;
