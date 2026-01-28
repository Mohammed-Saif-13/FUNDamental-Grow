import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const unsubscribeSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export async function POST(req) {
  try {
    const body = await req.json();

    const validation = unsubscribeSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse("Invalid email address", 400);
    }

    const { email } = validation.data;

    const subscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return errorResponse("Email not found in our list", 404);
    }

    if (subscriber.status === "unsubscribed") {
      return errorResponse("Already unsubscribed", 400);
    }

    await prisma.newsletter.update({
      where: { email },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    });

    return successResponse(null, "Successfully unsubscribed from newsletter");
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return errorResponse("Failed to unsubscribe. Please try again.");
  }
}
