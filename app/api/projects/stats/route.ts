/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getStatsProjectByUserId } from "@/actions/projectActions";
export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the request body to get the userId
    const { userId } = await req.json();
    // Ensure that userId is provided in the request body
    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }
    // Fetch projects using the userId
    const projects = await getStatsProjectByUserId(userId);
    // Check if any projects exist for the given userId
    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found for the given userId." }, { status: 404 });
    }
    // Return the project data (name, ID, and date range)
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects: " + error.message }, { status: 500 });
  }
};
