/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DataChart from "@/components/extraComponents/DataChart";
import DataGrid from "@/components/extraComponents/dataGrid";
import TopSection from "@/components/TopSection";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DashBoardPage() {
  const { user } = useUser(); // Fetch user details
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserId(user.id); // Set userId when user data is available
    }
  }, [user]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pl-10 pr-10 pb-2 pt-3">
      <TopSection />
      <div className="-mt-8">
        <DataGrid userId={userId} />
        <DataChart userId={userId} />
      </div>
    </div>
  );
}
