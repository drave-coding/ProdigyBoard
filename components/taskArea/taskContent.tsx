"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import TaskEditDialog from "./taskEditDialog";
import TaskDeleteDialog from "./taskDeleteDialog";

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

const TaskContent: React.FC = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/task/taskList", {
        userId: user.id,
      });

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        const sortedTasks = response.data.sort((a: Task, b: Task) => {
          const dateA = new Date(a.deadline).getTime();
          const dateB = new Date(b.deadline).getTime();
          return dateA - dateB;
        });

        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks);

      } else {
        setTasks([]);
        setFilteredTasks([]);
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        setTasks([]);
        setFilteredTasks([]);
      } else {
        setError(error.message || "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || task.status.toLowerCase() === statusFilter.toLowerCase())
    );

    const sorted = statusFilter === "All" ? filtered : sortTasksByStatus(filtered, ["completed", "ongoing", "stopped"]);
    setFilteredTasks(sorted);
  }, [searchQuery, statusFilter, tasks]);

  const sortTasksByStatus = (tasksToSort: Task[], statusOrder: string[]) => {
    return tasksToSort.sort((a, b) => {
      const indexA = statusOrder.indexOf(a.status.toLowerCase());
      const indexB = statusOrder.indexOf(b.status.toLowerCase());
      return indexA - indexB;
    });
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteTask(task);
  };

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
      return "text-green-500";
    } else if (diffDays < 30 && diffDays >= 15) {
      return "text-yellow-500";
    } else if (diffDays < 15 && diffDays >= 3) {
      return "text-yellow-500";
    } else if (diffDays < 3 && diffDays >= 0) {
      return "text-red-500";
    } else {
      return "line-through text-gray-500";
    }
  };

  return (
    <div className="max-w-[1400px] bg-slate-50 rounded-lg p-4 -mt-8">
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
            <Input
              placeholder="Search by task name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Select
              onValueChange={(value) => setStatusFilter(value)}
              value={statusFilter}
            >
              <SelectTrigger className="w-full max-w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Section */}
          <div className="max-h-[450px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Task</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell className="font-medium hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        {task.taskName}
                      </TableCell>
                      <TableCell className="bg-slate-50 rounded-lg hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate max-w-xs">
                                {task.content.split(" ").slice(0, 6).join(" ")}...
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-100 text-black p-4 rounded-lg shadow-md max-w-[300px]">
                              <p>{task.content}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                      </TableCell>
                      <TableCell className="hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all">
                        {task.project.projectName}
                      </TableCell>
                      <TableCell
                        className={`hover:shadow-md hover:rounded-lg hover:bg-gray-50 transition-all ${getDeadlineColor(
                          task.deadline
                        )}`}
                      >
                        {new Date(task.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleEditTask(task)}
                              >
                                <FaEdit className="h-5 w-5 text-primary" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Task</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTask(task)}
                              >
                                <FaTrashAlt className="h-5 w-5 text-destructive" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Task</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No tasks available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Task Edit Dialog */}
      {editTask && (
        <TaskEditDialog
          task={editTask}
          onClose={() => setEditTask(null)}
          onTaskUpdate={fetchTasks}
        />
      )}

      {/* Task Delete Dialog */}
      {deleteTask && (
        <TaskDeleteDialog
          task={deleteTask}
          onClose={() => setDeleteTask(null)}
        />
      )}
    </div>
  );
};

export default TaskContent;
