/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/projectDetails/delete/[id]/route.ts
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteProjectData } from "@/actions/projectActions";

// Establish a database connection
await connect();

// Handle DELETE requests for deleting the project
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // Extract the project ID from the URL parameters

  try {
    // Delete project based on the project ID
    const deletedProject = await deleteProjectData(id);
    
    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    // Return success response
    return NextResponse.json({ message: "Project deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project: " + error.message }, { status: 500 });
  }
};
