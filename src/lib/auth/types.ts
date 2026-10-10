export type UserRole = 'super_admin' | 'manager' | 'agent';

export type Permission =
  | 'view_records'
  | 'create_records'
  | 'edit_records'
  | 'delete_records'
  | 'export_reports'
  | 'manage_users'
  | 'manage_settings'
  | 'manage_integrations'
  | 'view_audit_logs';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'view_records',
    'create_records',
    'edit_records',
    'delete_records',
    'export_reports',
    'manage_users',
    'manage_settings',
    'manage_integrations',
    'view_audit_logs',
  ],
  manager: [
    'view_records',
    'create_records',
    'edit_records',
    'export_reports',
    'view_audit_logs',
  ],
  agent: [
    'view_records',
    'create_records',
  ],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Administrator',
  manager: 'Sales & Ops Manager',
  agent: 'Licensed Broker / Agent',
};

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  avatar: string;
  brnNumber?: string;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface StoredUser extends AuthUser {
  passwordHash: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  userEmail: string;
  name: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
  ip: string;
  userAgent: string;
}

export type AuditAction =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_PASSWORD_RESET'
  | 'AUTH_LOCKOUT'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_ROLE_CHANGED'
  | 'SESSION_REVOKED'
  | 'RECORD_DELETED'
  | 'SETTINGS_UPDATED';

export type AuditSeverity = 'info' | 'warning' | 'security';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string | null;
  userEmail: string;
  role: UserRole | 'anonymous';
  action: AuditAction;
  details: string;
  ip: string;
  severity: AuditSeverity;
}
