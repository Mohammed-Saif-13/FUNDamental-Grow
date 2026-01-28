import { prisma } from "@/lib/prisma";
import { rupeesToPaise, paiseToRupees } from "@/lib/utils/currency";
import { sanitizeCampaignData } from "@/lib/utils/sanitize";

function generateSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  return `${baseSlug}-${uniqueId}`;
}

export async function createCampaign(data, userId) {
  const sanitizedData = sanitizeCampaignData(data);
  const goalInPaise = rupeesToPaise(sanitizedData.goalAmount);

  const campaign = await prisma.campaign.create({
    data: {
      title: sanitizedData.title,
      slug: generateSlug(sanitizedData.title),
      category: sanitizedData.category,
      goalAmount: goalInPaise,
      raisedAmount: 0,
      endDate: new Date(sanitizedData.endDate),
      description: sanitizedData.description,
      story: sanitizedData.story,
      image: sanitizedData.image,
      organizerName: sanitizedData.organizerName,
      organizerEmail: sanitizedData.organizerEmail,
      organizerPhone: sanitizedData.organizerPhone,
      location: sanitizedData.location,
      status: "active",
      featured: sanitizedData.featured || false,
      userId,
    },
  });

  return {
    ...campaign,
    goalAmount: paiseToRupees(campaign.goalAmount),
    raisedAmount: paiseToRupees(campaign.raisedAmount),
  };
}

export async function getCampaigns({
  status,
  category,
  featured,
  cursor,
  limit = 12,
} = {}) {
  const where = {};

  if (status !== undefined) {
    where.status = status;
    where.isPublic = true;
  }

  if (category) where.category = category;
  if (featured === "true") where.featured = true;

  const campaigns = await prisma.campaign.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      image: true,
      goalAmount: true,
      raisedAmount: true,
      endDate: true,
      location: true,
      organizerName: true,
      status: true,
      featured: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
      _count: { select: { donations: true } },
    },
  });

  const hasMore = campaigns.length > limit;
  const results = hasMore ? campaigns.slice(0, limit) : campaigns;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  const converted = results.map((c) => ({
    ...c,
    goalAmount: paiseToRupees(c.goalAmount),
    raisedAmount: paiseToRupees(c.raisedAmount),
  }));

  return {
    campaigns: converted,
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function getCampaignById(id) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true, id: true } },
      updates: { orderBy: { createdAt: "desc" } },
      donations: {
        take: 5,
        where: { paymentStatus: "completed" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          donorName: true,
          createdAt: true,
          message: true,
          anonymous: true,
          user: { select: { image: true } },
        },
      },
      _count: { select: { donations: true } },
    },
  });

  if (!campaign) return null;

  return {
    ...campaign,
    goalAmount: paiseToRupees(campaign.goalAmount),
    raisedAmount: paiseToRupees(campaign.raisedAmount),
    donations: campaign.donations.map((d) => ({
      ...d,
      amount: paiseToRupees(d.amount),
    })),
  };
}

export async function updateCampaign(id, data, session) {
  const existing = await prisma.campaign.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true, raisedAmount: true },
  });

  if (!existing) {
    return { error: "Campaign not found", status: 404 };
  }

  const isOwner = existing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return { error: "Unauthorized", status: 403 };
  }

  if (!isAdmin && existing.status !== "pending") {
    return { error: "You can only edit pending campaigns", status: 403 };
  }

  if (data.goalAmount && existing.raisedAmount > 0) {
    return {
      error: "Cannot change goal amount after donations received",
      status: 400,
    };
  }

  // Sanitize input data
  const sanitized = sanitizeCampaignData(data);
  const updateData = {};

  if (!isAdmin) {
    if (sanitized.title) updateData.title = sanitized.title;
    if (sanitized.description) updateData.description = sanitized.description;
    if (sanitized.story) updateData.story = sanitized.story;
    if (sanitized.image) updateData.image = sanitized.image;
    if (sanitized.organizerName)
      updateData.organizerName = sanitized.organizerName;
    if (sanitized.organizerEmail)
      updateData.organizerEmail = sanitized.organizerEmail;
    if (sanitized.organizerPhone)
      updateData.organizerPhone = sanitized.organizerPhone;
    if (sanitized.location) updateData.location = sanitized.location;
  }

  if (isAdmin) {
    if (sanitized.title) updateData.title = sanitized.title;
    if (sanitized.description) updateData.description = sanitized.description;
    if (sanitized.story) updateData.story = sanitized.story;
    if (data.category) updateData.category = data.category;
    if (data.goalAmount) updateData.goalAmount = rupeesToPaise(data.goalAmount);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (sanitized.location) updateData.location = sanitized.location;
    if (sanitized.organizerName)
      updateData.organizerName = sanitized.organizerName;
    if (sanitized.organizerEmail)
      updateData.organizerEmail = sanitized.organizerEmail;
    if (sanitized.organizerPhone)
      updateData.organizerPhone = sanitized.organizerPhone;
    if (data.image) updateData.image = data.image;
    if (data.status) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: updateData,
    include: { user: { select: { name: true, email: true } } },
  });

  return {
    campaign: {
      ...campaign,
      goalAmount: paiseToRupees(campaign.goalAmount),
      raisedAmount: paiseToRupees(campaign.raisedAmount),
    },
    statusChanged: data.status && existing.status !== data.status,
    oldStatus: existing.status,
  };
}

export async function deleteCampaign(id, session) {
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    select: { id: true, userId: true, raisedAmount: true },
  });

  if (!campaign) {
    return { error: "Campaign not found", status: 404 };
  }

  const isOwner = campaign.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return { error: "Unauthorized", status: 403 };
  }

  if (campaign.raisedAmount > 0) {
    return { error: "Cannot delete campaign with donations", status: 400 };
  }

  await prisma.campaign.delete({ where: { id } });
  return { success: true };
}
