import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkCsrf } from "@/lib/middleware";
import {
  successResponse,
  forbiddenResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function PUT(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    const data = await req.json();

    if (data.status && !["unread", "read", "replied"].includes(data.status)) {
      return errorResponse("Invalid status", 400);
    }

    const contact = await prisma.contact.update({
      where: { id },
      data: { status: data.status },
    });

    return successResponse(contact, "Contact updated successfully");
  } catch (error) {
    console.error("Update contact error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Contact not found");
    }
    return errorResponse("Failed to update contact", 500);
  }
}

export async function DELETE(req, { params }) {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
      return forbiddenResponse("Admin access required");
    }

    const { id } = await params;
    await prisma.contact.delete({ where: { id } });

    return successResponse(null, "Contact deleted successfully");
  } catch (error) {
    console.error("Delete contact error:", error);
    if (error.code === "P2025") {
      return notFoundResponse("Contact not found");
    }
    return errorResponse("Failed to delete contact", 500);
  }
}
