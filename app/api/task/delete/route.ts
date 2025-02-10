/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteTaskData } from "@/actions/taskActions"; // Assuming the deleteTaskData function exists in taskActions
export const DELETE = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the incoming request body to get the taskId
    const { taskId } = await req.json();
    // Ensure that taskId is provided in the request
    if (!taskId) {
      return NextResponse.json({ error: "taskId is required" }, { status: 400 });
    }
    // Delete the task data based on the taskId
    const deletedTask = await deleteTaskData(taskId);
    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found or deletion failed." }, { status: 404 });
    }
    // Return a success response if deletion is successful
    return NextResponse.json({ message: "Task deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task: " + error.message }, { status: 500 });
  }
};
