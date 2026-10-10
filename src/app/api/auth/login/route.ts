import { NextRequest, NextResponse } from 'next/server';
import { authStore } from '@/lib/auth/store';
import { getClientIp, getUserAgent, setSessionCookie } from '@/lib/auth/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { login, password } = body;

    if (!login || !password) {
      return NextResponse.json(
        { error: 'Email or username and password are required.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp();
    const userAgent = getUserAgent();

    const result = await authStore.verifyCredentials(login, password, clientIp);

    if (result.error || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Authentication failed.' },
        { status: result.lockedOut ? 429 : 401 }
      );
    }

    // Create session
    const session = authStore.createSession(result.user, clientIp, userAgent);

    // Set secure HttpOnly cookie
    setSessionCookie(session.sessionId);

    return NextResponse.json({
      success: true,
      user: result.user,
      message: `Welcome back, ${result.user.name}.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
