import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/utils/sanitize";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;

    const where = {};
    if (status) where.status = status;

    const requests = await prisma.fundraiserRequest.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: await prisma.fundraiserRequest.count(),
      pending: await prisma.fundraiserRequest.count({
        where: { status: "pending" },
      }),
      approved: await prisma.fundraiserRequest.count({
        where: { status: "approved" },
      }),
      rejected: await prisma.fundraiserRequest.count({
        where: { status: "rejected" },
      }),
    };

    return NextResponse.json({ success: true, requests, stats });
  } catch (error) {
    console.error("Failed to fetch fundraiser requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "form", "fundraiser-request");
  if (rateLimitError) return rateLimitError;

  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const userEmail = sanitizeEmail(session.user.email);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentRequests = await prisma.fundraiserRequest.count({
      where: {
        email: userEmail,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (recentRequests >= 3) {
      return NextResponse.json(
        { success: false, message: "You can only submit 3 requests per day" },
        { status: 429 },
      );
    }

    const data = await req.json();

    const title = sanitizeString(data.title);
    const description = sanitizeString(data.description);

    if (!title || title.length < 10) {
      return NextResponse.json(
        { success: false, message: "Title must be at least 10 characters" },
        { status: 400 },
      );
    }

    if (!description || description.length < 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Description must be at least 50 characters",
        },
        { status: 400 },
      );
    }

    const goalAmount = parseInt(data.goalAmount);
    if (isNaN(goalAmount) || goalAmount < 1000) {
      return NextResponse.json(
        { success: false, message: "Goal amount must be at least ₹1,000" },
        { status: 400 },
      );
    }

    if (goalAmount > 10000000) {
      return NextResponse.json(
        { success: false, message: "Goal amount cannot exceed ₹1,00,00,000" },
        { status: 400 },
      );
    }

    if (!data.category) {
      return NextResponse.json(
        { success: false, message: "Category is required" },
        { status: 400 },
      );
    }

    const request = await prisma.fundraiserRequest.create({
      data: {
        name: sanitizeString(data.name) || sanitizeString(session.user.name),
        email: userEmail,
        phone: data.phone ? sanitizePhone(data.phone) : "",
        title: title,
        description: description,
        story: data.story ? sanitizeString(data.story) : description,
        image: data.image || null,
        location: data.location ? sanitizeString(data.location) : "",
        goalAmount: goalAmount,
        category: data.category,
        status: "pending",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Request submitted successfully! We'll review it within 24-48 hours.",
        request,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create fundraiser request:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit request" },
      { status: 500 },
    );
  }
}
