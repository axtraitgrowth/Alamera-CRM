'use client';

import React from 'react';
import { ArrowUpRight, ShieldCheck, Building2, Wallet } from 'lucide-react';
import { KPIStats } from '@/types/crm';

interface MetricCardsProps {
  stats: KPIStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Pipeline Value */}
      <div className="group relative overflow-hidden rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-alamera-red/50 hover:shadow-alameraRed">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
            Total Pipeline Volume (AED)
          </span>
          <span className="flex items-center text-[11px] sm:text-xs font-mono text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+18.4% MoM</span>
          </span>
        </div>
        <div className="mt-2 sm:mt-3 font-mono text-xl sm:text-2xl font-bold text-white tracking-tight">
          {stats.totalPipelineValue}
        </div>
        <p className="mt-1 font-sans text-[10px] sm:text-[11px] text-alamera-muted">
          Active acquisition mandates across Dubai prime districts
        </p>
        <div className="mt-2.5 sm:mt-3 h-1 w-full rounded-full bg-alamera-border">
          <div className="h-full w-3/4 rounded-full bg-alamera-red" />
        </div>
      </div>

      {/* Projected Commission Accrual */}
      <div className="group relative overflow-hidden rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-emerald-500/50 hover:shadow-luxe">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
            Accrued Brokerage (2.0%)
          </span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
            <ShieldCheck className="h-2.5 w-2.5" />
            <span>DLD Escrow</span>
          </span>
        </div>
        <div className="mt-2 sm:mt-3 font-mono text-xl sm:text-2xl font-bold text-emerald-400">
          {stats.accruedCommissionProjected}
        </div>
        <p className="mt-1 font-sans text-[10px] sm:text-[11px] text-alamera-muted">
          Brokerage receivable on executed LOIs & escrow deposits
        </p>
        <div className="mt-2.5 sm:mt-3 h-1 w-full rounded-full bg-alamera-border">
          <div className="h-full w-4/5 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Active Family Office Mandates */}
      <div className="group relative overflow-hidden rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-alamera-borderLight hover:shadow-luxe">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
            Active UHNW Principals
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-alamera-silver">Tier 1 KYC</span>
        </div>
        <div className="mt-2 sm:mt-3 font-mono text-xl sm:text-2xl font-bold text-alamera-light">
          {stats.activeMandatesCount} Mandates
        </div>
        <p className="mt-1 font-sans text-[10px] sm:text-[11px] text-alamera-muted">
          Verified sovereign funds & family offices (&gt; AED 250M liquid)
        </p>
        <div className="mt-2.5 sm:mt-3 h-1 w-full rounded-full bg-alamera-border">
          <div className="h-full w-2/3 rounded-full bg-alamera-silver" />
        </div>
      </div>

      {/* Off-Market Trophy Assets */}
      <div className="group relative overflow-hidden rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-alamera-red/40 hover:shadow-luxe">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
            Trophy Off-Market Assets
          </span>
          <span className="rounded bg-alamera-red/10 px-1.5 py-0.5 font-mono text-[9px] text-alamera-red border border-alamera-red/20">
            Exclusive
          </span>
        </div>
        <div className="mt-2 sm:mt-3 font-mono text-xl sm:text-2xl font-bold text-white">
          {stats.confidentialPropertiesCount} Trophy Properties
        </div>
        <p className="mt-1 font-sans text-[10px] sm:text-[11px] text-alamera-muted">
          Average transaction ticket size of AED 76.5M
        </p>
        <div className="mt-2.5 sm:mt-3 h-1 w-full rounded-full bg-alamera-border">
          <div className="h-full w-1/2 rounded-full bg-alamera-red" />
        </div>
      </div>
    </div>
  );
};
