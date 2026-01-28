import { NextResponse } from "next/server";
import { verifySignature } from "@/lib/razorpay";
import {
  getDonationByOrderId,
  completeDonation,
} from "@/lib/services/donation.service";
import {
  logPaymentSuccess,
  logPaymentFailed,
} from "@/lib/services/audit.service";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { handleAPIError } from "@/lib/api-error";

export async function POST(req) {
  // CSRF check
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, "payment", "verify");
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const { orderId, paymentId, signature } = body;

    // Validate required fields
    if (!orderId || !paymentId || !signature) {
      await logPaymentFailed({
        donationId: null,
        reason: "Missing payment data",
        req,
      });
      return NextResponse.json(
        { success: false, message: "Missing payment data" },
        { status: 400 },
      );
    }

    // Verify Razorpay signature
    const isValid = verifySignature(orderId, paymentId, signature);

    if (!isValid) {
      await logPaymentFailed({
        donationId: null,
        reason: "Invalid signature",
        req,
      });
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 },
      );
    }

    // Get donation by orderId using service
    const donation = await getDonationByOrderId(orderId);

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 },
      );
    }

    // Check if already completed
    if (donation.paymentStatus === "completed") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        donationId: donation.id,
      });
    }

    // Complete donation using service (handles transaction)
    const result = await completeDonation(orderId, paymentId, signature);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Failed to complete donation" },
        { status: 500 },
      );
    }

    // Log success
    await logPaymentSuccess({
      donationId: result.id,
      paymentId,
      orderId,
      req,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      donationId: result.id,
      campaignSlug: donation.campaign?.slug,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.statusCode },
    );
  }
}
