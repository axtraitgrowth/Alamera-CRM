'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  Plus,
  Star,
  Building,
  TrendingUp,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Agent } from '@/types/crm';

interface AgentsModuleProps {
  agents: Agent[];
  onAddAgent: (agent: Agent) => void;
}

export const AgentsModule: React.FC<AgentsModuleProps> = ({
  agents,
  onAddAgent,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: 'Executive Broker',
    brnNumber: 'BRN-',
    email: '',
    phone: '',
    specialization: 'Palm Jumeirah & Waterfront Estates',
    commissionSplit: '50/50 Broker Tier',
  });

  const totalYtdSales = agents.reduce((acc, a) => acc + a.ytdSalesAED, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newAgent: Agent = {
      id: `ag-${Date.now()}`,
      name: formData.name,
      title: formData.title,
      brnNumber: formData.brnNumber.startsWith('BRN-') ? formData.brnNumber : `BRN-${formData.brnNumber}`,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@alameraproperties.com`,
      phone: formData.phone,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      specialization: formData.specialization,
      activeDealsCount: 0,
      ytdSalesAED: 0,
      ytdSalesFormatted: 'AED 0.0M',
      activeLeadsCount: 0,
      commissionSplit: formData.commissionSplit,
      rating: 5.0,
      status: 'Active',
    };

    onAddAgent(newAgent);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      title: 'Executive Broker',
      brnNumber: 'BRN-',
      email: '',
      phone: '',
      specialization: 'Palm Jumeirah & Waterfront Estates',
      commissionSplit: '50/50 Broker Tier',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              RERA Licensed Brokerage Directorate
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              ORN #28419 (Alamera Real Estate LLC)
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Agents & Advisory Team
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Licensed Dubai Land Department (DLD) real estate practitioners managing high-volume institutional mandates and off-market private treaty sales.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target"
        >
          <Plus className="h-4 w-4" />
          <span>Add Licensed Broker</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Active Advisory Team
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {agents.length} Brokers
          </span>
          <span className="font-sans text-[10px] text-emerald-400">100% RERA Certified</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Total Team YTD Sales
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            AED {(totalYtdSales / 1000000).toFixed(1)}M
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Closed volume through Q4</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Agency Commission Standard
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-alamera-red block">
            2.0% Sales / 5.0% Lease
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">RERA regulation compliant</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Average Client Rating
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block flex items-center space-x-1">
            <span>4.9</span>
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          </span>
          <span className="font-sans text-[10px] text-emerald-400">Verified UHNW feedback</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-4 hover:border-alamera-red/40 transition group shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Top Avatar & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-alamera-border group-hover:border-alamera-red transition"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-alamera-card ${
                        agent.status === 'Active'
                          ? 'bg-emerald-400'
                          : agent.status === 'In Field Viewing'
                          ? 'bg-blue-400'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-alamera-red transition">
                      {agent.name}
                    </h3>
                    <p className="font-sans text-xs text-alamera-muted">{agent.title}</p>
                  </div>
                </div>

                <span className="rounded bg-alamera-darkest px-2 py-0.5 font-mono text-[10px] text-alamera-silver border border-alamera-border">
                  {agent.brnNumber}
                </span>
              </div>

              {/* Specialization */}
              <div className="mt-3.5 pt-3 border-t border-alamera-border/60">
                <span className="font-mono text-[10px] text-alamera-muted uppercase block">
                  Market Specialization
                </span>
                <span className="font-sans text-xs font-medium text-white block mt-0.5">
                  {agent.specialization}
                </span>
              </div>

              {/* Stats Strip */}
              <div className="mt-3 grid grid-cols-2 gap-2 bg-alamera-darkest p-2.5 rounded border border-alamera-border/40 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-alamera-muted block">YTD Closed</span>
                  <span className="font-bold text-white">{agent.ytdSalesFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] text-alamera-muted block">Active Mandates</span>
                  <span className="font-bold text-emerald-400">{agent.activeDealsCount} Deals</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="mt-3 space-y-1 font-mono text-xs text-alamera-muted">
                <div className="flex items-center space-x-2 truncate">
                  <Phone className="h-3 w-3 text-alamera-red flex-shrink-0" />
                  <span className="text-alamera-silver">{agent.phone}</span>
                </div>
                <div className="flex items-center space-x-2 truncate">
                  <Mail className="h-3 w-3 text-alamera-muted flex-shrink-0" />
                  <span className="text-alamera-silver truncate">{agent.email}</span>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-alamera-border/60 flex items-center justify-between">
              <span className="font-mono text-[10px] text-alamera-muted">
                Status: <span className="text-white">{agent.status}</span>
              </span>
              <a
                href={`tel:${agent.phone}`}
                className="rounded px-3 py-1.5 bg-alamera-cardLight border border-alamera-border text-white hover:border-alamera-red font-mono text-[10px] transition"
              >
                Direct Call
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-lg border border-alamera-border bg-alamera-card p-5 sm:p-6 shadow-alameraCard text-left my-8">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3">
              <div>
                <span className="font-mono text-[10px] text-alamera-red uppercase font-semibold">
                  RERA Compliance
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Add Licensed Broker
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-alamera-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Broker Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    RERA BRN Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BRN-28491"
                    value={formData.brnNumber}
                    onChange={(e) => setFormData({ ...formData, brnNumber: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Advisory Title
                  </label>
                  <select
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="Senior Partner">Senior Partner</option>
                    <option value="Private Client Director">Private Client Director</option>
                    <option value="Executive Broker">Executive Broker</option>
                    <option value="Off-Plan Advisory Lead">Off-Plan Advisory Lead</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Commission Tier
                  </label>
                  <select
                    value={formData.commissionSplit}
                    onChange={(e) => setFormData({ ...formData, commissionSplit: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="50/50 Broker Tier">50/50 Broker Tier</option>
                    <option value="60/40 Partner Tier">60/40 Partner Tier</option>
                    <option value="70/30 Senior Partner">70/30 Senior Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Market Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Palm Jumeirah & Branded Penthouses"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-alamera-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded px-4 py-2 font-mono text-xs text-alamera-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-alamera-red px-5 py-2 font-mono text-xs font-semibold text-white hover:bg-alamera-redDark shadow-alameraRed transition"
                >
                  Register Broker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
