import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import crypto from "crypto";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "auth", "forgot-password");
  if (rateLimitError) return rateLimitError;

  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, password: true },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link has been sent",
      });
    }

    if (!user.password) {
      return NextResponse.json({
        success: true,
        message: "If an account exists, a reset link has been sent",
      });
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    });

    sendPasswordResetEmail(normalizedEmail, token).catch((err) =>
      console.error("Failed to send password reset email:", err)
    );

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
