import { NextRequest, NextResponse } from "next/server";

const resolvePollEndpoint = (sessionId: string) => {
  const direct = process.env.POLL_URL?.trim();
  if (direct) {
    return `${direct.replace(/\/$/, "")}/${sessionId}`;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiBase) {
    return `${apiBase.replace(/\/$/, "")}/poll/${sessionId}`;
  }

  return `http://15.188.64.225/poll/${sessionId}`;
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<Record<string, unknown>> }
) {
  const params = await context.params;
  const rawSessionId = params?.sessionId;
  const sessionId =
    typeof rawSessionId === "string"
      ? rawSessionId
      : Array.isArray(rawSessionId)
      ? rawSessionId[0]
      : undefined;

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required." },
      { status: 400 }
    );
  }

  try {
    const endpoint = resolvePollEndpoint(sessionId);
    const upstream = await fetch(endpoint, { method: "GET", cache: "no-store" });

    const contentType = upstream.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: "Poll failed.",
          status: upstream.status,
          details: payload,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json(
      { error: "Failed to poll build status.", details: message },
      { status: 500 }
    );
  }
}
