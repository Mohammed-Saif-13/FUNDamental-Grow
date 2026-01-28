import { prisma } from "@/lib/prisma";
import { APIError } from "@/lib/api-error";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/utils/sanitize";

export async function getRequests({ status, limit = 50, cursor } = {}) {
  const where = {};
  if (status) where.status = status;

  const requests = await prisma.fundraiserRequest.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = requests.length > limit;
  const results = hasMore ? requests.slice(0, limit) : requests;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    requests: results,
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function getRequestById(id) {
  if (!id) throw new APIError("Request ID required", 400);

  const request = await prisma.fundraiserRequest.findUnique({
    where: { id },
  });

  if (!request) throw new APIError("Request not found", 404);
  return request;
}

export async function getRequestStats() {
  const stats = await prisma.fundraiserRequest.groupBy({
    by: ["status"],
    _count: true,
  });

  const total = await prisma.fundraiserRequest.count();
  const pending = stats.find((s) => s.status === "pending")?._count || 0;
  const approved = stats.find((s) => s.status === "approved")?._count || 0;
  const rejected = stats.find((s) => s.status === "rejected")?._count || 0;

  return { total, pending, approved, rejected };
}

export async function createRequest(data, userEmail) {
  // Sanitize inputs
  const name = sanitizeString(data.name);
  const email = sanitizeEmail(userEmail);
  const phone = data.phone ? sanitizePhone(data.phone) : "";
  const title = sanitizeString(data.title);
  const description = sanitizeString(data.description);

  if (!title || title.length < 10) {
    throw new APIError("Title must be at least 10 characters", 400);
  }

  if (!description || description.length < 50) {
    throw new APIError("Description must be at least 50 characters", 400);
  }

  const goalAmount = parseInt(data.goalAmount);
  if (isNaN(goalAmount) || goalAmount < 1000) {
    throw new APIError("Goal amount must be at least ₹1,000", 400);
  }

  if (goalAmount > 10000000) {
    throw new APIError("Goal amount cannot exceed ₹1,00,00,000", 400);
  }

  if (!data.category) {
    throw new APIError("Category is required", 400);
  }

  // Rate limit: 3 per day per email
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.fundraiserRequest.count({
    where: {
      email: email,
      createdAt: { gte: oneDayAgo },
    },
  });

  if (recentCount >= 3) {
    throw new APIError("You can only submit 3 requests per day", 429);
  }

  const request = await prisma.fundraiserRequest.create({
    data: {
      name: name,
      email: email,
      phone: phone,
      title: title,
      description: description,
      goalAmount: goalAmount,
      category: data.category,
      status: "pending",
    },
  });

  return request;
}

export async function updateRequestStatus(id, data) {
  if (!id) throw new APIError("Request ID required", 400);

  if (
    data.status &&
    !["pending", "approved", "rejected"].includes(data.status)
  ) {
    throw new APIError("Invalid status", 400);
  }

  const request = await prisma.fundraiserRequest.findUnique({
    where: { id },
    select: { status: true, email: true },
  });

  if (!request) throw new APIError("Request not found", 404);

  const updated = await prisma.fundraiserRequest.update({
    where: { id },
    data: {
      status: data.status,
      ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
    },
  });

  return {
    request: updated,
    statusChanged: data.status !== request.status,
    oldStatus: request.status,
  };
}

export async function deleteRequest(id) {
  if (!id) throw new APIError("Request ID required", 400);

  const request = await prisma.fundraiserRequest.findUnique({
    where: { id },
    select: { email: true, title: true },
  });

  if (!request) throw new APIError("Request not found", 404);

  await prisma.fundraiserRequest.delete({ where: { id } });

  return {
    deletedEmail: request.email,
    deletedTitle: request.title,
  };
}
