import { NextResponse } from "next/server";
import { ZodError } from "zod";

const DEFAULT_MAX_BODY_SIZE = 1024 * 1024; // 1MB
const UPLOAD_MAX_BODY_SIZE = 10 * 1024 * 1024; // 10MB for uploads

export function checkBodySize(req, maxSize = DEFAULT_MAX_BODY_SIZE) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > maxSize) {
    return NextResponse.json(
      { success: false, message: "Request body too large" },
      { status: 413 }
    );
  }
  return null;
}

export function checkUploadSize(req) {
  return checkBodySize(req, UPLOAD_MAX_BODY_SIZE);
}

export function withValidation(schema) {
  return (handler) => {
    return async (req, context) => {
      try {
        const body = await req.json();
        const validatedData = await schema.parseAsync(body);
        req.validatedData = validatedData;
        return handler(req, context);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));
          return NextResponse.json(
            { success: false, message: "Validation failed", errors },
            { status: 400 },
          );
        }
        throw error;
      }
    };
  };
}

export function withQueryValidation(schema) {
  return (handler) => {
    return async (req, context) => {
      try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());
        const validatedQuery = await schema.parseAsync(query);
        req.validatedQuery = validatedQuery;
        return handler(req, context);
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }));
          return NextResponse.json(
            { success: false, message: "Invalid query parameters", errors },
            { status: 400 },
          );
        }
        throw error;
      }
    };
  };
}
