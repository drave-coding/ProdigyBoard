// components/ProjectTopSection.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ProjectUpdateForm } from "../projectSummaryArea/projectUpdateForm";


export const ProjectTopSection: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [projectData, setProjectData] = useState<any>(null); // Store project data here
  const { user } = useUser();
  const router = useRouter();

  // Fetch project data from DB
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        
        const response = await axios.get(`/projectDetails/${projectId}`);
        setProjectData(response.data); // Set the project data here
      } catch (error:any) {
       
        console.error("Error fetching project data:", error);}
      }
    ;

    fetchProjectData();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }

      const response = await axios.delete(`/projectDetails/delete/${projectId}`);
      
      if (response.status === 200) {
        router.push("/projects");
        console.log("Project deleted successfully.");
      }
    } catch (error: any) {
      console.error("Error deleting project:", error.response?.data || error.message);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleSubmit = async (formData: any, projectId: string) => {
    try {
      
      const response = await axios.patch(`/projectDetails/update/${projectId}`, formData);
      
      if (response.data) {
        // Proceed with the parsed JSON if data exists
        console.log("Update successful:");
    } else {
        console.log("Update successful with no data returned");
    }
      if (response.status === 200) {
        // Redirect or handle success
        
        router.push(`/projects/${projectId}`);
        console.log("Project updated successfully.");
      }
    } catch (error:any) {
      console.error("Error updating project:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex flex-col w-full h-[66.67%] rounded-lg pb-6">
      <div className="flex justify-between items-center">
        <div></div>
        <div className="flex gap-4">
          {/* UPDATE BUTTON */}
          <Dialog open={isUpdateOpen} onOpenChange={(open: boolean) => setIsUpdateOpen(open)}>
            <DialogTrigger asChild>
              <button className="bg-transparent border border-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white active:scale-95 flex items-center shadow-md">
                <FaEdit className="mr-2" />
                Update Project
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] -mt-[30px]">
              <DialogHeader>
                <DialogTitle>Update Project</DialogTitle>
                {projectData && (
                  <ProjectUpdateForm
                    initialData={projectData} // Pass initialData to the form
                    projectId={projectId}
                    handleSubmit={handleSubmit} // Pass handleSubmit to handle form submission
                  />
                )}
              </DialogHeader>
            </DialogContent>
          </Dialog>

          {/* DELETE BUTTON */}
          <Dialog open={isDeleteOpen} onOpenChange={(open: boolean) => setIsDeleteOpen(open)}>
            <DialogTrigger asChild>
              <button className="bg-transparent border border-red-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-red-500 hover:text-white active:scale-95 flex items-center shadow-md">
                <FaTrash className="mr-2" />
                Delete Project
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Delete Project</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-red-500">Are you sure you want to delete this project?</p>
              </div>
              <DialogFooter>
                <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Delete
                </button>
                <button onClick={() => setIsDeleteOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">
                  Cancel
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="my-2" />
      {/* White Line */}
      <div className="h-1 bg-white border-t border-gray-300" />
    </div>
  );
};

export default ProjectTopSection;
