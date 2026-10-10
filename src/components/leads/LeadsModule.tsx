'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Building,
  UserCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Lead, LeadSource, LeadStatus, LeadType } from '@/types/crm';
import { initialAgents } from '@/data/mockData';

interface LeadsModuleProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onConvertToDeal: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  onAddLead,
  onConvertToDeal,
  onUpdateLeadStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for New Lead
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    type: 'Buyer' as LeadType,
    source: 'Property Finder' as LeadSource,
    budgetAED: '35000000',
    preferredAreas: 'Palm Jumeirah, Dubai Hills Estate',
    propertyType: 'Beachfront Villa',
    assignedAgentId: initialAgents[0].id,
    nationality: 'United Arab Emirates',
    urgency: 'Immediate (Cash)' as Lead['urgency'],
    notes: '',
  });

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.leadNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource =
      selectedSource === 'all' || lead.source.toLowerCase() === selectedSource.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' || lead.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesSource && matchesStatus;
  });

  // KPI calculations
  const totalDemandAED = leads.reduce((acc, l) => acc + l.budgetAED, 0);
  const immediateCashLeads = leads.filter((l) => l.urgency === 'Immediate (Cash)').length;
  const qualifiedCount = leads.filter((l) => l.status === 'Qualified' || l.status === 'Viewing Arranged' || l.status === 'Negotiation').length;

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    const budgetNum = Number(formData.budgetAED) || 25000000;
    const assignedAgent = initialAgents.find((a) => a.id === formData.assignedAgentId) || initialAgents[0];

    const newLead: Lead = {
      id: `ld-${Date.now()}`,
      leadNumber: `ALM-LD-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@client.ae`,
      type: formData.type,
      source: formData.source,
      status: 'New Lead',
      budgetAED: budgetNum,
      budgetFormatted: `AED ${(budgetNum).toLocaleString()}`,
      preferredAreas: formData.preferredAreas.split(',').map((s) => s.trim()),
      propertyType: formData.propertyType,
      assignedAgentId: assignedAgent.id,
      assignedAgentName: assignedAgent.name,
      assignedAgentAvatar: assignedAgent.avatar,
      createdDate: 'Today',
      lastFollowUp: 'Just now',
      notes: formData.notes || 'Inbound client enquiry captured via CRM.',
      nationality: formData.nationality,
      urgency: formData.urgency,
      whatsappAvailable: true,
    };

    onAddLead(newLead);
    setIsAddModalOpen(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      type: 'Buyer',
      source: 'Property Finder',
      budgetAED: '35000000',
      preferredAreas: 'Palm Jumeirah, Dubai Hills Estate',
      propertyType: 'Beachfront Villa',
      assignedAgentId: initialAgents[0].id,
      nationality: 'United Arab Emirates',
      urgency: 'Immediate (Cash)',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              Client Acquisition & Portal Inquiries
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              Live Webhook Sync
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Leads & Inbound Enquiries
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            High-intent UHNW buyer and investor inquiries syndicated directly from Property Finder, Bayut, Dubizzle, and Alamera official campaigns.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target"
        >
          <Plus className="h-4 w-4" />
          <span>Register Inbound Lead</span>
        </button>
      </div>

      {/* Top 4 Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Total Inbound Pipeline
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            {leads.length} Active Leads
          </span>
          <span className="font-sans text-[10px] text-emerald-400">Syndicated across 6 channels</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Capital Demand Value
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-white block">
            AED {(totalDemandAED / 1000000).toFixed(1)}M
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Total declared purchasing power</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Immediate Cash Ready
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-emerald-400 block">
            {immediateCashLeads} Principals
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">Zero financing contingency</span>
        </div>

        <div className="rounded-lg border border-alamera-border bg-alamera-card p-3 sm:p-4">
          <span className="font-mono text-[10px] uppercase text-alamera-muted block">
            Qualified / In Viewing
          </span>
          <span className="mt-1 font-mono text-lg sm:text-xl font-bold text-alamera-red block">
            {qualifiedCount} Active
          </span>
          <span className="font-sans text-[10px] text-alamera-muted">High closing probability</span>
        </div>
      </div>

      {/* Search, Portal Filter & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-alamera-border bg-alamera-card p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-alamera-muted" />
          <input
            type="text"
            placeholder="Search by client name, telephone, code, or desired property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded bg-alamera-darkest border border-alamera-border pl-9 pr-4 py-2 text-xs text-white placeholder-alamera-muted focus:border-alamera-red focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none touch-target"
          >
            <option value="all">All Portals & Sources</option>
            <option value="Property Finder">Property Finder</option>
            <option value="Bayut">Bayut & Dubizzle</option>
            <option value="Official Website">Alamera Website</option>
            <option value="Meta Ads">Meta Ads (IG/FB)</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Direct / Referral">Direct / Referral</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none touch-target"
          >
            <option value="all">All Lead Statuses</option>
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Viewing Arranged">Viewing Arranged</option>
            <option value="Negotiation">Negotiation</option>
          </select>
        </div>
      </div>

      {/* Leads List / Table */}
      <div className="rounded-lg border border-alamera-border bg-alamera-card overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-alamera-muted">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-40 text-alamera-red" />
            <p className="font-serif text-sm text-white">No inquiries match the active filter criteria.</p>
            <p className="text-xs mt-1">Try resetting the portal source filter or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-alamera-border bg-alamera-darkest/70 font-mono text-[10px] uppercase text-alamera-muted">
                  <th className="py-3 px-4">Lead & Contact</th>
                  <th className="py-3 px-3">Portal Source</th>
                  <th className="py-3 px-3">Budget (AED)</th>
                  <th className="py-3 px-3">Desired Property & Area</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned Broker</th>
                  <th className="py-3 px-4 text-right">Instant Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-alamera-border text-xs">
                {filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                  const waMessage = encodeURIComponent(
                    `Hello ${lead.fullName}, this is ${lead.assignedAgentName} from Alamera Real Estate LLC, Dubai regarding your enquiry for ${lead.propertyType} (${lead.budgetFormatted}). Would you be available for a brief consultation or private showing?`
                  );

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-alamera-dark/40 transition group"
                    >
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4 min-w-[180px]">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] text-alamera-red font-semibold">
                            {lead.leadNumber}
                          </span>
                          <span className="rounded bg-alamera-cardLight px-1.5 py-0.2 font-mono text-[9px] text-alamera-muted border border-alamera-border">
                            {lead.type}
                          </span>
                        </div>
                        <div className="mt-1 font-serif text-sm font-semibold text-white">
                          {lead.fullName}
                        </div>
                        <div className="font-mono text-[11px] text-alamera-silver">
                          {lead.phone}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="rounded bg-alamera-darkest px-2 py-1 font-mono text-[10px] text-alamera-silver border border-alamera-border/60 inline-flex items-center space-x-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-alamera-red" />
                          <span>{lead.source}</span>
                        </span>
                        <div className="mt-1 font-mono text-[9px] text-alamera-muted">
                          {lead.urgency}
                        </div>
                      </td>

                      {/* Budget in AED */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono">
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {lead.budgetFormatted}
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          {lead.nationality}
                        </div>
                      </td>

                      {/* Property Type & Area */}
                      <td className="py-3.5 px-3 min-w-[180px]">
                        <div className="font-sans font-medium text-alamera-silver truncate">
                          {lead.propertyType}
                        </div>
                        <div className="font-mono text-[10px] text-alamera-muted truncate mt-0.5">
                          {lead.preferredAreas.join(', ')}
                        </div>
                      </td>

                      {/* Qualification Status Dropdown */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)
                          }
                          className="rounded bg-alamera-darkest border border-alamera-border px-2 py-1 font-mono text-[10px] text-white focus:border-alamera-red focus:outline-none"
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Viewing Arranged">Viewing Arranged</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Disqualified">Disqualified</option>
                        </select>
                        <div className="mt-0.5 font-mono text-[9px] text-alamera-muted">
                          {lead.lastFollowUp}
                        </div>
                      </td>

                      {/* Assigned Agent */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img
                            src={lead.assignedAgentAvatar}
                            alt={lead.assignedAgentName}
                            className="h-6 w-6 rounded-full object-cover border border-alamera-border"
                          />
                          <span className="font-sans text-xs text-alamera-silver">
                            {lead.assignedAgentName}
                          </span>
                        </div>
                      </td>

                      {/* Quick Communication Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* WhatsApp 1-Click Action */}
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat via WhatsApp"
                            className="rounded p-2 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition touch-target flex items-center justify-center"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>

                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            title="Direct Phone Call"
                            className="rounded p-2 bg-alamera-cardLight border border-alamera-border text-alamera-silver hover:text-white hover:border-alamera-red transition touch-target flex items-center justify-center"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {/* Convert to Mandate / Deal */}
                          <button
                            onClick={() => onConvertToDeal(lead)}
                            title="Convert to Acquisition Deal"
                            className="flex items-center space-x-1 rounded px-2.5 py-1.5 bg-alamera-red/15 border border-alamera-red/40 text-alamera-red hover:bg-alamera-red hover:text-white transition font-mono text-[10px] font-semibold"
                          >
                            <span>Convert</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Inbound Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-lg border border-alamera-border bg-alamera-card p-5 sm:p-6 shadow-alameraCard text-left my-8">
            <div className="flex items-center justify-between border-b border-alamera-border pb-3">
              <div>
                <span className="font-mono text-[10px] text-alamera-red uppercase font-semibold">
                  Alamera Real Estate CRM
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Register New Client Enquiry
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded p-1 text-alamera-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeadSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Full Name & Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sheikh Sultan Al-Qasimi / Oliver Vance"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white placeholder-alamera-muted focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white placeholder-alamera-muted focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@entity.ae"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white placeholder-alamera-muted focus:border-alamera-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Enquiry Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as LeadType })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="Buyer">Buyer</option>
                    <option value="Investor">Investor</option>
                    <option value="Seller">Seller</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Portal Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    <option value="Property Finder">Property Finder</option>
                    <option value="Bayut">Bayut & Dubizzle</option>
                    <option value="Official Website">Official Website</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Direct / Referral">Direct / Referral</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Budget (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.budgetAED}
                    onChange={(e) => setFormData({ ...formData, budgetAED: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-2.5 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Desired Property Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5BR Sky Villa / Beachfront"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                    Assigned Licensed Broker
                  </label>
                  <select
                    value={formData.assignedAgentId}
                    onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                    className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                  >
                    {initialAgents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.brnNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Target Locations in Dubai
                </label>
                <input
                  type="text"
                  placeholder="e.g. Palm Jumeirah, Downtown Dubai, Emirates Hills"
                  value={formData.preferredAreas}
                  onChange={(e) => setFormData({ ...formData, preferredAreas: e.target.value })}
                  className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                  Client Notes / Urgency Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific requirements, payment capability, viewing availability..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Register Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
