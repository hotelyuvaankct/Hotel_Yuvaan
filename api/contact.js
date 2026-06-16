import { API_VERSION_PATH, BACKEND_API_URL } from "../constants/api.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!BACKEND_API_URL || !API_VERSION_PATH) {
    return res.status(500).json({ success: false, message: "Backend API is not configured" });
  }

  const backendUrl = BACKEND_API_URL.replace(/\/$/, "");
  const { name, email, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Name, email, and message are required",
    });
  }

  try {
    const response = await fetch(`${backendUrl}${API_VERSION_PATH}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
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
