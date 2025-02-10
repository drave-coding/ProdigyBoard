/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateTaskData } from "@/actions/taskActions"; // Assuming the updateTaskData function exists in taskActions
export const PATCH = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the request body to get the taskId and updated task data
    const { taskId, ...updatedData } = await req.json();
    // Ensure that taskId is provided in the request
    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }
    // Update the task data based on the taskId and provided data
    const updatedTask = await updateTaskData(taskId, updatedData);
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found or update failed." }, { status: 404 });
    }
    // Return a success response if update is successful
    return NextResponse.json({ message: "Task updated successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task: " + error.message }, { status: 500 });
  }
};
