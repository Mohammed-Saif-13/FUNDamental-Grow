/**
 * User Validation Schemas
 */

import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  stringSchema,
  phoneSchema,
  idSchema,
} from "./common";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100);

export const registerUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  phone: phoneSchema.optional(),
  bio: stringSchema.max(500).optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN", "VOLUNTEER"]),
  name: nameSchema.optional(),
  email: emailSchema.optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userQuerySchema = z.object({
  role: z.enum(["USER", "ADMIN", "VOLUNTEER"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});
