import React, { useState, useMemo } from 'react';
import {
  Download,
  Calendar,
  Check,
  BarChart3,
  Layers,
  ShieldCheck,
  FileText,
  ArrowUpDown,
  TrendingDown,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMRV } from '../context/MRVContext';

export const EADAnalyticsView: React.FC = () => {
  const { reportingYear } = useMRV();

  const [activeTab, setActiveTab] = useState<'sector-emissions' | 'submissions-tracking' | 'compliance-tiers' | 'audit-log'>('sector-emissions');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedEmirate, setSelectedEmirate] = useState('ALL');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Table sorting states
  const [sectorSortKey, setSectorSortKey] = useState<'id' | 'sector' | 'facilities' | 'baseline' | 'emissions' | 'change' | 'tier' | 'share'>('id');
  const [sectorSortAsc, setSectorSortAsc] = useState<boolean>(true);

  const [subSortKey, setSubSortKey] = useState<'id' | 'sector' | 'facilities' | 'submitted' | 'review' | 'reverted' | 'turnaround' | 'compliance'>('id');
  const [subSortAsc, setSubSortAsc] = useState<boolean>(true);

  const [tierSortKey, setTierSortKey] = useState<'id' | 'tier' | 'facilities' | 'emissions' | 'share' | 'uncertainty'>('id');
  const [tierSortAsc, setTierSortAsc] = useState<boolean>(true);

  const [auditSortKey, setAuditSortKey] = useState<'id' | 'timestamp' | 'action' | 'facility' | 'sector' | 'reviewer' | 'verdict'>('id');
  const [auditSortAsc, setAuditSortAsc] = useState<boolean>(true);

  const handleExport = () => {
    setExportNotice('Dataset Exported Successfully (CSV)');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Chart 1: Total Emissions by Year (Million tCO2e)
  const multiYearData = [
    { year: '2022', Energy: 26.2, IPPU: 19.5, Waste: 5.8, Transport: 4.2 },
    { year: '2023', Energy: 25.8, IPPU: 19.1, Waste: 5.6, Transport: 4.1 },
    { year: '2024', Energy: 25.4, IPPU: 18.8, Waste: 5.4, Transport: 4.0 },
    { year: '2025', Energy: 25.1, IPPU: 18.6, Waste: 5.3, Transport: 3.9 },
    { year: '2026 (YTD)', Energy: 24.8, IPPU: 18.4, Waste: 5.2, Transport: 3.9 },
  ];

  // Chart 2: Sector Breakdown
  const sectorData = [
    { sector: 'Energy & Power', emissions: 24.8, facilities: 42, color: '#0878C9' },
    { sector: 'IPPU (Heavy Ind)', emissions: 18.4, facilities: 36, color: '#16A6A0' },
    { sector: 'Waste Management', emissions: 5.2, facilities: 28, color: '#19B5D8' },
    { sector: 'Transport Fleets', emissions: 3.9, facilities: 31, color: '#F59E0B' },
    { sector: 'Agriculture & Forestry', emissions: 1.1, facilities: 11, color: '#10B981' },
  ];

  // Chart 3: Submission Status Breakdown
  const statusPieData = [
    { name: 'Approved', value: 68, color: '#10B981' },
    { name: 'Under Review', value: 24, color: '#0878C9' },
    { name: 'Corrections Required (30d)', value: 14, color: '#F59E0B' },
    { name: 'Draft / Initial', value: 6, color: '#94A3B8' },
    { name: 'Rejected', value: 6, color: '#F43F5E' },
  ];

  // Chart 4: Facility Compliance Distribution
  const complianceDistData = [
    { range: '90-100% (High)', count: 54, fill: '#10B981' },
    { range: '75-89% (On Track)', count: 62, fill: '#0878C9' },
    { range: '50-74% (Pending)', count: 22, fill: '#F59E0B' },
    { range: '<50% (Action Req)', count: 10, fill: '#F43F5E' },
  ];

  // Chart 5: Reporting Influx Activity Over Time (Submissions per week leading to March 31)
  const submissionInfluxData = [
    { week: 'W1 Jan', submissions: 8, cumulative: 8 },
    { week: 'W3 Jan', submissions: 14, cumulative: 22 },
    { week: 'W1 Feb', submissions: 22, cumulative: 44 },
    { week: 'W3 Feb', submissions: 31, cumulative: 75 },
    { week: 'W1 Mar', submissions: 25, cumulative: 100 },
    { week: 'W3 Mar (Peak)', submissions: 18, cumulative: 118 },
  ];

  // Chart 6: Tier Level Distribution
  const tierDistributionData = [
    { tier: 'Tier 3 (Heavy / Continuous CEMS)', count: 32, emissions: 34.2, color: '#0878C9' },
    { tier: 'Tier 2 (Facility Specific / Lab Analysis)', count: 64, emissions: 15.8, color: '#19B5D8' },
    { tier: 'Tier 1 (IPCC Standard Defaults)', count: 52, emissions: 3.4, color: '#16A6A0' },
  ];

  // Tab 1 Table: Sectoral Emissions Detail
  const rawSectorRows = [
    { id: 1, sector: 'Energy & Power Generation', facilities: 42, baseline: 26.2, emissions: 24.8, change: -5.3, tier: 'Tier 3 (CEMS)', share: 46.4 },
    { id: 2, sector: 'IPPU (Industrial Processes)', facilities: 36, baseline: 19.5, emissions: 18.4, change: -5.6, tier: 'Tier 3 / Tier 2', share: 34.5 },
    { id: 3, sector: 'Waste Management', facilities: 28, baseline: 5.8, emissions: 5.2, change: -10.3, tier: 'Tier 2 (Mass Balance)', share: 9.7 },
    { id: 4, sector: 'Commercial Transport Fleets', facilities: 31, baseline: 4.2, emissions: 3.9, change: -7.1, tier: 'Tier 1 / Tier 2', share: 7.3 },
    { id: 5, sector: 'Agriculture & Forestry', facilities: 11, baseline: 1.2, emissions: 1.1, change: -8.3, tier: 'Tier 1 (IPCC)', share: 2.1 },
  ];

  const sortedSectorRows = useMemo(() => {
    return [...rawSectorRows].sort((a: any, b: any) => {
      const valA = a[sectorSortKey];
      const valB = b[sectorSortKey];
      if (typeof valA === 'string') {
        return sectorSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sectorSortAsc ? valA - valB : valB - valA;
    });
  }, [sectorSortKey, sectorSortAsc]);

  // Tab 2 Table: Submission Status & SLA Dossier
  const rawSubRows = [
    { id: 1, sector: 'Energy & Power Generation', facilities: 42, submitted: 39, review: 2, reverted: 1, turnaround: 4.2, compliance: 92.8 },
    { id: 2, sector: 'IPPU (Industrial Processes)', facilities: 36, submitted: 32, review: 3, reverted: 1, turnaround: 5.1, compliance: 88.9 },
    { id: 3, sector: 'Waste Management', facilities: 28, submitted: 24, review: 2, reverted: 2, turnaround: 3.8, compliance: 85.7 },
    { id: 4, sector: 'Commercial Transport Fleets', facilities: 31, submitted: 26, review: 3, reverted: 2, turnaround: 4.9, compliance: 83.9 },
    { id: 5, sector: 'Agriculture & Forestry', facilities: 11, submitted: 10, review: 1, reverted: 0, turnaround: 2.7, compliance: 90.9 },
  ];

  const sortedSubRows = useMemo(() => {
    return [...rawSubRows].sort((a: any, b: any) => {
      const valA = a[subSortKey];
      const valB = b[subSortKey];
      if (typeof valA === 'string') {
        return subSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return subSortAsc ? valA - valB : valB - valA;
    });
  }, [subSortKey, subSortAsc]);

  // Tab 3 Table: Tier Methodology Matrix
  const rawTierRows = [
    { id: 1, tier: 'Tier 3 (> 1M tCO₂e / CEMS)', method: 'Continuous Emission Monitoring Systems (CEMS)', facilities: 32, emissions: 34.2, share: 64.0, uncertainty: '±2.5%', standard: 'ISO 14064-3 Accredited' },
    { id: 2, tier: 'Tier 2 (100k – 1M tCO₂e)', method: 'Facility-Specific Lab Fuel Analysis & Mass Balance', facilities: 64, emissions: 15.8, share: 29.6, uncertainty: '±5.0%', standard: 'EN/ISO Fuel Testing' },
    { id: 3, tier: 'Tier 1 (< 100k tCO₂e)', method: 'Statutory Default IPCC Emission Factors & Bills', facilities: 52, emissions: 3.4, share: 6.4, uncertainty: '±7.5%', standard: 'National Inventory Standard' },
  ];

  const sortedTierRows = useMemo(() => {
    return [...rawTierRows].sort((a: any, b: any) => {
      const valA = a[tierSortKey];
      const valB = b[tierSortKey];
      if (typeof valA === 'string') {
        return tierSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return tierSortAsc ? valA - valB : valB - valA;
    });
  }, [tierSortKey, tierSortAsc]);

  // Tab 4 Table: Regulatory Audit Log
  const rawAuditRows = [
    { id: 1, timestamp: '2026-03-24 11:42', action: 'Annual Emission Dossier Approved', facility: 'Green Mountain Cement Factory', sector: 'IPPU', reviewer: 'EAD Lead Auditor #04', verdict: 'Approved', hash: 'DOS-2026-8910-V2' },
    { id: 2, timestamp: '2026-03-23 16:15', action: '30-Day Correction Window Triggered', facility: 'Al Ruwais Gas Processing Complex', sector: 'Energy & Power', reviewer: 'EAD Reviewer #12', verdict: 'Reverted (30d)', hash: 'REV-2026-4412-V1' },
    { id: 3, timestamp: '2026-03-22 09:30', action: 'Continuous CEMS Calibration Certificate Validated', facility: 'Abu Dhabi Power Generation Station #4', sector: 'Energy & Power', reviewer: 'EAD CEMS Specialist', verdict: 'Verified', hash: 'CAL-2026-9901-C3' },
    { id: 4, timestamp: '2026-03-20 14:05', action: 'Tier 2 Laboratory Assay Accepted', facility: 'Al Dhafra Industrial Recycling Facility', sector: 'Waste Management', reviewer: 'EAD Verification Board', verdict: 'Approved', hash: 'LAB-2026-3120-V1' },
    { id: 5, timestamp: '2026-03-18 10:20', action: 'Fleet Activity Log Cross-Check Passed', facility: 'Emirates Commercial Logistics Fleet A', sector: 'Commercial Transport', reviewer: 'EAD Reviewer #07', verdict: 'Approved', hash: 'TRN-2026-7781-V1' },
    { id: 6, timestamp: '2026-03-15 15:50', action: 'Biomass Fraction Verification Pending Lab Result', facility: 'Barakah Agricultural Waste Processing', sector: 'Agriculture & Forestry', reviewer: 'EAD Bio Specialist', verdict: 'Under Review', hash: 'AGR-2026-1102-V1' },
  ];

  const sortedAuditRows = useMemo(() => {
    return [...rawAuditRows].sort((a: any, b: any) => {
      const valA = a[auditSortKey];
      const valB = b[auditSortKey];
      if (typeof valA === 'string') {
        return auditSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return auditSortAsc ? valA - valB : valB - valA;
    });
  }, [auditSortKey, auditSortAsc]);

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* ------------------------------------------------------------------------- */}
      {/* 1. TOP HEADER ROW (Title on Left, Filters & CTA on Right) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 mb-2.5">
        {/* Left: View Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
              Emissions Intelligence & Sector Analytics
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              Comprehensive Subnational Trajectories, Sector Benchmarks & Regulatory Dossiers
            </p>
          </div>
          {exportNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in shrink-0">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Right: Multi-Dimensional Filter Dropdowns + Year + Export CTA Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sector Scope Dropdown */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="h-9 pl-3.5 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
            >
              <option value="ALL">All Sectors</option>
              <option value="Energy">Energy & Power</option>
              <option value="IPPU">IPPU (Heavy Ind)</option>
              <option value="Waste">Waste Management</option>
              <option value="Transport">Commercial Transport</option>
            </select>
          </div>

          {/* Emirate Region Dropdown */}
          <div className="relative">
            <select
              value={selectedEmirate}
              onChange={(e) => setSelectedEmirate(e.target.value)}
              className="h-9 pl-3.5 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="Abu Dhabi">Abu Dhabi Mainland</option>
              <option value="Al Ain">Al Ain</option>
              <option value="Al Dhafra">Al Dhafra (Ruwais)</option>
            </select>
          </div>

          {/* Calendar Year Dropdown */}
          <div className="relative">
            <div className="h-9 flex items-center bg-white border border-slate-200 rounded-xl shadow-xs px-3">
              <Calendar className="w-3.5 h-3.5 text-[#004B87] mr-1.5 shrink-0" />
              <select
                value={reportingYear || '2026'}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer h-full pr-1"
                disabled
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------------- */}
      {/* 2. MAIN WHITE CARD CONTAINER (Tabs inside the white card header) */}
      {/* ------------------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Navigation Sub-Tabs (Sticky Bar inside Card Header) */}
        <div className="flex-shrink-0 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2.5">
          <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
            {[
              { id: 'sector-emissions', label: 'Sector Emissions Analytics', icon: BarChart3 },
              { id: 'submissions-tracking', label: 'Submission Status & Tracking', icon: Layers },
              { id: 'compliance-tiers', label: 'Compliance & Methodology Tiers', icon: ShieldCheck },
              { id: 'audit-log', label: 'Regulatory Audit Log', icon: FileText },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-[#336D9F] hover:bg-white/60 font-semibold'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Card Body */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-[18px] pr-1">
          {/* ------------------------------------------------------------------------- */}
          {/* TAB 1: SECTOR EMISSIONS ANALYTICS */}
          {/* ------------------------------------------------------------------------- */}
          {activeTab === 'sector-emissions' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* Top 2 Visual Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 1: Total Emissions by Year Stacked Area */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        1. Subnational Emissions Trend by Sector (2022–2026)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Stacked annual GHG trajectories in Million tCO₂e
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#004B87] border border-sky-200/70">
                      Abu Dhabi Total
                    </span>
                  </div>

                  <div className="h-64 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={multiYearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}M`} />
                        <Tooltip
                          formatter={(val: number) => [`${val}M tCO₂e`, 'Emissions']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        />
                        <Area type="monotone" dataKey="Energy" stackId="1" stroke="#0878C9" fill="#0878C9" fillOpacity={0.65} />
                        <Area type="monotone" dataKey="IPPU" stackId="1" stroke="#16A6A0" fill="#16A6A0" fillOpacity={0.65} />
                        <Area type="monotone" dataKey="Waste" stackId="1" stroke="#19B5D8" fill="#19B5D8" fillOpacity={0.65} />
                        <Area type="monotone" dataKey="Transport" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.65} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Emissions by Sector Bar Chart */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        2. Sectoral Volume & Facility Concentration
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Emissions (Million tCO₂e) per regulated sector
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      53.4M Total
                    </span>
                  </div>

                  <div className="h-64 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="sector" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(s) => s.split(' ')[0]} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          formatter={(val: number) => [`${val}M tCO₂e`, 'Emissions']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        />
                        <Bar dataKey="emissions" fill="#0878C9" radius={[6, 6, 0, 0]}>
                          {sectorData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Table: Sectoral Emissions Detail */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">Sectoral Baseline & Trajectory Breakdown</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Multi-year statutory inventory and accounting classification</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#004B87] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/80">
                    5 Regulated Sectors Active
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                        <th onClick={() => { setSectorSortKey('id'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12">
                          <div className="flex items-center gap-1"><span>#</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('sector'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Sector Scope</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('facilities'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Regulated Facilities</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('baseline'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>2022 Baseline (MtCO₂e)</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('emissions'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>2026 YTD (MtCO₂e)</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('change'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>YoY Trajectory</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('tier'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Primary Verification Tier</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSectorSortKey('share'); setSectorSortAsc(!sectorSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Share of Total</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {sortedSectorRows.map((row, idx) => (
                        <tr key={row.id} className={`${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="py-3.5 px-4 text-slate-500 font-normal">{row.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.sector}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">{row.facilities} facilities</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{row.baseline} M</td>
                          <td className="py-3.5 px-4 font-bold text-[#004B87]">{row.emissions} M</td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-emerald-600 flex items-center gap-1">
                              <span>▼</span> {Math.abs(row.change)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 text-[#004B87] border border-sky-200/80">
                              {row.tier}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {row.share}%
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
          {/* TAB 2: SUBMISSIONS & TRACKING */}
          {/* ------------------------------------------------------------------------- */}
          {activeTab === 'submissions-tracking' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* Top 2 Visual Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 3: Submissions Status Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        3. Submissions Processing Status
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Breakdown of 118 received facility submissions
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#004B87] border border-sky-200/70">
                      Cycle 2026
                    </span>
                  </div>

                  <div className="h-56 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val: number) => [val, 'Submissions']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100">
                    {statusPieData.map((st) => (
                      <div key={st.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                        <span className="text-slate-500 text-[11px] truncate">{st.name}:</span>
                        <span className="font-bold text-slate-800">{st.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 5: Weekly Influx Activity */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        4. Weekly Submissions Influx vs March 31 Deadline
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Rate of incoming reports ahead of statutory deadline
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                      Deadline: 31 March
                    </span>
                  </div>

                  <div className="h-64 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={submissionInfluxData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        />
                        <Line type="monotone" dataKey="submissions" stroke="#0878C9" strokeWidth={3} name="Weekly Intake" />
                        <Line type="monotone" dataKey="cumulative" stroke="#16A6A0" strokeWidth={2} strokeDasharray="4 4" name="Cumulative" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Table: Sectoral Intake & Review SLA Dossier */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">Subnational Sectoral Intake & Review SLA Dossier</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Processing turnaround and statutory SLA tracking across sectors</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                    88.4% Subnational SLA Compliance
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                        <th onClick={() => { setSubSortKey('id'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12">
                          <div className="flex items-center gap-1"><span>#</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('sector'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Regulated Sector</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('facilities'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Registered Facilities</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('submitted'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Submitted & Verified</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('review'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Under Review</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('reverted'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Reverted (30d Window)</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('turnaround'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Avg Turnaround</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setSubSortKey('compliance'); setSubSortAsc(!subSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>SLA Adherence</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {sortedSubRows.map((row, idx) => (
                        <tr key={row.id} className={`${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="py-3.5 px-4 text-slate-500 font-normal">{row.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.sector}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">{row.facilities}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">{row.submitted}</td>
                          <td className="py-3.5 px-4 font-semibold text-[#004B87]">{row.review}</td>
                          <td className="py-3.5 px-4 font-semibold text-amber-600">{row.reverted}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{row.turnaround} days</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {row.compliance}%
                            </span>
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
          {/* TAB 3: COMPLIANCE & METHODOLOGY TIERS */}
          {/* ------------------------------------------------------------------------- */}
          {activeTab === 'compliance-tiers' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* Top 2 Visual Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Chart 4: Facility Compliance Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        5. Compliance Readiness Distribution
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        148 Facilities grouped by compliance readiness score
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      78% Avg Score
                    </span>
                  </div>

                  <div className="h-64 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complianceDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={true} horizontal={true} stroke="#f1f5f9" strokeDasharray="3 3" />
                        <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                          formatter={(val: number) => [val, 'Facilities']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            color: '#0f172a',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {complianceDistData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 6: Tier Classification & Emissions Coverage */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        6. Tier Classification & Emissions Coverage
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Tier 3 accounts for 64% of total subnational emissions
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#004B87] border border-sky-200/70">
                      Methodology Breakdown
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {tierDistributionData.map((t) => (
                      <div key={t.tier} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-800">{t.tier}</span>
                          <span className="text-[#004B87] font-semibold">{t.emissions}M tCO₂e ({t.count} Facilities)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${(t.emissions / 53.4) * 100}%`,
                              backgroundColor: t.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Table: MRV Accounting Methodology & Measurement Tier Matrix */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">MRV Accounting Methodology & Measurement Tier Matrix</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Rigorous IPCC / ISO 14064 tiering and data uncertainty thresholds</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#004B87] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200/80">
                    100% Facilities Classified
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                        <th onClick={() => { setTierSortKey('id'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12">
                          <div className="flex items-center gap-1"><span>#</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setTierSortKey('tier'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Accounting Tier & Scope</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th className="py-3 px-4 font-semibold text-slate-700">Measurement Standard</th>
                        <th onClick={() => { setTierSortKey('facilities'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Facilities</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setTierSortKey('emissions'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Aggregate Emissions</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setTierSortKey('share'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Share %</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setTierSortKey('uncertainty'); setTierSortAsc(!tierSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Uncertainty</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th className="py-3 px-4 font-semibold text-slate-700">Audit Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {sortedTierRows.map((row, idx) => (
                        <tr key={row.id} className={`${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="py-3.5 px-4 text-slate-500 font-normal">{row.id}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.tier}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{row.method}</td>
                          <td className="py-3.5 px-4 font-bold text-[#004B87]">{row.facilities}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{row.emissions} MtCO₂e</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.share}%</td>
                          <td className="py-3.5 px-4 font-semibold text-emerald-700">{row.uncertainty}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {row.standard}
                            </span>
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
          {/* TAB 4: REGULATORY AUDIT LOG */}
          {/* ------------------------------------------------------------------------- */}
          {activeTab === 'audit-log' && (
            <div className="space-y-[18px] animate-fade-in">
              {/* Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Regulatory Actions</span>
                  <span className="text-xl font-black text-slate-900 mt-1">1,482</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Verifications Approved</span>
                  <span className="text-xl font-black text-emerald-700 mt-1">118</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Revert Notices Issued</span>
                  <span className="text-xl font-black text-amber-700 mt-1">14</span>
                </div>
                <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200/70 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-[#004B87] uppercase tracking-wider">Active 30d Correction Windows</span>
                  <span className="text-xl font-black text-[#004B87] mt-1">9</span>
                </div>
              </div>

              {/* Detailed Audit Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight">Subnational Regulatory Activity & Review Audit Dossier</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Immutable audit trail of compliance determinations, reviewer approvals, and revert notices</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    Real-time Audit Trail
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200">
                        <th onClick={() => { setAuditSortKey('id'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors w-12">
                          <div className="flex items-center gap-1"><span>#</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('timestamp'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Timestamp</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('action'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Action / Event</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('facility'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Regulated Facility</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('sector'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Sector</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('reviewer'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Reviewer / Authority</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th onClick={() => { setAuditSortKey('verdict'); setAuditSortAsc(!auditSortAsc); }} className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition-colors">
                          <div className="flex items-center gap-1"><span>Verdict</span><ArrowUpDown className="w-3 h-3 text-slate-400" /></div>
                        </th>
                        <th className="py-3 px-4 font-semibold text-slate-700">Dossier Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                      {sortedAuditRows.map((row, idx) => (
                        <tr key={row.id} className={`${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors`}>
                          <td className="py-3.5 px-4 text-slate-500 font-normal">{row.id}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">{row.timestamp}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.action}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{row.facility}</td>
                          <td className="py-3.5 px-4 text-slate-600">{row.sector}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{row.reviewer}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                row.verdict === 'Approved' || row.verdict === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                  : row.verdict.includes('Reverted')
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                                  : 'bg-sky-50 text-[#004B87] border border-sky-200/80'
                              }`}
                            >
                              {row.verdict}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {row.hash}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
