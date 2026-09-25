import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Plus,
  X,
  Bookmark,
  Calendar,
  ChevronDown,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Flame,
  ShieldCheck,
  Send,
  Trash2,
  Sparkles,
  RotateCcw,
  Lock,
  Clock,
  Settings,
  Gauge,
  ArrowRight,
  Workflow,
  Eye,
  Edit,
  ArrowLeft,
  Search,
  Filter,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  XCircle,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { formatVersion } from '../types/mrv';
import { FieldTooltip } from '../components/ui/FieldTooltip';

const MONITORING_PLAN_STEPS = [
  { id: 'facility-description', stepNumber: 1, title: 'Facility Description' },
  { id: 'emissions-estimated', stepNumber: 2, title: 'Emissions Estimated' },
  { id: 'emission-sources', stepNumber: 3, title: 'Emission Sources' },
  { id: 'methane-emission', stepNumber: 4, title: 'Methane Emission' },
  { id: 'source-stream', stepNumber: 5, title: 'Source Stream' },
  { id: 'supporting-documents-remarks', stepNumber: 6, title: 'Supporting Documents & Remarks' },
] as const;

export const DataEntryView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isMonitoringPlanUnlocked,
    setMonitoringPlanStatus,
    currentRole,
    facilities,
    setActiveFacilityId,
    setFacilityMonitoringPlanStatus,
    facilityPlans,
    setFacilityPlans,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (Edit Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Tab Navigation State for Form and View Mode
  const [formActiveTab, setFormActiveTab] = useState<
    'facility-description' | 'emissions-estimated' | 'emission-sources' | 'methane-emission' | 'source-stream' | 'supporting-documents-remarks'
  >('facility-description');
  const [isCustomSector, setIsCustomSector] = useState(false);
  const [isCustomActivity, setIsCustomActivity] = useState(false);

  // Table Search & Filter State
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const [reviewerComments, setReviewerComments] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Current active plan
  const currentPlan = facilityPlans[selectedFacilityId] || {
    facilityName: '',
    facilityId: '',
    planRef: '',
    reportingYear: '2026',
    planVersion: 'V1',
    status: 'Draft',
    primaryApproach: 'Calculation-based (Tier 2)',
    submittedDate: null,
    updatedDate: null,
    eadCorrectionDate: null,
    description: '',
    businessSector: 'Energy',
    primaryActivity: 'Combustion of fuels in stationary equipment',
    operationalStatus: 'Operational',
    productionStreams: [],
    emissionsEstimation: { estimatedAnnualEmissions: '', justification: '' },
    emissionSources: [],
    methaneData: { hasMethaneEmissions: false, annualVolume: '', annualVolumeUnit: 't CH₄/year', estimatedCo2e: '', estimatedCo2eUnit: 't CO₂e/year', sourceOfEstimations: '', keySourcesAtInstallation: '', procedureToDetermine: '' },
    methaneProcedures: [],
    sourceStreams: [],
    calcOtherInputs: [],
    measEquipment: [],
    mitigationMeasures: [],
    remarks: '',
    attachedFiles: [],
  };

  // Synchronize active facility when navigating from Facility Registration
  useEffect(() => {
    if (activeFacility?.id) {
      setSelectedFacilityId(activeFacility.id);
      setViewMode('form');
      setFormActiveTab('facility-description');
    }
  }, [activeFacility?.id]);

  // Synchronize / Merge approved facilities from Context / Registration that don't have a plan yet
  useEffect(() => {
    setFacilityPlans((prev) => {
      let updated = false;
      const nextPlans = { ...prev };

      facilities.forEach((fac) => {
        const isApproved =
          fac.status === 'Registered' ||
          fac.status === 'Approved' ||
          (fac.status as unknown as string) === 'Approved / Registered' ||
          fac.status === 'Active';

        if (isApproved && !nextPlans[fac.id]) {
          updated = true;
          const numCode = (fac.facilityCode || fac.id).replace(/[^0-9]/g, '').slice(-4) || '0001';
          nextPlans[fac.id] = {
            facilityName: fac.name,
            facilityId: fac.facilityCode || `FAC-EAD-2026-${numCode}`,
            planRef: `MP-2026-${numCode}`,
            reportingYear: '2026',
            planVersion: 'V1',
            status: 'To Be Submitted',
            primaryApproach: '—',
            submittedDate: '—',
            updatedDate: '—',
            eadCorrectionDate: '2026-06-17',
            description: fac.primaryActivity || 'Facility statutory monitoring plan.',
            businessSector: fac.sector || 'Energy',
            primaryActivity: fac.primaryActivity || '',
            operationalStatus: 'Operational',
            productionStreams: [],
            emissionsEstimation: { estimatedAnnualEmissions: '', justification: '' },
            emissionSources: [],
            methaneData: { hasMethaneEmissions: false, annualVolume: '', annualVolumeUnit: 't CH₄/year', estimatedCo2e: '', estimatedCo2eUnit: 't CO₂e/year', sourceOfEstimations: '', keySourcesAtInstallation: '', procedureToDetermine: '' },
            methaneProcedures: [],
            sourceStreams: [],
            calcOtherInputs: [],
            measEquipment: [],
            mitigationMeasures: [],
            remarks: '',
            attachedFiles: [],
          };
        }
      });

      return updated ? nextPlans : prev;
    });
  }, [facilities]);

  // Calculate Submission / Correction Deadline Countdown Helper
  const getCorrectionDeadlineInfo = (deadlineDateStr: string | null, status: string) => {
    if (status === 'To Be Submitted') {
      const targetDeadlineStr = deadlineDateStr || '2026-06-17';
      const deadline = new Date(targetDeadlineStr);
      const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { text: 'Overdue', isOverdue: true, daysRemaining: diffDays, deadlineStr: targetDeadlineStr };
      }
      return {
        text: `Due: ${targetDeadlineStr} (${diffDays} days left)`,
        isOverdue: false,
        daysRemaining: diffDays,
        deadlineStr: targetDeadlineStr,
      };
    }

    if ((status !== 'Correction Required' && status !== 'Reverted') || !deadlineDateStr) {
      return { text: '—', isOverdue: false, daysRemaining: null };
    }
    const deadline = new Date(deadlineDateStr);
    const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', isOverdue: true, daysRemaining: diffDays, deadlineStr: deadlineDateStr };
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
    return Object.entries(facilityPlans).filter(([facId, plan]) => {
      const matchesSearch =
        (plan.facilityName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.facilityId || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.planRef || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.primaryApproach || plan.primaryActivity || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.businessSector || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'To Be Submitted' && plan.status === 'To Be Submitted') ||
        (statusFilter === 'Approved' && (plan.status === 'Approved' || plan.status === 'Approved / Active' || plan.status === 'Active')) ||
        (statusFilter === 'Reverted' && (plan.status === 'Correction Required' || plan.status === 'Reverted' || plan.status.includes('Correction') || plan.status.includes('Reverted'))) ||
        (statusFilter === 'Correction Required' && (plan.status === 'Correction Required' || plan.status === 'Reverted' || plan.status.includes('Correction') || plan.status.includes('Reverted'))) ||
        (statusFilter === 'Rejected' && (plan.status === 'Rejected' || plan.status.includes('Reject'))) ||
        (plan.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchesYear =
        yearFilter === 'ALL' ||
        plan.reportingYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [facilityPlans, tableSearchTerm, statusFilter, yearFilter]);

  // Overview Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const totalPages = Math.ceil(filteredTableList.length / itemsPerPage) || 1;

  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTableList, currentPage, itemsPerPage]);

  // Handle Edit Action
  const handleEditFacilityPlan = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    setFormActiveTab('facility-description');
    setViewMode('form');
  };

  // Handle View Action
  const handleViewFacilityPlan = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    const plan = facilityPlans[facId];
    setReviewerComments(plan?.reviewerComments || '');
    setFormActiveTab('facility-description');
    setViewMode('view');
  };

  // EAD Determination Handlers for Monitoring Plan
  const handleViewRevert = () => {
    updateCurrentPlan((p) => ({
      ...p,
      status: 'Correction Required',
      eadCorrectionDate: '07-Oct-2026',
      reviewerComments: reviewerComments,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setMonitoringPlanStatus('Correction Required');
    setNoticeMessage('Monitoring Plan Reverted to Facility Operator for Correction');
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      setViewMode('table');
    }, 1500);
  };

  const handleViewReject = () => {
    updateCurrentPlan((p) => ({
      ...p,
      status: 'Rejected',
      reviewerComments: reviewerComments,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setMonitoringPlanStatus('Rejected');
    setNoticeMessage('Monitoring Plan Rejected');
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      setViewMode('table');
    }, 1500);
  };

  const handleViewApprove = () => {
    updateCurrentPlan((p) => ({
      ...p,
      status: 'Approved',
      eadCorrectionDate: null,
      reviewerComments: reviewerComments,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setMonitoringPlanStatus('Approved');
    setNoticeMessage('Monitoring Plan Approved by EAD!');
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      setViewMode('table');
    }, 1500);
  };

  // Handle Create Monitoring Plan for Approved Facility in 'To Be Submitted' State
  const handleCreatePlanForFacility = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    setFormActiveTab('facility-description');

    setFacilityPlans((prev) => {
      const existing = prev[facId];
      if (!existing || existing.status === 'To Be Submitted') {
        const fac = facilities.find((f) => f.id === facId);
        const facName = existing?.facilityName || fac?.name || 'New Facility';
        const facCode = existing?.facilityId || fac?.facilityCode || `FAC-EAD-2026-${facId.replace(/[^0-9]/g, '').padStart(4, '0')}`;
        const numCode = facCode.replace(/[^0-9]/g, '').slice(-4) || '0001';

        return {
          ...prev,
          [facId]: {
            facilityName: facName,
            facilityId: facCode,
            planRef: `MP-2026-${numCode}`,
            reportingYear: '2026',
            planVersion: 'V1',
            status: 'Draft',
            primaryApproach: 'Calculation-based (Tier 2)',
            submittedDate: '—',
            updatedDate: '—',
            eadCorrectionDate: null,
            description: existing?.description || fac?.primaryActivity || 'Facility statutory monitoring plan.',
            businessSector: existing?.businessSector || fac?.sector || 'Energy',
            primaryActivity: existing?.primaryActivity || fac?.primaryActivity || 'Combustion of fuels in stationary equipment',
            operationalStatus: 'Operational',
            productionStreams: [
              {
                id: 'P01',
                category: 'Primary Products',
                technology: 'Standard Process Unit',
                energyRelated: 'Yes',
                processEmissions: 'No',
                capacity: '100,000',
                capacityUnit: 't/year',
                actualQuantity: '85,000',
                actualQuantityUnit: 't/year',
              },
            ],
            emissionsEstimation: {
              estimatedAnnualEmissions: '50,000',
              justification: 'Calculated using fuel consumption records and standard IPCC emissions factors.',
            },
            emissionSources: [
              {
                id: 'S01',
                name: 'Main Boiler / Combustion Unit',
                associatedProduct: 'P01',
                gasTypes: 'CO₂, CH₄, N₂O',
                totalEmissions: '50,000',
                energyRelated: 'Yes',
                processEmissions: 'No',
                methodology: 'Calculation-based',
              },
            ],
            methaneData: {
              hasMethaneEmissions: false,
              annualVolume: '',
              annualVolumeUnit: 't CH₄/year',
              estimatedCo2e: '',
              estimatedCo2eUnit: 't CO₂e/year',
              sourceOfEstimations: '',
              keySourcesAtInstallation: '',
              procedureToDetermine: '',
            },
            methaneProcedures: [],
            sourceStreams: [
              {
                id: 'FC1',
                description: 'Natural Gas Feed',
                associatedSource: 'S01',
                classification: 'Fuel Combusted',
                activityLevel: '25,000,000',
                activityUnit: 'Nm³',
                fuelType: 'Natural gas',
                combustionDevice: 'Industrial Boiler',
                deviceCapacity: '35.0',
                metricUnit: 'MW',
              },
            ],
            calcOtherInputs: [
              {
                id: 'F01',
                type: 'Natural Gas',
                activityLevel: '25,000,000',
                units: 'Nm³',
                ncv: '38.5',
                emissionFactor: '56.1',
                oxidationFactor: '100%',
                conversionFactor: '1.0',
                source: 'Fiscal Gas Meter',
              },
            ],
            measEquipment: [
              {
                name: 'Fiscal Flow Meter',
                type: 'Flow Meter',
                manufacturer: 'ABB / Emerson',
                parameter: 'Gas Flow',
                accuracyClass: '±1.0%',
              },
            ],
            mitigationMeasures: [],
            remarks: 'Initial monitoring plan drafted for EAD regulatory approval.',
            attachedFiles: [],
          },
        };
      }
      return prev;
    });

    setViewMode('form');
  };

  // Update field in current active plan
  const updateCurrentPlan = (updater: (prev: any) => any) => {
    setFacilityPlans((prev) => {
      const existing = prev[selectedFacilityId] || currentPlan;
      return {
        ...prev,
        [selectedFacilityId]: updater(existing),
      };
    });
  };

  const handleSave = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    updateCurrentPlan((p) => ({
      ...p,
      status: 'Draft',
      updatedDate: todayStr,
    }));
    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Draft');
    setMonitoringPlanStatus('Draft');
    setViewMode('table');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      updateCurrentPlan((plan) => ({
        ...plan,
        attachedFiles: [...(plan.attachedFiles || []), ...newFiles],
      }));
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Add Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Monitoring Plan
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Statutory Monitoring Methodologies, Emission Sources & QA/QC Plans Register
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <FieldTooltip
              content="Search monitoring plans and data entries by facility name, ID, or reference."
              example="Al Ain Cement or MP-2026-001"
              className="w-36 sm:w-44 xl:w-48"
            >
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by facility, ref..."
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
            </FieldTooltip>

            {/* Status Filter */}
            <FieldTooltip
              content="Filter data entry plans by current submission lifecycle status."
              example="Draft, Submitted, or Approved"
              className="w-auto"
            >
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-28 sm:w-32 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="To Be Submitted">To Be Submitted</option>
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under EAD Review">Under EAD Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Reverted">Reverted (Correction Required)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </FieldTooltip>

            {/* Year Filter */}
            <FieldTooltip
              content="Filter monitoring dossiers by reporting calendar year."
              example="2026"
              className="w-auto"
            >
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
            </FieldTooltip>

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
          </div>
        </div>

        {/* Table & Pagination Container (Without outer white card background) */}
        <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                  <th className="h-[38px] px-2.5 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                  <th className="h-[38px] px-2.5 w-44 max-w-[180px] align-middle bg-[#D6E3EF]">Facility Name</th>
                  <th className="h-[38px] px-2.5 whitespace-nowrap align-middle bg-[#D6E3EF]">Facility ID</th>
                  <th className="h-[38px] px-2.5 whitespace-nowrap text-center align-middle bg-[#D6E3EF]">Applicable Year</th>
                  <th className="h-[38px] px-2.5 whitespace-nowrap align-middle bg-[#D6E3EF]">Primary Monitoring Approach</th>
                  <th className="h-[38px] px-2.5 whitespace-nowrap align-middle bg-[#D6E3EF]">Submitted Date</th>
                  <th className="h-[38px] px-2.5 whitespace-nowrap align-middle bg-[#D6E3EF]">Updated Date</th>
                  <th className="h-[38px] px-2.5 w-28 whitespace-nowrap text-left align-middle bg-[#D6E3EF]">Status</th>
                  <th className="h-[38px] px-2.5 w-36 whitespace-nowrap align-middle bg-[#D6E3EF]">Correction Deadline</th>
                  <th className="h-[38px] px-3 w-20 text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedPlans.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="h-[60px] py-8 text-center text-slate-400 font-normal align-middle">
                      No monitoring plan records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPlans.map(([facId, plan], idx) => {
                    const deadlineInfo = getCorrectionDeadlineInfo(plan.eadCorrectionDate, plan.status);
                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                    return (
                      <tr
                        key={facId}
                        className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                      >
                        <td className="h-[60px] px-2.5 text-center font-mono font-normal text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* Facility Name */}
                        <td className="h-[60px] px-2.5 font-normal text-slate-800 w-44 max-w-[180px] leading-snug align-middle">
                          <span>{plan.facilityName}</span>
                        </td>

                        {/* Facility ID */}
                        <td className="h-[60px] px-2.5 font-mono text-[#004B87] font-normal whitespace-nowrap align-middle">
                          {plan.facilityId || '—'}
                        </td>

                        {/* Applicable Year */}
                        <td className="h-[60px] px-2.5 text-center font-normal text-slate-700 whitespace-nowrap align-middle">
                          {plan.reportingYear || '2026'}
                        </td>

                        {/* Primary Monitoring Approach */}
                        <td className="h-[60px] px-2.5 text-slate-600 leading-snug align-middle">
                          <span>{plan.primaryApproach || plan.primaryActivity || 'Calculation-based (Tier 3)'}</span>
                        </td>

                        {/* Submitted Date */}
                        <td className="h-[60px] px-2.5 text-slate-600 whitespace-nowrap align-middle">
                          {plan.submittedDate && plan.submittedDate !== '—' ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{plan.submittedDate}</span>
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        {/* Updated Date */}
                        <td className="h-[60px] px-2.5 text-slate-600 whitespace-nowrap align-middle">
                          {plan.updatedDate && plan.updatedDate !== '—' ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{plan.updatedDate}</span>
                            </div>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="h-[60px] px-2.5 text-left whitespace-nowrap align-middle">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal whitespace-nowrap inline-block ${
                              plan.status === 'Approved' || plan.status === 'Approved / Active' || plan.status === 'Active'
                                ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                : plan.status === 'Submitted' || plan.status === 'Under EAD Review'
                                ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                : plan.status === 'To Be Submitted'
                                ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200/80'
                                : plan.status === 'Correction Required' || plan.status === 'Reverted'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80'
                                : plan.status === 'Rejected'
                                ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {plan.status}
                          </span>
                        </td>

                        {/* Submission / Correction Deadline */}
                        <td className="h-[60px] px-2.5 whitespace-nowrap text-slate-600 align-middle">
                          {(plan.status === 'Correction Required' || plan.status === 'To Be Submitted') && deadlineInfo.daysRemaining !== null ? (
                            <div className="flex items-start gap-1.5">
                              <Calendar className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.status === 'To Be Submitted' ? 'text-blue-600' : 'text-amber-600'}`} />
                              <div className="flex flex-col leading-tight">
                                <span className="font-semibold text-slate-800 text-[11px]">Due: {deadlineInfo.deadlineStr}</span>
                                <span className={`text-[10px] font-medium ${deadlineInfo.isOverdue ? 'text-rose-600 font-bold' : plan.status === 'To Be Submitted' ? 'text-blue-700 font-bold' : 'text-amber-700 font-bold'}`}>
                                  {deadlineInfo.isOverdue
                                    ? `Overdue (${Math.abs(deadlineInfo.daysRemaining)} days late)`
                                    : `(${deadlineInfo.daysRemaining} days left)`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium pl-2">—</span>
                          )}
                        </td>

                        {/* Actions: "Create Monitoring Plan" button for 'To Be Submitted', or Eye View & Edit Icons */}
                        <td className="h-[60px] px-3 text-center whitespace-nowrap align-middle">
                          {plan.status === 'To Be Submitted' ? (
                            <button
                              onClick={() => handleCreatePlanForFacility(facId)}
                              className="px-2.5 py-1 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer whitespace-nowrap mx-auto active:scale-95"
                              title="Create Plan for this facility"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create Plan</span>
                            </button>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleViewFacilityPlan(facId)}
                                title="View Monitoring Plan Details"
                                className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {plan.status !== 'Under EAD Review' && (
                                <button
                                  onClick={() => handleEditFacilityPlan(facId)}
                                  title="Edit Monitoring Plan"
                                  className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
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
                <span className="font-bold text-slate-800">{filteredTableList.length}</span> monitoring plans
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
        {/* Top Action Header with Back Button + Stepper Tabs on Top */}
        <div className="flex-shrink-0 pb-2.5 pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
              title="Back to Monitoring Plan Overview Table"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Stepper Tabs Bar */}
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs overflow-x-auto no-scrollbar">
              {MONITORING_PLAN_STEPS.map((step, idx) => {
                const subTabOrder = [
                  'facility-description',
                  'emissions-estimated',
                  'emission-sources',
                  'methane-emission',
                  'source-stream',
                  'supporting-documents-remarks',
                ];
                const currentStepNum = subTabOrder.indexOf(formActiveTab) + 1;
                const isActive = step.stepNumber === currentStepNum;
                const isCompleted = step.stepNumber < currentStepNum;
                const isArrowHighlighted = idx < currentStepNum - 1;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setFormActiveTab(step.id as any)}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                          : isCompleted
                          ? 'text-slate-700 hover:text-[#004B87] hover:bg-white/60 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-white/40 font-medium'
                      }`}
                    >
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
                      <span className="whitespace-nowrap">{step.title}</span>
                    </button>

                    {idx < MONITORING_PLAN_STEPS.length - 1 && (
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
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentPlan.status === 'Approved' || currentPlan.status === 'Approved / Active' || currentPlan.status === 'Active'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentPlan.status === 'Submitted' || currentPlan.status === 'Under EAD Review'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : currentPlan.status === 'Correction Required' || currentPlan.status === 'Reverted'
                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                  : currentPlan.status === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentPlan.status || 'Draft'}
            </span>

            {currentPlan.status !== 'Under EAD Review' && (
              <button
                onClick={() => setViewMode('form')}
                className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Plan</span>
              </button>
            )}
          </div>
        </div>

        {/* Under Tabs: Metadata Row with Auto-Populated Facility Name, Calendar Year, Facility ID */}
        <div className="flex-shrink-0 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 mb-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-xs font-medium">Facility:</span>
              <span className="text-xs font-bold text-slate-900">
                {currentPlan.facilityName || activeFacility?.name || 'Al Noor Industrial Facility'}
              </span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-xs font-medium">Facility ID:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] text-xs font-mono font-bold border border-emerald-300">
                {currentPlan.facilityId || activeFacility?.facilityCode || 'FAC-EAD-2026-0891'}
              </span>
            </div>

            <span className="text-slate-300">|</span>

            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              {currentPlan.facilityName || 'Facility'} • Reporting Year: {currentPlan.reportingYear || '2026'} • Version: {formatVersion(currentPlan.planVersion)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">Calendar Year:</span>
            <span className="font-bold text-slate-900">{currentPlan.reportingYear || '2026'}</span>
          </div>
        </div>

        {/* Scrollable Content Card */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-2.5 pt-1 pb-0.5 text-xs custom-scrollbar">

          {/* Tab 1: Facility Description */}
          {formActiveTab === 'facility-description' && (
            <div className="space-y-4 pt-1">
              {/* Primary Business Sector & Primary Activity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="block text-slate-500 font-medium text-[11px] mb-1">Primary Business Sector</span>
                  <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block text-xs">{currentPlan.businessSector || '—'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-medium text-[11px] mb-1">Primary Activity</span>
                  <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block text-xs">{currentPlan.primaryActivity || '—'}</span>
                </div>
              </div>

              {/* Primary Production Streams */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#336D9F]">Primary Production Streams</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3 min-w-[80px]" title="Product ID">Product ID</th>
                        <th className="py-2.5 px-3 min-w-[155px]" title="Product Category">Product Category</th>
                        <th className="py-2.5 px-3 min-w-[200px]" title="Production Technology/Process">Production Technology/Process</th>
                        <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                        <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                        <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity">Production Capacity</th>
                        <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity Unit">Production Capacity Unit</th>
                        <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity">Actual Production Quantity</th>
                        <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity Unit">Actual Production Quantity Unit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {currentPlan.productionStreams.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3 font-mono font-normal text-[#004B87]" title={row.id}>{row.id}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.category}>{row.category}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.technology}>{row.technology}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.energyRelated}>{row.energyRelated}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.processEmissions}>{row.processEmissions}</td>
                          <td className="py-2 px-3 font-mono text-slate-800" title={row.capacity}>{row.capacity}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.capacityUnit}>{row.capacityUnit}</td>
                          <td className="py-2 px-3 font-mono text-slate-800" title={row.actualQuantity}>{row.actualQuantity}</td>
                          <td className="py-2 px-3 text-slate-800" title={row.actualQuantityUnit}>{row.actualQuantityUnit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Emissions Estimation */}
          {formActiveTab === 'emissions-estimated' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Estimated Annual Emissions (tCO₂e)">Estimated Annual Emissions (tCO₂e)</span>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-mono font-normal text-xs" title={currentPlan.emissionsEstimation.estimatedAnnualEmissions}>
                    {currentPlan.emissionsEstimation.estimatedAnnualEmissions}
                  </div>
                </div>
              </div>
              <div>
                <span className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Justification for the estimated value">Justification for the estimated value</span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 leading-relaxed text-xs" title={currentPlan.emissionsEstimation.justification}>
                  {currentPlan.emissionsEstimation.justification}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Emission Sources */}
          {formActiveTab === 'emission-sources' && (
            <div className="space-y-2 pt-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Source ID">Source ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Emission Source (Name, Description)">Emission Source (Name, Description)</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Product (ID)">Associated Product (ID)</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Types Of Gas(es) Emitted">Types Of Gas(es) Emitted</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Total Emissions From Source (T CO2e)">Total Emissions From Source (T CO2e)</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[160px]" title="Methodology For Determining...">Methodology For Determining...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.emissionSources.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-normal text-[#004B87]" title={row.id}>{row.id}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.name}>{row.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.associatedProduct}>{row.associatedProduct}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.gasTypes}>{row.gasTypes}</td>
                        <td className="py-2 px-3 font-mono font-normal text-slate-900" title={row.totalEmissions}>{row.totalEmissions}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.energyRelated}>{row.energyRelated}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.processEmissions}>{row.processEmissions}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.methodology}>{row.methodology}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Methane Emission */}
          {formActiveTab === 'methane-emission' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                <span className={`px-3 py-1 rounded-full text-xs font-normal ${currentPlan.methaneData?.hasMethaneEmissions ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {currentPlan.methaneData?.hasMethaneEmissions ? 'Yes' : 'No'}
                </span>
              </div>
              {currentPlan.methaneData?.hasMethaneEmissions && (
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Annual Volume of methane emissions at site">Annual Volume of methane emissions at site</span>
                      <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-normal flex justify-between items-center" title={`${currentPlan.methaneData.annualVolume || 'N/A'} ${currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}`}>
                        <span>{currentPlan.methaneData.annualVolume || 'N/A'}</span>
                        <span className="text-slate-500 text-[11px]">{currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-medium text-[11px] mb-1 whitespace-nowrap" title="Estimated CO₂e from methane emissions (100-year GWP)">Estimated CO₂e from methane emissions (100-year GWP)</span>
                      <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-normal flex justify-between items-center" title={`${currentPlan.methaneData.estimatedCO2e || currentPlan.methaneData.estimatedCo2e || 'N/A'} ${currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}`}>
                        <span>{currentPlan.methaneData.estimatedCO2e || currentPlan.methaneData.estimatedCo2e || 'N/A'}</span>
                        <span className="text-slate-500 text-[11px]">{currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Source of estimates, including conversion factors">Source of estimates, including conversion factors</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.sourceOfEstimations || '—'}>
                      {currentPlan.methaneData.sourceOfEstimations || '—'}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Key methane emission sources at the installation">Key methane emission sources at the installation</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.keySourcesAtInstallation || '—'}>
                      {currentPlan.methaneData.keySourcesAtInstallation || '—'}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Procedures used to determine / estimate the quantity of methane emitted">Procedures used to determine / estimate the quantity of methane emitted</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.procedureToDetermine || '—'}>
                      {currentPlan.methaneData.procedureToDetermine || '—'}
                    </div>
                  </div>

                  {currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns pt-0">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[140px]" title="Title of Procedure">Title of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[190px]" title="Brief Description including Frequency">Brief Description including Frequency</th>
                            <th className="py-2.5 px-3 min-w-[150px]" title="Person in Charge">Person in Charge</th>
                            <th className="py-2.5 px-3 min-w-[160px]" title="Contact Email">Contact Email</th>
                            <th className="py-2.5 px-3 min-w-[140px]" title="Contact Phone Number">Contact Phone Number</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {currentPlan.methaneProcedures.map((proc: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2 px-3 font-normal text-slate-900" title={proc.title}>{proc.title}</td>
                              <td className="py-2 px-3 text-slate-700" title={proc.description}>{proc.description}</td>
                              <td className="py-2 px-3 text-slate-900 font-normal" title={proc.personInCharge}>{proc.personInCharge}</td>
                              <td className="py-2 px-3 text-slate-600" title={proc.email}>{proc.email}</td>
                              <td className="py-2 px-3 font-mono text-slate-600" title={proc.phone}>{proc.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Source Stream */}
          {formActiveTab === 'source-stream' && (
            <div className="space-y-4 pt-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[90px]" title="Source Stream ID">Source Stream ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]" title="Description Of Source Stream">Description Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Emission Source (ID)">Associated Emission Source (ID)</th>
                      <th className="py-2.5 px-3 min-w-[150px]" title="Classification Of Source Stream">Classification Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Level Of Source Stream Activity">Level Of Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Source Stream Activity">Unit For Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Type Of Fuel (If Applicable)">Type Of Fuel (If Applicable)</th>
                      <th className="py-2.5 px-3 min-w-[170px]" title="Combustion Device / Technology">Combustion Device / Technology</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Combustion Device Capacity">Combustion Device Capacity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Metric">Unit For Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.sourceStreams.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-normal text-[#004B87]" title={row.id}>{row.id}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.description}>{row.description}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.associatedSource}>{row.associatedSource}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.classification}>{row.classification}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.activityLevel}>{row.activityLevel}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.activityUnit}>{row.activityUnit}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.fuelType}>{row.fuelType}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.combustionDevice || '—'}>{row.combustionDevice || '—'}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.deviceCapacity || '—'}>{row.deviceCapacity || '—'}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.metricUnit || '—'}>{row.metricUnit || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 6: Supporting Documents & Remarks (Read-Only) */}
          {formActiveTab === 'supporting-documents-remarks' && (
            <div className="space-y-4 pt-1">
              {/* Supporting Documents */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#336D9F]">Supporting Documents</span>
                <div className="flex flex-wrap gap-2.5">
                  {(currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? currentPlan.attachedFiles : [{ name: 'Statutory_Monitoring_Documentation.pdf', size: '3.2MB', status: 'Completed' }]).map((f: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-800 shadow-xs">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span className="font-normal">{f.name}</span>
                      <span className="text-slate-400 text-[10px]">{f.size} • <span className="text-emerald-600 font-normal">{f.status || 'Completed'}</span></span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Remarks / Description */}
              <div className="space-y-1.5 pt-1 text-xs">
                <label className="block text-xs font-bold text-[#336D9F]">Remarks / Description</label>
                <p className="font-medium text-navy-900 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                  {currentPlan.remarks || 'Standard monitoring plan submitted in accordance with statutory guidelines.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions Bar for View Mode (Common across all tabs) */}
        <div className="flex-shrink-0 pt-2.5 mt-1 border-t border-slate-100 bg-white space-y-2.5">
          {/* Reviewer Comments Box (Common across all tabs) */}
          <div className="text-xs">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#336D9F]" />
              <label className="font-bold text-[#336D9F] text-xs">Reviewer Comments</label>
            </div>
            <FieldTooltip
              content="Enter reviewer evaluation, feedback observations, or statutory correction instructions."
              example="All parameters verified. Uncertainty assessment methodology accepted."
            >
              <textarea
                rows={2}
                value={reviewerComments}
                onChange={(e) => setReviewerComments(e.target.value)}
                placeholder="Enter reviewer comments, feedback, compliance notes, or correction instructions for this monitoring plan..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] focus:bg-white transition-all font-medium resize-none shadow-2xs"
              />
            </FieldTooltip>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-end">
            {formActiveTab === 'facility-description' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emissions-estimated')}
                className="px-5 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold text-xs rounded-[8px] shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emissions-estimated' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emission-sources')}
                className="px-5 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold text-xs rounded-[8px] shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emission-sources' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('methane-emission')}
                className="px-5 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold text-xs rounded-[8px] shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'methane-emission' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('source-stream')}
                className="px-5 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold text-xs rounded-[8px] shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'source-stream' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('supporting-documents-remarks')}
                className="px-5 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold text-xs rounded-[8px] shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'supporting-documents-remarks' && (
              <div className="flex items-center justify-end gap-3">
                {/* Revert Button */}
                <button
                  type="button"
                  onClick={handleViewRevert}
                  className="px-5 py-2 bg-[#FFF8E7] hover:bg-[#FEF0CD] border border-[#FCD34D] text-[#975A16] font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Revert monitoring plan back to operator for correction"
                >
                  <RotateCcw className="w-4 h-4 text-[#975A16]" />
                  <span>Revert</span>
                </button>

                {/* Reject Button */}
                <button
                  type="button"
                  onClick={handleViewReject}
                  className="px-5 py-2 bg-[#FFF0F3] hover:bg-[#FFE2E6] border border-[#FDA4AF] text-[#9F1239] font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Reject monitoring plan"
                >
                  <XCircle className="w-4 h-4 text-[#9F1239]" />
                  <span>Reject</span>
                </button>

                {/* Approve Button */}
                <button
                  type="button"
                  onClick={handleViewApprove}
                  className="px-6 py-2 bg-[#00875A] hover:bg-[#00754E] border border-[#00875A] text-white font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  title="Approve monitoring plan"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Approve</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  }

  // =========================================================================
  // 3. EDIT / ADD FORM VIEW (viewMode === 'form')
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
      {/* Hidden File Input for Excel/CSV/DOCX Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Top Action Header with Back Button + Stepper Tabs on Top */}
      <div className="flex-shrink-0 pb-2.5 pt-0.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setViewMode('table')}
            className="p-1.5 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
            title="Back to Monitoring Plan Overview Table"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Form Tab Navigation Progress Stepper (Corner radius 6px, primary gradient active tab, white background, numbered circles, highlighted arrows) */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs overflow-x-auto no-scrollbar">
            {MONITORING_PLAN_STEPS.map((step, idx) => {
              const subTabOrder = [
                'facility-description',
                'emissions-estimated',
                'emission-sources',
                'methane-emission',
                'source-stream',
                'supporting-documents-remarks',
              ];
              const currentStepNum = subTabOrder.indexOf(formActiveTab) + 1;
              const isActive = step.stepNumber === currentStepNum;
              const isCompleted = step.stepNumber < currentStepNum;
              const isArrowHighlighted = idx < currentStepNum - 1;

              return (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => setFormActiveTab(step.id as any)}
                    className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                        : isCompleted
                        ? 'text-slate-700 hover:text-[#004B87] hover:bg-white/60 font-semibold'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/40 font-medium'
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

                  {/* Arrow Indication between steps */}
                  {idx < MONITORING_PLAN_STEPS.length - 1 && (
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
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentPlan.status === 'Approved' || currentPlan.status === 'Approved / Active' || currentPlan.status === 'Active'
                ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                : currentPlan.status === 'Submitted' || currentPlan.status === 'Under EAD Review'
                ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                : currentPlan.status === 'Correction Required' || currentPlan.status === 'Reverted'
                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                : currentPlan.status === 'Rejected'
                ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {currentPlan.status || 'Draft'}
          </span>
        </div>
      </div>

      {/* Under Tabs: Metadata Row with Auto-Populated Facility Name, Calendar Year, Facility ID */}
      <div className="flex-shrink-0 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 mb-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-medium">Facility:</span>
            <span className="text-xs font-bold text-slate-900">
              {currentPlan.facilityName || activeFacility?.name || 'Al Noor Industrial Facility'}
            </span>
          </div>

          <span className="text-slate-300">|</span>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-xs font-medium">Facility ID:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] text-xs font-mono font-bold border border-emerald-300">
              {currentPlan.facilityId || activeFacility?.facilityCode || 'FAC-EAD-2026-0891'}
            </span>
          </div>

          <span className="text-slate-300">|</span>

          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            Production Streams, Emission Sources, Estimation Models & Source Streams
          </p>
        </div>

        {/* Calendar Year (Auto-populated / selectable) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Calendar Year:</span>
          <div className="relative">
            <select
              value={currentPlan.reportingYear || reportingYear || '2026'}
              onChange={(e) => {
                const val = e.target.value;
                updateCurrentPlan((p) => ({ ...p, reportingYear: val }));
              }}
              className="h-8 px-2.5 pr-7 bg-slate-50 border border-slate-200 hover:border-[#004B87] rounded-lg text-slate-900 font-bold text-xs focus:outline-none focus:border-[#004B87] cursor-pointer appearance-none transition-colors"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Form Content Card */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">

        {/* Scrollable Form Content */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-2.5 pt-2 pb-0.5 text-xs custom-scrollbar">

          {/* Tab 1: Facility Description */}
          {formActiveTab === 'facility-description' && (
            <div className="space-y-4 pt-1">
              {/* Primary Business Sector & Primary Activity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-semibold text-xs">Primary Business Sector</label>
                    {isCustomSector && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSector(false);
                          updateCurrentPlan((p) => ({ ...p, businessSector: 'Energy' }));
                        }}
                        className="text-[11px] font-semibold text-[#004B87] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Switch back to predefined sectors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Select from list</span>
                      </button>
                    )}
                  </div>
                  <FieldTooltip
                    content="The overarching economic or industrial sector governing facility operations under MRV."
                    example="Industrial Processes or Energy"
                  >
                    {isCustomSector ? (
                      <input
                        type="text"
                        value={currentPlan.businessSector === 'Other' ? '' : (currentPlan.businessSector || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCurrentPlan((p) => ({ ...p, businessSector: val }));
                        }}
                        placeholder="Enter custom business sector..."
                        autoFocus
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs text-xs font-medium"
                      />
                    ) : (
                      <select
                        value={currentPlan.businessSector || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Other') {
                            setIsCustomSector(true);
                            updateCurrentPlan((p) => ({ ...p, businessSector: '' }));
                          } else {
                            updateCurrentPlan((p) => ({ ...p, businessSector: val }));
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer text-xs font-medium"
                      >
                        <option value="">Select Business Sector</option>
                        <option value="Energy">Energy</option>
                        <option value="Industrial Processes">Industrial Processes</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Mining & Minerals">Mining & Minerals</option>
                        <option value="Waste">Waste</option>
                        <option value="Other">Other (Enter custom sector)</option>
                      </select>
                    )}
                  </FieldTooltip>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-semibold text-xs">Primary Activity</label>
                    {isCustomActivity && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomActivity(false);
                          updateCurrentPlan((p) => ({ ...p, primaryActivity: 'Combustion of fuels in stationary equipment' }));
                        }}
                        className="text-[11px] font-semibold text-[#004B87] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Switch back to predefined activities"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Select from list</span>
                      </button>
                    )}
                  </div>
                  <FieldTooltip
                    content="Specific core industrial activity or technology producing greenhouse gas emissions."
                    example="Combustion of fuels in stationary equipment"
                  >
                    {isCustomActivity ? (
                      <input
                        type="text"
                        value={currentPlan.primaryActivity === 'Other' ? '' : (currentPlan.primaryActivity || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateCurrentPlan((p) => ({ ...p, primaryActivity: val }));
                        }}
                        placeholder="Enter custom primary activity..."
                        autoFocus
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs text-xs font-medium"
                      />
                    ) : (
                      <select
                        value={currentPlan.primaryActivity || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'Other') {
                            setIsCustomActivity(true);
                            updateCurrentPlan((p) => ({ ...p, primaryActivity: '' }));
                          } else {
                            updateCurrentPlan((p) => ({ ...p, primaryActivity: val }));
                          }
                        }}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer text-xs font-medium"
                      >
                        <option value="">Select Primary Activity</option>
                        <option value="Combustion of fuels in stationary equipment">Combustion of fuels in stationary equipment</option>
                        <option value="Manufacturing of cement / clinker">Manufacturing of cement / clinker</option>
                        <option value="Direct reduced iron & steelmaking">Direct reduced iron & steelmaking</option>
                        <option value="Petrochemical cracking & refining">Petrochemical cracking & refining</option>
                        <option value="Solid waste thermal treatment">Solid waste thermal treatment</option>
                        <option value="Other">Other (Enter custom activity)</option>
                      </select>
                    )}
                  </FieldTooltip>
                </div>
              </div>

              {/* Primary Production Streams */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#336D9F]">Primary Production Streams</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3 min-w-[80px]" title="Product ID">Product ID</th>
                        <th className="py-2.5 px-3 min-w-[155px]" title="Product Category">Product Category</th>
                        <th className="py-2.5 px-3 min-w-[200px]" title="Production Technology/Process">Production Technology/Process</th>
                        <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                        <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                        <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity">Production Capacity</th>
                        <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity Unit">Production Capacity Unit</th>
                        <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity">Actual Production Quantity</th>
                        <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity Unit">Actual Production Quantity Unit</th>
                        <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {currentPlan.productionStreams.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="P01"
                              value={row.id}
                              title={row.id || 'Product ID'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].id = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.category}
                              title={row.category || 'Select category'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].category = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[145px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                            >
                              <option value="" title="Select category">Select category</option>
                              <option value="Primary Products" title="Primary Products">Primary Products</option>
                              <option value="Secondary Products" title="Secondary Products">Secondary Products</option>
                              <option value="By-Products" title="By-Products">By-Products</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="Enter technology/process"
                              value={row.technology}
                              title={row.technology || 'Enter technology/process'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].technology = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.energyRelated}
                              title={row.energyRelated || 'Select...'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].energyRelated = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                            >
                              <option value="" title="Select...">Select...</option>
                              <option value="Yes" title="Yes">Yes</option>
                              <option value="No" title="No">No</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.processEmissions}
                              title={row.processEmissions || 'Select...'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].processEmissions = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                            >
                              <option value="" title="Select...">Select...</option>
                              <option value="Yes" title="Yes">Yes</option>
                              <option value="No" title="No">No</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="Enter capacity"
                              value={row.capacity}
                              title={row.capacity ? `${row.capacity} ${row.capacityUnit || ''}` : 'Enter capacity'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].capacity = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.capacityUnit}
                              title={row.capacityUnit || 'Select unit'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].capacityUnit = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                            >
                              <option value="" title="Select unit">Select unit</option>
                              <option value="t/year" title="t/year">t/year</option>
                              <option value="MWh/year" title="MWh/year">MWh/year</option>
                              <option value="t/day" title="t/day">t/day</option>
                              <option value="Nm³/year" title="Nm³/year">Nm³/year</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              placeholder="Enter actual quantity"
                              value={row.actualQuantity}
                              title={row.actualQuantity ? `${row.actualQuantity} ${row.actualQuantityUnit || ''}` : 'Enter actual quantity'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].actualQuantity = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[120px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.actualQuantityUnit}
                              title={row.actualQuantityUnit || 'Select unit'}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p) => {
                                  const copy = [...p.productionStreams];
                                  copy[idx].actualQuantityUnit = val;
                                  return { ...p, productionStreams: copy };
                                });
                              }}
                              className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                            >
                              <option value="" title="Select unit">Select unit</option>
                              <option value="t/year" title="t/year">t/year</option>
                              <option value="MWh/year" title="MWh/year">MWh/year</option>
                              <option value="t/day" title="t/day">t/day</option>
                              <option value="Nm³/year" title="Nm³/year">Nm³/year</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextId = `P${String(currentPlan.productionStreams.length + 1).padStart(2, '0')}`;
                                  updateCurrentPlan((p) => ({
                                    ...p,
                                    productionStreams: [
                                      ...p.productionStreams,
                                      {
                                        id: nextId,
                                        category: '',
                                        technology: '',
                                        energyRelated: '',
                                        processEmissions: '',
                                        capacity: '',
                                        capacityUnit: '',
                                        actualQuantity: '',
                                        actualQuantityUnit: '',
                                      },
                                    ],
                                  }));
                                }}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                title="Add Production Stream"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  updateCurrentPlan((p) => ({
                                    ...p,
                                    productionStreams: p.productionStreams.filter((_: any, i: number) => i !== idx),
                                  }));
                                }}
                                className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                title="Remove Production Stream"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Emissions Estimation */}
          {formActiveTab === 'emissions-estimated' && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Estimated Annual Emissions (tCO₂e)</label>
                  <FieldTooltip
                    content="Forecasted total greenhouse gas emissions across all installation boundaries for the reporting year."
                    example="124,450"
                    unit="tCO₂e"
                  >
                    <input
                      type="text"
                      value={currentPlan.emissionsEstimation.estimatedAnnualEmissions}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          emissionsEstimation: { ...p.emissionsEstimation, estimatedAnnualEmissions: val },
                        }));
                      }}
                      placeholder="124,450"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono font-bold focus:outline-none focus:border-[#004B87] shadow-xs text-xs"
                    />
                  </FieldTooltip>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Justification for the estimated value</label>
                <FieldTooltip
                  content="Technical justification explaining calculation basis, historical trends, or production assumptions."
                  example="Estimated based on 2025 production throughput data, IPCC Tier 2 emission factors, and continuous operational logging."
                >
                  <textarea
                    rows={3}
                    value={currentPlan.emissionsEstimation.justification}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentPlan((p) => ({
                        ...p,
                        emissionsEstimation: { ...p.emissionsEstimation, justification: val },
                      }));
                    }}
                    placeholder="Estimated based on production data and IPCC Guidelines"
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                  />
                </FieldTooltip>
              </div>
            </div>
          )}

          {/* Tab 3: Emission Sources */}
          {formActiveTab === 'emission-sources' && (
            <div className="space-y-2 pt-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Source ID">Source ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Emission Source (Name, Description)">Emission Source (Name, Description)</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Product (ID)">Associated Product (ID)</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Types Of Gas(es) Emitted">Types Of Gas(es) Emitted</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Total Emissions From Source (T CO2e)">Total Emissions From Source (T CO2e)</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[160px]" title="Methodology For Determining...">Methodology For Determining...</th>
                      <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.emissionSources.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="S01"
                            value={row.id}
                            title={row.id || 'Source ID'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].id = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.name}
                            title={row.name || 'Enter emission source name/description'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].name = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            placeholder="e.g. Flare System"
                            className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.associatedProduct}
                            title={row.associatedProduct || 'Select product'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].associatedProduct = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                          >
                            <option value="" title="Select product">Select...</option>
                            {currentPlan.productionStreams.map((ps: any) => (
                              <option key={ps.id} value={ps.id} title={ps.id}>{ps.id}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.gasTypes}
                            title={row.gasTypes || 'Select gas types'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].gasTypes = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select gas types">Select gas types</option>
                            <option value="CO₂" title="CO₂">CO₂</option>
                            <option value="CH₄" title="CH₄">CH₄</option>
                            <option value="N₂O" title="N₂O">N₂O</option>
                            <option value="CO₂, CH₄" title="CO₂, CH₄">CO₂, CH₄</option>
                            <option value="CO₂, CH₄, N₂O" title="CO₂, CH₄, N₂O">CO₂, CH₄, N₂O</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.totalEmissions}
                            title={row.totalEmissions ? `${row.totalEmissions} t CO₂e` : 'Enter total emissions'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].totalEmissions = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            placeholder="45,000"
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.energyRelated}
                            title={row.energyRelated || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].energyRelated = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.processEmissions}
                            title={row.processEmissions || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].processEmissions = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.methodology}
                            title={row.methodology || 'Select methodology'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].methodology = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[155px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select methodology">Select methodology</option>
                            <option value="Calculation-based" title="Calculation-based">Calculation-based</option>
                            <option value="Measurement-based" title="Measurement-based">Measurement-based</option>
                            <option value="Fall-back" title="Fall-back">Fall-back</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextId = `S${String(currentPlan.emissionSources.length + 1).padStart(2, '0')}`;
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  emissionSources: [
                                    ...p.emissionSources,
                                    {
                                      id: nextId,
                                      name: '',
                                      associatedProduct: '',
                                      gasTypes: '',
                                      totalEmissions: '',
                                      energyRelated: '',
                                      processEmissions: '',
                                      methodology: '',
                                    },
                                  ],
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                              title="Add Emission Source"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  emissionSources: p.emissionSources.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                              title="Remove Emission Source"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Methane Emission */}
          {formActiveTab === 'methane-emission' && (
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${!currentPlan.methaneData?.hasMethaneEmissions ? 'text-slate-700' : 'text-slate-400'}`}>No</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateCurrentPlan((p) => ({
                        ...p,
                        methaneData: { ...p.methaneData, hasMethaneEmissions: !p.methaneData?.hasMethaneEmissions },
                      }));
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${currentPlan.methaneData?.hasMethaneEmissions ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentPlan.methaneData?.hasMethaneEmissions ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-xs font-bold ${currentPlan.methaneData?.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                </div>
              </div>

              {currentPlan.methaneData?.hasMethaneEmissions && (
                <div className="pt-2 space-y-4">
                  {/* Row 1: Annual Volume & Estimated CO2e (4-column layout with 2 empty slots) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Annual Volume of methane emissions at site">Annual Volume of methane emissions at site</label>
                      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                        <input
                          type="text"
                          placeholder="If no known emissions, enter N/A"
                          value={currentPlan.methaneData.annualVolume || ''}
                          title={currentPlan.methaneData.annualVolume || 'Annual Volume of methane emissions at site'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentPlan((p) => ({
                              ...p,
                              methaneData: { ...p.methaneData, annualVolume: val },
                            }));
                          }}
                          className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                          <select
                            value={currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}
                            title={currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => ({
                                ...p,
                                methaneData: { ...p.methaneData, annualVolumeUnit: val },
                              }));
                            }}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                          >
                            <option value="t CH₄/year">t CH₄/year</option>
                            <option value="kg CH₄/year">kg CH₄/year</option>
                            <option value="m³ CH₄/year">m³ CH₄/year</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5 text-xs whitespace-nowrap" title="Estimated CO₂e from methane emissions (100-year GWP)">Estimated CO₂e from methane emissions (100-year GWP)</label>
                      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                        <input
                          type="text"
                          placeholder="Use the IPCC Fifth Assessment Report (AR5) GWP-100 values"
                          value={currentPlan.methaneData.estimatedCo2e || ''}
                          title={currentPlan.methaneData.estimatedCo2e || 'Estimated CO₂e from methane emissions'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentPlan((p) => ({
                              ...p,
                              methaneData: { ...p.methaneData, estimatedCo2e: val },
                            }));
                          }}
                          className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                          <select
                            value={currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}
                            title={currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => ({
                                ...p,
                                methaneData: { ...p.methaneData, estimatedCo2eUnit: val },
                              }));
                            }}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                          >
                            <option value="t CO₂e/year">t CO₂e/year</option>
                            <option value="kt CO₂e/year">kt CO₂e/year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Source of estimates, including conversion factors */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Source of estimates, including conversion factors">Source of estimates, including conversion factors</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.sourceOfEstimations || ''}
                      title={currentPlan.methaneData.sourceOfEstimations || 'Source of estimates, including conversion factors'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, sourceOfEstimations: val },
                        }));
                      }}
                      placeholder="Enter the source of estimates, including conversion factors."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 3: Key methane emission sources at the installation */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Key methane emission sources at the installation">Key methane emission sources at the installation</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.keySourcesAtInstallation || ''}
                      title={currentPlan.methaneData.keySourcesAtInstallation || 'Key methane emission sources at the installation'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, keySourcesAtInstallation: val },
                        }));
                      }}
                      placeholder="Provide details of the key emission sources and, where applicable, the source stream type."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 4: Procedures used to determine / estimate the quantity of methane emitted */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Procedures used to determine / estimate the quantity of methane emitted">Procedures used to determine / estimate the quantity of methane emitted</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.procedureToDetermine || ''}
                      title={currentPlan.methaneData.procedureToDetermine || 'Procedures used to determine / estimate the quantity of methane emitted'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, procedureToDetermine: val },
                        }));
                      }}
                      placeholder="Include relevant literature, laboratory analyses, or other methods used."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 5: Procedures Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3 min-w-[140px]" title="Title of Procedure">Title of Procedure</th>
                          <th className="py-2.5 px-3 min-w-[190px]" title="Brief Description including Frequency">Brief Description including Frequency</th>
                          <th className="py-2.5 px-3 min-w-[150px]" title="Person in Charge">Person in Charge</th>
                          <th className="py-2.5 px-3 min-w-[160px]" title="Contact Email">Contact Email</th>
                          <th className="py-2.5 px-3 min-w-[140px]" title="Contact Phone Number">Contact Phone Number</th>
                          <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0
                          ? currentPlan.methaneProcedures
                          : [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }]
                        ).map((proc: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.title}
                                title={proc.title || 'Enter title of procedure'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].title = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. LDAR"
                                className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.description}
                                title={proc.description || 'Enter description including frequency'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].description = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. Semi-annual inspection"
                                className="w-full min-w-[180px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.personInCharge}
                                title={proc.personInCharge || 'Enter person in charge'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].personInCharge = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. Ahmed Al Mansoori"
                                className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="email"
                                value={proc.email}
                                title={proc.email || 'Enter contact email'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].email = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. ahmed@gmcf.ae"
                                className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.phone}
                                title={proc.phone || 'Enter contact phone number'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].phone = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. +971 50 123 4567"
                                className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateCurrentPlan((p) => ({
                                      ...p,
                                      methaneProcedures: [
                                        ...(p.methaneProcedures || []),
                                        {
                                          id: String((p.methaneProcedures || []).length + 1),
                                          title: '',
                                          description: '',
                                          personInCharge: '',
                                          email: '',
                                          phone: '',
                                        },
                                      ],
                                    }));
                                  }}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                  title="Add Methane Procedure"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateCurrentPlan((p) => ({
                                      ...p,
                                      methaneProcedures: (p.methaneProcedures || []).filter((_: any, i: number) => i !== idx),
                                    }));
                                  }}
                                  className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                  title="Remove Methane Procedure"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Source Stream */}
          {formActiveTab === 'source-stream' && (
            <div className="space-y-2 pt-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[90px]" title="Source Stream ID">Source Stream ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]" title="Description Of Source Stream">Description Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Emission Source (ID)">Associated Emission Source (ID)</th>
                      <th className="py-2.5 px-3 min-w-[150px]" title="Classification Of Source Stream">Classification Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Level Of Source Stream Activity">Level Of Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Source Stream Activity">Unit For Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Type Of Fuel (If Applicable)">Type Of Fuel (If Applicable)</th>
                      <th className="py-2.5 px-3 min-w-[170px]" title="Combustion Device / Technology">Combustion Device / Technology</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Combustion Device Capacity">Combustion Device Capacity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Metric">Unit For Metric</th>
                      <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.sourceStreams.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            title={row.id || 'Source Stream ID'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].id = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[70px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.description}
                            title={row.description || 'Enter description'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].description = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="Enter description"
                            className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.associatedSource}
                            title={row.associatedSource || 'Select source'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].associatedSource = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                          >
                            <option value="" title="Select source">Select...</option>
                            {currentPlan.emissionSources.map((es: any) => (
                              <option key={es.id} value={es.id} title={es.id}>{es.id}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.classification}
                            title={row.classification || 'Select classification'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].classification = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[145px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select classification">Select classification</option>
                            <option value="Fuel Combusted" title="Fuel Combusted">Fuel Combusted</option>
                            <option value="Other Input" title="Other Input">Other Input</option>
                            <option value="Output" title="Output">Output</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.activityLevel}
                            title={row.activityLevel ? `${row.activityLevel} ${row.activityUnit || ''}` : 'Enter activity level'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].activityLevel = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="10,000"
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.activityUnit}
                            title={row.activityUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].activityUnit = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="Nm³" title="Nm³">Nm³</option>
                            <option value="t" title="t">t</option>
                            <option value="MWh" title="MWh">MWh</option>
                            <option value="GJ" title="GJ">GJ</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.fuelType}
                            title={row.fuelType || 'Select fuel type'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].fuelType = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select fuel type">Select fuel type</option>
                            <option value="Natural gas" title="Natural gas">Natural gas</option>
                            <option value="Diesel" title="Diesel">Diesel</option>
                            <option value="Heavy Fuel Oil" title="Heavy Fuel Oil">Heavy Fuel Oil</option>
                            <option value="Coal" title="Coal">Coal</option>
                            <option value="LPG" title="LPG">LPG</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.combustionDevice || ''}
                            title={row.combustionDevice || 'Enter combustion device/technology'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].combustionDevice = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="Gas-fired heaters"
                            className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.deviceCapacity || ''}
                            title={row.deviceCapacity ? `${row.deviceCapacity} ${row.metricUnit || ''}` : 'Enter device capacity'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].deviceCapacity = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="100.0"
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.metricUnit}
                            title={row.metricUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].metricUnit = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="MW" title="MW">MW</option>
                            <option value="kW" title="kW">kW</option>
                            <option value="t/h" title="t/h">t/h</option>
                            <option value="GJ/h" title="GJ/h">GJ/h</option>
                            <option value="MMBtu/hr" title="MMBtu/hr">MMBtu/hr</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextId = `FC${currentPlan.sourceStreams.length + 1}`;
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  sourceStreams: [
                                    ...p.sourceStreams,
                                    {
                                      id: nextId,
                                      description: '',
                                      associatedSource: '',
                                      classification: '',
                                      activityLevel: '',
                                      activityUnit: '',
                                      fuelType: '',
                                      combustionDevice: '',
                                      deviceCapacity: '',
                                      metricUnit: '',
                                    },
                                  ],
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                              title="Add Source Stream"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  sourceStreams: p.sourceStreams.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                              title="Remove Source Stream"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 6: Supporting Documents & Remarks */}
          {formActiveTab === 'supporting-documents-remarks' && (
            <div className="space-y-4 pt-1">
              {/* Supporting Documents */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">
                  Supporting Documents
                </h4>
                <FieldTooltip
                  content="Upload statutory monitoring plan attachments including calibration certificates, flow diagrams, or P&ID instrumentation documents."
                  format="PDF, PNG, JPG, XLSX (Max 25MB)"
                >
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                    {/* Upload Input Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 rounded-xl px-4 py-2 flex items-center justify-between gap-3 shrink-0 cursor-pointer transition-colors min-w-[280px]"
                    >
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                        <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="whitespace-nowrap">Drag and drop files here or upload</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>

                    {/* Remaining area: Uploaded documents in one line */}
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                      {currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? (
                        currentPlan.attachedFiles.map((file: any, idx: number) => (
                          <div
                            key={idx}
                            className="border border-slate-200 bg-white rounded-xl py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px] hover:border-slate-300 transition-all"
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
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  attachedFiles: (p.attachedFiles || []).filter((_: any, i: number) => i !== idx),
                                }))
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

              {/* Remarks / Description */}
              <div>
                <label className="block font-bold text-[#336D9F] mb-1.5 text-xs">
                  Remarks / Description
                </label>
                <FieldTooltip
                  content="Optional remarks, regulatory compliance context, or explanatory notes for this monitoring plan."
                  example="Monitoring methodology adheres strictly to EAD MRV Guidelines Chapter 4 for Thermal Power Installations."
                >
                  <textarea
                    rows={3}
                    value={currentPlan.remarks || ''}
                    onChange={(e) => updateCurrentPlan((p) => ({ ...p, remarks: e.target.value }))}
                    placeholder="Monitoring methodology adheres strictly to EAD MRV Guidelines Chapter 4 for Thermal Power Installations."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed text-xs"
                  />
                </FieldTooltip>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role-Based Bottom Action Bar */}
      <div className="flex-shrink-0 pt-3.5 pb-2 flex items-center justify-end gap-3">
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

        {isFacilityOperator && (
          <>
            {formActiveTab === 'facility-description' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emissions-estimated')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emissions-estimated' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emission-sources')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emission-sources' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('methane-emission')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'methane-emission' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('source-stream')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'source-stream' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('supporting-documents-remarks')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'supporting-documents-remarks' && (
              <button
                type="button"
                onClick={() => {
                  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  updateCurrentPlan((p) => ({
                    ...p,
                    status: 'Submitted',
                    submittedDate: todayStr,
                    updatedDate: todayStr,
                  }));
                  setFacilityMonitoringPlanStatus(selectedFacilityId, 'Submitted');
                  setMonitoringPlanStatus('Submitted');
                  setViewMode('table');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>{currentPlan.status === 'Correction Required' ? 'Resubmit Monitoring Plan' : 'Submit Monitoring Plan'}</span>
                <Send className="w-3.5 h-3.5 fill-current" />
              </button>
            )}
          </>
        )}

        {isEadReviewerOrAdmin && (
          <>
            {formActiveTab === 'facility-description' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emissions-estimated')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emissions-estimated' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('emission-sources')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'emission-sources' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('methane-emission')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'methane-emission' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('source-stream')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'source-stream' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('supporting-documents-remarks')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'supporting-documents-remarks' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    updateCurrentPlan((p) => ({
                      ...p,
                      status: 'Correction Required',
                      eadCorrectionDate: '07-Oct-2026',
                      updatedDate: todayStr,
                    }));
                    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Correction Required');
                    setMonitoringPlanStatus('Correction Required');
                    setViewMode('table');
                  }}
                  className="px-5 py-2 bg-[#FFF8E7] hover:bg-[#FEF0CD] border border-[#FCD34D] text-[#975A16] font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 text-[#975A16]" />
                  <span>Return for Correction</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    updateCurrentPlan((p) => ({
                      ...p,
                      status: 'Rejected',
                      updatedDate: todayStr,
                    }));
                    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Rejected');
                    setMonitoringPlanStatus('Rejected');
                    setViewMode('table');
                  }}
                  className="px-5 py-2 bg-[#FFF0F3] hover:bg-[#FFE2E6] border border-[#FDA4AF] text-[#9F1239] font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <XCircle className="w-4 h-4 text-[#9F1239]" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    updateCurrentPlan((p) => ({
                      ...p,
                      status: 'Approved',
                      eadCorrectionDate: null,
                      updatedDate: todayStr,
                    }));
                    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Approved');
                    setMonitoringPlanStatus('Approved');
                    setViewMode('table');
                  }}
                  className="px-6 py-2 bg-[#00875A] hover:bg-[#00754E] border border-[#00875A] text-white font-bold text-xs rounded-[8px] shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>EAD Approve Plan</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
