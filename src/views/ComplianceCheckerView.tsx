import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Building2,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const ComplianceCheckerView: React.FC = () => {
  const { setActiveView } = useMRV();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 0,
      title: 'Applicable Sector Scope',
      question: 'Does your facility operate within one of the designated MRV sectors in the Emirate of Abu Dhabi?',
      details: 'Designated sectors include: Energy & Power Generation, Oil & Gas (Upstream/Downstream), IPPU (Steel, Aluminum, Cement, Chemicals), Waste Management, or Commercial Transport.',
      options: [
        { label: 'Yes, our facility operates in an applicable sector', value: true },
        { label: 'No, our operations are outside these sectors', value: false },
      ],
    },
    {
      id: 1,
      title: 'Emissions Thresholds & Thermal Capacity',
      question: 'Does your facility have total direct (Scope 1) emissions exceeding 25,000 tCO₂e/year OR a total rated thermal input exceeding 20 MWth?',
      details: 'Under EAD regulations, stationary combustion or industrial process emissions above these limits trigger mandatory facility MRV obligations.',
      options: [
        { label: 'Yes, our facility exceeds the threshold (> 25k tCO₂e / 20 MWth)', value: true },
        { label: 'No, our facility is below this regulatory threshold', value: false },
      ],
    },
    {
      id: 2,
      title: 'Existing EAD Environmental Permit',
      question: 'Does your facility currently hold a Class A or Class B Environmental Permit issued by the Environment Agency – Abu Dhabi?',
      details: 'Class A and Class B permit holders in heavy industrial zones are automatically required to submit verified annual emissions data.',
      options: [
        { label: 'Yes, we hold an active Class A or B Permit', value: true },
        { label: 'No / We hold a Class C permit or are currently applying', value: false },
      ],
    },
    {
      id: 3,
      title: 'Voluntary Sustainability / Carbon Accounting',
      question: 'Are you planning to participate voluntarily in Abu Dhabi carbon reduction programs or corporate ESG disclosures?',
      details: 'Voluntary facilities may submit Tier 1 MRV monitoring plans to qualify for provincial emissions credits and clean energy certificates.',
      options: [
        { label: 'Yes, voluntary participation / ESG compliance', value: true },
        { label: 'No voluntary participation planned', value: false },
      ],
    },
  ];

  const handleSelectAnswer = (value: boolean) => {
    const nextAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(nextAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsCompleted(false);
  };

  const isMandatory = (answers[0] && answers[1]) || (answers[0] && answers[2]);
  const isVoluntary = !isMandatory && answers[3];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-primary-900 to-teal-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-brand/20 text-cyan-300 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Self-Assessment Tool</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Do I Need to Participate in Facility MRV?
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
            Complete this 4-step guided self-assessment to determine regulatory applicability and reporting obligations under EAD regulations.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={handleReset}
            className="btn-secondary text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 shrink-0 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Quiz</span>
          </button>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-navy-900">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-primary-700">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-primary-100/80 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-cyan-brand transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Active Question Glass Card */}
          <GlassCard className="p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-800 text-xs font-bold mb-3">
              <span>{questions[currentQuestion].title}</span>
            </div>

            <h3 className="text-xl font-bold font-display text-navy-900 leading-snug">
              {questions[currentQuestion].question}
            </h3>

            <p className="text-xs text-mrv-muted mt-3 leading-relaxed bg-primary-50/40 p-3.5 rounded-xl border border-primary-100/60">
              {questions[currentQuestion].details}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {questions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(opt.value)}
                  className="p-5 rounded-2xl border border-primary-200/80 bg-white/80 hover:bg-primary-50/90 hover:border-primary-500 text-left transition-all hover:-translate-y-1 shadow-sm group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-navy-900 group-hover:text-primary-800">
                      {opt.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <div className="mt-6 pt-4 border-t border-primary-100 flex justify-start">
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="text-xs font-semibold text-mrv-muted hover:text-navy-900"
                >
                  ← Previous Question
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        /* Result Screen */
        <GlassCard className="p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            {isMandatory ? (
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-9 h-9" />
              </div>
            ) : isVoluntary ? (
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-9 h-9" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
            )}

            <Badge
              variant={isMandatory ? 'danger' : isVoluntary ? 'cyan' : 'success'}
              size="lg"
              className="mb-2"
            >
              {isMandatory
                ? 'MRV Registration Mandatory'
                : isVoluntary
                ? 'Voluntary MRV Participation Eligible'
                : 'Exempt / Below Threshold'}
            </Badge>

            <h3 className="text-2xl font-extrabold font-display text-navy-900 mt-2">
              {isMandatory
                ? 'Your Facility is Subject to Mandatory MRV Reporting'
                : isVoluntary
                ? 'Eligible for Voluntary MRV Accreditation'
                : 'No Mandatory MRV Submission Required'}
            </h3>

            <p className="text-xs sm:text-sm text-mrv-muted mt-2 leading-relaxed">
              {isMandatory
                ? 'Based on your designated sector, thermal capacity, and EAD permit classification, your facility must register, submit an approved Monitoring Plan, and submit third-party verified emissions annually by March 31.'
                : isVoluntary
                ? 'While your facility does not breach mandatory thresholds, you may register voluntarily to establish recognized carbon credits and demonstrate sustainability leadership.'
                : 'Your facility falls below the mandatory 25,000 tCO₂e threshold and does not operate within heavy regulated industrial scopes.'}
            </p>
          </div>

          {/* Action Steps Card */}
          <div className="p-6 rounded-2xl bg-primary-50/60 border border-primary-100 space-y-4">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Recommended Next Regulatory Steps:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-navy-800">
                  <strong>Complete Facility Registration:</strong> Submit official operator details, GIS coordinates, and active EAD environmental permit.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-navy-800">
                  <strong>Formulate Monitoring Plan:</strong> Define measurement methodologies (calculation or CEMS) and QA/QC procedures.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-navy-800">
                  <strong>Engage Accredited Verifier:</strong> Appoint an ISO 14065 accredited verifier from the EAD Verifier Registry.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('registration')}
              className="btn-primary text-xs font-bold py-3 px-6 shadow-md"
            >
              <span>Proceed to Facility Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('help')}
              className="btn-secondary text-xs font-bold py-3 px-6"
            >
              View MRV Technical Guidelines
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
