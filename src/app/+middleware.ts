import { slog } from "@/core/server/log";
import { auth } from "@/lib/auth";

export const unstable_settings = {
  matcher: {
    methods: ["POST"],
    patterns: ["/api/[...path]"],
  },
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  // Skip auth check for the auth routes themselves
  if (url.pathname.startsWith("/api/auth")) {
    return;
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    slog("middleware", `Unauthenticated request to ${url.pathname}`);
    // Log-only for now — enable blocking once the client sends session cookies:
    // return new Response(
    //   JSON.stringify({ error: "Unauthorized - Please sign in" }),
    //   { status: 401, headers: { "Content-Type": "application/json" } },
    // );
    return;
  }

  slog("middleware", `Authenticated: ${session.session.userId} → ${url.pathname}`);
}
