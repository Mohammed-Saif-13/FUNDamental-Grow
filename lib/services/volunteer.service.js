import { prisma } from "@/lib/prisma";
import { APIError } from "@/lib/api-error";

/**
 * Get all volunteers with filters
 */
export async function getVolunteers({ status, limit = 50, cursor } = {}) {
  const where = {};
  if (status) where.status = status;

  const volunteers = await prisma.volunteer.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      _count: { select: { tasks: true } },
    },
  });

  const hasMore = volunteers.length > limit;
  const results = hasMore ? volunteers.slice(0, limit) : volunteers;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    volunteers: results,
    pagination: { nextCursor, hasMore, limit },
  };
}

/**
 * Get single volunteer by ID
 */
export async function getVolunteerById(id) {
  if (!id) throw new APIError("Volunteer ID required", 400);

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      tasks: {
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!volunteer) throw new APIError("Volunteer not found", 404);
  return volunteer;
}

/**
 * Update volunteer status (approve/reject)
 */
export async function updateVolunteerStatus(id, data) {
  if (!id) throw new APIError("Volunteer ID required", 400);

  if (
    data.status &&
    !["pending", "approved", "rejected"].includes(data.status)
  ) {
    throw new APIError("Invalid status", 400);
  }

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
    select: { userId: true, email: true, name: true, status: true },
  });

  if (!volunteer) throw new APIError("Volunteer not found", 404);

  const updateData = {};
  if (data.status) updateData.status = data.status;
  if (data.skills) updateData.skills = data.skills;
  if (data.availability) updateData.availability = data.availability;

  const updated = await prisma.volunteer.update({
    where: { id },
    data: updateData,
  });

  // Update user role if approved
  if (data.status === "approved" && volunteer.userId) {
    await prisma.user
      .update({
        where: { id: volunteer.userId },
        data: { role: "VOLUNTEER" },
      })
      .catch((err) => console.error("Failed to update user role:", err));
  }

  return {
    volunteer: updated,
    statusChanged: data.status && data.status !== volunteer.status,
    oldStatus: volunteer.status,
  };
}

/**
 * Delete volunteer
 */
export async function deleteVolunteer(id) {
  if (!id) throw new APIError("Volunteer ID required", 400);

  const volunteer = await prisma.volunteer.findUnique({
    where: { id },
    select: { email: true, name: true },
  });

  if (!volunteer) throw new APIError("Volunteer not found", 404);

  await prisma.volunteer.delete({ where: { id } });

  return {
    deletedEmail: volunteer.email,
    deletedName: volunteer.name,
  };
}

/**
 * Get volunteer stats
 */
export async function getVolunteerStats() {
  const [total, pending, approved, rejected] = await Promise.all([
    prisma.volunteer.count(),
    prisma.volunteer.count({ where: { status: "pending" } }),
    prisma.volunteer.count({ where: { status: "approved" } }),
    prisma.volunteer.count({ where: { status: "rejected" } }),
  ]);

  return { total, pending, approved, rejected };
}
