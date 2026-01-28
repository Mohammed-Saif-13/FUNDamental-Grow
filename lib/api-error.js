// Custom API Error class
export class APIError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "APIError";
  }
}

// Error handler middleware
export function handleAPIError(error) {
  // Log error
  console.error("API Error:", {
    message: error.message,
    code: error.code,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });

  // Prisma errors
  if (error.code === "P2002") {
    return {
      success: false,
      message: "A record with this information already exists",
      statusCode: 400,
    };
  }

  if (error.code === "P2003") {
    return {
      success: false,
      message: "Invalid reference. Related record not found",
      statusCode: 400,
    };
  }

  if (error.code === "P2025") {
    return {
      success: false,
      message: "Record not found",
      statusCode: 404,
    };
  }

  // Custom API errors
  if (error instanceof APIError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Unknown errors
  return {
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
    statusCode: 500,
  };
}

// Auth error helper
export function authError(message = "Authentication required") {
  throw new APIError(message, 401);
}

// Validation error helper
export function validationError(message, errors = []) {
  const error = new APIError(message, 400);
  error.errors = errors;
  throw error;
}

// Not found error helper
export function notFoundError(resource = "Resource") {
  throw new APIError(`${resource} not found`, 404);
}

// Forbidden error helper
export function forbiddenError(message = "Access denied") {
  throw new APIError(message, 403);
}
