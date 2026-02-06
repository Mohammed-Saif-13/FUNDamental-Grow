/**
 * UI Constants
 * Client-side constants for navigation, links, categories, etc.
 */

export const APP_NAME = "FUNDamental Grow";

export const SOCIAL_LINKS = {
  LINKEDIN: "https://linkedin.com/company/fundamentalgrow",
  TWITTER: "https://twitter.com/fundamentalgrow",
  INSTAGRAM: "https://instagram.com/fundamentalgrow",
  FACEBOOK: "https://facebook.com/fundamentalgrow",
};

export const CONTACT_INFO = {
  ADDRESS: "123 Main Street, Mumbai, Maharashtra 400001",
  PHONE: "+91 98765 43210",
  EMAIL: "support@fundamentalgrow.com",
  WHATSAPP: "+919876543210", // Without spaces for WhatsApp URL
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export const CATEGORIES = [
  { value: "Education", label: "Education" },
  { value: "Medical", label: "Medical" },
  { value: "Environment", label: "Environment" },
  { value: "Humanitarian", label: "Humanitarian" },
  { value: "Animal Welfare", label: "Animal Welfare" },
  { value: "Disaster Relief", label: "Disaster Relief" },
  { value: "Women Empowerment", label: "Women Empowerment" },
  { value: "Children", label: "Children" },
  { value: "Community", label: "Community" },
  { value: "Sports", label: "Sports" },
  { value: "Creative", label: "Creative" },
  { value: "Other", label: "Other" },
];

export const CAMPAIGN_CATEGORIES = [
  "Education",
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

export const CAMPAIGN_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
];

export const DONATION_STATUS = [
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export const VOLUNTEER_STATUS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const CONTACT_STATUS = [
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

// Contact Page Constants
export const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Donation Support",
  "Campaign Help",
  "Technical Issue",
  "Partnership",
  "Feedback",
  "Other",
];

export const CONTACT_FAQ = [
  {
    id: 1,
    question: "How do I start a fundraiser?",
    answer:
      "Click on 'Start Fundraiser' button, fill in your campaign details, upload images, and submit for verification. Once approved, your campaign goes live within 24 hours.",
  },
  {
    id: 2,
    question: "Is my donation secure?",
    answer:
      "Absolutely! We use bank-grade encryption and secure payment gateways. All transactions are processed through verified payment partners like Razorpay.",
  },
  {
    id: 3,
    question: "How do I know my money reaches the right people?",
    answer:
      "Every campaign is verified before going live. We provide regular updates, and you can track exactly how funds are being utilized through our transparent reporting.",
  },
  {
    id: 4,
    question: "Can I get a refund on my donation?",
    answer:
      "Donations are generally non-refundable. However, if a campaign is found to be fraudulent, we ensure full refunds to all donors.",
  },
  {
    id: 5,
    question: "How can I volunteer with FUNDamental Grow?",
    answer:
      "Visit our Volunteer page and fill out the registration form. Our team will review your application and get back to you within 48 hours.",
  },
];


export const AVAILABILITY_OPTIONS = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

export const VOLUNTEER_SKILLS = [
  { value: "teaching", label: "Teaching" },
  { value: "healthcare", label: "Healthcare" },
  { value: "fundraising", label: "Fundraising" },
  { value: "social_media", label: "Social Media" },
  { value: "event_management", label: "Event Management" },
  { value: "counseling", label: "Counseling" },
  { value: "technical", label: "Technical Support" },
  { value: "content_writing", label: "Content Writing" },
];

export const DONATION_CONFIG = {
  MIN_AMOUNT: 100,
  MAX_AMOUNT: 5000000,
  WARNING_THRESHOLD: 50000,
};
