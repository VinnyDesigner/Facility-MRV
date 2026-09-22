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

export type SectorType = 'Energy' | 'IPPU' | 'Waste' | 'Transport' | 'Agriculture & Forestry' | 'Chemicals' | 'Manufacturing';
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
  status: 'Registered' | 'Renewal Pending' | 'Active' | 'Rejected' | 'Correction Required' | 'Reverted' | 'Approved' | 'Draft';
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

// =========================================================================
// WORKFLOW STATUS TYPES
// =========================================================================

export type RegistrationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under EAD Review'
  | 'Correction Required'
  | 'Approved / Registered'
  | 'Approved'
  | 'Registered'
  | 'Rejected';

export type MonitoringPlanStatus =
  | 'Not Started'
  | 'Draft'
  | 'Submitted'
  | 'Under EAD Review'
  | 'Correction Required'
  | 'Approved / Accepted'
  | 'Approved'
  | 'Accepted'
  | 'Active';

export type AnnualEmissionStatus =
  | 'Not Started'
  | 'Draft'
  | 'Submitted'
  | 'Pending Verification'
  | 'Verified'
  | 'Under EAD Review'
  | 'Correction Required'
  | 'Reverted'
  | 'Rejected'
  | 'Approved / Accepted'
  | 'Approved'
  | 'Accepted';

export type VerificationStatus =
  | 'Not Required'
  | 'Pending Verification'
  | 'Verification In Progress'
  | 'Correction Required'
  | 'Verification Completed'
  | 'Verification Statement Uploaded';

export interface WorkflowState {
  registrationStatus: RegistrationStatus;
  monitoringPlanStatus: MonitoringPlanStatus;
  annualEmissionStatus: AnnualEmissionStatus;
  verificationStatus: VerificationStatus;
  registrationApprovalDate?: string;
  monitoringPlanDeadline?: string; // 90 days after registration approval
  facilityIdGenerated?: string;
  lastReviewComments?: string;
}

// =========================================================================
// MEASUREMENT EQUIPMENT (for Monitoring Plan → Measurement Equipment tab)
// =========================================================================

export interface MeasurementEquipment {
  id: string;
  meterName: string;
  equipmentId: string;
  measurementParameter: string;
  measurementUnit: string;
  measurementMethod: string;
  calibration: string;
  calibrationDate: string;
  nextCalibrationDate: string;
  calibrationFrequency: string;
  accuracyUncertainty: string;
  responsibleDeptPerson: string;
  supportingDocument?: string;
  linkedSourceStreamId?: string;
}

// =========================================================================
// ACTIVITY DATA & CALCULATION FACTORS (for Monitoring Plan tab)
// =========================================================================

export interface ActivityDataEntry {
  id: string;
  sourceStreamId: string;
  activityDataAmount: string;
  unit: string;
  fuelMaterialType: string;
  dataSource: string;
  relevantQuantity: string;
}

export interface CalculationFactor {
  id: string;
  sourceStreamId: string;
  emissionFactor: string;
  emissionFactorUnit: string;
  ncv: string;
  ncvUnit: string;
  tier: string;
  factorSource: string;
}

// =========================================================================
// VERIFICATION RECORD (for Verification module)
// =========================================================================

export interface VerificationRecord {
  id: string;
  facilityId: string;
  facilityName: string;
  reportingYear: number;
  submissionVersion: number;
  verificationStatus: VerificationStatus;
  verificationRequired: boolean;
  verifierName?: string;
  verifierOrganization?: string;
  verificationStartDate?: string;
  verificationEndDate?: string;
  verificationStatement?: string;
  supportingDocuments: string[];
  submissionHistory: AuditEvent[];
}

// =========================================================================
// READ-ONLY VIEW & AUDIT TYPES
// =========================================================================

export type ReadOnlyModuleType =
  | 'registration'
  | 'monitoring-plan'
  | 'annual-emission-data'
  | 'verification'
  | 'report'
  | 'full-dossier';

export interface ReadOnlyRecordTarget {
  moduleType: ReadOnlyModuleType;
  recordId?: string;
  version?: number;
  facilityId?: string;
  facilityName?: string;
  reportingYear?: number;
  title?: string;
  status?: string;
  submittedDate?: string;
  submittedBy?: string;
  reviewerName?: string;
  reviewComments?: string;
  correctionNotes?: string;
  correctionDueDate?: string;
  dataSnapshot?: any;
  submission?: Submission;
  initialTab?: 'data' | 'completeness' | 'documents' | 'comparison' | 'audit' | 'registration' | 'monitoring-plan' | 'annual-emissions' | 'verification' | 'review-submit' | 'checklist' | 'version-history';
}

export interface SectionCompletionItem {
  id: string;
  title: string;
  category: string;
  isComplete: boolean;
  requiredFieldsCount: number;
  completedFieldsCount: number;
  notes?: string;
}

export interface VersionDiffItem {
  field: string;
  section: string;
  v1Value: string;
  v2Value: string;
  hasChanged: boolean;
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
}

/**
 * Normalizes any version representation (e.g. 'v1.0', '1.0', 'v1.1', 'v1.2', 'v2.1', '3') into statutory uppercase integer format: 'V1', 'V2', 'V3', etc.
 */
export const formatVersion = (v?: string | number | null): string => {
  if (v === undefined || v === null || v === '') return 'V1';
  const str = String(v).trim();
  if (/^V\d+$/i.test(str)) return str.toUpperCase();
  const match = str.match(/^V?(\d+)(?:\.(\d+))?/i);
  if (match) {
    const major = parseInt(match[1], 10);
    const minor = match[2] !== undefined ? parseInt(match[2], 10) : 0;
    if (minor > 0 && major === 1) {
      return `V${minor + 1}`;
    }
    if (minor > 0 && major === 2 && minor === 1) {
      return `V3`;
    }
    return `V${major || 1}`;
  }
  return str.toUpperCase().startsWith('V') ? str.toUpperCase() : `V${str}`;
};


