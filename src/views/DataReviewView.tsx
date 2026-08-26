import React, { useState } from 'react';
import {
  ClipboardList,
  Flame,
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Save,
  Send,
  Download,
  Eye,
  FileText,
  Building2,
  Sparkles,
  Info,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MonitoringPlanView } from './MonitoringPlanView';
import { EmissionsDataView } from './EmissionsDataView';
import { ReportUploadView } from './ReportUploadView';

export const DataReviewView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    emissionsData,
    monitoringPlan,
    documents,
    currentSubmission,
    submitAnnualMRV,
    setActiveView,
  } = useMRV();

  const [activeTab, setActiveTab] = useState<'monitoring-plan' | 'emissions-data' | 'report-upload' | 'review-submit'>('monitoring-plan');
  const [preparerName, setPreparerName] = useState('Abdul Rahman');
  const [preparerTitle, setPreparerTitle] = useState('Senior Environmental & MRV Specialist');
  const [isDeclared, setIsDeclared] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Completeness Checks
  const isMpComplete = true; // Monitoring plan confirmed
  const isEmissionsComplete = !!emissionsData.totalEmissions && emissionsData.totalEmissions > 0;
  const isDocumentsComplete = documents.length >= 2;
  const isAllReady = isMpComplete && isEmissionsComplete && isDocumentsComplete && isDeclared;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitAnnualMRV();
      setIsSubmitting(false);
      setSubmitResult(res);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-sans">
      {/* Sticky Top Title Row */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
            Data Review & Submission Workspace
          </h1>
          <Badge variant="cyan" size="sm">
            Cycle {reportingYear || 2026}
          </Badge>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          {activeFacility.name} • {activeFacility.id}
        </div>
      </div>

      {/* Secondary Horizontal Workflow Tab Navigation (Section 18) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('monitoring-plan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'monitoring-plan'
              ? 'bg-[#004B87] text-white shadow-md'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
            activeTab === 'monitoring-plan' ? 'bg-white text-[#004B87]' : 'bg-emerald-100 text-emerald-700'
          }`}>
            ✓
          </span>
          <span>Monitoring Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('emissions-data')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'emissions-data'
              ? 'bg-[#004B87] text-white shadow-md'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
            activeTab === 'emissions-data' ? 'bg-white text-[#004B87]' : 'bg-amber-100 text-amber-700'
          }`}>
            ●
          </span>
          <span>Emissions Data</span>
        </button>

        <button
          onClick={() => setActiveTab('report-upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'report-upload'
              ? 'bg-[#004B87] text-white shadow-md'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
            activeTab === 'report-upload' ? 'bg-white text-[#004B87]' : 'bg-slate-200 text-slate-600'
          }`}>
            {documents.length > 0 ? '✓' : '○'}
          </span>
          <span>Report Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('review-submit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'review-submit'
              ? 'bg-[#004B87] text-white shadow-md'
              : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
            activeTab === 'review-submit' ? 'bg-white text-[#004B87]' : 'bg-slate-200 text-slate-600'
          }`}>
            {isAllReady ? '●' : '○'}
          </span>
          <span>Review & Submit</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'monitoring-plan' && (
        <div className="space-y-4">
          <MonitoringPlanView />
        </div>
      )}

      {activeTab === 'emissions-data' && (
        <div className="space-y-4">
          <EmissionsDataView />
        </div>
      )}

      {activeTab === 'report-upload' && (
        <div className="space-y-4">
          <ReportUploadView />
        </div>
      )}

      {activeTab === 'review-submit' && (
        <div className="space-y-6 animate-fade-in">
          {/* Submission Banner */}
          <GlassCard className="p-6 border-slate-200">
            <h2 className="text-lg font-bold font-display text-navy-950">
              Final Data Review & Submission Declaration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify all required reporting components, documents, and statements before submitting your annual MRV report to the Environment Agency – Abu Dhabi.
            </p>

            {submitResult && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">{submitResult.message}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Your submission package has been routed to the EAD Review Queue for official evaluation.
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Completeness Checklist Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-5 border-slate-200">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                1. Workflow Completeness Status
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-navy-900">Facility Registration & Renewal</span>
                  </div>
                  <span className="font-bold text-emerald-700">Confirmed</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-navy-900">Monitoring Plan (Tier 2)</span>
                  </div>
                  <span className="font-bold text-emerald-700">Approved</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-navy-900">Annual Emissions Data Entry</span>
                  </div>
                  <span className="font-bold text-emerald-700">
                    {((emissionsData.totalEmissions || 1240500) / 1000000).toFixed(2)}M tCO₂e
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-navy-900">Verified MRV Report & Statement</span>
                  </div>
                  <span className="font-bold text-emerald-700">{documents.length} Files Uploaded</span>
                </div>
              </div>
            </GlassCard>

            {/* Document Metadata Traceability Table */}
            <GlassCard className="p-5 border-slate-200">
              <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                2. Uploaded Document Traceability
              </h3>
              <div className="space-y-2 text-xs">
                {documents.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-900 truncate max-w-[200px]">{doc.title || doc.fileName}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                        {doc.fileType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>Author: {doc.author || 'Abdul Rahman'}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Legal Sign-Off Declaration */}
          <GlassCard className="p-6 border-slate-200">
            <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
              3. Preparer Declaration & Regulatory Sign-Off
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Preparer / Author Name *</label>
                <input
                  type="text"
                  value={preparerName}
                  onChange={(e) => setPreparerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Official Position / Title *</label>
                <input
                  type="text"
                  value={preparerTitle}
                  onChange={(e) => setPreparerTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87]"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isDeclared}
                onChange={(e) => setIsDeclared(e.target.checked)}
                className="mt-0.5 rounded text-[#004B87] focus:ring-[#004B87]"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                I hereby certify under penalty of applicable Abu Dhabi Environmental Regulations that the submitted emissions inventory, monitoring plan parameters, and third-party verification statement are true, complete, and calculated in accordance with official EAD Subnational MRV Guidelines.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isAllReady || isSubmitting}
                className={`px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${
                  !isAllReady || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting...' : 'Submit to EAD'}</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
