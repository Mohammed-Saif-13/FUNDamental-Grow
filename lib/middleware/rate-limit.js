import { rateLimitResponse } from "@/lib/utils/response";

const rateLimitMap = new Map();

if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
          rateLimitMap.delete(key);
        }
      }
    },
    10 * 60 * 1000,
  );
}

export function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function createRateLimiter(options = {}) {
  const { interval = 60 * 1000, maxRequests = 10 } = options;

  return {
    check(token) {
      const now = Date.now();
      let record = rateLimitMap.get(token);

      if (!record || now > record.resetTime) {
        record = {
          count: 0,
          resetTime: now + interval,
        };
      }

      record.count += 1;
      rateLimitMap.set(token, record);

      const remaining = Math.max(0, maxRequests - record.count);
      const isLimited = record.count > maxRequests;

      return {
        success: !isLimited,
        limit: maxRequests,
        remaining,
        reset: record.resetTime,
      };
    },

    reset(token) {
      rateLimitMap.delete(token);
    },
  };
}

export const rateLimiters = {
  general: createRateLimiter({ interval: 60 * 1000, maxRequests: 60 }),
  auth: createRateLimiter({ interval: 60 * 1000, maxRequests: 5 }),
  payment: createRateLimiter({ interval: 60 * 1000, maxRequests: 5 }),
  form: createRateLimiter({ interval: 60 * 1000, maxRequests: 5 }),
  upload: createRateLimiter({ interval: 60 * 1000, maxRequests: 10 }),
  search: createRateLimiter({ interval: 60 * 1000, maxRequests: 30 }),
};

export function checkRateLimit(req, limiterName = "general", suffix = "") {
  const limiter = rateLimiters[limiterName] || rateLimiters.general;
  const ip = getClientIp(req);
  const token = suffix ? `${ip}:${suffix}` : ip;

  const result = limiter.check(token);

  if (!result.success) {
    return rateLimitResponse("Too many requests. Please try again later.", {
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    });
  }

  return null;
}

export function withRateLimit(limiterName = "general", suffix = "") {
  return (handler) => {
    return async (req, context) => {
      const rateLimitError = checkRateLimit(req, limiterName, suffix);
      if (rateLimitError) return rateLimitError;
      return handler(req, context);
    };
  };
}

export function withRateLimitedAuth(limiterName = "general") {
  return (handler) => {
    return async (req, context) => {
      const rateLimitError = checkRateLimit(req, limiterName);
      if (rateLimitError) return rateLimitError;

      const { auth } = await import("@/lib/auth");
      const session = await auth();

      if (!session || !session.user) {
        const { unauthorizedResponse } = await import("@/lib/utils/response");
        return unauthorizedResponse();
      }

      return handler(req, session, context);
    };
  };
}
