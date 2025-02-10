/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllAudiencesByUserIdAndProjectId } from "@/actions/audienceAction";
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


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

    // Fetch audiences for the given userId and projectId
    const audiences = await getAllAudiencesByUserIdAndProjectId(userId, projectId);

    // Check if audiences exist
    if (!audiences || audiences.length === 0) {
      return NextResponse.json(
        { error: "No audiences found for this user and project." },
        { status: 404 }
      );
    }

    // Return the fetched audiences
    return NextResponse.json(audiences, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching audiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch audiences: " + error.message },
      { status: 500 }
    );
  }
};
