export type StageType =
  | 'Mandate Signed'
  | 'Private Viewing'
  | 'LOI Submitted'
  | 'Due Diligence & Escrow'
  | 'Contract Execution';

export interface ClientDocument {
  name: string;
  type: string;
  date: string;
  status: 'Verified' | 'Pending';
}

export interface Client {
  id: string;
  name: string;
  title: string;
  entity: string;
  avatar: string;
  nationality: string;
  residence: string;
  netWorth: string;
  liquidAllocation: string;
  kycStatus: 'Tier 1 Verified' | 'Tier 2 Under Review' | 'Enhanced Due Diligence';
  status: 'Active Mandate' | 'Acquisition Ready' | 'Portfolio Review' | 'Dormant';
  primaryAdvisor: string;
  targetDistricts: string[];
  preferences: {
    propertyTypes: string[];
    minBedrooms: number;
    amenities: string[];
    confidentialityLevel: 'Strict Non-Disclosure' | 'Discreet' | 'Standard Private';
  };
  activeDealsCount: number;
  totalAcquisitions: string;
  lastContact: string;
  email: string;
  phone: string;
  notes: string;
  documents: ClientDocument[];
}

export interface Deal {
  id: string;
  dealCode: string;
  title: string;
  clientId: string;
  clientName: string;
  clientEntity: string;
  propertyId: string;
  propertyTitle: string;
  district: string;
  valuation: number;
  formattedValuation: string;
  projectedCommission: string;
  stage: StageType;
  stageProgress: number;
  probability: number;
  targetClosing: string;
  leadAdvisor: string;
  health: 'On Schedule' | 'High Momentum' | 'Escrow Clearance' | 'Pending Legal';
  lastMilestone: string;
  paymentStructure: 'Cash Wire' | 'Escrow Tranche' | 'Sovereign Guarantee' | 'Developer Payment Plan';
  escrowStatus?: string;
  reraPermit?: string;
}

export interface PropertySpecs {
  builtUpArea: string;
  plotArea?: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  completionYear: string;
  developer?: string;
}

export interface Property {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  district: string;
  price: number;
  formattedPrice: string;
  commissionRate: number;
  projectedCommission: string;
  status: 'Off-Market Exclusive' | 'Confidential Mandate' | 'Private Sale' | 'Under LOI' | 'Ready' | 'Off-Plan';
  specs: PropertySpecs;
  features: string[];
  heroImage: string;
  gallery: string[];
  advisor: string;
  has3DModel: boolean;
  confidentiality: 'Strict NDA Required' | 'Discretionary' | 'Verified Client Only';
  developer: string;
  permitNumber: string;
  portalSyndication: {
    propertyFinder: boolean;
    bayut: boolean;
    dubizzle: boolean;
    alameraWeb: boolean;
  };
}

export interface ViewingBooking {
  id: string;
  clientId: string;
  clientName: string;
  propertyId: string;
  propertyTitle: string;
  date: string;
  time: string;
  transitMode:
    | 'Private Chauffeur (Rolls-Royce Cullinan)'
    | 'Helicopter Transfer (Bell 429)'
    | 'Private Yacht Tender'
    | 'Direct Arrival';
  securityEscort: boolean;
  ndaSigned: boolean;
  status: 'Confirmed' | 'Pending Concierge Clearance' | 'Completed';
  specialRequests: string;
  hostPartner: string;
  dldPermitVerified?: boolean;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'deal_advance' | 'loi_signed' | 'viewing_scheduled' | 'client_onboarded' | 'funds_verified' | 'lead_captured';
  title: string;
  description: string;
  badge: string;
  actor: string;
}

export interface KPIStats {
  totalPipelineValue: string;
  pipelineRawValue: number;
  activeMandatesCount: number;
  accruedCommissionProjected: string;
  activeHighValueDeals: number;
  averageDealVelocityDays: number;
  confidentialPropertiesCount: number;
  totalLeadsCount?: number;
  dealsClosedYTD?: string;
}

// Enterprise Lead Model for Dubai Real Estate
export type LeadType = 'Buyer' | 'Investor' | 'Seller' | 'Tenant';
export type LeadSource =
  | 'Property Finder'
  | 'Bayut'
  | 'Dubizzle'
  | 'Official Website'
  | 'Meta Ads'
  | 'Google Ads'
  | 'Direct / Referral';

export type LeadStatus =
  | 'New Lead'
  | 'Contacted'
  | 'Qualified'
  | 'Viewing Arranged'
  | 'Negotiation'
  | 'Disqualified';

export interface Lead {
  id: string;
  leadNumber: string;
  fullName: string;
  phone: string;
  email: string;
  type: LeadType;
  source: LeadSource;
  status: LeadStatus;
  budgetAED: number;
  budgetFormatted: string;
  preferredAreas: string[];
  propertyType: string;
  assignedAgentId: string;
  assignedAgentName: string;
  assignedAgentAvatar: string;
  createdDate: string;
  lastFollowUp: string;
  notes: string;
  nationality: string;
  urgency: 'Immediate (Cash)' | '30 Days' | '60-90 Days' | 'Exploratory';
  whatsappAvailable: boolean;
}

// Enterprise Agent Model for Dubai RERA-Licensed Brokers
export interface Agent {
  id: string;
  name: string;
  title: string;
  brnNumber: string; // RERA BRN
  email: string;
  phone: string;
  avatar: string;
  specialization: string;
  activeDealsCount: number;
  ytdSalesAED: number;
  ytdSalesFormatted: string;
  activeLeadsCount: number;
  commissionSplit: string;
  rating: number;
  status: 'Active' | 'In Field Viewing' | 'At DLD Trustee';
}

// Enterprise Task & Follow-up Model
export interface TaskItem {
  id: string;
  title: string;
  relatedEntity: string;
  assignedAgent: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  type: 'Call' | 'WhatsApp' | 'Viewing' | 'DLD Escrow' | 'Contract' | 'Site Inspection';
  status: 'Pending' | 'Completed';
  notes: string;
}

// Marketing & Portal Attribution
export interface MarketingSource {
  id: string;
  name: string;
  category: 'Portal' | 'Social' | 'Search' | 'Direct';
  totalEnquiries: number;
  qualifiedLeads: number;
  monthlySpendAED: number;
  cplAED: number;
  dealsClosedAED: number;
  roiMultiplier: string;
  status: 'Active' | 'Optimizing' | 'Paused';
  lastSync: string;
}

// Integrations Hub Item
export interface IntegrationService {
  id: string;
  name: string;
  category: 'Portals' | 'Messaging' | 'Government' | 'PropTech';
  status: 'Connected' | 'Syncing' | 'Requires Re-Auth' | 'Disconnected';
  endpoint: string;
  lastSyncTimestamp: string;
  syncedRecordsCount: number;
  description: string;
  badge: string;
  enabled: boolean;
}
