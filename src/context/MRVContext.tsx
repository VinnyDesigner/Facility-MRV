import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Facility,
  MonitoringPlan,
  EmissionsData,
  UploadedDocument,
  AccreditedVerifier,
  Submission,
  NotificationItem,
  AuditEvent,
} from '../types/mrv';

interface MRVContextType {
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  reportingYear: number;
  setReportingYear: (year: number) => void;
  activeFacility: Facility;
  facilities: Facility[];
  setActiveFacilityId: (id: string) => void;
  monitoringPlan: MonitoringPlan;
  emissionsData: EmissionsData;
  documents: UploadedDocument[];
  submissions: Submission[];
  verifiers: AccreditedVerifier[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  updateFacility: (data: Partial<Facility>) => void;
  updateMonitoringPlan: (data: Partial<MonitoringPlan>) => void;
  updateEmissionsData: (data: Partial<EmissionsData>) => void;
  addDocument: (doc: Omit<UploadedDocument, 'id' | 'uploadDate' | 'version'>) => void;
  removeDocument: (id: string) => void;
  submitAnnualMRV: () => { success: boolean; message: string; version: number };
  eadApproveSubmission: (submissionId: string, notes?: string) => void;
  eadRevertSubmission: (submissionId: string, comments: string) => void;
  eadRejectSubmission: (submissionId: string, reason: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  currentSubmission: Submission | undefined;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedSubmissionForReview: Submission | null;
  setSelectedSubmissionForReview: (sub: Submission | null) => void;
  resetDemoData: () => void;
}

const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Al Noor Industrial Facility',
    facilityCode: 'FAC-EAD-2026-0891',
    sector: 'Energy',
    emirate: 'Abu Dhabi',
    coordinates: { lat: 24.3644, lng: 54.4988 },
    address: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
    operatorName: 'Al Noor Energy & Power Operations LLC',
    tradeLicense: 'CN-1094821-AD',
    permitNumber: 'EAD-EP-2023-7741',
    permitType: 'Class A Environmental Operating Permit',
    permitIssueDate: '2023-01-15',
    permitExpiryDate: '2027-01-14',
    tier: 'Tier 2',
    primaryActivity: 'Cogeneration Power & High-Pressure Steam Generation',
    secondaryActivities: 'Industrial Natural Gas Compression & Auxiliary Power',
    products: 'Electricity (MWh), High-Pressure Steam (Tons), De-mineralized Water',
    productionCapacity: '1,200 MW Power / 4,500 T/h Steam',
    actualProduction: '1,040 MW average load / 3,920 T/h Steam',
    contactPerson: {
      name: 'Umasri Mavillapally',
      position: 'Senior Environmental & Regulatory Compliance Lead',
      email: 'umasri.m@alnoor-energy.ae',
      phone: '+971 2 698 4400',
    },
    environmentalManager: {
      name: 'Eng. Tariq Al-Hashimi',
      email: 'tariq.hashimi@alnoor-energy.ae',
      phone: '+971 50 442 8991',
    },
    status: 'Registered',
    lastRenewalDate: '2026-01-10',
    complianceScore: 82,
  },
  {
    id: 'fac-2',
    name: 'Emirates Steel Arkan Complex',
    facilityCode: 'FAC-EAD-2026-0104',
    sector: 'IPPU',
    emirate: 'Abu Dhabi',
    coordinates: { lat: 24.3121, lng: 54.4529 },
    address: 'Industrial City of Abu Dhabi (ICAD I), Mussafah, Abu Dhabi',
    operatorName: 'Emirates Steel Arkan PJSC',
    tradeLicense: 'CN-1002341-AD',
    permitNumber: 'EAD-EP-2022-3310',
    permitType: 'Class A Heavy Industrial Permit',
    permitIssueDate: '2022-06-01',
    permitExpiryDate: '2026-05-31',
    tier: 'Tier 3',
    primaryActivity: 'Direct Reduced Iron (DRI) & Electric Arc Furnace Steelmaking',
    secondaryActivities: 'Rolling Mill & Heavy Section Production',
    products: 'Reinforcing Bar, Wire Rod, Heavy Sections, Sheet Piles',
    productionCapacity: '3.5 Million MT / Year Finished Steel',
    actualProduction: '3.2 Million MT / Year',
    contactPerson: {
      name: 'Dr. Fatima Al-Hosani',
      position: 'Chief Sustainability Officer',
      email: 'fatima.hosani@emiratessteel.ae',
      phone: '+971 2 550 1100',
    },
    environmentalManager: {
      name: 'Hamad Al-Kaabi',
      email: 'hamad.kaabi@emiratessteel.ae',
      phone: '+971 50 887 2341',
    },
    status: 'Active',
    lastRenewalDate: '2025-11-20',
    complianceScore: 94,
  },
  {
    id: 'fac-3',
    name: 'Borouge Petrochemicals Complex',
    facilityCode: 'FAC-EAD-2026-0422',
    sector: 'IPPU',
    emirate: 'Al Dhafra',
    coordinates: { lat: 24.1205, lng: 52.7308 },
    address: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
    operatorName: 'Abu Dhabi Polymers Company Ltd (Borouge)',
    tradeLicense: 'CN-1004592-AD',
    permitNumber: 'EAD-EP-2023-8820',
    permitType: 'Class A Petrochemical Operating Permit',
    permitIssueDate: '2023-09-01',
    permitExpiryDate: '2027-08-31',
    tier: 'Tier 3',
    primaryActivity: 'Ethylene Cracking & Polyolefin Polymerization',
    secondaryActivities: 'Cross-linkable Polyethylene (XLPE) Compounding',
    products: 'Polyethylene (PE), Polypropylene (PP), Specialized Compounds',
    productionCapacity: '4.5 Million MT / Year Polyolefins',
    actualProduction: '4.35 Million MT / Year',
    contactPerson: {
      name: 'Khalid Al-Marzooqi',
      position: 'VP Environment & Quality',
      email: 'khalid.marzooqi@borouge.com',
      phone: '+971 2 607 0000',
    },
    environmentalManager: {
      name: 'Sultan Al-Zaabi',
      email: 'sultan.zaabi@borouge.com',
      phone: '+971 50 661 9022',
    },
    status: 'Active',
    lastRenewalDate: '2026-01-05',
    complianceScore: 78,
  },
  {
    id: 'fac-4',
    name: 'Al Taweelah Power & Desalination',
    facilityCode: 'FAC-EAD-2026-0033',
    sector: 'Energy',
    emirate: 'Abu Dhabi',
    coordinates: { lat: 24.7601, lng: 54.7082 },
    address: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
    operatorName: 'TAQA Generation & Desalination Co.',
    tradeLicense: 'CN-1008745-AD',
    permitNumber: 'EAD-EP-2021-1004',
    permitType: 'Class A Utility Generation Permit',
    permitIssueDate: '2021-04-10',
    permitExpiryDate: '2026-04-09',
    tier: 'Tier 3',
    primaryActivity: 'Combined Cycle Gas Turbine (CCGT) Power & RO Water Desalination',
    secondaryActivities: 'Thermal MSF Desalination',
    products: 'Grid Power (MW), Potable Water (MIGD)',
    productionCapacity: '2,000 MW / 100 MIGD Water',
    actualProduction: '1,890 MW / 92 MIGD',
    contactPerson: {
      name: 'Eng. Saeed Al-Mehairbi',
      position: 'Plant Operations Director',
      email: 'saeed.mehairbi@taqa.ae',
      phone: '+971 2 694 4000',
    },
    environmentalManager: {
      name: 'Rashid Al-Kindi',
      email: 'rashid.kindi@taqa.ae',
      phone: '+971 50 334 1199',
    },
    status: 'Active',
    lastRenewalDate: '2025-12-18',
    complianceScore: 88,
  },
  {
    id: 'fac-5',
    name: 'Tadweer Waste-to-Energy Facility',
    facilityCode: 'FAC-EAD-2026-0775',
    sector: 'Waste',
    emirate: 'Al Ain',
    coordinates: { lat: 24.1956, lng: 55.7605 },
    address: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
    operatorName: 'Abu Dhabi Waste Management PJSC (Tadweer)',
    tradeLicense: 'CN-1029844-AD',
    permitNumber: 'EAD-EP-2024-5501',
    permitType: 'Class B Solid Waste Thermal Recovery Permit',
    permitIssueDate: '2024-02-01',
    permitExpiryDate: '2028-01-31',
    tier: 'Tier 1',
    primaryActivity: 'Municipal Solid Waste Incineration with Energy Recovery',
    secondaryActivities: 'Bottom Ash Recycling & Metal Separation',
    products: 'Exported Electricity, Recycled Aggregate',
    productionCapacity: '600,000 Tons Waste / Year (60 MW)',
    actualProduction: '540,000 Tons Waste / Year',
    contactPerson: {
      name: 'Maryam Al-Dhaheri',
      position: 'Senior Environmental Engineer',
      email: 'maryam.dhaheri@tadweer.ae',
      phone: '+971 3 711 2000',
    },
    environmentalManager: {
      name: 'Ahmed Al-Balooshi',
      email: 'ahmed.balooshi@tadweer.ae',
      phone: '+971 50 123 7788',
    },
    status: 'Registered',
    lastRenewalDate: '2026-01-22',
    complianceScore: 91,
  }
];

