import { cookies, headers } from 'next/headers';
import { authStore } from './store';
import { AuthUser, Permission, ROLE_PERMISSIONS, UserRole, UserSession } from './types';

const COOKIE_NAME = process.env.COOKIE_NAME || 'alamera_session';

export function getClientIp(): string {
  const headersList = headers();
  const forwarded = headersList.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headersList.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

export function getUserAgent(): string {
  const headersList = headers();
  return headersList.get('user-agent') || 'Unknown';
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  return authStore.getSession(sessionToken);
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const storedUser = authStore.findUserById(session.userId);
  if (!storedUser || !storedUser.active) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeUser } = storedUser;
  return safeUser;
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

export async function checkPermission(permission: Permission): Promise<boolean> {
  const user = await getCurrentAuthUser();
  if (!user) return false;
  return hasPermission(user.role, permission);
}

export function setSessionCookie(sessionId: string): void {
  const cookieStore = cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 Hours
  });
}

export function clearSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
