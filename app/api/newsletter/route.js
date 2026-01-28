import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

// POST - Subscribe to newsletter
export async function POST(req) {
  try {
    const body = await req.json();

    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error);
    }

    const { email } = validation.data;

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "active") {
        return errorResponse("You're already subscribed!", 400);
      }

      // Reactivate if previously unsubscribed
      await prisma.newsletter.update({
        where: { email },
        data: {
          status: "active",
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });

      // Send welcome back email
      await sendWelcomeEmail(email, true);

      return successResponse(
        null,
        "Welcome back! You've been resubscribed.",
        200,
      );
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email },
    });

    // Send welcome email
    await sendWelcomeEmail(email, false);

    return successResponse(null, "Successfully subscribed to newsletter!", 201);
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return errorResponse("Failed to subscribe. Please try again.");
  }
}

// GET - Get subscriber count (public)
export async function GET() {
  try {
    const count = await prisma.newsletter.count({
      where: { status: "active" },
    });

    return successResponse({ subscriberCount: count });
  } catch (error) {
    console.error("Newsletter count error:", error);
    return errorResponse("Failed to fetch subscriber count");
  }
}

// Helper function to send welcome email
async function sendWelcomeEmail(email, isResubscribe = false) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  try {
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "FUNDamental Grow <noreply@fundamentalgrow.com>",
      to: email,
      subject: isResubscribe
        ? "Welcome Back to FUNDamental Grow! 🎉"
        : "Welcome to FUNDamental Grow Newsletter! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                <span style="font-size: 32px;">❤️</span>
              </div>
              <h1 style="margin: 0; color: #111827; font-size: 28px; font-weight: 700;">
                ${isResubscribe ? "Welcome Back!" : "You're In!"}
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${
                  isResubscribe
                    ? "Great to have you back! You've been resubscribed to our newsletter."
                    : "Thank you for subscribing to the FUNDamental Grow newsletter!"
                }
              </p>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                You'll now receive:
              </p>
              
              <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
                <li>🎯 Updates on impactful campaigns</li>
                <li>📖 Inspiring success stories</li>
                <li>💡 Tips for effective fundraising</li>
                <li>🎁 Exclusive community updates</li>
              </ul>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${appUrl}/campaigns" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Explore Campaigns
                </a>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 12px;">
                Made with ❤️ by FUNDamental Grow
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Don't want to receive these emails? 
                <a href="${unsubscribeUrl}" style="color: #f97316; text-decoration: underline;">Unsubscribe here</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    // Log but don't fail the subscription
    console.error("Failed to send welcome email:", error);
  }
}
