/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteRequestAIData } from "@/actions/requestActions"; // Assuming this function exists in requestActions

export const DELETE = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the incoming request body to get the requestId
    const { requestId } = await req.json();
    
    // Ensure that requestId is provided in the request
    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }
    
    // Delete the RequestAI data based on the requestId
    const deletedRequestAI = await deleteRequestAIData(requestId);
    
    if (!deletedRequestAI) {
      return NextResponse.json({ error: "RequestAI not found or deletion failed." }, { status: 404 });
    }
    
    // Return a success response if deletion is successful
    return NextResponse.json({ message: "RequestAI deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting RequestAI:", error);
    return NextResponse.json({ error: "Failed to delete RequestAI: " + error.message }, { status: 500 });
  }
};
