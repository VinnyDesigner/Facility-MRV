import React, { useState, useMemo } from 'react';
import {
  Eye,
  Edit3,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Calendar,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  ChevronDown,
  Building2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { useMRV } from '../../context/MRVContext';
import { Submission, SubmissionStatus, SectorType, TierLevel } from '../../types/mrv';

export interface SubmissionListingTableProps {
  title?: string;
  subtitle?: string;
  onViewRecord?: (submission: Submission) => void;
  onEditRecord?: (submission: Submission) => void;
  hideHeader?: boolean;
}

export const SubmissionListingTable: React.FC<SubmissionListingTableProps> = ({
  title = 'MRV Submission Overview',
  subtitle = 'Central registry of all facility MRV submissions, review determinations, and compliance milestones',
  onViewRecord,
  onEditRecord,
  hideHeader = false,
}) => {
  const {
    submissions,
    facilities,
    activeFacility,
    reportingYear,
    openReadOnlyViewer,
    setActiveView,
  } = useMRV();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  // Sorting state
  const [sortKey, setSortKey] = useState<keyof Submission | 'operatorName' | 'progressPercent' | 'lastUpdated'>('submittedDate');
  const [sortAsc, setSortAsc] = useState(false);

  // Toast / Export notice
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Helper to compute progress for each submission
  const getSubmissionProgress = (status: SubmissionStatus) => {
    switch (status) {
      case 'Draft':
        return { percent: 20, stage: 'Draft Preparation', barColor: 'bg-slate-400', textColor: 'text-slate-600' };
      case 'Submitted':
        return { percent: 50, stage: 'Transmitted to EAD', barColor: 'bg-blue-500', textColor: 'text-blue-700' };
      case 'Correction Required':
        return { percent: 60, stage: 'Correction Window', barColor: 'bg-amber-500', textColor: 'text-amber-800' };
      case 'Under Review':
        return { percent: 80, stage: 'EAD Regulatory Review', barColor: 'bg-teal-500', textColor: 'text-teal-700' };
      case 'Approved':
        return { percent: 100, stage: 'Accepted & Certified', barColor: 'bg-emerald-500', textColor: 'text-emerald-700' };
      case 'Rejected':
        return { percent: 40, stage: 'Application Rejected', barColor: 'bg-rose-500', textColor: 'text-rose-700' };
      default:
        return { percent: 50, stage: 'In Progress', barColor: 'bg-blue-500', textColor: 'text-blue-700' };
    }
  };

  // Derive full row data joined with facility operator information
  const enrichedSubmissions = useMemo(() => {
    return submissions.map((sub, index) => {
      const facility = facilities.find((f) => f.id === sub.facilityId) || activeFacility;
      const operatorName = facility?.operatorName || 'Al Noor Energy & Power Operations LLC';
      const lastUpdated = sub.history && sub.history.length > 0 
        ? sub.history[sub.history.length - 1].timestamp 
        : sub.submittedDate;
      const progressInfo = getSubmissionProgress(sub.status);
      const isEditable = sub.status === 'Draft' || sub.status === 'Correction Required';

      return {
        ...sub,
        tableIndex: index + 1,
        operatorName,
        lastUpdated,
        progressPercent: progressInfo.percent,
        progressStage: progressInfo.stage,
        progressBarColor: progressInfo.barColor,
        progressTextColor: progressInfo.textColor,
        isEditable,
        facilityObj: facility,
      };
    });
  }, [submissions, facilities, activeFacility]);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return enrichedSubmissions.filter((sub) => {
      // Search matching (ID, Facility, Operator, Sector)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sub.id.toLowerCase().includes(q) ||
        sub.facilityCode.toLowerCase().includes(q) ||
        sub.facilityName.toLowerCase().includes(q) ||
        sub.operatorName.toLowerCase().includes(q) ||
        sub.sector.toLowerCase().includes(q);

      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' || sub.status.toLowerCase() === statusFilter.toLowerCase();

      // Year filter
      const matchesYear =
        yearFilter === 'ALL' || String(sub.reportingYear) === yearFilter;

      // Sector filter
      const matchesSector =
        sectorFilter === 'ALL' || sub.sector.toLowerCase() === sectorFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesYear && matchesSector;
    });
  }, [enrichedSubmissions, searchQuery, statusFilter, yearFilter, sectorFilter]);

  // Sorted submissions
  const sortedSubmissions = useMemo(() => {
    return [...filteredSubmissions].sort((a: any, b: any) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredSubmissions, sortKey, sortAsc]);

  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleExport = (format: 'CSV' | 'Excel') => {
    setExportNotice(`Exporting ${filteredSubmissions.length} MRV submissions to ${format}...`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  };

  const handleView = (sub: any) => {
    if (onViewRecord) {
      onViewRecord(sub);
    } else {
      const facility = sub.facilityObj || facilities.find((f) => f.id === sub.facilityId) || activeFacility;
      openReadOnlyViewer({
        moduleType: 'full-dossier',
        recordId: sub.id,
        facilityId: sub.facilityId,
        facilityName: sub.facilityName,
        reportingYear: sub.reportingYear,
        version: sub.version,
        title: `Consolidated MRV Submission Dossier: ${sub.id}`,
        status: sub.status,
        submittedDate: sub.submittedDate,
        submittedBy: sub.history?.[0]?.user || facility.contactPerson?.name || 'Facility Compliance Lead',
        reviewerName: sub.reviewerName || (sub.status === 'Draft' ? 'Pending Assignment' : 'Dr. Mariam Al-Qubaisi (EAD Lead Inspector)'),
        reviewComments: sub.correctionComments || (sub.status === 'Approved' ? 'Submission approved by EAD Regulatory Committee.' : undefined),
        correctionDueDate: sub.correctionDueDate || (sub.status === 'Correction Required' ? '11-Apr-2026' : undefined),
        submission: sub,
      });
    }
  };

  const handleEdit = (sub: any) => {
    if (!sub.isEditable) return;
    if (onEditRecord) {
      onEditRecord(sub);
    } else {
      setActiveView('annual-emission-data');
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-teal-50 text-teal-700 border border-teal-200">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Under EAD Review
          </span>
        );
      case 'Correction Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            Correction Required
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Submitted
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TABLE HEADER & TITLE SECTION                                           */}
      {/* ------------------------------------------------------------------------- */}
      {!hideHeader && (
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#004B87]" />
              {title}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {exportNotice && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {exportNotice}
              </span>
            )}
            <button
              onClick={() => handleExport('CSV')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="px-3 py-1.5 bg-[#004B87] hover:bg-[#003866] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shadow-[#004B87]/20"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* 2. FILTER & SEARCH CONTROL BAR                                            */}
      {/* ------------------------------------------------------------------------- */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Facility, Operator, Sector..."
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

        {/* Filters Grid */}
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
              <option value="Correction Required">Correction Required</option>
              <option value="Submitted">Submitted</option>
              <option value="Draft">Draft</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Reporting Year Filter */}
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
              <option value="Transport">Transport</option>
              <option value="Agriculture & Forestry">Agriculture & Forestry</option>
            </select>
          </div>

          {/* Reset Filters */}
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

      {/* ------------------------------------------------------------------------- */}
      {/* 3. SUBMISSION OVERVIEW TABLE (LEVEL 1)                                    */}
      {/* ------------------------------------------------------------------------- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-[#E9F1F8] text-slate-700 font-bold text-xs border-b border-slate-200">
              {/* 1. Submission ID */}
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Submission ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 2. Facility */}
              <th
                onClick={() => handleSort('facilityName')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[150px]"
              >
                <div className="flex items-center gap-1">
                  <span>Facility</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 3. Reporting Entity / Operator */}
              <th
                onClick={() => handleSort('operatorName')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[160px]"
              >
                <div className="flex items-center gap-1">
                  <span>Reporting Entity / Operator</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 4. Sector */}
              <th
                onClick={() => handleSort('sector')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Sector</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 5. Tier Level */}
              <th
                onClick={() => handleSort('tier')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Tier Level</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 6. Reporting Year */}
              <th
                onClick={() => handleSort('reportingYear')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Reporting Year</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 7. Version */}
              <th
                onClick={() => handleSort('version')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition-colors text-center whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Version</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 8. Last Updated */}
              <th
                onClick={() => handleSort('lastUpdated')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Last Updated</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 9. Review Status */}
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Review Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 10. Progress */}
              <th
                onClick={() => handleSort('progressPercent')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-200/60 transition-colors min-w-[130px]"
              >
                <div className="flex items-center gap-1">
                  <span>Progress</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* 11. Actions */}
              <th className="py-3 px-4 text-right whitespace-nowrap">
                <span>Action</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {sortedSubmissions.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400 font-semibold">
                  No MRV submission records match the selected filter criteria.
                </td>
              </tr>
            ) : (
              sortedSubmissions.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* 1. Submission ID */}
                  <td className="py-3.5 px-3.5 font-mono font-bold text-[#004B87] whitespace-nowrap">
                    {row.id}
                  </td>

                  {/* 2. Facility */}
                  <td className="py-3.5 px-3.5 font-bold text-slate-900">
                    <div>{row.facilityName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{row.facilityCode}</div>
                  </td>

                  {/* 3. Reporting Entity / Operator */}
                  <td className="py-3.5 px-3.5 text-slate-700 font-medium">
                    {row.operatorName}
                  </td>

                  {/* 4. Sector */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {row.sector}
                    </span>
                  </td>

                  {/* 5. Tier Level */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      row.tier === 'Tier 3' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      row.tier === 'Tier 2' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {row.tier}
                    </span>
                  </td>

                  {/* 6. Reporting Year */}
                  <td className="py-3.5 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                    {row.reportingYear}
                  </td>

                  {/* 7. Version */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      v{row.version}.0
                    </span>
                  </td>

                  {/* 8. Last Updated */}
                  <td className="py-3.5 px-3.5 text-slate-600 text-[11px] whitespace-nowrap">
                    {row.lastUpdated}
                  </td>

                  {/* 9. Review Status */}
                  <td className="py-3.5 px-3.5 whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>

                  {/* 10. Progress */}
                  <td className="py-3.5 px-3.5">
                    <div className="w-full space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`font-bold ${row.progressTextColor}`}>{row.progressPercent}%</span>
                        <span className="text-slate-400 truncate max-w-[80px]">{row.progressStage}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${row.progressBarColor}`}
                          style={{ width: `${row.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 11. Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Action - Opens Level 2 Detail View */}
                      <button
                        onClick={() => handleView(row)}
                        title="Open Complete Read-Only Dossier for this submission"
                        className="px-3 py-1 bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Edit Action - When permitted by workflow */}
                      {row.isEditable ? (
                        <button
                          onClick={() => handleEdit(row)}
                          title="Edit Submission Record"
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 4. TABLE FOOTER / RECORD COUNTER                                          */}
      {/* ------------------------------------------------------------------------- */}
      <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div>
          Showing <span className="font-bold text-slate-800">{sortedSubmissions.length}</span> of{' '}
          <span className="font-bold text-slate-800">{enrichedSubmissions.length}</span> Total MRV Submissions
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Approved (100%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> Under Review (80%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Correction Required (60%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Submitted (50%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Draft (20%)
          </span>
        </div>
      </div>
    </div>
  );
};
