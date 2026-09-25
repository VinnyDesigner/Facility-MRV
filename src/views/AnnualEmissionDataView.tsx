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
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMRV } from '../context/MRVContext';
import { formatVersion } from '../types/mrv';
import { MonitoringMethodsTab } from '../components/monitoring/MonitoringMethodsTab';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import { SortTriangles } from '../components/ui/SortTriangles';
import emptyFolderIcon from '../assets/empty-folder-icon.png';

const ANNUAL_EMISSION_STEPS = [
  { id: 'monitoring-methods', stepNumber: 1, title: 'Monitoring Methods' },
  { id: 'mitigation-measures', stepNumber: 2, title: 'Mitigation Measures' },
  { id: 'qa-qc', stepNumber: 3, title: 'Data Management & QA/QC' },
  { id: 'review-submit', stepNumber: 4, title: 'Support Documents & Submit' },
] as const;

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
    facilityEmissions,
    setFacilityEmissions,
    operatorEmissionIds,
    setOperatorEmissionIds,
    operatorFacilityIds,
    facilityPlans,
    facilityMonitoringPlanStatuses,
    facilityRegistrations,
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
  const [reviewerComments, setReviewerComments] = useState('');
  const [activeReviewModal, setActiveReviewModal] = useState<'approve' | 'reject' | 'revert' | null>(null);

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
    return Object.entries(facilityEmissions)
      .filter(([facId]) => {
        if (isFacilityOperator) {
          return operatorEmissionIds.includes(facId);
        }
        return true;
      })
      .filter(([facId, rec]) => {
        const matchesSearch =
          (rec.facilityName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
          (rec.facilityId || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
          (rec.operatorName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
          (rec.businessSector || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
          (rec.primaryActivity || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'Approved' && (rec.status === 'Approved' || rec.status === 'Verified' || rec.status === 'EAD Approved')) ||
          (statusFilter === 'Submitted' && (rec.status === 'Submitted' || rec.status?.includes('Submitted'))) ||
          (statusFilter === 'Draft' && (rec.status === 'Draft' || rec.status?.includes('Draft'))) ||
          (rec.status || '').toLowerCase() === statusFilter.toLowerCase();

        const matchesYear =
          yearFilter === 'ALL' ||
          rec.reportingYear === yearFilter;

        return matchesSearch && matchesStatus && matchesYear;
      });
  }, [facilityEmissions, tableSearchTerm, statusFilter, yearFilter, isFacilityOperator, operatorEmissionIds, operatorFacilityIds]);

  // Overview Table Sorting & Pagination
  type EmissionSortField = 'index' | 'name' | 'id' | 'year' | 'emissions' | 'submittedDate' | 'status';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<EmissionSortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: EmissionSortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const sortedTableList = useMemo(() => {
    if (sortField === 'index') {
      return sortDirection === 'asc' ? filteredTableList : [...filteredTableList].reverse();
    }
    return [...filteredTableList].sort(([, a], [, b]) => {
      const nameA = (a.facilityName || '').toLowerCase();
      const nameB = (b.facilityName || '').toLowerCase();

      const idA = (a.facilityId || '').toLowerCase();
      const idB = (b.facilityId || '').toLowerCase();

      const yearA = parseInt(a.reportingYear || '0', 10);
      const yearB = parseInt(b.reportingYear || '0', 10);

      const parseNum = (val: string | number | undefined | null) => {
        if (!val) return 0;
        const cleaned = String(val).replace(/,/g, '').trim();
        const n = parseFloat(cleaned);
        return isNaN(n) ? 0 : n;
      };
      const emissA = parseNum(a.totalScope1);
      const emissB = parseNum(b.totalScope1);

      const dateA = a.submittedDate && a.submittedDate !== '—' ? new Date(a.submittedDate).getTime() : 0;
      const dateB = b.submittedDate && b.submittedDate !== '—' ? new Date(b.submittedDate).getTime() : 0;

      const statusA = (a.status || '').toLowerCase();
      const statusB = (b.status || '').toLowerCase();

      let cmp = 0;
      if (sortField === 'name') cmp = nameA.localeCompare(nameB);
      else if (sortField === 'id') cmp = idA.localeCompare(idB);
      else if (sortField === 'year') cmp = yearA - yearB;
      else if (sortField === 'emissions') cmp = emissA - emissB;
      else if (sortField === 'submittedDate') cmp = dateA - dateB;
      else if (sortField === 'status') cmp = statusA.localeCompare(statusB);

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredTableList, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTableList.length / itemsPerPage) || 1;

  const paginatedEmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTableList, currentPage, itemsPerPage]);

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
  const [supportingDocsFiles, setSupportingDocsFiles] = useState<{ id: string; name: string; size: string; uploadDate: string }[]>([
    { id: 'doc-1', name: 'Third-Party-Verification-Statement-2026.pdf', size: '2.4 MB', uploadDate: '21 Sept 2026' },
    { id: 'doc-2', name: 'CEMS-Calibration-Logs-2026.pdf', size: '1.8 MB', uploadDate: '21 Sept 2026' },
  ]);
  const supportingDocsInputRef = useRef<HTMLInputElement>(null);
  const [previewModalFile, setPreviewModalFile] = useState<{ name: string } | null>(null);

  const handleSupportingDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newItems = Array.from(files).map((f) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadDate: nowStr,
    }));
    setSupportingDocsFiles((prev) => [...prev, ...newItems]);
  };

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
    setSupportingDocsFiles(
      rec.supportingDocsFiles ||
        (rec.isNew
          ? []
          : [
              { id: 'doc-1', name: 'Third-Party-Verification-Statement-2026.pdf', size: '2.4 MB', uploadDate: '21 Sept 2026' },
              { id: 'doc-2', name: 'CEMS-Calibration-Logs-2026.pdf', size: '1.8 MB', uploadDate: '21 Sept 2026' },
            ])
    );
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

  // Flow 1: Create New Annual Emission Data Record (Initialized with Unique Key)
  const handleEnterEmissionData = () => {
    const newEmissionId = `emiss-${Date.now()}`;
    const operatorFacilities = isFacilityOperator
      ? (operatorFacilityIds.length > 0 ? facilities.filter((f) => operatorFacilityIds.includes(f.id)) : facilities)
      : facilities;

    const targetFacility =
      operatorFacilities.find((f) => f.id === activeFacility?.id) ||
      operatorFacilities[0] ||
      facilities[0];

    const reg = (targetFacility && facilityRegistrations[targetFacility.id]) || {};
    const numCode = Math.floor(1000 + Math.random() * 9000).toString();
    const facilityCode = reg.facilityId || targetFacility?.facilityCode || `FAC-EAD-2026-${numCode}`;

    const blankRecord = {
      facilityName: reg.facilityName || targetFacility?.name || 'Registered Facility',
      facilityId: facilityCode,
      operatorName: reg.operatorName || targetFacility?.operatorName || 'Authorized Operator',
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
      businessSector: reg.reportingSector || targetFacility?.sector || 'Energy',
      primaryActivity: reg.primaryActivity || targetFacility?.primaryActivity || '',
      operationalStatus: 'Operational',
      monitoringPlanRef: `MP-2026-${numCode} (Approved)`,
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
      supportingDocsFiles: [],
      declarationChecks: { check1: false, check2: false, check3: false },
      declarationForm: { name: '', designation: '', date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
    };

    setFacilityEmissions((prev) => ({
      ...prev,
      [newEmissionId]: blankRecord,
    }));
    setSelectedFacilityId(newEmissionId);
    setOperatorEmissionIds((prev) => (prev.includes(newEmissionId) ? prev : [...prev, newEmissionId]));
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
      setReviewerComments(rec.reviewerComments || rec.reviewNotes || '');
    }
    setViewMode('view');
  };

  const handleApproveEmission = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        status: 'Approved',
        reviewerComments: reviewerComments || 'All statutory emission parameters and Scope 1 calculations verified under EAD MRV Guidelines.',
        reviewedDate: todayStr,
        updatedDate: todayStr,
      },
    }));
    setActiveReviewModal(null);
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Approved — Official Certificate Issued!');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#0878C9', '#19B5D8'],
    });
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleRejectEmission = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        status: 'Rejected',
        reviewerComments: reviewerComments || 'Formal rejection under EAD regulatory guidelines due to unresolved discrepancies.',
        reviewedDate: todayStr,
        updatedDate: todayStr,
      },
    }));
    setActiveReviewModal(null);
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Formally Rejected');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleRevertEmission = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        status: 'Reverted',
        reviewerComments: reviewerComments || 'Please provide required corrections for reported emission figures or supporting attachments.',
        eadCorrectionDate: todayStr,
        updatedDate: todayStr,
      },
    }));
    setActiveReviewModal(null);
    setIsSavedNotice(true);
    setNoticeMessage('Emission Data Reverted to Facility Operator for Correction');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const isDeclarationComplete = Boolean(
    declarationChecks.check1 &&
    declarationChecks.check2 &&
    declarationChecks.check3 &&
    declarationForm.name.trim() &&
    declarationForm.designation.trim()
  );

  const handleSave = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
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
        supportingDocsFiles,
        declarationChecks,
        declarationForm,
        status: 'Draft',
        updatedDate: todayStr,
      },
    }));
    setOperatorEmissionIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setAnnualEmissionStatus?.('Draft');
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Saved as Draft!');
    setTimeout(() => setIsSavedNotice(false), 3000);
    setViewMode('table');
  };

  const handleSubmit = () => {
    if (!isDeclarationComplete) return;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFacilityEmissions((prev) => ({
      ...prev,
      [selectedFacilityId]: {
        ...(prev[selectedFacilityId] || currentRecord),
        status: 'Submitted',
        submittedDate: todayStr,
        updatedDate: todayStr,
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
        supportingDocsFiles,
        declarationChecks,
        declarationForm,
      },
    }));
    setOperatorEmissionIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setAnnualEmissionStatus?.('Submitted');
    setVerificationStatus?.('Verification In Progress');
    setIsSavedNotice(true);
    setNoticeMessage('Annual Emission Data Submitted for Third-Party Verification!');
    setTimeout(() => setIsSavedNotice(false), 3500);
    setViewMode('table');
  };

  const handleDeleteEmissionData = (facId: string, facilityName: string) => {
    if (window.confirm(`Are you sure you want to delete draft emission data for "${facilityName}"?`)) {
      setFacilityEmissions((prev) => {
        const copy = { ...prev };
        delete copy[facId];
        return copy;
      });
      setOperatorEmissionIds((prev) => prev.filter((id) => id !== facId));
      setIsSavedNotice(true);
      setNoticeMessage('Draft Emission Data Deleted');
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    // Clean Empty State for Data Provider with no annual emission record
    if (isFacilityOperator && operatorEmissionIds.length === 0 && !tableSearchTerm && statusFilter === 'ALL' && yearFilter === 'ALL') {
      return (
        <div className="h-full flex flex-col font-sans py-1">
          {/* Header */}
          <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Annual Emission Data
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Facility GHG Emissions Data — Annual activity data, calculated Scope 1 emissions, and third-party verification workflow
              </p>
            </div>
          </div>

          {/* White Color Frame till half */}
          <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center text-center max-w-md">
              <img
                src={emptyFolderIcon}
                alt="No Annual Emission Data"
                className="w-[84px] h-[74px] object-contain mb-3.5 select-none"
                draggable={false}
              />

              <h2 className="text-[15px] font-bold text-[#336D9F] tracking-tight">
                No Annual Emission Data
              </h2>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1 max-w-sm">
                You don’t have any annual emission data submitted yet. Please enter your annual emission data to continue.
              </p>

              <button
                onClick={handleEnterEmissionData}
                className="mt-4 h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Enter Annual Emission Data</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Enter Data Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Annual Emission Data
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              {isEadReviewerOrAdmin
                ? 'Regulated Facilities GHG Emissions & Statutory Reporting Oversight'
                : 'Facility GHG Emissions Data — Annual activity data, calculated Scope 1 emissions, and third-party verification workflow'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <FieldTooltip content="Filter records by facility name, facility ID, or operator name.">
                <input
                  type="text"
                  placeholder="Search by facility, ID, operator..."
                  value={tableSearchTerm}
                  onChange={(e) => {
                    setTableSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-9 pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                />
              </FieldTooltip>
              {tableSearchTerm && (
                <button
                  onClick={() => {
                    setTableSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer z-10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FieldTooltip content="Filter submissions by workflow approval status.">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-28 sm:w-36 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Reverted">Reverted</option>
                </select>
              </FieldTooltip>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <FieldTooltip content="Filter annual emission reports by reporting compliance year.">
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-24 sm:w-26 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-[8px] text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </FieldTooltip>
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
                className="h-9 px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-[8px] border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Enter Emission Data Button (Only for Data Provider) */}
            {isFacilityOperator && (
              <button
                onClick={handleEnterEmissionData}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-[8px] text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Enter Emission Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Table & Pagination Container (Without outer white card background) */}
        <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs select-none">
                <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                  <th
                    onClick={() => handleSort('index')}
                    className="h-[38px] px-3 w-[5%] text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Number"
                  >
                    <div className="flex items-center justify-center">
                      <span>#</span>
                      <SortTriangles active={sortField === 'index'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="h-[38px] px-3 w-[18%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Facility Name"
                  >
                    <div className="flex items-center">
                      <span>Facility Name</span>
                      <SortTriangles active={sortField === 'name'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('id')}
                    className="h-[38px] px-3 w-[16%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Facility ID"
                  >
                    <div className="flex items-center">
                      <span>Facility ID</span>
                      <SortTriangles active={sortField === 'id'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('year')}
                    className="h-[38px] px-3 w-[12%] whitespace-nowrap text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Reporting Year"
                  >
                    <div className="flex items-center justify-center">
                      <span>Reporting Year</span>
                      <SortTriangles active={sortField === 'year'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('emissions')}
                    className="h-[38px] px-3 w-[18%] whitespace-nowrap text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Total Scope 1 Emissions"
                  >
                    <div className="flex items-center justify-center">
                      <span>Total Scope 1 (tCO₂e)</span>
                      <SortTriangles active={sortField === 'emissions'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('submittedDate')}
                    className="h-[38px] px-3 w-[14%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Submitted Date"
                  >
                    <div className="flex items-center">
                      <span>Submitted Date</span>
                      <SortTriangles active={sortField === 'submittedDate'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="h-[38px] px-2.5 w-[11%] whitespace-nowrap text-left align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Status"
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      <SortTriangles active={sortField === 'status'} direction={sortDirection} />
                    </div>
                  </th>
                  <th className="h-[38px] px-3 w-[6%] text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedEmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-[60px] py-8 text-center text-slate-400 font-normal align-middle">
                      No annual emission records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEmissions.map(([facId, rec], idx) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                    return (
                      <tr
                        key={facId}
                        className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                      >
                        <td className="h-[60px] px-3 text-center font-mono font-normal text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* Facility Name */}
                        <td className="h-[60px] px-3 font-normal text-slate-800 leading-snug align-middle">
                          <span>{rec.facilityName}</span>
                        </td>

                        {/* Facility ID */}
                        <td className="h-[60px] px-3 font-mono text-[#004B87] font-bold whitespace-nowrap align-middle">
                          {rec.facilityId ? <span className="font-bold tracking-tight">{rec.facilityId}</span> : <span className="text-slate-400 font-normal">—</span>}
                        </td>

                        {/* Reporting Year */}
                        <td className="h-[60px] px-3 text-center font-normal text-slate-700 whitespace-nowrap align-middle">
                          {rec.reportingYear || '2026'}
                        </td>

                        {/* Total Scope 1 (tCO₂e) */}
                        <td className="h-[60px] px-3 font-mono font-normal text-[#004B87] text-center whitespace-nowrap align-middle">
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
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal whitespace-nowrap inline-block ${
                              rec.status === 'Approved' || rec.status === 'Verified' || rec.status === 'EAD Approved'
                                ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                : rec.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                                : rec.status === 'Reverted' || rec.status === 'Correction Required'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                                : rec.status === 'Submitted' || rec.status?.includes('Submitted')
                                ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {rec.status === 'Approved' || rec.status === 'Verified' || rec.status === 'EAD Approved'
                              ? 'Approved'
                              : rec.status === 'Rejected'
                              ? 'Rejected'
                              : rec.status === 'Reverted' || rec.status === 'Correction Required'
                              ? 'Reverted'
                              : rec.status === 'Submitted' || rec.status?.includes('Submitted')
                              ? 'Submitted'
                              : 'Draft'}
                          </span>
                        </td>

                        {/* Actions: View / Edit / Delete for Operator vs View / Review for Admin */}
                        <td className="h-[60px] px-3 text-center whitespace-nowrap align-middle">
                          {isFacilityOperator ? (
                            <div className="flex items-center justify-center gap-1.5 w-[76px] mx-auto">
                              {/* Slot 1: View */}
                              <button
                                onClick={() => handleViewEmissionData(facId)}
                                title="View Annual Emission Details"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Slot 2: Edit */}
                              <button
                                onClick={() => handleEditEmissionData(facId)}
                                title="Edit Annual Emission Data"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Slot 3: Delete (Only for Draft status, empty slot otherwise) */}
                              {rec.status === 'Draft' || !rec.status ? (
                                <button
                                  onClick={() => handleDeleteEmissionData(facId, rec.facilityName || 'Draft Emission Record')}
                                  title="Delete Draft Emission Data"
                                  className="w-6 h-6 flex items-center justify-center rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <div className="w-6 h-6 shrink-0" aria-hidden="true" />
                              )}
                            </div>
                          ) : (
                            /* Admin Actions: Inspection & Review */
                            <div className="flex items-center justify-center mx-auto">
                              <button
                                onClick={() => handleViewEmissionData(facId)}
                                title="Review & Audit Emission Dossier"
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-[#E9F1F8] transition-colors cursor-pointer shrink-0"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          )}
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
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
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
        {/* Top Header Bar with Title, Status Chip, Facility Name, and Reporting Year Below Title */}
        <div className="flex-shrink-0 flex flex-col gap-2 pb-3.5 pt-0.5">
          {/* Row 1: Back Arrow, Title, Status Chip, Read-Only Badge, Save Notice & Edit Data Button */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setViewMode('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Annual Emission Data
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                  currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                    : currentRecord.status === 'Rejected'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                    : currentRecord.status === 'Reverted' || currentRecord.status === 'Correction Required'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]'
                    : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                    ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                  ? 'Approved'
                  : currentRecord.status === 'Rejected'
                  ? 'Rejected'
                  : currentRecord.status === 'Reverted' || currentRecord.status === 'Correction Required'
                  ? 'Reverted'
                  : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                  ? 'Submitted'
                  : 'Draft'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {isSavedNotice && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{noticeMessage}</span>
                </div>
              )}

              {isFacilityOperator && (
                <button
                  onClick={() => setViewMode('form')}
                  className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Facility Name & Calendar Year below title (Consistent with Create/Edit Form) */}
          <div className="flex items-center gap-4 flex-wrap pt-0.5">
            {/* Facility Name Field (Read-Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
              <div className="relative">
                <FieldTooltip content="Name of the reporting industrial facility.">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={currentRecord.facilityName || ''}
                    className="w-64 sm:w-80 h-9 px-3.5 bg-[#F1F5F9] border border-slate-200/90 rounded-xl text-xs text-slate-800 font-bold shadow-2xs cursor-not-allowed select-none"
                  />
                </FieldTooltip>
              </div>
            </div>

            {/* Calendar Year Field (Read-Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Calendar Year</label>
              <div className="relative">
                <FieldTooltip content="Designated statutory MRV reporting compliance calendar year.">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={currentRecord.reportingYear || '2026'}
                    className="w-36 h-9 px-3.5 bg-[#F1F5F9] border border-slate-200/90 rounded-xl text-xs text-slate-800 font-bold shadow-2xs cursor-not-allowed select-none"
                  />
                </FieldTooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container on White Frame with 4-Tab Navigation */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Sticky Tabs Navigation Bar (Fixed at top, outside scroll area) */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
              {ANNUAL_EMISSION_STEPS.map((step, idx) => {
                const subTabOrder = [
                  'monitoring-methods',
                  'mitigation-measures',
                  'qa-qc',
                  'review-submit',
                ];
                const currentStepNum = subTabOrder.indexOf(activeTab) + 1;
                const isActive = step.stepNumber === currentStepNum;
                const isCompleted = step.stepNumber < currentStepNum;
                const isArrowHighlighted = idx < currentStepNum - 1;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(step.id as any)}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                          : isCompleted
                          ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      {/* Numbered Circle */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                          isActive
                            ? 'bg-white text-[#004B87] shadow-2xs'
                            : isCompleted
                            ? 'bg-[#00875A] text-white shadow-2xs'
                            : 'bg-white text-slate-400 border border-slate-300'
                        }`}
                      >
                        <span>{step.stepNumber}</span>
                      </div>

                      {/* Step Title */}
                      <span className="whitespace-nowrap">{step.title}</span>
                    </button>

                    {/* Arrow Indication between steps (Highlighted once finished) */}
                    {idx < ANNUAL_EMISSION_STEPS.length - 1 && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                          isArrowHighlighted ? 'text-[#004B87] stroke-[2.5]' : 'text-slate-300'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Read-Only Inspection Mode</span>
            </div>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-2.5 pt-2 pb-0.5 text-xs custom-scrollbar">
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
                                <td colSpan={11} className="py-6 text-center text-slate-400 font-normal">
                                  No greenhouse gas mitigation measures recorded for this facility.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.mitigationMeasures.map((m: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2 px-3 font-normal text-slate-900">{m.description || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.category || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.scope || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.ghg || '—'}</td>
                                  <td className="py-2 px-3 text-slate-800">{m.startYear || '—'}</td>
                                  <td className="py-2 px-3">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      {m.status || 'Planned'}
                                    </span>
                                  </td>
                                  <td className="py-2 px-3 text-slate-800">{m.preMeasureRef || '—'}</td>
                                  <td className="py-2 px-3 font-mono font-normal text-[#004B87]">{m.reportingYearReduction ? `${m.reportingYearReduction} tCO₂e/yr` : '—'}</td>
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
                                <td colSpan={6} className="py-5 text-center text-slate-400 font-normal">
                                  No data gaps reported for this reporting period.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaDataGaps.map((gap: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-normal text-slate-900">{gap.sourceStream || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{gap.fromDate || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{gap.untilDate || '—'}</td>
                                  <td className="py-2.5 px-3 text-slate-800">{gap.description || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono font-normal text-[#004B87]">{gap.estimatedEmissions ? `${gap.estimatedEmissions} tCO₂e` : '—'}</td>
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
                                <td colSpan={2} className="py-5 text-center text-slate-400 font-normal">
                                  No management responsibilities defined.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaManagementResp.map((resp: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-normal text-slate-900">{resp.jobTitle || '—'}</td>
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
                                <td colSpan={5} className="py-5 text-center text-slate-400 font-normal">
                                  No QA procedures configured.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.qaProcedures.map((proc: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-normal text-slate-900">{proc.procedureTitle || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[#004B87] font-normal">{proc.reference || '—'}</td>
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
                                    <p className="text-xs font-normal text-slate-800 truncate">{f.name}</p>
                                    <p className="text-[10px] text-slate-500">{f.size} • {f.uploadDate}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalFile({ name: f.name })}
                                  className="px-2.5 py-1 text-slate-600 hover:text-[#004B87] hover:bg-white rounded-md text-xs font-normal flex items-center gap-1 border border-slate-200 cursor-pointer"
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
                                <td colSpan={5} className="py-5 text-center text-slate-400 font-normal">
                                  No internal review procedures configured.
                                </td>
                              </tr>
                            ) : (
                              currentRecord.internalReviewProcedures.map((proc: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2.5 px-3 font-normal text-slate-900">{proc.procedureTitle || '—'}</td>
                                  <td className="py-2.5 px-3 font-mono text-[#004B87] font-normal">{proc.reference || '—'}</td>
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

              {/* TAB 4: SUPPORT DOCUMENTS & SUBMIT (READ-ONLY) */}
              {activeTab === 'review-submit' && (
                <div className="space-y-4 pt-1">
                  {/* Supporting Documents (Facility Registration Style) */}
                  <div>
                    <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">
                      Supporting Documents
                    </h4>
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                      {supportingDocsFiles && supportingDocsFiles.length > 0 ? (
                        supportingDocsFiles.map((file: any, idx: number) => (
                          <div
                            key={file.id || idx}
                            className="border border-slate-200 bg-white rounded-lg py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px]"
                          >
                            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-rose-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                {file.name}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                                <span>{file.size}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-bold">{file.status || 'Verified'}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPreviewModalFile(file)}
                              className="p-1 text-slate-400 hover:text-[#004B87] hover:bg-sky-50 rounded-md transition-colors cursor-pointer shrink-0"
                              title="Preview file"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No files attached</span>
                      )}
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

            {/* Sticky Reviewer Comments & Regulatory Decision (Sticky at bottom of card for ALL tabs in Admin/Reviewer view) */}
            {!isFacilityOperator && (
              <div className="flex-shrink-0 pt-2.5 mt-2 border-t border-slate-200">
                <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                  <div className="px-3.5 py-2 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#336D9F]" />
                      <span className="text-xs font-bold text-[#336D9F]">Reviewer Comments & Compliance Evaluation</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white space-y-2.5">
                    <FieldTooltip content="Enter regulatory compliance remarks, observations, clarification requests, or reason for decision.">
                      <textarea
                        rows={2}
                        value={reviewerComments}
                        onChange={(e) => setReviewerComments(e.target.value)}
                        placeholder="Enter reviewer comments, audit findings, clarification requests, or decision rationale..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] focus:bg-white shadow-2xs leading-relaxed resize-none font-medium"
                      />
                    </FieldTooltip>

                    {/* 3 Decision Buttons inside Frame for Submitted records */}
                    {(currentRecord.status === 'Submitted' || currentRecord.status === 'Under Review') && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActiveReviewModal('revert')}
                          className="px-5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                          title="Revert emission data to facility operator for correction"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                          <span>Revert</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveReviewModal('reject')}
                          className="px-5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-xs font-bold text-rose-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                          title="Reject annual emission submission"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Reject</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveReviewModal('approve')}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer active:scale-95"
                          title="Approve annual emission report and issue compliance certificate"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons for View Mode (Outside White Frame) */}
          <div className="flex-shrink-0 pt-2.5 pb-1 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Cancel</span>
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Stepper Navigation for Data Provider only */}
            {isFacilityOperator && (
              <>
                {activeTab === 'monitoring-methods' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('mitigation-measures')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeTab === 'mitigation-measures' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('qa-qc')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeTab === 'qa-qc' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('review-submit')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeTab === 'review-submit' && (
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Overview Table</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

  // =========================================================================
  // 3. EDIT / ADD FORM VIEW (viewMode === 'form')
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
      {/* Top Header Bar with Title, Status Chip, Facility Name, and Reporting Year Below Title */}
      <div className="flex-shrink-0 flex flex-col gap-2 pb-3.5 pt-0.5">
        {/* Row 1: Back Arrow, Title, Status Chip, and Save Notice */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setViewMode('table')}
              className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Annual Emission Data
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentRecord.status === 'Approved' || currentRecord.status === 'Verified' || currentRecord.status === 'EAD Approved'
                ? 'Approved'
                : currentRecord.status === 'Submitted' || currentRecord.status?.includes('Submitted')
                ? 'Submitted'
                : 'Draft'}
            </span>
          </div>

          {isSavedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{noticeMessage}</span>
            </div>
          )}
        </div>

        {/* Row 2: Facility Name & Calendar Year below title (Image Style) */}
        <div className="flex items-center gap-4 flex-wrap pt-0.5">
          {/* Facility Name Input Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
            <div className="relative">
              <FieldTooltip content="Name of the reporting industrial facility.">
                <input
                  type="text"
                  value={currentRecord.facilityName || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, facilityName: val }));
                  }}
                  placeholder="Enter facility name"
                  className="w-64 sm:w-80 h-9 px-3.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#004B87] shadow-2xs"
                />
              </FieldTooltip>
            </div>
          </div>

          {/* Calendar Year Select with Chevron Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Calendar Year</label>
            <div className="relative">
              <FieldTooltip content="Designated statutory MRV reporting compliance calendar year.">
                <select
                  value={formReportingYear}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormReportingYear(val);
                    updateCurrentRecord((r) => ({ ...r, reportingYear: val }));
                  }}
                  className="w-36 h-9 px-3.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-[#004B87] shadow-2xs appearance-none pr-8 cursor-pointer"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </FieldTooltip>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container on White Frame (Enclosing Tab Navigation at the top) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Sticky Tabs Navigation Bar (Fixed at top, outside scroll area) */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {ANNUAL_EMISSION_STEPS.map((step, idx) => {
              const subTabOrder = [
                'monitoring-methods',
                'mitigation-measures',
                'qa-qc',
                'review-submit',
              ];
              const currentStepNum = subTabOrder.indexOf(activeTab) + 1;
              const isActive = step.stepNumber === currentStepNum;
              const isCompleted = step.stepNumber < currentStepNum;
              const isArrowHighlighted = idx < currentStepNum - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(step.id as any)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    {/* Numbered Circle */}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-white text-[#004B87] shadow-2xs'
                          : isCompleted
                          ? 'bg-[#00875A] text-white shadow-2xs'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                    >
                      <span>{step.stepNumber}</span>
                    </div>

                    {/* Step Title */}
                    <span className="whitespace-nowrap">{step.title}</span>
                  </button>

                  {/* Arrow Indication between steps (Highlighted once finished) */}
                  {idx < ANNUAL_EMISSION_STEPS.length - 1 && (
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                        isArrowHighlighted ? 'text-[#004B87] stroke-[2.5]' : 'text-slate-300'
                      }`}
                    />
                  )}
                </React.Fragment>
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
        <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-2.5 pt-2 pb-0.5 text-xs custom-scrollbar">
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
                                  <FieldTooltip content="Description of emissions mitigation or energy conservation measure." example="Waste Heat Recovery System">
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
                                  </FieldTooltip>
                                </td>

                                {/* Category */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Category of mitigation action (e.g., Energy Efficiency, Fuel Switching).">
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
                                  </FieldTooltip>
                                </td>

                                {/* Scope (1 / 2 / 3) */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="GHG accounting scope classification (Scope 1, 2, or 3).">
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
                                  </FieldTooltip>
                                </td>

                                {/* GHG */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Primary greenhouse gas targeted for reduction (CO₂, CH₄, N₂O, etc.).">
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
                                  </FieldTooltip>
                                </td>

                                {/* Start year */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Calendar year when implementation of the measure commenced." example="2026">
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
                                  </FieldTooltip>
                                </td>

                                {/* Status */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Operational or planning stage of the mitigation project.">
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
                                  </FieldTooltip>
                                </td>

                                {/* Pre-measure reference */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Baseline reference emissions rate before implementation." unit="tCO₂e/yr" example="4,200">
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
                                  </FieldTooltip>
                                </td>

                                {/* Reporting year reduction */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Measured or estimated GHG reduction achieved in reporting year." unit="tCO₂e/yr" example="3,850">
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
                                  </FieldTooltip>
                                </td>

                                {/* Expected annual reduction */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Total anticipated ongoing annual GHG abatement." unit="tCO₂e/yr" example="4,000">
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
                                  </FieldTooltip>
                                </td>

                                {/* Methodology / standard */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Standard protocol or engineering calculation used to quantify reduction." example="ISO 50001 Energy Balance">
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
                                  </FieldTooltip>
                                </td>

                                {/* Verification */}
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Verification status of the mitigation savings claim.">
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
                                  </FieldTooltip>
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
                  <FieldTooltip content="Provide any other relevant mitigation details, technology descriptions, or N/A.">
                    <textarea
                      rows={3}
                      value={mitigationAdditionalInfo}
                      placeholder="Please provide any other relevant mitigation details, or enter N/A..."
                      onChange={(e) => setMitigationAdditionalInfo(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                    />
                  </FieldTooltip>
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
                  <FieldTooltip content="Detailed description of the internal QA/QC methodology applied for all source streams and sources.">
                    <textarea
                      rows={4}
                      value={qaVerificationDesc}
                      placeholder="Provide a detailed description of the internal QA/QC methodology applied for all source streams and sources..."
                      onChange={(e) => setQaVerificationDesc(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                    />
                  </FieldTooltip>
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
                                  <FieldTooltip content="Source stream ID or emission point experiencing the data gap." example="S05 - Flare Vent">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Start date of data gap outage period." format="DD-MMM-YYYY" example="01-Jan-2026">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="End date of data gap outage period." format="DD-MMM-YYYY" example="15-Jan-2026">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Explanation of root cause and estimation method applied." example="CEMS downtime">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Conservative estimated GHG emissions during data gap." unit="t CO₂e" example="12.40">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Surrogate data source or historical benchmark applied." example="Similar period avg">
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
                                  </FieldTooltip>
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
                                  <FieldTooltip content="Organizational job title or designated role." example="GHG Manager">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Specific MRV compliance and data governance responsibilities." example="Supervise MRV operations, review activity registers">
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
                                  </FieldTooltip>
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
                                  <FieldTooltip content="Formal title of written quality assurance procedure." example="ETS QA/QC of MI">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Document control reference code." format="EAD_QA_QC_XX" example="EAD_QA_QC_01">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Summary of quality assurance controls and calibration checks.">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Internal operating department executing the procedure." example="Measurement & Control">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Physical or digital storage location of QA logs and calibration certificates." example="QA/QC Records Archive">
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
                                  </FieldTooltip>
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
                          <FieldTooltip content="Upload schematics, calibration flowcharts, or QA procedure diagrams.">
                            <button
                              type="button"
                              onClick={() => qaDiagramInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Upload Diagram / Supporting File
                            </button>
                          </FieldTooltip>
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
                                  <FieldTooltip content="Title of four-eye internal data review procedure." example="ETS Data Validation">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Internal standard operating procedure reference code." example="EAD_VAL_01">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Summary of data review and validation workflow steps.">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Department responsible for independent review." example="Measurement & Control">
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
                                  </FieldTooltip>
                                </td>
                                <td className="py-2 px-3">
                                  <FieldTooltip content="Secure repository where signed validation logs are archived." example="Validation Records Archive">
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
                                  </FieldTooltip>
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
                          <FieldTooltip content="Upload validation workflows, review trees, or schematic files.">
                            <button
                              type="button"
                              onClick={() => internalReviewInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004B87] hover:bg-[#003B6B] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Upload Diagram / Supporting File
                            </button>
                          </FieldTooltip>
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
                  <FieldTooltip content="Enter any additional quality control or quality assurance details, or note N/A.">
                    <textarea
                      rows={4}
                      value={qaFurtherDetails}
                      onChange={(e) => setQaFurtherDetails(e.target.value)}
                      placeholder="Enter any additional quality control / quality assurance details..."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed"
                    />
                  </FieldTooltip>
                </div>
              </div>
            )}

            {/* TAB 4: SUPPORT DOCUMENTS & SUBMIT */}
            {activeTab === 'review-submit' && (
              <div className="space-y-4 pt-1">
                {/* Supporting Documents Upload (Facility Registration Style) */}
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">
                    Supporting Documents
                  </h4>
                  <FieldTooltip content="Upload official statutory attachments including verification statements, CEMS calibration logs, lab reports, or calculation sheets." format="PDF, PNG, JPG, XLSX (Max 25MB)">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                      {/* Upload Input Area */}
                      <div
                        onClick={() => supportingDocsInputRef.current?.click()}
                        className="border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 rounded-lg px-4 py-2 flex items-center justify-between gap-3 shrink-0 cursor-pointer transition-colors min-w-[280px]"
                      >
                        <input
                          type="file"
                          ref={supportingDocsInputRef}
                          multiple
                          className="hidden"
                          onChange={handleSupportingDocsUpload}
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                        />
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                          <span className="whitespace-nowrap">Drag and drop files here or upload</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            supportingDocsInputRef.current?.click();
                          }}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
                        >
                          Upload
                        </button>
                      </div>

                      {/* Remaining area: Uploaded documents in horizontal scrolling chips */}
                      <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                        {supportingDocsFiles && supportingDocsFiles.length > 0 ? (
                          supportingDocsFiles.map((file: any, idx: number) => (
                            <div
                              key={file.id || idx}
                              className="border border-slate-200 bg-white rounded-lg py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px] hover:border-slate-300 transition-all"
                            >
                              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                  {file.name}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                                  <span>{file.size}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span className="text-emerald-600 font-bold">{file.status || 'Completed'}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setSupportingDocsFiles((prev) => prev.filter((_: any, i: number) => i !== idx))
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                                title="Remove file"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No files attached yet</span>
                        )}
                      </div>
                    </div>
                  </FieldTooltip>
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
                        <FieldTooltip content="Full legal name of authorized facility operator representative." example="Ahmed Al-Zaabi">
                          <input
                            type="text"
                            value={declarationForm.name}
                            placeholder="Enter full name of authorized operator"
                            onChange={(e) => setDeclarationForm({ ...declarationForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </FieldTooltip>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1 text-xs">Designation</label>
                        <FieldTooltip content="Official corporate designation or title of signatory." example="Senior Compliance & MRV Lead">
                          <input
                            type="text"
                            value={declarationForm.designation}
                            placeholder="Enter job designation / title"
                            onChange={(e) => setDeclarationForm({ ...declarationForm, designation: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </FieldTooltip>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1 text-xs">Date</label>
                        <FieldTooltip content="Automatic date timestamp of declaration sign-off.">
                          <input
                            type="text"
                            value={declarationForm.date}
                            readOnly
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs"
                          />
                        </FieldTooltip>
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
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Save Draft</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {activeTab === 'monitoring-methods' && (
          <button
            type="button"
            onClick={() => setActiveTab('mitigation-measures')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {activeTab === 'mitigation-measures' && (
          <button
            type="button"
            onClick={() => setActiveTab('qa-qc')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {activeTab === 'qa-qc' && (
          <button
            type="button"
            onClick={() => setActiveTab('review-submit')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {activeTab === 'review-submit' && (
          <button
            onClick={handleSubmit}
            disabled={!isDeclarationComplete}
            title={isDeclarationComplete ? 'Submit Annual Emission Data' : 'Please check all final declaration boxes and fill name/designation to submit'}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all select-none ${
              !isDeclarationComplete
                ? 'bg-[#DFE7EF] text-[#64748B] border border-[#CBD5E1] shadow-2xs cursor-not-allowed'
                : 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] cursor-pointer active:scale-95'
            }`}
          >
            <span>Submit Annual Emission Data</span>
            <Send className="w-3.5 h-3.5 fill-current opacity-80" />
          </button>
        )}
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

      {/* Admin Review Action Modal: Approve */}
      {activeReviewModal === 'approve' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold">Approve Annual Emission Data</h3>
              </div>
              <button
                onClick={() => setActiveReviewModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                You are approving the statutory Annual Emission Data for <strong className="text-slate-800">{currentRecord.facilityName}</strong> (Reporting Year: {currentRecord.reportingYear || '2026'}).
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Scope 1 Emissions:</span>
                  <span className="font-mono font-bold text-[#004B87]">{currentRecord.totalScope1 || currentRecord.totalEmissions} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reporting Status:</span>
                  <span className="font-semibold text-emerald-700">Official EAD Approval</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approval Notes / Certificate Reference</label>
                <textarea
                  rows={2}
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  placeholder="Enter approval notes or compliance certification reference..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setActiveReviewModal(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveEmission}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-teal-800 shadow-md shadow-emerald-700/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Approval</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Review Action Modal: Reject */}
      {activeReviewModal === 'reject' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold">Reject Annual Emission Data</h3>
              </div>
              <button
                onClick={() => setActiveReviewModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                You are formally rejecting the statutory Annual Emission Data for <strong className="text-slate-800">{currentRecord.facilityName}</strong>. Please provide regulatory justification.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rejection Reason *</label>
                <textarea
                  rows={3}
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  placeholder="Enter detailed justification for rejection under EAD regulatory guidelines..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setActiveReviewModal(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectEmission}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Review Action Modal: Revert */}
      {activeReviewModal === 'revert' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold">Revert to Facility Operator</h3>
              </div>
              <button
                onClick={() => setActiveReviewModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600 leading-relaxed">
                The dossier will be sent back to <strong className="text-slate-800">{currentRecord.facilityName}</strong> for correction. The operator will be notified to revise and resubmit.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Corrections / Instructions *</label>
                <textarea
                  rows={3}
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  placeholder="Specify required corrections, missing attachments, or discrepancies..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setActiveReviewModal(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRevertEmission}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Revert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
