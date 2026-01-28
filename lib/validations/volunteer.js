/**
 * Volunteer Validation Schemas
 */

import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  createStringSchema,
  phoneSchema,
  createStatusSchema,
  idSchema,
  futureDateSchema,
} from "./common";

export const createVolunteerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: createStringSchema(5, 200).optional(),
  skills: createStringSchema(2, 500).optional(),
  availability: createStringSchema(2, 100).optional(),
  motivation: createStringSchema(10, 1000).optional(),
});

export const updateVolunteerSchema = createVolunteerSchema.partial();

export const volunteerApplicationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  city: z.string().max(100, "City must be under 100 characters").optional(),
  availability: z.enum(["weekdays", "weekends", "flexible"]).optional(),
  skills: z.array(z.string()).optional(),
  motivation: z
    .string()
    .max(1000, "Motivation must be under 1000 characters")
    .optional(),
});

export const volunteerStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  rejectionReason: z.string().max(500).optional(),
});

export const volunteerQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Tasks
export const createVolunteerTaskSchema = z.object({
  title: createStringSchema(5, 100),
  description: createStringSchema(10, 1000),
  type: createStringSchema(2, 50),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: futureDateSchema.optional(),
  volunteerId: idSchema.optional(),
  campaignId: idSchema.optional(),
});

export const updateVolunteerTaskSchema = createVolunteerTaskSchema
  .partial()
  .extend({
    status: createStatusSchema([
      "pending",
      "in_progress",
      "completed",
      "cancelled",
    ]).optional(),
  });

export const taskQuerySchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  volunteerId: z.string().optional(),
  campaignId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
