import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logPaymentSuccess } from "@/lib/services/audit.service";

// Razorpay webhook secret (set in Razorpay Dashboard)
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

function verifyWebhookSignature(body, signature) {
  if (!WEBHOOK_SECRET) {
    console.error("RAZORPAY_WEBHOOK_SECRET not configured");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 },
      );
    }

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    // Handle payment captured event
    if (eventType === "payment.captured") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Find donation by orderId
      const donation = await prisma.donation.findUnique({
        where: { orderId },
        include: { campaign: true },
      });

      if (!donation) {
        console.error("Donation not found for orderId:", orderId);
        return NextResponse.json({
          success: true,
          message: "Donation not found, skipping",
        });
      }

      // Skip if already completed
      if (donation.paymentStatus === "completed") {
        return NextResponse.json({
          success: true,
          message: "Already processed",
        });
      }

      // Complete the donation
      await prisma.$transaction(async (tx) => {
        // Update donation status
        await tx.donation.update({
          where: { id: donation.id },
          data: {
            paymentStatus: "completed",
            paymentId: paymentId,
          },
        });

        // Update campaign raised amount
        await tx.campaign.update({
          where: { id: donation.campaignId },
          data: {
            raisedAmount: { increment: donation.amount },
          },
        });
      });

      // Log success
      await logPaymentSuccess({
        donationId: donation.id,
        paymentId,
        orderId,
        source: "webhook",
      });

      console.log("Webhook: Payment completed for donation:", donation.id);
      return NextResponse.json({ success: true, message: "Payment processed" });
    }

    // Handle payment failed event
    if (eventType === "payment.failed") {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;

      // Update donation status to failed
      await prisma.donation.updateMany({
        where: { orderId, paymentStatus: "pending" },
        data: { paymentStatus: "failed" },
      });

      console.log("Webhook: Payment failed for orderId:", orderId);
      return NextResponse.json({ success: true, message: "Failure recorded" });
    }

    // Acknowledge other events
    return NextResponse.json({ success: true, message: "Event received" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
