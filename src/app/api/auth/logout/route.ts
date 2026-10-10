import { NextResponse } from 'next/server';
import { authStore } from '@/lib/auth/store';
import { clearSessionCookie, getCurrentSession } from '@/lib/auth/server';

export async function POST() {
  try {
    const session = await getCurrentSession();

    if (session) {
      authStore.revokeSession(session.sessionId, session.userEmail);
      authStore.recordAudit({
        userId: session.userId,
        userEmail: session.userEmail,
        role: session.role,
        action: 'AUTH_LOGOUT',
        details: `User ${session.name} logged out.`,
        ip: session.ip,
        severity: 'info',
      });
    }

    clearSessionCookie();

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
