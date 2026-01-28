import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDonations } from "@/lib/services/donation.service";
import {
  successResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api-response";

// Direct donation creation disabled
export async function POST(req) {
  return forbiddenResponse("Direct donation not allowed. Use payment gateway.");
}

// GET donations list (Admin only)
export async function GET(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const paymentStatus = searchParams.get("paymentStatus");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit")) || 20;

    const result = await getDonations({
      campaignId,
      paymentStatus,
      cursor,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    console.error("Failed to fetch donations:", error);
    return errorResponse("Failed to fetch donations", 500);
  }
}