const INITIAL_VERIFIERS: AccreditedVerifier[] = [
  {
    id: 'ver-1',
    name: 'Bureau Veritas Abu Dhabi',
    organization: 'Bureau Veritas Middle East & Gulf Region',
    accreditationStatus: 'Active',
    accreditationNumber: 'EAD-ACCR-2024-001',
    accreditationBody: 'EAD / ENAS (ISO 14065:2020)',
    validUntil: '2027-12-31',
    sectors: ['Energy', 'IPPU', 'Waste', 'Transport'],
    leadAuditor: 'Dr. Arthur Pendelton (Lead GHG Verifier)',
    contactEmail: 'ghg.verification.uae@bureauveritas.com',
    phone: '+971 2 444 8200',
    verifiedFacilitiesCount: 38,
    rating: 4.9,
  },
  {
    id: 'ver-2',
    name: 'TÜV SÜD Middle East LLC',
    organization: 'TÜV SÜD Carbon & Sustainability Services',
    accreditationStatus: 'Active',
    accreditationNumber: 'EAD-ACCR-2023-014',
    accreditationBody: 'EAD / ENAS (ISO 14065 / ISO 14064-3)',
    validUntil: '2026-11-30',
    sectors: ['Energy', 'IPPU', 'Transport'],
    leadAuditor: 'Ing. Marcus Von Berg',
    contactEmail: 'sustainability.mrv@tuvsud.com',
    phone: '+971 4 447 3111',
    verifiedFacilitiesCount: 29,
    rating: 4.8,
  },
  {
    id: 'ver-3',
    name: 'DNV GL Business Assurance',
    organization: 'DNV Climate & Energy Advisory UAE',
    accreditationStatus: 'Active',
    accreditationNumber: 'EAD-ACCR-2024-009',
    accreditationBody: 'EAD / DAkkS (ISO 14065)',
    validUntil: '2028-03-15',
    sectors: ['Energy', 'IPPU', 'Waste', 'Agriculture & Forestry'],
    leadAuditor: 'Lars Helge Christiansen',
    contactEmail: 'uae.ghg.audit@dnv.com',
    phone: '+971 4 352 8885',
    verifiedFacilitiesCount: 42,
    rating: 5.0,
  },
  {
    id: 'ver-4',
    name: 'SGS Gulf Limited',
    organization: 'SGS Environmental Services Group',
    accreditationStatus: 'Active',
    accreditationNumber: 'EAD-ACCR-2025-021',
    accreditationBody: 'EAD / ENAS (ISO 14065)',
    validUntil: '2027-08-20',
    sectors: ['Energy', 'IPPU', 'Waste'],
    leadAuditor: 'Nasser Al-Subhi',
    contactEmail: 'env.sgs.emirates@sgs.com',
    phone: '+971 2 642 9988',
    verifiedFacilitiesCount: 19,
    rating: 4.7,
  }
];

