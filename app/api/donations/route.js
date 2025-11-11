import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose"; // Add this

export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();

    // Check if campaign ID is valid
    if (body.campaign && !mongoose.Types.ObjectId.isValid(body.campaign)) {
      // Dummy data hai, so ignore
      delete body.campaign;
    }

    const donation = await Donation.create(body);

    if (body.campaign) {
      await Campaign.findByIdAndUpdate(body.campaign, {
        $inc: { raisedAmount: body.amount },
      });
    }

    return NextResponse.json(
      { message: "Donation saved successfully", donation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Donation error:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
