import { getContactApiUrl } from "@/lib/constants";

export interface SubmitContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export async function submitContact(
  payload: SubmitContactPayload
): Promise<ApiResponse> {
  const response = await fetch(getContactApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = await response.json().catch(() => ({
    success: false,
    message: "Invalid response from server",
  }));

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to submit contact form");
  }

  return data;
}
