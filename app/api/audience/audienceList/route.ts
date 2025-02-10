/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllAudiencesByUserId } from "@/actions/audienceAction";
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// Route for fetching all audiences by userId
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

    // Fetch all audiences for the given userId
    const audiences = await getAllAudiencesByUserId(userId);
    if (!audiences || audiences.length === 0) {
      return NextResponse.json({ error: "No audiences found for this user." }, { status: 404 });
    }

    // Return the fetched audiences
    return NextResponse.json(audiences, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching audiences:", error);
    return NextResponse.json({ error: "Failed to fetch audiences: " + error.message }, { status: 500 });
  }
};
