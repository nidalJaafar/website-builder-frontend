import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";

const resolveZipEndpoint = (sessionId: string) => {
  const direct = process.env.ZIP_URL?.trim();
  if (direct) {
    return `${direct.replace(/\/$/, "")}/${sessionId}`;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (apiBase) {
    return `${apiBase.replace(/\/$/, "")}/zip/${sessionId}`;
  }

  return `http://15.188.64.225/zip/${sessionId}`;
};

export async function GET(
  request: NextRequest,
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
    const endpoint = resolveZipEndpoint(sessionId);
    const upstream = await fetch(endpoint, { method: "GET", cache: "no-store" });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Zip fetch failed.",
          status: upstream.status,
          details: errorText,
        },
        { status: 502 }
      );
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const downloadParam = request.nextUrl.searchParams.get("download");
    const formatParam = request.nextUrl.searchParams.get("format");
    const wantsBinaryZip =
      downloadParam === "1" ||
      downloadParam === "true" ||
      (formatParam ?? "").toLowerCase() === "zip";

    if (wantsBinaryZip) {
      const upstreamDisposition = upstream.headers.get("content-disposition");
      const fallbackFilename = `website-${sessionId}.zip`;
      const contentDisposition =
        upstreamDisposition && upstreamDisposition.includes("filename")
          ? upstreamDisposition
          : `attachment; filename="${fallbackFilename}"`;

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": contentDisposition,
          "Cache-Control": "no-store",
        },
      });
    }

    const zip = new AdmZip(Buffer.from(arrayBuffer));
    const files = zip
      .getEntries()
      .filter((entry) => !entry.isDirectory)
      .map((entry) => ({
        path: entry.entryName,
        content: entry.getData().toString("base64"),
      }));

    return NextResponse.json(
      { files },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json(
      { error: "Failed to fetch website archive.", details: message },
      { status: 500 }
    );
  }
}
