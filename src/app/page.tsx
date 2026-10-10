'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ExecutiveDashboard } from '@/components/dashboard/ExecutiveDashboard';
import { LeadsModule } from '@/components/leads/LeadsModule';
import { DealPipeline } from '@/components/pipeline/DealPipeline';
import { ClientsDirectory } from '@/components/clients/ClientsDirectory';
import { PropertyCatalog } from '@/components/properties/PropertyCatalog';
import { AgentsModule } from '@/components/agents/AgentsModule';
import { TasksModule } from '@/components/tasks/TasksModule';
import { MarketingSourcesModule } from '@/components/marketing/MarketingSourcesModule';
import { ReportsModule } from '@/components/reports/ReportsModule';
import { IntegrationsHub } from '@/components/integrations/IntegrationsHub';
import { SettingsModule } from '@/components/settings/SettingsModule';
import { ArchitecturalViewer3D } from '@/components/viewer3d/ArchitecturalViewer3D';
import { ConciergeView } from '@/components/concierge/ConciergeView';
import { AdminPanelModule } from '@/components/admin/AdminPanelModule';
import { CreateDealModal } from '@/components/pipeline/CreateDealModal';
import { ViewingBookingModal } from '@/components/concierge/ViewingBookingModal';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  initialClients,
  initialDeals,
  initialProperties,
  initialBookings,
  initialActivities,
  initialStats,
  initialLeads,
  initialAgents,
  initialTasks,
  initialMarketingSources,
  initialIntegrations,
} from '@/data/mockData';
import {
  Client,
  Deal,
  Property,
  ViewingBooking,
  ActivityItem,
  StageType,
  Lead,
  LeadStatus,
  Agent,
  TaskItem,
  MarketingSource,
  IntegrationService,
} from '@/types/crm';
import { CheckCircle2, X } from 'lucide-react';

