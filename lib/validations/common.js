/**
 * Common Validation Schemas
 * Reusable zod schemas for consistent validation across the app
 */

import { z } from "zod";

// Basic types
export const booleanSchema = z.boolean();
export const stringSchema = z.string().trim();
export const numberSchema = z.number();
export const dateSchema = z.coerce.date();

// Generators for common constraints
export const createStringSchema = (min = 1, max = 255) =>
  z
    .string()
    .trim()
    .min(min, `Must be at least ${min} characters`)
    .max(max, `Must be at most ${max} characters`);

// ID Schema (CUID or UUID)
export const idSchema = z.string().min(1, "ID is required");
export const optionalIdSchema = idSchema.optional();

// Email Schema
export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .toLowerCase();
export const optionalEmailSchema = emailSchema.optional().or(z.literal(""));

// Name Schema
export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name cannot exceed 100 characters");

// Phone Schema (Simple regex for 10-15 digits)
// Allowing international format or simple 10 digit
const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
export const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, "Invalid phone number format");
export const optionalPhoneSchema = phoneSchema.optional().or(z.literal(""));

// URL Schema
export const urlSchema = z.string().url("Please enter a valid URL");
export const optionalUrlSchema = urlSchema.optional().or(z.literal(""));

// Number Schema
export const positiveNumberSchema = z.coerce
  .number()
  .positive("Must be a positive number");

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// Future Date Schema
export const futureDateSchema = z.coerce
  .date()
  .refine((date) => date > new Date(), {
    message: "Date must be in the future",
  });

// Status Schema generator
export const createStatusSchema = (statuses) =>
  z.enum(statuses, {
    errorMap: () => ({ message: "Invalid status" }),
  });
