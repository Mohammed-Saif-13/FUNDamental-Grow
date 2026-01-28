/**
 * Contact Validation Schemas
 */

import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  createStringSchema,
  phoneSchema,
  createStatusSchema,
} from "./common";

export const createContactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: createStringSchema(5, 100),
  message: createStringSchema(10, 2000),
});

export const updateContactStatusSchema = z.object({
  status: createStatusSchema(["unread", "read", "responded", "archived"]),
});

export const contactQuerySchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
