import { prisma } from "@/lib/prisma";

export const AuditAction = {
  USER_ROLE_CHANGED: "user_role_changed",
  USER_DELETED: "user_deleted",
  CAMPAIGN_APPROVED: "campaign_approved",
  CAMPAIGN_REJECTED: "campaign_rejected",
  CAMPAIGN_DELETED: "campaign_deleted",
  VOLUNTEER_APPROVED: "volunteer_approved",
  VOLUNTEER_REJECTED: "volunteer_rejected",
  DONATION_DELETED: "donation_deleted",
  SETTINGS_UPDATED: "settings_updated",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
  PASSWORD_RESET_COMPLETED: "password_reset_completed",
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_EXPIRED: "payment_expired",
  FUNDRAISER_APPROVED: "fundraiser_approved",
  FUNDRAISER_REJECTED: "fundraiser_rejected",
  FUNDRAISER_DELETED: "fundraiser_deleted",
};

export const EntityType = {
  USER: "user",
  CAMPAIGN: "campaign",
  DONATION: "donation",
  VOLUNTEER: "volunteer",
  SETTINGS: "settings",
};

export async function logActivity({
  userId,
  action,
  entityType,
  entityId,
  details,
  req,
}) {
  try {
    const ipAddress = req
      ? req.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers?.get?.("x-real-ip") ||
        null
      : null;

    const userAgent = req ? req.headers?.get?.("user-agent") || null : null;

    await prisma.activityLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getActivityLogs({
  userId,
  action,
  entityType,
  limit = 50,
  cursor,
}) {
  const where = {};
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entityType) where.entityType = entityType;

  const logs = await prisma.activityLog.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = logs.length > limit;
  const results = hasMore ? logs.slice(0, limit) : logs;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    logs: results.map((log) => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : null,
    })),
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function logPaymentInitiated({
  donationId,
  amount,
  campaignId,
  req,
}) {
  return logActivity({
    action: AuditAction.PAYMENT_INITIATED,
    entityType: EntityType.DONATION,
    entityId: donationId,
    details: { amount, campaignId },
    req,
  });
}

export async function logPaymentSuccess({
  donationId,
  paymentId,
  orderId,
  req,
}) {
  return logActivity({
    action: AuditAction.PAYMENT_SUCCESS,
    entityType: EntityType.DONATION,
    entityId: donationId,
    details: { paymentId, orderId },
    req,
  });
}

export async function logPaymentFailed({ donationId, reason, req }) {
  return logActivity({
    action: AuditAction.PAYMENT_FAILED,
    entityType: EntityType.DONATION,
    entityId: donationId,
    details: { reason },
    req,
  });
}
