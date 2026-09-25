import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Bookmark,
  Send,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Info,
  Mail,
  Phone,
  ArrowRight,
  Upload,
  FileText,
  Sparkles,
  RotateCcw,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Filter,
  Check,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Layers,
  Flame,
  Gauge,
  Workflow,
} from 'lucide-react';
import { useMRV, INITIAL_FACILITY_MONITORING_PLANS } from '../context/MRVContext';
import { EmirateType, SectorType, Facility, RegistrationStatus, formatVersion } from '../types/mrv';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import { SortTriangles } from '../components/ui/SortTriangles';
import { LocationMapModal } from '../components/common/LocationMapModal';
import emptyFolderIcon from '../assets/empty-folder-icon.png';

import {
  FacilityRegistrationVersionSnapshot,
  BLANK_FACILITY_REGISTRATION,
  SAMPLE_DEMO_FACILITY_REGISTRATION,
} from '../data/facilityRegistrationsData';
export type { FacilityRegistrationVersionSnapshot };

const REGISTRATION_STEPS = [
  { id: 'facility-details', stepNumber: 1, title: 'Facility Details' },
  { id: 'contact-persons', stepNumber: 2, title: 'Contact Persons' },
  { id: 'declaration-supporting', stepNumber: 3, title: 'Declaration & Supporting Documents' },
] as const;

const MONITORING_PLAN_STEPS = [
  { id: 'facility-description', stepNumber: 1, title: 'Facility Description' },
  { id: 'emissions-estimated', stepNumber: 2, title: 'Emissions Estimated' },
  { id: 'emission-sources', stepNumber: 3, title: 'Emission Sources' },
  { id: 'methane-emission', stepNumber: 4, title: 'Methane Emission' },
  { id: 'source-stream', stepNumber: 5, title: 'Source Stream' },
  { id: 'supporting-documents-remarks', stepNumber: 6, title: 'Supporting Documents & Remarks' },
] as const;

type StepTabId = 'facility-details' | 'contact-persons' | 'declaration-supporting';

