import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/utils/currency";

export async function getDashboardStats() {
  const [
    totalCampaigns,
    activeCampaigns,
    totalDonations,
    totalRaised,
    totalVolunteers,
    pendingVolunteers,
    unreadContacts,
    recentDonations,
  ] = await Promise.all([
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.donation.count({ where: { paymentStatus: "completed" } }),
    prisma.donation.aggregate({
      where: { paymentStatus: "completed" },
      _sum: { amount: true },
    }),
    prisma.volunteer.count(),
    prisma.volunteer.count({ where: { status: "pending" } }),
    prisma.contact.count({ where: { status: "unread" } }),
    prisma.donation.findMany({
      where: { paymentStatus: "completed" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        campaign: { select: { title: true, slug: true } },
        user: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalCampaigns,
    activeCampaigns,
    totalDonations,
    totalRaised: paiseToRupees(totalRaised._sum.amount || 0),
    totalVolunteers,
    pendingVolunteers,
    unreadContacts,
    recentDonations: recentDonations.map((d) => ({
      ...d,
      amount: paiseToRupees(d.amount),
    })),
  };
}

export async function getCampaignStats() {
  const [total, active, pending, rejected, completed] = await Promise.all([
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.campaign.count({ where: { status: "pending" } }),
    prisma.campaign.count({ where: { status: "rejected" } }),
    prisma.campaign.count({ where: { status: "completed" } }),
  ]);

  return { total, active, pending, rejected, completed };
}

export async function getDonationStats() {
  const [total, completed, pending, failed, totalAmount] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.count({ where: { paymentStatus: "completed" } }),
    prisma.donation.count({ where: { paymentStatus: "pending" } }),
    prisma.donation.count({ where: { paymentStatus: "failed" } }),
    prisma.donation.aggregate({
      where: { paymentStatus: "completed" },
      _sum: { amount: true },
    }),
  ]);

  return {
    total,
    completed,
    pending,
    failed,
    totalAmount: paiseToRupees(totalAmount._sum.amount || 0),
  };
}

export async function getUserStats() {
  const [total, admins, volunteers, users, newThisMonth] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "VOLUNTEER" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  return { total, admins, volunteers, users, newThisMonth };
}

export async function getAllStats() {
  const [dashboard, campaigns, donations, users] = await Promise.all([
    getDashboardStats(),
    getCampaignStats(),
    getDonationStats(),
    getUserStats(),
  ]);

  return { dashboard, campaigns, donations, users };
}
