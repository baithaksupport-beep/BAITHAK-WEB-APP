import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Upstash Redis and Ratelimit only if the env vars exist (safe fallback)
let ratelimit;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '10 s'), // Limit: 10 requests per 10 seconds per IP
      analytics: true,
    });
  }
} catch (error) {
  console.warn('Failed to initialize Upstash Redis Ratelimit:', error);
}

export async function middleware(request) {
  // If Redis is not configured, just bypass (useful for some local dev environments without .env)
  if (!ratelimit) {
    return NextResponse.next();
  }

  // Extract the IP address from the request (Vercel sets x-forwarded-for)
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // Apply rate limiting
  const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

  if (!success) {
    return new NextResponse('Too Many Requests. Please slow down and try again later.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  // Allow the request to proceed
  const res = NextResponse.next();
  
  // Add rate limit headers to successful requests for client visibility
  res.headers.set('X-RateLimit-Limit', limit.toString());
  res.headers.set('X-RateLimit-Remaining', remaining.toString());
  res.headers.set('X-RateLimit-Reset', reset.toString());

  return res;
}

// Configure which paths the middleware should run on
export const config = {
  // We protect API routes and sensitive pages from bot spam
  matcher: [
    '/api/:path*', 
    '/profile-setup'
  ],
};
