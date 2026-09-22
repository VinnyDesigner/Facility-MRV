import React, { useState, useRef, useMemo } from 'react';
import {
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
  ShieldCheck,
  Bookmark,
  ArrowRight,
  Info,
  Upload,
  FileText,
  Eye,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Search,
  Filter,
  Check,
  RotateCcw,
  Layers,
  Flame,
  Activity,
  BarChart3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { formatVersion } from '../types/mrv';
import { MonitoringMethodsTab } from '../components/monitoring/MonitoringMethodsTab';

export const AnnualEmissionDataView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isAnnualEmissionUnlocked,
    setAnnualEmissionStatus,
    setVerificationStatus,
    currentRole,
    facilities,
    setActiveFacilityId,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (5-Tab Edit Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Overview Table Search & Filters
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  // Form Tab Navigation
  const [activeTab, setActiveTab] = useState<
    'monitoring-methods' | 'mitigation-measures' | 'qa-qc' | 'review-submit'
  >('monitoring-methods');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const [formReportingYear, setFormReportingYear] = useState('2026');

  // Multi-Facility Annual Emissions Records Registry (Single Source of Truth)
  const [facilityEmissions, setFacilityEmissions] = useState<Record<string, any>>(() => ({
    'fac-0': {
      facilityName: 'Green Mountain Cement Factory',
      facilityId: 'FAC-EAD-2026-0012',
      operatorName: 'Green Mountain Holdings LLC',
      reportingYear: '2026',
      version: 'V1',
      status: 'Draft',
      totalEmissions: '124,450',
      scope1Stationary: '45,000',
      scope1Process: '79,450',
      scope1Fugitive: '0',
      totalScope1: '124,450',
      submittedDate: '15-Jan-2026',
      updatedDate: '20-Jan-2026',
      eadCorrectionDate: null,
      businessSector: 'Manufacturing',
      primaryActivity: 'Manufacturing of cement / clinker',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0012 (Approved: 15-Jan-2026)',
      monitoringMethods: {
        calcSourceStreams: [{ id: 'F01', desc: 'Raw Kiln Feed', estimatedEmissions: '79,450', selectedCategory: 'Major' }],
        calcTierUncertainty: [{ id: 'F01', tier: 'Tier 3', uncertaintyAchieved: '1.80', fuelStreamType: 'Commercial Standard Fuels', sourceAccuracy: 'Lab Analysis' }],
        calcApproachDesc: 'Estimated based on calcination factors and clinker output logs',
        calcDetailedInfo: [{ id: 'F01', fuelType: 'Alternative Fuels', activityLevel: '24,000', unit: 't', source: 'Production logs' }],
        nonFuelInputsDesc: '',
        calcOtherInputsOutputs: [],
        calcMeasurementSystems: [],
        measEmissionSources: [{ id: 'S01', totalEmissions: '45,000', category: 'Major' }],
        measUncertainty: [{ id: 'S01', tier: 'Tier 2', uncertaintyAchieved: '3.10', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Meter Reading' }],
        measApproachDesc: 'Continuous emission monitoring at stack',
        measPoints: [],
        measComments: '',
        fallbackData: { methodologyDesc: '', justification: '' },
      },
      mitigationMeasures: [],
      mitigationAdditionalInfo: '',
      qaVerificationDesc: 'Standard plant internal QA/QC protocols applied.',
      qaFurtherDetails: '',
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      qaDiagramFiles: [],
      internalReviewProcedures: [],
      internalReviewFiles: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: 'Rashid Al Blooshi', designation: 'Operations Manager', date: '15-Jan-2026' },
    },
    'fac-1': {
      facilityName: 'Al Noor Industrial Facility',
      facilityId: 'FAC-EAD-2026-0891',
      operatorName: 'Al Noor Energy & Power Operations LLC',
      reportingYear: '2026',
      version: 'V1',
      status: 'Approved',
      totalEmissions: '142,800',
      scope1Stationary: '142,800',
      scope1Process: '0',
      scope1Fugitive: '4,060',
      totalScope1: '146,860',
      submittedDate: '14-Mar-2026',
      updatedDate: '18-Mar-2026',
      eadCorrectionDate: null,
      businessSector: 'Energy',
      primaryActivity: 'Combustion of fuels',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0891 (Approved: 18-Feb-2026)',
      monitoringMethods: {
        calcSourceStreams: [
          { id: 'F01', desc: 'Natural Gas Combined Cycle Turbines', estimatedEmissions: '105,000', selectedCategory: 'Major' },
          { id: 'F02', desc: 'Auxiliary Steam Boiler', estimatedEmissions: '1,200', selectedCategory: 'Minor' },
          { id: 'F03', desc: 'Emergency Diesel Generator', estimatedEmissions: '850', selectedCategory: 'De-minimis' },
        ],
        calcTierUncertainty: [
          { id: 'F01', tier: 'Tier 3', uncertaintyAchieved: '1.60', fuelStreamType: 'Commercial Standard Fuels', sourceAccuracy: 'Lab Analysis' },
          { id: 'F02', tier: 'Tier 2', uncertaintyAchieved: '3.20', fuelStreamType: 'Alternative Fuels', sourceAccuracy: 'Meter Reading' },
          { id: 'F03', tier: '', uncertaintyAchieved: '', fuelStreamType: '', sourceAccuracy: '' },
        ],
        calcApproachDesc: 'Estimated based on fuel metering, Gas Chromatography analysis, and IPCC Guidelines.',
        calcDetailedInfo: [
          { id: 'F01', fuelType: 'Natural Gas', activityLevel: '10,000', unit: 'MWH', source: 'In-house technical telemetry' },
          { id: 'F02', fuelType: 'Alternative Fuels', activityLevel: '10,000', unit: 'MWH', source: 'In-house fuel logs' },
        ],
        nonFuelInputsDesc: '',
        calcOtherInputsOutputs: [
          { id: 'F01', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '42.3', emissionFactor: '73.3', oxidationFactor: '100%', conversionFactor: '-', source: 'IPCC' },
          { id: 'F02', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '23.5', emissionFactor: '64.3', oxidationFactor: '75%', conversionFactor: '-', source: 'IPCC' },
        ],
        calcMeasurementSystems: [
          { ref: 'MI01', associatedSource: 'F01', instrumentType: 'Rotary meter', location: 'Turbine Fuel Feed Line', unit: 'Nm³/h', rangeLower: '0', rangeUpper: '250', specifiedUncertainty: '3', typicalLower: '500', typicalUpper: '750' },
          { ref: 'MI02', associatedSource: 'F02', instrumentType: 'Weigh bridge', location: 'Gate 4 Scale', unit: 'Kg', rangeLower: '3,000', rangeUpper: '40,000', specifiedUncertainty: '0.6', typicalLower: '7,500', typicalUpper: '40,000' },
        ],
        measEmissionSources: [
          { id: 'S01', totalEmissions: '100,000', category: 'Major' },
          { id: 'S02', totalEmissions: '45,000', category: 'Minor' },
          { id: 'S03', totalEmissions: '800', category: 'De-minimis' },
        ],
        measUncertainty: [
          { id: 'S01', tier: 'Tier 3', uncertaintyAchieved: '1.60', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Lab Analysis' },
          { id: 'S02', tier: 'Tier 2', uncertaintyAchieved: '3.20', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Meter Reading' },
          { id: 'S03', tier: '', uncertaintyAchieved: '', streamType: 'CO₂ Emission Sources', sourceAccuracy: '' },
        ],
        measApproachDesc: 'Continuous emission monitoring system (CEMS) per EAD Technical Guidance.',
        measPoints: [
          { id: 'M1', associatedSource: 'S01', procedures: 'Stack Sampling & Analysis', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'CEMS Manual Rev. 4' },
          { id: 'M2', associatedSource: 'S02', procedures: 'Routine Calibration Check', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
          { id: 'M3', associatedSource: 'S03', procedures: 'Data Logging Protocol', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
        ],
        measComments: '',
        fallbackData: { methodologyDesc: 'IPCC Tier 1 default fallback method applied if CEMS exceeds 120 hours downtime.', justification: 'Regulatory compliance backup contingency.' },
      },
      mitigationMeasures: [
        {
          description: 'Waste Heat Recovery System',
          category: 'Emission Reduction',
          scope: '1',
          ghg: 'CO₂',
          startYear: '2024',
          status: 'Implemented',
          preMeasureRef: '4,200 (2022 avg)',
          reportingYearReduction: '3,850',
          expectedAnnualReduction: '4,000',
          methodology: 'Engineering energy balance against baseline',
          verification: 'Third-party verified',
        },
        {
          description: 'Clinker Factor Reduction using Calcined Clay',
          category: 'Emission Reduction',
          scope: '1',
          ghg: 'CO₂',
          startYear: '2025',
          status: 'Planned',
          preMeasureRef: '12,500 (2023 avg)',
          reportingYearReduction: '1,200',
          expectedAnnualReduction: '5,500',
          methodology: 'Mass balance clinker replacement model',
          verification: 'Internally verified',
        },
      ],
      mitigationAdditionalInfo: '',
      qaVerificationDesc: 'Al Noor Industrial Facility produces electricity and high-pressure steam. The facility operates combined cycle natural gas turbines with online telemetry and quarterly third-party calibration audits.',
      qaFurtherDetails: '',
      qaDataGaps: [
        { sourceStream: 'S05 - Flare Vent', fromDate: '01-Jan-2024', untilDate: '15-Jan-2024', description: 'CEMS downtime', estimatedEmissions: '12.40', sourceOfEstimate: 'Similar period avg' },
        { sourceStream: 'S08 - Boiler 3', fromDate: '10-Feb-2024', untilDate: '12-Feb-2024', description: 'Data logger issue', estimatedEmissions: '5.70', sourceOfEstimate: 'Fuel Consumption estimate' },
        { sourceStream: 'S12 - Compressor', fromDate: '03-Mar-2024', untilDate: '05-Mar-2024', description: 'Maintenance activity', estimatedEmissions: '1.15', sourceOfEstimate: 'Equipment capacity method' },
      ],
      qaManagementResp: [
        { jobTitle: 'GHG Manager', responsibilities: 'Supervise MRV operations, review activity registers' },
        { jobTitle: 'Environmental Engineer', responsibilities: 'Log CEMS telemetry, track fuel meter calibrations' },
        { jobTitle: 'Quality Assurance Officer', responsibilities: 'Conduct quarterly internal data checks and audits' },
      ],
      qaProcedures: [
        { procedureTitle: 'ETS QA/QC of MI', reference: 'EAD_QA_QC_01', briefDescription: 'Quality control procedures for measurement', responsibleDept: 'Measurement & Control', recordStorage: 'QA/QC Records' },
        { procedureTitle: 'Instrument Calibration', reference: 'QA_CAL_02', briefDescription: 'Routine calibration protocol for online meters', responsibleDept: 'Operations', recordStorage: 'Calibration Records' },
      ],
      qaDiagramFiles: [{ id: 'qa-diag-1', name: 'QA_QC_DataFlow_Diagram_Rev3.pdf', size: '1.6 MB', uploadDate: '12-Jan-2024' }],
      internalReviewProcedures: [
        { procedureTitle: 'ETS Data Validation', reference: 'EAD_VAL_01', briefDescription: 'Independent cross-check of data logs', responsibleDept: 'Measurement & Control', recordStorage: 'Validation Records' },
        { procedureTitle: 'Annual Internal Review', reference: 'INT_REV_02', briefDescription: 'Annual compliance review and internal audit', responsibleDept: 'Compliance', recordStorage: 'Internal Audit Folder' },
      ],
      internalReviewFiles: [{ id: 'ir-diag-1', name: 'Internal_Review_Workflow_2026.pdf', size: '1.4 MB', uploadDate: '15-Feb-2024' }],
      declarationChecks: { check1: true, check2: true, check3: true },
      declarationForm: { name: 'Ahmed Al-Zaabi', designation: 'Facility Operator', date: '21 Sept 2026' },
    },
    'fac-2': {
      facilityName: 'Emirates Steel Arkan - Industrial City',
      facilityId: 'FAC-EAD-2026-0412',
      operatorName: 'Emirates Steel Arkan PJSC',
      reportingYear: '2026',
      version: 'V1',
      status: 'Reverted',
      totalEmissions: '1,680,000',
      scope1Stationary: '1,120,000',
      scope1Process: '560,000',
      scope1Fugitive: '8,960',
      totalScope1: '1,688,960',
      submittedDate: '15-Mar-2026',
      updatedDate: '15-Mar-2026',
      eadCorrectionDate: null,
      businessSector: 'Industrial Processes',
      primaryActivity: 'Production of iron or steel',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0412 (Approved: 10-Feb-2026)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: true, check2: true, check3: true },
      declarationForm: { name: 'Saeed Al Mansoori', designation: 'Plant Director', date: '15-Mar-2026' },
    },
    'fac-3': {
      facilityName: 'Green Mountain Cement Factory',
      facilityId: 'FAC-000451',
      operatorName: 'Green Mountain Holdings LLC',
      reportingYear: '2026',
      version: 'V3',
      status: 'Correction Required',
      totalEmissions: '624,000',
      scope1Stationary: '244,000',
      scope1Process: '380,000',
      scope1Fugitive: '0',
      totalScope1: '624,000',
      submittedDate: '01-Mar-2026',
      updatedDate: '16-Mar-2026',
      eadCorrectionDate: '2026-06-10',
      businessSector: 'Industrial Processes',
      primaryActivity: 'Production of cement clinker',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-000451 (Approved: 05-Jan-2026)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: 'Hamad Al Dhaheri', designation: 'Technical Manager', date: '01-Mar-2026' },
    },
    'fac-4': {
      facilityName: 'Borouge Petrochemicals Complex',
      facilityId: 'FAC-EAD-2026-0599',
      operatorName: 'Abu Dhabi Polymers Company (Borouge)',
      reportingYear: '2026',
      version: 'V1',
      status: 'Draft',
      totalEmissions: '950,000',
      scope1Stationary: '820,000',
      scope1Process: '130,000',
      scope1Fugitive: '7,840',
      totalScope1: '957,840',
      submittedDate: '—',
      updatedDate: '20-Mar-2026',
      eadCorrectionDate: null,
      businessSector: 'Industrial Processes',
      primaryActivity: 'Combustion of fuels',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0599 (Approved: 12-Feb-2026)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: 'Fatima Al Suwaidi', designation: 'EHS Lead', date: '20-Mar-2026' },
    },
    'fac-5': {
      facilityName: 'Al Taweelah Power & Desalination',
      facilityId: 'FAC-EAD-2026-0033',
      operatorName: 'Taweelah Power Company PJSC',
      reportingYear: '2026',
      version: 'V1',
      status: 'Submitted',
      totalEmissions: '4,820,000',
      scope1Stationary: '4,820,000',
      scope1Process: '0',
      scope1Fugitive: '0',
      totalScope1: '4,820,000',
      submittedDate: '05-Mar-2026',
      updatedDate: '08-Mar-2026',
      eadCorrectionDate: null,
      businessSector: 'Energy',
      primaryActivity: 'Combustion of fuels & Desalination',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0033 (Approved: 08-Jan-2026)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: true, check2: true, check3: true },
      declarationForm: { name: 'Ali Al Kaabi', designation: 'Chief Engineer', date: '05-Mar-2026' },
    },
    'fac-6': {
      facilityName: 'Tadweer Waste-to-Energy Facility',
      facilityId: 'FAC-EAD-2026-0775',
      operatorName: 'Abu Dhabi Waste Management PJSC (Tadweer)',
      reportingYear: '2026',
      version: 'V2',
      status: 'Approved',
      totalEmissions: '310,400',
      scope1Stationary: '310,400',
      scope1Process: '0',
      scope1Fugitive: '0',
      totalScope1: '310,400',
      submittedDate: '22-Jan-2026',
      updatedDate: '28-Jan-2026',
      eadCorrectionDate: null,
      businessSector: 'Waste',
      primaryActivity: 'Solid waste thermal treatment',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0775 (Approved: 28-Jan-2026)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: true, check2: true, check3: true },
      declarationForm: { name: 'Khalfan Al Mazrouei', designation: 'Sustainability Officer', date: '22-Jan-2026' },
    },
    'fac-7': {
      facilityName: 'Gulf Chemical Solutions LLC',
      facilityId: 'FAC-EAD-2026-0619',
      operatorName: 'Gulf Chemical Solutions LLC',
      reportingYear: '2026',
      version: 'V1',
      status: 'Rejected',
      totalEmissions: '68,200',
      scope1Stationary: '68,200',
      scope1Process: '0',
      scope1Fugitive: '0',
      totalScope1: '68,200',
      submittedDate: '18-Feb-2026',
      updatedDate: '24-Feb-2026',
      eadCorrectionDate: null,
      businessSector: 'Chemicals',
      primaryActivity: 'Organic Solvent Refining & Distillation',
      operationalStatus: 'Operational',
      monitoringPlanRef: 'MP-2026-0619 (Rejected)',
      mitigationMeasures: [],
      qaDataGaps: [],
      qaManagementResp: [],
      qaProcedures: [],
      internalReviewProcedures: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: 'Nasser Al-Hajri', designation: 'Quality & Regulatory Director', date: '18-Feb-2026' },
    },
  }));

  const currentRecord = facilityEmissions[selectedFacilityId] || facilityEmissions['fac-1'];

  // Calculate Correction Deadline Countdown Helper
  const getCorrectionDeadlineInfo = (deadlineDateStr: string | null, status: string) => {
    if ((status !== 'Correction Required' && status !== 'Reverted') || !deadlineDateStr) {
      return { text: '—', isOverdue: false, daysRemaining: null };
    }
    const deadline = new Date(deadlineDateStr);
    const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue (${Math.abs(diffDays)} days late)`, isOverdue: true, daysRemaining: diffDays, deadlineStr: deadlineDateStr };
    }
    return {
      text: `Due: ${deadlineDateStr} (${diffDays} days left)`,
      isOverdue: false,
      daysRemaining: diffDays,
      deadlineStr: deadlineDateStr,
    };
  };

  // Filtered Facilities for Overview Table
  const filteredTableList = useMemo(() => {
    return Object.entries(facilityEmissions).filter(([facId, rec]) => {
      const matchesSearch =
        (rec.facilityName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (rec.facilityId || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (rec.operatorName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (rec.businessSector || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (rec.primaryActivity || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'Verified' && (rec.status === 'Verified' || rec.status === 'EAD Approved')) ||
        (statusFilter === 'Submitted' && (rec.status === 'Submitted' || rec.status.includes('Submitted'))) ||
        (statusFilter === 'Reverted' && (rec.status === 'Correction Required' || rec.status === 'Reverted' || rec.status.includes('Correction') || rec.status.includes('Reverted'))) ||
        (statusFilter === 'Correction Required' && (rec.status === 'Correction Required' || rec.status === 'Reverted' || rec.status.includes('Correction') || rec.status.includes('Reverted'))) ||
        (statusFilter === 'Rejected' && (rec.status === 'Rejected' || rec.status.includes('Reject'))) ||
        (rec.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchesYear =
        yearFilter === 'ALL' ||
        rec.reportingYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [facilityEmissions, tableSearchTerm, statusFilter, yearFilter]);

  // Overview Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const totalPages = Math.ceil(filteredTableList.length / itemsPerPage) || 1;

  const paginatedEmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTableList, currentPage, itemsPerPage]);

  // Production Streams
  const productionStreams = [
    { id: 'P01', category: 'Primary Products', technology: 'Combined Cycle Gas Turbine', capacity: '450,000 MWh/year', actual: '412,000 MWh/year' },
    { id: 'P02', category: 'Primary Products', technology: 'Heat Recovery Steam Generator', capacity: '120,000 t/year', actual: '108,500 t/year' },
  ];

  // Active Form States
  const defaultMitigationRow = {
    description: '',
    category: 'Emission Reduction',
    scope: '1',
    ghg: 'CO₂',
    startYear: '2026',
    status: 'Planned',
    preMeasureRef: '',
    reportingYearReduction: '',
    expectedAnnualReduction: '',
    methodology: '',
    verification: 'Third-party verified',
  };

  const defaultQaDataGapRow = {
    sourceStream: '',
    fromDate: '',
    untilDate: '',
    description: '',
    estimatedEmissions: '',
    sourceOfEstimate: '',
  };

  const defaultQaManagementRespRow = {
    jobTitle: '',
    responsibilities: '',
  };

  const defaultQaProcedureRow = {
    procedureTitle: '',
    reference: '',
    briefDescription: '',
    responsibleDept: '',
    recordStorage: '',
  };

  const defaultInternalReviewProcedureRow = {
    procedureTitle: '',
    reference: '',
    briefDescription: '',
    responsibleDept: '',
    recordStorage: '',
  };

  const [mitigationMeasures, setMitigationMeasures] = useState<any[]>([defaultMitigationRow]);
  const [mitigationAdditionalInfo, setMitigationAdditionalInfo] = useState('');
  const [qaVerificationDesc, setQaVerificationDesc] = useState('');
  const [qaFurtherDetails, setQaFurtherDetails] = useState('');
  const [qaDataGaps, setQaDataGaps] = useState<any[]>([defaultQaDataGapRow]);
  const [qaManagementResp, setQaManagementResp] = useState<any[]>([defaultQaManagementRespRow]);
  const [qaProcedures, setQaProcedures] = useState<any[]>([defaultQaProcedureRow]);
  const [qaDiagramFiles, setQaDiagramFiles] = useState<{ id: string; name: string; size: string; uploadDate: string }[]>([]);
  const qaDiagramInputRef = useRef<HTMLInputElement>(null);
  const [internalReviewProcedures, setInternalReviewProcedures] = useState<any[]>([defaultInternalReviewProcedureRow]);
  const [internalReviewFiles, setInternalReviewFiles] = useState<{ id: string; name: string; size: string; uploadDate: string }[]>([]);
  const internalReviewInputRef = useRef<HTMLInputElement>(null);
  const [previewModalFile, setPreviewModalFile] = useState<{ name: string } | null>(null);

  const [declarationChecks, setDeclarationChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
  });

  const [declarationForm, setDeclarationForm] = useState({
    name: '',
    designation: '',
    date: '21 Sept 2026',
  });

  // Table Row Add / Remove Handlers
  const addMitigationMeasure = () => {
    setMitigationMeasures((prev) => [...prev, { ...defaultMitigationRow }]);
  };
  const removeMitigationMeasure = (index: number) => {
    setMitigationMeasures((prev) => prev.filter((_, i) => i !== index));
  };

  const addQaDataGap = () => {
    setQaDataGaps((prev) => [...prev, { ...defaultQaDataGapRow }]);
  };
  const removeQaDataGap = (index: number) => {
    setQaDataGaps((prev) => prev.filter((_, i) => i !== index));
  };

  const addQaManagementResp = () => {
    setQaManagementResp((prev) => [...prev, { ...defaultQaManagementRespRow }]);
  };
  const removeQaManagementResp = (index: number) => {
    setQaManagementResp((prev) => prev.filter((_, i) => i !== index));
  };

  const addQaProcedure = () => {
    setQaProcedures((prev) => [...prev, { ...defaultQaProcedureRow }]);
  };
  const removeQaProcedure = (index: number) => {
    setQaProcedures((prev) => prev.filter((_, i) => i !== index));
  };

  const addInternalReviewProcedure = () => {
    setInternalReviewProcedures((prev) => [...prev, { ...defaultInternalReviewProcedureRow }]);
  };
  const removeInternalReviewProcedure = (index: number) => {
    setInternalReviewProcedures((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to load record data into local form states
  const loadRecordData = (rec: any) => {
    setMitigationMeasures(
      rec.mitigationMeasures && rec.mitigationMeasures.length > 0
        ? rec.mitigationMeasures
        : [{ ...defaultMitigationRow }]
    );
    setMitigationAdditionalInfo(rec.mitigationAdditionalInfo || '');
    setQaVerificationDesc(rec.qaVerificationDesc || '');
    setQaFurtherDetails(rec.qaFurtherDetails || '');
    setQaDataGaps(
      rec.qaDataGaps && rec.qaDataGaps.length > 0
        ? rec.qaDataGaps
        : [{ ...defaultQaDataGapRow }]
    );
    setQaManagementResp(
      rec.qaManagementResp && rec.qaManagementResp.length > 0
        ? rec.qaManagementResp
        : [{ ...defaultQaManagementRespRow }]
    );
    setQaProcedures(
      rec.qaProcedures && rec.qaProcedures.length > 0
        ? rec.qaProcedures
        : [{ ...defaultQaProcedureRow }]
    );
    setQaDiagramFiles(rec.qaDiagramFiles || []);
    setInternalReviewProcedures(
      rec.internalReviewProcedures && rec.internalReviewProcedures.length > 0
        ? rec.internalReviewProcedures
        : [{ ...defaultInternalReviewProcedureRow }]
    );
    setInternalReviewFiles(rec.internalReviewFiles || []);
    setDeclarationChecks(rec.declarationChecks || { check1: false, check2: false, check3: false });
    setDeclarationForm(rec.declarationForm || { name: '', designation: '', date: '21 Sept 2026' });
    setFormReportingYear(rec.reportingYear || '2026');
  };

  const updateCurrentRecord = (updater: (prev: any) => any) => {
    setFacilityEmissions((prev) => {
      const existing = prev[selectedFacilityId] || currentRecord;
      return {
        ...prev,
        [selectedFacilityId]: updater(existing),
      };
    });
  };

  // Flow 1: Create New Annual Emission Data Record (Initialized Blank with Placeholders)
  const handleEnterEmissionData = () => {
    const newIndex = Object.keys(facilityEmissions).length + 1;
    const newId = `fac-${newIndex}`;
    const formattedCode = String(newIndex).padStart(4, '0');

    const blankRecord = {
      facilityName: '',
      facilityId: activeFacility?.id && activeFacility.id.startsWith('FAC-') ? activeFacility.id : `FAC-EAD-2026-${formattedCode}`,
      operatorName: activeFacility?.operatorName || 'Authorized Operator',
      reportingYear: '2026',
      version: 'V1',
      status: 'Draft',
      totalEmissions: '0',
      scope1Stationary: '0',
      scope1Process: '0',
      scope1Fugitive: '0',
      totalScope1: '0',
      submittedDate: null,
      updatedDate: null,
      eadCorrectionDate: null,
      businessSector: activeFacility?.sector || 'Energy',
      primaryActivity: activeFacility?.primaryActivity || '',
      operationalStatus: 'Operational',
      monitoringPlanRef: `MP-2026-${formattedCode} (Approved)`,
      isNew: true,
      monitoringMethods: {
        calcSourceStreams: [{ id: 'F01', desc: '', estimatedEmissions: '', selectedCategory: '' }],
        calcTierUncertainty: [{ id: 'F01', tier: '', uncertaintyAchieved: '', fuelStreamType: '', sourceAccuracy: '' }],
        calcApproachDesc: '',
        calcDetailedInfo: [{ id: 'F01', fuelType: '', activityLevel: '', unit: '', source: '' }],
        nonFuelInputsDesc: '',
        calcOtherInputsOutputs: [{ id: 'F01', type: '', activityLevel: '', units: '', ncv: '', emissionFactor: '', oxidationFactor: '', conversionFactor: '', source: '' }],
        calcMeasurementSystems: [{ ref: 'MI01', associatedSource: '', instrumentType: '', location: '', unit: '', rangeLower: '', rangeUpper: '', specifiedUncertainty: '', typicalLower: '', typicalUpper: '' }],
        measEmissionSources: [{ id: 'S01', totalEmissions: '', category: '' }],
        measUncertainty: [{ id: 'S01', tier: '', uncertaintyAchieved: '', streamType: '', sourceAccuracy: '' }],
        measApproachDesc: '',
        measPoints: [{ id: 'M1', associatedSource: '', procedures: '', relevantProcedures: '', relevantSource: '' }],
        measComments: '',
        fallbackData: { methodologyDesc: '', justification: '' },
      },
      mitigationMeasures: [{ ...defaultMitigationRow }],
      mitigationAdditionalInfo: '',
      qaVerificationDesc: '',
      qaFurtherDetails: '',
      qaDataGaps: [{ ...defaultQaDataGapRow }],
      qaManagementResp: [{ ...defaultQaManagementRespRow }],
      qaProcedures: [{ ...defaultQaProcedureRow }],
      qaDiagramFiles: [],
      internalReviewProcedures: [{ ...defaultInternalReviewProcedureRow }],
      internalReviewFiles: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: '', designation: '', date: '21 Sept 2026' },
    };

    setFacilityEmissions((prev) => ({
      ...prev,
      [newId]: blankRecord,
    }));
    setSelectedFacilityId(newId);
    setActiveFacilityId(newId);
    loadRecordData(blankRecord);
    setActiveTab('monitoring-methods');
    setViewMode('form');
  };

  // Flow 2: Edit Existing Facility Emission Record
  const handleEditEmissionData = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    const rec = facilityEmissions[facId];
    if (rec) {
      loadRecordData(rec);
    }
    setActiveTab('monitoring-methods');
    setViewMode('form');
  };

  // Flow 3: View Existing Facility Emission Record in Read-Only Mode
  const handleViewEmissionData = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    const rec = facilityEmissions[facId];
    if (rec) {
      loadRecordData(rec);
    }
    setViewMode('view');
  };

  const isDeclarationComplete = Boolean(
    declarationChecks.check1 &&
    declarationChecks.check2 &&
    declarationChecks.check3 &&
    declarationForm.name.trim() &&
    declarationForm.designation.trim()
  );

  const handleSave = () => {
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...prev[selectedFacilityId],
        mitigationMeasures,
        mitigationAdditionalInfo,
        qaVerificationDesc,
        qaFurtherDetails,
        qaDataGaps,
        qaManagementResp,
        qaProcedures,
        qaDiagramFiles,
        internalReviewProcedures,
        internalReviewFiles,
        declarationChecks,
        declarationForm,
        updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    }));
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Saved!');
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSubmit = () => {
    if (!isDeclarationComplete) return;
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Submitted Successfully!');
    setTimeout(() => setIsSavedNotice(false), 3500);

    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...prev[selectedFacilityId],
        status: 'Submitted (Pending Verification)',
        submittedDate: '21-Sep-2026',
        mitigationMeasures,
        mitigationAdditionalInfo,
        qaVerificationDesc,
        qaFurtherDetails,
        qaDataGaps,
        qaManagementResp,
        qaProcedures,
        qaDiagramFiles,
        internalReviewProcedures,
        internalReviewFiles,
        declarationChecks,
        declarationForm,
      },
    }));
    setAnnualEmissionStatus('Submitted');
    setVerificationStatus('Verification In Progress');
    setNoticeMessage('Annual Emission Data Submitted for Third-Party Verification!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleApprove = () => {
    updateCurrentRecord((r) => ({
      ...r,
      status: 'Approved',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setAnnualEmissionStatus?.('Approved');
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Approved!');
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleReject = () => {
    updateCurrentRecord((r) => ({
      ...r,
      status: 'Rejected',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setAnnualEmissionStatus?.('Rejected');
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Rejected.');
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleRevert = () => {
    updateCurrentRecord((r) => ({
      ...r,
      status: 'Reverted',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setAnnualEmissionStatus?.('Reverted');
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Reverted for Correction.');
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Enter Data Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Annual Emission Data
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Facility GHG Emissions Data — Annual activity data, calculated Scope 1 emissions, and third-party verification workflow
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by facility, ID, operator..."
                value={tableSearchTerm}
                onChange={(e) => {
                  setTableSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
              />
              {tableSearchTerm && (
                <button
                  onClick={() => {
                    setTableSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-28 sm:w-36 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
              >
                <option value="ALL">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Reverted">Reverted</option>
                <option value="Submitted">Submitted</option>
                <option value="Draft">Draft</option>
                <option value="Correction Required">Correction Required</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-24 sm:w-26 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
              >
                <option value="ALL">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL' || yearFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setYearFilter('ALL');
                  setCurrentPage(1);
                }}
                className="h-9 px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Enter Emission Data Button */}
            <button
              onClick={handleEnterEmissionData}
              className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Enter Emission Data</span>
            </button>
          </div>
        </div>

        {/* Table & Pagination Container (Without outer white card background) */}
        <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="h-[38px] bg-[#6692B7]/30 text-slate-800 font-bold text-xs border-b border-[#6692B7]/20 sticky top-0 z-10 shadow-xs">
                  <th className="h-[38px] px-3 w-10 text-center align-middle">#</th>
                  <th className="h-[38px] px-3 w-[26%] align-middle">Facility Name</th>
                  <th className="h-[38px] px-3 w-[16%] whitespace-nowrap align-middle">Facility ID</th>
                  <th className="h-[38px] px-3 w-[12%] whitespace-nowrap text-center align-middle">Reporting Year</th>
                  <th className="h-[38px] px-3 w-[20%] whitespace-nowrap text-center align-middle">Total Scope 1 (tCO₂e)</th>
                  <th className="h-[38px] px-3 w-[14%] whitespace-nowrap align-middle">Submitted Date</th>
                  <th className="h-[38px] px-2.5 w-28 whitespace-nowrap text-left align-middle">Status</th>
                  <th className="h-[38px] px-3 w-16 text-right whitespace-nowrap align-middle">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedEmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                      No annual emission records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEmissions.map(([facId, rec], idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                    return (
                      <tr
                        key={facId}
                        className="h-[60px] hover:bg-slate-50/80 transition-colors group cursor-default"
                      >
                        <td className="h-[60px] px-3 text-center font-mono font-bold text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* Facility Name */}
                        <td className="h-[60px] px-3 font-semibold text-slate-800 leading-snug align-middle">
                          <span>{rec.facilityName}</span>
                        </td>

                        {/* Facility ID */}
                        <td className="h-[60px] px-3 font-mono text-[#004B87] font-semibold whitespace-nowrap align-middle">
                          {rec.facilityId || '—'}
                        </td>

                        {/* Reporting Year */}
                        <td className="h-[60px] px-3 text-center font-semibold text-slate-700 whitespace-nowrap align-middle">
                          {rec.reportingYear || '2026'}
                        </td>

                        {/* Total Scope 1 (tCO₂e) */}
                        <td className="h-[60px] px-3 font-mono font-bold text-[#004B87] text-center whitespace-nowrap align-middle">
                          {rec.totalScope1 ? `${rec.totalScope1}` : '—'}
                        </td>

                        {/* Submitted Date */}
                        <td className="h-[60px] px-3 text-slate-600 whitespace-nowrap align-middle">
                          {rec.submittedDate && rec.submittedDate !== '—' ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{rec.submittedDate}</span>
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="h-[60px] px-2.5 text-left whitespace-nowrap align-middle">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap inline-block ${
                              rec.status === 'Approved' || rec.status === 'Verified' || rec.status === 'EAD Approved'
                                ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                : rec.status === 'Submitted' || rec.status?.includes('Submitted')
                                ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                : rec.status === 'Correction Required'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80'
                                : rec.status === 'Reverted'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80'
                                : rec.status === 'Rejected'
                                ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>

                        {/* Actions: Eye View & Edit Icon Buttons */}
                        <td className="h-[60px] px-3 text-right whitespace-nowrap align-middle">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleViewEmissionData(facId)}
                              title="View Annual Emission Details"
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditEmissionData(facId)}
                              title="Edit Annual Emission Data"
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Counter Footer */}
          <div className="pt-2.5 pb-1 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>
                Showing <span className="font-bold text-slate-800">{filteredTableList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredTableList.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filteredTableList.length}</span> annual emission data records
              </span>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. READ-ONLY VIEW INSPECTOR (viewMode === 'view')
  // =========================================================================
  if (viewMode === 'view') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Top Action Header */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 pb-[18px] pt-0.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setViewMode('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
                {currentRecord.facilityName || 'Facility'} — Annual Emission Data (Read-Only)
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                  currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                    : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                    ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                    : currentRecord.status === 'Correction Required' || currentRecord.status === 'Reverted'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                    : currentRecord.status === 'Rejected'
                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {currentRecord.status || 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              {currentRecord.facilityName || 'Unnamed Facility'} ({currentRecord.facilityId || '—'}) • Reporting Year: {currentRecord.reportingYear || '2026'} • Version: {formatVersion(currentRecord.version)}
            </p>
          </div>

          {isSavedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{noticeMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('form')}
              className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
          </div>
        </div>

        {/* Main Container on White Frame with 4-Tab Navigation */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Sticky Tabs Navigation Bar (Fixed at top, outside scroll area) */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
            <div className="inline-flex items-center gap-1 p-1 bg-[#EAEFF4] border border-[#D5E0EA] rounded-[6px] shadow-2xs">
              {[
                { id: 'monitoring-methods', label: 'Monitoring Methods', icon: Activity },
                { id: 'mitigation-measures', label: 'Mitigation Measures', icon: BarChart3 },
                { id: 'qa-qc', label: 'Data Management & QA/QC', icon: ShieldCheck },
                { id: 'review-submit', label: 'Review & Submit', icon: CheckCircle2 },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-[#336D9F] hover:bg-white/60 font-semibold'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Read-Only Inspection Mode</span>
            </div>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-1 pt-2 pb-0.5 text-xs no-scrollbar">
              {/* TAB 1: MONITORING METHODS (READ-ONLY) */}
              {activeTab === 'monitoring-methods' && (
                <div className="space-y-[18px]">
                  <MonitoringMethodsTab
                    data={currentRecord.monitoringMethods}
                    isReadOnly={true}
                  />
                </div>
              )}

              {/* TAB 2: MITIGATION MEASURES (READ-ONLY) */}
              {activeTab === 'mitigation-measures' && (
                <div className="space-y-4 pt-1">
                  {/* Greenhouse Gas Mitigation Measures Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#336D9F]">
                        Greenhouse Gas Mitigation Measures
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                        <table className="w-full text-left text-xs min-w-[1500px]">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3 min-w-[200px]">Description of measure</th>
                              <th className="py-2.5 px-3 min-w-[150px]">Category</th>
                              <th className="py-2.5 px-3 min-w-[90px]">Scope</th>
                              <th className="py-2.5 px-3 min-w-[90px]">GHG</th>
                              <th className="py-2.5 px-3 min-w-[100px]">Start year</th>
                              <th className="py-2.5 px-3 min-w-[130px]">Status</th>
                              <th className="py-2.5 px-3 min-w-[180px]">Pre-measure reference</th>
                              <th className="py-2.5 px-3 min-w-[170px]">Reporting year reduction</th>
                              <th className="py-2.5 px-3 min-w-[170px]">Expected annual reduction</th>
                              <th className="py-2.5 px-3 min-w-[200px]">Methodology / standard</th>
                              <th className="py-2.5 px-3 min-w-[160px]">Verification</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {!currentRecord.mitigationMeasures || currentRecord.mitigationMeasures.length === 0 || !currentRecord.mitigationMeasures.some((m: any) => m.description || m.reportingYearReduction) ? (
                              <tr>
                                <td colSpan={11} className="py-6 text-center text-slate-400 font-medium">
                                  No greenhouse gas mitigation measures recorded for this facility.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.mitigationMeasures.map((m: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2 px-3 font-semibold text-slate-900">{m.description || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.category || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.scope || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.ghg || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.startYear || '—'}</td>
                                  <td className="py-2 px-3">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {m.status || 'Planned'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-slate-800">{m.preMeasureRef || '—'}</td>
                                  <td className="py-2 px-3 font-mono font-bold text-[#004B87]">{m.reportingYearReduction ? `${m.reportingYearReduction} tCO₂e/yr` : '—'}</td>
                                  <td className="py-2 px-3 font-mono text-slate-800">{m.expectedAnnualReduction ? `${m.expectedAnnualReduction} tCO₂e/yr` : '—'}</td>
                                  <td className="py-2 px-3 text-slate-700">{m.methodology || '—'}</td>
                                  <td className="py-2 px-3 text-slate-700">{m.verification || '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  {/* Section 2: Additional Relevant Information */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-[#336D9F]">
                      Additional Relevant Information
                    </p>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed min-h-[60px]">
                      {currentRecord.mitigationAdditionalInfo || 'No additional mitigation information provided.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DATA MANAGEMENT & QA/QC (READ-ONLY) */}
              {activeTab === 'qa-qc' && (
                <div className="space-y-[18px]">
                  {/* Internal QA/QC Methodology */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#336D9F]">Internal QA/QC Methodology</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed">
                      {currentRecord.qaVerificationDesc || 'Standard plant internal QA/QC protocols applied per EAD Technical Guidelines.'}
                    </div>
                  </div>

                  {/* Section 2: Data Gaps */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80">
                      <span className="text-xs font-bold text-[#336D9F]">Data Gaps</span>
                    </div>
                    <div className="p-3.5 bg-white space-y-3">
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3 min-w-[180px]">Source Stream / ID</th>
                              <th className="py-2.5 px-3 min-w-[130px]">From</th>
                              <th className="py-2.5 px-3 min-w-[130px]">Until</th>
                              <th className="py-2.5 px-3 min-w-[240px]">Description, Reasons And Methods</th>
                              <th className="py-2.5 px-3 min-w-[170px]">Estimated Emissions (t CO₂e)</th>
                              <th className="py-2.5 px-3 min-w-[210px]">Source Of Estimated Emissions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {!currentRecord.qaDataGaps || currentRecord.qaDataGaps.length === 0 || !currentRecord.qaDataGaps.some((g: any) => g.sourceStream || g.description) ? (
                              <tr>
                                <td colSpan={6} className="py-5 text-center text-slate-400 font-medium">
                                  No data gaps reported for this reporting period.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaDataGaps.map((gap: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-900">{gap.sourceStream || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{gap.fromDate || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{gap.untilDate || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-800">{gap.description || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]">{gap.estimatedEmissions ? `${gap.estimatedEmissions} tCO₂e` : '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{gap.sourceOfEstimate || '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Management Responsibilities */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80">
                      <span className="text-xs font-bold text-[#336D9F]">Management Responsibilities</span>
                    </div>
                    <div className="p-3.5 bg-white space-y-3">
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3 min-w-[280px]">Job Title / Post</th>
                              <th className="py-2.5 px-3 min-w-[500px]">Responsibilities</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {!currentRecord.qaManagementResp || currentRecord.qaManagementResp.length === 0 || !currentRecord.qaManagementResp.some((r: any) => r.jobTitle || r.responsibilities) ? (
                              <tr>
                                <td colSpan={2} className="py-5 text-center text-slate-400 font-medium">
                                  No management responsibilities defined.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaManagementResp.map((resp: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-900">{resp.jobTitle || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-800">{resp.responsibilities || '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Quality Assurance Procedures */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80">
                      <span className="text-xs font-bold text-[#336D9F]">Quality Assurance Procedures</span>
                    </div>
                    <div className="p-3.5 bg-white space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3 min-w-[180px]">Title of Procedure</th>
                              <th className="py-2.5 px-3 min-w-[160px]">Reference for Procedure</th>
                              <th className="py-2.5 px-3 min-w-[260px]">Brief Description of Procedure</th>
                              <th className="py-2.5 px-3 min-w-[200px]">Post / Department Responsible</th>
                              <th className="py-2.5 px-3 min-w-[200px]">Location Where Records Are Kept</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {!currentRecord.qaProcedures || currentRecord.qaProcedures.length === 0 || !currentRecord.qaProcedures.some((p: any) => p.procedureTitle || p.reference) ? (
                              <tr>
                                <td colSpan={5} className="py-5 text-center text-slate-400 font-medium">
                                  No QA procedures configured.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaProcedures.map((proc: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-900">{proc.procedureTitle || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[#004B87] font-semibold">{proc.reference || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-800">{proc.briefDescription || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{proc.responsibleDept || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{proc.recordStorage || '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Uploaded QA Diagrams */}
                      {currentRecord.qaDiagramFiles && currentRecord.qaDiagramFiles.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <h4 className="text-xs font-bold text-[#336D9F]">Attached QA Diagrams & Supporting Files</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {currentRecord.qaDiagramFiles.map((f: any) => (
                              <div key={f.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#004B87] flex items-center justify-center shrink-0 border border-sky-200">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                                    <p className="text-[10px] text-slate-500">{f.size} • {f.uploadDate}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalFile({ name: f.name })}
                                  className="px-2.5 py-1 text-slate-600 hover:text-[#004B87] hover:bg-white rounded-md text-xs font-medium flex items-center gap-1 border border-slate-200 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 5: Internal Review & Validation */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80">
                      <span className="text-xs font-bold text-[#336D9F]">Internal Review & Validation</span>
                    </div>
                    <div className="p-3.5 bg-white space-y-4">
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3 min-w-[180px]">Title of Procedure</th>
                              <th className="py-2.5 px-3 min-w-[160px]">Reference for Procedure</th>
                              <th className="py-2.5 px-3 min-w-[260px]">Brief Description of Procedure</th>
                              <th className="py-2.5 px-3 min-w-[200px]">Post / Department Responsible</th>
                              <th className="py-2.5 px-3 min-w-[200px]">Location Where Records Are Kept</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {!currentRecord.internalReviewProcedures || currentRecord.internalReviewProcedures.length === 0 || !currentRecord.internalReviewProcedures.some((p: any) => p.procedureTitle || p.reference) ? (
                              <tr>
                                <td colSpan={5} className="py-5 text-center text-slate-400 font-medium">
                                  No internal review procedures configured.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.internalReviewProcedures.map((proc: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-semibold text-slate-900">{proc.procedureTitle || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[#004B87] font-semibold">{proc.reference || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-800">{proc.briefDescription || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{proc.responsibleDept || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{proc.recordStorage || '—'}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Uploaded Internal Review Diagrams */}
                      {currentRecord.internalReviewFiles && currentRecord.internalReviewFiles.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <h4 className="text-xs font-bold text-[#336D9F]">Attached Internal Review Schematics & Workflows</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {currentRecord.internalReviewFiles.map((f: any) => (
                              <div key={f.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#004B87] flex items-center justify-center shrink-0 border border-sky-200">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{f.name}</p>
                                    <p className="text-[10px] text-slate-500">{f.size} • {f.uploadDate}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalFile({ name: f.name })}
                                  className="px-2.5 py-1 text-slate-600 hover:text-[#004B87] hover:bg-white rounded-md text-xs font-medium flex items-center gap-1 border border-slate-200 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 6: Additional Details */}
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-[#336D9F]">Further QA/QC Details</p>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed min-h-[60px]">
                      {currentRecord.qaFurtherDetails || 'No additional QA/QC details provided.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEW & SUBMIT (READ-ONLY) */}
              {activeTab === 'review-submit' && (
                <div className="space-y-[18px]">
                  {/* Section 1: Submission Summary */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#336D9F]">Submission Summary</span>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-white">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Facility / Plant Name</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.facilityName || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Facility ID</span>
                          <span className="font-semibold text-slate-800 text-xs font-mono">{currentRecord.facilityId || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Reporting Year</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.reportingYear || '2026'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Total Annual Emissions</span>
                          <span className="font-semibold text-slate-800 text-xs font-mono">{currentRecord.totalScope1 && currentRecord.totalScope1 !== '0' ? `${currentRecord.totalScope1} tCO₂e` : '—'}</span>
                        </div>

                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Verification Status</span>
                          <span className="font-semibold text-slate-800 text-xs">
                            {currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                              ? 'Approved & Verified'
                              : currentRecord.status === 'Submitted'
                              ? 'Submitted (Under Review)'
                              : currentRecord.status === 'Correction Required'
                              ? 'Correction Required'
                              : currentRecord.status === 'Reverted'
                              ? 'Reverted for Correction'
                              : currentRecord.status === 'Rejected'
                              ? 'Rejected'
                              : 'Draft / Unsubmitted'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Version</span>
                          <span className="font-semibold text-slate-800 text-xs">{formatVersion(currentRecord.version)}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Prepared By</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.declarationForm?.name || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Designation</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.declarationForm?.designation || '—'}</span>
                        </div>

                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Submission Date</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.submittedDate || '—'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Current Status</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.status || 'Draft'}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-slate-400 font-medium">Last Saved On</span>
                          <span className="font-semibold text-slate-800 text-xs">{currentRecord.updatedDate || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Final Declaration */}
                  <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#336D9F]">Final Declaration</span>
                    </div>
                    <div className="p-3.5 sm:p-4 bg-white space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 ${currentRecord.declarationChecks?.check1 ? 'bg-[#004B87] text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>
                            {currentRecord.declarationChecks?.check1 && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs text-slate-700 leading-snug">
                            I confirm that the annual emission data provided is complete, true and accurate to the best of my knowledge.
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 ${currentRecord.declarationChecks?.check2 ? 'bg-[#004B87] text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>
                            {currentRecord.declarationChecks?.check2 && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs text-slate-700 leading-snug">
                            I understand that submitting false or misleading information may result in regulatory action by the Environment Agency – Abu Dhabi.
                          </span>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 ${currentRecord.declarationChecks?.check3 ? 'bg-[#004B87] text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>
                            {currentRecord.declarationChecks?.check3 && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="text-xs text-slate-700 leading-snug">
                            I agree to submit this Annual Emission Data to the Environment Agency – Abu Dhabi.
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Authorized Signatory</label>
                          <p className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">{currentRecord.declarationForm?.name || '—'}</p>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Designation</label>
                          <p className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">{currentRecord.declarationForm?.designation || '—'}</p>
                        </div>
                        <div>
                          <label className="block text-slate-500 font-semibold mb-1 text-[11px]">Date of Sign-Off</label>
                          <p className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">{currentRecord.declarationForm?.date || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar in Read-Only View */}
          <div className="flex-shrink-0 pt-2.5 pb-1 flex items-center justify-end gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleRevert}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Revert submission for corrections"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Revert</span>
            </button>

            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800 flex items-center gap-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Reject annual emission data"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Reject</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Approve annual emission data"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          </div>
        </div>
      );
    }

  // =========================================================================
  // 3. EDIT / ADD FORM VIEW (viewMode === 'form')
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
      {/* Top Header Bar with Title, Status Chip, Facility Name, and Reporting Year */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pb-[18px] pt-0.5">
        {/* Left: Back Arrow, Title, Status Chip, Subtext, and Save Notice */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setViewMode('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Annual Emission Data — Data Entry
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                  currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                    : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                    ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                    : currentRecord.status === 'Correction Required' || currentRecord.status === 'Reverted'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                    : currentRecord.status === 'Rejected'
                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {currentRecord.status || 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              Record annual greenhouse gas emissions data, mitigation measures, and QA/QC validation protocols
            </p>
          </div>

          {isSavedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{noticeMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Facility Dropdown Selection & Reporting Year Dropdown */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Facility Selection */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Facility:</label>
            <div className="relative">
              <select
                value={selectedFacilityId}
                onChange={(e) => {
                  const facId = e.target.value;
                  setSelectedFacilityId(facId);
                  setActiveFacilityId(facId);
                  const rec = facilityEmissions[facId];
                  if (rec) {
                    loadRecordData(rec);
                  }
                }}
                className="w-56 sm:w-64 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-8 truncate"
              >
                {Object.entries(facilityEmissions).map(([id, rec]) => (
                  <option key={id} value={id}>
                    {rec.facilityName ? `${rec.facilityName}` : `New Facility (${id})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Reporting Year */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Reporting Year:</label>
            <div className="relative">
              <select
                value={formReportingYear}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormReportingYear(val);
                  updateCurrentRecord((r) => ({ ...r, reportingYear: val }));
                }}
                className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-7"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container on White Frame (Enclosing Tab Navigation at the top) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Sticky Tabs Navigation Bar (Fixed at top, outside scroll area) */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <div className="inline-flex items-center gap-1 p-1 bg-[#EAEFF4] border border-[#D5E0EA] rounded-[6px] shadow-2xs">
            {[
              { id: 'monitoring-methods', label: 'Monitoring Methods', icon: Activity },
              { id: 'mitigation-measures', label: 'Mitigation Measures', icon: BarChart3 },
              { id: 'qa-qc', label: 'Data Management & QA/QC', icon: ShieldCheck },
              { id: 'review-submit', label: 'Review & Submit', icon: CheckCircle2 },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-[#336D9F] hover:bg-white/60 font-semibold'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'qa-qc' && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>QA/QC Protocols & Procedures Configured</span>
            </div>
          )}

          {activeTab === 'review-submit' && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Operator Sign-Off Pending</span>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-1 pt-2 pb-0.5 text-xs no-scrollbar">
            {/* TAB 1: MONITORING METHODS */}
            {activeTab === 'monitoring-methods' && (
              <div className="space-y-[18px]">
                <MonitoringMethodsTab
                  data={currentRecord.monitoringMethods}
                  onChange={(methods) => {
                    updateCurrentRecord((r) => ({ ...r, monitoringMethods: methods }));
                  }}
                />
              </div>
            )}

            {/* TAB 2: MITIGATION MEASURES */}
            {activeTab === 'mitigation-measures' && (
              <div className="space-y-4 pt-1">
                {/* Greenhouse Gas Mitigation Measures Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">
                      Greenhouse Gas Mitigation Measures
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                      <table className="w-full text-left text-xs min-w-[1550px]">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[200px]" title="Description of measure">Description of measure</th>
                            <th className="py-2.5 px-3 min-w-[150px]" title="Category">Category</th>
                            <th className="py-2.5 px-3 min-w-[90px]" title="Scope (1 / 2 / 3)">Scope (1 / 2 / 3)</th>
                            <th className="py-2.5 px-3 min-w-[90px]" title="GHG">GHG</th>
                            <th className="py-2.5 px-3 min-w-[100px]" title="Start year">Start year</th>
                            <th className="py-2.5 px-3 min-w-[130px]" title="Status">Status</th>
                            <th className="py-2.5 px-3 min-w-[180px]" title="Pre-measure reference [tCO₂e/yr]">Pre-measure reference [tCO₂e/yr]</th>
                            <th className="py-2.5 px-3 min-w-[170px]" title="Reporting year reduction [tCO₂e/yr]">Reporting year reduction [tCO₂e/yr]</th>
                            <th className="py-2.5 px-3 min-w-[170px]" title="Expected annual reduction [tCO₂e/yr]">Expected annual reduction [tCO₂e/yr]</th>
                            <th className="py-2.5 px-3 min-w-[200px]" title="Methodology / standard">Methodology / standard</th>
                            <th className="py-2.5 px-3 min-w-[160px]" title="Verification">Verification</th>
                            <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {mitigationMeasures.length === 0 ? (
                            <tr>
                              <td colSpan={12} className="py-6 text-center text-slate-400 font-medium">
                                No greenhouse gas mitigation measures added yet. Click &ldquo;Add Measure&rdquo; above to record a measure.
                              </td>
                            </tr>
                          ) : (
                            mitigationMeasures.map((m, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                {/* Description of measure */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.description}
                                    placeholder="e.g. Waste Heat Recovery System"
                                    title={m.description || 'Description of measure'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].description = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Category */}
                                <td className="py-2 px-3">
                                  <select
                                    value={m.category || 'Emission Reduction'}
                                    title={m.category || 'Select category'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].category = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                                  >
                                    <option value="Emission Reduction">Emission Reduction</option>
                                    <option value="Energy Efficiency">Energy Efficiency</option>
                                    <option value="Fuel Switching">Fuel Switching</option>
                                    <option value="Carbon Capture (CCUS)">Carbon Capture (CCUS)</option>
                                    <option value="Process Optimization">Process Optimization</option>
                                    <option value="Alternative Raw Materials">Alternative Raw Materials</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </td>

                                {/* Scope (1 / 2 / 3) */}
                                <td className="py-2 px-3">
                                  <select
                                    value={m.scope || '1'}
                                    title={m.scope || 'Scope'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].scope = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[80px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                                  >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                  </select>
                                </td>

                                {/* GHG */}
                                <td className="py-2 px-3">
                                  <select
                                    value={m.ghg || 'CO₂'}
                                    title={m.ghg || 'GHG'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].ghg = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                                  >
                                    <option value="CO₂">CO₂</option>
                                    <option value="CH₄">CH₄</option>
                                    <option value="N₂O">N₂O</option>
                                    <option value="HFCs">HFCs</option>
                                    <option value="PFCs">PFCs</option>
                                    <option value="SF₆">SF₆</option>
                                    <option value="NF₃">NF₃</option>
                                    <option value="All GHGs">All GHGs</option>
                                  </select>
                                </td>

                                {/* Start year */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.startYear || ''}
                                    placeholder="2026"
                                    title={m.startYear || 'Start year'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].startYear = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Status */}
                                <td className="py-2 px-3">
                                  <select
                                    value={m.status || 'Planned'}
                                    title={m.status || 'Select status'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].status = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[125px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                                  >
                                    <option value="Implemented">Implemented</option>
                                    <option value="Planned">Planned</option>
                                    <option value="Under Study">Under Study</option>
                                    <option value="Decommissioned">Decommissioned</option>
                                  </select>
                                </td>

                                {/* Pre-measure reference */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.preMeasureRef || ''}
                                    placeholder="e.g. 4,200 (2022 avg)"
                                    title={m.preMeasureRef || 'Pre-measure reference [tCO₂e/yr]'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].preMeasureRef = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[170px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Reporting year reduction */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.reportingYearReduction || ''}
                                    placeholder="e.g. 3,850"
                                    title={m.reportingYearReduction ? `${m.reportingYearReduction} tCO₂e/yr` : 'Reporting year reduction [tCO₂e/yr]'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].reportingYearReduction = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Expected annual reduction */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.expectedAnnualReduction || ''}
                                    placeholder="e.g. 4,000"
                                    title={m.expectedAnnualReduction ? `${m.expectedAnnualReduction} tCO₂e/yr` : 'Expected annual reduction [tCO₂e/yr]'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].expectedAnnualReduction = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Methodology / standard */}
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={m.methodology || ''}
                                    placeholder="e.g. Engineering energy balance (ISO 50001)"
                                    title={m.methodology || 'Methodology / standard'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].methodology = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>

                                {/* Verification */}
                                <td className="py-2 px-3">
                                  <select
                                    value={m.verification || 'Third-party verified'}
                                    title={m.verification || 'Verification'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMitigationMeasures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].verification = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                                  >
                                    <option value="Third-party verified">Third-party verified</option>
                                    <option value="Internally verified">Internally verified</option>
                                    <option value="Self-declaration">Self-declaration</option>
                                    <option value="Pending">Pending</option>
                                  </select>
                                </td>

                                {/* Actions */}
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addMitigationMeasure}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                      title="Add Measure"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeMitigationMeasure(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                      title="Remove Measure"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                {/* Section 2: Additional Relevant Information */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-[#336D9F]">
                    Please provide any other information that you think may be relevant. If there is nothing, please add N/A below.
                  </p>
                  <textarea
                    rows={3}
                    value={mitigationAdditionalInfo}
                    placeholder="Please provide any other relevant mitigation details, or enter N/A..."
                    onChange={(e) => setMitigationAdditionalInfo(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: DATA MANAGEMENT & QA/QC */}
            {activeTab === 'qa-qc' && (
              <div className="space-y-[18px]">
                {/* Internal QA/QC Methodology */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">
                      Internal QA/QC Methodology
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Provide a detailed description of the internal QA/QC methodology applied for all source streams and sources
                  </p>
                  <textarea
                    rows={4}
                    value={qaVerificationDesc}
                    placeholder="Provide a detailed description of the internal QA/QC methodology applied for all source streams and sources..."
                    onChange={(e) => setQaVerificationDesc(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                  />
                </div>

                {/* Section 2: Data Gaps */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Data Gaps</span>
                  </div>

                  <div className="p-3.5 bg-white space-y-3">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[180px]">Source Stream / ID</th>
                            <th className="py-2.5 px-3 min-w-[130px]">From</th>
                            <th className="py-2.5 px-3 min-w-[130px]">Until</th>
                            <th className="py-2.5 px-3 min-w-[240px]">Description, Reasons And Methods</th>
                            <th className="py-2.5 px-3 min-w-[170px]">Estimated Emissions (t CO₂e)</th>
                            <th className="py-2.5 px-3 min-w-[210px]">Source Of Estimated Emissions</th>
                            <th className="py-2.5 px-3 text-center min-w-[65px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {qaDataGaps.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-5 text-center text-slate-400 font-medium">
                                No data gaps reported for this reporting period. Click &ldquo;Add Data Gap&rdquo; above if any gaps occurred.
                              </td>
                            </tr>
                          ) : (
                            qaDataGaps.map((gap, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.sourceStream || ''}
                                    placeholder="e.g. S05 - Flare Vent"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].sourceStream = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.fromDate || ''}
                                    placeholder="01-Jan-2026"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].fromDate = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.untilDate || ''}
                                    placeholder="15-Jan-2026"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].untilDate = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.description || ''}
                                    placeholder="e.g. CEMS downtime"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].description = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.estimatedEmissions || ''}
                                    placeholder="12.40"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].estimatedEmissions = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={gap.sourceOfEstimate || ''}
                                    placeholder="e.g. Similar period avg"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaDataGaps((prev) => {
                                        const copy = [...prev];
                                        copy[idx].sourceOfEstimate = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addQaDataGap}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                      title="Add Data Gap"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeQaDataGap(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                      title="Remove Gap"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section 3: Management Responsibilities */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Management Responsibilities</span>
                  </div>

                  <div className="p-3.5 bg-white space-y-3">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[280px]">Job Title / Post</th>
                            <th className="py-2.5 px-3 min-w-[500px]">Responsibilities</th>
                            <th className="py-2.5 px-3 text-center min-w-[65px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {qaManagementResp.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="py-5 text-center text-slate-400 font-medium">
                                No management responsibilities defined yet. Click &ldquo;Add Responsibility&rdquo; above to assign roles.
                              </td>
                            </tr>
                          ) : (
                            qaManagementResp.map((resp, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={resp.jobTitle || ''}
                                    placeholder="e.g. GHG Manager"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaManagementResp((prev) => {
                                        const copy = [...prev];
                                        copy[idx].jobTitle = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={resp.responsibilities || ''}
                                    placeholder="e.g. Supervise MRV operations, review activity registers"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaManagementResp((prev) => {
                                        const copy = [...prev];
                                        copy[idx].responsibilities = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addQaManagementResp}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                      title="Add Responsibility"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeQaManagementResp(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                      title="Remove Responsibility"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section 4: Quality Assurance Procedures */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Quality Assurance Procedures</span>
                  </div>

                  <div className="p-3.5 bg-white space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[180px]">Title of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[160px]">Reference for Procedure</th>
                            <th className="py-2.5 px-3 min-w-[260px]">Brief Description of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Post / Department Responsible</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Location Where Records Are Kept</th>
                            <th className="py-2.5 px-3 text-center min-w-[65px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {qaProcedures.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-5 text-center text-slate-400 font-medium">
                                No QA procedures configured yet. Click &ldquo;Add Procedure&rdquo; above to define quality assurance protocols.
                              </td>
                            </tr>
                          ) : (
                            qaProcedures.map((proc, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.procedureTitle || ''}
                                    placeholder="e.g. ETS QA/QC of MI"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].procedureTitle = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.reference || ''}
                                    placeholder="e.g. EAD_QA_QC_01"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].reference = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.briefDescription || ''}
                                    placeholder="e.g. Quality control procedures for measure"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].briefDescription = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.responsibleDept || ''}
                                    placeholder="e.g. Measurement & Control"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].responsibleDept = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.recordStorage || ''}
                                    placeholder="e.g. QA/QC Records"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setQaProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].recordStorage = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addQaProcedure}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                      title="Add Procedure"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeQaProcedure(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                      title="Remove Procedure"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Diagram References (Optional) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#336D9F]">Diagram References (Optional)</h4>
                          <p className="text-[11px] text-slate-500">Attach diagram-related workflows, schematics, or architecture documents for the QA procedures.</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            ref={qaDiagramInputRef}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setQaDiagramFiles((prev) => [
                                  ...prev,
                                  {
                                    id: `qa-${Date.now()}`,
                                    name: file.name,
                                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                    uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                                  },
                                ]);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => qaDiagramInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload Diagram / Supporting File
                          </button>
                        </div>
                      </div>

                      {qaDiagramFiles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          {qaDiagramFiles.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#004B87] flex items-center justify-center shrink-0 border border-sky-200">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-semibold text-slate-800 truncate" title={f.name}>{f.name}</p>
                                  <p className="text-[10px] text-slate-500">{f.size} • {f.uploadDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalFile({ name: f.name })}
                                  className="px-2 py-1 text-slate-600 hover:text-[#004B87] hover:bg-white rounded-md text-xs font-medium flex items-center gap-1 border border-slate-200 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQaDiagramFiles((prev) => prev.filter((item) => item.id !== f.id))}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                                  title="Remove file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 5: Internal Review & Validation */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Internal Review & Validation</span>
                  </div>

                  <div className="p-3.5 bg-white space-y-4">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[180px]">Title of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[160px]">Reference for Procedure</th>
                            <th className="py-2.5 px-3 min-w-[260px]">Brief Description of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Post / Department Responsible</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Location Where Records Are Kept</th>
                            <th className="py-2.5 px-3 text-center min-w-[65px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {internalReviewProcedures.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-5 text-center text-slate-400 font-medium">
                                No internal review procedures configured yet. Click &ldquo;Add Procedure&rdquo; above to record review protocols.
                              </td>
                            </tr>
                          ) : (
                            internalReviewProcedures.map((proc, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.procedureTitle || ''}
                                    placeholder="e.g. ETS Data Validation"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInternalReviewProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].procedureTitle = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.reference || ''}
                                    placeholder="e.g. EAD_VAL_01"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInternalReviewProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].reference = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.briefDescription || ''}
                                    placeholder="e.g. Independent cross-check of data logs"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInternalReviewProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].briefDescription = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.responsibleDept || ''}
                                    placeholder="e.g. Measurement & Control"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInternalReviewProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].responsibleDept = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={proc.recordStorage || ''}
                                    placeholder="e.g. Validation Records"
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInternalReviewProcedures((prev) => {
                                        const copy = [...prev];
                                        copy[idx].recordStorage = val;
                                        return copy;
                                      });
                                    }}
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs text-left focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addInternalReviewProcedure}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                      title="Add Procedure"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeInternalReviewProcedure(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                      title="Remove Procedure"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Diagram References (Optional) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#336D9F]">Diagram References (Optional)</h4>
                          <p className="text-[11px] text-slate-500">Attach diagram-related workflows, review trees, or validation process schematics for internal review procedures.</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            ref={internalReviewInputRef}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setInternalReviewFiles((prev) => [
                                  ...prev,
                                  {
                                    id: `ir-${Date.now()}`,
                                    name: file.name,
                                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                                    uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                                  },
                                ]);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => internalReviewInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Upload Diagram / Supporting File
                          </button>
                        </div>
                      </div>

                      {internalReviewFiles.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                          {internalReviewFiles.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/70 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#004B87] flex items-center justify-center shrink-0 border border-sky-200">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <p className="text-xs font-semibold text-slate-800 truncate" title={f.name}>{f.name}</p>
                                  <p className="text-[10px] text-slate-500">{f.size} • {f.uploadDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalFile({ name: f.name })}
                                  className="px-2 py-1 text-slate-600 hover:text-[#004B87] hover:bg-white rounded-md text-xs font-medium flex items-center gap-1 border border-slate-200 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setInternalReviewFiles((prev) => prev.filter((item) => item.id !== f.id))}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                                  title="Remove file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 6: Additional Details */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-[#336D9F]">
                    Please provide any further details pertaining to quality control / quality assurance that you think may be relevant
                  </p>
                  <textarea
                    rows={4}
                    value={qaFurtherDetails}
                    onChange={(e) => setQaFurtherDetails(e.target.value)}
                    placeholder="Enter any additional quality control / quality assurance details..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: REVIEW & SUBMIT */}
            {activeTab === 'review-submit' && (
              <div className="space-y-[18px]">
                {/* Section 1: Submission Summary */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Submission Summary</span>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Facility / Plant Name</span>
                        <span className="font-semibold text-slate-800 text-xs">{currentRecord.facilityName || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Facility ID</span>
                        <span className="font-semibold text-slate-800 text-xs font-mono">{currentRecord.facilityId || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Reporting Year</span>
                        <span className="font-semibold text-slate-800 text-xs">{formReportingYear || '2026'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Total Annual Emissions</span>
                        <span className="font-semibold text-slate-800 text-xs font-mono">{currentRecord.totalScope1 && currentRecord.totalScope1 !== '0' ? `${currentRecord.totalScope1} tCO₂e` : '—'}</span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Verification Status</span>
                        <span className="font-semibold text-slate-800 text-xs">
                          {currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                            ? 'Approved & Verified'
                            : currentRecord.status === 'Submitted'
                            ? 'Submitted (Under Review)'
                            : currentRecord.status === 'Correction Required'
                            ? 'Correction Required'
                            : currentRecord.status === 'Reverted'
                            ? 'Reverted for Correction'
                            : currentRecord.status === 'Rejected'
                            ? 'Rejected'
                            : 'Draft / Unsubmitted'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Version</span>
                        <span className="font-semibold text-slate-800 text-xs">{formatVersion(currentRecord.version)}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Prepared By</span>
                        <span className="font-semibold text-slate-800 text-xs">{declarationForm.name || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Email</span>
                        <span className="font-semibold text-slate-800 text-xs font-mono">
                          {declarationForm.name
                            ? `${declarationForm.name.toLowerCase().trim().replace(/\s+/g, '.')}@alnoor-energy.ae`
                            : 'ahmed.zaabi@alnoor-energy.ae'}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Submission Date</span>
                        <span className="font-semibold text-slate-800 text-xs">{currentRecord.submittedDate || '—'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Current Status</span>
                        <span className="font-semibold text-slate-800 text-xs">{currentRecord.status || 'Draft'}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-slate-400 font-medium">Last Saved On</span>
                        <span className="font-semibold text-slate-800 text-xs">{currentRecord.updatedDate || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Final Declaration */}
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2.5 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#336D9F]">Final Declaration</span>
                  </div>
                  <div className="p-3.5 sm:p-4 bg-white space-y-4">
                    <div className="space-y-2.5">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declarationChecks.check1}
                          onChange={(e) => setDeclarationChecks({ ...declarationChecks, check1: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-[#004B87] rounded cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-slate-700 leading-snug">
                          I confirm that the annual emission data provided is complete, true and accurate to the best of my knowledge.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declarationChecks.check2}
                          onChange={(e) => setDeclarationChecks({ ...declarationChecks, check2: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-[#004B87] rounded cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-slate-700 leading-snug">
                          I understand that submitting false or misleading information may result in regulatory action by the Environment Agency – Abu Dhabi.
                        </span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declarationChecks.check3}
                          onChange={(e) => setDeclarationChecks({ ...declarationChecks, check3: e.target.checked })}
                          className="w-4 h-4 mt-0.5 text-[#004B87] rounded cursor-pointer shrink-0"
                        />
                        <span className="text-xs text-slate-700 leading-snug">
                          I agree to submit this Annual Emission Data to the Environment Agency – Abu Dhabi.
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1 text-xs">Name</label>
                        <input
                          type="text"
                          value={declarationForm.name}
                          placeholder="Enter full name of authorized operator"
                          onChange={(e) => setDeclarationForm({ ...declarationForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1 text-xs">Designation</label>
                        <input
                          type="text"
                          value={declarationForm.designation}
                          placeholder="Enter job designation / title"
                          onChange={(e) => setDeclarationForm({ ...declarationForm, designation: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1 text-xs">Date</label>
                        <input
                          type="text"
                          value={declarationForm.date}
                          readOnly
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Bottom Action Buttons */}
      <div className="flex-shrink-0 pt-2 pb-1 flex items-center justify-end gap-2.5">
        <button
          onClick={() => setViewMode('table')}
          className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-[#0F2942] hover:bg-[#0A1D30] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Save Draft</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isDeclarationComplete}
          title={isDeclarationComplete ? 'Submit Annual Emission Data' : 'Please check all final declaration boxes and fill name/designation to submit'}
          className={`px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isDeclarationComplete
              ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white hover:from-[#003d6e] hover:to-[#005c9e] shadow-md shadow-[#004B87]/20 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
          }`}
        >
          <Send className={`w-3.5 h-3.5 ${isDeclarationComplete ? 'text-white fill-current' : 'text-slate-400'}`} />
          <span>Submit Annual Emission Data</span>
        </button>
      </div>

      {/* Document Preview Modal */}
      {previewModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#004B87]" />
                <h3 className="text-sm font-bold text-slate-800 truncate">{previewModalFile.name}</h3>
              </div>
              <button
                onClick={() => setPreviewModalFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#004B87] flex items-center justify-center mx-auto border border-sky-100">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{previewModalFile.name}</h4>
                <p className="text-xs text-slate-500 mt-1">EAD MRV Supporting Architecture & Procedure Document</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Status:</span>
                  <span className="font-semibold text-emerald-600">Attached & Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security:</span>
                  <span className="font-semibold text-slate-700">AES-256 Encrypted</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewModalFile(null)}
                className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003B6B] transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
