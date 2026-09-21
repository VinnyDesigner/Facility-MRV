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
  Plus,
  ArrowLeft,
  Filter,
  Check,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { EmirateType, SectorType, Facility, RegistrationStatus, formatVersion } from '../types/mrv';

export interface FacilityRegistrationVersionSnapshot {
  version: string;
  status: string;
  updatedDate: string;
  submittedDate: string;
  isCurrent?: boolean;
  data: Record<string, any>;
}

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
  } = useMRV();

  const isFacilityOperator = currentRole === 'FACILITY_OPERATOR';
  const isEadReviewerOrAdmin = currentRole === 'EAD_REVIEWER' || (currentRole as string) === 'ADMIN';

  // VIEW MODE: 'table' (Overview Table) | 'form' (Edit/Add Form) | 'view' (Read-Only Inspection)
  const [viewMode, setViewMode] = useState<'table' | 'form' | 'view'>('table');
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Facility-specific registration records registry (Single Source of Truth)
  const [facilityRegistrations, setFacilityRegistrations] = useState<Record<string, any>>(() => {
    return {
      'fac-1': {
        operatorName: 'Al Noor Energy & Power Operations LLC',
        licenseNumber: 'CN-1094821-AD',
        registeredAddress: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
        correspondenceAddress: 'Same as Registered Address',
        operatorCountry: 'UAE',
        facilityName: 'Al Noor Industrial Facility',
        facilityId: 'FAC-EAD-2026-0891',
        facilityType: 'Cogeneration Plant',
        facilityCountry: 'UAE',
        facilityDescription:
          'Cogeneration Power & High-Pressure Steam Generation plant producing electricity and industrial steam for regional facilities.',
        activityDescription: 'Industrial thermal generation with combined cycle natural gas turbines.',
        address: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
        emirate: 'Abu Dhabi',
        coordinates: '24.3644, 54.4988',
        primaryActivity: 'Cogeneration Power & High-Pressure Steam Generation',
        secondaryActivity: 'Industrial Natural Gas Compression & Auxiliary Power',
        additionalActivityDesc: 'High efficiency waste heat steam capture systems.',
        mainProduct: 'Electricity (MWh), Steam (Tons)',
        hasOtherProducts: true,
        productDescription: 'De-mineralized Water',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2023-7741',
        permitStatus: 'Active',
        permitIssueDate: '15-Jan-2023',
        permitExpiryDate: '14-Jan-2027',
        voluntaryParticipation: true,
        emissionCategory: 'Above Threshold',
        reportingSector: 'Energy',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Facility operates under full EAD statutory permit and mandatory annual MRV compliance.',
        primaryName: 'Ahmed Al-Zaabi',
        primaryTitle: 'Senior Environmental & Regulatory Compliance Lead',
        primaryEmail: 'ahmed.zaabi@alnoor-energy.ae',
        primaryPhone: '+971 2 698 4400',
        alternateName: 'Eng. Tariq Al-Hashimi',
        alternateTitle: 'Environmental Manager',
        alternateEmail: 'tariq.hashimi@alnoor-energy.ae',
        alternatePhone: '+971 50 442 8991',
        confirmDetailsCorrect: true,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'Statutory_Permit_2026.pdf', size: '2.8MB', status: 'Completed' }],
        generalRemarks: 'All facility parameters verified and certified for 2026 compliance.',
        submittedDate: '10 Jan 2026',
        updatedDate: '18 Jan 2026',
        version: 'v2.1',
        status: 'Approved',
        correctionDeadlineDate: null,
      },
      'fac-2': {
        operatorName: 'Emirates Steel Arkan PJSC',
        licenseNumber: 'CN-1002341-AD',
        registeredAddress: 'Industrial City of Abu Dhabi (ICAD I), Mussafah, Abu Dhabi',
        correspondenceAddress: 'P.O. Box 9022, Abu Dhabi, UAE',
        operatorCountry: 'UAE',
        facilityName: 'Emirates Steel Arkan Complex',
        facilityId: 'FAC-EAD-2026-0104',
        facilityType: 'Heavy Manufacturing Complex',
        facilityCountry: 'UAE',
        facilityDescription: 'Integrated Direct Reduced Iron (DRI) and Electric Arc Furnace steel production plant.',
        activityDescription: 'Primary metal manufacturing with heavy section rolling mills.',
        address: 'ICAD I, Mussafah, Abu Dhabi',
        emirate: 'Abu Dhabi',
        coordinates: '24.3121, 54.4529',
        primaryActivity: 'Direct Reduced Iron (DRI) & Electric Arc Furnace Steelmaking',
        secondaryActivity: 'Rolling Mill & Heavy Section Production',
        additionalActivityDesc: 'Continuous billet casting and rebar manufacturing.',
        mainProduct: 'Reinforcing Bar, Wire Rod, Heavy Sections',
        hasOtherProducts: false,
        productDescription: '',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2022-3310',
        permitStatus: 'Active',
        permitIssueDate: '01-Jun-2022',
        permitExpiryDate: '31-May-2026',
        voluntaryParticipation: false,
        emissionCategory: 'Above Threshold',
        reportingSector: 'IPPU',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Subject to Tier 3 intensive continuous emission monitoring under EAD regulations.',
        primaryName: 'Dr. Fatima Al-Hosani',
        primaryTitle: 'Chief Sustainability Officer',
        primaryEmail: 'fatima.hosani@emiratessteel.ae',
        primaryPhone: '+971 2 550 1100',
        alternateName: 'Hamad Al-Kaabi',
        alternateTitle: 'Environmental Compliance Officer',
        alternateEmail: 'hamad.kaabi@emiratessteel.ae',
        alternatePhone: '+971 50 887 2341',
        confirmDetailsCorrect: true,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'DRI_Permit_Renewal_EAD.pdf', size: '4.1MB', status: 'Completed' }],
        generalRemarks: 'Annual registration renewed and validated.',
        submittedDate: '14 Feb 2026',
        updatedDate: '20 Feb 2026',
        version: 'v3.0',
        status: 'Approved',
        correctionDeadlineDate: null,
      },
      'fac-3': {
        operatorName: 'Abu Dhabi Polymers Company Ltd (Borouge)',
        licenseNumber: 'CN-1004592-AD',
        registeredAddress: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
        correspondenceAddress: 'Same as Registered Address',
        operatorCountry: 'UAE',
        facilityName: 'Borouge Petrochemicals Complex',
        facilityId: 'FAC-EAD-2026-0422',
        facilityType: 'Petrochemical Refining Plant',
        facilityCountry: 'UAE',
        facilityDescription: 'Ethylene Cracking and Polyolefin Polymerization complex supplying global polymer markets.',
        activityDescription: 'Steam cracking and high-pressure catalytic polymerization.',
        address: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
        emirate: 'Al Dhafra',
        coordinates: '24.1205, 52.7308',
        primaryActivity: 'Ethylene Cracking & Polyolefin Polymerization',
        secondaryActivity: 'Cross-linkable Polyethylene (XLPE) Compounding',
        additionalActivityDesc: 'Polymer compounding and pellet packaging.',
        mainProduct: 'Polyethylene (PE), Polypropylene (PP)',
        hasOtherProducts: true,
        productDescription: 'Specialized Polymer Compounds',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2023-8820',
        permitStatus: 'Active',
        permitIssueDate: '01-Sep-2023',
        permitExpiryDate: '31-Aug-2027',
        voluntaryParticipation: false,
        emissionCategory: 'Above Threshold',
        reportingSector: 'IPPU',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Comprehensive continuous emissions monitoring system (CEMS) online.',
        primaryName: 'Khalid Al-Marzooqi',
        primaryTitle: 'VP Environment & Quality',
        primaryEmail: 'khalid.marzooqi@borouge.com',
        primaryPhone: '+971 2 607 0000',
        alternateName: 'Sultan Al-Zaabi',
        alternateTitle: 'Senior Environmental Lead',
        alternateEmail: 'sultan.zaabi@borouge.com',
        alternatePhone: '+971 50 661 9022',
        confirmDetailsCorrect: false,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'Flare_Recovery_Dossier.pdf', size: '5.2MB', status: 'Completed' }],
        generalRemarks: 'Correction resubmission awaiting final EAD sign-off.',
        submittedDate: '02 Mar 2026',
        updatedDate: '11 Mar 2026',
        version: 'v1.2',
        status: 'Correction Required',
        correctionDeadlineDate: '2026-06-10', // 90-day window sample
      },
      'fac-4': {
        operatorName: 'TAQA Generation & Desalination Co.',
        licenseNumber: 'CN-1008745-AD',
        registeredAddress: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
        correspondenceAddress: 'Same as Registered Address',
        operatorCountry: 'UAE',
        facilityName: 'Al Taweelah Power & Desalination',
        facilityId: '',
        facilityType: 'Utility Power & Desalination',
        facilityCountry: 'UAE',
        facilityDescription: 'Combined Cycle Gas Turbine (CCGT) Power & RO Water Desalination plant.',
        activityDescription: 'Baseload electrical grid generation and seawater thermal desalination.',
        address: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
        emirate: 'Abu Dhabi',
        coordinates: '24.7601, 54.7082',
        primaryActivity: 'Combined Cycle Gas Turbine (CCGT) Power & RO Water Desalination',
        secondaryActivity: 'Thermal MSF Desalination',
        additionalActivityDesc: 'Sea water intake and brine treatment systems.',
        mainProduct: 'Grid Power (MW), Potable Water (MIGD)',
        hasOtherProducts: false,
        productDescription: '',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2021-1004',
        permitStatus: 'Active',
        permitIssueDate: '10-Apr-2021',
        permitExpiryDate: '09-Apr-2026',
        voluntaryParticipation: false,
        emissionCategory: 'Above Threshold',
        reportingSector: 'Energy',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Statutory MRV verification mandatory for major utility producer.',
        primaryName: 'Eng. Saeed Al-Mehairbi',
        primaryTitle: 'Plant Operations Director',
        primaryEmail: 'saeed.mehairbi@taqa.ae',
        primaryPhone: '+971 2 694 4000',
        alternateName: 'Rashid Al-Kindi',
        alternateTitle: 'Environmental Engineer',
        alternateEmail: 'rashid.kindi@taqa.ae',
        alternatePhone: '+971 50 334 1199',
        confirmDetailsCorrect: true,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'Taweelah_License_2026.pdf', size: '1.9MB', status: 'Completed' }],
        generalRemarks: 'Registration submitted and under official EAD queue review.',
        submittedDate: '05 Mar 2026',
        updatedDate: '—',
        version: 'v1.0',
        status: 'Under EAD Review',
        correctionDeadlineDate: null,
      },
      'fac-5': {
        operatorName: 'Abu Dhabi Waste Management PJSC (Tadweer)',
        licenseNumber: 'CN-1029844-AD',
        registeredAddress: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
        correspondenceAddress: 'Same as Registered Address',
        operatorCountry: 'UAE',
        facilityName: 'Tadweer Waste-to-Energy Facility',
        facilityId: 'FAC-EAD-2026-0775',
        facilityType: 'Waste-to-Energy Plant',
        facilityCountry: 'UAE',
        facilityDescription: 'Municipal Solid Waste Incineration with High-Efficiency Energy Recovery.',
        activityDescription: 'High-temperature thermal waste processing and steam turbine power generation.',
        address: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
        emirate: 'Al Ain',
        coordinates: '24.1956, 55.7605',
        primaryActivity: 'Municipal Solid Waste Incineration with Energy Recovery',
        secondaryActivity: 'Bottom Ash Recycling & Metal Separation',
        additionalActivityDesc: 'Flue gas cleaning and particulate filtration.',
        mainProduct: 'Exported Electricity, Recycled Aggregate',
        hasOtherProducts: false,
        productDescription: '',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2024-5501',
        permitStatus: 'Active',
        permitIssueDate: '01-Feb-2024',
        permitExpiryDate: '31-Jan-2028',
        voluntaryParticipation: true,
        emissionCategory: 'Above Threshold',
        reportingSector: 'Waste',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Solid waste thermal treatment permitted under EAD Class B guidelines.',
        primaryName: 'Maryam Al-Dhaheri',
        primaryTitle: 'Senior Environmental Engineer',
        primaryEmail: 'maryam.dhaheri@tadweer.ae',
        primaryPhone: '+971 3 711 2000',
        alternateName: 'Ahmed Al-Balooshi',
        alternateTitle: 'Operations Supervisor',
        alternateEmail: 'ahmed.balooshi@tadweer.ae',
        alternatePhone: '+971 50 123 7788',
        confirmDetailsCorrect: true,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'Tadweer_Permit_Copy.pdf', size: '3.4MB', status: 'Completed' }],
        generalRemarks: 'Registration approved and certified.',
        submittedDate: '22 Jan 2026',
        updatedDate: '28 Jan 2026',
        version: 'v1.1',
        status: 'Approved',
        correctionDeadlineDate: null,
      },
      'fac-6': {
        operatorName: 'Gulf Chemical Solutions LLC',
        licenseNumber: 'CN-1049182-AD',
        registeredAddress: 'ICAD II, Musaffah Industrial Area, Abu Dhabi, UAE',
        correspondenceAddress: 'P.O. Box 4410, Abu Dhabi, UAE',
        operatorCountry: 'UAE',
        facilityName: 'Gulf Chemical Solutions LLC',
        facilityId: 'FAC-EAD-2026-0619',
        facilityType: 'Chemical Processing Facility',
        facilityCountry: 'UAE',
        facilityDescription: 'Organic solvent recovery, purification, and specialty chemical synthesis.',
        activityDescription: 'Chemical distillation and storage operations.',
        address: 'ICAD II, Musaffah Industrial Area, Abu Dhabi, UAE',
        emirate: 'Abu Dhabi',
        coordinates: '24.3812, 54.5123',
        primaryActivity: 'Organic Solvent Refining & Distillation',
        secondaryActivity: 'Chemical Storage & Packaging',
        additionalActivityDesc: 'Bulk tank farm storage and automated drum filling lines.',
        mainProduct: 'Specialty Solvents, Industrial Thinners',
        hasOtherProducts: false,
        productDescription: '',
        permitAvailable: true,
        permitNumber: 'EAD-EP-2024-9102',
        permitStatus: 'Active',
        permitIssueDate: '01-Mar-2024',
        permitExpiryDate: '28-Feb-2028',
        voluntaryParticipation: false,
        emissionCategory: 'Above Threshold',
        reportingSector: 'Chemicals',
        mrvIssueDate: '01-Jan-2026',
        mrvExpiryDate: '31-Dec-2026',
        environmentalRemarks: 'Registration rejected due to incomplete statutory baseline environmental documentation.',
        primaryName: 'Nasser Al-Hajri',
        primaryTitle: 'Quality & Regulatory Director',
        primaryEmail: 'nasser.hajri@gulfchem.ae',
        primaryPhone: '+971 2 554 9900',
        alternateName: 'Salim Al-Nuaimi',
        alternateTitle: 'Environmental Compliance Lead',
        alternateEmail: 'salim.nuaimi@gulfchem.ae',
        alternatePhone: '+971 50 339 8811',
        confirmDetailsCorrect: false,
        confirmUpdateDetails: false,
        declarationConfirmed: true,
        changeType: '',
        changeEffectiveDate: '',
        changeDescription: '',
        attachedFiles: [{ name: 'EAD_Rejection_Notice_Official.pdf', size: '1.2MB', status: 'Completed' }],
        generalRemarks: 'Application rejected by EAD due to non-compliant emission baseline scope.',
        submittedDate: '18 Feb 2026',
        updatedDate: '24 Feb 2026',
        version: 'v1.0',
        status: 'Rejected',
        correctionDeadlineDate: null,
      },
    };
  });

  // Dynamic Historical Snapshots for each Facility Version
  const [facilityRegistrationHistory, setFacilityRegistrationHistory] = useState<
    Record<string, FacilityRegistrationVersionSnapshot[]>
  >(() => {
    return {
      'fac-1': [
        {
          version: 'v2.1',
          status: 'Approved',
          updatedDate: '18 Jan 2026',
          submittedDate: '10 Jan 2026',
          isCurrent: true,
          data: {
            operatorName: 'Al Noor Energy & Power Operations LLC',
            licenseNumber: 'CN-1094821-AD',
            registeredAddress: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Al Noor Industrial Facility',
            facilityId: 'FAC-EAD-2026-0891',
            facilityType: 'Cogeneration Plant',
            facilityCountry: 'UAE',
            facilityDescription:
              'Cogeneration Power & High-Pressure Steam Generation plant producing electricity and industrial steam for regional facilities.',
            activityDescription: 'Industrial thermal generation with combined cycle natural gas turbines.',
            address: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.3644, 54.4988',
            primaryActivity: 'Cogeneration Power & High-Pressure Steam Generation',
            secondaryActivity: 'Industrial Natural Gas Compression & Auxiliary Power',
            additionalActivityDesc: 'High efficiency waste heat steam capture systems.',
            mainProduct: 'Electricity (MWh), Steam (Tons)',
            hasOtherProducts: true,
            productDescription: 'De-mineralized Water',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-7741',
            permitStatus: 'Active',
            permitIssueDate: '15-Jan-2023',
            permitExpiryDate: '14-Jan-2027',
            voluntaryParticipation: true,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Energy',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Facility operates under full EAD statutory permit and mandatory annual MRV compliance.',
            primaryName: 'Ahmed Al-Zaabi',
            primaryTitle: 'Senior Environmental & Regulatory Compliance Lead',
            primaryEmail: 'ahmed.zaabi@alnoor-energy.ae',
            primaryPhone: '+971 2 698 4400',
            alternateName: 'Eng. Tariq Al-Hashimi',
            alternateTitle: 'Environmental Manager',
            alternateEmail: 'tariq.hashimi@alnoor-energy.ae',
            alternatePhone: '+971 50 442 8991',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: '',
            changeEffectiveDate: '',
            changeDescription: '',
            attachedFiles: [{ name: 'Statutory_Permit_2026.pdf', size: '2.8MB', status: 'Completed' }, { name: 'Turbine_Commissioning_Report.pdf', size: '3.4MB', status: 'Completed' }],
            generalRemarks: 'All facility parameters verified and certified for 2026 compliance.',
            submittedDate: '10 Jan 2026',
            updatedDate: '18 Jan 2026',
            version: 'v2.1',
            status: 'Approved',
          },
        },
        {
          version: 'v2.0',
          status: 'Correction Required',
          updatedDate: '12 Jan 2026',
          submittedDate: '10 Jan 2026',
          isCurrent: false,
          data: {
            operatorName: 'Al Noor Energy & Power Operations LLC',
            licenseNumber: 'CN-1094821-AD',
            registeredAddress: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Al Noor Industrial Facility',
            facilityId: 'FAC-EAD-2026-0891',
            facilityType: 'Cogeneration Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Cogeneration Power & High-Pressure Steam Generation plant.',
            activityDescription: 'Industrial thermal generation with combined cycle natural gas turbines.',
            address: 'Sector M-34, Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.3644, 54.4988',
            primaryActivity: 'Cogeneration Power & High-Pressure Steam Generation',
            secondaryActivity: 'Industrial Natural Gas Compression',
            additionalActivityDesc: 'Thermal steam generation.',
            mainProduct: 'Electricity (MWh), Steam (Tons)',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-7741',
            permitStatus: 'Active',
            permitIssueDate: '15-Jan-2023',
            permitExpiryDate: '14-Jan-2027',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Energy',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Correction required: EAD requested calibration log and updated thermal efficiency certificate for Unit 2.',
            primaryName: 'Ahmed Al-Zaabi',
            primaryTitle: 'Compliance Officer',
            primaryEmail: 'ahmed.zaabi@alnoor-energy.ae',
            primaryPhone: '+971 2 698 4400',
            alternateName: 'Eng. Tariq Al-Hashimi',
            alternateTitle: 'Environmental Manager',
            alternateEmail: 'tariq.hashimi@alnoor-energy.ae',
            alternatePhone: '+971 50 442 8991',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: '',
            changeEffectiveDate: '',
            changeDescription: '',
            attachedFiles: [{ name: 'Statutory_Permit_2026.pdf', size: '2.8MB', status: 'Completed' }],
            generalRemarks: 'Returned by EAD: Please attach calibration certificate for combined cycle unit 2.',
            submittedDate: '10 Jan 2026',
            updatedDate: '12 Jan 2026',
            version: 'v2.0',
            status: 'Correction Required',
          },
        },
        {
          version: 'v1.0',
          status: 'Submitted',
          updatedDate: '05 Jan 2026',
          submittedDate: '05 Jan 2026',
          isCurrent: false,
          data: {
            operatorName: 'Al Noor Energy & Power Operations LLC',
            licenseNumber: 'CN-1094821-AD',
            registeredAddress: 'Sector M-34, Plot 12, Musaffah, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Al Noor Industrial Facility',
            facilityId: '',
            facilityType: 'Thermal Power Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Industrial thermal generation facility.',
            activityDescription: 'Natural gas power generation.',
            address: 'Plot 12, Musaffah Industrial Area, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.3644, 54.4988',
            primaryActivity: 'Cogeneration Power Generation',
            secondaryActivity: '',
            additionalActivityDesc: '',
            mainProduct: 'Electricity (MWh)',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-7741',
            permitStatus: 'Active',
            permitIssueDate: '15-Jan-2023',
            permitExpiryDate: '14-Jan-2027',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Energy',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Initial baseline submission for annual MRV onboarding.',
            primaryName: 'Ahmed Al-Zaabi',
            primaryTitle: 'Compliance Officer',
            primaryEmail: 'ahmed.zaabi@alnoor-energy.ae',
            primaryPhone: '+971 2 698 4400',
            alternateName: 'Ahmed Al-Zaabi',
            alternateTitle: 'Compliance Officer',
            alternateEmail: 'ahmed.zaabi@alnoor-energy.ae',
            alternatePhone: '+971 2 698 4400',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Initial statutory facility onboarding.',
            attachedFiles: [{ name: 'Musaffah_Base_Registration_v1.pdf', size: '1.5MB', status: 'Completed' }],
            generalRemarks: 'Initial statutory registration submission for regulatory onboarding under EAD 2026 MRV framework.',
            submittedDate: '05 Jan 2026',
            updatedDate: '05 Jan 2026',
            version: 'v1.0',
            status: 'Submitted',
          },
        },
      ],
      'fac-2': [
        {
          version: 'v3.0',
          status: 'Approved',
          updatedDate: '20 Feb 2026',
          submittedDate: '14 Feb 2026',
          isCurrent: true,
          data: {
            operatorName: 'Emirates Steel Arkan PJSC',
            licenseNumber: 'CN-1002341-AD',
            registeredAddress: 'Industrial City of Abu Dhabi (ICAD I), Mussafah, Abu Dhabi',
            correspondenceAddress: 'P.O. Box 9022, Abu Dhabi, UAE',
            operatorCountry: 'UAE',
            facilityName: 'Emirates Steel Arkan Complex',
            facilityId: 'FAC-EAD-2026-0104',
            facilityType: 'Heavy Manufacturing Complex',
            facilityCountry: 'UAE',
            facilityDescription: 'Integrated Direct Reduced Iron (DRI) and Electric Arc Furnace steel production plant.',
            activityDescription: 'Primary metal manufacturing with heavy section rolling mills.',
            address: 'ICAD I, Mussafah, Abu Dhabi',
            emirate: 'Abu Dhabi',
            coordinates: '24.3121, 54.4529',
            primaryActivity: 'Direct Reduced Iron (DRI) & Electric Arc Furnace Steelmaking',
            secondaryActivity: 'Rolling Mill & Heavy Section Production',
            additionalActivityDesc: 'Continuous billet casting and rebar manufacturing.',
            mainProduct: 'Reinforcing Bar, Wire Rod, Heavy Sections',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2022-3310',
            permitStatus: 'Active',
            permitIssueDate: '01-Jun-2022',
            permitExpiryDate: '31-May-2026',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Subject to Tier 3 intensive continuous emission monitoring under EAD regulations.',
            primaryName: 'Dr. Fatima Al-Hosani',
            primaryTitle: 'Chief Sustainability Officer',
            primaryEmail: 'fatima.hosani@emiratessteel.ae',
            primaryPhone: '+971 2 550 1100',
            alternateName: 'Hamad Al-Kaabi',
            alternateTitle: 'Environmental Compliance Officer',
            alternateEmail: 'hamad.kaabi@emiratessteel.ae',
            alternatePhone: '+971 50 887 2341',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Fuel / Material Mix',
            changeEffectiveDate: '15-Feb-2026',
            changeDescription: 'Green hydrogen injection pilot integrated in DRI furnace.',
            attachedFiles: [{ name: 'DRI_Permit_Renewal_EAD.pdf', size: '4.1MB', status: 'Completed' }, { name: 'Hydrogen_Pilot_Safety_Report.pdf', size: '5.8MB', status: 'Completed' }],
            generalRemarks: 'Annual registration renewed and validated with green hydrogen DRI pilot addition.',
            submittedDate: '14 Feb 2026',
            updatedDate: '20 Feb 2026',
            version: 'v3.0',
            status: 'Approved',
          },
        },
        {
          version: 'v2.0',
          status: 'Correction Required',
          updatedDate: '10 Feb 2026',
          submittedDate: '02 Feb 2026',
          isCurrent: false,
          data: {
            operatorName: 'Emirates Steel Arkan PJSC',
            licenseNumber: 'CN-1002341-AD',
            registeredAddress: 'Industrial City of Abu Dhabi (ICAD I), Mussafah, Abu Dhabi',
            correspondenceAddress: 'P.O. Box 9022, Abu Dhabi, UAE',
            operatorCountry: 'UAE',
            facilityName: 'Emirates Steel Arkan Complex',
            facilityId: 'FAC-EAD-2026-0104',
            facilityType: 'Heavy Manufacturing Complex',
            facilityCountry: 'UAE',
            facilityDescription: 'Integrated Direct Reduced Iron (DRI) and Electric Arc Furnace steel production plant.',
            activityDescription: 'Primary metal manufacturing with heavy section rolling mills.',
            address: 'ICAD I, Mussafah, Abu Dhabi',
            emirate: 'Abu Dhabi',
            coordinates: '24.3121, 54.4529',
            primaryActivity: 'Direct Reduced Iron (DRI) & Electric Arc Furnace Steelmaking',
            secondaryActivity: 'Rolling Mill & Heavy Section Production',
            additionalActivityDesc: 'Continuous billet casting.',
            mainProduct: 'Reinforcing Bar, Wire Rod, Heavy Sections',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2022-3310',
            permitStatus: 'Active',
            permitIssueDate: '01-Jun-2022',
            permitExpiryDate: '31-May-2026',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Correction requested by EAD on DRI green hydrogen fuel-gas ratio calculations.',
            primaryName: 'Dr. Fatima Al-Hosani',
            primaryTitle: 'Sustainability Lead',
            primaryEmail: 'fatima.hosani@emiratessteel.ae',
            primaryPhone: '+971 2 550 1100',
            alternateName: 'Hamad Al-Kaabi',
            alternateTitle: 'Environmental Compliance Officer',
            alternateEmail: 'hamad.kaabi@emiratessteel.ae',
            alternatePhone: '+971 50 887 2341',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: true,
            declarationConfirmed: true,
            changeType: 'Operational Capacity Modification',
            changeEffectiveDate: '01-Feb-2026',
            changeDescription: 'EAF Furnace 3 electrode upgrade and initial hydrogen injection filing.',
            attachedFiles: [{ name: 'DRI_Permit_Renewal_EAD.pdf', size: '4.1MB', status: 'Completed' }],
            generalRemarks: 'Returned by EAD: Please specify exact percentage of green hydrogen blend in the DRI furnace reduction stream.',
            submittedDate: '02 Feb 2026',
            updatedDate: '10 Feb 2026',
            version: 'v2.0',
            status: 'Correction Required',
          },
        },
        {
          version: 'v1.0',
          status: 'Submitted',
          updatedDate: '15 Jan 2026',
          submittedDate: '15 Jan 2026',
          isCurrent: false,
          data: {
            operatorName: 'Emirates Steel Arkan PJSC',
            licenseNumber: 'CN-1002341-AD',
            registeredAddress: 'Industrial City of Abu Dhabi (ICAD I), Mussafah, Abu Dhabi',
            correspondenceAddress: 'P.O. Box 9022, Abu Dhabi, UAE',
            operatorCountry: 'UAE',
            facilityName: 'Emirates Steel Arkan Plant 1 & 2',
            facilityId: '',
            facilityType: 'Steel Manufacturing Facility',
            facilityCountry: 'UAE',
            facilityDescription: 'Primary metal manufacturing facility.',
            activityDescription: 'Primary metal manufacturing with heavy section rolling mills.',
            address: 'ICAD I, Mussafah, Abu Dhabi',
            emirate: 'Abu Dhabi',
            coordinates: '24.3121, 54.4529',
            primaryActivity: 'Heavy Section Steel Production & Rolling Mills',
            secondaryActivity: 'Continuous billet casting',
            additionalActivityDesc: '',
            mainProduct: 'Reinforcing Bar, Wire Rod',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2022-3310',
            permitStatus: 'Active',
            permitIssueDate: '01-Jun-2022',
            permitExpiryDate: '31-May-2026',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Annual registration renewal profile submitted for 2026 compliance.',
            primaryName: 'Hamad Al-Kaabi',
            primaryTitle: 'Environmental Compliance Officer',
            primaryEmail: 'hamad.kaabi@emiratessteel.ae',
            primaryPhone: '+971 50 887 2341',
            alternateName: 'Hamad Al-Kaabi',
            alternateTitle: 'Environmental Compliance Officer',
            alternateEmail: 'hamad.kaabi@emiratessteel.ae',
            alternatePhone: '+971 50 887 2341',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Annual Statutory Renewal filing.',
            attachedFiles: [{ name: 'EmiratesSteel_Registration_2026_Initial.pdf', size: '3.2MB', status: 'Completed' }],
            generalRemarks: 'Initial annual statutory submission for 2026 reporting period.',
            submittedDate: '15 Jan 2026',
            updatedDate: '15 Jan 2026',
            version: 'v1.0',
            status: 'Submitted',
          },
        },
      ],
      'fac-3': [
        {
          version: 'v1.2',
          status: 'Correction Required',
          updatedDate: '11 Mar 2026',
          submittedDate: '02 Mar 2026',
          isCurrent: true,
          data: {
            operatorName: 'Abu Dhabi Polymers Company Ltd (Borouge)',
            licenseNumber: 'CN-1004592-AD',
            registeredAddress: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Borouge Petrochemicals Complex',
            facilityId: 'FAC-EAD-2026-0422',
            facilityType: 'Petrochemical Refining Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Ethylene Cracking and Polyolefin Polymerization complex supplying global polymer markets.',
            activityDescription: 'Steam cracking and high-pressure catalytic polymerization.',
            address: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
            emirate: 'Al Dhafra',
            coordinates: '24.1205, 52.7308',
            primaryActivity: 'Ethylene Cracking & Polyolefin Polymerization',
            secondaryActivity: 'Cross-linkable Polyethylene (XLPE) Compounding',
            additionalActivityDesc: 'Polymer compounding and pellet packaging.',
            mainProduct: 'Polyethylene (PE), Polypropylene (PP)',
            hasOtherProducts: true,
            productDescription: 'Specialized Polymer Compounds',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-8820',
            permitStatus: 'Active',
            permitIssueDate: '01-Sep-2023',
            permitExpiryDate: '31-Aug-2027',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Comprehensive continuous emissions monitoring system (CEMS) online.',
            primaryName: 'Khalid Al-Marzooqi',
            primaryTitle: 'VP Environment & Quality',
            primaryEmail: 'khalid.marzooqi@borouge.com',
            primaryPhone: '+971 2 607 0000',
            alternateName: 'Sultan Al-Zaabi',
            alternateTitle: 'Senior Environmental Lead',
            alternateEmail: 'sultan.zaabi@borouge.com',
            alternatePhone: '+971 50 661 9022',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: true,
            declarationConfirmed: true,
            changeType: 'Operational Capacity Modification',
            changeEffectiveDate: '12-Jan-2026',
            changeDescription: 'Updated flare gas recovery unit parameters for emission minimization.',
            attachedFiles: [{ name: 'Flare_Recovery_Dossier.pdf', size: '5.2MB', status: 'Completed' }],
            generalRemarks: 'Correction resubmission awaiting final EAD sign-off.',
            submittedDate: '02 Mar 2026',
            updatedDate: '11 Mar 2026',
            version: 'v1.2',
            status: 'Correction Required',
          },
        },
        {
          version: 'v1.1',
          status: 'Reverted',
          updatedDate: '20 Feb 2026',
          submittedDate: '15 Feb 2026',
          isCurrent: false,
          data: {
            operatorName: 'Abu Dhabi Polymers Company Ltd (Borouge)',
            licenseNumber: 'CN-1004592-AD',
            registeredAddress: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Borouge Petrochemicals Complex',
            facilityId: 'FAC-EAD-2026-0422',
            facilityType: 'Petrochemical Refining Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Ethylene Cracking and Polyolefin Polymerization complex.',
            activityDescription: 'Steam cracking and catalytic polymerization.',
            address: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
            emirate: 'Al Dhafra',
            coordinates: '24.1205, 52.7308',
            primaryActivity: 'Ethylene Cracking & Polyolefin Polymerization',
            secondaryActivity: 'Compounding',
            additionalActivityDesc: 'Polymer packaging.',
            mainProduct: 'Polyethylene (PE), Polypropylene (PP)',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-8820',
            permitStatus: 'Active',
            permitIssueDate: '01-Sep-2023',
            permitExpiryDate: '31-Aug-2027',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Application reverted to operator for CEMS continuous calibration certificates on Olefins 2 flare stack.',
            primaryName: 'Khalid Al-Marzooqi',
            primaryTitle: 'VP Environment & Quality',
            primaryEmail: 'khalid.marzooqi@borouge.com',
            primaryPhone: '+971 2 607 0000',
            alternateName: 'Sultan Al-Zaabi',
            alternateTitle: 'Senior Environmental Lead',
            alternateEmail: 'sultan.zaabi@borouge.com',
            alternatePhone: '+971 50 661 9022',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: true,
            declarationConfirmed: true,
            changeType: 'Operational Capacity Modification',
            changeEffectiveDate: '12-Jan-2026',
            changeDescription: 'Ethylene Cracking revamp initial dossier.',
            attachedFiles: [{ name: 'Flare_Recovery_Dossier.pdf', size: '5.2MB', status: 'Completed' }],
            generalRemarks: 'Application reverted to operator for CEMS continuous calibration certificates on Olefins 2 flare stack.',
            submittedDate: '15 Feb 2026',
            updatedDate: '20 Feb 2026',
            version: 'v1.1',
            status: 'Reverted',
          },
        },
        {
          version: 'v1.0',
          status: 'Submitted',
          updatedDate: '01 Feb 2026',
          submittedDate: '01 Feb 2026',
          isCurrent: false,
          data: {
            operatorName: 'Abu Dhabi Polymers Company Ltd (Borouge)',
            licenseNumber: 'CN-1004592-AD',
            registeredAddress: 'Ruwais Industrial Complex, Al Dhafra Region, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Borouge Petrochemicals Complex',
            facilityId: '',
            facilityType: 'Petrochemical Refining Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Polymer production facility.',
            activityDescription: 'Steam cracking and high-pressure catalytic polymerization.',
            address: 'Ruwais Industrial Complex, Abu Dhabi, UAE',
            emirate: 'Al Dhafra',
            coordinates: '24.1205, 52.7308',
            primaryActivity: 'Ethylene Cracking & Polymerization',
            secondaryActivity: '',
            additionalActivityDesc: '',
            mainProduct: 'Polyethylene (PE)',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2023-8820',
            permitStatus: 'Active',
            permitIssueDate: '01-Sep-2023',
            permitExpiryDate: '31-Aug-2027',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'IPPU',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Initial 2026 annual dossier uploaded.',
            primaryName: 'Sultan Al-Zaabi',
            primaryTitle: 'Senior Environmental Lead',
            primaryEmail: 'sultan.zaabi@borouge.com',
            primaryPhone: '+971 50 661 9022',
            alternateName: 'Sultan Al-Zaabi',
            alternateTitle: 'Senior Environmental Lead',
            alternateEmail: 'sultan.zaabi@borouge.com',
            alternatePhone: '+971 50 661 9022',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Annual Statutory Renewal.',
            attachedFiles: [{ name: 'Borouge_Annual_MRV_Profile.pdf', size: '6.1MB', status: 'Completed' }],
            generalRemarks: 'Initial 2026 annual dossier uploaded.',
            submittedDate: '01 Feb 2026',
            updatedDate: '01 Feb 2026',
            version: 'v1.0',
            status: 'Submitted',
          },
        },
      ],
      'fac-4': [
        {
          version: 'v1.0',
          status: 'Under EAD Review',
          updatedDate: '—',
          submittedDate: '05 Mar 2026',
          isCurrent: true,
          data: {
            operatorName: 'TAQA Generation & Desalination Co.',
            licenseNumber: 'CN-1008745-AD',
            registeredAddress: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Al Taweelah Power & Desalination',
            facilityId: '',
            facilityType: 'Utility Power & Desalination',
            facilityCountry: 'UAE',
            facilityDescription: 'Combined Cycle Gas Turbine (CCGT) Power & RO Water Desalination plant.',
            activityDescription: 'Baseload electrical grid generation and seawater thermal desalination.',
            address: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.7601, 54.7082',
            primaryActivity: 'Combined Cycle Gas Turbine (CCGT) Power & RO Water Desalination',
            secondaryActivity: 'Thermal MSF Desalination',
            additionalActivityDesc: 'Sea water intake and brine treatment systems.',
            mainProduct: 'Grid Power (MW), Potable Water (MIGD)',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2021-1004',
            permitStatus: 'Active',
            permitIssueDate: '10-Apr-2021',
            permitExpiryDate: '09-Apr-2026',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Energy',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Statutory MRV verification mandatory for major utility producer.',
            primaryName: 'Eng. Saeed Al-Mehairbi',
            primaryTitle: 'Plant Operations Director',
            primaryEmail: 'saeed.mehairbi@taqa.ae',
            primaryPhone: '+971 2 694 4000',
            alternateName: 'Rashid Al-Kindi',
            alternateTitle: 'Environmental Engineer',
            alternateEmail: 'rashid.kindi@taqa.ae',
            alternatePhone: '+971 50 334 1199',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Operational license renewal.',
            attachedFiles: [{ name: 'Taweelah_License_2026.pdf', size: '1.9MB', status: 'Completed' }],
            generalRemarks: 'Registration submitted and under official EAD queue review.',
            submittedDate: '05 Mar 2026',
            updatedDate: '—',
            version: 'v1.0',
            status: 'Under EAD Review',
          },
        },
        {
          version: 'v0.1',
          status: 'Draft',
          updatedDate: '01 Mar 2026',
          submittedDate: '01 Mar 2026',
          isCurrent: false,
          data: {
            operatorName: 'TAQA Generation & Desalination Co.',
            licenseNumber: 'CN-1008745-AD',
            registeredAddress: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Al Taweelah Power & Desalination',
            facilityId: '',
            facilityType: 'Utility Power & Desalination',
            facilityCountry: 'UAE',
            facilityDescription: 'Combined Cycle Gas Turbine (CCGT) Power & Desalination plant.',
            activityDescription: 'Grid generation.',
            address: 'Al Taweelah Power Complex, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.7601, 54.7082',
            primaryActivity: 'Power & Water Generation',
            secondaryActivity: '',
            additionalActivityDesc: '',
            mainProduct: 'Grid Power, Water',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2021-1004',
            permitStatus: 'Active',
            permitIssueDate: '10-Apr-2021',
            permitExpiryDate: '09-Apr-2026',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Energy',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Draft profile prepared.',
            primaryName: 'Eng. Saeed Al-Mehairbi',
            primaryTitle: 'Plant Operations Director',
            primaryEmail: 'saeed.mehairbi@taqa.ae',
            primaryPhone: '+971 2 694 4000',
            alternateName: 'Rashid Al-Kindi',
            alternateTitle: 'Environmental Engineer',
            alternateEmail: 'rashid.kindi@taqa.ae',
            alternatePhone: '+971 50 334 1199',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: false,
            declarationConfirmed: false,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Initial draft preparation.',
            attachedFiles: [{ name: 'Taweelah_Draft_Docs.pdf', size: '1.1MB', status: 'Completed' }],
            generalRemarks: 'Draft registration prepared internally.',
            submittedDate: '01 Mar 2026',
            updatedDate: '01 Mar 2026',
            version: 'v0.1',
            status: 'Draft',
          },
        },
      ],
      'fac-5': [
        {
          version: 'v1.1',
          status: 'Approved',
          updatedDate: '28 Jan 2026',
          submittedDate: '22 Jan 2026',
          isCurrent: true,
          data: {
            operatorName: 'Abu Dhabi Waste Management PJSC (Tadweer)',
            licenseNumber: 'CN-1029844-AD',
            registeredAddress: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Tadweer Waste-to-Energy Facility',
            facilityId: 'FAC-EAD-2026-0775',
            facilityType: 'Waste-to-Energy Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Municipal Solid Waste Incineration with High-Efficiency Energy Recovery.',
            activityDescription: 'High-temperature thermal waste processing and steam turbine power generation.',
            address: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
            emirate: 'Al Ain',
            coordinates: '24.1956, 55.7605',
            primaryActivity: 'Municipal Solid Waste Incineration with Energy Recovery',
            secondaryActivity: 'Bottom Ash Recycling & Metal Separation',
            additionalActivityDesc: 'Flue gas cleaning and particulate filtration.',
            mainProduct: 'Exported Electricity, Recycled Aggregate',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2024-5501',
            permitStatus: 'Active',
            permitIssueDate: '01-Feb-2024',
            permitExpiryDate: '31-Jan-2028',
            voluntaryParticipation: true,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Waste',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Solid waste thermal treatment permitted under EAD Class B guidelines.',
            primaryName: 'Maryam Al-Dhaheri',
            primaryTitle: 'Senior Environmental Engineer',
            primaryEmail: 'maryam.dhaheri@tadweer.ae',
            primaryPhone: '+971 3 711 2000',
            alternateName: 'Ahmed Al-Balooshi',
            alternateTitle: 'Operations Supervisor',
            alternateEmail: 'ahmed.balooshi@tadweer.ae',
            alternatePhone: '+971 50 123 7788',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: '',
            changeEffectiveDate: '',
            changeDescription: '',
            attachedFiles: [{ name: 'Tadweer_Permit_Copy.pdf', size: '3.4MB', status: 'Completed' }],
            generalRemarks: 'Registration approved and certified.',
            submittedDate: '22 Jan 2026',
            updatedDate: '28 Jan 2026',
            version: 'v1.1',
            status: 'Approved',
          },
        },
        {
          version: 'v1.0',
          status: 'Submitted',
          updatedDate: '10 Jan 2026',
          submittedDate: '10 Jan 2026',
          isCurrent: false,
          data: {
            operatorName: 'Abu Dhabi Waste Management PJSC (Tadweer)',
            licenseNumber: 'CN-1029844-AD',
            registeredAddress: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
            correspondenceAddress: 'Same as Registered Address',
            operatorCountry: 'UAE',
            facilityName: 'Tadweer Waste-to-Energy Facility',
            facilityId: '',
            facilityType: 'Waste-to-Energy Plant',
            facilityCountry: 'UAE',
            facilityDescription: 'Municipal Solid Waste Incineration.',
            activityDescription: 'High-temperature thermal waste processing.',
            address: 'Al Ain Eco-Industrial Park, Al Ain, UAE',
            emirate: 'Al Ain',
            coordinates: '24.1956, 55.7605',
            primaryActivity: 'Municipal Solid Waste Incineration',
            secondaryActivity: '',
            additionalActivityDesc: '',
            mainProduct: 'Exported Electricity',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2024-5501',
            permitStatus: 'Active',
            permitIssueDate: '01-Feb-2024',
            permitExpiryDate: '31-Jan-2028',
            voluntaryParticipation: true,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Waste',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Initial submission for waste-to-energy unit.',
            primaryName: 'Maryam Al-Dhaheri',
            primaryTitle: 'Senior Environmental Engineer',
            primaryEmail: 'maryam.dhaheri@tadweer.ae',
            primaryPhone: '+971 3 711 2000',
            alternateName: 'Ahmed Al-Balooshi',
            alternateTitle: 'Operations Supervisor',
            alternateEmail: 'ahmed.balooshi@tadweer.ae',
            alternatePhone: '+971 50 123 7788',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Initial plant registration filing.',
            attachedFiles: [{ name: 'Tadweer_Permit_Copy.pdf', size: '3.4MB', status: 'Completed' }],
            generalRemarks: 'Initial plant registration dossier submitted for municipal waste-to-energy unit.',
            submittedDate: '10 Jan 2026',
            updatedDate: '10 Jan 2026',
            version: 'v1.0',
            status: 'Submitted',
          },
        },
      ],
      'fac-6': [
        {
          version: 'v1.0',
          status: 'Rejected',
          updatedDate: '24 Feb 2026',
          submittedDate: '18 Feb 2026',
          isCurrent: true,
          data: {
            operatorName: 'Gulf Chemical Solutions LLC',
            licenseNumber: 'CN-1049182-AD',
            registeredAddress: 'ICAD II, Musaffah Industrial Area, Abu Dhabi, UAE',
            correspondenceAddress: 'P.O. Box 4410, Abu Dhabi, UAE',
            operatorCountry: 'UAE',
            facilityName: 'Gulf Chemical Solutions LLC',
            facilityId: 'FAC-EAD-2026-0619',
            facilityType: 'Chemical Processing Facility',
            facilityCountry: 'UAE',
            facilityDescription: 'Organic solvent recovery, purification, and specialty chemical synthesis.',
            activityDescription: 'Chemical distillation and storage operations.',
            address: 'ICAD II, Musaffah Industrial Area, Abu Dhabi, UAE',
            emirate: 'Abu Dhabi',
            coordinates: '24.3812, 54.5123',
            primaryActivity: 'Organic Solvent Refining & Distillation',
            secondaryActivity: 'Chemical Storage & Packaging',
            additionalActivityDesc: 'Bulk tank farm storage and automated drum filling lines.',
            mainProduct: 'Specialty Solvents, Industrial Thinners',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2024-9102',
            permitStatus: 'Active',
            permitIssueDate: '01-Mar-2024',
            permitExpiryDate: '28-Feb-2028',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Chemicals',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Registration rejected due to incomplete statutory baseline environmental documentation.',
            primaryName: 'Nasser Al-Hajri',
            primaryTitle: 'Quality & Regulatory Director',
            primaryEmail: 'nasser.hajri@gulfchem.ae',
            primaryPhone: '+971 2 554 9900',
            alternateName: 'Salim Al-Nuaimi',
            alternateTitle: 'Environmental Compliance Lead',
            alternateEmail: 'salim.nuaimi@gulfchem.ae',
            alternatePhone: '+971 50 339 8811',
            confirmDetailsCorrect: true,
            confirmUpdateDetails: false,
            declarationConfirmed: true,
            changeType: '',
            changeEffectiveDate: '',
            changeDescription: '',
            attachedFiles: [{ name: 'EAD_Rejection_Notice_Official.pdf', size: '1.2MB', status: 'Completed' }],
            generalRemarks: 'Application rejected by EAD due to non-compliant emission baseline scope.',
            submittedDate: '18 Feb 2026',
            updatedDate: '24 Feb 2026',
            version: 'v1.0',
            status: 'Rejected',
          },
        },
        {
          version: 'v0.9',
          status: 'Draft',
          updatedDate: '10 Feb 2026',
          submittedDate: '10 Feb 2026',
          isCurrent: false,
          data: {
            operatorName: 'Gulf Chemical Solutions LLC',
            licenseNumber: 'CN-1049182-AD',
            registeredAddress: 'ICAD II, Musaffah Industrial Area, Abu Dhabi, UAE',
            correspondenceAddress: 'P.O. Box 4410, Abu Dhabi, UAE',
            operatorCountry: 'UAE',
            facilityName: 'Gulf Chemical Solutions LLC',
            facilityId: '',
            facilityType: 'Chemical Processing Facility',
            facilityCountry: 'UAE',
            facilityDescription: 'Solvent recovery and chemical storage.',
            activityDescription: 'Chemical distillation.',
            address: 'ICAD II, Musaffah, Abu Dhabi',
            emirate: 'Abu Dhabi',
            coordinates: '24.3812, 54.5123',
            primaryActivity: 'Chemical Refining',
            secondaryActivity: '',
            additionalActivityDesc: '',
            mainProduct: 'Industrial Thinners',
            hasOtherProducts: false,
            productDescription: '',
            permitAvailable: true,
            permitNumber: 'EAD-EP-2024-9102',
            permitStatus: 'Active',
            permitIssueDate: '01-Mar-2024',
            permitExpiryDate: '28-Feb-2028',
            voluntaryParticipation: false,
            emissionCategory: 'Above Threshold',
            reportingSector: 'Chemicals',
            mrvIssueDate: '01-Jan-2026',
            mrvExpiryDate: '31-Dec-2026',
            environmentalRemarks: 'Draft compilation.',
            primaryName: 'Nasser Al-Hajri',
            primaryTitle: 'Quality & Regulatory Director',
            primaryEmail: 'nasser.hajri@gulfchem.ae',
            primaryPhone: '+971 2 554 9900',
            alternateName: 'Salim Al-Nuaimi',
            alternateTitle: 'Environmental Compliance Lead',
            alternateEmail: 'salim.nuaimi@gulfchem.ae',
            alternatePhone: '+971 50 339 8811',
            confirmDetailsCorrect: false,
            confirmUpdateDetails: false,
            declarationConfirmed: false,
            changeType: 'Change of Operator',
            changeEffectiveDate: '01-Jan-2026',
            changeDescription: 'Initial draft registration compilation.',
            attachedFiles: [{ name: 'GulfChem_Draft.pdf', size: '2.0MB', status: 'Completed' }],
            generalRemarks: 'Initial draft dossier compiled by site environmental coordinator.',
            submittedDate: '10 Feb 2026',
            updatedDate: '10 Feb 2026',
            version: 'v0.9',
            status: 'Draft',
          },
        },
      ],
    };
  });

  // Current active form data (synced with selected facility)
  const [formData, setFormData] = useState(() => {
    const id = activeFacility?.id || 'fac-1';
    return facilityRegistrations[id] || facilityRegistrations['fac-1'];
  });

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
    return facilities.filter((fac) => {
      const reg = facilityRegistrations[fac.id] || {};
      const rawStatus = reg.status || fac.status || 'Approved';
      const status = rawStatus === 'Approved / Registered' || rawStatus === 'Registered' ? 'Approved' : rawStatus;

      const matchesSearch =
        fac.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (fac.facilityCode && fac.facilityCode.toLowerCase().includes(tableSearchTerm.toLowerCase())) ||
        (reg.operatorName || fac.operatorName || '').toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        (reg.primaryName || fac.contactPerson?.name || '').toLowerCase().includes(tableSearchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'Approved' && (status === 'Approved / Registered' || status === 'Registered' || status === 'Approved' || status === 'Active')) ||
        (statusFilter === 'Reverted' && (status === 'Correction Required' || status === 'Reverted' || status.includes('Correction') || status.includes('Reverted'))) ||
        (statusFilter === 'Correction Required' && (status === 'Correction Required' || status === 'Reverted' || status.includes('Correction') || status.includes('Reverted'))) ||
        (statusFilter === 'Rejected' && (status === 'Rejected' || status.includes('Reject'))) ||
        status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [facilities, facilityRegistrations, tableSearchTerm, statusFilter]);

  // Overview Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage) || 1;

  const paginatedFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFacilities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredFacilities, currentPage, itemsPerPage]);

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

  // Check if current facility being edited is strictly Approved
  const isFacilityApproved = useMemo(() => {
    if (
      formData.status === 'Approved / Registered' ||
      formData.status === 'Approved' ||
      formData.status === 'Registered'
    ) {
      return true;
    }
    const existing = facilityRegistrations[selectedFacilityId];
    if (
      existing &&
      (existing.status === 'Approved / Registered' ||
        existing.status === 'Approved' ||
        existing.status === 'Registered')
    ) {
      return true;
    }
    const fac = facilities.find((f) => f.id === selectedFacilityId);
    if (
      fac &&
      (fac.status === 'Registered' ||
        fac.status === 'Active' ||
        (fac.status as any) === 'Approved / Registered' ||
        (fac.status as any) === 'Approved')
    ) {
      return true;
    }
    return false;
  }, [facilityRegistrations, selectedFacilityId, formData.status, facilities]);

  // Check if specific version being inspected in View mode is strictly Approved
  const isViewingApprovedVersion = useMemo(() => {
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
  }, [viewingData.status, selectedVersionMeta]);

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
      });
      setSelectedVersion('V1');
    }
    setIsVersionDropdownOpen(false);
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
    } else {
      setSelectedVersion('V1');
    }
    setIsVersionDropdownOpen(false);
    setViewMode('view');
  };

  // Add New Facility Flow
  const handleAddNewFacility = () => {
    const newId = `fac-${facilities.length + 1}`;
    setSelectedFacilityId(newId);
    const newBlankData = {
      operatorName: '',
      licenseNumber: '',
      registeredAddress: '',
      correspondenceAddress: '',
      operatorCountry: 'UAE',
      facilityName: '',
      facilityId: '',
      facilityType: '',
      facilityCountry: 'UAE',
      facilityDescription: '',
      activityDescription: '',
      address: '',
      emirate: 'Abu Dhabi' as EmirateType,
      coordinates: '',
      primaryActivity: '',
      secondaryActivity: '',
      additionalActivityDesc: '',
      mainProduct: '',
      hasOtherProducts: false,
      productDescription: '',
      permitAvailable: false,
      permitNumber: '',
      permitStatus: 'Active',
      permitIssueDate: '',
      permitExpiryDate: '',
      voluntaryParticipation: false,
      emissionCategory: 'Above Threshold',
      reportingSector: 'Energy' as SectorType,
      mrvIssueDate: '',
      mrvExpiryDate: '',
      environmentalRemarks: '',
      primaryName: '',
      primaryTitle: '',
      primaryEmail: '',
      primaryPhone: '',
      alternateName: '',
      alternateTitle: '',
      alternateEmail: '',
      alternatePhone: '',
      confirmDetailsCorrect: false,
      confirmUpdateDetails: false,
      declarationConfirmed: false,
      changeType: '',
      changeEffectiveDate: '',
      changeDescription: '',
      attachedFiles: [],
      generalRemarks: '',
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      version: 'V1',
      status: 'Draft',
      correctionDeadlineDate: null,
    };
    setFormData(newBlankData);
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
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Save changes into the single source of truth registry & history
  const handleSave = () => {
    const updated = {
      ...formData,
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
          return { ...v, status: updated.status, updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    updateFacility({
      name: formData.facilityName,
      operatorName: formData.operatorName,
      tradeLicense: formData.licenseNumber,
      sector: (formData.reportingSector || 'IPPU') as SectorType,
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
      lastRenewalDate: new Date().toISOString().slice(0, 10),
    });

    setNoticeMessage('Facility Registration Saved Successfully!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSubmitRegistration = () => {
    const updated = {
      ...formData,
      status: 'Submitted',
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
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
          return { ...v, status: updated.status, updatedDate: updated.updatedDate, data: updated };
        }
        return v;
      });
      return { ...prev, [selectedFacilityId]: updatedHist };
    });

    handleSave();
    setRegistrationStatus('Submitted');
    setNoticeMessage('Registration Submitted! Forwarding for EAD Review...');
    setIsSavedNotice(true);

    setTimeout(() => {
      setRegistrationStatus('Under EAD Review');
      setFacilityRegistrations((prev) => ({
        ...prev,
        [selectedFacilityId]: { ...prev[selectedFacilityId], status: 'Under EAD Review' },
      }));
      setFacilityRegistrationHistory((prev) => {
        const facilityHist = prev[selectedFacilityId] || [];
        const updatedHist = facilityHist.map((v) => {
          if (v.version.toLowerCase() === (updated.version || 'v1.0').toLowerCase()) {
            return { ...v, status: 'Under EAD Review', data: { ...v.data, status: 'Under EAD Review' } };
          }
          return v;
        });
        return { ...prev, [selectedFacilityId]: updatedHist };
      });
      setNoticeMessage('Registration Status: Under EAD Review');
      setTimeout(() => setIsSavedNotice(false), 3500);
    }, 1000);
  };

  const handleEadApprove = () => {
    const generatedId =
      formData.facilityId ||
      (activeFacility.facilityCode && activeFacility.facilityCode.startsWith('FAC-EAD')
        ? activeFacility.facilityCode
        : `FAC-EAD-2026-${Math.floor(1000 + Math.random() * 9000)}`);

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
    setNoticeMessage(`Registration Approved! Facility ID Generated: ${generatedId} • Monitoring Plan Unlocked.`);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 4000);
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
    setNoticeMessage('Registration Returned for Correction to Facility Operator.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
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
    setNoticeMessage('Registration Rejected by EAD.');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // =========================================================================
  // RENDER 1: OVERVIEW TABLE (Default landing when clicking Registration)
  // =========================================================================
  if (viewMode === 'table') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Top Header Row with Title, Search, Filter & Add New Facility Button (Strictly Single Row) */}
        <div className="flex-shrink-0 pb-3 pt-0.5 flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0 shrink">
            <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight whitespace-nowrap">
              Facility Registration
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              Statutory Operator Profiles, Environmental Permits & Regulatory Registration Register
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by facility, contact..."
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
                <option value="Approved">Approved</option>
                <option value="Submitted">Submitted</option>
                <option value="Under EAD Review">Under EAD Review</option>
                <option value="Reverted">Reverted (Correction Required)</option>
                <option value="Draft">Draft</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Reset */}
            {(tableSearchTerm || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setTableSearchTerm('');
                  setStatusFilter('ALL');
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* + Add New Facility Button */}
            {isFacilityOperator && (
              <button
                onClick={handleAddNewFacility}
                className="px-4 py-2 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Facility</span>
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
                    <th className="py-2.5 px-2.5">Facility Name</th>
                    <th className="py-2.5 px-2.5">Facility Type</th>
                    <th className="py-2.5 px-2.5">Primary Contact</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Submitted Date</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Updated Date</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap text-left">Status</th>
                    <th className="py-2.5 px-2.5 whitespace-nowrap">Correction Deadline</th>
                    <th className="py-2.5 px-2.5 text-center whitespace-nowrap">Version</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedFacilities.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-semibold">
                        No facility registration records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedFacilities.map((fac, idx) => {
                      const reg = facilityRegistrations[fac.id] || {};
                      const rawStatus = reg.status || fac.status || 'Approved';
                      const currentStatus = rawStatus === 'Approved / Registered' || rawStatus === 'Registered' ? 'Approved' : rawStatus;
                      const deadlineInfo = getCorrectionDeadlineInfo(reg.correctionDeadlineDate, currentStatus);
                      const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;

                      return (
                        <tr
                          key={fac.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-default"
                        >
                          <td className="py-2.5 px-2.5 text-center font-mono font-bold text-slate-400">
                            {rowNumber}
                          </td>

                          {/* Facility Name (NO Facility ID subtitle!) */}
                          <td className="py-2.5 px-2.5 font-semibold text-slate-800">
                            <span>{fac.name}</span>
                          </td>

                          {/* Facility Type */}
                          <td className="py-2.5 px-2.5 text-slate-600">
                            {reg.facilityType || fac.primaryActivity || fac.sector || 'Manufacturing Plant'}
                          </td>

                          {/* Primary Contact */}
                          <td className="py-2.5 px-2.5 text-slate-600">
                            <div className="flex flex-col leading-tight">
                              <span className="font-semibold text-slate-800 text-xs">
                                {reg.primaryName || fac.contactPerson?.name || 'Authorized Lead'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {reg.primaryEmail || fac.contactPerson?.email || 'contact@facility.ae'}
                              </span>
                            </div>
                          </td>

                          {/* Submitted Date */}
                          <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                            {reg.submittedDate && reg.submittedDate !== '—' ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{reg.submittedDate}</span>
                              </div>
                            ) : (
                              <span>—</span>
                            )}
                          </td>

                          {/* Updated Date */}
                          <td className="py-2.5 px-2.5 text-slate-600 whitespace-nowrap">
                            {currentStatus === 'Under EAD Review' || currentStatus === 'Submitted' || !reg.updatedDate || reg.updatedDate === '—' ? (
                              <span>—</span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{reg.updatedDate}</span>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-2.5 text-left whitespace-nowrap">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-block ${
                                currentStatus === 'Approved / Registered' || currentStatus === 'Approved' || currentStatus === 'Registered'
                                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                  : currentStatus === 'Submitted'
                                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                  : currentStatus === 'Under EAD Review'
                                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                                  : currentStatus === 'Correction Required'
                                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                                  : currentStatus === 'Rejected'
                                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {currentStatus}
                            </span>
                          </td>

                          {/* Correction Deadline */}
                          <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-600">
                            {currentStatus === 'Correction Required' && deadlineInfo.daysRemaining !== null ? (
                              <div className="flex items-start gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex flex-col leading-tight">
                                  <span className="font-semibold text-slate-800 text-[11px]">Due: {deadlineInfo.deadlineStr}</span>
                                  <span className={`text-[10px] font-medium ${deadlineInfo.isOverdue ? 'text-rose-600 font-bold' : 'text-amber-700'}`}>
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
                              {formatVersion(reg.version)}
                            </span>
                          </td>

                          {/* Actions: Eye View & Edit Icon Buttons */}
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewFacility(fac.id)}
                                title="View Facility Details"
                                className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditFacility(fac.id)}
                                title="Edit Facility Details"
                                className="p-1 rounded-lg text-slate-500 hover:text-[#004B87] hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
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
  // RENDER 2: READ-ONLY VIEW (When user clicks 'View')
  // =========================================================================
  if (viewMode === 'view') {
    const formattedVersionLabel = formatVersion(selectedVersionMeta.version);
    const isCurrentActive = Boolean(selectedVersionMeta.isCurrent);

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-1">
        {/* Navigation Bar Back to Overview & Version Selection */}
        <div className="flex-shrink-0 pb-3.5 pt-1 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setViewMode('table')}
              className="p-1.5 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
              title="Back to Registration Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-bold text-[#004B87] tracking-tight">
                  {viewingData.facilityName || 'Facility Registration'} — Read-Only Record
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    viewingData.status === 'Approved / Registered' || viewingData.status === 'Approved' || viewingData.status === 'Registered'
                      ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60 font-bold'
                      : viewingData.status === 'Submitted' || viewingData.status === 'Under EAD Review'
                      ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 font-bold'
                      : viewingData.status === 'Correction Required' || viewingData.status === 'Reverted'
                      ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                      : viewingData.status === 'Rejected'
                      ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                  }`}
                >
                  {(viewingData.status === 'Approved / Registered' || viewingData.status === 'Registered') ? 'Approved' : (viewingData.status || 'Approved')}
                </span>

                {(viewingData.status === 'Approved / Registered' || viewingData.status === 'Approved' || viewingData.status === 'Registered') && viewingData.facilityId && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200 flex items-center gap-1">
                    <span>Facility ID:</span>
                    <span>{viewingData.facilityId}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5 ml-0.5">
                Official Registered Dossier • Version: {formattedVersionLabel} {isCurrentActive ? '(Current Active)' : `(Historical Snapshot — Updated ${selectedVersionMeta.updatedDate})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Version Selection Dropdown */}
            <div className="relative" ref={versionDropdownRef}>
              <button
                type="button"
                onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#004B87]/30 text-[#004B87] rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#004B87]/20"
                id="registration-version-dropdown-trigger"
                title="Select Version to Inspect"
              >
                <Clock className="w-3.5 h-3.5 text-[#004B87]" />
                <span>
                  Version: {formattedVersionLabel} {isCurrentActive ? '(Current)' : ''}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#004B87] transition-transform duration-200 ${
                    isVersionDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isVersionDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                    <span>Facility Versions ({currentFacilityVersions.length})</span>
                    <span className="text-[10px] font-normal text-slate-400">Click to switch</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5 no-scrollbar">
                    {currentFacilityVersions.map((v) => {
                      const isSelected = formatVersion(v.version).toLowerCase() === formatVersion(selectedVersion).toLowerCase();
                      const vCode = formatVersion(v.version);
                      return (
                        <button
                          key={v.version}
                          type="button"
                          onClick={() => {
                            setSelectedVersion(v.version);
                            setIsVersionDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-[#EBF3FA] border border-[#004B87]/40 shadow-2xs'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-navy-900 font-mono">
                                {vCode}
                              </span>
                              {v.isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#004B87] text-white">
                                  Current
                                </span>
                              )}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.status === 'Approved / Registered' || v.status === 'Approved' || v.status === 'Registered'
                                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60 font-bold'
                                  : v.status === 'Submitted' || v.status === 'Under EAD Review'
                                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60 font-bold'
                                  : v.status === 'Correction Required' || v.status === 'Reverted'
                                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                                  : v.status === 'Rejected'
                                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 font-bold'
                              }`}
                            >
                              {(v.status === 'Approved / Registered' || v.status === 'Registered') ? 'Approved' : v.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Updated: {v.updatedDate}</span>
                            {isSelected ? (
                              <span className="text-[#004B87] font-bold flex items-center gap-1 text-[10px]">
                                <Check className="w-3 h-3" /> Active View
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Click to inspect</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Edit Details Button (For Operators) */}
            {isFacilityOperator && (
              <button
                onClick={() => {
                  setFormData(viewingData);
                  setViewMode('form');
                }}
                className="px-4 py-2 bg-[#004B87] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#003865] cursor-pointer transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable View Content displaying exact entered data */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1 sm:pr-2 py-1 no-scrollbar">
          {/* Historical Snapshot Alert Banner (Shown when an older version is selected) */}
          {!isCurrentActive && (
            <div className="p-3.5 bg-amber-50/95 border border-amber-300/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-amber-900 text-xs shadow-2xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Viewing Historical Snapshot:</strong> Version {formattedVersionLabel} (Saved: {selectedVersionMeta.updatedDate} • Status: {selectedVersionMeta.status}). All fields below represent the exact saved record from this version.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const latest = currentFacilityVersions.find((v) => v.isCurrent) || currentFacilityVersions[0];
                  setSelectedVersion(latest.version);
                }}
                className="px-3 py-1.5 bg-amber-200/90 hover:bg-amber-300 text-amber-900 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors"
              >
                Switch to Current Version ({formatVersion((currentFacilityVersions.find((v) => v.isCurrent) || currentFacilityVersions[0]).version)})
              </button>
            </div>
          )}

          {/* Operator Details */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Operator Details</span>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Operator Name *</label>
                <p className="font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.operatorName || '—'}</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Registration / License Number *</label>
                <p className="font-mono font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.licenseNumber || '—'}</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Registered Address *</label>
                <p className="font-medium text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">{viewingData.registeredAddress || '—'}</p>
              </div>
              <div>
                <label className="text-[11px] text-slate-500 font-semibold block mb-1">Correspondence Address</label>
                <p className="font-medium text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">{viewingData.correspondenceAddress || '—'}</p>
              </div>
            </div>
          </div>

          {/* Facility Details & Location */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Facility Details & Location</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold block mb-1">Facility Name</label>
                  <p className="font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.facilityName || '—'}</p>
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-semibold block mb-1">Facility Type</label>
                  <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.facilityType || '—'}</p>
                </div>
              </div>

              {/* Subsection: Location Details */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Location Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Address</label>
                    <p className="font-medium text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">{viewingData.address || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Emirate / Region</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.emirate || 'Abu Dhabi'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Location Coordinates</label>
                    <p className="font-mono font-bold text-[#004B87] bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.coordinates || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Permit */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Environmental Permit</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Permit Details */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Permit Details</h4>
                <div className="flex items-center gap-2 mb-3 text-[11px] font-semibold text-slate-600">
                  <span>Environmental Permit Available:</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold ${viewingData.permitAvailable !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                    {viewingData.permitAvailable !== false ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Environmental Permit Number</label>
                    <p className="font-mono font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.permitNumber || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Permit Status</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.permitStatus || 'Active'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Permit Issue Date</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.permitIssueDate || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Permit Expiry Date</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.permitExpiryDate || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Persons */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Contact Persons</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Primary Contact Person */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Primary Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Name</label>
                    <p className="font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.primaryName || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Title / Designation</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.primaryTitle || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Email</label>
                    <p className="font-medium text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">{viewingData.primaryEmail || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Number</label>
                    <p className="font-mono font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.primaryPhone || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Alternate Contact Person */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Alternate Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Name</label>
                    <p className="font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.alternateName || viewingData.primaryName || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Title / Designation</label>
                    <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.alternateTitle || viewingData.primaryTitle || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Email</label>
                    <p className="font-medium text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 truncate">{viewingData.alternateEmail || viewingData.primaryEmail || '—'}</p>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold block mb-1">Number</label>
                    <p className="font-mono font-bold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.alternatePhone || viewingData.primaryPhone || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Renewal & Report a Change (Only for Approved Facilities) / Declaration & Supporting Documents (First-time) */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                {isViewingApprovedVersion ? 'Annual Renewal & Report a Change' : 'Declaration & Supporting Documents'}
              </span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Annual Renewal (Only for approved facility version) */}
              {isViewingApprovedVersion && (
                <div>
                  <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Annual Renewal</h4>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#004B87]" />
                      <span>Confirm registration details are correct</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Declaration */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Declaration</h4>
                <div className="p-3.5 bg-[#F4F8FC] border border-sky-100 rounded-xl text-slate-700 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>I confirm that the information provided is true and accurate</span>
                </div>
              </div>

              {/* Report a Change (Only shown for approved facility versions in View mode) */}
              {isViewingApprovedVersion && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-[#004B87] mb-3">Report a Change</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3.5">
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">Change Type</label>
                      <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.changeType || 'Change of Operator'}</p>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block mb-1">Effective Date</label>
                      <p className="font-semibold text-navy-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{viewingData.changeEffectiveDate || '01-Jan-2026'}</p>
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1.5">Change Description</label>
                    <p className="font-medium text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {viewingData.changeDescription || 'Additional production line commissioned in July 2026.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Supporting Documents */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Supporting Documents</h4>
                <label className="text-[11px] text-slate-500 font-semibold block mb-2">Attached Files for {formattedVersionLabel}</label>
                <div className="flex flex-wrap gap-2.5">
                  {(viewingData.attachedFiles && viewingData.attachedFiles.length > 0 ? viewingData.attachedFiles : [{ name: 'Registration_Permit_Doc.pdf', size: '2.4MB', status: 'Completed' }]).map((f: any, i: number) => (
                    <span key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span className="font-bold">{f.name}</span>
                      <span className="text-slate-400 text-[10px]">{f.size} • <span className="text-emerald-600 font-bold">{f.status}</span></span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Remarks / Description */}
          <div className="pt-2 text-xs">
            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Remarks / Description</label>
            <p className="font-medium text-navy-900 bg-white p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {viewingData.generalRemarks || 'All facility data, operational parameters, and statutory environmental details have been reviewed and verified for annual registration submission.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  }

  // =========================================================================
  // RENDER 3: EDIT / ADD FORM (When user clicks 'Edit' or 'Add New Facility')
  // =========================================================================
  const isDraftOrNewFacility = formData.status === 'Draft' || !formData.facilityName;

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Title & Actions Row */}
      <div className="flex-shrink-0 pb-3.5 pt-1 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setViewMode('table')}
              className="p-1 -ml-1 text-[#004B87] hover:text-[#003865] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back to Registration Overview"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-[20px] font-bold font-display text-[#004B87] tracking-tight">
              {formData.facilityName ? `${formData.facilityName} — Edit Form` : 'Facility Registration — New Facility'}
            </h1>

            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                formData.status === 'Approved / Registered' || formData.status === 'Approved' || formData.status === 'Registered'
                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                  : formData.status === 'Submitted' || formData.status === 'Under EAD Review'
                  ? 'bg-[#E0EEFA] text-[#0284C7] border border-sky-200/60'
                  : formData.status === 'Correction Required' || formData.status === 'Reverted'
                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                  : formData.status === 'Rejected'
                  ? 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {(formData.status === 'Approved / Registered' || formData.status === 'Registered') ? 'Approved' : (formData.status || 'Draft')}
            </span>

            {(formData.status === 'Approved / Registered' || formData.status === 'Approved' || formData.status === 'Registered') && formData.facilityId && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200 flex items-center gap-1">
                <span>Facility ID:</span>
                <span>{formData.facilityId}</span>
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
            Statutory Details, Environmental Permitting & Contact Profile
          </p>
        </div>

        {/* Right Search Input (Actions dropdown button completely removed) */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sections..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2 py-1 no-scrollbar">
          {/* Operator Details */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Operator Details</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Operator Name *</label>
                  <input
                    type="text"
                    value={formData.operatorName}
                    onChange={(e) => handleInputChange('operatorName', e.target.value)}
                    placeholder="Green Mountain Holding LLC"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Registration / License Number *</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="CN-456987321"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Registered Address *</label>
                  <input
                    type="text"
                    value={formData.registeredAddress}
                    onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                    placeholder="P.O. Box 12456, Abu Dhabi, UAE"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Correspondence Address</label>
                  <input
                    type="text"
                    value={formData.correspondenceAddress}
                    onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                    placeholder="Same as Registered Address"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Facility Details & Location */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Facility Details & Location</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Facility Name</label>
                  <input
                    type="text"
                    value={formData.facilityName}
                    onChange={(e) => handleInputChange('facilityName', e.target.value)}
                    placeholder="Green Mountain Cement Plant"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">Facility Type</label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => handleInputChange('facilityType', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                  >
                    <option value="Manufacturing Plant">Manufacturing Plant</option>
                    <option value="Power Plant">Power Plant</option>
                    <option value="Refinery">Refinery</option>
                    <option value="Chemical Plant">Chemical Plant</option>
                    <option value="Waste-to-Energy Plant">Waste-to-Energy Plant</option>
                  </select>
                </div>
              </div>

              {/* Subsection: Location Details */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Location Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Mussafah Industrial Area, Abu Dhabi, UAE"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Emirate / Region</label>
                    <select
                      value={formData.emirate}
                      onChange={(e) => handleInputChange('emirate', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                    >
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Al Ain">Al Ain</option>
                      <option value="Al Dhafra">Al Dhafra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Location Coordinates</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.coordinates}
                        onChange={(e) => handleInputChange('coordinates', e.target.value)}
                        placeholder="23.44, 56.37"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-mono text-xs"
                      />
                      <MapPin className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => alert(`GIS Coordinates verified for ${formData.facilityName || 'Facility'}: ${formData.coordinates || '23.44, 56.37'}`)}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Locate on Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Permit */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Environmental Permit</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Permit Details */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Permit Details</h4>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-slate-700">Environmental Permit Available</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${formData.permitAvailable !== false ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange('permitAvailable', formData.permitAvailable === false ? true : false)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.permitAvailable !== false ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${formData.permitAvailable !== false ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-xs font-bold ${formData.permitAvailable === false ? 'text-slate-700' : 'text-slate-400'}`}>No</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Environmental Permit Number</label>
                    <input
                      type="text"
                      value={formData.permitNumber}
                      onChange={(e) => handleInputChange('permitNumber', e.target.value)}
                      placeholder="EP-2026-001245"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Permit Status</label>
                    <select
                      value={formData.permitStatus}
                      onChange={(e) => handleInputChange('permitStatus', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Permit Issue Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.permitIssueDate}
                        onChange={(e) => handleInputChange('permitIssueDate', e.target.value)}
                        placeholder="01-Jan-2026"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                      />
                      <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Permit Expiry Date</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.permitExpiryDate}
                        onChange={(e) => handleInputChange('permitExpiryDate', e.target.value)}
                        placeholder="31-Dec-2026"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                      />
                      <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Persons */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">Contact Persons</span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Primary Contact Person */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Primary Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Name</label>
                    <input
                      type="text"
                      value={formData.primaryName}
                      onChange={(e) => handleInputChange('primaryName', e.target.value)}
                      placeholder="Sara Mohammed Al Kaabi"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Title / Designation</label>
                    <input
                      type="text"
                      value={formData.primaryTitle}
                      onChange={(e) => handleInputChange('primaryTitle', e.target.value)}
                      placeholder="Environmental Manager"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.primaryEmail}
                        onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                        placeholder="sara.alkaabi@gmcf.ae"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                      />
                      <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.primaryPhone}
                        onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                      />
                      <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternate Contact Person */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-3">Alternate Contact Person</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Name</label>
                    <input
                      type="text"
                      value={formData.alternateName}
                      onChange={(e) => handleInputChange('alternateName', e.target.value)}
                      placeholder="Sara Mohammed Al Kaabi"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Title / Designation</label>
                    <input
                      type="text"
                      value={formData.alternateTitle}
                      onChange={(e) => handleInputChange('alternateTitle', e.target.value)}
                      placeholder="Environmental Manager"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.alternateEmail}
                        onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                        placeholder="sara.alkaabi@gmcf.ae"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                      />
                      <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                        placeholder="+971 50 123 4567"
                        className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                      />
                      <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Renewal & Report a Change (Only for Approved Facilities) / Declaration & Supporting Documents (First-time) */}
          <div className="rounded-xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
            <div className="px-5 py-3 bg-[#E9F1F8] border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#004B87]">
                {isFacilityApproved ? 'Annual Renewal & Report a Change' : 'Declaration & Supporting Documents'}
              </span>
            </div>
            <div className="p-5 space-y-5 text-xs">
              {/* Annual Renewal (Only available if facility has already been approved) */}
              {isFacilityApproved && (
                <div>
                  <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Annual Renewal</h4>
                  <div className="flex flex-wrap gap-6 text-xs font-medium text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.confirmDetailsCorrect !== false}
                        onChange={(e) => handleInputChange('confirmDetailsCorrect', e.target.checked)}
                        className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87]"
                      />
                      <span>Confirm registration details are correct</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Declaration */}
              <div>
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Declaration</h4>
                <div className="p-3.5 bg-[#F4F8FC] border border-sky-100 rounded-xl">
                  <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.declarationConfirmed !== false}
                      onChange={(e) => handleInputChange('declarationConfirmed', e.target.checked)}
                      className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87]"
                    />
                    <span>I confirm that the information provided is true and accurate</span>
                  </label>
                </div>
              </div>

              {/* Report a Change (Only displayed for approved facilities on update page) */}
              {isFacilityApproved && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-[#004B87]">Report a Change</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">Change Type</label>
                      <select
                        value={formData.changeType || 'Change of Operator'}
                        onChange={(e) => handleInputChange('changeType', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm cursor-pointer"
                      >
                        <option value="Change of Operator">Change of Operator</option>
                        <option value="Change of Facility Boundary">Change of Facility Boundary</option>
                        <option value="Change of Fuel / Material Mix">Change of Fuel / Material Mix</option>
                        <option value="Operational Capacity Modification">Operational Capacity Modification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">Effective Date</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.changeEffectiveDate || '01-Jan-2026'}
                          onChange={(e) => handleInputChange('changeEffectiveDate', e.target.value)}
                          placeholder="01-Jan-2026"
                          className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm font-medium"
                        />
                        <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <label className="block text-slate-700 font-semibold mb-1.5">Change Description</label>
                    <textarea
                      rows={2}
                      value={formData.changeDescription !== undefined && formData.changeDescription !== '' ? formData.changeDescription : 'Additional production line commissioned in July 2026.'}
                      onChange={(e) => handleInputChange('changeDescription', e.target.value)}
                      placeholder="Additional production line commissioned in July 2026."
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Supporting Documents Upload */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#004B87] mb-2.5">Supporting Documents</h4>
                <label className="block text-slate-700 font-semibold mb-2">Attach Files</label>
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

                  {(formData.attachedFiles && formData.attachedFiles.length > 0 ? formData.attachedFiles : [{ name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' }]).map((file: any, idx: number) => (
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
                        onClick={() => handleInputChange('attachedFiles', (formData.attachedFiles || []).filter((_: any, i: number) => i !== idx))}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Remarks / Description */}
          <div className="pt-2 text-xs">
            <label className="block text-slate-700 font-semibold mb-1.5 text-xs">Remarks / Description</label>
            <textarea
              rows={3}
              value={formData.generalRemarks}
              onChange={(e) => handleInputChange('generalRemarks', e.target.value)}
              placeholder="All facility data, operational parameters, and statutory environmental details have been reviewed and verified for annual registration submission."
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
            onClick={handleSubmitRegistration}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer"
          >
            <span>{formData.status === 'Correction Required' ? 'Resubmit Registration' : 'Submit Registration'}</span>
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {isEadReviewerOrAdmin && (
          <>
            <button
              onClick={handleReturnForCorrection}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Return for Correction</span>
            </button>

            <button
              onClick={handleRejectRegistration}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-xs font-bold text-rose-800 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>Reject</span>
            </button>

            <button
              onClick={handleEadApprove}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-emerald-600/25 hover:shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>EAD Approve Registration</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
