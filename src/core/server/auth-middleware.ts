import { slog } from "@/core/server/log";
import { auth } from "@/lib/auth";

/**
 * Middleware to authenticate API requests using better-auth sessions
 */
export async function authenticateRequest(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (session?.session) {
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Chicago",
    });

    slog(
      "auth-middleware",
      `authenticated request by ${session.session.userId} at ${time} CT`
    );
  }

  if (!session) {
    slog("auth-middleware", "No session found, returning 401");
    return {
      error: new Response(
        JSON.stringify({ error: "Unauthorized - Please sign in" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
      session: null,
    };
  }

  return {
    error: null,
    session,
  };
}

/**
 * Higher-order function to protect API routes with authentication
 * Usage: export const POST = withAuth(async (request, session) => { ... });
 */
export function withAuth<T extends any[]>(
  handler: (request: Request, session: any, ...args: T) => Promise<Response>
) {
  return async (request: Request, ...args: T): Promise<Response> => {
    const { error, session } = await authenticateRequest(request);

    if (error) {
      return error;
    }

    return handler(request, session, ...args);
  };
}
