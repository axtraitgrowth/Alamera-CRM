'use client';

import React from 'react';
import {
  X,
  FileText,
  MapPin,
  Mail,
  Sparkles,
  Building2,
} from 'lucide-react';
import { Client } from '@/types/crm';

interface ClientDossierModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onBookViewingForClient: (client: Client) => void;
  onCreateDealForClient: (client: Client) => void;
}

export const ClientDossierModal: React.FC<ClientDossierModalProps> = ({
  client,
  isOpen,
  onClose,
  onBookViewingForClient,
  onCreateDealForClient,
}) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm">
      <div className="h-full w-full sm:max-w-xl md:max-w-2xl overflow-y-auto border-l border-alamera-border bg-alamera-card p-4 sm:p-6 md:p-8 shadow-2xl safe-top safe-bottom">
        {/* Header Close & Discretion Pill */}
        <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
          <div className="flex items-center space-x-2">
            <span className="rounded bg-champagne-500/15 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-champagne-300 border border-champagne-500/30">
              CONFIDENTIAL UHNW DOSSIER
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-alamera-muted">ID: {client.id}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dossier"
            className="rounded p-1.5 text-alamera-muted hover:bg-alamera-cardLight hover:text-alamera-silver touch-target flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Client Profile Overview */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-md border-2 border-champagne-500/50 shadow-luxeGlow flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.avatar}
              alt={client.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-champagne-100 truncate">
                {client.name}
              </h2>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                {client.kycStatus}
              </span>
            </div>
            <p className="font-sans text-xs font-medium text-champagne-400 truncate mt-0.5">
              {client.title} • {client.entity}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-alamera-muted">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-champagne-500 flex-shrink-0" />
                <span className="truncate">{client.residence} ({client.nationality})</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-champagne-500 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Financial Allocation Metrics */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 rounded-lg border border-alamera-border bg-alamera-darkest p-3 sm:p-4 text-center">
          <div className="p-1">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
              Estimated Net Worth
            </div>
            <div className="mt-1 font-mono text-base sm:text-lg font-bold text-champagne-300">
              {client.netWorth}
            </div>
          </div>
          <div className="border-t sm:border-t-0 sm:border-x border-alamera-border pt-2 sm:pt-0 px-2">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
              Liquid Allocation
            </div>
            <div className="mt-1 font-mono text-base sm:text-lg font-bold text-emerald-400">
              {client.liquidAllocation}
            </div>
          </div>
          <div className="border-t sm:border-t-0 border-alamera-border pt-2 sm:pt-0 p-1">
            <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted">
              Total Acquisitions
            </div>
            <div className="mt-1 font-mono text-base sm:text-lg font-bold text-alamera-light">
              {client.totalAcquisitions}
            </div>
          </div>
        </div>

        {/* Advisory Notes */}
        <div className="mt-5 sm:mt-6">
          <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-champagne-200">
            Advisory Strategy & Brief
          </h4>
          <div className="mt-2 rounded-md border border-alamera-border bg-alamera-cardLight/70 p-3 sm:p-3.5 text-xs text-alamera-silver leading-relaxed">
            {client.notes}
          </div>
        </div>

        {/* Acquisition Mandate Preferences */}
        <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
          <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-champagne-200">
            Mandate Criteria & Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            <div className="rounded border border-alamera-border bg-alamera-darkest p-3">
              <span className="font-mono text-[10px] text-alamera-muted block">
                Target Districts
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {client.targetDistricts.map((d) => (
                  <span
                    key={d}
                    className="rounded bg-champagne-500/10 px-2 py-0.5 font-mono text-[10px] text-champagne-300 border border-champagne-500/20"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded border border-alamera-border bg-alamera-darkest p-3">
              <span className="font-mono text-[10px] text-alamera-muted block">
                Minimum Bedrooms & Privacy
              </span>
              <div className="mt-1 text-alamera-light font-medium">
                {client.preferences.minBedrooms}+ Suites • {client.preferences.confidentialityLevel}
              </div>
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] text-alamera-muted block mb-1.5">
              Mandatory Amenities & Specifications
            </span>
            <div className="flex flex-wrap gap-1.5">
              {client.preferences.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded border border-alamera-border bg-alamera-cardLight px-2 py-1 text-[11px] text-alamera-silver"
                >
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Verified Document Vault */}
        <div className="mt-5 sm:mt-6">
          <div className="flex items-center justify-between border-b border-alamera-border pb-2">
            <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-champagne-200">
              Compliance Vault
            </h4>
            <span className="font-mono text-[10px] text-emerald-400">DIFC Verified</span>
          </div>
          <div className="mt-3 space-y-2">
            {client.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded border border-alamera-border bg-alamera-darkest p-2.5 text-xs gap-2"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <FileText className="h-4 w-4 text-champagne-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-medium text-alamera-light truncate block">{doc.name}</span>
                    <span className="block font-mono text-[9px] sm:text-[10px] text-alamera-muted">
                      {doc.date} • {doc.type}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold flex-shrink-0 ${
                    doc.status === 'Verified'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action CTAs */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-alamera-border pt-4 sm:pt-5">
          <div className="text-xs font-mono text-alamera-muted text-center sm:text-left">
            Assigned: <strong className="text-champagne-300">{client.primaryAdvisor.split(' ')[0]}</strong>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                onClose();
                onBookViewingForClient(client);
              }}
              className="flex items-center justify-center space-x-1.5 rounded border border-champagne-500/40 bg-alamera-cardLight px-3.5 py-2 text-xs font-medium text-champagne-300 hover:border-champagne-500 hover:bg-champagne-500/10 transition touch-target"
            >
              <Sparkles className="h-3.5 w-3.5 text-champagne-400" />
              <span>Book VIP Transit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onCreateDealForClient(client);
              }}
              className="flex items-center justify-center space-x-1.5 rounded bg-gradient-to-r from-champagne-500 to-champagne-600 px-4 py-2 text-xs font-semibold text-alamera-darkest hover:from-champagne-400 hover:to-champagne-500 transition shadow-luxeGlow touch-target"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Execute Mandate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
