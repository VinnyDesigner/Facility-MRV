import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Flame,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { ProgressCircle } from '../components/ui/ProgressCircle';

export const ComplianceCenterView: React.FC = () => {
  const { activeFacility, reportingYear, emissionsData, setActiveView, currentSubmission } =
    useMRV();

  const complianceItems = [
    {
      id: 'reg',
      title: 'Facility Registration & Annual Renewal',
      status: 'Complete',
      date: '2026-01-10',
      description: 'Permit valid through 2027, geographic coordinates and production streams verified.',
      link: 'registration',
      icon: Building2,
      isDone: true,
    },
    {
      id: 'mp',
      title: 'Monitoring Plan (Tier 2 Classification)',
      status: 'Approved by EAD',
      date: '2026-02-24',
      description: 'Technical methodology, calibration frequencies and QA/QC protocols approved.',
      link: 'monitoring-plan',
      icon: FileSpreadsheet,
      isDone: true,
    },
    {
      id: 'em',
      title: 'Emissions Data Entry (2026)',
      status: 'Calculated (1.24M tCO₂e)',
      date: '2026-03-14',
      description: 'Scope 1 direct stationary combustion & process emissions entered.',
      link: 'emissions-data',
      icon: Flame,
      isDone: true,
    },
    {
      id: 'ver',
      title: 'Third-Party Verification Opinion',
      status: 'Bureau Veritas Assigned',
      date: '2026-03-12',
      description: 'Positive assurance statement issued with ISO 14065 audit opinion.',
      link: 'verifier-registry',
      icon: ShieldCheck,
      isDone: true,
    },
    {
      id: 'sub',
      title: 'Final MRV Transmittal to EAD',
      status: currentSubmission ? currentSubmission.status : 'Under Review',
      date: '2026-03-14',
      description: 'Queued for final regulatory decision by EAD lead review committee.',
      link: 'submissions',
      icon: UploadCloud,
      isDone: currentSubmission?.status === 'Approved',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sticky Single-Row Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all font-sans">
        <h1 className="text-[20px] font-bold font-display text-[#0B3A60] tracking-tight">
          MRV Compliance Readiness & Statutory Obligations
        </h1>
        <Badge variant="success" dot size="md">
          Status: On Track
        </Badge>
      </div>

      {/* Hero Readiness Score + Deadline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <GlassCard className="lg:col-span-4 p-6 flex flex-col items-center justify-center text-center">
          <ProgressCircle
            value={activeFacility.complianceScore || 82}
            label="Readiness"
            subtitle="Cycle 2026"
            size={160}
            strokeWidth={14}
          />
          <h3 className="text-lg font-bold font-display text-navy-900 mt-4">
            82% Compliance Readiness
          </h3>
          <p className="text-xs text-mrv-muted mt-1 max-w-xs leading-relaxed">
            Your facility has satisfied 4 out of 5 mandatory compliance milestones. Awaiting EAD approval stamp.
          </p>
        </GlassCard>

        {/* Regulatory Summary Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-display text-navy-900">
                Statutory Milestone Checklist
              </h3>
              <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
                4 / 5 Fulfilled
              </span>
            </div>

            <div className="space-y-3">
              {complianceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white/80 border border-primary-100/70 hover:bg-primary-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          item.isDone ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'
                        }`}
                      >
                        {item.isDone ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-navy-900">{item.title}</h4>
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              item.isDone
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-mrv-muted mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView(item.link)}
                      className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 self-end sm:self-center shrink-0"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
