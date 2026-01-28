import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/middleware";
import { paiseToRupees } from "@/lib/utils/currency";
import {
  successResponse,
  notFoundResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET(req, { params }) {
  const rateLimitError = checkRateLimit(req, "general", "campaign-slug");
  if (rateLimitError) return rateLimitError;

  try {
    const { slug } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        user: { select: { name: true, image: true } },
        updates: { orderBy: { createdAt: "desc" }, take: 5 },
        donations: {
          where: { paymentStatus: "completed" },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            amount: true,
            donorName: true,
            message: true,
            anonymous: true,
            createdAt: true,
          },
        },
        _count: {
          select: { donations: { where: { paymentStatus: "completed" } } },
        },
      },
    });

    if (!campaign) {
      return notFoundResponse("Campaign not found");
    }

    if (!campaign.isPublic || campaign.status !== "active") {
      return notFoundResponse("Campaign not found");
    }

    const formattedCampaign = {
      ...campaign,
      goalAmount: paiseToRupees(campaign.goalAmount),
      raisedAmount: paiseToRupees(campaign.raisedAmount),
      donations: campaign.donations.map((d) => ({
        ...d,
        amount: paiseToRupees(d.amount),
        donorName: d.anonymous ? "Anonymous" : d.donorName,
      })),
    };

    return successResponse(formattedCampaign);
  } catch (error) {
    console.error("Get campaign by slug error:", error);
    return errorResponse("Failed to fetch campaign", 500);
  }
}
