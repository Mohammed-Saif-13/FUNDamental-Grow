import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";

export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();

    const volunteer = await Volunteer.create({
      ...body,
      status: "pending", // Admin will approve
    });

    return NextResponse.json(
      { message: "Application submitted successfully", volunteer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Volunteer error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    return NextResponse.json({ volunteers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ volunteers: [] }, { status: 200 });
  }
}
