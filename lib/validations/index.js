/**
 * Validations Index - Export all validation schemas from single entry point
 */

// Common schemas
export {
  emailSchema,
  optionalEmailSchema,
  phoneSchema,
  optionalPhoneSchema,
  nameSchema,
  idSchema,
  optionalIdSchema,
  urlSchema,
  optionalUrlSchema,
  positiveNumberSchema,
  paginationSchema,
  futureDateSchema,
  booleanSchema,
  createStatusSchema,
} from "./common";

// Campaign schemas
export {
  createCampaignSchema,
  updateCampaignSchema,
  campaignQuerySchema,
  updateCampaignStatusSchema,
} from "./campaign";

// Donation schemas
export {
  donationSchema,
  createPaymentOrderSchema,
  verifyPaymentSchema,
  donationQuerySchema,
  needsDonationWarning,
} from "./donation";

// User schemas
export {
  registerUserSchema,
  loginUserSchema,
  updateProfileSchema,
  adminUpdateUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userQuerySchema,
} from "./user";

// Contact schemas
export {
  createContactSchema,
  updateContactStatusSchema,
  contactQuerySchema,
} from "./contact";

// Fundraiser request schemas
export {
  createFundraiserRequestSchema,
  approveFundraiserRequestSchema,
  rejectFundraiserRequestSchema,
  updateFundraiserRequestSchema,
  fundraiserRequestQuerySchema,
} from "./fundraiser-request";

// Volunteer schemas
export {
  createVolunteerSchema,
  updateVolunteerSchema,
  updateVolunteerStatusSchema,
  volunteerQuerySchema,
  createVolunteerTaskSchema,
  updateVolunteerTaskSchema,
  taskQuerySchema,
} from "./volunteer";

// Testimonial schemas
export {
  testimonialSchema,
  updateTestimonialStatusSchema,
  testimonialQuerySchema,
} from "./testimonial";

/**
 * Helper function to validate data against a schema
 * Returns { success: true, data } or { success: false, errors }
 */
export function validateData(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format Zod errors into readable array
  const errors = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });

  return { success: false, errors };
}

/**
 * Helper to get first error message from Zod result
 */
export function getFirstError(zodError) {
  return zodError.errors[0]?.message || "Validation failed";
}
