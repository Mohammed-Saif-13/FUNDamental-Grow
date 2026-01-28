import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendVolunteerSubmittedEmail } from "@/lib/email";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { volunteerApplicationSchema } from "@/lib/validations/volunteer";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/utils/sanitize";
import { handleAPIError, ValidationError } from "@/lib/api-error";

export async function POST(req) {
  // CSRF check
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  // Rate limit check
  const rateLimitError = checkRateLimit(req, "form", "volunteer");
  if (rateLimitError) return rateLimitError;

  try {
    const data = await req.json();

    // Zod validation
    const validationResult = volunteerApplicationSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      throw new ValidationError(errors);
    }

    const validatedData = validationResult.data;
    const normalizedEmail = sanitizeEmail(validatedData.email);

    // Check existing volunteer by email
    const existingVolunteerByEmail = await prisma.volunteer.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingVolunteerByEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already registered as a volunteer. Please check your email for updates.",
        },
        { status: 400 },
      );
    }

    // Check session for logged-in user
    const session = await auth();
    let userId = null;

    if (session?.user?.id) {
      userId = session.user.id;

      const existingVolunteerByUserId = await prisma.volunteer.findUnique({
        where: { userId: userId },
      });

      if (existingVolunteerByUserId) {
        return NextResponse.json(
          {
            success: false,
            message: "Your account is already registered as a volunteer.",
          },
          { status: 400 },
        );
      }
    } else {
      // Check if email belongs to existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        const existingVolunteerByUserId = await prisma.volunteer.findUnique({
          where: { userId: existingUser.id },
        });

        if (existingVolunteerByUserId) {
          return NextResponse.json(
            {
              success: false,
              message:
                "This email is already registered as a volunteer. Please log in to continue.",
            },
            { status: 400 },
          );
        }

        userId = existingUser.id;
      }
    }

    // Create volunteer record
    const volunteerData = {
      name: sanitizeString(validatedData.name),
      email: normalizedEmail,
      phone: sanitizePhone(validatedData.phone),
      address: validatedData.city ? sanitizeString(validatedData.city) : null,
      availability: validatedData.availability || null,
      skills: Array.isArray(validatedData.skills)
        ? validatedData.skills.join(", ")
        : null,
      motivation: validatedData.motivation
        ? sanitizeString(validatedData.motivation)
        : null,
      status: "pending",
    };

    if (userId) {
      volunteerData.userId = userId;
    }

    const volunteer = await prisma.volunteer.create({
      data: volunteerData,
    });

    // Send confirmation email (non-blocking)
    sendVolunteerSubmittedEmail(volunteer).catch((err) =>
      console.error("Failed to send volunteer email:", err),
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Application submitted successfully! We'll review it within 48-72 hours.",
        volunteer: {
          id: volunteer.id,
          name: volunteer.name,
          email: volunteer.email,
          status: volunteer.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Volunteer registration error:", error);
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.statusCode },
    );
  }
}

export async function GET(req) {
  try {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause = status ? { status } : {};

    const volunteers = await prisma.volunteer.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json({
      success: true,
      volunteers,
      count: volunteers.length,
    });
  } catch (error) {
    console.error("Get volunteers error:", error);
    const errorResponse = handleAPIError(error);
    return NextResponse.json(
      { success: false, message: errorResponse.message },
      { status: errorResponse.statusCode },
    );
  }
}
