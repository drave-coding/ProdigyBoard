"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface AIFormProps {
  projects: { _id: string; projectName: string }[]; // List of projects to display in the dropdown
  userId: string; // User ID passed as a prop
  onSubmit: (formData: any) => void; // Handler function for form submission
}

const AIForm: React.FC<AIFormProps> = ({ projects, userId, onSubmit }) => {
  const [content, setContent] = useState<string>(""); // Only content field
  const [selectedProjectId, setSelectedProjectId] = useState<string>(""); // Store selected projectId
  const [selectedProject, setSelectedProject] = useState<{ _id: string; projectName: string } | null>(null); // Selected project object
  const [link, setLink] = useState<string>(""); // Store the link

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectName = event.target.value;
    setSelectedProjectId(projectName);

    // Find the selected project from the list based on projectName
    const project = projects.find((project) => project.projectName === projectName);
    setSelectedProject(project || null); // Set the selected project
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content || !selectedProject || !link) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = {
      content,
      project: {
        projectId: selectedProject._id, // Correct projectId
        projectName: selectedProject.projectName, // Correct project name
      },
      userId,
      link, // Pass link
    };

    onSubmit(formData); // Pass form data to the onSubmit handler
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium">
          Request Content
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
        <label htmlFor="project" className="block text-sm font-medium">
          Project
        </label>
        <select
          id="project"
          value={selectedProjectId}
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
        <label htmlFor="link" className="block text-sm font-medium">
          Link
        </label>
        <input
          type="url"
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="mt-4">
        <Button type="submit">Create Request</Button>
      </div>
    </form>
  );
};

export default AIForm;
