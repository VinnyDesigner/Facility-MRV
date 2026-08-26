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
  const { submissions, setSelectedSubmissionForReview, setActiveView } = useMRV();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.facilityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    const matchesSector = sectorFilter === 'ALL' || sub.sector === sectorFilter;
    return matchesSearch && matchesStatus && matchesSector;
  });

  const handleReviewSubmission = (sub: Submission) => {
    setSelectedSubmissionForReview(sub);
    setActiveView('ead-review-detail');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sticky Single-Row Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all font-sans">
        <h1 className="text-[20px] font-bold font-display text-[#0B3A60] tracking-tight">
          Facility Submissions Review Queue
        </h1>
        <div className="text-xs font-semibold text-slate-500">
          Statutory 31 March Pipeline • {submissions.length} Total Packages
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
            <option value="Correction Required">Correction Required (30d)</option>
            <option value="Approved">Approved</option>
            <option value="Draft">Draft</option>
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-primary-100/60 text-mrv-muted uppercase text-[10px] tracking-wider bg-primary-50/40">
                <th className="py-3 px-4 rounded-l-xl font-bold">Facility & Identifier</th>
                <th className="py-3 px-4 font-bold">Sector</th>
                <th className="py-3 px-4 font-bold">Year / Version</th>
                <th className="py-3 px-4 font-bold">Total Emissions</th>
                <th className="py-3 px-4 font-bold">Submitted Date</th>
                <th className="py-3 px-4 font-bold">Pending Time</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 rounded-r-xl font-bold text-right">Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/40">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-navy-900">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-brand shrink-0" />
                      <div>
                        <div>{sub.facilityName}</div>
                        <div className="text-[10px] text-mrv-muted font-mono font-normal">
                          {sub.facilityCode} • {sub.emirate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-navy-800">{sub.sector}</span>
                    <span className="text-[10px] text-mrv-muted block">{sub.tier}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-navy-900">
                    <div>{sub.reportingYear}</div>
                    <span className="px-1.5 py-0.2 rounded bg-navy-100 text-navy-900 text-[10px] font-mono">
                      v{sub.version}.0
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-primary-800 font-mono">
                    {sub.totalEmissions.toLocaleString()} tCO₂e
                  </td>
                  <td className="py-3.5 px-4 text-mrv-muted">{sub.submittedDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        sub.daysPending > 4 ? 'text-rose-600' : 'text-navy-900'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sub.daysPending} Days</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={sub.status} dot size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleReviewSubmission(sub)}
                      className="btn-primary text-xs py-1.5 px-3.5"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
