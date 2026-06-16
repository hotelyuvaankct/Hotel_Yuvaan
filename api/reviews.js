import { API_VERSION_PATH, BACKEND_API_URL } from "../constants/api.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const backendUrl = BACKEND_API_URL.replace(/\/$/, "");
  const { name, email, review } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !review?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Name, email, and review are required",
    });
  }

  try {
    const response = await fetch(`${backendUrl}${API_VERSION_PATH}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        review: review.trim(),
      }),
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: "Invalid response from backend",
    }));

    return res.status(response.status).json(data);
  } catch {
    return res.status(502).json({
      success: false,
      message: "Unable to reach the server. Please try again later.",
    });
  }
}
