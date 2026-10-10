import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAuthUser, getClientIp, hasPermission } from '@/lib/auth/server';
import { authStore } from '@/lib/auth/store';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentAuthUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    if (!hasPermission(currentUser.role, 'manage_users')) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const clientIp = getClientIp();

    if (body.newRole) {
      // Only super_admin can assign or change super_admin role
      if (body.newRole === 'super_admin' && currentUser.role !== 'super_admin') {
        return NextResponse.json(
          { error: 'Forbidden: Only Super Administrators can grant Super Admin role.' },
          { status: 403 }
        );
      }
      const updatedUser = authStore.updateUserRole(id, body.newRole, currentUser.email, clientIp);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (body.toggleActive !== undefined) {
      // Cannot deactivate self
      if (id === currentUser.id) {
        return NextResponse.json(
          { error: 'Cannot deactivate your own active administrative account.' },
          { status: 400 }
        );
      }
      const updatedUser = authStore.toggleUserActive(id, currentUser.email, clientIp);
      return NextResponse.json({ success: true, user: updatedUser });
    }

    if (body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters long.' },
          { status: 400 }
        );
      }
      authStore.resetUserPassword(id, body.newPassword, currentUser.email, clientIp);
      return NextResponse.json({ success: true, message: 'Password reset successfully.' });
    }

    return NextResponse.json({ error: 'No valid update operation provided.' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
