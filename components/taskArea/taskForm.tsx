"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "../extraComponents/datePicker";
; // Assuming the DatePickerDemo is reused for the date picker

interface TaskFormProps {
  projects: { _id: string; projectName: string }[]; // List of projects to display in the dropdown
  userId: string; // User ID passed as a prop
  onSubmit: (formData: any) => void; // Handler function for form submission
}

const TaskForm: React.FC<TaskFormProps> = ({ projects, userId, onSubmit }) => {
  const [taskName, setTaskName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState<string>("Ongoing");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(""); // Store only the selected projectId
  const [selectedProject, setSelectedProject] = useState<{ _id: string; projectName: string } | null>(null); // Store the selected project object
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectName = event.target.value;
    setSelectedProjectId(projectName);

    // Find the selected project from the list based on the projectId
    const project = projects.find((project) => project.projectName === projectName);

    // Set the selected project
    setSelectedProject(project || null); // Set the entire project object
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName || !content || !status || !selectedProject || !deadline) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = {
      taskName,
      content,
      status,
      project: {
        projectId: selectedProject._id, // Pass the correct projectId
        projectName: selectedProject.projectName, // Pass the project name
      },
      userId,
      deadline: deadline.toISOString(),
    };

    onSubmit(formData); // Pass the form data to the onSubmit handler
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="taskName" className="block text-sm font-medium">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium">
          Task Description
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Stopped">Stopped</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="project" className="block text-sm font-medium">
          Project
        </label>
        <select
          id="project"
          value={selectedProjectId} // Use selectedProjectId to control the dropdown
          onChange={handleProjectChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project.projectName}>
              {project.projectName} 
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="deadline" className="block text-sm font-medium">
          Deadline
        </label>
        <DatePickerDemo selectedDate={deadline} onDateChange={setDeadline} />
      </div>

      <div className="mt-4">
        <Button type="submit">Create Task</Button>
      </div>
    </form>
  );
};

export default TaskForm;
