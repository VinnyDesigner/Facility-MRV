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
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

export const DataEntryView: React.FC = () => {
  const { activeFacility, setActiveView } = useMRV();

  // Top Selectors State
  const [selectedFacility, setSelectedFacility] = useState(
    activeFacility?.name || 'Green Mountain Cement Factory'
  );
  const [calendarYear, setCalendarYear] = useState('2024');
  const [tierLevel, setTierLevel] = useState('Select Tier Level');

  // Navigation Sub-Tabs
  const [activeTab, setActiveTab] = useState<
    'facility-description' | 'monitoring-plan' | 'verification-qa' | 'mitigation' | 'review-submit'
  >('facility-description');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Facility Description Form State
  const [facilityDesc, setFacilityDesc] = useState({
    description:
      'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
    businessSector: 'Energy',
    primaryActivity: 'Combustion of Fuel',
    operationalStatus: 'Operational',
  });

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
      gasTypes: 'CO₂, CH₄, N₂O',
      totalEmissions: '45,000',
      energyRelated: 'No',
      processEmissions: 'No',
      methodology: 'Calculation-based',
    },
    {
      id: 'S02',
      name: 'XX',
      associatedProduct: 'P02',
      gasTypes: 'CO₂, N₂O',
      totalEmissions: '35,000',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      methodology: 'Measurement-based',
    },
    {
      id: 'S03',
      name: 'XXX',
      associatedProduct: 'P03',
      gasTypes: 'CO₂',
      totalEmissions: '12,000',
      energyRelated: 'Yes',
      processEmissions: 'Yes',
      methodology: 'Fall-back',
    },
  ]);

  // 5. Methane Emission State
  const [methaneData, setMethaneData] = useState({
    hasMethaneEmissions: false,
    annualVolume: '1250',
    annualVolumeUnit: 't CH₄/year',
    estimatedCo2e: '31250',
    estimatedCo2eUnit: 't CO₂e/year',
    sourceOfEstimations: 'Estimated based on production data and IPCC Guidelines',
    keySourcesAtInstallation: 'Estimated based on production data and IPCC Guidelines',
    procedureToDetermine: 'Estimated based on production data and IPCC Guidelines',
    hasLdarProgram: true,
    detectionMethod: 'Optical Gas Imaging (OGI)',
    correctiveActionProcedure: 'Estimated based on production data and IPCC Guidelines',
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
      activityUnit: 'Nm³',
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
      activityUnit: 'Nm³',
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
      activityUnit: 'Nm³',
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
    const nextId = `P0${productionStreams.length + 1}`;
    setProductionStreams((prev) => [
      ...prev,
      {
        id: nextId,
        category: 'Primary Products',
        technology: 'Process Name',
        energyRelated: 'Yes',
        processEmissions: 'No',
        capacity: '50,000',
        capacityUnit: 't/year',
        actualQuantity: '45,000',
        actualQuantityUnit: 't/year',
      },
    ]);
  };

  const removeProductionStream = (index: number) => {
    setProductionStreams((prev) => prev.filter((_, i) => i !== index));
  };

  const addEmissionSource = () => {
    const nextId = `S0${emissionSources.length + 1}`;
    setEmissionSources((prev) => [
      ...prev,
      {
        id: nextId,
        name: 'New Emission Source',
        associatedProduct: 'P01',
        gasTypes: 'CO₂',
        totalEmissions: '10,000',
        energyRelated: 'Yes',
        processEmissions: 'No',
        methodology: 'Calculation-based',
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
        title: 'New Procedure',
        description: 'Periodic Inspection',
        personInCharge: 'Operations Officer',
        email: 'ops@gmcf.ae',
        phone: '+971 50 000 0000',
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
        description: 'New Stream',
        associatedSource: 'S01',
        classification: 'Fuel Combusted',
        activityLevel: '5,000',
        activityUnit: 'Nm³',
        fuelType: 'Natural gas',
        combustionDevice: 'Boiler #1',
        deviceCapacity: '50.0',
        metricUnit: 'MW',
      },
    ]);
  };

  const removeSourceStream = (index: number) => {
    setSourceStreams((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================================
  // MONITORING PLAN ACCORDIONS STATE
  // =========================================================================
  const [openMonitoringSections, setOpenMonitoringSections] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  const toggleMonitoringSection = (sec: number) => {
    setOpenMonitoringSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  // Section 1: Calculation - Based Monitoring State
  const [calcSourceStreams, setCalcSourceStreams] = useState([
    { id: 'F01', desc: 'X', estimatedEmissions: '105,000', possibleCategory: 'Major (>100 KT)', selectedCategory: 'Major' },
    { id: 'F02', desc: 'XX', estimatedEmissions: '1,200', possibleCategory: 'Minor (5-100 KT)', selectedCategory: 'Minor' },
    { id: 'F03', desc: 'XXXX', estimatedEmissions: '850', possibleCategory: 'De minimis (<5 KT)', selectedCategory: 'De minimis' },
  ]);

  const [calcTierUncertainty, setCalcTierUncertainty] = useState([
    { id: 'F01', tier: 'T3', category: 'Major', uncertaintyAchieved: '1.60', fuelStreamType: 'Commercial Standard Fuels', sourceAccuracy: 'Lab Analysis', permittedUncertainty: '±2.5%' },
    { id: 'F02', tier: 'T2', category: 'Minor', uncertaintyAchieved: '3.20', fuelStreamType: 'Alternative Fuels', sourceAccuracy: 'Meter Reading', permittedUncertainty: '±5.0%' },
    { id: 'F03', tier: 'T1', category: 'De minimis', uncertaintyAchieved: '7.00', fuelStreamType: 'Diesel', sourceAccuracy: 'Supplier Data', permittedUncertainty: '±7.5%' },
  ]);

  const [calcApproach, setCalcApproach] = useState({
    description: 'Estimated based on production data and IPCC Guidelines',
    formula: 'Estimated based on production data and IPCC Guidelines',
  });

  const [calcDetailedInfo, setCalcDetailedInfo] = useState([
    { id: 'F01', fuelStreamType: 'Natural Gas', fuelQuantity: '10,000', units: 'MWH', source: 'In - House technical data' },
    { id: 'F02', fuelStreamType: 'Alternative Fuels', fuelQuantity: '10,000', units: 'MWH', source: 'In - House technical data' },
  ]);

  const [calcOtherInputsOutputs, setCalcOtherInputsOutputs] = useState([
    { id: 'F01', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '42.3', emissionFactor: '73.3', oxidationFactor: '100%', conversionFactor: '-', source: 'IPCC' },
    { id: 'F02', type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '23.5', emissionFactor: '64.3', oxidationFactor: '75%', conversionFactor: '-', source: 'IPCC' },
  ]);

  // Section 2: Measurement - Based Monitoring State
  const [measEmissionSources, setMeasEmissionSources] = useState([
    { id: 'S01', totalEmissions: '100,000', category: 'Major (>100 KT)' },
    { id: 'S02', totalEmissions: '45,000', category: 'Minor (5-100 KT)' },
    { id: 'S03', totalEmissions: '800', category: 'De minimis (<5 KT)' },
  ]);

  const [measUncertainty, setMeasUncertainty] = useState([
    { id: 'S01', tier: 'T3', category: 'Major', uncertaintyAchieved: '1.60', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Lab Analysis', permittedUncertainty: '±2.5%' },
    { id: 'S02', tier: 'T2', category: 'Minor', uncertaintyAchieved: '3.20', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Meter Reading', permittedUncertainty: '±5.0%' },
    { id: 'S03', tier: 'T1', category: 'De minimis', uncertaintyAchieved: '7.00', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Supplier Data', permittedUncertainty: '±7.5%' },
  ]);

  const [measApproachDesc, setMeasApproachDesc] = useState('Estimated based on production data and IPCC Guidelines');

  const [measPoints, setMeasPoints] = useState([
    { id: 'M1', associatedSource: 'S01', procedures: 'X', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'CEMS Manual Rev. 4' },
    { id: 'M2', associatedSource: 'S02', procedures: 'XX', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
    { id: 'M3', associatedSource: 'S03', procedures: 'XXX', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
  ]);

  const [measEquipment, setMeasEquipment] = useState([
    { name: 'CEMS Analyzer - 01', type: 'CEMS', manufacturer: 'ABB / ACX50000', parameter: 'CO₂ , O₂', accuracyClass: 'Class A' },
    { name: 'Flow Meter - 01', type: 'Flow Meter', manufacturer: 'X', parameter: 'Flow Rate', accuracyClass: '±1%' },
    { name: 'Gas Analyzer - 01', type: 'Gas Analyzer', manufacturer: 'XX', parameter: 'CO₂', accuracyClass: '±1%' },
  ]);

  // Section 3: Fallback Approach State
  const [fallbackData, setFallbackData] = useState({
    methodologyDesc: 'Estimated based on production data and IPCC Guidelines',
    justification: 'Estimated based on production data and IPCC Guidelines',
  });

  // Monitoring Plan Add / Remove Helpers
  const addCalcSourceStream = () => {
    const nextId = `F0${calcSourceStreams.length + 1}`;
    setCalcSourceStreams((prev) => [
      ...prev,
      { id: nextId, desc: 'Stream Name', estimatedEmissions: '5,000', possibleCategory: 'Minor (5-100 KT)', selectedCategory: 'Minor' },
    ]);
  };

  const removeCalcSourceStream = (index: number) => {
    setCalcSourceStreams((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcTierUncertainty = () => {
    const nextId = `F0${calcTierUncertainty.length + 1}`;
    setCalcTierUncertainty((prev) => [
      ...prev,
      { id: nextId, tier: 'T2', category: 'Minor', uncertaintyAchieved: '2.50', fuelStreamType: 'Commercial Standard Fuels', sourceAccuracy: 'Lab Analysis', permittedUncertainty: '±5.0%' },
    ]);
  };

  const removeCalcTierUncertainty = (index: number) => {
    setCalcTierUncertainty((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcDetailedInfo = () => {
    const nextId = `F0${calcDetailedInfo.length + 1}`;
    setCalcDetailedInfo((prev) => [
      ...prev,
      { id: nextId, fuelStreamType: 'Natural Gas', fuelQuantity: '5,000', units: 'MWH', source: 'In - House technical data' },
    ]);
  };

  const removeCalcDetailedInfo = (index: number) => {
    setCalcDetailedInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const addCalcOtherInput = () => {
    const nextId = `F0${calcOtherInputsOutputs.length + 1}`;
    setCalcOtherInputsOutputs((prev) => [
      ...prev,
      { id: nextId, type: 'Crude Oil', activityLevel: '0', units: 'TJ', ncv: '30.0', emissionFactor: '70.0', oxidationFactor: '100%', conversionFactor: '-', source: 'IPCC' },
    ]);
  };

  const removeCalcOtherInput = (index: number) => {
    setCalcOtherInputsOutputs((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasEmissionSource = () => {
    const nextId = `S0${measEmissionSources.length + 1}`;
    setMeasEmissionSources((prev) => [
      ...prev,
      { id: nextId, totalEmissions: '25,000', category: 'Minor (5-100 KT)' },
    ]);
  };

  const removeMeasEmissionSource = (index: number) => {
    setMeasEmissionSources((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasUncertainty = () => {
    const nextId = `S0${measUncertainty.length + 1}`;
    setMeasUncertainty((prev) => [
      ...prev,
      { id: nextId, tier: 'T2', category: 'Minor', uncertaintyAchieved: '2.50', streamType: 'CO₂ Emission Sources', sourceAccuracy: 'Lab Analysis', permittedUncertainty: '±5.0%' },
    ]);
  };

  const removeMeasUncertainty = (index: number) => {
    setMeasUncertainty((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasPoint = () => {
    const nextId = `M${measPoints.length + 1}`;
    setMeasPoints((prev) => [
      ...prev,
      { id: nextId, associatedSource: 'S01', procedures: 'Description', relevantProcedures: 'CEMS Operation Procedure EMP-01', relevantSource: 'ISO 14181:2014' },
    ]);
  };

  const removeMeasPoint = (index: number) => {
    setMeasPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const addMeasEquipment = () => {
    setMeasEquipment((prev) => [
      ...prev,
      { name: `Analyzer - 0${prev.length + 1}`, type: 'Sensor', manufacturer: 'Model', parameter: 'Flow', accuracyClass: '±1%' },
    ]);
  };

  const removeMeasEquipment = (index: number) => {
    setMeasEquipment((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================================================
  // VERIFICATION & QA STATE
  // =========================================================================
  const [qaVerificationDesc, setQaVerificationDesc] = useState(
    'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.'
  );

  const [qaDataGaps, setQaDataGaps] = useState([
    { sourceStream: 'S05 - Flare Vent', fromDate: '01-Jan-2024', untilDate: '15-Jan-2024', description: 'CEMS downtime', estimatedEmissions: '12.40', sourceOfEstimate: 'Similar period avg' },
    { sourceStream: 'S08 - Boiler 3', fromDate: '10-Feb-2024', untilDate: '12-Feb-2024', description: 'Data logger issue', estimatedEmissions: '5.70', sourceOfEstimate: 'Fuel Consumption estimate' },
    { sourceStream: 'S12 - Compressor', fromDate: '03-Mar-2024', untilDate: '05-Mar-2024', description: 'Maintenance activity', estimatedEmissions: '1.15', sourceOfEstimate: 'Equipment capacity method' },
  ]);

  const [qaManagementResp, setQaManagementResp] = useState([
    { jobTitle: 'GHG Manager', responsibilities: 'X' },
    { jobTitle: 'Environmental Engineer', responsibilities: 'XX' },
    { jobTitle: 'Quality Assurance Officer', responsibilities: 'XX' },
  ]);

  const [qaProcedures, setQaProcedures] = useState([
    { procedureTitle: 'ETS QA/QC of MI', reference: 'EAD_QA_QC_01', responsibleDept: 'Measurement & Control', recordStorage: 'QA/QC Records' },
    { procedureTitle: 'Instrument Calibration', reference: 'QA_CAL_02', responsibleDept: 'Operations', recordStorage: 'Calibration Records' },
  ]);

  const [qaInternalReview, setQaInternalReview] = useState([
    { procedureTitle: 'ETS Data Validation', reference: 'EAD_VAL_01', responsibleDept: 'Measurement & Control', recordStorage: 'Validation Records' },
    { procedureTitle: 'Annual Internal Review', reference: 'INT_REV_02', responsibleDept: 'Compliance', recordStorage: 'Internal Audit Folder' },
  ]);

  const addQaDataGap = () => {
    setQaDataGaps((prev) => [
      ...prev,
      { sourceStream: 'S15 - Vent', fromDate: '01-Apr-2024', untilDate: '05-Apr-2024', description: 'Calibration gap', estimatedEmissions: '2.50', sourceOfEstimate: 'Standard average' },
    ]);
  };
  const removeQaDataGap = (idx: number) => setQaDataGaps((prev) => prev.filter((_, i) => i !== idx));

  const addQaManagementResp = () => {
    setQaManagementResp((prev) => [
      ...prev,
      { jobTitle: 'Operations Lead', responsibilities: 'XXX' },
    ]);
  };
  const removeQaManagementResp = (idx: number) => setQaManagementResp((prev) => prev.filter((_, i) => i !== idx));

  const addQaProcedure = () => {
    setQaProcedures((prev) => [
      ...prev,
      { procedureTitle: 'Sensor Verification', reference: 'QA_SENS_03', responsibleDept: 'Instrumentation', recordStorage: 'Maintenance Logs' },
    ]);
  };
  const removeQaProcedure = (idx: number) => setQaProcedures((prev) => prev.filter((_, i) => i !== idx));

  const addQaInternalReview = () => {
    setQaInternalReview((prev) => [
      ...prev,
      { procedureTitle: 'Semi-Annual Audit', reference: 'INT_AUDIT_03', responsibleDept: 'Sustainability', recordStorage: 'Audit Records' },
    ]);
  };
  const removeQaInternalReview = (idx: number) => setQaInternalReview((prev) => prev.filter((_, i) => i !== idx));

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
      { description: 'New Measure', category: 'Emission Reduction', scope: '1', ghg: 'CO₂', startYear: '2025', status: 'Planned', preMeasure: '1,500', reportingReduction: 'Standard', expectedReduction: 'Not verified', standard: 'IPCC', verification: 'Not verified' },
    ]);
  };
  const removeMitigationMeasure = (idx: number) => setMitigationMeasures((prev) => prev.filter((_, i) => i !== idx));

  // =========================================================================
  // REVIEW & SUBMIT STATE
  // =========================================================================
  const [declarationChecks, setDeclarationChecks] = useState({
    check1: true,
    check2: true,
    check3: true,
  });

  const [declarationForm, setDeclarationForm] = useState({
    name: 'John Doe',
    designation: 'Facility Operator',
    date: '15-Jun-2026',
  });

  const loadExampleData = () => {
    setFacilityDesc({
      description:
        'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
      businessSector: 'Energy',
      primaryActivity: 'Combustion of Fuel',
      operationalStatus: 'Operational',
    });
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
      { id: 'S01', name: 'X', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '45,000', energyRelated: 'No', processEmissions: 'No', methodology: 'Standard' },
      { id: 'S02', name: 'XX', associatedProduct: 'P02', gasTypes: 'CO₂', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Standard' },
      { id: 'S03', name: 'XXXX', associatedProduct: 'P03', gasTypes: 'CO₂', totalEmissions: '29,450', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Fall-back' },
    ]);
    setMethaneData({
      hasMethaneEmissions: false,
      annualVolume: '1250',
      annualVolumeUnit: 't CH₄/year',
      estimatedCo2e: '31250',
      estimatedCo2eUnit: 't CO₂e/year',
      sourceOfEstimations: 'Estimated based on production data and IPCC Guidelines',
      keySourcesAtInstallation: 'Estimated based on production data and IPCC Guidelines',
      procedureToDetermine: 'Estimated based on production data and IPCC Guidelines',
      hasLdarProgram: true,
      detectionMethod: 'Optical Gas Imaging (OGI)',
      correctiveActionProcedure: 'Estimated based on production data and IPCC Guidelines',
    });
    setSourceStreams([
      { id: 'FC1', description: 'X', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '10,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
      { id: 'FC2', description: 'XX', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '10,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
      { id: 'FC3', description: 'XXX', associatedSource: 'S01', classification: 'Output', activityLevel: '10,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
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
      businessSector: 'Energy',
      primaryActivity: 'Combustion of Fuel',
      operationalStatus: 'Operational',
    });
    setProductionStreams([
      { id: 'P01', category: 'Primary Products', technology: '', energyRelated: 'Yes', processEmissions: 'No', capacity: '', capacityUnit: 't/year', actualQuantity: '', actualQuantityUnit: 't/year' },
    ]);
    setEmissionsEstimation({
      estimatedAnnualEmissions: '',
      justification: '',
    });
    setEmissionSources([
      { id: 'S01', name: '', associatedProduct: 'P01', gasTypes: 'CO₂', totalEmissions: '', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Standard' },
    ]);
    setMethaneData({
      hasMethaneEmissions: false,
      annualVolume: '',
      annualVolumeUnit: 't CH₄/year',
      estimatedCo2e: '',
      estimatedCo2eUnit: 't CO₂e/year',
      sourceOfEstimations: '',
      keySourcesAtInstallation: '',
      procedureToDetermine: '',
      hasLdarProgram: false,
      detectionMethod: 'Optical Gas Imaging (OGI)',
      correctiveActionProcedure: '',
    });
    setSourceStreams([
      { id: 'FC1', description: '', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: '', deviceCapacity: '', metricUnit: 'MW' },
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
            <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
              Emission & Monitoring Plan Data Entry
            </h1>

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>{noticeMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3 Top Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility / Plant Name</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 font-medium focus:outline-none focus:border-[#004B87] shadow-sm"
            >
              <option value="Green Mountain Cement Factory">Green Mountain Cement Factory</option>
              <option value="Abu Dhabi Power Plant">Abu Dhabi Power Plant</option>
              <option value="Al Ruwais Refinery">Al Ruwais Refinery</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Calendar Year</label>
            <select
              value={calendarYear}
              onChange={(e) => setCalendarYear(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 font-medium focus:outline-none focus:border-[#004B87] shadow-sm"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tier Level</label>
            <select
              value={tierLevel}
              onChange={(e) => setTierLevel(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 font-medium focus:outline-none focus:border-[#004B87] shadow-sm"
            >
              <option value="Select Tier Level">Select Tier Level</option>
              <option value="Tier 1">Tier 1 (Default Factors)</option>
              <option value="Tier 2">Tier 2 (Country-Specific)</option>
              <option value="Tier 3">Tier 3 (Plant-Specific / CEMS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE INNER CARD FRAME (Fixed Frame with Sub-Tabs Inside) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col overflow-hidden">
        {/* Navigation Sub-Tabs (Inside Card Header) */}
        <div className="flex-shrink-0 flex items-center gap-6 border-b border-slate-100 pb-3 mb-2 text-xs">
          <button
            onClick={() => setActiveTab('facility-description')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'facility-description'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Facility Description
          </button>
          <button
            onClick={() => setActiveTab('monitoring-plan')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'monitoring-plan'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monitoring Plan
          </button>
          <button
            onClick={() => setActiveTab('verification-qa')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'verification-qa'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Verification & QA
          </button>
          <button
            onClick={() => setActiveTab('mitigation')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'mitigation'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Mitigation Measures
          </button>
          <button
            onClick={() => setActiveTab('review-submit')}
            className={`pb-2 font-bold transition-all relative cursor-pointer ${
              activeTab === 'review-submit'
                ? 'text-[#004B87] border-b-2 border-[#004B87]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Review & Submit
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto py-[10px] space-y-6 pr-2 no-scrollbar text-xs">
          {activeTab === 'facility-description' && (
            <>
              {/* ========================================================================= */}
              {/* Section 1: Facility Description */}
              {/* ========================================================================= */}
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-xs">Facility Description</label>
                  <textarea
                    rows={3}
                    value={facilityDesc.description}
                    onChange={(e) => setFacilityDesc({ ...facilityDesc, description: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Business Sector</label>
                    <select
                      value={facilityDesc.businessSector}
                      onChange={(e) => setFacilityDesc({ ...facilityDesc, businessSector: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    >
                      <option value="Energy">Energy</option>
                      <option value="IPPU">IPPU</option>
                      <option value="Waste">Waste</option>
                      <option value="Agriculture">Agriculture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Primary Activity</label>
                    <select
                      value={facilityDesc.primaryActivity}
                      onChange={(e) => setFacilityDesc({ ...facilityDesc, primaryActivity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    >
                      <option value="Combustion of Fuel">Combustion of Fuel</option>
                      <option value="Cement Manufacturing">Cement Manufacturing</option>
                      <option value="Power Generation">Power Generation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Operational Status</label>
                    <select
                      value={facilityDesc.operationalStatus}
                      onChange={(e) => setFacilityDesc({ ...facilityDesc, operationalStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                    >
                      <option value="Operational">Operational</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Decommissioned">Decommissioned</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* Section 2: Primary Production Streams */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Primary Production Streams</h4>
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
                              onChange={(e) => {
                                const copy = [...productionStreams];
                                copy[idx].id = e.target.value;
                                setProductionStreams(copy);
                              }}
                              className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
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
                              <option value="Primary Products">Primary Products</option>
                              <option value="Secondary Products">Secondary Products</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.technology}
                              onChange={(e) => {
                                const copy = [...productionStreams];
                                copy[idx].technology = e.target.value;
                                setProductionStreams(copy);
                              }}
                              className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.capacity}
                              onChange={(e) => {
                                const copy = [...productionStreams];
                                copy[idx].capacity = e.target.value;
                                setProductionStreams(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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
                              <option value="t/year">t/year</option>
                              <option value="Nm³/year">Nm³/year</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.actualQuantity}
                              onChange={(e) => {
                                const copy = [...productionStreams];
                                copy[idx].actualQuantity = e.target.value;
                                setProductionStreams(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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

              {/* ========================================================================= */}
              {/* Section 3: Emissions Estimation */}
              {/* ========================================================================= */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-bold text-[#004B87]">Emissions Estimation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Estimated Annual Emissions (tCO₂e)</label>
                    <input
                      type="text"
                      value={emissionsEstimation.estimatedAnnualEmissions}
                      onChange={(e) =>
                        setEmissionsEstimation({ ...emissionsEstimation, estimatedAnnualEmissions: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono focus:outline-none focus:border-[#004B87] shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Justification for the estimated value</label>
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

              {/* ========================================================================= */}
              {/* Section 4: Emission Sources */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Emission Sources</h4>
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
                              onChange={(e) => {
                                const copy = [...emissionSources];
                                copy[idx].id = e.target.value;
                                setEmissionSources(copy);
                              }}
                              className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => {
                                const copy = [...emissionSources];
                                copy[idx].name = e.target.value;
                                setEmissionSources(copy);
                              }}
                              className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                              <option value="CO₂, CH₄, N₂O">CO₂, CH₄, N₂O</option>
                              <option value="CO₂, N₂O">CO₂, N₂O</option>
                              <option value="CO₂">CO₂</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.totalEmissions}
                              onChange={(e) => {
                                const copy = [...emissionSources];
                                copy[idx].totalEmissions = e.target.value;
                                setEmissionSources(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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

              {/* ========================================================================= */}
              {/* Section 5: Methane Emission */}
              {/* ========================================================================= */}
              <div className="pt-2 space-y-4">
                <h4 className="text-xs font-bold text-[#004B87]">Methane Emission</h4>

                {/* Methane Occurrence Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-semibold">Do methane emissions occur at your facility?</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className={`font-semibold ${
                        methaneData.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'
                      }`}
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
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        methaneData.hasMethaneEmissions ? 'bg-[#004B87]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          methaneData.hasMethaneEmissions ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`font-semibold ${
                        !methaneData.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'
                      }`}
                    >
                      No
                    </span>
                  </div>
                </div>

                {/* Sub-fields shown ONLY when Methane Emissions is Yes */}
                {methaneData.hasMethaneEmissions && (
                  <div className="space-y-4 animate-fade-in pt-1">
                    {/* 2 Fields: Volume & CO2e */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Annual Volume of methane emission scots</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={methaneData.annualVolume}
                            onChange={(e) => setMethaneData({ ...methaneData, annualVolume: e.target.value })}
                            className="w-1/2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <select
                            value={methaneData.annualVolumeUnit}
                            onChange={(e) => setMethaneData({ ...methaneData, annualVolumeUnit: e.target.value })}
                            className="w-1/2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          >
                            <option value="t CH₄/year">t CH₄/year</option>
                            <option value="Nm³/year">Nm³/year</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Estimated CO₂e from methane emissions (100 yrs GWP)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={methaneData.estimatedCo2e}
                            onChange={(e) => setMethaneData({ ...methaneData, estimatedCo2e: e.target.value })}
                            className="w-1/2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <select
                            value={methaneData.estimatedCo2eUnit}
                            onChange={(e) => setMethaneData({ ...methaneData, estimatedCo2eUnit: e.target.value })}
                            className="w-1/2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          >
                            <option value="t CO₂e/year">t CO₂e/year</option>
                            <option value="t CH₄/year">t CH₄/year</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 3 Textareas */}
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Source of estimations / Conversion factors used</label>
                      <textarea
                        rows={2}
                        value={methaneData.sourceOfEstimations}
                        onChange={(e) => setMethaneData({ ...methaneData, sourceOfEstimations: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Key Methane emission sources at installation</label>
                      <textarea
                        rows={2}
                        value={methaneData.keySourcesAtInstallation}
                        onChange={(e) => setMethaneData({ ...methaneData, keySourcesAtInstallation: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Procedure used to determine / estimate methane emissions</label>
                      <textarea
                        rows={2}
                        value={methaneData.procedureToDetermine}
                        onChange={(e) => setMethaneData({ ...methaneData, procedureToDetermine: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>

                    {/* Methane Procedures Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3">Title Of Procedure</th>
                            <th className="py-2.5 px-3">Brief Description (including Frequency)</th>
                            <th className="py-2.5 px-3">Person In Charge</th>
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
                                  className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                                  className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                {idx === 0 ? (
                                  <button
                                    type="button"
                                    onClick={addMethaneProcedure}
                                    className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => removeMethaneProcedure(idx)}
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

                    {/* LDAR Program Available Toggle & Detection Method */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-semibold">LDAR program available at site?</span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className={`font-semibold ${methaneData.hasLdarProgram ? 'text-[#004B87]' : 'text-slate-400'}`}>
                            Yes
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setMethaneData({
                                ...methaneData,
                                hasLdarProgram: !methaneData.hasLdarProgram,
                              })
                            }
                            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              methaneData.hasLdarProgram ? 'bg-[#004B87]' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                methaneData.hasLdarProgram ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span className={`font-semibold ${!methaneData.hasLdarProgram ? 'text-[#004B87]' : 'text-slate-400'}`}>
                            No
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Detection method used</label>
                        <select
                          value={methaneData.detectionMethod}
                          onChange={(e) => setMethaneData({ ...methaneData, detectionMethod: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Optical Gas Imaging (OGI)">Optical Gas Imaging (OGI)</option>
                          <option value="EPA Method 21">EPA Method 21</option>
                          <option value="Acoustic Leak Detection">Acoustic Leak Detection</option>
                          <option value="Laser Absorption Spectroscopy">Laser Absorption Spectroscopy</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Corrective action procedure</label>
                      <textarea
                        rows={2}
                        value={methaneData.correctiveActionProcedure}
                        onChange={(e) => setMethaneData({ ...methaneData, correctiveActionProcedure: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* Section 6: Source Stream */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Source Stream</h4>
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
                              <option value="Fuel Combusted">Fuel Combusted</option>
                              <option value="Other Input">Other Input</option>
                              <option value="Output">Output</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.activityLevel}
                              onChange={(e) => {
                                const copy = [...sourceStreams];
                                copy[idx].activityLevel = e.target.value;
                                setSourceStreams(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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

              {/* ========================================================================= */}
              {/* Section 7: Remarks */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <label className="block text-slate-600 font-semibold mb-1">Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  placeholder="Write here..."
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>

              {/* ========================================================================= */}
              {/* Section 8: Supporting Documents */}
              {/* ========================================================================= */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-[#004B87] mb-2">Supporting Documents</h4>
                <label className="block text-slate-600 font-semibold mb-2">Attach Files</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Drag & Drop Upload Box */}
                  <div className="border border-dashed border-sky-300 bg-sky-50/40 rounded-xl p-3 px-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium truncate">
                      <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">Drag and drop files here or upload</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-xs transition-colors flex-shrink-0"
                    >
                      Upload
                    </button>
                  </div>

                  {/* Attached File Badge */}
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 bg-white rounded-xl p-2.5 px-3.5 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-rose-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                            <span>{file.size}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-emerald-600 font-bold">{file.status}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MONITORING PLAN (3 ACCORDIONS) */}
          {/* ========================================================================= */}
          {activeTab === 'monitoring-plan' && (
            <div className="space-y-3 animate-fade-in">
              {/* ========================================================================= */}
              {/* Accordion 1: Calculation - Based Monitoring */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleMonitoringSection(1)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800">Calculation - Based Monitoring</span>
                  {openMonitoringSections[1] ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openMonitoringSections[1] && (
                  <div className="p-6 pt-2 border-t border-slate-100 space-y-6 animate-fade-in text-xs">
                    {/* Subsection 1: Source Stream Identification & Classification */}
                    <div>
                      <h4 className="text-xs font-bold text-[#004B87] mb-3">Source Stream Identification & Classification</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3">Source Stream ID</th>
                              <th className="py-2.5 px-3">Description Of Source Stream</th>
                              <th className="py-2.5 px-3">Estimated Emissions [T CO2e / Year]</th>
                              <th className="py-2.5 px-3">Possible Category (Auto)</th>
                              <th className="py-2.5 px-3">Selected Category</th>
                              <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {calcSourceStreams.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.id}
                                    onChange={(e) => {
                                      const copy = [...calcSourceStreams];
                                      copy[idx].id = e.target.value;
                                      setCalcSourceStreams(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.desc}
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
                                    onChange={(e) => {
                                      const copy = [...calcSourceStreams];
                                      copy[idx].estimatedEmissions = e.target.value;
                                      setCalcSourceStreams(copy);
                                    }}
                                    className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    disabled
                                    value={row.possibleCategory}
                                    className="w-36 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs"
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
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="Major">Major</option>
                                    <option value="Minor">Minor</option>
                                    <option value="De minimis">De minimis</option>
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Subsection 2: Tier & Uncertainty Level */}
                    <div>
                      <h4 className="text-xs font-bold text-[#004B87] mb-3">Source Stream Identification & Classification</h4>
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
                              <th className="py-2.5 px-3">Permitted Level Of Uncertainty For Selected Tier (%)</th>
                              <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {calcTierUncertainty.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.id}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].id = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.tier}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].tier = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="T3">T3</option>
                                    <option value="T2">T2</option>
                                    <option value="T1">T1</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.category}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].category = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.uncertaintyAchieved}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].uncertaintyAchieved = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.fuelStreamType}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].fuelStreamType = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="Commercial Standard Fuels">Commercial Standard Fuels</option>
                                    <option value="Alternative Fuels">Alternative Fuels</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Natural Gas">Natural Gas</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.sourceAccuracy}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].sourceAccuracy = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="Lab Analysis">Lab Analysis</option>
                                    <option value="Meter Reading">Meter Reading</option>
                                    <option value="Supplier Data">Supplier Data</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.permittedUncertainty}
                                    onChange={(e) => {
                                      const copy = [...calcTierUncertainty];
                                      copy[idx].permittedUncertainty = e.target.value;
                                      setCalcTierUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Subsection 3: Calculation Approach */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#004B87]">Calculation Approach</h4>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Calculation approach description</label>
                        <textarea
                          rows={2}
                          value={calcApproach.description}
                          onChange={(e) => setCalcApproach({ ...calcApproach, description: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Formula description / methodology</label>
                        <textarea
                          rows={2}
                          value={calcApproach.formula}
                          onChange={(e) => setCalcApproach({ ...calcApproach, formula: e.target.value })}
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
                              <th className="py-2.5 px-3">Fuel Stream Type</th>
                              <th className="py-2.5 px-3">Fuel Quantity</th>
                              <th className="py-2.5 px-3">Units</th>
                              <th className="py-2.5 px-3">Information Source</th>
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
                                    onChange={(e) => {
                                      const copy = [...calcDetailedInfo];
                                      copy[idx].id = e.target.value;
                                      setCalcDetailedInfo(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.fuelStreamType}
                                    onChange={(e) => {
                                      const copy = [...calcDetailedInfo];
                                      copy[idx].fuelStreamType = e.target.value;
                                      setCalcDetailedInfo(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="Natural Gas">Natural Gas</option>
                                    <option value="Alternative Fuels">Alternative Fuels</option>
                                    <option value="Diesel">Diesel</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.fuelQuantity}
                                    onChange={(e) => {
                                      const copy = [...calcDetailedInfo];
                                      copy[idx].fuelQuantity = e.target.value;
                                      setCalcDetailedInfo(copy);
                                    }}
                                    className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.units}
                                    onChange={(e) => {
                                      const copy = [...calcDetailedInfo];
                                      copy[idx].units = e.target.value;
                                      setCalcDetailedInfo(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="MWH">MWH</option>
                                    <option value="GJ">GJ</option>
                                    <option value="Nm³">Nm³</option>
                                    <option value="t">t</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.source}
                                    onChange={(e) => {
                                      const copy = [...calcDetailedInfo];
                                      copy[idx].source = e.target.value;
                                      setCalcDetailedInfo(copy);
                                    }}
                                    className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
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
                                    onChange={(e) => {
                                      const copy = [...calcOtherInputsOutputs];
                                      copy[idx].id = e.target.value;
                                      setCalcOtherInputsOutputs(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
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
                                    <option value="Crude Oil">Crude Oil</option>
                                    <option value="Natural Gas">Natural Gas</option>
                                    <option value="Petcoke">Petcoke</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.activityLevel}
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
                                    <option value="TJ">TJ</option>
                                    <option value="GJ">GJ</option>
                                    <option value="MWh">MWh</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.ncv}
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
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* Accordion 2: Measurement - Based Monitoring */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleMonitoringSection(2)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800">Measurement - Based Monitoring</span>
                  {openMonitoringSections[2] ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openMonitoringSections[2] && (
                  <div className="p-6 pt-2 border-t border-slate-100 space-y-6 animate-fade-in text-xs">
                    {/* Subsection 1: Identify Relevant Measured Emission Source */}
                    <div>
                      <h4 className="text-xs font-bold text-[#004B87] mb-3">Identify Relevant Measured Emission Source</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3">Emission Source ID</th>
                              <th className="py-2.5 px-3">Total Emissions [T CO2e / Year]</th>
                              <th className="py-2.5 px-3">Category (Auto)</th>
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
                                    onChange={(e) => {
                                      const copy = [...measEmissionSources];
                                      copy[idx].id = e.target.value;
                                      setMeasEmissionSources(copy);
                                    }}
                                    className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.totalEmissions}
                                    onChange={(e) => {
                                      const copy = [...measEmissionSources];
                                      copy[idx].totalEmissions = e.target.value;
                                      setMeasEmissionSources(copy);
                                    }}
                                    className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    disabled
                                    value={row.category}
                                    className="w-48 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs"
                                  />
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
                              <th className="py-2.5 px-3">Permitted Level Of Uncertainty For Selected Tier (%)</th>
                              <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {measUncertainty.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.id}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].id = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.tier}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].tier = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="T3">T3</option>
                                    <option value="T2">T2</option>
                                    <option value="T1">T1</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.category}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].category = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.uncertaintyAchieved}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].uncertaintyAchieved = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.streamType}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].streamType = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.sourceAccuracy}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].sourceAccuracy = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  >
                                    <option value="Lab Analysis">Lab Analysis</option>
                                    <option value="Meter Reading">Meter Reading</option>
                                    <option value="Supplier Data">Supplier Data</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.permittedUncertainty}
                                    onChange={(e) => {
                                      const copy = [...measUncertainty];
                                      copy[idx].permittedUncertainty = e.target.value;
                                      setMeasUncertainty(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
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
                            ))}
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
                                    onChange={(e) => {
                                      const copy = [...measPoints];
                                      copy[idx].id = e.target.value;
                                      setMeasPoints(copy);
                                    }}
                                    className="w-16 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs"
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
                                    <option value="S01">S01</option>
                                    <option value="S02">S02</option>
                                    <option value="S03">S03</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.procedures}
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

                    {/* Subsection 5: Measurement Equipment */}
                    <div>
                      <h4 className="text-xs font-bold text-[#004B87] mb-3">Measurement Equipment</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                              <th className="py-2.5 px-3">Equipment Name</th>
                              <th className="py-2.5 px-3">Equipment Type</th>
                              <th className="py-2.5 px-3">Manufacturer/ Model</th>
                              <th className="py-2.5 px-3">Measurement Parameter</th>
                              <th className="py-2.5 px-3">Accuracy Class</th>
                              <th className="py-2.5 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {measEquipment.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.name}
                                    onChange={(e) => {
                                      const copy = [...measEquipment];
                                      copy[idx].name = e.target.value;
                                      setMeasEquipment(copy);
                                    }}
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.type}
                                    onChange={(e) => {
                                      const copy = [...measEquipment];
                                      copy[idx].type = e.target.value;
                                      setMeasEquipment(copy);
                                    }}
                                    className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.manufacturer}
                                    onChange={(e) => {
                                      const copy = [...measEquipment];
                                      copy[idx].manufacturer = e.target.value;
                                      setMeasEquipment(copy);
                                    }}
                                    className="w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.parameter}
                                    onChange={(e) => {
                                      const copy = [...measEquipment];
                                      copy[idx].parameter = e.target.value;
                                      setMeasEquipment(copy);
                                    }}
                                    className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.accuracyClass}
                                    onChange={(e) => {
                                      const copy = [...measEquipment];
                                      copy[idx].accuracyClass = e.target.value;
                                      setMeasEquipment(copy);
                                    }}
                                    className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {idx === 0 ? (
                                    <button
                                      type="button"
                                      onClick={addMeasEquipment}
                                      className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => removeMeasEquipment(idx)}
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
                )}
              </div>

              {/* ========================================================================= */}
              {/* Accordion 3: Fallback Approach */}
              {/* ========================================================================= */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-xs">
                <button
                  type="button"
                  onClick={() => toggleMonitoringSection(3)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-xs font-bold text-slate-800">Fallback Approach</span>
                  {openMonitoringSections[3] ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openMonitoringSections[3] && (
                  <div className="p-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Monitoring Methodology Description</label>
                      <textarea
                        rows={2}
                        value={fallbackData.methodologyDesc}
                        onChange={(e) => setFallbackData({ ...fallbackData, methodologyDesc: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Justification Details</label>
                      <textarea
                        rows={2}
                        value={fallbackData.justification}
                        onChange={(e) => setFallbackData({ ...fallbackData, justification: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: VERIFICATION & QA */}
          {/* ========================================================================= */}
          {activeTab === 'verification-qa' && (
            <div className="space-y-6 animate-fade-in text-xs">
              {/* Top Description Box */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Provide a detailed description of the verification methodology applied for all source streams sources
                </label>
                <textarea
                  rows={3}
                  value={qaVerificationDesc}
                  onChange={(e) => setQaVerificationDesc(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>

              {/* Section 1: Data Gaps */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Data Gaps</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3">Source Stream / ID</th>
                        <th className="py-2.5 px-3">From</th>
                        <th className="py-2.5 px-3">Until</th>
                        <th className="py-2.5 px-3">Description, Reasons And Methods</th>
                        <th className="py-2.5 px-3">Estimated Emissions (T CO2e)</th>
                        <th className="py-2.5 px-3">Source Of Estimated Emissions</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {qaDataGaps.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.sourceStream}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].sourceStream = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-32 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.fromDate}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].fromDate = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.untilDate}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].untilDate = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].description = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-44 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.estimatedEmissions}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].estimatedEmissions = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.sourceOfEstimate}
                              onChange={(e) => {
                                const copy = [...qaDataGaps];
                                copy[idx].sourceOfEstimate = e.target.value;
                                setQaDataGaps(copy);
                              }}
                              className="w-48 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addQaDataGap}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeQaDataGap(idx)}
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

              {/* Section 2: Management Responsibilities */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Management Responsibilities</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3 w-1/3">Job Title / Post</th>
                        <th className="py-2.5 px-3">Responsibilities</th>
                        <th className="py-2.5 px-3 text-center w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {qaManagementResp.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.jobTitle}
                              onChange={(e) => {
                                const copy = [...qaManagementResp];
                                copy[idx].jobTitle = e.target.value;
                                setQaManagementResp(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.responsibilities}
                              onChange={(e) => {
                                const copy = [...qaManagementResp];
                                copy[idx].responsibilities = e.target.value;
                                setQaManagementResp(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addQaManagementResp}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeQaManagementResp(idx)}
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

              {/* Section 3: Quality Assurance Procedures */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Quality Assurance Procedures</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3">Procedure Title</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3">Responsible Department</th>
                        <th className="py-2.5 px-3">Record Storage</th>
                        <th className="py-2.5 px-3 text-center w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {qaProcedures.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.procedureTitle}
                              onChange={(e) => {
                                const copy = [...qaProcedures];
                                copy[idx].procedureTitle = e.target.value;
                                setQaProcedures(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.reference}
                              onChange={(e) => {
                                const copy = [...qaProcedures];
                                copy[idx].reference = e.target.value;
                                setQaProcedures(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.responsibleDept}
                              onChange={(e) => {
                                const copy = [...qaProcedures];
                                copy[idx].responsibleDept = e.target.value;
                                setQaProcedures(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.recordStorage}
                              onChange={(e) => {
                                const copy = [...qaProcedures];
                                copy[idx].recordStorage = e.target.value;
                                setQaProcedures(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addQaProcedure}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeQaProcedure(idx)}
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

              {/* Section 4: Internal Review & Validation */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Internal Review & Validation</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3">Procedure Title</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3">Responsible Department</th>
                        <th className="py-2.5 px-3">Record Storage</th>
                        <th className="py-2.5 px-3 text-center w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {qaInternalReview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.procedureTitle}
                              onChange={(e) => {
                                const copy = [...qaInternalReview];
                                copy[idx].procedureTitle = e.target.value;
                                setQaInternalReview(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.reference}
                              onChange={(e) => {
                                const copy = [...qaInternalReview];
                                copy[idx].reference = e.target.value;
                                setQaInternalReview(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.responsibleDept}
                              onChange={(e) => {
                                const copy = [...qaInternalReview];
                                copy[idx].responsibleDept = e.target.value;
                                setQaInternalReview(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.recordStorage}
                              onChange={(e) => {
                                const copy = [...qaInternalReview];
                                copy[idx].recordStorage = e.target.value;
                                setQaInternalReview(copy);
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addQaInternalReview}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeQaInternalReview(idx)}
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
          )}

          {/* ========================================================================= */}
          {/* TAB 4: MITIGATION MEASURES */}
          {/* ========================================================================= */}
          {activeTab === 'mitigation' && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Greenhouse Gas Mitigation Measures</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                        <th className="py-2.5 px-3">Description Of Measure</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Scope (1 / 2 / 3)</th>
                        <th className="py-2.5 px-3">GHG</th>
                        <th className="py-2.5 px-3">Start Year</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Pre-Measure (TCO2e/Yr)</th>
                        <th className="py-2.5 px-3">Reporting Year Reduction (TCO2e)</th>
                        <th className="py-2.5 px-3">Expected Annual Reduction (TCO₂e)</th>
                        <th className="py-2.5 px-3">Methodology / Standard</th>
                        <th className="py-2.5 px-3">Verification</th>
                        <th className="py-2.5 px-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {mitigationMeasures.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.description}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].description = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.category}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].category = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            >
                              <option value="Emission Reduction">Emission Reduction</option>
                              <option value="Emission Avoidance">Emission Avoidance</option>
                              <option value="Carbon Removal">Carbon Removal</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.scope}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].scope = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.ghg}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].ghg = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            >
                              <option value="CO₂">CO₂</option>
                              <option value="CH₄">CH₄</option>
                              <option value="Mixed">Mixed</option>
                              <option value="N₂O">N₂O</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.startYear}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].startYear = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.status}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].status = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            >
                              <option value="Implemented">Implemented</option>
                              <option value="Planned">Planned</option>
                              <option value="Feasibility Study">Feasibility Study</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.preMeasure}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].preMeasure = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.reportingReduction}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].reportingReduction = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.expectedReduction}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].expectedReduction = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.standard}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].standard = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="w-20 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={row.verification}
                              onChange={(e) => {
                                const copy = [...mitigationMeasures];
                                copy[idx].verification = e.target.value;
                                setMitigationMeasures(copy);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                            >
                              <option value="Not verified">Not verified</option>
                              <option value="Verified">Verified</option>
                              <option value="Third - Party Verified">Third - Party Verified</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-center">
                            {idx === 0 ? (
                              <button
                                type="button"
                                onClick={addMitigationMeasure}
                                className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeMitigationMeasure(idx)}
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
          )}

          {/* ========================================================================= */}
          {/* TAB 5: REVIEW & SUBMIT */}
          {/* ========================================================================= */}
          {activeTab === 'review-submit' && (
            <div className="space-y-5 animate-fade-in text-xs">
              {/* Card 1: Final Declaration */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-[#004B87]">Final Declaration</h4>

                {/* 3 Checkboxes */}
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={declarationChecks.check1}
                      onChange={(e) =>
                        setDeclarationChecks({ ...declarationChecks, check1: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-[#004B87] border-slate-300 focus:ring-[#004B87]"
                    />
                    <span className="font-medium leading-tight">
                      I confirm that the information provided in this Monitoring Plan is complete, true and accurate to the best of my knowledge.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={declarationChecks.check2}
                      onChange={(e) =>
                        setDeclarationChecks({ ...declarationChecks, check2: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-[#004B87] border-slate-300 focus:ring-[#004B87]"
                    />
                    <span className="font-medium leading-tight">
                      I understand that submitting false or misleading information may result in regulatory action by the Environment Agency – Abu Dhabi.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={declarationChecks.check3}
                      onChange={(e) =>
                        setDeclarationChecks({ ...declarationChecks, check3: e.target.checked })
                      }
                      className="mt-0.5 w-4 h-4 rounded text-[#004B87] border-slate-300 focus:ring-[#004B87]"
                    />
                    <span className="font-medium leading-tight">
                      I agree to submit this Monitoring Plan to the Environment Agency – Abu Dhabi.
                    </span>
                  </label>
                </div>

                {/* 3 Fields: Name, Designation, Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      value={declarationForm.name}
                      onChange={(e) =>
                        setDeclarationForm({ ...declarationForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Designation</label>
                    <input
                      type="text"
                      value={declarationForm.designation}
                      onChange={(e) =>
                        setDeclarationForm({ ...declarationForm, designation: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={declarationForm.date}
                        onChange={(e) =>
                          setDeclarationForm({ ...declarationForm, date: e.target.value })
                        }
                        className="w-full px-3 py-2 pr-9 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#004B87] shadow-xs"
                      />
                      <Calendar className="w-4 h-4 text-sky-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Submission Details */}
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-bold text-[#004B87]">Submission Details</h4>

                <div className="space-y-4 pt-1">
                  {/* Row 1: 5 Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="pt-2 sm:pt-0 sm:pr-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Facility / Plant Name</div>
                      <div className="text-xs font-semibold text-slate-800">Green Mountain Cement Factory</div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:px-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Facility ID</div>
                      <div className="text-xs font-semibold text-slate-800">EAD-FAC-00123</div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:px-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Reporting Year</div>
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#004B87]" />
                        <span>2024</span>
                      </div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:px-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Version</div>
                      <div className="text-xs font-semibold text-slate-800">Version 1.0</div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:pl-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Prepared By</div>
                      <div className="text-xs font-semibold text-slate-800">John Doe</div>
                    </div>
                  </div>

                  {/* Row 2: 4 Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    <div className="pt-2 sm:pt-0 sm:pr-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Email</div>
                      <div className="text-xs font-semibold text-slate-800 truncate">john.doe@greenmountain.ae</div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:px-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Submission Date</div>
                      <div className="text-xs font-semibold text-slate-800">-</div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:px-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Current Status</div>
                      <div>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                          Draft
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 sm:pt-0 sm:pl-3">
                      <div className="text-[11px] text-slate-500 font-medium mb-1">Last Saved On</div>
                      <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#004B87]" />
                        <span>15-Jun-2026, 03:45 PM</span>
                      </div>
                    </div>
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
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Save</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={() => {
            handleSave();
            setActiveView('data-review');
          }}
          className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-xs font-bold text-white flex items-center gap-2 shadow-md transition-all"
        >
          <span>Submit</span>
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
