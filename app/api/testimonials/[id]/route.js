import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import {
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/services/testimonial.service";
import {
  successResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
} from "@/lib/api-response";

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const body = await req.json();

    const result = await updateTestimonial(id, body);

    return successResponse(result, "Testimonial updated successfully");
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    if (error.message === "Testimonial not found") {
      return notFoundResponse("Testimonial not found");
    }
    return errorResponse("Failed to update testimonial", 500);
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    await deleteTestimonial(id);

    return successResponse(null, "Testimonial deleted successfully");
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    if (error.message === "Testimonial not found") {
      return notFoundResponse("Testimonial not found");
    }
    return errorResponse("Failed to delete testimonial", 500);
  }
}
