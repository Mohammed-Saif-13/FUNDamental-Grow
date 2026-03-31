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
  EMAIL: "fundamentalgrow@gmail.com",
  WHATSAPP: "+919876543210",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "About", href: "/about" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
];

export const CATEGORIES = [
  // Core Needs
  { value: "medical", label: "Medical (Emergency)" },
  { value: "healthcare", label: "Healthcare & Treatment" },
  { value: "emergency_crisis", label: "Emergency & Crisis" },
  { value: "disaster_relief", label: "Disaster Relief" },

  // Education & Growth
  { value: "education", label: "Education" },
  { value: "skill_development", label: "Skill Development" },
  { value: "scholarships", label: "Scholarships" },

  // Social Causes
  { value: "humanitarian", label: "Humanitarian" },
  { value: "women_empowerment", label: "Women Empowerment" },
  { value: "child_welfare", label: "Child Welfare" },
  { value: "elderly_care", label: "Elderly Care" },
  { value: "disability_support", label: "Disability Support" },

  // Community
  { value: "community_development", label: "Community Development" },
  { value: "religious_spiritual", label: "Religious & Spiritual" },
  { value: "rural_development", label: "Rural Development" },

  // Environment
  { value: "environment", label: "Environment" },
  { value: "climate_action", label: "Climate Action" },
  { value: "animal_welfare", label: "Animal Welfare" },

  // Personal Causes
  { value: "personal_cause", label: "Personal Cause" },
  { value: "family_support", label: "Family Support" },
  { value: "memorial", label: "Memorial" },

  // Creative & Business
  { value: "creative_projects", label: "Creative Projects" },
  { value: "film_media", label: "Film & Media" },
  { value: "music_arts", label: "Music & Arts" },
  { value: "startup_business", label: "Startup & Business" },

  // Lifestyle
  { value: "sports", label: "Sports" },
  { value: "travel_adventure", label: "Travel & Adventure" },
  { value: "events_celebrations", label: "Events & Celebrations" },

  // Fallback
  { value: "other", label: "Other" },
];

export const CAMPAIGN_CATEGORIES = [
  // Core Needs
  "Medical",
  "Emergency & Crisis",
  "Disaster Relief",

  // Education & Development
  "Education",
  "Skill Development",
  "Scholarships",

  // Social Causes
  "Humanitarian",
  "Women Empowerment",
  "Child Welfare",
  "Elderly Care",
  "Disability Support",

  // Community & Public
  "Community Development",
  "Religious & Spiritual",
  "Rural Development",

  // Environment
  "Environment",
  "Climate Action",
  "Animal Welfare",

  // Personal & Individual
  "Personal Cause",
  "Memorial",
  "Family Support",

  // Creative & Professional
  "Creative Projects",
  "Film & Media",
  "Music & Arts",
  "Startup & Business",

  // Lifestyle & Others
  "Sports",
  "Travel & Adventure",
  "Events & Celebrations",

  // Fallback
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
  { value: "weekdays", label: "Weekdays (Mon – Fri)" },
  { value: "weekends", label: "Weekends (Sat – Sun)" },
  { value: "evenings", label: "Evenings Only" },
  { value: "flexible", label: "Flexible / Anytime" },
];
export const VOLUNTEER_SKILLS = [
  // Education & Training
  { value: "teaching", label: "Teaching & Tutoring", category: "Education" },
  {
    value: "curriculum_design",
    label: "Curriculum Design",
    category: "Education",
  },
  {
    value: "mentorship",
    label: "Mentorship & Career Guidance",
    category: "Education",
  },

  // Healthcare
  {
    value: "healthcare",
    label: "Healthcare & First Aid",
    category: "Healthcare",
  },
  {
    value: "mental_health",
    label: "Mental Health Support",
    category: "Healthcare",
  },
  { value: "nutrition", label: "Nutrition & Wellness", category: "Healthcare" },

  // Technology
  {
    value: "web_development",
    label: "Web Development",
    category: "Technology",
  },
  {
    value: "app_development",
    label: "App Development",
    category: "Technology",
  },
  { value: "technical", label: "General IT Support", category: "Technology" },
  { value: "data_analysis", label: "Data Analysis", category: "Technology" },

  // Marketing & Communication
  {
    value: "social_media",
    label: "Social Media Management",
    category: "Marketing",
  },
  {
    value: "content_writing",
    label: "Content Writing & Blogging",
    category: "Marketing",
  },
  { value: "graphic_design", label: "Graphic Design", category: "Marketing" },
  {
    value: "photography",
    label: "Photography & Videography",
    category: "Marketing",
  },
  {
    value: "public_relations",
    label: "Public Relations",
    category: "Marketing",
  },

  // Fundraising & Finance
  {
    value: "fundraising",
    label: "Fundraising & Donor Relations",
    category: "Finance",
  },
  {
    value: "accounting",
    label: "Accounting & Bookkeeping",
    category: "Finance",
  },
  { value: "grant_writing", label: "Grant Writing", category: "Finance" },

  // Events & Outreach
  { value: "event_management", label: "Event Management", category: "Events" },
  {
    value: "community_outreach",
    label: "Community Outreach",
    category: "Events",
  },
  {
    value: "field_volunteering",
    label: "Field / On-ground Volunteering",
    category: "Events",
  },

  // Support & Counseling
  {
    value: "counseling",
    label: "Counseling & Emotional Support",
    category: "Support",
  },
  { value: "legal", label: "Legal Advisory", category: "Support" },
  {
    value: "translation",
    label: "Translation & Interpretation",
    category: "Support",
  },

  // Other
  { value: "other", label: "Other", category: "Other" },
];

// ─────────────────────────────────────────────────────────────────
// Donation Config
// ─────────────────────────────────────────────────────────────────

export const DONATION_CONFIG = {
  MIN_AMOUNT: 100,
  MAX_AMOUNT: 5000000,
  WARNING_THRESHOLD: 50000,
  QUICK_AMOUNTS: [500, 1000, 2500, 5000, 10000, 25000],
};