const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-101',
    facilityId: 'fac-1',
    facilityName: 'Al Noor Industrial Facility',
    reportingYear: 2026,
    title: 'Verified Facility MRV Report (Annual 2026)',
    fileName: 'AlNoor_MRV_Report_2026_Final_v2.pdf',
    fileType: 'PDF Document',
    fileSize: '4.8 MB',
    category: 'MRV_REPORT',
    version: 2,
    uploadDate: '2026-03-10',
    author: 'Umasri Mavillapally',
    status: 'Verified',
    checksum: 'sha256:8f43a9b1c03e91129b8c56d78',
    url: '#'
  },
  {
    id: 'doc-102',
    facilityId: 'fac-1',
    facilityName: 'Al Noor Industrial Facility',
    reportingYear: 2026,
    title: 'Independent Third-Party Verifier Statement',
    fileName: 'BureauVeritas_Verification_Statement_AlNoor_2026.pdf',
    fileType: 'PDF Document',
    fileSize: '1.9 MB',
    category: 'VERIFIER_STATEMENT',
    version: 1,
    uploadDate: '2026-03-12',
    author: 'Dr. Arthur Pendelton (Bureau Veritas)',
    status: 'Verified',
    checksum: 'sha256:1a89c3ef09d84310bc93188d4',
    url: '#'
  },
  {
    id: 'doc-103',
    facilityId: 'fac-1',
    facilityName: 'Al Noor Industrial Facility',
    reportingYear: 2026,
    title: 'Continuous Emissions Monitoring (CEMS) Calibration Log',
    fileName: 'CEMS_QAL2_Calibration_Certificates_2026.pdf',
    fileType: 'PDF Document',
    fileSize: '8.4 MB',
    category: 'SUPPORTING_DOC',
    version: 1,
    uploadDate: '2026-03-08',
    author: 'Eng. Tariq Al-Hashimi',
    status: 'Verified',
    checksum: 'sha256:77bc33400d981298faecb4592',
    url: '#'
  }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-2026-01',
    facilityId: 'fac-1',
    facilityName: 'Al Noor Industrial Facility',
    facilityCode: 'FAC-EAD-2026-0891',
    sector: 'Energy',
    emirate: 'Abu Dhabi',
    reportingYear: 2026,
    version: 3,
    submissionType: 'Annual MRV Submission',
    submittedDate: '2026-03-14',
    status: 'Under Review',
    totalEmissions: 1240500,
    tier: 'Tier 2',
    reviewerId: 'ead-rev-04',
    reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
    reviewDate: '2026-03-15',
    verifierId: 'ver-1',
    verifierName: 'Bureau Veritas Abu Dhabi',
    verifierOpinion: 'Unmodified (Positive)',
    documents: INITIAL_DOCUMENTS,
    daysPending: 4,
    history: [
      {
        id: 'aud-1',
        timestamp: '2026-02-18 10:14',
        user: 'Umasri Mavillapally',
        role: 'Facility Operator',
        action: 'Created Draft Submission Version 1',
        version: 1,
        statusAfter: 'Draft',
      },
      {
        id: 'aud-2',
        timestamp: '2026-02-28 16:30',
        user: 'Umasri Mavillapally',
        role: 'Facility Operator',
        action: 'Submitted Annual MRV Report (v1)',
        version: 1,
        statusAfter: 'Submitted',
      },
      {
        id: 'aud-3',
        timestamp: '2026-03-04 11:20',
        user: 'Dr. Mariam Al-Qubaisi',
        role: 'EAD Lead Inspector',
        action: 'Reverted Submission with Correction Request',
        comments: 'Please attach the ISO 17025 accredited laboratory fuel gas chromatography analysis certificates for Turbine 2 and verify the Tier 2 oxidation factor methodology.',
        version: 1,
        statusAfter: 'Correction Required',
      },
      {
        id: 'aud-4',
        timestamp: '2026-03-10 14:45',
        user: 'Umasri Mavillapally',
        role: 'Facility Operator',
        action: 'Uploaded revised gas chromatography lab reports and updated activity data documentation (v2)',
        version: 2,
        statusAfter: 'Draft',
      },
      {
        id: 'aud-5',
        timestamp: '2026-03-14 09:30',
        user: 'Umasri Mavillapally',
        role: 'Facility Operator',
        action: 'Resubmitted Verified MRV Package (Version 3) to EAD',
        comments: 'All fuel gas analysis reports attached and oxidation factors aligned with IPCC 2006 guidelines as requested.',
        version: 3,
        statusAfter: 'Under Review',
      },
    ],
  },
  {
    id: 'sub-2026-02',
    facilityId: 'fac-2',
    facilityName: 'Emirates Steel Arkan Complex',
    facilityCode: 'FAC-EAD-2026-0104',
    sector: 'IPPU',
    emirate: 'Abu Dhabi',
    reportingYear: 2026,
    version: 1,
    submissionType: 'Annual MRV Submission',
    submittedDate: '2026-03-11',
    status: 'Approved',
    totalEmissions: 3450200,
    tier: 'Tier 3',
    reviewerId: 'ead-rev-02',
    reviewerName: 'Eng. Salem Al-Nuaimi',
    reviewDate: '2026-03-13',
    verifierId: 'ver-3',
    verifierName: 'DNV GL Business Assurance',
    verifierOpinion: 'Unmodified (Positive)',
    documents: [],
    daysPending: 0,
    history: [
      {
        id: 'aud-201',
        timestamp: '2026-03-11 08:30',
        user: 'Dr. Fatima Al-Hosani',
        role: 'Facility Operator',
        action: 'Submitted Annual MRV Report (v1)',
        version: 1,
        statusAfter: 'Submitted',
      },
      {
        id: 'aud-202',
        timestamp: '2026-03-13 15:10',
        user: 'Eng. Salem Al-Nuaimi',
        role: 'EAD Reviewer',
        action: 'Approved MRV Submission - Full Compliance Certificate Issued',
        comments: 'Comprehensive Tier 3 mass balance data verified with continuous carbon capture audit.',
        version: 1,
        statusAfter: 'Approved',
      },
    ],
  },
  {
    id: 'sub-2026-03',
    facilityId: 'fac-3',
    facilityName: 'Borouge Petrochemicals Complex',
    facilityCode: 'FAC-EAD-2026-0422',
    sector: 'IPPU',
    emirate: 'Al Dhafra',
    reportingYear: 2026,
    version: 1,
    submissionType: 'Annual MRV Submission',
    submittedDate: '2026-03-09',
    status: 'Correction Required',
    totalEmissions: 2180900,
    tier: 'Tier 3',
    reviewerId: 'ead-rev-04',
    reviewerName: 'Dr. Mariam Al-Qubaisi',
    reviewDate: '2026-03-12',
    correctionDueDate: '2026-04-11',
    correctionComments: 'Fugitive emissions component (LDAR program summary) does not reconcile with the EPA Method 21 component count. Please resubmit within the standard 30-day correction window.',
    verifierId: 'ver-1',
    verifierName: 'Bureau Veritas Abu Dhabi',
    verifierOpinion: 'Qualified',
    documents: [],
    daysPending: 6,
    history: [
      {
        id: 'aud-301',
        timestamp: '2026-03-09 11:00',
        user: 'Khalid Al-Marzooqi',
        role: 'Facility Operator',
        action: 'Submitted Annual MRV Report (v1)',
        version: 1,
        statusAfter: 'Submitted',
      },
      {
        id: 'aud-302',
        timestamp: '2026-03-12 17:00',
        user: 'Dr. Mariam Al-Qubaisi',
        role: 'EAD Lead Inspector',
        action: 'Reverted for Corrections (30-day window)',
        comments: 'Fugitive emissions LDAR reconciled data required.',
        version: 1,
        statusAfter: 'Correction Required',
      },
    ],
  },
  {
    id: 'sub-2026-04',
    facilityId: 'fac-4',
    facilityName: 'Al Taweelah Power & Desalination',
    facilityCode: 'FAC-EAD-2026-0033',
    sector: 'Energy',
    emirate: 'Abu Dhabi',
    reportingYear: 2026,
    version: 1,
    submissionType: 'Annual MRV Submission',
    submittedDate: '2026-03-15',
    status: 'Submitted',
    totalEmissions: 4820000,
    tier: 'Tier 3',
    verifierId: 'ver-2',
    verifierName: 'TÜV SÜD Middle East LLC',
    verifierOpinion: 'Unmodified (Positive)',
    documents: [],
    daysPending: 2,
    history: [
      {
        id: 'aud-401',
        timestamp: '2026-03-15 14:20',
        user: 'Eng. Saeed Al-Mehairbi',
        role: 'Facility Operator',
        action: 'Submitted Annual MRV Report (v1)',
        version: 1,
        statusAfter: 'Submitted',
      },
    ],
  },
  {
    id: 'sub-2026-05',
    facilityId: 'fac-5',
    facilityName: 'Tadweer Waste-to-Energy Facility',
    facilityCode: 'FAC-EAD-2026-0775',
    sector: 'Waste',
    emirate: 'Al Ain',
    reportingYear: 2026,
    version: 1,
    submissionType: 'Annual MRV Submission',
    submittedDate: '2026-03-16',
    status: 'Draft',
    totalEmissions: 310400,
    tier: 'Tier 1',
    documents: [],
    daysPending: 0,
    history: [
      {
        id: 'aud-501',
        timestamp: '2026-03-16 09:10',
        user: 'Maryam Al-Dhaheri',
        role: 'Facility Operator',
        action: 'Drafted Annual MRV Report',
        version: 1,
        statusAfter: 'Draft',
      },
    ],
  }
];

