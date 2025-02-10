/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { deleteRequestWPData } from "@/actions/requestActions"; // Assuming the deleteRequestWPData function exists in requestActions

export const DELETE = async (req: NextRequest) => {
  // Establish a database connection
  await connect();
  try {
    // Parse the incoming request body to get the requestId
    const { requestId } = await req.json();

    // Ensure that requestId is provided in the request
    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    // Delete the RequestWP data based on the requestId
    const deletedRequestWP = await deleteRequestWPData(requestId);
    if (!deletedRequestWP) {
      return NextResponse.json(
        { error: "RequestWP not found or deletion failed." },
        { status: 404 }
      );
    }

    // Return a success response if deletion is successful
    return NextResponse.json(
      { message: "RequestWP deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting RequestWP:", error);
    return NextResponse.json(
      { error: "Failed to delete RequestWP: " + error.message },
      { status: 500 }
    );
  }
};
