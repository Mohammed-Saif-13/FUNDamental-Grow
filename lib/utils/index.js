/**
 * Utils Index - Export all utilities from single entry point
 */

// Slug utilities
export { generateSlug, generateBaseSlug } from "./slug";

// Sanitization utilities
export {
  escapeHtml,
  stripHtml,
  sanitizeString,
  sanitizeObject,
  sanitizePhone,
  sanitizeEmail,
  sanitizeCampaignData,
} from "./sanitize";

// API Response utilities
export {
  successResponse,
  createdResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  rateLimitResponse,
  paginatedResponse,
  handlePrismaError,
  handleError,
} from "./response";

// Formatting utilities
export {
  formatCurrency,
  formatDate,
  calculateProgress,
  daysLeft,
  timeAgo,
  truncate,
} from "./format";