const INITIAL_MONITORING_PLAN: MonitoringPlan = {
  id: 'mp-2026-01',
  facilityId: 'fac-1',
  reportingYear: 2026,
  tier: 'Tier 2',
  plantName: 'Al Noor Cogeneration Plant A & B',
  businessSector: 'Energy',
  operationalStatus: 'Normal Operation',
  productionStreams: [
    {
      id: 'ps-1',
      name: 'High-Pressure Steam Header 1',
      annualThroughput: '2,840,000',
      unit: 'Metric Tons / Year',
      measuringDevice: 'Ultrasonic Flowmeter FT-101 (Calibrated Q4 2025)',
    },
    {
      id: 'ps-2',
      name: 'Gas Turbine Power Generation Block (GT-1, GT-2)',
      annualThroughput: '1,040',
      unit: 'MW Net Output',
      measuringDevice: 'Revenue-Grade Digital Power Meter (Class 0.2s)',
    },
    {
      id: 'ps-3',
      name: 'Auxiliary Natural Gas Firing Header',
      annualThroughput: '184,500,000',
      unit: 'Nm³ / Year Natural Gas',
      measuringDevice: 'Coriolis Mass Flowmeter (FT-302)',
    }
  ],
  monitoringApproach: 'Calculation-based',
  ghgMeasurement: {
    methods: 'Standard Calculation Method (IPCC 2006 Tier 2) + Fuel-specific Net Calorific Value (NCV) testing',
    standards: 'ISO 14064-1:2018 & EAD Subnational MRV Technical Guidelines for Heavy Industries',
    dataSources: 'Fiscal metering gas sales agreement invoices, continuous online gas chromatograph (GC-101), SCADA historians',
    collectionProcedures: 'Daily automated SCADA logging, monthly mass-balance reconciliation by lead environmental engineer',
    measurementEquipment: 'Emerson Coriolis Meter CMF300, ABB GC9000 Gas Chromatograph, SICK Continuous Gas Analyzer',
    calibrationFrequency: 'Quarterly calibration by ISO 17025 accredited third-party calibration laboratory',
  },
  qaQc: {
    qualityAssurance: 'Independent monthly QA audit by internal sustainability committee against Abu Dhabi EAD MRV manual',
    internalReview: 'Tier-2 cross-departmental verification between Plant Engineering, Finance, and HSE Departments',
    validationProcedures: 'Automated delta-checking on daily fuel consumption with ±2.5% anomaly trigger',
    recordStorageYears: 10,
    dataArchivalSystem: 'Cloud-backed Encrypted Time-Series Repository with Immutable Audit Trails',
  },
  mitigationMeasures: [
    {
      id: 'mit-1',
      name: 'Waste Heat Recovery Steam Generator (HRSG) High-Efficiency Economizer Retrofit',
      status: 'Operational',
      expectedReduction: 48500,
      methodology: 'IPCC Energy Efficiency Project Protocol',
      verificationDetails: 'Verified in 2025 energy audit by DNV GL',
      implementationYear: 2025,
    },
    {
      id: 'mit-2',
      name: 'Dry Low-NOx (DLN-2.6+) Combustion Tuning & Natural Gas Pre-Heating',
      status: 'In Progress',
      expectedReduction: 24200,
      methodology: 'GE DLN Thermal Efficiency Optimization Baseline',
      verificationDetails: 'Scheduled for Bureau Veritas verification Q3 2026',
      implementationYear: 2026,
    },
    {
      id: 'mit-3',
      name: 'BOG (Boil-Off Gas) Flare Gas Recovery Unit (FGRU)',
      status: 'Planned',
      expectedReduction: 38000,
      methodology: 'CDM AM0009 Flare Reduction Methodology',
      verificationDetails: 'FEED Study completed; EPC award in progress',
      implementationYear: 2027,
    }
  ],
  preparerName: 'Umasri Mavillapally',
  preparerTitle: 'Senior Environmental & Regulatory Compliance Lead',
  declarationDate: '2026-02-15',
  status: 'Approved',
  remarks: 'Approved by Environment Agency - Abu Dhabi on 2026-02-24 for the 2026 Reporting Cycle.',
};

