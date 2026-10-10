'use client';

import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Client, Property, Deal, StageType } from '@/types/crm';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  properties: Property[];
  onCreateDeal: (deal: Deal) => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose,
  clients,
  properties,
  onCreateDeal,
}) => {
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [valuation, setValuation] = useState('75000000');
  const [targetClosing, setTargetClosing] = useState('2026-12-15');
  const [leadAdvisor, setLeadAdvisor] = useState('Elena Rostova');
  const [paymentStructure, setPaymentStructure] = useState<'Cash Wire' | 'Escrow Tranche' | 'Sovereign Guarantee'>('Escrow Tranche');
  const [stage, setStage] = useState<StageType>('Mandate Signed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];
    const valNum = parseFloat(valuation) || 50000000;

    const newDeal: Deal = {
      id: `dl-${Date.now()}`,
      dealCode: `ALM-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${property.title} | Acquisition Mandate`,
      clientId: client.id,
      clientName: client.name,
      clientEntity: client.entity,
      propertyId: property.id,
      propertyTitle: property.title,
      district: property.district,
      valuation: valNum,
      formattedValuation: `$${(valNum).toLocaleString()}`,
      projectedCommission: `$${(valNum * 0.02).toLocaleString()} (2.0%)`,
      stage: stage,
      stageProgress: stage === 'Mandate Signed' ? 20 : stage === 'Private Viewing' ? 40 : stage === 'LOI Submitted' ? 60 : 80,
      probability: 50,
      targetClosing: targetClosing,
      leadAdvisor: leadAdvisor,
      health: 'High Momentum',
      lastMilestone: 'Bilateral advisory representation mandate executed',
      paymentStructure: paymentStructure,
    };

    onCreateDeal(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm safe-top safe-bottom">
      <div className="w-full max-w-lg rounded-lg border border-champagne-500/40 bg-alamera-card p-4 sm:p-6 shadow-luxe max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-champagne-500/40 bg-alamera-cardLight text-champagne-400 flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-champagne-100">
                Execute New Advisory Mandate
              </h3>
              <p className="font-sans text-[11px] sm:text-xs text-alamera-muted">
                Create institutional acquisition deal with DLD escrow tracking
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
          {/* Client Selection */}
          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              UHNW Client / Family Office
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.entity}
                </option>
              ))}
            </select>
          </div>

          {/* Property Selection */}
          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Trophy Asset / Off-Market Mandate
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => {
                setSelectedPropertyId(e.target.value);
                const prop = properties.find((p) => p.id === e.target.value);
                if (prop) setValuation(prop.price.toString());
              }}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.formattedPrice}) — {p.district}
                </option>
              ))}
            </select>
          </div>

          {/* Valuation & Closing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Valuation Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-alamera-muted">$</span>
                <input
                  type="number"
                  required
                  value={valuation}
                  onChange={(e) => setValuation(e.target.value)}
                  className="w-full rounded border border-alamera-border bg-alamera-darkest pl-7 pr-3 py-2 text-xs font-mono text-champagne-300 focus:border-champagne-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Target Closing Date
              </label>
              <input
                type="date"
                required
                value={targetClosing}
                onChange={(e) => setTargetClosing(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs font-mono text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lead Advisor & Payment Structure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Lead Advisory Partner
              </label>
              <select
                value={leadAdvisor}
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
                Payment Channel
              </label>
              <select
                value={paymentStructure}
                onChange={(e) =>
                  setPaymentStructure(e.target.value as 'Cash Wire' | 'Escrow Tranche' | 'Sovereign Guarantee')
                }
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              >
                <option value="Escrow Tranche">Escrow Tranche (Standard)</option>
                <option value="Cash Wire">Direct Central Bank Wire</option>
                <option value="Sovereign Guarantee">Sovereign Letter of Guarantee</option>
              </select>
            </div>
          </div>

          {/* Commission Calculation Preview */}
          <div className="rounded border border-champagne-500/20 bg-champagne-500/5 p-3 flex items-center justify-between">
            <span className="font-mono text-xs text-alamera-muted">Projected Commission (2.0%):</span>
            <span className="font-mono text-xs font-semibold text-champagne-300">
              ${((parseFloat(valuation) || 0) * 0.02).toLocaleString()}
            </span>
          </div>

          {/* Actions */}
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
              Execute Mandate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
