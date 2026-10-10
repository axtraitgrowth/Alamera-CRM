'use client';

import React from 'react';
import {
  LayoutDashboard,
  GitPullRequest,
  Users,
  Building2,
  Box,
  CalendarCheck,
  X,
  PhoneCall,
  CheckSquare,
  TrendingUp,
  BarChart3,
  Layers,
  Settings,
  ShieldCheck,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'properties'
  | 'clients'
  | 'agents'
  | 'tasks'
  | 'concierge'
  | 'marketing'
  | 'reports'
  | 'integrations'
  | 'settings'
  | 'spatial'
  | 'admin';

export interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  badgeHighlight?: boolean;
  badgeSpecial?: boolean;
  badgeGreen?: boolean;
}

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  dealsCount: number;
  clientsCount: number;
  propertiesCount: number;
  bookingsCount: number;
  leadsCount?: number;
  tasksCount?: number;
  agentsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  dealsCount,
  clientsCount,
  propertiesCount,
  bookingsCount,
  leadsCount = 8,
  tasksCount = 5,
  agentsCount = 5,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, hasRole } = useAuth();
  const isAdminOrManager = hasRole('super_admin', 'manager') || !user;

  const primaryNavItems: NavItem[] = [
    {
      id: 'dashboard' as NavTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'leads' as NavTab,
      label: 'Inbound Leads',
      icon: PhoneCall,
      badge: `${leadsCount}`,
      badgeHighlight: true,
    },
    {
      id: 'pipeline' as NavTab,
      label: 'Deal Flow & Escrow',
      icon: GitPullRequest,
      badge: `${dealsCount}`,
      badgeHighlight: true,
    },
    {
      id: 'properties' as NavTab,
      label: 'Trophy Off-Market',
      icon: Building2,
      badge: `${propertiesCount}`,
    },
    {
      id: 'clients' as NavTab,
      label: 'UHNW Client Dossiers',
      icon: Users,
      badge: `${clientsCount}`,
    },
    {
      id: 'tasks' as NavTab,
      label: 'Tasks & Follow-ups',
      icon: CheckSquare,
      badge: `${tasksCount}`,
    },
    {
      id: 'concierge' as NavTab,
      label: 'VIP Viewings & Transit',
      icon: CalendarCheck,
      badge: `${bookingsCount}`,
    },
    {
      id: 'agents' as NavTab,
      label: 'Advisory Team & Brokers',
      icon: UserCheck,
      badge: `${agentsCount}`,
    },
    {
      id: 'spatial' as NavTab,
      label: '3D Spatial Studio',
      icon: Box,
      badge: 'LIVE 3D',
      badgeSpecial: true,
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      id: 'marketing' as NavTab,
      label: 'Marketing & Portals',
      icon: TrendingUp,
      badge: 'ROI',
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Revenue',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'integrations' as NavTab,
      label: 'Integrations & APIs',
      icon: Layers,
      badge: '5 LIVE',
      badgeGreen: true,
    },
    {
      id: 'settings' as NavTab,
      label: 'RERA Settings',
      icon: Settings,
      badge: 'ORN',
    },
  ];

  // Add Admin tab for authorized roles
  if (isAdminOrManager) {
    secondaryNavItems.push({
      id: 'admin' as NavTab,
      label: 'Admin & Security',
      icon: ShieldAlert,
      badge: 'RBAC',
      badgeHighlight: true,
    });
  }

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto pr-1">
      {/* Navigation Links */}
      <div className="space-y-4 sm:space-y-5">
        {/* Mobile Header with Close button (visible only in mobile drawer) */}
        <div className="lg:hidden flex items-center justify-between border-b border-alamera-border pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-alamera-red/40 bg-alamera-card text-alamera-red font-serif font-bold text-sm">
              A
            </div>
            <div>
              <span className="font-serif text-sm font-semibold tracking-wider text-white uppercase block">
                ALAMERA CRM
              </span>
              <span className="font-mono text-[9px] text-alamera-muted block">
                DUBAI REAL ESTATE LLC
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="rounded p-1.5 text-alamera-muted hover:text-white touch-target flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Advisory Navigation */}
        <div>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-superLuxe text-alamera-muted px-3 block">
            CORE WORKFLOWS
          </span>
          <nav className="mt-1.5 space-y-0.5">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded px-3 py-2 text-xs font-medium transition touch-target ${
                    isActive
                      ? 'border border-alamera-red/50 bg-gradient-to-r from-alamera-red/20 to-transparent text-white font-semibold shadow-sm'
                      : 'text-alamera-muted hover:border hover:border-alamera-border hover:bg-alamera-card hover:text-alamera-silver'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 transition flex-shrink-0 ${
                        isActive
                          ? 'text-alamera-red'
                          : 'text-alamera-muted group-hover:text-alamera-silver'
                      }`}
                    />
                    <span className="tracking-wide text-left truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-medium flex-shrink-0 ${
                        item.badgeSpecial
                          ? 'border border-alamera-red/50 bg-alamera-red/20 text-alamera-red font-bold'
                          : item.badgeHighlight
                          ? 'bg-alamera-red/15 text-alamera-red border border-alamera-red/30'
                          : item.badgeGreen
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-alamera-card text-alamera-muted border border-alamera-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Management & Governance */}
        <div>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-superLuxe text-alamera-muted px-3 block">
            GOVERNANCE & ANALYTICS
          </span>
          <nav className="mt-1.5 space-y-0.5">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded px-3 py-2 text-xs font-medium transition touch-target ${
                    isActive
                      ? 'border border-alamera-red/50 bg-gradient-to-r from-alamera-red/20 to-transparent text-white font-semibold shadow-sm'
                      : 'text-alamera-muted hover:border hover:border-alamera-border hover:bg-alamera-card hover:text-alamera-silver'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon
                      className={`h-4 w-4 transition flex-shrink-0 ${
                        isActive
                          ? 'text-alamera-red'
                          : 'text-alamera-muted group-hover:text-alamera-silver'
                      }`}
                    />
                    <span className="tracking-wide text-left truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-medium flex-shrink-0 ${
                        item.badgeHighlight
                          ? 'bg-alamera-red/15 text-alamera-red border border-alamera-red/30'
                          : item.badgeGreen
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-alamera-card text-alamera-muted border border-alamera-border'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RERA Discretion Box */}
        <div className="rounded border border-alamera-border bg-alamera-card/70 p-3">
          <div className="flex items-center space-x-1.5 text-alamera-red">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
              RERA ORN #28419
            </span>
          </div>
          <p className="mt-1 font-sans text-[10px] text-alamera-muted leading-relaxed">
            Regulated by Dubai Real Estate Regulatory Agency (DLD). Escrow protections active.
          </p>
        </div>
      </div>

      {/* Footer System Telemetry */}
      <div className="border-t border-alamera-border pt-3 mt-4">
        <div className="flex items-center justify-between text-[10px] font-mono text-alamera-muted">
          <div className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AED TELEMETRY</span>
          </div>
          <span className="text-alamera-red font-semibold">v3.0 ENTERPRISE</span>
        </div>
        <p className="mt-1 text-[9px] font-sans text-alamera-muted/70">
          Alamera Real Estate LLC • AXTRAIT Solution
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (>= 1024px) */}
      <aside className="hidden lg:flex fixed left-0 top-16 sm:top-20 bottom-0 z-30 w-64 flex-col justify-between border-r border-alamera-border bg-alamera-darkest p-4">
        {navContent}
      </aside>

      {/* 2. Mobile / Tablet Slide-out Drawer (< 1024px) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] border-r border-alamera-border bg-alamera-darkest p-4 shadow-2xl safe-top safe-bottom">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
