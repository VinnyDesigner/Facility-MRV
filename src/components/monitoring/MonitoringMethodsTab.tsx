import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

// Helper to parse numeric emissions from string/number input
const parseEmissions = (val: string | number | undefined | null): number => {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/,/g, '').trim();
  if (!cleaned) return 0;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

// Helper to check if emissions input has a valid entered value
export const hasValidEmissions = (val: string | number | undefined | null): boolean => {
  if (val === undefined || val === null) return false;
  const cleaned = String(val).replace(/,/g, '').trim();
  if (!cleaned) return false;
  const num = parseFloat(cleaned);
  return !isNaN(num) && num > 0;
};

// Source stream classification logic based on reference document criteria:
// - De-minimis: < 1 kt CO2e (< 1,000 t) OR < 2% total (subject to stated 20 kt CO2e limit = 20,000 t)
// - Minor: < 5 kt CO2e (< 5,000 t) OR < 10% total (subject to stated 100 kt CO2e limit = 100,000 t)
// - Major: all other source streams
// Returns '—' when no valid emissions value has been entered
export const getSourceStreamCategory = (
  rawEmissions: string | number | undefined | null,
  totalEmissions: number
): 'Major' | 'Minor' | 'De-minimis' | '—' => {
  if (!hasValidEmissions(rawEmissions)) {
    return '—';
  }
  const emissions = parseEmissions(rawEmissions);
  if (emissions <= 0) return '—';

  const pct = totalEmissions > 0 ? (emissions / totalEmissions) * 100 : 0;

  if (emissions < 1000 || (pct < 2 && emissions <= 20000)) {
    return 'De-minimis';
  }
  if (emissions < 5000 || (pct < 10 && emissions <= 100000)) {
    return 'Minor';
  }
  return 'Major';
};

// Helper to get permitted uncertainty string based on tier
export const getPermittedUncertainty = (tier: string | undefined | null): string => {
  if (!tier) return '—';
  const norm = tier.trim();
  if (norm === 'Tier 4' || norm === 'T4') return '±1.5%';
  if (norm === 'Tier 3' || norm === 'T3') return '±2.5%';
  if (norm === 'Tier 2' || norm === 'T2') return '±5.0%';
  if (norm === 'Tier 1' || norm === 'T1') return '±7.5%';
  return '—';
};

// Helper to get numeric permitted uncertainty for validation
export const getPermittedUncertaintyNumeric = (tier: string | undefined | null): number | null => {
  if (!tier) return null;
  const norm = tier.trim();
  if (norm === 'Tier 4' || norm === 'T4') return 1.5;
  if (norm === 'Tier 3' || norm === 'T3') return 2.5;
  if (norm === 'Tier 2' || norm === 'T2') return 5.0;
  if (norm === 'Tier 1' || norm === 'T1') return 7.5;
  return null;
};

