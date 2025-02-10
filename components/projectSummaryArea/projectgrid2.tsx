"use client";

import { useState, useEffect } from "react";
import AITopSection from "../requestSection/AI/AItopSection";
import AIContent from "../requestSection/AI/AIcontent";
import WPContent from "../requestSection/WP/WPcontent";
import WPTopSection from "../requestSection/WP/WPtopSection";
import DSTopSection from "../requestSection/DS/DStopSection";
import DSContent from "../requestSection/DS/DScontent";

const ProjectGrid2 = () => {
  const [selectedTab, setSelectedTab] = useState<string | null>(null); // No default tab selected

  // Load the saved tab from localStorage when the component mounts
  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");
    if (savedTab) {
      setSelectedTab(savedTab);
    }
  }, []);

  // Save the selected tab to localStorage whenever it changes
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  // Render content dynamically based on the selected tab
  const renderContent = () => {
    if (!selectedTab) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-gray-700">
            Request Area
          </h2>
          <p className="text-gray-500">
            Select a tab to view the requests and manage them.
          </p>
        </div>
      );
    }

    switch (selectedTab) {
      case "wpBulker":
        return (
          <div>
            <div className="pb-6">
              <WPTopSection />
            </div>
            <div>
              <WPContent />
            </div>
          </div>
        );
      case "aiCaller":
        return (
          <div>
            <div className="pb-6">
              <AITopSection />
            </div>
            <div>
              <AIContent />
            </div>
          </div>
        );
      case "dataScraper":
        return (
          <div>
            <div className="pb-6">
              <DSTopSection />
            </div>
            <div>
              <DSContent />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-lg h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex space-x-2 pt-4 pl-4">
        <button
          className={`py-2 px-4 ${
            selectedTab === "wpBulker"
              ? "bg-violet-500 text-white rounded-t-2xl shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-t-lg"
          }`}
          onClick={() => handleTabChange("wpBulker")}
        >
          WP Bulker
        </button>
        <button
          className={`py-2 px-4 ${
            selectedTab === "aiCaller"
              ? "bg-violet-500 text-white rounded-t-2xl shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-t-lg"
          }`}
          onClick={() => handleTabChange("aiCaller")}
        >
          AI Caller
        </button>
        <button
          className={`py-2 px-4 ${
            selectedTab === "dataScraper"
              ? "bg-violet-500 text-white rounded-t-2xl shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-t-lg"
          }`}
          onClick={() => handleTabChange("dataScraper")}
        >
          Data Scraper
        </button>
      </div>
      {/* White Line */}
      <div className="h-1 bg-white border-t border-gray-300" />
      {/* Content Section */}
      <div>{renderContent()}</div>
    </div>
  );
};

export default ProjectGrid2;
