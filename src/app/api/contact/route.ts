import { NextRequest, NextResponse } from "next/server";

function backendBase() {
  const url = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const version =
    process.env.API_VERSION_PATH || process.env.NEXT_PUBLIC_API_VERSION_PATH;
  if (!url || !version) return null;
  return { url: url.replace(/\/$/, ""), version };
}

export async function POST(req: NextRequest) {
  const backend = backendBase();
  if (!backend) {
    return NextResponse.json(
      { success: false, message: "Backend API is not configured" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { name, email, message } = body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { success: false, message: "Name, email, and message are required" },
      { status: 422 }
    );
  }

  try {
    const response = await fetch(
      `${backend.url}${backend.version}/contact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => ({
      success: false,
      message: "Invalid response from backend",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the server. Please try again later.",
      },
      { status: 502 }
    );
  }
}
