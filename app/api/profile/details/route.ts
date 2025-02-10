/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getProfileDataByUserId } from "@/actions/profileActions";

export const POST = async (req: NextRequest) => {
  // Establish a database connection
  await connect();

  try {
    // Parse the request body to get the userId
    const { userId } = await req.json();

    // Ensure that userId is provided in the request body
    if (!userId) {
      return NextResponse.json({ error: "userId is required." }, { status: 400 });
    }

    // Fetch profile data using the userId
    const profile = await getProfileDataByUserId(userId);

    // Check if profile exists
    if (!profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    // Return the profile data
    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile: " + error.message }, { status: 500 });
  }
};
