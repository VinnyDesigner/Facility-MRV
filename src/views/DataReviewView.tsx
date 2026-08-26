import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  Edit,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  X,
  Check,
  FileText,
  Download,
  UploadCloud,
  ArrowUpDown,
  Building2,
  ShieldCheck,
  Activity,
  Send,
  ArrowLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

interface SubmissionRecord {
  id: number;
  submissionId: string;
  facility: string;
  facilityNameFull: string;
  reportingEntity: string;
  sector: string;
  subSector: string;
  tierLevel: string;
  reportingYear: string;
  version: string;
  lastUpdated: string;
  submittedBy: string;
  reviewedBy: string;
  reviewDate: string;
  reviewStatus: 'Submitted' | 'Approved' | 'Correction Requested' | 'Rejected';
  correctionDeadline: string | null;
}

export const DataReviewView: React.FC = () => {
  const { setActiveView } = useMRV();

  // Selected Submission for Detail View (null = list view, string = detail view)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Detail View Sub-Tab: 'details' | 'history'
  const [detailTab, setDetailTab] = useState<'details' | 'history'>('details');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntity, setFilterEntity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Sorting
  const [sortKey, setSortKey] = useState<keyof SubmissionRecord>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Version Comparison selector in History tab
  const [compareFrom, setCompareFrom] = useState('V1');
  const [compareTo, setCompareTo] = useState('V3');

  // Action status banner
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // SUBMISSION RECORDS DATA (Screenshot 1)
  // -------------------------------------------------------------------------
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([
    {
      id: 1,
      submissionId: 'SUB-2026-001',
      facility: 'Green Mountain Cement',
      facilityNameFull: 'Green Mountain Holdings LLC',
      reportingEntity: 'Mountain Group',
      sector: 'Energy',
      subSector: 'Cement Production',
      tierLevel: 'T1',
      reportingYear: '2026',
      version: 'V3',
      lastUpdated: '16-Jul-2026',
      submittedBy: 'Ahmed Ali (Facility User)',
      reviewedBy: 'Sara Khan',
      reviewDate: '31-Jul-2026 04:30 PM',
      reviewStatus: 'Submitted',
      correctionDeadline: null,
    },
    {
      id: 2,
      submissionId: 'SUB-2026-002',
      facility: 'ADNOC Refinery',
      facilityNameFull: 'ADNOC Refining Complex',
      reportingEntity: 'ADNOC',
      sector: 'Energy',
      subSector: 'Petroleum Refining',
      tierLevel: 'T2',
      reportingYear: '2026',
      version: 'V2',
      lastUpdated: '18-Jul-2026',
      submittedBy: 'Mariam Al Zaabi',
      reviewedBy: 'Sara Khan',
      reviewDate: '24-Jul-2026',
      reviewStatus: 'Approved',
      correctionDeadline: null,
    },
    {
      id: 3,
      submissionId: 'SUB-2026-003',
      facility: 'Emirates Steel',
      facilityNameFull: 'Emirates Steel Arkan Industrial',
      reportingEntity: 'Emirates Group',
      sector: 'IPPU',
      subSector: 'Iron & Steel Manufacturing',
      tierLevel: 'T1',
      reportingYear: '2026',
      version: 'V3',
      lastUpdated: '20-Jul-2026',
      submittedBy: 'Tariq Mansoor',
      reviewedBy: 'Sara Khan',
      reviewDate: '22-Jul-2026',
      reviewStatus: 'Correction Requested',
      correctionDeadline: '19-Aug-2026 (29 days left)',
    },
    {
      id: 4,
      submissionId: 'SUB-2026-004',
      facility: 'Al Ain Waste Facility',
      facilityNameFull: 'Al Ain Integrated Waste Management',
      reportingEntity: 'Municipality',
      sector: 'Waste',
      subSector: 'Municipal Solid Waste Disposal',
      tierLevel: 'T1',
      reportingYear: '2026',
      version: 'V1',
      lastUpdated: '22-Jul-2026',
      submittedBy: 'Saeed Al Dhaheri',
      reviewedBy: 'Sara Khan',
      reviewDate: '25-Jul-2026',
      reviewStatus: 'Approved',
      correctionDeadline: null,
    },
    {
      id: 5,
      submissionId: 'SUB-2026-005',
      facility: 'National Cement',
      facilityNameFull: 'National Cement Factory PJSC',
      reportingEntity: 'Mountain Group',
      sector: 'IPPU',
      subSector: 'Clinker Production',
      tierLevel: 'T3',
      reportingYear: '2026',
      version: 'V3',
      lastUpdated: '26-Jul-2026',
      submittedBy: 'Khalfan Al Mazrouei',
      reviewedBy: 'Sara Khan',
      reviewDate: '28-Jul-2026',
      reviewStatus: 'Rejected',
      correctionDeadline: null,
    },
    {
      id: 6,
      submissionId: 'SUB-2026-006',
      facility: 'Emirates Steel',
      facilityNameFull: 'Emirates Steel Rolling Mills',
      reportingEntity: 'Emirates Group',
      sector: 'IPPU',
      subSector: 'Direct Reduced Iron',
      tierLevel: 'T1',
      reportingYear: '2026',
      version: 'V4',
      lastUpdated: '30-Jul-2026',
      submittedBy: 'Tariq Mansoor',
      reviewedBy: 'Sara Khan',
      reviewDate: '31-Jul-2026',
      reviewStatus: 'Approved',
      correctionDeadline: null,
    },
  ]);

  // Active Selected Submission Object
  const currentRecord = useMemo(() => {
    return (
      submissionsList.find((s) => s.submissionId === selectedSubmissionId) ||
      submissionsList[0]
    );
  }, [selectedSubmissionId, submissionsList]);

  // Filtered & Sorted Submissions
  const filteredSubmissions = useMemo(() => {
    return submissionsList
      .filter((item) => {
        const matchesSearch =
          searchTerm === '' ||
          item.submissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.reportingEntity.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesEntity =
          filterEntity === 'All' || item.reportingEntity === filterEntity;

        const matchesStatus =
          filterStatus === 'All' || item.reviewStatus === filterStatus;

        return matchesSearch && matchesEntity && matchesStatus;
      })
      .sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortAsc ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [submissionsList, searchTerm, filterEntity, filterStatus, sortKey, sortAsc]);

  const handleSort = (key: keyof SubmissionRecord) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAction = (type: 'approve' | 'reject' | 'correction' | 'submit') => {
    if (type === 'approve') {
      setActionNotice(`Submission ${currentRecord.submissionId} Approved successfully.`);
      setSubmissionsList((prev) =>
        prev.map((s) =>
          s.submissionId === currentRecord.submissionId
            ? { ...s, reviewStatus: 'Approved' }
            : s
        )
      );
    } else if (type === 'reject') {
      setActionNotice(`Submission ${currentRecord.submissionId} marked as Rejected.`);
      setSubmissionsList((prev) =>
        prev.map((s) =>
          s.submissionId === currentRecord.submissionId
            ? { ...s, reviewStatus: 'Rejected' }
            : s
        )
      );
    } else if (type === 'correction') {
      setActionNotice(`Correction notice issued for ${currentRecord.submissionId}. 30-day window started.`);
      setSubmissionsList((prev) =>
        prev.map((s) =>
          s.submissionId === currentRecord.submissionId
            ? {
                ...s,
                reviewStatus: 'Correction Requested',
                correctionDeadline: '25-Sep-2026 (30 days left)',
              }
            : s
        )
      );
    } else if (type === 'submit') {
      setActionNotice(`All pending review dossiers have been queued for statutory certification.`);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP FIXED HEADER (Title & Global Controls) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Title & Action Notifications */}
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Data Review
          </h1>

          {actionNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{actionNotice}</span>
            </div>
          )}

          {exportNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-700 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Search & Export */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-xs"
            />
            <Calendar className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
            >
              <option value="All">Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Correction Requested">Correction Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={() => {
              setExportNotice('Exporting Data Review dossier package...');
              setTimeout(() => setExportNotice(null), 3000);
            }}
            className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#142944] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN WHITE CARD FRAME (Contains table list or submission details) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col overflow-hidden">
        {selectedSubmissionId === null ? (
          /* ========================================================================= */
          /* VIEW 1: DATA REVIEW TABLE LIST VIEW (Screenshot 1) */
          /* ========================================================================= */
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                    <th
                      onClick={() => handleSort('id')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors w-10 text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>#</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('submissionId')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Submission ID</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('facility')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Facility</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('reportingEntity')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Reporting Entity</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('sector')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Sector</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('tierLevel')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Tier Level</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('reportingYear')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Reporting Year</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('version')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Version</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('lastUpdated')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Last Updated</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('reviewStatus')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Review Status</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('correctionDeadline')}
                      className="py-3.5 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Correction Deadline</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredSubmissions.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedSubmissionId(row.submissionId)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-3 text-slate-500 text-center">{row.id}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{row.submissionId}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{row.facility}</td>
                      <td className="py-3.5 px-3 text-slate-600">{row.reportingEntity}</td>
                      <td className="py-3.5 px-3 text-slate-600">{row.sector}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-700">{row.tierLevel}</td>
                      <td className="py-3.5 px-3 text-slate-600">{row.reportingYear}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-600 text-center">{row.version}</td>
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{row.lastUpdated}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {row.reviewStatus === 'Submitted' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-block min-w-[95px]">
                            Submitted
                          </span>
                        )}
                        {row.reviewStatus === 'Approved' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E8F8F0] text-[#16A34A] border border-emerald-200/60 inline-block min-w-[95px]">
                            Approved
                          </span>
                        )}
                        {row.reviewStatus === 'Correction Requested' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E2E8F0] text-[#475569] border border-slate-300/80 inline-block min-w-[130px]">
                            Correction Requested
                          </span>
                        )}
                        {row.reviewStatus === 'Rejected' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 inline-block min-w-[95px]">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {row.correctionDeadline ? (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{row.correctionDeadline}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubmissionId(row.submissionId);
                            }}
                            title="View Submission Dossier"
                            className="p-1 rounded-md text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {row.reviewStatus === 'Correction Requested' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveView('data-entry');
                              }}
                              title="Edit Correction Data"
                              className="p-1 rounded-md text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Action Footer Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => handleAction('submit')}
                className="px-6 py-2.5 bg-[#1E3A5F] hover:bg-[#152943] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Submit</span>
                <Bookmark className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: SUBMISSION DETAIL & AUDIT DOSSIER (Screenshots 2, 3, 4) */
          /* ========================================================================= */
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-4">
            {/* Top Summary Info Card */}
            <div className="flex-shrink-0 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedSubmissionId(null)}
                  className="flex items-center gap-2 text-xs font-bold text-[#004B87] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Submissions List</span>
                </button>
                <div className="text-xs text-slate-500 font-semibold">
                  Viewing Dossier: <span className="font-mono text-navy-950 font-bold">{currentRecord.submissionId}</span>
                </div>
              </div>

              {/* 2-Row Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1 border-t border-slate-100">
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Submission ID</span>
                  <span className="font-bold text-navy-950">{currentRecord.submissionId}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Facility Name</span>
                  <span className="font-bold text-navy-950 truncate block">{currentRecord.facilityNameFull}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Reporting Entity</span>
                  <span className="font-bold text-navy-950">{currentRecord.reportingEntity}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Sector</span>
                  <span className="font-bold text-navy-950">{currentRecord.sector}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Reporting Year</span>
                  <span className="font-bold text-navy-950 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {currentRecord.reportingYear}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Status</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-[#E0EEFA] text-[#0284C7]">
                    {currentRecord.reviewStatus}
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Submitted By</span>
                  <span className="font-semibold text-slate-700">{currentRecord.submittedBy}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Last updated</span>
                  <span className="font-semibold text-slate-700">31-Jul-2026 04:30 PM</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Calculation Approach</span>
                  <span className="font-semibold text-slate-700">{currentRecord.tierLevel}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Version</span>
                  <span className="font-bold text-navy-950 font-mono">{currentRecord.version}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Approved By</span>
                  <span className="font-semibold text-slate-700">{currentRecord.reviewedBy}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Approved On</span>
                  <span className="font-semibold text-slate-700">{currentRecord.reviewDate}</span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Submission Details & Submission History */}
            <div className="flex-shrink-0 flex items-center gap-6 border-b border-slate-100 pb-2 text-xs font-semibold">
              <button
                onClick={() => setDetailTab('details')}
                className={`pb-2 font-bold transition-all relative cursor-pointer ${
                  detailTab === 'details'
                    ? 'text-[#004B87] border-b-2 border-[#004B87]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Submission Details
              </button>
              <button
                onClick={() => setDetailTab('history')}
                className={`pb-2 font-bold transition-all relative cursor-pointer ${
                  detailTab === 'history'
                    ? 'text-[#004B87] border-b-2 border-[#004B87]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Submission History
              </button>
            </div>

            {/* Scrollable Detail Body */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6 pr-1 pb-6">
              {detailTab === 'details' ? (
                /* ========================================================================= */
                /* TAB A: SUBMISSION DETAILS (Screenshots 2 & 3) */
                /* ========================================================================= */
                <div className="space-y-5 animate-fade-in text-xs">
                  {/* 1. Facility Information Card */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-4 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Facility Information</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <span className="block text-slate-400 font-medium">Facility Name</span>
                        <span className="font-semibold text-slate-800">{currentRecord.facility}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Facility ID</span>
                        <span className="font-semibold text-slate-800">FAC-001</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Reporting Entity</span>
                        <span className="font-semibold text-slate-800">{currentRecord.reportingEntity}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Sector</span>
                        <span className="font-semibold text-slate-800">{currentRecord.sector}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Sub-sector / Activity</span>
                        <span className="font-semibold text-slate-800">{currentRecord.subSector}</span>
                      </div>

                      <div>
                        <span className="block text-slate-400 font-medium">Facility Type</span>
                        <span className="font-semibold text-slate-800">Industrial Manufacturing Facility</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Emirate / Region</span>
                        <span className="font-semibold text-slate-800">Abu Dhabi</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Address</span>
                        <span className="font-semibold text-slate-800">Al Ain, Abu Dhabi, UAE</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Location Coordinates</span>
                        <span className="font-semibold text-slate-800 font-mono">24.2075N, 55.7447E</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Operational Status</span>
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-700 text-xs">Facility Contact</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="block text-slate-400 font-medium">GHG Manager</span>
                          <span className="font-semibold text-slate-800">Ahmed Ali</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-medium">Email</span>
                          <span className="font-semibold text-slate-800">ahmed.ali@mountaingroup.ae</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-medium">Phone</span>
                          <span className="font-semibold text-slate-800 font-mono">+971 50 123 4567</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Monitoring Plan Card */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Monitoring Plan</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#E9F1F8] text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2.5 px-3">Monitoring Approach</th>
                            <th className="py-2.5 px-3">Monitoring Method</th>
                            <th className="py-2.5 px-3">Parameter / Gas</th>
                            <th className="py-2.5 px-3">Unit</th>
                            <th className="py-2.5 px-3">Data Source</th>
                            <th className="py-2.5 px-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          <tr>
                            <td className="py-2.5 px-3">Calculation-Based Monitoring</td>
                            <td className="py-2.5 px-3">IPCC Guidelines Tier 1</td>
                            <td className="py-2.5 px-3">CO₂</td>
                            <td className="py-2.5 px-3">tCO₂e</td>
                            <td className="py-2.5 px-3">Fuel Consumption Records</td>
                            <td className="py-2.5 px-3 text-slate-600">Based on fuel usage and IPCC emission factors.</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3">Calculation-Based Monitoring</td>
                            <td className="py-2.5 px-3">IPCC Guidelines Tier 2</td>
                            <td className="py-2.5 px-3">CH₄</td>
                            <td className="py-2.5 px-3">tCO₂e</td>
                            <td className="py-2.5 px-3">Production Process Data</td>
                            <td className="py-2.5 px-3 text-slate-600">Based on material balance and emission factors.</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3">Measurement-Based Monitoring</td>
                            <td className="py-2.5 px-3">CEMS</td>
                            <td className="py-2.5 px-3">CO₂</td>
                            <td className="py-2.5 px-3">tCO₂e</td>
                            <td className="py-2.5 px-3">CEMS Data</td>
                            <td className="py-2.5 px-3 text-slate-600">Real-time monitoring from stack emissions.</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3">Fallback Method</td>
                            <td className="py-2.5 px-3">Engineering Judgment</td>
                            <td className="py-2.5 px-3">N₂O</td>
                            <td className="py-2.5 px-3">tCO₂e</td>
                            <td className="py-2.5 px-3">Process Data</td>
                            <td className="py-2.5 px-3 text-slate-600">Used when primary monitoring data is unavailable.</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3">Methane Monitoring</td>
                            <td className="py-2.5 px-3">LDAR</td>
                            <td className="py-2.5 px-3">CH₄</td>
                            <td className="py-2.5 px-3">tCO₂e</td>
                            <td className="py-2.5 px-3">LDAR Reports</td>
                            <td className="py-2.5 px-3 text-slate-600">Methane leak detection surveys and reporting.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Verification Information & QA/QC Summary */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-4 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Verification Information</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <span className="block text-slate-400 font-medium">Verification Body</span>
                        <span className="font-semibold text-slate-800">DNV Business Assurance</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Verification Type</span>
                        <span className="font-semibold text-slate-800">Third-Party Verification</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Verification Frequency</span>
                        <span className="font-semibold text-slate-800">Annual</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Last Verification Date</span>
                        <span className="font-semibold text-slate-800">10-Jun-2026</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Next Verification Date</span>
                        <span className="font-semibold text-slate-800">09-Jun-2026</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <h4 className="font-bold text-slate-700 text-xs">QA / QC Summary</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <span className="block text-slate-400 font-medium">QA/QC Procedure</span>
                          <span className="font-semibold text-slate-800">Data Accuracy Check</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-medium">Uncertainty Assessment</span>
                          <span className="font-semibold text-slate-800">Performed</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-medium">Data Gaps</span>
                          <span className="font-semibold text-slate-800">None Identified</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-medium">Internal Review</span>
                          <span className="inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Mitigation Measures Card */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Mitigation Measures</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#E9F1F8] text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2.5 px-3">Measure Title</th>
                            <th className="py-2.5 px-3">Description</th>
                            <th className="py-2.5 px-3">Implementation Status</th>
                            <th className="py-2.5 px-3">Expected Reduction (tCO₂e/Year)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Energy Efficiency Improvement</td>
                            <td className="py-2.5 px-3 text-slate-600">Upgrade to high-efficiency motors and equipment</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                In Progress
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold">12,500</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Alternative Fuel Usage</td>
                            <td className="py-2.5 px-3 text-slate-600">Use of alternative fuels in cement kiln</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px]">
                                Planned
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold">8,000</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Waste Heat Recovery</td>
                            <td className="py-2.5 px-3 text-slate-600">Install waste heat recovery system</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                                Completed
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold">5,200</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Process Optimization</td>
                            <td className="py-2.5 px-3 text-slate-600">Optimize production process to reduce emissions</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                In Progress
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-semibold">3,800</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 5. Emission Summary Card */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Emission Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div>
                        <span className="block text-slate-400 font-medium">Total GHG Emissions (tCO₂e)</span>
                        <span className="font-bold text-slate-900 text-sm">24,589.10</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Change from Previous Submission</span>
                        <span className="font-semibold text-emerald-600">↓ 2.12% Decrease</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">CO₂ Emissions (tCO₂e)</span>
                        <span className="font-bold text-slate-900">24,450.00</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">CH₄ Emissions (tCO₂e)</span>
                        <span className="font-bold text-slate-900">112.40</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">N₂O Emissions (tCO₂e)</span>
                        <span className="font-bold text-slate-900">26.70</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Total Emission Sources</span>
                        <span className="font-bold text-slate-900">8</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-medium">Major Source</span>
                        <span className="font-bold text-slate-900">Electric Arc Furnace</span>
                      </div>
                    </div>
                  </div>

                  {/* 6. Supporting Documents & Review Decision (2 Columns) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Left: Supporting Documents Table */}
                    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs">
                      <h3 className="font-bold text-slate-900 text-sm">Supporting Documents</h3>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#E9F1F8] text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2 px-3">File Name</th>
                            <th className="py-2 px-3">Category</th>
                            <th className="py-2 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          <tr>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">Monitoring_Plan_Workbook.xlsx</td>
                            <td className="py-2.5 px-3 text-slate-600">Monitoring Plan</td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-500">
                                <button className="hover:text-[#004B87]"><Eye className="w-3.5 h-3.5" /></button>
                                <button className="hover:text-[#004B87]"><Download className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">Emission_Factor_Calculation.pdf</td>
                            <td className="py-2.5 px-3 text-slate-600">Methodology</td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-500">
                                <button className="hover:text-[#004B87]"><Eye className="w-3.5 h-3.5" /></button>
                                <button className="hover:text-[#004B87]"><Download className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">QA_QC_Procedure.pdf</td>
                            <td className="py-2.5 px-3 text-slate-600">QA/QC</td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-2 text-slate-500">
                                <button className="hover:text-[#004B87]"><Eye className="w-3.5 h-3.5" /></button>
                                <button className="hover:text-[#004B87]"><Download className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Right: Review Decision Card */}
                    <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm mb-2">Review Decision Summary</h3>
                        <div className="grid grid-cols-3 gap-2 text-[11px] pb-3 border-b border-slate-100">
                          <div>
                            <span className="block text-slate-400">Reviewed By</span>
                            <span className="font-semibold text-slate-800">Sara Khan</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Review Date</span>
                            <span className="font-semibold text-slate-800">31-Jul-2026 10:45 AM</span>
                          </div>
                          <div>
                            <span className="block text-slate-400">Submission Version</span>
                            <span className="font-bold text-navy-950">V3 (Latest Version)</span>
                          </div>
                        </div>

                        {/* Callout Box */}
                        <div className="mt-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Approved Successfully</span>
                          </div>
                          <p className="text-[11px] text-emerald-900 leading-relaxed">
                            All review observations have been addressed successfully. The Monitoring Plan complies with the Facility MRV Guidelines and is approved.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action CTA Bar */}
                  <div className="pt-4 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100">
                    <button
                      onClick={() => handleAction('correction')}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                      <span>Correction Requested</span>
                    </button>
                    <button
                      onClick={() => handleAction('reject')}
                      className="px-4 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleAction('approve')}
                      className="px-6 py-2 bg-[#2D5B88] hover:bg-[#23486E] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ========================================================================= */
                /* TAB B: SUBMISSION HISTORY & VERSION COMPARISON (Screenshot 4) */
                /* ========================================================================= */
                <div className="space-y-6 animate-fade-in text-xs">
                  {/* 1. Submission Versions Table */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-3 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Submission Versions</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#E9F1F8] text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2.5 px-3">Version</th>
                            <th className="py-2.5 px-3">Submitted By</th>
                            <th className="py-2.5 px-3">Submitted Date</th>
                            <th className="py-2.5 px-3">Review Decision</th>
                            <th className="py-2.5 px-3">Reviewed By</th>
                            <th className="py-2.5 px-3">Review Date</th>
                            <th className="py-2.5 px-3">Reviewer Comments</th>
                            <th className="py-2.5 px-3">Facility Response</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          <tr>
                            <td className="py-3 px-3 font-mono font-bold text-[#004B87]">V3 (Current)</td>
                            <td className="py-3 px-3">Ahmed Ali</td>
                            <td className="py-3 px-3">29-Jul-2026</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                                Approved
                              </span>
                            </td>
                            <td className="py-3 px-3">Sara Khan</td>
                            <td className="py-3 px-3">31-Jul-2026</td>
                            <td className="py-3 px-3 text-slate-600">All review observations have been addressed successfully.</td>
                            <td className="py-3 px-3 text-slate-400">-</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
                                Approved
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-mono font-bold text-slate-700">V2</td>
                            <td className="py-3 px-3">Ahmed Ali</td>
                            <td className="py-3 px-3">22-Jul-2026</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold text-[11px]">
                                Request Correction
                              </span>
                            </td>
                            <td className="py-3 px-3">Sara Khan</td>
                            <td className="py-3 px-3">24-Jul-2026</td>
                            <td className="py-3 px-3 text-slate-600">QA/QC procedure requires additional clarification and uncertainty assessment.</td>
                            <td className="py-3 px-3 text-slate-600">QA/QC documentation updated and resubmitted.</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px]">
                                Resolved
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 font-mono font-bold text-slate-700">V1</td>
                            <td className="py-3 px-3">Ahmed Ali</td>
                            <td className="py-3 px-3">15-Jul-2026</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-semibold text-[11px]">
                                Request Correction
                              </span>
                            </td>
                            <td className="py-3 px-3">Sara Khan</td>
                            <td className="py-3 px-3">17-Jul-2026</td>
                            <td className="py-3 px-3 text-slate-600">Emission factor calculation sheet and supporting documents are missing.</td>
                            <td className="py-3 px-3 text-slate-600">Uploaded the required calculation sheet and supporting documents.</td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px]">
                                Resolved
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Facility Information Version Comparison */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900 text-sm">Facility Information Comparison</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium text-xs">From</span>
                          <select
                            value={compareFrom}
                            onChange={(e) => setCompareFrom(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                          >
                            <option value="V1">V1 (15-Jul-2026)</option>
                            <option value="V2">V2 (22-Jul-2026)</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-medium text-xs">To</span>
                          <select
                            value={compareTo}
                            onChange={(e) => setCompareTo(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                          >
                            <option value="V3">V3 (29-Jul-2026)</option>
                            <option value="V2">V2 (22-Jul-2026)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#E9F1F8] text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2.5 px-3">Section</th>
                            <th className="py-2.5 px-3">Field</th>
                            <th className="py-2.5 px-3">Version V1</th>
                            <th className="py-2.5 px-3">Version V3</th>
                            <th className="py-2.5 px-3 text-center">Change</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Monitoring Plan</td>
                            <td className="py-2.5 px-3 text-slate-600">Monitoring Method</td>
                            <td className="py-2.5 px-3 text-slate-500">IPCC Guidelines Tier 1</td>
                            <td className="py-2.5 px-3 text-slate-900 font-semibold">IPCC Guidelines Tier 2</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                Modified
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Monitoring Plan</td>
                            <td className="py-2.5 px-3 text-slate-600">Data Source</td>
                            <td className="py-2.5 px-3 text-slate-500">Fuel Consumption Records</td>
                            <td className="py-2.5 px-3 text-slate-900 font-semibold">Fuel Consumption Records (Verified)</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                Modified
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Verification & QA</td>
                            <td className="py-2.5 px-3 text-slate-600">QA/QC Procedure</td>
                            <td className="py-2.5 px-3 text-slate-500">Data Accuracy Check</td>
                            <td className="py-2.5 px-3 text-slate-900 font-semibold">Data Accuracy Check + Uncertainty Assessment</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                Modified
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Verification & QA</td>
                            <td className="py-2.5 px-3 text-slate-600">Internal Review</td>
                            <td className="py-2.5 px-3 text-slate-500">Pending</td>
                            <td className="py-2.5 px-3 text-emerald-700 font-semibold">Completed</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                Modified
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Mitigation Measures</td>
                            <td className="py-2.5 px-3 text-slate-600">Energy Efficiency Improvement</td>
                            <td className="py-2.5 px-3 text-slate-500">11,500 tCO₂e/Year</td>
                            <td className="py-2.5 px-3 text-slate-900 font-semibold">12,500 tCO₂e/Year</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                                Modified
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Supporting Documents</td>
                            <td className="py-2.5 px-3 text-slate-600">Emission_Factor_Calculation.pdf</td>
                            <td className="py-2.5 px-3 text-slate-400">Not Uploaded</td>
                            <td className="py-2.5 px-3 text-[#004B87] font-semibold">Uploaded</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px]">
                                Added
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">Supporting Documents</td>
                            <td className="py-2.5 px-3 text-slate-600">Calibration_Certificate.pdf</td>
                            <td className="py-2.5 px-3 text-slate-400">Not Uploaded</td>
                            <td className="py-2.5 px-3 text-[#004B87] font-semibold">Uploaded</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold text-[11px]">
                                Added
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Submission Activity Timeline */}
                  <div className="p-5 rounded-2xl border border-slate-200/90 bg-white space-y-4 shadow-xs">
                    <h3 className="font-bold text-slate-900 text-sm">Submission Activity</h3>
                    <div className="space-y-4 pl-2">
                      {[
                        {
                          type: 'send',
                          date: '15 Jul 2024, 09:30AM',
                          user: 'John Smith (Facility User)',
                          action: 'Submitted Monitoring Plan V1',
                          iconColor: 'bg-sky-500 text-white',
                          icon: <Send className="w-3 h-3" />,
                        },
                        {
                          type: 'reject',
                          date: '15 Jul 2024, 10:15AM',
                          user: 'Sarah Ahmed (Reviewer)',
                          action: 'Requested Corrections for V1',
                          iconColor: 'bg-rose-500 text-white',
                          icon: <X className="w-3 h-3" />,
                        },
                        {
                          type: 'send',
                          date: '20 Jul 2024, 02:00PM',
                          user: 'John Smith (Facility User)',
                          action: 'Submitted Monitoring Plan V2',
                          iconColor: 'bg-sky-500 text-white',
                          icon: <Send className="w-3 h-3" />,
                        },
                        {
                          type: 'reject',
                          date: '20 Jul 2024, 09:45AM',
                          user: 'Sarah Ahmed (Reviewer)',
                          action: 'Requested Corrections for V2',
                          iconColor: 'bg-rose-500 text-white',
                          icon: <X className="w-3 h-3" />,
                        },
                        {
                          type: 'send',
                          date: '18 May 2024, 11:20AM',
                          user: 'John Smith (Facility User)',
                          action: 'Submitted Monitoring Plan V3',
                          iconColor: 'bg-sky-500 text-white',
                          icon: <Send className="w-3 h-3" />,
                        },
                        {
                          type: 'approve',
                          date: '15 May 2024, 09:10AM',
                          user: 'John Smith (Facility User)',
                          action: 'Approved Monitoring Plan V3',
                          iconColor: 'bg-emerald-500 text-white',
                          icon: <Check className="w-3 h-3" />,
                        },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-xs">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs shrink-0 ${activity.iconColor}`}>
                            {activity.icon}
                          </div>
                          <div className="w-40 font-semibold text-slate-500 shrink-0">{activity.date}</div>
                          <div className="w-56 font-semibold text-slate-800 shrink-0">{activity.user}</div>
                          <div className="font-semibold text-slate-700">{activity.action}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataReviewView;
