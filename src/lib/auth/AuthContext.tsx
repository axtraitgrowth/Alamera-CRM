'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, Permission, ROLE_PERMISSIONS, UserRole } from './types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<AuthUser | null>;
  login: (login: string, passwordPlain: string) => Promise<{ success: boolean; error?: string; lockedOut?: boolean }>;
  logout: () => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        headers: { credentials: 'same-origin' },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setError(null);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (
    loginInput: string,
    passwordPlain: string
  ): Promise<{ success: boolean; error?: string; lockedOut?: boolean }> => {
    try {
      setError(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginInput, password: passwordPlain }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg = data.error || 'Authentication failed.';
        setError(errMsg);
        return { success: false, error: errMsg, lockedOut: data.lockedOut };
      }

      setUser(data.user);
      return { success: true };
    } catch (err) {
      const errMsg = 'Network or server error during sign-in.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    const allowed = ROLE_PERMISSIONS[user.role] || [];
    return allowed.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        login,
        logout,
        hasRole,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
