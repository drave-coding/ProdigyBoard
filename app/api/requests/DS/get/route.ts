/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAllRequestDSByUserId } from "@/actions/requestActions"; // Assuming this function exists in requestActions

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
    
    // Fetch all RequestDS entries for the given userId
    const requestsDS = await getAllRequestDSByUserId(userId);
    
    if (!requestsDS || requestsDS.length === 0) {
      return NextResponse.json({ error: "No RequestDS entries found for this user." }, { status: 404 });
    }
    
    // Return the fetched RequestDS entries
    return NextResponse.json(requestsDS, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching RequestDS entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch RequestDS entries: " + error.message },
      { status: 500 }
    );
  }
};
