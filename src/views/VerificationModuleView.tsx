import React, { useState, useRef, useMemo } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  Lock,
  Eye,
  RotateCcw,
  ArrowRight,
  Send,
  FileCheck,
  Search,
  Filter,
  Bookmark,
  ArrowLeft,
  Edit,
  Plus,
  Award,
  AlertTriangle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { formatVersion } from '../types/mrv';

export const VerificationModuleView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isVerificationUnlocked,
    setVerificationStatus: setCtxVerificationStatus,
    setAnnualEmissionStatus,
    submitAnnualMRV,
    openReadOnlyViewer,
    currentRole,
    facilities,
    setActiveFacilityId,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isVerifier = currentRole === 'VERIFIER';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'review' (Verification Workspace) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'review' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Overview Table Search & Filters
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Changes Saved!');
  const [opinionError, setOpinionError] = useState<string | null>(null);

  // Multi-Facility Verification Records Registry
  const [facilityVerifications, setFacilityVerifications] = useState<Record<string, any>>(() => ({
    'fac-1': {
      facilityName: 'Al Noor Industrial Facility',
      facilityId: 'FAC-EAD-2026-0891',
      reportingYear: '2026',
      version: 'V1',
      totalEmissions: '146,860',
      submittedDate: '14-Mar-2026',
      updatedDate: '18-Mar-2026',
      verificationStatus: 'Verified & Approved',
      verifierBody: 'Bureau Veritas Middle East',
      leadVerifier: 'Dr. Arthur Pendelton',
      accreditationId: 'ENAS-CB-042',
      startDate: '2026-06-16',
      endDate: '2026-06-25',
      opinion: 'Unqualified (Positive)',
      materialityThreshold: '2.0%',
      materialityFinding: 'Material misstatements evaluated at 0.18% (Well within 2% statutory materiality threshold).',
      cars: [
        { id: 'CAR-01', description: 'CEMS backup calibration logbook timestamp sync', status: 'Closed', verifiedDate: '20-Jun-2026' },
      ],
      remarks: 'All activity data records and calculation factors cross-checked against fiscal gas invoices and calibrated CEMS telemetry.',
      documents: [{ name: 'Bureau_Veritas_Verification_Statement_2026.pdf', size: '2.4MB', status: 'Uploaded' }],
      eadCorrectionDate: null,
    },
    'fac-2': {
      facilityName: 'Emirates Steel Arkan - Industrial City',
      facilityId: 'FAC-EAD-2026-0412',
      reportingYear: '2026',
      version: 'V1',
      totalEmissions: '1,688,960',
      submittedDate: '15-Mar-2026',
      updatedDate: '17-Mar-2026',
      verificationStatus: 'In Progress',
      verifierBody: 'DNV GL Business Assurance',
      leadVerifier: 'Eng. Mansoor Al Ketbi',
      accreditationId: 'ENAS-CB-019',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      opinion: 'Under Assessment',
      materialityThreshold: '2.0%',
      materialityFinding: 'Currently cross-verifying direct DRI carbon mass balance against reformer exhaust stack CEMS data.',
      cars: [
        { id: 'CAR-01', description: 'Reconcile CCUS pipeline transfer meter uncertainty certificates', status: 'Open', verifiedDate: '—' },
      ],
      remarks: 'Site audit scheduled for 10-Jul-2026.',
      documents: [{ name: 'DNV_Initial_Verification_Plan.pdf', size: '1.8MB', status: 'Uploaded' }],
      eadCorrectionDate: null,
    },
    'fac-3': {
      facilityName: 'Green Mountain Cement Factory',
      facilityId: 'FAC-000451',
      reportingYear: '2026',
      version: 'V3',
      totalEmissions: '624,000',
      submittedDate: '01-Mar-2026',
      updatedDate: '16-Mar-2026',
      verificationStatus: 'Correction Required',
      verifierBody: 'TÜV Rheinland Middle East',
      leadVerifier: 'Dr. Klaus Steiner',
      accreditationId: 'ENAS-CB-008',
      startDate: '2026-06-01',
      endDate: '2026-06-12',
      opinion: 'Qualified',
      materialityThreshold: '2.0%',
      materialityFinding: 'Identified variance in Raw Meal XRF sample testing frequency leading to a potential 3.2% uncertainty in clinker calcination factor.',
      cars: [
        { id: 'CAR-01', description: 'Submit daily laboratory XRF calibration logs for Raw Meal Calcination', status: 'Pending Facility Action', verifiedDate: '—' },
      ],
      remarks: 'Returned for correction. Facility must provide recalibrated laboratory logs within 90 days.',
      documents: [{ name: 'TUV_Rheinland_Finding_Report_2026.pdf', size: '3.1MB', status: 'Uploaded' }],
      eadCorrectionDate: '16-Mar-2026',
    },
    'fac-4': {
      facilityName: 'Borouge Petrochemicals Complex',
      facilityId: 'FAC-EAD-2026-0599',
      reportingYear: '2026',
      version: 'V1',
      totalEmissions: '957,840',
      submittedDate: '—',
      updatedDate: '20-Mar-2026',
      verificationStatus: 'Pending Assignment',
      verifierBody: 'To Be Assigned',
      leadVerifier: '—',
      accreditationId: '—',
      startDate: '—',
      endDate: '—',
      opinion: 'Pending Submission',
      materialityThreshold: '2.0%',
      materialityFinding: 'Awaiting annual emission submission before third-party verification assignment.',
      cars: [],
      remarks: 'Annual emissions data currently in Draft status.',
      documents: [],
      eadCorrectionDate: null,
    },
    'fac-5': {
      facilityName: 'Gulf Chemical Solutions LLC',
      facilityId: 'FAC-EAD-2026-0619',
      reportingYear: '2026',
      version: 'V1',
      totalEmissions: '68,200',
      submittedDate: '18-Feb-2026',
      updatedDate: '24-Feb-2026',
      verificationStatus: 'Rejected',
      verifierBody: 'SGS Gulf Limited',
      leadVerifier: 'Dr. Tariq Al Nuaimi',
      accreditationId: 'ENAS-CB-031',
      startDate: '2026-02-20',
      endDate: '2026-02-23',
      opinion: 'Adverse (Negative)',
      materialityThreshold: '2.0%',
      materialityFinding: 'Material misstatements exceed 8.5% due to unaccounted fugitive emissions.',
      cars: [],
      remarks: 'Verification rejected due to substantial data non-compliance.',
      documents: [{ name: 'SGS_Rejection_Notice_2026.pdf', size: '1.5MB', status: 'Uploaded' }],
      eadCorrectionDate: null,
    },
  }));

  const currentRecord = facilityVerifications[selectedFacilityId] || facilityVerifications['fac-1'];

  // Calculate Correction Deadline Helper
  const calculateDeadline = (eadDateStr: string | null) => {
    if (!eadDateStr) return '—';
    const parsed = new Date(eadDateStr);
    if (isNaN(parsed.getTime())) return 'Due: 90 Days from EAD Request';
    const deadline = new Date(parsed.getTime() + 90 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const formatted = deadline.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (diffDays < 0) {
      return `Overdue (${Math.abs(diffDays)} days late)`;
    }
    return `Due: ${formatted} (${diffDays} days left)`;
  };

  // Filtered List for Overview Table
  const filteredTableList = useMemo(() => {
    return Object.entries(facilityVerifications).filter(([facId, rec]) => {
      const matchesSearch =
        rec.facilityName.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        rec.facilityId.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        rec.verifierBody.toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'Reverted' && (rec.verificationStatus === 'Correction Required' || rec.verificationStatus === 'Reverted')) ||
        (statusFilter === 'Correction Required' && (rec.verificationStatus === 'Correction Required' || rec.verificationStatus === 'Reverted')) ||
        (statusFilter === 'Rejected' && (rec.verificationStatus === 'Rejected' || rec.verificationStatus.includes('Reject'))) ||
        rec.verificationStatus.toLowerCase().includes(statusFilter.toLowerCase());

      const matchesYear =
        yearFilter === 'ALL' ||
        rec.reportingYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [facilityVerifications, tableSearchTerm, statusFilter, yearFilter]);

  // Overview Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const totalPages = Math.ceil(filteredTableList.length / itemsPerPage) || 1;

  const paginatedTableList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTableList, currentPage, itemsPerPage]);

  const updateCurrentRecord = (updater: (prev: any) => any) => {
    setFacilityVerifications((prev) => ({
      ...prev,
      [selectedFacilityId]: updater(prev[selectedFacilityId] || prev['fac-1']),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Uploaded',
      }));
      updateCurrentRecord((rec) => ({
        ...rec,
        documents: [...(rec.documents || []), ...newFiles],
      }));
      setNoticeMessage('Verification statement attached successfully.');
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  const handleSaveDraft = () => {
    setNoticeMessage('Verification details saved as draft.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleReturnForCorrection = () => {
    updateCurrentRecord((rec) => ({
      ...rec,
      verificationStatus: 'Correction Required',
      eadCorrectionDate: '21-Sep-2026',
    }));
    setCtxVerificationStatus('Correction Required');
    setAnnualEmissionStatus('Correction Required');
    setNoticeMessage('Returned to Facility User for mandatory corrections.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);
  };

  const handleCompleteVerification = () => {
    if (!currentRecord.opinion || currentRecord.opinion === 'Pending Submission' || currentRecord.opinion === 'Under Assessment') {
      setOpinionError('Please select a valid Verifier Opinion (Unqualified, Qualified, or Adverse) before completing verification.');
      return;
    }

    setOpinionError(null);
    updateCurrentRecord((rec) => ({
      ...rec,
      verificationStatus: 'Verified & Approved',
      eadCorrectionDate: null,
    }));
    setCtxVerificationStatus('Verification Completed');
    setAnnualEmissionStatus('Under EAD Review');
    submitAnnualMRV();
    setNoticeMessage('Verification Completed & Verified Report Transmitted to EAD Final Review!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 4000);
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Top Header Row with Title, Search, Filter & Perform Verification Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight whitespace-nowrap">
              Verification
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Third-Party GHG Verification & Verification Statements — Independent validation of facility MRV annual emissions
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by facility, verifier..."
                value={tableSearchTerm}
                onChange={(e) => {
                  setTableSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all font-medium shadow-xs"
              />
              {tableSearchTerm && (
                <button
                  onClick={() => {
                    setTableSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending Assignment">Pending Assignment</option>
                <option value="In Progress">In Progress</option>
                <option value="Statement Submitted">Statement Submitted</option>
                <option value="Reverted">Reverted (Correction Required)</option>
                <option value="Correction Required">Correction Required</option>
                <option value="Verified & Approved">Verified & Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all cursor-pointer"
              >
                <option value="ALL">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL' || yearFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setYearFilter('ALL');
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Perform Verification Button */}
            <button
              onClick={() => {
                setSelectedFacilityId('fac-1');
                setViewMode('review');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Perform Verification</span>
            </button>
          </div>
        </div>

        {/* Level 1 Card Container with All Facilities Table & Pagination */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Inset Container with Padding and Rounded Border */}
          <div className="p-3 sm:p-3.5 flex-1 min-h-0 flex flex-col justify-between">
            <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white">
              <div className="h-full overflow-y-auto no-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-10 shadow-xs">
                    <tr className="h-[38px] bg-[#6692B7]/30 text-slate-800 font-bold text-xs border-b border-[#6692B7]/20 sticky top-0 z-10 shadow-xs">
                      <th className="h-[38px] px-3 w-10 text-center font-bold align-middle">#</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Facility Name</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Facility ID</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Reporting Year</th>
                      <th className="h-[38px] px-3 font-bold text-center align-middle">Version</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Total Emissions (tCO₂e)</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Submitted Date</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Verification Status</th>
                      <th className="h-[38px] px-3 font-bold align-middle">Updated Date</th>
                      <th className="h-[38px] px-3 text-right whitespace-nowrap font-bold align-middle">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginatedTableList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="h-[60px] py-8 text-center text-slate-400 italic font-medium align-middle">
                          No verification records match your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedTableList.map(([facId, rec], index) => {
                        const actualIdx = (currentPage - 1) * itemsPerPage + index + 1;
                        return (
                          <tr key={facId} className="h-[60px] hover:bg-slate-50/70 transition-colors">
                            <td className="h-[60px] px-3 text-center font-mono text-slate-400 font-medium align-middle">
                              {actualIdx}
                            </td>
                            <td className="h-[60px] px-3 font-semibold text-slate-900 leading-snug align-middle">
                              <span>{rec.facilityName}</span>
                            </td>
                            <td className="h-[60px] px-3 font-mono text-slate-600 text-[11px] align-middle">
                              {rec.facilityId}
                            </td>
                            <td className="h-[60px] px-3 font-medium text-slate-700 align-middle">
                              {rec.reportingYear}
                            </td>
                            <td className="h-[60px] px-3 text-center whitespace-nowrap align-middle">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {rec.version}
                              </span>
                            </td>
                            <td className="h-[60px] px-3 font-mono font-bold text-[#004B87] align-middle">
                              {rec.totalEmissions}
                            </td>
                            <td className="h-[60px] px-3 text-slate-600 font-medium align-middle">
                              {rec.submittedDate}
                            </td>
                            <td className="h-[60px] px-3 text-left whitespace-nowrap align-middle">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-block ${
                                  rec.verificationStatus === 'Verified & Approved'
                                    ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60 font-bold'
                                    : rec.verificationStatus === 'In Progress'
                                    ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 font-bold'
                                    : rec.verificationStatus === 'Correction Required' || rec.verificationStatus === 'Reverted'
                                    ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                                    : rec.verificationStatus === 'Rejected'
                                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                                }`}
                              >
                                {rec.verificationStatus}
                              </span>
                            </td>
                            <td className="h-[60px] px-3 text-slate-600 font-medium align-middle">
                              {rec.updatedDate}
                            </td>
                            <td className="h-[60px] px-3 text-right whitespace-nowrap align-middle">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedFacilityId(facId);
                                    setActiveFacilityId(facId);
                                    setViewMode('view');
                                  }}
                                  title="View Verification Statement (Read-Only)"
                                  className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedFacilityId(facId);
                                    setActiveFacilityId(facId);
                                    setViewMode('review');
                                  }}
                                  title="Review / Perform Verification"
                                  className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <ShieldCheck className="w-4 h-4" />
                                </button>
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

            {/* Pagination Controls & Inset Footer */}
            <div className="flex-shrink-0 pt-2.5 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-3">
                <span>
                  Showing {filteredTableList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredTableList.length)} of {filteredTableList.length} records
                </span>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <span className="text-[11px] text-slate-400">Rows per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value={7}>7</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#004B87] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. READ-ONLY VIEW INSPECTOR (viewMode === 'view')
  // =========================================================================
  if (viewMode === 'view') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans space-y-2">
        {/* Top Header */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-display text-[#004B87] tracking-tight">
                Verification Record — Read-Only Inspection
              </h1>
              <p className="text-xs text-slate-500">
                {currentRecord.facilityName} ({currentRecord.facilityId}) • Verifier: {currentRecord.verifierBody}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentRecord.verificationStatus === 'Verified & Approved'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentRecord.verificationStatus === 'In Progress'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : currentRecord.verificationStatus === 'Correction Required' || currentRecord.verificationStatus === 'Reverted'
                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                  : currentRecord.verificationStatus === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Status: {currentRecord.verificationStatus}
            </span>
            <button
              onClick={() => setViewMode('review')}
              className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit / Review</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-1 text-xs no-scrollbar">
          {/* Verifier Details Card */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="font-bold text-[#004B87] flex items-center justify-between">
              <span>1. Accredited Verification Body & Lead Verifier</span>
              <span className="text-[11px] font-mono text-slate-500">Accreditation: {currentRecord.accreditationId}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="block text-slate-500 text-[11px]">Verification Body</span>
                <span className="font-semibold text-slate-900">{currentRecord.verifierBody}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px]">Lead Verifier</span>
                <span className="font-semibold text-slate-900">{currentRecord.leadVerifier}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px]">Verification Period</span>
                <span className="font-semibold text-slate-900">{currentRecord.startDate} to {currentRecord.endDate}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px]">Verifier Opinion</span>
                <span className="font-bold text-emerald-700">{currentRecord.opinion}</span>
              </div>
            </div>
          </div>

          {/* Materiality Assessment */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="font-bold text-[#004B87]">2. Materiality Assessment & Findings</div>
            <p className="text-slate-800 leading-relaxed">{currentRecord.materialityFinding}</p>
            <div className="text-[11px] text-slate-500 font-medium pt-1">
              Regulatory Materiality Threshold: <span className="font-bold text-slate-700">{currentRecord.materialityThreshold}</span>
            </div>
          </div>

          {/* Corrective Action Requests (CARs) */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-bold text-[#004B87]">
              3. Non-Conformities & Corrective Action Requests (CARs)
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                    <th className="py-2 px-2">CAR ID</th>
                    <th className="py-2 px-2">Finding / Requirement</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Verified Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecord.cars && currentRecord.cars.length > 0 ? (
                    currentRecord.cars.map((car: any, idx: number) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 font-mono font-bold text-[#004B87]">{car.id}</td>
                        <td className="py-2 px-2 text-slate-800">{car.description}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            car.status === 'Closed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-600">{car.verifiedDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 italic">No CARs issued for this facility.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Statement Documents */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="font-bold text-[#004B87]">4. Uploaded Verification Statement & Reports</div>
            {currentRecord.documents && currentRecord.documents.length > 0 ? (
              <div className="space-y-2">
                {currentRecord.documents.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">{doc.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{doc.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No verification statement attached yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  }

  // =========================================================================
  // 3. VERIFICATION WORKSPACE REVIEW VIEW (viewMode === 'review')
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Top Header */}
      <div className="flex-shrink-0 space-y-2 pb-2 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold font-display text-[#004B87] tracking-tight">
                Third-Party Verification Workspace
              </h1>
              <p className="text-[11px] text-slate-500">
                Facility: {currentRecord.facilityName} ({currentRecord.facilityId}) • Total: {currentRecord.totalEmissions} tCO₂e
              </p>
            </div>

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{noticeMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('view')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Preview Statement</span>
            </button>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentRecord.verificationStatus === 'Verified & Approved'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentRecord.verificationStatus === 'In Progress'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : currentRecord.verificationStatus === 'Correction Required' || currentRecord.verificationStatus === 'Reverted'
                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                  : currentRecord.verificationStatus === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentRecord.verificationStatus}
            </span>
          </div>
        </div>

        {/* Facility Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Facility</label>
            <select
              value={selectedFacilityId}
              onChange={(e) => {
                setSelectedFacilityId(e.target.value);
                setActiveFacilityId(e.target.value);
              }}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-[#004B87] cursor-pointer"
            >
              {Object.entries(facilityVerifications).map(([id, v]) => (
                <option key={id} value={id}>
                  {v.facilityName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reporting Year</label>
            <input
              type="text"
              readOnly
              value={currentRecord.reportingYear}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Reported Emissions</label>
            <input
              type="text"
              readOnly
              value={`${currentRecord.totalEmissions} tCO₂e`}
              className="w-full px-3 py-1.5 bg-emerald-50/50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Verification Status</label>
            <input
              type="text"
              readOnly
              value={currentRecord.verificationStatus}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Verification Workspace Form */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-[18px] pr-1 text-xs no-scrollbar">
          {opinionError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{opinionError}</span>
            </div>
          )}

          {/* Section 1: Verifier Identification */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="font-bold text-[#004B87]">1. Verifier Body & Lead Auditor Credentials</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verification Body Name</label>
                <input
                  type="text"
                  value={currentRecord.verifierBody}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, verifierBody: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#004B87]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lead Verifier Name</label>
                <input
                  type="text"
                  value={currentRecord.leadVerifier}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, leadVerifier: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#004B87]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">ENAS Accreditation ID</label>
                <input
                  type="text"
                  value={currentRecord.accreditationId}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, accreditationId: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-[#004B87]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verifier Opinion</label>
                <select
                  value={currentRecord.opinion}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, opinion: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#004B87] cursor-pointer"
                >
                  <option value="Unqualified (Positive)">Unqualified (Positive / Unmodified)</option>
                  <option value="Qualified">Qualified (Material with exceptions)</option>
                  <option value="Adverse">Adverse (Non-compliant)</option>
                  <option value="Disclaimer of Opinion">Disclaimer of Opinion</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verification Start Date</label>
                <input
                  type="date"
                  value={currentRecord.startDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, startDate: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Verification End Date</label>
                <input
                  type="date"
                  value={currentRecord.endDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentRecord((r) => ({ ...r, endDate: val }));
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Materiality Assessment */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="font-bold text-[#004B87]">2. Materiality Assessment & Findings</div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Materiality Finding Details</label>
              <textarea
                rows={3}
                value={currentRecord.materialityFinding}
                onChange={(e) => {
                  const val = e.target.value;
                  updateCurrentRecord((r) => ({ ...r, materialityFinding: val }));
                }}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#004B87]"
              />
            </div>
          </div>

          {/* Section 3: Verification Statement Upload */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#004B87]">3. Verification Statement (PDF Signed)</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#004B87] text-white rounded-lg text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Statement</span>
              </button>
            </div>
            {currentRecord.documents && currentRecord.documents.length > 0 ? (
              <div className="space-y-2">
                {currentRecord.documents.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">{doc.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{doc.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">No statement attached. Upload signed verification certificate.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex-shrink-0 pt-2 pb-1 flex items-center justify-end gap-2.5">
        <button
          onClick={() => setViewMode('table')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSaveDraft}
          className="px-5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <span>Save Draft</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={handleReturnForCorrection}
          className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
          <span>Return for Correction</span>
        </button>

        <button
          onClick={handleCompleteVerification}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Complete Verification & Transmit to EAD</span>
        </button>
      </div>
    </div>
  );
};
