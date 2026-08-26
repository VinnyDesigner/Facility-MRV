export type UserRole = 'FACILITY_OPERATOR' | 'EAD_REVIEWER' | 'VERIFIER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  facilityId?: string;
  facilityName?: string;
  organization: string;
  avatar?: string;
}

export type SectorType = 'Energy' | 'IPPU' | 'Waste' | 'Transport' | 'Agriculture & Forestry';
export type EmirateType = 'Abu Dhabi' | 'Al Ain' | 'Al Dhafra';
export type TierLevel = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type SubmissionStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Correction Required' 
  | 'Approved' 
  | 'Rejected';

export interface Facility {
  id: string;
  name: string;
  facilityCode: string;
  sector: SectorType;
  emirate: EmirateType;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  operatorName: string;
  tradeLicense: string;
  permitNumber: string;
  permitType: string;
  permitIssueDate: string;
  permitExpiryDate: string;
  tier: TierLevel;
  primaryActivity: string;
  secondaryActivities: string;
  products: string;
  productionCapacity: string;
  actualProduction: string;
  contactPerson: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  environmentalManager: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'Registered' | 'Renewal Pending' | 'Active';
  lastRenewalDate: string;
  complianceScore: number;
}

export interface MitigationMeasure {
  id: string;
  name: string;
  status: 'Planned' | 'In Progress' | 'Operational' | 'Completed';
  expectedReduction: number; // tCO2e/yr
  methodology: string;
  verificationDetails: string;
  implementationYear: number;
}

export interface ProductionStream {
  id: string;
  name: string;
  annualThroughput: string;
  unit: string;
  measuringDevice: string;
}

export interface MonitoringPlan {
  id: string;
  facilityId: string;
  reportingYear: number;
  tier: TierLevel;
  plantName: string;
  businessSector: SectorType;
  operationalStatus: 'Normal Operation' | 'Maintenance' | 'Expanded' | 'Commissioning';
  productionStreams: ProductionStream[];
  monitoringApproach: 'Calculation-based' | 'Measurement-based' | 'Fallback';
  ghgMeasurement: {
    methods: string;
    standards: string;
    dataSources: string;
    collectionProcedures: string;
    measurementEquipment: string;
    calibrationFrequency: string;
  };
  qaQc: {
    qualityAssurance: string;
    internalReview: string;
    validationProcedures: string;
    recordStorageYears: number;
    dataArchivalSystem: string;
  };
  mitigationMeasures: MitigationMeasure[];
  preparerName: string;
  preparerTitle: string;
  declarationDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Correction Required';
  remarks?: string;
}

export interface EmissionsData {
  id: string;
  facilityId: string;
  reportingYear: number;
  tier: TierLevel;
  totalEmissions: number; // in tCO2e
  combustionEmissions: number;
  processEmissions: number;
  fugitiveEmissions: number;
  scope1: number;
  scope2: number;
  unit: string;
  activityDataNotes: string;
  calculationMethod: string;
  status: 'Draft' | 'Saved' | 'Submitted' | 'Verified';
  lastUpdated: string;
}

export interface UploadedDocument {
  id: string;
  facilityId: string;
  facilityName: string;
  reportingYear: number;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  category: 'MRV_REPORT' | 'VERIFIER_STATEMENT' | 'SUPPORTING_DOC';
  version: number;
  uploadDate: string;
  author: string;
  status: 'Pending Review' | 'Verified' | 'Approved' | 'Reverted';
  checksum: string;
  url?: string;
}

export interface AccreditedVerifier {
  id: string;
  name: string;
  organization: string;
  accreditationStatus: 'Active' | 'Under Review' | 'Expired';
  accreditationNumber: string;
  accreditationBody: string;
  validUntil: string;
  sectors: SectorType[];
  leadAuditor: string;
  contactEmail: string;
  phone: string;
  verifiedFacilitiesCount: number;
  rating: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  comments?: string;
  version: number;
  statusAfter: SubmissionStatus;
}

export interface Submission {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityCode: string;
  sector: SectorType;
  emirate: EmirateType;
  reportingYear: number;
  version: number;
  submissionType: 'Annual MRV Submission' | 'Monitoring Plan Revision' | 'Correction Resubmission';
  submittedDate: string;
  status: SubmissionStatus;
  totalEmissions: number;
  tier: TierLevel;
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  correctionDueDate?: string;
  correctionComments?: string;
  rejectionReason?: string;
  verifierId?: string;
  verifierName?: string;
  verifierOpinion?: 'Unmodified (Positive)' | 'Qualified' | 'Adverse';
  documents: UploadedDocument[];
  history: AuditEvent[];
  daysPending: number;
}

export interface NotificationItem {
  id: string;
  type: 'warning' | 'action_required' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  deadline?: string;
}

export interface SelfAssessmentResult {
  required: boolean;
  score: number;
  title: string;
  rationale: string;
  nextSteps: string[];
  applicableTier: TierLevel;
}
