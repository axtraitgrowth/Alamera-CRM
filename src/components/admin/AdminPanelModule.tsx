'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Users,
  Key,
  Activity,
  Lock,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Laptop,
  Globe,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  FileText,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { AuthUser, AuditLogEntry, UserSession, UserRole } from '@/lib/auth/types';

type AdminTab = 'users' | 'sessions' | 'audit' | 'encryption';

export const AdminPanelModule: React.FC = () => {
  const { user: currentUser, can } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  // Users State
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isResetPwdOpen, setIsResetPwdOpen] = useState<string | null>(null); // userId
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('agent');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserBRN, setNewUserBRN] = useState('');
  const [addUserError, setAddUserError] = useState<string | null>(null);

  // Sessions State
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [auditFilter, setAuditFilter] = useState<'all' | 'info' | 'warning' | 'security'>('all');
  const [auditSearch, setAuditSearch] = useState('');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {
      showFeedback('error', 'Failed to retrieve user accounts.');
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch Sessions
  const fetchSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const res = await fetch('/api/auth/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
      }
    } catch {
      showFeedback('error', 'Failed to load active sessions.');
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  // Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoadingAudit(true);
      const res = await fetch('/api/auth/audit-logs?limit=200');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch {
      showFeedback('error', 'Failed to load security audit records.');
    } finally {
      setLoadingAudit(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'sessions') fetchSessions();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab, fetchUsers, fetchSessions, fetchAuditLogs]);

  // Handle Add User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);

    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          username: newUserUsername,
          role: newUserRole,
          password: newUserPassword,
          brnNumber: newUserBRN || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setAddUserError(data.error || 'Failed to create user account.');
        return;
      }

      showFeedback('success', `Account for ${data.user.name} created successfully.`);
      setIsAddUserOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserUsername('');
      setNewUserPassword('');
      setNewUserBRN('');
      fetchUsers();
    } catch {
      setAddUserError('Server error while registering user.');
    }
  };

  // Handle Role Change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFeedback('error', data.error || 'Role update rejected.');
      } else {
        showFeedback('success', `Role changed to ${newRole}.`);
        fetchUsers();
      }
    } catch {
      showFeedback('error', 'Error sending role update request.');
    }
  };

  // Handle Toggle Active
  const handleToggleActive = async (userId: string) => {
    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleActive: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFeedback('error', data.error || 'Status toggle rejected.');
      } else {
        showFeedback('success', `User account ${data.user.active ? 'activated' : 'deactivated'}.`);
        fetchUsers();
      }
    } catch {
      showFeedback('error', 'Error toggling account status.');
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (userId: string) => {
    if (!newPasswordInput || newPasswordInput.length < 8) {
      showFeedback('error', 'Password must be at least 8 characters long.');
      return;
    }

    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFeedback('error', data.error || 'Password reset rejected.');
      } else {
        showFeedback('success', 'Password reset applied. Existing sessions invalidated.');
        setIsResetPwdOpen(null);
        setNewPasswordInput('');
      }
    } catch {
      showFeedback('error', 'Error submitting password reset.');
    }
  };

  // Handle Revoke Session
  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showFeedback('error', data.error || 'Failed to revoke session.');
      } else {
        showFeedback('success', 'Session invalidated immediately.');
        fetchSessions();
      }
    } catch {
      showFeedback('error', 'Error revoking session.');
    }
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((entry) => {
    const matchesFilter = auditFilter === 'all' || entry.severity === auditFilter;
    const matchesSearch =
      auditSearch === '' ||
      entry.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      entry.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (entry.userEmail && entry.userEmail.toLowerCase().includes(auditSearch.toLowerCase())) ||
      entry.ip.includes(auditSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-alamera-border pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded bg-alamera-red/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-alamera-red border border-alamera-red/30">
              SECURITY & ACCESS CONTROL
            </span>
            <span className="font-mono text-xs text-alamera-muted">• RERA COMPLIANT</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Admin Governance & Security Suite
          </h1>
          <p className="mt-1 font-sans text-xs sm:text-sm text-alamera-muted">
            Institutional authentication, RBAC authorization, cryptographic session registry, and real-time audit logging.
          </p>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-alamera-border bg-alamera-darkest p-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'users'
                ? 'bg-alamera-red text-white shadow'
                : 'text-alamera-muted hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>User Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'sessions'
                ? 'bg-alamera-red text-white shadow'
                : 'text-alamera-muted hover:text-white'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Active Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'audit'
                ? 'bg-alamera-red text-white shadow'
                : 'text-alamera-muted hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Security Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('encryption')}
            className={`flex items-center space-x-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'encryption'
                ? 'bg-alamera-red text-white shadow'
                : 'text-alamera-muted hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cryptography Policy</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center space-x-2 rounded-md border p-3 text-xs transition ${
            feedback.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-alamera-red/40 bg-alamera-red/10 text-alamera-red'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* TAB 1: USERS & ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-white">
                Authorized Personnel Directory
              </h2>
              <p className="font-sans text-xs text-alamera-muted">
                Assign enterprise roles with server-enforced privileges. All updates are logged to the audit registry.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-card px-3 py-1.5 text-xs text-alamera-silver hover:text-white transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {can('manage_users') && (
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="flex items-center space-x-1.5 rounded bg-alamera-red px-3 py-1.5 text-xs font-medium text-white hover:bg-alamera-redDark shadow-alameraRed transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Provision Account</span>
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-alamera-border bg-alamera-card/70">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-alamera-border bg-alamera-darkest font-mono text-[10px] uppercase text-alamera-muted">
                <tr>
                  <th className="px-4 py-3">User & Contact</th>
                  <th className="px-4 py-3">Current Role</th>
                  <th className="px-4 py-3">RERA License</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-alamera-border/50">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-alamera-cardLight transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={u.name}
                            className="h-8 w-8 rounded-full border border-alamera-border object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="font-sans font-medium text-white">{u.name}</span>
                              {isCurrent && (
                                <span className="rounded bg-alamera-red/20 px-1 font-mono text-[9px] text-alamera-red">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[10px] text-alamera-muted">
                              {u.email} • @{u.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {can('manage_users') && currentUser?.role === 'super_admin' ? (
                          <select
                            value={u.role}
                            disabled={isCurrent}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            aria-label={`Change role for ${u.name}`}
                            className="rounded border border-alamera-border bg-alamera-darkest px-2 py-1 font-mono text-[11px] text-white focus:border-alamera-red focus:outline-none"
                          >
                            <option value="super_admin">Super Administrator</option>
                            <option value="manager">Manager</option>
                            <option value="agent">Private Client Advisor (Agent)</option>
                          </select>
                        ) : (
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-semibold ${
                              u.role === 'super_admin'
                                ? 'bg-alamera-red/20 text-alamera-red border border-alamera-red/40'
                                : u.role === 'manager'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {u.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-alamera-silver">
                        {u.brnNumber || '—'}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                            u.active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${u.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          <span>{u.active ? 'Active' : 'Disabled'}</span>
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-[10px] text-alamera-muted">
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {can('manage_users') && (
                            <>
                              <button
                                onClick={() => setIsResetPwdOpen(u.id)}
                                title="Reset Password"
                                className="rounded border border-alamera-border bg-alamera-darkest p-1.5 text-alamera-muted hover:text-white hover:border-alamera-red/40 transition"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>

                              {!isCurrent && (
                                <button
                                  onClick={() => handleToggleActive(u.id)}
                                  title={u.active ? 'Deactivate User' : 'Activate User'}
                                  className={`rounded border p-1.5 transition ${
                                    u.active
                                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                  }`}
                                >
                                  {u.active ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Role Permissions Matrix Breakdown */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-5">
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Role-Based Access Control (RBAC) Entitlements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded border border-alamera-red/30 bg-alamera-darkest p-3">
                <div className="flex items-center justify-between pb-2 border-b border-alamera-border mb-2">
                  <span className="font-mono font-bold text-alamera-red text-[11px] uppercase">
                    Super Administrator
                  </span>
                  <span className="font-mono text-[10px] text-alamera-muted">9 of 9 Permissions</span>
                </div>
                <ul className="space-y-1 text-alamera-silver text-[11px]">
                  <li>✔ Full CRM Pipeline, Clients & Properties</li>
                  <li>✔ Provision & Terminate Personnel Accounts</li>
                  <li>✔ Modify Security & RERA ORN Configurations</li>
                  <li>✔ Invalidate Active Sessions across Organization</li>
                  <li>✔ Unrestricted Security Audit Trail Inspection</li>
                  <li>✔ Financial Reports & Raw Data Export</li>
                </ul>
              </div>

              <div className="rounded border border-amber-500/30 bg-alamera-darkest p-3">
                <div className="flex items-center justify-between pb-2 border-b border-alamera-border mb-2">
                  <span className="font-mono font-bold text-amber-400 text-[11px] uppercase">
                    Sales Manager
                  </span>
                  <span className="font-mono text-[10px] text-alamera-muted">7 of 9 Permissions</span>
                </div>
                <ul className="space-y-1 text-alamera-silver text-[11px]">
                  <li>✔ Full CRM Pipeline, Escrow Milestones & Deals</li>
                  <li>✔ Manage Broker Profiles & Task Assignments</li>
                  <li>✔ View & Terminate Suspicious Active Sessions</li>
                  <li>✔ Export Executive Financial Forecasts</li>
                  <li>✔ Inspect Security Audit Logs</li>
                  <li>✖ Cannot Alter RERA Corporate Credentials</li>
                </ul>
              </div>

              <div className="rounded border border-blue-500/30 bg-alamera-darkest p-3">
                <div className="flex items-center justify-between pb-2 border-b border-alamera-border mb-2">
                  <span className="font-mono font-bold text-blue-400 text-[11px] uppercase">
                    Advisory Agent (Broker)
                  </span>
                  <span className="font-mono text-[10px] text-alamera-muted">4 of 9 Permissions</span>
                </div>
                <ul className="space-y-1 text-alamera-silver text-[11px]">
                  <li>✔ View Assigned Leads, Deals & VIP Clients</li>
                  <li>✔ Schedule Concierge Transit & Private Showings</li>
                  <li>✔ Execute 3D Architectural Spatial Previews</li>
                  <li>✖ Restricted from Admin Governance & Settings</li>
                  <li>✖ Restricted from User Management</li>
                  <li>✖ Restricted from Server Audit Registry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-semibold text-white">
                Cryptographic Active Sessions
              </h2>
              <p className="font-sans text-xs text-alamera-muted">
                Every login creates an isolated 256-bit entropy session token with an 8-hour TTL. Sessions can be instantly revoked.
              </p>
            </div>
            <button
              onClick={fetchSessions}
              disabled={loadingSessions}
              className="flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-card px-3 py-1.5 text-xs text-alamera-silver hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingSessions ? 'animate-spin' : ''}`} />
              <span>Refresh Registry</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-alamera-border bg-alamera-card/70">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-alamera-border bg-alamera-darkest font-mono text-[10px] uppercase text-alamera-muted">
                <tr>
                  <th className="px-4 py-3">Account & Role</th>
                  <th className="px-4 py-3">Session Token (Masked)</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">User Agent & Device</th>
                  <th className="px-4 py-3">Issued At</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3 text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-alamera-border/50">
                {sessions.map((sess) => (
                  <tr key={sess.sessionId} className="hover:bg-alamera-cardLight transition">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-sans font-medium text-white block">{sess.name}</span>
                        <span className="font-mono text-[10px] text-alamera-muted block">{sess.userEmail}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-[11px] text-alamera-silver">
                      {sess.sessionId.substring(0, 8)}...{sess.sessionId.substring(sess.sessionId.length - 8)}
                    </td>

                    <td className="px-4 py-3 font-mono text-emerald-400">
                      {sess.ip}
                    </td>

                    <td className="px-4 py-3 font-mono text-[10px] text-alamera-muted max-w-xs truncate" title={sess.userAgent}>
                      {sess.userAgent}
                    </td>

                    <td className="px-4 py-3 font-mono text-[10px] text-alamera-muted">
                      {new Date(sess.createdAt).toLocaleTimeString()}
                    </td>

                    <td className="px-4 py-3 font-mono text-[10px] text-amber-400">
                      {new Date(sess.expiresAt).toLocaleTimeString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRevokeSession(sess.sessionId)}
                        className="rounded border border-red-500/30 bg-red-500/10 px-2.5 py-1 font-mono text-[10px] text-red-400 hover:bg-red-500/20 transition"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-alamera-muted font-sans text-xs">
                      No active sessions found in registry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-white">
                Tamper-Resistant Security Audit Trail
              </h2>
              <p className="font-sans text-xs text-alamera-muted">
                Live stream of logins, lockouts, privilege escalations, credential modifications, and session terminations.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchAuditLogs}
                disabled={loadingAudit}
                className="flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-card px-3 py-1.5 text-xs text-alamera-silver hover:text-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
                <span>Sync Trail</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-alamera-border bg-alamera-card p-3">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-alamera-muted flex-shrink-0" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search action, email, IP, or details..."
                className="w-full bg-transparent text-xs text-white placeholder-alamera-muted focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-1">
              {(['all', 'info', 'warning', 'security'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setAuditFilter(sev)}
                  className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase font-semibold transition ${
                    auditFilter === sev
                      ? 'bg-alamera-red text-white'
                      : 'border border-alamera-border bg-alamera-darkest text-alamera-muted hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Trail List */}
          <div className="space-y-2">
            {filteredAuditLogs.map((log) => {
              const isSecurity = log.severity === 'security';
              const isWarning = log.severity === 'warning';
              return (
                <div
                  key={log.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-3 text-xs transition ${
                    isSecurity
                      ? 'border-red-500/40 bg-red-950/20'
                      : isWarning
                      ? 'border-amber-500/30 bg-amber-950/10'
                      : 'border-alamera-border/60 bg-alamera-card/70'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold flex-shrink-0 mt-0.5 ${
                        isSecurity
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-alamera-card text-alamera-muted border border-alamera-border'
                      }`}
                    >
                      {log.severity}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-white text-[11px]">
                          {log.action}
                        </span>
                        <span className="font-mono text-[10px] text-alamera-muted">
                          {log.userEmail || 'Anonymous'}
                        </span>
                      </div>
                      <p className="mt-0.5 font-sans text-xs text-alamera-silver">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between font-mono text-[10px] text-alamera-muted flex-shrink-0">
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                    <span className="text-emerald-400">IP: {log.ip}</span>
                  </div>
                </div>
              );
            })}
            {filteredAuditLogs.length === 0 && (
              <div className="text-center py-8 rounded-lg border border-alamera-border bg-alamera-card text-alamera-muted font-sans text-xs">
                No audit entries matching filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ENCRYPTION GOVERNANCE & ARCHITECTURE SPECIFICATION */}
      {activeTab === 'encryption' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-lg font-semibold text-white">
              Cryptographic Standards & Architecture Governance
            </h2>
            <p className="font-sans text-xs text-alamera-muted">
              Official technical disclosure of security primitives, transit channels, credential hashing, and decryption boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Spec 1: Data in Transit */}
            <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-2">
              <div className="flex items-center space-x-2 text-alamera-red">
                <Globe className="h-5 w-5" />
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
                  1. Data in Transit (TLS 1.3 / HTTPS)
                </h3>
              </div>
              <p className="font-sans text-xs text-alamera-silver leading-relaxed">
                All client-server communications across browser sessions, API calls, and administrative webhooks are encrypted using modern Transport Layer Security (TLS 1.3 with AES-256-GCM cipher suites). Unencrypted HTTP requests are automatically upgraded via HSTS headers.
              </p>
              <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 font-mono text-[11px] text-emerald-400">
                Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
              </div>
            </div>

            {/* Spec 2: Credential Hashing */}
            <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-2">
              <div className="flex items-center space-x-2 text-alamera-red">
                <Key className="h-5 w-5" />
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
                  2. Password Storage (Bcrypt 12 Rounds)
                </h3>
              </div>
              <p className="font-sans text-xs text-alamera-silver leading-relaxed">
                Passwords are never stored in plaintext or reversible encryption. Passwords undergo salted cryptographic hashing using <strong className="text-white">bcrypt with 12 cost rounds</strong>. Every hash incorporates a unique, cryptographically random 16-byte salt to prevent rainbow table attacks.
              </p>
              <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 font-mono text-[11px] text-alamera-muted">
                $2a$12$e80yvYmG/8x/2hM7wZ9yE.zH7j79.5Yc7P9iJ/y7z6/8w9y0x1z2a
              </div>
            </div>

            {/* Spec 3: Session Security */}
            <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-2">
              <div className="flex items-center space-x-2 text-alamera-red">
                <Lock className="h-5 w-5" />
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
                  3. Session Token & Cookie Protection
                </h3>
              </div>
              <p className="font-sans text-xs text-alamera-silver leading-relaxed">
                Authenticated sessions are maintained via 32-byte (256-bit entropy) pseudorandom hex tokens delivered via <strong className="text-white">HttpOnly, SameSite=Lax, Secure cookies</strong>. This architecture renders session tokens strictly inaccessible to client-side JavaScript, guaranteeing resilience against Cross-Site Scripting (XSS).
              </p>
              <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 font-mono text-[11px] text-amber-300">
                Set-Cookie: alamera_session=...; HttpOnly; SameSite=Lax; Secure; Max-Age=28800
              </div>
            </div>

            {/* Spec 4: Brute Force & Rate Limiting */}
            <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-2">
              <div className="flex items-center space-x-2 text-alamera-red">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-white">
                  4. Brute-Force & Timing Protection
                </h3>
              </div>
              <p className="font-sans text-xs text-alamera-silver leading-relaxed">
                Sliding window rate limiters restrict login attempts to a maximum of 5 consecutive failures before initiating an automatic 15-minute lockout. To prevent side-channel username enumeration timing attacks, non-existent accounts evaluate a simulated bcrypt hash identical in processing cycles.
              </p>
              <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 font-mono text-[11px] text-red-300">
                AUTH_LOCKOUT threshold = 5 failures / 15m window (IP & account keyed)
              </div>
            </div>
          </div>

          {/* Architectural Clarification Banner: Server Decryption vs. E2EE */}
          <div className="rounded-lg border border-alamera-red/40 bg-alamera-darkest p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-alamera-red" />
              <h3 className="font-serif text-base font-semibold text-white">
                Architectural Disclosure: CRM Record Decryption vs. End-to-End Encryption (E2EE)
              </h3>
            </div>
            <p className="font-sans text-xs text-alamera-silver leading-relaxed">
              In enterprise real estate platforms, operational functionality—such as searching client records by phone number, indexing AED valuations for financial pipeline aggregation, matching VIP buyers to off-market inventory, and generating real-time DLD escrow summaries—requires that CRM database records are decrypted at the server application boundary.
            </p>
            <p className="font-sans text-xs text-alamera-silver leading-relaxed">
              Unlike consumer messaging apps where zero-knowledge End-to-End Encryption (E2EE) prevents the server from ever reading message bodies, Alamera Real Estate CRM operates on an <strong className="text-white">authenticated server-enforced role boundary</strong>. While transmission in transit is fully encrypted and credentials at rest are cryptographically salted, client records are safely managed within the protected server memory to enable core advisory analytics and team collaboration.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: PROVISION NEW USER */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-alamera-border bg-alamera-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-alamera-border">
              <h3 className="font-serif text-lg font-bold text-white">Provision New Account</h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-alamera-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            {addUserError && (
              <div className="mt-3 rounded border border-alamera-red/40 bg-alamera-red/10 p-2.5 text-xs text-alamera-red">
                {addUserError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <div>
                <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Layla Al-Hashimi"
                  className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="layla@alameraproperties.com"
                  className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="layla"
                  className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                    System Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="agent">Broker (Agent)</option>
                    <option value="manager">Manager</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                    RERA BRN (Optional)
                  </label>
                  <input
                    type="text"
                    value={newUserBRN}
                    onChange={(e) => setNewUserBRN(e.target.value)}
                    placeholder="BRN-50124"
                    className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                  Initial Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="w-1/2 rounded border border-alamera-border bg-alamera-darkest py-2 text-xs text-alamera-silver hover:bg-alamera-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded bg-alamera-red py-2 text-xs font-semibold text-white hover:bg-alamera-redDark"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {isResetPwdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border border-alamera-border bg-alamera-card p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Administrative Password Reset
            </h3>
            <p className="font-sans text-xs text-alamera-muted mb-4">
              Enter a new secure password. The password will be hashed using bcrypt (12 rounds) and all existing user sessions will be invalidated immediately.
            </p>

            <input
              type="password"
              minLength={8}
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none mb-4 font-mono"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsResetPwdOpen(null);
                  setNewPasswordInput('');
                }}
                className="w-1/2 rounded border border-alamera-border bg-alamera-darkest py-2 text-xs text-alamera-silver hover:bg-alamera-card"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetPassword(isResetPwdOpen)}
                className="w-1/2 rounded bg-alamera-red py-2 text-xs font-semibold text-white hover:bg-alamera-redDark"
              >
                Apply Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
