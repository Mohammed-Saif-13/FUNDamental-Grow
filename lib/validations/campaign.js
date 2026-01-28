/**
 * Campaign Validation Schemas
 */

import { z } from "zod";
import {
  createStringSchema,
  idSchema,
  positiveNumberSchema,
  futureDateSchema,
  createStatusSchema,
  optionalUrlSchema,
} from "./common";

// Categories (Sync with DB/Frontend)
const CATEGORIES = [
  "Education",
  "Health",
  "Environment",
  "Disaster Relief",
  "Animals",
  "Children",
  "Community",
  "Others",
];

const categorySchema = z.enum(CATEGORIES, {
  errorMap: () => ({ message: "Please select a valid category" }),
});

export const createCampaignSchema = z.object({
  title: createStringSchema(5, 100),
  description: createStringSchema(20, 5000),
  story: createStringSchema(50, 10000),
  category: categorySchema,
  goalAmount: positiveNumberSchema.min(100, "Goal must be at least 100"),
  endDate: futureDateSchema,
  image: optionalUrlSchema,
  organizerName: createStringSchema(2, 50),
  organizerEmail: z.string().email(),
  organizerPhone: createStringSchema(10, 15),
  location: createStringSchema(2, 100),
});

export const updateCampaignSchema = createCampaignSchema.partial().extend({
  id: idSchema,
});

export const updateCampaignStatusSchema = z.object({
  status: createStatusSchema(["pending", "active", "completed", "rejected"]),
  rejectionReason: z.string().optional(),
});

export const campaignQuerySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(9),
  cursor: z.string().optional(),
  sort: z.enum(["newest", "oldest", "goal", "raised"]).default("newest"),
});
