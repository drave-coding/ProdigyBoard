/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteRequestDSData } from "@/actions/requestActions"; // Assuming this function exists in requestActions

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
    
    // Delete the RequestDS data based on the requestId
    const deletedRequestDS = await deleteRequestDSData(requestId);
    
    if (!deletedRequestDS) {
      return NextResponse.json({ error: "RequestDS not found or deletion failed." }, { status: 404 });
    }
    
    // Return a success response if deletion is successful
    return NextResponse.json({ message: "RequestDS deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting RequestDS:", error);
    return NextResponse.json({ error: "Failed to delete RequestDS: " + error.message }, { status: 500 });
  }
};