const INITIAL_EMISSIONS_DATA: EmissionsData = {
  id: 'em-2026-01',
  facilityId: 'fac-1',
  reportingYear: 2026,
  tier: 'Tier 2',
  totalEmissions: 1240500,
  combustionEmissions: 1184200,
  processEmissions: 38100,
  fugitiveEmissions: 18200,
  scope1: 1240500,
  scope2: 42100,
  unit: 'tCO₂e',
  activityDataNotes: 'Calculated using facility-specific Net Calorific Value (NCV = 38.45 MJ/Nm³) and certified carbon emission factor (56.1 tCO₂/TJ) based on 12-month composite chromatography.',
  calculationMethod: 'IPCC 2006 Guidelines for National GHG Inventories (Volume 2: Energy, Chapter 2 - Stationary Combustion)',
  status: 'Saved',
  lastUpdated: '2026-03-14 09:25',
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'warning',
    title: 'Submission Deadline Approaching',
    message: 'Your Facility MRV annual submission for Reporting Year 2026 is due by 31 March (218 days remaining).',
    timestamp: '2026-03-16 08:00',
    read: false,
    link: 'reports',
    deadline: '31 March 2026',
  },
  {
    id: 'notif-2',
    type: 'action_required',
    title: 'EAD Correction Window Active',
    message: 'EAD reviewer has requested revised gas chromatography records. 30-day resubmission window is active.',
    timestamp: '2026-03-14 11:30',
    read: false,
    link: 'submissions',
    deadline: '11 April 2026',
  },
  {
    id: 'notif-3',
    type: 'success',
    title: 'Monitoring Plan Approved',
    message: 'Your 2026 Facility Monitoring Plan (Tier 2) was officially approved by EAD Regulatory Committee.',
    timestamp: '2026-02-24 14:15',
    read: true,
    link: 'monitoring-plan',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'Annual Facility Renewal Open',
    message: 'Confirm facility operational details, permits, and emission boundaries for reporting cycle 2026.',
    timestamp: '2026-01-10 09:00',
    read: true,
    link: 'registration',
  }
];

