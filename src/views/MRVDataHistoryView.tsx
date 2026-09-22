import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Building2,
  Eye,
  Edit3,
  Search,
  Download,
  Clock,
  RotateCcw,
  User,
  Calendar,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { Facility, Submission, SubmissionStatus } from '../types/mrv';

export interface MRVDataHistoryViewProps {
  onBackToDashboard?: () => void;
  onViewVersionDetail?: (submission: Submission, versionNumber: number) => void;
}

export const MRVDataHistoryView: React.FC<MRVDataHistoryViewProps> = ({
  onBackToDashboard,
  onViewVersionDetail,
}) => {
  const {
    facilities,
    submissions,
    reportingYear,
    setActiveFacilityId,
    selectedSubmissionForReview,
    setSelectedSubmissionForReview,
    setActiveView,
  } = useMRV();

  // LEVEL STATE:
  // selectedFacility === null -> LEVEL 1: ALL FACILITIES HISTORY TABLE
  // selectedFacility !== null -> LEVEL 2: FACILITY VERSION HISTORY (For selected facility)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(() => {
    if (selectedSubmissionForReview?.facilityId) {
      return facilities.find((f) => f.id === selectedSubmissionForReview.facilityId) || null;
    }
    return null;
  });

  // Sync selected facility if selectedSubmissionForReview changes
  React.useEffect(() => {
    if (selectedSubmissionForReview?.facilityId) {
      const fac = facilities.find((f) => f.id === selectedSubmissionForReview.facilityId);
      if (fac && (!selectedFacility || selectedFacility.id !== fac.id)) {
        setSelectedFacility(fac);
      }
    }
  }, [selectedSubmissionForReview?.facilityId, facilities]);

  // Search and filter states (Shared / Level 1)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  // Sorting state (Level 1)
  const [sortKey, setSortKey] = useState<string>('facilityId');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Search and filter states (Level 2)
  const [versionSearchQuery, setVersionSearchQuery] = useState('');
  const [versionStatusFilter, setVersionStatusFilter] = useState<string>('ALL');

  // Toast / Export notice
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // LEVEL 1: ALL FACILITIES DATA JOIN
  // -------------------------------------------------------------------------
  const allFacilityRecords = useMemo(() => {
    return facilities.map((fac, idx) => {
      const facSubs = submissions.filter((s) => s.facilityId === fac.id);
      const mainSub = facSubs[0];

      const submissionId = mainSub?.id ? mainSub.id.toUpperCase() : `SUB-2026-00${idx + 1}`;
      const facilityName = fac.name;
      const operatorName = fac.operatorName || 'Industrial Operator LLC';
      const sector = fac.sector;
      const tierLevel = fac.tier === 'Tier 1' ? 'T1' : fac.tier === 'Tier 2' ? 'T2' : fac.tier === 'Tier 3' ? 'T3' : fac.tier;
      const reportingYr = mainSub?.reportingYear || reportingYear || 2026;
      const version = `V${mainSub?.version || (idx === 0 ? 3 : idx === 1 ? 1 : idx === 2 ? 2 : idx === 3 ? 1 : 1)}`;
      const currentStatus: SubmissionStatus = mainSub?.status || (idx === 0 ? 'Submitted' : idx === 1 ? 'Approved' : idx === 2 ? 'Correction Required' : idx === 3 ? 'Approved' : 'Rejected');
      
      const lastUpdated = mainSub?.history && mainSub.history.length > 0
        ? mainSub.history[mainSub.history.length - 1].timestamp
        : (mainSub?.submittedDate || (idx === 0 ? '16-Jul-2026' : idx === 1 ? '18-Jul-2026' : idx === 2 ? '20-Jul-2026' : idx === 3 ? '22-Jul-2026' : '26-Jul-2026'));
      
      const isCorrectionRequired = currentStatus === 'Correction Required';
      const correctionDeadline = isCorrectionRequired
        ? (mainSub?.correctionDueDate || '19-Aug-2026 (29 days left)')
        : null;

      return {
        tableIndex: idx + 1,
        submissionId,
        facility: fac,
        facilityId: fac.facilityCode,
        facilityName,
        operatorName,
        sector,
        tierLevel,
        tier: fac.tier,
        reportingYear: reportingYr,
        version,
        currentStatus,
        lastUpdated,
        isCorrectionRequired,
        correctionDeadline,
        submission: mainSub,
      };
    });
  }, [facilities, submissions, reportingYear]);

  // Filtered facilities for Level 1
  const filteredFacilities = useMemo(() => {
    return allFacilityRecords
      .filter((rec) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          rec.submissionId.toLowerCase().includes(q) ||
          rec.facilityId.toLowerCase().includes(q) ||
          rec.facilityName.toLowerCase().includes(q) ||
          rec.operatorName.toLowerCase().includes(q) ||
          rec.sector.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'Reverted' && (rec.currentStatus === 'Correction Required' || (rec.currentStatus as string) === 'Reverted')) ||
          (statusFilter === 'Correction Required' && (rec.currentStatus === 'Correction Required' || (rec.currentStatus as string) === 'Reverted')) ||
          rec.currentStatus.toLowerCase() === statusFilter.toLowerCase();

        const matchesYear =
          yearFilter === 'ALL' || String(rec.reportingYear) === yearFilter;

        const matchesSector =
          sectorFilter === 'ALL' || rec.sector.toLowerCase() === sectorFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesYear && matchesSector;
      })
      .sort((a: any, b: any) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [allFacilityRecords, searchQuery, statusFilter, yearFilter, sectorFilter, sortKey, sortAsc]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  // -------------------------------------------------------------------------
  // LEVEL 2: SELECTED FACILITY VERSION RECORDS RESOLVER
  // -------------------------------------------------------------------------
  const currentFac: Facility = selectedFacility || facilities[0];

  const activeSub: Submission = useMemo(() => {
    const list = submissions.filter((s) => s.facilityId === currentFac.id);
    if (list.length > 0) return list[0];
    return {
      id: `sub-${currentFac.id}-01`,
      facilityId: currentFac.id,
      facilityName: currentFac.name,
      facilityCode: currentFac.facilityCode,
      sector: currentFac.sector,
      emirate: currentFac.emirate,
      reportingYear: reportingYear || 2026,
      version: 1,
      submissionType: 'Annual MRV Submission',
      submittedDate: '14 Mar 2026, 11:30 AM',
      status: 'Under Review',
      totalEmissions: 1240500,
      tier: currentFac.tier,
      reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
      documents: [],
      history: [],
      daysPending: 4,
    };
  }, [currentFac, submissions, reportingYear]);

  const versionRecords = useMemo(() => {
    // 1. If facility is fac-1 (Al Noor Industrial Facility)
    if (currentFac.id === 'fac-1') {
      return [
        {
          id: `${activeSub.id}-v3`,
          submissionId: activeSub.id,
          version: 'v3.0',
          versionNum: 3,
          isLatest: true,
          submissionDate: '14 Mar 2026, 11:30 AM',
          submittedBy: currentFac.contactPerson?.name || 'Ahmed Al-Zaabi',
          status: 'Under Review' as SubmissionStatus,
          reviewCorrectionStatus: 'EAD Regulatory Assessment — Technical Compliance Evaluation',
          lastUpdated: '15 Mar 2026, 08:30 AM',
          totalEmissions: 1240500,
          reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
          reviewComments: 'Resubmitted with calibrated continuous flow meter calibration certificates for Steam Turbine #2 and updated Tier 2 activity calculation notes as requested by EAD Inspector.',
          documentsCount: 4,
        },
        {
          id: `${activeSub.id}-v2`,
          submissionId: activeSub.id,
          version: 'v2.0',
          versionNum: 2,
          isLatest: false,
          submissionDate: '01 Mar 2026, 09:45 AM',
          submittedBy: currentFac.contactPerson?.name || 'Ahmed Al-Zaabi',
          status: 'Correction Required' as SubmissionStatus,
          reviewCorrectionStatus: 'Correction Requested — 30-Day Resubmission Window (Due 11 Apr 2026)',
          lastUpdated: '10 Mar 2026, 02:15 PM',
          totalEmissions: 1238900,
          reviewerName: 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)',
          reviewComments: 'Please attach ISO 17025 accredited laboratory fuel gas chromatography analysis certificates for Turbine 2 and reconcile monthly flare flow meter calibration logs.',
          documentsCount: 3,
        },
        {
          id: `${activeSub.id}-v1`,
          submissionId: activeSub.id,
          version: 'v1.0',
          versionNum: 1,
          isLatest: false,
          submissionDate: '15 Feb 2026, 10:00 AM',
          submittedBy: currentFac.contactPerson?.name || 'Ahmed Al-Zaabi',
          status: 'Submitted' as SubmissionStatus,
          reviewCorrectionStatus: 'Reverted for Volumetric Flow Meter Calibration Metadata',
          lastUpdated: '24 Feb 2026, 04:00 PM',
          totalEmissions: 1235000,
          reviewerName: 'EAD Regulatory Evaluation Desk',
          reviewComments: 'Initial annual MRV package transmission. Flaring stream calculations required supplementary volumetric calibration metadata.',
          documentsCount: 2,
        },
      ];
    }

    // 2. If facility is fac-3 (Borouge Petrochemicals Complex)
    if (currentFac.id === 'fac-3') {
      return [
        {
          id: `${activeSub.id}-v2`,
          submissionId: activeSub.id,
          version: 'v2.0',
          versionNum: 2,
          isLatest: true,
          submissionDate: '09 Mar 2026, 02:15 PM',
          submittedBy: currentFac.contactPerson?.name || 'Khalid Al-Marzooqi',
          status: 'Correction Required' as SubmissionStatus,
          reviewCorrectionStatus: 'Correction Requested — Optical Flare Gas Meter & Cracking Mass Balance Verification',
          lastUpdated: '12 Mar 2026, 10:00 AM',
          totalEmissions: 2180900,
          reviewerName: 'Dr. Mariam Al-Qubaisi',
          reviewComments: 'Please attach calibration certs for optical flare gas velocity meter and detailed ethylene cracking mass balance logs.',
          documentsCount: 3,
        },
        {
          id: `${activeSub.id}-v1`,
          submissionId: activeSub.id,
          version: 'v1.0',
          versionNum: 1,
          isLatest: false,
          submissionDate: '20 Feb 2026, 11:00 AM',
          submittedBy: currentFac.contactPerson?.name || 'Khalid Al-Marzooqi',
          status: 'Submitted' as SubmissionStatus,
          reviewCorrectionStatus: 'Reverted for Polyolefin Stream Analysis Validation',
          lastUpdated: '28 Feb 2026, 03:30 PM',
          totalEmissions: 2175000,
          reviewerName: 'EAD Regulatory Desk',
          reviewComments: 'Initial annual transmission. Polymerization stream mass balance required verification.',
          documentsCount: 2,
        },
      ];
    }

    // 3. Default for other facilities (Emirates Steel, Al Taweelah, Tadweer, etc.)
    return [
      {
        id: `${activeSub.id}-v${activeSub.version || 1}`,
        submissionId: activeSub.id,
        version: `v${activeSub.version || 1}.0`,
        versionNum: activeSub.version || 1,
        isLatest: true,
        submissionDate: activeSub.submittedDate || '11 Mar 2026, 08:30 AM',
        submittedBy: activeSub.history?.[0]?.user || currentFac.contactPerson?.name || 'Facility Compliance Lead',
        status: (activeSub.status || 'Approved') as SubmissionStatus,
        reviewCorrectionStatus: activeSub.status === 'Approved'
          ? 'Full EAD Statutory Compliance Certificate Endorsed'
          : 'EAD Regulatory Assessment in Progress',
        lastUpdated: activeSub.submittedDate || '13 Mar 2026, 03:10 PM',
        totalEmissions: activeSub.totalEmissions || 3450200,
        reviewerName: activeSub.reviewerName || 'Eng. Salem Al-Nuaimi',
        reviewComments: activeSub.status === 'Approved'
          ? 'Comprehensive Tier 3 mass balance data verified with continuous carbon capture audit.'
          : 'Annual MRV reporting package received and queued for technical evaluation.',
        documentsCount: 3,
      },
    ];
  }, [currentFac, activeSub]);

  // Filtered versions for Level 2
  const filteredVersionRecords = useMemo(() => {
    return versionRecords.filter((rec) => {
      const q = versionSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.version.toLowerCase().includes(q) ||
        rec.submittedBy.toLowerCase().includes(q) ||
        rec.status.toLowerCase().includes(q) ||
        rec.reviewCorrectionStatus.toLowerCase().includes(q) ||
        rec.reviewComments.toLowerCase().includes(q);

      const matchesStatus =
        versionStatusFilter === 'ALL' || rec.status.toLowerCase() === versionStatusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [versionRecords, versionSearchQuery, versionStatusFilter]);

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------
  const handleSelectFacility = (facility: Facility) => {
    setActiveFacilityId(facility.id);
    setSelectedFacility(facility);
    const facSubs = submissions.filter((s) => s.facilityId === facility.id);
    const mainSub = facSubs[0];
    setSelectedSubmissionForReview({
      id: mainSub?.id || `SUB-${facility.facilityCode}-1`,
      facilityId: facility.id,
      facilityName: facility.name,
      facilityCode: facility.facilityCode,
      sector: facility.sector,
      emirate: facility.emirate,
      reportingYear: mainSub?.reportingYear || reportingYear || 2026,
      version: mainSub?.version || 1,
      submissionType: mainSub?.submissionType || 'Annual MRV Submission',
      submittedDate: mainSub?.submittedDate || '15 Mar 2026',
      status: mainSub?.status || 'Submitted',
      totalEmissions: mainSub?.totalEmissions || 0,
      tier: facility.tier,
      reviewerName: mainSub?.reviewerName,
      documents: mainSub?.documents || [],
      history: mainSub?.history || [],
      daysPending: mainSub?.daysPending || 0,
    });
  };

  const handleViewVersionDetail = (record: any) => {
    setSelectedSubmissionForReview({
      ...activeSub,
      facilityId: currentFac.id,
      facilityName: currentFac.name,
      facilityCode: currentFac.facilityCode,
      sector: currentFac.sector,
      tier: currentFac.tier,
      version: record.versionNum,
      status: record.status,
      submittedDate: record.submissionDate,
      totalEmissions: record.totalEmissions,
      correctionComments: record.reviewComments,
      reviewerName: record.reviewerName,
    });

    if (onViewVersionDetail) {
      onViewVersionDetail(activeSub, record.versionNum);
    } else {
      setActiveView('submission-detail');
    }
  };

  const handleExport = (name: string) => {
    setExportNotice(`Exporting ${name}...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E8F8F0] text-[#16A34A] border border-emerald-200/60 inline-block min-w-[85px] text-center">
            Approved
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block min-w-[95px] text-center">
            Submitted
          </span>
        );
      case 'Correction Required':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 inline-block min-w-[130px] text-center font-bold">
            Correction Required
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block min-w-[85px] text-center">
            Submitted
          </span>
        );
      case 'Draft':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-600 border border-slate-300 inline-block min-w-[75px] text-center">
            Draft
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 inline-block min-w-[85px] text-center">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-slate-100 text-slate-700 border border-slate-200 inline-block text-center">
            {status}
          </span>
        );
    }
  };

  // =========================================================================
  // RENDER LEVEL 1: ALL FACILITIES HISTORY TABLE
  // =========================================================================
  if (!selectedFacility) {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans">
        {/* 1. TOP FIXED HEADER: Data Review Title, Subtitle & Export */}
        <div className="flex-shrink-0 pt-0.5 pb-[18px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
                Data Review
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Review, Validate and Verify Facility Reporting Packages
              </p>
            </div>
            {exportNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{exportNotice}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExport('Data Review & History Registry')}
              className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Level 1 Card Container with Search, Filter & All Facilities Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
            {/* Search Box */}
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Facility ID, Facility Name, Sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Reverted">Reverted (Correction Required)</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Draft">Draft</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Sector Filter */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500">Sector:</span>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Energy">Energy</option>
                  <option value="IPPU">IPPU</option>
                  <option value="Waste">Waste</option>
                </select>
              </div>

              {/* Reset */}
              {(searchQuery || statusFilter !== 'ALL' || yearFilter !== 'ALL' || sectorFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setYearFilter('ALL');
                    setSectorFilter('ALL');
                  }}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Level 1 Table: Inset Container with Padding and Rounded Border */}
          <div className="p-3.5 sm:p-4 flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200/90 bg-white">
              <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                <thead>
                  <tr className="h-[38px] bg-[#6692B7]/30 text-slate-800 font-bold text-xs border-b border-[#6692B7]/20 sticky top-0 z-10 shadow-xs">
                    {/* 1. Facility ID */}
                    <th
                      onClick={() => handleSort('facilityId')}
                      className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap align-middle"
                    >
                    <div className="flex items-center gap-1">
                      <span>Facility ID</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 3. Facility */}
                  <th
                    onClick={() => handleSort('facilityName')}
                    className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[150px] align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Facility</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 4. Reporting Entity */}
                  <th
                    onClick={() => handleSort('operatorName')}
                    className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[150px] align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Reporting Entity</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 5. Sector */}
                  <th
                    onClick={() => handleSort('sector')}
                    className="h-[38px] px-3 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Sector</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 6. Tier Level */}
                  <th
                    onClick={() => handleSort('tierLevel')}
                    className="h-[38px] px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Tier Level</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 7. Reporting Year */}
                  <th
                    onClick={() => handleSort('reportingYear')}
                    className="h-[38px] px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Reporting Year</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 8. Version */}
                  <th
                    onClick={() => handleSort('version')}
                    className="h-[38px] px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Version</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 9. Last Updated */}
                  <th
                    onClick={() => handleSort('lastUpdated')}
                    className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Last Updated</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 10. Review Status */}
                  <th
                    onClick={() => handleSort('currentStatus')}
                    className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Review Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 11. Correction Deadline */}
                  <th
                    onClick={() => handleSort('correctionDeadline')}
                    className="h-[38px] px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap align-middle"
                  >
                    <div className="flex items-center gap-1">
                      <span>Correction Deadline</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  {/* 12. Actions */}
                  <th className="h-[38px] px-4 text-right whitespace-nowrap align-middle">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                      No MRV submission records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFacilities.map((row) => {
                    const isCorrection = row.currentStatus === 'Correction Required';

                    return (
                      <tr key={row.facility.id} className="h-[60px] hover:bg-slate-50/80 transition-colors group">
                        {/* 1. Facility ID */}
                        <td className="h-[60px] px-3.5 font-mono font-bold text-[#004B87] text-xs whitespace-nowrap align-middle">
                          {row.facilityId}
                        </td>

                        {/* 3. Facility */}
                        <td className="h-[60px] px-3.5 font-semibold text-slate-800 min-w-[150px] align-middle">
                          <span>{row.facilityName}</span>
                        </td>

                        {/* 4. Reporting Entity */}
                        <td className="h-[60px] px-3.5 text-slate-600 min-w-[150px] align-middle">
                          {row.operatorName}
                        </td>

                        {/* 5. Sector */}
                        <td className="h-[60px] px-3 text-slate-600 whitespace-nowrap align-middle">
                          {row.sector}
                        </td>

                        {/* 6. Tier Level */}
                        <td className="h-[60px] px-3 text-center font-bold text-slate-700 whitespace-nowrap align-middle">
                          {row.tierLevel}
                        </td>

                        {/* 7. Reporting Year */}
                        <td className="h-[60px] px-3 text-center text-slate-600 whitespace-nowrap align-middle">
                          {row.reportingYear}
                        </td>

                        {/* 8. Version */}
                        <td className="h-[60px] px-3 text-center font-mono text-slate-600 whitespace-nowrap align-middle">
                          {row.version}
                        </td>

                        {/* 9. Last Updated */}
                        <td className="h-[60px] px-3.5 text-slate-600 text-xs whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{row.lastUpdated}</span>
                          </div>
                        </td>

                        {/* 10. Review Status */}
                        <td className="h-[60px] px-3.5 text-left whitespace-nowrap align-middle">
                          {getStatusBadge(row.currentStatus)}
                        </td>

                        {/* 11. Correction Deadline */}
                        <td className="h-[60px] px-3.5 whitespace-nowrap text-slate-600 align-middle">
                          {isCorrection ? (
                            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
                              <Calendar className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                              <span>{row.correctionDeadline || '19-Aug-2026 (29 days left)'}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-medium pl-2">-</span>
                          )}
                        </td>

                        {/* 12. Actions: Eye for all; Edit icon ONLY when Correction Required */}
                        <td className="h-[60px] px-4 text-right whitespace-nowrap align-middle">
                          <div className="flex items-center justify-end gap-2">
                            {/* Eye Icon (View) */}
                            <button
                              onClick={() => handleSelectFacility(row.facility)}
                              title="View Submission Details"
                              className="p-1 rounded-md text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Icon (Only when Correction Required) */}
                            {isCorrection && (
                              <button
                                onClick={() => setActiveView('annual-emission-data')}
                                title="Edit Correction Data"
                                className="p-1 rounded-md text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

          {/* Level 1 Table Footer */}
          <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium flex-shrink-0">
            <div>
              Showing <span className="font-bold text-slate-800">{filteredFacilities.length}</span> of{' '}
              <span className="font-bold text-slate-800">{allFacilityRecords.length}</span> Total Submissions
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Approved
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> Submitted
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Reverted (Correction Required)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER LEVEL 2: FACILITY VERSION HISTORY (For Selected Facility)
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* 1. TOP FIXED HEADER: Back Icon, Data Review Title, Subtitle & Export */}
      <div className="flex-shrink-0 pt-0.5 pb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedFacility(null);
                  setSelectedSubmissionForReview(null);
                }}
                className="p-1 -ml-1 rounded-lg text-[#004B87] hover:bg-slate-200/60 transition-colors cursor-pointer flex items-center justify-center"
                title="Back to All Facilities"
              >
                <ArrowLeft className="w-5 h-5 text-[#004B87]" />
              </button>
              <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
                Data Review
              </h1>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-bold text-xs text-[#004B87] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                {currentFac.facilityCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 pl-6">
              Submission Version History — {currentFac.name} ({currentFac.sector})
            </p>
          </div>
          {exportNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport(`Version history log for ${currentFac.name}`)}
            className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Level 2 Card Container with Version Search & Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history by version, submitter, review remarks..."
              value={versionSearchQuery}
              onChange={(e) => setVersionSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all font-medium"
            />
            {versionSearchQuery && (
              <button
                onClick={() => setVersionSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
            <span className="text-[11px] font-semibold text-slate-500">Status:</span>
            <select
              value={versionStatusFilter}
              onChange={(e) => setVersionStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Correction Required">Correction Required</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Level 2 Table: Facility Version History with Inset Padding and Rounded Border */}
        <div className="p-3.5 sm:p-4 flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-xl border border-slate-200/90 bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead>
                <tr className="h-[38px] bg-[#6692B7]/30 text-slate-800 font-bold text-xs border-b border-[#6692B7]/20 sticky top-0 z-10 shadow-xs">
                  <th className="h-[38px] px-3.5 whitespace-nowrap align-middle">Version</th>
                  <th className="h-[38px] px-3.5 whitespace-nowrap align-middle">Submission Date</th>
                  <th className="h-[38px] px-3.5 min-w-[150px] align-middle">Submitted By</th>
                  <th className="h-[38px] px-3.5 whitespace-nowrap align-middle">Status</th>
                  <th className="h-[38px] px-3.5 min-w-[280px] align-middle">Review / Correction Status</th>
                  <th className="h-[38px] px-3.5 whitespace-nowrap align-middle">Last Updated</th>
                  <th className="h-[38px] px-4 text-right whitespace-nowrap align-middle">Action</th>
                </tr>
              </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredVersionRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                    No version history records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVersionRecords.map((row) => (
                  <tr key={row.id} className="h-[60px] hover:bg-slate-50/80 transition-colors group">
                    {/* 1. Version */}
                    <td className="h-[60px] px-3.5 whitespace-nowrap align-middle">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-[#004B87] text-sm">
                          {row.version}
                        </span>
                        {row.isLatest ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Active Dossier
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Historical
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 2. Submission Date */}
                    <td className="h-[60px] px-3.5 whitespace-nowrap text-slate-800 font-semibold align-middle">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{row.submissionDate}</span>
                      </div>
                    </td>

                    {/* 3. Submitted By */}
                    <td className="h-[60px] px-3.5 font-bold text-slate-900 align-middle">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#004B87] shrink-0" />
                        <span>{row.submittedBy}</span>
                      </div>
                    </td>

                    {/* 4. Status */}
                    <td className="h-[60px] px-3.5 whitespace-nowrap align-middle">
                      {getStatusBadge(row.status)}
                    </td>

                    {/* 5. Review / Correction Status */}
                    <td className="h-[60px] px-3.5 text-xs align-middle">
                      <div>
                        <p className="font-bold text-slate-800">{row.reviewCorrectionStatus}</p>
                        <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1 max-w-md">
                          "{row.reviewComments}"
                        </p>
                      </div>
                    </td>

                    {/* 6. Last Updated */}
                    <td className="h-[60px] px-3.5 whitespace-nowrap text-slate-600 text-[11px] align-middle">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{row.lastUpdated}</span>
                      </div>
                    </td>

                    {/* 7. Action -> View Icon Only (Drills down to Level 3: Complete Submitted Data) */}
                    <td className="h-[60px] px-4 text-right whitespace-nowrap align-middle">
                      <button
                        onClick={() => handleViewVersionDetail(row)}
                        title={`Open complete entered details for Version ${row.version}`}
                        className="p-1 rounded-md text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Level 2 Table Footer */}
        <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium flex-shrink-0">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredVersionRecords.length}</span> recorded submission versions for{' '}
            <span className="font-bold text-[#004B87]">{currentFac.name}</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Clicking <span className="font-bold text-[#004B87]">View</span> opens the exact entered snapshot for that specific historical version.
          </div>
        </div>
      </div>
    </div>
  );
};
