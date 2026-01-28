/**
 * Input Sanitization Utility
 * Prevents XSS attacks and cleans user input
 */

// HTML entities to escape
const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char]);
}

/**
 * Strip all HTML tags from string
 * @param {string} str - String with potential HTML
 * @returns {string} Plain text without HTML
 */
export function stripHtml(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitize string for safe database storage
 * - Trims whitespace
 * - Removes null bytes
 * - Normalizes line breaks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .trim()
    .replace(/\0/g, "") // Remove null bytes
    .replace(/\r\n/g, "\n") // Normalize line breaks
    .replace(/\r/g, "\n");
}

/**
 * Sanitize object - applies sanitizeString to all string values
 * @param {Object} obj - Object to sanitize
 * @param {string[]} htmlFields - Fields that should strip HTML
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj, htmlFields = []) {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      let clean = sanitizeString(value);
      if (htmlFields.includes(key)) {
        clean = stripHtml(clean);
      }
      sanitized[key] = clean;
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value, htmlFields);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Sanitize phone number - keep only digits
 * @param {string} phone - Phone number
 * @returns {string} Digits only
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/\D/g, "");
}

/**
 * Sanitize email - lowercase and trim
 * @param {string} email - Email address
 * @returns {string} Normalized email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.toLowerCase().trim();
}

/**
 * Sanitize campaign data specifically
 * @param {Object} data - Campaign form data
 * @returns {Object} Sanitized campaign data
 */
export function sanitizeCampaignData(data) {
  return {
    ...data,
    title: sanitizeString(data.title),
    description: stripHtml(data.description), // No HTML in description
    story: sanitizeString(data.story), // Allow basic formatting in story
    organizerName: sanitizeString(data.organizerName),
    organizerEmail: sanitizeEmail(data.organizerEmail),
    organizerPhone: sanitizePhone(data.organizerPhone),
    location: sanitizeString(data.location),
  };
}
