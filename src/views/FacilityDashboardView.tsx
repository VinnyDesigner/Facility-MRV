import React, { useState } from 'react';
import {
  Building2,
  Users,
  FileText,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Calendar,
  Edit3,
  UploadCloud,
  Download,
  ArrowRight,
  ChevronDown,
  Plus,
  Check,
  CheckCheck,
  Archive,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { useMRV } from '../context/MRVContext';
import { NotchCard } from '../components/ui/NotchCard';

// Dashboard Period-specific Data Dictionary
const PERIOD_DATA: Record<
  string,
  {
    kpis: {
      totalFacilities: { value: string; sub: string };
      activeFacilities: { value: string; sub: string };
      dataSubmission: { value: string; total: string; sub: string; percent: string };
      pendingVerification: { value: string; sub: string; isZero?: boolean };
      compliance: { value: string; sub: string };
    };
    monthlyDataTotal: { name: string; current: number; previous: number }[];
    monthlyDataScope1: { name: string; current: number; previous: number }[];
    monthlyDataScope2: { name: string; current: number; previous: number }[];
    quarterlyData: { name: string; current: number; previous: number }[];
    legend: { current: string; previous: string };
    workflow: {
      registered: number;
      registeredPct: string;
      dataEntry: number;
      dataEntryPct: string;
      submitted: number;
      submittedPct: string;
      underVerification: number;
      underVerificationPct: string;
      verified: number;
      verifiedPct: string;
      rate: string;
    };
    attentionRequired: {
      id: number;
      type: 'red' | 'orange' | 'amber' | 'blue' | 'emerald';
      title: string;
      category: string;
      actionText: string;
      targetView: string;
    }[];
    sectorData: { name: string; percent: string; width: string; color: string }[];
    completeness: {
      overall: number;
      dashoffset: number;
      energy: number;
      fuel: number;
      electricity: number;
      waste: number;
      other: number;
      highest: string;
    };
    activities: {
      time: string;
      text: string;
      badge: string;
      badgeClass: string;
      dotColor: string;
    }[];
    auditSummary: string;
  }
> = {
  'FY 2026–27': {
    kpis: {
      totalFacilities: { value: '128', sub: '+8 this period' },
      activeFacilities: { value: '114', sub: '89% Active' },
      dataSubmission: { value: '96', total: '/ 114', sub: '84% submitted', percent: '84%' },
      pendingVerification: { value: '18', sub: 'Needs verification' },
      compliance: { value: '87%', sub: '+4.2%' },
    },
    monthlyDataTotal: [
      { name: 'Jan', current: 10800, previous: 4500 },
      { name: 'Feb', current: 13200, previous: 6200 },
      { name: 'Mar', current: 16900, previous: 8100 },
      { name: 'Apr', current: 15100, previous: 9500 },
      { name: 'May', current: 17800, previous: 11200 },
      { name: 'Jun', current: 19200, previous: 13000 },
      { name: 'Jul', current: 22100, previous: 14200 },
      { name: 'Aug', current: 20400, previous: 13800 },
    ],
    monthlyDataScope1: [
      { name: 'Jan', current: 7200, previous: 3100 },
      { name: 'Feb', current: 8900, previous: 4200 },
      { name: 'Mar', current: 11400, previous: 5500 },
      { name: 'Apr', current: 10100, previous: 6400 },
      { name: 'May', current: 12000, previous: 7600 },
      { name: 'Jun', current: 12900, previous: 8800 },
      { name: 'Jul', current: 14800, previous: 9600 },
      { name: 'Aug', current: 13700, previous: 9300 },
    ],
    monthlyDataScope2: [
      { name: 'Jan', current: 3600, previous: 1400 },
      { name: 'Feb', current: 4300, previous: 2000 },
      { name: 'Mar', current: 5500, previous: 2600 },
      { name: 'Apr', current: 5000, previous: 3100 },
      { name: 'May', current: 5800, previous: 3600 },
      { name: 'Jun', current: 6300, previous: 4200 },
      { name: 'Jul', current: 7300, previous: 4600 },
      { name: 'Aug', current: 6700, previous: 4500 },
    ],
    quarterlyData: [
      { name: 'Q1', current: 40900, previous: 18800 },
      { name: 'Q2', current: 52100, previous: 33700 },
      { name: 'Q3', current: 42500, previous: 28000 },
      { name: 'Q4 (Est)', current: 46800, previous: 31200 },
    ],
    legend: { current: 'FY 2026–27', previous: 'FY 2025–26' },
    workflow: {
      registered: 128,
      registeredPct: '100%',
      dataEntry: 114,
      dataEntryPct: '89%',
      submitted: 96,
      submittedPct: '75%',
      underVerification: 18,
      underVerificationPct: '14%',
      verified: 78,
      verifiedPct: '61%',
      rate: '81.3% (78 / 96)',
    },
    attentionRequired: [
      {
        id: 1,
        type: 'red',
        title: '12 facilities have incomplete data',
        category: 'Data Entry',
        actionText: 'Review →',
        targetView: 'data-entry',
      },
      {
        id: 2,
        type: 'orange',
        title: '18 submissions awaiting verification',
        category: 'Verification',
        actionText: 'Review →',
        targetView: 'data-review',
      },
      {
        id: 3,
        type: 'amber',
        title: '7 facilities have overdue submissions',
        category: 'Reporting Period',
        actionText: 'View →',
        targetView: 'reports',
      },
      {
        id: 4,
        type: 'blue',
        title: '4 facilities require data correction',
        category: 'Data Entry',
        actionText: 'Review →',
        targetView: 'data-entry',
      },
    ],
    sectorData: [
      { name: 'Industrial', percent: '52%', width: '52%', color: 'bg-[#004B87]' },
      { name: 'Commercial', percent: '27%', width: '27%', color: 'bg-[#00B2FE]' },
      { name: 'Institutional', percent: '13%', width: '13%', color: 'bg-[#8B5CF6]' },
      { name: 'Residential', percent: '5%', width: '5%', color: 'bg-[#F97316]' },
      { name: 'Other', percent: '3%', width: '3%', color: 'bg-slate-400' },
    ],
    completeness: {
      overall: 84,
      dashoffset: 40.2,
      energy: 92,
      fuel: 88,
      electricity: 95,
      waste: 72,
      other: 81,
      highest: 'Electricity (95%)',
    },
    activities: [
      {
        time: '10:42 AM',
        text: 'Facility A submitted energy data',
        badge: 'Data Entry',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '10:18 AM',
        text: 'Facility B registration completed',
        badge: 'Registration',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
      {
        time: '09:56 AM',
        text: 'Facility C verification completed',
        badge: 'Verification',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotColor: 'bg-amber-500',
      },
      {
        time: '09:31 AM',
        text: 'Facility D updated fuel consumption',
        badge: 'Data Entry',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '09:05 AM',
        text: 'Facility E data returned for correction',
        badge: 'Data Entry',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60',
        dotColor: 'bg-rose-500',
      },
    ],
    auditSummary: '5 recorded today',
  },

  'FY 2025–26': {
    kpis: {
      totalFacilities: { value: '120', sub: '+12 this period' },
      activeFacilities: { value: '110', sub: '92% Active' },
      dataSubmission: { value: '110', total: '/ 110', sub: '100% submitted', percent: '100%' },
      pendingVerification: { value: '0', sub: 'Fully Audited', isZero: true },
      compliance: { value: '96%', sub: '+5.8%' },
    },
    monthlyDataTotal: [
      { name: 'Jan', current: 9400, previous: 7800 },
      { name: 'Feb', current: 11800, previous: 8900 },
      { name: 'Mar', current: 14200, previous: 10100 },
      { name: 'Apr', current: 13500, previous: 9800 },
      { name: 'May', current: 15600, previous: 11400 },
      { name: 'Jun', current: 17100, previous: 12800 },
      { name: 'Jul', current: 18900, previous: 13900 },
      { name: 'Aug', current: 17600, previous: 13200 },
    ],
    monthlyDataScope1: [
      { name: 'Jan', current: 6300, previous: 5200 },
      { name: 'Feb', current: 7900, previous: 6000 },
      { name: 'Mar', current: 9600, previous: 6800 },
      { name: 'Apr', current: 9100, previous: 6600 },
      { name: 'May', current: 10500, previous: 7700 },
      { name: 'Jun', current: 11500, previous: 8600 },
      { name: 'Jul', current: 12700, previous: 9300 },
      { name: 'Aug', current: 11800, previous: 8900 },
    ],
    monthlyDataScope2: [
      { name: 'Jan', current: 3100, previous: 2600 },
      { name: 'Feb', current: 3900, previous: 2900 },
      { name: 'Mar', current: 4600, previous: 3300 },
      { name: 'Apr', current: 4400, previous: 3200 },
      { name: 'May', current: 5100, previous: 3700 },
      { name: 'Jun', current: 5600, previous: 4200 },
      { name: 'Jul', current: 6200, previous: 4600 },
      { name: 'Aug', current: 5800, previous: 4300 },
    ],
    quarterlyData: [
      { name: 'Q1', current: 35400, previous: 26800 },
      { name: 'Q2', current: 46200, previous: 34000 },
      { name: 'Q3', current: 53600, previous: 39900 },
      { name: 'Q4', current: 48900, previous: 36500 },
    ],
    legend: { current: 'FY 2025–26', previous: 'FY 2024–25' },
    workflow: {
      registered: 120,
      registeredPct: '100%',
      dataEntry: 118,
      dataEntryPct: '98%',
      submitted: 110,
      submittedPct: '92%',
      underVerification: 0,
      underVerificationPct: '0%',
      verified: 110,
      verifiedPct: '92%',
      rate: '100% (110 / 110)',
    },
    attentionRequired: [
      {
        id: 1,
        type: 'emerald',
        title: 'All 110 annual submissions approved by EAD',
        category: 'Cycle Complete',
        actionText: 'View →',
        targetView: 'reports',
      },
      {
        id: 2,
        type: 'blue',
        title: 'Third-party verification opinions archived',
        category: 'Audits Complete',
        actionText: 'Review →',
        targetView: 'data-review',
      },
      {
        id: 3,
        type: 'amber',
        title: '1 facility permit renewal scheduled for 2027',
        category: 'Facility Permits',
        actionText: 'View →',
        targetView: 'registration',
      },
      {
        id: 4,
        type: 'emerald',
        title: 'Abu Dhabi Subnational Inventory published',
        category: 'Official Release',
        actionText: 'View →',
        targetView: 'reports',
      },
    ],
    sectorData: [
      { name: 'Industrial', percent: '54%', width: '54%', color: 'bg-[#004B87]' },
      { name: 'Commercial', percent: '26%', width: '26%', color: 'bg-[#00B2FE]' },
      { name: 'Institutional', percent: '11%', width: '11%', color: 'bg-[#8B5CF6]' },
      { name: 'Residential', percent: '6%', width: '6%', color: 'bg-[#F97316]' },
      { name: 'Other', percent: '3%', width: '3%', color: 'bg-slate-400' },
    ],
    completeness: {
      overall: 98,
      dashoffset: 5.0,
      energy: 99,
      fuel: 98,
      electricity: 99,
      waste: 96,
      other: 97,
      highest: 'Energy & Electricity (99%)',
    },
    activities: [
      {
        time: '28 Mar 2026',
        text: 'EAD Regulatory Committee issued compliance certificate',
        badge: 'Approved',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
      {
        time: '22 Mar 2026',
        text: 'Bureau Veritas uploaded final assurance opinion',
        badge: 'Verification',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotColor: 'bg-amber-500',
      },
      {
        time: '15 Mar 2026',
        text: 'All 110 submissions successfully validated',
        badge: 'Reports',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '02 Mar 2026',
        text: 'Emirates Steel annual verified report approved',
        badge: 'Approved',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
      {
        time: '14 Feb 2026',
        text: 'Al Noor Energy submitted supplementary lab logs',
        badge: 'Data Entry',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
    ],
    auditSummary: 'Historical Cycle Closed',
  },

  'FY 2024–25': {
    kpis: {
      totalFacilities: { value: '108', sub: '+15 this period' },
      activeFacilities: { value: '98', sub: '91% Active' },
      dataSubmission: { value: '98', total: '/ 98', sub: '100% submitted', percent: '100%' },
      pendingVerification: { value: '0', sub: 'Baseline Certified', isZero: true },
      compliance: { value: '91%', sub: '+8.4%' },
    },
    monthlyDataTotal: [
      { name: 'Jan', current: 8100, previous: 6200 },
      { name: 'Feb', current: 9900, previous: 7100 },
      { name: 'Mar', current: 12400, previous: 8500 },
      { name: 'Apr', current: 11800, previous: 8200 },
      { name: 'May', current: 13600, previous: 9700 },
      { name: 'Jun', current: 14900, previous: 10900 },
      { name: 'Jul', current: 16200, previous: 11800 },
      { name: 'Aug', current: 15300, previous: 11200 },
    ],
    monthlyDataScope1: [
      { name: 'Jan', current: 5400, previous: 4100 },
      { name: 'Feb', current: 6600, previous: 4700 },
      { name: 'Mar', current: 8300, previous: 5700 },
      { name: 'Apr', current: 7900, previous: 5500 },
      { name: 'May', current: 9100, previous: 6500 },
      { name: 'Jun', current: 10000, previous: 7300 },
      { name: 'Jul', current: 10800, previous: 7900 },
      { name: 'Aug', current: 10200, previous: 7500 },
    ],
    monthlyDataScope2: [
      { name: 'Jan', current: 2700, previous: 2100 },
      { name: 'Feb', current: 3300, previous: 2400 },
      { name: 'Mar', current: 4100, previous: 2800 },
      { name: 'Apr', current: 3900, previous: 2700 },
      { name: 'May', current: 4500, previous: 3200 },
      { name: 'Jun', current: 4900, previous: 3600 },
      { name: 'Jul', current: 5400, previous: 3900 },
      { name: 'Aug', current: 5100, previous: 3700 },
    ],
    quarterlyData: [
      { name: 'Q1', current: 30400, previous: 21800 },
      { name: 'Q2', current: 40300, previous: 28800 },
      { name: 'Q3', current: 46400, previous: 33900 },
      { name: 'Q4', current: 41500, previous: 30200 },
    ],
    legend: { current: 'FY 2024–25', previous: 'FY 2023–24' },
    workflow: {
      registered: 108,
      registeredPct: '100%',
      dataEntry: 106,
      dataEntryPct: '98%',
      submitted: 98,
      submittedPct: '91%',
      underVerification: 0,
      underVerificationPct: '0%',
      verified: 98,
      verifiedPct: '91%',
      rate: '100% (98 / 98)',
    },
    attentionRequired: [
      {
        id: 1,
        type: 'emerald',
        title: 'Historical baseline locked & validated',
        category: 'Archive',
        actionText: 'View →',
        targetView: 'reports',
      },
      {
        id: 2,
        type: 'blue',
        title: 'ISO 14065 full compliance verified',
        category: 'Assurance',
        actionText: 'View →',
        targetView: 'data-review',
      },
      {
        id: 3,
        type: 'emerald',
        title: 'All 98 facilities achieved baseline compliance',
        category: 'Regulatory Approval',
        actionText: 'View →',
        targetView: 'reports',
      },
      {
        id: 4,
        type: 'blue',
        title: 'Federal emission reduction record reconciled',
        category: 'Federal MRV',
        actionText: 'Review →',
        targetView: 'reports',
      },
    ],
    sectorData: [
      { name: 'Industrial', percent: '57%', width: '57%', color: 'bg-[#004B87]' },
      { name: 'Commercial', percent: '23%', width: '23%', color: 'bg-[#00B2FE]' },
      { name: 'Institutional', percent: '11%', width: '11%', color: 'bg-[#8B5CF6]' },
      { name: 'Residential', percent: '6%', width: '6%', color: 'bg-[#F97316]' },
      { name: 'Other', percent: '3%', width: '3%', color: 'bg-slate-400' },
    ],
    completeness: {
      overall: 100,
      dashoffset: 0,
      energy: 100,
      fuel: 100,
      electricity: 100,
      waste: 100,
      other: 100,
      highest: 'All Streams (100%)',
    },
    activities: [
      {
        time: '31 Mar 2025',
        text: 'Annual subnational MRV cycle formally closed',
        badge: 'Closed',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200/60',
        dotColor: 'bg-slate-500',
      },
      {
        time: '20 Mar 2025',
        text: 'Audited emissions report endorsed by Environment Agency',
        badge: 'Approved',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
      {
        time: '10 Mar 2025',
        text: 'Final verified data transferred to federal registry',
        badge: 'Transferred',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60',
        dotColor: 'bg-blue-500',
      },
      {
        time: '18 Feb 2025',
        text: 'TÜV SÜD verified Scope 1 & 2 carbon inventory',
        badge: 'Verification',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60',
        dotColor: 'bg-amber-500',
      },
      {
        time: '25 Jan 2025',
        text: 'Industrial cluster baseline verified',
        badge: 'Registration',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        dotColor: 'bg-emerald-500',
      },
    ],
    auditSummary: 'Archived Baseline Record',
  },
};

export const FacilityDashboardView: React.FC = () => {
  const { setActiveView } = useMRV();

  // Filter States
  const [selectedPeriod, setSelectedPeriod] = useState<string>('FY 2026–27');
  const [scopeFilter, setScopeFilter] = useState<'Total' | 'Scope 1' | 'Scope 2'>('Total');
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Active Period Dataset
  const activePeriodData = PERIOD_DATA[selectedPeriod] || PERIOD_DATA['FY 2026–27'];

  const activeChartData =
    timeframe === 'Quarterly'
      ? activePeriodData.quarterlyData
      : scopeFilter === 'Scope 1'
      ? activePeriodData.monthlyDataScope1
      : scopeFilter === 'Scope 2'
      ? activePeriodData.monthlyDataScope2
      : activePeriodData.monthlyDataTotal;

  // Handle Export Simulation
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans animate-fade-in">
      {/* 1. TOP FIXED HEADER (Title & Date / Export Controls) */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Facility MRV Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Environmental Monitoring, Reporting & Verification
          </p>
        </div>

        {/* Action Controls: Only Date Filter and Export Report Button */}
        <div className="flex items-center gap-2.5">
          {/* Period Selector */}
          <div className="relative flex items-center bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-xs text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
            <Calendar className="w-4 h-4 text-[#004B87] mr-2 shrink-0" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-transparent bg-none !bg-none text-xs font-bold text-navy-900 focus:outline-hidden cursor-pointer pr-8 !pr-8"
            >
              <option value="FY 2026–27">FY 2026–27</option>
              <option value="FY 2025–26">FY 2025–26</option>
              <option value="FY 2024–25">FY 2024–25</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all duration-200 cursor-pointer ${
              exportSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e]'
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Report Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. SCROLLABLE DASHBOARD BODY */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-5 pb-16 font-sans no-scrollbar">
        {/* 2. TOP METRIC CARDS (Using the NotchCard scooped-corner design as before) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Total Facilities */}
        <NotchCard
          icon={<Building2 className="w-4 h-4" />}
          iconGradient="from-[#005B9F] to-[#004B87]"
          iconShadow="shadow-blue-900/25"
          badgeShape="circle"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight max-w-[65%]">
            Total<br />Facilities
          </p>
          <div className="my-auto">
            <div className="text-[24px] font-extrabold text-[#004B87] tracking-tight leading-none">
              {activePeriodData.kpis.totalFacilities.value}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Registered Facilities</p>
          </div>
          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Cycle</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
              {activePeriodData.kpis.totalFacilities.sub}
            </span>
          </div>
        </NotchCard>

        {/* Metric 2: Active Facilities */}
        <NotchCard
          icon={<Users className="w-4 h-4" />}
          iconGradient="from-emerald-500 to-emerald-600"
          iconShadow="shadow-emerald-500/25"
          badgeShape="circle"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight max-w-[65%]">
            Active<br />Facilities
          </p>
          <div className="my-auto">
            <div className="text-[24px] font-extrabold text-emerald-600 tracking-tight leading-none">
              {activePeriodData.kpis.activeFacilities.value}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">89% of registered</p>
          </div>
          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
              {activePeriodData.kpis.activeFacilities.sub}
            </span>
          </div>
        </NotchCard>

        {/* Metric 3: Data Submission */}
        <NotchCard
          icon={<FileText className="w-4 h-4" />}
          iconGradient="from-purple-500 to-purple-600"
          iconShadow="shadow-purple-500/25"
          badgeShape="circle"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight max-w-[65%]">
            Data<br />Submission
          </p>
          <div className="space-y-1 my-auto">
            <div className="text-[22px] font-extrabold text-purple-700 tracking-tight leading-none">
              {activePeriodData.kpis.dataSubmission.value}{' '}
              <span className="text-xs font-semibold text-slate-400">
                {activePeriodData.kpis.dataSubmission.total}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: activePeriodData.kpis.dataSubmission.percent }}
              ></div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Rate</span>
            <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded-full">
              {activePeriodData.kpis.dataSubmission.sub}
            </span>
          </div>
        </NotchCard>

        {/* Metric 4: Pending Verification */}
        <NotchCard
          icon={<ShieldCheck className="w-4 h-4" />}
          iconGradient="from-amber-400 to-amber-500"
          iconShadow="shadow-amber-500/25"
          badgeShape="circle"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight max-w-[65%]">
            Pending<br />Verification
          </p>
          <div className="my-auto">
            <div
              className={`text-[24px] font-extrabold tracking-tight leading-none ${
                activePeriodData.kpis.pendingVerification.isZero ? 'text-emerald-600' : 'text-amber-500'
              }`}
            >
              {activePeriodData.kpis.pendingVerification.value}
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {activePeriodData.kpis.pendingVerification.isZero ? 'All Finalized' : 'Awaiting 3rd-party'}
            </p>
          </div>
          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">Audit</span>
            <span
              className={`font-bold px-1.5 py-0.2 rounded-full ${
                activePeriodData.kpis.pendingVerification.isZero
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-amber-700 bg-amber-50'
              }`}
            >
              {activePeriodData.kpis.pendingVerification.sub}
            </span>
          </div>
        </NotchCard>

        {/* Metric 5: Reporting Compliance */}
        <NotchCard
          icon={<TrendingUp className="w-4 h-4" />}
          iconGradient="from-teal-500 to-teal-600"
          iconShadow="shadow-teal-500/25"
          badgeShape="circle"
        >
          <p className="text-xs font-bold text-slate-800 leading-tight max-w-[65%]">
            Reporting<br />Compliance
          </p>
          <div className="space-y-1 my-auto">
            <div className="text-[24px] font-extrabold text-teal-700 tracking-tight leading-none">
              {activePeriodData.kpis.compliance.value}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: activePeriodData.kpis.compliance.value }}
              ></div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-medium">vs Prev</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
              {activePeriodData.kpis.compliance.sub}
            </span>
          </div>
        </NotchCard>
      </div>

      {/* 3. MIDDLE SECTION: GHG EMISSIONS OVERVIEW & MRV WORKFLOW STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 Cols): GHG Emissions Overview */}
        <div className="lg:col-span-7 h-[380px] bg-gradient-to-b from-white/95 via-white/90 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-4 sm:p-5 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset] relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div>
                <h3 className="text-base font-bold font-display text-navy-900 flex items-center gap-2">
                  GHG Emissions Overview
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Total reported emissions across registered facilities
                </p>
              </div>

              {/* Timeframe Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 self-start sm:self-auto">
                <button
                  onClick={() => setTimeframe('Monthly')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeframe === 'Monthly'
                      ? 'bg-[#004B87] text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeframe('Quarterly')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    timeframe === 'Quarterly'
                      ? 'bg-[#004B87] text-white shadow-xs'
                      : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>

            {/* Scope Filters & Unit */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                {(['Total', 'Scope 1', 'Scope 2'] as const).map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setScopeFilter(scope)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      scopeFilter === scope
                        ? 'bg-[#004B87] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                    }`}
                  >
                    {scope}
                  </button>
                ))}
              </div>
              <div className="text-[11px] font-bold text-slate-400">tCO₂e</div>
            </div>
          </div>

          {/* Area Line Chart (Flex to fill available vertical space within 380px) */}
          <div className="flex-1 min-h-0 w-full my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeChartData} margin={{ top: 5, right: 15, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070F3" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0070F3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                  dy={5}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                  domain={[0, 25000]}
                  ticks={[0, 5000, 10000, 15000, 20000, 25000]}
                  tickFormatter={(val) => val.toLocaleString()}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} tCO₂e`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  name={activePeriodData.legend.current}
                  stroke="#0066CC"
                  strokeWidth={2.5}
                  fill="url(#emissionsGradient)"
                  dot={{ r: 3.5, fill: '#0066CC', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#004B87' }}
                />
                <Area
                  type="monotone"
                  dataKey="previous"
                  name={activePeriodData.legend.previous}
                  stroke="#0284C7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none"
                  dot={{ r: 3, fill: '#0284C7', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                  activeDot={{ r: 5, fill: '#0369A1' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 text-xs font-bold shrink-0">
            <div className="flex items-center gap-2 text-navy-900">
              <span className="w-5 h-0.5 bg-[#0066CC] rounded-full inline-block"></span>
              <span>{activePeriodData.legend.current}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-5 h-0.5 border-b-2 border-dashed border-sky-500 inline-block"></span>
              <span>{activePeriodData.legend.previous}</span>
            </div>
          </div>
        </div>

        {/* Right (5 Cols): MRV Workflow Status */}
        <div className="lg:col-span-5 h-[380px] bg-gradient-to-b from-white/95 via-white/90 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-4 sm:p-5 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">MRV Workflow Status</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Facilities count across the MRV process
            </p>
          </div>

          {/* Connected Process Flow Steps with Centered Continuous Dotted Line */}
          <div className="relative flex flex-col justify-between my-auto py-1 space-y-2.5">
            {/* Continuous Vertical Dashed Line passing through all 5 icon centers */}
            <div className="absolute left-[16px] -translate-x-1/2 top-4 bottom-4 w-px border-l-2 border-dashed border-blue-300/80 pointer-events-none z-0" />

            {/* Step 1: Registered */}
            <div className="relative flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-[#EEF4FF] border border-blue-200 flex items-center justify-center text-[#1D63ED] shadow-2xs shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="w-28 sm:w-32 text-xs sm:text-[13px] font-bold text-slate-800 shrink-0">
                Registered
              </span>
              <div className="flex-1 bg-slate-100/90 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0055FF] h-full rounded-full transition-all duration-500"
                  style={{ width: activePeriodData.workflow.registeredPct }}
                />
              </div>
              <span className="text-navy-900 font-extrabold text-sm sm:text-base w-8 text-right shrink-0">
                {activePeriodData.workflow.registered}
              </span>
            </div>

            {/* Step 2: Data Entry */}
            <div className="relative flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-emerald-200 flex items-center justify-center text-[#059669] shadow-2xs shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="w-28 sm:w-32 text-xs sm:text-[13px] font-bold text-slate-800 shrink-0">
                Data Entry
              </span>
              <div className="flex-1 bg-slate-100/90 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00A86B] h-full rounded-full transition-all duration-500"
                  style={{ width: activePeriodData.workflow.dataEntryPct }}
                />
              </div>
              <span className="text-navy-900 font-extrabold text-sm sm:text-base w-8 text-right shrink-0">
                {activePeriodData.workflow.dataEntry}
              </span>
            </div>

            {/* Step 3: Submitted */}
            <div className="relative flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-[#F5F3FF] border border-purple-200 flex items-center justify-center text-[#7C3AED] shadow-2xs shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <span className="w-28 sm:w-32 text-xs sm:text-[13px] font-bold text-slate-800 shrink-0">
                Submitted
              </span>
              <div className="flex-1 bg-slate-100/90 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#7048E8] h-full rounded-full transition-all duration-500"
                  style={{ width: activePeriodData.workflow.submittedPct }}
                />
              </div>
              <span className="text-navy-900 font-extrabold text-sm sm:text-base w-8 text-right shrink-0">
                {activePeriodData.workflow.submitted}
              </span>
            </div>

            {/* Step 4: Under Verification */}
            <div className="relative flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-[#FFF7ED] border border-orange-200 flex items-center justify-center text-[#EA580C] shadow-2xs shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="w-28 sm:w-32 text-xs sm:text-[13px] font-bold text-slate-800 shrink-0">
                Under Verification
              </span>
              <div className="flex-1 bg-slate-100/90 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF6B00] h-full rounded-full transition-all duration-500"
                  style={{ width: activePeriodData.workflow.underVerificationPct }}
                />
              </div>
              <span className="text-navy-900 font-extrabold text-sm sm:text-base w-8 text-right shrink-0">
                {activePeriodData.workflow.underVerification}
              </span>
            </div>

            {/* Step 5: Verified */}
            <div className="relative flex items-center gap-3 z-10">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-emerald-200 flex items-center justify-center text-[#16A34A] shadow-2xs shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="w-28 sm:w-32 text-xs sm:text-[13px] font-bold text-slate-800 shrink-0">
                Verified
              </span>
              <div className="flex-1 bg-slate-100/90 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0CA678] h-full rounded-full transition-all duration-500"
                  style={{ width: activePeriodData.workflow.verifiedPct }}
                />
              </div>
              <span className="text-navy-900 font-extrabold text-sm sm:text-base w-8 text-right shrink-0">
                {activePeriodData.workflow.verified}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 shrink-0">
            <span>Overall Verification Rate</span>
            <span className="text-emerald-600 font-bold">{activePeriodData.workflow.rate}</span>
          </div>
        </div>
      </div>

      {/* 4. ACTION & COMPLIANCE STATUS (Unified Single Section Card) */}
      <div className="bg-gradient-to-b from-white/95 via-white/90 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-5 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-[#004B87] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004B87] animate-pulse"></span>
            Action & Compliance Status ({selectedPeriod})
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {activePeriodData.attentionRequired.length} items require attention
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {activePeriodData.attentionRequired.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-3.5 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3 group ${
                item.type === 'red'
                  ? 'border-rose-200/80'
                  : item.type === 'orange'
                  ? 'border-orange-200/80'
                  : item.type === 'amber'
                  ? 'border-amber-200/80'
                  : item.type === 'emerald'
                  ? 'border-emerald-200/80'
                  : 'border-blue-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs ${
                    item.type === 'red'
                      ? 'bg-rose-500'
                      : item.type === 'orange'
                      ? 'bg-orange-500'
                      : item.type === 'amber'
                      ? 'bg-amber-500'
                      : item.type === 'emerald'
                      ? 'bg-emerald-500'
                      : 'bg-[#0066CC]'
                  }`}
                >
                  {item.type === 'red' && <AlertCircle className="w-4 h-4" />}
                  {item.type === 'orange' && <Clock className="w-4 h-4" />}
                  {item.type === 'amber' && <Calendar className="w-4 h-4" />}
                  {item.type === 'emerald' && <CheckCircle2 className="w-4 h-4" />}
                  {item.type === 'blue' && <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-navy-900 leading-snug">{item.title}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveView(item.targetView)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-navy-900 hover:border-slate-300 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
              >
                {item.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. BOTTOM SECTION (3 PANELS): EMISSIONS BY SECTOR | DATA COMPLETENESS | RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Panel 1: Emissions by Sector */}
        <div className="bg-gradient-to-b from-white/95 via-white/90 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-5 sm:p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">Emissions by Sector</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Share of total emissions ({selectedPeriod})</p>
          </div>

          <div className="space-y-4 my-auto py-2">
            {activePeriodData.sectorData.map((sec) => (
              <div key={sec.name}>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">{sec.name}</span>
                  <span className="text-navy-900 font-extrabold">{sec.percent}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${sec.color} h-full rounded-full`} style={{ width: sec.width }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Primary Emitter</span>
            <span className="text-[#004B87] font-bold">Industrial (Heavy Industry)</span>
          </div>
        </div>

        {/* Panel 2: Data Completeness */}
        <div className="bg-gradient-to-b from-white/95 via-white/90 to-emerald-50/40 backdrop-blur-xl rounded-2xl border border-white/90 p-5 sm:p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-navy-900">Data Completeness</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Overall completeness of submitted data</p>
          </div>

          <div className="flex items-center gap-5 my-auto py-2">
            {/* Radial / Donut Ring */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="9" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="9"
                  strokeDasharray="251.2"
                  strokeDashoffset={activePeriodData.completeness.dashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black font-display text-navy-900">
                  {activePeriodData.completeness.overall}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight">
                  Overall
                  <br />
                  Complete
                </span>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="flex-1 space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span>Energy Consumption</span>
                  <span className="font-bold text-navy-900">{activePeriodData.completeness.energy}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${activePeriodData.completeness.energy}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span>Fuel Consumption</span>
                  <span className="font-bold text-navy-900">{activePeriodData.completeness.fuel}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${activePeriodData.completeness.fuel}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span>Electricity</span>
                  <span className="font-bold text-navy-900">{activePeriodData.completeness.electricity}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${activePeriodData.completeness.electricity}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span>Waste</span>
                  <span className="font-bold text-navy-900">{activePeriodData.completeness.waste}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${activePeriodData.completeness.waste}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-0.5">
                  <span>Other</span>
                  <span className="font-bold text-navy-900">{activePeriodData.completeness.other}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${activePeriodData.completeness.other}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Highest Completeness</span>
            <span className="text-emerald-600 font-bold">{activePeriodData.completeness.highest}</span>
          </div>
        </div>

        {/* Panel 3: Recent Activity */}
        <div className="bg-gradient-to-b from-white/95 via-white/90 to-sky-50/60 backdrop-blur-xl rounded-2xl border border-white/90 p-5 sm:p-6 shadow-[0_12px_32px_-6px_rgba(0,75,135,0.08),0_1px_1px_rgba(255,255,255,1)_inset] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-navy-900">Recent Activity</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Timeline activity for {selectedPeriod}
              </p>
            </div>
            <button
              onClick={() => setActiveView('reports')}
              className="text-xs font-bold text-[#004B87] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {/* Activity Timeline List */}
          <div className="space-y-3.5 my-auto py-2">
            {activePeriodData.activities.map((act, index) => (
              <div key={index} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`w-2 h-2 rounded-full ${act.dotColor} shrink-0`}></span>
                  <span className="text-slate-400 font-semibold text-[11px] shrink-0">{act.time}</span>
                  <span className="font-semibold text-navy-900 truncate">{act.text}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${act.badgeClass}`}
                >
                  {act.badge}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Cycle Status</span>
            <span className="text-slate-700 font-bold">{activePeriodData.auditSummary}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
