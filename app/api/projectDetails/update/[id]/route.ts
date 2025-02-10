/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateProjectData } from "@/actions/projectActions"; // Assuming this function exists

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  // Establish a database connection
  await connect();

  const { id } = params; // Extract the project ID from the URL parameters

  try {
    // Parse the request body to get the updated project data
    const updatedData = await req.json();

    // Update the project data based on the project ID and provided data
    const updatedProject = await updateProjectData(id, updatedData);
    
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found or update failed." }, { status: 404 });
    }

    // Return a success response if update is successful
    return NextResponse.json({ message: "Project updated successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project: " + error.message }, { status: 500 });
  }
};
