// Colors
export const COLORS = {
  primary: "#FF5528",
  primaryHover: "#FF8C66",
  dark: "#343434",
  darkAlt: "#2c3e50",
  gray: "#7F8C8D",
  lightGray: "#ECF0F1",
  borderLight: "#e0e0e0",
  white: "#ffffff",
};

// Donation Amounts
export const DONATION_AMOUNTS = [500, 1000, 5000, 10000];

// Availability Options
export const AVAILABILITY_OPTIONS = [
  "Weekdays Morning",
  "Weekdays Evening",
  "Weekends Morning",
  "Weekends Evening",
  "Flexible (24/7)",
];

// Campaigns (Dummy Data)
export const DUMMY_CAMPAIGNS = [
  { _id: "1", title: "Education for Underprivileged Children" },
  { _id: "2", title: "Healthcare for Rural Areas" },
  { _id: "3", title: "Clean Water Initiative" },
  { _id: "4", title: "Women Empowerment Program" },
  { _id: "5", title: "Emergency Relief Fund" },
  { _id: "6", title: "Environmental Conservation" },
];

// API Endpoints
export const API_ROUTES = {
  signup: "/api/auth/signup",
  donations: "/api/donations",
  volunteers: "/api/volunteers",
  campaigns: "/api/campaigns",
};

// Form Validation
export const VALIDATION = {
  minPasswordLength: 6,
  minDonationAmount: 100,
  phoneRegex:
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Messages
export const MESSAGES = {
  donationSuccess:
    "Thank you for your generous donation! Your contribution will make a real difference.",
  volunteerSuccess:
    "Thank you for volunteering! We will review your application and contact you soon.",
  signupSuccess:
    "Welcome to FundHope! You can now login with your credentials.",
  loginSuccess: "Welcome back! Redirecting you to homepage...",
  networkError: "Network error. Please check your connection.",
  termsError: "Please accept Terms & Conditions",
};

// Routes
export const ROUTES = {
  home: "/",
  login: "/auth/login",
  signup: "/auth/signup",
  donate: "/donate",
  volunteer: "/volunteer",
  campaigns: "/campaigns",
  admin: "/admin",
};
