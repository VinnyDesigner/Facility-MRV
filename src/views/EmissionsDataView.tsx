import React, { useState } from 'react';
import {
  Flame,
  Save,
  Send,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const EmissionsDataView: React.FC = () => {
  const { emissionsData, updateEmissionsData, reportingYear, activeFacility, setActiveView } =
    useMRV();

  const [totalEmissions, setTotalEmissions] = useState(emissionsData.totalEmissions);
  const [combustion, setCombustion] = useState(emissionsData.combustionEmissions);
  const [process, setProcess] = useState(emissionsData.processEmissions);
  const [fugitive, setFugitive] = useState(emissionsData.fugitiveEmissions);
  const [scope2, setScope2] = useState(emissionsData.scope2);
  const [notes, setNotes] = useState(emissionsData.activityDataNotes);
  const [calcMethod, setCalcMethod] = useState(emissionsData.calculationMethod);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateEmissionsData({
      totalEmissions: Number(totalEmissions),
      combustionEmissions: Number(combustion),
      processEmissions: Number(process),
      fugitiveEmissions: Number(fugitive),
      scope1: Number(combustion) + Number(process) + Number(fugitive),
      scope2: Number(scope2),
      activityDataNotes: notes,
      calculationMethod: calcMethod,
      status: 'Saved',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRecalculateTotal = (newComb: number, newProc: number, newFug: number) => {
    const sum = Number(newComb) + Number(newProc) + Number(newFug);
    setTotalEmissions(sum);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Sticky Single-Row Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold font-display text-[#0B3A60] tracking-tight">
            Emissions Data — Reporting Year {reportingYear}
          </h1>
          {isSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Emissions Saved!</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#196396] hover:bg-[#14527D] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Values</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="p-4">
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Regulated Facility</span>
          <p className="text-xs font-bold text-navy-900 mt-0.5 truncate">{activeFacility.name}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Sector & Classification</span>
          <p className="text-xs font-bold text-primary-700 mt-0.5">{activeFacility.sector} • {activeFacility.tier}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Permit Number</span>
          <p className="text-xs font-bold text-navy-900 font-mono mt-0.5">{activeFacility.permitNumber}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <span className="text-[10px] font-bold text-mrv-muted uppercase">Accounting Standard</span>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">ISO 14064-1 / IPCC 2006</p>
        </GlassCard>
      </div>

      {/* Main Emissions Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Large Total & Category Breakdown (8 cols) */}
        <GlassCard className="lg:col-span-8 p-6 sm:p-8 space-y-6">
          {/* Hero Input: Total Estimated Emissions */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary-50 via-cyan-50/40 to-white border border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-extrabold text-navy-900 font-display flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Total Estimated Annual Emissions (Scope 1 Direct) *</span>
              </label>
              <Badge variant="cyan">Reporting Year {reportingYear}</Badge>
            </div>
            <div className="relative mt-3">
              <input
                type="number"
                value={totalEmissions}
                onChange={(e) => setTotalEmissions(Number(e.target.value))}
                className="w-full text-3xl sm:text-4xl font-black font-display text-navy-900 bg-white border-2 border-primary-300 focus:border-cyan-brand rounded-2xl p-4 pr-24 shadow-inner focus:outline-none focus:ring-4 focus:ring-cyan-brand/20 transition-all font-mono"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-extrabold text-primary-700">
                tCO₂e
              </span>
            </div>
            <p className="text-xs text-mrv-muted mt-2">
              Equivalent to <strong>{(totalEmissions / 1000000).toFixed(3)} Million Metric Tons CO₂e</strong>.
            </p>
          </div>

          {/* Breakdown by Emission Source Categories */}
          <div>
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">
              Emission Source Category Breakdown (tCO₂e)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">
                  Stationary Combustion
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={combustion}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCombustion(v);
                      handleRecalculateTotal(v, process, fugitive);
                    }}
                    className="w-full glass-input font-mono font-bold pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mrv-muted font-bold">
                    tCO₂e
                  </span>
                </div>
                <span className="text-[10px] text-mrv-muted mt-1 block">Turbines, Boilers & Heaters</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">
                  Industrial Process
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={process}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setProcess(v);
                      handleRecalculateTotal(combustion, v, fugitive);
                    }}
                    className="w-full glass-input font-mono font-bold pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mrv-muted font-bold">
                    tCO₂e
                  </span>
                </div>
                <span className="text-[10px] text-mrv-muted mt-1 block">Chemical & Thermal Reduction</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1">
                  Fugitive & Flaring
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={fugitive}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setFugitive(v);
                      handleRecalculateTotal(combustion, process, v);
                    }}
                    className="w-full glass-input font-mono font-bold pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mrv-muted font-bold">
                    tCO₂e
                  </span>
                </div>
                <span className="text-[10px] text-mrv-muted mt-1 block">LDAR leaks, purge vents & flare</span>
              </div>
            </div>
          </div>

          {/* Scope 2 Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="text-xs font-bold text-navy-900">
                  Scope 2 (Indirect Emissions from Imported Electricity / Steam)
                </label>
                <p className="text-[11px] text-mrv-muted">
                  Reported for comprehensive subnational transparency (location-based grid emission factor).
                </p>
              </div>
              <div className="relative w-44">
                <input
                  type="number"
                  value={scope2}
                  onChange={(e) => setScope2(Number(e.target.value))}
                  className="w-full glass-input font-mono font-bold pr-14 text-right"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mrv-muted font-bold">
                  tCO₂e
                </span>
              </div>
            </div>
          </div>

          {/* Calculation Methodology & Chromatography Notes */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Applied Calculation Protocol & Baseline Formula *
              </label>
              <input
                type="text"
                value={calcMethod}
                onChange={(e) => setCalcMethod(e.target.value)}
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 mb-1.5">
                Activity Data Reconciliations & Gas Chromatography Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full glass-input text-xs resize-none"
              />
            </div>
          </div>
        </GlassCard>

        {/* Right Guidance & Regulatory Support Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-5 space-y-3" variant="subtle">
            <div className="flex items-center gap-2 text-primary-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-brand" />
              <span>External Calculation Rule</span>
            </div>
            <p className="text-xs text-navy-800 leading-relaxed">
              In accordance with EAD Subnational MRV regulations, GHG calculation engines are maintained independently by facility operators. The portal records verified output numbers supported by third-party assurance statements.
            </p>
            <div className="p-3 rounded-xl bg-primary-50 text-[11px] text-primary-900">
              <strong>Mandatory verification requirement:</strong> All entered values must match the attached Third-Party Verifier Statement exactly.
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-navy-900 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Baseline Check</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-mrv-muted">2025 Reported:</span>
                <span className="font-bold font-mono text-navy-900">1,230,000 tCO₂e</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-mrv-muted">2026 Entered:</span>
                <span className="font-bold font-mono text-primary-700">{totalEmissions.toLocaleString()} tCO₂e</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-mrv-muted">Year-on-Year Variance:</span>
                <span className="font-bold text-emerald-600">+0.85% (Nominal)</span>
              </div>
            </div>
          </GlassCard>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-900 to-navy-950 text-white shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Next Step: Verification</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attach the accredited verifier statement and lab test certificates in the next screen to finalize your submission package.
            </p>
            <button
              onClick={() => {
                handleSave();
                setActiveView('report-upload');
              }}
              className="w-full btn-primary text-xs font-bold py-2.5 flex items-center justify-center gap-2"
            >
              <span>Go to Report Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
