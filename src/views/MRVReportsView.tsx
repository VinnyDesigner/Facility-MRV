import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  ShieldCheck,
  History,
  Edit3,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const MRVReportsView: React.FC = () => {
  const { activeFacility, currentSubmission, setActiveView } = useMRV();

  // Top Sub-tabs State
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'version' | 'status'>('current');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const currentStatus = currentSubmission?.status || 'Under Review';
  const currentVersion = currentSubmission?.version || 1;
  const currentId = currentSubmission?.id || 'MRV-2026-00128';
  const currentEmissions = currentSubmission?.totalEmissions || 1240000;
  const currentSubmittedDate = currentSubmission?.submittedDate || '14 Mar 2026';
  const currentCorrectionComments = currentSubmission?.correctionComments || 'Please revise fuel combustion data...';
  const auditHistory = currentSubmission?.history || [];

  const isCorrectionRequired = currentStatus === 'Correction Required';

  const reportsList = [
    {
      year: 2026,
      id: currentId,
      type: 'Annual MRV Report Package',
      version: `v${currentVersion}`,
      emissions: `${(currentEmissions / 1000000).toFixed(2)}M tCO₂e`,
      submittedDate: currentSubmittedDate,
      status: currentStatus,
      verifier: 'Bureau Veritas Middle East',
      statusVariant:
        currentStatus === 'Approved'
          ? ('success' as const)
          : currentStatus === 'Correction Required'
          ? ('warning' as const)
          : ('info' as const),
    },
    {
      year: 2025,
      id: 'MRV-2025-00102',
      type: 'Annual MRV Report Package',
      version: 'v2.0',
      emissions: '1.23M tCO₂e',
      submittedDate: '20 Mar 2025',
      status: 'Approved',
      verifier: 'DNV GL Business Assurance',
      statusVariant: 'success' as const,
    },
    {
      year: 2024,
      id: 'MRV-2024-00088',
      type: 'Annual MRV Report Package',
      version: 'v1.0',
      emissions: '1.21M tCO₂e',
      submittedDate: '18 Mar 2024',
      status: 'Approved',
      verifier: 'TÜV Rheinland Middle East',
      statusVariant: 'success' as const,
    },
  ];

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-6 animate-fade-in pb-16 font-sans no-scrollbar">
      {/* Sticky Title Bar with Secondary Sub-Tabs */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold font-display text-[#004B87] tracking-tight">
            Reports & Submissions Center
          </h1>
          <Badge variant={isCorrectionRequired ? 'warning' : 'cyan'} size="sm">
            {currentStatus}
          </Badge>
        </div>

        {/* Secondary Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'current'
                ? 'bg-[#004B87] text-white shadow'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Current Submission
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-[#004B87] text-white shadow'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Submission History
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'version'
                ? 'bg-[#004B87] text-white shadow'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Version History
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'status'
                ? 'bg-[#004B87] text-white shadow'
                : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
            }`}
          >
            Submission Status
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* CORRECTION REQUIRED WARNING BANNER (Shows when EAD Reverts for Correction) */}
      {/* ------------------------------------------------------------------------- */}
      {isCorrectionRequired && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 space-y-4 shadow-md animate-slide-down">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-amber-950">
                    EAD Regulator Action Required: Correction Notice Issued
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] uppercase">
                    30-Day Resubmission Window Active
                  </span>
                </div>
                <p className="text-xs text-amber-900 mt-0.5">
                  The regulator requested clarification regarding fuel combustion data & verifier signature.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-mono font-bold text-xs">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>28 Days Left to Resubmit</span>
              </div>
            </div>
          </div>

          {/* Reviewer Comments Box */}
          <div className="p-4 rounded-xl bg-white border border-amber-200/80 text-xs text-slate-800 space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>EAD Senior Regulator Reviewer Feedback:</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium italic pl-5">
              "{currentCorrectionComments}"
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveView('data-entry')}
              className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Submission & Fix Findings</span>
            </button>

            <button
              onClick={() => setActiveTab('version')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>View Previous Version (v1.0)</span>
            </button>

            <button
              onClick={() => alert(`Reviewer Comments Detail Modal: ${currentCorrectionComments}`)}
              className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>Review Detailed Audit Comments</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 1: CURRENT SUBMISSION */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'current' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Active Cycle Dossier
                </span>
                <h2 className="text-lg font-bold text-navy-950 flex items-center gap-2 mt-0.5">
                  Reporting Cycle 2026 — {activeFacility.name}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    currentStatus === 'Approved'
                      ? 'success'
                      : currentStatus === 'Correction Required'
                      ? 'warning'
                      : 'info'
                  }
                  size="md"
                >
                  {currentStatus}
                </Badge>

                <button
                  onClick={() => alert('Downloading official 2026 MRV report dossier (PDF)...')}
                  className="px-4 py-2 rounded-xl bg-[#004B87] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#003866]"
                >
                  <Download className="w-4 h-4" />
                  Download Complete Dossier
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500">Submission Reference</span>
                <div className="font-mono font-bold text-navy-950 text-sm">{currentId}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500">Version</span>
                <div className="font-mono font-bold text-[#004B87] text-sm">v{currentVersion}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500">Total Reported GHG</span>
                <div className="font-bold text-navy-950 text-sm">
                  {(currentEmissions / 1000000).toFixed(2)} Million tCO₂e
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500">Accredited Verifier</span>
                <div className="font-bold text-emerald-800 text-sm">Bureau Veritas Middle East</div>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
                Submitted Section Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  '01 Operator & Facility Details',
                  '02 Economic Activities & Production',
                  '03 Scope 1 Direct Emissions',
                  '04 Scope 2 Purchased Electricity',
                  '05 Monitoring & Calibration',
                  '06 QA/QC Protocols & Sign-off',
                ].map((mod, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{mod}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 2: SUBMISSION HISTORY */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="pb-3">Reporting Year</th>
                    <th className="pb-3">Submission ID</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Emissions</th>
                    <th className="pb-3">Submitted Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Verifier</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportsList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 font-extrabold text-[#004B87] text-sm">{row.year}</td>
                      <td className="py-4 font-mono font-bold text-slate-800">{row.id}</td>
                      <td className="py-4 font-mono font-bold text-slate-600">{row.version}</td>
                      <td className="py-4 font-bold text-navy-900">{row.emissions}</td>
                      <td className="py-4 text-slate-500">{row.submittedDate}</td>
                      <td className="py-4">
                        <Badge variant={row.statusVariant} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-slate-700 font-medium">{row.verifier}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => alert(`Viewing dossier ${row.id}`)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert(`Downloading archive ${row.id}`)}
                            className="p-1.5 rounded-lg bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] font-bold"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 3: VERSION HISTORY */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'version' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <History className="w-5 h-5 text-[#004B87]" />
                Version History & Regulatory Audit Trail — 2026
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Complete revision logs and reviewer action history for statutory transparency.
              </p>
            </div>

            <div className="space-y-4">
              {auditHistory.map((ver: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#004B87]">
                        Version {ver.version}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {ver.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{ver.action} — {ver.comments || 'No remarks recorded'}</p>
                    <div className="text-[11px] text-slate-500">Author / Authority: {ver.user} ({ver.role})</div>
                  </div>

                  <button
                    onClick={() => alert(`Comparing version ${ver.version} against current live submission.`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    View Version Details
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 4: SUBMISSION STATUS TIMELINE */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'status' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#004B87]" />
                Submission Lifecycle & Regulatory Workflow Tracker
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Live regulatory progression tracking from initial draft to final EAD approval.
              </p>
            </div>

            <div className="relative py-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                {[
                  { stage: '1. Draft Created', desc: '01 Jan 2026', done: true },
                  { stage: '2. Formal Submission', desc: '14 Mar 2026', done: true },
                  { stage: '3. EAD Review', desc: 'Under Review', done: currentStatus !== 'Draft' },
                  {
                    stage: '4. Revisions / Corrections',
                    desc: isCorrectionRequired ? 'Action Required' : 'Completed',
                    done: currentStatus === 'Correction Required' || currentStatus === 'Approved',
                    active: isCorrectionRequired,
                  },
                  { stage: '5. Regulatory Decision', desc: currentStatus === 'Approved' ? 'Approved' : 'Pending', done: currentStatus === 'Approved' },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs transition-all ${
                      st.active
                        ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-400'
                        : st.done
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="font-bold">{st.stage}</div>
                    <div className="text-[11px] mt-1 font-mono">{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
