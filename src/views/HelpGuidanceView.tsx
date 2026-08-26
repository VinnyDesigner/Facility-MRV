import React from 'react';
import {
  HelpCircle,
  BookOpen,
  FileText,
  ShieldCheck,
  Award,
  ExternalLink,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const HelpGuidanceView: React.FC = () => {
  const guidanceTopics = [
    {
      title: 'Subnational MRV Framework Overview',
      category: 'Regulatory Architecture',
      description: 'Understanding statutory legal basis, mandatory sector thresholds (>25k tCO₂e/yr), and alignment with UAE Net Zero 2050 strategic pathway.',
      pages: 'Section 1.0 — Regulatory Mandate',
    },
    {
      title: 'Tier 1, Tier 2, and Tier 3 Methodologies',
      category: 'GHG Quantification',
      description: 'Detailed criteria for selecting calculation tiers, fuel-specific Net Calorific Values, continuous mass-balance accounting, and CEMS QAL1/QAL2 protocols.',
      pages: 'Section 3.2 — Quantification Standards',
    },
    {
      title: 'Third-Party Verification & ISO 14065 Audits',
      category: 'Assurance Procedures',
      description: 'Rules for engaging accredited verifiers, site sampling protocols, materiality thresholds (5% for Tier 1/2, 2% for Tier 3), and standard assurance opinions.',
      pages: 'Section 4.1 — Verifier Requirements',
    },
    {
      title: '30-Day Correction & Resubmission Protocol',
      category: 'Regulatory Review Cycles',
      description: 'Step-by-step guidance on how to respond to EAD inspector revert notices within the 30-day statutory correction window.',
      pages: 'Section 5.4 — Workflow Timelines',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-primary-900 to-teal-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-brand/20 text-cyan-300 text-xs font-bold">
              Knowledge Repository
            </span>
            <span className="text-xs text-slate-300">Environment Agency – Abu Dhabi Guidelines</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            MRV Guidelines & Technical Reference
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
            Official statutory guidelines, quantification formulas, ISO standards, and FAQ manuals for regulated facilities and accredited verifiers.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading EAD Subnational Facility MRV Technical Manual (PDF, 14.8MB)')}
          className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-2 shadow-lg shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download MRV Manual (PDF)</span>
        </button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidanceTopics.map((topic) => (
          <GlassCard key={topic.title} className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-800 text-[10px] font-bold">
                  {topic.category}
                </span>
                <span className="text-[10px] text-mrv-muted font-mono">{topic.pages}</span>
              </div>
              <h3 className="text-base font-bold font-display text-navy-900 leading-snug">
                {topic.title}
              </h3>
              <p className="text-xs text-mrv-muted mt-2 leading-relaxed">
                {topic.description}
              </p>
            </div>

            <div className="pt-4 border-t border-primary-100/60 mt-4 flex justify-end">
              <button
                onClick={() => alert(`Opening ${topic.title} Chapter...`)}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                <span>Read Section</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* FAQ Accordion Section */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-white/90 border border-primary-100 space-y-1">
            <h4 className="font-bold text-navy-900">What is the mandatory annual submission deadline?</h4>
            <p className="text-mrv-muted leading-relaxed">
              All regulated industrial installations must transmit their verified MRV report package to EAD annually by <strong>31 March</strong> following the close of the reporting year.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-primary-100 space-y-1">
            <h4 className="font-bold text-navy-900">What happens when a submission is reverted by EAD?</h4>
            <p className="text-mrv-muted leading-relaxed">
              Upon receiving a revert notice, the operator has a statutory <strong>30 calendar-day correction window</strong> to rectify omissions, attach requested lab certificates, and submit an updated revision package.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-primary-100 space-y-1">
            <h4 className="font-bold text-navy-900">Who is authorized to perform third-party verifications?</h4>
            <p className="text-mrv-muted leading-relaxed">
              Only verification bodies officially accredited under ISO 14065:2020 and registered in the EAD Accredited Verifier Registry may sign official assurance statements.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
