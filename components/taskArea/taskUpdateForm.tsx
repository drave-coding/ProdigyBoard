"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "../extraComponents/datePicker";
; // Assuming the DatePickerDemo is reused for the date picker

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

interface TaskUpdateFormProps {
  task: Task;
  projects: { _id: string; projectName: string }[];
  handleSubmit: (formData: any) => void;
}

const TaskUpdateForm: React.FC<TaskUpdateFormProps> = ({ task, projects, handleSubmit }) => {
  const [taskName, setTaskName] = useState<string>(task.taskName || "");
  const [content, setContent] = useState<string>(task.content || "");
  const [status, setStatus] = useState<string>(task.status || "Ongoing");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(task.project.projectId || "");
  const [selectedProject, setSelectedProject] = useState<{ _id: string; projectName: string } | null>(
    projects.find((p) => p._id === task.project.projectId) || null
  );
  const [deadline, setDeadline] = useState<Date | undefined>(
    task.deadline ? new Date(task.deadline) : undefined
  );

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value;
    setSelectedProjectId(projectId);

    const project = projects.find((p) => p._id === projectId);
    setSelectedProject(project || null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName || !content || !status || !selectedProject || !deadline) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = {
      taskId: task._id,
      taskName,
      content,
      status,
      project: {
        projectId: selectedProject._id,
        projectName: selectedProject.projectName,
      },
      userId: task.userId,
      deadline: deadline.toISOString(),
    };

    handleSubmit(formData);
  };

  return (
    <form onSubmit={onSubmit}>
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
          value={selectedProjectId}
          onChange={handleProjectChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
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
        <Button type="submit">Update Task</Button>
      </div>
    </form>
  );
};

export default TaskUpdateForm;
