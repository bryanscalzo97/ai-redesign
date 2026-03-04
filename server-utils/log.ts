type LogData =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | undefined;

function formatLog(
  env: "🖥️" | "📱",
  tag: string,
  message: string,
  data?: LogData
): void {
  const prefix = `${env} [${tag}]`;

  if (data !== undefined && data !== null) {
    if (typeof data === "object") {
      console.log(`${prefix} ${message}\n${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`${prefix} ${message}`, data);
    }
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const slog = (tag: string, message: string, data?: LogData) =>
  formatLog("🖥️", tag, message, data);

export const clog = (tag: string, message: string, data?: LogData) =>
  formatLog("📱", tag, message, data);
