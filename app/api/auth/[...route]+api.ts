import { auth } from "@/lib/auth";

type Handler = typeof auth.handler;

const createLoggedHandler = (method: string) =>
  async (...args: Parameters<Handler>) => {
    const [request] = args;
    const url = request?.url ?? "<unknown>";
    const start = Date.now();
    console.log(`[auth-route] ${method} ${url}`);
    try {
      const response = await auth.handler(...args);
      const duration = Date.now() - start;
      console.log(
        `[auth-route] ${method} completed with ${response.status} in ${duration}ms`,
      );
      return response;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(
        `[auth-route] ${method} failed in ${duration}ms`,
        error,
      );
      throw error;
    }
  };

export const GET = createLoggedHandler("GET");
export const POST = createLoggedHandler("POST");
