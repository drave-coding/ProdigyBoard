/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeRequestDSData } from "@/actions/requestActions"; // Assuming this function exists in requestActions

export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the incoming request data to get the RequestDS data
    const requestDSData = await req.json();
    
    // Ensure that all required fields are provided
    if (
      !requestDSData.content ||
      !requestDSData.project?.projectId ||
      !requestDSData.project?.projectName ||
      !requestDSData.userId
    ) {
      return NextResponse.json({ error: "All fields are required for RequestDS, including project details." }, { status: 400 });
    }

    // Call the storeRequestDSData function to store the RequestDS in the database
    const requestDS = await storeRequestDSData(requestDSData);
    
    // Return the stored RequestDS data in the response
    return NextResponse.json(requestDS, { status: 201 });
  } catch (error: any) {
    console.error("Error storing RequestDS:", error);
    return NextResponse.json({ error: "Failed to store RequestDS: " + error.message }, { status: 500 });
  }
};
