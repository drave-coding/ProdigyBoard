/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Upload } from "lucide-react";
import DataCard from "../extraComponents/DataCard";

interface ProjectDetailsGrid2Props {
  project: {
    _id: string;
    userId: string;
    industry: string;
    transaction: string;
    investment: number;
    dateRange: {
      from: string;
      to: string;
    };
    competitors: { name: string; link: string; _id: string }[];
    socialLinks: {
      instagram: string | null;
      facebook: string | null;
      linkedin: string | null;
      drive: string | null;
    };
  };
}

interface Task {
  _id: string;
  taskName: string;
  status: string;
  deadline: string;
}

const ProjectDetailsGrid2: React.FC<ProjectDetailsGrid2Props> = ({
  project,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [audiences, setAudiences] = useState<any[]>([]);
  const [loadingAudiences, setLoadingAudiences] = useState<boolean>(true);
  const [errorAudiences, setErrorAudiences] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post("/api/task/taskListForProjects", {
          userId: project.userId,
          projectId: project._id,
        });

        if (response.status === 200) {
          const data = response.data;

          // Sorting tasks by deadline
          const sortedTasks = data.sort((a: Task, b: Task) => {
            const dateA = new Date(a.deadline).getTime();
            const dateB = new Date(b.deadline).getTime();
            return dateA - dateB;
          });

          setTasks(sortedTasks);
        } else {
          setError(response.data.message || "Failed to fetch tasks");
        }
      } catch (error: any) {
        
        console.error(
          "Error fetching tasks:",
          error.response?.data || error.message
        );
        setError(error.message || "An error occurred while fetching tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project.userId, project._id]);

  useEffect(() => {
    const fetchAudiences = async () => {
      setLoadingAudiences(true);
      setErrorAudiences(null);

      try {
        const response = await axios.post(
          "/api/audience/audienceListForProject",
          {
            userId: project.userId,
            projectId: project._id,
          }
        );

        if (response.status === 200) {
          setAudiences(response.data);
        } else {
          setErrorAudiences(
            response.data.message || "Failed to fetch audiences"
          );
        }
      } catch (error: any) {
        
        console.error(
          "Error fetching audiences:",
          error.response?.data || error.message
        );
        setErrorAudiences(
          error.message || "An error occurred while fetching audiences"
        );
      } finally {
        setLoadingAudiences(false);
      }
    };

    fetchAudiences();
  }, [project.userId, project._id]);


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "stopped":
        return "bg-red-500 text-white";
      case "ongoing":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays >= 30) {
      return "text-green-500"; // 1 month or more
    } else if (diffDays < 30 && diffDays >= 15) {
      return "text-yellow-500"; // Less than 15 days
    } else if (diffDays < 15 && diffDays >= 3) {
      return "text-yellow-500"; // Less than 15 days (same as above)
    } else if (diffDays < 3 && diffDays >= 0) {
      return "text-red-500"; // Less than 3 days
    } else {
      return "line-through text-gray-500"; // Passed deadlines
    }
  };

  const renderSocialLinks = () => {
    const socialIcons = [
      {
        name: "Instagram",
        icon: <Instagram />,
        link: project.socialLinks.instagram,
      },
      {
        name: "Facebook",
        icon: <Facebook />,
        link: project.socialLinks.facebook,
      },
      {
        name: "LinkedIn",
        icon: <Linkedin />,
        link: project.socialLinks.linkedin,
      },
      {
        name: "Google Drive",
        icon: <Upload />,
        link: project.socialLinks.drive,
      },
    ];
    return socialIcons.map((social, index) => {
      if (social.link) {
        return (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-10 h-10 flex items-center justify-center bg-gray-200 text-black-600 hover:bg-violet-200 hover:text-violet-800 rounded-full"
            )}
          >
            {social.icon}
          </a>
        );
      }
      return null;
    });
  };

  return (
    <div className="-mt-6 flex gap-4 pt-8">
      {/* Left side: Additional Info section */}
      <div className="flex-1 flex flex-col gap-4">
        <DataCard>
          <p>
            <strong>Industry:</strong> {project.industry}
          </p>
          <p>
            <strong>Transaction:</strong> {project.transaction}
          </p>
          <p>
            <strong>Investment:</strong> {project.investment} Rs
          </p>
          <p>
            <strong>Date Range:</strong>
            {` From ${new Date(
              project.dateRange.from
            ).toLocaleDateString()} to ${new Date(
              project.dateRange.to
            ).toLocaleDateString()}`}
          </p>
        </DataCard>

        <div className="flex gap-4">
          <div className="grid h-48 flex-1">
            <DataCard title="Competitors">
              <div>
                <strong>Competitors:</strong>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.competitors.map((competitor) => (
                  <a
                    key={competitor._id}
                    href={competitor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-full lg:w-auto justify-between font-normal border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition",
                      "bg-gray-200 text-black-600 hover:bg-violet-200 hover:text-violet-800 rounded p-2"
                    )}
                  >
                    {competitor.name}
                  </a>
                ))}
              </div>
              <div className="flex gap-4 pt-8">{renderSocialLinks()}</div>
            </DataCard>
          </div>

          <div className="grid h-[197px] flex-1 bg-slate-50 p-4 rounded-lg">
            {/* Audience Section Header */}
            <div className="flex items-center justify-between ">
              <h2 className="text-lg font-semibold">Audience</h2>
              {/* Profile Emoji to Redirect to Audience Page */}
              <div
                className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={() => (window.location.href = "/audience")} // Redirect to audience page
              >
                <span className="text-l">➕</span> {/* Profile Emoji */}
              </div>
            </div>

            {/* Audience Table */}
            <ScrollArea className="max-h-[290px] overflow-y-auto">
              <div>
                {loadingAudiences ? (
                  <p>Loading audiences...</p>
                ) : errorAudiences ? (
                  <p>No audiences found under this project</p>
                ) : (
                  <ScrollArea>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Phone Number</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {audiences.map((audience: any) => (
                          <TableRow key={audience._id}>
                            <TableCell>{audience.title}</TableCell>
                            <TableCell>{audience.category}</TableCell>
                            <TableCell>{audience.phoneNumber}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Right side: Tasks Table */}
      <div className="w-[400px] bg-slate-50 rounded-lg pl-4 pr-4 pt-4 pb-4">
        {/* Reminders Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reminders</h2>
          {/* Bell with Tooltip and Jingle Animation */}
          <div
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer group transition-transform hover:rotate-6"
            onClick={() => (window.location.href = "/tasks")} // Redirect to /tasks page
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.437L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
              />
            </svg>
            {/* Tooltip */}
            <span className="absolute bottom-[110%] left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View More
            </span>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="max-h-[290px] overflow-y-auto">
          {loading ? (
            <p>Loading tasks...</p>
          ) : error ? (
            <p>There are no Tasks under this project</p>
          ) : (
            <ScrollArea>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        {task.taskName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell className={getDeadlineColor(task.deadline)}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsGrid2;
