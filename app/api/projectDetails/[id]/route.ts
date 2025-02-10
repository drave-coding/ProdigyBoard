/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/projectDetails/[id]/route.ts
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getProjectData } from "@/actions/projectActions";

// Establish a database connection
await connect();

// Handle GET requests
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // Extract the project ID from the URL parameters

  try {
    // Fetch project data based on the project ID
    const project = await getProjectData(id);
    
    // Check if project exists
    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    // Return the project data
    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project: " + error.message }, { status: 500 });
  }
};


