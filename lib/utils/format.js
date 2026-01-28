/**
 * Formatting Utilities
 */

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount) {
  if (!amount || amount === 0) return "₹0";

  // Convert paise to rupees if needed
  const rupees = amount;

  // Format with Indian number system
  if (rupees >= 10000000) {
    return `₹${(rupees / 10000000).toFixed(2)}Cr`;
  }
  if (rupees >= 100000) {
    return `₹${(rupees / 100000).toFixed(2)}L`;
  }
  if (rupees >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)}K`;
  }
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date) {
  if (!date) return "";

  const d = new Date(date);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return d.toLocaleDateString("en-IN", options);
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(raised, goal) {
  if (!goal || goal === 0) return 0;
  const progress = Math.min((raised / goal) * 100, 100);
  return Math.round(progress);
}

/**
 * Calculate days left until deadline
 */
export function daysLeft(endDate) {
  if (!endDate) return null;

  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff < 0) return 0;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}

/**
 * Format time ago (e.g., "2 hours ago", "3 days ago")
 */
export function timeAgo(date) {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 0) return `${diffMonth}mo ago`;
  if (diffWeek > 0) return `${diffWeek}w ago`;
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return "Just now";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
