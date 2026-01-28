import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXTAUTH_URL,
].filter(Boolean);

function getOrigin(req) {
  return req.headers.get("origin") || req.headers.get("referer");
}

function isAllowedOrigin(origin) {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    const originHost = url.origin;

    return ALLOWED_ORIGINS.some((allowed) => {
      if (!allowed) return false;
      try {
        const allowedUrl = new URL(allowed);
        return allowedUrl.origin === originHost;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

function isSafeMethod(method) {
  return ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export function checkCsrf(req) {
  if (isSafeMethod(req.method)) {
    return null;
  }

  const origin = getOrigin(req);

  if (!origin) {
    return NextResponse.json(
      { success: false, message: "Missing origin header" },
      { status: 403 }
    );
  }

  if (!isAllowedOrigin(origin)) {
    return NextResponse.json(
      { success: false, message: "Invalid request origin" },
      { status: 403 }
    );
  }

  return null;
}

export function withCsrf(handler) {
  return async (req, context) => {
    const csrfError = checkCsrf(req);
    if (csrfError) return csrfError;
    return handler(req, context);
  };
}
