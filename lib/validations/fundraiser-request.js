/**
 * Fundraiser Request Validation Schemas
 */

import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  createStringSchema,
  phoneSchema,
  positiveNumberSchema,
  createStatusSchema,
} from "./common";

export const createFundraiserRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  title: createStringSchema(5, 100),
  description: createStringSchema(20, 2000),
  goalAmount: positiveNumberSchema.min(100),
  category: createStringSchema(2, 50),
});

export const updateFundraiserRequestSchema = createFundraiserRequestSchema
  .partial()
  .extend({
    status: createStatusSchema(["pending", "approved", "rejected"]).optional(),
  });

export const approveFundraiserRequestSchema = z.object({
  adminNotes: z.string().optional(),
});

export const rejectFundraiserRequestSchema = z.object({
  rejectionReason: createStringSchema(5, 500),
});

export const fundraiserRequestQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
