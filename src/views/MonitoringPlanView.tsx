import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Save,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  Activity,
  Award,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { MitigationMeasure, ProductionStream, TierLevel } from '../types/mrv';

export const MonitoringPlanView: React.FC = () => {
  const { monitoringPlan, updateMonitoringPlan, reportingYear, activeFacility, setActiveView } =
    useMRV();

  const [activeSection, setActiveSection] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState(monitoringPlan);

  const sections = [
    { num: 1, title: 'Facility & Plant' },
    { num: 2, title: 'Description' },
    { num: 3, title: 'Production Streams' },
    { num: 4, title: 'Monitoring Approach' },
    { num: 5, title: 'GHG Measurement' },
    { num: 6, title: 'QA/QC Protocols' },
    { num: 7, title: 'Mitigation Measures' },
    { num: 8, title: 'Preparer Declaration' },
  ];

  const handleFieldChange = (section: string, key: string, value: any) => {
    if (section === 'root') {
      setFormData((prev) => ({ ...prev, [key]: value }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    }
  };

  const handleSaveDraft = () => {
    updateMonitoringPlan(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddProductionStream = () => {
    const newStream: ProductionStream = {
      id: `ps-${Date.now()}`,
      name: 'New Emission / Production Stream',
      annualThroughput: '100,000',
      unit: 'Units / Year',
      measuringDevice: 'Calibrated Ultrasonic Flowmeter',
    };
    setFormData((prev) => ({
      ...prev,
      productionStreams: [...prev.productionStreams, newStream],
    }));
  };

  const handleRemoveProductionStream = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      productionStreams: prev.productionStreams.filter((p) => p.id !== id),
    }));
  };

  const handleAddMitigation = () => {
    const newMit: MitigationMeasure = {
      id: `mit-${Date.now()}`,
      name: 'Energy Efficiency & Waste Heat Project',
      status: 'Planned',
      expectedReduction: 15000,
      methodology: 'IPCC Energy Efficiency Protocol',
      verificationDetails: 'Third-party certified audit',
      implementationYear: 2026,
    };
    setFormData((prev) => ({
      ...prev,
      mitigationMeasures: [...prev.mitigationMeasures, newMit],
    }));
  };

  const handleRemoveMitigation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      mitigationMeasures: prev.mitigationMeasures.filter((m) => m.id !== id),
    }));
  };

  const totalMitigationReduction = formData.mitigationMeasures.reduce(
    (acc, m) => acc + (Number(m.expectedReduction) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sticky Single-Row Title Bar */}
      <div className="sticky -top-4 sm:-top-6 lg:-top-8 -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3.5 bg-[#F4F9FD]/95 backdrop-blur-md z-20 border-b border-slate-200/80 flex items-center justify-between gap-4 transition-all font-sans">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold font-display text-[#0B3A60] tracking-tight">
            Emissions & Monitoring Plan (MP) Specification
          </h1>
          {isSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Draft Saved!</span>
            </div>
          )}
        </div>
        <button
          onClick={handleSaveDraft}
          className="px-4 py-2 bg-[#196396] hover:bg-[#14527D] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Draft</span>
        </button>
      </div>

      {/* Section Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => (
          <button
            key={sec.num}
            onClick={() => setActiveSection(sec.num)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSection === sec.num
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'bg-white/80 text-navy-800 hover:bg-primary-50 border border-primary-100/60'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                activeSection === sec.num ? 'bg-white text-primary-700' : 'bg-primary-100 text-primary-800'
              }`}
            >
              {sec.num}
            </span>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* Form Content Cards */}
      <GlassCard className="p-6 sm:p-8">
        {/* Section 1: Facility & Plant Details */}
        {activeSection === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                1. Facility & Plant Identification
              </h3>
              <p className="text-xs text-mrv-muted">
                Identification of designated plant assets and statutory tier classification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">Facility Name</label>
                <input
                  type="text"
                  value={activeFacility.name}
                  disabled
                  className="w-full glass-input bg-slate-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Plant / Operating Unit Designation *
                </label>
                <input
                  type="text"
                  value={formData.plantName}
                  onChange={(e) => handleFieldChange('root', 'plantName', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">Calendar Reporting Year</label>
                <input
                  type="number"
                  value={formData.reportingYear}
                  disabled
                  className="w-full glass-input bg-slate-100 font-bold text-primary-800 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Assigned Monitoring Tier Level *
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => handleFieldChange('root', 'tier', e.target.value as TierLevel)}
                  className="w-full glass-input font-bold text-primary-800"
                >
                  <option value="Tier 1">Tier 1 — Standard Default Factors</option>
                  <option value="Tier 2">Tier 2 — Country/Fuel Specific Laboratory Analyzed Factors</option>
                  <option value="Tier 3">Tier 3 — Continuous Direct Mass Balance / CEMS</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Facility Description */}
        {activeSection === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                2. Facility Description & Operational Status
              </h3>
              <p className="text-xs text-mrv-muted">
                Describe the operating environment, business sector, and current operational phase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">Business Sector</label>
                <input
                  type="text"
                  value={formData.businessSector}
                  onChange={(e) => handleFieldChange('root', 'businessSector', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Current Operational Status *
                </label>
                <select
                  value={formData.operationalStatus}
                  onChange={(e) => handleFieldChange('root', 'operationalStatus', e.target.value)}
                  className="w-full glass-input font-semibold"
                >
                  <option value="Normal Operation">Normal Commercial Operation</option>
                  <option value="Maintenance">Scheduled Turnaround / Major Maintenance</option>
                  <option value="Expanded">Expanded Production Line Commissioning</option>
                  <option value="Commissioning">New Plant Initial Commissioning</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Production Streams */}
        {activeSection === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-primary-100/60 pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-navy-900">
                  3. Production Streams & Measurement Devices
                </h3>
                <p className="text-xs text-mrv-muted">
                  Specify all primary production throughput streams and calibrated fiscal flowmeters.
                </p>
              </div>
              <button
                onClick={handleAddProductionStream}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stream</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.productionStreams.map((stream, idx) => (
                <div
                  key={stream.id}
                  className="p-4 rounded-2xl bg-primary-50/40 border border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                    <div>
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Stream Name</span>
                      <input
                        type="text"
                        value={stream.name}
                        onChange={(e) => {
                          const updated = [...formData.productionStreams];
                          updated[idx].name = e.target.value;
                          setFormData((prev) => ({ ...prev, productionStreams: updated }));
                        }}
                        className="w-full glass-input text-xs font-semibold mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Annual Throughput & Unit</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={stream.annualThroughput}
                          onChange={(e) => {
                            const updated = [...formData.productionStreams];
                            updated[idx].annualThroughput = e.target.value;
                            setFormData((prev) => ({ ...prev, productionStreams: updated }));
                          }}
                          className="w-1/2 glass-input text-xs font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={stream.unit}
                          onChange={(e) => {
                            const updated = [...formData.productionStreams];
                            updated[idx].unit = e.target.value;
                            setFormData((prev) => ({ ...prev, productionStreams: updated }));
                          }}
                          className="w-1/2 glass-input text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Measuring Device & Tag</span>
                      <input
                        type="text"
                        value={stream.measuringDevice}
                        onChange={(e) => {
                          const updated = [...formData.productionStreams];
                          updated[idx].measuringDevice = e.target.value;
                          setFormData((prev) => ({ ...prev, productionStreams: updated }));
                        }}
                        className="w-full glass-input text-xs mt-1"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveProductionStream(stream.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Delete Stream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Monitoring Approach */}
        {activeSection === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                4. GHG Monitoring Approach Selection
              </h3>
              <p className="text-xs text-mrv-muted">
                Select the primary methodology applied for emissions quantification under EAD guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => handleFieldChange('root', 'monitoringApproach', 'Calculation-based')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  formData.monitoringApproach === 'Calculation-based'
                    ? 'bg-primary-50 border-primary-600 shadow-md shadow-primary-500/10 ring-2 ring-primary-500/20'
                    : 'bg-white/80 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-navy-900">Calculation-based</span>
                  {formData.monitoringApproach === 'Calculation-based' && (
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-xs text-mrv-muted leading-relaxed">
                  Emissions calculated from fuel consumption (Activity Data) × Emission Factors × Net Calorific Values.
                </p>
              </div>

              <div
                onClick={() => handleFieldChange('root', 'monitoringApproach', 'Measurement-based')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  formData.monitoringApproach === 'Measurement-based'
                    ? 'bg-primary-50 border-primary-600 shadow-md shadow-primary-500/10 ring-2 ring-primary-500/20'
                    : 'bg-white/80 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-navy-900">Measurement-based (CEMS)</span>
                  {formData.monitoringApproach === 'Measurement-based' && (
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-xs text-mrv-muted leading-relaxed">
                  Continuous Emissions Monitoring System (CEMS) stack flow rate and continuous flue gas concentration analysis.
                </p>
              </div>

              <div
                onClick={() => handleFieldChange('root', 'monitoringApproach', 'Fallback')}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  formData.monitoringApproach === 'Fallback'
                    ? 'bg-primary-50 border-primary-600 shadow-md shadow-primary-500/10 ring-2 ring-primary-500/20'
                    : 'bg-white/80 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-navy-900">Fallback Approach</span>
                  {formData.monitoringApproach === 'Fallback' && (
                    <CheckCircle2 className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-xs text-mrv-muted leading-relaxed">
                  Conservative estimation protocol utilized temporarily during catastrophic meter failure or outage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: GHG Measurement */}
        {activeSection === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                5. GHG Measurement Standards, Equipment & Calibration
              </h3>
              <p className="text-xs text-mrv-muted">
                Capture technical methodologies, ISO standards, and instrument calibration routines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Calculation Standards & Methodology Applied *
                </label>
                <input
                  type="text"
                  value={formData.ghgMeasurement.methods}
                  onChange={(e) => handleFieldChange('ghgMeasurement', 'methods', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Applied Environmental Standards *
                </label>
                <input
                  type="text"
                  value={formData.ghgMeasurement.standards}
                  onChange={(e) => handleFieldChange('ghgMeasurement', 'standards', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Data Sources & Invoicing *
                </label>
                <input
                  type="text"
                  value={formData.ghgMeasurement.dataSources}
                  onChange={(e) => handleFieldChange('ghgMeasurement', 'dataSources', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Measurement Equipment & Analyzers *
                </label>
                <input
                  type="text"
                  value={formData.ghgMeasurement.measurementEquipment}
                  onChange={(e) =>
                    handleFieldChange('ghgMeasurement', 'measurementEquipment', e.target.value)
                  }
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Calibration Frequency (ISO 17025) *
                </label>
                <input
                  type="text"
                  value={formData.ghgMeasurement.calibrationFrequency}
                  onChange={(e) =>
                    handleFieldChange('ghgMeasurement', 'calibrationFrequency', e.target.value)
                  }
                  className="w-full glass-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 6: QA/QC Protocols */}
        {activeSection === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                6. Quality Assurance, Internal Review & Data Archival
              </h3>
              <p className="text-xs text-mrv-muted">
                Quality control procedures ensuring data integrity, cross-department reconciliation, and auditability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Quality Assurance Procedures *
                </label>
                <textarea
                  rows={2}
                  value={formData.qaQc.qualityAssurance}
                  onChange={(e) => handleFieldChange('qaQc', 'qualityAssurance', e.target.value)}
                  className="w-full glass-input resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Internal Cross-Review Process *
                </label>
                <input
                  type="text"
                  value={formData.qaQc.internalReview}
                  onChange={(e) => handleFieldChange('qaQc', 'internalReview', e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1.5">
                  Mandatory Record Retention Duration (Years) *
                </label>
                <input
                  type="number"
                  value={formData.qaQc.recordStorageYears}
                  onChange={(e) =>
                    handleFieldChange('qaQc', 'recordStorageYears', Number(e.target.value))
                  }
                  className="w-full glass-input font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Mitigation Measures */}
        {activeSection === 7 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-primary-100/60 pb-3">
              <div>
                <h3 className="text-lg font-bold font-display text-navy-900">
                  7. GHG Mitigation Measures & Abatement Projects
                </h3>
                <p className="text-xs text-mrv-muted">
                  Document ongoing or planned emissions reduction initiatives with quantified reduction impact.
                </p>
              </div>
              <button
                onClick={handleAddMitigation}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Initiative</span>
              </button>
            </div>

            {/* Total Mitigation summary header */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-cyan-500/10 to-primary-500/10 border border-teal-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-700">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                    Total Estimated Annual Abatement
                  </h4>
                  <p className="text-xs text-teal-800">
                    Across {formData.mitigationMeasures.length} registered energy efficiency & recovery measures
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold font-display text-teal-800">
                  {totalMitigationReduction.toLocaleString()} tCO₂e/yr
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {formData.mitigationMeasures.map((mit, idx) => (
                <div
                  key={mit.id}
                  className="p-4 rounded-2xl bg-white/90 border border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full text-xs">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Project Title</span>
                      <input
                        type="text"
                        value={mit.name}
                        onChange={(e) => {
                          const updated = [...formData.mitigationMeasures];
                          updated[idx].name = e.target.value;
                          setFormData((prev) => ({ ...prev, mitigationMeasures: updated }));
                        }}
                        className="w-full glass-input text-xs font-semibold mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Expected tCO₂e Reduction</span>
                      <input
                        type="number"
                        value={mit.expectedReduction}
                        onChange={(e) => {
                          const updated = [...formData.mitigationMeasures];
                          updated[idx].expectedReduction = Number(e.target.value);
                          setFormData((prev) => ({ ...prev, mitigationMeasures: updated }));
                        }}
                        className="w-full glass-input text-xs font-bold text-teal-700 mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-mrv-muted uppercase">Status</span>
                      <select
                        value={mit.status}
                        onChange={(e) => {
                          const updated = [...formData.mitigationMeasures];
                          updated[idx].status = e.target.value as any;
                          setFormData((prev) => ({ ...prev, mitigationMeasures: updated }));
                        }}
                        className="w-full glass-input text-xs font-bold mt-1"
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Operational">Operational</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMitigation(mit.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                    title="Delete Initiative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 8: Preparer Declaration */}
        {activeSection === 8 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-primary-100/60 pb-3">
              <h3 className="text-lg font-bold font-display text-navy-900">
                8. Preparer Declaration & Regulatory Sign-off
              </h3>
              <p className="text-xs text-mrv-muted">
                Authorized regulatory declaration certifying the completeness of the monitoring plan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-white border border-primary-200 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-navy-900">Legal Compliance Declaration</h4>
                  <p className="text-xs text-mrv-muted mt-1 leading-relaxed">
                    I hereby declare that this Monitoring Plan has been prepared in full conformity with the Subnational MRV Technical Guidelines issued by Environment Agency – Abu Dhabi. All production streams, fuel lines, and measurement equipment represent true physical plant installations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-primary-100">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Lead Preparer Name</label>
                  <input
                    type="text"
                    value={formData.preparerName}
                    onChange={(e) => handleFieldChange('root', 'preparerName', e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Preparer Job Title</label>
                  <input
                    type="text"
                    value={formData.preparerTitle}
                    onChange={(e) => handleFieldChange('root', 'preparerTitle', e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Declaration Date</label>
                  <input
                    type="date"
                    value={formData.declarationDate}
                    onChange={(e) => handleFieldChange('root', 'declarationDate', e.target.value)}
                    className="w-full glass-input font-semibold text-primary-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-primary-100/60 mt-8">
          <button
            type="button"
            onClick={() => setActiveSection((prev) => Math.max(1, prev - 1))}
            disabled={activeSection === 1}
            className={`btn-secondary text-xs ${
              activeSection === 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            Previous Section
          </button>

          <div className="flex items-center gap-3">
            {activeSection < 8 ? (
              <button
                type="button"
                onClick={() => setActiveSection((prev) => Math.min(8, prev + 1))}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <span>Next Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  setActiveView('emissions-data');
                }}
                className="btn-teal text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Monitoring Plan & Proceed</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
