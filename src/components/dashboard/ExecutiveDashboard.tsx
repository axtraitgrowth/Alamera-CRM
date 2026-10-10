'use client';

import React from 'react';
import {
  Globe,
  Building2,
  Box,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  TrendingUp,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';
import { Deal, Client, Property, ActivityItem, KPIStats, Agent } from '@/types/crm';
import { MetricCards } from './MetricCards';
import { NavTab } from '../layout/Sidebar';
import { initialAgents, initialMarketingSources } from '@/data/mockData';

interface ExecutiveDashboardProps {
  stats: KPIStats;
  deals: Deal[];
  clients: Client[];
  properties: Property[];
  activities: ActivityItem[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenNewDeal: () => void;
  onOpenBooking: () => void;
  onOpen3DViewer: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  stats,
  deals,
  clients,
  properties,
  activities,
  onNavigateTab,
  onOpenNewDeal,
  onOpenBooking,
  onOpen3DViewer,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-lg border border-alamera-border bg-gradient-to-r from-alamera-card via-alamera-dark to-alamera-black p-4 sm:p-6 shadow-alameraCard">
        <div className="absolute top-0 right-0 w-96 h-96 bg-alamera-red/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-alamera-red uppercase tracking-widest flex items-center space-x-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-alamera-red animate-pulse" />
                <span>Executive Partner Briefing • RERA ORN #28419</span>
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-emerald-400 border border-emerald-500/30">
                Dubai Q4 Target: 92% Achieved
              </span>
            </div>
            <h1 className="mt-1.5 font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
              Alamera Real Estate LLC
            </h1>
            <p className="mt-1 max-w-2xl font-sans text-xs text-alamera-muted leading-relaxed">
              Real-time telemetry across <span className="text-white font-medium">AED 421.5M</span> in active Dubai acquisition mandates, UHNW family office liquid deployments, and syndicated off-market inventory across Palm Jumeirah, Downtown, and Emirates Hills.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('leads')}
              className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target"
            >
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Inbound Leads</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="flex items-center justify-center space-x-2 rounded border border-alamera-border bg-alamera-cardLight px-3.5 sm:px-4 py-2 text-xs font-semibold text-alamera-silver hover:border-alamera-red/40 hover:text-white transition touch-target"
            >
              <Sparkles className="h-3.5 w-3.5 text-alamera-red flex-shrink-0" />
              <span>Book VIP Showing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <MetricCards stats={stats} />

      {/* Center 2-Column Grid: Capital Allocation & Top Active Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left 2 Cols: Capital Deployment & Portal Lead Generation */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          {/* Dubai Capital Deployment by Jurisdiction */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-alamera-border pb-3 sm:pb-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-alamera-red flex-shrink-0" />
                <h3 className="font-serif text-sm sm:text-base font-semibold text-white">
                  Global Capital Deployment by Source Jurisdiction
                </h3>
              </div>
              <span className="font-mono text-[10px] sm:text-xs text-alamera-muted">Q4 Sovereign Allocations (AED)</span>
            </div>

            <div className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 font-mono text-xs">
              {/* Origin 1: UAE / GCC */}
              <div>
                <div className="flex flex-wrap justify-between text-alamera-silver mb-1 gap-1">
                  <span className="font-sans font-medium text-[11px] sm:text-xs">UAE Sovereign Funds & Royal Trusts</span>
                  <span className="text-white font-bold">AED 180.0M (42.7%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-alamera-darkest">
                  <div className="h-full rounded-full bg-alamera-red" style={{ width: '42.7%' }} />
                </div>
              </div>

              {/* Origin 2: UK & Switzerland */}
              <div>
                <div className="flex flex-wrap justify-between text-alamera-silver mb-1 gap-1">
                  <span className="font-sans font-medium text-[11px] sm:text-xs">UK & Swiss Family Offices (Geneva/Mayfair)</span>
                  <span className="text-white font-bold">AED 112.0M (26.5%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-alamera-darkest">
                  <div className="h-full rounded-full bg-slate-400" style={{ width: '26.5%' }} />
                </div>
              </div>

              {/* Origin 3: Monaco & Western Europe */}
              <div>
                <div className="flex flex-wrap justify-between text-alamera-silver mb-1 gap-1">
                  <span className="font-sans font-medium text-[11px] sm:text-xs">Monaco & Western Europe Biotech / Industrialists</span>
                  <span className="text-white font-bold">AED 75.0M (17.8%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-alamera-darkest">
                  <div className="h-full rounded-full bg-slate-500" style={{ width: '17.8%' }} />
                </div>
              </div>

              {/* Origin 4: Singapore & APAC */}
              <div>
                <div className="flex flex-wrap justify-between text-alamera-silver mb-1 gap-1">
                  <span className="font-sans font-medium text-[11px] sm:text-xs">Singapore & APAC Tech / Celestial Family Offices</span>
                  <span className="text-white font-bold">AED 54.5M (13.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-alamera-darkest">
                  <div className="h-full rounded-full bg-slate-600" style={{ width: '13.0%' }} />
                </div>
              </div>
            </div>

            {/* Bottom Asset Breakdown Strip */}
            <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 border-t border-alamera-border pt-4 text-center">
              <div className="rounded border border-alamera-border/60 bg-alamera-darkest p-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">Palm Beachfront</span>
                <span className="font-mono text-xs font-bold text-white">38% (AED 160M)</span>
              </div>
              <div className="rounded border border-alamera-border/60 bg-alamera-darkest p-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">Sky Penthouses</span>
                <span className="font-mono text-xs font-bold text-white">32% (AED 134M)</span>
              </div>
              <div className="rounded border border-alamera-border/60 bg-alamera-darkest p-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">Golf Mansions</span>
                <span className="font-mono text-xs font-bold text-white">20% (AED 84M)</span>
              </div>
              <div className="rounded border border-alamera-border/60 bg-alamera-darkest p-2">
                <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">Island Residences</span>
                <span className="font-mono text-xs font-bold text-white">10% (AED 43M)</span>
              </div>
            </div>
          </div>

          {/* Portal Lead Attribution Summary */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-alamera-red flex-shrink-0" />
                <h3 className="font-serif text-sm sm:text-base font-semibold text-white">
                  Marketing Portal Performance & Inbound Volume
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('marketing')}
                className="flex items-center space-x-1 font-mono text-xs text-alamera-red hover:underline transition touch-target"
              >
                <span>Full Attribution</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {initialMarketingSources.slice(0, 3).map((mkt) => (
                <div
                  key={mkt.id}
                  className="rounded-md border border-alamera-border bg-alamera-darkest p-3 sm:p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-white truncate">{mkt.name}</span>
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] text-emerald-400">
                      {mkt.roiMultiplier}
                    </span>
                  </div>
                  <div className="font-mono text-sm font-bold text-alamera-silver">
                    {mkt.totalEnquiries} Enquiries
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-alamera-muted pt-1 border-t border-alamera-border/40">
                    <span>Closed: AED {(mkt.dealsClosedAED / 1000000).toFixed(0)}M</span>
                    <span>CPL: AED {mkt.cplAED}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Value Deals in Pipeline Preview */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
              <h3 className="font-serif text-sm sm:text-base font-semibold text-white">
                Priority Transaction Pipeline (Dubai Mandates)
              </h3>
              <button
                onClick={() => onNavigateTab('pipeline')}
                className="flex items-center space-x-1 font-mono text-xs text-alamera-red hover:underline transition touch-target"
              >
                <span>Full Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-3 sm:mt-4 space-y-3">
              {deals.slice(0, 3).map((deal) => (
                <div
                  key={deal.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-md border border-alamera-border bg-alamera-darkest p-3 sm:p-3.5 transition hover:border-alamera-red/40"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] font-semibold text-alamera-red">
                        {deal.dealCode}
                      </span>
                      <span className="rounded bg-alamera-cardLight px-1.5 py-0.2 font-mono text-[9px] text-alamera-silver border border-alamera-border">
                        {deal.stage}
                      </span>
                      {deal.escrowStatus && (
                        <span className="hidden sm:inline-block rounded bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] text-emerald-400 border border-emerald-500/20">
                          {deal.escrowStatus}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 font-serif text-xs sm:text-sm font-semibold text-white truncate">
                      {deal.title}
                    </h4>
                    <p className="font-sans text-[11px] text-alamera-muted truncate">
                      {deal.clientName} • Broker: {deal.leadAdvisor}
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono flex sm:flex-col justify-between items-baseline sm:items-end border-t sm:border-t-0 border-alamera-border/50 pt-2 sm:pt-0">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        {deal.formattedValuation}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">
                        Comm: {deal.projectedCommission}
                      </div>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-alamera-muted">
                      Closing: {deal.targetClosing}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Agent Leaderboard & Real-time Advisory Activity Stream */}
        <div className="space-y-5 sm:space-y-6">
          {/* Top Licensed Brokers (RERA) */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-semibold text-white">
                  Broker Performance Leaderboard
                </h3>
                <span className="font-mono text-[9px] text-alamera-muted">Licensed RERA Brokers</span>
              </div>
              <button
                onClick={() => onNavigateTab('agents')}
                className="font-mono text-[10px] text-alamera-red hover:underline"
              >
                All Team →
              </button>
            </div>

            <div className="mt-3 sm:mt-4 space-y-3">
              {initialAgents.slice(0, 3).map((agent, index) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-2.5 rounded-md border border-alamera-border/60 bg-alamera-darkest hover:border-alamera-border transition"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="h-8 w-8 rounded-full object-cover border border-alamera-border"
                      />
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-alamera-red text-white font-mono text-[9px] flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans text-xs font-semibold text-white truncate">
                        {agent.name}
                      </div>
                      <div className="font-mono text-[9px] text-alamera-muted truncate">
                        {agent.brnNumber} • {agent.activeDealsCount} Deals
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-white font-bold">{agent.ytdSalesFormatted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Advisory Activity Stream */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
              <h3 className="font-serif text-sm sm:text-base font-semibold text-white">
                Advisory Audit Log
              </h3>
              <span className="font-mono text-[9px] sm:text-[10px] text-emerald-400 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Feed</span>
              </span>
            </div>

            <div className="mt-3 sm:mt-4 space-y-3.5 sm:space-y-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="relative pl-4 border-l-2 border-alamera-red/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-semibold text-alamera-red uppercase">
                      {act.badge}
                    </span>
                    <span className="font-mono text-[9px] text-alamera-muted">
                      {act.timestamp}
                    </span>
                  </div>
                  <h5 className="font-sans font-semibold text-white leading-snug">
                    {act.title}
                  </h5>
                  <p className="font-sans text-[11px] text-alamera-muted leading-relaxed">
                    {act.description}
                  </p>
                  <div className="font-mono text-[9px] text-alamera-silver">
                    Operator: {act.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Featured Asset Card */}
          <div className="rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5">
            <div className="flex items-center space-x-2 text-alamera-red">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <h4 className="font-serif text-[11px] font-semibold uppercase tracking-wider text-white">
                Featured Off-Market Trophy
              </h4>
            </div>
            <p className="mt-2 font-serif text-sm font-semibold text-white">
              {properties[0]?.title}
            </p>
            <p className="mt-1 font-sans text-xs text-alamera-muted line-clamp-2">
              {properties[0]?.subtitle}
            </p>
            <div className="mt-3 flex items-center justify-between font-mono text-xs">
              <span className="text-white font-bold">{properties[0]?.formattedPrice}</span>
              <button
                onClick={() => onNavigateTab('properties')}
                className="text-alamera-red hover:underline transition touch-target flex items-center text-xs"
              >
                Inspect Portfolio →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
