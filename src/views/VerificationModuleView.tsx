import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  Lock,
  Eye,
  RotateCcw,
  Play,
  ArrowRight,
  Send,
  FileCheck,
  Search,
  ChevronDown,
  Sparkles,
  Bookmark,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { VerificationStatus } from '../types/mrv';

export const VerificationModuleView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    emissionsData,
    setActiveView,
    workflowState,
    isVerificationUnlocked,
    setVerificationStatus: setCtxVerificationStatus,
    setAnnualEmissionStatus,
    openReadOnlyViewer,
    submitAnnualMRV,
  } = useMRV();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Changes Saved!');
  const [opinionError, setOpinionError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Verification State
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    workflowState.verificationStatus || 'Pending Verification'
  );

  useEffect(() => {
    if (workflowState.verificationStatus) {
      setVerificationStatus(workflowState.verificationStatus);
    }
  }, [workflowState.verificationStatus]);

  const [verifierInfo, setVerifierInfo] = useState({
    name: 'Dr. Arthur Pendelton',
    organization: 'Bureau Veritas Middle East',
    accreditationNumber: 'ENAS-CB-042',
    startDate: '2026-06-16',
    endDate: '2026-06-25',
    opinion: 'Unmodified (Positive)',
  });

  const sampleVerifierData = {
    name: 'Dr. Arthur Pendelton',
    organization: 'Bureau Veritas Middle East',
    accreditationNumber: 'ENAS-CB-042',
    startDate: '2026-06-16',
    endDate: '2026-06-25',
    opinion: 'Unmodified (Positive)',
  };

  const blankVerifierData = {
    name: '',
    organization: '',
    accreditationNumber: '',
    startDate: '',
    endDate: '',
    opinion: '',
  };

  const [verificationDocs, setVerificationDocs] = useState<{ name: string; size: string; status: string }[]>([
    { name: 'Third_Party_Verification_Statement_2026.pdf', size: '2.4MB', status: 'Uploaded' },
  ]);

  const [verificationRemarks, setVerificationRemarks] = useState(
    'All activity data records and calculation factors cross-checked against fiscal gas invoices and calibrated CEMS telemetry.'
  );

  const [isSubmittedToEAD, setIsSubmittedToEAD] = useState(
    workflowState.verificationStatus === 'Verification Completed' ||
    workflowState.verificationStatus === 'Verification Statement Uploaded' ||
    workflowState.annualEmissionStatus === 'Under EAD Review'
  );

  // Read-only review handler for Annual Emission Data
  const handleViewAnnualEmissionData = () => {
    openReadOnlyViewer({
      moduleType: 'annual-emission-data',
      title: `Submitted Annual Emission Data — ${activeFacility?.name || 'Facility'} (RY ${reportingYear || 2026})`,
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      reportingYear: reportingYear || 2026,
      status: workflowState.annualEmissionStatus || 'Submitted',
      version: 1,
      initialTab: 'annual-emissions',
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Uploaded',
      }));
      setVerificationDocs((prev) => [...prev, ...newFiles]);
      setNoticeMessage('Verification document attached successfully.');
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  const handleSaveDraft = () => {
    setNoticeMessage('Verification details saved as draft.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Status-dependent Workflow Actions
  const handleStartVerification = () => {
    setVerificationStatus('Verification In Progress');
    setCtxVerificationStatus('Verification In Progress');
    setNoticeMessage('Third-Party Verification started. Review data and upload statements.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleReturnForCorrection = () => {
    setVerificationStatus('Correction Required');
    setCtxVerificationStatus('Correction Required');
    setAnnualEmissionStatus('Correction Required');
    setNoticeMessage('Annual Emission Data returned to Facility User for mandatory corrections.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleCompleteVerification = () => {
    // Validation: Verifier Opinion must be selected
    if (!verifierInfo.opinion || verifierInfo.opinion.trim() === '' || verifierInfo.opinion === 'Select opinion') {
      setOpinionError('Please select a valid Verifier Opinion (Unmodified, Qualified, or Adverse) before completing verification.');
      return;
    }

    setOpinionError(null);
    setVerificationStatus('Verification Completed');
    setCtxVerificationStatus('Verification Completed');
    setAnnualEmissionStatus('Under EAD Review');
    setIsSubmittedToEAD(true);

    // Transmit to EAD submission records
    submitAnnualMRV();

    setNoticeMessage('Verification Completed & Verified Report Transmitted to EAD Final Review!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 4000);
  };

  // Dynamic Submission & Review History generated from actual workflow events
  const workflowEvents = useMemo(() => {
    const events = [
      {
        id: 'evt-1',
        title: 'Annual Emission Data Submitted (v1.0)',
        date: '15-Jun-2026, 10:30 AM',
        actor: 'Umasri Mavillapally (Facility Compliance Lead)',
        role: 'Facility Operator',
        status: 'Submitted',
        type: 'done',
      },
      {
        id: 'evt-2',
        title: 'Routed to Third-Party Verification',
        date: '15-Jun-2026, 10:31 AM',
        actor: 'EAD MRV Automated Routing Engine',
        role: 'System Dispatch',
        status: 'Pending Verification',
        type: 'done',
      },
    ];

    if (
      verificationStatus === 'Verification In Progress' ||
      verificationStatus === 'Verification Completed' ||
      verificationStatus === 'Verification Statement Uploaded'
    ) {
      events.push({
        id: 'evt-3',
        title: 'Third-Party Verification Assessment Started',
        date: `${verifierInfo.startDate || '16-Jun-2026'}, 09:00 AM`,
        actor: `${verifierInfo.name || 'Lead Verifier'} (${verifierInfo.organization || 'Accredited Body'})`,
        role: 'Lead Verifier',
        status: 'In Progress',
        type: 'done',
      });
    }

    if (verificationStatus === 'Correction Required') {
      events.push({
        id: 'evt-corr',
        title: 'Returned to Facility User for Technical Corrections',
        date: '20-Jun-2026, 03:30 PM',
        actor: `${verifierInfo.name || 'Lead Verifier'} (${verifierInfo.organization || 'Accredited Body'})`,
        role: 'Lead Verifier',
        status: 'Correction Required',
        type: 'warning',
      });
    }

    if (
      verificationDocs.length > 0 &&
      (verificationStatus === 'Verification In Progress' ||
        verificationStatus === 'Verification Completed' ||
        verificationStatus === 'Verification Statement Uploaded')
    ) {
      events.push({
        id: 'evt-4',
        title: `Verification Statement Uploaded (${verificationDocs[0]?.name})`,
        date: '24-Jun-2026, 02:15 PM',
        actor: `${verifierInfo.name || 'Lead Verifier'} (${verifierInfo.organization || 'Accredited Body'})`,
        role: 'Lead Verifier',
        status: 'Statement Uploaded',
        type: 'done',
      });
    }

    if (
      verificationStatus === 'Verification Completed' ||
      verificationStatus === 'Verification Statement Uploaded' ||
      isSubmittedToEAD
    ) {
      events.push({
        id: 'evt-5',
        title: `Verification Completed — ${verifierInfo.opinion || 'Unmodified (Positive)'}`,
        date: `${verifierInfo.endDate || '25-Jun-2026'}, 11:45 AM`,
        actor: `${verifierInfo.name || 'Lead Verifier'} (${verifierInfo.organization || 'Accredited Body'})`,
        role: 'Lead Verifier',
        status: 'Completed',
        type: 'success',
      });

      events.push({
        id: 'evt-6',
        title: 'Verified MRV Package Transmitted to EAD Final Review',
        date: `${verifierInfo.endDate || '25-Jun-2026'}, 11:46 AM`,
        actor: 'EAD Regulatory Compliance Gateway',
        role: 'System Gateway',
        status: 'Under EAD Review',
        type: 'success',
      });
    }

    return events;
  }, [verificationStatus, verifierInfo, verificationDocs, isSubmittedToEAD]);

  // 1. Verification Not Required state
  if (workflowState.verificationStatus === 'Not Required') {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Verification Not Required</h2>
          <p className="text-sm text-slate-500 max-w-md">
            Third-party verification is <span className="font-bold text-emerald-700">not applicable</span> for this facility reporting cycle.
            Your Annual Emission Data submission has proceeded directly to EAD Regulatory Review.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Status: <span className="font-bold text-[#004B87]">{workflowState.annualEmissionStatus}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => setActiveView('reports')}
            className="px-5 py-2 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] transition-colors cursor-pointer"
          >
            View Reports
          </button>
          <button
            onClick={() => setActiveView('annual-emission-data')}
            className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back to Annual Emission Data
          </button>
        </div>
      </div>
    );
  }

  // 2. Locked state
  if (!isVerificationUnlocked) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Verification Module Locked</h2>
          <p className="text-sm text-slate-500 max-w-md">
            Annual Emission Data must be <span className="font-bold text-[#004B87]">Submitted</span> before the Verification module becomes available.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Current Annual Emission Status: <span className="font-bold text-amber-600">{workflowState.annualEmissionStatus}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveView('annual-emission-data')}
          className="mt-2 px-5 py-2 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] transition-colors cursor-pointer"
        >
          Go to Annual Emission Data
        </button>
      </div>
    );
  }

  const isPending = verificationStatus === 'Pending Verification';
  const isInProgress = verificationStatus === 'Verification In Progress';
  const isCompleted =
    verificationStatus === 'Verification Completed' ||
    verificationStatus === 'Verification Statement Uploaded';

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />

      {/* TOP HEADER ROW - Consistent with Registration View */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title, Subtitle, Badges & Notice */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
              Verification & Third-Party Assurance
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Accredited Third-Party Verification, Assurance Determination & Statement Filing
            </p>
          </div>

          {/* Workflow Status Badge & Facility ID Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : isInProgress
                  ? 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                  : verificationStatus === 'Correction Required'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {verificationStatus === 'Verification Statement Uploaded'
                ? 'Statement Uploaded'
                : verificationStatus}
            </span>

            <span className="px-2.5 py-1 rounded-full bg-[#004B87]/10 text-[#004B87] text-[10px] font-mono font-bold border border-[#004B87]/20 flex items-center gap-1 animate-fade-in">
              <span>Facility ID:</span>
              <span>{activeFacility?.facilityCode || 'FAC-EAD-2026-0891'}</span>
            </span>
          </div>

          {isSavedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{noticeMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Search Box + Actions Dropdown Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search verification..."
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm transition-all"
            />
            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer"
            >
              <span>Actions</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-slide-up text-xs font-medium text-navy-900">
                <button
                  onClick={() => {
                    setVerifierInfo(sampleVerifierData);
                    setNoticeMessage('Loaded Sample Verifier Data!');
                    setIsSavedNotice(true);
                    setIsActionsOpen(false);
                    setTimeout(() => setIsSavedNotice(false), 2500);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sky-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fill Sample Verifier Data</span>
                </button>
                <button
                  onClick={() => {
                    setVerifierInfo(blankVerifierData);
                    setNoticeMessage('Form Reset to Blank!');
                    setIsSavedNotice(true);
                    setIsActionsOpen(false);
                    setTimeout(() => setIsSavedNotice(false), 2500);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All (Start Blank)</span>
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    handleSaveDraft();
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Save Current Draft
                </button>
                <button
                  onClick={() => {
                    handleViewAnnualEmissionData();
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-[#004B87] font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Annual Emission Data</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('reports');
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Go to Reports
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN WHITE CARD CONTAINER (Fixed Frame matching Registration View) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm px-3.5 sm:px-4 py-3.5 sm:py-4 flex flex-col overflow-hidden">
        {/* Scrollable Frame with all sections openly displayed */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          
          {/* ========================================================================= */}
          {/* Section 1: Submission & Facility Overview */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                Submission & Facility Overview
              </span>

              {/* View Annual Emission Data Action Button */}
              <button
                onClick={handleViewAnnualEmissionData}
                className="px-3 py-1 bg-white hover:bg-blue-50 text-[#004B87] border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                title="Review the complete submitted Annual Emission Data in read-only mode"
              >
                <Eye className="w-3.5 h-3.5 text-[#004B87]" />
                <span>View Annual Emission Data</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Facility Name</label>
                  <input
                    type="text"
                    value={activeFacility?.name || 'Al Noor Industrial Facility'}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Facility ID (EAD Code)</label>
                  <input
                    type="text"
                    value={activeFacility?.facilityCode || 'FAC-EAD-2026-0891'}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Reporting Year</label>
                  <input
                    type="text"
                    value={String(reportingYear || 2026)}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Submitted Date</label>
                  <input
                    type="text"
                    value="15-Jun-2026, 10:30 AM"
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Total Scope 1 & 2 Emissions</label>
                  <input
                    type="text"
                    value={emissionsData?.totalEmissions ? `${emissionsData.totalEmissions.toLocaleString()} tCO₂e` : '1,240,500 tCO₂e'}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 2: Verifier Information & Assessment */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                Verifier Information & Assessment Determination
              </span>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isInProgress
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-current" />
                )}
                <span>
                  {verificationStatus === 'Verification Statement Uploaded'
                    ? 'Completed • Statement Uploaded'
                    : verificationStatus === 'Verification Completed'
                    ? 'Verification Completed'
                    : verificationStatus === 'Verification In Progress'
                    ? 'Verification In Progress'
                    : 'Pending Verification'}
                </span>
              </span>
            </div>

            <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-5 text-xs">
              {/* Progress Stage Tracker */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Verification Progress Stage</h4>
                <div className="flex items-center gap-2 text-[10px] overflow-x-auto no-scrollbar pb-1">
                  {[
                    { key: 'Pending Verification', label: '1. Pending Verification' },
                    { key: 'Verification In Progress', label: '2. In Progress' },
                    { key: 'Verification Completed', label: '3. Completed' },
                    { key: 'Under EAD Review', label: '4. EAD Final Review' },
                  ].map((step, idx) => {
                    const currentStageIdx = isCompleted ? 2 : isInProgress ? 1 : 0;
                    const isPassed = currentStageIdx > idx;
                    const isCurrent = currentStageIdx === idx;

                    return (
                      <React.Fragment key={idx}>
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                            isCurrent
                              ? 'bg-[#004B87] text-white shadow-xs font-bold'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-800 font-semibold'
                              : 'bg-slate-100 text-slate-500 font-medium'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isCurrent ? (
                            <Clock className="w-3.5 h-3.5 text-white" />
                          ) : null}
                          <span>{step.label}</span>
                        </div>
                        {idx < 3 && <div className="w-4 h-px bg-slate-300 shrink-0" />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Status-Dependent Quick Actions Ribbon */}
              <div className="flex gap-2.5 flex-wrap items-center pt-2 pb-3 border-b border-slate-100">
                {/* Pending Verification */}
                {isPending && (
                  <button
                    onClick={handleStartVerification}
                    className="px-4 py-2 bg-[#004B87] hover:bg-[#003a6b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-[#004B87]/20 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Verification</span>
                  </button>
                )}

                {/* In Progress */}
                {isInProgress && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-purple-600" />
                      <span>Upload Statement</span>
                    </button>

                    <button
                      onClick={handleReturnForCorrection}
                      className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Return Annual Emission Data to Facility User for correction"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      <span>Return for Correction</span>
                    </button>

                    <button
                      onClick={handleCompleteVerification}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Complete Verification & Submit to EAD</span>
                    </button>
                  </>
                )}

                {/* Completed */}
                {isCompleted && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verification Complete • Transmitted to EAD Final Review</span>
                    </span>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Upload New Statement Document</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Verifier Information Form Grid */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Verifier Details & Opinion</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Verifier Name *</label>
                    <input
                      type="text"
                      value={verifierInfo.name}
                      onChange={(e) => setVerifierInfo((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter verifier name"
                      disabled={isCompleted}
                      className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Organization *</label>
                    <input
                      type="text"
                      value={verifierInfo.organization}
                      onChange={(e) => setVerifierInfo((prev) => ({ ...prev, organization: e.target.value }))}
                      placeholder="Enter organization"
                      disabled={isCompleted}
                      className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Accreditation Number *</label>
                    <input
                      type="text"
                      value={verifierInfo.accreditationNumber}
                      onChange={(e) => setVerifierInfo((prev) => ({ ...prev, accreditationNumber: e.target.value }))}
                      placeholder="EAD-ACCR-XXXX"
                      disabled={isCompleted}
                      className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Verification Start Date</label>
                    <input
                      type="date"
                      value={verifierInfo.startDate}
                      onChange={(e) => setVerifierInfo((prev) => ({ ...prev, startDate: e.target.value }))}
                      disabled={isCompleted}
                      className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Verification End Date</label>
                    <input
                      type="date"
                      value={verifierInfo.endDate}
                      onChange={(e) => setVerifierInfo((prev) => ({ ...prev, endDate: e.target.value }))}
                      disabled={isCompleted}
                      className="w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">
                      Verifier Opinion <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={verifierInfo.opinion}
                      onChange={(e) => {
                        setVerifierInfo((prev) => ({ ...prev, opinion: e.target.value }));
                        if (opinionError && e.target.value) setOpinionError(null);
                      }}
                      disabled={isCompleted}
                      className={`w-full px-3.5 py-2.5 bg-white disabled:bg-slate-50 disabled:text-slate-600 border rounded-xl text-navy-900 focus:outline-none shadow-sm ${
                        opinionError
                          ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                          : 'border-slate-200 focus:border-[#004B87]'
                      }`}
                    >
                      <option value="">Select opinion</option>
                      <option value="Unmodified (Positive)">Unmodified (Positive)</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Adverse">Adverse</option>
                    </select>
                    {opinionError && (
                      <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{opinionError}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 3: Verification Documents & Auditor Remarks */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                Verification Documents & Auditor Remarks
              </span>
            </div>

            <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
              {!isCompleted && (
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-5 text-center cursor-pointer hover:border-[#004B87]/40 hover:bg-slate-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs text-slate-600 font-medium">
                    Upload Verification Statement, Reasonable Assurance Report, or Supporting Calculations
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, XLS up to 50MB</p>
                </div>
              )}

              {verificationDocs.length > 0 && (
                <div className="space-y-2">
                  {verificationDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#004B87] shrink-0" />
                        <span className="font-semibold text-xs text-slate-800">{doc.name}</span>
                        <span className="text-slate-400 text-[10px] font-mono">{doc.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                          {doc.status}
                        </span>
                        {!isCompleted && (
                          <button
                            onClick={() => setVerificationDocs((p) => p.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-500 p-1 rounded cursor-pointer transition-colors"
                            title="Remove document"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Remarks */}
              <div className="pt-1">
                <label className="block text-slate-600 font-semibold mb-1.5 text-xs">
                  Verification Remarks & Auditor Compliance Notes
                </label>
                <textarea
                  rows={3}
                  value={verificationRemarks}
                  onChange={(e) => setVerificationRemarks(e.target.value)}
                  disabled={isCompleted}
                  placeholder="Add verification remarks, site inspection findings, or auditor compliance notes..."
                  className="w-full p-3 bg-white disabled:bg-slate-50 disabled:text-slate-600 border border-slate-200 rounded-xl text-navy-900 text-xs focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Section 4: Submission & Review History */}
          {/* ========================================================================= */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                Submission & Review History
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                {workflowEvents.length} Workflow Milestones
              </span>
            </div>

            <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-1 text-xs">
              {workflowEvents.map((event, idx) => {
                const isLast = idx === workflowEvents.length - 1;
                return (
                  <div
                    key={event.id}
                    className="relative flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    {/* Connecting Timeline Progress Line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[13px] top-[20px] bottom-[-6px] w-0.5 z-0 ${
                          event.type === 'success' ? 'bg-emerald-200' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Timeline Indicator Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-all ${
                          event.type === 'success'
                            ? 'bg-emerald-500 ring-4 ring-emerald-100'
                            : event.type === 'warning'
                            ? 'bg-amber-500 ring-4 ring-amber-100'
                            : 'bg-[#004B87] ring-4 ring-blue-100'
                        }`}
                      />
                    </div>

                    {/* Milestone Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 leading-snug">{event.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {event.date} • <span className="font-semibold text-slate-700">{event.actor}</span> ({event.role})
                      </p>
                    </div>

                    {/* Milestone Status Badge */}
                    <span
                      className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        event.status === 'Completed' || event.status === 'Under EAD Review'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : event.status === 'Submitted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : event.status === 'Pending Verification'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : event.status === 'Correction Required'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM STICKY ACTION BAR - Consistent with Registration View */}
        <div className="flex-shrink-0 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 bg-white">
          <button
            onClick={() => setActiveView('annual-emission-data')}
            className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back to Annual Emission Data
          </button>

            <button
              onClick={handleSaveDraft}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Save</span>
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Status-dependent Primary Actions */}
            {isPending && (
              <button
                onClick={handleStartVerification}
                className="px-5 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Verification</span>
              </button>
            )}

            {isInProgress && (
              <>
                <button
                  onClick={handleReturnForCorrection}
                  className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Return Annual Emission Data to Facility User for correction"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  <span>Return for Correction</span>
                </button>

                <button
                  onClick={handleCompleteVerification}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Complete Verification & Submit to EAD</span>
                </button>
              </>
            )}

            {isCompleted && (
              <button
                onClick={() => setActiveView('reports')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg cursor-pointer active:scale-95"
              >
                <FileCheck className="w-4 h-4" />
                <span>View Submission & Reports</span>
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
