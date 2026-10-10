'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Building2,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading: authLoading } = useAuth();

  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Recovery modal state
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1);
  const [recoveryLogin, setRecoveryLogin] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim() || !password) {
      setErrorMessage('Please enter both your email/username and password.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const result = await login(loginInput, password);
    setSubmitting(false);

    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      if (result.lockedOut) {
        setIsLockedOut(true);
      }
    }
  };

  const fillQuickCredentials = (usr: string, pwd: string) => {
    setLoginInput(usr);
    setPassword(pwd);
    setErrorMessage(null);
  };

  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryLogin.trim()) {
      setRecoveryError('Please provide your registered email or username.');
      return;
    }

    setRecoverySubmitting(true);
    setRecoveryError(null);
    setRecoveryMessage(null);

    try {
      const res = await fetch('/api/auth/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', login: recoveryLogin.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecoveryError(data.error || 'Recovery request failed.');
      } else {
        setRecoveryMessage(data.message);
        if (data.demoToken) {
          setDemoToken(data.demoToken);
          setRecoveryToken(data.demoToken);
        }
        setRecoveryStep(2);
      }
    } catch {
      setRecoveryError('Network error while processing recovery request.');
    } finally {
      setRecoverySubmitting(false);
    }
  };

  const handleCompleteRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryToken.trim() || !newPassword) {
      setRecoveryError('Token and new password (min 8 chars) are required.');
      return;
    }

    setRecoverySubmitting(true);
    setRecoveryError(null);

    try {
      const res = await fetch('/api/auth/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset',
          token: recoveryToken.trim(),
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRecoveryError(data.error || 'Password reset failed.');
      } else {
        setRecoveryMessage('Password successfully updated! You may now sign in.');
        setTimeout(() => {
          setIsRecoveryOpen(false);
          setLoginInput(recoveryLogin);
          setPassword(newPassword);
          setRecoveryStep(1);
          setDemoToken(null);
        }, 1500);
      }
    } catch {
      setRecoveryError('Network error while resetting password.');
    } finally {
      setRecoverySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-alamera-darkest flex flex-col justify-between text-white selection:bg-alamera-red/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-alamera-red/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-alamera-red/5 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Top Header Branding */}
      <header className="relative z-10 flex items-center justify-between px-3 sm:px-6 py-4 sm:py-5 border-b border-alamera-border bg-alamera-black/60 backdrop-blur-md">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-sm border border-alamera-red/60 bg-alamera-card shadow-alameraRed flex-shrink-0">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-alamera-red">A</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase">
                ALAMERA
              </span>
              <span className="rounded bg-alamera-red/20 px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider text-alamera-red border border-alamera-red/30">
                PROPERTIES
              </span>
            </div>
            <p className="font-sans text-[10px] sm:text-[11px] text-alamera-muted truncate max-w-[200px] sm:max-w-none">
              Real Estate LLC, Dubai • AXTRAIT Enterprise Solution
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-alamera-muted font-mono text-xs">
          <Shield className="h-4 w-4 text-alamera-red" />
          <span>RERA ORN #28419</span>
          <span className="text-alamera-border">|</span>
          <span className="text-emerald-400 font-sans text-xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            256-Bit TLS In-Transit
          </span>
        </div>
      </header>

      {/* Center Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-2.5 sm:p-6 md:p-8 w-full overflow-x-hidden">
        <div className="w-full max-w-[340px] sm:max-w-md mx-auto">
          {/* Main Card */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card/90 backdrop-blur-xl p-4 sm:p-7 shadow-2xl overflow-hidden">
            {/* Header / Subtitle */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-alamera-red/10 border border-alamera-red/30 mb-2.5 text-alamera-red">
                <Fingerprint className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-normal sm:tracking-wide text-white uppercase">
                Institutional Access
              </h1>
              <p className="mt-1 font-sans text-[11px] sm:text-xs text-alamera-muted">
                Private Advisory & Escrow Administration Portal
              </p>
            </div>

            {/* Error / Lockout Alert Box */}
            {errorMessage && (
              <div
                className={`mb-5 rounded-md p-3.5 border text-xs flex items-start space-x-2.5 ${
                  isLockedOut
                    ? 'border-red-600 bg-red-950/40 text-red-300'
                    : 'border-alamera-red/40 bg-alamera-red/10 text-alamera-silver'
                }`}
              >
                {isLockedOut ? (
                  <ShieldAlert className="h-4 w-4 text-alamera-red flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-alamera-red flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block text-white font-medium mb-0.5">
                    {isLockedOut ? 'Security Lockout Active' : 'Authentication Notice'}
                  </strong>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-alamera-silver mb-1.5">
                  Account Identifier
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-alamera-muted">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Email or username"
                    className="w-full min-w-0 pl-9 pr-3 py-2.5 rounded border border-alamera-border bg-alamera-darkest text-xs sm:text-sm text-white placeholder-alamera-muted/50 focus:border-alamera-red focus:outline-none focus:ring-1 focus:ring-alamera-red transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-alamera-silver">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryOpen(true);
                      setRecoveryLogin(loginInput);
                    }}
                    className="font-sans text-[11px] text-alamera-red hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-alamera-muted">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-w-0 pl-9 pr-10 py-2.5 rounded border border-alamera-border bg-alamera-darkest text-xs sm:text-sm text-white placeholder-alamera-muted/50 focus:border-alamera-red focus:outline-none focus:ring-1 focus:ring-alamera-red transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-alamera-muted hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center space-x-2 rounded bg-alamera-red py-2.5 px-4 font-sans text-sm font-semibold text-white shadow-alameraRed hover:bg-alamera-redDark disabled:opacity-50 transition"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Advisory Platform</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Switcher for Evaluation */}
            <div className="mt-6 pt-5 border-t border-alamera-border">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-alamera-muted text-center mb-2.5">
                Evaluation Roster (One-Click Pre-fill)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickCredentials('admin@alameraproperties.com', 'AlameraAdmin2026!')}
                  className="rounded border border-alamera-border bg-alamera-darkest p-2 text-left hover:border-alamera-red/60 hover:bg-alamera-cardLight transition"
                >
                  <span className="block font-mono text-[9px] text-alamera-red font-semibold uppercase truncate">
                    Super Admin
                  </span>
                  <span className="block font-sans text-xs font-medium text-white truncate">
                    Elena Rostova
                  </span>
                  <span className="block font-mono text-[9px] text-alamera-muted truncate">
                    All Access
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickCredentials('tariq@alameraproperties.com', 'TariqManager2026!')}
                  className="rounded border border-alamera-border bg-alamera-darkest p-2 text-left hover:border-alamera-red/60 hover:bg-alamera-cardLight transition"
                >
                  <span className="block font-mono text-[9px] text-amber-400 font-semibold uppercase truncate">
                    Manager
                  </span>
                  <span className="block font-sans text-xs font-medium text-white truncate">
                    Tariq Al-M.
                  </span>
                  <span className="block font-mono text-[9px] text-alamera-muted truncate">
                    Ops & Escrow
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fillQuickCredentials('julian@alameraproperties.com', 'JulianAgent2026!')}
                  className="rounded border border-alamera-border bg-alamera-darkest p-2 text-left hover:border-alamera-red/60 hover:bg-alamera-cardLight transition"
                >
                  <span className="block font-mono text-[9px] text-blue-400 font-semibold uppercase truncate">
                    Broker
                  </span>
                  <span className="block font-sans text-xs font-medium text-white truncate">
                    Julian Thorne
                  </span>
                  <span className="block font-mono text-[9px] text-alamera-muted truncate">
                    Advisor
                  </span>
                </button>
              </div>
            </div>

            {/* Security Compliance Note */}
            <div className="mt-5 text-center">
              <p className="font-sans text-[10px] text-alamera-muted leading-relaxed">
                Protected by 12-round salted bcrypt hashing, HttpOnly session cookies, rate-limiting lockout guards, and full audit trail logging.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Recovery Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-alamera-border bg-alamera-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-alamera-border">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-5 w-5 text-alamera-red" />
                <h2 className="font-serif text-lg font-bold text-white">Password Recovery</h2>
              </div>
              <button
                onClick={() => {
                  setIsRecoveryOpen(false);
                  setRecoveryStep(1);
                  setRecoveryError(null);
                  setRecoveryMessage(null);
                }}
                className="text-alamera-muted hover:text-white text-xs font-mono"
              >
                Close ✕
              </button>
            </div>

            {recoveryMessage && (
              <div className="mt-3 rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{recoveryMessage}</span>
              </div>
            )}

            {recoveryError && (
              <div className="mt-3 rounded border border-alamera-red/40 bg-alamera-red/10 p-3 text-xs text-alamera-red flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoveryStep === 1 ? (
              <form onSubmit={handleRequestRecovery} className="mt-4 space-y-3">
                <p className="font-sans text-xs text-alamera-muted leading-relaxed">
                  Provide your registered email address or administrator username. A single-use recovery token will be verified.
                </p>
                <div>
                  <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                    Registered Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryLogin}
                    onChange={(e) => setRecoveryLogin(e.target.value)}
                    placeholder="e.g. admin@alameraproperties.com"
                    className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={recoverySubmitting}
                  className="w-full rounded bg-alamera-red py-2 font-sans text-xs font-semibold text-white hover:bg-alamera-redDark disabled:opacity-50 transition"
                >
                  {recoverySubmitting ? 'Issuing Token...' : 'Generate Recovery Token'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompleteRecovery} className="mt-4 space-y-3">
                {demoToken && (
                  <div className="rounded border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                    <span className="block font-mono text-[10px] uppercase font-bold mb-0.5">
                      Verification Token Generated:
                    </span>
                    <code className="block bg-black/40 p-1.5 rounded font-mono text-[11px] select-all break-all text-amber-200">
                      {demoToken}
                    </code>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                    Recovery Token
                  </label>
                  <input
                    type="text"
                    required
                    value={recoveryToken}
                    onChange={(e) => setRecoveryToken(e.target.value)}
                    placeholder="Paste 64-character token"
                    className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-alamera-silver uppercase mb-1">
                    New Secure Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-3 py-2 rounded border border-alamera-border bg-alamera-darkest text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRecoveryStep(1)}
                    className="w-1/3 rounded border border-alamera-border bg-alamera-darkest py-2 text-xs text-alamera-silver hover:bg-alamera-card"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={recoverySubmitting}
                    className="w-2/3 rounded bg-alamera-red py-2 text-xs font-semibold text-white hover:bg-alamera-redDark disabled:opacity-50"
                  >
                    {recoverySubmitting ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Legal & Compliance */}
      <footer className="relative z-10 px-3 sm:px-6 py-3 sm:py-4 border-t border-alamera-border bg-alamera-black/60 text-center">
        <p className="font-sans text-[10px] sm:text-[11px] text-alamera-muted leading-relaxed">
          © 2026 Alamera Real Estate LLC. All rights reserved. RERA License #28419. Developed by AXTRAIT.
        </p>
      </footer>
    </div>
  );
}
