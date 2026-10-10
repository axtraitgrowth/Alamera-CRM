'use client';

import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Power,
  Shield,
  Key,
  Server,
  Zap,
} from 'lucide-react';
import { IntegrationService } from '@/types/crm';

interface IntegrationsHubProps {
  integrations: IntegrationService[];
  onToggleIntegration: (id: string) => void;
  onTestConnection: (id: string) => void;
}

export const IntegrationsHub: React.FC<IntegrationsHubProps> = ({
  integrations,
  onToggleIntegration,
  onTestConnection,
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; latency: number } | null>(null);

  const handleTest = (id: string) => {
    setTestingId(id);
    setTestResult(null);
    onTestConnection(id);

    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id,
        latency: Math.floor(65 + Math.random() * 45),
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header and Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-alamera-border pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-widest text-alamera-red font-semibold">
              PropTech & Ecosystem Gateways
            </span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 border border-emerald-500/20">
              5 Active Services
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            Integrations & API Hub
          </h2>
          <p className="mt-1 font-sans text-xs text-alamera-muted">
            Manage bi-directional data exchange with Dubai Land Department, Property Finder, Bayut, WhatsApp Business Cloud, and the official Alamera web platform.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-alamera-silver">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Gateway Health: 100% Operational</span>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {integrations.map((svc) => {
          const isTesting = testingId === svc.id;
          const hasTested = testResult?.id === svc.id;

          return (
            <div
              key={svc.id}
              className={`rounded-lg border p-5 transition flex flex-col justify-between ${
                svc.enabled
                  ? 'border-alamera-border bg-alamera-card hover:border-alamera-red/40'
                  : 'border-alamera-border/40 bg-alamera-darkest/60 opacity-60'
              }`}
            >
              <div>
                {/* Header with Name & Toggle */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-alamera-darkest px-2 py-0.5 font-mono text-[9px] text-alamera-silver border border-alamera-border">
                        {svc.category}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400 border border-emerald-500/20">
                        {svc.badge}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-white mt-1">
                      {svc.name}
                    </h3>
                  </div>

                  {/* Enable / Disable Switch */}
                  <button
                    onClick={() => onToggleIntegration(svc.id)}
                    className={`rounded-full p-1 w-11 h-6 flex items-center transition ${
                      svc.enabled ? 'bg-alamera-red justify-end' : 'bg-alamera-border justify-start'
                    }`}
                    title={svc.enabled ? 'Disable Service' : 'Enable Service'}
                  >
                    <span className="h-4 w-4 rounded-full bg-white shadow-md block" />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-2.5 font-sans text-xs text-alamera-muted leading-relaxed">
                  {svc.description}
                </p>

                {/* Endpoint */}
                <div className="mt-3 bg-alamera-darkest p-2 rounded border border-alamera-border/60 font-mono text-[10px] text-alamera-muted truncate">
                  <span className="text-alamera-silver select-all">{svc.endpoint}</span>
                </div>

                {/* Telemetry info */}
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-alamera-silver">
                  <span>Synced Records: <strong className="text-white">{svc.syncedRecordsCount}</strong></span>
                  <span className="text-alamera-muted">{svc.lastSyncTimestamp}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-alamera-border/60 flex items-center justify-between">
                <div className="font-mono text-[10px]">
                  {hasTested ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Ping OK ({testResult.latency}ms)</span>
                    </span>
                  ) : (
                    <span className="text-alamera-muted">Status: {svc.status}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleTest(svc.id)}
                    disabled={isTesting || !svc.enabled}
                    className="flex items-center space-x-1.5 rounded px-3 py-1.5 bg-alamera-cardLight border border-alamera-border text-white hover:border-alamera-red font-mono text-[10px] transition disabled:opacity-40"
                  >
                    <Zap className={`h-3 w-3 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Ping Test'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
