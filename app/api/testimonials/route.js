import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import {
  createTestimonial,
  getTestimonials,
} from "@/lib/services/testimonial.service";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { testimonialSchema } from "@/lib/validations";

export async function POST(req) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  const rateLimitError = checkRateLimit(req, "form", "testimonial");
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();

    const validation = testimonialSchema.safeParse(body);
    if (!validation.success) {
      return validationErrorResponse(validation.error.flatten().fieldErrors);
    }

    const testimonial = await createTestimonial(validation.data);

    return successResponse(
      testimonial,
      "Testimonial submitted successfully",
      201,
    );
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return errorResponse("Failed to submit testimonial", 500);
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit")) || 12;

    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    const finalStatus = !isAdmin ? "approved" : status;

    const result = await getTestimonials({
      status: finalStatus,
      featured,
      cursor,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return errorResponse("Failed to fetch testimonials", 500);
  }
}
