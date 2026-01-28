const requiredEnvVars = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RESEND_API_KEY",
];

export function validateEnv() {
  const missing = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((v) => console.error(`   - ${v}`));

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing environment variables: ${missing.join(", ")}`);
    } else {
      console.warn(
        "⚠️  Running in development mode - some features may not work",
      );
    }
  } else {
    console.log("✅ All environment variables loaded");
  }
}

export function getEnv(key, fallback = "") {
  return process.env[key] || fallback;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
