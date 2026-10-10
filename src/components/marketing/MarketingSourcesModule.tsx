'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Globe,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { MarketingSource } from '@/types/crm';

interface MarketingSourcesModuleProps {
  sources: MarketingSource[];
  onTriggerSync: (sourceId?: string) => void;
}

export const MarketingSourcesModule: React.FC<MarketingSourcesModuleProps> = ({
  sources,
  onTriggerSync,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const totalSpend = sources.reduce((acc, s) => acc + s.monthlySpendAED, 0);
  const totalEnquiries = sources.reduce((acc, s) => acc + s.totalEnquiries, 0);
  const totalClosed = sources.reduce((acc, s) => acc + s.dealsClosedAED, 0);
  const averageCpl = Math.round(totalSpend / totalEnquiries);

  const handleSyncClick = (id: string) => {
    setSyncingId(id);
    onTriggerSync(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              Portal Attribution & Acquisition Telemetry
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              Live XML & Webhook Syndication
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Marketing Channels & Portal ROI
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            End-to-end attribution tracking from Property Finder, Bayut, Meta Ads, and official web portals to closed Dubai Land Department escrows.
          </p>
        </div>

        <button
          onClick={() => {
            setSyncingId('all');
            onTriggerSync();
            setTimeout(() => setSyncingId(null), 2000);
          }}
          disabled={syncingId !== null}
          className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncingId === 'all' ? 'animate-spin' : ''}`} />
          <span>{syncingId === 'all' ? 'Syncing Feeds...' : 'Sync All XML Feeds'}</span>
        </button>
      </div>

      {/* Top 4 Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Total Monthly Marketing Spend
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            AED {totalSpend.toLocaleString()}
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Portals & Digital Campaigns</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Closed Revenue (AED)
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-emerald-400 block">
            AED {(totalClosed / 1000000).toFixed(1)}M
          </span>
          <span className="font-sans text-[10px] text-emerald-400">Attributed to portal leads</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Average Cost Per Lead (CPL)
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            AED {averageCpl}
          </span>
          <span className="font-sans text-[10px] text-emerald-400">-14% vs Dubai Luxury Benchmark</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Overall Channel ROI
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-alamera-red block">
            86.4x Return
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Based on 2% gross commission</span>
        </div>
      </div>

      {/* Channel Breakdown Table */}
      <div className="rounded-lg border border-alamera-border bg-alamera-card overflow-hidden">
        <div className="p-4 border-b border-alamera-border flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-white">
            Syndicated Channel Performance Matrix
          </h3>
          <span className="font-mono text-[10px] text-alamera-muted">Updated in Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-alamera-border bg-alamera-darkest/70 font-mono text-[10px] uppercase text-alamera-muted">
                <th className="py-3 px-4">Channel & Portal</th>
                <th className="py-3 px-3">Enquiries</th>
                <th className="py-3 px-3">Qualified Leads</th>
                <th className="py-3 px-3">Spend (AED/mo)</th>
                <th className="py-3 px-3">CPL (AED)</th>
                <th className="py-3 px-3">Closed Sales (AED)</th>
                <th className="py-3 px-3">Channel ROI</th>
                <th className="py-3 px-4 text-right">Syndication Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-alamera-border text-xs">
              {sources.map((src) => {
                const isSyncing = syncingId === src.id;

                return (
                  <tr key={src.id} className="hover:bg-alamera-dark/40 transition">
                    <td className="py-3.5 px-4 min-w-[200px]">
                      <div className="font-serif text-sm font-semibold text-white">
                        {src.name}
                      </div>
                      <div className="font-mono text-[10px] text-alamera-muted">
                        Category: {src.category}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-semibold text-white">
                      {src.totalEnquiries}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-emerald-400 font-semibold">
                      {src.qualifiedLeads}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-alamera-silver">
                      AED {src.monthlySpendAED.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-white">
                      AED {src.cplAED}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      AED {(src.dealsClosedAED / 1000000).toFixed(1)}M
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">
                      {src.roiMultiplier}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-mono text-[10px] text-alamera-muted">
                          {src.lastSync}
                        </span>
                        <button
                          onClick={() => handleSyncClick(src.id)}
                          disabled={isSyncing}
                          className="rounded p-1.5 bg-alamera-darkest border border-alamera-border text-alamera-silver hover:text-white hover:border-alamera-red transition"
                          title="Trigger Feed Sync"
                        >
                          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-alamera-red' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
