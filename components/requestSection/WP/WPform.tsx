"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface WPFormProps {
  projects: { _id: string; projectName: string }[];
  userId: string;
  onSubmit: (formData: any) => void;
}

const WPForm: React.FC<WPFormProps> = ({ projects, userId, onSubmit }) => {
  const [content, setContent] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<{ _id: string; projectName: string } | null>(null);
  const [link, setLink] = useState<string>("");

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectName = event.target.value;
    setSelectedProjectId(projectName);
    const project = projects.find((project) => project.projectName === projectName);
    setSelectedProject(project || null);
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
        projectId: selectedProject._id,
        projectName: selectedProject.projectName,
      },
      userId,
      link,
    };

    onSubmit(formData);
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

export default WPForm;
