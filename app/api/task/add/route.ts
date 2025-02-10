/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeTaskData } from "@/actions/taskActions"; // Assuming the storeTaskData function is in taskActions
export const POST = async (req: NextRequest) => {
  await connect(); // Connect to the database
  try {
    // Parse the incoming request data to get the task data
    const taskData = await req.json();
    
    // Ensure that all required fields are provided
    if (
      !taskData.taskName ||
      !taskData.content ||
      !taskData.status ||
      !taskData.project?.projectId ||
      !taskData.project?.projectName ||
      !taskData.userId ||
      !taskData.deadline
    ) {
      return NextResponse.json({ error: "All task fields are required, including project details." }, { status: 400 });
    }
    // Call the storeTaskData function to store the task in the database
    const task = await storeTaskData(taskData);
    // Return the stored task data in the response
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    console.error("Error storing task:", error);
    return NextResponse.json({ error: "Failed to store task: " + error.message }, { status: 500 });
  }
};
