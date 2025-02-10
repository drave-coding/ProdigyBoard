/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/profile/update/route.ts
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { updateProfileData } from "@/actions/profileActions";  // Assuming this function exists in profileActions

export const PATCH = async (req: NextRequest) => {
  // Establish a database connection
  await connect();

  try {
    // Parse the request body to get the updated profile data and userId
    const { userId, ...updatedData } = await req.json();

    // Ensure that userId is provided in the request
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Update the profile data based on the userId and provided data
    const updatedProfile = await updateProfileData(userId, updatedData);

    if (!updatedProfile) {
      return NextResponse.json({ error: "Profile not found or update failed." }, { status: 404 });
    }

    // Return a success response if update is successful
    return NextResponse.json({ message: "Profile updated successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile: " + error.message }, { status: 500 });
  }
};
