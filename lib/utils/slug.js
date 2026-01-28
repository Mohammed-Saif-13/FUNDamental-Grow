/**
 * Slug Generation Utility
 * Single source of truth for generating URL-friendly slugs
 */

/**
 * Generate a unique slug from title
 * @param {string} title - The title to convert to slug
 * @param {number} maxLength - Maximum length of base slug (default: 50)
 * @returns {string} URL-friendly unique slug
 */
export function generateSlug(title, maxLength = 50) {
  if (!title || typeof title !== "string") {
    throw new Error("Title is required for slug generation");
  }

  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to single
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, maxLength);

  // Add unique identifier (timestamp + random)
  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

  return `${baseSlug}-${uniqueId}`;
}

/**
 * Generate slug without unique ID (for checking duplicates)
 * @param {string} title - The title to convert
 * @returns {string} Base slug without unique ID
 */
export function generateBaseSlug(title) {
  if (!title || typeof title !== "string") return "";

  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
