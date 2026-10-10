'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { KPIStats } from '@/types/crm';

interface ReportsModuleProps {
  stats: KPIStats;
  onExportReport: (format: 'PDF' | 'CSV') => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  stats,
  onExportReport,
}) => {
  const [timeframe, setTimeframe] = useState('Q4 2026');

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              Executive Financial & Market Telemetry
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              AED Valuation Standard
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Reports & Revenue Forecasting
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Detailed brokerage revenue projections, conversion funnels, and commission attribution compliant with Dubai Land Department real estate standards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="Q4 2026">Q4 2026 (Current)</option>
            <option value="Q3 2026">Q3 2026 (Audited)</option>
            <option value="Full Year 2026">Full Year 2026</option>
            <option value="Q1 2027 Projected">Q1 2027 Projected</option>
          </select>

          <button
            onClick={() => onExportReport('PDF')}
            className="flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-cardLight px-3.5 py-2 text-xs font-semibold text-white hover:border-alamera-red transition"
          >
            <Download className="h-3.5 w-3.5 text-alamera-red" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => onExportReport('CSV')}
            className="flex items-center space-x-1.5 rounded border border-alamera-border bg-alamera-cardLight px-3.5 py-2 text-xs font-semibold text-white hover:border-alamera-red transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Closed YTD Volume (AED)
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {stats.dealsClosedYTD || 'AED 865.0M'}
          </span>
          <span className="font-sans text-[10px] text-emerald-400">+29.4% YoY vs 2025</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Active Pipeline (AED)
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {stats.totalPipelineValue}
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">5 high-value mandates</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Gross Brokerage Take (2%)
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-emerald-400 block">
            {stats.accruedCommissionProjected}
          </span>
          <span className="font-sans text-[10px] text-emerald-400">Escrow backed receivables</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Average Deal Velocity
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-alamera-red block">
            {stats.averageDealVelocityDays} Days
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">From Enquiry to DLD Trustee</span>
        </div>
      </div>

      {/* 2-Column: Conversion Funnel & Commission Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Conversion Funnel */}
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-5">
          <div className="border-b border-alamera-border pb-3 flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-white">
              Client Acquisition & Conversion Funnel
            </h3>
            <span className="font-mono text-[10px] text-alamera-muted">Dubai Luxury Cycle</span>
          </div>

          <div className="mt-5 space-y-3 font-mono text-xs">
            {/* Step 1 */}
            <div>
              <div className="flex justify-between text-alamera-silver mb-1">
                <span>1. Inbound Inquiries (Portals & Direct)</span>
                <span className="font-bold text-white">508 Inquiries (100%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-alamera-darkest">
                <div className="h-full rounded-full bg-slate-500" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex justify-between text-alamera-silver mb-1">
                <span>2. KYC Pre-Screened & Qualified Buyers</span>
                <span className="font-bold text-white">172 Verified (33.8%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-alamera-darkest">
                <div className="h-full rounded-full bg-slate-400" style={{ width: '33.8%' }} />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex justify-between text-alamera-silver mb-1">
                <span>3. VIP Physical & Marine Viewings</span>
                <span className="font-bold text-white">68 Conducted (13.4%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-alamera-darkest">
                <div className="h-full rounded-full bg-amber-500" style={{ width: '13.4%' }} />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex justify-between text-alamera-silver mb-1">
                <span>4. Formal LOIs & Form F Executed</span>
                <span className="font-bold text-white">14 In Escrow (2.8%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-alamera-darkest">
                <div className="h-full rounded-full bg-alamera-red" style={{ width: '7%' }} />
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <div className="flex justify-between text-alamera-silver mb-1">
                <span>5. DLD Trustee Registration Completed</span>
                <span className="font-bold text-emerald-400">8 Closed Mandates (1.6%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-alamera-darkest">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: '4%' }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-alamera-border/60 text-[11px] font-sans text-alamera-muted">
            Average transaction value among closed deals is <strong className="text-white">AED 78.4M</strong>, yielding optimal marketing efficiency.
          </div>
        </div>

        {/* Commission Allocation & Agency Retained */}
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-5">
          <div className="border-b border-alamera-border pb-3 flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-white">
              Commission Distribution & Split Analysis
            </h3>
            <span className="font-mono text-[10px] text-alamera-muted">RERA 2% Standard</span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="p-4 rounded border border-alamera-border bg-alamera-darkest flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-alamera-muted uppercase block">
                  Alamera Corporate Agency Retained (50%)
                </span>
                <span className="font-serif text-lg font-bold text-white mt-0.5 block">
                  AED 4,215,000
                </span>
                <p className="font-sans text-[11px] text-alamera-muted mt-1">
                  Re-invested in syndication, portal exclusivity & legal escrow fees.
                </p>
              </div>
              <span className="rounded bg-alamera-red/15 px-2.5 py-1 font-mono text-xs text-alamera-red border border-alamera-red/30 font-bold">
                50% Agency
              </span>
            </div>

            <div className="p-4 rounded border border-alamera-border bg-alamera-darkest flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-alamera-muted uppercase block">
                  Licensed Brokerage Advisor Pool (50%)
                </span>
                <span className="font-serif text-lg font-bold text-emerald-400 mt-0.5 block">
                  AED 4,215,000
                </span>
                <p className="font-sans text-[11px] text-alamera-muted mt-1">
                  Distributed across 5 senior partners and directors based on BRN mandate quotas.
                </p>
              </div>
              <span className="rounded bg-emerald-500/15 px-2.5 py-1 font-mono text-xs text-emerald-400 border border-emerald-500/30 font-bold">
                50% Brokers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
