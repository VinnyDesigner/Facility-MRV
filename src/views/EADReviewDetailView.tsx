import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Building2,
  Calendar,
  Flame,
  FileCheck2,
  Download,
  ArrowLeft,
  FileText,
  Clock,
  Sparkles,
  Info,
  UserCheck,
  History,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const EADReviewDetailView: React.FC = () => {
  const {
    selectedSubmissionForReview,
    submissions,
    eadApproveSubmission,
    eadRevertSubmission,
    eadRejectSubmission,
    setActiveView,
  } = useMRV();

  // Find latest state of selected submission
  const sub =
    submissions.find((s) => s.id === selectedSubmissionForReview?.id) ||
    selectedSubmissionForReview ||
    submissions[0];

  const [decisionNotes, setDecisionNotes] = useState('');
  const [revertComments, setRevertComments] = useState(
    'Please attach the ISO 17025 accredited laboratory fuel gas chromatography analysis certificates for Turbine 2 and verify the Tier 2 oxidation factor methodology.'
  );
  const [rejectReason, setRejectReason] = useState('');
  const [activeModal, setActiveModal] = useState<'approve' | 'revert' | 'reject' | null>(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const handleApprove = () => {
    eadApproveSubmission(sub.id, decisionNotes || 'Full compliance criteria verified.');
    setActiveModal(null);
    setActionSuccessNotice('Submission Approved — Official EAD Compliance Certificate Issued');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#0878C9', '#19B5D8'],
    });
  };

  const handleRevert = () => {
    if (!revertComments.trim()) {
      alert('Please enter required correction comments.');
      return;
    }
    eadRevertSubmission(sub.id, revertComments);
    setActiveModal(null);
    setActionSuccessNotice('Submission Reverted to Operator (30-Day Resubmission Window Activated)');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide formal rejection justification.');
      return;
    }
    eadRejectSubmission(sub.id, rejectReason);
    setActiveModal(null);
    setActionSuccessNotice('Submission Formally Rejected under EAD Regulations');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-[#0B2238] to-[#143E65] text-white shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('ead-queue')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Back to Review Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider">
                EAD Regulatory Evaluation
              </span>
              <span className="px-2 py-0.2 rounded bg-cyan-brand/20 text-cyan-300 text-[10px] font-mono">
                {sub.facilityCode}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-0.5">
              {sub.facilityName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge status={sub.status} dot size="lg">
            {sub.status}
          </Badge>
          <span className="text-xs font-mono text-cyan-200">
            Version {sub.version}.0
          </span>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionSuccessNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActiveView('ead-queue')}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Return to Queue →
          </button>
        </div>
      )}

      {/* Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Complete Submission Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Facility & Permit Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4 border-b border-primary-100/60 pb-3">
              <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <Building2 className="w-4 h-4 text-cyan-brand" />
                <span>Facility Installation & Permit Information</span>
              </div>
              <span className="text-xs font-semibold text-primary-700">{sub.sector} Sector</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Region / Emirate</span>
                <p className="font-bold text-navy-900 mt-0.5">{sub.emirate}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Tier Classification</span>
                <p className="font-bold text-primary-700 mt-0.5">{sub.tier}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Submitted Date</span>
                <p className="font-bold text-navy-900 mt-0.5">{sub.submittedDate}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Assurance Body</span>
                <p className="font-bold text-navy-900 mt-0.5">{sub.verifierName || 'Bureau Veritas UAE'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Verifier Opinion</span>
                <p className="font-bold text-emerald-700 mt-0.5">{sub.verifierOpinion || 'Unmodified (Positive)'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Days Pending</span>
                <p className="font-bold text-rose-600 mt-0.5">{sub.daysPending} Days</p>
              </div>
            </div>
          </GlassCard>

          {/* Reported Emissions Value Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Reported GHG Emissions (Scope 1 Direct)</span>
              </span>
              <Badge variant="cyan">Reporting Year {sub.reportingYear}</Badge>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-50 via-cyan-50/40 to-white border border-primary-200">
              <div className="text-3xl sm:text-4xl font-black font-display text-navy-900 font-mono">
                {sub.totalEmissions.toLocaleString()}{' '}
                <span className="text-base font-bold text-primary-700">tCO₂e</span>
              </div>
              <p className="text-xs text-mrv-muted mt-1">
                Calculated using facility-specific Net Calorific Values & continuous chromatography.
              </p>
            </div>
          </GlassCard>

          {/* Attached Documents Manifest */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
                <FileCheck2 className="w-4 h-4 text-primary-600" />
                <span>Attached Verified Documentation</span>
              </div>
              <span className="text-xs text-mrv-muted font-mono">{sub.documents.length} Files</span>
            </div>

            <div className="space-y-2.5">
              {sub.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-white/90 border border-primary-100 flex items-center justify-between gap-3 hover:bg-primary-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-100 text-primary-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-900">{doc.title}</h4>
                      <p className="text-[11px] text-mrv-muted">
                        {doc.fileName} • {doc.fileSize} • Uploaded {doc.uploadDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Simulated downloading ${doc.fileName}`)}
                    className="p-2 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Version Audit History */}
          <GlassCard className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-mrv-muted mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-brand" />
              <span>Prior Inspector & Operator Action Logs</span>
            </h3>

            <div className="space-y-3">
              {sub.history.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-navy-900">
                    <span>{ev.action}</span>
                    <span className="text-[10px] text-mrv-muted font-normal">{ev.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-primary-700 mt-0.5">
                    {ev.user} ({ev.role})
                  </div>
                  {ev.comments && (
                    <div className="mt-1.5 text-navy-800 text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                      "{ev.comments}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT PANEL: Regulatory Decision Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 sm:p-8 space-y-6" variant="glow">
            <div className="border-b border-primary-100/60 pb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/15 text-cyan-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-brand" />
                <span>Statutory Authority Decision</span>
              </div>
              <h3 className="text-xl font-bold font-display text-navy-900">
                Regulatory Decision Panel
              </h3>
              <p className="text-xs text-mrv-muted mt-1">
                Issue a final determination on this facility MRV package under EAD Environmental Protection Law.
              </p>
            </div>

            {/* Decision Buttons */}
            <div className="space-y-3">
              {/* Approve Option */}
              <button
                onClick={() => setActiveModal('approve')}
                className="w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <div className="text-left">
                    <div>Approve Submission</div>
                    <div className="text-[10px] font-normal text-emerald-100">
                      Issue official EAD Compliance Certificate
                    </div>
                  </div>
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Revert with 30-Day Window Option */}
              <button
                onClick={() => setActiveModal('revert')}
                className="w-full p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div className="text-left">
                    <div>Revert for Corrections</div>
                    <div className="text-[10px] font-normal text-amber-100">
                      Mandatory 30-Day Operator Resubmission Window
                    </div>
                  </div>
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {/* Reject Option */}
              <button
                onClick={() => setActiveModal('reject')}
                className="w-full p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-rose-600/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div>Formal Rejection</div>
                    <div className="text-[10px] font-normal text-rose-100">
                      Issue non-compliance citation
                    </div>
                  </div>
                </div>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* 30-Day Correction Policy Note */}
            <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-primary-900">
                <Info className="w-4 h-4 text-primary-600" />
                <span>30-Day Regulatory Correction Standard</span>
              </div>
              <p className="text-primary-800/90 leading-relaxed text-[11px]">
                Under the Subnational MRV Framework, reverting a submission triggers a legal <strong>30-calendar-day window</strong> during which the operator must rectify omissions and resubmit a revised version.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* APPROVE MODAL */}
      <Modal
        isOpen={activeModal === 'approve'}
        onClose={() => setActiveModal(null)}
        title="Approve Facility MRV Submission"
        subtitle={`Grant official certification for ${sub.facilityName} (${sub.reportingYear})`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950">
            <h4 className="font-bold text-sm text-emerald-900 mb-1">Confirmation of Regulatory Compliance</h4>
            <p>
              Granting approval certifies that the emissions data ({sub.totalEmissions.toLocaleString()} tCO₂e) has been verified by an accredited body and satisfies EAD reporting guidelines.
            </p>
          </div>

          <div>
            <label className="block font-bold text-navy-900 mb-1">Inspector Approval Remarks (Optional)</label>
            <textarea
              rows={3}
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              placeholder="e.g. All laboratory certificates reconciled. Tier 2 factors verified."
              className="w-full glass-input resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button
              onClick={handleApprove}
              className="btn-teal text-xs font-bold py-2.5 px-5 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Issue Certificate</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* REVERT MODAL (30-Day Window) */}
      <Modal
        isOpen={activeModal === 'revert'}
        onClose={() => setActiveModal(null)}
        title="Revert Submission for Corrections"
        subtitle="30-Day Statutory Resubmission Window"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900 mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Facility has 30 days to correct and resubmit.</span>
            </div>
            <p className="leading-relaxed">
              This action reverts the submission package to status <strong>Correction Required</strong>. The operator will receive an alert with your detailed instructions.
            </p>
          </div>

          <div>
            <label className="block font-bold text-navy-900 mb-1">Required Correction Comments *</label>
            <textarea
              rows={4}
              value={revertComments}
              onChange={(e) => setRevertComments(e.target.value)}
              placeholder="Detail specific omissions, missing calibration records, or methodology discrepancies..."
              className="w-full glass-input resize-none font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button
              onClick={handleRevert}
              className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Transmit 30-Day Revert Notice</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* REJECT MODAL */}
      <Modal
        isOpen={activeModal === 'reject'}
        onClose={() => setActiveModal(null)}
        title="Formally Reject Facility Submission"
        subtitle={`Regulatory Non-Compliance Action • ${sub.facilityName}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-950">
            <h4 className="font-bold text-sm text-rose-900 mb-1">Formal Regulatory Citation</h4>
            <p>
              Rejection marks the submission as non-compliant and may initiate legal enforcement procedures under Abu Dhabi Environmental Law.
            </p>
          </div>

          <div>
            <label className="block font-bold text-navy-900 mb-1">Formal Rejection Justification *</label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="State the statutory grounds for rejection..."
              className="w-full glass-input resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2 bg-rose-600 hover:bg-rose-700"
            >
              <XCircle className="w-4 h-4" />
              <span>Issue Rejection Citation</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
