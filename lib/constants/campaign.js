/**
 * Campaign Constants
 */

export const CAMPAIGN_CONFIG = {
  MIN_GOAL: 1000, // ₹1,000 minimum
  MAX_GOAL: 10000000, // ₹1 crore maximum
  MIN_DURATION_DAYS: 7,
  MAX_DURATION_DAYS: 90,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  STORY_MAX_LENGTH: 10000,
};

export const CAMPAIGN_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

export const CAMPAIGN_CATEGORIES = [
  "Education",
  "Health Care",
  "Medical",
  "Environment",
  "Humanitarian",
  "Animal Welfare",
  "Disaster Relief",
  "Women Empowerment",
  "Children",
  "Community",
  "Sports",
  "Creative",
  "Other",
];

export const VALID_CATEGORIES = CAMPAIGN_CATEGORIES;