export const FacilityRegistrationView: React.FC = () => {
  const {
    activeFacility,
    updateFacility,
    setActiveView,
    workflowState,
    setRegistrationStatus,
    currentRole,
    facilities,
    setActiveFacilityId,
    deleteFacility,
    facilityMonitoringPlanStatuses,
    setFacilityMonitoringPlanStatus,
    facilityPlans,
    updateFacilityPlan,
    operatorFacilityIds,
    setOperatorFacilityIds,
    hasCreatedFirstFacility,
    setHasCreatedFirstFacility,
    facilityRegistrations,
    setFacilityRegistrations,
    facilityRegistrationHistory,
    setFacilityRegistrationHistory,
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (Edit/Add Form) | 'view' (Read-Only Inspection) | 'monitoring-plan-form' (Direct Monitoring Plan Form)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view' | 'monitoring-plan-form'>('table');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(activeFacility?.id || 'fac-1');

  // Version History State for Read-Only View
  const [selectedVersion, setSelectedVersion] = useState<string>('V1');
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState<boolean>(false);
  const versionDropdownRef = useRef<HTMLDivElement>(null);

  // Search & Filter State for Overview Table
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Search within form sections
  const [searchTerm, setSearchTerm] = useState('');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Changes Saved!');
  const [reviewerComments, setReviewerComments] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current active form data (synced with selected facility)
  const [formData, setFormData] = useState(() => {
    if (isFacilityOperator && operatorFacilityIds.length === 0) {
      return { ...SAMPLE_DEMO_FACILITY_REGISTRATION, status: 'Draft', facilityId: '' };
    }
    const id = activeFacility?.id || 'fac-1';
    return facilityRegistrations[id] || facilityRegistrations['fac-1'] || { ...BLANK_FACILITY_REGISTRATION };
  });

  // Interactive GIS Location Map Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Close version dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (versionDropdownRef.current && !versionDropdownRef.current.contains(event.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to calculate Correction Deadline countdown
  const getCorrectionDeadlineInfo = (deadlineDateStr: string | null, status: string) => {
    if ((status !== 'Correction Required' && status !== 'Reverted') || !deadlineDateStr) {
      return { text: '—', isOverdue: false, daysRemaining: null };
    }
    const deadline = new Date(deadlineDateStr);
    const now = new Date('2026-05-18T10:00:00Z'); // normalized reference date
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue (${Math.abs(diffDays)} days late)`, isOverdue: true, daysRemaining: diffDays, deadlineStr: deadlineDateStr };
    }
    return {
      text: `Due: ${deadlineDateStr} (${diffDays} days left)`,
      isOverdue: false,
      daysRemaining: diffDays,
      deadlineStr: deadlineDateStr,
    };
  };

  // Filtered facilities list for Overview Table
  const filteredFacilities = useMemo(() => {
    // For Data Provider / Facility Operator, only show their own registered facilities
    const sourceList = isFacilityOperator
      ? facilities.filter((f) => operatorFacilityIds.includes(f.id))
      : facilities;

    return sourceList.filter((fac) => {
      const reg = facilityRegistrations[fac.id] || {};
      const rawStatus = reg.status || fac.status || 'Submitted';
      const status: 'Draft' | 'Submitted' = rawStatus === 'Draft' ? 'Draft' : 'Submitted';

      const facilityDisplayName = (reg.facilityName && reg.facilityName.trim() !== '')
        ? reg.facilityName
        : (fac.name && fac.name.trim() !== '')
        ? fac.name
        : (status === 'Draft' ? 'Draft Facility' : 'Registered Facility');

      const matchesSearch =
        facilityDisplayName.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (fac.facilityCode && fac.facilityCode.toLowerCase().includes(tableSearchTerm.toLowerCase())) ||
        (reg.operatorName || fac.operatorName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (reg.primaryName || fac.contactPerson?.name || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        statusFilter === status;

      return matchesSearch && matchesStatus;
    });
  }, [facilities, facilityRegistrations, tableSearchTerm, statusFilter, isFacilityOperator, operatorFacilityIds]);

  // Overview Table Sorting & Pagination
  type FacilitySortField = 'index' | 'name' | 'id' | 'type' | 'regStatus' | 'planStatus';
  type SortDirection = 'asc' | 'desc';

  const [sortField, setSortField] = useState<FacilitySortField>('index');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: FacilitySortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Two Primary Tabs for Facility Record View:
  const [facilityRecordTab, setFacilityRecordTab] = useState<'registration' | 'monitoring-plan'>('registration');
  // Add/Edit Form Active Tab
  const [formActiveTab, setFormActiveTab] = useState<'facility-details' | 'contact-persons' | 'declaration-supporting'>('facility-details');
  // Read-Only Facility Registration Active Tab
  const [viewActiveTab, setViewActiveTab] = useState<'facility-details' | 'contact-persons' | 'declaration-supporting'>('facility-details');
  // Read-Only Monitoring Plan Active Sub-Tab
  const [viewMonitoringSubTab, setViewMonitoringSubTab] = useState<
    'facility-description' | 'emissions-estimated' | 'emission-sources' | 'methane-emission' | 'source-stream' | 'supporting-documents-remarks'
  >('facility-description');
  // Edit Monitoring Plan Active Sub-Tab
  const [editMonitoringSubTab, setEditMonitoringSubTab] = useState<
    'facility-description' | 'emissions-estimated' | 'emission-sources' | 'methane-emission' | 'source-stream' | 'supporting-documents-remarks'
  >('facility-description');
  const [isMonitoringCustomSector, setIsMonitoringCustomSector] = useState(false);
  const [isMonitoringCustomActivity, setIsMonitoringCustomActivity] = useState(false);
  const planFileInputRef = useRef<HTMLInputElement>(null);

  const sortedFacilities = useMemo(() => {
    if (sortField === 'index') {
      return sortDirection === 'asc' ? filteredFacilities : [...filteredFacilities].reverse();
    }
    return [...filteredFacilities].sort((a, b) => {
      const regA = facilityRegistrations[a.id] || {};
      const regB = facilityRegistrations[b.id] || {};
      const statusA = (regA.status || a.status || 'Approved') === 'Draft' ? 'Draft' : 'Approved';
      const statusB = (regB.status || b.status || 'Approved') === 'Draft' ? 'Draft' : 'Approved';

      const nameA = ((regA.facilityName && regA.facilityName.trim() !== '') ? regA.facilityName : (a.name || '')).toLowerCase();
      const nameB = ((regB.facilityName && regB.facilityName.trim() !== '') ? regB.facilityName : (b.name || '')).toLowerCase();

      const idA = (statusA === 'Approved' ? (regA.facilityId || a.facilityCode || '') : '').toLowerCase();
      const idB = (statusB === 'Approved' ? (regB.facilityId || b.facilityCode || '') : '').toLowerCase();

      const typeA = (regA.facilityType || a.primaryActivity || a.sector || 'Manufacturing Plant').toLowerCase();
      const typeB = (regB.facilityType || b.primaryActivity || b.sector || 'Manufacturing Plant').toLowerCase();

      const planStatusA = (facilityMonitoringPlanStatuses[a.id] || (statusA === 'Approved' ? 'Create Plan' : '—')).toLowerCase();
      const planStatusB = (facilityMonitoringPlanStatuses[b.id] || (statusB === 'Approved' ? 'Create Plan' : '—')).toLowerCase();

      let cmp = 0;
      if (sortField === 'name') cmp = nameA.localeCompare(nameB);
      else if (sortField === 'id') cmp = idA.localeCompare(idB);
      else if (sortField === 'type') cmp = typeA.localeCompare(typeB);
      else if (sortField === 'regStatus') cmp = statusA.localeCompare(statusB);
      else if (sortField === 'planStatus') cmp = planStatusA.localeCompare(planStatusB);

      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredFacilities, sortField, sortDirection, facilityRegistrations, facilityMonitoringPlanStatuses]);

  const totalPages = Math.ceil(sortedFacilities.length / itemsPerPage) || 1;

  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedFacilities.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedFacilities, currentPage, itemsPerPage]);

  // Available version records for currently inspected facility
  const currentFacilityVersions = useMemo(() => {
    const history = facilityRegistrationHistory[selectedFacilityId];
    if (history && history.length > 0) {
      return history;
    }
    const currentReg = facilityRegistrations[selectedFacilityId] || formData;
    return [
      {
        version: currentReg.version || 'v1.0',
        status: currentReg.status === 'Approved / Registered' || currentReg.status === 'Registered' ? 'Approved' : (currentReg.status || 'Approved'),
        updatedDate: currentReg.updatedDate || '18 Jan 2026',
        submittedDate: currentReg.submittedDate || '10 Jan 2026',
        isCurrent: true,
        data: currentReg,
      },
    ];
  }, [facilityRegistrationHistory, selectedFacilityId, facilityRegistrations, formData]);

  // Exact saved snapshot data for the selected version
  const viewingData = useMemo(() => {
    const history = facilityRegistrationHistory[selectedFacilityId];
    if (history && history.length > 0) {
      const found = history.find((v) => v.version.toLowerCase() === selectedVersion.toLowerCase());
      if (found) return found.data;
    }
    return facilityRegistrations[selectedFacilityId] || formData;
  }, [facilityRegistrationHistory, selectedFacilityId, selectedVersion, facilityRegistrations, formData]);

  // Active version metadata
  const selectedVersionMeta = useMemo(() => {
    return (
      currentFacilityVersions.find((v) => v.version.toLowerCase() === selectedVersion.toLowerCase()) ||
      currentFacilityVersions[0]
    );
  }, [currentFacilityVersions, selectedVersion]);

  // Check if current facility being edited is strictly Approved (so Report a Change is only shown when editing an approved facility)
  const isFacilityApproved = useMemo(() => {
    // If current form is Draft, new registration, under review, or unapproved, it is NOT approved
    if (
      formData.status === 'Draft' ||
      formData.status === 'Submitted' ||
      formData.status === 'Under EAD Review' ||
      formData.status === 'Correction Required' ||
      formData.status === 'Rejected' ||
      !formData.facilityId
    ) {
      return false;
    }
    if (
      formData.status === 'Approved / Registered' ||
      formData.status === 'Approved' ||
      formData.status === 'Registered'
    ) {
      return true;
    }
    return false;
  }, [formData.status, formData.facilityId]);

  // Check if specific version being inspected in View mode is strictly Approved
  const isViewingApprovedVersion = useMemo(() => {
    if (
      viewingData.status === 'Draft' ||
      viewingData.status === 'Submitted' ||
      viewingData.status === 'Under EAD Review' ||
      viewingData.status === 'Correction Required' ||
      viewingData.status === 'Rejected' ||
      !viewingData.facilityId
    ) {
      return false;
    }
    if (
      selectedVersionMeta &&
      (selectedVersionMeta.status === 'Approved / Registered' ||
        selectedVersionMeta.status === 'Approved' ||
        selectedVersionMeta.status === 'Registered')
    ) {
      return true;
    }
    if (
      viewingData.status === 'Approved / Registered' ||
      viewingData.status === 'Approved' ||
      viewingData.status === 'Registered'
    ) {
      return true;
    }
    return false;
  }, [viewingData.status, viewingData.facilityId, selectedVersionMeta]);

  // Open Edit Form for specific facility
  const handleEditFacility = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveFacilityId(facilityId);
    const existing = facilityRegistrations[facilityId];
    if (existing) {
      const isApproved = existing.status === 'Approved / Registered' || existing.status === 'Approved';
      setFormData({
        ...existing,
        confirmUpdateDetails: isApproved ? Boolean(existing.confirmUpdateDetails) : false,
        declarationConfirmed: false,
      });
      setSelectedVersion(existing.version || 'V1');
    } else {
      const fac = facilities.find((f) => f.id === facilityId);
      const isApproved = fac?.status === 'Registered' || fac?.status === 'Active' || (fac?.status as unknown as string) === 'Approved / Registered';
      setFormData({
        ...facilityRegistrations['fac-1'],
        facilityName: fac?.name || 'New Facility',
        facilityId: isApproved ? (fac?.facilityCode || '') : '',
        operatorName: fac?.operatorName || 'Operator Name',
        address: fac?.address || 'Abu Dhabi, UAE',
        declarationConfirmed: false,
      });
      setSelectedVersion('V1');
    }
    setIsVersionDropdownOpen(false);
    setFacilityRecordTab('registration');
    setFormActiveTab('facility-details');
    setEditMonitoringSubTab('facility-description');
    setViewMode('form');
  };

  // Open Read-Only View for specific facility
  const handleViewFacility = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveFacilityId(facilityId);
    const existing = facilityRegistrations[facilityId];
    if (existing) {
      setFormData(existing);
      setSelectedVersion(existing.version || 'V1');
      setReviewerComments(existing.reviewerComments || '');
    } else {
      setSelectedVersion('V1');
      setReviewerComments('');
    }
    setIsVersionDropdownOpen(false);
    setFacilityRecordTab('registration');
    setViewActiveTab('facility-details');
    setViewMonitoringSubTab('facility-description');
    setViewMode('view');
  };

  // Delete Facility Registration
  const handleDeleteFacility = (facilityId: string, facilityName?: string) => {
    const name = facilityName || formData.facilityName || 'Facility';
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setOperatorFacilityIds((prev) => prev.filter((id) => id !== facilityId));
      setFacilityRegistrations((prev) => {
        const copy = { ...prev };
        delete copy[facilityId];
        return copy;
      });
      setFacilityRegistrationHistory((prev) => {
        const copy = { ...prev };
        delete copy[facilityId];
        return copy;
      });
      deleteFacility(facilityId);
      setNoticeMessage(`Facility "${name}" deleted successfully.`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 3000);
    }
  };

  // Open Monitoring Plan directly for Approved Facility
  const handleCreateMonitoringPlan = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActiveFacilityId(facilityId);
    const existingPlan = facilityPlans[facilityId] || INITIAL_FACILITY_MONITORING_PLANS[facilityId];
    if (!existingPlan) {
      const reg = facilityRegistrations[facilityId] || {};
      const defaultPlan = {
        facilityName: reg.facilityName || 'Facility',
        facilityId: reg.facilityId || facilityId,
        planRef: `MP-2026-${(reg.facilityId || facilityId).replace(/[^0-9]/g, '').slice(-4) || '0891'}`,
        reportingYear: '2026',
        planVersion: 'V1',
        status: 'Draft',
        primaryApproach: 'Calculation-based (Tier 3)',
        submittedDate: '—',
        updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: reg.facilityDescription || 'Industrial production and energy conversion facility.',
        businessSector: reg.reportingSector || 'Energy',
        primaryActivity: reg.primaryActivity || 'Combustion of fuels in stationary equipment',
        productionStreams: [
          { id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }
        ],
        emissionsEstimation: {
          estimatedAnnualEmissions: '50,000',
          justification: 'Calculated using fuel consumption records and standard IPCC emissions factors.'
        },
        emissionSources: [
          { id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }
        ],
        methaneData: {
          hasMethaneEmissions: true,
          annualVolume: '',
          annualVolumeUnit: 't CH₄/year',
          estimatedCo2e: '',
          estimatedCo2eUnit: 't CO₂e/year',
          sourceOfEstimations: '',
          keySourcesAtInstallation: '',
          procedureToDetermine: ''
        },
        methaneProcedures: [
          { id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }
        ],
        sourceStreams: [
          { id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }
        ],
        calcOtherInputs: [
          { id: 'INP-01', type: 'Natural Gas High-Pressure Fuel', activityLevel: '2,450,000', units: 'Nm³/year', ncv: '38.5', emissionFactor: '56.1', oxidationFactor: '1.00', source: 'EAD UAE GHG Inventory Guidelines' }
        ],
        measEquipment: [
          { name: 'Ultrasonic Fiscal Gas Meter', type: 'Flow Telemetry', manufacturer: 'Daniel / Emerson', parameter: 'Natural Gas Volume Flow', accuracyClass: '±0.5% (High Accuracy)' }
        ],
        mitigationMeasures: [],
        remarks: 'Statutory monitoring plan profile.',
        attachedFiles: []
      };
      updateFacilityPlan(facilityId, defaultPlan);
    }
    setEditMonitoringSubTab('facility-description');
    setViewMode('monitoring-plan-form');
  };

  // Add New Facility Flow
  const handleAddNewFacility = () => {
    const isFirstTime = !hasCreatedFirstFacility && operatorFacilityIds.length === 0;
    const newId = isFirstTime ? 'fac-1' : `fac-new-${Date.now()}`;
    setSelectedFacilityId(newId);

    if (isFirstTime) {
      // First registration (for demo experience): pre-fill with realistic sample facility in Draft mode
      setFormData({
        ...SAMPLE_DEMO_FACILITY_REGISTRATION,
        status: 'Draft',
        facilityId: '',
      });
      setHasCreatedFirstFacility(true);
    } else {
      // Subsequent registrations: completely blank form with existing placeholders
      setFormData({
        ...BLANK_FACILITY_REGISTRATION,
        submittedDate: '—',
        updatedDate: '—',
      });
    }

    setFormActiveTab('facility-details');
    setViewMode('form');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      setFormData((prev: any) => ({
        ...prev,
        attachedFiles: [...(prev.attachedFiles || []), ...newFiles],
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Save changes into the single source of truth registry & history
  const handleSave = () => {
    const targetId = selectedFacilityId || `fac-draft-${Date.now()}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const isApproved = formData.status === 'Approved' || formData.status === 'Approved / Registered';
    const status: 'Draft' | 'Approved' = isApproved ? 'Approved' : 'Draft';
    const facilityName = (formData.facilityName && formData.facilityName.trim() !== '') ? formData.facilityName : (isApproved ? 'Registered Facility' : 'Draft Facility');

    const updated = {
      ...formData,
      status,
      facilityName: (formData.facilityName && formData.facilityName.trim() !== '') ? formData.facilityName : facilityName,
      facilityId: isApproved ? (formData.facilityId || '') : '',
      updatedDate: todayStr,
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [targetId]: updated,
    }));

    setOperatorFacilityIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[targetId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status, updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return {
        ...prev,
        [targetId]:
          updatedHist.length > 0
            ? updatedHist
            : [
                {
                  version: updated.version || 'v1.0',
                  status,
                  submittedDate: updated.submittedDate || '—',
                  updatedDate: updated.updatedDate,
                  isCurrent: true,
                  data: updated,
                },
              ],
      };
    });

    setFormData(updated);
    setSelectedFacilityId(targetId);
    setActiveFacilityId(targetId);

    updateFacility({
      id: targetId,
      name: facilityName,
      operatorName: formData.operatorName || 'Data Provider / Operator',
      tradeLicense: formData.licenseNumber,
      sector: (formData.reportingSector || 'Energy') as SectorType,
      emirate: (formData.emirate || 'Abu Dhabi') as EmirateType,
      address: formData.address,
      primaryActivity: formData.primaryActivity,
      secondaryActivities: formData.secondaryActivity,
      products: formData.mainProduct,
      permitNumber: formData.permitNumber,
      permitIssueDate: formData.permitIssueDate,
      permitExpiryDate: formData.permitExpiryDate,
      contactPerson: {
        name: formData.primaryName,
        position: formData.primaryTitle,
        email: formData.primaryEmail,
        phone: formData.primaryPhone,
      },
      environmentalManager: {
        name: formData.alternateName,
        email: formData.alternateEmail,
        phone: formData.alternatePhone,
      },
      status: (status === 'Approved' ? 'Approved' : 'Draft') as any,
      facilityCode: isApproved ? formData.facilityId : '',
      lastRenewalDate: new Date().toISOString().slice(0, 10),
    });

    setViewMode('table');
  };

  const updateCurrentPlan = (updaterOrData: any) => {
    updateFacilityPlan(selectedFacilityId, updaterOrData);
  };

  const handleMonitoringPlanFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      updateFacilityPlan(selectedFacilityId, (plan: any) => ({
        ...plan,
        attachedFiles: [...(plan?.attachedFiles || []), ...newFiles],
      }));
    }
  };

  const handleSaveMonitoringPlanDraft = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    updateFacilityPlan(selectedFacilityId, (p: any) => ({
      ...p,
      status: 'Draft',
      updatedDate: todayStr,
    }));
    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Draft');
    setOperatorFacilityIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setViewMode('table');
  };

  const handleSubmitMonitoringPlan = () => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    updateFacilityPlan(selectedFacilityId, (p: any) => ({
      ...p,
      status: 'Submitted',
      submittedDate: todayStr,
      updatedDate: todayStr,
    }));
    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Submitted');
    setOperatorFacilityIds((prev) => (prev.includes(selectedFacilityId) ? prev : [...prev, selectedFacilityId]));
    setViewMode('table');
  };

  const handleCreatePlanInEditMode = () => {
    const defaultPlan = {
      facilityName: formData.facilityName || 'Facility',
      facilityId: formData.facilityId || selectedFacilityId,
      planRef: `MP-2026-${(formData.facilityId || selectedFacilityId).replace(/[^0-9]/g, '').slice(-4) || '0891'}`,
      reportingYear: '2026',
      planVersion: 'V1',
      status: 'Draft',
      primaryApproach: 'Calculation-based (Tier 3)',
      submittedDate: '—',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: formData.facilityDescription || 'Industrial production and energy conversion facility.',
      businessSector: formData.reportingSector || 'Energy',
      productionStreams: [
        { id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }
      ],
      emissionsEstimation: {
        estimatedAnnualEmissions: '50,000',
        justification: 'Calculated using fuel consumption records and standard IPCC emissions factors.'
      },
      emissionSources: [
        { id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }
      ],
      methaneData: {
        hasMethaneEmissions: true,
        annualVolume: '',
        annualVolumeUnit: 't CH₄/year',
        estimatedCo2e: '',
        estimatedCo2eUnit: 't CO₂e/year',
        sourceOfEstimations: '',
        keySourcesAtInstallation: '',
        procedureToDetermine: ''
      },
      methaneProcedures: [
        { id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }
      ],
      sourceStreams: [
        { id: 'STR-01', description: 'High-Pressure Pipeline Natural Gas', associatedSource: 'S01', fuelType: 'Natural gas', classification: 'Fuel Combusted', activityLevel: '2,450,000', activityUnit: 'Nm³', combustionDevice: 'Gas-fired turbine', deviceCapacity: '100.0', metricUnit: 'MW' }
      ],
      calcOtherInputs: [
        { id: 'INP-01', type: 'Natural Gas High-Pressure Fuel', activityLevel: '2,450,000', units: 'Nm³/year', ncv: '38.5', emissionFactor: '56.1', oxidationFactor: '1.00', source: 'EAD UAE GHG Inventory Guidelines' }
      ],
      measEquipment: [
        { name: 'Ultrasonic Fiscal Gas Meter', type: 'Flow Telemetry', manufacturer: 'Daniel / Emerson', parameter: 'Natural Gas Volume Flow', accuracyClass: '±0.5% (High Accuracy)' }
      ],
      mitigationMeasures: [],
      remarks: 'Statutory monitoring plan profile.',
      attachedFiles: []
    };
    updateFacilityPlan(selectedFacilityId, defaultPlan);
    setFacilityMonitoringPlanStatus(selectedFacilityId, 'Draft');
  };

  const handleSubmitRegistration = () => {
    if (formActiveTab !== 'declaration-supporting' || !formData.declarationConfirmed) {
      return;
    }
    const targetId = selectedFacilityId || `fac-new-${Date.now()}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const facilityName = (formData.facilityName && formData.facilityName.trim() !== '') ? formData.facilityName : 'Registered Facility';

    // Direct approval and Facility ID generation on submit
    const generatedId =
      formData.facilityId && formData.facilityId.startsWith('FAC-EAD')
        ? formData.facilityId
        : (activeFacility?.facilityCode && activeFacility.facilityCode.startsWith('FAC-EAD')
          ? activeFacility.facilityCode
          : (targetId === 'fac-1' ? 'FAC-EAD-2026-0891' : `FAC-EAD-2026-${Math.floor(1000 + Math.random() * 9000)}`));

    const updated = {
      ...formData,
      status: 'Approved',
      facilityName: facilityName,
      facilityId: generatedId,
      submittedDate: todayStr,
      updatedDate: todayStr,
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [targetId]: updated,
    }));

    setOperatorFacilityIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[targetId] || [];
      const newSnapshot: FacilityRegistrationVersionSnapshot = {
        version: updated.version || 'v1.0',
        status: 'Approved',
        submittedDate: updated.submittedDate,
        updatedDate: updated.updatedDate,
        isCurrent: true,
        data: updated,
      };
      return { ...prev, [targetId]: [newSnapshot, ...facilityHist] };
    });

    setFormData(updated);

    updateFacility({
      id: targetId,
      name: facilityName,
      facilityCode: generatedId,
      operatorName: updated.operatorName || 'Data Provider / Operator',
      tradeLicense: updated.licenseNumber,
      sector: (updated.reportingSector || 'Energy') as SectorType,
      emirate: (updated.emirate || 'Abu Dhabi') as EmirateType,
      address: updated.address,
      primaryActivity: updated.primaryActivity,
      secondaryActivities: updated.secondaryActivity,
      products: updated.mainProduct,
      permitNumber: updated.permitNumber,
      permitIssueDate: updated.permitIssueDate,
      permitExpiryDate: updated.permitExpiryDate,
      contactPerson: {
        name: updated.primaryName,
        position: updated.primaryTitle,
        email: updated.primaryEmail,
        phone: updated.primaryPhone,
      },
      environmentalManager: {
        name: updated.alternateName,
        email: updated.alternateEmail,
        phone: updated.alternatePhone,
      },
      status: 'Approved' as any,
      lastRenewalDate: new Date().toISOString().slice(0, 10),
    });

    setActiveFacilityId(targetId);
    setRegistrationStatus('Approved');
    if (!facilityMonitoringPlanStatuses[targetId] || facilityMonitoringPlanStatuses[targetId] !== 'Submitted') {
      setFacilityMonitoringPlanStatus(targetId, 'Create Plan');
    }

    // Return to overview table to display the created record
    setViewMode('table');
  };

  const handleEadApprove = () => {
    // Requirement 4: Only after EAD approval, generate the Facility ID and change Monitoring Plan Status to “Create Plan”.
    const generatedId =
      formData.facilityId && formData.facilityId.startsWith('FAC-EAD')
        ? formData.facilityId
        : `FAC-EAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = {
      ...formData,
      facilityId: generatedId,
      status: 'Approved',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Approved', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);

    updateFacility({
      id: selectedFacilityId,
      name: updated.facilityName,
      facilityCode: generatedId,
      status: 'Approved',
      sector: updated.reportingSector,
      primaryActivity: updated.primaryActivity,
      address: updated.address,
      operatorName: updated.operatorName,
    });

    setRegistrationStatus('Approved');
    if (!facilityMonitoringPlanStatuses[selectedFacilityId] || facilityMonitoringPlanStatuses[selectedFacilityId] !== 'Submitted') {
      setFacilityMonitoringPlanStatus(selectedFacilityId, 'Create Plan');
    }
    setViewMode('table');
  };

  const handleReturnForCorrection = () => {
    const updated = {
      ...formData,
      status: 'Correction Required',
      correctionDeadlineDate: '2026-06-15',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Correction Required', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);
    setRegistrationStatus('Correction Required');
    setViewMode('table');
  };

  const handleRejectRegistration = () => {
    const updated = {
      ...formData,
      status: 'Rejected',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Rejected', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);
    setRegistrationStatus('Rejected');
    setViewMode('table');
  };

  // Dedicated Review determination actions from View Mode
  const handleViewApprove = () => {
    // Requirement 4: Only after EAD approval, generate the Facility ID and change Monitoring Plan Status to “Create Plan”.
    const generatedId =
      viewingData.facilityId && viewingData.facilityId.startsWith('FAC-EAD')
        ? viewingData.facilityId
        : (activeFacility?.facilityCode && activeFacility.facilityCode.startsWith('FAC-EAD')
          ? activeFacility.facilityCode
          : `FAC-EAD-2026-${Math.floor(1000 + Math.random() * 9000)}`);

    const updated = {
      ...viewingData,
      facilityId: generatedId,
      status: 'Approved',
      reviewerComments: reviewerComments,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (selectedVersion || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Approved', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);

    updateFacility({
      id: selectedFacilityId,
      name: updated.facilityName,
      facilityCode: generatedId,
      status: 'Approved',
      sector: updated.reportingSector,
      primaryActivity: updated.primaryActivity,
      address: updated.address,
      operatorName: updated.operatorName,
    });

    setRegistrationStatus('Approved');
    if (!facilityMonitoringPlanStatuses[selectedFacilityId] || facilityMonitoringPlanStatuses[selectedFacilityId] !== 'Submitted') {
      setFacilityMonitoringPlanStatus(selectedFacilityId, 'Create Plan');
    }
    setViewMode('table');
  };

  const handleViewRevert = () => {
    const updated = {
      ...viewingData,
      status: 'Correction Required',
      reviewerComments: reviewerComments,
      correctionDeadlineDate: '2026-06-15',
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (selectedVersion || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Correction Required', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);
    setRegistrationStatus('Correction Required');
    setViewMode('table');
  };

  const handleViewReject = () => {
    const updated = {
      ...viewingData,
      status: 'Rejected',
      reviewerComments: reviewerComments,
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setFacilityRegistrations((prev) => ({
      ...prev,
      [selectedFacilityId]: updated,
    }));

    setFacilityRegistrationHistory((prev) => {
      const facilityHist = prev[selectedFacilityId] || [];
      const updatedHist = facilityHist.map((v) => {
        if (v.version.toLowerCase() === (selectedVersion || 'v1.0').toLowerCase()) {
          return { ...v, status: 'Rejected', updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    setFormData(updated);
    setRegistrationStatus('Rejected');
    setViewMode('table');
  };

  // =========================================================================
  // RENDER 1: OVERVIEW TABLE (Default landing when clicking Registration)
  // =========================================================================
  if (viewMode === 'table') {
    // Clean Empty State for New Data Provider with no registered facility
    if (isFacilityOperator && operatorFacilityIds.length === 0) {
      return (
        <div className="h-full flex flex-col font-sans py-1">
          {/* Header */}
          <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                Facility Registration
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Statutory Operator Profiles, Environmental Permits & Regulatory Registration Register
              </p>
            </div>
          </div>

          {/* White Color Frame till half */}
          <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center py-12 px-6">
            <div className="flex flex-col items-center text-center max-w-md">
              {/* User-attached Blue Folder Icon */}
              <img
                src={emptyFolderIcon}
                alt="No Facility Registered"
                className="w-[84px] h-[74px] object-contain mb-3.5 select-none"
                draggable={false}
              />

              <h2 className="text-[15px] font-bold text-[#336D9F] tracking-tight">
                No Facility Registered
              </h2>
              <p className="text-[11.5px] text-slate-500 font-normal mt-1 max-w-sm">
                You don’t have any facility registered yet. Please register your facility to continue.
              </p>

              <button
                onClick={handleAddNewFacility}
                className="mt-4 h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Facility</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Register New Facility Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-[18px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink flex items-center gap-3">
            <div>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
                {isEadReviewerOrAdmin ? 'Facility Management' : 'Facility Registration'}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
                {isEadReviewerOrAdmin
                  ? 'Regulated Industrial Facilities, Statutory Environmental Permits & Regulatory Oversight Register'
                  : 'Statutory Operator Profiles, Environmental Permits & Regulatory Registration Register'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by facility, contact..."
                value={tableSearchTerm}
                onChange={(e) => {
                  setTableSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full !h-9 !min-h-[36px] pl-8 pr-7 py-1.5 bg-white border border-slate-300 !rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                style={{ borderRadius: '8px' }}
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
                className="appearance-none w-36 sm:w-40 !h-9 !min-h-[36px] pl-3 pr-8 py-1.5 bg-white border border-slate-300 !rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                style={{ borderRadius: '8px' }}
              >
                <option value="ALL">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Draft">Draft</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setCurrentPage(1);
                }}
                className="!h-9 !min-h-[36px] px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 !rounded-lg border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs shadow-xs"
                style={{ borderRadius: '8px' }}
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* + Register New Facility Button (Locked to 36px height) */}
            {isFacilityOperator && (
              <button
                onClick={handleAddNewFacility}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Facility</span>
              </button>
            )}
          </div>
        </div>

        {/* Table & Pagination Container (Without outer white card background) */}
        <div className="flex flex-col flex-1 min-h-0 justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <table className="w-full table-fixed text-left text-xs border-collapse">
              <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30 select-none">
                  <th
                    onClick={() => handleSort('index')}
                    className="h-[38px] px-3 w-[5%] text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Number"
                  >
                    <div className="flex items-center justify-center">
                      <span>#</span>
                      <SortTriangles active={sortField === 'index'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="h-[38px] px-4 w-[22%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Facility Name"
                  >
                    <div className="flex items-center">
                      <span>Facility Name</span>
                      <SortTriangles active={sortField === 'name'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('id')}
                    className="h-[38px] px-4 w-[18%] whitespace-nowrap align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Facility ID"
                  >
                    <div className="flex items-center">
                      <span>Facility ID</span>
                      <SortTriangles active={sortField === 'id'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('type')}
                    className="h-[38px] px-4 w-[18%] align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Facility Type"
                  >
                    <div className="flex items-center">
                      <span>Facility Type</span>
                      <SortTriangles active={sortField === 'type'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('regStatus')}
                    className="h-[38px] px-4 w-[15%] whitespace-nowrap text-left align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Registration Status"
                  >
                    <div className="flex items-center">
                      <span>Registration Status</span>
                      <SortTriangles active={sortField === 'regStatus'} direction={sortDirection} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('planStatus')}
                    className="h-[38px] px-4 w-[14%] whitespace-nowrap text-center align-middle bg-[#D6E3EF] hover:bg-[#C8D9E8] transition-colors cursor-pointer group"
                    title="Sort by Monitoring Plan Status"
                  >
                    <div className="flex items-center justify-center">
                      <span>Monitoring Plan Status</span>
                      <SortTriangles active={sortField === 'planStatus'} direction={sortDirection} />
                    </div>
                  </th>
                  <th className="h-[38px] px-3 w-[8%] text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {paginatedFacilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-[60px] py-8 text-center text-slate-400 font-normal align-middle">
                      No facility registration records match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedFacilities.map((fac, idx) => {
                    const reg = facilityRegistrations[fac.id] || {};
                    const rawStatus = reg.status || fac.status || 'Submitted';
                    const isDraft = rawStatus === 'Draft';
                    const isSubmitted = !isDraft;
                    const currentStatus = isDraft ? 'Draft' : 'Submitted';

                    const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                    const monitoringStatus = facilityMonitoringPlanStatuses[fac.id] || 'Create Plan';
                    const facilityCodeToDisplay = (isSubmitted && (reg.facilityId || fac.facilityCode)) ? (reg.facilityId || fac.facilityCode) : '—';

                    const facilityDisplayName = (reg.facilityName && reg.facilityName.trim() !== '')
                      ? reg.facilityName
                      : (fac.name && fac.name.trim() !== '')
                      ? fac.name
                      : (isDraft ? 'Draft Facility' : 'Registered Facility');

                    return (
                      <tr
                        key={fac.id}
                        className={`h-[60px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}
                      >
                        {/* 1. Row # */}
                        <td className="h-[60px] px-3 text-center font-mono font-normal text-slate-400 align-middle">
                          {rowNumber}
                        </td>

                        {/* 2. Facility Name (2-line wrap) */}
                        <td className="h-[60px] px-4 font-medium text-slate-800 align-middle overflow-hidden">
                          <span className="line-clamp-2 leading-snug break-words">{facilityDisplayName}</span>
                        </td>

                        {/* 3. Facility ID */}
                        <td className="h-[60px] px-4 font-mono font-bold text-[#004B87] whitespace-nowrap align-middle">
                          {facilityCodeToDisplay !== '—' ? (
                            <span className="font-bold tracking-tight">{facilityCodeToDisplay}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">—</span>
                          )}
                        </td>

                        {/* 4. Facility Type (2-line wrap) */}
                        <td className="h-[60px] px-4 text-slate-600 font-normal align-middle overflow-hidden">
                          <span className="line-clamp-2 leading-snug break-words">
                            {reg.facilityType || fac.primaryActivity || fac.sector || 'Manufacturing Plant'}
                          </span>
                        </td>

                        {/* 5. Registration Status */}
                        <td className="h-[60px] px-4 text-left whitespace-nowrap align-middle">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-normal whitespace-nowrap inline-block ${
                              isSubmitted
                                ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {currentStatus}
                          </span>
                        </td>

                        {/* 6. Monitoring Plan Status: 'Create Plan' (button for operator), 'Plan Not Created' (status for admin), 'Draft' (chip), or 'Submitted' (badge) for Submitted; '—' for Draft */}
                        <td className="h-[60px] px-4 text-center whitespace-nowrap align-middle">
                          {isSubmitted ? (
                            monitoringStatus === 'Submitted' ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 inline-flex items-center gap-1">
                                Submitted
                              </span>
                            ) : monitoringStatus === 'Draft' ? (
                              isFacilityOperator ? (
                                <button
                                  onClick={() => handleCreateMonitoringPlan(fac.id)}
                                  className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer mx-auto"
                                  title="Resume Draft Monitoring Plan"
                                >
                                  <span>Draft</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-200 inline-flex items-center gap-1">
                                  Draft
                                </span>
                              )
                            ) : (
                              isFacilityOperator ? (
                                <button
                                  onClick={() => handleCreateMonitoringPlan(fac.id)}
                                  className="h-7 px-3 bg-gradient-to-r from-[#004B87] to-[#006BB8] hover:from-[#003d6e] hover:to-[#005c9e] text-white rounded-lg text-[11px] font-normal inline-flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95 mx-auto"
                                  title="Create Monitoring Plan"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Create Plan</span>
                                </button>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] inline-flex items-center gap-1">
                                  Not Yet Created
                                </span>
                              )
                            )
                          ) : (
                            <span className="text-slate-400 font-normal pl-1">—</span>
                          )}
                        </td>

                        {/* 7. Actions: View, Edit & Delete for Data Provider vs View only for Admin */}
                        <td className="h-[60px] px-3 text-center whitespace-nowrap align-middle">
                          {isFacilityOperator ? (
                            <div className="flex items-center justify-center gap-1.5 w-[76px] mx-auto">
                              {/* View Action (Slot 1) */}
                              <button
                                onClick={() => handleViewFacility(fac.id)}
                                title="View Facility Registration"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Action (Slot 2) */}
                              <button
                                onClick={() => handleEditFacility(fac.id)}
                                title="Edit Facility Registration"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Delete Action (Slot 3: Only for Draft status, empty slot otherwise) */}
                              {isDraft ? (
                                <button
                                  onClick={() => handleDeleteFacility(fac.id, facilityDisplayName)}
                                  title="Delete Draft Facility"
                                  className="w-6 h-6 flex items-center justify-center rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <div className="w-6 h-6 shrink-0" aria-hidden="true" />
                              )}
                            </div>
                          ) : (
                            /* Admin Actions: View only */
                            <div className="flex items-center justify-center mx-auto">
                              <button
                                onClick={() => handleViewFacility(fac.id)}
                                title="View Facility Details"
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-[#E9F1F8] transition-colors cursor-pointer shrink-0"
                              >
                                <Eye className="w-4 h-4" />
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

          {/* Pagination & Counter Footer */}
          <div className="pt-2.5 pb-1 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium flex-shrink-0">
            <div className="flex items-center gap-2">
              <span>
                Showing <span className="font-bold text-slate-800">{filteredFacilities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredFacilities.length)}</span> of{' '}
                <span className="font-bold text-slate-800">{filteredFacilities.length}</span> facilities
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
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
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
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-xs'
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
  // RENDER 2: READ-ONLY VIEW (When user clicks 'View')
  // =========================================================================
  if (viewMode === 'view') {
    const isApproved = viewingData.status === 'Approved' || viewingData.status === 'Registered' || viewingData.status === 'Approved / Registered';
    
    // Monitoring Plan resolution for this specific facility
    const currentPlan = facilityPlans?.[selectedFacilityId] || INITIAL_FACILITY_MONITORING_PLANS?.[selectedFacilityId];
    const monitoringPlanStatus = facilityMonitoringPlanStatuses[selectedFacilityId] || (currentPlan?.status === 'Submitted' ? 'Submitted' : currentPlan?.status === 'Draft' ? 'Draft' : 'Create Plan');
    const hasPlan = (monitoringPlanStatus === 'Submitted' || monitoringPlanStatus === 'Draft' || currentPlan?.status === 'Submitted' || currentPlan?.status === 'Draft') && Boolean(
      currentPlan && (
        (currentPlan.productionStreams && currentPlan.productionStreams.length > 0 && currentPlan.productionStreams[0]?.technology) ||
        (currentPlan.emissionsEstimation && currentPlan.emissionsEstimation.estimatedAnnualEmissions) ||
        (currentPlan.primaryApproach && currentPlan.primaryApproach !== '—')
      )
    );

    const monitoringFacilityName =
      activeFacility?.name ||
      viewingData?.facilityName ||
      formData.facilityName ||
      facilityRegistrations[selectedFacilityId]?.facilityName ||
      'Facility';

    const monitoringFacilityId =
      activeFacility?.facilityCode ||
      viewingData?.facilityId ||
      formData.facilityId ||
      facilityRegistrations[selectedFacilityId]?.facilityId ||
      '';

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Navigation Bar Back to Overview & 2 Primary Tabs */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {!viewingData?.facilityId ? (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="p-1 -ml-1 text-[#004B87] hover:text-[#003B6D] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                  title="Back to Overview"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
                  Facility Registration
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center">
                  Draft
                </span>
              </div>
            ) : (
              /* 2 Primary Tabs: Facility Registration | Monitoring Plan (No chip) */
              <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFacilityRecordTab('registration')}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer select-none font-bold ${
                    facilityRecordTab === 'registration'
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Facility Registration</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFacilityRecordTab('monitoring-plan')}
                  className={`px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer select-none font-bold ${
                    facilityRecordTab === 'monitoring-plan'
                      ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Monitoring Plan</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Edit Button */}
            {isFacilityOperator && (
              <button
                onClick={() => {
                  if (facilityRecordTab === 'registration') {
                    handleEditFacility(selectedFacilityId);
                  } else {
                    handleCreateMonitoringPlan(selectedFacilityId);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:from-[#003d6e] hover:to-[#005c9e] cursor-pointer transition-colors"
                title={facilityRecordTab === 'registration' ? 'Edit Facility Registration' : 'Edit Monitoring Plan'}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{facilityRecordTab === 'registration' ? 'Edit Registration' : 'Edit Monitoring Plan'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Facility Name, Facility ID & Calendar Year Row (Outside White Frame when on Monitoring Plan tab) */}
        {facilityRecordTab === 'monitoring-plan' && hasPlan && (
          <div className="flex-shrink-0 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Facility Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={monitoringFacilityName}
                  className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Facility ID
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={monitoringFacilityId || 'FAC-EAD-2026-0891'}
                  className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-[#004B87] font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Calendar Year
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={currentPlan?.reportingYear || '2026'}
                  className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Card Container */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* TAB 1: FACILITY REGISTRATION */}
          {facilityRecordTab === 'registration' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {/* View Tab Navigation Progress Stepper */}
              <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
                <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
                  {REGISTRATION_STEPS.map((step, idx) => {
                    const currentStepNum = viewActiveTab === 'facility-details' ? 1 : viewActiveTab === 'contact-persons' ? 2 : 3;
                    const isActive = step.stepNumber === currentStepNum;
                    const isCompleted = step.stepNumber < currentStepNum;
                    const isArrowHighlighted = idx < currentStepNum - 1;

                    return (
                      <React.Fragment key={step.id}>
                        <button
                          type="button"
                          onClick={() => setViewActiveTab(step.id)}
                          className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                            isActive
                              ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                              : isCompleted
                              ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          {/* Numbered Circle */}
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                              isActive
                                ? 'bg-white text-[#004B87] shadow-2xs'
                                : isCompleted
                                ? 'bg-[#00875A] text-white shadow-2xs'
                                : 'bg-white text-slate-400 border border-slate-300'
                            }`}
                          >
                            <span>{step.stepNumber}</span>
                          </div>

                          {/* Step Title */}
                          <span className="whitespace-nowrap">{step.title}</span>
                        </button>

                        {/* Arrow Indication between steps (Highlighted once finished) */}
                        {idx < REGISTRATION_STEPS.length - 1 && (
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                              isArrowHighlighted
                                ? 'text-[#004B87] stroke-[2.5]'
                                : 'text-slate-300'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-0.5 text-xs custom-scrollbar">
                {/* TAB 1: Facility Details */}
                {viewActiveTab === 'facility-details' && (
                  <div className="space-y-5">
                    {/* Operator Details */}
                    <div>
                      <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Operator Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Operator Name *</label>
                          <FieldTooltip content="Legal registered commercial entity or operator holding statutory responsibility for facility compliance under EAD regulations." example="Al Noor Energy & Power Operations LLC" value={viewingData.operatorName}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.operatorName || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Registration / License Number *</label>
                          <FieldTooltip content="Official commercial registration or trade license number issued by the Abu Dhabi Department of Economic Development (DED)." format="CN-XXXXXXX-AD" example="CN-1094821-AD" value={viewingData.licenseNumber}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.licenseNumber || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Registered Address *</label>
                          <FieldTooltip content="Official registered corporate headquarters address in the United Arab Emirates." example="Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi" value={viewingData.registeredAddress}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.registeredAddress || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Correspondence Address</label>
                          <FieldTooltip content="Designated mailing or operational address for official regulatory notices, audit correspondence, and compliance letters." example="P.O. Box 9022, Abu Dhabi, UAE" value={viewingData.correspondenceAddress}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.correspondenceAddress || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                      </div>
                    </div>

                    {/* Facility Details & Location */}
                    <div>
                      <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Facility Details & Location</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Facility Name</label>
                          <FieldTooltip content="Official operational name of the physical plant or industrial facility registered in MRV." example="Al Noor Industrial Facility" value={viewingData.facilityName}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.facilityName || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Facility Type</label>
                          <FieldTooltip content="Primary industrial classification and operational activity category of the facility." example="Cogeneration Plant" value={viewingData.facilityType}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.facilityType || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-end">
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Address</label>
                          <FieldTooltip content="Physical location and street address of the industrial installation or plant." example="Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi" value={viewingData.address}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.address || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Emirate / Region</label>
                          <FieldTooltip content="Jurisdictional administrative territory of Abu Dhabi Emirate where the facility is located." example="Abu Dhabi" value={viewingData.emirate}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.emirate || 'Abu Dhabi'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-700 font-semibold text-xs block">Location Coordinates</label>
                            <button
                              type="button"
                              onClick={() => setIsMapModalOpen(true)}
                              className="text-[10px] text-sky-600 hover:text-[#004B87] font-semibold flex items-center gap-0.5 cursor-pointer"
                            >
                              <MapPin className="w-3 h-3" />
                              <span>View on Map</span>
                            </button>
                          </div>
                          <FieldTooltip content="Geographic GPS centroid coordinates in WGS84 decimal degrees format." format="Latitude, Longitude (Decimal Degrees)" example="24.3644, 54.4988" value={viewingData.coordinates}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.coordinates || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-[#336D9F] font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                      </div>
                    </div>

                    {/* Environmental Permit */}
                    <div>
                      <div className="flex items-center gap-3 mb-2.5">
                        <h4 className="text-xs font-bold text-[#336D9F]">Environmental Permit Available:</h4>
                        <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${viewingData.permitAvailable !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                          {viewingData.permitAvailable !== false ? 'Yes' : 'No'}
                        </span>
                      </div>

                      {viewingData.permitAvailable !== false ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Environmental Permit Number</label>
                            <FieldTooltip content="Statutory Environmental Operating Permit identifier issued by the Environment Agency – Abu Dhabi (EAD)." format="EAD-EP-YYYY-XXXXXX" example="EAD-EP-2023-7741" value={viewingData.permitNumber}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.permitNumber || '—'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Permit Status</label>
                            <FieldTooltip content="Current operational and legal standing of the facility's statutory environmental permit." example="Active" value={viewingData.permitStatus}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.permitStatus || 'Active'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Permit Issue Date</label>
                            <FieldTooltip content="Official effective issuance date of the statutory environmental operating permit." format="DD-MMM-YYYY" example="15-Jan-2023" value={viewingData.permitIssueDate}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.permitIssueDate || '—'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Permit Expiry Date</label>
                            <FieldTooltip content="Statutory expiration date requiring renewal under EAD environmental licensing." format="DD-MMM-YYYY" example="14-Jan-2027" value={viewingData.permitExpiryDate}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.permitExpiryDate || '—'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs italic">
                          No statutory environmental permit active or reported.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Contact Persons */}
                {viewActiveTab === 'contact-persons' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                    {/* Primary Contact Person */}
                    <div className="space-y-3.5 pr-0 lg:pr-8">
                      <h4 className="text-xs font-bold text-[#336D9F]">Primary Contact Person</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Name</label>
                          <FieldTooltip content="Full legal name of primary contact person." value={viewingData.primaryName || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.primaryName || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Title / Designation</label>
                          <FieldTooltip content="Official position or title." value={viewingData.primaryTitle || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.primaryTitle || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Email</label>
                          <FieldTooltip content="Official email address." value={viewingData.primaryEmail || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.primaryEmail || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Number</label>
                          <FieldTooltip content="Contact telephone number." value={viewingData.primaryPhone || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.primaryPhone || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                      </div>
                    </div>

                    {/* Alternate Contact Person */}
                    <div className="space-y-3.5 pt-5 lg:pt-0 lg:pl-8">
                      <h4 className="text-xs font-bold text-[#336D9F]">Alternate Contact Person</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Name</label>
                          <FieldTooltip content="Full legal name of alternate contact person." value={viewingData.alternateName || viewingData.primaryName || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.alternateName || viewingData.primaryName || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Title / Designation</label>
                          <FieldTooltip content="Official position or title of alternate contact." value={viewingData.alternateTitle || viewingData.primaryTitle || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.alternateTitle || viewingData.primaryTitle || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Email</label>
                          <FieldTooltip content="Alternate contact email address." value={viewingData.alternateEmail || viewingData.primaryEmail || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.alternateEmail || viewingData.primaryEmail || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-medium text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold mb-1 text-xs block">Number</label>
                          <FieldTooltip content="Alternate contact telephone number." value={viewingData.alternatePhone || viewingData.primaryPhone || '—'}>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={viewingData.alternatePhone || viewingData.primaryPhone || '—'}
                              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </FieldTooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Declaration & Supporting Documents */}
                {viewActiveTab === 'declaration-supporting' && (
                  <div className="space-y-5">
                    {/* Declaration */}
                    <div>
                      <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Declaration</h4>
                      <FieldTooltip content="Statutory confirmation statement certifying data completeness, truthfulness, and regulatory accuracy." example="Confirmed">
                        <div className="p-3.5 bg-[#F4F8FC] border border-sky-100 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>I confirm that the information provided is true and accurate</span>
                        </div>
                      </FieldTooltip>
                    </div>

                    {/* Report a Change */}
                    {isViewingApprovedVersion && (
                      <div>
                        <h4 className="text-xs font-bold text-[#336D9F] mb-3">Report a Change</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3.5">
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Change Type</label>
                            <FieldTooltip content="Category of operational, legal, or infrastructural modification being reported to EAD." example="Change of Operator" value={viewingData.changeType}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.changeType || 'Change of Operator'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                          <div>
                            <label className="text-slate-700 font-semibold mb-1 text-xs block">Effective Date</label>
                            <FieldTooltip content="Effective operational date from which the facility change applies." format="DD-MMM-YYYY" example="01-Jan-2026" value={viewingData.changeEffectiveDate}>
                              <input
                                type="text"
                                readOnly
                                disabled
                                value={viewingData.changeEffectiveDate || '01-Jan-2026'}
                                className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
                              />
                            </FieldTooltip>
                          </div>
                        </div>

                        <div className="mb-3.5">
                          <label className="text-slate-700 font-semibold mb-1.5 text-xs block">Change Description</label>
                          <FieldTooltip content="Detailed narrative explaining the nature and scope of the facility change." example="Additional production line commissioned." value={viewingData.changeDescription}>
                            <p className="font-medium text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {viewingData.changeDescription || 'Additional production line commissioned in July 2026.'}
                            </p>
                          </FieldTooltip>
                        </div>
                      </div>
                    )}

                    {/* Supporting Documents */}
                    <div>
                      <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Supporting Documents</h4>
                      <label className="text-slate-700 font-semibold mb-2 text-xs block">Attached Files</label>
                      <FieldTooltip content="Mandatory statutory attachments including trade licenses, baseline reports, and environmental permits." example="Statutory_Operating_Permit_2026.pdf">
                        <div className="flex flex-wrap gap-2.5">
                          {(viewingData.attachedFiles && viewingData.attachedFiles.length > 0 ? viewingData.attachedFiles : [{ name: 'Registration_Permit_Doc.pdf', size: '2.4MB', status: 'Completed' }]).map((f: any, i: number) => (
                            <span key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-normal text-slate-800 shadow-xs">
                              <FileText className="w-4 h-4 text-rose-600" />
                              <span className="font-normal">{f.name}</span>
                              <span className="text-slate-400 text-[10px]">{f.size} • <span className="text-emerald-600 font-normal">{f.status}</span></span>
                            </span>
                          ))}
                        </div>
                      </FieldTooltip>
                    </div>

                    {/* Remarks / Description */}
                    <div className="pt-1 text-xs">
                      <label className="block font-bold text-[#336D9F] mb-1.5 text-xs">Remarks / Description</label>
                      <FieldTooltip content="General operational remarks and compliance notes accompanying this facility registration dossier." example="All facility parameters verified and certified." value={viewingData.generalRemarks}>
                        <p className="font-medium text-navy-900 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
                          {viewingData.generalRemarks || 'All facility data, operational parameters, and statutory environmental details have been reviewed and verified for annual registration submission.'}
                        </p>
                      </FieldTooltip>
                    </div>

                    {/* Reviewer Comments Box (inside tab 3) */}
                    <div className="pt-2 text-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#336D9F]" />
                        <label className="font-bold text-[#336D9F] text-xs">Reviewer Comments</label>
                      </div>
                      <FieldTooltip content="Compliance review feedback, audit observations, or correction instructions for the facility operator." example="All baseline documentation verified.">
                        <textarea
                          rows={2}
                          value={reviewerComments}
                          onChange={(e) => setReviewerComments(e.target.value)}
                          placeholder="Enter reviewer comments, feedback, compliance notes, or correction instructions..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] focus:bg-white transition-all font-medium resize-none shadow-2xs"
                        />
                      </FieldTooltip>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MONITORING PLAN */}
          {facilityRecordTab === 'monitoring-plan' && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              {!hasPlan ? (
                /* Empty State: Monitoring Plan Not Created Yet */
                <div className="flex-1 min-h-0 flex items-center justify-center py-10 px-4">
                  <div className="max-w-lg w-full bg-slate-50/70 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs mb-4 text-[#004B87]">
                      <FileText className="w-7 h-7 text-[#004B87]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Monitoring Plan not created yet</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-md">
                      No statutory greenhouse gas emissions monitoring plan has been established for this facility record yet.
                    </p>

                    {isApproved ? (
                      isFacilityOperator ? (
                        <div className="mt-6 flex flex-col items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCreateMonitoringPlan(selectedFacilityId)}
                            className="px-5 py-2.5 bg-gradient-to-r from-[#004B87] to-[#006BB8] hover:from-[#003d6e] hover:to-[#005c9e] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                            title="Create Monitoring Plan"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Create Monitoring Plan</span>
                          </button>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Pre-populates approved facility details into statutory MRV template
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 flex flex-col items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] inline-flex items-center gap-1.5 shadow-2xs">
                            Not Yet Created
                          </span>
                          <p className="text-[11px] text-slate-400 font-medium">
                            Monitoring plan submission pending from facility operator
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="mt-6 px-4 py-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-800 text-xs font-medium inline-flex items-center gap-2 text-left">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Monitoring Plan creation will become available once the facility registration is submitted and approved by EAD.</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Existing Monitoring Plan in Read-Only Mode Matching Creation */
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  {/* Monitoring Plan 6-Sub-Tab Progress Stepper */}
                  <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
                    <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
                      {MONITORING_PLAN_STEPS.map((step, idx) => {
                        const subTabOrder = [
                          'facility-description',
                          'emissions-estimated',
                          'emission-sources',
                          'methane-emission',
                          'source-stream',
                          'supporting-documents-remarks',
                        ];
                        const currentStepNum = subTabOrder.indexOf(viewMonitoringSubTab) + 1;
                        const isActive = step.stepNumber === currentStepNum;
                        const isCompleted = step.stepNumber < currentStepNum;
                        const isArrowHighlighted = idx < currentStepNum - 1;

                        return (
                          <React.Fragment key={step.id}>
                            <button
                              type="button"
                              onClick={() => setViewMonitoringSubTab(step.id as any)}
                              className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                                  : isCompleted
                                  ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                                  isActive
                                    ? 'bg-white text-[#004B87] shadow-2xs'
                                    : isCompleted
                                    ? 'bg-[#00875A] text-white shadow-2xs'
                                    : 'bg-white text-slate-400 border border-slate-300'
                                }`}
                              >
                                <span>{step.stepNumber}</span>
                              </div>
                              <span className="whitespace-nowrap">{step.title}</span>
                            </button>

                            {idx < MONITORING_PLAN_STEPS.length - 1 && (
                              <ChevronRight
                                className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                                  isArrowHighlighted ? 'text-[#004B87] stroke-[2.5]' : 'text-slate-300'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monitoring Plan Sub-Tab Content */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-0.5 text-xs custom-scrollbar">
                    {/* SUB-TAB 2.1: Facility Description */}
                    {viewMonitoringSubTab === 'facility-description' && (
                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Primary Business Sector</label>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={currentPlan.businessSector || viewingData?.reportingSector || 'Energy'}
                              className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-normal text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Primary Activity</label>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={currentPlan.primaryActivity || viewingData?.primaryActivity || 'Combustion of fuels in stationary equipment'}
                              className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-normal text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </div>
                        </div>

                        {/* Primary Production Streams Table */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#336D9F]">Primary Production Streams</span>
                          </div>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                                  <th className="py-2.5 px-3 min-w-[80px]">Product ID</th>
                                  <th className="py-2.5 px-3 min-w-[155px]">Product Category</th>
                                  <th className="py-2.5 px-3 min-w-[200px]">Production Technology/Process</th>
                                  <th className="py-2.5 px-3 min-w-[125px]">Energy Related Emissions?</th>
                                  <th className="py-2.5 px-3 min-w-[125px]">Process Emissions?</th>
                                  <th className="py-2.5 px-3 min-w-[130px]">Production Capacity</th>
                                  <th className="py-2.5 px-3 min-w-[130px]">Production Capacity Unit</th>
                                  <th className="py-2.5 px-3 min-w-[135px]">Actual Production Quantity</th>
                                  <th className="py-2.5 px-3 min-w-[135px]">Actual Production Quantity Unit</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white">
                                {(currentPlan.productionStreams && currentPlan.productionStreams.length > 0) ? (
                                  currentPlan.productionStreams.map((stream: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                      <td className="py-2 px-3 font-mono font-normal text-[#004B87]">{stream.id}</td>
                                      <td className="py-2 px-3 font-normal text-slate-800">{stream.category || 'Primary Products'}</td>
                                      <td className="py-2 px-3 font-normal text-slate-800">{stream.technology}</td>
                                      <td className="py-2 px-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                                          stream.energyRelated === 'Yes' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                          {stream.energyRelated || 'Yes'}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                                          stream.processEmissions === 'Yes' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                          {stream.processEmissions || 'No'}
                                        </span>
                                      </td>
                                      <td className="py-2 px-3 font-mono font-normal text-slate-800">
                                        {stream.capacity || '—'}
                                      </td>
                                      <td className="py-2 px-3 font-normal text-slate-800">
                                        {stream.capacityUnit || '—'}
                                      </td>
                                      <td className="py-2 px-3 font-mono font-normal text-[#004B87]">
                                        {stream.actualQuantity || '—'}
                                      </td>
                                      <td className="py-2 px-3 font-normal text-slate-800">
                                        {stream.actualQuantityUnit || '—'}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={9} className="py-4 px-3 text-center text-slate-400 font-normal italic">
                                      No production streams specified.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2.2: Emissions Estimated */}
                    {viewMonitoringSubTab === 'emissions-estimated' && (
                      <div className="space-y-4 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Estimated Annual Emissions (tCO₂e)</label>
                            <input
                              type="text"
                              readOnly
                              disabled
                              value={currentPlan.emissionsEstimation?.estimatedAnnualEmissions || '142,800'}
                              className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-[#004B87] font-mono font-normal text-xs shadow-2xs cursor-not-allowed select-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Justification for Estimated Value</label>
                          <div className="w-full p-3.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-normal leading-relaxed text-xs shadow-2xs">
                            {currentPlan.emissionsEstimation?.justification || 'Calculated using fiscal gas meter telemetry, continuous gas chromatography, and IPCC 2006 Energy Guidelines (Tier 3 approach).'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2.3: Emission Sources */}
                    {viewMonitoringSubTab === 'emission-sources' && (
                      <div className="space-y-2 pt-1">
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
                              {(currentPlan.emissionSources && currentPlan.emissionSources.length > 0) ? (
                                currentPlan.emissionSources.map((source: any, i: number) => (
                                  <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-3 font-mono font-normal text-[#004B87]">{source.id}</td>
                                    <td className="py-2 px-3 font-normal text-slate-800">{source.name}</td>
                                    <td className="py-2 px-3 font-mono font-normal text-slate-600">{source.associatedProduct || 'P01'}</td>
                                    <td className="py-2 px-3">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-slate-100 text-slate-800 border border-slate-200">
                                        {source.gasTypes || 'CO₂, CH₄, N₂O'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 font-mono font-normal text-[#004B87]">
                                      {source.totalEmissions ? `${Number(String(source.totalEmissions).replace(/,/g, '')).toLocaleString()}` : '—'}
                                    </td>
                                    <td className="py-2 px-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                                        source.energyRelated === 'Yes' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        {source.energyRelated || 'Yes'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                                        source.processEmissions === 'Yes' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
                                      }`}>
                                        {source.processEmissions || 'No'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{source.methodology || 'Calculation-based'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={8} className="py-4 px-3 text-center text-slate-400 font-normal italic">
                                    No emission sources registered.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2.4: Methane Emission */}
                    {viewMonitoringSubTab === 'methane-emission' && (
                      <div className="space-y-4 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-normal ${
                            currentPlan.methaneData?.hasMethaneEmissions !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {currentPlan.methaneData?.hasMethaneEmissions !== false ? 'Yes' : 'No'}
                          </span>
                        </div>

                        {currentPlan.methaneData?.hasMethaneEmissions !== false ? (
                          <div className="pt-2 space-y-4">
                            {/* Row 1: Annual Volume & Estimated CO2e */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                  Annual Volume of methane emissions at site
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  disabled
                                  value={`${currentPlan.methaneData?.annualVolume || '145'} ${currentPlan.methaneData?.annualVolumeUnit || 't CH₄/year'}`}
                                  className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-800 font-normal text-xs shadow-2xs cursor-not-allowed select-none font-mono"
                                />
                              </div>

                              <div>
                                <label className="block text-slate-700 font-semibold mb-1.5 text-xs whitespace-nowrap">
                                  Estimated CO₂e from methane emissions (100-year GWP)
                                </label>
                                <input
                                  type="text"
                                  readOnly
                                  disabled
                                  value={`${currentPlan.methaneData?.estimatedCo2e || '4,060'} ${currentPlan.methaneData?.estimatedCo2eUnit || 't CO₂e/year'}`}
                                  className="w-full px-3.5 py-2 bg-[#F1F5F9] border border-slate-200 rounded-lg text-[#004B87] font-normal text-xs shadow-2xs cursor-not-allowed select-none font-mono"
                                />
                              </div>
                            </div>

                            {/* Row 2: Source of estimates */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Source of estimates, including conversion factors
                              </label>
                              <div className="w-full p-3 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-normal leading-relaxed text-xs shadow-2xs">
                                {currentPlan.methaneData?.sourceOfEstimations || 'Ultrasonic flow meters calibrated semi-annually and component count fugitive estimation (US EPA 453/R-95-017).'}
                              </div>
                            </div>

                            {/* Row 3: Key methane emission sources */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Key methane emission sources at the installation
                              </label>
                              <div className="w-full p-3 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-normal leading-relaxed text-xs shadow-2xs">
                                {currentPlan.methaneData?.keySourcesAtInstallation || 'Compressor shaft seals, high-pressure fuel gas control valves, and flange connections.'}
                              </div>
                            </div>

                            {/* Row 4: Procedures used */}
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs">
                                Procedures used to determine / estimate the quantity of methane emitted
                              </label>
                              <div className="w-full p-3 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-normal leading-relaxed text-xs shadow-2xs">
                                {currentPlan.methaneData?.procedureToDetermine || 'Quarterly Optical Gas Imaging (OGI) inspections using FLIR GF320 cameras with Method 21 bagging verification.'}
                              </div>
                            </div>

                            {/* Row 5: Procedures Table (5 columns matching creation) */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200 table-sticky-columns">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold whitespace-nowrap">
                                    <th className="py-2.5 px-3 min-w-[140px]">Title of Procedure</th>
                                    <th className="py-2.5 px-3 min-w-[190px]">Brief Description including Frequency</th>
                                    <th className="py-2.5 px-3 min-w-[150px]">Person in Charge</th>
                                    <th className="py-2.5 px-3 min-w-[160px]">Contact Email</th>
                                    <th className="py-2.5 px-3 min-w-[140px]">Contact Phone Number</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                  {(currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0) ? (
                                    currentPlan.methaneProcedures.map((proc: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="py-2 px-3 font-normal text-slate-800">{proc.title || 'LDAR Survey'}</td>
                                        <td className="py-2 px-3 font-normal text-slate-700">{proc.description || 'Quarterly leak detection'}</td>
                                        <td className="py-2 px-3 font-normal text-slate-800">{proc.personInCharge || 'Ahmed Al Mansoori'}</td>
                                        <td className="py-2 px-3 font-normal text-slate-600 font-mono text-[11px]">{proc.email || 'ahmed@facility.ae'}</td>
                                        <td className="py-2 px-3 font-normal text-slate-600 font-mono text-[11px]">{proc.phone || '+971 50 123 4567'}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={5} className="py-4 px-3 text-center text-slate-400 font-normal italic">
                                        No methane procedures defined.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 font-normal italic">
                            No significant fugitive or vented methane emissions declared for this facility.
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUB-TAB 2.5: Source Stream */}
                    {viewMonitoringSubTab === 'source-stream' && (
                      <div className="space-y-4 pt-1">
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
                              {(currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0) ? (
                                currentPlan.sourceStreams.map((st: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="py-2 px-3 font-mono font-normal text-[#004B87]">{st.id}</td>
                                    <td className="py-2 px-3 font-normal text-slate-800">{st.description}</td>
                                    <td className="py-2 px-3 font-mono font-normal text-slate-600">{st.associatedSource}</td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{st.classification}</td>
                                    <td className="py-2 px-3 font-mono font-normal text-slate-800">{st.activityLevel || '—'}</td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{st.activityUnit || '—'}</td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{st.fuelType || '—'}</td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{st.combustionDevice || '—'}</td>
                                    <td className="py-2 px-3 font-mono font-normal text-slate-800">{st.deviceCapacity || '—'}</td>
                                    <td className="py-2 px-3 font-normal text-slate-700">{st.metricUnit || '—'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={10} className="py-4 px-3 text-center text-slate-400 font-normal italic">
                                    No source streams defined.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2.6: Supporting Documents & Remarks */}
                    {viewMonitoringSubTab === 'supporting-documents-remarks' && (
                      <div className="space-y-4 pt-1">
                        {/* Supporting Documents */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-[#336D9F]">Calibration & Plan Supporting Documents</span>
                          <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                            {currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? (
                              currentPlan.attachedFiles.map((file: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="border border-slate-200 bg-white rounded-xl py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px]"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-normal text-slate-800 truncate" title={file.name}>
                                      {file.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-normal">
                                      <span>{file.size}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                      <span className="text-emerald-600 font-normal">{file.status || 'Completed'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No files attached yet</span>
                            )}
                          </div>
                        </div>

                        {/* Remarks */}
                        <div className="space-y-1.5 pt-1 text-xs">
                          <label className="block text-xs font-bold text-[#336D9F]">Remarks / Description</label>
                          <div className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-normal leading-relaxed text-xs shadow-2xs">
                            {currentPlan.remarks || 'Monitoring methodology adheres strictly to EAD MRV Guidelines Chapter 4 for Thermal Power Installations.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Row Outside Card */}
        <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          {/* Stepper Next / Back to Overview actions for Data Provider */}
          {isFacilityOperator && (
            facilityRecordTab === 'registration' ? (
              <>
                {viewActiveTab === 'facility-details' && (
                  <button
                    type="button"
                    onClick={() => setViewActiveTab('contact-persons')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {viewActiveTab === 'contact-persons' && (
                  <button
                    type="button"
                    onClick={() => setViewActiveTab('declaration-supporting')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {viewActiveTab === 'declaration-supporting' && (
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Overview</span>
                  </button>
                )}
              </>
            ) : (
              /* Monitoring Plan View Bottom Actions */
              <>
                {viewMonitoringSubTab !== 'supporting-documents-remarks' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const subTabOrder = [
                        'facility-description',
                        'emissions-estimated',
                        'emission-sources',
                        'methane-emission',
                        'source-stream',
                        'supporting-documents-remarks',
                      ];
                      const idx = subTabOrder.indexOf(viewMonitoringSubTab);
                      if (idx < subTabOrder.length - 1) {
                        setViewMonitoringSubTab(subTabOrder[idx + 1] as any);
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Overview</span>
                  </button>
                )}
              </>
            )
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 3: REGISTRATION FORM MODE (When user clicks 'Register New Facility' or 'Edit Registration')
  // =========================================================================
  if (viewMode === 'form') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Hidden file input for Registration */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          multiple
        />

        {/* Navigation Bar Back to Overview & 2 Primary Tabs */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {!formData.facilityId ? (
              /* Initially before Facility ID is created: No tabs, show "New Facility Registration" with Back button and ash Draft chip */
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="p-1 -ml-1 text-[#004B87] hover:text-[#003B6D] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                  title="Back to Overview"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
                  New Facility Registration
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center">
                  Draft
                </span>
              </div>
            ) : (
              /* Once Facility ID is created: Show back button + tabs */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className="p-1 -ml-1 text-[#004B87] hover:text-[#003B6D] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                  title="Back to Overview"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setFacilityRecordTab('registration');
                      setViewMode('form');
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer select-none font-bold bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-xs"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Facility Registration</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFacilityRecordTab('monitoring-plan');
                      handleCreateMonitoringPlan(selectedFacilityId || 'fac-1');
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer select-none font-bold text-slate-600 hover:text-[#004B87] hover:bg-slate-50 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Monitoring Plan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Card Container */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
          {/* Form Tab Navigation Progress Stepper (Corner radius 6px, primary gradient active tab, white background, numbered circles, highlighted arrows) */}
          <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
              {REGISTRATION_STEPS.map((step, idx) => {
                const currentStepNum = formActiveTab === 'facility-details' ? 1 : formActiveTab === 'contact-persons' ? 2 : 3;
                const isActive = step.stepNumber === currentStepNum;
                const isCompleted = step.stepNumber < currentStepNum;
                const isArrowHighlighted = idx < currentStepNum - 1;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => setFormActiveTab(step.id)}
                      className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                        isActive
                          ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                          : isCompleted
                          ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      {/* Numbered Circle */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                          isActive
                            ? 'bg-white text-[#004B87] shadow-2xs'
                            : isCompleted
                            ? 'bg-[#00875A] text-white shadow-2xs'
                            : 'bg-white text-slate-400 border border-slate-300'
                        }`}
                      >
                        <span>{step.stepNumber}</span>
                      </div>

                      {/* Step Title */}
                      <span className="whitespace-nowrap">{step.title}</span>
                    </button>

                    {/* Arrow Indication between steps (Highlighted once finished) */}
                    {idx < REGISTRATION_STEPS.length - 1 && (
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                          isArrowHighlighted
                            ? 'text-[#004B87] stroke-[2.5]'
                            : 'text-slate-300'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-0.5 custom-scrollbar text-xs">
            {/* Tab 1: Facility Details */}
            {formActiveTab === 'facility-details' && (
              <div className="space-y-5">
              {/* Operator Details */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Operator Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Operator Name *
                    </label>
                    <FieldTooltip content="Legal registered commercial entity or operator holding statutory responsibility for facility compliance under EAD regulations." example="Al Noor Energy & Power Operations LLC">
                      <input
                        type="text"
                        value={formData.operatorName}
                        onChange={(e) => handleInputChange('operatorName', e.target.value)}
                        placeholder="e.g. Al Noor Energy LLC"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Registration / License Number *
                    </label>
                    <FieldTooltip content="Official commercial registration or trade license number issued by the Abu Dhabi Department of Economic Development (DED)." format="CN-XXXXXXX-AD" example="CN-1094821-AD">
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="e.g. CN-1094821-AD"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-mono text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Registered Address *
                    </label>
                    <FieldTooltip content="Official registered corporate headquarters address in the United Arab Emirates." example="Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi">
                      <input
                        type="text"
                        value={formData.registeredAddress}
                        onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                        placeholder="e.g. Plot 12, Musaffah, Abu Dhabi"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Correspondence Address
                    </label>
                    <FieldTooltip content="Designated mailing or operational address for official regulatory notices, audit correspondence, and compliance letters." example="P.O. Box 9022, Abu Dhabi, UAE">
                      <input
                        type="text"
                        value={formData.correspondenceAddress}
                        onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                        placeholder="e.g. Same as Registered Address or P.O. Box 9022"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                </div>
              </div>

              {/* Facility Details & Location */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Facility Details & Location</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Facility Name
                    </label>
                    <FieldTooltip content="Official operational name of the physical plant or industrial facility registered in MRV." example="Al Noor Industrial Facility">
                      <input
                        type="text"
                        value={formData.facilityName}
                        onChange={(e) => handleInputChange('facilityName', e.target.value)}
                        placeholder="e.g. Al Noor Cogeneration Plant"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Facility Type
                    </label>
                    <FieldTooltip content="Primary industrial classification and operational activity category of the facility." example="Cogeneration Plant">
                      <select
                        value={formData.facilityType || ''}
                        onChange={(e) => handleInputChange('facilityType', e.target.value)}
                        className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.facilityType ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                      >
                        <option value="" disabled className="text-slate-400">Select Facility Type</option>
                        <option value="Cogeneration Plant" className="text-navy-900">Cogeneration Plant</option>
                        <option value="Manufacturing Plant" className="text-navy-900">Manufacturing Plant</option>
                        <option value="Power Plant" className="text-navy-900">Power Plant</option>
                        <option value="Refinery" className="text-navy-900">Refinery</option>
                        <option value="Chemical Plant" className="text-navy-900">Chemical Plant</option>
                        <option value="Waste-to-Energy Plant" className="text-navy-900">Waste-to-Energy Plant</option>
                        <option value="Heavy Manufacturing Complex" className="text-navy-900">Heavy Manufacturing Complex</option>
                        <option value="Petrochemical Refining Plant" className="text-navy-900">Petrochemical Refining Plant</option>
                        <option value="Utility Power & Desalination" className="text-navy-900">Utility Power & Desalination</option>
                      </select>
                    </FieldTooltip>
                  </div>
                </div>

                {/* Location fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Address
                    </label>
                    <FieldTooltip content="Physical location and street address of the industrial installation or plant." example="Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi">
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="e.g. Sector M-34, Musaffah, Abu Dhabi"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Emirate / Region
                    </label>
                    <FieldTooltip content="Jurisdictional administrative territory of Abu Dhabi Emirate where the facility is located." example="Abu Dhabi">
                      <select
                        value={formData.emirate || ''}
                        onChange={(e) => handleInputChange('emirate', e.target.value)}
                        className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.emirate ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                      >
                        <option value="" disabled className="text-slate-400">Select Emirate / Region</option>
                        <option value="Abu Dhabi" className="text-navy-900">Abu Dhabi</option>
                        <option value="Al Ain" className="text-navy-900">Al Ain</option>
                        <option value="Al Dhafra" className="text-navy-900">Al Dhafra</option>
                      </select>
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Location Coordinates
                    </label>
                    <FieldTooltip content="Geographic GPS centroid coordinates in WGS84 decimal degrees format." format="Latitude, Longitude (Decimal Degrees)" example="24.3644, 54.4988">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.coordinates}
                          onChange={(e) => handleInputChange('coordinates', e.target.value)}
                          placeholder="e.g. 24.3644, 54.4988"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-mono text-xs"
                        />
                        <MapPin className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </FieldTooltip>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="w-fit px-4 h-[32px] bg-[#004B87] hover:bg-[#003B6D] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                      title="Open interactive Leaflet map to pick Abu Dhabi coordinates"
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      <span>Locate on Map</span>
                      <ArrowRight className="w-3 h-3 text-sky-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Environmental Permit */}
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <h4 className="text-xs font-bold text-[#336D9F]">
                    Environmental Permit Available
                  </h4>
                  <FieldTooltip content="Indicates whether the installation possesses an official environmental permit granted by EAD." example="No" className="inline-block w-auto">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold ${!formData.permitAvailable ? 'text-slate-800' : 'text-slate-400'}`}>No</span>
                      <button
                        type="button"
                        onClick={() => handleInputChange('permitAvailable', !formData.permitAvailable)}
                        className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${formData.permitAvailable ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.permitAvailable ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-[11px] font-bold ${formData.permitAvailable ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                    </div>
                  </FieldTooltip>
                </div>

                {formData.permitAvailable ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Environmental Permit Number
                      </label>
                      <FieldTooltip content="Statutory Environmental Operating Permit identifier issued by the Environment Agency – Abu Dhabi (EAD)." format="EAD-EP-YYYY-XXXXXX" example="EAD-EP-2023-7741">
                        <input
                          type="text"
                          value={formData.permitNumber}
                          onChange={(e) => handleInputChange('permitNumber', e.target.value)}
                          placeholder="e.g. EAD-EP-2026-001245"
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-mono text-xs"
                        />
                      </FieldTooltip>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Permit Status
                      </label>
                      <FieldTooltip content="Current operational and legal standing of the facility's statutory environmental permit." example="Active">
                        <select
                          value={formData.permitStatus || ''}
                          onChange={(e) => handleInputChange('permitStatus', e.target.value)}
                          className={`w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs ${!formData.permitStatus ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                        >
                          <option value="" disabled className="text-slate-400">Select Permit Status</option>
                          <option value="Active" className="text-navy-900">Active</option>
                          <option value="Under Review" className="text-navy-900">Under Review</option>
                          <option value="Suspended" className="text-navy-900">Suspended</option>
                        </select>
                      </FieldTooltip>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Permit Issue Date
                      </label>
                      <FieldTooltip content="Official effective issuance date of the statutory environmental operating permit." format="DD-MMM-YYYY" example="15-Jan-2023">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.permitIssueDate}
                            onChange={(e) => handleInputChange('permitIssueDate', e.target.value)}
                            placeholder="e.g. 01-Jan-2026"
                            className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                          />
                          <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </FieldTooltip>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Permit Expiry Date
                      </label>
                      <FieldTooltip content="Expiration date of the current statutory environmental permit before which renewal is mandatory." format="DD-MMM-YYYY" example="14-Jan-2027">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.permitExpiryDate}
                            onChange={(e) => handleInputChange('permitExpiryDate', e.target.value)}
                            placeholder="e.g. 31-Dec-2026"
                            className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                          />
                          <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </FieldTooltip>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs italic">
                    No active statutory environmental permit reported for this facility.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Contact Persons */}
          {formActiveTab === 'contact-persons' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Primary Contact Person */}
              <div className="space-y-3.5 pr-0 lg:pr-8">
                <h4 className="text-xs font-bold text-[#336D9F]">Primary Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Name
                    </label>
                    <FieldTooltip content="Full legal name of the designated primary MRV focal person representing the facility operator." example="Ahmed Al-Zaabi">
                      <input
                        type="text"
                        value={formData.primaryName}
                        onChange={(e) => handleInputChange('primaryName', e.target.value)}
                        placeholder="e.g. Ahmed Al-Zaabi"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Title / Designation
                    </label>
                    <FieldTooltip content="Official corporate position or job title of the primary MRV contact." example="Senior Environmental & Regulatory Compliance Lead">
                      <input
                        type="text"
                        value={formData.primaryTitle}
                        onChange={(e) => handleInputChange('primaryTitle', e.target.value)}
                        placeholder="e.g. Senior Environmental Lead"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Email
                    </label>
                    <FieldTooltip content="Official corporate email address for receiving regulatory approvals, corrections, and compliance alerts." format="name@company.ae" example="ahmed.zaabi@alnoor-energy.ae">
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.primaryEmail}
                          onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                          placeholder="e.g. ahmed.zaabi@example.ae"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                        <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Number
                    </label>
                    <FieldTooltip content="Direct telephone or mobile contact number including UAE international country code (+971)." format="+971 XX XXX XXXX" example="+971 2 698 4400">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.primaryPhone}
                          onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                          placeholder="e.g. +971 50 123 4567"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-mono text-xs"
                        />
                        <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </FieldTooltip>
                  </div>
                </div>
              </div>

              {/* Alternate Contact Person */}
              <div className="space-y-3.5 pt-5 lg:pt-0 lg:pl-8">
                <h4 className="text-xs font-bold text-[#336D9F]">Alternate Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Name
                    </label>
                    <FieldTooltip content="Full legal name of the secondary or technical compliance focal person." example="Eng. Tariq Al-Hashimi">
                      <input
                        type="text"
                        value={formData.alternateName}
                        onChange={(e) => handleInputChange('alternateName', e.target.value)}
                        placeholder="e.g. Eng. Tariq Al-Hashimi"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Title / Designation
                    </label>
                    <FieldTooltip content="Corporate designation of the alternate environmental focal person." example="Environmental Compliance Manager">
                      <input
                        type="text"
                        value={formData.alternateTitle}
                        onChange={(e) => handleInputChange('alternateTitle', e.target.value)}
                        placeholder="e.g. Environmental Manager"
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                      />
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Email
                    </label>
                    <FieldTooltip content="Alternate corporate contact email address." format="name@company.ae" example="tariq.hashimi@alnoor-energy.ae">
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.alternateEmail}
                          onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                          placeholder="e.g. tariq.hashimi@example.ae"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                        />
                        <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </FieldTooltip>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1 text-xs">
                      Number
                    </label>
                    <FieldTooltip content="Alternate contact telephone number." format="+971 XX XXX XXXX" example="+971 50 442 8991">
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.alternatePhone}
                          onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                          placeholder="e.g. +971 50 442 8991"
                          className="w-full pl-3.5 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-mono text-xs"
                        />
                        <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </FieldTooltip>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Declaration & Supporting Documents */}
          {formActiveTab === 'declaration-supporting' && (
            <div className="space-y-5">
              {/* Declaration */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2">
                  Declaration
                </h4>
                <FieldTooltip content="Formal statutory affirmation certifying data veracity under UAE environmental legislation.">
                  <div className="p-3 bg-[#F4F8FC] border border-sky-100 rounded-lg">
                    <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.declarationConfirmed)}
                        onChange={(e) => handleInputChange('declarationConfirmed', e.target.checked)}
                        className="w-4 h-4 rounded text-[#336D9F] focus:ring-[#336D9F]"
                      />
                      <span>I confirm that the information provided is true and accurate</span>
                    </label>
                  </div>
                </FieldTooltip>
              </div>

              {/* Report a Change (Only displayed for approved facilities on update page) */}
              {isFacilityApproved && (
                <div>
                  <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Report a Change</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Change Type
                      </label>
                      <FieldTooltip content="Category of operational, boundary, or organizational modification being registered with EAD." example="Change of Operator">
                        <select
                          value={formData.changeType || ''}
                          onChange={(e) => handleInputChange('changeType', e.target.value)}
                          className={`w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#336D9F] shadow-sm cursor-pointer text-xs ${!formData.changeType ? 'text-slate-400 font-normal' : 'text-navy-900 font-medium'}`}
                        >
                          <option value="" disabled className="text-slate-400">Select Change Type</option>
                          <option value="Change of Operator" className="text-navy-900">Change of Operator</option>
                          <option value="Change of Facility Boundary" className="text-navy-900">Change of Facility Boundary</option>
                          <option value="Change of Fuel / Material Mix" className="text-navy-900">Change of Fuel / Material Mix</option>
                          <option value="Operational Capacity Modification" className="text-navy-900">Operational Capacity Modification</option>
                        </select>
                      </FieldTooltip>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Effective Date
                      </label>
                      <FieldTooltip content="Date on which the reported operational or organizational change becomes active." format="DD-MMM-YYYY" example="01-Jan-2026">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.changeEffectiveDate || ''}
                            onChange={(e) => handleInputChange('changeEffectiveDate', e.target.value)}
                            placeholder="e.g. 01-Jan-2026"
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-sm font-medium"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </FieldTooltip>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Change Description
                    </label>
                    <FieldTooltip content="Detailed technical explanation and impact summary of the operational or capacity change." example="Expansion of turbine capacity from 120MW to 180MW">
                      <textarea
                        rows={2}
                        value={formData.changeDescription !== undefined ? formData.changeDescription : ''}
                        onChange={(e) => handleInputChange('changeDescription', e.target.value)}
                        placeholder="e.g. Brief description of operational or capacity changes..."
                        className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-sm leading-relaxed"
                      />
                    </FieldTooltip>
                  </div>
                </div>
              )}

              {/* Supporting Documents Upload */}
              <div>
                <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">
                  Supporting Documents
                </h4>
                <FieldTooltip content="Upload official statutory attachments including trade licenses, EAD permits, process flow diagrams, or validation certificates." format="PDF, PNG, JPG (Max 25MB)">
                  <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                    {/* Upload Input Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 rounded-lg px-4 py-2 flex items-center justify-between gap-3 shrink-0 cursor-pointer transition-colors min-w-[280px]"
                    >
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                        <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="whitespace-nowrap">Drag and drop files here or upload</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
                      >
                        Upload
                      </button>
                    </div>

                    {/* Remaining area: Uploaded documents in one line */}
                    <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                      {formData.attachedFiles && formData.attachedFiles.length > 0 ? (
                        formData.attachedFiles.map((file: any, idx: number) => (
                          <div
                            key={idx}
                            className="border border-slate-200 bg-white rounded-lg py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px] hover:border-slate-300 transition-all"
                          >
                            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-rose-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                                {file.name}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                                <span>{file.size}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-bold">{file.status || 'Completed'}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleInputChange(
                                  'attachedFiles',
                                  (formData.attachedFiles || []).filter((_: any, i: number) => i !== idx)
                                )
                              }
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                              title="Remove file"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No files attached yet</span>
                      )}
                    </div>
                  </div>
                </FieldTooltip>
              </div>

              {/* Remarks / Description (At last in Declaration & Supporting Documents tab) */}
              <div>
                <label className="block font-bold text-[#336D9F] mb-1.5 text-xs">
                  Remarks / Description
                </label>
                <FieldTooltip content="Optional notes or supplementary information for the EAD reviewing officer." example="All parameters verified in accordance with EAD statutory permit.">
                  <textarea
                    rows={3}
                    value={formData.generalRemarks}
                    onChange={(e) => handleInputChange('generalRemarks', e.target.value)}
                    placeholder="All facility data, operational parameters, and statutory environmental details have been reviewed and verified for annual registration submission."
                    className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-sm leading-relaxed"
                  />
                </FieldTooltip>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Role-Based Bottom Action Bar (Outside the white frame) */}
      <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setViewMode('table')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Save Draft</span>
        </button>

        {isFacilityOperator && (
          <>
            {formActiveTab === 'facility-details' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('contact-persons')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'contact-persons' && (
              <button
                type="button"
                onClick={() => setFormActiveTab('declaration-supporting')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {formActiveTab === 'declaration-supporting' && (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                disabled={!formData.declarationConfirmed}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all select-none ${
                  !formData.declarationConfirmed
                    ? 'bg-[#DFE7EF] text-[#64748B] border border-[#CBD5E1] shadow-2xs cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] cursor-pointer active:scale-95'
                }`}
                title={
                  !formData.declarationConfirmed
                    ? 'Please check the declaration checkbox above to enable submission'
                    : 'Submit registration'
                }
              >
                <span>Submit Registration</span>
                <Send className="w-3.5 h-3.5 fill-current opacity-80" />
              </button>
            )}
          </>
        )}
      </div>

        {/* Interactive Leaflet GIS Location Modal (Abu Dhabi default) */}
        <LocationMapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          initialCoordinates={formData.coordinates || viewingData?.coordinates || '24.3644, 54.4988'}
          facilityName={formData.facilityName || viewingData?.facilityName || 'Facility Location'}
          facilityAddress={formData.address || viewingData?.address || 'Abu Dhabi, UAE'}
          onSelectCoordinates={(coords) => handleInputChange('coordinates', coords)}
        />
      </div>
    );
  }

  // =========================================================================
  // RENDER 4: MONITORING PLAN FORM MODE (When user clicks 'Create Plan' or edits plan)
  // =========================================================================
  const monitoringFacilityName =
    activeFacility?.name ||
    formData.facilityName ||
    facilityRegistrations[selectedFacilityId]?.facilityName ||
    'Facility';

  const monitoringFacilityId =
    activeFacility?.facilityCode ||
    formData.facilityId ||
    facilityRegistrations[selectedFacilityId]?.facilityId ||
    '';

  const currentPlan = facilityPlans[selectedFacilityId] || INITIAL_FACILITY_MONITORING_PLANS[selectedFacilityId] || {
    facilityName: monitoringFacilityName,
    facilityId: monitoringFacilityId || selectedFacilityId,
    planRef: `MP-2026-${(monitoringFacilityId || selectedFacilityId).replace(/[^0-9]/g, '').slice(-4) || '0891'}`,
    reportingYear: '2026',
    planVersion: 'V1',
    status: 'Draft',
    primaryApproach: 'Calculation-based (Tier 3)',
    productionStreams: [
      { id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }
    ],
    emissionsEstimation: {
      estimatedAnnualEmissions: '50,000',
      justification: 'Calculated using fuel consumption records and standard IPCC emissions factors.'
    },
    emissionSources: [
      { id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }
    ],
    methaneData: {
      hasMethaneEmissions: true,
      annualVolume: '',
      annualVolumeUnit: 't CH₄/year',
      estimatedCo2e: '',
      estimatedCo2eUnit: 't CO₂e/year',
      sourceOfEstimations: '',
      keySourcesAtInstallation: '',
      procedureToDetermine: ''
    },
    methaneProcedures: [
      { id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }
    ],
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
        metricUnit: 'MW'
      }
    ],
    attachedFiles: [],
    remarks: '',
  };

  const monitoringPlanStatus = facilityMonitoringPlanStatuses[selectedFacilityId] || currentPlan.status || 'Draft';

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
      {/* Hidden file input for Monitoring Plan */}
      <input
        type="file"
        ref={planFileInputRef}
        onChange={handleMonitoringPlanFileUpload}
        className="hidden"
        multiple
      />

      {/* Navigation Bar Header: Monitoring Plan Title & To be Submitted Chip */}
      <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className="p-1 -ml-1 text-[#004B87] hover:text-[#003B6D] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-[18px] font-bold font-display text-[#004B87] tracking-tight">
              Monitoring Plan
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-[#E0EEFA] text-[#004B87] border border-sky-200/80 inline-flex items-center">
              To be Submitted
            </span>
          </div>
        </div>
      </div>

      {/* Facility Name, Facility ID & Calendar Year Row (Outside White Frame) */}
      <div className="flex-shrink-0 mb-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Facility Name
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={monitoringFacilityName}
              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs shadow-2xs cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Facility ID
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={monitoringFacilityId || 'FAC-EAD-2026-0891'}
              className="w-full px-3 py-1.5 bg-[#F1F5F9] border border-slate-200 rounded-lg text-[#004B87] font-mono font-bold text-xs shadow-2xs cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">
              Calendar Year
            </label>
            <div className="relative">
              <select
                value={currentPlan.reportingYear || '2026'}
                onChange={(e) => updateCurrentPlan((p: any) => ({ ...p, reportingYear: e.target.value }))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-bold text-xs shadow-2xs focus:outline-none focus:border-[#004B87] cursor-pointer appearance-none"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-4 flex flex-col overflow-hidden">
        {/* Editable Monitoring Plan Form */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {/* 6-Sub-Tab Progress Stepper */}
          <div className="flex-shrink-0 flex items-center pb-3 mb-1 overflow-x-auto no-scrollbar">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-[6px] shadow-2xs">
                    {MONITORING_PLAN_STEPS.map((step, idx) => {
                      const subTabOrder = [
                        'facility-description',
                        'emissions-estimated',
                        'emission-sources',
                        'methane-emission',
                        'source-stream',
                        'supporting-documents-remarks',
                      ];
                      const currentStepNum = subTabOrder.indexOf(editMonitoringSubTab) + 1;
                      const isActive = step.stepNumber === currentStepNum;
                      const isCompleted = step.stepNumber < currentStepNum;
                      const isArrowHighlighted = idx < currentStepNum - 1;

                      return (
                        <React.Fragment key={step.id}>
                          <button
                            type="button"
                            onClick={() => setEditMonitoringSubTab(step.id as any)}
                            className={`px-3.5 py-1.5 rounded-[6px] text-xs transition-all flex items-center gap-2 cursor-pointer select-none ${
                              isActive
                                ? 'bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white font-bold shadow-xs'
                                : isCompleted
                                ? 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50 font-semibold'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${
                                isActive
                                  ? 'bg-white text-[#004B87] shadow-2xs'
                                  : isCompleted
                                  ? 'bg-[#00875A] text-white shadow-2xs'
                                  : 'bg-white text-slate-400 border border-slate-300'
                              }`}
                            >
                              <span>{step.stepNumber}</span>
                            </div>
                            <span className="whitespace-nowrap">{step.title}</span>
                          </button>

                          {idx < MONITORING_PLAN_STEPS.length - 1 && (
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 mx-0.5 transition-colors ${
                                isArrowHighlighted ? 'text-[#004B87] stroke-[2.5]' : 'text-slate-300'
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Sub-Tab Editable Form Content */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2.5 pt-1 pb-0.5 text-xs custom-scrollbar">
                  {/* SUB-TAB 1: Facility Description */}
                  {editMonitoringSubTab === 'facility-description' && (
                    <div className="space-y-4 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-slate-700 font-semibold text-xs">Primary Business Sector</label>
                            {isMonitoringCustomSector && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMonitoringCustomSector(false);
                                  updateCurrentPlan((p: any) => ({ ...p, businessSector: 'Energy' }));
                                }}
                                className="text-[10px] font-semibold text-[#004B87] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Select list</span>
                              </button>
                            )}
                          </div>
                          {isMonitoringCustomSector ? (
                            <input
                              type="text"
                              value={currentPlan.businessSector === 'Other' ? '' : (currentPlan.businessSector || '')}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p: any) => ({ ...p, businessSector: val }));
                              }}
                              placeholder="Enter custom business sector..."
                              autoFocus
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs text-xs font-medium"
                            />
                          ) : (
                            <select
                              value={currentPlan.businessSector || formData.reportingSector || 'Energy'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'Other') {
                                  setIsMonitoringCustomSector(true);
                                  updateCurrentPlan((p: any) => ({ ...p, businessSector: '' }));
                                } else {
                                  updateCurrentPlan((p: any) => ({ ...p, businessSector: val }));
                                }
                              }}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer text-xs"
                            >
                              <option value="Energy">Energy</option>
                              <option value="Industrial Processes">Industrial Processes</option>
                              <option value="Manufacturing">Manufacturing</option>
                              <option value="Mining & Minerals">Mining & Minerals</option>
                              <option value="Waste">Waste</option>
                              <option value="Other">Other (Enter custom sector)</option>
                            </select>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-slate-700 font-semibold text-xs">Primary Activity</label>
                            {isMonitoringCustomActivity && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMonitoringCustomActivity(false);
                                  updateCurrentPlan((p: any) => ({ ...p, primaryActivity: 'Combustion of fuels in stationary equipment' }));
                                }}
                                className="text-[10px] font-semibold text-[#004B87] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Select list</span>
                              </button>
                            )}
                          </div>
                          {isMonitoringCustomActivity ? (
                            <input
                              type="text"
                              value={currentPlan.primaryActivity === 'Other' ? '' : (currentPlan.primaryActivity || '')}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p: any) => ({ ...p, primaryActivity: val }));
                              }}
                              placeholder="Enter custom primary activity..."
                              autoFocus
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs text-xs font-medium"
                            />
                          ) : (
                            <select
                              value={currentPlan.primaryActivity || formData.primaryActivity || 'Combustion of fuels in stationary equipment'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === 'Other') {
                                  setIsMonitoringCustomActivity(true);
                                  updateCurrentPlan((p: any) => ({ ...p, primaryActivity: '' }));
                                } else {
                                  updateCurrentPlan((p: any) => ({ ...p, primaryActivity: val }));
                                }
                              }}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer text-xs font-medium"
                            >
                              <option value="Combustion of fuels in stationary equipment">Combustion of fuels in stationary equipment</option>
                              <option value="Manufacturing of cement / clinker">Manufacturing of cement / clinker</option>
                              <option value="Direct reduced iron & steelmaking">Direct reduced iron & steelmaking</option>
                              <option value="Petrochemical cracking & refining">Petrochemical cracking & refining</option>
                              <option value="Solid waste thermal treatment">Solid waste thermal treatment</option>
                              <option value="Other">Other (Enter custom activity)</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Primary Production Streams */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#336D9F]">Primary Production Streams</span>
                        </div>

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
                              {(currentPlan.productionStreams && currentPlan.productionStreams.length > 0
                                ? currentPlan.productionStreams
                                : [
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
                                  ]
                              ).map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      placeholder="P01"
                                      value={row.id || `P0${idx + 1}`}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], id: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.category || 'Primary Products'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], category: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[145px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                    >
                                      <option value="">Select category</option>
                                      <option value="Primary Products">Primary Products</option>
                                      <option value="Secondary Products">Secondary Products</option>
                                      <option value="By-Products">By-Products</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      placeholder="Enter technology/process"
                                      value={row.technology !== undefined ? row.technology : 'Standard Process Unit'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], technology: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.energyRelated || 'Yes'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], energyRelated: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                    >
                                      <option value="">Select...</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.processEmissions || 'No'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], processEmissions: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                    >
                                      <option value="">Select...</option>
                                      <option value="Yes">Yes</option>
                                      <option value="No">No</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      placeholder="100,000"
                                      value={row.capacity !== undefined ? row.capacity : '100,000'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], capacity: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.capacityUnit || 't/year'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], capacityUnit: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                    >
                                      <option value="">Select unit</option>
                                      <option value="t/year">t/year</option>
                                      <option value="MWh/year">MWh/year</option>
                                      <option value="t/day">t/day</option>
                                      <option value="Nm³/year">Nm³/year</option>
                                      <option value="MW">MW</option>
                                      <option value="kg/year">kg/year</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      placeholder="85,000"
                                      value={row.actualQuantity !== undefined ? row.actualQuantity : '85,000'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], actualQuantity: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[120px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                    />
                                  </td>
                                  <td className="py-2 px-3">
                                    <select
                                      value={row.actualQuantityUnit || 't/year'}
                                      onChange={(e) => {
                                        const streams = currentPlan.productionStreams || [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                        const copy = [...streams];
                                        copy[idx] = { ...copy[idx], actualQuantityUnit: e.target.value };
                                        updateCurrentPlan((p: any) => ({ ...p, productionStreams: copy }));
                                      }}
                                      className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                    >
                                      <option value="">Select unit</option>
                                      <option value="t/year">t/year</option>
                                      <option value="MWh/year">MWh/year</option>
                                      <option value="t/day">t/day</option>
                                      <option value="Nm³/year">Nm³/year</option>
                                      <option value="MW">MW</option>
                                      <option value="kg/year">kg/year</option>
                                    </select>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    {idx === 0 ? (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const streams = currentPlan.productionStreams && currentPlan.productionStreams.length > 0
                                            ? currentPlan.productionStreams
                                            : [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                          const nextId = `P${String(streams.length + 1).padStart(2, '0')}`;
                                          updateCurrentPlan((p: any) => ({
                                            ...p,
                                            productionStreams: [
                                              ...streams,
                                              {
                                                id: nextId,
                                                category: 'Primary Products',
                                                technology: '',
                                                energyRelated: 'Yes',
                                                processEmissions: 'No',
                                                capacity: '',
                                                capacityUnit: 't/year',
                                                actualQuantity: '',
                                                actualQuantityUnit: 't/year',
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
                                          const streams = currentPlan.productionStreams && currentPlan.productionStreams.length > 0
                                            ? currentPlan.productionStreams
                                            : [{ id: 'P01', category: 'Primary Products', technology: 'Standard Process Unit', energyRelated: 'Yes', processEmissions: 'No', capacity: '100,000', capacityUnit: 't/year', actualQuantity: '85,000', actualQuantityUnit: 't/year' }];
                                          updateCurrentPlan((p: any) => ({
                                            ...p,
                                            productionStreams: streams.filter((_: any, i: number) => i !== idx),
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
                  )}

                  {/* SUB-TAB 2: Emissions Estimated */}
                  {editMonitoringSubTab === 'emissions-estimated' && (
                    <div className="space-y-4 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Estimated Annual Emissions (tCO₂e)</label>
                          <input
                            type="text"
                            value={currentPlan.emissionsEstimation?.estimatedAnnualEmissions || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentPlan((p: any) => ({
                                ...p,
                                emissionsEstimation: { ...(p.emissionsEstimation || {}), estimatedAnnualEmissions: val }
                              }));
                            }}
                            placeholder="50,000"
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-navy-900 font-mono font-bold focus:outline-none focus:border-[#004B87] shadow-xs text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Justification for Estimated Value</label>
                        <textarea
                          rows={4}
                          value={currentPlan.emissionsEstimation?.justification || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateCurrentPlan((p: any) => ({
                              ...p,
                              emissionsEstimation: { ...(p.emissionsEstimation || {}), justification: val }
                            }));
                          }}
                          placeholder="Calculated using fuel consumption records and standard IPCC emissions factors."
                          className="w-full p-3 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: Emission Sources */}
                  {editMonitoringSubTab === 'emission-sources' && (
                    <div className="space-y-2 pt-1">
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
                            {(currentPlan.emissionSources && currentPlan.emissionSources.length > 0
                              ? currentPlan.emissionSources
                              : [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }]
                            ).map((row: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    placeholder="S01"
                                    value={row.id || `S0${idx + 1}`}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], id: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[65px] px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono text-xs text-center"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.name !== undefined ? row.name : 'Main Boiler / Combustion Unit'}
                                    placeholder="e.g. Main Boiler / Combustion Unit"
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], name: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[190px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.associatedProduct || 'P01'}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], associatedProduct: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                                  >
                                    {(currentPlan.productionStreams && currentPlan.productionStreams.length > 0
                                      ? currentPlan.productionStreams
                                      : [{ id: 'P01' }]
                                    ).map((ps: any) => (
                                      <option key={ps.id} value={ps.id}>{ps.id}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.gasTypes || 'CO₂, CH₄, N₂O'}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], gasTypes: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                  >
                                    <option value="">Select gas types</option>
                                    <option value="CO₂">CO₂</option>
                                    <option value="CH₄">CH₄</option>
                                    <option value="N₂O">N₂O</option>
                                    <option value="CO₂, CH₄">CO₂, CH₄</option>
                                    <option value="CO₂, CH₄, N₂O">CO₂, CH₄, N₂O</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.totalEmissions !== undefined ? row.totalEmissions : '50,000'}
                                    placeholder="50,000"
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], totalEmissions: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.energyRelated || 'Yes'}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], energyRelated: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                  >
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.processEmissions || 'No'}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], processEmissions: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[90px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
                                  >
                                    <option value="">Select...</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.methodology || 'Calculation-based'}
                                    onChange={(e) => {
                                      const sources = currentPlan.emissionSources || [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                      const copy = [...sources];
                                      copy[idx] = { ...copy[idx], methodology: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, emissionSources: copy }));
                                    }}
                                    className="w-full min-w-[155px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer"
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
                                      onClick={() => {
                                        const sources = currentPlan.emissionSources && currentPlan.emissionSources.length > 0
                                          ? currentPlan.emissionSources
                                          : [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                        const nextId = `S${String(sources.length + 1).padStart(2, '0')}`;
                                        updateCurrentPlan((p: any) => ({
                                          ...p,
                                          emissionSources: [
                                            ...sources,
                                            {
                                              id: nextId,
                                              name: '',
                                              associatedProduct: (currentPlan.productionStreams?.[0]?.id) || 'P01',
                                              gasTypes: 'CO₂, CH₄, N₂O',
                                              totalEmissions: '',
                                              energyRelated: 'Yes',
                                              processEmissions: 'No',
                                              methodology: 'Calculation-based',
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
                                        const sources = currentPlan.emissionSources && currentPlan.emissionSources.length > 0
                                          ? currentPlan.emissionSources
                                          : [{ id: 'S01', name: 'Main Boiler / Combustion Unit', associatedProduct: 'P01', gasTypes: 'CO₂, CH₄, N₂O', totalEmissions: '50,000', energyRelated: 'Yes', processEmissions: 'No', methodology: 'Calculation-based' }];
                                        updateCurrentPlan((p: any) => ({
                                          ...p,
                                          emissionSources: sources.filter((_: any, i: number) => i !== idx),
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
                  )}

                  {/* SUB-TAB 4: Methane Emission */}
                  {editMonitoringSubTab === 'methane-emission' && (
                    <div className="space-y-4 pt-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-700">Do methane emissions occur at your facility?</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${currentPlan.methaneData?.hasMethaneEmissions ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateCurrentPlan((p: any) => ({
                                ...p,
                                methaneData: { ...(p.methaneData || {}), hasMethaneEmissions: !p.methaneData?.hasMethaneEmissions }
                              }));
                            }}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${currentPlan.methaneData?.hasMethaneEmissions ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentPlan.methaneData?.hasMethaneEmissions ? 'translate-x-0' : 'translate-x-5'}`} />
                          </button>
                          <span className={`text-xs font-bold ${!currentPlan.methaneData?.hasMethaneEmissions ? 'text-slate-700' : 'text-slate-400'}`}>No</span>
                        </div>
                      </div>

                      {currentPlan.methaneData?.hasMethaneEmissions && (
                        <div className="pt-2 space-y-4">
                          {/* Row 1: Annual Volume & Estimated CO2e */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Annual Volume of methane emissions at site">
                                Annual Volume of methane emissions at site
                              </label>
                              <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                                <input
                                  type="text"
                                  placeholder="If no known emissions, enter N/A"
                                  value={currentPlan.methaneData.annualVolume || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateCurrentPlan((p: any) => ({
                                      ...p,
                                      methaneData: { ...p.methaneData, annualVolume: val },
                                    }));
                                  }}
                                  className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                                <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                                  <select
                                    value={currentPlan.methaneData.annualVolumeUnit || 't CH₄/year'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateCurrentPlan((p: any) => ({
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
                              <label className="block text-slate-700 font-semibold mb-1.5 text-xs whitespace-nowrap" title="Estimated CO₂e from methane emissions (100-year GWP)">
                                Estimated CO₂e from methane emissions (100-year GWP)
                              </label>
                              <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs focus-within:border-[#004B87]">
                                <input
                                  type="text"
                                  placeholder="Use the IPCC Fifth Assessment Report (AR5) GWP-100 values"
                                  value={currentPlan.methaneData.estimatedCo2e || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateCurrentPlan((p: any) => ({
                                      ...p,
                                      methaneData: { ...p.methaneData, estimatedCo2e: val },
                                    }));
                                  }}
                                  className="flex-1 px-3.5 py-2 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                                <div className="border-l border-slate-200 bg-slate-50/50 px-2 flex items-center">
                                  <select
                                    value={currentPlan.methaneData.estimatedCo2eUnit || 't CO₂e/year'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateCurrentPlan((p: any) => ({
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

                          {/* Row 2: Source of estimates */}
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Source of estimates, including conversion factors">
                              Source of estimates, including conversion factors
                            </label>
                            <textarea
                              rows={2}
                              value={currentPlan.methaneData.sourceOfEstimations || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p: any) => ({
                                  ...p,
                                  methaneData: { ...p.methaneData, sourceOfEstimations: val },
                                }));
                              }}
                              placeholder="Enter the source of estimates, including conversion factors."
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                            />
                          </div>

                          {/* Row 3: Key methane emission sources */}
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Key methane emission sources at the installation">
                              Key methane emission sources at the installation
                            </label>
                            <textarea
                              rows={2}
                              value={currentPlan.methaneData.keySourcesAtInstallation || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p: any) => ({
                                  ...p,
                                  methaneData: { ...p.methaneData, keySourcesAtInstallation: val },
                                }));
                              }}
                              placeholder="Provide details of the key emission sources and, where applicable, the source stream type."
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
                            />
                          </div>

                          {/* Row 4: Procedures used */}
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1.5 text-xs" title="Procedures used to determine / estimate the quantity of methane emitted">
                              Procedures used to determine / estimate the quantity of methane emitted
                            </label>
                            <textarea
                              rows={2}
                              value={currentPlan.methaneData.procedureToDetermine || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateCurrentPlan((p: any) => ({
                                  ...p,
                                  methaneData: { ...p.methaneData, procedureToDetermine: val },
                                }));
                              }}
                              placeholder="Include relevant literature, laboratory analyses, or other methods used."
                              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-navy-900 focus:outline-none focus:border-[#004B87] shadow-xs leading-relaxed text-xs placeholder-slate-400"
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
                                        value={proc.title || ''}
                                        onChange={(e) => {
                                          const procs = currentPlan.methaneProcedures || [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                          const copy = [...procs];
                                          copy[idx] = { ...copy[idx], title: e.target.value };
                                          updateCurrentPlan((p: any) => ({ ...p, methaneProcedures: copy }));
                                        }}
                                        placeholder="e.g. LDAR"
                                        className="w-full min-w-[130px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={proc.description || ''}
                                        onChange={(e) => {
                                          const procs = currentPlan.methaneProcedures || [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                          const copy = [...procs];
                                          copy[idx] = { ...copy[idx], description: e.target.value };
                                          updateCurrentPlan((p: any) => ({ ...p, methaneProcedures: copy }));
                                        }}
                                        placeholder="e.g. Semi-annual inspection"
                                        className="w-full min-w-[180px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={proc.personInCharge || ''}
                                        onChange={(e) => {
                                          const procs = currentPlan.methaneProcedures || [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                          const copy = [...procs];
                                          copy[idx] = { ...copy[idx], personInCharge: e.target.value };
                                          updateCurrentPlan((p: any) => ({ ...p, methaneProcedures: copy }));
                                        }}
                                        placeholder="e.g. Ahmed Al Mansoori"
                                        className="w-full min-w-[140px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="email"
                                        value={proc.email || ''}
                                        onChange={(e) => {
                                          const procs = currentPlan.methaneProcedures || [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                          const copy = [...procs];
                                          copy[idx] = { ...copy[idx], email: e.target.value };
                                          updateCurrentPlan((p: any) => ({ ...p, methaneProcedures: copy }));
                                        }}
                                        placeholder="e.g. ahmed@gmcf.ae"
                                        className="w-full min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={proc.phone || ''}
                                        onChange={(e) => {
                                          const procs = currentPlan.methaneProcedures || [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                          const copy = [...procs];
                                          copy[idx] = { ...copy[idx], phone: e.target.value };
                                          updateCurrentPlan((p: any) => ({ ...p, methaneProcedures: copy }));
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
                                            const procs = currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0
                                              ? currentPlan.methaneProcedures
                                              : [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                            updateCurrentPlan((p: any) => ({
                                              ...p,
                                              methaneProcedures: [
                                                ...procs,
                                                {
                                                  id: String(procs.length + 1),
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
                                            const procs = currentPlan.methaneProcedures && currentPlan.methaneProcedures.length > 0
                                              ? currentPlan.methaneProcedures
                                              : [{ id: '1', title: '', description: '', personInCharge: '', email: '', phone: '' }];
                                            updateCurrentPlan((p: any) => ({
                                              ...p,
                                              methaneProcedures: procs.filter((_: any, i: number) => i !== idx),
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
                  )}

                  {/* SUB-TAB 5: Source Stream */}
                  {editMonitoringSubTab === 'source-stream' && (
                    <div className="space-y-4 pt-1">
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
                            {(currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                              ? currentPlan.sourceStreams
                              : [
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
                                    metricUnit: 'MW'
                                  }
                                ]
                            ).map((row: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.id}
                                    title={row.id || 'Source Stream ID'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], id: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
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
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], description: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
                                    }}
                                    placeholder="Enter description"
                                    className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.associatedSource || 'S01'}
                                    title={row.associatedSource || 'Select source'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], associatedSource: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
                                    }}
                                    className="w-full min-w-[85px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87] cursor-pointer font-mono"
                                  >
                                    <option value="" title="Select source">Select...</option>
                                    {(currentPlan.emissionSources && currentPlan.emissionSources.length > 0
                                      ? currentPlan.emissionSources
                                      : [{ id: 'S01' }]
                                    ).map((es: any) => (
                                      <option key={es.id} value={es.id} title={es.id}>{es.id}</option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.classification || 'Fuel Combusted'}
                                    title={row.classification || 'Select classification'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], classification: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
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
                                    value={row.activityLevel !== undefined ? row.activityLevel : '25,000,000'}
                                    title={row.activityLevel ? `${row.activityLevel} ${row.activityUnit || ''}` : 'Enter activity level'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], activityLevel: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
                                    }}
                                    placeholder="25,000,000"
                                    className="w-full min-w-[110px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.activityUnit || 'Nm³'}
                                    title={row.activityUnit || 'Select unit'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], activityUnit: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
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
                                    value={row.fuelType || 'Natural gas'}
                                    title={row.fuelType || 'Select fuel type'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], fuelType: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
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
                                    value={row.combustionDevice !== undefined ? row.combustionDevice : 'Industrial Boiler'}
                                    title={row.combustionDevice || 'Enter combustion device/technology'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], combustionDevice: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
                                    }}
                                    placeholder="Industrial Boiler"
                                    className="w-full min-w-[160px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="text"
                                    value={row.deviceCapacity !== undefined ? row.deviceCapacity : '35.0'}
                                    title={row.deviceCapacity ? `${row.deviceCapacity} ${row.metricUnit || ''}` : 'Enter device capacity'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], deviceCapacity: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
                                    }}
                                    placeholder="35.0"
                                    className="w-full min-w-[100px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.metricUnit || 'MW'}
                                    title={row.metricUnit || 'Select unit'}
                                    onChange={(e) => {
                                      const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                        ? currentPlan.sourceStreams
                                        : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                      const copy = [...streams];
                                      copy[idx] = { ...copy[idx], metricUnit: e.target.value };
                                      updateCurrentPlan((p: any) => ({ ...p, sourceStreams: copy }));
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
                                        const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                          ? currentPlan.sourceStreams
                                          : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                        const nextId = `FC${streams.length + 1}`;
                                        updateCurrentPlan((p: any) => ({
                                          ...p,
                                          sourceStreams: [
                                            ...streams,
                                            {
                                              id: nextId,
                                              description: '',
                                              associatedSource: 'S01',
                                              classification: 'Fuel Combusted',
                                              activityLevel: '',
                                              activityUnit: 'Nm³',
                                              fuelType: 'Natural gas',
                                              combustionDevice: '',
                                              deviceCapacity: '',
                                              metricUnit: 'MW'
                                            }
                                          ]
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
                                        const streams = currentPlan.sourceStreams && currentPlan.sourceStreams.length > 0
                                          ? currentPlan.sourceStreams
                                          : [{ id: 'FC1', description: 'Natural Gas Feed', associatedSource: 'S01', classification: 'Fuel Combusted', activityLevel: '25,000,000', activityUnit: 'Nm³', fuelType: 'Natural gas', combustionDevice: 'Industrial Boiler', deviceCapacity: '35.0', metricUnit: 'MW' }];
                                        updateCurrentPlan((p: any) => ({
                                          ...p,
                                          sourceStreams: streams.filter((_: any, i: number) => i !== idx)
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
                  )}

                  {/* SUB-TAB 6: Supporting Documents & Remarks */}
                  {editMonitoringSubTab === 'supporting-documents-remarks' && (
                    <div className="space-y-4 pt-1">
                      {/* Supporting Documents */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#336D9F]">Calibration & Plan Supporting Documents</span>
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                          <div
                            onClick={() => planFileInputRef.current?.click()}
                            className="border border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 rounded-xl px-4 py-2 flex items-center justify-between gap-3 shrink-0 cursor-pointer transition-colors min-w-[280px]"
                          >
                            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                              <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="whitespace-nowrap">Upload Calibration / Methodology Plan</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                planFileInputRef.current?.click();
                              }}
                              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
                            >
                              Upload
                            </button>
                          </div>

                          <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                            {currentPlan.attachedFiles && currentPlan.attachedFiles.length > 0 ? (
                              currentPlan.attachedFiles.map((file: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="border border-slate-200 bg-white rounded-xl py-1.5 px-3 flex items-center gap-2.5 shadow-2xs shrink-0 max-w-[240px] hover:border-slate-300 transition-all"
                                >
                                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-normal text-slate-800 truncate" title={file.name}>
                                      {file.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-normal">
                                      <span>{file.size}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                      <span className="text-emerald-600 font-normal">{file.status || 'Completed'}</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateCurrentPlan((p: any) => ({
                                        ...p,
                                        attachedFiles: (p.attachedFiles || []).filter((_: any, i: number) => i !== idx)
                                      }))
                                    }
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer shrink-0"
                                    title="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No files attached yet</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="space-y-1.5 pt-1 text-xs">
                        <label className="block text-xs font-bold text-[#336D9F]">Remarks / Description</label>
                        <textarea
                          rows={3}
                          value={currentPlan.remarks || ''}
                          onChange={(e) => updateCurrentPlan((p: any) => ({ ...p, remarks: e.target.value }))}
                          placeholder="Enter remarks or statutory compliance notes for this monitoring plan..."
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Monitoring Plan Bottom Action Bar (Outside the white card) */}
            <div className="flex-shrink-0 pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSaveMonitoringPlanDraft}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Save Draft</span>
              </button>

              {editMonitoringSubTab !== 'supporting-documents-remarks' ? (
                <button
                  type="button"
                  onClick={() => {
                    const subTabOrder = [
                      'facility-description',
                      'emissions-estimated',
                      'emission-sources',
                      'methane-emission',
                      'source-stream',
                      'supporting-documents-remarks',
                    ];
                    const idx = subTabOrder.indexOf(editMonitoringSubTab);
                    if (idx < subTabOrder.length - 1) {
                      setEditMonitoringSubTab(subTabOrder[idx + 1] as any);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                isFacilityOperator && (
                  <button
                    type="button"
                    onClick={handleSubmitMonitoringPlan}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
                  >
                    <span>Submit Monitoring Plan</span>
                    <Send className="w-3.5 h-3.5 fill-current opacity-80" />
                  </button>
                )
              )}
            </div>

      {/* Interactive Leaflet GIS Location Modal (Abu Dhabi default) */}
      <LocationMapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialCoordinates={formData.coordinates || viewingData?.coordinates || '24.3644, 54.4988'}
        facilityName={formData.facilityName || viewingData?.facilityName || 'Facility Location'}
        facilityAddress={formData.address || viewingData?.address || 'Abu Dhabi, UAE'}
        onSelectCoordinates={(coords) => handleInputChange('coordinates', coords)}
      />
    </div>
  );
};
