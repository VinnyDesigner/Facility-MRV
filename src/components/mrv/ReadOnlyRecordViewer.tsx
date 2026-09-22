import React, { useState, useMemo } from 'react';
import {
  X,
  Eye,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Building2,
  MapPin,
  Flame,
  Factory,
  Layers,
  Award,
  Download,
  Printer,
  ChevronRight,
  GitCompare,
  History,
  FileCheck2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Check,
  RotateCcw,
  Scale,
  Activity,
  FileSpreadsheet,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info,
  Phone,
  Mail,
  Sliders,
  CheckSquare,
  FileCheck,
} from 'lucide-react';
import { useMRV } from '../../context/MRVContext';
import { ReadOnlyRecordTarget, Submission, Facility, SectionCompletionItem, VersionDiffItem } from '../../types/mrv';

export const ReadOnlyRecordViewer: React.FC = () => {
  const {
    isReadOnlyViewerOpen,
    readOnlyTarget,
    closeReadOnlyViewer,
    activeFacility,
    facilities,
    submissions,
    reportingYear,
    monitoringPlan,
    emissionsData,
    documents,
    workflowState,
    getOverallWorkflowProgress,
  } = useMRV();

  if (!isReadOnlyViewerOpen) return null;

  // Selected Tab inside Level 2 Detail View
  const [activeTab, setActiveTab] = useState<
    | 'registration'
    | 'monitoring-plan'
    | 'annual-emissions'
    | 'verification'
    | 'review-submit'
    | 'checklist'
    | 'documents'
    | 'version-history'
    | 'audit'
  >(
    readOnlyTarget?.initialTab === 'completeness' ? 'checklist' :
    readOnlyTarget?.initialTab === 'comparison' ? 'version-history' :
    readOnlyTarget?.initialTab === 'audit' ? 'audit' :
    readOnlyTarget?.initialTab === 'documents' ? 'documents' :
    'registration'
  );

  // 1. Identify the EXACT target submission and facility
  const targetSubId = readOnlyTarget?.recordId || (readOnlyTarget?.submission as any)?.id;
  const currentSub: Submission = useMemo(() => {
    if (readOnlyTarget?.submission) return readOnlyTarget.submission;
    if (targetSubId) {
      const found = submissions.find((s) => s.id === targetSubId);
      if (found) return found;
    }
    return submissions[0] || {
      id: 'sub-2026-01',
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      facilityCode: activeFacility.facilityCode,
      sector: activeFacility.sector,
      emirate: activeFacility.emirate,
      reportingYear: reportingYear || 2026,
      version: 2,
      submissionType: 'Annual MRV Submission',
      submittedDate: '14 Mar 2026, 11:30 AM',
      status: 'Under Review',
      totalEmissions: 1240500,
      tier: activeFacility.tier,
      reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
      documents: [],
      history: [],
      daysPending: 4,
    };
  }, [submissions, targetSubId, readOnlyTarget, activeFacility, reportingYear]);

  // 2. Identify the EXACT target facility
  const currentFac: Facility = useMemo(() => {
    const found = facilities.find((f) => f.id === currentSub.facilityId);
    if (found) return found;
    return activeFacility;
  }, [facilities, currentSub, activeFacility]);

  // Selected Version inside viewer (switches between historical and active version)
  const [selectedVersion, setSelectedVersion] = useState<number>(
    readOnlyTarget?.version || currentSub.version || 1
  );

  // Computed Submission-Specific Progress
  const getRecordProgress = (status: string) => {
    switch (status) {
      case 'Draft':
        return { percent: 20, stage: 'Draft Preparation', stageIndex: 1 };
      case 'Submitted':
        return { percent: 50, stage: 'Transmitted to EAD / Verifier', stageIndex: 2 };
      case 'Pending Verification':
      case 'Verification In Progress':
        return { percent: 65, stage: 'Third-Party Verification Audit', stageIndex: 3 };
      case 'Correction Required':
      case 'Correction Requested':
        return { percent: 60, stage: 'Active 30-Day Correction Window', stageIndex: 4 };
      case 'Under Review':
      case 'Under EAD Review':
        return { percent: 80, stage: 'EAD Regulatory Evaluation', stageIndex: 4 };
      case 'Approved':
      case 'Approved / Registered':
      case 'Approved / Accepted':
      case 'Registered':
        return { percent: 100, stage: 'Accepted & Certified', stageIndex: 5 };
      case 'Rejected':
        return { percent: 40, stage: 'Application Rejected', stageIndex: 1 };
      default:
        return { percent: 60, stage: 'In Progress', stageIndex: 2 };
    }
  };

  const currentStatus = (currentSub.status || readOnlyTarget?.status || 'Under Review') as string;
  const progressInfo = getRecordProgress(currentStatus);
  const isCorrectionRequired = currentStatus.includes('Correction');
  const isApproved = currentStatus.includes('Approved') || currentStatus.includes('Registered') || currentStatus.includes('Accepted');

  // Submitter & Reviewer info specific to this submission
  const submittedBy = currentSub.history?.[0]?.user || currentFac.contactPerson?.name || readOnlyTarget?.submittedBy || 'Facility Compliance Lead';
  const submittedDate = currentSub.submittedDate || '14 Mar 2026, 11:30 AM';
  const reviewerName = currentSub.reviewerName || (currentSub.status === 'Draft' ? 'Pending Assignment' : 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)');
  const reviewComments = currentSub.correctionComments || readOnlyTarget?.reviewComments || (
    isCorrectionRequired
      ? 'Please provide revised Net Calorific Value (NCV) chromatographic laboratory reports for natural gas firing header FT-302, and reconcile monthly flare flow meter calibration logs.'
      : isApproved
      ? 'All operational parameters, calculation factors, and third-party verification statements comply with Abu Dhabi Subnational Heavy Industry MRV Guidelines.'
      : 'Submission undergoing technical compliance check against subnational sector benchmarks.'
  );

  // Facility and Sector specific emissions breakdown
  const emissionBreakdown = useMemo(() => {
    const total = currentSub.totalEmissions || 1240500;
    if (currentFac.sector === 'IPPU') {
      return {
        total,
        combustion: Math.round(total * 0.52),
        process: Math.round(total * 0.42),
        fugitive: Math.round(total * 0.06),
        scope2: Math.round(total * 0.05),
      };
    }
    if (currentFac.sector === 'Waste') {
      return {
        total,
        combustion: Math.round(total * 0.85),
        process: Math.round(total * 0.08),
        fugitive: Math.round(total * 0.07),
        scope2: Math.round(total * 0.04),
      };
    }
    // Energy / Default
    return {
      total,
      combustion: Math.round(total * 0.954),
      process: Math.round(total * 0.031),
      fugitive: Math.round(total * 0.015),
      scope2: Math.round(total * 0.034),
    };
  }, [currentSub, currentFac]);

  // Production streams specific to this facility
  const facilityStreams = useMemo(() => {
    if (currentFac.sector === 'IPPU' && currentFac.id === 'fac-2') {
      return [
        { id: 'PS-DRI-01', name: 'Direct Reduced Iron (DRI) Kiln 1 & 2', throughput: '1,800,000', unit: 'Metric Tons DRI / Year', device: 'Coriolis Mass Gas Meter FT-401' },
        { id: 'PS-EAF-02', name: 'Electric Arc Furnace Melting Shop', throughput: '1,400,000', unit: 'Metric Tons Liquid Steel / Year', device: 'Continuous CEMS & O₂ Analyzer' },
        { id: 'PS-RF-03', name: 'Rolling Mill Reheating Furnace', throughput: '320,000', unit: 'MT Finished Steel / Year', device: 'Ultrasonic Flowmeter FT-205' },
      ];
    }
    if (currentFac.sector === 'IPPU' && currentFac.id === 'fac-3') {
      return [
        { id: 'PS-ETH-01', name: 'Ethylene Steam Cracking Furnaces F101-108', throughput: '1,500,000', unit: 'Metric Tons Ethylene / Year', device: 'Online Gas Chromatograph GC-201' },
        { id: 'PS-POL-02', name: 'Polyolefin Polymerization Reactor Train', throughput: '2,850,000', unit: 'MT Polyethylene / Year', device: 'Mass Balance Feed Flowmeter' },
        { id: 'PS-FLR-03', name: 'Elevated Flare Header & Acid Gas Incinerator', throughput: '82,000,000', unit: 'Nm³ / Year Gas', device: 'Optical Flare Gas Velocity Meter' },
      ];
    }
    if (currentFac.sector === 'Waste') {
      return [
        { id: 'PS-INC-01', name: 'Municipal Solid Waste Grate Incinerator Unit 1 & 2', throughput: '540,000', unit: 'Tons Waste / Year', device: 'Continuous Weight Belt & Flue CEMS' },
        { id: 'PS-ASH-02', name: 'Bottom Ash & Flue Gas Treatment Stream', throughput: '85,000', unit: 'Tons Ash / Year', device: 'Fiscal Truck Scale & Sampling Station' },
      ];
    }
    // Energy / Al Noor
    return [
      { id: 'ps-1', name: 'High-Pressure Steam Header 1', throughput: '2,840,000', unit: 'Metric Tons / Year', device: 'Ultrasonic Flowmeter FT-101 (Calibrated Q4 2025)' },
      { id: 'ps-2', name: 'Gas Turbine Power Generation Block (GT-1, GT-2)', throughput: '1,040', unit: 'MW Net Output', device: 'Revenue-Grade Digital Power Meter (Class 0.2s)' },
      { id: 'ps-3', name: 'Auxiliary Natural Gas Firing Header', throughput: '184,500,000', unit: 'Nm³ / Year Natural Gas', device: selectedVersion === 1 ? 'Orifice Plate FT-301' : 'Coriolis Mass Flowmeter FT-302' },
    ];
  }, [currentFac, selectedVersion]);

  // Documents belonging ONLY to this specific submission / facility
  const submissionDocuments = useMemo(() => {
    const list = currentSub.documents && currentSub.documents.length > 0
      ? currentSub.documents
      : documents.filter((d) => d.facilityId === currentFac.id);

    if (list.length === 0) {
      return [
        {
          name: `${currentFac.facilityCode}_Annual_MRV_Report_v${selectedVersion}.pdf`,
          type: 'Annual MRV Report Package',
          uploadedBy: submittedBy,
          date: submittedDate,
          size: '3.6 MB',
          hash: 'sha256:8b4092d1...c98',
        },
        {
          name: `${currentFac.facilityCode}_Verification_Statement.pdf`,
          type: 'Third-Party Verification Statement',
          uploadedBy: currentSub.verifierName || 'Accredited Verifier',
          date: submittedDate,
          size: '1.9 MB',
          hash: 'sha256:7f83b165...e12',
        },
      ];
    }

    return list.map((doc: any) => ({
      name: doc.fileName || doc.title,
      type: doc.fileType || doc.category || 'Regulatory Submission Doc',
      uploadedBy: doc.author || submittedBy,
      date: doc.uploadDate || submittedDate,
      size: doc.fileSize || '2.8 MB',
      hash: doc.checksum || 'sha256:verified',
    }));
  }, [currentSub, currentFac, documents, selectedVersion, submittedBy, submittedDate]);

  // Audit Events belonging ONLY to this specific submission
  const submissionAuditHistory = useMemo(() => {
    if (currentSub.history && currentSub.history.length > 0) {
      return currentSub.history;
    }
    return [
      {
        id: 'aud-gen-1',
        timestamp: currentSub.submittedDate,
        user: submittedBy,
        role: 'Facility Operator',
        action: `Submitted Annual MRV Report (Version ${currentSub.version})`,
        version: currentSub.version,
        statusAfter: currentSub.status,
      },
    ];
  }, [currentSub, submittedBy]);

  // Version History list belonging ONLY to this submission
  const versionHistoryList = useMemo(() => {
    const history = currentSub.history || [];
    const versionsMap = new Map<number, any>();

    // Scan history events to build version records
    history.forEach((ev) => {
      const v = ev.version || 1;
      if (!versionsMap.has(v) || ev.comments) {
        versionsMap.set(v, {
          version: `v${v}.0`,
          rawVersion: v,
          status: ev.statusAfter,
          submittedBy: ev.user,
          submittedDate: ev.timestamp,
          reviewDecision: ev.statusAfter === 'Approved' ? 'Approved' : ev.statusAfter === 'Correction Required' ? 'Correction Requested' : 'Transmitted',
          reviewer: currentSub.reviewerName || 'EAD Reviewer',
          comments: ev.comments || `Version ${v} statutory transmission`,
          isCurrent: v === currentSub.version,
        });
      }
    });

    if (versionsMap.size === 0) {
      versionsMap.set(currentSub.version || 1, {
        version: `v${currentSub.version || 1}.0`,
        rawVersion: currentSub.version || 1,
        status: currentSub.status,
        submittedBy,
        submittedDate,
        reviewDecision: currentSub.status,
        reviewer: reviewerName,
        comments: reviewComments,
        isCurrent: true,
      });
    }

    return Array.from(versionsMap.values()).sort((a, b) => b.rawVersion - a.rawVersion);
  }, [currentSub, submittedBy, submittedDate, reviewerName, reviewComments]);

  // Section Completeness Checklist Data
  const sectionChecklist: SectionCompletionItem[] = [
    {
      id: 'sec-reg',
      title: '1. Facility & Operator Registration Profile',
      category: 'Stage 1: Registration',
      isComplete: true,
      requiredFieldsCount: 22,
      completedFieldsCount: 22,
      notes: `Trade license ${currentFac.tradeLicense}, environmental permit ${currentFac.permitNumber}, and boundary GPS coordinates verified.`,
    },
    {
      id: 'sec-mp-streams',
      title: '2. Monitoring Plan & Production Source Streams',
      category: 'Stage 2: Monitoring Plan',
      isComplete: true,
      requiredFieldsCount: 18,
      completedFieldsCount: 18,
      notes: `${facilityStreams.length} production streams mapped to calibrated flow meters with Tier ${currentFac.tier.slice(-1)} accuracy uncertainty margins.`,
    },
    {
      id: 'sec-mp-qa',
      title: '3. QA/QC & Data Management Procedures',
      category: 'Stage 2: Monitoring Plan',
      isComplete: true,
      requiredFieldsCount: 12,
      completedFieldsCount: 12,
      notes: 'Quality Assurance, Internal Review, and 10-Year Encrypted Archival procedures active.',
    },
    {
      id: 'sec-mp-mitigation',
      title: '4. Mitigation Measures & Action Plans',
      category: 'Stage 2: Monitoring Plan',
      isComplete: true,
      requiredFieldsCount: 6,
      completedFieldsCount: 6,
      notes: 'Active carbon reduction projects and energy efficiency baseline models recorded.',
    },
    {
      id: 'sec-em-combustion',
      title: '5. Annual Stationary Combustion & Process Emissions (Scope 1)',
      category: 'Stage 3: Annual Emissions',
      isComplete: currentSub.status !== 'Draft',
      requiredFieldsCount: 14,
      completedFieldsCount: currentSub.status !== 'Draft' ? 14 : 6,
      notes: `${emissionBreakdown.combustion.toLocaleString()} tCO₂e combustion + ${emissionBreakdown.process.toLocaleString()} tCO₂e process calculated with certified emission factors.`,
    },
    {
      id: 'sec-em-scope2',
      title: '6. Indirect Electricity & Steam Emissions (Scope 2)',
      category: 'Stage 3: Annual Emissions',
      isComplete: currentSub.status !== 'Draft',
      requiredFieldsCount: 6,
      completedFieldsCount: currentSub.status !== 'Draft' ? 6 : 2,
      notes: `${emissionBreakdown.scope2.toLocaleString()} tCO₂e grid power verified against utility invoices (0.4120 tCO₂e/MWh).`,
    },
    {
      id: 'sec-ver-statement',
      title: '7. Third-Party Verification Statement & Opinion',
      category: 'Stage 4: Verification',
      isComplete: currentSub.status === 'Approved' || currentSub.status === 'Under Review' || currentSub.status === 'Submitted',
      requiredFieldsCount: 8,
      completedFieldsCount: currentSub.status === 'Approved' || currentSub.status === 'Under Review' ? 8 : 4,
      notes: `${currentSub.verifierName || 'Bureau Veritas'} ${currentSub.verifierOpinion || 'Reasonable Assurance'} opinion statement attached.`,
    },
    {
      id: 'sec-review-submit',
      title: '8. Review, Sign-off & Statutory Declarations',
      category: 'Stage 5: Review & Submit',
      isComplete: currentSub.status !== 'Draft',
      requiredFieldsCount: 6,
      completedFieldsCount: currentSub.status !== 'Draft' ? 6 : 2,
      notes: `Statutory compliance declaration executed by ${submittedBy}.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-900/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white w-full max-w-7xl max-h-[94vh] rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden text-slate-800">
        
        {/* =================================================================== */}
        {/* LEVEL 2 HEADER & SUBMISSION METADATA                                */}
        {/* =================================================================== */}
        <div className="bg-gradient-to-r from-[#003666] via-[#004B87] to-[#005D9E] text-white p-4 sm:p-5 flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                <Eye className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-cyan-200">
                    READ-ONLY DOSSIER (LEVEL 2)
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    {currentFac.facilityCode} • {currentFac.name}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-white mt-0.5">
                  Submission Dossier: {currentSub.id}
                </h2>
              </div>
            </div>

            {/* Version Switcher, Version History, Print & Close */}
            <div className="flex items-center gap-2">
              {/* Version Selector */}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-xs font-semibold">
                <span className="text-white/70">Version:</span>
                <select
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(Number(e.target.value))}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  {versionHistoryList.map((v) => (
                    <option key={v.rawVersion} value={v.rawVersion} className="text-slate-800">
                      {v.version} {v.isCurrent ? '(Current)' : '(Historical)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Version History Tab Link */}
              <button
                onClick={() => setActiveTab('version-history')}
                title="View Version History for this record"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>Version History</span>
              </button>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                title="Print Complete Submission Dossier"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={closeReadOnlyViewer}
                title="Close Read-Only View"
                className="p-2 rounded-xl bg-white/15 hover:bg-rose-500 hover:text-white text-white/90 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Metadata Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-3.5 border-t border-white/15 text-xs">
            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Facility Name & ID</p>
              <p className="font-bold text-white truncate mt-0.5">{currentFac.name}</p>
              <p className="text-[10px] text-cyan-200 font-mono">{currentFac.facilityCode}</p>
            </div>

            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Submission ID & Version</p>
              <p className="font-mono font-bold text-white mt-0.5">{currentSub.id}</p>
              <p className="text-[10px] text-white/70">Version v{selectedVersion}.0 • RY {currentSub.reportingYear}</p>
            </div>

            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Review Status</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${
                  isApproved ? 'bg-emerald-400' :
                  isCorrectionRequired || currentStatus === 'Reverted' ? 'bg-amber-400 animate-ping' :
                  currentStatus === 'Rejected' ? 'bg-rose-400' :
                  'bg-cyan-400'
                }`} />
                <p className="font-bold text-white text-xs">{currentStatus}</p>
              </div>
              <p className="text-[10px] text-white/70">{currentFac.sector} ({currentSub.tier})</p>
            </div>

            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Submitted By & Date</p>
              <p className="font-bold text-white truncate mt-0.5">{submittedBy}</p>
              <p className="text-[10px] text-white/70 truncate">{submittedDate}</p>
            </div>

            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Current Reviewer / Role</p>
              <p className="font-bold text-white truncate mt-0.5">{reviewerName}</p>
              <p className="text-[10px] text-white/70 truncate">EAD Regulatory Inspector</p>
            </div>

            <div>
              <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">Workflow Stage & Progress</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-300 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressInfo.percent}%` }}
                  />
                </div>
                <span className="font-bold text-cyan-200 text-xs">{progressInfo.percent}%</span>
              </div>
              <p className="text-[10px] text-white/70 truncate mt-0.5">{progressInfo.stage}</p>
            </div>
          </div>

          {/* 6-Stage Workflow Progress Tracker */}
          <div className="mt-3.5 pt-3 border-t border-white/10 hidden md:flex items-center justify-between text-[11px]">
            {[
              { num: 1, label: 'Registration', done: true, current: false },
              { num: 2, label: 'Monitoring Plan', done: currentSub.status !== 'Draft', current: currentSub.status === 'Draft' },
              { num: 3, label: 'Annual Emission Data', done: currentSub.status !== 'Draft', current: false },
              { num: 4, label: 'Verification', done: isApproved || currentSub.status === 'Under Review' || currentSub.status === 'Submitted', current: String(currentSub.status).includes('Verification') },
              { num: 5, label: 'EAD Final Review', done: isApproved, current: currentSub.status === 'Under Review' || currentSub.status === 'Correction Required' },
              { num: 6, label: 'Accepted', done: isApproved, current: false },
            ].map((st, idx) => {
              const isCorrectionStage = isCorrectionRequired && st.num === 5;
              return (
                <div key={st.num} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    st.done ? 'bg-cyan-400 text-[#003666]' :
                    isCorrectionStage ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 animate-pulse' :
                    st.current ? 'bg-white text-[#004B87] ring-2 ring-cyan-300 animate-pulse' :
                    'bg-white/20 text-white/60'
                  }`}>
                    {st.done ? '✓' : st.num}
                  </div>
                  <span className={st.done ? 'text-white font-semibold' : isCorrectionStage ? 'text-amber-200 font-bold' : st.current ? 'text-cyan-200 font-bold' : 'text-white/50'}>
                    {st.label}
                  </span>
                  {idx < 5 && <ChevronRight className="w-3.5 h-3.5 text-white/30 ml-2" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* STATUS-AWARE ALERT BANNER                                           */}
        {/* =================================================================== */}
        {isCorrectionRequired ? (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-amber-900">
                  Correction Required — Action Required by Facility Operator
                </p>
                <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold text-[10px]">
                  30-Day Window Active (Due {currentSub.correctionDueDate || '11 Apr 2026'})
                </span>
              </div>
              <p className="text-amber-800 mt-1 leading-relaxed">
                <span className="font-semibold">Reviewer Remarks:</span> "{reviewComments}"
              </p>
            </div>
          </div>
        ) : isApproved ? (
          <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-emerald-900">Official Compliance Certificate Issued</span>
              <span className="text-emerald-700 hidden sm:inline">• Annual MRV Submission verified and certified by EAD.</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Permanently Archived
            </span>
          </div>
        ) : (
          <div className="bg-slate-50 border-b border-slate-200/80 px-5 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#004B87]" />
              <span className="text-slate-500 font-medium">Workflow Stage:</span>
              <span className="font-bold text-slate-800">{progressInfo.stage}</span>
              <span className="text-slate-400 hidden sm:inline">• {currentFac.name} ({currentSub.id})</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#004B87] border border-blue-200">
              {currentStatus}
            </span>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. DOSSIER SUB-TABS (DRILL-DOWN LEVEL 2)                             */}
        {/* =================================================================== */}
        <div className="flex items-center border-b border-slate-200 px-4 bg-white text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'registration', label: '1. Facility Registration', icon: Building2 },
            { id: 'monitoring-plan', label: '2. Monitoring Plan', icon: Factory },
            { id: 'annual-emissions', label: '3. Annual Emissions', icon: Flame },
            { id: 'verification', label: '4. Verification', icon: ShieldCheck },
            { id: 'review-submit', label: '5. Review & Submit', icon: FileCheck },
            { id: 'checklist', label: 'Section Checklist', icon: CheckCircle2 },
            { id: 'documents', label: `Supporting Files (${submissionDocuments.length})`, icon: FileSpreadsheet },
            { id: 'version-history', label: 'Version History', icon: GitCompare },
            { id: 'audit', label: `Audit Trail (${submissionAuditHistory.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 flex items-center gap-1.5 border-b-2 font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#004B87] text-[#004B87] bg-blue-50/40'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#004B87]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* 3. COMPLETE SUBMITTED DATA (BOUND TO SELECTED SUBMISSION)           */}
        {/* =================================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-[18px] bg-slate-50/60">

          {/* --------------------------------------------------------------- */}
          {/* TAB 1: REGISTRATION DATA                                        */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'registration' && (
            <div className="space-y-[18px]">
              {/* Operator Details */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.1 Operator Details
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Statutory Record
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Operator Company Name</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.operatorName}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Commercial License Number</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.tradeLicense}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Registered Head Office Address</label>
                    <p className="font-medium text-slate-700 mt-0.5">{currentFac.address}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Country of Incorporation</label>
                    <p className="font-bold text-slate-800 mt-0.5">United Arab Emirates</p>
                  </div>
                </div>
              </div>

              {/* Facility Details & Location */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.2 Facility Details & Location
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Location Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Facility Name</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.name}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Facility ID</label>
                    <p className="font-mono font-bold text-[#004B87] mt-0.5">{currentFac.facilityCode}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Sector & Tier</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.sector} • {currentFac.tier}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Emirate</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.emirate}, UAE</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Coordinates (GPS)</label>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{currentFac.coordinates.lat}° N, {currentFac.coordinates.lng}° E</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Physical Address</label>
                    <p className="font-medium text-slate-700 mt-0.5">{currentFac.address}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-[11px] text-slate-400 font-semibold block">Facility Description</label>
                    <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      {currentFac.primaryActivity}. Operating under compliance with Environment Agency – Abu Dhabi MRV statutory guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Activities & Products */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.3 Activities & Products
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Primary Activity</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.primaryActivity}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Secondary Activity</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.secondaryActivities}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Main Products</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.products}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Design Capacity</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.productionCapacity}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Actual Production</label>
                    <p className="font-bold text-[#004B87] mt-0.5">{currentFac.actualProduction}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Applicable MRV Tier</label>
                    <p className="font-bold text-indigo-700 mt-0.5">{currentFac.tier} (Above Statutory Emission Threshold)</p>
                  </div>
                </div>
              </div>

              {/* Environmental Permit */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.4 Environmental Permit
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Permit Number</label>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{currentFac.permitNumber}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Permit Type</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentFac.permitType}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Issue Date</label>
                    <p className="font-medium text-slate-700 mt-0.5">{currentFac.permitIssueDate}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Expiry Date</label>
                    <p className="font-medium text-slate-700 mt-0.5">{currentFac.permitExpiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Contact Persons */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.5 Contact Persons
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-[#004B87] uppercase tracking-wider">Primary Contact Person</span>
                    <p className="font-bold text-slate-900 text-sm">{currentFac.contactPerson.name}</p>
                    <p className="text-slate-600 font-medium">{currentFac.contactPerson.position}</p>
                    <div className="pt-2 space-y-1 text-slate-600">
                      <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentFac.contactPerson.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentFac.contactPerson.phone}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Environmental Manager</span>
                    <p className="font-bold text-slate-900 text-sm">{currentFac.environmentalManager.name}</p>
                    <p className="text-slate-600 font-medium">Head of HSE & Environmental Compliance</p>
                    <div className="pt-2 space-y-1 text-slate-600">
                      <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentFac.environmentalManager.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentFac.environmentalManager.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Renewal / Report a Change */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1.6 Annual Renewal / Report a Change
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Reporting Year</label>
                    <p className="font-bold text-slate-800 mt-0.5">{currentSub.reportingYear}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Renewal Effective Date</label>
                    <p className="font-bold text-slate-800 mt-0.5">01-Jan-{currentSub.reportingYear}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Material Changes Reported</label>
                    <p className="font-bold text-emerald-700 mt-0.5">No Material Changes (Operating under valid permit)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 2: MONITORING PLAN                                          */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'monitoring-plan' && (
            <div className="space-y-[18px]">
              {/* Production Streams */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2.1 Primary Production Streams & Emission Sources
                  </h3>
                  <span className="text-xs font-bold text-[#004B87]">{facilityStreams.length} Streams Active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                        <th className="py-2.5 px-3 min-w-[80px]" title="Stream ID">Stream ID</th>
                        <th className="py-2.5 px-3 min-w-[180px]" title="Stream / Header Name">Stream / Header Name</th>
                        <th className="py-2.5 px-3 min-w-[140px]" title="Annual Throughput">Annual Throughput</th>
                        <th className="py-2.5 px-3 min-w-[80px]" title="Unit">Unit</th>
                        <th className="py-2.5 px-3 min-w-[240px]" title="Measuring Device & Calibration Reference">Measuring Device & Calibration Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {facilityStreams.map((stream) => (
                        <tr key={stream.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]" title={stream.id}>{stream.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900" title={stream.name}>{stream.name}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800" title={stream.throughput}>{stream.throughput}</td>
                          <td className="py-2.5 px-3 text-slate-600" title={stream.unit}>{stream.unit}</td>
                          <td className="py-2.5 px-3 text-slate-700" title={stream.device}>{stream.device}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measurement & Calibration */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2.2 Measurement Equipment & Calibration
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">GHG Monitoring Methodology</label>
                    <p className="font-semibold text-slate-800">Calculation-based (IPCC 2006 Tier {currentFac.tier.slice(-1)})</p>
                    <p className="text-[11px] text-slate-600 mt-1">ISO 14064-1:2018 & Abu Dhabi Heavy Industry Technical MRV Guidelines</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Calibration Frequency & QA/QC</label>
                    <p className="font-semibold text-slate-800">Quarterly Calibration by ISO 17025 Accredited Calibration Lab</p>
                    <p className="text-[11px] text-slate-600 mt-1">10-Year Archival retention with encrypted time-series logging</p>
                  </div>
                </div>
              </div>

              {/* Mitigation Measures */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    2.3 Mitigation Measures & Action Plans
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                        <th className="py-2.5 px-3 min-w-[200px]" title="Project Name">Project Name</th>
                        <th className="py-2.5 px-3 min-w-[120px]" title="Status">Status</th>
                        <th className="py-2.5 px-3 min-w-[140px]" title="Expected Reduction">Expected Reduction</th>
                        <th className="py-2.5 px-3 min-w-[160px]" title="MRV Methodology">MRV Methodology</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {monitoringPlan.mitigationMeasures.map((mit) => (
                        <tr key={mit.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-bold text-slate-900" title={mit.name}>{mit.name}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mit.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`} title={`${mit.status} (${mit.implementationYear})`}>
                              {mit.status} ({mit.implementationYear})
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700" title={`${mit.expectedReduction.toLocaleString()} tCO₂e/yr`}>{mit.expectedReduction.toLocaleString()} tCO₂e/yr</td>
                          <td className="py-2.5 px-3 text-slate-600" title={mit.methodology}>{mit.methodology}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 3: ANNUAL EMISSION DATA                                     */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'annual-emissions' && (
            <div className="space-y-[18px]">
              {/* Summary Metrics */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      3.1 Annual GHG Emissions (Reporting Year {currentSub.reportingYear})
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold mr-1.5">Total Emissions:</span>
                    <span className="text-base font-extrabold text-[#004B87]">
                      {emissionBreakdown.total.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-800 uppercase">Stationary Combustion</p>
                    <p className="text-base font-extrabold text-blue-900 mt-1">
                      {emissionBreakdown.combustion.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-blue-600 mt-0.5">tCO₂e (Scope 1)</p>
                  </div>
                  <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-800 uppercase">Industrial Processes</p>
                    <p className="text-base font-extrabold text-indigo-900 mt-1">
                      {emissionBreakdown.process.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-indigo-600 mt-0.5">tCO₂e (Scope 1)</p>
                  </div>
                  <div className="p-3.5 bg-cyan-50/70 rounded-xl border border-cyan-100">
                    <p className="text-[10px] font-bold text-cyan-800 uppercase">Fugitive & Flaring</p>
                    <p className="text-base font-extrabold text-cyan-900 mt-1">
                      {emissionBreakdown.fugitive.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-cyan-600 mt-0.5">tCO₂e (Scope 1)</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase">Scope 2 (Electricity)</p>
                    <p className="text-base font-extrabold text-emerald-900 mt-1">
                      {emissionBreakdown.scope2.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">tCO₂e (Grid Power)</p>
                  </div>
                </div>
              </div>

              {/* Calculation Breakdown Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    3.2 Emission Calculations Breakdown
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                        <th className="py-2.5 px-3 min-w-[200px]" title="Emission Source / Fuel Stream">Emission Source / Fuel Stream</th>
                        <th className="py-2.5 px-3 min-w-[170px]" title="Activity Data Consumption">Activity Data Consumption</th>
                        <th className="py-2.5 px-3 min-w-[150px]" title="Net Calorific Value (NCV)">Net Calorific Value (NCV)</th>
                        <th className="py-2.5 px-3 min-w-[160px]" title="Emission Factor">Emission Factor</th>
                        <th className="py-2.5 px-3 text-right min-w-[120px]" title="Calculated tCO₂e">Calculated tCO₂e</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900" title="Stationary Fuel Combustion">Stationary Fuel Combustion</td>
                        <td className="py-2.5 px-3 font-mono text-slate-800" title="Primary Fuel Stream">Primary Fuel Stream</td>
                        <td className="py-2.5 px-3 text-slate-700" title="38.45 MJ/Nm³">38.45 MJ/Nm³</td>
                        <td className="py-2.5 px-3 text-slate-700" title="56.10 tCO₂/TJ (Tier 2)">56.10 tCO₂/TJ (Tier 2)</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#004B87]" title={`${emissionBreakdown.combustion.toLocaleString()} tCO₂e`}>{emissionBreakdown.combustion.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900" title="Process & Calcination Operations">Process & Calcination Operations</td>
                        <td className="py-2.5 px-3 font-mono text-slate-800" title="Feedstock Consumption">Feedstock Consumption</td>
                        <td className="py-2.5 px-3 text-slate-400" title="N/A (Process)">N/A (Process)</td>
                        <td className="py-2.5 px-3 text-slate-700" title="IPCC Sector Model">IPCC Sector Model</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#004B87]" title={`${emissionBreakdown.process.toLocaleString()} tCO₂e`}>{emissionBreakdown.process.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-900" title="Fugitive & Flaring Streams">Fugitive & Flaring Streams</td>
                        <td className="py-2.5 px-3 font-mono text-slate-800" title="Continuous Metering">Continuous Metering</td>
                        <td className="py-2.5 px-3 text-slate-700" title="37.80 MJ/Nm³">37.80 MJ/Nm³</td>
                        <td className="py-2.5 px-3 text-slate-700" title="Tier 1 Factor">Tier 1 Factor</td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#004B87]" title={`${emissionBreakdown.fugitive.toLocaleString()} tCO₂e`}>{emissionBreakdown.fugitive.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 4: VERIFICATION                                            */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'verification' && (
            <div className="space-y-[18px]">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      4.1 Third-Party Verification Data
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {currentSub.verifierOpinion || 'Reasonable Assurance'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Accredited Verifier</label>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{currentSub.verifierName || 'Bureau Veritas Abu Dhabi'}</p>
                    <p className="text-[10px] text-slate-500 font-mono">ENAS Accreditation # ENAS-CB-042</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Verification Opinion</label>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5">{currentSub.verifierOpinion || 'Unmodified (Positive)'}</p>
                    <p className="text-[10px] text-slate-500">ISO 14064-3 Compliance</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Materiality Standard</label>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">5% Materiality Threshold</p>
                    <p className="text-[10px] text-slate-500">Zero material misstatements identified</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 5: REVIEW, SUBMIT & APPROVAL                                */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'review-submit' && (
            <div className="space-y-[18px]">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#004B87]" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      5.1 Review & Submit Information
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Submitted By</label>
                    <p className="font-bold text-slate-900 mt-0.5">{submittedBy}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Submission Timestamp</label>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{submittedDate}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold block">Review Determination</label>
                    <p className="font-bold text-[#004B87] mt-0.5">{currentStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 6: SECTION CHECKLIST                                        */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'checklist' && (
            <div className="space-y-[18px]">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Section Validation Checklist</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Validation scorecard for {currentFac.name} ({currentSub.id}).
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                  8 / 8 Sections Validated
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {sectionChecklist.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">{item.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1">{item.notes}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                      {item.completedFieldsCount} / {item.requiredFieldsCount} Fields
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 7: SUPPORTING DOCUMENTS (BELONGING ONLY TO THIS SUBMISSION)  */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'documents' && (
            <div className="space-y-[18px]">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Supporting Files for {currentSub.id}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Documents attached specifically to this submission version.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#004B87]">{submissionDocuments.length} Files</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                      <th className="py-2.5 px-4 min-w-[200px]" title="Document Name">Document Name</th>
                      <th className="py-2.5 px-3 min-w-[100px]" title="Type">Type</th>
                      <th className="py-2.5 px-3 min-w-[120px]" title="Uploaded By">Uploaded By</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Upload Date">Upload Date</th>
                      <th className="py-2.5 px-3 min-w-[90px]" title="File Size">File Size</th>
                      <th className="py-2.5 px-4 text-right min-w-[100px]" title="Action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {submissionDocuments.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-bold text-slate-800 flex items-center gap-2" title={doc.name}>
                          <FileText className="w-4 h-4 text-[#004B87] shrink-0" />
                          <span className="truncate max-w-xs">{doc.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600" title={doc.type}>{doc.type}</td>
                        <td className="py-2.5 px-3 text-slate-700" title={doc.uploadedBy}>{doc.uploadedBy}</td>
                        <td className="py-2.5 px-3 text-slate-500" title={doc.date}>{doc.date}</td>
                        <td className="py-2.5 px-3 text-slate-600" title={doc.size}>{doc.size}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => alert(`Downloading ${doc.name}`)}
                            className="text-[#004B87] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                            title={`Download ${doc.name}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 8: VERSION HISTORY (BELONGING ONLY TO THIS SUBMISSION)      */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'version-history' && (
            <div className="space-y-[18px]">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Version History for {currentSub.id}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Historical versions, reviewer determinations, and decision remarks for this record.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#004B87]">{versionHistoryList.length} Versions</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Version">Version</th>
                      <th className="py-2.5 px-3 min-w-[120px]" title="Status">Status</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Submitted By">Submitted By</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Submitted Date">Submitted Date</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Review Decision">Review Decision</th>
                      <th className="py-2.5 px-3 min-w-[120px]" title="Reviewer">Reviewer</th>
                      <th className="py-2.5 px-3 min-w-[180px]" title="Reviewer Comments">Reviewer Comments</th>
                      <th className="py-2.5 px-3 text-right min-w-[80px]" title="Action">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {versionHistoryList.map((v) => (
                      <tr key={v.version} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-mono font-bold text-[#004B87]" title={v.version}>{v.version}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            v.status === 'Correction Required' ? 'bg-amber-100 text-amber-800' :
                            'bg-teal-100 text-teal-800'
                          }`} title={v.status}>
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-800" title={v.submittedBy}>{v.submittedBy}</td>
                        <td className="py-3 px-3 text-slate-600" title={v.submittedDate}>{v.submittedDate}</td>
                        <td className="py-3 px-3 font-bold text-slate-700" title={v.reviewDecision}>{v.reviewDecision}</td>
                        <td className="py-3 px-3 text-slate-700" title={v.reviewer}>{v.reviewer}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={v.comments}>{v.comments}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedVersion(v.rawVersion)}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                              selectedVersion === v.rawVersion
                                ? 'bg-[#004B87] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title={selectedVersion === v.rawVersion ? 'Currently Viewing' : `Select Version ${v.version}`}
                          >
                            {selectedVersion === v.rawVersion ? 'Viewing' : 'Select'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------- */}
          {/* TAB 9: AUDIT TRAIL (BELONGING ONLY TO THIS SUBMISSION)          */}
          {/* --------------------------------------------------------------- */}
          {activeTab === 'audit' && (
            <div className="space-y-[18px]">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">Audit Trail for {currentSub.id}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Immutable event ledger for {currentFac.name} ({currentSub.id}).
                  </p>
                </div>
                <span className="text-xs font-bold text-[#004B87]">{submissionAuditHistory.length} Events</span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {submissionAuditHistory.map((ev, idx) => (
                    <div key={ev.id || idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#004B87] ring-4 ring-white border-2 border-white shadow-sm" />
                      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{ev.action}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">{ev.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-[#004B87]">{ev.user}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-bold">
                            {ev.role}
                          </span>
                        </div>
                        {ev.comments && (
                          <p className="text-xs text-slate-600 mt-2 bg-white p-2.5 rounded-lg border border-slate-200/60 leading-relaxed italic">
                            "{ev.comments}"
                          </p>
                        )}
                        <div className="mt-2 text-right">
                          <span className="text-[10px] font-bold text-slate-400">Resulting Status: </span>
                          <span className="text-[10px] font-bold text-slate-800">{ev.statusAfter}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* =================================================================== */}
        {/* 4. FOOTER ACTIONS                                                   */}
        {/* =================================================================== */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Abu Dhabi EAD MRV Compliance Record • {currentSub.id}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('version-history')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span>Version History</span>
            </button>
            <button
              onClick={closeReadOnlyViewer}
              className="px-5 py-2 bg-[#004B87] hover:bg-[#003a6b] text-white rounded-xl font-bold transition-colors shadow-sm cursor-pointer"
            >
              Close View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
