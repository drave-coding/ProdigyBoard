/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeRequestWPData } from "@/actions/requestActions"; // Assuming this function is implemented

export const POST = async (req: NextRequest) => {
  await connect(); // Connect to the database
  try {
    // Parse the incoming request data to get the WP request data
    const requestData = await req.json();

    // Validate required fields
    if (
      !requestData.content ||
      !requestData.project?.projectId ||
      !requestData.project?.projectName ||
      !requestData.userId ||
      !requestData.link
    ) {
      return NextResponse.json(
        { error: "All fields except status and remarks are required." },
        { status: 400 }
      );
    }

    // Call the function to store the RequestWP in the database
    const requestWP = await storeRequestWPData(requestData);

    // Return the stored RequestWP data in the response
    return NextResponse.json(requestWP, { status: 201 });
  } catch (error: any) {
    console.error("Error storing RequestWP:", error);
    return NextResponse.json(
      { error: "Failed to store RequestWP: " + error.message },
      { status: 500 }
    );
  }
};
