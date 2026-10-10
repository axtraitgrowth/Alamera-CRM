'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Table,
  Kanban,
  Search,
  Filter,
  ShieldCheck,
} from 'lucide-react';
import { Deal, StageType } from '@/types/crm';

interface DealPipelineProps {
  deals: Deal[];
  onAdvanceDeal: (dealId: string) => void;
  onRollbackDeal: (dealId: string) => void;
  onOpenCreateDeal: () => void;
  onSelectProperty?: (propertyId: string) => void;
  onSelectClient?: (clientId: string) => void;
}

const STAGES: StageType[] = [
  'Mandate Signed',
  'Private Viewing',
  'LOI Submitted',
  'Due Diligence & Escrow',
  'Contract Execution',
];

export const DealPipeline: React.FC<DealPipelineProps> = ({
  deals,
  onAdvanceDeal,
  onRollbackDeal,
  onOpenCreateDeal,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterAdvisor, setFilterAdvisor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileActiveStage, setMobileActiveStage] = useState<string>('all');

  // Filtered Deals
  const filteredDeals = deals.filter((deal) => {
    const matchesAdvisor = filterAdvisor === 'all' || deal.leadAdvisor === filterAdvisor;
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.dealCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAdvisor && matchesSearch;
  });

  // Calculate Pipeline Metrics in AED
  const totalValuation = filteredDeals.reduce((sum, d) => sum + d.valuation, 0);
  const totalCommission = totalValuation * 0.02;

  // Stages to show on mobile (either all or selected single stage)
  const displayedStages =
    mobileActiveStage === 'all'
      ? STAGES
      : STAGES.filter((s) => s === mobileActiveStage);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-alamera-border pb-4 sm:pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Deal Flow & DLD Escrow Stages
            </h2>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>DLD Escrow Linked</span>
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Managing <span className="text-white font-medium">AED {(totalValuation / 1000000).toFixed(1)}M</span> active acquisition pipeline across Dubai prime communities with automated RERA Form F stage compliance.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* View Mode Toggle */}
          <div className="flex rounded border border-alamera-border bg-alamera-card p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              aria-label="Kanban view"
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs transition touch-target ${
                viewMode === 'kanban'
                  ? 'bg-alamera-red/20 text-white font-medium border border-alamera-red/30'
                  : 'text-alamera-muted hover:text-alamera-silver'
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`flex items-center space-x-1.5 rounded px-2.5 sm:px-3 py-1.5 text-xs transition touch-target ${
                viewMode === 'table'
                  ? 'bg-alamera-red/20 text-white font-medium border border-alamera-red/30'
                  : 'text-alamera-muted hover:text-alamera-silver'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Create Deal Button */}
          <button
            onClick={onOpenCreateDeal}
            className="flex items-center space-x-1.5 rounded bg-alamera-red px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-alamera-redDark shadow-alameraRed touch-target transition"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Mandate</span>
          </button>
        </div>
      </div>

      {/* Filter & Metric Ribbon */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 rounded-lg border border-alamera-border bg-alamera-card p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-alamera-muted" />
            <input
              type="text"
              placeholder="Filter deals or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest pl-8 pr-3 py-2 sm:py-1.5 text-xs text-white focus:border-alamera-red focus:outline-none"
            />
          </div>

          {/* Advisor Filter */}
          <select
            value={filterAdvisor}
            onChange={(e) => setFilterAdvisor(e.target.value)}
            className="rounded border border-alamera-border bg-alamera-darkest px-3 py-2 sm:py-1.5 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="all">All Lead Brokers</option>
            <option value="Elena Rostova">Elena Rostova</option>
            <option value="Tariq Al-Mansoor">Tariq Al-Mansoor</option>
            <option value="Julian Thorne">Julian Thorne</option>
          </select>
        </div>

        {/* Aggregate Pipeline Telemetry */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-mono border-t lg:border-t-0 border-alamera-border/60 pt-2 lg:pt-0">
          <div>
            <span className="text-alamera-muted block sm:inline">Volume: </span>
            <strong className="text-white font-bold">
              AED {(totalValuation / 1000000).toFixed(1)}M
            </strong>
          </div>
          <div>
            <span className="text-alamera-muted block sm:inline">Comm (2%): </span>
            <strong className="text-emerald-400 font-semibold">
              AED {(totalCommission / 1000000).toFixed(2)}M
            </strong>
          </div>
          <div>
            <span className="text-alamera-muted block sm:inline">Active: </span>
            <strong className="text-white">{filteredDeals.length} Mandates</strong>
          </div>
        </div>
      </div>

      {/* Mobile Stage Selector Ribbon (< 1024px) */}
      <div className="lg:hidden flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setMobileActiveStage('all')}
          className={`px-3 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition touch-target ${
            mobileActiveStage === 'all'
              ? 'bg-alamera-red text-white font-semibold'
              : 'border border-alamera-border bg-alamera-card text-alamera-muted'
          }`}
        >
          All Stages ({filteredDeals.length})
        </button>
        {STAGES.map((s) => {
          const count = filteredDeals.filter((d) => d.stage === s).length;
          return (
            <button
              key={s}
              onClick={() => setMobileActiveStage(s)}
              className={`px-3 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition touch-target ${
                mobileActiveStage === s
                  ? 'bg-alamera-red text-white font-semibold'
                  : 'border border-alamera-border bg-alamera-card text-alamera-muted'
              }`}
            >
              {s.split(' ')[0]} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-4">
          {displayedStages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.valuation, 0);

            return (
              <div
                key={stage}
                className="flex flex-col rounded-lg border border-alamera-border bg-alamera-card/70 p-3 sm:p-3.5 min-w-[270px] sm:min-w-[280px]"
              >
                {/* Stage Header */}
                <div className="border-b border-alamera-border pb-2.5 mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xs font-semibold uppercase tracking-wider text-white">
                      {stage}
                    </h3>
                    <span className="rounded bg-alamera-darkest px-1.5 py-0.5 font-mono text-[10px] text-alamera-silver border border-alamera-border">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-alamera-red font-semibold">
                    AED {(stageTotal / 1000000).toFixed(1)}M
                  </div>
                </div>

                {/* Stage Cards */}
                <div className="space-y-3 flex-1">
                  {stageDeals.map((deal) => {
                    const currentStageIndex = STAGES.indexOf(deal.stage);
                    const canAdvance = currentStageIndex < STAGES.length - 1;
                    const canRollback = currentStageIndex > 0;

                    return (
                      <div
                        key={deal.id}
                        className="rounded-md border border-alamera-border bg-alamera-darkest p-3 sm:p-3.5 shadow-sm transition hover:border-alamera-red/40"
                      >
                        {/* Top Code & Health */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-semibold text-alamera-red">
                            {deal.dealCode}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold ${
                              deal.health === 'High Momentum'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : deal.health === 'Escrow Clearance'
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-alamera-cardLight text-alamera-silver border border-alamera-border'
                            }`}
                          >
                            {deal.health}
                          </span>
                        </div>

                        {/* Title & Valuation */}
                        <h4 className="mt-2 font-serif text-xs sm:text-sm font-semibold text-white line-clamp-1">
                          {deal.title}
                        </h4>
                        <div className="mt-1 flex items-baseline justify-between font-mono">
                          <span className="text-sm sm:text-base font-bold text-white">
                            {deal.formattedValuation}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {deal.projectedCommission}
                          </span>
                        </div>

                        {/* Client & Advisor */}
                        <div className="mt-2.5 sm:mt-3 space-y-1 border-t border-alamera-border/60 pt-2 text-[11px] text-alamera-muted">
                          <div className="flex items-center justify-between">
                            <span className="truncate pr-1 text-alamera-silver font-medium">
                              {deal.clientName}
                            </span>
                            <span className="font-mono text-[10px] text-alamera-muted flex-shrink-0">
                              {deal.probability}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="truncate pr-1">Broker: {deal.leadAdvisor}</span>
                            <span className="font-mono text-alamera-muted flex-shrink-0">{deal.targetClosing}</span>
                          </div>
                        </div>

                        {/* Probability Progress Bar */}
                        <div className="mt-2.5 h-1 w-full rounded-full bg-alamera-border">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-alamera-red to-emerald-400"
                            style={{ width: `${deal.stageProgress}%` }}
                          />
                        </div>

                        {/* Stage Movement Controls with 44px min touch target */}
                        <div className="mt-3 flex items-center justify-between border-t border-alamera-border/60 pt-2">
                          {canRollback ? (
                            <button
                              onClick={() => onRollbackDeal(deal.id)}
                              title="Revert to previous stage"
                              className="flex items-center space-x-1 rounded px-2.5 py-1.5 font-mono text-[10px] text-alamera-muted hover:bg-alamera-card hover:text-white transition touch-target"
                            >
                              <ArrowLeft className="h-3 w-3" />
                              <span>Back</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          {canAdvance ? (
                            <button
                              onClick={() => onAdvanceDeal(deal.id)}
                              className="flex items-center space-x-1 rounded bg-alamera-red/15 border border-alamera-red/40 px-3 py-1.5 font-mono text-[10px] font-semibold text-white hover:bg-alamera-red transition touch-target"
                            >
                              <span>Advance</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <span className="flex items-center space-x-1 font-mono text-[10px] text-emerald-400 font-medium py-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stageDeals.length === 0 && (
                    <div className="flex h-28 sm:h-32 items-center justify-center rounded border border-dashed border-alamera-border text-center text-xs text-alamera-muted/60 p-2">
                      No mandates currently at this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View with responsive overflow */
        <div className="overflow-x-auto rounded-lg border border-alamera-border bg-alamera-card -mx-3 sm:mx-0">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="border-b border-alamera-border bg-alamera-darkest font-mono text-[10px] uppercase tracking-wider text-alamera-muted">
              <tr>
                <th className="px-3 sm:px-4 py-3">Deal Code & Title</th>
                <th className="px-3 sm:px-4 py-3">Principal Entity</th>
                <th className="px-3 sm:px-4 py-3">Valuation (AED)</th>
                <th className="px-3 sm:px-4 py-3">Stage</th>
                <th className="px-3 sm:px-4 py-3">Lead Broker</th>
                <th className="px-3 sm:px-4 py-3">Closing Target</th>
                <th className="px-3 sm:px-4 py-3 text-right">Stage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-alamera-border font-sans">
              {filteredDeals.map((deal) => {
                const currentStageIndex = STAGES.indexOf(deal.stage);
                const canAdvance = currentStageIndex < STAGES.length - 1;

                return (
                  <tr key={deal.id} className="hover:bg-alamera-dark/40 transition">
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-mono text-[10px] text-alamera-red font-semibold">{deal.dealCode}</div>
                      <div className="font-medium text-white">{deal.title}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="font-medium text-alamera-silver">{deal.clientName}</div>
                      <div className="text-[11px] text-alamera-muted">{deal.clientEntity}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 font-mono">
                      <div className="font-bold text-white">{deal.formattedValuation}</div>
                      <div className="text-[10px] text-emerald-400">{deal.projectedCommission}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className="rounded bg-alamera-darkest px-2 py-0.5 font-mono text-[10px] font-medium text-alamera-silver border border-alamera-border">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-alamera-silver">{deal.leadAdvisor}</td>
                    <td className="px-3 sm:px-4 py-3 font-mono text-alamera-muted">{deal.targetClosing}</td>
                    <td className="px-3 sm:px-4 py-3 text-right">
                      {canAdvance ? (
                        <button
                          onClick={() => onAdvanceDeal(deal.id)}
                          className="inline-flex items-center space-x-1 rounded border border-alamera-red/40 bg-alamera-red/15 px-2.5 py-1.5 font-mono text-[10px] font-medium text-white hover:bg-alamera-red transition touch-target"
                        >
                          <span>Advance</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                          Closed / Escrow
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
