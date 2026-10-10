import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  AuthUser,
  StoredUser,
  UserSession,
  AuditLogEntry,
  UserRole,
  AuditAction,
  AuditSeverity,
} from './types';

// In-Memory & Persistent Server Auth Store
class AuthStore {
  private users: Map<string, StoredUser> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private loginAttempts: Map<string, { count: number; lockedUntil: number | null }> = new Map();
  private resetTokens: Map<string, { email: string; expiresAt: number }> = new Map();
  private initialized = false;

  constructor() {
    this.initDefaultUsers();
  }

  private initDefaultUsers() {
    if (this.initialized) return;

    // Salt rounds 12 for high-security password hashing
    const saltRounds = 12;

    const superAdminHash = bcrypt.hashSync('AlameraAdmin2026!', saltRounds);
    const managerHash = bcrypt.hashSync('TariqManager2026!', saltRounds);
    const agentHash = bcrypt.hashSync('JulianAgent2026!', saltRounds);

    const superAdmin: StoredUser = {
      id: 'usr-01',
      email: 'admin@alameraproperties.com',
      username: 'admin',
      name: 'Elena Rostova',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      brnNumber: 'BRN-39102',
      active: true,
      createdAt: '2026-01-15T08:00:00.000Z',
      lastLoginAt: '2026-10-10T14:30:00.000Z',
      passwordHash: superAdminHash,
    };

    const manager: StoredUser = {
      id: 'usr-02',
      email: 'tariq@alameraproperties.com',
      username: 'tariq',
      name: 'Tariq Al-Mansoor',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      brnNumber: 'BRN-28491',
      active: true,
      createdAt: '2026-02-01T10:00:00.000Z',
      lastLoginAt: '2026-10-10T11:15:00.000Z',
      passwordHash: managerHash,
    };

    const agent: StoredUser = {
      id: 'usr-03',
      email: 'julian@alameraproperties.com',
      username: 'julian',
      name: 'Julian Thorne',
      role: 'agent',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      brnNumber: 'BRN-44189',
      active: true,
      createdAt: '2026-03-10T09:30:00.000Z',
      lastLoginAt: '2026-10-09T18:20:00.000Z',
      passwordHash: agentHash,
    };

    this.users.set(superAdmin.id, superAdmin);
    this.users.set(manager.id, manager);
    this.users.set(agent.id, agent);

    // Initial audit log
    this.recordAudit({
      userId: 'system',
      userEmail: 'system@alamera.ae',
      role: 'super_admin',
      action: 'SETTINGS_UPDATED',
      details: 'Alamera Security Auth Store initialized with bcrypt 12-round salted hashing.',
      ip: '127.0.0.1',
      severity: 'info',
    });

    this.initialized = true;
  }

  // Find user by email or username
  public findUserByLogin(login: string): StoredUser | null {
    const cleanLogin = login.trim().toLowerCase();
    for (const user of Array.from(this.users.values())) {
      if (
        user.email.toLowerCase() === cleanLogin ||
        user.username.toLowerCase() === cleanLogin
      ) {
        return user;
      }
    }
    return null;
  }

  public findUserById(id: string): StoredUser | null {
    return this.users.get(id) || null;
  }

