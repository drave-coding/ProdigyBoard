"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TaskForm from "./taskForm"; // Import the TaskForm component
import axios from "@/lib/axios"; // Import your Axios instance


const TaskTopSection: React.FC = () => {
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

        setProjects(response.data); 
        // Set projects from the response
       
      } catch (error: any) {
        
        console.error("Error fetching projects:", error.response?.data || error.message);}
        // Handle error (e.g., display a notification)
      }
    ;

    if (user) {
      fetchProjects(); // Fetch projects if user is authenticated
    }
  }, [user]);

  const handleFormSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      console.log('Submitting task form:');
      // Include userId in the formData to send to the API
      const response = await axios.post('/task/add', {
        ...formData,
        userId: user.id, // Pass user ID from Clerk
      });

      // Redirect to the task details page (or appropriate page)
      window.location.reload();
      console.log('Task saved:'+response.status);
    } catch (error: any) {
      console.error('Error submitting task form:', error.response?.data || error.message);
      // Handle error (e.g., display a notification)
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[66.67%] rounded-lg pb-12">
      <div className="flex justify-between items-end">
        <div></div>
        <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
          <DialogTrigger asChild>
            <button className="bg-transparent border border-purple-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-purple-500 hover:text-white active:scale-95 flex items-center shadow-md">
              <FaPlus className="mr-2" />
              Add Task
            </button>
          </DialogTrigger>

          {/* Dialog Content */}
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create or Add Task</DialogTitle>
            </DialogHeader>
            <TaskForm 
              userId={user?.id || ""} 
              projects={projects} 
              onSubmit={handleFormSubmit} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="my-2" />
      {/* White Line */}
      <div className="h-1 bg-white border-t border-gray-300" />
    </div>
  );
};

export default TaskTopSection;
