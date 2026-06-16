import { BACKEND_API_URL, API_VERSION_PATH } from "../../constants/api.js";


export function getBackendBaseUrl(): string {
  return BACKEND_API_URL.replace(/\/$/, "");
}

export function getReviewsApiUrl(): string {
  return `${getBackendBaseUrl()}${API_VERSION_PATH}/reviews`;
}
