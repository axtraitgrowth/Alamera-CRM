import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser, getClientIp, hasPermission } from '@/lib/auth/server';
import { authStore } from '@/lib/auth/store';

export async function GET() {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!hasPermission(user.role, 'manage_users')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges to view user directory.' },
        { status: 403 }
      );
    }

    const users = authStore.getAllUsers();
    return NextResponse.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!hasPermission(user.role, 'manage_users')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges to create users.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, username, role, password, brnNumber } = body;

    if (!name || !email || !username || !role || !password) {
      return NextResponse.json(
        { error: 'Name, email, username, role, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp();

    const newUser = authStore.createUser(
      {
        name,
        email,
        username,
        role,
        passwordPlain: password,
        brnNumber,
      },
      user.email,
      clientIp
    );

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
