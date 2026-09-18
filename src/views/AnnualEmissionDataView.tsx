import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
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
    openReadOnlyViewer,
  } = useMRV();

  // Tab Navigation: Facility Information, Monitoring Methods, Mitigation Measures, Data Management & QA/QC, Review & Submit
  const [activeTab, setActiveTab] = useState<
    'facility-info' | 'monitoring-methods' | 'mitigation-measures' | 'qa-qc' | 'review-submit'
  >('facility-info');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');

  // =========================================================================
  // FACILITY INFORMATION (Auto-populated from Registration + Monitoring Plan)
  // =========================================================================
  const facilityInfo = {
    facilityName: activeFacility?.name || 'Green Mountain Cement Factory',
    facilityId: activeFacility?.facilityCode || 'FAC-000451',
    operatorName: activeFacility?.operatorName || 'Green Mountain Holdings LLC',
    facilityType: 'Manufacturing Plant',
    country: 'UAE',
    emirate: activeFacility?.emirate || 'Abu Dhabi',
    facilityDescription: 'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
    businessSector: activeFacility?.sector || 'Energy',
    primaryActivity: activeFacility?.primaryActivity || 'Combustion of Fuel',
    operationalStatus: 'Operational',
    approvedMonitoringPlan: 'MP-2026-001 (Approved: 15-Jun-2026)',
    reportingYear: String(reportingYear || 2026),
  };

  const productionStreams = [
    { id: 'P01', category: 'Primary Products', technology: 'Process A', capacity: '100,000 t/year', actual: '85,000 t/year' },
    { id: 'P02', category: 'Primary Products', technology: 'Process B', capacity: '50,000 t/year', actual: '100,000 t/year' },
    { id: 'P03', category: 'Primary Products', technology: 'Kiln Process', capacity: '100,000 t/year', actual: '100,000 t/year' },
  ];

  // =========================================================================
  // MITIGATION MEASURES STATE
  // =========================================================================
  const [mitigationMeasures, setMitigationMeasures] = useState([
    {
      description: 'Waste Heat Recovery System Installation on Kiln Exhaust',
      category: 'Emission Reduction',
      scope: '1',
      ghg: 'CO₂',
      startYear: '2024',
      status: 'Implemented',
      preMeasureRef: '4,200 (2022 avg)',
      reportingYearReduction: '3,850',
      expectedAnnualReduction: '4,000',
      methodology: 'Engineering energy balance against historical fuel consumption baselines (ISO 50001)',
      verification: 'Third-party verified',
    },
    {
      description: 'Clinker Factor Reduction using Pozzolanic Additives',
      category: 'Emission Reduction',
      scope: '1',
      ghg: 'CO₂',
      startYear: '2025',
      status: 'Planned',
      preMeasureRef: '12,500 (2023 avg)',
      reportingYearReduction: '1,200',
      expectedAnnualReduction: '5,500',
      methodology: 'Mass balance clinker replacement model according to IPCC Tier 2 Guidelines',
      verification: 'Internally verified',
    },
  ]);

  const [mitigationAdditionalInfo, setMitigationAdditionalInfo] = useState('');

  const addMitigationMeasure = () => {
    setMitigationMeasures((prev) => [
      ...prev,
      {
        description: '',
        category: '',
        scope: '',
        ghg: '',
        startYear: '',
        status: '',
        preMeasureRef: '',
        reportingYearReduction: '',
        expectedAnnualReduction: '',
        methodology: '',
        verification: '',
      },
    ]);
  };

  const removeMitigationMeasure = (idx: number) => {
    setMitigationMeasures((prev) => prev.filter((_, i) => i !== idx));
  };

  // =========================================================================
  // QA/QC & DATA MANAGEMENT
  // =========================================================================
  const [qaVerificationDesc, setQaVerificationDesc] = useState(
    'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.'
  );
  const [qaFurtherDetails, setQaFurtherDetails] = useState('');

  const [qaDataGaps, setQaDataGaps] = useState([
    { sourceStream: 'S05 - Flare Vent', fromDate: '01-Jan-2024', untilDate: '15-Jan-2024', description: 'CEMS downtime', estimatedEmissions: '12.40', sourceOfEstimate: 'Similar period avg' },
    { sourceStream: 'S08 - Boiler 3', fromDate: '10-Feb-2024', untilDate: '12-Feb-2024', description: 'Data logger issue', estimatedEmissions: '5.70', sourceOfEstimate: 'Fuel Consumption estimate' },
    { sourceStream: 'S12 - Compressor', fromDate: '03-Mar-2024', untilDate: '05-Mar-2024', description: 'Maintenance activity', estimatedEmissions: '1.15', sourceOfEstimate: 'Equipment capacity method' },
  ]);

  const [qaManagementResp, setQaManagementResp] = useState([
    { jobTitle: 'GHG Manager', responsibilities: 'Supervise MRV operations, review activity registers' },
    { jobTitle: 'Environmental Engineer', responsibilities: 'Log CEMS telemetry, track fuel meter calibrations' },
    { jobTitle: 'Quality Assurance Officer', responsibilities: 'Conduct quarterly internal data checks and audits' },
  ]);

  const [qaProcedures, setQaProcedures] = useState([
    {
      procedureTitle: 'ETS QA/QC of MI',
      reference: 'EAD_QA_QC_01',
      briefDescription: 'Quality control procedures for measurement instruments and data integrity.',
      responsibleDept: 'Measurement & Control',
      recordStorage: 'QA/QC Records',
    },
    {
      procedureTitle: 'Instrument Calibration',
      reference: 'QA_CAL_02',
      briefDescription: 'Routine calibration protocol for online analyzers and flow meters.',
      responsibleDept: 'Operations',
      recordStorage: 'Calibration Records',
    },
  ]);

  const [qaDiagramFiles, setQaDiagramFiles] = useState<
    { id: string; name: string; size: string; uploadDate: string }[]
  >([
    {
      id: 'diag-1',
      name: 'QA_QC_DataFlow_Diagram_Rev3.pdf',
      size: '1.8 MB',
      uploadDate: '12-Jan-2024',
    },
  ]);
  const qaDiagramInputRef = useRef<HTMLInputElement>(null);
  const [previewModalFile, setPreviewModalFile] = useState<{ name: string } | null>(null);

  const handleQaDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files).map((file, idx) => ({
      id: `diag-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
    }));
    setQaDiagramFiles((prev) => [...prev, ...newFiles]);
    if (e.target) e.target.value = '';
  };

  const removeQaDiagramFile = (id: string) => {
    setQaDiagramFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const [qaInternalReview, setQaInternalReview] = useState([
    {
      procedureTitle: 'ETS Data Validation',
      reference: 'EAD_VAL_01',
      briefDescription: 'Independent cross-check of data logs, calculations, and metering records.',
      responsibleDept: 'Measurement & Control',
      recordStorage: 'Validation Records',
    },
    {
      procedureTitle: 'Annual Internal Review',
      reference: 'INT_REV_02',
      briefDescription: 'Annual compliance review and internal audit of MRV systems and procedures.',
      responsibleDept: 'Compliance',
      recordStorage: 'Internal Audit Folder',
    },
  ]);

  const [reviewDiagramFiles, setReviewDiagramFiles] = useState<
    { id: string; name: string; size: string; uploadDate: string }[]
  >([
    {
      id: 'rev-diag-1',
      name: 'Internal_Review_Workflow_2026.pdf',
      size: '1.4 MB',
      uploadDate: '15-Feb-2024',
    },
  ]);
  const reviewDiagramInputRef = useRef<HTMLInputElement>(null);

  const handleReviewDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const newFiles = Array.from(e.target.files).map((file, idx) => ({
      id: `rev-diag-${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
    }));
    setReviewDiagramFiles((prev) => [...prev, ...newFiles]);
    if (e.target) e.target.value = '';
  };

  const removeReviewDiagramFile = (id: string) => {
    setReviewDiagramFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const addQaDataGap = () => {
    setQaDataGaps((prev) => [
      ...prev,
      { sourceStream: '', fromDate: '', untilDate: '', description: '', estimatedEmissions: '', sourceOfEstimate: '' },
    ]);
  };
  const removeQaDataGap = (idx: number) => setQaDataGaps((prev) => prev.filter((_, i) => i !== idx));

  const addQaManagementResp = () => {
    setQaManagementResp((prev) => [
      ...prev,
      { jobTitle: '', responsibilities: '' },
    ]);
  };
  const removeQaManagementResp = (idx: number) => setQaManagementResp((prev) => prev.filter((_, i) => i !== idx));

  const addQaProcedure = () => {
    setQaProcedures((prev) => [
      ...prev,
      { procedureTitle: '', reference: '', briefDescription: '', responsibleDept: '', recordStorage: '' },
    ]);
  };
  const removeQaProcedure = (idx: number) => setQaProcedures((prev) => prev.filter((_, i) => i !== idx));

  const addQaInternalReview = () => {
    setQaInternalReview((prev) => [
      ...prev,
      { procedureTitle: '', reference: '', briefDescription: '', responsibleDept: '', recordStorage: '' },
    ]);
  };
  const removeQaInternalReview = (idx: number) => setQaInternalReview((prev) => prev.filter((_, i) => i !== idx));

  // =========================================================================
  // REVIEW & SUBMIT
  // =========================================================================
  const [declarationChecks, setDeclarationChecks] = useState({
    check1: false,
    check2: false,
    check3: false,
  });

  const [declarationForm, setDeclarationForm] = useState({
    name: 'Umasri Mavillapally',
    designation: 'Facility Operator',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  });

  const [submissionStatus, setSubmissionStatus] = useState('Draft');

  const handleSave = () => {
    setNoticeMessage('Data Saved Successfully!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSubmit = () => {
    const isResubmit = workflowState.annualEmissionStatus === 'Correction Required';
    setSubmissionStatus('Submitted');
    setAnnualEmissionStatus('Submitted');
    setVerificationStatus('Pending Verification');
    setNoticeMessage(
      isResubmit
        ? 'Annual Emission Data Resubmitted! Routed to Third-Party Verification.'
        : 'Annual Emission Data Submitted! Third-Party Verification is now unlocked.'
    );
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  // =========================================================================
  // LOCKED STATE CHECK
  // =========================================================================
  if (!isAnnualEmissionUnlocked) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Annual Emission Data Locked</h2>
          <p className="text-sm text-slate-500 max-w-md">
            The Monitoring Plan must be <span className="font-bold text-[#004B87]">Approved / Accepted</span> before Annual Emission Data entry becomes available.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Current Monitoring Plan Status: <span className="font-bold text-amber-600">{workflowState.monitoringPlanStatus}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveView('data-entry')}
          className="mt-2 px-5 py-2 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] transition-colors cursor-pointer"
        >
          Go to Monitoring Plan
        </button>
      </div>
    );
  }

  // Dynamic Tab Notification Indicator based on data & status indication
  const renderTabNotification = () => {
    const isPlanApproved =
      workflowState.monitoringPlanStatus === 'Approved' ||
      workflowState.monitoringPlanStatus === 'Accepted' ||
      workflowState.monitoringPlanStatus === 'Active';
    const isRegApproved =
      workflowState.registrationStatus === 'Approved' ||
      workflowState.registrationStatus === 'Registered';

    switch (activeTab) {
      case 'facility-info': {
        if (isRegApproved && isPlanApproved) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="These fields are read-only and sourced from the approved Facility Registration and Monitoring Plan."
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden xl:inline">Auto-populated from Approved Registration & Plan</span>
              <span className="xl:hidden">Approved Sourced</span>
            </div>
          );
        }
        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-50 text-[#004B87] border border-sky-200/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="These fields are read-only and sourced from the Facility Registration and Monitoring Plan."
          >
            <Info className="w-3.5 h-3.5 text-[#004B87] flex-shrink-0" />
            <span className="hidden xl:inline">Auto-populated from Registration & Plan</span>
            <span className="xl:hidden">Auto-populated</span>
          </div>
        );
      }

      case 'mitigation-measures': {
        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-50 text-[#004B87] border border-sky-200/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Greenhouse gas mitigation actions and reduction plans."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#004B87] flex-shrink-0" />
            <span className="hidden xl:inline">Mitigation Measures & Reductions</span>
            <span className="xl:hidden">Mitigation Measures</span>
          </div>
        );
      }

      case 'qa-qc': {
        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Quality assurance and data management procedures configured."
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="hidden xl:inline">QA/QC Protocols & Procedures Configured</span>
            <span className="xl:hidden">QA/QC Configured</span>
          </div>
        );
      }

      case 'review-submit': {
        const isReady =
          declarationChecks.check1 &&
          declarationChecks.check2 &&
          declarationChecks.check3;

        if (submissionStatus === 'Submitted') {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Annual Emission Report has been submitted."
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden xl:inline">Submission Completed</span>
              <span className="xl:hidden">Submitted</span>
            </div>
          );
        }

        if (isReady) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="All checks confirmed. Ready to submit to EAD."
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden xl:inline">Declarations Confirmed • Ready to Submit</span>
              <span className="xl:hidden">Ready to Submit</span>
            </div>
          );
        }

        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Please review all statements and confirm declarations before submitting."
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="hidden xl:inline">Operator Sign-Off Pending</span>
            <span className="xl:hidden">Pending Sign-off</span>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* TOP HEADER */}
      <div className="flex-shrink-0 space-y-3 pb-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
                Annual Emission Data Entry
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Enter and submit annual emission data for the reporting year
              </p>
            </div>

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{noticeMessage}</span>
              </div>
            )}
          </div>

          {/* Status badge & View Report button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openReadOnlyViewer({
                moduleType: 'annual-emission-data',
                title: 'Annual GHG Emissions Report (Reporting Year 2026)',
                status: workflowState.annualEmissionStatus,
                submittedBy: 'Umasri Mavillapally (Facility Compliance Lead)',
                submittedDate: '14 Mar 2026, 11:30 AM',
                reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
                initialTab: 'data',
              })}
              className="px-3 py-1 bg-[#004B87]/10 hover:bg-[#004B87]/20 border border-[#004B87]/30 text-[#004B87] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Open Complete Read-Only Emissions Report"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Report</span>
            </button>

            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              submissionStatus === 'Draft' ? 'bg-slate-100 text-slate-600' :
              submissionStatus === 'Submitted' ? 'bg-blue-100 text-blue-700' :
              submissionStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {submissionStatus}
            </span>
          </div>
        </div>

        {/* Top Selectors - 4-column row layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility / Plant Name</label>
            <div className="relative">
              <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-8">
                <option>{facilityInfo.facilityName}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reporting Year</label>
            <div className="relative">
              <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-8">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Approved Monitoring Plan</label>
            <input type="text" readOnly value={facilityInfo.approvedMonitoringPlan} className="w-full px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium cursor-not-allowed" />
          </div>
          {/* 4th slot kept empty */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* INNER CARD WITH TABS - Reduced padding all 4 sides */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex-shrink-0 pb-2.5 mb-2.5 flex flex-wrap items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('facility-info')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'facility-info'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Facility Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monitoring-methods')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'monitoring-methods'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Monitoring Methods
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mitigation-measures')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'mitigation-measures'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Mitigation Measures
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qa-qc')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'qa-qc'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Data Management & QA/QC
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('review-submit')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'review-submit'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Review & Submit
            </button>
          </div>

          {/* Far-Right Dynamic Info & Status Pill based on data indication */}
          {renderTabNotification()}
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 overflow-y-auto py-1 space-y-4 pr-1.5 no-scrollbar text-xs">

          {/* ================================================================= */}
          {/* TAB 1: FACILITY INFORMATION */}
          {/* ================================================================= */}
          {activeTab === 'facility-info' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Facility / Plant Name', value: facilityInfo.facilityName },
                  { label: 'Facility ID', value: facilityInfo.facilityId },
                  { label: 'Operator Name', value: facilityInfo.operatorName },
                  { label: 'Facility Type', value: facilityInfo.facilityType },
                  { label: 'Country', value: facilityInfo.country },
                  { label: 'Emirate / Region', value: facilityInfo.emirate },
                  { label: 'Business Sector', value: facilityInfo.businessSector },
                  { label: 'Primary Activity', value: facilityInfo.primaryActivity },
                  { label: 'Operational Status', value: facilityInfo.operationalStatus },
                  { label: 'Approved Monitoring Plan', value: facilityInfo.approvedMonitoringPlan },
                  { label: 'Reporting Year', value: facilityInfo.reportingYear },
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="block text-slate-600 font-semibold mb-1">{field.label}</label>
                    <input
                      type="text"
                      readOnly
                      value={field.value}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>

              {/* Facility Description */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Facility Description</label>
                <textarea
                  rows={3}
                  readOnly
                  value={facilityInfo.facilityDescription}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 cursor-not-allowed leading-relaxed"
                />
              </div>

              {/* Production Streams */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Production Streams</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Product ID</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Technology / Process</th>
                        <th className="py-2.5 px-3">Production Capacity</th>
                        <th className="py-2.5 px-3">Actual Production</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionStreams.map((stream, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]">{stream.id}</td>
                          <td className="py-2.5 px-3">{stream.category}</td>
                          <td className="py-2.5 px-3">{stream.technology}</td>
                          <td className="py-2.5 px-3">{stream.capacity}</td>
                          <td className="py-2.5 px-3">{stream.actual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MONITORING METHODS */}
          {/* ================================================================= */}
          {activeTab === 'monitoring-methods' && (
            <MonitoringMethodsTab />
          )}

          {/* ================================================================= */}
          {/* TAB 3: MITIGATION MEASURES */}
          {/* ================================================================= */}
          {activeTab === 'mitigation-measures' && (
            <div className="space-y-4 animate-fade-in text-xs">
              {/* Greenhouse Gas Mitigation Measures Table */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Greenhouse Gas Mitigation Measures
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  {/* Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3 min-w-[200px]">Description of measure</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Category</th>
                          <th className="py-2.5 px-3 min-w-[100px]">Scope (1 / 2 / 3)</th>
                          <th className="py-2.5 px-3 min-w-[110px]">GHG</th>
                          <th className="py-2.5 px-3 min-w-[90px]">Start year</th>
                          <th className="py-2.5 px-3 min-w-[140px]">Status</th>
                          <th className="py-2.5 px-3 min-w-[170px]">Pre-measure reference [tCO₂e/yr]</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Reporting year reduction [tCO₂e/yr]</th>
                          <th className="py-2.5 px-3 min-w-[160px]">Expected annual reduction [tCO₂e/yr]</th>
                          <th className="py-2.5 px-3 min-w-[220px]">Methodology / standard</th>
                          <th className="py-2.5 px-3 min-w-[150px]">Verification</th>
                          <th className="py-2.5 px-3 text-center w-16">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {mitigationMeasures.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            {/* Description of measure */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.description}
                                placeholder="Enter description of measure"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].description = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Category */}
                            <td className="py-2 px-3">
                              <select
                                value={row.category}
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].category = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                              >
                                <option value="">Select category</option>
                                <option value="Emission Reduction">Emission Reduction</option>
                                <option value="Emission Avoidance">Emission Avoidance</option>
                                <option value="Carbon Removal">Carbon Removal</option>
                                <option value="External Offset">External Offset</option>
                              </select>
                            </td>

                            {/* Scope (1 / 2 / 3) */}
                            <td className="py-2 px-3">
                              <select
                                value={row.scope}
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].scope = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                              >
                                <option value="">Select scope</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                              </select>
                            </td>

                            {/* GHG */}
                            <td className="py-2 px-3">
                              <select
                                value={row.ghg}
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].ghg = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                              >
                                <option value="">Select GHG</option>
                                <option value="CO₂">CO₂</option>
                                <option value="CH₄">CH₄</option>
                                <option value="N₂O">N₂O</option>
                                <option value="CO₂, CH₄">CO₂, CH₄</option>
                                <option value="Mixed">Mixed</option>
                              </select>
                            </td>

                            {/* Start year */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.startYear}
                                placeholder="YYYY"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].startYear = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Status */}
                            <td className="py-2 px-3">
                              <select
                                value={row.status}
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].status = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                              >
                                <option value="">Select status</option>
                                <option value="Implemented">Implemented</option>
                                <option value="Planned">Planned</option>
                                <option value="Feasibility Study">Feasibility Study</option>
                                <option value="Discontinued">Discontinued</option>
                              </select>
                            </td>

                            {/* Pre-measure reference [tCO2e/yr] */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.preMeasureRef}
                                placeholder="e.g. 4,200 (2022 avg)"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].preMeasureRef = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Reporting year reduction [tCO2e/yr] */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.reportingYearReduction}
                                placeholder="Enter reduction"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].reportingYearReduction = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Expected annual reduction [tCO2e/yr] */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.expectedAnnualReduction}
                                placeholder="Enter expected"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].expectedAnnualReduction = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Methodology / standard */}
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.methodology}
                                placeholder="Calculation method, model, or standard used"
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].methodology = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full min-w-[200px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>

                            {/* Verification */}
                            <td className="py-2 px-3">
                              <select
                                value={row.verification}
                                onChange={(e) => {
                                  const copy = [...mitigationMeasures];
                                  copy[idx].verification = e.target.value;
                                  setMitigationMeasures(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                              >
                                <option value="">Select verification</option>
                                <option value="Not verified">Not verified</option>
                                <option value="Internally verified">Internally verified</option>
                                <option value="Third-party verified">Third-party verified</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={addMitigationMeasure}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                  title="Add Mitigation Measure"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeMitigationMeasure(idx)}
                                  className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                  title="Remove Mitigation Measure"
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

              {/* Additional Information - Open Card Box */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white p-4 sm:p-5 shadow-2xs space-y-2">
                <label className="block text-slate-700 font-semibold text-xs leading-relaxed">
                  Please provide any other information that you think may be relevant. If there is nothing, please add N/A below.
                </label>
                <textarea
                  rows={4}
                  value={mitigationAdditionalInfo}
                  onChange={(e) => setMitigationAdditionalInfo(e.target.value)}
                  placeholder="Please provide any other relevant mitigation details, or enter N/A..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder:text-slate-400 placeholder:text-xs text-xs focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: QA/QC & DATA MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'qa-qc' && (
            <div className="space-y-4 animate-fade-in text-xs">
              {/* Card 1: Internal QA/QC Methodology */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Internal QA/QC Methodology
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">
                      Provide a detailed description of the internal QA/QC methodology applied for all source streams and sources
                    </label>
                    <textarea
                      rows={3}
                      value={qaVerificationDesc}
                      onChange={(e) => setQaVerificationDesc(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Data Gaps */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Data Gaps
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Source Stream / ID</th>
                          <th className="py-2.5 px-3">From</th>
                          <th className="py-2.5 px-3">Until</th>
                          <th className="py-2.5 px-3">Description, Reasons And Methods</th>
                          <th className="py-2.5 px-3">Estimated Emissions (t CO₂e)</th>
                          <th className="py-2.5 px-3">Source Of Estimated Emissions</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {qaDataGaps.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.sourceStream}
                                placeholder="Enter source stream / ID"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].sourceStream = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.fromDate}
                                placeholder="DD-MMM-YYYY"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].fromDate = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.untilDate}
                                placeholder="DD-MMM-YYYY"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].untilDate = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.description}
                                placeholder="Enter description, reasons and methods"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].description = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-44 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.estimatedEmissions}
                                placeholder="Enter emissions (tCO₂e)"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].estimatedEmissions = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.sourceOfEstimate}
                                placeholder="Enter source of estimate"
                                onChange={(e) => {
                                  const copy = [...qaDataGaps];
                                  copy[idx].sourceOfEstimate = e.target.value;
                                  setQaDataGaps(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                                  title="Remove Data Gap"
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

              {/* Card 3: Management Responsibilities */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Management Responsibilities
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3 w-1/3">Job Title / Post</th>
                          <th className="py-2.5 px-3">Responsibilities</th>
                          <th className="py-2.5 px-3 text-center w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {qaManagementResp.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.jobTitle}
                                placeholder="Enter job title / post"
                                onChange={(e) => {
                                  const copy = [...qaManagementResp];
                                  copy[idx].jobTitle = e.target.value;
                                  setQaManagementResp(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.responsibilities}
                                placeholder="Enter responsibilities"
                                onChange={(e) => {
                                  const copy = [...qaManagementResp];
                                  copy[idx].responsibilities = e.target.value;
                                  setQaManagementResp(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card 4: Quality Assurance Procedures */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Quality Assurance Procedures
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Title of Procedure</th>
                          <th className="py-2.5 px-3">Reference for Procedure</th>
                          <th className="py-2.5 px-3">Brief Description of Procedure</th>
                          <th className="py-2.5 px-3">Post / Department Responsible</th>
                          <th className="py-2.5 px-3">Location Where Records Are Kept</th>
                          <th className="py-2.5 px-3 text-center w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {qaProcedures.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.procedureTitle}
                                placeholder="Enter procedure title"
                                onChange={(e) => {
                                  const copy = [...qaProcedures];
                                  copy[idx].procedureTitle = e.target.value;
                                  setQaProcedures(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.reference}
                                placeholder="Enter reference"
                                onChange={(e) => {
                                  const copy = [...qaProcedures];
                                  copy[idx].reference = e.target.value;
                                  setQaProcedures(copy);
                                }}
                                className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.briefDescription}
                                placeholder="Enter procedure description"
                                onChange={(e) => {
                                  const copy = [...qaProcedures];
                                  copy[idx].briefDescription = e.target.value;
                                  setQaProcedures(copy);
                                }}
                                className="w-64 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.responsibleDept}
                                placeholder="Enter post or department"
                                onChange={(e) => {
                                  const copy = [...qaProcedures];
                                  copy[idx].responsibleDept = e.target.value;
                                  setQaProcedures(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.recordStorage}
                                placeholder="Enter record storage location"
                                onChange={(e) => {
                                  const copy = [...qaProcedures];
                                  copy[idx].recordStorage = e.target.value;
                                  setQaProcedures(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Diagram References (Optional) Upload Area */}
                  <div className="pt-3 border-t border-slate-100">
                    <input
                      type="file"
                      ref={qaDiagramInputRef}
                      onChange={handleQaDiagramUpload}
                      className="hidden"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.svg,.vsd,.vsdx,.dwg"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">Diagram References (Optional)</h5>
                        <p className="text-[11px] text-slate-500">
                          Attach diagram-related workflows, schematics, or architecture documents for the QA procedures.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => qaDiagramInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#004B87] hover:bg-[#003865] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Diagram / Supporting File</span>
                      </button>
                    </div>

                    {/* Uploaded Files List */}
                    {qaDiagramFiles.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {qaDiagramFiles.map((file) => (
                          <div
                            key={file.id}
                            className="border border-slate-200 bg-slate-50/60 rounded-xl p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xs hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-[#004B87]" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                  {file.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  <span>{file.size}</span>
                                  {file.uploadDate && <span> • {file.uploadDate}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewModalFile({ name: file.name })}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#004B87] hover:bg-sky-50 rounded-md transition-colors cursor-pointer"
                                title="View / Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeQaDiagramFile(file.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 text-center text-slate-400 text-xs">
                        No diagram files attached yet. Click "Upload Diagram / Supporting File" to attach diagrams.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 5: Internal Review & Validation */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Internal Review & Validation
                  </span>
                </div>
                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Title of Procedure</th>
                          <th className="py-2.5 px-3">Reference for Procedure</th>
                          <th className="py-2.5 px-3">Brief Description of Procedure</th>
                          <th className="py-2.5 px-3">Post / Department Responsible</th>
                          <th className="py-2.5 px-3">Location Where Records Are Kept</th>
                          <th className="py-2.5 px-3 text-center w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {qaInternalReview.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.procedureTitle}
                                placeholder="Enter procedure title"
                                onChange={(e) => {
                                  const copy = [...qaInternalReview];
                                  copy[idx].procedureTitle = e.target.value;
                                  setQaInternalReview(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.reference}
                                placeholder="Enter reference"
                                onChange={(e) => {
                                  const copy = [...qaInternalReview];
                                  copy[idx].reference = e.target.value;
                                  setQaInternalReview(copy);
                                }}
                                className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.briefDescription}
                                placeholder="Enter procedure description"
                                onChange={(e) => {
                                  const copy = [...qaInternalReview];
                                  copy[idx].briefDescription = e.target.value;
                                  setQaInternalReview(copy);
                                }}
                                className="w-64 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.responsibleDept}
                                placeholder="Enter responsible post or department"
                                onChange={(e) => {
                                  const copy = [...qaInternalReview];
                                  copy[idx].responsibleDept = e.target.value;
                                  setQaInternalReview(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.recordStorage}
                                placeholder="Enter record storage location"
                                onChange={(e) => {
                                  const copy = [...qaInternalReview];
                                  copy[idx].recordStorage = e.target.value;
                                  setQaInternalReview(copy);
                                }}
                                className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={addQaInternalReview}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                  title="Add Review Procedure"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeQaInternalReview(idx)}
                                  className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                  title="Remove Review Procedure"
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

                  {/* Diagram References (Optional) Upload Area */}
                  <div className="pt-3 border-t border-slate-100">
                    <input
                      type="file"
                      ref={reviewDiagramInputRef}
                      onChange={handleReviewDiagramUpload}
                      className="hidden"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg,.svg,.vsd,.vsdx,.dwg"
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">Diagram References (Optional)</h5>
                        <p className="text-[11px] text-slate-500">
                          Attach diagram-related workflows, review trees, or validation process schematics for internal review procedures.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => reviewDiagramInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#004B87] hover:bg-[#003865] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Diagram / Supporting File</span>
                      </button>
                    </div>

                    {/* Uploaded Files List */}
                    {reviewDiagramFiles.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {reviewDiagramFiles.map((file) => (
                          <div
                            key={file.id}
                            className="border border-slate-200 bg-slate-50/60 rounded-xl p-2.5 px-3 flex items-center justify-between gap-2 shadow-2xs hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-[#004B87]" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                  {file.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  <span>{file.size}</span>
                                  {file.uploadDate && <span> • {file.uploadDate}</span>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => setPreviewModalFile({ name: file.name })}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-[#004B87] hover:bg-sky-50 rounded-md transition-colors cursor-pointer"
                                title="View / Preview"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeReviewDiagramFile(file.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Remove"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 border border-dashed border-slate-200 rounded-xl bg-slate-50/40 text-center text-slate-400 text-xs">
                        No diagram files attached yet. Click "Upload Diagram / Supporting File" to attach diagrams.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Further QA/QC Details */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white p-4 sm:p-5 shadow-2xs space-y-2">
                <label className="block text-slate-700 font-semibold text-xs leading-relaxed">
                  Please provide any further details pertaining to quality control / quality assurance that you think may be relevant
                </label>
                <textarea
                  rows={4}
                  value={qaFurtherDetails}
                  onChange={(e) => setQaFurtherDetails(e.target.value)}
                  placeholder="Enter any additional quality control / quality assurance details..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder:text-slate-400 placeholder:text-xs text-xs focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: REVIEW & SUBMIT */}
          {/* ================================================================= */}
          {activeTab === 'review-submit' && (
            <div className="space-y-6 animate-fade-in">
              {/* Submission Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold text-[#004B87] mb-4">Submission Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Facility / Plant Name', value: facilityInfo.facilityName },
                    { label: 'Facility ID', value: facilityInfo.facilityId },
                    { label: 'Reporting Year', value: facilityInfo.reportingYear },
                    { label: 'Total Annual Emissions', value: '155,950 tCO₂e' },
                    { label: 'Verification Status', value: workflowState.verificationStatus || 'Pending Verification' },
                    { label: 'Version', value: 'V1' },
                    { label: 'Prepared By', value: declarationForm.name },
                    { label: 'Email', value: 'umasri.m@alnoor-energy.ae' },
                    { label: 'Submission Date', value: submissionStatus === 'Submitted' ? new Date().toLocaleDateString('en-GB') : '—' },
                    { label: 'Current Status', value: submissionStatus },
                    { label: 'Last Saved On', value: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <p className="text-[10px] text-slate-400 font-semibold">{item.label}</p>
                      <p className="text-xs font-bold text-navy-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaration */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold text-[#004B87] mb-4">Final Declaration</h4>
                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={declarationChecks.check1} onChange={(e) => setDeclarationChecks(prev => ({ ...prev, check1: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[#004B87] rounded" />
                    <span className="text-xs text-slate-700 leading-relaxed">I confirm that the annual emission data provided is complete, true and accurate to the best of my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={declarationChecks.check2} onChange={(e) => setDeclarationChecks(prev => ({ ...prev, check2: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[#004B87] rounded" />
                    <span className="text-xs text-slate-700 leading-relaxed">I understand that submitting false or misleading information may result in regulatory action by the Environment Agency – Abu Dhabi.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={declarationChecks.check3} onChange={(e) => setDeclarationChecks(prev => ({ ...prev, check3: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[#004B87] rounded" />
                    <span className="text-xs text-slate-700 leading-relaxed">I agree to submit this Annual Emission Data to the Environment Agency – Abu Dhabi.</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Name</label>
                    <input type="text" value={declarationForm.name} onChange={(e) => setDeclarationForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Designation</label>
                    <input type="text" value={declarationForm.designation} onChange={(e) => setDeclarationForm(prev => ({ ...prev, designation: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date</label>
                    <input type="text" readOnly value={declarationForm.date} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button onClick={() => setActiveView('dashboard')} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2.5 bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" /> Save Draft
                </button>

                {submissionStatus === 'Submitted' && (
                  <button
                    onClick={() => setActiveView('verification')}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!declarationChecks.check1 || !declarationChecks.check2 || !declarationChecks.check3}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    declarationChecks.check1 && declarationChecks.check2 && declarationChecks.check3
                      ? 'bg-[#004B87] text-white hover:bg-[#003a6b]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{workflowState.annualEmissionStatus === 'Correction Required' ? 'Resubmit Annual Emission Data' : 'Submit Annual Emission Data'}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Diagram Reference Preview Modal */}
      {previewModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-[#F4F6F8] border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-[#004B87] flex-shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">{previewModalFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalFile(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto text-[#004B87]">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{previewModalFile.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Diagram Reference & QA Flowchart Document (Interactive Preview)
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600 font-mono">
                <div>Document Type: Quality Assurance Diagram</div>
                <div>Status: Verified & Associated with QA Procedures</div>
                <div>Format: Technical Schematic / Workflow Document</div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalFile(null)}
                className="px-4 py-2 bg-[#004B87] text-white text-xs font-semibold rounded-xl hover:bg-[#003865] transition-colors cursor-pointer"
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
