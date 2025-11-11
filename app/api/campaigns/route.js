import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET() {
  try {
    await dbConnect();
    const campaigns = await Campaign.find({ status: "active" })
      .select("title goalAmount raisedAmount")
      .limit(20);

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ campaigns: [] }, { status: 200 });
  }
}
