'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Shield,
  Plus,
  Sparkles,
  Menu,
  X,
  CheckCircle,
  LogOut,
  Settings,
  ChevronDown,
  ShieldAlert,
} from 'lucide-react';
import { initialActivities } from '@/data/mockData';
import { useAuth } from '@/lib/auth/AuthContext';
import { NavTab } from './Sidebar';

interface HeaderProps {
  onOpenNewDeal: () => void;
  onOpenBooking: () => void;
  onOpenSearch: () => void;
  activeWatermark: boolean;
  onToggleWatermark: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onNavigateTab?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewDeal,
  onOpenBooking,
  onOpenSearch,
  activeWatermark,
  onToggleWatermark,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onNavigateTab,
}) => {
  const { user, logout, hasRole } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState(initialActivities);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', bg: 'bg-alamera-red/15 text-alamera-red border-alamera-red/30' };
      case 'manager':
        return { label: 'Manager', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Advisor', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    }
  };

  const roleBadge = getRoleBadge(user?.role);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 sm:h-20 w-full items-center justify-between border-b border-alamera-border bg-alamera-black/95 px-3 sm:px-6 backdrop-blur-md shadow-md safe-top">
      {/* Left: Mobile Menu Toggle + Branding & Market Ticker */}
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
        {/* Mobile Hamburger Button (< 1024px) */}
        <button
          onClick={onToggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded border border-alamera-border bg-alamera-card text-alamera-silver hover:border-alamera-red/50 hover:bg-alamera-cardLight transition touch-target"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Branding */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-sm border border-alamera-red/50 bg-alamera-card shadow-alameraRed flex-shrink-0">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-alamera-red">A</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif text-base sm:text-lg font-bold tracking-widest text-white uppercase">
                ALAMERA
              </span>
              <span className="rounded bg-alamera-red/15 px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider text-alamera-red border border-alamera-red/30">
                PROPERTIES
              </span>
            </div>
            <p className="hidden md:block font-sans text-[10px] sm:text-[11px] font-normal tracking-wide text-alamera-muted truncate max-w-[220px] lg:max-w-none">
              Real Estate LLC, Dubai • AXTRAIT Solution
            </p>
          </div>
        </div>

        {/* Live Market Metric Pill (Visible on XL screens) */}
        <div className="hidden xl:flex items-center space-x-3 rounded-full border border-alamera-border bg-alamera-card/70 px-3.5 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-mono text-xs text-alamera-silver">
            DLD Escrow Active: <strong className="text-white font-semibold">AED 421.5M</strong>
          </span>
          <span className="text-alamera-border">|</span>
          <span className="font-mono text-xs text-emerald-400 font-medium">
            +18.4% MoM
          </span>
        </div>
      </div>

      {/* Center: Command Palette Trigger on Tablet & Desktop */}
      <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md mx-2 sm:mx-4 hidden md:block">
        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center justify-between rounded-md border border-alamera-border bg-alamera-card px-3 py-2 text-left text-xs sm:text-sm text-alamera-muted transition hover:border-alamera-red/50 hover:bg-alamera-cardLight shadow-inner"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-alamera-muted group-hover:text-alamera-red transition flex-shrink-0" />
            <span className="text-alamera-muted group-hover:text-alamera-silver text-xs truncate">
              Search clients, AED mandates, properties...
            </span>
          </div>
          <kbd className="hidden lg:inline-flex items-center rounded border border-alamera-border bg-alamera-darkest px-1.5 py-0.5 font-mono text-[10px] text-alamera-red">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions & Advisor Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* Mobile Search Icon Button (< 768px) */}
        <button
          onClick={onOpenSearch}
          aria-label="Open global search"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded border border-alamera-border bg-alamera-card text-alamera-muted hover:text-white hover:border-alamera-red transition touch-target"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Confidentiality Watermark Toggle (Hidden on Small Mobile) */}
        <button
          onClick={onToggleWatermark}
          title="Toggle Confidential Client Watermark overlay"
          className={`hidden sm:flex items-center space-x-1.5 rounded border px-2.5 py-1.5 font-mono text-[11px] sm:text-xs transition ${
            activeWatermark
              ? 'border-alamera-red/40 bg-alamera-red/10 text-alamera-red'
              : 'border-alamera-border bg-alamera-card text-alamera-muted hover:text-alamera-silver'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          <span className="hidden md:inline">NDA Watermark {activeWatermark ? 'ON' : 'OFF'}</span>
          <span className="md:hidden">NDA</span>
        </button>

        {/* Schedule VIP Viewing CTA (Hidden on Small Screens) */}
        <button
          onClick={onOpenBooking}
          className="hidden sm:flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-card px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium tracking-wide text-alamera-silver transition hover:border-alamera-red/40 hover:text-white"
        >
          <Sparkles className="h-3.5 w-3.5 text-alamera-red" />
          <span className="hidden md:inline">VIP Viewing</span>
          <span className="md:hidden">Viewing</span>
        </button>

        {/* New Mandate / Deal CTA (Always visible, compact on mobile) */}
        <button
          onClick={onOpenNewDeal}
          className="flex items-center space-x-1 sm:space-x-1.5 rounded bg-alamera-red px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white transition hover:bg-alamera-redDark shadow-alameraRed touch-target"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="hidden xs:inline sm:inline">New Mandate</span>
          <span className="xs:hidden sm:hidden">+</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded border border-alamera-border bg-alamera-card text-alamera-muted transition hover:border-alamera-red/40 hover:text-white touch-target"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-alamera-red font-mono text-[9px] font-bold text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-24px)] rounded-md border border-alamera-border bg-alamera-card p-3 shadow-alameraCard z-50">
              <div className="flex items-center justify-between border-b border-alamera-border pb-2">
                <span className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                  Private Advisory Alerts
                </span>
                <span className="font-mono text-[10px] text-alamera-red">3 Unread</span>
              </div>
              <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="rounded border border-alamera-border/50 bg-alamera-darkest p-2.5 transition hover:border-alamera-red/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-alamera-red">
                        {act.badge}
                      </span>
                      <span className="font-mono text-[9px] text-alamera-muted">{act.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-white leading-snug">
                      {act.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-alamera-muted line-clamp-1">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Dropdown Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User account and security menu"
            className="flex items-center space-x-2 border-l border-alamera-border pl-2 sm:pl-3 hover:opacity-90 transition"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-full border border-alamera-border flex-shrink-0 bg-alamera-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
                }
                alt={user?.name || 'User'}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden sm:block text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-sans text-xs font-semibold text-white truncate max-w-[110px]">
                  {user?.name || 'Elena Rostova'}
                </span>
                <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`rounded px-1 font-mono text-[8px] font-semibold uppercase border ${roleBadge.bg}`}
                >
                  {roleBadge.label}
                </span>
                <span className="font-mono text-[9px] text-alamera-muted truncate max-w-[70px]">
                  {user?.brnNumber || 'BRN-39102'}
                </span>
              </div>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-alamera-muted hidden sm:block" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-md border border-alamera-border bg-alamera-card p-3 shadow-2xl z-50 text-left">
              <div className="border-b border-alamera-border pb-3">
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-9 overflow-hidden rounded-full border border-alamera-border flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        user?.avatar ||
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={user?.name || 'User'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">
                      {user?.name || 'Elena Rostova'}
                    </span>
                    <span className="font-mono text-[10px] text-alamera-muted block truncate max-w-[170px]">
                      {user?.email || 'admin@alameraproperties.com'}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between font-mono text-[9px]">
                  <span className={`rounded px-1.5 py-0.5 border font-semibold ${roleBadge.bg}`}>
                    {roleBadge.label}
                  </span>
                  <span className="text-emerald-400">
                    {user?.brnNumber || 'BRN-39102'}
                  </span>
                </div>
              </div>

              <div className="py-2 space-y-1">
                {(hasRole('super_admin', 'manager') || !user) && (
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onNavigateTab) onNavigateTab('admin' as NavTab);
                    }}
                    className="flex w-full items-center space-x-2 rounded px-2.5 py-2 text-xs font-medium text-alamera-silver hover:bg-alamera-cardLight hover:text-white transition"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-alamera-red" />
                    <span>Admin & Security Governance</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (onNavigateTab) onNavigateTab('settings');
                  }}
                  className="flex w-full items-center space-x-2 rounded px-2.5 py-2 text-xs font-medium text-alamera-silver hover:bg-alamera-cardLight hover:text-white transition"
                >
                  <Settings className="h-3.5 w-3.5 text-alamera-muted" />
                  <span>RERA Corporate Settings</span>
                </button>
              </div>

              <div className="border-t border-alamera-border pt-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center space-x-2 rounded px-2.5 py-2 text-xs font-medium text-red-400 hover:bg-red-950/30 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of Platform</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
