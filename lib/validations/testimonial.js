import { z } from "zod";

export const testimonialSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  role: z.enum(["Donor", "Campaign Organizer", "Volunteer", "NGO Partner"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(500, "Message cannot exceed 500 characters")
    .trim(),
});

export const updateTestimonialStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  featured: z.boolean().optional(),
});

export const testimonialQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.enum(["pending", "approved", "rejected", "all"]).default("all"),
  search: z.string().optional(),
});
