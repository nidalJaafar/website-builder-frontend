import { NextRequest, NextResponse } from 'next/server';

const resolvePromptEndpoint = () => {
  const direct = process.env.PROMPT_API_URL?.trim();
  if (direct) {
    return direct.replace(/\/$/, '');
  }

  const publicBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (publicBase) {
    return `${publicBase.replace(/\/$/, '')}/parse`;
  }

  return 'http://15.188.64.225/parse';
};

export async function POST(request: NextRequest) {
  try {
    const inbound = await request.json();

    if (typeof inbound !== 'object' || inbound === null) {
      return NextResponse.json(
        { error: 'Request body must be JSON.' },
        { status: 400 }
      );
    }

    const endpoint = resolvePromptEndpoint();
    const upstreamResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inbound),
    });

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const rawPayload = isJson
      ? await upstreamResponse.json()
      : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error: 'Prompt service error.',
          status: upstreamResponse.status,
          details: rawPayload,
        },
        { status: 502 }
      );
    }

    const normalizedPayload = isJson
      ? rawPayload
      : { prompt: typeof rawPayload === 'string' ? rawPayload : String(rawPayload) };

    return NextResponse.json(normalizedPayload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json(
      { error: 'Failed to reach prompt service.', details: message },
      { status: 500 }
    );
  }
}
