'use client';

import React from 'react';
import {
  CalendarCheck,
  Plane,
  Car,
  Ship,
  Building2,
  Clock,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { ViewingBooking } from '@/types/crm';

interface ConciergeViewProps {
  bookings: ViewingBooking[];
  onOpenBookingModal: () => void;
}

export const ConciergeView: React.FC<ConciergeViewProps> = ({
  bookings,
  onOpenBookingModal,
}) => {
  const getTransitIcon = (mode: string) => {
    if (mode.includes('Helicopter')) return Plane;
    if (mode.includes('Chauffeur')) return Car;
    if (mode.includes('Yacht')) return Ship;
    return Building2;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-alamera-border pb-4 sm:pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-champagne-100">
              VIP Viewings & Executive Transit Log
            </h2>
            <span className="rounded bg-champagne-500/10 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-champagne-400 border border-champagne-500/30">
              DCAA Cleared
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Coordination of private helicopter flight corridors, marine tenders, and security escorts for trophy asset inspections
          </p>
        </div>

        <button
          onClick={onOpenBookingModal}
          className="flex items-center justify-center space-x-2 rounded bg-gradient-to-r from-champagne-500 to-champagne-600 px-4 py-2 text-xs font-semibold text-alamera-darkest hover:from-champagne-400 hover:to-champagne-500 transition shadow-luxeGlow touch-target"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Book VIP Transit</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {bookings.map((booking) => {
          const TransitIcon = getTransitIcon(booking.transitMode);

          return (
            <div
              key={booking.id}
              className="flex flex-col justify-between rounded-lg border border-alamera-border bg-alamera-card p-4 sm:p-5 transition hover:border-champagne-500/50 hover:shadow-luxe"
            >
              <div>
                {/* Header Date & Status */}
                <div className="flex items-center justify-between border-b border-alamera-border/70 pb-2.5 sm:pb-3">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-mono text-champagne-300">
                    <CalendarCheck className="h-3.5 w-3.5 text-champagne-400 flex-shrink-0" />
                    <span>{booking.date}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 sm:px-2 py-0.5 font-mono text-[9px] font-semibold ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Timing & Transit Mode */}
                <div className="mt-3 sm:mt-3.5 flex items-center space-x-2.5 rounded border border-alamera-border bg-alamera-darkest p-2.5 sm:p-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded border border-champagne-500/30 bg-alamera-card text-champagne-400 flex-shrink-0">
                    <TransitIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-sans text-xs font-semibold text-alamera-light truncate">
                      {booking.transitMode}
                    </div>
                    <div className="font-mono text-[10px] text-alamera-muted flex items-center space-x-1 mt-0.5 truncate">
                      <Clock className="h-3 w-3 text-champagne-500 flex-shrink-0" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                </div>

                {/* Destination & Principal */}
                <div className="mt-3.5 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs">
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">
                      Asset Destination
                    </span>
                    <span className="font-serif text-xs sm:text-sm font-semibold text-champagne-200 truncate block">
                      {booking.propertyTitle}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">
                      Principal Investor
                    </span>
                    <span className="font-medium text-alamera-silver truncate block">
                      {booking.clientName}
                    </span>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="mt-3 rounded border border-alamera-border/60 bg-alamera-cardLight/50 p-2 sm:p-2.5 text-[11px] text-alamera-muted">
                    <strong className="text-champagne-400 font-medium block mb-0.5">
                      Concierge Directive:
                    </strong>
                    <span className="line-clamp-2">{booking.specialRequests}</span>
                  </div>
                )}
              </div>

              {/* Footer Host & Security */}
              <div className="mt-4 sm:mt-5 border-t border-alamera-border pt-2.5 sm:pt-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-alamera-muted truncate pr-1">
                    Host: <strong className="text-alamera-silver">{booking.hostPartner.split(' ')[0]}</strong>
                  </span>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {booking.securityEscort && (
                      <span className="flex items-center space-x-1 text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span className="hidden sm:inline">Escort</span>
                      </span>
                    )}
                    {booking.ndaSigned && (
                      <span className="text-champagne-300">NDA</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
