/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAllTasksByUserId } from "@/actions/taskActions"; // Assuming this function exists in taskActions
export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the request body to get the userId
    const { userId } = await req.json();
    // Ensure that userId is provided in the request body
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    // Fetch all tasks for the given userId
    const tasks = await getAllTasksByUserId(userId);
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "No tasks found for this user." }, { status: 404 });
    }
    // Return the fetched tasks
    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks: " + error.message }, { status: 500 });
  }
};
