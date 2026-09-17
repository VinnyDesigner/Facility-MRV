import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

export const VerificationModuleView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isVerificationUnlocked,
    setVerificationStatus: setCtxVerificationStatus,
    setAnnualEmissionStatus,
  } = useMRV();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Verification State
  const [verificationStatus, setVerificationStatus] = useState<string>(workflowState.verificationStatus || 'Pending Verification');

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
    opinion: 'Verified without qualification (Reasonable Assurance)',
  });
  const [verificationDocs, setVerificationDocs] = useState<{ name: string; size: string; status: string }[]>([
    { name: 'Third_Party_Verification_Statement_2026.pdf', size: '2.4MB', status: 'Uploaded' },
  ]);
  const [verificationRemarks, setVerificationRemarks] = useState('All activity data records and calculation factors cross-checked against fiscal gas invoices and calibrated CEMS telemetry.');

  // Submission history
  const submissionHistory = [
    { date: '15-Jun-2026', action: 'Annual Emission Data Submitted (V1)', by: 'Umasri Mavillapally', status: 'Submitted' },
    { date: '16-Jun-2026', action: 'Routed to Third-Party Verification', by: 'System', status: 'Pending Verification' },
    { date: '24-Jun-2026', action: 'Verification Statement Uploaded (Reasonable Assurance)', by: 'Dr. Arthur Pendelton', status: 'Completed' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Uploaded',
      }));
      setVerificationDocs((prev) => [...prev, ...newFiles]);
    }
  };

  const handleCompleteVerification = () => {
    setVerificationStatus('Verification Completed');
    setCtxVerificationStatus('Verification Completed');
    setAnnualEmissionStatus('Under EAD Review');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // 1. Verification Not Required state
  if (workflowState.verificationStatus === 'Not Required') {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
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
      <div className="h-full flex flex-col items-center justify-center gap-4">
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

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />

      {/* TOP HEADER */}
      <div className="flex-shrink-0 space-y-3 pb-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
                Verification
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Third-party verification for Annual Emission Data submission
              </p>
            </div>

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verification status updated!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 no-scrollbar">
        {/* Facility & Submission Info */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
          <h4 className="text-xs font-bold text-[#004B87] mb-4">Submission Overview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            {[
              { label: 'Facility', value: activeFacility?.name || 'Green Mountain Cement Factory' },
              { label: 'Reporting Year', value: String(reportingYear || 2026) },
              { label: 'Submission Version', value: 'V1' },
              { label: 'Submitted Date', value: '15-Jun-2026' },
              { label: 'Total Emissions', value: '155,950 tCO₂e' },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="text-[10px] text-slate-400 font-semibold">{item.label}</p>
                <p className="text-xs font-bold text-navy-900 mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verifier Information (with integrated Verification Status & Actions) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          {/* Header with Title & Current Status Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-[#004B87]">Verifier Information</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Accredited third-party verification assessment and status</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
              verificationStatus === 'Not Required' ? 'bg-slate-100 text-slate-600' :
              verificationStatus === 'Pending Verification' ? 'bg-amber-100 text-amber-700' :
              verificationStatus === 'Verification In Progress' ? 'bg-blue-100 text-blue-700' :
              verificationStatus === 'Verification Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
              verificationStatus === 'Verification Statement Uploaded' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              'bg-purple-100 text-purple-700'
            }`}>
              {(verificationStatus === 'Verification Completed' || verificationStatus === 'Verification Statement Uploaded') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>
                {verificationStatus === 'Verification Statement Uploaded'
                  ? 'Completed • Statement Uploaded'
                  : verificationStatus === 'Verification Completed'
                  ? 'Completed'
                  : verificationStatus}
              </span>
            </span>
          </div>

          {/* Verification Status / Progress */}
          <div>
            <div className="text-[11px] font-semibold text-slate-600 mb-2">Verification Status</div>
            <div className="flex items-center gap-2 text-[10px] overflow-x-auto no-scrollbar pb-1">
              {[
                { key: 'Pending Verification', label: 'Pending Verification' },
                { key: 'Verification In Progress', label: 'In Progress' },
                { key: 'Verification Completed', label: 'Completed' },
                { key: 'Verification Statement Uploaded', label: 'Statement Uploaded' }
              ].map((step, idx) => {
                const stepKeys = ['Pending Verification', 'Verification In Progress', 'Verification Completed', 'Verification Statement Uploaded'];
                const currentIdx = stepKeys.indexOf(verificationStatus);
                const isPassed = currentIdx > idx;
                const isCurrent = verificationStatus === step.key;
                const isDone = isPassed || (isCurrent && (step.key === 'Verification Completed' || step.key === 'Verification Statement Uploaded'));

                return (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                      isCurrent
                        ? 'bg-[#004B87] text-white shadow-xs font-bold'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800 font-semibold'
                        : 'bg-slate-100 text-slate-500 font-medium'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-300' : 'text-emerald-600'}`} />
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

          {/* Verification Actions */}
          <div className="flex gap-2 flex-wrap pb-3 border-b border-slate-100">
            <button
              onClick={() => {
                setVerificationStatus('Verification In Progress');
                setCtxVerificationStatus('Verification In Progress');
                setIsSavedNotice(true);
                setTimeout(() => setIsSavedNotice(false), 2500);
              }}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-[11px] font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Start Verification
            </button>
            <button
              onClick={handleCompleteVerification}
              className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Mark Verification Completed
            </button>
            <button
              onClick={() => {
                setVerificationStatus('Verification Statement Uploaded');
                setCtxVerificationStatus('Verification Statement Uploaded');
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-bold hover:bg-purple-100 transition-colors cursor-pointer"
            >
              Upload Statement
            </button>
          </div>

          {/* Verifier Information Fields */}
          <div>
            <div className="text-[11px] font-semibold text-slate-600 mb-3">Verifier Information Fields</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verifier Name</label>
                <input type="text" value={verifierInfo.name} onChange={(e) => setVerifierInfo(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter verifier name" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Organization</label>
                <input type="text" value={verifierInfo.organization} onChange={(e) => setVerifierInfo(prev => ({ ...prev, organization: e.target.value }))} placeholder="Enter organization" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Accreditation Number</label>
                <input type="text" value={verifierInfo.accreditationNumber} onChange={(e) => setVerifierInfo(prev => ({ ...prev, accreditationNumber: e.target.value }))} placeholder="EAD-ACCR-XXXX" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verification Start Date</label>
                <input type="date" value={verifierInfo.startDate} onChange={(e) => setVerifierInfo(prev => ({ ...prev, startDate: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verification End Date</label>
                <input type="date" value={verifierInfo.endDate} onChange={(e) => setVerifierInfo(prev => ({ ...prev, endDate: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verifier Opinion</label>
                <select value={verifierInfo.opinion} onChange={(e) => setVerifierInfo(prev => ({ ...prev, opinion: e.target.value }))} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm">
                  <option value="">Select opinion</option>
                  <option value="Unmodified (Positive)">Unmodified (Positive)</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Adverse">Adverse</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
          <h4 className="text-xs font-bold text-[#004B87] mb-4">Verification Documents</h4>
          <div
            className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center cursor-pointer hover:border-[#004B87]/40 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Upload Verification Statement, Report or Supporting Documents
            </p>
            <p className="text-[10px] text-slate-400 mt-1">PDF, DOC, XLS up to 50MB</p>
          </div>
          {verificationDocs.length > 0 && (
            <div className="mt-3 space-y-2">
              {verificationDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#004B87]" />
                    <span className="font-semibold text-xs">{doc.name}</span>
                    <span className="text-slate-400 text-[10px]">{doc.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 text-[10px] font-bold">{doc.status}</span>
                    <button onClick={() => setVerificationDocs(p => p.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-500 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Remarks */}
          <div className="mt-4">
            <label className="block text-slate-600 font-semibold mb-1 text-xs">Verification Remarks</label>
            <textarea
              rows={3}
              value={verificationRemarks}
              onChange={(e) => setVerificationRemarks(e.target.value)}
              placeholder="Add verification remarks or notes..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 text-xs focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Submission / Review History */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
          <h4 className="text-xs font-bold text-[#004B87] mb-4">Submission & Review History</h4>
          <div className="space-y-3">
            {submissionHistory.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#004B87] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-navy-900">{event.action}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{event.date} • {event.by}</p>
                </div>
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                  event.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                  event.status === 'Pending Verification' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-1">
          <button
            onClick={() => setActiveView('annual-emission-data')}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Back to Annual Emission Data
          </button>
          <button
            onClick={handleCompleteVerification}
            className="px-6 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-2 shadow-md shadow-[#004B87]/25 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Complete Verification & Submit to EAD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
