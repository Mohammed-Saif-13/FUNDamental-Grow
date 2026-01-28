/**
 * Donation Configuration
 * IMPORTANT: All amounts in RUPEES (not paise)
 * Backend converts to paise before storing
 */

// Donation Configuration
export const DONATION_CONFIG = {
  MIN_AMOUNT: 100, // ₹100 (minimum donation)
  MAX_AMOUNT: 1000000, // ₹10,00,000 (1 million)
  WARNING_THRESHOLD: 50000, // ₹50,000 (show confirmation)
  PRESET_AMOUNTS: [100, 500, 1000, 2500, 5000], // In Rupees
};

// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  NAME: "FUNDamental Grow",
  DESCRIPTION: "Crowdfunding Platform",
  CURRENCY: "INR",
  THEME_COLOR: "#f97316",
  // Payment Methods - UPI enabled
  METHODS: {
    upi: true, // UPI payments (GPay, PhonePe, Paytm, etc.)
    card: true, // Credit/Debit cards
    netbanking: true, // Net banking
    wallet: true, // Wallets (Paytm, PhonePe, etc.)
    emi: false, // EMI options
    paylater: false, // Pay later options
  },
};

// Test Mode UPI IDs for testing
export const TEST_UPI_IDS = {
  SUCCESS: "success@razorpay",
  FAILURE: "failure@razorpay",
};
