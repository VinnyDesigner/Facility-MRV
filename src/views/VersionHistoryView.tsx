import React from 'react';
import {
  History,
  GitCommit,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Calendar,
  User,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const VersionHistoryView: React.FC = () => {
  const { activeFacility, reportingYear, setActiveView } = useMRV();

  const versionsList = [
    {
      version: 'v3.0 (Active Dossier)',
      submittedDate: '14 Mar 2026, 11:30 AM',
      submittedBy: 'Abdul Rahman (Operator)',
      status: 'Under Review',
      statusVariant: 'info' as const,
      emissions: '1,240,500 tCO₂e',
      comments: 'Resubmitted with calibrated continuous flow meter calibration certificates for Steam Turbine #2 and updated Tier 2 activity calculation notes as requested by EAD Inspector.',
      changes: [
        'Updated Turbine #2 calibration sheets',
        'Revised activity data remarks in Section 3.2',
        'Re-signed Verification Statement attached from Bureau Veritas',
      ],
      isLatest: true,
    },
    {
      version: 'Correction Notice',
      isNotice: true,
      submittedDate: '10 Mar 2026, 02:15 PM',
      submittedBy: 'Dr. Fatima Al Nuaimi (EAD Reviewer)',
      status: 'Correction Requested',
      statusVariant: 'warning' as const,
      comments: 'Dossier reverted: Please attach valid calibration certs for primary flow sensors and clarify the sulfur content monitoring methodology in Tier 2 Combustion.',
      deadline: '30-Day Resubmission Window (Due 09 Apr 2026)',
    },
    {
      version: 'v2.0',
      submittedDate: '01 Mar 2026, 09:45 AM',
      submittedBy: 'Abdul Rahman (Operator)',
      status: 'Reverted',
      statusVariant: 'warning' as const,
      emissions: '1,238,900 tCO₂e',
      comments: 'Second submission package with amended flared gas volumes.',
      changes: [
        'Updated flared gas volume tables',
        'Added third-party verifier interim memo',
      ],
    },
    {
      version: 'Correction Notice',
      isNotice: true,
      submittedDate: '24 Feb 2026, 04:00 PM',
      submittedBy: 'EAD Automated Validation Engine',
      status: 'Format Issue',
      statusVariant: 'neutral' as const,
      comments: 'Flaring stream calculations required supplementary volumetric calibration metadata.',
    },
    {
      version: 'v1.0 (Initial Submission)',
      submittedDate: '15 Feb 2026, 10:00 AM',
      submittedBy: 'Abdul Rahman (Operator)',
      status: 'Archived',
      statusVariant: 'neutral' as const,
      emissions: '1,235,000 tCO₂e',
      comments: 'Initial annual MRV package transmission for reporting year 2026.',
      changes: [
        'Initial package submission',
        'Basic monitoring plan upload',
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">
      {/* Sticky Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
            Submission Version History & Evolution Tree
          </h1>
          <Badge variant="cyan" size="sm">
            Reporting Year {reportingYear || 2026}
          </Badge>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {activeFacility.name} • Latest: v3.0
        </div>
      </div>

      {/* Overview Context Card */}
      <GlassCard className="p-5 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-navy-950 font-display">
              Official Regulatory Version Audit Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete, immutable chain of custody recording all submission revisions, EAD reviewer correction notices, and facility responses.
            </p>
          </div>
          <button
            onClick={() => setActiveView('submissions')}
            className="px-4 py-2 bg-[#004B87] text-white text-xs font-bold rounded-xl shadow hover:bg-[#003866] transition-colors self-start sm:self-center"
          >
            Track Current Submission
          </button>
        </div>
      </GlassCard>

      {/* Version Evolution Tree */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 before:z-0">
        {versionsList.map((item, idx) => (
          <div key={idx} className="relative z-10 pl-14">
            {/* Timeline Node */}
            <div
              className={`absolute left-4 top-5 -translate-x-1/2 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${
                item.isLatest
                  ? 'border-[#004B87] ring-4 ring-[#004B87]/20 text-[#004B87]'
                  : item.isNotice
                  ? 'border-amber-500 text-amber-600'
                  : 'border-slate-300 text-slate-400'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isLatest ? 'bg-[#004B87]' : item.isNotice ? 'bg-amber-500' : 'bg-slate-400'
                }`}
              />
            </div>

            {/* Version Card */}
            <GlassCard
              className={`p-5 transition-all ${
                item.isLatest
                  ? 'border-2 border-[#004B87]/40 shadow-md bg-white'
                  : item.isNotice
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-navy-950 font-display">
                    {item.version}
                  </h3>
                  <Badge variant={item.statusVariant} size="sm">
                    {item.status}
                  </Badge>
                  {item.isLatest && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.submittedDate}</span>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>By:</strong> {item.submittedBy}</span>
                  {item.emissions && (
                    <span className="ml-auto font-bold text-navy-900">
                      Reported: {item.emissions}
                    </span>
                  )}
                </div>

                {item.comments && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                )}

                {item.changes && (
                  <div className="pt-2">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Modifications Included:
                    </span>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                      {item.changes.map((c, cIdx) => (
                        <li key={cIdx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
};
