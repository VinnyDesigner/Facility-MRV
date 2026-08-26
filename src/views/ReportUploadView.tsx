import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Send,
  AlertTriangle,
  Download,
  Eye,
  FileSpreadsheet,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

export const ReportUploadView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    emissionsData,
    documents,
    addDocument,
    removeDocument,
    submitAnnualMRV,
    setActiveView,
    currentSubmission,
  } = useMRV();

  const [dragActiveCategory, setDragActiveCategory] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; version: number } | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategoryForUpload, setSelectedCategoryForUpload] = useState<
    'MRV_REPORT' | 'VERIFIER_STATEMENT' | 'SUPPORTING_DOC'
  >('MRV_REPORT');

  const facilityDocs = documents.filter((d) => d.facilityId === activeFacility.id);

  const hasMrvReport = facilityDocs.some((d) => d.category === 'MRV_REPORT');
  const hasVerifierStatement = facilityDocs.some((d) => d.category === 'VERIFIER_STATEMENT');
  const isSubmissionReady = hasMrvReport && hasVerifierStatement;

  const handleSimulatedUpload = (
    fileName: string,
    category: 'MRV_REPORT' | 'VERIFIER_STATEMENT' | 'SUPPORTING_DOC',
    title: string,
    size: string
  ) => {
    addDocument({
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      reportingYear,
      title,
      fileName,
      fileType: fileName.endsWith('.xlsx') ? 'Excel Spreadsheet' : 'PDF Document',
      fileSize: size,
      category,
      author: 'Umasri Mavillapally',
      status: 'Verified',
      checksum: `sha256:${Math.random().toString(36).substring(2, 12)}`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const title =
        selectedCategoryForUpload === 'MRV_REPORT'
          ? 'Verified Annual Facility MRV Report'
          : selectedCategoryForUpload === 'VERIFIER_STATEMENT'
          ? 'Independent Third-Party Verification Statement'
          : 'Supporting Lab Analysis Certificate';

      handleSimulatedUpload(
        file.name,
        selectedCategoryForUpload,
        title,
        `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      );
    }
  };

  const triggerUploadFor = (
    category: 'MRV_REPORT' | 'VERIFIER_STATEMENT' | 'SUPPORTING_DOC'
  ) => {
    setSelectedCategoryForUpload(category);
    fileInputRef.current?.click();
  };

  const handleFinalSubmit = () => {
    const res = submitAnnualMRV();
    setSubmissionResult({ success: true, version: res.version });
    setIsSubmitModalOpen(false);

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0878C9', '#19B5D8', '#16A6A0', '#071A2B'],
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.xlsx,.csv,.doc,.docx"
      />

      {/* Sticky Single-Row Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all font-sans">
        <h1 className="text-[20px] font-bold font-display text-[#0B3A60] tracking-tight">
          Submit Verified MRV Report Package — Year {reportingYear}
        </h1>
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          disabled={!isSubmissionReady}
          className={`px-5 py-2 rounded-xl bg-[#196396] hover:bg-[#14527D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
            !isSubmissionReady ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Transmit Report to EAD</span>
        </button>
      </div>

      {/* Success Notification Alert if just submitted */}
      {submissionResult && (
        <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950 font-display">
                Report Package (Version {submissionResult.version}) Successfully Transmitted!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your submission is currently queued for EAD Lead Inspector review. You will receive an official notification upon regulatory evaluation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('submissions')}
            className="btn-secondary text-xs font-bold py-2 px-3 shrink-0"
          >
            Track in Timeline →
          </button>
        </div>
      )}

      {/* 3 Upload Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Verified MRV Report (Required) */}
        <GlassCard className="p-6 flex flex-col justify-between" variant={hasMrvReport ? 'default' : 'subtle'}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-500/20 text-primary-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 text-[10px] font-bold uppercase">
                Required
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-navy-900">
              1. Verified MRV Report
            </h3>
            <p className="text-xs text-mrv-muted mt-1 leading-relaxed">
              Official annual GHG inventory report covering stationary combustion, activity data, and tier calculations.
            </p>
          </div>

          <div className="mt-6">
            <div
              onClick={() => triggerUploadFor('MRV_REPORT')}
              className="p-6 rounded-2xl border-2 border-dashed border-primary-200 hover:border-primary-500 bg-primary-50/30 hover:bg-primary-50/60 text-center cursor-pointer transition-all group"
            >
              <UploadCloud className="w-7 h-7 text-primary-600 mx-auto group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-navy-900 block mt-2">
                Click or Drop MRV Report
              </span>
              <span className="text-[10px] text-mrv-muted block mt-0.5">PDF or XLSX up to 50MB</span>
            </div>
          </div>
        </GlassCard>

        {/* Card 2: Third-Party Verifier Statement (Required) */}
        <GlassCard className="p-6 flex flex-col justify-between" variant={hasVerifierStatement ? 'default' : 'subtle'}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 text-[10px] font-bold uppercase">
                Required
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-navy-900">
              2. Verifier Statement
            </h3>
            <p className="text-xs text-mrv-muted mt-1 leading-relaxed">
              Signed assurance opinion issued by an accredited ISO 14065 / EAD approved verification body.
            </p>
          </div>

          <div className="mt-6">
            <div
              onClick={() => triggerUploadFor('VERIFIER_STATEMENT')}
              className="p-6 rounded-2xl border-2 border-dashed border-teal-200 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 text-center cursor-pointer transition-all group"
            >
              <ShieldCheck className="w-7 h-7 text-teal-600 mx-auto group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-navy-900 block mt-2">
                Upload Verifier Statement
              </span>
              <span className="text-[10px] text-mrv-muted block mt-0.5">Signed PDF with Audit Seal</span>
            </div>
          </div>
        </GlassCard>

        {/* Card 3: Supporting Documents (Optional) */}
        <GlassCard className="p-6 flex flex-col justify-between" variant="subtle">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-brand/20 text-cyan-800 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold uppercase">
                Optional
              </span>
            </div>

            <h3 className="text-base font-bold font-display text-navy-900">
              3. Supporting Documents
            </h3>
            <p className="text-xs text-mrv-muted mt-1 leading-relaxed">
              CEMS QAL2 calibration logs, gas chromatography lab tests (ISO 17025), and fuel invoices.
            </p>
          </div>

          <div className="mt-6">
            <div
              onClick={() => triggerUploadFor('SUPPORTING_DOC')}
              className="p-6 rounded-2xl border-2 border-dashed border-cyan-200 hover:border-cyan-brand bg-cyan-light/30 hover:bg-cyan-light/60 text-center cursor-pointer transition-all group"
            >
              <UploadCloud className="w-7 h-7 text-cyan-brand mx-auto group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-navy-900 block mt-2">
                Attach Additional Evidence
              </span>
              <span className="text-[10px] text-mrv-muted block mt-0.5">Calibration certs, lab logs</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Uploaded Files Metadata List */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">
              Document Manifest & Traceability Metadata
            </h3>
            <p className="text-xs text-mrv-muted">
              Secure checksum-verified documents attached to Reporting Package {reportingYear}.
            </p>
          </div>
          <span className="text-xs font-bold text-primary-700 bg-primary-50 px-3 py-1 rounded-xl">
            {facilityDocs.length} Documents Attached
          </span>
        </div>

        {facilityDocs.length === 0 ? (
          <div className="py-12 text-center text-xs text-mrv-muted">
            No documents uploaded yet for this reporting cycle.
          </div>
        ) : (
          <div className="divide-y divide-primary-100/60">
            {facilityDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary-50/40 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-primary-100/70 text-primary-700 shrink-0 mt-0.5">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold text-navy-900">{doc.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-primary-50 text-primary-800 text-[10px] font-bold">
                        {doc.category.replace('_', ' ')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                        v{doc.version}.0
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-mrv-muted mt-1 flex-wrap">
                      <span>File: <strong>{doc.fileName}</strong> ({doc.fileSize})</span>
                      <span>•</span>
                      <span>Author: {doc.author}</span>
                      <span>•</span>
                      <span>Uploaded: {doc.uploadDate}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-slate-400">{doc.checksum}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Confirm Regulatory Submission to EAD"
        subtitle={`Annual MRV Package • Reporting Year ${reportingYear}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Official Regulatory Transmittal Declaration</span>
            </div>
            <p className="leading-relaxed">
              You are about to transmit the <strong>{activeFacility.name}</strong> 2026 MRV submission to the Environment Agency – Abu Dhabi Review Queue.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-mrv-muted">Total Reported Emissions:</span>
              <span className="font-bold font-mono text-navy-900">{emissionsData.totalEmissions.toLocaleString()} tCO₂e</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-mrv-muted">Attached Documents:</span>
              <span className="font-bold text-navy-900">{facilityDocs.length} Verified Files</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-mrv-muted">Submission Version:</span>
              <span className="font-bold text-primary-700">Version {currentSubmission ? currentSubmission.version + 1 : 1}.0</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalSubmit}
              className="btn-primary text-xs font-bold py-2.5 px-5 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Transmit</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
