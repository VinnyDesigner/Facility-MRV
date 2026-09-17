import React, { useState, useRef } from 'react';
import {
  Plus,
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Trash2,
  Sparkles,
  RotateCcw,
  Lock,
  Clock,
  ShieldCheck,
  Bookmark,
  Calculator,
  Flame,
  Eye,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

export const AnnualEmissionDataView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isAnnualEmissionUnlocked,
    setAnnualEmissionStatus,
    setVerificationStatus,
  } = useMRV();

  // Tab Navigation
  const [activeTab, setActiveTab] = useState<
    'facility-info' | 'activity-data' | 'calculations' | 'verification-data' | 'review-submit'
  >('facility-info');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  // EMISSION ACTIVITY DATA
  // =========================================================================
  const [activityData, setActivityData] = useState([
    { id: 'AD-01', sourceId: 'S01', sourceStreamId: 'FC1', fuelMaterial: 'Natural Gas', activityData: '5,000,000', quantity: '5,000,000', unit: 'Nm³', dataSource: 'Metered', reportingYear: '2026', remarks: 'Main fuel supply' },
    { id: 'AD-02', sourceId: 'S01', sourceStreamId: 'FC2', fuelMaterial: 'Diesel', activityData: '50,000', quantity: '50,000', unit: 'litres', dataSource: 'Invoiced', reportingYear: '2026', remarks: 'Backup generator fuel' },
    { id: 'AD-03', sourceId: 'S02', sourceStreamId: 'FC3', fuelMaterial: 'Limestone', activityData: '100,000', quantity: '100,000', unit: 'tonnes', dataSource: 'Weighed', reportingYear: '2026', remarks: 'Raw material for clinker' },
    { id: 'AD-04', sourceId: 'S03', sourceStreamId: 'FC4', fuelMaterial: 'Petroleum Coke', activityData: '25,000', quantity: '25,000', unit: 'tonnes', dataSource: 'Invoiced', reportingYear: '2026', remarks: 'Kiln fuel' },
  ]);

  const addActivityRow = () => {
    const nextId = `AD-${String(activityData.length + 1).padStart(2, '0')}`;
    setActivityData(prev => [...prev, {
      id: nextId, sourceId: 'S01', sourceStreamId: 'FC1', fuelMaterial: '', activityData: '', quantity: '', unit: 'Nm³', dataSource: 'Metered', reportingYear: '2026', remarks: ''
    }]);
  };

  const removeActivityRow = (idx: number) => {
    setActivityData(prev => prev.filter((_, i) => i !== idx));
  };

  // =========================================================================
  // EMISSION CALCULATIONS
  // =========================================================================
  const [calculations, setCalculations] = useState([
    { id: 'EC-01', emissionSource: 'Boiler Stack', sourceStream: 'FC1', fuelMaterial: 'Natural Gas', activityData: '5,000,000', activityUnit: 'Nm³', calcMethod: 'Calculation-based', emissionFactor: '56.1', efUnit: 'tCO₂/TJ', ncv: '48.0', ncvUnit: 'TJ/Gg', tier: 'Tier 2', calculatedEmissions: '89,250', unit: 'tCO₂e' },
    { id: 'EC-02', emissionSource: 'Generator', sourceStream: 'FC2', fuelMaterial: 'Diesel', activityData: '50,000', activityUnit: 'litres', calcMethod: 'Calculation-based', emissionFactor: '74.1', efUnit: 'tCO₂/TJ', ncv: '43.0', ncvUnit: 'TJ/Gg', tier: 'Tier 1', calculatedEmissions: '3,200', unit: 'tCO₂e' },
    { id: 'EC-03', emissionSource: 'Kiln Process', sourceStream: 'FC3', fuelMaterial: 'Limestone', activityData: '100,000', activityUnit: 'tonnes', calcMethod: 'Calculation-based', emissionFactor: '0.44', efUnit: 'tCO₂/t', ncv: '-', ncvUnit: '-', tier: 'Tier 2', calculatedEmissions: '44,000', unit: 'tCO₂e' },
    { id: 'EC-04', emissionSource: 'Kiln Fuel', sourceStream: 'FC4', fuelMaterial: 'Petroleum Coke', activityData: '25,000', activityUnit: 'tonnes', calcMethod: 'Calculation-based', emissionFactor: '97.5', efUnit: 'tCO₂/TJ', ncv: '32.5', ncvUnit: 'TJ/Gg', tier: 'Tier 2', calculatedEmissions: '19,500', unit: 'tCO₂e' },
  ]);

  const totalEmissions = calculations.reduce((sum, c) => sum + parseFloat(c.calculatedEmissions.replace(/,/g, '')), 0);

  // =========================================================================
  // VERIFICATION DATA
  // =========================================================================
  const [verificationData, setVerificationData] = useState({
    verificationRequired: true,
    verificationStatus: 'Completed' as string,
    verifierName: 'Dr. Arthur Pendelton',
    verifierOrganization: 'Bureau Veritas Middle East',
    verificationDate: '24-Jun-2026',
    verificationStatement: 'Third_Party_Verification_Statement_2026.pdf',
    verificationRemarks: 'All emission source activity registers and calibration logs reconciled.',
  });

  const [verificationDocs, setVerificationDocs] = useState<{ name: string; size: string; status: string }[]>([
    { name: 'Third_Party_Verification_Statement_2026.pdf', size: '2.4MB', status: 'Uploaded' },
  ]);

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
    setSubmissionStatus('Submitted');
    if (verificationData.verificationRequired) {
      setAnnualEmissionStatus('Submitted');
      setVerificationStatus('Pending Verification');
      setNoticeMessage('Annual Emission Data Submitted! Routed to Verification.');
    } else {
      setAnnualEmissionStatus('Under EAD Review');
      setVerificationStatus('Not Required');
      setNoticeMessage('Annual Emission Data Submitted! Proceeding directly to EAD Review.');
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Uploaded',
      }));
      setVerificationDocs((prev) => [...prev, ...newFiles]);
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
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

      case 'activity-data': {
        const hasIncomplete = activityData.some(
          (a) => !a.fuelMaterial || !a.activityData || a.activityData === '0'
        );

        if (!isPlanApproved) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Monitoring Plan must be approved before activity streams can be validated."
            >
              <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="hidden xl:inline">Awaiting Approved Monitoring Plan</span>
              <span className="xl:hidden">Plan Pending</span>
            </div>
          );
        }

        if (hasIncomplete) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Some activity data streams require fuel/material or consumption input."
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="hidden xl:inline">Incomplete Activity Data Streams</span>
              <span className="xl:hidden">Incomplete</span>
            </div>
          );
        }

        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Activity data streams are configured and validated based on the approved Monitoring Plan."
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="hidden xl:inline">Configured from Approved Monitoring Plan</span>
            <span className="xl:hidden">Approved Plan</span>
          </div>
        );
      }

      case 'calculations': {
        const hasCalculations = calculations.length > 0 && totalEmissions > 0;
        if (hasCalculations) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Emissions calculated using approved IPCC Tier methodology and verified factors."
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden xl:inline">Calculated from Approved Factors (Tier 1 & 2)</span>
              <span className="xl:hidden">Calculated</span>
            </div>
          );
        }
        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Calculations pending activity data completion."
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="hidden xl:inline">Calculations Pending Data</span>
            <span className="xl:hidden">Pending</span>
          </div>
        );
      }

      case 'verification-data': {
        if (!verificationData.verificationRequired) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 text-slate-700 border border-slate-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Verification is marked not required for this facility category."
            >
              <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="hidden xl:inline">Verification Not Required</span>
              <span className="xl:hidden">Not Required</span>
            </div>
          );
        }

        if (
          verificationData.verificationStatus === 'Verification Completed' ||
          verificationData.verificationStatus === 'Verified'
        ) {
          return (
            <div
              className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
              title="Independent third-party verification has been completed."
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="hidden xl:inline">Third-Party Verification Completed</span>
              <span className="xl:hidden">Verified</span>
            </div>
          );
        }

        return (
          <div
            className="ml-auto flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-300/90 rounded-full text-xs font-medium select-none shadow-xs transition-all"
            title="Third-party verification statement and accreditation required."
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="hidden xl:inline">Third-Party Verification Required</span>
            <span className="xl:hidden">Pending</span>
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
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />

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

          {/* Status badge */}
          <div className="flex items-center gap-2">
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

        {/* Top Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility / Plant Name</label>
            <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer">
              <option>{facilityInfo.facilityName}</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reporting Year</label>
            <select className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Approved Monitoring Plan</label>
            <input type="text" readOnly value={facilityInfo.approvedMonitoringPlan} className="w-full px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* INNER CARD WITH TABS */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex-shrink-0 pb-3 mb-3 flex flex-wrap items-center justify-between gap-2 overflow-x-auto no-scrollbar">
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
              onClick={() => setActiveTab('activity-data')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'activity-data'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Emission Activity Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('calculations')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'calculations'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Emission Calculations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verification-data')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'verification-data'
                  ? 'bg-white text-[#004B87] shadow-xs border-b-2 border-[#004B87]'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 border-b-2 border-transparent'
              }`}
            >
              Verification Data
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
        <div className="flex-1 min-h-0 overflow-y-auto py-[10px] space-y-6 pr-2 no-scrollbar text-xs">

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
          {/* TAB 2: EMISSION ACTIVITY DATA */}
          {/* ================================================================= */}
          {activeTab === 'activity-data' && (
            <div className="space-y-5 animate-fade-in">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3">Source ID</th>
                      <th className="py-2.5 px-3">Stream ID</th>
                      <th className="py-2.5 px-3">Fuel / Material</th>
                      <th className="py-2.5 px-3">Activity Data</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Data Source</th>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Remarks</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]">{row.id}</td>
                        <td className="py-2.5 px-3">
                          <input type="text" value={row.sourceId} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, sourceId: v } : r)); }} className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]" />
                        </td>
                        <td className="py-2.5 px-3">
                          <input type="text" value={row.sourceStreamId} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, sourceStreamId: v } : r)); }} className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]" />
                        </td>
                        <td className="py-2.5 px-3">
                          <input type="text" value={row.fuelMaterial} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, fuelMaterial: v } : r)); }} className="w-28 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]" />
                        </td>
                        <td className="py-2.5 px-3">
                          <input type="text" value={row.activityData} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, activityData: v, quantity: v } : r)); }} className="w-28 px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#004B87]" />
                        </td>
                        <td className="py-2.5 px-3">
                          <select value={row.unit} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, unit: v } : r)); }} className="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]">
                            <option>Nm³</option>
                            <option>litres</option>
                            <option>tonnes</option>
                            <option>MWh</option>
                            <option>TJ</option>
                            <option>kg</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3">
                          <select value={row.dataSource} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, dataSource: v } : r)); }} className="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]">
                            <option>Metered</option>
                            <option>Invoiced</option>
                            <option>Weighed</option>
                            <option>Estimated</option>
                            <option>Lab Analysis</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-3 text-center font-medium">{row.reportingYear}</td>
                        <td className="py-2.5 px-3">
                          <input type="text" value={row.remarks} onChange={(e) => { const v = e.target.value; setActivityData(p => p.map((r, i) => i === idx ? { ...r, remarks: v } : r)); }} className="w-32 px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004B87]" />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addActivityRow}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              title="Add Row"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeActivityRow(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                              title="Remove Row"
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

              {/* Supporting Documents */}
              <div className="pt-3">
                <h4 className="text-xs font-bold text-[#004B87] mb-2">Supporting Documents</h4>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center cursor-pointer hover:border-[#004B87]/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Drag & Drop or <span className="text-[#004B87] font-semibold underline">Browse Files</span></p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: EMISSION CALCULATIONS */}
          {/* ================================================================= */}
          {activeTab === 'calculations' && (
            <div className="space-y-5 animate-fade-in">
              {/* Total Emissions Summary */}
              <div className="bg-gradient-to-r from-[#004B87]/5 to-[#004B87]/10 border border-[#004B87]/20 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[#004B87]/60 font-bold">Total Annual Calculated Emissions</p>
                    <p className="text-2xl font-bold text-[#004B87] mt-1">{totalEmissions.toLocaleString()} <span className="text-sm font-medium">tCO₂e</span></p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#004B87]/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-[#004B87]" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Emission Source</th>
                      <th className="py-2.5 px-3">Source Stream</th>
                      <th className="py-2.5 px-3">Fuel / Material</th>
                      <th className="py-2.5 px-3">Activity Data</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Emission Factor</th>
                      <th className="py-2.5 px-3">EF Unit</th>
                      <th className="py-2.5 px-3">NCV</th>
                      <th className="py-2.5 px-3">NCV Unit</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3 text-right font-bold">Calculated Emissions</th>
                      <th className="py-2.5 px-3">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.map((calc, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-medium text-navy-900">{calc.emissionSource}</td>
                        <td className="py-2.5 px-3 font-mono text-[#004B87]">{calc.sourceStream}</td>
                        <td className="py-2.5 px-3">{calc.fuelMaterial}</td>
                        <td className="py-2.5 px-3 font-mono">{calc.activityData}</td>
                        <td className="py-2.5 px-3 text-slate-500">{calc.activityUnit}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">{calc.calcMethod}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">{calc.emissionFactor}</td>
                        <td className="py-2.5 px-3 text-slate-500">{calc.efUnit}</td>
                        <td className="py-2.5 px-3 font-mono">{calc.ncv}</td>
                        <td className="py-2.5 px-3 text-slate-500">{calc.ncvUnit}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">{calc.tier}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{calc.calculatedEmissions}</td>
                        <td className="py-2.5 px-3 text-slate-500">{calc.unit}</td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-[#004B87]/5 border-t-2 border-[#004B87]/20">
                      <td colSpan={11} className="py-3 px-3 text-right font-bold text-[#004B87]">Total Annual Emissions</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#004B87] text-sm">{totalEmissions.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-[#004B87]">tCO₂e</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-[10px] text-slate-500">
                  <span className="font-bold">Traceability:</span> Calculations are derived from the activity data entered in Tab 2 using the emission factors, NCV values, and tier levels defined in the approved Monitoring Plan (MP-2026-001).
                </p>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: VERIFICATION DATA */}
          {/* ================================================================= */}
          {activeTab === 'verification-data' && (
            <div className="space-y-5 animate-fade-in">
              {/* Verification Requirement Toggle */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#004B87]">Verification Requirement</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Specify whether third-party verification is required for this annual submission
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${verificationData.verificationRequired ? 'text-[#004B87]' : 'text-slate-500'}`}>
                      {verificationData.verificationRequired ? 'Verification Required' : 'Verification Not Required'}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={verificationData.verificationRequired}
                      onClick={() =>
                        setVerificationData((prev) => ({
                          ...prev,
                          verificationRequired: !prev.verificationRequired,
                          verificationStatus: !prev.verificationRequired ? 'Pending Verification' : 'Not Required',
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        verificationData.verificationRequired ? 'bg-[#004B87]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          verificationData.verificationRequired ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {!verificationData.verificationRequired ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-emerald-700">Verification Not Required</p>
                  <p className="text-xs text-emerald-600/70 mt-1">This submission will proceed directly to EAD Review after submission.</p>
                </div>
              ) : (
                <>
                  {/* Verifier Information with Prominent Status Badge in Header */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-[#004B87]">Verifier Information</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">Accredited verifier details and verification schedule</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">Verification Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          verificationData.verificationStatus === 'Not Required' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          verificationData.verificationStatus === 'Pending Verification' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          verificationData.verificationStatus === 'Verification In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          verificationData.verificationStatus === 'Verification Completed' || verificationData.verificationStatus === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            verificationData.verificationStatus === 'Verification Completed' || verificationData.verificationStatus === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`}></span>
                          {verificationData.verificationStatus}
                        </span>
                      </div>
                    </div>

                    {/* All 4 Verifier Information Fields in ONE Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Verifier Name</label>
                        <input
                          type="text"
                          value={verificationData.verifierName}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verifierName: e.target.value }))}
                          placeholder="Enter verifier name"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Verifier Organization</label>
                        <input
                          type="text"
                          value={verificationData.verifierOrganization}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verifierOrganization: e.target.value }))}
                          placeholder="Enter organization"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Verification Date</label>
                        <input
                          type="date"
                          value={verificationData.verificationDate}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verificationDate: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Verification Remarks</label>
                        <input
                          type="text"
                          value={verificationData.verificationRemarks}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verificationRemarks: e.target.value }))}
                          placeholder="Add remarks"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Verification Statement & Supporting Documents */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Verification Statement / Report</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Verification Statement / Notes</label>
                        <textarea
                          rows={3}
                          value={verificationData.verificationStatement}
                          onChange={(e) => setVerificationData(prev => ({ ...prev, verificationStatement: e.target.value }))}
                          placeholder="Enter verification statement or notes..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                        />
                      </div>
                      <div
                        className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center cursor-pointer hover:border-[#004B87]/40 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">Upload Verification Statement / Supporting Documents</p>
                      </div>
                      {verificationDocs.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {verificationDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#004B87]" />
                                <span className="font-semibold">{doc.name}</span>
                                <span className="text-slate-400 text-[10px]">{doc.size}</span>
                              </div>
                              <button onClick={() => setVerificationDocs(p => p.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: REVIEW & SUBMIT */}
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
                    { label: 'Total Annual Emissions', value: `${totalEmissions.toLocaleString()} tCO₂e` },
                    { label: 'Verification Status', value: verificationData.verificationRequired ? verificationData.verificationStatus : 'Not Required' },
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

              {/* Emission Activity Data Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Annual Activity Data Summary</h4>
                <div className="space-y-2">
                  {activityData.map((row, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-lg">
                      <span className="text-xs font-medium">{row.fuelMaterial}</span>
                      <span className="text-xs font-mono font-bold text-[#004B87]">{row.activityData} {row.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emission Calculations Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Emission Calculation Summary</h4>
                <div className="space-y-2">
                  {calculations.map((calc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-lg">
                      <span className="text-xs font-medium">{calc.emissionSource} — {calc.fuelMaterial}</span>
                      <span className="text-xs font-mono font-bold text-emerald-700">{calc.calculatedEmissions} tCO₂e</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-[#004B87]/5 px-4 py-3 rounded-lg border border-[#004B87]/20">
                    <span className="text-xs font-bold text-[#004B87]">Total Annual Emissions</span>
                    <span className="text-sm font-mono font-bold text-[#004B87]">{totalEmissions.toLocaleString()} tCO₂e</span>
                  </div>
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

                {submissionStatus === 'Submitted' && verificationData.verificationRequired && (
                  <button
                    onClick={() => setActiveView('verification')}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {submissionStatus === 'Submitted' && !verificationData.verificationRequired && (
                  <button
                    onClick={() => setActiveView('reports')}
                    className="px-5 py-2.5 bg-cyan-700 text-white rounded-xl text-xs font-bold hover:bg-cyan-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Compliance Reports</span>
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
                  <Send className="w-3.5 h-3.5" /> Submit Annual Data
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
