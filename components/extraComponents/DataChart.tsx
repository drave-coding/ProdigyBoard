/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";

import PieChart from "./PieChart";
import DonutChart from "./DonutChart";
interface DataChartProps {
  userId: string;
}


const DataChart: React.FC<DataChartProps> = ({ userId }) => {

  const [projects, setProjects] = useState<any[]>([]);
  const [audience, setAudience] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [loadingAudience, setLoadingAudience] = useState<boolean>(true);
  const [errorProjects, setErrorProjects] = useState<string | null>(null);
  const [errorAudience, setErrorAudience] = useState<string | null>(null);

  // Fetch Projects Data
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setErrorProjects(null);
    try {
      
      const response = await axios.post("/projects/stats", { userId });
      setProjects(response.data || []);
    } catch (error: any) {
      

        console.error("Error fetching projects:", error.response?.data || error.message);
        setErrorProjects(error.message || "Failed to fetch projects.");
      
    } finally {
      setLoadingProjects(false);
    }
  }, [userId]);

  // Fetch Audience Data
  const fetchAudience = useCallback(async () => {
    setLoadingAudience(true);
    setErrorAudience(null);
    try {
    
      const response = await axios.post("/audience/audienceList", { userId });
      setAudience(response.data || []);
    } catch (error: any) {
      
      console.error("Error fetching audience:", error.response?.data || error.message);
      setErrorAudience(error.message || "Failed to fetch audience.");
    } finally {
      setLoadingAudience(false);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      // Stagger the API calls
      await fetchProjects();  // Wait for projects to load first
      await fetchAudience();  // Then fetch audience data
    };

    fetchData();
  }, [fetchProjects, fetchAudience]);

  const processChartData = () => {
    const investmentData: Record<string, number> = {};
    const industryData: Record<string, number> = {};
    const transactionData: Record<string, number> = {};
    const audienceData: Record<string, number> = {};

    projects.forEach((project) => {
      investmentData[project.projectName] =
        (investmentData[project.projectName] || 0) + project.investment;

      industryData[project.industry] =
        (industryData[project.industry] || 0) + 1;

      transactionData[project.transaction] =
        (transactionData[project.transaction] || 0) + 1;
    });

    audience.forEach((audienceItem) => {
      const projectName = audienceItem.project.projectName;

      audienceData[projectName] = (audienceData[projectName] || 0) + 1;
    });

    const createChartData = (data: Record<string, number>) => ({
      labels: Object.keys(data),
      datasets: [
        {
          label: "Count",
          data: Object.values(data),
          backgroundColor: Object.keys(data).map(
            (_, i) =>
              `hsl(${(i * 360) / Object.keys(data).length}, 60%, 70%)`
          ),
          hoverBackgroundColor: Object.keys(data).map(
            (_, i) =>
              `hsl(${(i * 360) / Object.keys(data).length}, 70%, 80%)`
          ),
        },
      ],
    });

    return {
      investment: createChartData(investmentData),
      industry: createChartData(industryData),
      transaction: createChartData(transactionData),
      audience: createChartData(audienceData),
    };
  };

  const chartData = processChartData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {loadingProjects ? (
        <div className="col-span-3 text-center flex justify-around p-4 mb-6 rounded-lg bg-slate-50">
          Loading Projects...
        </div>
      ) : errorProjects ? (
        <div className="col-span-3 text-center w-full p-4 bg-slate-50 rounded-lg">
          Nothing to Show for Projects
        </div>
      ) : (
        <div className="col-span-3 bg-white p-4 rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-left">Project Stats:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg shadow-lg bg-gray-50 border border-gray-200">
              <DonutChart
                title="Industry Distribution"
                data={chartData.industry}
              />
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-gray-50 border border-gray-200">
              <DonutChart
                title="Transaction Types"
                data={chartData.transaction}
              />
            </div>
            <div className="p-4 rounded-lg shadow-lg bg-gray-50 border border-gray-200">
              <PieChart
                title="Investment Distribution"
                data={chartData.investment}
              />
            </div>
          </div>
        </div>
      )}

      {loadingAudience ? (
        <div className="col-span-1 text-center flex justify-around p-4 mb-6 rounded-lg bg-slate-50">
          Loading Audience...
        </div>
      ) : errorAudience ? (
        <div className="col-span-1 text-center w-full p-4 bg-slate-50 rounded-lg">
          Nothing to Show for Audience
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <PieChart title="Audience per Project" data={chartData.audience} />
        </div>
      )}
    </div>
  );
};

export default DataChart;
