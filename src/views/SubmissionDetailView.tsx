import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Factory,
  Flame,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  History,
  FileSpreadsheet,
  Download,
  Mail,
  Phone,
  FileText,
  Check,
  ChevronRight,
  Info,
  Calendar,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { Submission, Facility, SubmissionStatus } from '../types/mrv';

export const SubmissionDetailView: React.FC = () => {
  const {
    activeFacility,
    facilities,
    submissions,
    reportingYear,
    monitoringPlan,
    documents,
    selectedSubmissionForReview,
    setActiveView,
  } = useMRV();

  // 1. Target Submission (defaults to selectedSubmissionForReview or first submission)
  const currentSub: Submission = useMemo(() => {
    if (selectedSubmissionForReview) return selectedSubmissionForReview;
    return submissions[0] || {
      id: 'sub-2026-01',
      facilityId: activeFacility.id,
      facilityName: activeFacility.name,
      facilityCode: activeFacility.facilityCode,
      sector: activeFacility.sector,
      emirate: activeFacility.emirate,
      reportingYear: reportingYear || 2026,
      version: 3,
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
  }, [selectedSubmissionForReview, submissions, activeFacility, reportingYear]);

  // 2. Target Facility belonging to this submission
  const currentFac: Facility = useMemo(() => {
    const found = facilities.find((f) => f.id === currentSub.facilityId);
    if (found) return found;
    return activeFacility;
  }, [facilities, currentSub, activeFacility]);

  // Selected Version inside Level 2 (switches between historical and active version)
  const [selectedVersion, setSelectedVersion] = useState<number>(currentSub.version || 3);

  useEffect(() => {
    if (currentSub.version) {
      setSelectedVersion(currentSub.version);
    }
  }, [currentSub.id, currentSub.version]);

  // Version-Specific Snapshot Resolver
  const versionSnapshot = useMemo(() => {
    // Version 1 (Initial Statutory Submission)
    if (selectedVersion === 1) {
      const baseEmissions = currentFac.sector === 'IPPU' ? 1820000 : currentFac.sector === 'Waste' ? 245000 : 1235000;
      return {
        versionLabel: 'v1.0 (Initial Submission)',
        rawVersion: 1,
        isLatest: false,
        status: 'Submitted' as SubmissionStatus,
        submittedDate: '15 Feb 2026, 10:00 AM',
        submittedBy: currentFac.contactPerson?.name || 'Abdul Rahman (Facility Compliance Lead)',
        totalEmissions: baseEmissions,
        combustionEmissions: Math.round(baseEmissions * 0.45),
        processEmissions: Math.round(baseEmissions * 0.35),
        fugitiveEmissions: Math.round(baseEmissions * 0.05),
        scope2Emissions: Math.round(baseEmissions * 0.15),
        ncv: '38.10 MJ/kg',
        ef: '56.10 kg CO₂/GJ',
        verifierName: 'Bureau Veritas Abu Dhabi',
        verifierOpinion: 'Satisfactory with Minor Observations',
        verifierAssurance: 'Reasonable Assurance',
        reviewerName: 'EAD Regulatory Desk',
        reviewComments: 'Initial annual transmission. Supplementary documentation requested for Tier 2 calibration logs.',
        isEditable: false,
        hasCorrectionWindow: false,
        isApproved: false,
        isCorrection: false,
        progressStage: 'Initial Technical Review',
        progressPercent: 40,
      };
    }

    // Version 2 (Reverted with 30-Day Resubmission Window)
    if (selectedVersion === 2) {
      const baseEmissions = currentFac.sector === 'IPPU' ? 1835000 : currentFac.sector === 'Waste' ? 248000 : 1238900;
      return {
        versionLabel: 'v2.0 (Resubmission Draft)',
        rawVersion: 2,
        isLatest: false,
        status: 'Correction Required' as SubmissionStatus,
        submittedDate: '01 Mar 2026, 09:45 AM',
        submittedBy: currentFac.contactPerson?.name || 'Abdul Rahman (Facility Compliance Lead)',
        totalEmissions: baseEmissions,
        combustionEmissions: Math.round(baseEmissions * 0.44),
        processEmissions: Math.round(baseEmissions * 0.36),
        fugitiveEmissions: Math.round(baseEmissions * 0.06),
        scope2Emissions: Math.round(baseEmissions * 0.14),
        ncv: '38.25 MJ/kg',
        ef: '56.20 kg CO₂/GJ',
        verifierName: 'Bureau Veritas Abu Dhabi',
        verifierOpinion: 'Verified with Material Modification Request',
        verifierAssurance: 'Reasonable Assurance',
        reviewerName: 'Dr. Fatima Al Nuaimi (EAD Lead Inspector)',
        reviewComments: 'Please attach calibration certificates for optical flare gas velocity meter and detailed ethylene cracking mass balance logs.',
        correctionDueDate: '11 Apr 2026 (30 Days Remaining)',
        isEditable: true,
        hasCorrectionWindow: true,
        isApproved: false,
        isCorrection: true,
        progressStage: 'Correction Window (30 Days)',
        progressPercent: 65,
      };
    }

    // Version 3 (Active / Current Official Submission Snapshot)
    const baseEmissions = currentSub.totalEmissions || 1240500;
    const isApproved = currentSub.status === 'Approved';
    const isCorrection = currentSub.status === 'Correction Required';

    return {
      versionLabel: `v3.0 (${isApproved ? 'Approved Statutory Dossier' : 'Active Transmission'})`,
      rawVersion: 3,
      isLatest: true,
      status: currentSub.status,
      submittedDate: currentSub.submittedDate || '14 Mar 2026, 11:30 AM',
      submittedBy: currentFac.contactPerson?.name || 'Umasri Mavillapally (Senior Compliance Lead)',
      totalEmissions: baseEmissions,
      combustionEmissions: Math.round(baseEmissions * 0.44),
      processEmissions: Math.round(baseEmissions * 0.37),
      fugitiveEmissions: Math.round(baseEmissions * 0.04),
      scope2Emissions: Math.round(baseEmissions * 0.15),
      ncv: '38.40 MJ/kg',
      ef: '56.15 kg CO₂/GJ',
      verifierName: 'DNV GL Climate Services UAE',
      verifierOpinion: 'Unqualified Positive Verification Statement',
      verifierAssurance: 'Reasonable Assurance Level',
      reviewerName: currentSub.reviewerName || 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
      reviewComments: currentSub.correctionComments || (isApproved
        ? 'Statutory MRV Reporting Package conforms with Abu Dhabi Climate Change Regulatory Framework 2026.'
        : 'Currently under formal technical assessment by the EAD Climate Policy & Compliance Division.'),
      correctionDueDate: isCorrection ? (currentSub.correctionDueDate || '19-Aug-2026 (29 days left)') : undefined,
      isEditable: isCorrection,
      hasCorrectionWindow: isCorrection,
      isApproved: isApproved,
      isCorrection: isCorrection,
      progressStage: isApproved ? 'Approved & Certified' : isCorrection ? 'Correction Required' : 'EAD Regulatory Technical Evaluation',
      progressPercent: isApproved ? 100 : isCorrection ? 60 : 80,
    };
  }, [selectedVersion, currentSub, currentFac]);

  // Production Streams for Section 2
  const facilityStreams = useMemo(() => {
    if (currentFac.sector === 'IPPU') {
      return [
        { id: 'STR-01', name: 'Calcination Kiln #1 Natural Gas', throughput: '45,200,000 Nm³', unit: 'Nm³/yr', device: 'Coriolis Mass Flow Meter (FT-101) - Calibrated 12-Jan-2026' },
        { id: 'STR-02', name: 'Raw Limestone Feedstock Calcination', throughput: '1,450,000 Tonnes', unit: 'Tonnes/yr', device: 'Continuous Belt Weigh Scale (BS-204) - Calibrated 18-Jan-2026' },
        { id: 'STR-03', name: 'Clinker Cooler Exhaust Stream', throughput: '1,120,000 Tonnes', unit: 'Tonnes/yr', device: 'Continuous Optical Dust & CO₂ Monitor (CEMS-01)' },
      ];
    }
    if (currentFac.sector === 'Waste') {
      return [
        { id: 'STR-01', name: 'Landfill Biogas Extraction Header', throughput: '14,800,000 Nm³', unit: 'Nm³/yr', device: 'Thermal Mass Flow Meter (FT-W01) - Calibrated 05-Feb-2026' },
        { id: 'STR-02', name: 'Enclosed High-Temp Flare Stack', throughput: '9,200,000 Nm³', unit: 'Nm³/yr', device: 'Ultrasonic Flare Gas Meter (US-FL01) - Calibrated 10-Feb-2026' },
      ];
    }
    return [
      { id: 'STR-01', name: 'Gas Turbine #1 & #2 Fuel Gas Header', throughput: '68,400,000 Nm³', unit: 'Nm³/yr', device: 'Custody Transfer Ultrasonic Flow Meter (FT-GT01) - Calibrated 04-Jan-2026' },
      { id: 'STR-02', name: 'Heat Recovery Steam Generator (HRSG)', throughput: '12,200,000 Nm³', unit: 'Nm³/yr', device: 'Differential Pressure Orifice Meter (DP-102) - Calibrated 15-Jan-2026' },
      { id: 'STR-03', name: 'Emergency Diesel Generators (EDG 1-4)', throughput: '42,000 Litres', unit: 'L/yr', device: 'Positive Displacement Fuel Meter (PD-D01) - Calibrated 20-Jan-2026' },
    ];
  }, [currentFac]);

  // Version History list for Section 5
  const versionHistoryList = useMemo(() => {
    return [
      {
        version: 'v3.0',
        rawVersion: 3,
        status: currentSub.status,
        submittedBy: versionSnapshot.submittedBy,
        submittedDate: currentSub.submittedDate || '14 Mar 2026, 11:30 AM',
        reviewDecision: currentSub.status === 'Approved' ? 'Statutory Compliance Endorsed' : 'Technical Evaluation in Progress',
        comments: currentSub.correctionComments || 'Resubmitted with optical velocity meter calibration certificates.',
        isCurrent: selectedVersion === 3,
      },
      {
        version: 'v2.0',
        rawVersion: 2,
        status: 'Correction Required' as SubmissionStatus,
        submittedBy: 'Umasri Mavillapally (Facility Compliance Lead)',
        submittedDate: '01 Mar 2026, 09:45 AM',
        reviewDecision: 'Reverted for Technical Clarification',
        comments: 'Correction Notice: Please attach calibration certificates for optical flare gas velocity meter.',
        isCurrent: selectedVersion === 2,
      },
      {
        version: 'v1.0',
        rawVersion: 1,
        status: 'Submitted' as SubmissionStatus,
        submittedBy: 'Abdul Rahman (Facility Lead)',
        submittedDate: '15 Feb 2026, 10:00 AM',
        reviewDecision: 'Initial Filing Received',
        comments: 'Initial annual MRV submission for reporting year 2026.',
        isCurrent: selectedVersion === 1,
      },
    ];
  }, [currentSub, versionSnapshot, selectedVersion]);

  // Supporting Documents for Section 5
  const submissionDocuments = useMemo(() => {
    return [
      {
        name: `EAD_MRV_Report_RY2026_${currentFac.facilityCode}_v${selectedVersion}.0.pdf`,
        type: 'Official Statutory Report',
        size: '4.8 MB',
        uploadedBy: versionSnapshot.submittedBy,
        date: versionSnapshot.submittedDate,
      },
      {
        name: `ThirdParty_Verification_Statement_${currentFac.facilityCode}_v${selectedVersion}.0.pdf`,
        type: 'Accredited Verifier Statement',
        size: '2.1 MB',
        uploadedBy: versionSnapshot.verifierName,
        date: versionSnapshot.submittedDate,
      },
      {
        name: `ActivityData_MassBalance_Spreadsheet_v${selectedVersion}.0.xlsx`,
        type: 'Activity Calculation Workbook',
        size: '8.4 MB',
        uploadedBy: versionSnapshot.submittedBy,
        date: versionSnapshot.submittedDate,
      },
      {
        name: `FlowMeter_ISO17025_Calibration_Certificates_v${selectedVersion}.0.zip`,
        type: 'QA/QC Instrument Records',
        size: '14.2 MB',
        uploadedBy: versionSnapshot.submittedBy,
        date: versionSnapshot.submittedDate,
      },
    ];
  }, [currentFac, selectedVersion, versionSnapshot]);

  // Audit history for Section 5
  const submissionAuditHistory = useMemo(() => {
    const allEvents = [
      {
        id: 'aud-v3-1',
        version: 3,
        timestamp: '14 Mar 2026, 11:30 AM',
        user: versionSnapshot.submittedBy,
        role: 'Facility Compliance Lead',
        action: 'Transmitted Revised MRV Package (Version 3.0)',
        comments: 'Attached ISO 17025 flowmeter calibration certs for FT-302 and updated Tier 2 activity data.',
      },
      {
        id: 'aud-v2-2',
        version: 2,
        timestamp: '10 Mar 2026, 02:15 PM',
        user: 'Dr. Fatima Al Nuaimi',
        role: 'EAD Lead Inspector',
        action: 'Issued 30-Day Regulatory Correction Notice',
        comments: 'Reverted submission: Please attach fuel gas chromatography analysis certificates and reconcile flare logs.',
      },
      {
        id: 'aud-v2-1',
        version: 2,
        timestamp: '01 Mar 2026, 09:45 AM',
        user: versionSnapshot.submittedBy,
        role: 'Facility Compliance Lead',
        action: 'Transmitted Revised MRV Package (Version 2.0)',
        comments: 'Updated flared gas volume estimation tables and attached interim memo.',
      },
      {
        id: 'aud-v1-2',
        version: 1,
        timestamp: '24 Feb 2026, 04:00 PM',
        user: 'EAD Regulatory Desk',
        role: 'Regulatory System',
        action: 'Reverted for Missing Flow Meter Metadata',
        comments: 'Supplementary volumetric calibration metadata required for flaring header.',
      },
      {
        id: 'aud-v1-1',
        version: 1,
        timestamp: '15 Feb 2026, 10:00 AM',
        user: versionSnapshot.submittedBy,
        role: 'Facility Compliance Lead',
        action: 'Initial Annual MRV Submission (Version 1.0)',
        comments: 'Statutory submission for reporting year 2026.',
      },
    ];

    return allEvents.filter((ev) => ev.version <= selectedVersion);
  }, [selectedVersion, versionSnapshot]);

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans space-y-3">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER (NO WHITE CARD BACKGROUND, COMPACT ICON-ONLY BACK BUTTON)   */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 pt-0.5 pb-1">
        <div className="flex items-center gap-3">
          {/* Compact Icon-Only Back Button */}
          <button
            onClick={() => setActiveView('mrv-data-history')}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center"
            title="Back to Version History"
          >
            <ArrowLeft className="w-4 h-4 text-[#004B87]" />
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Facility Name + Facility ID + Version + Status */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-900 text-sm">{currentFac.name}</span>
            <span className="font-mono font-bold text-[#004B87] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs">
              {currentFac.facilityCode}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-xs">
              v{selectedVersion}.0
            </span>
            <span className="text-slate-300">•</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
              versionSnapshot.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              versionSnapshot.isCorrection ? 'bg-amber-50 text-amber-800 border border-amber-300' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {versionSnapshot.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Version Switcher */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Version:</span>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(Number(e.target.value))}
              className="bg-transparent font-bold text-[#004B87] text-xs focus:outline-none cursor-pointer"
            >
              {versionHistoryList.map((v) => (
                <option key={v.rawVersion} value={v.rawVersion} className="text-slate-800">
                  {v.version} {v.isCurrent ? '(Active)' : '(Historical)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN REGISTRATION-STYLE CONTAINER FRAME                                */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm px-3.5 sm:px-4 py-3.5 sm:py-4 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">

          {/* ===================================================================== */}
          {/* SUBMISSION SUMMARY (MATCHING REGISTRATION SECTION CARD UI)           */}
          {/* ===================================================================== */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                Submission Summary & Verification Status
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Reporting Year: <strong className="text-slate-800">{currentSub.reportingYear || 2026}</strong>
              </span>
            </div>

            <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Facility Legal Name</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold truncate">
                    {currentFac.name}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Facility ID (EAD Code)</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-mono font-bold">
                    {currentFac.facilityCode}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Version & Stage</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                    v{selectedVersion}.0 ({versionSnapshot.isLatest ? 'Active' : 'Historical'})
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Submitted By</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium truncate">
                    {versionSnapshot.submittedBy}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1.5">Submitted Date</label>
                  <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium truncate">
                    {versionSnapshot.submittedDate}
                  </div>
                </div>
              </div>

              {/* Progress & Status Alert */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-semibold">Workflow Status:</span>
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    versionSnapshot.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    versionSnapshot.isCorrection ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {versionSnapshot.status}
                  </span>
                  <span className="text-slate-500 font-medium text-xs">• {versionSnapshot.progressStage}</span>
                </div>

                <div className="flex items-center gap-2 min-w-[200px]">
                  <span className="text-slate-500 font-medium text-xs">Progress:</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-[#004B87] h-full rounded-full transition-all duration-500"
                      style={{ width: `${versionSnapshot.progressPercent}%` }}
                    />
                  </div>
                  <span className="font-bold text-[#004B87] text-xs">{versionSnapshot.progressPercent}%</span>
                </div>
              </div>

              {versionSnapshot.hasCorrectionWindow ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Correction Required (Due: {versionSnapshot.correctionDueDate}): </span>
                    <span className="text-amber-800 italic">"{versionSnapshot.reviewComments}"</span>
                  </div>
                </div>
              ) : versionSnapshot.isApproved ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">Official EAD Compliance Certificate Issued</span>
                    <span className="text-emerald-700 hidden sm:inline">• Annual MRV reporting certified for regulatory compliance.</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Permanently Certified
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 1: REGISTRATION                                               */}
          {/* ===================================================================== */}
          <div className="pt-2">
            <div className="rounded-xl border border-blue-200/90 bg-[#EBF3FA] px-4 py-2.5 flex items-center justify-between shadow-2xs mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#004B87] text-white">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-[#004B87] uppercase tracking-wider">
                  1. Registration
                </h2>
              </div>
              <span className="text-[11px] text-[#004B87]/80 font-semibold">
                Statutory Facility & Operator Registry Data
              </span>
            </div>

            <div className="space-y-4">
              {/* Operator Details */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Operator Details
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Statutory
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Operator Name</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold">
                        {currentFac.operatorName}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Operator ID</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-mono font-bold">
                        OP-{currentFac.id.replace('fac-', '00012')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Commercial License Number</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-mono font-bold">
                        {currentFac.tradeLicense}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Registered Address</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium truncate">
                        {currentFac.address}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Country of Incorporation</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium">
                        United Arab Emirates
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facility Details & Location */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Facility Details & Location
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Facility Legal Name</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold">
                        {currentFac.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Facility ID (EAD Code)</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-mono font-bold">
                        {currentFac.facilityCode}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Sector & Tier Level</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium">
                        {currentFac.sector} • {currentFac.tier}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Emirate</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium">
                        {currentFac.emirate}, UAE
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">GPS Coordinates</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-mono text-xs">
                        {currentFac.coordinates.lat}° N, {currentFac.coordinates.lng}° E
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activities & Products */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Activities & Products
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Primary Activity</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold truncate">
                        {currentFac.primaryActivity}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Main Finished Products</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium truncate">
                        {currentFac.products}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Design Capacity</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium">
                        {currentFac.productionCapacity}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Actual Annual Production</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-bold">
                        {currentFac.actualProduction}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Statutory MRV Tier</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-indigo-700 font-bold">
                        {currentFac.tier}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Permit */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Environmental Permit
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Permit Number</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-mono font-bold">
                        {currentFac.permitNumber}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Permit Type</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-medium">
                        {currentFac.permitType}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Issue Date</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                        {currentFac.permitIssueDate}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Expiry Date</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
                        {currentFac.permitExpiryDate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Persons */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Contact Persons
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <p className="text-slate-600 font-medium">Head of HSE & Compliance</p>
                      <div className="pt-2 space-y-1 text-slate-600">
                        <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentFac.environmentalManager.email}</p>
                        <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentFac.environmentalManager.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 2: MONITORING PLAN                                            */}
          {/* ===================================================================== */}
          <div className="pt-4">
            <div className="rounded-xl border border-blue-200/90 bg-[#EBF3FA] px-4 py-2.5 flex items-center justify-between shadow-2xs mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#004B87] text-white">
                  <Factory className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-[#004B87] uppercase tracking-wider">
                  2. Monitoring Plan & Methodologies
                </h2>
              </div>
              <span className="text-[11px] text-[#004B87]/80 font-semibold">
                Approved Measurement Streams & Calibration Registers
              </span>
            </div>

            <div className="space-y-4">
              {/* Production Streams */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Primary Production Streams & Emission Sources
                  </span>
                  <span className="text-xs font-bold text-[#004B87]">{facilityStreams.length} Streams</span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3">Stream ID</th>
                          <th className="py-2.5 px-3">Stream / Header Name</th>
                          <th className="py-2.5 px-3">Annual Throughput</th>
                          <th className="py-2.5 px-3">Unit</th>
                          <th className="py-2.5 px-3">Measuring Device & Calibration Reference</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {facilityStreams.map((stream) => (
                          <tr key={stream.id} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]">{stream.id}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-900">{stream.name}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{stream.throughput}</td>
                            <td className="py-2.5 px-3 text-slate-600">{stream.unit}</td>
                            <td className="py-2.5 px-3 text-slate-700">{stream.device}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Measurement Equipment & Calibration */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Measurement Equipment & Calibration QA/QC
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">GHG Monitoring Methodology</label>
                      <p className="font-semibold text-slate-800">Calculation-based (IPCC 2006 Tier {currentFac.tier.slice(-1)})</p>
                      <p className="text-[11px] text-slate-600 mt-1">ISO 14064-1:2018 & Abu Dhabi Heavy Industry Technical MRV Guidelines</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Calibration Frequency & QA/QC</label>
                      <p className="font-semibold text-slate-800">Quarterly Calibration by ISO 17025 Accredited Calibration Lab</p>
                      <p className="text-[11px] text-slate-600 mt-1">10-Year Archival retention with encrypted time-series logging</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mitigation Measures */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Mitigation Measures & Action Plans
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3">Project Name</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Expected Reduction</th>
                          <th className="py-2.5 px-3">MRV Methodology</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {monitoringPlan.mitigationMeasures.map((mit) => (
                          <tr key={mit.id} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{mit.name}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                mit.status === 'Operational' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {mit.status} ({mit.implementationYear})
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-700">{mit.expectedReduction.toLocaleString()} tCO₂e/yr</td>
                            <td className="py-2.5 px-3 text-slate-600">{mit.methodology}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 3: ANNUAL EMISSION DATA                                       */}
          {/* ===================================================================== */}
          <div className="pt-4">
            <div className="rounded-xl border border-blue-200/90 bg-[#EBF3FA] px-4 py-2.5 flex items-center justify-between shadow-2xs mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#004B87] text-white">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-[#004B87] uppercase tracking-wider">
                  3. Annual Emission Data
                </h2>
              </div>
              <span className="text-[11px] text-[#004B87]/80 font-semibold">
                Annual Reported Greenhouse Gas Emission Quantities
              </span>
            </div>

            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Annual GHG Emissions (Version {selectedVersion}.0 • RY {currentSub.reportingYear || 2026})
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-semibold mr-1.5">Total Emissions:</span>
                    <span className="text-sm font-extrabold text-[#004B87]">
                      {versionSnapshot.totalEmissions.toLocaleString()} tCO₂e
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Stationary Combustion</p>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {versionSnapshot.combustionEmissions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">tCO₂e (Scope 1)</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Industrial Processes</p>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {versionSnapshot.processEmissions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">tCO₂e (Scope 1)</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Fugitive & Flaring</p>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {versionSnapshot.fugitiveEmissions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">tCO₂e (Scope 1)</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-600 uppercase">Scope 2 (Electricity)</p>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {versionSnapshot.scope2Emissions.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">tCO₂e (Grid Power)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Calculation Breakdown Table */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Emission Activity Data & Calculation Basis (v{selectedVersion}.0)
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3">Emission Source / Fuel Stream</th>
                          <th className="py-2.5 px-3">Activity Data Consumption</th>
                          <th className="py-2.5 px-3">Net Calorific Value (NCV)</th>
                          <th className="py-2.5 px-3">Emission Factor</th>
                          <th className="py-2.5 px-3 text-right">Calculated tCO₂e</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">Stationary Fuel Combustion</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">Primary Fuel Stream</td>
                          <td className="py-2.5 px-3 text-slate-700">{versionSnapshot.ncv}</td>
                          <td className="py-2.5 px-3 text-slate-700">{versionSnapshot.ef} (Tier 2)</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#004B87]">{versionSnapshot.combustionEmissions.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">Process & Calcination Operations</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">Feedstock Consumption</td>
                          <td className="py-2.5 px-3 text-slate-400">N/A (Process)</td>
                          <td className="py-2.5 px-3 text-slate-700">IPCC Sector Model</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#004B87]">{versionSnapshot.processEmissions.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-bold text-slate-900">Fugitive & Flaring Streams</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">Continuous Metering</td>
                          <td className="py-2.5 px-3 text-slate-700">{selectedVersion === 1 ? '37.50 MJ/Nm³' : '37.80 MJ/Nm³'}</td>
                          <td className="py-2.5 px-3 text-slate-700">Tier 1 Factor</td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#004B87]">{versionSnapshot.fugitiveEmissions.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 4: VERIFICATION                                               */}
          {/* ===================================================================== */}
          <div className="pt-4">
            <div className="rounded-xl border border-blue-200/90 bg-[#EBF3FA] px-4 py-2.5 flex items-center justify-between shadow-2xs mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#004B87] text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-[#004B87] uppercase tracking-wider">
                  4. Verification
                </h2>
              </div>
              <span className="text-[11px] text-[#004B87]/80 font-semibold">
                Accredited Independent Third-Party Verification Statement
              </span>
            </div>

            <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
              <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-[#004B87]">
                  Third-Party Verification Data & Statement (v{selectedVersion}.0)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {versionSnapshot.verifierAssurance}
                </span>
              </div>

              <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Accredited Verifier</label>
                    <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold">
                      {versionSnapshot.verifierName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Verification Opinion</label>
                    <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 font-bold">
                      {versionSnapshot.verifierOpinion}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Materiality Standard</label>
                    <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium">
                      5% Materiality Threshold (Zero misstatements)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* SECTION 5: REVIEW & SUBMISSION                                        */}
          {/* ===================================================================== */}
          <div className="pt-4">
            <div className="rounded-xl border border-blue-200/90 bg-[#EBF3FA] px-4 py-2.5 flex items-center justify-between shadow-2xs mb-3.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-[#004B87] text-white">
                  <FileCheck2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs font-bold text-[#004B87] uppercase tracking-wider">
                  5. Review & Submission
                </h2>
              </div>
              <span className="text-[11px] text-[#004B87]/80 font-semibold">
                Regulatory Determinations, Version Logs & Audit Trail
              </span>
            </div>

            <div className="space-y-4">
              {/* Submission Status & Decisions */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Review Determination & Submission Details (v{selectedVersion}.0)
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Submitted By</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-bold">
                        {versionSnapshot.submittedBy}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Submission Timestamp</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold">
                        {versionSnapshot.submittedDate}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Review Determination</label>
                      <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-bold">
                        {versionSnapshot.status}
                      </div>
                    </div>
                  </div>

                  {versionSnapshot.reviewComments && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">Reviewer Comments / Decision Notes:</span>
                      <p className="text-slate-600 italic leading-relaxed">"{versionSnapshot.reviewComments}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Version History Table */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Version History for {currentSub.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{versionHistoryList.length} Versions Recorded</span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3">Version</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Submitted By</th>
                          <th className="py-2.5 px-3">Submitted Date</th>
                          <th className="py-2.5 px-3">Review Decision</th>
                          <th className="py-2.5 px-3">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {versionHistoryList.map((v) => (
                          <tr key={v.version} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#004B87]">{v.version}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                v.status === 'Correction Required' ? 'bg-amber-100 text-amber-800' :
                                'bg-teal-100 text-teal-800'
                              }`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-800">{v.submittedBy}</td>
                            <td className="py-2.5 px-3 text-slate-600">{v.submittedDate}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-700">{v.reviewDecision}</td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{v.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Supporting Documents Table */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Supporting Documents for {currentSub.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{submissionDocuments.length} Documents</span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-bold">
                          <th className="py-2.5 px-3">Document Name</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Uploaded By</th>
                          <th className="py-2.5 px-3">Upload Date</th>
                          <th className="py-2.5 px-3">Size</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {submissionDocuments.map((doc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-[#004B87] shrink-0" />
                              <span>{doc.name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{doc.type}</td>
                            <td className="py-2.5 px-3 text-slate-700">{doc.uploadedBy}</td>
                            <td className="py-2.5 px-3 text-slate-500">{doc.date}</td>
                            <td className="py-2.5 px-3 text-slate-600">{doc.size}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => alert(`Downloading ${doc.name}`)}
                                className="text-[#004B87] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
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
              </div>

              {/* Audit Trail */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Audit Trail for {currentSub.id}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{submissionAuditHistory.length} Events Logged</span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white text-xs">
                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {submissionAuditHistory.map((ev, idx) => (
                      <div key={ev.id || idx} className="relative group">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#004B87] ring-4 ring-white border-2 border-white shadow-xs" />
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="font-bold text-slate-900">{ev.action}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{ev.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-semibold text-[#004B87]">{ev.user}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">{ev.role}</span>
                          </div>
                          {ev.comments && (
                            <p className="text-slate-600 mt-1.5 bg-white p-2 rounded border border-slate-200 text-[11px] italic">
                              "{ev.comments}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
