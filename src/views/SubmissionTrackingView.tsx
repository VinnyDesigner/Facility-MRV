import React, { useState } from 'react';
import {
  History,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Award,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Submission } from '../types/mrv';

export const SubmissionTrackingView: React.FC = () => {
  const {
    activeFacility,
    submissions,
    reportingYear,
    selectedSubmissionForReview,
    setSelectedSubmissionForReview,
    setActiveView,
  } = useMRV();

  const facilitySubmissions = submissions.filter((s) => s.facilityId === activeFacility.id);
  const [selectedSubId, setSelectedSubId] = useState<string>(
    selectedSubmissionForReview?.id || facilitySubmissions[0]?.id || ''
  );

  const activeSub =
    facilitySubmissions.find((s) => s.id === selectedSubId) || facilitySubmissions[0];

  const workflowStages = [
    { key: 'Draft', label: '1. Draft Formulated' },
    { key: 'Submitted', label: '2. Transmitted to EAD' },
    { key: 'Under Review', label: '3. Inspector Assessment' },
    { key: 'Correction Required', label: '4. Correction Window' },
    { key: 'Approved', label: '5. Compliance Certificate' },
  ];

  const getStageStatus = (stageKey: string) => {
    if (!activeSub) return 'pending';
    if (activeSub.status === 'Approved') return 'completed';
    if (stageKey === activeSub.status) return 'active';

    if (activeSub.status === 'Correction Required' && (stageKey === 'Draft' || stageKey === 'Submitted' || stageKey === 'Under Review')) {
      return 'completed';
    }
    if (activeSub.status === 'Under Review' && (stageKey === 'Draft' || stageKey === 'Submitted')) {
      return 'completed';
    }
    if (activeSub.status === 'Submitted' && stageKey === 'Draft') {
      return 'completed';
    }
    return 'pending';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header Row */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Submission Lifecycle & Version Tracking
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track Compliance Milestones, Audit Progression & Certification
          </p>
        </div>
        {activeSub && activeSub.status === 'Approved' && (
          <button
            onClick={() => alert(`Downloading Official EAD Subnational MRV Certificate for ${activeFacility.name}`)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white text-xs font-bold rounded-xl shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Download Certificate</span>
          </button>
        )}
      </div>

      {/* Submissions Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {facilitySubmissions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubId(sub.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeSub?.id === sub.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'bg-white/80 text-navy-800 hover:bg-primary-50 border border-primary-100/80'
            }`}
          >
            <span className="font-mono">RY {sub.reportingYear}</span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">
              v{sub.version}.0
            </span>
            <Badge status={sub.status} size="sm" dot>
              {sub.status}
            </Badge>
          </button>
        ))}
      </div>

      {activeSub ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Workflow Stages & Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold font-display text-navy-900">
                    Submission Lifecycle
                  </h3>
                  <p className="text-xs text-mrv-muted">
                    Version {activeSub.version}.0 • Submitted {activeSub.submittedDate}
                  </p>
                </div>
                <Badge status={activeSub.status} dot size="lg">
                  {activeSub.status}
                </Badge>
              </div>

              {/* Workflow Stepper */}
              <div className="space-y-4 pt-3">
                {workflowStages.map((st, idx) => {
                  const state = getStageStatus(st.key);
                  return (
                    <div key={st.key} className="flex items-start gap-3 relative">
                      {idx < workflowStages.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                            state === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'active'
                            ? 'bg-primary-600 text-white ring-4 ring-primary-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {state === 'completed' ? '✓' : idx + 1}
                      </div>
                      <div className="pt-0.5">
                        <h4
                          className={`text-xs font-bold ${
                            state === 'active'
                              ? 'text-primary-700'
                              : state === 'completed'
                              ? 'text-navy-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 30-day Correction Notice Card if active */}
              {activeSub.status === 'Correction Required' && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-950 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Active 30-Day Resubmission Window</span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    EAD reviewer has requested corrections. Your facility has <strong>30 days</strong> to upload revised documents.
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-rose-700">Due Date: {activeSub.correctionDueDate || '30 Days'}</span>
                    <button
                      onClick={() => setActiveView('report-upload')}
                      className="btn-primary text-[11px] py-1.5 px-3"
                    >
                      Resubmit Package →
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Submission Metadata Card */}
            <GlassCard className="p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-mrv-muted">
                Submission Parameters
              </h3>
              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1.5">
                  <span className="text-mrv-muted">Total Emissions:</span>
                  <span className="font-bold font-mono text-navy-900">
                    {activeSub.totalEmissions.toLocaleString()} tCO₂e
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-mrv-muted">Tier Classification:</span>
                  <span className="font-bold text-primary-700">{activeSub.tier}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-mrv-muted">Third-Party Verifier:</span>
                  <span className="font-bold text-navy-900">{activeSub.verifierName || 'Bureau Veritas'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-mrv-muted">Assurance Opinion:</span>
                  <span className="font-bold text-emerald-700">{activeSub.verifierOpinion || 'Unmodified (Positive)'}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: Detailed Audit Trail of Events (7 cols) */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold font-display text-navy-900">
                  Audit History & Inspector Action Log
                </h3>
                <p className="text-xs text-mrv-muted">
                  Chronological trail of operator transmissions, reviewer comments, and status revisions.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-xl">
                {activeSub.history.length} Audit Events
              </span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-primary-100">
              {activeSub.history.map((ev) => (
                <div key={ev.id} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-primary-500 shadow-sm flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary-600" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white/90 border border-primary-100/80 shadow-sm group-hover:border-primary-300 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-navy-900">{ev.action}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                          v{ev.version}.0
                        </span>
                      </div>
                      <span className="text-[11px] text-mrv-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary-500" /> {ev.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-primary-800 font-medium mt-1">
                      <User className="w-3.5 h-3.5 text-primary-600" />
                      <span>{ev.user}</span>
                      <span className="text-mrv-muted font-normal">({ev.role})</span>
                    </div>

                    {ev.comments && (
                      <div className="mt-3 p-3 rounded-xl bg-primary-50/60 border border-primary-100/80 text-xs text-navy-800 leading-relaxed">
                        <p className="font-semibold text-primary-900 text-[11px] mb-0.5">
                          Notes / Reviewer Comments:
                        </p>
                        "{ev.comments}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-mrv-muted text-xs">
          No submission records available.
        </GlassCard>
      )}
    </div>
  );
};
