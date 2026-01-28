import { prisma } from "@/lib/prisma";
import { APIError } from "@/lib/api-error";
import { sanitizeString } from "@/lib/utils/sanitize";

export async function createTestimonial(data) {
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new APIError("Name must be 2-100 characters", 400);
  }

  if (!data.message || data.message.length < 10 || data.message.length > 500) {
    throw new APIError("Message must be 10-500 characters", 400);
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new APIError("Valid email required", 400);
  }

  const rating = parseInt(data.rating) || 5;
  if (rating < 1 || rating > 5) {
    throw new APIError("Rating must be 1-5", 400);
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name: sanitizeString(data.name),
      email: data.email.toLowerCase().trim(),
      role: data.role ? sanitizeString(data.role) : "User",
      message: sanitizeString(data.message),
      rating,
      status: "pending",
      featured: false,
    },
  });

  return testimonial;
}

export async function getTestimonials({
  status,
  featured,
  cursor,
  limit = 12,
} = {}) {
  const where = {};
  if (status) where.status = status;
  if (featured === "true" || featured === true) where.featured = true;

  const testimonials = await prisma.testimonial.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      role: true,
      message: true,
      rating: true,
      image: true,
      featured: true,
      status: true,
      createdAt: true,
    },
  });

  const hasMore = testimonials.length > limit;
  const results = hasMore ? testimonials.slice(0, limit) : testimonials;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    testimonials: results,
    pagination: { nextCursor, hasMore, limit },
  };
}

export async function updateTestimonial(id, data) {
  if (!id) throw new APIError("Testimonial ID required", 400);

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new APIError("Testimonial not found", 404);

  const updateData = {};
  if (data.status) {
    if (!["pending", "approved", "rejected"].includes(data.status)) {
      throw new APIError("Invalid status", 400);
    }
    updateData.status = data.status;
  }
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.image !== undefined) updateData.image = data.image;

  return prisma.testimonial.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteTestimonial(id) {
  if (!id) throw new APIError("Testimonial ID required", 400);

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) throw new APIError("Testimonial not found", 404);

  await prisma.testimonial.delete({ where: { id } });

  return {
    deletedName: existing.name,
    deletedEmail: existing.email,
  };
}
