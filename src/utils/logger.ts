type LogLevel = "trace" | "info" | "success" | "warn" | "error";

const reset = "\x1b[0m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const italic = "\x1b[3m";

const palette: Record<LogLevel, string> = {
  trace: "\x1b[38;5;45m",
  info: "\x1b[38;5;81m",
  success: "\x1b[38;5;118m",
  warn: "\x1b[38;5;221m",
  error: "\x1b[38;5;203m",
};

const badges: Record<LogLevel, string> = {
  trace: "<TRACE>",
  info: "<INFO!>",
  success: "<YAY!!>",
  warn: "<HMM..>",
  error: "<BOOM!>",
};

type LogMeta = Record<string, unknown>;

export const logger = {
  trace: (message: string, meta?: LogMeta) => writeLog("trace", message, meta),
  info: (message: string, meta?: LogMeta) => writeLog("info", message, meta),
  success: (message: string, meta?: LogMeta) =>
    writeLog("success", message, meta),
  warn: (message: string, meta?: LogMeta) => writeLog("warn", message, meta),
  error: (message: string, meta?: LogMeta) => writeLog("error", message, meta),
  banner: (title: string, meta?: LogMeta) => printBanner(title, meta),
};

export function describeError(error: unknown): LogMeta {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    error: String(error),
  };
}

function writeLog(level: LogLevel, message: string, meta?: LogMeta): void {
  const timestamp = new Date().toISOString();
  const color = palette[level];
  const badge = badges[level];
  const flair = pickFlair(level);
  const headline = `${dim}${timestamp}${reset} ${color}${bold}${badge}${reset} ${bold}${message}${reset} ${color}${flair}${reset}`;
  const details = formatMeta(meta, level);

  console.log(headline);

  if (details) {
    console.log(details);
  }
}

function printBanner(title: string, meta?: LogMeta): void {
  const width = Math.max(title.length + 16, 44);
  const line = "=".repeat(width);
  const color = "\x1b[38;5;213m";
  const sub = `${italic}       Live activity stream is warmed up${reset}`;

  console.log(`${color}${bold}${line}${reset}`);
  console.log(`${color}${bold}=*= ${title.padEnd(width - 8)} =*=${reset}`);
  console.log(`${color}${sub.padEnd(width)}${reset}`);
  console.log(`${color}${bold}${line}${reset}`);

  if (meta) {
    writeLog("info", "Launch snapshot", meta);
  }
}

function formatMeta(meta: LogMeta | undefined, level: LogLevel): string {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }

  const parts = Object.entries(meta)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${formatKey(key)} ${stringifyValue(value)}`);

  if (parts.length === 0) {
    return "";
  }

  const color = palette[level];
  const grouped = chunk(parts, 3);

  return grouped
    .map((row) => `${color}${dim}  | ${reset}${dim}${row.join("   ")}${reset}`)
    .join("\n");
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") {
    return JSON.stringify(truncate(value, 120));
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify(String(value));
  }
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

function pickFlair(level: LogLevel): string {
  switch (level) {
    case "trace":
      return "<< signal acquired >>";
    case "info":
      return "<< scene in motion >>";
    case "success":
      return "<< confetti internally deployed >>";
    case "warn":
      return "<< tiny turbulence detected >>";
    case "error":
      return "<< drama, but under control >>";
  }
}

function formatKey(key: string): string {
  return `[${key}]`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }

  return rows;
}
