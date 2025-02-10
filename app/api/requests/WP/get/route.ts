/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAllRequestWPByUserId } from "@/actions/requestActions"; // Assuming this function exists in requestActions

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

    // Fetch all RequestWP entries for the given userId
    const requestsWP = await getAllRequestWPByUserId(userId);
    if (!requestsWP || requestsWP.length === 0) {
      return NextResponse.json(
        { error: "No RequestWP entries found for this user." },
        { status: 404 }
      );
    }

    // Return the fetched RequestWP entries
    return NextResponse.json(requestsWP, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching RequestWP entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch RequestWP entries: " + error.message },
      { status: 500 }
    );
  }
};
