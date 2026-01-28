import { NextResponse } from "next/server";
import { createOrder } from "@/lib/razorpay";
import { createPendingDonation } from "@/lib/services/donation.service";
import { logPaymentInitiated } from "@/lib/services/audit.service";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { handleAPIError } from "@/lib/api-error";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "payment", "create-order");
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const {
      amount,
      campaignId,
      donorName,
      donorEmail,
      donorPhone,
      message,
      anonymous,
    } = body;

    if (!amount || !campaignId || !donorName || !donorEmail) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 },
      );
    }

    const razorpayOrder = await createOrder(amount);

    const donation = await createPendingDonation({
      amount,
      campaignId,
      donorName,
      donorEmail,
      donorPhone,
      message,
      anonymous,
      orderId: razorpayOrder.id,
    });

    await logPaymentInitiated({
      donationId: donation.id,
      amount,
      campaignId,
      req,
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      donationId: donation.id,
    });
  } catch (error) {
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.statusCode },
    );
  }
}
