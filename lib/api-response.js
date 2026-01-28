import { NextResponse } from "next/server";

export function successResponse(data, message = "Success", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function errorResponse(message, status = 400, errors = null) {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return NextResponse.json(response, { status });
}

export function unauthorizedResponse(message = "Authentication required") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Access denied") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Resource not found") {
  return errorResponse(message, 404);
}

export function validationErrorResponse(errors) {
  return errorResponse("Validation failed", 400, errors);
}

export function serverErrorResponse(message = "Internal server error") {
  return errorResponse(message, 500);
}
