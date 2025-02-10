/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/profile/add/route.ts
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeProfileData } from "@/actions/profileActions";  // Assuming the function is created in profileActions

await connect();

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.json();
    const profile = await storeProfileData(formData);  // Call the storeProfileData function to save the profile
    return NextResponse.json(profile, { status: 201 });
  } catch (error: any) {
    console.error("Error storing profile:", error);
    return NextResponse.json({ error: "Failed to store profile: " + error.message }, { status: 500 });
  }
};
