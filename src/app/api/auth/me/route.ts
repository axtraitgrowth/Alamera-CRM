import { NextResponse } from 'next/server';
import { getCurrentAuthUser } from '@/lib/auth/server';
import { ROLE_PERMISSIONS } from '@/lib/auth/types';

export async function GET() {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthenticated. Valid session required.' },
        { status: 401 }
      );
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];

    return NextResponse.json({
      authenticated: true,
      user,
      permissions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
