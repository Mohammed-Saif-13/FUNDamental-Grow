import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import { sanitizeString, sanitizeEmail } from "@/lib/utils/sanitize";
import {
  successResponse,
  forbiddenResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return successResponse(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return errorResponse("Failed to fetch settings", 500);
  }
}

export async function PUT(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const data = await req.json();

    const sanitizedData = {
      siteName: data.siteName ? sanitizeString(data.siteName) : undefined,
      tagline: data.tagline ? sanitizeString(data.tagline) : undefined,
      description: data.description
        ? sanitizeString(data.description)
        : undefined,
      email: data.email ? sanitizeEmail(data.email) : undefined,
      phone: data.phone ? sanitizeString(data.phone) : undefined,
      address: data.address ? sanitizeString(data.address) : undefined,
      socialFacebook: data.socialFacebook || undefined,
      socialTwitter: data.socialTwitter || undefined,
      socialInstagram: data.socialInstagram || undefined,
      socialLinkedin: data.socialLinkedin || undefined,
      heroTitle: data.heroTitle ? sanitizeString(data.heroTitle) : undefined,
      heroSubtitle: data.heroSubtitle
        ? sanitizeString(data.heroSubtitle)
        : undefined,
      footerText: data.footerText ? sanitizeString(data.footerText) : undefined,
    };

    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: sanitizedData,
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: sanitizedData.siteName || "FUNDamental Grow",
          ...sanitizedData,
        },
      });
    }

    return successResponse(settings, "Settings saved successfully");
  } catch (error) {
    console.error("Update settings error:", error);
    return errorResponse("Failed to save settings", 500);
  }
}
