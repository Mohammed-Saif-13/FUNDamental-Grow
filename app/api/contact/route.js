import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendContactAcknowledgmentEmail } from "@/lib/email";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { sanitizeString } from "@/lib/utils/sanitize";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "form", "contact");
  if (rateLimitError) return rateLimitError;

  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name: sanitizeString(data.name),
        email: data.email.toLowerCase().trim(),
        phone: data.phone ? sanitizeString(data.phone) : null,
        subject: sanitizeString(data.subject),
        message: sanitizeString(data.message),
      },
    });

    sendContactAcknowledgmentEmail(contact).catch((err) =>
      console.error("Failed to send contact acknowledgment:", err),
    );

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  const rateLimitError = checkRateLimit(req, "general", "contact-list");
  if (rateLimitError) return rateLimitError;

  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
