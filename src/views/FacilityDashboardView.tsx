import React from 'react';
import {
  Building2,
  Calendar,
  ArrowRight,
  Flame,
  ClipboardList,
  FileText,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { Badge } from '../components/ui/Badge';
import { NotchCard } from '../components/ui/NotchCard';

export const FacilityDashboardView: React.FC = () => {
  const { activeFacility, setActiveView } = useMRV();

  // Mock Data for Analytics
  const emissionsTrendData = [
    { year: '2022', emissions: 0.95 },
    { year: '2023', emissions: 1.02 },
    { year: '2024', emissions: 1.08 },
    { year: '2025', emissions: 1.18 },
    { year: '2026', emissions: 1.24 },
  ];

  const ghgData = [
    { name: 'CO₂', value: 82, amount: '1.02M', color: '#004B87' },
    { name: 'CH₄', value: 12, amount: '0.15M', color: '#00B2FE' },
    { name: 'N₂O', value: 4, amount: '0.05M', color: '#F59E0B' },
    { name: 'Fluorinated', value: 2, amount: '0.02M', color: '#8B5CF6' },
  ];

  const sourceData = [
    { category: 'Stationary Combustion', value: 0.62, percent: '50%' },
    { category: 'Process Emissions', value: 0.32, percent: '26%' },
    { category: 'Fugitive Emissions', value: 0.18, percent: '14%' },
    { category: 'Mobile Combustion', value: 0.08, percent: '6%' },
    { category: 'Waste', value: 0.04, percent: '3%' },
  ];

  // Mock Data for Submissions Table
  const recentSubmissions = [
    { year: '2026', type: 'Annual MRV Report', version: 'v3', date: '14 Mar 2026', status: 'Under Review', verifier: 'Bureau Veritas' },
    { year: '2025', type: 'Annual MRV Report', version: 'v2', date: '20 Mar 2025', status: 'Approved', verifier: 'Bureau Veritas' },
    { year: '2024', type: 'Annual MRV Report', version: 'v1', date: '18 Mar 2024', status: 'Approved', verifier: 'Bureau Veritas' },
  ];

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-6 pb-16 font-sans no-scrollbar">

      {/* 2. MRV STATUS CARDS (6 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1: Estimated Annual Emissions */}
        <NotchCard
          icon={<Flame className="w-5 h-5" />}
          iconGradient="from-amber-400 to-amber-500"
          iconShadow="shadow-amber-500/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Estimated Annual<br />Emissions
          </p>
          <div className="space-y-1 my-auto">
            <div className="text-[26px] font-extrabold text-amber-500 tracking-tight leading-none">
              1.24M <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider ml-0.5">tCO₂e</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Scope 1 Direct</p>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">vs Previous Year</span>
            <span className="text-emerald-500 font-bold">+5.1%</span>
          </div>
        </NotchCard>

        {/* Card 2: Monitoring Plan Completion */}
        <NotchCard
          icon={<ClipboardList className="w-5 h-5" />}
          iconGradient="from-[#005B9F] to-[#004B87]"
          iconShadow="shadow-blue-900/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Monitoring Plan<br />Completion
          </p>
          <div className="space-y-2 my-auto">
            <div className="text-[26px] font-extrabold text-[#004B87] tracking-tight leading-none">
              82%
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#004B87] h-full rounded-full transition-all duration-500" style={{ width: '82%' }}></div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-bold">Tier 2 • 3 Streams</span>
            <span className="text-[#004B87] font-bold">82%</span>
          </div>
        </NotchCard>

        {/* Card 3: Submission Status */}
        <NotchCard
          icon={<FileText className="w-5 h-5" />}
          iconGradient="from-purple-500 to-purple-600"
          iconShadow="shadow-purple-500/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Submission<br />Status
          </p>
          <div className="space-y-2 my-auto">
            <div className="text-[20px] font-extrabold text-purple-700 tracking-tight leading-none">
              Under Review
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="h-1.5 flex-1 bg-purple-600 rounded-full"></div>
              <div className="h-1.5 flex-1 bg-purple-600 rounded-full relative">
                <span className="absolute -top-0.5 right-0 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white animate-pulse"></span>
              </div>
              <div className="h-1.5 flex-1 bg-slate-100 rounded-full"></div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">V3 • 14 Mar 2026</span>
            <span className="text-purple-700 font-bold">Stage 2/3</span>
          </div>
        </NotchCard>

        {/* Card 4: Verified Report */}
        <NotchCard
          icon={<ShieldCheck className="w-5 h-5" />}
          iconGradient="from-emerald-500 to-emerald-600"
          iconShadow="shadow-emerald-500/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Verified<br />Report
          </p>
          <div className="space-y-1.5 my-auto">
            <div className="text-[20px] font-extrabold text-emerald-600 tracking-tight leading-none">
              Uploaded
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">MRV Report</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">Verifier Statement</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Documentation</span>
            <span className="text-emerald-600 font-bold">2/2 Verified</span>
          </div>
        </NotchCard>

        {/* Card 5: Third-Party Verification */}
        <NotchCard
          icon={<Building2 className="w-5 h-5" />}
          iconGradient="from-indigo-500 to-indigo-600"
          iconShadow="shadow-indigo-500/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Third-Party<br />Verification
          </p>
          <div className="space-y-1 my-auto">
            <div className="text-[20px] font-extrabold text-indigo-600 tracking-tight leading-none">
              Assigned
            </div>
            <div className="text-[12px] font-bold text-slate-800">
              Bureau Veritas
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
              Statement Uploaded
            </span>
            <span className="text-indigo-600 font-bold">Accredited</span>
          </div>
        </NotchCard>

        {/* Card 6: Regulatory Deadline */}
        <NotchCard
          icon={<CalendarDays className="w-5 h-5" />}
          iconGradient="from-rose-500 to-rose-600"
          iconShadow="shadow-rose-500/25"
          badgeShape="circle"
        >
          <p className="text-[14px] font-bold text-slate-800 leading-tight max-w-[65%]">
            Regulatory<br />Deadline
          </p>
          <div className="space-y-2 my-auto">
            <div className="text-[26px] font-extrabold text-rose-600 tracking-tight leading-none">
              218 <span className="text-[11px] font-bold text-rose-500 uppercase ml-0.5">DAYS</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">31 Mar '27 Deadline</span>
            <span className="text-rose-600 font-bold">On Schedule</span>
          </div>
        </NotchCard>
      </div>

      {/* 3. ANALYTICS SECTION (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend */}
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),_0_2px_8px_rgba(0,75,135,0.04),_0_1px_1px_rgba(255,255,255,1)_inset] hover:shadow-[0_18px_40px_-6px_rgba(0,75,135,0.13),_0_1px_2px_rgba(255,255,255,1)_inset] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/20 via-sky-200/5 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-navy-900">Emissions Trend <span className="text-slate-400 font-normal text-xs">(tCO₂e)</span></h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emissionsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 1.5]} ticks={[0, 0.5, 1.0, 1.5]} tickFormatter={(val) => `${val}M`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="emissions" stroke="#00B2FE" strokeWidth={3} dot={{ r: 4, fill: '#004B87', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4 text-[10px] font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#00B2FE]"></span> Annual Emissions
            </div>
          </div>
        </div>

        {/* Source Category */}
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),_0_2px_8px_rgba(0,75,135,0.04),_0_1px_1px_rgba(255,255,255,1)_inset] hover:shadow-[0_18px_40px_-6px_rgba(0,75,135,0.13),_0_1px_2px_rgba(255,255,255,1)_inset] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/20 via-sky-200/5 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-navy-900">Emissions by Source Category <span className="text-slate-400 font-normal text-xs">(tCO₂e)</span></h3>
            </div>
            <div className="space-y-4">
              {sourceData.map(s => (
                <div key={s.category} className="flex items-center justify-between gap-4 text-[10px]">
                  <div className="w-32 font-semibold text-slate-600 truncate">{s.category}</div>
                  <div className="flex-1 bg-slate-100/80 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00B2FE] h-full rounded-full" style={{ width: s.percent }}></div>
                  </div>
                  <div className="w-16 text-right font-bold text-navy-900">{s.value}M <span className="text-slate-400 font-medium">({s.percent})</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. OPERATIONS SECTION (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Submissions */}
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),_0_2px_8px_rgba(0,75,135,0.04),_0_1px_1px_rgba(255,255,255,1)_inset] hover:shadow-[0_18px_40px_-6px_rgba(0,75,135,0.13),_0_1px_2px_rgba(255,255,255,1)_inset] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/20 via-sky-200/5 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-navy-900">Recent Submissions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 font-bold uppercase">
                    <th className="pb-3 pr-2">Reporting Year</th>
                    <th className="pb-3 px-2">Submission</th>
                    <th className="pb-3 px-2">Version</th>
                    <th className="pb-3 px-2">Submitted Date</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Verifier</th>
                    <th className="pb-3 pl-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub, idx) => (
                    <tr key={idx} className="border-b border-slate-50 last:border-0 font-semibold text-navy-900">
                      <td className="py-3 pr-2">{sub.year}</td>
                      <td className="py-3 px-2 text-slate-600">{sub.type}</td>
                      <td className="py-3 px-2">{sub.version}</td>
                      <td className="py-3 px-2 text-slate-500">{sub.date}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded ${sub.status === 'Under Review' ? 'text-purple-600 bg-purple-50' : 'text-emerald-600 bg-emerald-50'}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{sub.verifier}</td>
                      <td className="py-3 pl-2">
                        <button className="text-[#004B87] flex items-center gap-1 font-bold hover:underline">
                          {sub.status === 'Under Review' ? 'Track' : 'View'} <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full text-center mt-4 text-[11px] font-bold text-[#004B87] hover:underline flex justify-center items-center gap-1">
              View All Submissions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),_0_2px_8px_rgba(0,75,135,0.04),_0_1px_1px_rgba(255,255,255,1)_inset] hover:shadow-[0_18px_40px_-6px_rgba(0,75,135,0.13),_0_1px_2px_rgba(255,255,255,1)_inset] transition-all duration-300 relative overflow-hidden group flex flex-col">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/20 via-sky-200/5 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />

          <div className="absolute top-5 right-5 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm z-20">
            2
          </div>
          
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-navy-900">Action Required</h3>
            </div>
            <div className="space-y-3 flex-1">
              <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/60 backdrop-blur-sm flex flex-col gap-3 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Complete Emissions Data</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">Enter final calculated emissions for reporting year 2026.</p>
                </div>
                <button className="self-end px-3 py-1.5 bg-white border border-amber-200 text-amber-600 text-[10px] font-bold rounded-lg shadow-sm hover:bg-amber-50 transition-colors flex items-center gap-1">
                  Continue <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 backdrop-blur-sm flex flex-col gap-3 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Annual Renewal Confirmation</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">Confirm facility operational parameters and permit status.</p>
                </div>
                <button className="self-end px-3 py-1.5 bg-white border border-slate-200 text-[#004B87] text-[10px] font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1">
                  Review <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <button className="w-full text-center mt-4 text-[11px] font-bold text-[#004B87] hover:underline flex justify-center items-center gap-1">
              View All Actions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gradient-to-b from-white/95 via-white/85 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),_0_2px_8px_rgba(0,75,135,0.04),_0_1px_1px_rgba(255,255,255,1)_inset] hover:shadow-[0_18px_40px_-6px_rgba(0,75,135,0.13),_0_1px_2px_rgba(255,255,255,1)_inset] transition-all duration-300 relative overflow-hidden group flex flex-col">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/20 via-sky-200/5 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-10" />

          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-navy-900">Notifications</h3>
              <button className="text-[10px] font-bold text-[#004B87] hover:underline">View All</button>
            </div>
            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3 border-b border-slate-100/60 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-navy-900 leading-snug">EAD has requested clarification on your Emissions Data.</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 shrink-0">15 Mar 2026</span>
              </div>
              <div className="flex items-start gap-3 border-b border-slate-100/60 pb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-navy-900 leading-snug">Your submission is under review.</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 shrink-0">14 Mar 2026</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#004B87] mt-1.5 shrink-0"></span>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-navy-900 leading-snug">New guidance document released.</p>
                </div>
                <span className="text-[9px] font-semibold text-slate-400 shrink-0">12 Mar 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
