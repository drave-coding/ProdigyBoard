/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAllTasksByUserIdAndProjectId } from "@/actions/taskActions"; // Assuming this function exists in taskActions

export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();

  try {
    // Parse the request body to get the userId and projectId
    const { userId, projectId } = await req.json();

    // Validate the request body
    if (!userId || !projectId) {
      return NextResponse.json(
        { error: "userId and projectId are required" },
        { status: 400 }
      );
    }

    // Fetch tasks for the given userId and projectId
    const tasks = await getAllTasksByUserIdAndProjectId(userId, projectId);

    // Check if tasks exist
    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks found for this user and project." },
        { status: 404 }
      );
    }

    // Return the fetched tasks
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks: " + error.message },
      { status: 500 }
    );
  }
};
