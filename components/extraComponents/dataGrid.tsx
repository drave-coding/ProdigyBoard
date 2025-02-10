/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import PieChart from "./PieChart"; // Assuming PieChart is in the same directory

import axios from "@/lib/axios";

interface DataGridProps {
  userId: string;
}

const DataGrid: React.FC<DataGridProps> = ({ userId }) => {
  const [aiRequests, setAiRequests] = useState<any[]>([]);
  const [wpRequests, setWpRequests] = useState<any[]>([]);
  const [dsRequests, setDsRequests] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to count status-wise entries (completed, ongoing, stopped)
  const countStatusData = (entries: any[]) => {
    const statusCounts = { completed: 0, ongoing: 0, stopped: 0 };
    entries.forEach((entry: any) => {
      if (entry.status === "completed" || entry.status === "Completed")
        statusCounts.completed++;
      if (entry.status === "ongoing" || entry.status === "Ongoing")
        statusCounts.ongoing++;
      if (entry.status === "stopped" || entry.status === "Stopped")
        statusCounts.stopped++;
    });
    return statusCounts;
  };

  // Fetch AI Requests
  const fetchAiRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/requests/AI/get", { userId });
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        setAiRequests(response.data);
      } else {
        setAiRequests([]); // Empty array when no data found, avoiding 404 error
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setAiRequests([]); // Treating 404 as empty data
      } else {
        console.error(
          "Error fetching AI requests:",
          error.response?.data || error.message
        );
        setError(error.message || "Failed to fetch AI requests");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch WP Requests
  const fetchWpRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/requests/WP/get", { userId });
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        setWpRequests(response.data);
      } else {
        setWpRequests([]); // Empty array when no data found, avoiding 404 error
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setWpRequests([]); // Treating 404 as empty data
      } else {
        console.error(
          "Error fetching WP requests:",
          error.response?.data || error.message
        );
        setError(error.message || "Failed to fetch WP requests");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch DS Requests
  const fetchDsRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/requests/DS/get", { userId });
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        setDsRequests(response.data);
      } else {
        setDsRequests([]); // Empty array when no data found, avoiding 404 error
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setDsRequests([]); // Treating 404 as empty data
      } else {
        console.error(
          "Error fetching DS requests:",
          error.response?.data || error.message
        );
        setError(error.message || "Failed to fetch DS requests");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch Tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/task/taskList", { userId });
      if (
        response.status === 200 &&
        response.data &&
        response.data.length > 0
      ) {
        setTasks(response.data);
      } else {
        setTasks([]); // Empty array when no data found, avoiding 404 error
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setTasks([]); // Treating 404 as empty data
      } else {
        console.error(
          "Error fetching tasks:",
          error.response?.data || error.message
        );
        setError(error.message || "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchAiRequests(); // Fetch AI Requests first
      await fetchWpRequests(); // Then fetch WP Requests
      await fetchDsRequests(); // Then fetch DS Requests
      await fetchTasks(); // Finally fetch Tasks
    };
    fetchAllData();
  }, [fetchAiRequests, fetchWpRequests, fetchDsRequests, fetchTasks]);

  // Pie chart data format
  const pieChartData = (statusCounts: any) => ({
    labels: ["Completed", "Ongoing", "Stopped"],
    datasets: [
      {
        label: "Task Status",
        data: [
          statusCounts.completed,
          statusCounts.ongoing,
          statusCounts.stopped,
        ],
        backgroundColor: ["#4CAF50", "#fed400", "#fe0000"],
        hoverBackgroundColor: ["#388E3C", "#fed400", "#fe0000"],
      },
    ],
  });

  if (loading)
    return (
      <div className="flex justify-around p-4 mb-6 rounded-lg bg-slate-50">
        Loading...
      </div>
    );
  if (error) return <div>{error}</div>;

  // Count status for each data section
  const aiStatusCounts = countStatusData(aiRequests);
  const wpStatusCounts = countStatusData(wpRequests);
  const dsStatusCounts = countStatusData(dsRequests);
  const taskStatusCounts = countStatusData(tasks);

  // Check if any section has no data to show
  const noDataToShow = {
    ai: aiRequests.length === 0,
    wp: wpRequests.length === 0,
    ds: dsRequests.length === 0,
    tasks: tasks.length === 0,
  };

  return (
    <div className="flex justify-around pb-4 space-x-3">
      <div className="w-full md:w-1/4 p-4 bg-slate-50 rounded-lg">
        {noDataToShow.ai ? (
          <div className="text-center">Nothing to show</div>
        ) : (
          <PieChart title="AI Requests" data={pieChartData(aiStatusCounts)} />
        )}
      </div>
      <div className="w-full md:w-1/4 p-4 bg-slate-50 rounded-lg">
        {noDataToShow.wp ? (
          <div className="text-center">Nothing to show</div>
        ) : (
          <PieChart title="WP Requests" data={pieChartData(wpStatusCounts)} />
        )}
      </div>
      <div className="w-full md:w-1/4 p-4 bg-slate-50 rounded-lg">
        {noDataToShow.ds ? (
          <div className="text-center">Nothing to show</div>
        ) : (
          <PieChart title="DS Requests" data={pieChartData(dsStatusCounts)} />
        )}
      </div>
      <div className="w-full md:w-1/4 p-4 bg-slate-50 rounded-lg">
        {noDataToShow.tasks ? (
          <div className="text-center">Nothing to show</div>
        ) : (
          <PieChart title="Tasks" data={pieChartData(taskStatusCounts)} />
        )}
      </div>
    </div>
  );
};

export default DataGrid;
