/**
 * Application-wide Constants
 */

export const APP_CONFIG = {
  NAME: "FUNDamental Grow",
  TAGLINE: "Empowering Dreams, One Donation at a Time",
  SUPPORT_EMAIL: "support@fundamentalgrow.com",
  SUPPORT_PHONE: "+91 9876543210",

  // URLs
  BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
};

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  VOLUNTEER: "volunteer",
};

export const VALID_ROLES = Object.values(USER_ROLES);

// Phone validation (Indian numbers)
export const PHONE_REGEX = /^[6-9]\d{9}$/;

// Email validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// File upload limits
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
};

// Status configurations
export const REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const CONTACT_STATUS = {
  UNREAD: "unread",
  READ: "read",
  REPLIED: "replied",
};

export const VOLUNTEER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};
