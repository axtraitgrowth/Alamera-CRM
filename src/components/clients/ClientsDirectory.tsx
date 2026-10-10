'use client';

import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  ChevronRight,
} from 'lucide-react';
import { Client } from '@/types/crm';
import { ClientDossierModal } from './ClientDossierModal';
import { AddClientModal } from './AddClientModal';

interface ClientsDirectoryProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onBookViewingForClient: (client: Client) => void;
  onCreateDealForClient: (client: Client) => void;
}

export const ClientsDirectory: React.FC<ClientsDirectoryProps> = ({
  clients,
  onAddClient,
  onBookViewingForClient,
  onCreateDealForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetDistricts.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesKyc = kycFilter === 'all' || c.kycStatus === kycFilter;
    return matchesSearch && matchesKyc;
  });

  const handleOpenDossier = (client: Client) => {
    setSelectedClient(client);
    setIsDossierOpen(true);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header & Onboard CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-alamera-border pb-4 sm:pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-champagne-100">
              UHNW Client Dossiers & Family Offices
            </h2>
            <span className="rounded bg-champagne-500/10 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-champagne-400 border border-champagne-500/30">
              DIFC Discretion
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Institutional representation of global family offices, sovereign principals, and ultra-high-net-worth investors
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 rounded bg-gradient-to-r from-champagne-500 to-champagne-600 px-4 py-2 text-xs font-semibold text-alamera-darkest hover:from-champagne-400 hover:to-champagne-500 transition shadow-luxeGlow touch-target"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Onboard VIP Client</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-alamera-border bg-alamera-card/70 p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:space-x-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-alamera-muted" />
            <input
              type="text"
              placeholder="Search principals, entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest pl-8 pr-3 py-2 sm:py-1.5 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            />
          </div>

          {/* KYC Filter */}
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="rounded border border-alamera-border bg-alamera-darkest px-3 py-2 sm:py-1.5 text-xs text-alamera-silver focus:border-champagne-500 focus:outline-none"
          >
            <option value="all">All Compliance Tiers</option>
            <option value="Tier 1 Verified">Tier 1 Verified</option>
            <option value="Tier 2 Under Review">Tier 2 Under Review</option>
          </select>
        </div>

        <div className="font-mono text-[11px] sm:text-xs text-alamera-muted text-right sm:text-left">
          Showing <strong className="text-champagne-300">{filteredClients.length}</strong> Principals
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="group relative flex flex-col justify-between rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-champagne-500/50 hover:shadow-luxe"
          >
            <div>
              {/* Card Top: Avatar & KYC */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-md border border-champagne-500/40 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-sm font-semibold text-champagne-100 group-hover:text-champagne-300 transition truncate">
                      {client.name}
                    </h3>
                    <p className="font-sans text-[11px] text-alamera-muted truncate">
                      {client.title}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-semibold flex-shrink-0 ${
                    client.kycStatus === 'Tier 1 Verified'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {client.kycStatus === 'Tier 1 Verified' ? 'Tier 1' : 'Tier 2'}
                </span>
              </div>

              {/* Entity & Residence */}
              <div className="mt-3 space-y-1 rounded border border-alamera-border/60 bg-alamera-darkest/70 p-2.5 text-[11px]">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-alamera-muted flex-shrink-0">Entity:</span>
                  <span className="font-medium text-alamera-silver truncate text-right">
                    {client.entity}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-alamera-muted flex-shrink-0">Residence:</span>
                  <span className="text-alamera-silver truncate text-right">
                    {client.residence}
                  </span>
                </div>
              </div>

              {/* Financial Telemetry Banner */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center font-mono">
                <div className="rounded border border-alamera-border bg-alamera-cardLight/50 p-2">
                  <span className="text-[9px] uppercase tracking-wider text-alamera-muted block">
                    Net Worth
                  </span>
                  <span className="text-xs font-bold text-champagne-300">
                    {client.netWorth}
                  </span>
                </div>
                <div className="rounded border border-alamera-border bg-alamera-cardLight/50 p-2">
                  <span className="text-[9px] uppercase tracking-wider text-alamera-muted block">
                    Liquid Capacity
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {client.liquidAllocation}
                  </span>
                </div>
              </div>

              {/* Target Districts Tags */}
              <div className="mt-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-alamera-muted block mb-1">
                  Target Districts
                </span>
                <div className="flex flex-wrap gap-1">
                  {client.targetDistricts.map((d) => (
                    <span
                      key={d}
                      className="rounded bg-champagne-500/10 px-1.5 py-0.5 font-mono text-[9px] text-champagne-300 border border-champagne-500/20"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-alamera-border pt-3">
              <span className="font-mono text-[10px] text-alamera-muted truncate pr-2">
                Adv: {client.primaryAdvisor.split(' ')[0]}
              </span>
              <button
                onClick={() => handleOpenDossier(client)}
                className="flex items-center space-x-1 rounded border border-champagne-500/40 bg-champagne-500/10 px-3 py-1.5 font-mono text-xs font-medium text-champagne-300 hover:bg-champagne-500 hover:text-alamera-darkest transition touch-target flex-shrink-0"
              >
                <span>Dossier</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Client Dossier Slide-Over Modal */}
      <ClientDossierModal
        client={selectedClient}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onBookViewingForClient={onBookViewingForClient}
        onCreateDealForClient={onCreateDealForClient}
      />

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddClient={onAddClient}
      />
    </div>
  );
};
