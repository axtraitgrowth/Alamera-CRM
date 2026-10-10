import { NextResponse } from 'next/server';
import { getCurrentAuthUser, hasPermission } from '@/lib/auth/server';
import { authStore } from '@/lib/auth/store';

// GET /api/auth/sessions - Get all active sessions
export async function GET() {
  const user = await getCurrentAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
  }

  if (!hasPermission(user.role, 'manage_users')) {
    return NextResponse.json({ error: 'Forbidden. Super Admin or Manager privilege required.' }, { status: 403 });
  }

  const sessions = authStore.getAllActiveSessions();
  return NextResponse.json({ sessions });
}

// POST /api/auth/sessions - Revoke a session
export async function POST(request: Request) {
  const user = await getCurrentAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
  }

  if (!hasPermission(user.role, 'manage_users')) {
    return NextResponse.json({ error: 'Forbidden. Super Admin or Manager privilege required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required.' }, { status: 400 });
    }

    const success = authStore.revokeSession(sessionId, user.email);
    if (!success) {
      return NextResponse.json({ error: 'Session not found or already expired.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Session revoked successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error while revoking session.' }, { status: 500 });
  }
}
