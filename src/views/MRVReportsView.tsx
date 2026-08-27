import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  History,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowUpDown,
  UploadCloud,
  Layers,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const MRVReportsView: React.FC = () => {
  const { currentSubmission, setActiveView } = useMRV();

  // Active Tab State: 'emission-summary' | 'submission-status' | 'history' | 'version'
  const [activeTab, setActiveTab] = useState<'emission-summary' | 'submission-status' | 'history' | 'version'>('emission-summary');
  
  // Shared Filter States
  const [selectedFacility, setSelectedFacility] = useState('Green Mountain Cement Factory');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Sorting state for Emission Summary Table
  const [emissionSortKey, setEmissionSortKey] = useState<string>('id');
  const [emissionSortAsc, setEmissionSortAsc] = useState<boolean>(true);

  // Sorting state for Submission Status Table
  const [statusSortKey, setStatusSortKey] = useState<string>('id');
  const [statusSortAsc, setStatusSortAsc] = useState<boolean>(true);

  // -------------------------------------------------------------------------
  // 1. DATA FOR EMISSION SUMMARY REPORT (Screenshot 1)
  // -------------------------------------------------------------------------
  const monthlyEmissionTrends = [
    { month: 'Jan', emission: 8500 },
    { month: 'Feb', emission: 11000 },
    { month: 'Mar', emission: 10000 },
    { month: 'Apr', emission: 36500, highlight: '350 (tCO₂e)' },
    { month: 'May', emission: 16500 },
    { month: 'Jun', emission: 22000 },
    { month: 'Jul', emission: 20800 },
    { month: 'Aug', emission: 28500 },
    { month: 'Sep', emission: 20000 },
    { month: 'Oct', emission: 39800 },
    { month: 'Nov', emission: 43800 },
    { month: 'Dec', emission: 26500 },
  ];

  const sourceCategoryData = [
    {
      id: 1,
      category: 'Energy',
      method: 'IPCC Tier 1',
      source: 'Fuel Consumption Records',
      emissions: 16595,
      change: 4.8,
      isPositive: true,
    },
    {
      id: 2,
      category: 'Energy',
      method: 'IPCC Tier 2',
      source: 'Fuel Consumption Records',
      emissions: 6201,
      change: -2.3,
      isPositive: false,
    },
    {
      id: 3,
      category: 'Industrial Processes',
      method: 'Continuous Monitoring',
      source: 'CEMS',
      emissions: 27555,
      change: 3.5,
      isPositive: true,
    },
    {
      id: 4,
      category: 'Waste',
      method: 'IPCC Tier 1',
      source: 'Waste Disposal Records',
      emissions: 1180,
      change: 1.2,
      isPositive: true,
    },
    {
      id: 5,
      category: 'IPPU',
      method: 'Engineering Estimate',
      source: 'Refrigerant Inventory',
      emissions: 184,
      change: -0.8,
      isPositive: false,
    },
  ];

  // -------------------------------------------------------------------------
  // 2. DATA FOR SUBMISSION STATUS (Screenshot 2)
  // -------------------------------------------------------------------------
  const submissionStatusOverview = [
    { name: 'Approved', count: 25, percentage: 58, color: '#16A34A' },
    { name: 'Pending Review', count: 6, percentage: 14, color: '#EAB308' },
    { name: 'Correction Requested', count: 4, percentage: 11, color: '#F97316' },
    { name: 'Rejected', count: 2, percentage: 17, color: '#DC2626' },
  ];

  const versionSummaryData = [
    { version: 'V1', count: 12 },
    { version: 'V2', count: 15 },
    { version: 'V3', count: 10 },
  ];

  const submissionStatusRecords = [
    {
      id: 1,
      submissionId: 'SUB-2024-0001',
      facility: 'V3',
      submittedBy: 'John Smith',
      submittedDate: '15-May-2024',
      reviewedBy: 'Sara Johnson',
      reviewDate: '20-May-2024',
      status: 'Approved',
      statusType: 'approved',
    },
    {
      id: 2,
      submissionId: 'SUB-2024-0002',
      facility: 'V2',
      submittedBy: 'Michael Brown',
      submittedDate: '10-May-2024',
      reviewedBy: '-',
      reviewDate: '-',
      status: 'Under Review',
      statusType: 'under_review',
    },
    {
      id: 3,
      submissionId: 'SUB-2024-0003',
      facility: 'V3',
      submittedBy: 'Emily Davis',
      submittedDate: '12-May-2024',
      reviewedBy: 'James Lee',
      reviewDate: '18-May-2024',
      status: 'Correction Requested',
      statusType: 'correction',
    },
    {
      id: 4,
      submissionId: 'SUB-2024-0004',
      facility: 'V1',
      submittedBy: 'David Wilson',
      submittedDate: '08-May-2024',
      reviewedBy: 'Sara Johnson',
      reviewDate: '09-May-2024',
      status: 'Rejected',
      statusType: 'rejected',
    },
    {
      id: 5,
      submissionId: 'SUB-2024-0005',
      facility: 'V3',
      submittedBy: 'Emily Davis',
      submittedDate: '10-Jun-2024',
      reviewedBy: 'James Lee',
      reviewDate: '18-May-2024',
      status: 'Approved',
      statusType: 'approved',
    },
  ];

  // -------------------------------------------------------------------------
  // 3. EXISTING SUBMISSION & VERSION HISTORY DATA
  // -------------------------------------------------------------------------
  const currentStatus = currentSubmission?.status || 'Under Review';
  const currentVersion = currentSubmission?.version || 1;
  const currentId = currentSubmission?.id || 'MRV-2026-00128';
  const currentEmissions = currentSubmission?.totalEmissions || 1240000;
  const currentSubmittedDate = currentSubmission?.submittedDate || '14 Mar 2026';
  const auditHistory = currentSubmission?.history || [];
  const isCorrectionRequired = currentStatus === 'Correction Required';

  const reportsList = [
    {
      year: 2026,
      id: currentId,
      type: 'Annual MRV Report Package',
      version: `v${currentVersion}`,
      emissions: `${(currentEmissions / 1000000).toFixed(2)}M tCO₂e`,
      submittedDate: currentSubmittedDate,
      status: currentStatus,
      verifier: 'Bureau Veritas Middle East',
      statusVariant:
        currentStatus === 'Approved'
          ? ('success' as const)
          : currentStatus === 'Correction Required'
          ? ('warning' as const)
          : ('info' as const),
    },
    {
      year: 2025,
      id: 'MRV-2025-00102',
      type: 'Annual MRV Report Package',
      version: 'v2.0',
      emissions: '1.23M tCO₂e',
      submittedDate: '20 Mar 2025',
      status: 'Approved',
      verifier: 'DNV GL Business Assurance',
      statusVariant: 'success' as const,
    },
    {
      year: 2024,
      id: 'MRV-2024-00088',
      type: 'Annual MRV Report Package',
      version: 'v1.0',
      emissions: '1.21M tCO₂e',
      submittedDate: '18 Mar 2024',
      status: 'Approved',
      verifier: 'TÜV Rheinland Middle East',
      statusVariant: 'success' as const,
    },
  ];

  // Sort handlers
  const sortedSourceCategory = useMemo(() => {
    return [...sourceCategoryData].sort((a: any, b: any) => {
      if (a[emissionSortKey] < b[emissionSortKey]) return emissionSortAsc ? -1 : 1;
      if (a[emissionSortKey] > b[emissionSortKey]) return emissionSortAsc ? 1 : -1;
      return 0;
    });
  }, [emissionSortKey, emissionSortAsc]);

  const sortedStatusRecords = useMemo(() => {
    return [...submissionStatusRecords].sort((a: any, b: any) => {
      if (a[statusSortKey] < b[statusSortKey]) return statusSortAsc ? -1 : 1;
      if (a[statusSortKey] > b[statusSortKey]) return statusSortAsc ? 1 : -1;
      return 0;
    });
  }, [statusSortKey, statusSortAsc]);

  const handleExport = (reportName: string) => {
    setExportNotice(`Exporting ${reportName} (${selectedYear})...`);
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Custom Tooltip for Line Chart
  const CustomEmissionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0A1628] text-white p-2.5 rounded-xl shadow-xl border border-slate-700/60 text-center relative pointer-events-none">
          <div className="text-[11px] text-slate-300 font-medium">Emission ({label})</div>
          <div className="text-sm font-extrabold text-[#34D399]">
            {data.highlight ? data.highlight : `${(data.emission / 1000).toFixed(1)}k tCO₂e`}
          </div>
          <div className="w-2 h-2 bg-[#0A1628] rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-slate-700/60" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER ROW (Outside the card: Title on Left, Controls on Right) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
              MRV Reports & Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Comprehensive Emission Summaries, Status Tracking & Verification Dossiers
            </p>
          </div>
          {exportNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Right: Facility Selector, Year Selector & Export CTA Button */}
        <div className="flex items-center gap-2.5">
          {/* Facility Dropdown */}
          <div className="relative">
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
            >
              <option value="Green Mountain Cement Factory">Facility</option>
              <option value="Green Mountain Cement Factory">Green Mountain Cement Factory</option>
              <option value="Abu Dhabi Power Plant">Abu Dhabi Power Plant</option>
              <option value="Al Ruwais Refinery">Al Ruwais Refinery</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Calendar Year Dropdown */}
          <div className="relative">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-xs pl-3 pr-8 py-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={() => handleExport(activeTab === 'emission-summary' ? 'Emission Summary' : 'Submission Status')}
            className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN WHITE CARD CONTAINER (Tabs inside the white card header) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col overflow-hidden">
        {/* Navigation Sub-Tabs (Inside Card Header) */}
        <div className="flex-shrink-0 flex items-center gap-6 border-b border-slate-100 pb-3 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('emission-summary')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'emission-summary'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Emission Summary Report
          </button>
          <button
            onClick={() => setActiveTab('submission-status')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'submission-status'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Submission Status
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'history'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Submission History
          </button>
          <button
            onClick={() => setActiveTab('version')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'version'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Scrollable Card Body */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6 pr-1">
          {/* TAB 1: EMISSION SUMMARY REPORT */}
          {activeTab === 'emission-summary' && (
            <div className="space-y-6 animate-fade-in">
          {/* Top Chart Card: Emission Trends */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Emission Trends</h2>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyEmissionTrends}
                  margin={{ top: 25, right: 30, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="emissionGreenGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                    domain={[0, 50000]}
                    ticks={[0, 10000, 20000, 30000, 40000, 50000]}
                    tickFormatter={(val) => (val === 0 ? '0' : `${val / 1000}K`)}
                    label={{
                      value: 'Emission ( tCO₂e )',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748b', fontSize: 11, fontWeight: 600 },
                      dx: -2,
                    }}
                  />
                  <Tooltip content={<CustomEmissionTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="emission"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#emissionGreenGrad)"
                    dot={{ r: 4, fill: '#10B981', stroke: '#ffffff', strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: '#065F46', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Table Card: Source Category Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                    <th
                      onClick={() => {
                        setEmissionSortKey('id');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12"
                    >
                      <div className="flex items-center gap-1">
                        <span>#</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setEmissionSortKey('category');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Source Category</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setEmissionSortKey('method');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Monitoring Method</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setEmissionSortKey('source');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Data Source</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setEmissionSortKey('emissions');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Total Emissions (tCO₂e)</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setEmissionSortKey('change');
                        setEmissionSortAsc(!emissionSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Change from Previous Year</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {sortedSourceCategory.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500">{row.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{row.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.method}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.source}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {row.emissions.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {row.isPositive ? (
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <span>▲</span> +{row.change}%
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-600 flex items-center gap-1">
                            <span>▼</span> {row.change}%
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 2: SUBMISSION STATUS (Matching Screenshot 2) */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'submission-status' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 2 Cards: Overview Donut Chart & Version Summary Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Submission Status Overview */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-4">
                  Submission Status Overview
                </h2>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
                  {/* Donut Chart with Center Label */}
                  <div className="relative w-44 h-44 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={submissionStatusOverview}
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="count"
                          stroke="none"
                        >
                          {submissionStatusOverview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-2xl font-extrabold text-slate-900">37</span>
                      <span className="text-[10px] font-semibold text-slate-500 leading-tight">
                        Total<br />Submissions
                      </span>
                    </div>
                  </div>

                  {/* Legend List */}
                  <div className="space-y-2.5 flex-1 w-full text-xs">
                    {submissionStatusOverview.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-700">{item.name}</span>
                        </div>
                        <div className="font-semibold text-slate-800 text-right">
                          {item.count} <span className="text-slate-500 font-normal">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
                Total Submissions: 37
              </div>
            </div>

            {/* Right Card: Version Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">Version Summary</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Number of Submissions by version</p>
                </div>

                <div className="h-48 w-full pt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={versionSummaryData}
                      margin={{ top: 10, right: 20, left: -15, bottom: 15 }}
                    >
                      <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                      <XAxis
                        dataKey="version"
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                        dy={6}
                        label={{
                          value: 'Versions',
                          position: 'insideBottom',
                          offset: -10,
                          style: { textAnchor: 'middle', fill: '#64748b', fontSize: 11, fontWeight: 500 },
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
                        domain={[0, 20]}
                        ticks={[0, 4, 8, 12, 16, 20]}
                        label={{
                          value: 'Number of Submissions',
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fill: '#64748b', fontSize: 11, fontWeight: 500 },
                          dx: 2,
                        }}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#2F5EA8"
                        radius={[2, 2, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table Card: Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                    <th
                      onClick={() => {
                        setStatusSortKey('id');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12"
                    >
                      <div className="flex items-center gap-1">
                        <span>#</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('submissionId');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Submission ID</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('facility');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Facility</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('submittedBy');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Submitted By</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('submittedDate');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Submitted Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('reviewedBy');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Reviewed By</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('reviewDate');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Review Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => {
                        setStatusSortKey('status');
                        setStatusSortAsc(!statusSortAsc);
                      }}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <span>Current Status</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {sortedStatusRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500">{row.id}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{row.submissionId}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{row.facility}</td>
                      <td className="py-3.5 px-4 text-slate-700">{row.submittedBy}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.submittedDate}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.reviewedBy}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.reviewDate}</td>
                      <td className="py-3.5 px-4">
                        {row.statusType === 'approved' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E8F8F0] text-[#16A34A] border border-emerald-200/60">
                            Approved
                          </span>
                        )}
                        {row.statusType === 'under_review' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E0F4F7] text-[#0D9488] border border-teal-200/60">
                            Under Review
                          </span>
                        )}
                        {row.statusType === 'correction' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#E2E8F0] text-[#475569] border border-slate-300/80">
                            Correction Requested
                          </span>
                        )}
                        {row.statusType === 'rejected' && (
                          <span className="px-3 py-1 rounded-full font-semibold text-[11px] bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60">
                            Rejected
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 3: SUBMISSION HISTORY (Original Archive) */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                    <th className="pb-3">Reporting Year</th>
                    <th className="pb-3">Submission ID</th>
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Emissions</th>
                    <th className="pb-3">Submitted Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Verifier</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportsList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 font-extrabold text-[#004B87] text-sm">{row.year}</td>
                      <td className="py-4 font-mono font-bold text-slate-800">{row.id}</td>
                      <td className="py-4 font-mono font-bold text-slate-600">{row.version}</td>
                      <td className="py-4 font-bold text-navy-900">{row.emissions}</td>
                      <td className="py-4 text-slate-500">{row.submittedDate}</td>
                      <td className="py-4">
                        <Badge variant={row.statusVariant} size="sm">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-slate-700 font-medium">{row.verifier}</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => alert(`Viewing dossier ${row.id}`)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleExport(row.id)}
                            className="p-1.5 rounded-lg bg-[#004B87]/10 hover:bg-[#004B87]/20 text-[#004B87] font-bold cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
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
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* TAB 4: VERSION HISTORY & AUDIT LOG */}
      {/* ------------------------------------------------------------------------- */}
      {activeTab === 'version' && (
        <div className="space-y-6 animate-fade-in">
          <GlassCard className="p-6 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <History className="w-5 h-5 text-[#004B87]" />
                Version History & Regulatory Audit Trail — 2026
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Complete revision logs and reviewer action history for statutory transparency.
              </p>
            </div>

            <div className="space-y-4">
              {auditHistory.map((ver: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-[#004B87]">
                        Version {ver.version}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">• {ver.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{ver.action} — {ver.comments || 'No remarks recorded'}</p>
                    <div className="text-[11px] text-slate-500">Author / Authority: {ver.user} ({ver.role})</div>
                  </div>

                  <button
                    onClick={() => alert(`Comparing version ${ver.version} against current live submission.`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Version Details
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
export default MRVReportsView;
