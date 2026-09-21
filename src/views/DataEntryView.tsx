import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Plus,
  X,
  Bookmark,
  Calendar,
  ChevronDown,
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
  Edit,
  ArrowLeft,
  Search,
  Filter,
  Check,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
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
    facilities,
    setActiveFacilityId,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (Edit Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Table Search & Filter State
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [yearFilter, setYearFilter] = useState<string>('ALL');

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Data Saved Successfully!');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Facility Monitoring Plan Records Registry
  const [facilityPlans, setFacilityPlans] = useState<Record<string, any>>(() => ({
    'fac-0': {
      facilityName: 'Green Mountain Cement Factory',
      facilityId: 'FAC-EAD-2026-0012',
      planRef: 'MP-2026-0012',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'Draft',
      primaryApproach: 'Calculation-based (IPCC Guidelines)',
      submittedDate: '15 Jan 2026',
      updatedDate: '20 Jan 2026',
      eadCorrectionDate: null,
      description: 'Integrated cement manufacturing facility with limestone calcination rotary kilns and waste heat recovery.',
      businessSector: 'Manufacturing',
      primaryActivity: 'Manufacturing of cement / clinker',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Process A', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' },
        { id: 'P02', category: 'Primary Products', technology: 'Process B', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '50,000', capacityUnit: 't/year', actualQuantity: '100,000', actualQuantityUnit: 't/year' },
        { id: 'P03', category: 'Primary Products', technology: 'Kiln Process', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '100,000', actualQuantityUnit: 't/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '124,450',
        justification: 'Estimated based on production data and IPCC Guidelines',
      },
      emissionSources: [
        { id: 'S01', name: 'Rotary Kiln 1 & Precalciner', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '45,000', energyRelated: 'No', processEmissions: 'No', methodology: 'Calculation-based' },
        { id: 'S02', name: 'Clinker Cooler System', associatedProduct: 'P02', gasTypes: 'CO₂', totalEmissions: '35,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Measurement-based' },
        { id: 'S03', name: 'Raw Material Grinding Mill', associatedProduct: 'P03', gasTypes: 'CO₂', totalEmissions: '12,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Fall-back' },
      ],
      methaneData: {
        hasMethaneEmissions: false,
        annualVolume: '',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: '',
        keySourcesAtInstallation: '',
        procedureToDetermine: '',
      },
      methaneProcedures: [
        { id: '1', title: 'LDAR', description: 'Semi-annual leak inspection', personInCharge: 'Ahmed Al Mansoori', email: 'ahmed@gmcf.ae', phone: '+971 50 123 4567' },
      ],
      sourceStreams: [
        { id: 'FC1', description: 'Natural Gas - Kiln Primary Burner', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '10,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
        { id: 'FC2', description: 'Raw Limestone Feed', associatedSource: 'S01', classification: 'Other Input', activityLevel: '10,000', activityUnit: 't', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
        { id: 'FC3', description: 'Clinker Output Calcination', associatedSource: 'S01', classification: 'Output', activityLevel: '10,000', activityUnit: 't', fuelType: 'Natural gas', combustionDevice: 'Gas-fired heaters', deviceCapacity: '100.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Natural Gas', activityLevel: '10,000', units: 'Nm³', ncv: '38.5', emissionFactor: '56.1', oxidationFactor: '100%', conversionFactor: '1.0', source: 'IPCC Default' },
      ],
      measEquipment: [
        { name: 'Thermal Mass Flow Meter', type: 'Flow Meter', manufacturer: 'Endress+Hauser', parameter: 'Natural Gas Flow', accuracyClass: '±1.0%' },
      ],
      mitigationMeasures: [],
      remarks: 'Standard monitoring plan submitted in accordance with statutory guidelines.',
      attachedFiles: [{ name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' }],
    },
    'fac-1': {
      facilityName: 'Al Noor Industrial Facility',
      facilityId: 'FAC-EAD-2026-0891',
      planRef: 'MP-2026-0891',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'To Be Submitted',
      primaryApproach: 'Calculation-based (Tier 3)',
      submittedDate: '—',
      updatedDate: '—',
      eadCorrectionDate: '2026-06-17',
      description: 'Cogeneration Power & High-Pressure Steam Generation plant producing electricity and industrial steam for regional facilities.',
      businessSector: 'Energy',
      primaryActivity: 'Combustion of fuels in stationary equipment',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Combined Cycle Gas Turbine', energyRelated: 'Yes', processEmissions: 'No', capacity: '450,000', capacityUnit: 'MWh/year', actualQuantity: '412,000', actualQuantityUnit: 'MWh/year' },
        { id: 'P02', category: 'Primary Products', technology: 'Heat Recovery Steam Generator', energyRelated: 'Yes', processEmissions: 'No', capacity: '120,000', capacityUnit: 't/year', actualQuantity: '108,500', actualQuantityUnit: 't/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '142,800',
        justification: 'Calculated using fiscal gas meter telemetry, continuous gas chromatography, and IPCC 2006 Energy Guidelines (Tier 3 approach).',
      },
      emissionSources: [
        { id: 'S01', name: 'Gas Turbine Unit 1 (GT-01)', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '82,400', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' },
        { id: 'S02', name: 'Gas Turbine Unit 2 (GT-02)', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '60,400', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' },
      ],
      methaneData: {
        hasMethaneEmissions: true,
        annualVolume: '145',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '4,060',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: 'Ultrasonic flow meters calibrated semi-annually and component count fugitive estimation (US EPA 453/R-95-017).',
        keySourcesAtInstallation: 'Compressor shaft seals, high-pressure fuel gas control valves, and flange connections.',
        procedureToDetermine: 'Quarterly Optical Gas Imaging (OGI) inspections using FLIR GF320 cameras with Method 21 bagging verification.',
      },
      methaneProcedures: [
        { id: '1', title: 'LDAR Quarterly Sweep', description: 'Optical Gas Imaging of all Class 150 & 300 flanges and valves', personInCharge: 'Tariq Al Hammadi', email: 'tariq.h@alnoor-energy.ae', phone: '+971 50 112 3456' },
        { id: '2', title: 'Turbine Seal Integrity Check', description: 'Differential pressure telemetry across dry gas seals', personInCharge: 'Rashid Mansoor', email: 'rashid.m@alnoor-energy.ae', phone: '+971 50 223 4567' },
      ],
      sourceStreams: [
        { id: 'FC1', description: 'Pipeline Natural Gas to GT-01', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '48,500,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'GE Frame 6B Turbine', deviceCapacity: '42.0', metricUnit: 'MW' },
        { id: 'FC2', description: 'Pipeline Natural Gas to GT-02', associatedSource: 'S02', classification: 'Fuel Combusted', activityLevel: '35,600,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'GE Frame 6B Turbine', deviceCapacity: '42.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Natural Gas (Pipeline)', activityLevel: '84,100,000', units: 'Nm³', ncv: '38.5', emissionFactor: '56.1', oxidationFactor: '100%', conversionFactor: '1.0', source: 'Laboratory Gas Chromatography (ISO 6974)' },
      ],
      measEquipment: [
        { name: 'Ultrasonic Gas Flow Meter - FM01', type: 'Flow Meter', manufacturer: 'Daniel / Emerson', parameter: 'Volume Flow (Nm³)', accuracyClass: '±0.5%' },
        { name: 'Online Gas Chromatograph - GC01', type: 'Gas Analyzer', manufacturer: 'ABB NGC8206', parameter: 'Composition & NCV', accuracyClass: '±0.2%' },
      ],
      mitigationMeasures: [
        { description: 'Turbine Inlet Air Cooling System Upgrade', category: 'Energy Efficiency', scope: '1', ghg: 'CO₂', startYear: '2025', status: 'Implemented', preMeasure: '148,000', reportingReduction: '5,200', expectedReduction: '5,500', standard: 'ISO 50001', verification: 'Third-Party Verified' },
      ],
      remarks: 'Monitoring methodology adheres strictly to EAD MRV Guidelines Chapter 4 for Thermal Power Installations.',
      attachedFiles: [{ name: 'Al_Noor_Calibration_Certificates_2026.pdf', size: '4.2MB', status: 'Completed' }],
    },
    'fac-2': {
      facilityName: 'Emirates Steel Arkan Complex',
      facilityId: 'FAC-EAD-2026-0104',
      planRef: 'MP-2026-0104',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'To Be Submitted',
      primaryApproach: 'Measurement-based (CEMS)',
      submittedDate: '—',
      updatedDate: '—',
      eadCorrectionDate: '2026-06-17',
      description: 'Integrated direct reduced iron (DRI) and electric arc furnace (EAF) steel production complex.',
      businessSector: 'Industrial Processes',
      primaryActivity: 'Production of iron or steel',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Direct Reduction Plant (DRI)', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '1,200,000', capacityUnit: 't/year', actualQuantity: '1,050,000', actualQuantityUnit: 't/year' },
        { id: 'P02', category: 'Primary Products', technology: 'Electric Arc Furnace (EAF)', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '1,400,000', capacityUnit: 't/year', actualQuantity: '1,180,000', actualQuantityUnit: 't/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '1,680,000',
        justification: 'Carbon mass balance model combined with direct stack CEMS monitoring on reformer exhaust.',
      },
      emissionSources: [
        { id: 'S01', name: 'DRI Reformer Furnace Stack', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄', totalEmissions: '1,120,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Measurement-based' },
        { id: 'S02', name: 'EAF Off-Gas Extraction', associatedProduct: 'P02', gasTypes: 'CO₂', totalEmissions: '560,000', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Calculation-based' },
      ],
      methaneData: {
        hasMethaneEmissions: true,
        annualVolume: '320',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '8,960',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: 'Reformer tail gas analyzer and fugitive LDAR leak detection.',
        keySourcesAtInstallation: 'Process gas compressors and seal purging circuits.',
        procedureToDetermine: 'Continuous off-gas chromatography with monthly Method 21 screening.',
      },
      methaneProcedures: [
        { id: '1', title: 'DRI Gas Loop Inspection', description: 'Bi-weekly leak detection on high pressure reducing gas lines', personInCharge: 'Dr. Fatima Al-Hosani', email: 'fatima.hosani@emiratessteel.ae', phone: '+971 2 550 1100' },
      ],
      sourceStreams: [
        { id: 'FC1', description: 'Reforming Natural Gas', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '420,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Midrex Reformer Furnace', deviceCapacity: '350.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Natural Gas Feedstock', activityLevel: '420,000,000', units: 'Nm³', ncv: '38.2', emissionFactor: '56.1', oxidationFactor: '99.5%', conversionFactor: '1.0', source: 'ADNOC Fiscal Metering' },
      ],
      measEquipment: [
        { name: 'CEMS Stack Analyzer ST-01', type: 'CEMS', manufacturer: 'Sick AG / GM32', parameter: 'CO₂, O₂, Flow', accuracyClass: 'Class 1' },
      ],
      mitigationMeasures: [
        { description: 'CCUS Integration with Al Reyadah Carbon Capture Facility', category: 'Carbon Removal', scope: '1', ghg: 'CO₂', startYear: '2023', status: 'Implemented', preMeasure: '2,200,000', reportingReduction: '800,000', expectedReduction: '800,000', standard: 'ISO 14064-2', verification: 'Third-Party Verified' },
      ],
      remarks: 'Includes integrated CCUS transfer point compliance protocols.',
      attachedFiles: [{ name: 'DRI_CEMS_QAL1_Report.pdf', size: '6.1MB', status: 'Completed' }],
    },
    'fac-3': {
      facilityName: 'Borouge Petrochemicals Complex',
      facilityId: 'FAC-EAD-2026-0599',
      planRef: 'MP-2026-0599',
      reportingYear: '2026',
      planVersion: 'v1.2',
      status: 'Correction Required',
      primaryApproach: 'Calculation & Flaring Model',
      submittedDate: '02 Mar 2026',
      updatedDate: '11 Mar 2026',
      eadCorrectionDate: '2026-06-10',
      description: 'Polyolefin production facility including ethane cracking and polymerization units.',
      businessSector: 'Industrial Processes',
      primaryActivity: 'Combustion of fuels & cracking',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Ethane Steam Cracker', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '1,500,000', capacityUnit: 't/year', actualQuantity: '1,380,000', actualQuantityUnit: 't/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '950,000',
        justification: 'Calculated using cracking furnace fuel gas mass flow meters and flare gas continuous ultrasonic monitors.',
      },
      emissionSources: [
        { id: 'S01', name: 'Ethane Cracking Furnaces F-101 to F-108', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '820,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' },
        { id: 'S02', name: 'Elevated Process Flare Stack', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄', totalEmissions: '130,000', energyRelated: 'No', processEmissions: 'Yes', methodology: 'Measurement-based' },
      ],
      methaneData: {
        hasMethaneEmissions: true,
        annualVolume: '280',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '7,840',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: 'Continuous flare ultrasonic metering and site-wide LDAR campaign.',
        keySourcesAtInstallation: 'Polymer degasser vents and polymer recovery compressors.',
        procedureToDetermine: 'Monthly OGI scanning with toxic vapor analyzer (TVA-2020) validation.',
      },
      methaneProcedures: [
        { id: '1', title: 'Ethane Cracker Flare Header Audit', description: 'Weekly seal purging inspection on elevated flare stack', personInCharge: 'Khalid Al-Marzooqi', email: 'khalid.marzooqi@borouge.com', phone: '+971 50 445 6789' },
      ],
      sourceStreams: [
        { id: 'FC1', description: 'Fuel Gas (Methane/Hydrogen Blend)', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '280,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Cracking Furnace Burners', deviceCapacity: '480.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Off-Gas Fuel Blend', activityLevel: '280,000,000', units: 'Nm³', ncv: '36.8', emissionFactor: '54.2', oxidationFactor: '99.8%', conversionFactor: '1.0', source: 'Online Gas Chromatograph' },
      ],
      measEquipment: [
        { name: 'Flare Ultrasonic Flow Meter FM-FLARE', type: 'Flow Meter', manufacturer: 'Fluenta FGM 160', parameter: 'Flare Gas Flow & Velocity', accuracyClass: '±2.0%' },
      ],
      mitigationMeasures: [
        { description: 'Flare Gas Recovery System (FGRS) Compressor Addition', category: 'Emission Avoidance', scope: '1', ghg: 'CH₄, CO₂', startYear: '2025', status: 'Planned', preMeasure: '160,000', reportingReduction: '45,000', expectedReduction: '50,000', standard: 'API 521', verification: 'Planned Third-Party' },
      ],
      remarks: 'EAD Reviewer requested updated LDAR fugitive emissions reconciliation.',
      attachedFiles: [{ name: 'FGRS_Engineering_Design_Study.pdf', size: '5.4MB', status: 'Completed' }],
    },
    'fac-4': {
      facilityName: 'Al Taweelah Power & Desalination',
      facilityId: 'FAC-EAD-2026-0033',
      planRef: 'MP-2026-0033',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'Under EAD Review',
      primaryApproach: 'Combined Cycle Gas Telemetry',
      submittedDate: '05 Mar 2026',
      updatedDate: '08 Mar 2026',
      eadCorrectionDate: null,
      description: 'Thermal power generation and seawater thermal desalination facility.',
      businessSector: 'Energy',
      primaryActivity: 'Combustion of fuels & Desalination',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Combined Cycle Gas Turbines (CCGT)', energyRelated: 'Yes', processEmissions: 'No', capacity: '2,000,000', capacityUnit: 'MWh/year', actualQuantity: '1,890,000', actualQuantityUnit: 'MWh/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '4,820,000',
        justification: 'Fiscal pipeline natural gas meters and continuous gas analyzer calibration.',
      },
      emissionSources: [
        { id: 'S01', name: 'Turbine Block 1 Exhaust Stacks', associatedProduct: 'P01', gasTypes: 'CO₂, N₂O', totalEmissions: '2,410,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' },
        { id: 'S02', name: 'Turbine Block 2 Exhaust Stacks', associatedProduct: 'P01', gasTypes: 'CO₂, N₂O', totalEmissions: '2,410,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' },
      ],
      methaneData: {
        hasMethaneEmissions: false,
        annualVolume: '',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: '',
        keySourcesAtInstallation: '',
        procedureToDetermine: '',
      },
      methaneProcedures: [],
      sourceStreams: [
        { id: 'FC1', description: 'Pipeline Natural Gas (TAQA Grid)', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '1,200,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'MHI CCGT Turbines', deviceCapacity: '1100.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Natural Gas Pipeline', activityLevel: '1,200,000,000', units: 'Nm³', ncv: '38.4', emissionFactor: '56.1', oxidationFactor: '100%', conversionFactor: '1.0', source: 'ADNOC Gas Telemetry' },
      ],
      measEquipment: [
        { name: 'Ultrasonic Fiscal Meter FM-01', type: 'Flow Meter', manufacturer: 'KROHNE Altometer', parameter: 'Natural Gas Flow', accuracyClass: '±0.3%' },
      ],
      mitigationMeasures: [],
      remarks: 'Submitted for statutory annual MRV compliance review.',
      attachedFiles: [{ name: 'Taweelah_Gas_Metering_Verification.pdf', size: '3.9MB', status: 'Completed' }],
    },
    'fac-5': {
      facilityName: 'Tadweer Waste-to-Energy Facility',
      facilityId: 'FAC-EAD-2026-0775',
      planRef: 'MP-2026-0775',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'To Be Submitted',
      primaryApproach: 'Waste Incineration Tier 2',
      submittedDate: '—',
      updatedDate: '—',
      eadCorrectionDate: '2026-06-17',
      description: 'Municipal solid waste incineration facility with waste heat energy recovery.',
      businessSector: 'Waste',
      primaryActivity: 'Solid waste thermal treatment',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Moving Grate Incineration', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '300,000', capacityUnit: 't waste/year', actualQuantity: '280,000', actualQuantityUnit: 't waste/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '310,400',
        justification: 'Calculated using IPCC 2006 Waste Model with continuous fossil carbon fraction sorting.',
      },
      emissionSources: [
        { id: 'S01', name: 'Incinerator Line 1 & 2 Flue Gas Stack', associatedProduct: 'P01', gasTypes: 'CO₂, N₂O', totalEmissions: '310,400', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Measurement-based' },
      ],
      methaneData: {
        hasMethaneEmissions: false,
        annualVolume: '',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: '',
        keySourcesAtInstallation: '',
        procedureToDetermine: '',
      },
      methaneProcedures: [],
      sourceStreams: [
        { id: 'FC1', description: 'Municipal Solid Waste (Fossil Carbon Fraction)', associatedSource: 'S01', classification: 'Other Fuel', activityLevel: '280,000', activityUnit: 't', fuelType: 'Solid Waste', combustionDevice: 'Martin Grate Incinerator', deviceCapacity: '80.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Municipal Solid Waste', activityLevel: '280,000', units: 't', ncv: '10.5', emissionFactor: '91.7', oxidationFactor: '100%', conversionFactor: '1.0', source: 'Tadweer Waste Characterization Lab' },
      ],
      measEquipment: [
        { name: 'CEMS Flue Gas Analyzer', type: 'CEMS', manufacturer: 'ABB ACF5000', parameter: 'CO₂, CO, Flow, O₂', accuracyClass: 'Class 1' },
      ],
      mitigationMeasures: [],
      remarks: 'Approved under EAD Waste MRV statutory guidelines.',
      attachedFiles: [{ name: 'Tadweer_Waste_Sampling_Plan_2026.pdf', size: '4.8MB', status: 'Completed' }],
    },
    'fac-6': {
      facilityName: 'Gulf Chemical Solutions LLC',
      facilityId: 'FAC-EAD-2026-0619',
      planRef: 'MP-2026-0619',
      reportingYear: '2026',
      planVersion: 'v1.0',
      status: 'Rejected',
      primaryApproach: 'Calculation-based (Tier 2)',
      submittedDate: '18 Feb 2026',
      updatedDate: '24 Feb 2026',
      eadCorrectionDate: null,
      description: 'Organic solvent recovery, distillation and chemical synthesis facility.',
      businessSector: 'Chemicals',
      primaryActivity: 'Organic Solvent Refining & Distillation',
      operationalStatus: 'Operational',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Vacuum Distillation Columns', energyRelated: 'Yes', processEmissions: 'Yes', capacity: '85,000', capacityUnit: 't/year', actualQuantity: '74,000', actualQuantityUnit: 't/year' },
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '68,200',
        justification: 'Calculation based on solvent consumption mass balance.',
      },
      emissionSources: [
        { id: 'S01', name: 'Thermal Oxidizer & Distillation Boiler', associatedProduct: 'P01', gasTypes: 'CO₂, VOC', totalEmissions: '68,200', energyRelated: 'Yes', processEmissions: 'Yes', methodology: 'Calculation-based' },
      ],
      methaneData: {
        hasMethaneEmissions: false,
        annualVolume: '',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: '',
        keySourcesAtInstallation: '',
        procedureToDetermine: '',
      },
      methaneProcedures: [],
      sourceStreams: [
        { id: 'FC1', description: 'Natural Gas - Reboiler Burner', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '14,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Gas Boiler', deviceCapacity: '25.0', metricUnit: 'MW' },
      ],
      calcOtherInputs: [
        { id: 'F01', type: 'Natural Gas', activityLevel: '14,000,000', units: 'Nm³', ncv: '38.2', emissionFactor: '56.1', oxidationFactor: '100%', conversionFactor: '1.0', source: 'Fiscal Gas Meter' },
      ],
      measEquipment: [
        { name: 'Thermal Mass Flow Meter', type: 'Flow Meter', manufacturer: 'Endress+Hauser', parameter: 'Natural Gas Flow', accuracyClass: '±1.0%' },
      ],
      mitigationMeasures: [],
      remarks: 'Plan rejected due to unverified fugitive emission estimation methodologies.',
      attachedFiles: [{ name: 'EAD_Rejection_Notice.pdf', size: '1.2MB', status: 'Completed' }],
    },
  }));

  // Current active plan
  const currentPlan = facilityPlans[selectedFacilityId] || {
    facilityName: '',
    facilityId: '',
    planRef: '',
    reportingYear: '2026',
    planVersion: 'v1.0',
    status: 'Draft',
    primaryApproach: 'Calculation-based (Tier 2)',
    submittedDate: null,
    updatedDate: null,
    eadCorrectionDate: null,
    description: '',
    businessSector: 'Energy',
    primaryActivity: 'Combustion of fuels in stationary equipment',
    operationalStatus: 'Operational',
    productionStreams: [],
    emissionsEstimation: { estimatedAnnualEmissions: '', justification: '' },
    emissionSources: [],
    methaneData: { hasMethaneEmissions: false, annualVolume: '', annualVolumeUnit: 't CH₄/year', estimatedCo2e: '', estimatedCo2eUnit: 't CO₂e/year', sourceOfEstimations: '', keySourcesAtInstallation: '', procedureToDetermine: '' },
    methaneProcedures: [],
    sourceStreams: [],
    calcOtherInputs: [],
    measEquipment: [],
    mitigationMeasures: [],
    remarks: '',
    attachedFiles: [],
  };

  // Synchronize / Merge approved facilities from Context / Registration that don't have a plan yet
  useEffect(() => {
    setFacilityPlans((prev) => {
      let updated = false;
      const nextPlans = { ...prev };

      facilities.forEach((fac) => {
        const isApproved =
          fac.status === 'Registered' ||
          fac.status === 'Approved' ||
          (fac.status as unknown as string) === 'Approved / Registered' ||
          fac.status === 'Active';

        if (isApproved && !nextPlans[fac.id]) {
          updated = true;
          const numCode = (fac.facilityCode || fac.id).replace(/[^0-9]/g, '').slice(-4) || '0001';
          nextPlans[fac.id] = {
            facilityName: fac.name,
            facilityId: fac.facilityCode || `FAC-EAD-2026-${numCode}`,
            planRef: `MP-2026-${numCode}`,
            reportingYear: '2026',
            planVersion: 'v1.0',
            status: 'To Be Submitted',
            primaryApproach: '—',
            submittedDate: '—',
            updatedDate: '—',
            eadCorrectionDate: '2026-06-17',
            description: fac.primaryActivity || 'Facility statutory monitoring plan.',
            businessSector: fac.sector || 'Energy',
            primaryActivity: fac.primaryActivity || '',
            operationalStatus: 'Operational',
            productionStreams: [],
            emissionsEstimation: { estimatedAnnualEmissions: '', justification: '' },
            emissionSources: [],
            methaneData: { hasMethaneEmissions: false, annualVolume: '', annualVolumeUnit: 't CH₄/year', estimatedCo2e: '', estimatedCo2eUnit: 't CO₂e/year', sourceOfEstimations: '', keySourcesAtInstallation: '', procedureToDetermine: '' },
            methaneProcedures: [],
            sourceStreams: [],
            calcOtherInputs: [],
            measEquipment: [],
            mitigationMeasures: [],
            remarks: '',
            attachedFiles: [],
          };
        }
      });

      return updated ? nextPlans : prev;
    });
  }, [facilities]);

  // Calculate Submission / Correction Deadline Countdown Helper
  const getCorrectionDeadlineInfo = (deadlineDateStr: string | null, status: string) => {
    if (status === 'To Be Submitted') {
      const targetDeadlineStr = deadlineDateStr || '2026-06-17';
      const deadline = new Date(targetDeadlineStr);
      const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { text: 'Overdue', isOverdue: true, daysRemaining: diffDays, deadlineStr: targetDeadlineStr };
      }
      return {
        text: `Due: ${targetDeadlineStr} (${diffDays} days left)`,
        isOverdue: false,
        daysRemaining: diffDays,
        deadlineStr: targetDeadlineStr,
      };
    }

    if ((status !== 'Correction Required' && status !== 'Reverted') || !deadlineDateStr) {
      return { text: '—', isOverdue: false, daysRemaining: null };
    }
    const deadline = new Date(deadlineDateStr);
    const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', isOverdue: true, daysRemaining: diffDays, deadlineStr: deadlineDateStr };
    }
    return {
      text: `Due: ${deadlineDateStr} (${diffDays} days left)`,
      isOverdue: false,
      daysRemaining: diffDays,
      deadlineStr: deadlineDateStr,
    };
  };

  // Filtered Facilities for Overview Table
  const filteredTableList = useMemo(() => {
    return Object.entries(facilityPlans).filter(([facId, plan]) => {
      const matchesSearch =
        (plan.facilityName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.facilityId || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.planRef || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.primaryApproach || plan.primaryActivity || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (plan.businessSector || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'To Be Submitted' && plan.status === 'To Be Submitted') ||
        (statusFilter === 'Approved' && (plan.status === 'Approved' || plan.status === 'Approved / Active' || plan.status === 'Active')) ||
        (statusFilter === 'Reverted' && (plan.status === 'Correction Required' || plan.status === 'Reverted' || plan.status.includes('Correction') || plan.status.includes('Reverted'))) ||
        (statusFilter === 'Correction Required' && (plan.status === 'Correction Required' || plan.status === 'Reverted' || plan.status.includes('Correction') || plan.status.includes('Reverted'))) ||
        (statusFilter === 'Rejected' && (plan.status === 'Rejected' || plan.status.includes('Reject'))) ||
        (plan.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchesYear =
        yearFilter === 'ALL' ||
        plan.reportingYear === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [facilityPlans, tableSearchTerm, statusFilter, yearFilter]);

  // Overview Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const totalPages = Math.ceil(filteredTableList.length / itemsPerPage) || 1;

  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTableList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTableList, currentPage, itemsPerPage]);

  // Handle Edit Action
  const handleEditFacilityPlan = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    setViewMode('form');
  };

  // Handle View Action
  const handleViewFacilityPlan = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);
    setViewMode('view');
  };

  // Handle Create Monitoring Plan for Approved Facility in 'To Be Submitted' State
  const handleCreatePlanForFacility = (facId: string) => {
    setSelectedFacilityId(facId);
    setActiveFacilityId(facId);

    setFacilityPlans((prev) => {
      const existing = prev[facId];
      if (!existing || existing.status === 'To Be Submitted') {
        const fac = facilities.find((f) => f.id === facId);
        const facName = existing?.facilityName || fac?.name || 'New Facility';
        const facCode = existing?.facilityId || fac?.facilityCode || `FAC-EAD-2026-${facId.replace(/[^0-9]/g, '').padStart(4, '0')}`;
        const numCode = facCode.replace(/[^0-9]/g, '').slice(-4) || '0001';

        return {
          ...prev,
          [facId]: {
            facilityName: facName,
            facilityId: facCode,
            planRef: `MP-2026-${numCode}`,
            reportingYear: '2026',
            planVersion: 'v1.0',
            status: 'Draft',
            primaryApproach: 'Calculation-based (Tier 2)',
            submittedDate: '—',
            updatedDate: '—',
            eadCorrectionDate: null,
            description: existing?.description || fac?.primaryActivity || 'Facility statutory monitoring plan.',
            businessSector: existing?.businessSector || fac?.sector || 'Energy',
            primaryActivity: existing?.primaryActivity || fac?.primaryActivity || 'Combustion of fuels in stationary equipment',
            operationalStatus: 'Operational',
            productionStreams: [
              {
                id: 'P01',
                category: 'Primary Products',
                technology: 'Standard Process Unit',
                energyRelated: 'Yes',
                processEmissions: 'No',
                capacity: '100,000',
                capacityUnit: 't/year',
                actualQuantity: '85,000',
                actualQuantityUnit: 't/year',
              },
            ],
            emissionsEstimation: {
              estimatedAnnualEmissions: '50,000',
              justification: 'Calculated using fuel consumption records and standard IPCC emissions factors.',
            },
            emissionSources: [
              {
                id: 'S01',
                name: 'Main Boiler / Combustion Unit',
                associatedProduct: 'P01',
                gasTypes: 'CO₂, CH₄, N₂O',
                totalEmissions: '50,000',
                energyRelated: 'Yes',
                processEmissions: 'No',
                methodology: 'Calculation-based',
              },
            ],
            methaneData: {
              hasMethaneEmissions: false,
              annualVolume: '',
              annualVolumeUnit: 't CH₄/year',
              estimatedCo2e: '',
              estimatedCo2eUnit: 't CO₂e/year',
              sourceOfEstimations: '',
              keySourcesAtInstallation: '',
              procedureToDetermine: '',
            },
            methaneProcedures: [],
            sourceStreams: [
              {
                id: 'FC1',
                description: 'Natural Gas Feed',
                associatedSource: 'S01',
                classification: 'Fuel Combusted',
                activityLevel: '25,000,000',
                activityUnit: 'Nm³',
                fuelType: 'Natural gas',
                combustionDevice: 'Industrial Boiler',
                deviceCapacity: '35.0',
                metricUnit: 'MW',
              },
            ],
            calcOtherInputs: [
              {
                id: 'F01',
                type: 'Natural Gas',
                activityLevel: '25,000,000',
                units: 'Nm³',
                ncv: '38.5',
                emissionFactor: '56.1',
                oxidationFactor: '100%',
                conversionFactor: '1.0',
                source: 'Fiscal Gas Meter',
              },
            ],
            measEquipment: [
              {
                name: 'Fiscal Flow Meter',
                type: 'Flow Meter',
                manufacturer: 'ABB / Emerson',
                parameter: 'Gas Flow',
                accuracyClass: '±1.0%',
              },
            ],
            mitigationMeasures: [],
            remarks: 'Initial monitoring plan drafted for EAD regulatory approval.',
            attachedFiles: [],
          },
        };
      }
      return prev;
    });

    setViewMode('form');
  };

  // Update field in current active plan
  const updateCurrentPlan = (updater: (prev: any) => any) => {
    setFacilityPlans((prev) => {
      const existing = prev[selectedFacilityId] || currentPlan;
      return {
        ...prev,
        [selectedFacilityId]: updater(existing),
      };
    });
  };

  const handleSave = () => {
    setIsSavedNotice(true);
    setNoticeMessage('Monitoring Plan Changes Saved!');
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      updateCurrentPlan((plan) => ({
        ...plan,
        attachedFiles: [...(plan.attachedFiles || []), ...newFiles],
      }));
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  // =========================================================================
  // 1. OVERVIEW TABLE VIEW (viewMode === 'table')
  // =========================================================================
  if (viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Add Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-3 pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight whitespace-nowrap">
              Monitoring Plan
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Statutory Monitoring Methodologies, Emission Sources & QA/QC Plans Register
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by facility, ref..."
                value={tableSearchTerm}
                onChange={(e) => {
                  setTableSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all font-medium shadow-xs"
              />
              {tableSearchTerm && (
                <button
                  onClick={() => {
                    setTableSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="To Be Submitted">To Be Submitted</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Under EAD Review">Under EAD Review</option>
                <option value="Approved">Approved</option>
                <option value="Reverted">Reverted (Correction Required)</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#004B87]/20 focus:border-[#004B87] transition-all cursor-pointer"
              >
                <option value="ALL">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL' || yearFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setYearFilter('ALL');
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Level 1 Card Container with All Facilities Table & Pagination */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Inset Container with Padding and Rounded Border */}
          <div className="p-3 sm:p-3.5 flex-1 min-h-0 flex flex-col justify-between">
            <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#E9F1F8] text-slate-700 font-semibold text-xs border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                    <th className="py-2.5 px-2.5 w-10 text-center">#</th>
                    <th className="py-2.5 px-2.5 w-44 max-w-[180px]">Facility Name</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Facility ID</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap text-left">Applicable Year</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Primary Monitoring Approach</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Submitted Date</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Updated Date</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap text-left">Status</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Correction Deadline</th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">Version</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedPlans.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-400 font-semibold">
                        No monitoring plan records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedPlans.map(([facId, plan], idx) => {
                      const deadlineInfo = getCorrectionDeadlineInfo(plan.eadCorrectionDate, plan.status);
                      const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                      return (
                        <tr
                          key={facId}
                          className="hover:bg-slate-50/80 transition-colors group cursor-default"
                        >
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-400">
                            {rowNumber}
                          </td>

                          {/* Facility Name */}
                          <td className="py-2.5 px-2.5 font-semibold text-slate-800 w-44 max-w-[180px] leading-snug">
                            <span>{plan.facilityName}</span>
                          </td>

                          {/* Facility ID */}
                          <td className="py-2.5 px-2.5 font-mono text-[#004B87] font-semibold whitespace-nowrap">
                            {plan.facilityId || '—'}
                          </td>

                          {/* Applicable Year */}
                          <td className="py-2.5 px-2.5 text-left font-semibold text-slate-700 whitespace-nowrap">
                            {plan.reportingYear || '2026'}
                          </td>

                          {/* Primary Monitoring Approach */}
                          <td className="py-2.5 px-2.5 text-slate-600 leading-snug">
                            <span>{plan.primaryApproach || plan.primaryActivity || 'Calculation-based (Tier 3)'}</span>
                          </td>

                          {/* Submitted Date */}
                          <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                            {plan.submittedDate && plan.submittedDate !== '—' ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{plan.submittedDate}</span>
                              </div>
                            ) : (
                              <span>—</span>
                            )}
                          </td>

                          {/* Updated Date */}
                          <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                            {plan.updatedDate && plan.updatedDate !== '—' ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{plan.updatedDate}</span>
                              </div>
                            ) : (
                              <span>—</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-2.5 text-left whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-block ${
                                plan.status === 'Approved' || plan.status === 'Approved / Active' || plan.status === 'Active'
                                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60 font-bold'
                                  : plan.status === 'Submitted' || plan.status === 'Under EAD Review'
                                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 font-bold'
                                  : plan.status === 'To Be Submitted'
                                  ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-blue-200/80 font-bold'
                                  : plan.status === 'Correction Required' || plan.status === 'Reverted'
                                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                                  : plan.status === 'Rejected'
                                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                              }`}
                            >
                              {plan.status}
                            </span>
                          </td>

                          {/* Submission / Correction Deadline */}
                          <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-600">
                            {(plan.status === 'Correction Required' || plan.status === 'To Be Submitted') && deadlineInfo.daysRemaining !== null ? (
                              <div className="flex items-start gap-1.5">
                                <Calendar className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.status === 'To Be Submitted' ? 'text-blue-600' : 'text-amber-600'}`} />
                                <div className="flex flex-col leading-tight">
                                  <span className="font-semibold text-slate-800 text-[11px]">Due: {deadlineInfo.deadlineStr}</span>
                                  <span className={`text-[10px] font-medium ${deadlineInfo.isOverdue ? 'text-rose-600 font-bold' : plan.status === 'To Be Submitted' ? 'text-blue-700 font-bold' : 'text-amber-700 font-bold'}`}>
                                    {deadlineInfo.isOverdue
                                      ? `Overdue (${Math.abs(deadlineInfo.daysRemaining)} days late)`
                                      : `(${deadlineInfo.daysRemaining} days left)`}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 font-medium pl-2">—</span>
                            )}
                          </td>

                          {/* Version */}
                          <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {plan.planVersion || 'v1.0'}
                            </span>
                          </td>

                          {/* Actions: "Create Monitoring Plan" button for 'To Be Submitted', or Eye View & Edit Icons */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            {plan.status === 'To Be Submitted' ? (
                              <button
                                onClick={() => handleCreatePlanForFacility(facId)}
                                className="px-2.5 py-1 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer whitespace-nowrap ml-auto active:scale-95"
                                title="Create Plan for this facility"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create Plan</span>
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleViewFacilityPlan(facId)}
                                  title="View Monitoring Plan Details"
                                  className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleEditFacilityPlan(facId)}
                                  title="Edit Monitoring Plan"
                                  className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination & Counter Footer */}
          <div className="p-2.5 sm:p-3 bg-[#F8FAFC] border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>
                Showing <span className="font-bold text-slate-800">{filteredTableList.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredTableList.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filteredTableList.length}</span> monitoring plans
              </span>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#004B87] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. READ-ONLY VIEW INSPECTOR (viewMode === 'view')
  // =========================================================================
  if (viewMode === 'view') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Action Header */}
        <div className="flex-shrink-0 pb-3.5 pt-1 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setViewMode('table')}
                className="p-1 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title="Back to Overview"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
                {currentPlan.facilityName || 'Facility'} — Monitoring Plan (Read-Only)
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentPlan.status === 'Approved' || currentPlan.status === 'Approved / Active' || currentPlan.status === 'Active'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                    : currentPlan.status === 'Submitted' || currentPlan.status === 'Under EAD Review'
                    ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                    : currentPlan.status === 'Correction Required' || currentPlan.status === 'Reverted'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                    : currentPlan.status === 'Rejected'
                    ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {currentPlan.status || 'Draft'}
              </span>

              {currentPlan.facilityId && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200 flex items-center gap-1">
                  <span>Facility ID:</span>
                  <span>{currentPlan.facilityId}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              {currentPlan.facilityName || 'New Facility'} ({currentPlan.facilityId || 'N/A'}) • Reporting Year: {currentPlan.reportingYear || '2026'} • Version: {currentPlan.planVersion || 'v1.0'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('form')}
              className="px-4 py-1.5 bg-[#004B87] text-white rounded-xl text-xs font-bold hover:bg-[#003a6b] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Plan</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-y-auto p-5 space-y-6 text-xs no-scrollbar">
          {/* Section 1: Facility Overview */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Facility Overview</span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="block text-slate-500 font-medium text-[11px] mb-1">Facility Name</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block">{currentPlan.facilityName || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px] mb-1">Facility ID</span>
                <span className="font-semibold font-mono text-[#004B87] bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block">{currentPlan.facilityId || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px] mb-1">Primary Business Sector</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block">{currentPlan.businessSector || '—'}</span>
              </div>
              <div>
                <span className="block text-slate-500 font-medium text-[11px] mb-1">Primary Activity</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 block">{currentPlan.primaryActivity || '—'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Production Streams */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Primary Production Streams</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Product ID">Product ID</th>
                      <th className="py-2.5 px-3 min-w-[155px]" title="Product Category">Product Category</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Production Technology/Process">Production Technology/Process</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity">Production Capacity</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity Unit">Production Capacity Unit</th>
                      <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity">Actual Production Quantity</th>
                      <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity Unit">Actual Production Quantity Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.productionStreams.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-[#004B87]" title={row.id}>{row.id}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.category}>{row.category}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.technology}>{row.technology}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.energyRelated}>{row.energyRelated}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.processEmissions}>{row.processEmissions}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.capacity}>{row.capacity}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.capacityUnit}>{row.capacityUnit}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.actualQuantity}>{row.actualQuantity}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.actualQuantityUnit}>{row.actualQuantityUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Emissions Estimation */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Emissions Estimation</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="block text-slate-700 font-semibold mb-1.5" title="Estimated Annual Emissions (tCO₂e)">Estimated Annual Emissions (tCO₂e)</span>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-mono font-bold" title={currentPlan.emissionsEstimation.estimatedAnnualEmissions}>
                    {currentPlan.emissionsEstimation.estimatedAnnualEmissions}
                  </div>
                </div>
              </div>
              <div>
                <span className="block text-slate-700 font-semibold mb-1.5" title="Justification for the estimated value">Justification for the estimated value</span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 leading-relaxed" title={currentPlan.emissionsEstimation.justification}>
                  {currentPlan.emissionsEstimation.justification}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Emission Sources */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Emission Sources</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Source ID">Source ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Emission Source (Name, Description)">Emission Source (Name, Description)</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Product (ID)">Associated Product (ID)</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Types Of Gas(es) Emitted">Types Of Gas(es) Emitted</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Total Emissions From Source (T CO2e)">Total Emissions From Source (T CO2e)</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[160px]" title="Methodology For Determining...">Methodology For Determining...</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.emissionSources.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-[#004B87]" title={row.id}>{row.id}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.name}>{row.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.associatedProduct}>{row.associatedProduct}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.gasTypes}>{row.gasTypes}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900" title={row.totalEmissions}>{row.totalEmissions}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.energyRelated}>{row.energyRelated}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.processEmissions}>{row.processEmissions}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.methodology}>{row.methodology}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 5: Methane Emission */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Methane Emission</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentPlan.methaneData?.hasMethaneEmissions ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                  {currentPlan.methaneData?.hasMethaneEmissions ? 'Yes' : 'No'}
                </span>
              </div>
              {currentPlan.methaneData?.hasMethaneEmissions && (
                <div className="pt-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Annual Volume of methane emissions at site">Annual Volume of methane emissions at site</span>
                      <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-semibold flex justify-between items-center" title={`${currentPlan.methaneData.annualVolume || 'N/A'} ${currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}`}>
                        <span>{currentPlan.methaneData.annualVolume || 'N/A'}</span>
                        <span className="text-slate-500 text-[11px]">{currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Estimated CO₂e from methane emissions (100-year GWP)">Estimated CO₂e from methane emissions (100-year GWP)</span>
                      <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-semibold flex justify-between items-center" title={`${currentPlan.methaneData.estimatedCo2e || 'N/A'} ${currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}`}>
                        <span>{currentPlan.methaneData.estimatedCo2e || 'N/A'}</span>
                        <span className="text-slate-500 text-[11px]">{currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Source of estimates, including conversion factors">Source of estimates, including conversion factors</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.sourceOfEstimations || '—'}>
                      {currentPlan.methaneData.sourceOfEstimations || '—'}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Key methane emission sources at the installation">Key methane emission sources at the installation</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.keySourcesAtInstallation || '—'}>
                      {currentPlan.methaneData.keySourcesAtInstallation || '—'}
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium text-[11px] mb-1" title="Procedures used to determine / estimate the quantity of methane emitted">Procedures used to determine / estimate the quantity of methane emitted</span>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed" title={currentPlan.methaneData.procedureToDetermine || '—'}>
                      {currentPlan.methaneData.procedureToDetermine || '—'}
                    </div>
                  </div>

                  {currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns pt-0">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                            <th className="py-2.5 px-3 min-w-[140px]" title="Title of Procedure">Title of Procedure</th>
                            <th className="py-2.5 px-3 min-w-[190px]" title="Brief Description including Frequency">Brief Description including Frequency</th>
                            <th className="py-2.5 px-3 min-w-[150px]" title="Person in Charge">Person in Charge</th>
                            <th className="py-2.5 px-3 min-w-[160px]" title="Contact Email">Contact Email</th>
                            <th className="py-2.5 px-3 min-w-[140px]" title="Contact Phone Number">Contact Phone Number</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {currentPlan.methaneProcedures.map((proc: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-2 px-3 font-semibold text-slate-900" title={proc.title}>{proc.title}</td>
                              <td className="py-2 px-3 text-slate-700" title={proc.description}>{proc.description}</td>
                              <td className="py-2 px-3 text-slate-900 font-medium" title={proc.personInCharge}>{proc.personInCharge}</td>
                              <td className="py-2 px-3 text-slate-600" title={proc.email}>{proc.email}</td>
                              <td className="py-2 px-3 font-mono text-slate-600" title={proc.phone}>{proc.phone}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Source Stream */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Source Stream</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[90px]" title="Source Stream ID">Source Stream ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]" title="Description Of Source Stream">Description Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Emission Source (ID)">Associated Emission Source (ID)</th>
                      <th className="py-2.5 px-3 min-w-[150px]" title="Classification Of Source Stream">Classification Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Level Of Source Stream Activity">Level Of Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Source Stream Activity">Unit For Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Type Of Fuel (If Applicable)">Type Of Fuel (If Applicable)</th>
                      <th className="py-2.5 px-3 min-w-[170px]" title="Combustion Device / Technology">Combustion Device / Technology</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Combustion Device Capacity">Combustion Device Capacity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Metric">Unit For Metric</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.sourceStreams.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-[#004B87]" title={row.id}>{row.id}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.description}>{row.description}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.associatedSource}>{row.associatedSource}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.classification}>{row.classification}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.activityLevel}>{row.activityLevel}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.activityUnit}>{row.activityUnit}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.fuelType}>{row.fuelType}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.combustionDevice || '—'}>{row.combustionDevice || '—'}</td>
                        <td className="py-2 px-3 font-mono text-slate-800" title={row.deviceCapacity || '—'}>{row.deviceCapacity || '—'}</td>
                        <td className="py-2 px-3 text-slate-800" title={row.metricUnit || '—'}>{row.metricUnit || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 7: Supporting Documents */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Supporting Documents</span>
            </div>
            <div className="p-5 text-xs">
              <label className="text-[11px] text-slate-500 font-semibold block mb-2">Attached Files</label>
              <div className="flex flex-wrap gap-2.5">
                {(currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? currentPlan.attachedFiles : [{ name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' }]).map((f: any, i: number) => (
                  <span key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span className="font-bold">{f.name}</span>
                    <span className="text-slate-400 text-[10px]">{f.size} • <span className="text-emerald-600 font-bold">{f.status || 'Completed'}</span></span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Remarks / Description */}
          <div className="pt-2 text-xs">
            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Remarks / Description</label>
            <p className="font-medium text-navy-900 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {currentPlan.remarks || 'Standard monitoring plan submitted in accordance with statutory guidelines.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. EDIT / ADD FORM VIEW (viewMode === 'form')
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Top Header Row with Title Group on Left and Facility / Year Selectors on Right */}
      <div className="flex-shrink-0 pb-3.5 pt-1 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setViewMode('table')}
              className="p-1 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Overview Table"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
              {currentPlan.facilityName ? `${currentPlan.facilityName} — Monitoring Plan` : 'Monitoring Plan — New Facility'}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                currentPlan.status === 'Approved' || currentPlan.status === 'Approved / Active' || currentPlan.status === 'Active'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : currentPlan.status === 'Submitted' || currentPlan.status === 'Under EAD Review'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : currentPlan.status === 'Correction Required' || currentPlan.status === 'Reverted'
                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                  : currentPlan.status === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {currentPlan.status || 'Draft'}
            </span>

            {currentPlan.facilityId && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200 flex items-center gap-1">
                <span>Facility ID:</span>
                <span>{currentPlan.facilityId}</span>
              </span>
            )}

            {isSavedNotice && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in ml-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{noticeMessage}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
            Production Streams, Emission Sources, Estimation Models & Source Streams
          </p>
        </div>

        {/* Facility / Plant Name & Calendar Year Dropdowns on the Right */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Facility / Plant Name</label>
            <div className="relative w-48 sm:w-56">
              <select
                value={selectedFacilityId}
                onChange={(e) => {
                  setSelectedFacilityId(e.target.value);
                  setActiveFacilityId(e.target.value);
                }}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer truncate"
              >
                {Object.entries(facilityPlans).map(([id, p]) => (
                  <option key={id} value={id}>
                    {p.facilityName || `New Facility Plan (${id})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Calendar Year</label>
            <div className="relative w-24">
              <select
                value={currentPlan.reportingYear || '2026'}
                onChange={(e) => {
                  const yr = e.target.value;
                  updateCurrentPlan((p) => ({ ...p, reportingYear: yr }));
                }}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scrollable Form Content */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2 py-1 text-xs no-scrollbar">
          {/* Section 1: Facility Overview */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Facility Overview</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Facility Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentPlan.facilityName || ''}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy-900 font-semibold focus:outline-none cursor-not-allowed shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Facility ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={currentPlan.facilityId || ''}
                      placeholder="FAC-EAD-2026-XXXX"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#004B87] font-mono font-bold focus:outline-none cursor-not-allowed shadow-xs"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Primary Business Sector</label>
                  <select
                    value={currentPlan.businessSector || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentPlan((p) => ({ ...p, businessSector: val }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                  >
                    <option value="">Select Business Sector</option>
                    <option value="Energy">Energy</option>
                    <option value="Industrial Processes">Industrial Processes</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Mining & Minerals">Mining & Minerals</option>
                    <option value="Waste">Waste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Primary Activity</label>
                  <select
                    value={currentPlan.primaryActivity || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentPlan((p) => ({ ...p, primaryActivity: val }));
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                  >
                    <option value="">Select Primary Activity</option>
                    <option value="Manufacturing of cement / clinker">Manufacturing of cement / clinker</option>
                    <option value="Combustion of fuels in stationary equipment">Combustion of fuels in stationary equipment</option>
                    <option value="Direct reduced iron & steelmaking">Direct reduced iron & steelmaking</option>
                    <option value="Petrochemical cracking & refining">Petrochemical cracking & refining</option>
                    <option value="Solid waste thermal treatment">Solid waste thermal treatment</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Production Streams */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Primary Production Streams</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Product ID">Product ID</th>
                      <th className="py-2.5 px-3 min-w-[155px]" title="Product Category">Product Category</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Production Technology/Process">Production Technology/Process</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity">Production Capacity</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Production Capacity Unit">Production Capacity Unit</th>
                      <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity">Actual Production Quantity</th>
                      <th className="py-2.5 px-3 min-w-[135px]" title="Actual Production Quantity Unit">Actual Production Quantity Unit</th>
                      <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.productionStreams.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="P01"
                            value={row.id}
                            title={row.id || 'Product ID'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].id = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.category}
                            title={row.category || 'Select category'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].category = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[145px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select category">Select category</option>
                            <option value="Primary Products" title="Primary Products">Primary Products</option>
                            <option value="Secondary Products" title="Secondary Products">Secondary Products</option>
                            <option value="By-Products" title="By-Products">By-Products</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Enter technology/process"
                            value={row.technology}
                            title={row.technology || 'Enter technology/process'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].technology = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.energyRelated}
                            title={row.energyRelated || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].energyRelated = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.processEmissions}
                            title={row.processEmissions || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].processEmissions = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Enter capacity"
                            value={row.capacity}
                            title={row.capacity ? `${row.capacity} ${row.capacityUnit || ''}` : 'Enter capacity'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].capacity = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.capacityUnit}
                            title={row.capacityUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].capacityUnit = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="t/year" title="t/year">t/year</option>
                            <option value="MWh/year" title="MWh/year">MWh/year</option>
                            <option value="t/day" title="t/day">t/day</option>
                            <option value="Nm³/year" title="Nm³/year">Nm³/year</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="Enter quantity"
                            value={row.actualQuantity}
                            title={row.actualQuantity ? `${row.actualQuantity} ${row.actualQuantityUnit || ''}` : 'Enter quantity'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].actualQuantity = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.actualQuantityUnit}
                            title={row.actualQuantityUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.productionStreams];
                                copy[idx].actualQuantityUnit = val;
                                return { ...p, productionStreams: copy };
                              });
                            }}
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="t/year" title="t/year">t/year</option>
                            <option value="MWh/year" title="MWh/year">MWh/year</option>
                            <option value="t/day" title="t/day">t/day</option>
                            <option value="Nm³/year" title="Nm³/year">Nm³/year</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextId = `P${String(currentPlan.productionStreams.length + 1).padStart(2, '0')}`;
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  productionStreams: [
                                    ...p.productionStreams,
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
                                  ],
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                              title="Add Production Stream"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  productionStreams: p.productionStreams.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                              title="Remove Production Stream"
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

          {/* Section 3: Emissions Estimation */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Emissions Estimation</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5" title="Estimated Annual Emissions (tCO₂e)">Estimated Annual Emissions (tCO₂e)</label>
                  <input
                    type="text"
                    value={currentPlan.emissionsEstimation.estimatedAnnualEmissions}
                    title={currentPlan.emissionsEstimation.estimatedAnnualEmissions || 'Estimated Annual Emissions (tCO₂e)'}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateCurrentPlan((p) => ({
                        ...p,
                        emissionsEstimation: { ...p.emissionsEstimation, estimatedAnnualEmissions: val },
                      }));
                    }}
                    placeholder="124,450"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 font-mono font-bold focus:outline-none focus:border-[#004B87] shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5" title="Justification for the estimated value">Justification for the estimated value</label>
                <textarea
                  rows={2}
                  value={currentPlan.emissionsEstimation.justification}
                  title={currentPlan.emissionsEstimation.justification || 'Justification for the estimated value'}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateCurrentPlan((p) => ({
                      ...p,
                      emissionsEstimation: { ...p.emissionsEstimation, justification: val },
                    }));
                  }}
                  placeholder="Estimated based on production data and IPCC Guidelines"
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Emission Sources */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Emission Sources</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[80px]" title="Source ID">Source ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]" title="Emission Source (Name, Description)">Emission Source (Name, Description)</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Product (ID)">Associated Product (ID)</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Types Of Gas(es) Emitted">Types Of Gas(es) Emitted</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Total Emissions From Source (T CO2e)">Total Emissions From Source (T CO2e)</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Energy Related Emissions?">Energy Related Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[125px]" title="Process Emissions?">Process Emissions?</th>
                      <th className="py-2.5 px-3 min-w-[160px]" title="Methodology For Determining...">Methodology For Determining...</th>
                      <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.emissionSources.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            placeholder="S01"
                            value={row.id}
                            title={row.id || 'Source ID'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].id = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.name}
                            title={row.name || 'Enter emission source name/description'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].name = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            placeholder="e.g. Flare System"
                            className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.associatedProduct}
                            title={row.associatedProduct || 'Select product'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].associatedProduct = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                          >
                            <option value="" title="Select product">Select...</option>
                            {currentPlan.productionStreams.map((ps: any) => (
                              <option key={ps.id} value={ps.id} title={ps.id}>{ps.id}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.gasTypes}
                            title={row.gasTypes || 'Select gas types'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].gasTypes = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select gas types">Select gas types</option>
                            <option value="CO₂" title="CO₂">CO₂</option>
                            <option value="CH₄" title="CH₄">CH₄</option>
                            <option value="N₂O" title="N₂O">N₂O</option>
                            <option value="CO₂, CH₄" title="CO₂, CH₄">CO₂, CH₄</option>
                            <option value="CO₂, CH₄, N₂O" title="CO₂, CH₄, N₂O">CO₂, CH₄, N₂O</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.totalEmissions}
                            title={row.totalEmissions ? `${row.totalEmissions} t CO₂e` : 'Enter total emissions'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].totalEmissions = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            placeholder="45,000"
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.energyRelated}
                            title={row.energyRelated || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].energyRelated = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.processEmissions}
                            title={row.processEmissions || 'Select...'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].processEmissions = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select...">Select...</option>
                            <option value="Yes" title="Yes">Yes</option>
                            <option value="No" title="No">No</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.methodology}
                            title={row.methodology || 'Select methodology'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.emissionSources];
                                copy[idx].methodology = val;
                                return { ...p, emissionSources: copy };
                              });
                            }}
                            className="w-full min-w-[155px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select methodology">Select methodology</option>
                            <option value="Calculation-based" title="Calculation-based">Calculation-based</option>
                            <option value="Measurement-based" title="Measurement-based">Measurement-based</option>
                            <option value="Fall-back" title="Fall-back">Fall-back</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextId = `S${String(currentPlan.emissionSources.length + 1).padStart(2, '0')}`;
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  emissionSources: [
                                    ...p.emissionSources,
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
                                  ],
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                              title="Add Emission Source"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  emissionSources: p.emissionSources.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                              title="Remove Emission Source"
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

          {/* Section 5: Methane Emission */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Methane Emission</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${currentPlan.methaneData?.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateCurrentPlan((p) => ({
                        ...p,
                        methaneData: { ...p.methaneData, hasMethaneEmissions: !p.methaneData?.hasMethaneEmissions },
                      }));
                    }}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${currentPlan.methaneData?.hasMethaneEmissions ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentPlan.methaneData?.hasMethaneEmissions ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className={`text-xs font-bold ${!currentPlan.methaneData?.hasMethaneEmissions ? 'text-slate-700' : 'text-slate-400'}`}>No</span>
                </div>
              </div>

              {currentPlan.methaneData?.hasMethaneEmissions && (
                <div className="pt-2 space-y-4">
                  {/* Row 1: Annual Volume & Estimated CO2e (4-column layout with 2 empty slots) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Annual Volume of methane emissions at site">Annual Volume of methane emissions at site</label>
                      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                        <input
                          type="text"
                          placeholder="If no known emissions, enter N/A"
                          value={currentPlan.methaneData.annualVolume || ''}
                          title={currentPlan.methaneData.annualVolume || 'Annual Volume of methane emissions at site'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentPlan((p) => ({
                              ...p,
                              methaneData: { ...p.methaneData, annualVolume: val },
                            }));
                          }}
                          className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                          <select
                            value={currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}
                            title={currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => ({
                                ...p,
                                methaneData: { ...p.methaneData, annualVolumeUnit: val },
                              }));
                            }}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                          >
                            <option value="t CH₄/year">t CH₄/year</option>
                            <option value="kg CH₄/year">kg CH₄/year</option>
                            <option value="m³ CH₄/year">m³ CH₄/year</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Estimated CO₂e from methane emissions (100-year GWP)">Estimated CO₂e from methane emissions (100-year GWP)</label>
                      <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                        <input
                          type="text"
                          placeholder="Use the IPCC Fifth Assessment Report (AR5) GWP-100 values"
                          value={currentPlan.methaneData.estimatedCo2e || ''}
                          title={currentPlan.methaneData.estimatedCo2e || 'Estimated CO₂e from methane emissions'}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentPlan((p) => ({
                              ...p,
                              methaneData: { ...p.methaneData, estimatedCo2e: val },
                            }));
                          }}
                          className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                          <select
                            value={currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}
                            title={currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => ({
                                ...p,
                                methaneData: { ...p.methaneData, estimatedCo2eUnit: val },
                              }));
                            }}
                            className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                          >
                            <option value="t CO₂e/year">t CO₂e/year</option>
                            <option value="kt CO₂e/year">kt CO₂e/year</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Source of estimates, including conversion factors */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Source of estimates, including conversion factors">Source of estimates, including conversion factors</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.sourceOfEstimations || ''}
                      title={currentPlan.methaneData.sourceOfEstimations || 'Source of estimates, including conversion factors'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, sourceOfEstimations: val },
                        }));
                      }}
                      placeholder="Enter the source of estimates, including conversion factors."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 3: Key methane emission sources at the installation */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Key methane emission sources at the installation">Key methane emission sources at the installation</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.keySourcesAtInstallation || ''}
                      title={currentPlan.methaneData.keySourcesAtInstallation || 'Key methane emission sources at the installation'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, keySourcesAtInstallation: val },
                        }));
                      }}
                      placeholder="Provide details of the key emission sources and, where applicable, the source stream type."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 4: Procedures used to determine / estimate the quantity of methane emitted */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Procedures used to determine / estimate the quantity of methane emitted">Procedures used to determine / estimate the quantity of methane emitted</label>
                    <textarea
                      rows={2}
                      value={currentPlan.methaneData.procedureToDetermine || ''}
                      title={currentPlan.methaneData.procedureToDetermine || 'Procedures used to determine / estimate the quantity of methane emitted'}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateCurrentPlan((p) => ({
                          ...p,
                          methaneData: { ...p.methaneData, procedureToDetermine: val },
                        }));
                      }}
                      placeholder="Include relevant literature, laboratory analyses, or other methods used."
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                    />
                  </div>

                  {/* Row 5: Procedures Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                          <th className="py-2.5 px-3 min-w-[140px]" title="Title of Procedure">Title of Procedure</th>
                          <th className="py-2.5 px-3 min-w-[190px]" title="Brief Description including Frequency">Brief Description including Frequency</th>
                          <th className="py-2.5 px-3 min-w-[150px]" title="Person in Charge">Person in Charge</th>
                          <th className="py-2.5 px-3 min-w-[160px]" title="Contact Email">Contact Email</th>
                          <th className="py-2.5 px-3 min-w-[140px]" title="Contact Phone Number">Contact Phone Number</th>
                          <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {(currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0
                          ? currentPlan.methaneProcedures
                          : [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }]
                        ).map((proc: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.title}
                                title={proc.title || 'Enter title of procedure'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].title = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. LDAR"
                                className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.description}
                                title={proc.description || 'Enter description including frequency'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].description = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. Semi-annual inspection"
                                className="w-full min-w-[180px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.personInCharge}
                                title={proc.personInCharge || 'Enter person in charge'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].personInCharge = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. Ahmed Al Mansoori"
                                className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="email"
                                value={proc.email}
                                title={proc.email || 'Enter contact email'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].email = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. ahmed@gmcf.ae"
                                className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={proc.phone}
                                title={proc.phone || 'Enter contact phone number'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateCurrentPlan((p) => {
                                    const copy = [...(p.methaneProcedures || [])];
                                    if (!copy[idx]) copy[idx] = { id: String(idx + 1) };
                                    copy[idx].phone = val;
                                    return { ...p, methaneProcedures: copy };
                                  });
                                }}
                                placeholder="e.g. +971 50 123 4567"
                                className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              {idx === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateCurrentPlan((p) => ({
                                      ...p,
                                      methaneProcedures: [
                                        ...(p.methaneProcedures || []),
                                        {
                                          id: String((p.methaneProcedures || []).length + 1),
                                          title: '',
                                          description: '',
                                          personInCharge: '',
                                          email: '',
                                          phone: '',
                                        },
                                      ],
                                    }));
                                  }}
                                  className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                                  title="Add Methane Procedure"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateCurrentPlan((p) => ({
                                      ...p,
                                      methaneProcedures: (p.methaneProcedures || []).filter((_: any, i: number) => i !== idx),
                                    }));
                                  }}
                                  className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                                  title="Remove Methane Procedure"
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

          {/* Section 6: Source Stream */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Source Stream</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                      <th className="py-2.5 px-3 min-w-[90px]" title="Source Stream ID">Source Stream ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]" title="Description Of Source Stream">Description Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Associated Emission Source (ID)">Associated Emission Source (ID)</th>
                      <th className="py-2.5 px-3 min-w-[150px]" title="Classification Of Source Stream">Classification Of Source Stream</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Level Of Source Stream Activity">Level Of Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Source Stream Activity">Unit For Source Stream Activity</th>
                      <th className="py-2.5 px-3 min-w-[140px]" title="Type Of Fuel (If Applicable)">Type Of Fuel (If Applicable)</th>
                      <th className="py-2.5 px-3 min-w-[170px]" title="Combustion Device / Technology">Combustion Device / Technology</th>
                      <th className="py-2.5 px-3 min-w-[130px]" title="Combustion Device Capacity">Combustion Device Capacity</th>
                      <th className="py-2.5 px-3 min-w-[110px]" title="Unit For Metric">Unit For Metric</th>
                      <th className="py-2.5 px-3 text-center min-w-[65px]" title="Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {currentPlan.sourceStreams.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.id}
                            title={row.id || 'Source Stream ID'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].id = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[70px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.description}
                            title={row.description || 'Enter description'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].description = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="Enter description"
                            className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.associatedSource}
                            title={row.associatedSource || 'Select source'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].associatedSource = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                          >
                            <option value="" title="Select source">Select...</option>
                            {currentPlan.emissionSources.map((es: any) => (
                              <option key={es.id} value={es.id} title={es.id}>{es.id}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.classification}
                            title={row.classification || 'Select classification'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].classification = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[145px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select classification">Select classification</option>
                            <option value="Fuel Combusted" title="Fuel Combusted">Fuel Combusted</option>
                            <option value="Other Input" title="Other Input">Other Input</option>
                            <option value="Output" title="Output">Output</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.activityLevel}
                            title={row.activityLevel ? `${row.activityLevel} ${row.activityUnit || ''}` : 'Enter activity level'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].activityLevel = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="10,000"
                            className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.activityUnit}
                            title={row.activityUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].activityUnit = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="Nm³" title="Nm³">Nm³</option>
                            <option value="t" title="t">t</option>
                            <option value="MWh" title="MWh">MWh</option>
                            <option value="GJ" title="GJ">GJ</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.fuelType}
                            title={row.fuelType || 'Select fuel type'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].fuelType = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select fuel type">Select fuel type</option>
                            <option value="Natural gas" title="Natural gas">Natural gas</option>
                            <option value="Diesel" title="Diesel">Diesel</option>
                            <option value="Heavy Fuel Oil" title="Heavy Fuel Oil">Heavy Fuel Oil</option>
                            <option value="Coal" title="Coal">Coal</option>
                            <option value="LPG" title="LPG">LPG</option>
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.combustionDevice || ''}
                            title={row.combustionDevice || 'Enter combustion device/technology'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].combustionDevice = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="Gas-fired heaters"
                            className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.deviceCapacity || ''}
                            title={row.deviceCapacity ? `${row.deviceCapacity} ${row.metricUnit || ''}` : 'Enter device capacity'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].deviceCapacity = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            placeholder="100.0"
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={row.metricUnit}
                            title={row.metricUnit || 'Select unit'}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p) => {
                                const copy = [...p.sourceStreams];
                                copy[idx].metricUnit = val;
                                return { ...p, sourceStreams: copy };
                              });
                            }}
                            className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                          >
                            <option value="" title="Select unit">Select unit</option>
                            <option value="MW" title="MW">MW</option>
                            <option value="kW" title="kW">kW</option>
                            <option value="t/h" title="t/h">t/h</option>
                            <option value="GJ/h" title="GJ/h">GJ/h</option>
                            <option value="MMBtu/hr" title="MMBtu/hr">MMBtu/hr</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          {idx === 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const nextId = `FC${currentPlan.sourceStreams.length + 1}`;
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  sourceStreams: [
                                    ...p.sourceStreams,
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
                                  ],
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-sky-50 text-[#004B87] hover:bg-[#004B87] hover:text-white flex items-center justify-center mx-auto transition-colors border border-sky-200 cursor-pointer"
                              title="Add Source Stream"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                updateCurrentPlan((p) => ({
                                  ...p,
                                  sourceStreams: p.sourceStreams.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center mx-auto transition-colors border border-rose-200 cursor-pointer"
                              title="Remove Source Stream"
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

          {/* Section 7: Supporting Documents */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Supporting Documents</span>
            </div>
            <div className="p-4 sm:p-5 text-xs space-y-3">
              <label className="block text-slate-700 font-semibold mb-1">Attach Files</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="border border-dashed border-sky-300 bg-sky-50/40 rounded-xl p-3.5 px-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-medium truncate">
                    <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <span className="truncate">Drag and drop files here or upload</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                  >
                    Upload
                  </button>
                </div>

                {(currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? currentPlan.attachedFiles : [{ name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' }]).map((file: any, idx: number) => (
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
                          <span className="text-emerald-600 font-bold">{file.status || 'Completed'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateCurrentPlan((p) => ({
                        ...p,
                        attachedFiles: (p.attachedFiles || []).filter((_: any, i: number) => i !== idx),
                      }))}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remarks / Description */}
          <div className="pt-2 text-xs">
            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Remarks / Description</label>
            <textarea
              rows={3}
              value={currentPlan.remarks || ''}
              onChange={(e) => updateCurrentPlan((p) => ({ ...p, remarks: e.target.value }))}
              placeholder="Enter remarks or statutory compliance notes for this monitoring plan..."
              className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed text-xs"
            />
          </div>
        </div>
      </div>

      {/* Role-Based Bottom Action Bar */}
      <div className="flex-shrink-0 pt-3.5 pb-2 flex items-center justify-end gap-3">
        <button
          onClick={() => setViewMode('table')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <span>Save Draft</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        {isFacilityOperator && (
          <button
            onClick={() => {
              handleSave();
              updateCurrentPlan((p) => ({
                ...p,
                status: 'Submitted',
                submittedDate: '21-Sep-2026',
              }));
              setMonitoringPlanStatus('Submitted');
              setNoticeMessage('Monitoring Plan Submitted to EAD!');
              setIsSavedNotice(true);
              setTimeout(() => setIsSavedNotice(false), 3000);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer"
          >
            <span>{currentPlan.status === 'Correction Required' ? 'Resubmit Monitoring Plan' : 'Submit Monitoring Plan'}</span>
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {isEadReviewerOrAdmin && (
          <>
            <button
              onClick={() => {
                updateCurrentPlan((p) => ({
                  ...p,
                  status: 'Correction Required',
                  eadCorrectionDate: '21-Sep-2026',
                }));
                setMonitoringPlanStatus('Correction Required');
                setNoticeMessage('Monitoring Plan Returned for Correction.');
                setIsSavedNotice(true);
                setTimeout(() => setIsSavedNotice(false), 3000);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Return for Correction</span>
            </button>

            <button
              onClick={() => {
                updateCurrentPlan((p) => ({
                  ...p,
                  status: 'Approved',
                  eadCorrectionDate: null,
                }));
                setMonitoringPlanStatus('Approved');
                setNoticeMessage('Monitoring Plan Approved by EAD!');
                setIsSavedNotice(true);
                setTimeout(() => setIsSavedNotice(false), 3000);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>EAD Approve Plan</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
