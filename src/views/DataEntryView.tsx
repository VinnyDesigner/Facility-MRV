import React, { useState, useRef } from 'react';
import {
  Plus,
  X,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Layers,
  Flame,
  ShieldCheck,
  Send,
  Trash2,
  Sparkles,
  RotateCcw,
  Lock,
  Clock,
  Settings,
  Gauge,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

export const DataEntryView: React.FC = () => {
  const {
    activeFacility,
    reportingYear,
    setActiveView,
    workflowState,
    isMonitoringPlanUnlocked,
    setMonitoringPlanStatus,
    currentRole,
    openReadOnlyViewer,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // Top Selectors State - Automatically reflected from Registration
  const [selectedFacility, setSelectedFacility] = useState(
    activeFacility?.name || 'Green Mountain Cement Factory'
  );
  const [calendarYear, setCalendarYear] = useState(
    String(reportingYear || '2026')
  );

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<'facility-overview'>('facility-overview');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Facility Description Form State
  const [facilityDesc, setFacilityDesc] = useState({
    description:
      'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
    businessSector: 'Select Business Sector',
    primaryActivity: 'Select Primary Activity',
    operationalStatus: 'Operational',
  });
  const [isCustomBusinessSector, setIsCustomBusinessSector] = useState(false);
  const [isCustomPrimaryActivity, setIsCustomPrimaryActivity] = useState(false);

  // 2. Primary Production Streams State
  const [productionStreams, setProductionStreams] = useState([
    {
      id: 'P01',
      category: 'Primary Products',
      technology: 'Process A',
      energyRelated: 'Yes',
      processEmissions: 'No',
      capacity: '100,000',
      capacityUnit: 't/year',
      actualQuantity: '85,000',
      actualQuantityUnit: 't/year',
    },
    {
      id: 'P02',
      category: 'Primary Products',
      technology: 'Process B',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      capacity: '50,000',
      capacityUnit: 't/year',
      actualQuantity: '100,000',
      actualQuantityUnit: 't/year',
    },
    {
      id: 'P03',
      category: 'Primary Products',
      technology: 'Kiln Process',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      capacity: '100,000',
      capacityUnit: 't/year',
      actualQuantity: '100,000',
      actualQuantityUnit: 't/year',
    },
  ]);

  // 3. Emissions Estimation State
  const [emissionsEstimation, setEmissionsEstimation] = useState({
    estimatedAnnualEmissions: '124,450',
    justification: 'Estimated based on production data and IPCC Guidelines',
  });

  // 4. Emission Sources State
  const [emissionSources, setEmissionSources] = useState([
    {
      id: 'S01',
      name: 'X',
      associatedProduct: 'P01',
      gasTypes: 'COâ‚‚, CHâ‚„, Nâ‚‚O',
      totalEmissions: '45,000',
      energyRelated: 'No',
      processEmissions: 'No',
      methodology: 'Calculation-based',
    },
    {
      id: 'S02',
      name: 'XX',
      associatedProduct: 'P02',
      gasTypes: 'COâ‚‚, Nâ‚‚O',
      totalEmissions: '35,000',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      methodology: 'Measurement-based',
    },
    {
      id: 'S03',
      name: 'XXX',
      associatedProduct: 'P03',
      gasTypes: 'COâ‚‚',
      totalEmissions: '12,000',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      methodology: 'Fall-back',
    },
  ]);

  // 5. Methane Emission State
  const [methaneData, setMethaneData] = useState({
    hasMethaneEmissions: false,
    annualVolume: '',
    annualVolumeUnit: 't CH₄/year',
    estimatedCo2e: '',
    estimatedCo2eUnit: 't CO₂e/year',
    sourceOfEstimations: '',
    keySourcesAtInstallation: '',
    procedureToDetermine: '',
    hasLdarProgram: true,
    detectionMethod: 'Optical Gas Imaging (OGI)',
    correctiveActionProcedure: '',
  });

  // Methane Procedures Table
  const [methaneProcedures, setMethaneProcedures] = useState([
    {
      id: '1',
      title: 'LDAR',
      description: 'XXX',
      personInCharge: 'Ahmed Al Mansoori',
      email: 'ahmed@gmcf.ae',
      phone: '+971 50 123 4567',
    },
    {
      id: '2',
      title: 'Landfill Gas Monitoring',
      description: 'XXX',
      personInCharge: 'Fatima Al Zaabi',
      email: 'fatima@gmcf.ae',
      phone: '+971 50 234 5678',
    },
    {
      id: '3',
      title: 'XXX',
      description: 'XXX',
      personInCharge: 'Khalid Al Nuaimi',
      email: 'khalid@gmcf.ae',
      phone: '+971 50 345 6789',
    },
  ]);

  // 6. Source Stream State
  const [sourceStreams, setSourceStreams] = useState([
    {
      id: 'FC1',
      description: 'X',
      associatedSource: 'S01',
      classification: 'Fuel Combusted',
      activityLevel: '10,000',
      activityUnit: 'NmÂ³',
      fuelType: 'Natural gas',
      combustionDevice: 'Gas-fired heaters',
      deviceCapacity: '100.0',
      metricUnit: 'MW',
    },
    {
      id: 'FC2',
      description: 'XX',
      associatedSource: 'S01',
      classification: 'Other Input',
      activityLevel: '10,000',
      activityUnit: 'NmÂ³',
      fuelType: 'Natural gas',
      combustionDevice: 'Gas-fired heaters',
      deviceCapacity: '100.0',
      metricUnit: 'MW',
    },
    {
      id: 'FC3',
      description: 'XXX',
      associatedSource: 'S01',
      classification: 'Output',
      activityLevel: '10,000',
      activityUnit: 'NmÂ³',
      fuelType: 'Natural gas',
      combustionDevice: 'Gas-fired heaters',
      deviceCapacity: '100.0',
      metricUnit: 'MW',
    },
  ]);

  // 7. Remarks
  const [remarks, setRemarks] = useState('');

  // 8. Supporting Documents
  const [attachedFiles, setAttachedFiles] = useState([
    { name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' },
  ]);

  const handleSave = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Add & Delete Helpers
  const addProductionStream = () => {
    const nextId = `P${String(productionStreams.length + 1).padStart(2, '0')}`;
    setProductionStreams((prev) => [
      ...prev,
      {
        id: nextId,
        category: '',
        technology: '',
        energyRelated: '',
        processEmissions: '',
        capacity: '',
        capacityUnit: '',
        actualQuantity: '',
        actualQuantityUnit: '',
      },
    ]);
  };

  const removeProductionStream = (index: number) => {
    setProductionStreams((prev) => prev.filter((_, i) => i !== index));
  };

  const addEmissionSource = () => {
    const nextId = `S${String(emissionSources.length + 1).padStart(2, '0')}`;
    setEmissionSources((prev) => [
      ...prev,
      {
        id: nextId,
        name: '',
        associatedProduct: '',
        gasTypes: '',
        totalEmissions: '',
        energyRelated: '',
        processEmissions: '',
        methodology: '',
      },
    ]);
  };

  const removeEmissionSource = (index: number) => {
    setEmissionSources((prev) => prev.filter((_, i) => i !== index));
  };

  const addMethaneProcedure = () => {
    setMethaneProcedures((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        title: '',
        description: '',
        personInCharge: '',
        email: '',
        phone: '',
      },
    ]);
  };

  const removeMethaneProcedure = (index: number) => {
    setMethaneProcedures((prev) => prev.filter((_, i) => i !== index));
  };

  const addSourceStream = () => {
    const nextId = `FC${sourceStreams.length + 1}`;
    setSourceStreams((prev) => [
      ...prev,
      {
        id: nextId,
        description: '',
        associatedSource: '',
        classification: '',
        activityLevel: '',
        activityUnit: '',
        fuelType: '',
        combustionDevice: '',
        deviceCapacity: '',
        metricUnit: '',
      },
    ]);
  };

  const removeSourceStream = (index: number) => {
    setSourceStreams((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================================
  // CALCULATION OTHER INPUTS & MEASUREMENT EQUIPMENT STATE
  // =========================================================================
  const [calcOtherInputsOutputs, setCalcOtherInputsOutputs] = useState([
    { id: 'F01', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '42.3', emissionFactor: '73.3', oxidationFactor: '100%', conversionFactor: '-', source: 'IPCC' },
    { id: 'F02', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '23.5', emissionFactor: '64.3', oxidationFactor: '75%', conversionFactor: '-', source: 'IPCC' },
  ]);

  const addCalcOtherInput = () => {
    const nextId = `F${String(calcOtherInputsOutputs.length + 1).padStart(2, '0')}`;
    setCalcOtherInputsOutputs((prev) => [
      ...prev,
      { id: nextId, type: '', activityLevel: '', units: '', ncv: '', emissionFactor: '', oxidationFactor: '', conversionFactor: '', source: '' },
    ]);
  };

  const removeCalcOtherInput = (index: number) => {
    setCalcOtherInputsOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  const [measEquipment, setMeasEquipment] = useState([
    { name: 'CEMS Analyzer - 01', type: 'CEMS', manufacturer: 'ABB / ACX50000', parameter: 'CO₂ , O₂', accuracyClass: 'Class A' },
    { name: 'Flow Meter - 01', type: 'Flow Meter', manufacturer: 'X', parameter: 'Flow Rate', accuracyClass: '±1%' },
    { name: 'Gas Analyzer - 01', type: 'Gas Analyzer', manufacturer: 'XX', parameter: 'CO₂', accuracyClass: '±1%' },
  ]);

  const addMeasEquipment = () => {
    setMeasEquipment((prev) => [
      ...prev,
      { name: '', type: '', manufacturer: '', parameter: '', accuracyClass: '' },
    ]);
  };

  const removeMeasEquipment = (index: number) => {
    setMeasEquipment((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================================
  // MITIGATION MEASURES STATE
  // =========================================================================
  const [mitigationMeasures, setMitigationMeasures] = useState([
    { description: 'X', category: 'Emission Reduction', scope: '1', ghg: 'CO₂', startYear: '2024', status: 'Implemented', preMeasure: '4,200', reportingReduction: 'Standard', expectedReduction: 'Not verified', standard: 'IPCC', verification: 'Not verified' },
    { description: 'XX', category: 'Emission Avoidance', scope: '3', ghg: 'CH₄', startYear: '2020', status: 'Planned', preMeasure: '4,200', reportingReduction: 'Standard', expectedReduction: 'Not verified', standard: 'IPCC', verification: 'Verified' },
    { description: 'XXX', category: 'Carbon Removal', scope: '2', ghg: 'Mixed', startYear: '2019', status: 'Feasibility Study', preMeasure: '4,200', reportingReduction: 'Standard', expectedReduction: 'Not verified', standard: 'IPCC', verification: 'Third - Party Verified' },
  ]);

  const addMitigationMeasure = () => {
    setMitigationMeasures((prev) => [
      ...prev,
      { description: '', category: '', scope: '', ghg: '', startYear: '', status: '', preMeasure: '', reportingReduction: '', expectedReduction: '', standard: '', verification: '' },
    ]);
  };
  const removeMitigationMeasure = (idx: number) => setMitigationMeasures((prev) => prev.filter((_, i) => i !== idx));

  const loadExampleData = () => {
    setFacilityDesc({
      description:
        'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
      businessSector: 'Energy',
      primaryActivity: 'Combustion of fuels',
      operationalStatus: 'Operational',
    });
    setIsCustomBusinessSector(false);
    setIsCustomPrimaryActivity(false);
    setProductionStreams([
      { id: 'P01', category: 'Primary Products', technology: 'Process A', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' },
      { id: 'P02', category: 'Primary Products', technology: 'Process B', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '50,000', capacityUnit: 't/year', actualQuantity: '100,000', actualQuantityUnit: 't/year' },
      { id: 'P03', category: 'Primary Products', technology: 'Kiln Process', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '100,000', actualQuantityUnit: 't/year' },
    ]);
    setEmissionsEstimation({
      estimatedAnnualEmissions: '124,450',
      justification: 'Estimated based on production data and IPCC Guidelines',
    });
    setEmissionSources([
      { id: 'S01', name: 'X', associatedProduct: 'P01', gasTypes: 'COâ‚‚, CHâ‚„, Nâ‚‚O', totalEmissions: '45,000', energyRelated: 'No', processEmissions: 'No', methodology: 'Standard' },
      { id: 'S02', name: 'XX', associatedProduct: 'P02', gasTypes: 'COâ‚‚', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Standard' },
      { id: 'S03', name: 'XXXX', associatedProduct: 'P03', gasTypes: 'COâ‚‚', totalEmissions: '29,450', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Fall-back' },
    ]);
    setMethaneData({
      hasMethaneEmissions: false,
      annualVolume: '1250',
      annualVolumeUnit: 't CHâ‚„/year',
      estimatedCo2e: '31250',
      estimatedCo2eUnit: 't COâ‚‚e/year',
      sourceOfEstimations: 'Estimated based on production data and IPCC Guidelines',
      keySourcesAtInstallation: 'Estimated based on production data and IPCC Guidelines',
      procedureToDetermine: 'Estimated based on production data and IPCC Guidelines',
      hasLdarProgram: true,
      detectionMethod: 'Optical Gas Imaging (OGI)',
      correctiveActionProcedure: 'Estimated based on production data and IPCC Guidelines',
    });
    setSourceStreams([
      { id: 'FC1', description: 'X', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '10,000', activityUnit: 'NmÂ³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
      { id: 'FC2', description: 'XX', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '10,000', activityUnit: 'NmÂ³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
      { id: 'FC3', description: 'XXX', associatedSource: 'S01', classification: 'Output', activityLevel: '10,000', activityUnit: 'NmÂ³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
    ]);
    setRemarks('Operations conducted in accordance with approved monitoring plan.');
    setAttachedFiles([{ name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' }]);
    setNoticeMessage('Loaded Sample Example Data!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const clearAllData = () => {
    setFacilityDesc({
      description: '',
      businessSector: 'Select Business Sector',
      primaryActivity: 'Select Primary Activity',
      operationalStatus: 'Operational',
    });
    setIsCustomBusinessSector(false);
    setIsCustomPrimaryActivity(false);
    setProductionStreams([
      { id: 'P01', category: 'Primary Products', technology: '', energyRelated: 'Yes', processEmissions: 'No', capacity: '', capacityUnit: 't/year', actualQuantity: '', actualQuantityUnit: 't/year' },
    ]);
    setEmissionsEstimation({
      estimatedAnnualEmissions: '',
      justification: '',
    });
    setEmissionSources([
      { id: 'S01', name: '', associatedProduct: 'P01', gasTypes: 'COâ‚‚', totalEmissions: '', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Standard' },
    ]);
    setMethaneData({
      hasMethaneEmissions: false,
      annualVolume: '',
      annualVolumeUnit: 't CHâ‚„/year',
      estimatedCo2e: '',
      estimatedCo2eUnit: 't COâ‚‚e/year',
      sourceOfEstimations: '',
      keySourcesAtInstallation: '',
      procedureToDetermine: '',
      hasLdarProgram: false,
      detectionMethod: 'Optical Gas Imaging (OGI)',
      correctiveActionProcedure: '',
    });
    setSourceStreams([
      { id: 'FC1', description: '', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '', activityUnit: 'NmÂ³', fuelType: 'Natural gas', combustionDevice: '', deviceCapacity: '', metricUnit: 'MW' },
    ]);
    setRemarks('');
    setAttachedFiles([]);
    setNoticeMessage('Form Cleared to Blank State!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  // LOCKED STATE CHECK
  if (!isMonitoringPlanUnlocked) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Monitoring Plan Locked</h2>
          <p className="text-sm text-slate-500 max-w-md">
            Facility Registration must be <span className="font-bold text-[#004B87]">Approved / Registered</span> before Monitoring Plan submission becomes available.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Current Registration Status: <span className="font-bold text-amber-600">{workflowState.registrationStatus}</span>
          </p>
        </div>
        <button
          onClick={() => setActiveView('registration')}
          className="mt-2 px-5 py-2 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] transition-colors cursor-pointer"
        >
          Go to Facility Registration
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* 1. TOP HEADER & 3 SELECTORS ROW (Fixed) */}
      <div className="flex-shrink-0 space-y-3 pb-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
                Monitoring Plan
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Facility Monitoring Plan — Submit within 90 days of Registration approval
              </p>
            </div>

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{noticeMessage}</span>
              </div>
            )}
          </div>

          {/* Workflow Status & 90-Day Requirement Badge */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>90-Day Deadline: {workflowState.monitoringPlanDeadline || '13-Sep-2026'}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
              workflowState.monitoringPlanStatus === 'Draft' ? 'bg-slate-100 text-slate-600' :
              workflowState.monitoringPlanStatus === 'Submitted' ? 'bg-blue-100 text-blue-700' :
              workflowState.monitoringPlanStatus === 'Approved' || workflowState.monitoringPlanStatus === 'Accepted' || workflowState.monitoringPlanStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {workflowState.monitoringPlanStatus === 'Approved' ? 'Active Monitoring Plan' : workflowState.monitoringPlanStatus}
            </span>
          </div>
        </div>

        {/* Top Selectors - 4-column row layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility / Plant Name</label>
            <div className="relative">
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-8"
              >
                <option value="Green Mountain Cement Factory">Green Mountain Cement Factory</option>
                <option value="Abu Dhabi Power Plant">Abu Dhabi Power Plant</option>
                <option value="Al Ruwais Refinery">Al Ruwais Refinery</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Calendar Year</label>
            <div className="relative">
              <select
                value={calendarYear}
                onChange={(e) => setCalendarYear(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer appearance-none pr-8"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Remaining 2 slots kept empty */}
          <div className="hidden lg:block" />
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* 2. SCROLLABLE INNER CARD FRAME */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto py-1 space-y-4 pr-1.5 no-scrollbar text-xs">
          {activeTab === 'facility-overview' && (
            <div className="space-y-4">
              {/* ========================================================================= */}
              {/* Section 1: Facility Overview */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Facility Overview
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Primary Business Sector</label>
                      {isCustomBusinessSector ? (
                        <div className="relative animate-fade-in">
                          <input
                            type="text"
                            placeholder="Enter business sector"
                            value={facilityDesc.businessSector}
                            onChange={(e) => setFacilityDesc({ ...facilityDesc, businessSector: e.target.value })}
                            className="w-full px-3.5 py-2.5 pr-8 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm"
                            autoFocus
                          />
                          <button
                            type="button"
                            title="Switch back to dropdown list"
                            onClick={() => {
                              setIsCustomBusinessSector(false);
                              setFacilityDesc({ ...facilityDesc, businessSector: 'Select Business Sector' });
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <select
                          value={facilityDesc.businessSector}
                          onChange={(e) => {
                            if (e.target.value === 'Other') {
                              setIsCustomBusinessSector(true);
                              setFacilityDesc({ ...facilityDesc, businessSector: '' });
                            } else {
                              setFacilityDesc({ ...facilityDesc, businessSector: e.target.value });
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Select Business Sector">Select Business Sector</option>
                          <option value="Energy">Energy</option>
                          <option value="Transport">Transport</option>
                          <option value="Industrial Processes">Industrial Processes</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Waste">Waste</option>
                          <option value="Land Use & Forestry">Land Use & Forestry</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Primary Activity</label>
                      {isCustomPrimaryActivity ? (
                        <div className="relative animate-fade-in">
                          <input
                            type="text"
                            placeholder="Enter primary activity"
                            value={facilityDesc.primaryActivity}
                            onChange={(e) => setFacilityDesc({ ...facilityDesc, primaryActivity: e.target.value })}
                            className="w-full px-3.5 py-2.5 pr-8 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm"
                            autoFocus
                          />
                          <button
                            type="button"
                            title="Switch back to dropdown list"
                            onClick={() => {
                              setIsCustomPrimaryActivity(false);
                              setFacilityDesc({ ...facilityDesc, primaryActivity: 'Select Primary Activity' });
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <select
                          value={facilityDesc.primaryActivity}
                          onChange={(e) => {
                            if (e.target.value === 'Other') {
                              setIsCustomPrimaryActivity(true);
                              setFacilityDesc({ ...facilityDesc, primaryActivity: '' });
                            } else {
                              setFacilityDesc({ ...facilityDesc, primaryActivity: e.target.value });
                            }
                          }}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Select Primary Activity">Select Primary Activity</option>
                          <option value="Combustion of fuels">Combustion of fuels</option>
                          <option value="Production of coke">Production of coke</option>
                          <option value="Metal ore roasting or sintering">Metal ore roasting or sintering</option>
                          <option value="Production of iron or steel">Production of iron or steel</option>
                          <option value="Production of aluminum">Production of aluminum</option>
                          <option value="Production of cement clinker">Production of cement clinker</option>
                          <option value="Production of glass">Production of glass</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* Section 2: Primary Production Streams */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Primary Production Streams
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Product ID</th>
                          <th className="py-2.5 px-3">Product Category</th>
                          <th className="py-2.5 px-3">Production Technology/Process</th>
                          <th className="py-2.5 px-3">Energy Related Emissions?</th>
                          <th className="py-2.5 px-3">Process Emissions?</th>
                          <th className="py-2.5 px-3">Production Capacity</th>
                          <th className="py-2.5 px-3">Production Capacity Unit</th>
                          <th className="py-2.5 px-3">Actual Production Quantity</th>
                          <th className="py-2.5 px-3">Actual Production Quantity Unit</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {productionStreams.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.id}
                                placeholder="P01"
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].id = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.category}
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].category = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select category</option>
                                <option value="Primary Products">Primary Products</option>
                                <option value="Secondary Products">Secondary Products</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.technology}
                                placeholder="Enter technology/process"
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].technology = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.energyRelated}
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].energyRelated = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.processEmissions}
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].processEmissions = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select...</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.capacity}
                                placeholder="Enter capacity"
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].capacity = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.capacityUnit}
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].capacityUnit = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select unit</option>
                                <option value="t/year">t/year</option>
                                <option value="Nm³/year">Nm³/year</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.actualQuantity}
                                placeholder="Enter quantity"
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].actualQuantity = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.actualQuantityUnit}
                                onChange={(e) => {
                                  const copy = [...productionStreams];
                                  copy[idx].actualQuantityUnit = e.target.value;
                                  setProductionStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select unit</option>
                                <option value="t/year">t/year</option>
                                <option value="Nm³/year">Nm³/year</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={addProductionStream}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeProductionStream(idx)}
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

              {/* ========================================================================= */}
              {/* Section 3: Emissions Estimation */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Emissions Estimation
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Estimated Annual Emissions (tCO₂e)</label>
                      <input
                        type="text"
                        value={emissionsEstimation.estimatedAnnualEmissions}
                        onChange={(e) =>
                          setEmissionsEstimation({ ...emissionsEstimation, estimatedAnnualEmissions: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Justification for the estimated value</label>
                    <textarea
                      rows={2}
                      value={emissionsEstimation.justification}
                      onChange={(e) =>
                        setEmissionsEstimation({ ...emissionsEstimation, justification: e.target.value })
                      }
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* Section 4: Emission Sources */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Emission Sources
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Source ID</th>
                          <th className="py-2.5 px-3">Emission Source (Name, Description)</th>
                          <th className="py-2.5 px-3">Associated Product (ID)</th>
                          <th className="py-2.5 px-3">Types Of Gas(es) Emitted</th>
                          <th className="py-2.5 px-3">Total Emissions From Source (T CO2e)</th>
                          <th className="py-2.5 px-3">Energy Related Emissions?</th>
                          <th className="py-2.5 px-3">Process Emissions?</th>
                          <th className="py-2.5 px-3">Methodology For Determining Emissions</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {emissionSources.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.id}
                                placeholder="S01"
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].id = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.name}
                                placeholder="Enter emission source name"
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].name = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.associatedProduct}
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].associatedProduct = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select product</option>
                                <option value="P01">P01</option>
                                <option value="P02">P02</option>
                                <option value="P03">P03</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.gasTypes}
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].gasTypes = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select gas types</option>
                                <option value="CO₂, CH₄, N₂O">CO₂, CH₄, N₂O</option>
                                <option value="CO₂, N₂O">CO₂, N₂O</option>
                                <option value="CO₂">CO₂</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.totalEmissions}
                                placeholder="Enter emissions (tCO₂e)"
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].totalEmissions = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.energyRelated}
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].energyRelated = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select...</option>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.processEmissions}
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].processEmissions = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select...</option>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.methodology}
                                onChange={(e) => {
                                  const copy = [...emissionSources];
                                  copy[idx].methodology = e.target.value;
                                  setEmissionSources(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select methodology</option>
                                <option value="Calculation-based">Calculation-based</option>
                                <option value="Measurement-based">Measurement-based</option>
                                <option value="Fall-back">Fall-back</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={addEmissionSource}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeEmissionSource(idx)}
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

              {/* ========================================================================= */}
              {/* Section 5: Methane Emission */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Methane Emission
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  {/* Methane Occurrence Toggle */}
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 font-semibold">Do methane emissions occur at your facility?</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span
                        className={`font-semibold ${methaneData.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'}`}
                      >
                        Yes
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setMethaneData({
                            ...methaneData,
                            hasMethaneEmissions: !methaneData.hasMethaneEmissions,
                          })
                        }
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${methaneData.hasMethaneEmissions ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${methaneData.hasMethaneEmissions ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </button>
                      <span
                        className={`font-semibold ${!methaneData.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'}`}
                      >
                        No
                      </span>
                    </div>
                  </div>

                  {/* Details shown ONLY when Methane Emissions is Yes */}
                  {methaneData.hasMethaneEmissions && (
                    <div className="space-y-4 animate-fade-in pt-1">
                      {/* 2 Fields: Annual Volume & Estimated CO2e */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1.5">Annual Volume of methane emissions at site</label>
                          <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-[#004B87] focus-within:ring-1 focus-within:ring-[#004B87] transition-all overflow-hidden">
                            <input
                              type="text"
                              value={methaneData.annualVolume}
                              onChange={(e) => setMethaneData({ ...methaneData, annualVolume: e.target.value })}
                              className="w-[60%] px-3.5 py-2.5 bg-transparent text-navy-900 font-mono text-xs focus:outline-none placeholder:font-sans placeholder:text-slate-400"
                              placeholder="If no known emissions, enter N/A."
                            />
                            <div className="w-[1px] h-6 bg-slate-200 shrink-0" />
                            <select
                              value={methaneData.annualVolumeUnit}
                              onChange={(e) => setMethaneData({ ...methaneData, annualVolumeUnit: e.target.value })}
                              className="w-[40%] px-3 py-2.5 bg-transparent text-navy-900 text-xs focus:outline-none cursor-pointer"
                            >
                              <option value="t CH₄/year">t CH₄/year</option>
                              <option value="Nm³/year">Nm³/year</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 font-semibold mb-1.5">Estimated CO₂e from methane emissions (100-year GWP)</label>
                          <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl shadow-sm focus-within:border-[#004B87] focus-within:ring-1 focus-within:ring-[#004B87] transition-all overflow-hidden">
                            <input
                              type="text"
                              value={methaneData.estimatedCo2e}
                              onChange={(e) => setMethaneData({ ...methaneData, estimatedCo2e: e.target.value })}
                              className="w-[60%] px-3.5 py-2.5 bg-transparent text-navy-900 font-mono text-xs focus:outline-none placeholder:font-sans placeholder:text-slate-400"
                              placeholder="Use the IPCC Fifth Assessment Report (AR5) 100-year GWP values for conversion of CH₄ to CO₂e."
                            />
                            <div className="w-[1px] h-6 bg-slate-200 shrink-0" />
                            <select
                              value={methaneData.estimatedCo2eUnit}
                              onChange={(e) => setMethaneData({ ...methaneData, estimatedCo2eUnit: e.target.value })}
                              className="w-[40%] px-3 py-2.5 bg-transparent text-navy-900 text-xs focus:outline-none cursor-pointer"
                            >
                              <option value="t CO₂e/year">t CO₂e/year</option>
                              <option value="t CH₄/year">t CH₄/year</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 3 Textareas */}
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Source of estimates, including conversion factors</label>
                        <textarea
                          rows={2}
                          value={methaneData.sourceOfEstimations}
                          onChange={(e) => setMethaneData({ ...methaneData, sourceOfEstimations: e.target.value })}
                          placeholder="Enter the source of estimates, including conversion factors."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Key methane emission sources at the installation</label>
                        <textarea
                          rows={2}
                          value={methaneData.keySourcesAtInstallation}
                          onChange={(e) => setMethaneData({ ...methaneData, keySourcesAtInstallation: e.target.value })}
                          placeholder="Provide details of the key emission sources and, where applicable, the source stream type."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed placeholder:text-slate-400"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Procedures used to determine / estimate the quantity of methane emitted</label>
                        <textarea
                          rows={2}
                          value={methaneData.procedureToDetermine}
                          onChange={(e) => setMethaneData({ ...methaneData, procedureToDetermine: e.target.value })}
                          placeholder="Include relevant literature, laboratory analyses, or other methods used."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed placeholder:text-slate-400"
                        />
                      </div>

                      {/* Methane Procedures Table */}
                      <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3">Title of Procedure</th>
                              <th className="py-2.5 px-3">Brief Description including Frequency</th>
                              <th className="py-2.5 px-3">Person in Charge</th>
                              <th className="py-2.5 px-3">Contact Email</th>
                              <th className="py-2.5 px-3">Contact Phone Number</th>
                              <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {methaneProcedures.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.title}
                                    onChange={(e) => {
                                      const copy = [...methaneProcedures];
                                      copy[idx].title = e.target.value;
                                      setMethaneProcedures(copy);
                                    }}
                                    placeholder="Enter procedure title"
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.description}
                                    onChange={(e) => {
                                      const copy = [...methaneProcedures];
                                      copy[idx].description = e.target.value;
                                      setMethaneProcedures(copy);
                                    }}
                                    placeholder="Enter description and frequency"
                                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.personInCharge}
                                    onChange={(e) => {
                                      const copy = [...methaneProcedures];
                                      copy[idx].personInCharge = e.target.value;
                                      setMethaneProcedures(copy);
                                    }}
                                    placeholder="Enter person in charge"
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="email"
                                    value={row.email}
                                    onChange={(e) => {
                                      const copy = [...methaneProcedures];
                                      copy[idx].email = e.target.value;
                                      setMethaneProcedures(copy);
                                    }}
                                    placeholder="Enter contact email"
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.phone}
                                    onChange={(e) => {
                                      const copy = [...methaneProcedures];
                                      copy[idx].phone = e.target.value;
                                      setMethaneProcedures(copy);
                                    }}
                                    placeholder="Enter phone number"
                                    className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addMethaneProcedure}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                      title="Add Procedure"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeMethaneProcedure(idx)}
                                      className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200"
                                      title="Remove Procedure"
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
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* Section 6: Source Stream */}
              {/* ========================================================================= */}
              <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#F4F6F8] border-b border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004B87]">
                    Source Stream
                  </span>
                </div>

                <div className="p-4 sm:p-5 pt-3 sm:pt-3.5 bg-white space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3">Source Stream ID</th>
                          <th className="py-2.5 px-3">Description Of Source Stream</th>
                          <th className="py-2.5 px-3">Associated Emission Source (ID)</th>
                          <th className="py-2.5 px-3">Classification Of Source Stream</th>
                          <th className="py-2.5 px-3">Level Of Source Stream Activity</th>
                          <th className="py-2.5 px-3">Unit For Source Stream Activity</th>
                          <th className="py-2.5 px-3">Type Of Fuel (If Applicable)</th>
                          <th className="py-2.5 px-3">Combustion Device / Technology</th>
                          <th className="py-2.5 px-3">Combustion Device Capacity</th>
                          <th className="py-2.5 px-3">Unit For Metric</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {sourceStreams.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.id}
                                placeholder="FC1"
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].id = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.description}
                                placeholder="Enter description"
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].description = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.associatedSource}
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].associatedSource = e.target.value;
                                  setSourceStreams(copy);
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
                              <select
                                value={row.classification}
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].classification = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select classification</option>
                                <option value="Fuel Combusted">Fuel Combusted</option>
                                <option value="Other Input">Other Input</option>
                                <option value="Output">Output</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.activityLevel}
                                placeholder="Enter activity level"
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].activityLevel = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.activityUnit}
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].activityUnit = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select unit</option>
                                <option value="MWh">MWh</option>
                                <option value="Nm³">Nm³</option>
                                <option value="t">t</option>
                                <option value="GJ">GJ</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.fuelType}
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].fuelType = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select fuel type</option>
                                <option value="Natural gas">Natural gas</option>
                                <option value="Diesel / Gas Oil">Diesel / Gas Oil</option>
                                <option value="Heavy Fuel Oil">Heavy Fuel Oil</option>
                                <option value="Petcoke">Petcoke</option>
                              </select>
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.combustionDevice}
                                placeholder="Enter combustion device"
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].combustionDevice = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={row.deviceCapacity}
                                placeholder="Enter capacity"
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].deviceCapacity = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <select
                                value={row.metricUnit}
                                onChange={(e) => {
                                  const copy = [...sourceStreams];
                                  copy[idx].metricUnit = e.target.value;
                                  setSourceStreams(copy);
                                }}
                                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              >
                                <option value="">Select unit</option>
                                <option value="MW">MW</option>
                                <option value="MWth">MWth</option>
                                <option value="GJ/hr">GJ/hr</option>
                              </select>
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={addSourceStream}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeSourceStream(idx)}
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
          )}


        </div>
      </div>

      {/* 3. FIXED BOTTOM ACTION BUTTONS */}
      <div className="flex-shrink-0 pt-3 pb-1 flex items-center justify-end gap-3">
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Save</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {isEadReviewerOrAdmin &&
          (workflowState.monitoringPlanStatus === 'Submitted' ||
            workflowState.monitoringPlanStatus === 'Under EAD Review' ||
            workflowState.monitoringPlanStatus === 'Draft' ||
            workflowState.monitoringPlanStatus === 'Correction Required') && (
            <>
              <button
                onClick={() => {
                  setMonitoringPlanStatus('Correction Required');
                  setNoticeMessage('Monitoring Plan Returned for Correction to Facility Operator.');
                  setIsSavedNotice(true);
                  setTimeout(() => setIsSavedNotice(false), 3000);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Return Monitoring Plan to facility operator for correction"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Return for Correction</span>
              </button>

              <button
                onClick={() => {
                  setMonitoringPlanStatus('Approved');
                  setNoticeMessage('Monitoring Plan Approved & Accepted by EAD! Annual Emission Data is now accessible.');
                  setIsSavedNotice(true);
                  setTimeout(() => setIsSavedNotice(false), 3500);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                title="Approve Monitoring Plan and unlock Annual Emission Data"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>EAD Approve Plan</span>
              </button>
            </>
          )}

        {(workflowState.monitoringPlanStatus === 'Approved' ||
          workflowState.monitoringPlanStatus === 'Accepted' ||
          workflowState.monitoringPlanStatus === 'Approved / Accepted' ||
          workflowState.monitoringPlanStatus === 'Active') && (
          <button
            onClick={() => setActiveView('annual-emission-data')}
            className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>Go to Annual Emission Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {isFacilityOperator && (
          <button
            onClick={() => {
              handleSave();
              const isResubmit = workflowState.monitoringPlanStatus === 'Correction Required';
              setMonitoringPlanStatus('Submitted');
              setNoticeMessage(isResubmit ? 'Monitoring Plan Resubmitted! Forwarding for EAD Review...' : 'Monitoring Plan Submitted! Forwarding for EAD Review...');
              setIsSavedNotice(true);
              setTimeout(() => {
                setMonitoringPlanStatus('Under EAD Review');
                setNoticeMessage('Monitoring Plan Status: Under EAD Review');
                setTimeout(() => setIsSavedNotice(false), 3500);
              }, 1000);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer"
          >
            <span>{workflowState.monitoringPlanStatus === 'Correction Required' ? 'Resubmit Monitoring Plan' : 'Submit Monitoring Plan'}</span>
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
