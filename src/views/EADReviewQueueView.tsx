import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Submission, SubmissionStatus } from '../types/mrv';

export const EADReviewQueueView: React.FC = () => {
  const { submissions, setSelectedSubmissionForReview, setActiveView, openReadOnlyViewer } = useMRV();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.facilityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Reverted' && (sub.status === 'Correction Required' || (sub.status as string) === 'Reverted')) ||
      (statusFilter === 'Correction Required' && (sub.status === 'Correction Required' || (sub.status as string) === 'Reverted')) ||
      (statusFilter === 'Rejected' && (sub.status === 'Rejected' || sub.status.includes('Reject'))) ||
      sub.status === statusFilter;
    const matchesSector = sectorFilter === 'ALL' || sub.sector === sectorFilter;
    return matchesSearch && matchesStatus && matchesSector;
  });

  const handleReviewSubmission = (sub: Submission) => {
    setSelectedSubmissionForReview(sub);
    setActiveView('ead-review-detail');
  };

  return (
    <div className="space-y-[18px] animate-fade-in pb-6">
      {/* Top Header Row */}
      <div className="flex-shrink-0 pt-0.5 pb-[18px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
            Facility Submissions Review Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Statutory 31 March Pipeline • {submissions.length} Total Verification Packages
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mrv-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queue by facility name, code, or sector..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-mrv-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Under Review">Under Review</option>
            <option value="Reverted">Reverted (Correction Required)</option>
            <option value="Approved">Approved</option>
            <option value="Draft">Draft</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="glass-input py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="Energy">Energy</option>
            <option value="IPPU">IPPU</option>
            <option value="Waste">Waste</option>
            <option value="Transport">Transport</option>
          </select>
        </div>
      </GlassCard>

      {/* Queue Table */}
      <GlassCard className="p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200/90">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30 sticky top-0 z-10 shadow-xs">
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Facility & Identifier</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Sector</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Year / Version</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Total Emissions</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Submitted Date</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Pending Time</th>
                <th className="h-[38px] px-4 font-bold align-middle bg-[#D6E3EF]">Status</th>
                <th className="h-[38px] px-4 font-bold text-center align-middle bg-[#D6E3EF]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSubmissions.map((sub, idx) => (
                <tr key={sub.id} className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                  <td className="h-[60px] px-4 font-bold text-navy-900 align-middle">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#004B87] shrink-0" />
                      <div>
                        <div>{sub.facilityName}</div>
                        <div className="text-[10px] text-slate-500 font-mono font-normal">
                          {sub.facilityCode} • {sub.emirate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="h-[60px] px-4 align-middle">
                    <span className="font-semibold text-slate-800">{sub.sector}</span>
                    <span className="text-[10px] text-slate-500 block">{sub.tier}</span>
                  </td>
                  <td className="h-[60px] px-4 font-semibold text-slate-900 align-middle">
                    <div>{sub.reportingYear}</div>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                      v{sub.version}.0
                    </span>
                  </td>
                  <td className="h-[60px] px-4 font-bold text-[#004B87] font-mono align-middle">
                    {sub.totalEmissions.toLocaleString()} tCO₂e
                  </td>
                  <td className="h-[60px] px-4 text-slate-500 align-middle">{sub.submittedDate}</td>
                  <td className="h-[60px] px-4 align-middle">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        sub.daysPending > 4 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sub.daysPending} Days</span>
                    </span>
                  </td>
                  <td className="h-[60px] px-4 align-middle">
                    <Badge status={sub.status} dot size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="h-[60px] px-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openReadOnlyViewer({
                          moduleType: 'full-dossier',
                          recordId: sub.id,
                          title: `MRV Submission Dossier: ${sub.facilityName}`,
                          status: sub.status,
                          facilityName: sub.facilityName,
                          reportingYear: sub.reportingYear,
                          version: sub.version,
                        })}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                        title="View Complete Read-Only Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReviewSubmission(sub)}
                        className="btn-primary text-xs py-1.5 px-3.5"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
