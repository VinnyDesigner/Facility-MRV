import React from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  ArrowRight,
  TrendingUp,
  Flame,
  Eye,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const EADDashboardView: React.FC = () => {
  const {
    submissions,
    facilities,
    reportingYear,
    setActiveView,
    setSelectedSubmissionForReview,
  } = useMRV();

  // Metrics
  const totalFacilities = 148;
  const totalSubmissions = submissions.length + 107;
  const pendingReview = submissions.filter(
    (s) => s.status === 'Submitted' || s.status === 'Under Review'
  ).length + 22;
  const correctionsRequired = submissions.filter((s) => s.status === 'Correction Required').length + 13;
  const approvedSubmissions = submissions.filter((s) => s.status === 'Approved').length + 67;
  const rejectedSubmissions = 6;

  // Status Distribution Data
  const statusData = [
    { name: 'Approved', value: approvedSubmissions, color: '#10B981' },
    { name: 'Pending Review', value: pendingReview, color: '#0878C9' },
    { name: 'Corrections (30d)', value: correctionsRequired, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedSubmissions, color: '#F43F5E' },
  ];

  // Sector emissions data for EAD
  const sectorEmissions = [
    { sector: 'Energy & Power', emissions: 24.8, count: 42 },
    { sector: 'IPPU (Heavy Ind)', emissions: 18.4, count: 36 },
    { sector: 'Waste Management', emissions: 5.2, count: 28 },
    { sector: 'Transport Fleets', emissions: 3.9, count: 31 },
    { sector: 'Agriculture', emissions: 1.1, count: 11 },
  ];

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-6 animate-fade-in pb-12 no-scrollbar">
      {/* Top Header Row */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Subnational MRV Regulatory Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            EAD Lead Regulatory Oversight • {facilities.length} Regulated Facilities
          </p>
        </div>
      </div>

      {/* 6 Top Regulator KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* KPI 1 */}
        <GlassCard className="p-4 flex flex-col justify-between" hoverEffect>
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Total Facilities</span>
          <div className="text-2xl font-black font-display text-navy-900 mt-2">{totalFacilities}</div>
          <span className="text-[10px] text-primary-700 font-semibold mt-1">Regulated Entities</span>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-4 flex flex-col justify-between" hoverEffect>
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Total Submissions</span>
          <div className="text-2xl font-black font-display text-navy-900 mt-2">{totalSubmissions}</div>
          <span className="text-[10px] text-cyan-700 font-semibold mt-1">Cycle {reportingYear}</span>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-4 flex flex-col justify-between border-primary-300 shadow-sm" hoverEffect>
          <span className="text-[10px] font-bold text-primary-800 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary-600" /> Pending Review
          </span>
          <div className="text-2xl font-black font-display text-primary-700 mt-2">{pendingReview}</div>
          <span className="text-[10px] text-primary-600 font-bold mt-1">Action Required</span>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-4 flex flex-col justify-between border-amber-300" hoverEffect>
          <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" /> Corrections (30d)
          </span>
          <div className="text-2xl font-black font-display text-amber-600 mt-2">{correctionsRequired}</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1">Reverted to Operator</span>
        </GlassCard>

        {/* KPI 5 */}
        <GlassCard className="p-4 flex flex-col justify-between border-emerald-300" hoverEffect>
          <span className="text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
          </span>
          <div className="text-2xl font-black font-display text-emerald-600 mt-2">{approvedSubmissions}</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-1">Certificates Issued</span>
        </GlassCard>

        {/* KPI 6 */}
        <GlassCard className="p-4 flex flex-col justify-between border-rose-200" hoverEffect>
          <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
          <div className="text-2xl font-black font-display text-rose-600 mt-2">{rejectedSubmissions}</div>
          <span className="text-[10px] text-rose-700 font-semibold mt-1">Non-compliant</span>
        </GlassCard>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Emissions Bar Chart (7 cols) */}
        <GlassCard className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                Abu Dhabi Subnational Emissions by Sector
              </h3>
              <p className="text-xs text-mrv-muted">
                Reported emissions breakdown across regulated industries (Million tCO₂e)
              </p>
            </div>
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
              Total: 53.4M tCO₂e
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorEmissions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 120, 201, 0.08)" />
                <XAxis dataKey="sector" stroke="#667085" fontSize={11} />
                <YAxis stroke="#667085" fontSize={11} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  formatter={(val: number) => [`${val} Million tCO₂e`, 'Total Emissions']}
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="emissions" fill="#0878C9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Submission Status Pie/Donut Chart (5 cols) */}
        <GlassCard className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">
              Submissions Review Distribution
            </h3>
            <p className="text-xs text-mrv-muted">
              Reporting cycle {reportingYear} processing breakdown
            </p>
          </div>

          <div className="h-52 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [val, 'Submissions']}
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-primary-100/60">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-mrv-muted truncate">{item.name}:</span>
                <span className="font-bold text-navy-900">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Priority Review Queue Preview */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">
              Priority Submissions Pending EAD Review
            </h3>
            <p className="text-xs text-mrv-muted">
              Facilities awaiting regulatory assessment before statutory deadline.
            </p>
          </div>
          <button
            onClick={() => setActiveView('ead-queue')}
            className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
          >
            View All ({pendingReview}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-primary-100/60 text-mrv-muted uppercase text-[10px] tracking-wider bg-primary-50/40">
                <th className="py-3 px-4 rounded-l-xl font-bold">Facility Name</th>
                <th className="py-3 px-4 font-bold">Sector</th>
                <th className="py-3 px-4 font-bold">Emissions (tCO₂e)</th>
                <th className="py-3 px-4 font-bold">Tier</th>
                <th className="py-3 px-4 font-bold">Submitted Date</th>
                <th className="py-3 px-4 font-bold">Days Pending</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 rounded-r-xl font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100/40">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-primary-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-navy-900">
                    <div>{sub.facilityName}</div>
                    <div className="text-[10px] text-mrv-muted font-mono font-normal">{sub.facilityCode}</div>
                  </td>
                  <td className="py-3.5 px-4 text-navy-800 font-medium">{sub.sector}</td>
                  <td className="py-3.5 px-4 font-bold text-primary-800">
                    {sub.totalEmissions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-navy-800">{sub.tier}</td>
                  <td className="py-3.5 px-4 text-mrv-muted">{sub.submittedDate}</td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={sub.daysPending > 5 ? 'text-rose-600' : 'text-navy-900'}>
                      {sub.daysPending} Days
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge status={sub.status} dot size="sm">
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedSubmissionForReview(sub);
                        setActiveView('ead-review-detail');
                      }}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
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
