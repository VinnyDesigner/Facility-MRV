import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Filter,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  Activity,
  Building2,
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
  Legend,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const EADAnalyticsView: React.FC = () => {
  const { reportingYear } = useMRV();

  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedEmirate, setSelectedEmirate] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');

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
    { tier: 'Tier 3 (Heavy/Continuous)', count: 32, emissions: 34.2, color: '#0878C9' },
    { tier: 'Tier 2 (Country Specific)', count: 64, emissions: 15.8, color: '#19B5D8' },
    { tier: 'Tier 1 (Standard Defaults)', count: 52, emissions: 3.4, color: '#16A6A0' },
  ];

  return (
    <div className="h-full overflow-y-auto pr-1 space-y-6 animate-fade-in pb-12 no-scrollbar">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-[#0B2238] to-[#143E65] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-brand/20 text-cyan-300 text-xs font-bold">
              Subnational Environmental Intelligence
            </span>
            <span className="text-xs text-slate-300">Reporting Year {reportingYear}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Emissions Intelligence & Sector Analytics
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
            Real-time multi-dimensional intelligence on provincial emissions trajectories, sector benchmarks, and regulatory compliance distribution.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting full EAD Subnational GHG Dataset (CSV / PDF)')}
          className="btn-primary text-xs font-bold py-2.5 px-4 flex items-center gap-2 shadow-lg shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-navy-900">
          <Filter className="w-4 h-4 text-primary-600" />
          <span>Analytics Filters:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-mrv-muted uppercase mb-1">
              Sector Scope
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              <option value="ALL">All Sectors (5 Sectors)</option>
              <option value="Energy">Energy & Power Generation</option>
              <option value="IPPU">IPPU (Industrial Processes)</option>
              <option value="Waste">Waste Management</option>
              <option value="Transport">Commercial Transport</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-mrv-muted uppercase mb-1">
              Emirate Region
            </label>
            <select
              value={selectedEmirate}
              onChange={(e) => setSelectedEmirate(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              <option value="ALL">All Abu Dhabi Regions</option>
              <option value="Abu Dhabi">Abu Dhabi Mainland & ICAD/KIZAD</option>
              <option value="Al Ain">Al Ain Region</option>
              <option value="Al Dhafra">Al Dhafra (Ruwais / Western)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-mrv-muted uppercase mb-1">
              Accounting Tier Level
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              <option value="ALL">All Tiers (Tier 1, 2, 3)</option>
              <option value="Tier 1">Tier 1 (&lt; 100k tCO₂e)</option>
              <option value="Tier 2">Tier 2 (100k – 1M tCO₂e)</option>
              <option value="Tier 3">Tier 3 (&gt; 1M tCO₂e / CEMS)</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* 6 Advanced Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Total Emissions by Year Stacked Area */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                1. Subnational Emissions Trend by Sector (2022–2026)
              </h3>
              <p className="text-xs text-mrv-muted">
                Stacked annual GHG trajectories in Million tCO₂e
              </p>
            </div>
            <Badge variant="cyan">Abu Dhabi Total</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={multiYearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 120, 201, 0.08)" />
                <XAxis dataKey="year" stroke="#667085" fontSize={11} />
                <YAxis stroke="#667085" fontSize={11} tickFormatter={(v) => `${v}M`} />
                <Tooltip
                  formatter={(val: number) => [`${val}M tCO₂e`, 'Emissions']}
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="Energy" stackId="1" stroke="#0878C9" fill="#0878C9" fillOpacity={0.6} />
                <Area type="monotone" dataKey="IPPU" stackId="1" stroke="#16A6A0" fill="#16A6A0" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Waste" stackId="1" stroke="#19B5D8" fill="#19B5D8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Transport" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Emissions by Sector */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                2. Sectoral Volume & Facility Concentration
              </h3>
              <p className="text-xs text-mrv-muted">
                Emissions (Million tCO₂e) per regulated sector
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              53.4M Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 120, 201, 0.08)" />
                <XAxis dataKey="sector" stroke="#667085" fontSize={10} tickFormatter={(s) => s.split(' ')[0]} />
                <YAxis stroke="#667085" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val}M tCO₂e`, 'Emissions']}
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
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
        </GlassCard>

        {/* Chart 3: Submissions Status Distribution */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                3. Submissions Processing Status
              </h3>
              <p className="text-xs text-mrv-muted">
                Breakdown of 118 received facility submissions
              </p>
            </div>
            <Badge variant="info">Cycle 2026</Badge>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-primary-100/60">
            {statusPieData.map((st) => (
              <div key={st.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                <span className="text-mrv-muted text-[11px] truncate">{st.name}:</span>
                <span className="font-bold text-navy-900">{st.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Chart 4: Facility Compliance Distribution */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                4. Compliance Readiness Distribution
              </h3>
              <p className="text-xs text-mrv-muted">
                148 Facilities grouped by compliance score
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              78% Avg Score
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 120, 201, 0.08)" />
                <XAxis dataKey="range" stroke="#667085" fontSize={11} />
                <YAxis stroke="#667085" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [val, 'Facilities']}
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
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
        </GlassCard>

        {/* Chart 5: Reporting Influx Over Time */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                5. Weekly Submissions Influx vs March 31 Deadline
              </h3>
              <p className="text-xs text-mrv-muted">
                Rate of incoming reports ahead of statutory deadline
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Deadline: 31 March
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionInfluxData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(8, 120, 201, 0.08)" />
                <XAxis dataKey="week" stroke="#667085" fontSize={11} />
                <YAxis stroke="#667085" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(7, 26, 43, 0.9)',
                    borderRadius: '12px',
                    color: '#fff',
                    border: '1px solid rgba(25, 181, 216, 0.4)',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="submissions" stroke="#0878C9" strokeWidth={3} name="Weekly Intake" />
                <Line type="monotone" dataKey="cumulative" stroke="#16A6A0" strokeWidth={2} strokeDasharray="4 4" name="Cumulative" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 6: Tier Level Distribution */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">
                6. Tier Classification & Emissions Coverage
              </h3>
              <p className="text-xs text-mrv-muted">
                Tier 3 accounts for 64% of total subnational emissions
              </p>
            </div>
            <Badge variant="cyan">Methodology Distribution</Badge>
          </div>

          <div className="space-y-4 pt-2">
            {tierDistributionData.map((t) => (
              <div key={t.tier} className="p-4 rounded-2xl bg-white/90 border border-primary-100/70">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-navy-900">{t.tier}</span>
                  <span className="text-primary-700">{t.emissions}M tCO₂e ({t.count} Facilities)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(t.emissions / 53.4) * 100}%`,
                      backgroundColor: t.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