export const MonitoringMethodsTab: React.FC = () => {
  // Section 1: Calculation - Based Monitoring State
  const [calcSourceStreams, setCalcSourceStreams] = useState([
    { id: 'F01', desc: 'X', estimatedEmissions: '105,000', selectedCategory: 'Major' },
    { id: 'F02', desc: 'XX', estimatedEmissions: '1,200', selectedCategory: 'Minor' },
    { id: 'F03', desc: 'XXXX', estimatedEmissions: '850', selectedCategory: 'De-minimis' },
  ]);

  const [calcTierUncertainty, setCalcTierUncertainty] = useState([
    { id: 'F01', tier: 'Tier 3', uncertaintyAchieved: '1.60', fuelStreamType: 'Commercial Standard Fuels', sourceAccuracy: 'Lab Analysis' },
    { id: 'F02', tier: 'Tier 2', uncertaintyAchieved: '3.20', fuelStreamType: 'Alternative Fuels', sourceAccuracy: 'Meter Reading' },
    { id: 'F03', tier: '', uncertaintyAchieved: '', fuelStreamType: '', sourceAccuracy: '' },
  ]);

  const [calcApproachDesc, setCalcApproachDesc] = useState('Estimated based on production data and IPCC Guidelines');

  const [calcDetailedInfo, setCalcDetailedInfo] = useState([
    { id: 'F01', fuelType: 'Natural Gas', activityLevel: '10,000', unit: 'MWH', source: 'In - House technical data' },
    { id: 'F02', fuelType: 'Alternative Fuels', activityLevel: '10,000', unit: 'MWH', source: 'In - House technical data' },
  ]);

  const [nonFuelInputsDesc, setNonFuelInputsDesc] = useState('');

  const [calcOtherInputsOutputs, setCalcOtherInputsOutputs] = useState([
    { id: 'F01', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '42.3', emissionFactor: '73.3', oxidationFactor: '100%', conversionFactor: '-', source: 'IPCC' },
    { id: 'F02', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '23.5', emissionFactor: '64.3', oxidationFactor: '75%', conversionFactor: '-', source: 'IPCC' },
  ]);

  const [calcMeasurementSystems, setCalcMeasurementSystems] = useState([
    {
      ref: 'MI01',
      associatedSource: 'F01',
      instrumentType: 'Rotary meter',
      location: 'XXX',
      unit: 'Nm³/h',
      rangeLower: '0',
      rangeUpper: '250',
      specifiedUncertainty: '3',
      typicalLower: '500',
      typicalUpper: '750',
    },
    {
      ref: 'MI02',
      associatedSource: 'F02',
      instrumentType: 'Weigh bridge',
      location: 'XXX',
      unit: 'Kg',
      rangeLower: '3,000',
      rangeUpper: '40,000',
      specifiedUncertainty: '0.6',
      typicalLower: '7,500',
      typicalUpper: '40,000',
    },
  ]);

  // Section 2: Measurement - Based Monitoring State
  const [measEmissionSources, setMeasEmissionSources] = useState([
    { id: 'S01', totalEmissions: '100,000', category: 'Major' },
    { id: 'S02', totalEmissions: '45,000', category: 'Minor' },
    { id: 'S03', totalEmissions: '800', category: 'De-minimis' },
  ]);

  const [measUncertainty, setMeasUncertainty] = useState([
    { id: 'S01', tier: 'Tier 3', uncertaintyAchieved: '1.60', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Lab Analysis' },
    { id: 'S02', tier: 'Tier 2', uncertaintyAchieved: '3.20', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Meter Reading' },
    { id: 'S03', tier: '', uncertaintyAchieved: '', streamType: 'CO₂ Emission Sources', sourceAccuracy: '' },
  ]);

  const [measApproachDesc, setMeasApproachDesc] = useState('Estimated based on production data and IPCC Guidelines');

  const [measPoints, setMeasPoints] = useState([
    { id: 'M1', associatedSource: 'S01', procedures: 'X', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'CEMS Manual Rev. 4' },
    { id: 'M2', associatedSource: 'S02', procedures: 'XX', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
    { id: 'M3', associatedSource: 'S03', procedures: 'XXX', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
  ]);

  const [measComments, setMeasComments] = useState('');

  // Section 3: Fallback Approach State
  const [fallbackData, setFallbackData] = useState({
    methodologyDesc: 'Estimated based on production data and IPCC Guidelines',
    justification: 'Estimated based on production data and IPCC Guidelines',
  });

  // Dynamic totals for classification
  const totalCalcEmissions = calcSourceStreams.reduce(
    (sum, s) => sum + parseEmissions(s.estimatedEmissions),
    0
  );
  const totalMeasEmissions = measEmissionSources.reduce(
    (sum, s) => sum + parseEmissions(s.totalEmissions),
    0
  );

  // Monitoring Plan Add / Remove Helpers (Initializes blank rows with placeholders)
  const addCalcSourceStream = () => {
    const nextId = `F0${calcSourceStreams.length + 1}`;
    setCalcSourceStreams((prev) => [
      ...prev,
      { id: nextId, desc: '', estimatedEmissions: '', selectedCategory: '' },
    ]);
  };

  const removeCalcSourceStream = (index: number) => {
    setCalcSourceStreams((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcTierUncertainty = () => {
    const nextId = `F0${calcTierUncertainty.length + 1}`;
    setCalcTierUncertainty((prev) => [
      ...prev,
      { id: nextId, tier: '', uncertaintyAchieved: '', fuelStreamType: '', sourceAccuracy: '' },
    ]);
  };

  const removeCalcTierUncertainty = (index: number) => {
    setCalcTierUncertainty((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcDetailedInfo = () => {
    const nextId = `F0${calcDetailedInfo.length + 1}`;
    setCalcDetailedInfo((prev) => [
      ...prev,
      { id: nextId, fuelType: '', activityLevel: '', unit: '', source: '' },
    ]);
  };

  const removeCalcDetailedInfo = (index: number) => {
    setCalcDetailedInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcOtherInput = () => {
    const nextId = `F0${calcOtherInputsOutputs.length + 1}`;
    setCalcOtherInputsOutputs((prev) => [
      ...prev,
      { id: nextId, type: '', activityLevel: '', units: '', ncv: '', emissionFactor: '', oxidationFactor: '', conversionFactor: '', source: '' },
    ]);
  };

  const removeCalcOtherInput = (index: number) => {
    setCalcOtherInputsOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcMeasurementSystem = () => {
    const nextId = `MI0${calcMeasurementSystems.length + 1}`;
    setCalcMeasurementSystems((prev) => [
      ...prev,
      {
        ref: nextId,
        associatedSource: '',
        instrumentType: '',
        location: '',
        unit: '',
        rangeLower: '',
        rangeUpper: '',
        specifiedUncertainty: '',
        typicalLower: '',
        typicalUpper: '',
      },
    ]);
  };

  const removeCalcMeasurementSystem = (index: number) => {
    setCalcMeasurementSystems((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasEmissionSource = () => {
    const nextNum = measEmissionSources.length + 1;
    const nextId = `S${String(nextNum).padStart(2, '0')}`;
    setMeasEmissionSources((prev) => [
      ...prev,
      { id: nextId, totalEmissions: '', category: '' },
    ]);
  };

  const removeMeasEmissionSource = (index: number) => {
    setMeasEmissionSources((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasUncertainty = () => {
    const nextId = `S0${measUncertainty.length + 1}`;
    setMeasUncertainty((prev) => [
      ...prev,
      { id: nextId, tier: '', uncertaintyAchieved: '', streamType: '', sourceAccuracy: '' },
    ]);
  };

  const removeMeasUncertainty = (index: number) => {
    setMeasUncertainty((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasPoint = () => {
    const nextId = `M${measPoints.length + 1}`;
    setMeasPoints((prev) => [
      ...prev,
      { id: nextId, associatedSource: '', procedures: '', relevantProcedures: '', relevantSource: '' },
    ]);
  };

  const removeMeasPoint = (index: number) => {
    setMeasPoints((prev) => prev.filter((_, i) => i !== index));
  };



  return (
    <div className="space-y-4">
      {/* ========================================================================= */}
      {/* Section 1: Calculation - Based Monitoring */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-[#004B87]">
            Calculation - Based Monitoring
          </span>
        </div>

        <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-6 text-xs">
            {/* Subsection 1: Source Stream Identification & Classification */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Source Stream Identification & Classification</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Source Stream ID</th>
                      <th className="py-2.5 px-3">Description of Source Stream</th>
                      <th className="py-2.5 px-3">Estimated Emissions [t CO₂e/year]</th>
                      <th className="py-2.5 px-3">Possible Category (Auto)</th>
                      <th className="py-2.5 px-3">Selected Category</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calcSourceStreams.map((row, idx) => {
                      const autoCategory = getSourceStreamCategory(
                        row.estimatedEmissions,
                        totalCalcEmissions
                      );
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.id}
                              placeholder="F01"
                              onChange={(e) => {
                                const copy = [...calcSourceStreams];
                                copy[idx].id = e.target.value;
                                setCalcSourceStreams(copy);
                              }}
                              className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.desc}
                              placeholder="Enter description"
                              onChange={(e) => {
                                const copy = [...calcSourceStreams];
                                copy[idx].desc = e.target.value;
                                setCalcSourceStreams(copy);
                              }}
                              className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.estimatedEmissions}
                              placeholder="Enter emissions"
                              onChange={(e) => {
                                const copy = [...calcSourceStreams];
                                copy[idx].estimatedEmissions = e.target.value;
                                setCalcSourceStreams(copy);
                              }}
                              className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={autoCategory}
                              title="Automatically calculated category based on emissions contribution"
                              className="w-32 px-2.5 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium cursor-not-allowed select-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.selectedCategory}
                              onChange={(e) => {
                                const copy = [...calcSourceStreams];
                                copy[idx].selectedCategory = e.target.value;
                                setCalcSourceStreams(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                            >
                              <option value="">Select category</option>
                              <option value="Major">Major</option>
                              <option value="Minor">Minor</option>
                              <option value="De-minimis">De-minimis</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addCalcSourceStream}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeCalcSourceStream(idx)}
                                className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 2: Tier & Uncertainty Level */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Tier & Uncertainty Level for Each Source Stream</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Source Stream ID</th>
                      <th className="py-2.5 px-3">Tier Level Used</th>
                      <th className="py-2.5 px-3">Category Selected Above</th>
                      <th className="py-2.5 px-3">Uncertainty Level Achieved (%)</th>
                      <th className="py-2.5 px-3">Fuel Stream Type</th>
                      <th className="py-2.5 px-3">Source Of Accuracy</th>
                      <th className="py-2.5 px-3">Permitted level of uncertainty</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calcTierUncertainty.map((row, idx) => {
                      const matchedStream = calcSourceStreams.find(
                        (s) => s.id && row.id && s.id.trim().toLowerCase() === row.id.trim().toLowerCase()
                      ) || calcSourceStreams[idx];

                      const categorySelectedAbove =
                        matchedStream?.selectedCategory ||
                        (hasValidEmissions(matchedStream?.estimatedEmissions)
                          ? getSourceStreamCategory(matchedStream?.estimatedEmissions, totalCalcEmissions)
                          : '') ||
                        '—';

                      const isDeMinimis = categorySelectedAbove === 'De-minimis';

                      const numericPermitted = getPermittedUncertaintyNumeric(row.tier);
                      const numericAchieved = row.uncertaintyAchieved ? parseFloat(row.uncertaintyAchieved.replace(/%/g, '')) : null;
                      const isUncertaintyExceeded =
                        !isDeMinimis &&
                        numericPermitted !== null &&
                        numericAchieved !== null &&
                        !isNaN(numericAchieved) &&
                        numericAchieved > numericPermitted;

                      const permittedDisplay = isDeMinimis
                        ? 'N/A'
                        : getPermittedUncertainty(row.tier);

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.id}
                              placeholder="F01"
                              onChange={(e) => {
                                const copy = [...calcTierUncertainty];
                                copy[idx].id = e.target.value;
                                setCalcTierUncertainty(copy);
                              }}
                              className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.tier}
                              onChange={(e) => {
                                const copy = [...calcTierUncertainty];
                                copy[idx].tier = e.target.value;
                                setCalcTierUncertainty(copy);
                              }}
                              className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200 cursor-pointer shadow-xs'
                              }`}
                            >
                              <option value="">{isDeMinimis ? 'N/A' : 'Select Tier'}</option>
                              {!isDeMinimis && (
                                <>
                                  <option value="Tier 1">Tier 1</option>
                                  <option value="Tier 2">Tier 2</option>
                                  <option value="Tier 3">Tier 3</option>
                                  <option value="Tier 4">Tier 4</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={categorySelectedAbove}
                              title="Auto-populated from Source Stream Identification & Classification"
                              className="w-28 px-2.5 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-not-allowed select-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.uncertaintyAchieved}
                              placeholder={isDeMinimis ? 'N/A' : 'Enter uncertainty %'}
                              onChange={(e) => {
                                const copy = [...calcTierUncertainty];
                                copy[idx].uncertaintyAchieved = e.target.value;
                                setCalcTierUncertainty(copy);
                              }}
                              title={
                                isUncertaintyExceeded
                                  ? `Uncertainty ${row.uncertaintyAchieved}% exceeds permitted level (${permittedDisplay}) for ${row.tier}`
                                  : undefined
                              }
                              className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono focus:outline-none ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : isUncertaintyExceeded
                                  ? 'bg-rose-50/60 text-rose-900 border-rose-300 focus:border-rose-500 font-semibold'
                                  : 'bg-white text-slate-800 border-slate-200 focus:border-[#004B87]'
                              }`}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.fuelStreamType}
                              onChange={(e) => {
                                const copy = [...calcTierUncertainty];
                                copy[idx].fuelStreamType = e.target.value;
                                setCalcTierUncertainty(copy);
                              }}
                              className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200 cursor-pointer shadow-xs'
                              }`}
                            >
                              <option value="">{isDeMinimis ? 'N/A' : 'Select fuel stream type'}</option>
                              {!isDeMinimis && (
                                <>
                                  <option value="Commercial Standard Fuels">Commercial Standard Fuels</option>
                                  <option value="Alternative Fuels">Alternative Fuels</option>
                                  <option value="Diesel">Diesel</option>
                                  <option value="Natural Gas">Natural Gas</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.sourceAccuracy}
                              onChange={(e) => {
                                const copy = [...calcTierUncertainty];
                                copy[idx].sourceAccuracy = e.target.value;
                                setCalcTierUncertainty(copy);
                              }}
                              className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200 cursor-pointer shadow-xs'
                              }`}
                            >
                              <option value="">{isDeMinimis ? 'N/A' : 'Select source'}</option>
                              {!isDeMinimis && (
                                <>
                                  <option value="Lab Analysis">Lab Analysis</option>
                                  <option value="Meter Reading">Meter Reading</option>
                                  <option value="Supplier Data">Supplier Data</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={permittedDisplay}
                              placeholder="Auto (from tier)"
                              title="Permitted level of uncertainty automatically calculated from selected Tier"
                              className="w-full px-2.5 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono font-medium cursor-not-allowed select-none"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addCalcTierUncertainty}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeCalcTierUncertainty(idx)}
                                className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 3: Calculation Approach */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#004B87]">Calculation Approach</h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Calculation based approaches for monitoring CO2 emissions at your facility, if applicable
                </label>
                <textarea
                  rows={3}
                  value={calcApproachDesc}
                  placeholder="Please provide a concise description of the calculation approach, including formulae, used to determine your annual CO₂ emissions at your facility"
                  onChange={(e) => setCalcApproachDesc(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Subsection 4: Detailed Calculation Information */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Detailed Calculation Information</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Source Stream ID</th>
                      <th className="py-2.5 px-3">Fuel Type</th>
                      <th className="py-2.5 px-3">Activity Level – Source Stream</th>
                      <th className="py-2.5 px-3">Unit – Activity Level</th>
                      <th className="py-2.5 px-3">Source (e.g., maintenance records, fuel logs)</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calcDetailedInfo.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            placeholder="F01"
                            onChange={(e) => {
                              const copy = [...calcDetailedInfo];
                              copy[idx].id = e.target.value;
                              setCalcDetailedInfo(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.fuelType}
                            onChange={(e) => {
                              const copy = [...calcDetailedInfo];
                              copy[idx].fuelType = e.target.value;
                              setCalcDetailedInfo(copy);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                          >
                            <option value="">Select fuel type</option>
                            <option value="Natural Gas">Natural Gas</option>
                            <option value="Alternative Fuels">Alternative Fuels</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Commercial Standard Fuels">Commercial Standard Fuels</option>
                            <option value="Coal">Coal</option>
                            <option value="Heavy Fuel Oil">Heavy Fuel Oil</option>
                            <option value="LPG">LPG</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.activityLevel}
                            placeholder="Enter activity level"
                            onChange={(e) => {
                              const copy = [...calcDetailedInfo];
                              copy[idx].activityLevel = e.target.value;
                              setCalcDetailedInfo(copy);
                            }}
                            className="w-44 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.unit}
                            onChange={(e) => {
                              const copy = [...calcDetailedInfo];
                              copy[idx].unit = e.target.value;
                              setCalcDetailedInfo(copy);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                          >
                            <option value="">Select unit</option>
                            <option value="MWH">MWH</option>
                            <option value="GJ">GJ</option>
                            <option value="Nm³">Nm³</option>
                            <option value="t">t</option>
                            <option value="TJ">TJ</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.source}
                            placeholder="Enter source (e.g., maintenance records, fuel logs)"
                            onChange={(e) => {
                              const copy = [...calcDetailedInfo];
                              copy[idx].source = e.target.value;
                              setCalcDetailedInfo(copy);
                            }}
                            className="w-72 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addCalcDetailedInfo}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeCalcDetailedInfo(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Non-Fuel Inputs Description Text Box */}
            <div className="space-y-1.5">
              <label className="block text-slate-600 font-semibold text-xs leading-relaxed">
                If fuel is not an input (i.e., your emissions are non-combustible) please ignore the above table and indicate instead what other inputs / variables are involved in your emissions using the table below
              </label>
              <textarea
                rows={3}
                value={nonFuelInputsDesc}
                placeholder="Indicate other inputs / variables involved in your emissions if fuel is not an input..."
                onChange={(e) => setNonFuelInputsDesc(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
              />
            </div>

            {/* Subsection 5: Other Inputs / Outputs */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Other Inputs / Outputs</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Source Stream ID</th>
                      <th className="py-2.5 px-3">Source Stream Type</th>
                      <th className="py-2.5 px-3">Activity Level</th>
                      <th className="py-2.5 px-3">Units</th>
                      <th className="py-2.5 px-3">Net Calorific Value</th>
                      <th className="py-2.5 px-3">Emission Factor (T Co2 / GJ)</th>
                      <th className="py-2.5 px-3">Oxidation Factor</th>
                      <th className="py-2.5 px-3">Conversion Factor</th>
                      <th className="py-2.5 px-3">Information Source</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calcOtherInputsOutputs.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            placeholder="F01"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].id = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.type}
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].type = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          >
                            <option value="">Select type</option>
                            <option value="Crude Oil">Crude Oil</option>
                            <option value="Natural Gas">Natural Gas</option>
                            <option value="Petcoke">Petcoke</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.activityLevel}
                            placeholder="Enter value"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].activityLevel = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.units}
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].units = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          >
                            <option value="">Select unit</option>
                            <option value="TJ">TJ</option>
                            <option value="GJ">GJ</option>
                            <option value="MWh">MWh</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.ncv}
                            placeholder="Enter NCV"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].ncv = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.emissionFactor}
                            placeholder="Enter factor"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].emissionFactor = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.oxidationFactor}
                            placeholder="Enter %"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].oxidationFactor = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.conversionFactor}
                            placeholder="Enter factor"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].conversionFactor = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-12 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.source}
                            placeholder="Enter source"
                            onChange={(e) => {
                              const copy = [...calcOtherInputsOutputs];
                              copy[idx].source = e.target.value;
                              setCalcOtherInputsOutputs(copy);
                            }}
                            className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addCalcOtherInput}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeCalcOtherInput(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 6: Specification and location of measurement systems */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3 leading-relaxed">
                Specification and location of measurement systems for determining the activity data for source streams
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200/60 align-middle text-left whitespace-nowrap">Ref</th>
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200/60 align-middle text-left leading-tight min-w-[95px]">
                        <span className="block whitespace-nowrap">Associated</span>
                        <span className="block whitespace-nowrap">Source</span>
                      </th>
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200/60 align-middle text-left leading-tight min-w-[195px]">
                        <span className="block whitespace-nowrap">Type of Measuring Instrument</span>
                        <span className="block whitespace-nowrap">& Description</span>
                      </th>
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200/60 align-middle text-left leading-tight min-w-[110px]">
                        <span className="block whitespace-nowrap">Location</span>
                        <span className="block whitespace-nowrap">(Internal ID)</span>
                      </th>
                      <th colSpan={3} className="py-2 px-3 text-center align-middle border-b border-r border-slate-200/60 bg-slate-100/60 whitespace-nowrap font-semibold">Measurement Range</th>
                      <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200/60 align-middle text-left leading-tight min-w-[110px]">
                        <span className="block whitespace-nowrap">Specified</span>
                        <span className="block whitespace-nowrap">Uncertainty (%)</span>
                      </th>
                      <th colSpan={2} className="py-2 px-3 text-center align-middle border-b border-r border-slate-200/60 bg-slate-100/60 whitespace-nowrap font-semibold">Typical Use Range</th>
                      <th rowSpan={2} className="py-2.5 px-3 text-center align-middle whitespace-nowrap">Actions</th>
                    </tr>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2 px-2.5 border-r border-slate-200/60 align-middle text-left">Unit</th>
                      <th className="py-2 px-2.5 border-r border-slate-200/60 align-middle text-left">Lower End</th>
                      <th className="py-2 px-2.5 border-r border-slate-200/60 align-middle text-left">Upper End</th>
                      <th className="py-2 px-2.5 border-r border-slate-200/60 align-middle text-left">Lower End</th>
                      <th className="py-2 px-2.5 border-r border-slate-200/60 align-middle text-left">Upper End</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {calcMeasurementSystems.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.ref}
                            placeholder="MI01"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].ref = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.associatedSource}
                            placeholder="F01"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].associatedSource = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.instrumentType}
                            placeholder="Enter instrument type"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].instrumentType = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.location}
                            placeholder="Enter location / ID"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].location = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.unit}
                            placeholder="Nm³/h"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].unit = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.rangeLower}
                            placeholder="0"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].rangeLower = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.rangeUpper}
                            placeholder="250"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].rangeUpper = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.specifiedUncertainty}
                            placeholder="±%"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].specifiedUncertainty = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.typicalLower}
                            placeholder="500"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].typicalLower = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-2.5">
                          <input
                            type="text"
                            value={row.typicalUpper}
                            placeholder="750"
                            onChange={(e) => {
                              const copy = [...calcMeasurementSystems];
                              copy[idx].typicalUpper = e.target.value;
                              setCalcMeasurementSystems(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addCalcMeasurementSystem}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeCalcMeasurementSystem(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 2: Measurement - Based Monitoring */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-[#004B87]">
            Measurement - Based Monitoring
          </span>
        </div>

        <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-6 text-xs">
            {/* Subsection 1: Identify Relevant Measured Emission Source */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Identify Relevant Measured Emission Source</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Emission Source ID</th>
                      <th className="py-2.5 px-3">Total Emissions [t CO₂e/year]</th>
                      <th className="py-2.5 px-3">Category (see above)</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {measEmissionSources.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            placeholder="S01"
                            onChange={(e) => {
                              const copy = [...measEmissionSources];
                              copy[idx].id = e.target.value;
                              setMeasEmissionSources(copy);
                            }}
                            className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.totalEmissions}
                            placeholder="Enter emissions"
                            onChange={(e) => {
                              const copy = [...measEmissionSources];
                              copy[idx].totalEmissions = e.target.value;
                              setMeasEmissionSources(copy);
                            }}
                            className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.category}
                            onChange={(e) => {
                              const copy = [...measEmissionSources];
                              copy[idx].category = e.target.value;
                              setMeasEmissionSources(copy);
                            }}
                            className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer shadow-xs"
                          >
                            <option value="">Select category</option>
                            <option value="Major">Major</option>
                            <option value="Minor">Minor</option>
                            <option value="De-minimis">De-minimis</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addMeasEmissionSource}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeMeasEmissionSource(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 2: Uncertainty Levels for Each Emission Source */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Uncertainty Levels for Each Emission Source</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Emission Source ID</th>
                      <th className="py-2.5 px-3">Tier Level Used</th>
                      <th className="py-2.5 px-3">Category Selected Above</th>
                      <th className="py-2.5 px-3">Uncertainty Level Achieved (%)</th>
                      <th className="py-2.5 px-3">Emission Stream Type</th>
                      <th className="py-2.5 px-3">Source Of Accuracy</th>
                      <th className="py-2.5 px-3">Permitted level of uncertainty</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {measUncertainty.map((row, idx) => {
                      const matchedSource = measEmissionSources.find(
                        (s) => s.id && row.id && s.id.trim().toLowerCase() === row.id.trim().toLowerCase()
                      ) || measEmissionSources[idx];

                      const categorySelectedAbove =
                        matchedSource?.category ||
                        (hasValidEmissions(matchedSource?.totalEmissions)
                          ? getSourceStreamCategory(matchedSource?.totalEmissions, totalMeasEmissions)
                          : '') ||
                        '—';

                      const isDeMinimis = categorySelectedAbove === 'De-minimis';

                      const numericPermitted = getPermittedUncertaintyNumeric(row.tier);
                      const numericAchieved = row.uncertaintyAchieved ? parseFloat(row.uncertaintyAchieved.replace(/%/g, '')) : null;
                      const isUncertaintyExceeded =
                        !isDeMinimis &&
                        numericPermitted !== null &&
                        numericAchieved !== null &&
                        !isNaN(numericAchieved) &&
                        numericAchieved > numericPermitted;

                      const permittedDisplay = isDeMinimis
                        ? 'N/A'
                        : getPermittedUncertainty(row.tier);

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.id}
                              placeholder="S01"
                              onChange={(e) => {
                                const copy = [...measUncertainty];
                                copy[idx].id = e.target.value;
                                setMeasUncertainty(copy);
                              }}
                              className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.tier}
                              onChange={(e) => {
                                const copy = [...measUncertainty];
                                copy[idx].tier = e.target.value;
                                setMeasUncertainty(copy);
                              }}
                              className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200 cursor-pointer shadow-xs'
                              }`}
                            >
                              <option value="">{isDeMinimis ? 'N/A' : 'Select Tier'}</option>
                              {!isDeMinimis && (
                                <>
                                  <option value="Tier 1">Tier 1</option>
                                  <option value="Tier 2">Tier 2</option>
                                  <option value="Tier 3">Tier 3</option>
                                  <option value="Tier 4">Tier 4</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={categorySelectedAbove}
                              title="Auto-populated from Identify Relevant Measured Emission Source"
                              className="w-28 px-2.5 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-not-allowed select-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.uncertaintyAchieved}
                              placeholder={isDeMinimis ? 'N/A' : 'Enter uncertainty %'}
                              onChange={(e) => {
                                const copy = [...measUncertainty];
                                copy[idx].uncertaintyAchieved = e.target.value;
                                setMeasUncertainty(copy);
                              }}
                              title={
                                isUncertaintyExceeded
                                  ? `Uncertainty ${row.uncertaintyAchieved}% exceeds permitted level (${permittedDisplay}) for ${row.tier}`
                                  : undefined
                              }
                              className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono focus:outline-none ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : isUncertaintyExceeded
                                  ? 'bg-rose-50/60 text-rose-900 border-rose-300 focus:border-rose-500 font-semibold'
                                  : 'bg-white text-slate-800 border-slate-200 focus:border-[#004B87]'
                              }`}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.streamType}
                              placeholder={isDeMinimis ? 'N/A' : 'Enter stream type'}
                              onChange={(e) => {
                                const copy = [...measUncertainty];
                                copy[idx].streamType = e.target.value;
                                setMeasUncertainty(copy);
                              }}
                              className={`w-36 px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200'
                              }`}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              disabled={isDeMinimis}
                              value={isDeMinimis ? '' : row.sourceAccuracy}
                              onChange={(e) => {
                                const copy = [...measUncertainty];
                                copy[idx].sourceAccuracy = e.target.value;
                                setMeasUncertainty(copy);
                              }}
                              className={`px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-[#004B87] ${
                                isDeMinimis
                                  ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                                  : 'bg-white text-slate-800 border-slate-200 cursor-pointer shadow-xs'
                              }`}
                            >
                              <option value="">{isDeMinimis ? 'N/A' : 'Select source'}</option>
                              {!isDeMinimis && (
                                <>
                                  <option value="Lab Analysis">Lab Analysis</option>
                                  <option value="Meter Reading">Meter Reading</option>
                                  <option value="Supplier Data">Supplier Data</option>
                                </>
                              )}
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={permittedDisplay}
                              placeholder="Auto (from tier)"
                              title="Permitted level of uncertainty automatically calculated from selected Tier"
                              className="w-full px-2.5 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono font-medium cursor-not-allowed select-none"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addMeasUncertainty}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeMeasUncertainty(idx)}
                                className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 3: Measurement - Based Approach */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#004B87]">Measurement - Based Approach</h4>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Measurement Approach Description</label>
                <textarea
                  rows={2}
                  value={measApproachDesc}
                  placeholder="Enter measurement approach description"
                  onChange={(e) => setMeasApproachDesc(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Subsection 4: Measurement Points Details */}
            <div>
              <h4 className="text-xs font-bold text-[#004B87] mb-3">Measurement Points Details</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3">Measurement Point ID</th>
                      <th className="py-2.5 px-3">Associated Emission Source (ID)</th>
                      <th className="py-2.5 px-3">Procedures Used For Measurement Point (Including Calculations, Data Aggregation, Validation Etc)</th>
                      <th className="py-2.5 px-3">Relevant Procedures Followed</th>
                      <th className="py-2.5 px-3">Relevant Source</th>
                      <th className="py-2.5 px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {measPoints.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            placeholder="M01"
                            onChange={(e) => {
                              const copy = [...measPoints];
                              copy[idx].id = e.target.value;
                              setMeasPoints(copy);
                            }}
                            className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.associatedSource}
                            onChange={(e) => {
                              const copy = [...measPoints];
                              copy[idx].associatedSource = e.target.value;
                              setMeasPoints(copy);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          >
                            <option value="">Select source</option>
                            <option value="S01">S01</option>
                            <option value="S02">S02</option>
                            <option value="S03">S03</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.procedures}
                            placeholder="Enter procedures"
                            onChange={(e) => {
                              const copy = [...measPoints];
                              copy[idx].procedures = e.target.value;
                              setMeasPoints(copy);
                            }}
                            className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.relevantProcedures}
                            placeholder="Enter relevant procedure"
                            onChange={(e) => {
                              const copy = [...measPoints];
                              copy[idx].relevantProcedures = e.target.value;
                              setMeasPoints(copy);
                            }}
                            className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.relevantSource}
                            placeholder="Enter relevant standard / source"
                            onChange={(e) => {
                              const copy = [...measPoints];
                              copy[idx].relevantSource = e.target.value;
                              setMeasPoints(copy);
                            }}
                            className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={addMeasPoint}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeMeasPoint(idx)}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection 5: Comments */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#004B87]">Comments</h4>
              <textarea
                rows={4}
                value={measComments}
                placeholder="Please provide any relevant comments below. Explanations may in particular be required for e.g. the biomass estimation method, further QA/QC measures, etc. Include here for any deviation from e.g. uncertainty requirements"
                onChange={(e) => setMeasComments(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder:text-slate-400 placeholder:text-xs text-xs focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
              />
            </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Section 3: Fallback Approach */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
        <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold text-[#004B87]">
            Fallback Approach
          </span>
        </div>

        <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Monitoring Methodology Description</label>
            <textarea
              rows={2}
              value={fallbackData.methodologyDesc}
              placeholder="Enter monitoring methodology description"
              onChange={(e) => setFallbackData({ ...fallbackData, methodologyDesc: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Justification Details</label>
            <textarea
              rows={2}
              value={fallbackData.justification}
              placeholder="Enter justification details"
              onChange={(e) => setFallbackData({ ...fallbackData, justification: e.target.value })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
