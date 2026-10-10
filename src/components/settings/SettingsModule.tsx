'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Key,
  Users,
  CheckCircle2,
  Save,
  Lock,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface SettingsModuleProps {
  onSaveSettings: () => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState({
    companyName: 'Alamera Real Estate LLC',
    tradeLicense: 'DLD-LIC-672901',
    reraOrn: 'ORN-28419',
    officeAddress: 'Suite 3402, Al Saaha Offices, Downtown Dubai, United Arab Emirates',
    officialEmail: 'advisory@alameraproperties.com',
    supportPhone: '+971 4 812 9900',
    defaultSalesCommission: '2.0',
    defaultLeaseCommission: '5.0',
    vatTrn: '10049281900003',
    escrowAutoNotify: true,
    strictNdaEnforcement: true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              Corporate Governance & Compliance
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              RERA ORN #28419 Verified
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Brokerage Settings & RERA Credentials
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Configure institutional brokerage details, Dubai Land Department licensing credentials, and platform security policies.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-4 py-2.5 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center space-x-2 text-emerald-400 text-xs font-mono">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>Brokerage configuration and compliance settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Corporate Profile */}
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-alamera-border pb-3">
            <Building className="h-4 w-4 text-alamera-red" />
            <h3 className="font-serif text-sm font-semibold text-white">
              Alamera Corporate Registration Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                Corporate Entity Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                RERA Office Registration Number (ORN)
              </label>
              <input
                type="text"
                value={formData.reraOrn}
                onChange={(e) => setFormData({ ...formData, reraOrn: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                DLD Commercial Trade License
              </label>
              <input
                type="text"
                value={formData.tradeLicense}
                onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                UAE Federal Tax Authority TRN
              </label>
              <input
                type="text"
                value={formData.vatTrn}
                onChange={(e) => setFormData({ ...formData, vatTrn: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
              Registered Headquarters Address
            </label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
            />
          </div>
        </div>

        {/* Card 2: Commission & Escrow Governance */}
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-alamera-border pb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="font-serif text-sm font-semibold text-white">
              Commission Rates & Escrow Automation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                Standard Sales Commission Rate (%)
              </label>
              <input
                type="text"
                value={formData.defaultSalesCommission}
                onChange={(e) => setFormData({ ...formData, defaultSalesCommission: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
              <span className="text-[10px] font-sans text-alamera-muted mt-1 block">
                Standard Dubai brokerage fee applied to executed Form F agreements.
              </span>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-alamera-muted mb-1">
                Standard Leasing Fee (%)
              </label>
              <input
                type="text"
                value={formData.defaultLeaseCommission}
                onChange={(e) => setFormData({ ...formData, defaultLeaseCommission: e.target.value })}
                className="w-full rounded bg-alamera-darkest border border-alamera-border px-3 py-2 text-xs text-white focus:border-alamera-red focus:outline-none"
              />
              <span className="text-[10px] font-sans text-alamera-muted mt-1 block">
                Applied to annual rental and luxury short-stay contracts.
              </span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.escrowAutoNotify}
                onChange={(e) => setFormData({ ...formData, escrowAutoNotify: e.target.checked })}
                className="rounded border-alamera-border text-alamera-red focus:ring-0"
              />
              <span className="text-xs font-sans text-alamera-silver">
                Send automatic WhatsApp confirmation to principal upon DLD Escrow deposit verification.
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.strictNdaEnforcement}
                onChange={(e) => setFormData({ ...formData, strictNdaEnforcement: e.target.checked })}
                className="rounded border-alamera-border text-alamera-red focus:ring-0"
              />
              <span className="text-xs font-sans text-alamera-silver">
                Require signed NDA before revealing off-market villa coordinates and seller identity.
              </span>
            </label>
          </div>
        </div>

        {/* Card 3: Advisory Roles & Permissions */}
        <div className="rounded-lg border border-alamera-border bg-alamera-card p-5 space-y-3">
          <div className="flex items-center space-x-2 border-b border-alamera-border pb-3">
            <Lock className="h-4 w-4 text-amber-400" />
            <h3 className="font-serif text-sm font-semibold text-white">
              Advisory Role & Access Control Matrix
            </h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded bg-alamera-darkest border border-alamera-border/60">
              <div>
                <span className="text-white font-bold">Managing Director / Senior Partner</span>
                <span className="text-alamera-muted block text-[10px]">Full Access: Escrow, financials, commissions, all deals</span>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-400">Super Admin</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-alamera-darkest border border-alamera-border/60">
              <div>
                <span className="text-white font-bold">Licensed Broker (BRN)</span>
                <span className="text-alamera-muted block text-[10px]">Own leads, assigned mandates, viewing logistics</span>
              </div>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[9px] text-blue-400">Broker Tier</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-alamera-darkest border border-alamera-border/60">
              <div>
                <span className="text-white font-bold">Compliance & Concierge Officer</span>
                <span className="text-alamera-muted block text-[10px]">KYC verification, transit logistics, NDA validation</span>
              </div>
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[9px] text-amber-400">Operations</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
