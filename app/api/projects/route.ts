/* eslint-disable @typescript-eslint/no-explicit-any */
// app/projects/route.ts
import { connect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { storeProjectData } from "@/actions/projectActions";

await connect();

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.json();
    const project = await storeProjectData(formData);
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    console.error("Error storing project:", error);
    return NextResponse.json({ error: "Failed to store project: " + error.message }, { status: 500 });
  }
};
