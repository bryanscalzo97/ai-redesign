export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Typed fetch wrapper for Expo API routes.
 * Handles JSON parsing and error extraction.
 */
export async function apiFetch<T>(
  path: string,
  { method = "POST", body, signal }: ApiFetchOptions = {},
): Promise<T> {
  const response = await fetch(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
    signal,
  });

  const json = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (json as any)?.error ??
        `Request failed with ${response.status} ${response.statusText}`,
    );
  }

  return json as T;
}
