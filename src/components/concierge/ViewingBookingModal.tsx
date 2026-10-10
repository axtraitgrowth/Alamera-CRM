'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Plane,
  Car,
  Ship,
  Building2,
} from 'lucide-react';
import { Client, Property, ViewingBooking } from '@/types/crm';

interface ViewingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  properties: Property[];
  preSelectedClient?: Client | null;
  preSelectedProperty?: Property | null;
  onConfirmBooking: (booking: ViewingBooking) => void;
}

export const ViewingBookingModal: React.FC<ViewingBookingModalProps> = ({
  isOpen,
  onClose,
  clients,
  properties,
  preSelectedClient,
  preSelectedProperty,
  onConfirmBooking,
}) => {
  const [selectedClientId, setSelectedClientId] = useState(
    preSelectedClient?.id || clients[0]?.id || ''
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    preSelectedProperty?.id || properties[0]?.id || ''
  );
  const [date, setDate] = useState('2026-10-18');
  const [time, setTime] = useState('17:00 (Golden Hour Sunset)');
  const [transitMode, setTransitMode] = useState<
    | 'Private Chauffeur (Rolls-Royce Cullinan)'
    | 'Helicopter Transfer (Bell 429)'
    | 'Private Yacht Tender'
    | 'Direct Arrival'
  >('Helicopter Transfer (Bell 429)');
  const [securityEscort, setSecurityEscort] = useState(true);
  const [ndaSigned, setNdaSigned] = useState(true);
  const [specialRequests, setSpecialRequests] = useState(
    'Champagne service on departure. Lead structural architect on site for private briefing.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];

    const newBooking: ViewingBooking = {
      id: `bk-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      propertyId: property.id,
      propertyTitle: property.title,
      date: date,
      time: time,
      transitMode: transitMode,
      securityEscort: securityEscort,
      ndaSigned: ndaSigned,
      status: 'Confirmed',
      specialRequests: specialRequests,
      hostPartner: client.primaryAdvisor,
    };

    onConfirmBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm safe-top safe-bottom">
      <div className="w-full max-w-lg rounded-lg border border-champagne-500/40 bg-alamera-card p-4 sm:p-6 shadow-luxe max-h-[96vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-champagne-500/40 bg-alamera-cardLight text-champagne-400 flex-shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-champagne-100">
                Book VIP Showing & Transit
              </h3>
              <p className="font-sans text-[11px] sm:text-xs text-alamera-muted">
                Executive concierge coordination with security clearance
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
              Principal / Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.entity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Property Destination
            </label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.district}) — {p.formattedPrice}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Inspection Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs font-mono text-alamera-light focus:border-champagne-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
                Preferred Timing
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded border border-alamera-border bg-alamera-darkest px-3 py-2 text-xs text-alamera-light focus:border-champagne-500 focus:outline-none"
              >
                <option value="17:00 (Golden Hour Sunset)">17:00 (Golden Hour Sunset)</option>
                <option value="11:00 AM (Daylight Architecture)">11:00 AM (Daylight Architecture)</option>
                <option value="20:00 (Evening Illumination)">20:00 (Evening Illumination)</option>
                <option value="14:00 (Midday Comprehensive)">14:00 (Midday Comprehensive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              VIP Transit Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Helicopter Transfer (Bell 429)', icon: Plane },
                { label: 'Private Chauffeur (Rolls-Royce Cullinan)', icon: Car },
                { label: 'Private Yacht Tender', icon: Ship },
                { label: 'Direct Arrival', icon: Building2 },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = transitMode === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setTransitMode(item.label as any)}
                    className={`flex items-center space-x-2 rounded border p-2.5 text-left transition touch-target ${
                      isSelected
                        ? 'border-champagne-500 bg-champagne-500/15 text-champagne-200'
                        : 'border-alamera-border bg-alamera-darkest text-alamera-muted hover:text-alamera-silver'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-champagne-400 flex-shrink-0" />
                    <span className="font-sans text-[11px]">{item.label.split('(')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 border-t border-alamera-border/60 pt-2.5">
            <label className="flex items-center space-x-2 text-xs text-alamera-silver cursor-pointer touch-target">
              <input
                type="checkbox"
                checked={securityEscort}
                onChange={(e) => setSecurityEscort(e.target.checked)}
                className="rounded border-alamera-border bg-alamera-darkest text-champagne-500 focus:ring-0 h-4 w-4"
              />
              <span>Deploy Private Tactical Security Escort</span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-alamera-silver cursor-pointer touch-target">
              <input
                type="checkbox"
                checked={ndaSigned}
                onChange={(e) => setNdaSigned(e.target.checked)}
                className="rounded border-alamera-border bg-alamera-darkest text-champagne-500 focus:ring-0 h-4 w-4"
              />
              <span>Verify Bilateral Non-Disclosure Clearance</span>
            </label>
          </div>

          <div>
            <label className="block font-mono text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-alamera-muted mb-1">
              Concierge Catering & Directives
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
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
              Confirm VIP Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
