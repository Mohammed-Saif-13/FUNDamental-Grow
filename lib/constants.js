/**
 * Constants - Unified Export
 * Import everything from: import { APP_NAME, USER_ROLES } from "@/lib/constants"
 */

// UI Constants (previously in lib/constants.js, now in ui.js)
export {
  APP_NAME,
  SOCIAL_LINKS,
  CONTACT_INFO,
  NAV_LINKS,
  CATEGORIES,
  CAMPAIGN_STATUS,
  DONATION_STATUS,
  VOLUNTEER_STATUS,
  CONTACT_STATUS,
  CONTACT_SUBJECTS,
  CONTACT_FAQ,
  CAMPAIGN_CATEGORIES,
  AVAILABILITY_OPTIONS,
  VOLUNTEER_SKILLS,
  DONATION_CONFIG,
} from "./constants/ui";

// Server Constants (from organized folders)
export {
  APP_CONFIG,
  USER_ROLES,
  VALID_ROLES,
  PHONE_REGEX,
  EMAIL_REGEX,
  UPLOAD_CONFIG,
  REQUEST_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
} from "./constants/app";

// Campaign constants (now available)
export { CAMPAIGN_CONFIG, VALID_CATEGORIES } from "./constants/campaign";

// Donation constants
export { RAZORPAY_CONFIG, TEST_UPI_IDS } from "./constants/donation";
