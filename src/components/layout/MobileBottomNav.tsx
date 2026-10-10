'use client';

import React from 'react';
import {
  LayoutDashboard,
  GitPullRequest,
  PhoneCall,
  Building2,
  Users,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  dealsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  dealsCount,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'leads' as NavTab, label: 'Leads', icon: PhoneCall },
    { id: 'pipeline' as NavTab, label: 'Deals', icon: GitPullRequest, badge: `${dealsCount}` },
    { id: 'properties' as NavTab, label: 'Trophy', icon: Building2 },
    { id: 'clients' as NavTab, label: 'Clients', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-alamera-border bg-alamera-black/95 py-2 px-1 backdrop-blur-lg safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded transition touch-target ${
              isActive
                ? 'text-white font-semibold'
                : 'text-alamera-muted hover:text-alamera-silver'
            }`}
          >
            <div className="relative">
              <Icon className={`h-5 w-5 ${isActive ? 'text-alamera-red' : 'text-alamera-muted'}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-alamera-red font-mono text-[8px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`mt-1 font-sans text-[10px] tracking-tight ${isActive ? 'text-white' : 'text-alamera-muted'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