  // Get sanitized list of users without password hashes
  public getAllUsers(): AuthUser[] {
    return Array.from(this.users.values()).map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ passwordHash, ...safeUser }) => safeUser
    );
  }

  // Verify credentials with brute-force protection
  public async verifyCredentials(
    login: string,
    passwordPlain: string,
    clientIp: string
  ): Promise<{ user: AuthUser | null; error?: string; lockedOut?: boolean }> {
    const rateKey = `${clientIp}_${login.toLowerCase()}`;
    const now = Date.now();
    const attempts = this.loginAttempts.get(rateKey);

    // Check if locked out
    if (attempts && attempts.lockedUntil && attempts.lockedUntil > now) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - now) / 60000);
      this.recordAudit({
        userId: null,
        userEmail: login,
        role: 'anonymous',
        action: 'AUTH_LOCKOUT',
        details: `Rejected login attempt during lockout. ${remainingMinutes} min remaining.`,
        ip: clientIp,
        severity: 'security',
      });
      return {
        user: null,
        error: `Too many failed attempts. Account access is temporarily locked. Try again in ${remainingMinutes} minute(s).`,
        lockedOut: true,
      };
    }

    const user = this.findUserByLogin(login);

    // Dummy hash to prevent username enumeration timing attacks
    const dummyHash =
      '$2a$12$e80yvYmG/8x/2hM7wZ9yE.zH7j79.5Yc7P9iJ/y7z6/8w9y0x1z2a';

    const hashToCompare = user ? user.passwordHash : dummyHash;
    const isValid = await bcrypt.compare(passwordPlain, hashToCompare);

    if (!user || !isValid || !user.active) {
      // Increment failed attempt counter
      const currentCount = (attempts ? attempts.count : 0) + 1;
      let lockedUntil: number | null = null;

      if (currentCount >= 5) {
        // Lockout for 15 minutes
        lockedUntil = now + 15 * 60 * 1000;
      }

      this.loginAttempts.set(rateKey, { count: currentCount, lockedUntil });

      this.recordAudit({
        userId: user ? user.id : null,
        userEmail: login,
        role: user ? user.role : 'anonymous',
        action: 'AUTH_LOGIN_FAILED',
        details: `Failed login attempt (${currentCount}/5)${!user ? ' - user not found' : !user.active ? ' - inactive account' : ''}.`,
        ip: clientIp,
        severity: currentCount >= 3 ? 'warning' : 'info',
      });

      if (lockedUntil) {
        return {
          user: null,
          error: 'Too many failed login attempts. Security lockout active for 15 minutes.',
          lockedOut: true,
        };
      }

      return {
        user: null,
        error: 'Invalid email/username or password. Please verify your credentials.',
      };
    }

    // Success: reset rate limit attempts
    this.loginAttempts.delete(rateKey);

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    this.users.set(user.id, user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return { user: safeUser };
  }

  // Session Management
  public createSession(
    user: AuthUser,
    clientIp: string,
    userAgent: string
  ): UserSession {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 Hours

    const session: UserSession = {
      sessionId,
      userId: user.id,
      userEmail: user.email,
      name: user.name,
      role: user.role,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ip: clientIp,
      userAgent: userAgent || 'Unknown Browser',
    };

    this.sessions.set(sessionId, session);

    this.recordAudit({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'AUTH_LOGIN_SUCCESS',
      details: `Session established for ${user.name} (${user.role}).`,
      ip: clientIp,
      severity: 'info',
    });

    return session;
  }

  public getSession(sessionId: string): UserSession | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  public revokeSession(sessionId: string, actorEmail?: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    this.sessions.delete(sessionId);

    this.recordAudit({
      userId: session.userId,
      userEmail: session.userEmail,
      role: session.role,
      action: 'SESSION_REVOKED',
      details: `Session revoked${actorEmail ? ` by ${actorEmail}` : ''}.`,
      ip: session.ip,
      severity: 'warning',
    });

    return true;
  }

  public revokeAllUserSessions(userId: string): void {
    for (const [id, session] of Array.from(this.sessions.entries())) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  public getAllActiveSessions(): UserSession[] {
    const now = Date.now();
    const active: UserSession[] = [];
    for (const [id, session] of Array.from(this.sessions.entries())) {
      if (new Date(session.expiresAt).getTime() > now) {
        active.push(session);
      } else {
        this.sessions.delete(id);
      }
    }
    return active;
  }

  // User Management
  public createUser(
    userData: {
      name: string;
      email: string;
      username: string;
      role: UserRole;
      passwordPlain: string;
      brnNumber?: string;
    },
    creatorEmail: string,
    clientIp: string
  ): AuthUser {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanUsername = userData.username.trim().toLowerCase();

    if (this.findUserByLogin(cleanEmail) || this.findUserByLogin(cleanUsername)) {
      throw new Error('User with this email or username already exists.');
    }

    const saltRounds = 12;
    const passwordHash = bcrypt.hashSync(userData.passwordPlain, saltRounds);

    const newUser: StoredUser = {
      id: `usr-${Date.now()}`,
      name: userData.name,
      email: cleanEmail,
      username: cleanUsername,
      role: userData.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      brnNumber: userData.brnNumber || undefined,
      active: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      passwordHash,
    };

    this.users.set(newUser.id, newUser);

    this.recordAudit({
      userId: newUser.id,
      userEmail: creatorEmail,
      role: 'super_admin',
      action: 'USER_CREATED',
      details: `New ${userData.role} user created: ${newUser.name} (${newUser.email}).`,
      ip: clientIp,
      severity: 'info',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  public updateUserRole(
    userId: string,
    newRole: UserRole,
    actorEmail: string,
    clientIp: string
  ): AuthUser {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found.');

    const oldRole = user.role;
    user.role = newRole;
    this.users.set(userId, user);

    this.recordAudit({
      userId: user.id,
      userEmail: actorEmail,
      role: 'super_admin',
      action: 'USER_ROLE_CHANGED',
      details: `Role updated for ${user.email} from ${oldRole} to ${newRole}.`,
      ip: clientIp,
      severity: 'warning',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public resetUserPassword(
    userId: string,
    newPasswordPlain: string,
    actorEmail: string,
    clientIp: string
  ): void {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found.');

    const saltRounds = 12;
    user.passwordHash = bcrypt.hashSync(newPasswordPlain, saltRounds);
    this.users.set(userId, user);

    // Invalidate existing sessions for security
    this.revokeAllUserSessions(userId);

    this.recordAudit({
      userId: user.id,
      userEmail: actorEmail,
      role: 'super_admin',
      action: 'AUTH_PASSWORD_RESET',
      details: `Password reset executed for ${user.email}. Previous sessions revoked.`,
      ip: clientIp,
      severity: 'security',
    });
  }

  public toggleUserActive(
    userId: string,
    actorEmail: string,
    clientIp: string
  ): AuthUser {
    const user = this.users.get(userId);
    if (!user) throw new Error('User not found.');

    user.active = !user.active;
    this.users.set(userId, user);

    if (!user.active) {
      this.revokeAllUserSessions(userId);
    }

    this.recordAudit({
      userId: user.id,
      userEmail: actorEmail,
      role: 'super_admin',
      action: 'USER_UPDATED',
      details: `User status set to ${user.active ? 'Active' : 'Disabled'} for ${user.email}.`,
      ip: clientIp,
      severity: 'warning',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // Audit Logs
  public recordAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logItem: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(logItem);
    // Keep max 500 audit entries in memory
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  public getAuditLogs(limit = 100): AuditLogEntry[] {
    return this.auditLogs.slice(0, limit);
  }

  // Password Recovery Request
  public createRecoveryToken(loginOrEmail: string, clientIp: string): string | null {
    const user = this.findUserByLogin(loginOrEmail);
    if (!user) {
      // Silent log to prevent enumeration
      this.recordAudit({
        userId: null,
        userEmail: loginOrEmail,
        role: 'anonymous',
        action: 'AUTH_PASSWORD_RESET',
        details: 'Password recovery requested for non-existent login.',
        ip: clientIp,
        severity: 'info',
      });
      return null;
    }

    const token = crypto.randomBytes(32).toString('hex');
    this.resetTokens.set(token, {
      email: user.email,
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 mins
    });

    this.recordAudit({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'AUTH_PASSWORD_RESET',
      details: `Password recovery token issued for ${user.email}.`,
      ip: clientIp,
      severity: 'info',
    });

    return token;
  }

  public completeRecovery(token: string, newPasswordPlain: string, clientIp: string): boolean {
    const record = this.resetTokens.get(token);
    if (!record || record.expiresAt < Date.now()) {
      return false;
    }

    const user = this.findUserByLogin(record.email);
    if (!user) return false;

    const saltRounds = 12;
    user.passwordHash = bcrypt.hashSync(newPasswordPlain, saltRounds);
    this.users.set(user.id, user);

    this.resetTokens.delete(token);
    this.revokeAllUserSessions(user.id);

    this.recordAudit({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      action: 'AUTH_PASSWORD_RESET',
      details: `Self-service password recovery completed for ${user.email}.`,
      ip: clientIp,
      severity: 'security',
    });

    return true;
  }
}

// Global Singleton Store for Server Runtimes
const globalForAuth = globalThis as unknown as { authStore: AuthStore };
export const authStore = globalForAuth.authStore || new AuthStore();
if (process.env.NODE_ENV !== 'production') globalForAuth.authStore = authStore;
