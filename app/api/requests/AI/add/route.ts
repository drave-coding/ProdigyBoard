/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeRequestAIData } from "@/actions/requestActions"; // Assuming this function exists in requestActions

export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the incoming request data to get the RequestAI data
    const requestAIData = await req.json();
    
    // Ensure that all required fields are provided
    if (
      !requestAIData.content ||
      !requestAIData.project?.projectId ||
      !requestAIData.project?.projectName ||
      !requestAIData.userId ||
      !requestAIData.link
    ) {
      return NextResponse.json({ error: "All fields are required for RequestAI, including project details and link." }, { status: 400 });
    }

    // Call the storeRequestAIData function to store the RequestAI in the database
    const requestAI = await storeRequestAIData(requestAIData);
    
    // Return the stored RequestAI data in the response
    return NextResponse.json(requestAI, { status: 201 });
  } catch (error: any) {
    console.error("Error storing RequestAI:", error);
    return NextResponse.json({ error: "Failed to store RequestAI: " + error.message }, { status: 500 });
  }
};
