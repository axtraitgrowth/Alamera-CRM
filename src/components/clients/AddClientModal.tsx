'use client';

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Client } from '@/types/crm';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  onClose,
  onAddClient,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [entity, setEntity] = useState('');
  const [nationality, setNationality] = useState('Switzerland');
  const [residence, setResidence] = useState('Zurich & Dubai');
  const [netWorth, setNetWorth] = useState('$750M');
  const [liquidAllocation, setLiquidAllocation] = useState('$80M');
  const [primaryAdvisor, setLeadAdvisor] = useState('Elena Rostova');
  const [targetDistricts, setTargetDistricts] = useState('Palm Jumeirah, Jumeirah Bay Island');
  const [notes, setNotes] = useState('');
  const [kycStatus, setKycStatus] = useState<'Tier 1 Verified' | 'Tier 2 Under Review'>('Tier 1 Verified');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const districts = targetDistricts.split(',').map((s) => s.trim()).filter(Boolean);

    const newClient: Client = {
      id: `cl-${Date.now()}`,
      name: name.trim(),
      title: title.trim() || 'Principal Investor',
      entity: entity.trim() || 'Private Family Office',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      nationality: nationality.trim(),
      residence: residence.trim(),
      netWorth: netWorth.startsWith('$') ? netWorth : `$${netWorth}`,
      liquidAllocation: liquidAllocation.startsWith('$') ? liquidAllocation : `$${liquidAllocation}`,
      kycStatus: kycStatus,
      status: 'Active Mandate',
      primaryAdvisor: primaryAdvisor,
      targetDistricts: districts.length > 0 ? districts : ['Palm Jumeirah', 'Emirates Hills'],
      preferences: {
        propertyTypes: ['Beachfront Villa', 'Sky Penthouse'],
        minBedrooms: 5,
        amenities: ['Private Beach', 'Superyacht Berth', 'Cinema'],
        confidentialityLevel: 'Strict Non-Disclosure',
      },
      activeDealsCount: 0,
      totalAcquisitions: '$0',
      lastContact: 'Just now',
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@familyoffice.com`,
      phone: '+971 4 000 0000',
      notes: notes.trim() || 'High-priority institutional client onboarded through private advisory network.',
      documents: [
        {
          name: 'Tier 1 Certified Proof of Funds Verification',
          type: 'PDF',
          date: 'Today',
          status: 'Verified',
        },
        {
          name: 'Alamera Bilateral Non-Disclosure Agreement',
          type: 'PDF',
          date: 'Today',
          status: 'Verified',
        },
      ],
    };

    onAddClient(newClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm safe-top safe-bottom">
      <div className="w-full max-w-lg rounded-lg border border-champagne-500/40 bg-alamera-card p-4 sm:p-6 shadow-luxe max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-champagne-500/40 bg-alamera-cardLight text-champagne-400 flex-shrink-0">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-champagne-100">
                Onboard UHNW Client Mandate
              </h3>
              <p className="font-sans text-[11px] sm:text-xs text-alamera-muted">
                Register private principal under strict advisory confidentiality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1.5 text-alamera-muted hover:bg-alamera-cardLight hover:text-alamera-silver touch-target flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Client Full Name / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Baron Philippe de Rothschild"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Principal Role
              </label>
              <input
                type="text"
                placeholder="e.g. Managing Trustee"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Holding Entity
              </label>
              <input
                type="text"
                placeholder="e.g. Rothschild Heritage Geneva"
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Primary Residence
              </label>
              <input
                type="text"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Estimated Net Worth
              </label>
              <input
                type="text"
                value={netWorth}
                onChange={(e) => setNetWorth(e.target.value)}
                placeholder="$750M"
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs font-mono text-champagne-300 focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Liquid Allocation (Ready)
              </label>
              <input
                type="text"
                value={liquidAllocation}
                onChange={(e) => setLiquidAllocation(e.target.value)}
                placeholder="$80M"
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs font-mono text-emerald-400 focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Target Districts (comma separated)
            </label>
            <input
              type="text"
              value={targetDistricts}
              onChange={(e) => setTargetDistricts(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Assigned Lead Partner
              </label>
              <select
                value={primaryAdvisor}
                onChange={(e) => setLeadAdvisor(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              >
                <option value="Elena Rostova">Elena Rostova (Partner)</option>
                <option value="Tariq Al-Mansoor">Tariq Al-Mansoor (Senior Partner)</option>
                <option value="Julian Thorne">Julian Thorne (Executive Broker)</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Compliance KYC Status
              </label>
              <select
                value={kycStatus}
                onChange={(e) =>
                  setKycStatus(e.target.value as 'Tier 1 Verified' | 'Tier 2 Under Review')
                }
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              >
                <option value="Tier 1 Verified">Tier 1 Verified (Immediate)</option>
                <option value="Tier 2 Under Review">Tier 2 Under Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Advisory Brief / Initial Requirements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Seeking turnkey waterfront mansion with private superyacht slip. Prioritizing immediate Q4 escrow."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            />
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-alamera-border px-4 py-2 text-xs font-medium text-alamera-muted hover:bg-alamera-cardLight hover:text-alamera-silver touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-gradient-to-r from-champagne-500 to-champagne-600 px-5 py-2 text-xs font-semibold text-alamera-darkest hover:from-champagne-400 hover:to-champagne-500 shadow-luxeGlow touch-target"
            >
              Onboard Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
