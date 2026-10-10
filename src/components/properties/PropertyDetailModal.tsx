'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  Box,
  Sparkles,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { Property } from '@/types/crm';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleViewing: (property: Property) => void;
  onDraftMandate: (property: Property) => void;
  onOpen3DViewer: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onScheduleViewing,
  onDraftMandate,
  onOpen3DViewer,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !property) return null;

  const allImages = [property.heroImage, ...(property.gallery || [])];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md safe-top safe-bottom">
      <div className="w-full max-w-4xl max-h-[96vh] sm:max-h-[92vh] overflow-y-auto rounded-lg border border-champagne-500/40 bg-alamera-card p-4 sm:p-6 shadow-luxe">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-alamera-border pb-3 sm:pb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="rounded bg-champagne-500/15 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold text-champagne-300 border border-champagne-500/30">
              OFF-MARKET ASSET DOSSIER
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-alamera-muted">Ref: {property.code}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1.5 text-alamera-muted hover:bg-alamera-cardLight hover:text-alamera-silver touch-target flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Gallery */}
        <div className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
          <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 w-full overflow-hidden rounded-lg border border-alamera-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[activeImageIndex]}
              alt={property.title}
              className="h-full w-full object-cover transition duration-300"
            />
            <div className="absolute top-3 left-3 rounded bg-alamera-darkest/90 px-2.5 py-1 font-mono text-[10px] sm:text-xs text-champagne-300 backdrop-blur-md border border-alamera-border">
              {property.district}
            </div>
            <div className="absolute top-3 right-3 rounded bg-emerald-500/20 px-2.5 py-1 font-mono text-[10px] sm:text-xs font-semibold text-emerald-400 backdrop-blur-md border border-emerald-500/30">
              {property.status}
            </div>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-md bg-alamera-darkest/90 p-2.5 sm:p-3 backdrop-blur-md border border-alamera-border gap-1 sm:gap-2">
              <div className="min-w-0">
                <h3 className="font-serif text-sm sm:text-lg font-bold text-champagne-100 truncate">
                  {property.title}
                </h3>
                <p className="font-sans text-[11px] sm:text-xs text-alamera-muted line-clamp-1">
                  {property.subtitle}
                </p>
              </div>
              <div className="text-left sm:text-right font-mono flex sm:flex-col justify-between items-baseline sm:items-end flex-shrink-0">
                <div className="text-sm sm:text-lg font-bold text-champagne-300">
                  {property.formattedPrice}
                </div>
                <div className="text-[9px] sm:text-[10px] text-emerald-400">
                  Comm: {property.projectedCommission}
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                className={`relative h-14 w-20 sm:h-16 sm:w-24 flex-shrink-0 overflow-hidden rounded border transition touch-target ${
                  activeImageIndex === idx
                    ? 'border-champagne-400 ring-2 ring-champagne-500/30'
                    : 'border-alamera-border opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Thumb" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center font-mono">
          <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 sm:p-3">
            <span className="text-[9px] sm:text-[10px] uppercase text-alamera-muted block">Built-Up Area</span>
            <span className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-alamera-light">
              {property.specs.builtUpArea}
            </span>
          </div>
          <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 sm:p-3">
            <span className="text-[9px] sm:text-[10px] uppercase text-alamera-muted block">Suites</span>
            <span className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-champagne-300">
              {property.specs.bedrooms} Luxury Suites
            </span>
          </div>
          <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 sm:p-3">
            <span className="text-[9px] sm:text-[10px] uppercase text-alamera-muted block">Bathrooms</span>
            <span className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-alamera-light">
              {property.specs.bathrooms} Marble Baths
            </span>
          </div>
          <div className="rounded border border-alamera-border bg-alamera-darkest p-2.5 sm:p-3">
            <span className="text-[9px] sm:text-[10px] uppercase text-alamera-muted block">Garage</span>
            <span className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-champagne-300">
              {property.specs.parkingSpaces} Climate Bays
            </span>
          </div>
        </div>

        {/* Architectural Features */}
        <div className="mt-4 sm:mt-6">
          <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-champagne-200 mb-2 sm:mb-3">
            Architectural Highlights
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {property.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 rounded border border-alamera-border bg-alamera-cardLight/60 p-2 sm:p-2.5 text-alamera-silver"
              >
                <Check className="h-3.5 w-3.5 text-champagne-400 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-alamera-border pt-4 sm:pt-5">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-alamera-muted font-mono justify-center sm:justify-start">
            <ShieldAlert className="h-4 w-4 text-champagne-400 flex-shrink-0" />
            <span>Strict NDA Clearance Required</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {property.has3DModel && (
              <button
                onClick={() => {
                  onClose();
                  onOpen3DViewer();
                }}
                className="flex items-center justify-center space-x-1.5 rounded border border-champagne-500/40 bg-champagne-500/10 px-3.5 py-2 text-xs font-medium text-champagne-300 hover:bg-champagne-500 hover:text-alamera-darkest transition touch-target"
              >
                <Box className="h-3.5 w-3.5" />
                <span>Launch 3D Explorer</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onScheduleViewing(property);
              }}
              className="flex items-center justify-center space-x-1.5 rounded border border-champagne-500/40 bg-alamera-cardLight px-3.5 py-2 text-xs font-medium text-champagne-300 hover:bg-champagne-500/20 transition touch-target"
            >
              <Sparkles className="h-3.5 w-3.5 text-champagne-400" />
              <span>Book VIP Transit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onDraftMandate(property);
              }}
              className="flex items-center justify-center space-x-1.5 rounded bg-gradient-to-r from-champagne-500 to-champagne-600 px-4 py-2 text-xs font-semibold text-alamera-darkest hover:from-champagne-400 hover:to-champagne-500 transition shadow-luxeGlow touch-target"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Draft Mandate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
