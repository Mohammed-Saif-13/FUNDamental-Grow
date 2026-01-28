import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { APIError } from "@/lib/api-error";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
} from "@/lib/utils/sanitize";
import { paiseToRupees } from "@/lib/utils/currency";

export async function getUserById(id) {
  if (!id) throw new APIError("User ID required", 400);

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          campaigns: true,
          donations: { where: { paymentStatus: "completed" } },
        },
      },
    },
  });
}

export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function createUser({ name, email, password }) {
  const sanitizedName = sanitizeString(name);
  const sanitizedEmail = sanitizeEmail(email);

  const existing = await getUserByEmail(sanitizedEmail);
  if (existing) throw new APIError("Email already registered", 400);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

export async function updateUserProfile(userId, data) {
  if (!userId) throw new APIError("User ID required", 400);

  const updateData = {};
  if (data.name) updateData.name = sanitizeString(data.name);
  if (data.image !== undefined) updateData.image = data.image;
  if (data.phone) updateData.phone = sanitizePhone(data.phone);

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  });
}

export async function updateUserPassword(userId, currentPassword, newPassword) {
  if (!userId) throw new APIError("User ID required", 400);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    throw new APIError("Cannot change password for OAuth accounts", 400);
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw new APIError("Current password is incorrect", 400);

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function getUsers({ role, search, cursor, limit = 50 } = {}) {
  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { campaigns: true, donations: true } },
      volunteer: { select: { status: true } },
    },
  });

  const hasMore = users.length > limit;
  const results = hasMore ? users.slice(0, limit) : users;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    users: results,
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function updateUserRole(userId, role, adminId) {
  if (!userId) throw new APIError("User ID required", 400);
  if (userId === adminId)
    throw new APIError("Cannot change your own role", 400);

  if (!["USER", "ADMIN", "VOLUNTEER"].includes(role)) {
    throw new APIError("Invalid role", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });

  if (!existingUser) throw new APIError("User not found", 404);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return {
    user,
    oldRole: existingUser.role,
    changed: role !== existingUser.role,
  };
}

export async function deleteUser(userId, adminId) {
  if (!userId) throw new APIError("User ID required", 400);
  if (userId === adminId)
    throw new APIError("Cannot delete your own account", 400);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      role: true,
      _count: { select: { campaigns: true } },
    },
  });

  if (!user) throw new APIError("User not found", 404);

  if (user._count.campaigns > 0) {
    throw new APIError(
      `Cannot delete user with ${user._count.campaigns} campaigns`,
      400,
    );
  }

  await prisma.user.delete({ where: { id: userId } });

  return {
    deletedEmail: user.email,
    deletedName: user.name,
    deletedRole: user.role,
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

export async function getUserDashboard(userId) {
  if (!userId) throw new APIError("User ID required", 400);

  const [user, campaigns, donations, totalDonated] = await Promise.all([
    getUserById(userId),
    prisma.campaign.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        goalAmount: true,
        raisedAmount: true,
      },
    }),
    prisma.donation.findMany({
      where: { userId, paymentStatus: "completed" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { campaign: { select: { title: true, slug: true } } },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { userId, paymentStatus: "completed" },
    }),
  ]);

  return {
    user,
    campaigns: campaigns.map((c) => ({
      ...c,
      goalAmount: paiseToRupees(c.goalAmount),
      raisedAmount: paiseToRupees(c.raisedAmount),
    })),
    donations: donations.map((d) => ({
      ...d,
      amount: paiseToRupees(d.amount),
    })),
    totalDonated: paiseToRupees(totalDonated._sum.amount || 0),
  };
}
