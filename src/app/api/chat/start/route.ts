import { NextRequest, NextResponse } from 'next/server';

const resolveChatStartEndpoint = () => {
  const direct = process.env.CHAT_START_URL?.trim();
  if (direct) {
    return direct.replace(/\/$/, '');
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (apiBase) {
    return `${apiBase.replace(/\/$/, '')}/chat/start`;
  }

  return 'http://15.188.64.225/chat/start';
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

    const endpoint = resolveChatStartEndpoint();
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inbound),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: 'Chat start failed.',
          status: upstream.status,
          details: payload,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json(
      { error: 'Failed to start chat session.', details: message },
      { status: 500 }
    );
  }
}
