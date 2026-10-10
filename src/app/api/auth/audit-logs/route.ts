import { NextResponse } from 'next/server';
import { getCurrentAuthUser, hasPermission } from '@/lib/auth/server';
import { authStore } from '@/lib/auth/store';

// GET /api/auth/audit-logs - View security audit logs
export async function GET(request: Request) {
  const user = await getCurrentAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
  }

  if (!hasPermission(user.role, 'view_audit_logs')) {
    return NextResponse.json({ error: 'Forbidden. Insufficient permissions to view security audit logs.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 100, 500) : 100;

  const logs = authStore.getAuditLogs(limit);
  return NextResponse.json({ logs });
}