const MRVContext = createContext<MRVContextType | undefined>(undefined);

export const MRVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('FACILITY_OPERATOR');
  const [reportingYear, setReportingYear] = useState<number>(2026);
  const [activeFacilityId, setActiveFacilityId] = useState<string>('fac-1');
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [monitoringPlan, setMonitoringPlan] = useState<MonitoringPlan>(INITIAL_MONITORING_PLAN);
  const [emissionsData, setEmissionsData] = useState<EmissionsData>(INITIAL_EMISSIONS_DATA);
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [verifiers] = useState<AccreditedVerifier[]>(INITIAL_VERIFIERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<Submission | null>(null);

  const activeFacility = facilities.find((f) => f.id === activeFacilityId) || facilities[0];

  const currentUser: User = {
    id: currentRole === 'FACILITY_OPERATOR' ? 'user-umasri' : currentRole === 'EAD_REVIEWER' ? 'user-mariam' : 'user-arthur',
    name: currentRole === 'FACILITY_OPERATOR' ? 'Umasri Mavillapally' : currentRole === 'EAD_REVIEWER' ? 'Dr. Mariam Al-Qubaisi' : 'Dr. Arthur Pendelton',
    email: currentRole === 'FACILITY_OPERATOR' ? 'umasri.m@alnoor-energy.ae' : currentRole === 'EAD_REVIEWER' ? 'mariam.qubaisi@ead.gov.ae' : 'arthur.p@bureauveritas.com',
    role: currentRole,
    roleTitle: currentRole === 'FACILITY_OPERATOR' ? 'Facility Operator' : currentRole === 'EAD_REVIEWER' ? 'EAD Lead Regulatory Reviewer' : 'Accredited Third-Party Verifier',
    facilityId: currentRole === 'FACILITY_OPERATOR' ? activeFacility.id : undefined,
    facilityName: currentRole === 'FACILITY_OPERATOR' ? activeFacility.name : undefined,
    organization: currentRole === 'FACILITY_OPERATOR' ? activeFacility.operatorName : currentRole === 'EAD_REVIEWER' ? 'Environment Agency – Abu Dhabi (EAD)' : 'Bureau Veritas Middle East',
    avatar: currentRole === 'FACILITY_OPERATOR' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const currentSubmission = submissions.find(
    (s) => s.facilityId === activeFacility.id && s.reportingYear === reportingYear
  );

  const updateFacility = (data: Partial<Facility>) => {
    setFacilities((prev) =>
      prev.map((f) => (f.id === activeFacility.id ? { ...f, ...data } : f))
    );
  };

  const updateMonitoringPlan = (data: Partial<MonitoringPlan>) => {
    setMonitoringPlan((prev) => ({ ...prev, ...data }));
  };

  const updateEmissionsData = (data: Partial<EmissionsData>) => {
    setEmissionsData((prev) => ({
      ...prev,
      ...data,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
    }));
  };

  const addDocument = (doc: Omit<UploadedDocument, 'id' | 'uploadDate' | 'version'>) => {
    const newDoc: UploadedDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().slice(0, 10),
      version: 1,
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const submitAnnualMRV = () => {
    const existing = submissions.find(
      (s) => s.facilityId === activeFacility.id && s.reportingYear === reportingYear
    );
    const newVersion = existing ? existing.version + 1 : 1;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newAuditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: nowStr,
      user: currentUser.name,
      role: 'Facility Operator',
      action: `Submitted Annual MRV Report Package (Version ${newVersion})`,
      comments: 'Full verified report package submitted to Environment Agency – Abu Dhabi.',
      version: newVersion,
      statusAfter: 'Under Review',
    };

    if (existing) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === existing.id
            ? {
                ...s,
                version: newVersion,
                submittedDate: new Date().toISOString().slice(0, 10),
                status: 'Under Review',
                totalEmissions: emissionsData.totalEmissions,
                history: [newAuditEvent, ...s.history],
                daysPending: 1,
              }
            : s
        )
      );
    } else {
      const newSub: Submission = {
        id: `sub-${reportingYear}-${Date.now()}`,
        facilityId: activeFacility.id,
        facilityName: activeFacility.name,
        facilityCode: activeFacility.facilityCode,
        sector: activeFacility.sector,
        emirate: activeFacility.emirate,
        reportingYear,
        version: newVersion,
        submissionType: 'Annual MRV Submission',
        submittedDate: new Date().toISOString().slice(0, 10),
        status: 'Under Review',
        totalEmissions: emissionsData.totalEmissions,
        tier: activeFacility.tier,
        documents: documents.filter((d) => d.facilityId === activeFacility.id),
        history: [newAuditEvent],
        daysPending: 1,
      };
      setSubmissions((prev) => [newSub, ...prev]);
    }

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'info',
      title: 'Submission Successfully Transmitted',
      message: `Annual MRV Report Package v${newVersion} for ${activeFacility.name} was successfully submitted to EAD Review Queue.`,
      timestamp: nowStr,
      read: false,
      link: 'submissions',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, message: `Submission Version ${newVersion} Transmitted to EAD`, version: newVersion };
  };

  const eadApproveSubmission = (submissionId: string, notes?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const audit: AuditEvent = {
            id: `aud-${Date.now()}`,
            timestamp: nowStr,
            user: currentUser.name,
            role: 'EAD Lead Regulatory Reviewer',
            action: 'Approved MRV Submission - Full Compliance Certificate Issued',
            comments: notes || 'Facility has met all regulatory emissions reporting criteria for the reporting cycle.',
            version: s.version,
            statusAfter: 'Approved',
          };
          return {
            ...s,
            status: 'Approved',
            reviewerName: currentUser.name,
            reviewerId: currentUser.id,
            reviewDate: new Date().toISOString().slice(0, 10),
            daysPending: 0,
            history: [audit, ...s.history],
          };
        }
        return s;
      })
    );

    const approvedSub = submissions.find((s) => s.id === submissionId);
    if (approvedSub) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'success',
          title: 'EAD Approval Granted',
          message: `Your MRV submission for ${approvedSub.facilityName} (${approvedSub.reportingYear}) has been formally APPROVED by EAD.`,
          timestamp: nowStr,
          read: false,
          link: 'submissions',
        },
        ...prev,
      ]);
    }
  };

  const eadRevertSubmission = (submissionId: string, comments: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    // 30 day calculation
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const audit: AuditEvent = {
            id: `aud-${Date.now()}`,
            timestamp: nowStr,
            user: currentUser.name,
            role: 'EAD Lead Regulatory Reviewer',
            action: 'Reverted for Mandatory Corrections (30-Day Resubmission Window)',
            comments: comments,
            version: s.version,
            statusAfter: 'Correction Required',
          };
          return {
            ...s,
            status: 'Correction Required',
            reviewerName: currentUser.name,
            reviewerId: currentUser.id,
            reviewDate: new Date().toISOString().slice(0, 10),
            correctionDueDate: dueDate,
            correctionComments: comments,
            history: [audit, ...s.history],
          };
        }
        return s;
      })
    );

    const targetSub = submissions.find((s) => s.id === submissionId);
    if (targetSub) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'action_required',
          title: 'EAD Correction Required (30 Days)',
          message: `EAD requested corrections on ${targetSub.facilityName}: "${comments.slice(0, 80)}...". Due by ${dueDate}.`,
          timestamp: nowStr,
          read: false,
          link: 'submissions',
          deadline: dueDate,
        },
        ...prev,
      ]);
    }
  };

  const eadRejectSubmission = (submissionId: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === submissionId) {
          const audit: AuditEvent = {
            id: `aud-${Date.now()}`,
            timestamp: nowStr,
            user: currentUser.name,
            role: 'EAD Lead Regulatory Reviewer',
            action: 'Rejected MRV Submission',
            comments: reason,
            version: s.version,
            statusAfter: 'Rejected',
          };
          return {
            ...s,
            status: 'Rejected',
            rejectionReason: reason,
            reviewerName: currentUser.name,
            reviewerId: currentUser.id,
            reviewDate: new Date().toISOString().slice(0, 10),
            history: [audit, ...s.history],
          };
        }
        return s;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setFacilities(INITIAL_FACILITIES);
    setMonitoringPlan(INITIAL_MONITORING_PLAN);
    setEmissionsData(INITIAL_EMISSIONS_DATA);
    setDocuments(INITIAL_DOCUMENTS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <MRVContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        reportingYear,
        setReportingYear,
        activeFacility,
        facilities,
        setActiveFacilityId,
        monitoringPlan,
        emissionsData,
        documents,
        submissions,
        verifiers,
        notifications,
        unreadNotificationCount,
        updateFacility,
        updateMonitoringPlan,
        updateEmissionsData,
        addDocument,
        removeDocument,
        submitAnnualMRV,
        eadApproveSubmission,
        eadRevertSubmission,
        eadRejectSubmission,
        markNotificationRead,
        markAllNotificationsRead,
        currentSubmission,
        activeView,
        setActiveView,
        selectedSubmissionForReview,
        setSelectedSubmissionForReview,
        resetDemoData,
      }}
    >
      {children}
    </MRVContext.Provider>
  );
};

export const useMRV = () => {
  const context = useContext(MRVContext);
  if (!context) {
    throw new Error('useMRV must be used within an MRVProvider');
  }
  return context;
};
