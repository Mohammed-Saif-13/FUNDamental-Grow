import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "auth", "verify-email");
  if (rateLimitError) return rateLimitError;

  try {
    const { token } = await req.json();

    if (!token) {
      return errorResponse("Verification token required", 400);
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return errorResponse("Invalid verification link", 400);
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({ where: { token } });
      return errorResponse("Verification link has expired", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return notFoundResponse("User not found");
    }

    if (user.emailVerified) {
      await prisma.verificationToken.delete({ where: { token } });
      return successResponse(null, "Email already verified");
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({ where: { token } }),
    ]);

    sendWelcomeEmail(user).catch((err) =>
      console.error("Failed to send welcome email:", err),
    );

    return successResponse(null, "Email verified successfully");
  } catch (error) {
    console.error("Verify email error:", error);
    return errorResponse("Something went wrong", 500);
  }
}
