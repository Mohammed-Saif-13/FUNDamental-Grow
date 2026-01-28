import { z } from "zod";
import { emailSchema, nameSchema, booleanSchema, idSchema } from "./common";
import { DONATION_CONFIG } from "@/lib/constants";

const { MIN_AMOUNT, MAX_AMOUNT, WARNING_THRESHOLD } = DONATION_CONFIG;

// Phone validation - optional and flexible
const optionalPhoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number")
  .optional()
  .or(z.literal(""))
  .nullable()
  .transform((val) => val || null);

// Donation creation schema (used in payment flow)
export const donationSchema = z.object({
  amount: z.coerce
    .number()
    .min(MIN_AMOUNT, `Minimum donation is ₹${MIN_AMOUNT}`)
    .max(MAX_AMOUNT, `Maximum donation is ₹${MAX_AMOUNT.toLocaleString()}`),
  donorName: nameSchema,
  donorEmail: emailSchema,
  donorPhone: optionalPhoneSchema,
  message: z
    .string()
    .max(500, "Message is too long")
    .optional()
    .or(z.literal(""))
    .nullable(),
  anonymous: booleanSchema.default(false),
  campaignId: idSchema,
});

// Payment order creation schema
export const createPaymentOrderSchema = z.object({
  amount: z.coerce
    .number()
    .min(MIN_AMOUNT, `Minimum donation is ₹${MIN_AMOUNT}`)
    .max(MAX_AMOUNT, `Maximum donation is ₹${MAX_AMOUNT.toLocaleString()}`),
  campaignId: idSchema,
  donorName: nameSchema,
  donorEmail: emailSchema,
  donorPhone: optionalPhoneSchema,
  message: z.string().max(500).optional().or(z.literal("")).nullable(),
});

// Payment verification schema
export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  paymentId: z.string().min(1, "Payment ID is required"),
  signature: z.string().min(1, "Signature is required"),
  campaignId: idSchema,
  amount: z.coerce.number().positive(),
  donorName: nameSchema,
  donorEmail: emailSchema,
  donorPhone: optionalPhoneSchema,
  message: z.string().max(500).optional().or(z.literal("")).nullable(),
  anonymous: booleanSchema.default(false),
});

// Donation query schema (admin)
export const donationQuerySchema = z.object({
  campaignId: z.string().optional(),
  paymentStatus: z.enum(["pending", "completed", "failed"]).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Check if donation needs warning (high amount)
export function needsDonationWarning(amount) {
  return amount >= WARNING_THRESHOLD;
}
