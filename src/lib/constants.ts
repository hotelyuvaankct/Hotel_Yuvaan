import { apiUrl, env, getBackendBaseUrl } from "@/config/env";

export { apiUrl, env, getBackendBaseUrl };

export function getReviewsApiUrl(): string {
  return apiUrl("/reviews");
}

export function getContactApiUrl(): string {
  return apiUrl("/contact");
}

export function getConfigApiUrl(): string {
  return apiUrl("/config");
}
