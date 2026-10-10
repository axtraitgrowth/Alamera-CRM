'use client';

import React, { useState } from 'react';
import {
  Search,
  Box,
  Eye,
  Building,
  CheckCircle2,
  Calendar,
  FileText,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { Property } from '@/types/crm';
import { PropertyDetailModal } from './PropertyDetailModal';

interface PropertyCatalogProps {
  properties: Property[];
  onScheduleViewing: (property: Property) => void;
  onDraftMandate: (property: Property) => void;
  onOpen3DViewer: () => void;
  activeWatermark: boolean;
}

export const PropertyCatalog: React.FC<PropertyCatalogProps> = ({
  properties,
  onScheduleViewing,
  onDraftMandate,
  onOpen3DViewer,
  activeWatermark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedDeveloper, setSelectedDeveloper] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.developer && p.developer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict = selectedDistrict === 'all' || p.district === selectedDistrict;
    const matchesDeveloper =
      selectedDeveloper === 'all' ||
      (p.developer && p.developer.toLowerCase().includes(selectedDeveloper.toLowerCase()));

    return matchesSearch && matchesDistrict && matchesDeveloper;
  });

  const handleOpenDetail = (p: Property) => {
    setSelectedProperty(p);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-alamera-border pb-4 sm:pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Trophy Off-Market & Ready Portfolio
            </h2>
            <span className="rounded bg-alamera-red/15 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold text-alamera-red border border-alamera-red/30">
              Discretion Mandates • RERA Registered
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Institutional portfolio of private beachfront compounds, skyline penthouses, and branded residences with verified Dubai Land Department permits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpen3DViewer}
            className="flex items-center justify-center space-x-2 rounded border border-alamera-red bg-alamera-red px-3.5 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-alamera-redDark transition shadow-alameraRed touch-target w-full sm:w-auto"
          >
            <Box className="h-3.5 w-3.5" />
            <span>Open 3D Spatial Studio</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-alamera-border bg-alamera-card p-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:space-x-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-alamera-muted" />
            <input
              type="text"
              placeholder="Search by code, title, developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-alamera-border bg-alamera-darkest pl-8 pr-3 py-2 sm:py-1.5 text-xs text-white focus:border-alamera-red focus:outline-none"
            />
          </div>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded border border-alamera-border bg-alamera-darkest px-3 py-2 sm:py-1.5 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="all">All Prime Districts</option>
            <option value="Palm Jumeirah">Palm Jumeirah</option>
            <option value="Emirates Hills">Emirates Hills</option>
            <option value="Dubai Water Canal">Dubai Water Canal</option>
            <option value="Jumeirah Bay Island">Jumeirah Bay Island</option>
            <option value="Downtown Dubai">Downtown Dubai</option>
            <option value="Mohammed Bin Rashid City">MBR City</option>
          </select>

          {/* Developer Filter */}
          <select
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            className="rounded border border-alamera-border bg-alamera-darkest px-3 py-2 sm:py-1.5 text-xs text-alamera-silver focus:border-alamera-red focus:outline-none"
          >
            <option value="all">All Developers</option>
            <option value="Emaar">Emaar Properties</option>
            <option value="Nakheel">Nakheel</option>
            <option value="Meraas">Meraas</option>
            <option value="Sobha">Sobha Realty</option>
            <option value="Sankari">Sankari</option>
          </select>
        </div>

        <div className="font-mono text-[11px] sm:text-xs text-alamera-muted text-right sm:text-left">
          Showing <strong className="text-white">{filteredProperties.length}</strong> Trophy Assets
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-alamera-border bg-alamera-card transition hover:border-alamera-red/40 hover:shadow-alameraCard"
          >
            {/* Image Header with Watermark */}
            <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
              <img
                src={property.heroImage}
                alt={property.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Watermark overlay if active */}
              {activeWatermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bg-black/15 overflow-hidden">
                  <div className="rotate-[-18deg] border-2 border-alamera-red/40 px-4 sm:px-6 py-1.5 sm:py-2 text-center backdrop-blur-[1px] bg-black/30">
                    <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-white">
                      CONFIDENTIAL • ALAMERA REAL ESTATE LLC
                    </span>
                  </div>
                </div>
              )}

              {/* Top Badges */}
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 rounded bg-alamera-black/90 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-semibold text-white backdrop-blur-md border border-alamera-border">
                {property.district}
              </div>

              <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 rounded bg-emerald-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 font-mono text-[9px] sm:text-[10px] font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                {property.status}
              </div>

              {/* Price Banner */}
              <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between rounded bg-alamera-black/90 px-2.5 sm:px-3.5 py-1.5 sm:py-2 backdrop-blur-md border border-alamera-border">
                <div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">
                    Asking Valuation (AED)
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                    {property.formattedPrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted block">
                    Brokerage Fee (2%)
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs font-semibold text-emerald-400">
                    {property.projectedCommission}
                  </span>
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[9px] sm:text-[10px] text-alamera-red font-semibold">
                      {property.code}
                    </span>
                    <span className="font-mono text-[9px] text-alamera-muted">
                      {property.permitNumber}
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-alamera-red transition line-clamp-1 mt-0.5">
                    {property.title}
                  </h3>
                </div>
              </div>

              <p className="mt-1 font-sans text-xs text-alamera-muted line-clamp-2 leading-relaxed">
                {property.subtitle}
              </p>

              {/* Developer & Portal Syndication Badges */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                <span className="rounded bg-alamera-darkest px-2 py-0.5 text-alamera-silver border border-alamera-border">
                  Dev: {property.developer}
                </span>

                {property.portalSyndication?.propertyFinder && (
                  <span className="rounded bg-red-950/40 text-red-300 border border-red-500/20 px-1.5 py-0.5">
                    Property Finder
                  </span>
                )}
                {property.portalSyndication?.bayut && (
                  <span className="rounded bg-green-950/40 text-green-300 border border-green-500/20 px-1.5 py-0.5">
                    Bayut
                  </span>
                )}
                {property.portalSyndication?.dubizzle && (
                  <span className="rounded bg-red-900/30 text-rose-300 border border-rose-500/20 px-1.5 py-0.5">
                    Dubizzle
                  </span>
                )}
                {property.portalSyndication?.alameraWeb && (
                  <span className="rounded bg-blue-950/40 text-blue-300 border border-blue-500/20 px-1.5 py-0.5">
                    Alamera Web
                  </span>
                )}
              </div>

              {/* Specs Pills */}
              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-alamera-border/60 pt-3 text-center font-mono text-[10px] sm:text-[11px]">
                <div className="rounded border border-alamera-border bg-alamera-darkest p-1.5">
                  <span className="text-[8px] sm:text-[9px] text-alamera-muted block">Built-Up Area</span>
                  <span className="font-semibold text-white truncate block">
                    {property.specs.builtUpArea}
                  </span>
                </div>
                <div className="rounded border border-alamera-border bg-alamera-darkest p-1.5">
                  <span className="text-[8px] sm:text-[9px] text-alamera-muted block">Suites</span>
                  <span className="font-semibold text-alamera-red truncate block">
                    {property.specs.bedrooms} Beds
                  </span>
                </div>
                <div className="rounded border border-alamera-border bg-alamera-darkest p-1.5">
                  <span className="text-[8px] sm:text-[9px] text-alamera-muted block">Garage</span>
                  <span className="font-semibold text-white truncate block">
                    {property.specs.parkingSpaces} Bays
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-alamera-border pt-3">
                {property.has3DModel ? (
                  <button
                    onClick={onOpen3DViewer}
                    className="flex items-center space-x-1 font-mono text-[11px] sm:text-xs text-alamera-red hover:underline transition touch-target"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span>3D Spatial Model</span>
                  </button>
                ) : (
                  <span className="font-mono text-[9px] sm:text-[10px] text-alamera-muted">
                    NDA Mandatory
                  </span>
                )}

                <button
                  onClick={() => handleOpenDetail(property)}
                  className="flex items-center space-x-1 rounded border border-alamera-border bg-alamera-cardLight px-3 py-1.5 font-mono text-xs font-medium text-white hover:border-alamera-red transition touch-target"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Asset Dossier</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onScheduleViewing={onScheduleViewing}
        onDraftMandate={onDraftMandate}
        onOpen3DViewer={onOpen3DViewer}
      />
    </div>
  );
};
