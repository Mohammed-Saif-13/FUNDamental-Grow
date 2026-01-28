import { getCampaigns, createCampaign } from "@/lib/services/campaign.service";
import { withAdminAuth } from "@/lib/middleware/auth";
import { checkRateLimit, checkCsrf } from "@/lib/middleware";
import { withValidation } from "@/lib/middleware/validation";
import {
  createCampaignSchema,
  campaignQuerySchema,
} from "@/lib/validations/campaign";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req) {
  const rateLimitError = checkRateLimit(req, "search", "campaigns");
  if (rateLimitError) return rateLimitError;

  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const validated = campaignQuerySchema.parse(query);

    if (validated.limit && validated.limit > 100) {
      validated.limit = 100;
    }

    const result = await getCampaigns(validated);

    return successResponse(result);
  } catch (error) {
    console.error("GET campaigns error:", error);
    return errorResponse("Failed to fetch campaigns", 500);
  }
}

const postHandler = async (req) => {
  const csrfError = checkCsrf(req);
  if (csrfError) return csrfError;

  try {
    const campaign = await createCampaign(
      req.validatedData,
      req.session.user.id,
    );

    return successResponse(campaign, "Campaign created successfully", 201);
  } catch (error) {
    console.error("Create campaign error:", error);
    if (error.code === "P2002") {
      return errorResponse("Duplicate campaign title/slug", 400);
    }
    return errorResponse("Failed to create campaign", 500);
  }
};

export const POST = withAdminAuth(
  withValidation(createCampaignSchema)(postHandler),
);
