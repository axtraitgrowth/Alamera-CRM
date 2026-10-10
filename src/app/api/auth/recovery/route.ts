import { NextResponse } from 'next/server';
import { getClientIp } from '@/lib/auth/server';
import { authStore } from '@/lib/auth/store';

// POST /api/auth/recovery - Handle password recovery requests and resets
export async function POST(request: Request) {
  const clientIp = getClientIp();

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'request') {
      const { login } = body;
      if (!login || typeof login !== 'string') {
        return NextResponse.json({ error: 'Email or username is required.' }, { status: 400 });
      }

      const token = authStore.createRecoveryToken(login, clientIp);

      // Return recovery response. In a production SMTP setup, token is emailed.
      // We return demoToken for seamless testing and demonstration.
      return NextResponse.json({
        success: true,
        message: 'If the provided account exists, a secure recovery code has been generated.',
        demoToken: token || null,
      });
    }

    if (action === 'reset') {
      const { token, newPassword } = body;
      if (!token || !newPassword) {
        return NextResponse.json({ error: 'Recovery token and new password are required.' }, { status: 400 });
      }

      if (typeof newPassword !== 'string' || newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters in length.' }, { status: 400 });
      }

      const success = authStore.completeRecovery(token, newPassword, clientIp);
      if (!success) {
        return NextResponse.json({
          error: 'Invalid or expired recovery token. Please request a new recovery link.',
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Password successfully updated. All previous sessions have been invalidated. Please sign in with your new password.',
      });
    }

    return NextResponse.json({ error: 'Invalid action. Expected "request" or "reset".' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error processing recovery request.' }, { status: 500 });
  }
}
