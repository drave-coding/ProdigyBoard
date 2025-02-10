"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskUpdateForm from "./taskUpdateForm"; // Import the TaskUpdateForm component
import axios from "@/lib/axios"; // Import Axios instance
import { useUser } from "@clerk/nextjs";

interface Task {
  _id: string;
  taskName: string;
  content: string;
  status: string;
  project: {
    projectId: string;
    projectName: string;
  };
  userId: string;
  deadline: string;
}

interface TaskEditDialogProps {
  task: Task; // Task data passed to the dialog
  onClose: () => void; // Function to close the dialog
  onTaskUpdate: () => void; // Callback to refresh task data on successful update
}

const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ task, onClose, onTaskUpdate }) => {
  const { user } = useUser(); // Get the authenticated user
  const [projects, setProjects] = useState<{ _id: string; projectName: string }[]>([]); // Store projects
  const [isUpdating, setIsUpdating] = useState(false); // Track API call state

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) {
          throw new Error("User not authenticated.");
        }

        const response = await axios.post("/projects/allDetails", {
          userId: user.id,
        });

        setProjects(response.data); // Update the projects state
      } catch (error: any) {
       
        console.error("Error fetching projects:", error.response?.data || error.message);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  // Handle form submission for task update
  const handleFormSubmit = async (formData: any) => {
    setIsUpdating(true); // Set loading state
    try {
      console.log("Submitting task update:"
      );
  
      // Make API request to update the task
      await axios.patch("/task/update", {
        taskId: task._id, // Pass taskId
        ...formData, // Include updated task data
      });
  
      console.log("Task updated successfully.");
      onTaskUpdate(); // Refresh tasks on success
    } catch (error: any) {
      console.error("Error updating task:", error.response?.data || error.message);
      alert("Failed to update the task. Please try again."); // Display error message
    } finally {
      setIsUpdating(false); // Reset loading state
      onClose(); // Close the dialog
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
  
        {projects.length > 0 ? (
          <div>
            <TaskUpdateForm
              task={task}
              projects={projects}
              handleSubmit={handleFormSubmit}
            />
            {/* Display a loading message if updating */}
            {isUpdating && <p className="text-center text-gray-500">Updating task...</p>}
          </div>
        ) : (
          <p>Loading projects...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditDialog;
