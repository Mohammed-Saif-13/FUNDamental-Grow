import { prisma } from "@/lib/prisma";
import { rupeesToPaise, paiseToRupees } from "@/lib/utils/currency";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/utils/sanitize";
import { APIError } from "@/lib/api-error";

export async function createPendingDonation(data) {
  const donorName = sanitizeString(data.donorName);
  const donorEmail = sanitizeEmail(data.donorEmail);
  const donorPhone = data.donorPhone ? sanitizePhone(data.donorPhone) : null;
  const message = data.message ? sanitizeString(data.message) : null;

  if (!data.amount || data.amount < 100 || data.amount > 500000) {
    throw new APIError("Amount must be between ₹100 and ₹5,00,000", 400);
  }

  if (!data.campaignId || !data.orderId) {
    throw new APIError("Campaign ID and Order ID are required", 400);
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId },
    select: { goalAmount: true, raisedAmount: true, status: true },
  });

  if (!campaign) {
    throw new APIError("Campaign not found", 404);
  }

  if (campaign.status !== "active") {
    throw new APIError("Campaign is not active", 400);
  }

  const amountInPaise = rupeesToPaise(data.amount);
  const remainingAmount = campaign.goalAmount - campaign.raisedAmount;

  if (amountInPaise > remainingAmount) {
    const remainingRupees = paiseToRupees(remainingAmount);
    throw new APIError(
      `Campaign only needs ₹${remainingRupees.toLocaleString()} more`,
      400,
    );
  }

  const recentDonation = await prisma.donation.findFirst({
    where: {
      donorEmail: donorEmail,
      campaignId: data.campaignId,
      paymentStatus: "pending",
      createdAt: { gte: new Date(Date.now() - 60000) },
    },
  });

  if (recentDonation) {
    throw new APIError(
      "You already have a pending donation. Please complete or wait 1 minute.",
      429,
    );
  }

  const donation = await prisma.donation.create({
    data: {
      amount: amountInPaise,
      donorName: donorName,
      donorEmail: donorEmail,
      donorPhone: donorPhone,
      message: message,
      anonymous: data.anonymous || false,
      paymentStatus: "pending",
      orderId: data.orderId,
      campaignId: data.campaignId,
      userId: data.userId || null,
    },
  });

  return {
    ...donation,
    amount: paiseToRupees(donation.amount),
  };
}

export async function getDonationByOrderId(orderId) {
  const donation = await prisma.donation.findUnique({
    where: { orderId },
    include: {
      campaign: {
        select: { id: true, title: true, slug: true, organizerEmail: true },
      },
    },
  });

  if (!donation) return null;

  return {
    ...donation,
    amount: paiseToRupees(donation.amount),
  };
}

export async function completeDonation(orderId, paymentId, signature) {
  const result = await prisma.$transaction(async (tx) => {
    const donation = await tx.donation.findUnique({
      where: { orderId },
    });

    if (!donation) throw new Error("Donation not found");

    if (donation.paymentStatus === "completed") {
      return { donation, alreadyProcessed: true };
    }

    const updatedDonation = await tx.donation.update({
      where: { id: donation.id },
      data: {
        paymentStatus: "completed",
        paymentId,
        signature,
        updatedAt: new Date(),
      },
    });

    await tx.campaign.update({
      where: { id: donation.campaignId },
      data: { raisedAmount: { increment: donation.amount } },
    });

    return { donation: updatedDonation, alreadyProcessed: false };
  });

  return {
    ...result.donation,
    amount: paiseToRupees(result.donation.amount),
    alreadyProcessed: result.alreadyProcessed,
  };
}

export async function getDonations({
  campaignId,
  paymentStatus,
  cursor,
  limit = 20,
}) {
  const where = {};
  if (campaignId) where.campaignId = campaignId;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const donations = await prisma.donation.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      donorName: true,
      donorEmail: true,
      donorPhone: true,
      anonymous: true,
      paymentStatus: true,
      paymentId: true,
      createdAt: true,
      campaign: { select: { id: true, title: true, slug: true } },
    },
  });

  const hasMore = donations.length > limit;
  const results = hasMore ? donations.slice(0, limit) : donations;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  const converted = results.map((d) => ({
    ...d,
    amount: paiseToRupees(d.amount),
  }));

  return {
    donations: converted,
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function cleanupStalePendingDonations() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await prisma.donation.deleteMany({
    where: {
      paymentStatus: "pending",
      createdAt: { lt: twentyFourHoursAgo },
    },
  });

  return { deletedCount: result.count };
}
