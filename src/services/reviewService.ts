import { getReviewsApiUrl } from "@/lib/constants";

export interface SubmitReviewPayload {
  name: string;
  email: string;
  review: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  code?: number;
}

export async function submitReview(
  payload: SubmitReviewPayload
): Promise<ApiResponse> {
  const response = await fetch(getReviewsApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = await response.json().catch(() => ({
    success: false,
    message: "Invalid response from server",
  }));

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to submit review");
  }

  return data;
}
