export type AppEnv = "dev" | "prod";

function required(value: string | undefined, key: string): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value.trim();
}

/** Prefer server-only BACKEND_API_URL, fall back to public URL for browser. */
function resolveBackendApiUrl(): string {
  const serverUrl = process.env.BACKEND_API_URL;
  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  return required(serverUrl || publicUrl, "BACKEND_API_URL / NEXT_PUBLIC_BACKEND_API_URL");
}

function resolveApiVersionPath(): string {
  const serverPath = process.env.API_VERSION_PATH;
  const publicPath = process.env.NEXT_PUBLIC_API_VERSION_PATH;
  return required(
    serverPath || publicPath,
    "API_VERSION_PATH / NEXT_PUBLIC_API_VERSION_PATH"
  );
}

export const env = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV ?? "dev") as AppEnv,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  backendApiUrl: resolveBackendApiUrl(),
  apiVersionPath: resolveApiVersionPath(),
} as const;

export function getBackendBaseUrl(): string {
  return env.backendApiUrl.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  return `${getBackendBaseUrl()}${env.apiVersionPath}${path}`;
}
