/**
 * Standardized API Response Utility
 * Ensures consistent response format across all endpoints
 */

import { NextResponse } from "next/server";

/**
 * Success response
 * @param {Object} data - Response data
 * @param {string} message - Success message (optional)
 * @param {number} status - HTTP status code (default: 200)
 */
export function successResponse(data = {}, message = null, status = 200) {
  const response = {
    success: true,
    ...data,
  };

  if (message) {
    response.message = message;
  }

  return NextResponse.json(response, { status });
}

/**
 * Created response (201)
 * @param {Object} data - Created resource data
 * @param {string} message - Success message
 */
export function createdResponse(data = {}, message = "Created successfully") {
  return successResponse(data, message, 201);
}

/**
 * Error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code (default: 500)
 * @param {Object} extra - Additional error details
 */
export function errorResponse(
  message = "Something went wrong",
  status = 500,
  extra = {},
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...extra,
    },
    { status },
  );
}

/**
 * Validation error response (400)
 * @param {string} message - Error message
 * @param {string[]} errors - Array of validation errors
 */
export function validationErrorResponse(
  message = "Validation failed",
  errors = [],
) {
  return errorResponse(message, 400, { errors });
}

/**
 * Unauthorized response (401)
 * @param {string} message - Error message
 */
export function unauthorizedResponse(message = "Authentication required") {
  return errorResponse(message, 401);
}

/**
 * Forbidden response (403)
 * @param {string} message - Error message
 */
export function forbiddenResponse(message = "Access denied") {
  return errorResponse(message, 403);
}

/**
 * Not found response (404)
 * @param {string} resource - Resource name
 */
export function notFoundResponse(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Rate limit response (429)
 * @param {string} message - Error message
 * @param {Object} rateLimitInfo - Rate limit headers info
 */
export function rateLimitResponse(
  message = "Too many requests. Please try again later.",
  rateLimitInfo = {},
) {
  const headers = {};
  if (rateLimitInfo.limit)
    headers["X-RateLimit-Limit"] = rateLimitInfo.limit.toString();
  if (rateLimitInfo.remaining !== undefined)
    headers["X-RateLimit-Remaining"] = rateLimitInfo.remaining.toString();
  if (rateLimitInfo.reset)
    headers["X-RateLimit-Reset"] = new Date(rateLimitInfo.reset).toISOString();

  return NextResponse.json(
    { success: false, message },
    { status: 429, headers },
  );
}

/**
 * Paginated response
 * @param {Array} items - Array of items
 * @param {Object} pagination - Pagination info
 * @param {string} itemsKey - Key name for items array (default: 'data')
 */
export function paginatedResponse(items, pagination, itemsKey = "data") {
  return successResponse({
    [itemsKey]: items,
    pagination,
  });
}

/**
 * Handle Prisma errors and return appropriate response
 * @param {Error} error - Prisma error
 */
export function handlePrismaError(error) {
  console.error("Database error:", {
    code: error.code,
    meta: error.meta,
    message: error.message,
  });

  switch (error.code) {
    case "P2002":
      return errorResponse(
        "A record with this information already exists",
        400,
      );
    case "P2003":
      return errorResponse("Invalid reference. Related record not found", 400);
    case "P2025":
      return notFoundResponse("Record");
    case "P2014":
      return errorResponse(
        "This operation would violate a required relation",
        400,
      );
    default:
      return errorResponse("Database operation failed", 500);
  }
}

/**
 * Generic error handler for catch blocks
 * @param {Error} error - Caught error
 * @param {string} context - Context for logging (e.g., "Campaign creation")
 */
export function handleError(error, context = "Operation") {
  console.error(`${context} error:`, error);

  // Check if it's a Prisma error
  if (error.code && error.code.startsWith("P")) {
    return handlePrismaError(error);
  }

  // Check if it's already a formatted error response
  if (error.statusCode) {
    return errorResponse(error.message, error.statusCode);
  }

  return errorResponse(`${context} failed`);
}
