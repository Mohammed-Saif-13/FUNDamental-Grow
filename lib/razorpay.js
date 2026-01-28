import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export async function createOrder(amountInRupees) {
  try {
    const amountInPaise = Math.round(amountInRupees * 100);

    const order = await getRazorpayInstance().orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return order;
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw new Error("Failed to create payment order");
  }
}

export function verifySignature(orderId, paymentId, signature) {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}
