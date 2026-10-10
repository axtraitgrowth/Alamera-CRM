'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CalendarCheck,
  Box,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { Client, Deal, Property } from '@/types/crm';
import { NavTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  deals: Deal[];
  properties: Property[];
  onNavigateTab: (tab: NavTab) => void;
  onOpenNewDeal: () => void;
  onOpenBooking: () => void;
  onOpen3DViewer: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  clients,
  deals,
  properties,
  onNavigateTab,
  onOpenNewDeal,
  onOpenBooking,
  onOpen3DViewer,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.entity.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.dealCode.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.district.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 p-2 sm:p-4 pt-12 sm:pt-20 backdrop-blur-md safe-top">
      <div className="w-full max-w-xl rounded-lg border border-champagne-500/40 bg-alamera-card p-3 sm:p-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-alamera-border pb-2.5 sm:pb-3 flex-shrink-0">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-champagne-400 mr-2.5 sm:mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search clients, properties, deals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-alamera-light placeholder-alamera-muted focus:outline-none font-sans"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="rounded p-1 text-alamera-muted hover:text-alamera-silver touch-target flex items-center justify-center flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="mt-3 overflow-y-auto space-y-3 sm:space-y-4 pr-1 text-xs flex-1">
          {/* Quick Actions */}
          <div>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted px-2">
              Quick Actions
            </span>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenNewDeal();
                }}
                className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Plus className="h-4 w-4 text-champagne-400 flex-shrink-0" />
                  <span className="truncate">Execute New Advisory Mandate</span>
                </div>
                <span className="font-mono text-[10px] text-alamera-muted flex-shrink-0">Action</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <CalendarCheck className="h-4 w-4 text-champagne-400 flex-shrink-0" />
                  <span className="truncate">Schedule VIP Inspection & Transit</span>
                </div>
                <span className="font-mono text-[10px] text-alamera-muted flex-shrink-0">Action</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpen3DViewer();
                }}
                className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Box className="h-4 w-4 text-champagne-400 flex-shrink-0" />
                  <span className="truncate">Open 3D Spatial Architectural Studio</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400 flex-shrink-0">3D</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('admin');
                }}
                className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <ShieldAlert className="h-4 w-4 text-alamera-red flex-shrink-0" />
                  <span className="truncate">Admin Governance & Security Suite</span>
                </div>
                <span className="font-mono text-[10px] text-alamera-red flex-shrink-0">RBAC</span>
              </button>
            </div>
          </div>

          {/* Deals */}
          {filteredDeals.length > 0 && (
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted px-2">
                Active Deals & Mandates ({filteredDeals.length})
              </span>
              <div className="mt-1 space-y-1">
                {filteredDeals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => {
                      onClose();
                      onNavigateTab('pipeline');
                    }}
                    className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-alamera-light truncate">{deal.title}</div>
                      <div className="font-mono text-[10px] text-alamera-muted truncate">
                        {deal.dealCode} • {deal.stage}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-champagne-400 flex-shrink-0">
                      {deal.formattedValuation}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted px-2">
                UHNW Clients ({filteredClients.length})
              </span>
              <div className="mt-1 space-y-1">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      onClose();
                      onNavigateTab('clients');
                    }}
                    className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-alamera-light truncate">{client.name}</div>
                      <div className="text-[11px] text-alamera-muted truncate">{client.entity}</div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 flex-shrink-0">
                      {client.netWorth}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Properties */}
          {filteredProperties.length > 0 && (
            <div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-alamera-muted px-2">
                Off-Market Trophy Assets ({filteredProperties.length})
              </span>
              <div className="mt-1 space-y-1">
                {filteredProperties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onNavigateTab('properties');
                    }}
                    className="flex w-full items-center justify-between rounded p-2 text-left hover:bg-alamera-darkest hover:text-champagne-300 transition touch-target gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-alamera-light truncate">{p.title}</div>
                      <div className="text-[11px] text-alamera-muted truncate">{p.district}</div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-champagne-400 flex-shrink-0">
                      {p.formattedPrice}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-alamera-border pt-2 text-[9px] sm:text-[10px] font-mono text-alamera-muted flex-shrink-0">
          <span>Tap item or ESC to close</span>
          <span className="hidden sm:inline">Shortcut: ⌘K</span>
        </div>
      </div>
    </div>
  );
};
