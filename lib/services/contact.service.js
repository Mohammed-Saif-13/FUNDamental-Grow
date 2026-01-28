import { prisma } from "@/lib/prisma";
import { APIError } from "@/lib/api-error";
import { sanitizeString } from "@/lib/utils/sanitize";

/**
 * Get all contacts with pagination
 */
export async function getContacts({ status, limit = 100, cursor } = {}) {
  const where = {};
  if (status) where.status = status;

  const contacts = await prisma.contact.findMany({
    where,
    take: limit + 1,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
  });

  const hasMore = contacts.length > limit;
  const results = hasMore ? contacts.slice(0, limit) : contacts;
  const nextCursor = hasMore ? results[results.length - 1].id : null;

  return {
    contacts: results,
    pagination: { nextCursor, hasMore, limit },
  };
}

/**
 * Create new contact (public form submission)
 */
export async function createContact(data) {
  // Validation
  if (!data.name || !data.email || !data.subject || !data.message) {
    throw new APIError("Missing required fields", 400);
  }

  if (data.name.length < 2 || data.name.length > 100) {
    throw new APIError("Name must be 2-100 characters", 400);
  }

  if (data.subject.length < 5 || data.subject.length > 200) {
    throw new APIError("Subject must be 5-200 characters", 400);
  }

  if (data.message.length < 10 || data.message.length > 2000) {
    throw new APIError("Message must be 10-2000 characters", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new APIError("Invalid email format", 400);
  }

  // Sanitize inputs
  const contact = await prisma.contact.create({
    data: {
      name: sanitizeString(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? sanitizeString(data.phone) : null,
      subject: sanitizeString(data.subject),
      message: sanitizeString(data.message),
      status: "unread",
    },
  });

  return contact;
}

/**
 * Update contact status (read/unread)
 */
export async function updateContactStatus(id, status) {
  if (!id) throw new APIError("Contact ID required", 400);
  if (!["read", "unread"].includes(status)) {
    throw new APIError("Invalid status", 400);
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { status },
  });

  return contact;
}

/**
 * Delete contact
 */
export async function deleteContact(id) {
  if (!id) throw new APIError("Contact ID required", 400);

  const contact = await prisma.contact.findUnique({
    where: { id },
    select: { email: true, subject: true },
  });

  if (!contact) throw new APIError("Contact not found", 404);

  await prisma.contact.delete({ where: { id } });

  return {
    deletedEmail: contact.email,
    deletedSubject: contact.subject,
  };
}

/**
 * Get contact stats
 */
export async function getContactStats() {
  const [total, unread, read] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "unread" } }),
    prisma.contact.count({ where: { status: "read" } }),
  ]);

  return { total, unread, read };
}