const STAGES: StageType[] = [
  'Mandate Signed',
  'Private Viewing',
  'LOI Submitted',
  'Due Diligence & Escrow',
  'Contract Execution',
];

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [bookings, setBookings] = useState<ViewingBooking[]>(initialBookings);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [marketingSources, setMarketingSources] = useState<MarketingSource[]>(initialMarketingSources);
  const [integrations, setIntegrations] = useState<IntegrationService[]>(initialIntegrations);
  const [activeWatermark, setActiveWatermark] = useState<boolean>(true);

  // Authentication redirect guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Sync tab with URL query parameter if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as NavTab;
      const validTabs: NavTab[] = [
        'dashboard',
        'leads',
        'pipeline',
        'properties',
        'clients',
        'agents',
        'tasks',
        'concierge',
        'marketing',
        'reports',
        'integrations',
        'settings',
        'spatial',
        'admin',
      ];
      if (tabParam && validTabs.includes(tabParam)) {
        setCurrentTab(tabParam);
      }
    }
  }, []);

  // Responsive mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalClient, setModalClient] = useState<Client | null>(null);
  const [modalProperty, setModalProperty] = useState<Property | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Recalculate dynamic stats
  const totalPipelineVal = deals.reduce((acc, d) => acc + d.valuation, 0);
  const stats = {
    ...initialStats,
    totalPipelineValue: `AED ${(totalPipelineVal / 1000000).toFixed(1)}M`,
    pipelineRawValue: totalPipelineVal,
    accruedCommissionProjected: `AED ${((totalPipelineVal * 0.02) / 1000000).toFixed(2)}M`,
    activeHighValueDeals: deals.length,
    activeMandatesCount: clients.length,
    confidentialPropertiesCount: properties.length,
    totalLeadsCount: leads.length,
  };

  // Handlers for Deals
  const handleAdvanceDeal = (dealId: string) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const currentIndex = STAGES.indexOf(deal.stage);
        if (currentIndex < STAGES.length - 1) {
          const nextStage = STAGES[currentIndex + 1];
          const newProgress = Math.min(100, deal.stageProgress + 20);
          const newProb = Math.min(99, deal.probability + 15);

          const newActivity: ActivityItem = {
            id: `act-${Date.now()}`,
            timestamp: 'Just now',
            type: 'deal_advance',
            title: `${deal.dealCode} Advanced to ${nextStage}`,
            description: `${deal.title} transitioned into ${nextStage}. Escrow milestones updated.`,
            badge: 'Stage Progression',
            actor: deal.leadAdvisor,
          };
          setActivities((a) => [newActivity, ...a]);

          showToast(`Mandate ${deal.dealCode} advanced to "${nextStage}"`);

          return {
            ...deal,
            stage: nextStage,
            stageProgress: newProgress,
            probability: newProb,
          };
        }
        return deal;
      })
    );
  };

  const handleRollbackDeal = (dealId: string) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const currentIndex = STAGES.indexOf(deal.stage);
        if (currentIndex > 0) {
          const prevStage = STAGES[currentIndex - 1];
          showToast(`Mandate ${deal.dealCode} reverted to "${prevStage}"`);
          return {
            ...deal,
            stage: prevStage,
            stageProgress: Math.max(10, deal.stageProgress - 20),
            probability: Math.max(20, deal.probability - 15),
          };
        }
        return deal;
      })
    );
  };

  const handleCreateDeal = (newDeal: Deal) => {
    setDeals((prev) => [newDeal, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'loi_signed',
      title: `New Mandate Registered: ${newDeal.dealCode}`,
      description: `Institutional acquisition mandate executed for ${newDeal.formattedValuation}.`,
      badge: 'New Mandate',
      actor: newDeal.leadAdvisor,
    };
    setActivities((a) => [newActivity, ...a]);

    showToast(`Mandate ${newDeal.dealCode} created successfully (${newDeal.formattedValuation})`);
  };

  // Handlers for Clients
  const handleAddClient = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'client_onboarded',
      title: `VIP Principal Onboarded: ${newClient.name}`,
      description: `${newClient.entity} registered with ${newClient.liquidAllocation} liquid allocation.`,
      badge: 'Client KYC',
      actor: newClient.primaryAdvisor,
    };
    setActivities((a) => [newActivity, ...a]);

    showToast(`Principal ${newClient.name} registered under Tier-1 KYC`);
  };

  // Handlers for Leads
  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'lead_captured',
      title: `New Lead: ${newLead.fullName}`,
      description: `Captured from ${newLead.source} for ${newLead.propertyType} (${newLead.budgetFormatted}).`,
      badge: newLead.source,
      actor: newLead.assignedAgentName,
    };
    setActivities((a) => [newActivity, ...a]);

    showToast(`Enquiry ${newLead.leadNumber} registered for ${newLead.fullName}`);
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status, lastFollowUp: 'Just now' } : l))
    );
    showToast(`Lead status updated to "${status}"`);
  };

  const handleConvertLeadToDeal = (lead: Lead) => {
    const propertyMatch = properties[0];
    const newDeal: Deal = {
      id: `dl-${Date.now()}`,
      dealCode: `ALM-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${lead.propertyType} Acquisition | ${lead.fullName}`,
      clientId: `cl-${lead.id}`,
      clientName: lead.fullName,
      clientEntity: `${lead.fullName} Private Office`,
      propertyId: propertyMatch.id,
      propertyTitle: propertyMatch.title,
      district: lead.preferredAreas[0] || 'Palm Jumeirah',
      valuation: lead.budgetAED,
      formattedValuation: lead.budgetFormatted,
      projectedCommission: `AED ${(lead.budgetAED * 0.02).toLocaleString()} (2.0%)`,
      stage: 'Mandate Signed',
      stageProgress: 20,
      probability: 50,
      targetClosing: '30 Nov 2026',
      leadAdvisor: lead.assignedAgentName,
      health: 'High Momentum',
      lastMilestone: `Converted from inbound lead ${lead.leadNumber} (${lead.source})`,
      paymentStructure: 'Cash Wire',
      escrowStatus: 'MoU Form F Pending',
    };

    handleCreateDeal(newDeal);
    handleUpdateLeadStatus(lead.id, 'Negotiation');
    setCurrentTab('pipeline');
    showToast(`Lead ${lead.fullName} successfully converted to Active Mandate!`);
  };

  // Handlers for Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        showToast(`Task "${t.title}" marked as ${newStatus}`);
        return { ...t, status: newStatus };
      })
    );
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" added to operational schedule.`);
  };

  // Handlers for Agents
  const handleAddAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
    showToast(`Broker ${newAgent.name} (${newAgent.brnNumber}) added to advisory roster.`);
  };

  // Handlers for Bookings
  const handleConfirmBooking = (newBooking: ViewingBooking) => {
    setBookings((prev) => [newBooking, ...prev]);

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'viewing_scheduled',
      title: `VIP Inspection Cleared: ${newBooking.propertyTitle}`,
      description: `${newBooking.transitMode} booked for ${newBooking.clientName} on ${newBooking.date}.`,
      badge: 'VIP Transit',
      actor: newBooking.hostPartner,
    };
    setActivities((a) => [newActivity, ...a]);

    showToast(`VIP Showing & Transit booked for ${newBooking.clientName}`);
  };

  // Handlers for Integrations
  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextState = !s.enabled;
        showToast(`Service "${s.name}" is now ${nextState ? 'Enabled' : 'Disabled'}`);
        return { ...s, enabled: nextState };
      })
    );
  };

  const handleTestIntegration = (id: string) => {
    const service = integrations.find((s) => s.id === id);
    showToast(`Pinged endpoint for ${service?.name || 'Service'}. Latency check OK.`);
  };

  // Handlers for Marketing Sync & Reports
  const handleTriggerMarketingSync = (sourceId?: string) => {
    showToast(sourceId ? 'Portal XML Feed synchronized successfully.' : 'All 6 portal XML syndication feeds refreshed.');
  };

  const handleExportReport = (format: 'PDF' | 'CSV') => {
    showToast(`Generated Q4 2026 Executive Financial Report (${format}). Downloading...`);
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-alamera-darkest flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-alamera-red/60 bg-alamera-card shadow-alameraRed">
            <span className="font-serif text-2xl font-bold tracking-wider text-alamera-red">A</span>
          </div>
          <div className="h-5 w-5 border-2 border-alamera-red/30 border-t-alamera-red rounded-full animate-spin" />
          <span className="font-mono text-xs text-alamera-muted">Verifying Cryptographic Session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated: router is redirecting to /login
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-alamera-black text-white flex flex-col pt-16 sm:pt-20">
      {/* Top Fixed Advisory Header */}
      <Header
        onOpenNewDeal={() => {
          setModalClient(null);
          setModalProperty(null);
          setIsNewDealOpen(true);
        }}
        onOpenBooking={() => {
          setModalClient(null);
          setModalProperty(null);
          setIsBookingOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeWatermark={activeWatermark}
        onToggleWatermark={() => setActiveWatermark(!activeWatermark)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigateTab={setCurrentTab}
      />

      {/* Main Body with Responsive Sidebar & Content */}
      <div className="flex flex-1 relative">
        {/* Responsive Sidebar (Persistent on Desktop >= 1024px, Slide-out Drawer on Mobile/Tablet) */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          dealsCount={deals.length}
          clientsCount={clients.length}
          propertiesCount={properties.length}
          bookingsCount={bookings.length}
          leadsCount={leads.length}
          tasksCount={tasks.filter((t) => t.status === 'Pending').length}
          agentsCount={agents.length}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Area (Fluid width, responsive padding, accounts for mobile bottom nav on smartphones) */}
        <main className="flex-1 lg:pl-64 p-3.5 sm:p-5 md:p-6 lg:p-8 min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] pb-24 md:pb-8 w-full max-w-full overflow-x-hidden">
          {/* 1. Executive Dashboard */}
          {currentTab === 'dashboard' && (
            <ExecutiveDashboard
              stats={stats}
              deals={deals}
              clients={clients}
              properties={properties}
              activities={activities}
              onNavigateTab={setCurrentTab}
              onOpenNewDeal={() => setIsNewDealOpen(true)}
              onOpenBooking={() => setIsBookingOpen(true)}
              onOpen3DViewer={() => setCurrentTab('spatial')}
            />
          )}

          {/* 2. Inbound Leads & Contacts */}
          {currentTab === 'leads' && (
            <LeadsModule
              leads={leads}
              onAddLead={handleAddLead}
              onConvertToDeal={handleConvertLeadToDeal}
              onUpdateLeadStatus={handleUpdateLeadStatus}
            />
          )}

          {/* 3. Deal Pipeline & Escrow */}
          {currentTab === 'pipeline' && (
            <DealPipeline
              deals={deals}
              onAdvanceDeal={handleAdvanceDeal}
              onRollbackDeal={handleRollbackDeal}
              onOpenCreateDeal={() => setIsNewDealOpen(true)}
            />
          )}

          {/* 4. Trophy Property Inventory */}
          {currentTab === 'properties' && (
            <PropertyCatalog
              properties={properties}
              onScheduleViewing={(property) => {
                setModalProperty(property);
                setIsBookingOpen(true);
              }}
              onDraftMandate={(property) => {
                setModalProperty(property);
                setIsNewDealOpen(true);
              }}
              onOpen3DViewer={() => setCurrentTab('spatial')}
              activeWatermark={activeWatermark}
            />
          )}

          {/* 5. UHNW Client Dossiers */}
          {currentTab === 'clients' && (
            <ClientsDirectory
              clients={clients}
              onAddClient={handleAddClient}
              onBookViewingForClient={(client) => {
                setModalClient(client);
                setIsBookingOpen(true);
              }}
              onCreateDealForClient={(client) => {
                setModalClient(client);
                setIsNewDealOpen(true);
              }}
            />
          )}

          {/* 6. Licensed Brokers & Advisory Team */}
          {currentTab === 'agents' && (
            <AgentsModule
              agents={agents}
              onAddAgent={handleAddAgent}
            />
          )}

          {/* 7. Operational Tasks & Follow-ups */}
          {currentTab === 'tasks' && (
            <TasksModule
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          )}

          {/* 8. VIP Viewings & Concierge Transit */}
          {currentTab === 'concierge' && (
            <ConciergeView
              bookings={bookings}
              onOpenBookingModal={() => setIsBookingOpen(true)}
            />
          )}

          {/* 9. Marketing Sources & Portal Attribution */}
          {currentTab === 'marketing' && (
            <MarketingSourcesModule
              sources={marketingSources}
              onTriggerSync={handleTriggerMarketingSync}
            />
          )}

          {/* 10. Reports & Financial Forecasting */}
          {currentTab === 'reports' && (
            <ReportsModule
              stats={stats}
              onExportReport={handleExportReport}
            />
          )}

          {/* 11. Integrations & API Hub */}
          {currentTab === 'integrations' && (
            <IntegrationsHub
              integrations={integrations}
              onToggleIntegration={handleToggleIntegration}
              onTestConnection={handleTestIntegration}
            />
          )}

          {/* 12. Corporate Settings & RERA Governance */}
          {currentTab === 'settings' && (
            <SettingsModule
              onSaveSettings={() => showToast('Corporate and RERA settings saved successfully.')}
            />
          )}

          {/* 13. 3D Spatial Studio */}
          {currentTab === 'spatial' && (
            <div className="h-[calc(100vh-170px)] sm:h-[calc(100vh-140px)] w-full">
              <ArchitecturalViewer3D />
            </div>
          )}

          {/* 14. Admin Governance & Security Suite */}
          {currentTab === 'admin' && (
            <AdminPanelModule />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Smartphones < 768px for 1-thumb ergonomics) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        dealsCount={deals.length}
      />

      {/* Global Modals */}
      <CreateDealModal
        isOpen={isNewDealOpen}
        onClose={() => setIsNewDealOpen(false)}
        clients={clients}
        properties={properties}
        onCreateDeal={handleCreateDeal}
      />

      <ViewingBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        clients={clients}
        properties={properties}
        preSelectedClient={modalClient}
        preSelectedProperty={modalProperty}
        onConfirmBooking={handleConfirmBooking}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        clients={clients}
        deals={deals}
        properties={properties}
        onNavigateTab={setCurrentTab}
        onOpenNewDeal={() => {
          setIsNewDealOpen(true);
        }}
        onOpenBooking={() => {
          setIsBookingOpen(true);
        }}
        onOpen3DViewer={() => {
          setCurrentTab('spatial');
        }}
      />

      {/* Floating Action Toast (Responsive positioning) */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 z-50 flex items-center space-x-2.5 sm:space-x-3 rounded-md border border-alamera-red/50 bg-alamera-card/95 px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-alameraRed backdrop-blur-md transition-all max-w-[calc(100vw-24px)]">
          <CheckCircle2 className="h-4 w-4 text-alamera-red flex-shrink-0" />
          <span className="font-sans text-xs font-medium text-white truncate">
            {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-alamera-muted hover:text-white flex-shrink-0 touch-target flex items-center justify-center"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
