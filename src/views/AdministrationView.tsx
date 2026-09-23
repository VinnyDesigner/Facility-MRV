import React, { useState, useMemo } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowLeft,
  Download,
  KeyRound,
  History,
  Shield,
  RotateCcw,
  Bookmark,
  ArrowRight,
  Send,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Eye,
  Info,
  UserCheck,
  Lock,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';

// ============================================================================
// TYPES
// ============================================================================
export interface EntityRecord {
  id: string;
  name: string;
  type: 'Single' | 'Parent';
  parentEntity: string;
  address: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: 'Active' | 'Inactive';
  permissions: Record<string, boolean>;
  createdDate: string;
}

export interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  userType: 'Internal User' | 'External User';
  roleName: string;
  entityName: string;
  isMultiEntity?: boolean;
  selectedEntities?: string[];
  enableMFA?: boolean;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
}

export interface ActionLogRecord {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  module: string;
  ipAddress: string;
  entityName: string;
  status: 'Success' | 'Failed' | 'Warning' | 'success' | 'failed' | 'warning';
  description?: string;
}

export interface PermissionRecord {
  id: string;
  displayName: string;
  description: string;
  permissionName: string;
  moduleId: string;
}

// ============================================================================
// PERMISSION MATRIX DEFINITION (From Reference Images)
// ============================================================================
export const PERMISSION_MODULES: {
  id: string;
  name: string;
  description: string;
  permissions: { id: string; name: string }[];
}[] = [
  {
    id: 'AQPReports',
    name: 'AQP Reports',
    description: 'Air Quality & Pollutants Emission Reporting Capabilities',
    permissions: [
      { id: 'aqp_activity_facility', name: 'Activity Data by Facility Report AQP' },
      { id: 'aqp_activity_sector', name: 'Activity Data by Sector Report AQP' },
      { id: 'aqp_emission_sector_year', name: 'Emission by Sector and Year Report AQP' },
      { id: 'aqp_submission_all_years', name: 'Entity Submission Status All Years Report AQP' },
      { id: 'aqp_submission_status', name: 'Entity Submission Status Report AQP' },
      { id: 'aqp_facility_emission', name: 'Facility Emission Report AQP' },
      { id: 'aqp_facility_detailed', name: 'Facility Submission Detailed Report AQP' },
      { id: 'aqp_facility_status', name: 'Facility Submission Status Report AQP' },
      { id: 'aqp_region_level', name: 'Region Level Report AQP' },
      { id: 'aqp_view_summary', name: 'View Facility Summary Details AQP' },
      { id: 'aqp_view_fuel', name: 'View Fuel Consumption Entity Report AQP' },
      { id: 'aqp_view_subsector', name: 'View SubSector Wise Total Emissions AQP' },
    ],
  },
  {
    id: 'GHGReports',
    name: 'GHG Reports',
    description: 'Greenhouse Gas Monitoring & Statutory Compliance Reports',
    permissions: [
      { id: 'ghg_activity_facility', name: 'Activity Data by Facility Report GHG' },
      { id: 'ghg_activity_sector', name: 'Activity Data by Sector Report GHG' },
      { id: 'ghg_emission_sector_year', name: 'Emission by Sector and Year Report GHG' },
      { id: 'ghg_submission_all_years', name: 'Entity Submission Status All Years Report GHG' },
      { id: 'ghg_submission_status', name: 'Entity Submission Status Report GHG' },
      { id: 'ghg_facility_emission', name: 'Facility Emission Report GHG' },
      { id: 'ghg_facility_detailed', name: 'Facility Submission Detailed Report GHG' },
      { id: 'ghg_facility_status', name: 'Facility Submission Status Report GHG' },
      { id: 'ghg_region_level', name: 'Region Level Report GHG' },
      { id: 'ghg_view_summary', name: 'View Facility Summary Details GHG' },
      { id: 'ghg_view_fuel', name: 'View Fuel Consumption Entity Report GHG' },
      { id: 'ghg_view_subsector', name: 'View SubSector Wise Total Emissions GHG' },
    ],
  },
  {
    id: 'Emirates',
    name: 'Emirates Governance',
    description: 'Regional boundaries, emirate configurations & jurisdictions',
    permissions: [
      { id: 'emr_create', name: 'Create Emirates' },
      { id: 'emr_delete', name: 'Delete Emirates' },
      { id: 'emr_update', name: 'Update Emirates' },
      { id: 'emr_view', name: 'View Emirates' },
    ],
  },
  {
    id: 'EmissionTechnology',
    name: 'Emission Technology',
    description: 'Technology categorizations, combustion models & standard factors',
    permissions: [
      { id: 'tech_create', name: 'Create EmissionTechnology' },
      { id: 'tech_delete', name: 'Delete EmissionTechnology' },
      { id: 'tech_update', name: 'Update EmissionTechnology' },
      { id: 'tech_view', name: 'View EmissionTechnology' },
    ],
  },
  {
    id: 'Entity',
    name: 'Entity Administration',
    description: 'Operator entities, subsidiaries, parent groupings & accounts',
    permissions: [
      { id: 'ent_create', name: 'Create Entity' },
      { id: 'ent_delete', name: 'Delete Entity' },
      { id: 'ent_update', name: 'Update Entity' },
      { id: 'ent_view', name: 'View Entity' },
    ],
  },
  {
    id: 'FacilityConfiguration',
    name: 'Facility Configuration',
    description: 'Plant parameters, source streams & environmental permits',
    permissions: [
      { id: 'em_approve', name: 'Approve Emission Data' },
      { id: 'em_create', name: 'Create Emission Data' },
      { id: 'em_delete', name: 'Delete Emission Data' },
      { id: 'em_delete_submitted', name: 'Delete Submitted Emission Data' },
      { id: 'em_reject', name: 'Reject Emission Data' },
      { id: 'em_revert', name: 'Revert Emission Data' },
      { id: 'em_update', name: 'Update Emission Data' },
    ],
  },
  {
    id: 'FAQs',
    name: 'FAQs',
    description: 'Frequently asked questions and knowledge base administration',
    permissions: [
      { id: 'faqs_create', name: 'Create FAQs' },
      { id: 'faqs_delete', name: 'Delete FAQs' },
      { id: 'faqs_update', name: 'Update FAQs' },
      { id: 'faqs_view', name: 'View FAQs' },
    ],
  },
  {
    id: 'FuelManager',
    name: 'FuelManager',
    description: 'Fuel types, thermal values & calorific inventory configuration',
    permissions: [
      { id: 'fuel_create', name: 'Create FuelManager' },
      { id: 'fuel_delete', name: 'Delete FuelManager' },
      { id: 'fuel_update', name: 'Update FuelManager' },
      { id: 'fuel_view', name: 'View FuelManager' },
    ],
  },
  {
    id: 'Gas',
    name: 'Gas',
    description: 'Greenhouse gas compounds, GWP factors & measurement definitions',
    permissions: [
      { id: 'gas_create', name: 'Create Gas' },
      { id: 'gas_delete', name: 'Delete Gas' },
      { id: 'gas_update', name: 'Update Gas' },
      { id: 'gas_view', name: 'View Gas' },
    ],
  },
  {
    id: 'Location',
    name: 'Location',
    description: 'Geographic jurisdictions, coordinate markers & regional zones',
    permissions: [
      { id: 'loc_create', name: 'Create Location' },
      { id: 'loc_delete', name: 'Delete Location' },
      { id: 'loc_update', name: 'Update Location' },
      { id: 'loc_view', name: 'View Location' },
    ],
  },
  {
    id: 'Permission',
    name: 'Permission',
    description: 'Security matrix, granular capability scopes & policy controls',
    permissions: [
      { id: 'perm_create', name: 'Create Permission' },
      { id: 'perm_delete', name: 'Delete Permission' },
      { id: 'perm_update', name: 'Update Permission' },
      { id: 'perm_view', name: 'View Permission' },
    ],
  },
  {
    id: 'PlantTechnologies',
    name: 'PlantTechnologies',
    description: 'Combustion systems, emission reduction units & technology standards',
    permissions: [
      { id: 'plant_tech_create', name: 'Create Plant Technologies' },
      { id: 'plant_tech_delete', name: 'Delete Plant Technologies' },
      { id: 'plant_tech_update', name: 'Update Plant Technologies' },
      { id: 'plant_tech_view', name: 'View Plant Technologies' },
    ],
  },
  {
    id: 'Queries',
    name: 'Queries',
    description: 'Operator compliance queries, clarification tickets & EAD support',
    permissions: [
      { id: 'queries_create', name: 'Create Queries' },
    ],
  },
  {
    id: 'Role',
    name: 'Role',
    description: 'User roles, profile templates & authorization assignments',
    permissions: [
      { id: 'role_create', name: 'Create Role' },
      { id: 'role_delete', name: 'Delete Role' },
      { id: 'role_update', name: 'Update Role' },
      { id: 'role_view', name: 'View Role' },
    ],
  },
  {
    id: 'Tenant',
    name: 'Tenant',
    description: 'Multi-tenant partitions, organization domains & tenant isolation',
    permissions: [
      { id: 'tenant_create', name: 'Create Tenant' },
      { id: 'tenant_delete', name: 'Delete Tenant' },
      { id: 'tenant_update', name: 'Update Tenant' },
      { id: 'tenant_view', name: 'View Tenant' },
    ],
  },
  {
    id: 'User',
    name: 'User',
    description: 'User accounts, authentication methods & identity provisioning',
    permissions: [
      { id: 'user_create', name: 'Create User' },
      { id: 'user_delete', name: 'Delete User' },
      { id: 'user_update', name: 'Update User' },
      { id: 'user_view', name: 'View User' },
    ],
  },
  {
    id: 'Notifications',
    name: 'Notifications',
    description: 'System notification triggers, email alerts & dispatch queues',
    permissions: [
      { id: 'notif_approval', name: 'Emission Approval Notification' },
      { id: 'notif_reject', name: 'Emission Reject Notification' },
      { id: 'notif_revert', name: 'Emission Revert Notification' },
      { id: 'notif_submit', name: 'Emission Submit Notification' },
      { id: 'notif_verify', name: 'Emission Verify Notification' },
      { id: 'notif_resend', name: 'Re-Send Notification' },
      { id: 'notif_view', name: 'View Notification' },
    ],
  },
  {
    id: 'NewAQPDashBoard',
    name: 'NewAQPDashBoard',
    description: 'Air Quality Pollutants dashboard statistics & overview',
    permissions: [
      { id: 'aqp_dash_emissions', name: 'New AQP Dashboard Emissions' },
      { id: 'aqp_dash_entities', name: 'New AQP Dashboard Entities' },
      { id: 'aqp_dash_facilities', name: 'New AQP Dashboard Facilities' },
      { id: 'aqp_dash_overview', name: 'New AQP Dashboard Overview' },
      { id: 'aqp_dash_submissions', name: 'New AQP Dashboard Submissions' },
      { id: 'aqp_dash_verification', name: 'New AQP Dashboard Verification' },
    ],
  },
  {
    id: 'NewGHGDashBoard',
    name: 'NewGHGDashBoard',
    description: 'Greenhouse Gas dashboard metrics, trends & verification stats',
    permissions: [
      { id: 'ghg_dash_emissions', name: 'New GHG Dashboard Emissions' },
      { id: 'ghg_dash_entities', name: 'New GHG Dashboard Entities' },
      { id: 'ghg_dash_facilities', name: 'New GHG Dashboard Facilities' },
      { id: 'ghg_dash_overview', name: 'New GHG Dashboard Overview' },
      { id: 'ghg_dash_submissions', name: 'New GHG Dashboard Submissions' },
      { id: 'ghg_dash_verification', name: 'New GHG Dashboard Verification' },
    ],
  },
  {
    id: 'Configuration',
    name: 'Configuration',
    description: 'Facility setup, verifier workflows & monitoring rules',
    permissions: [
      { id: 'config_update_facility', name: 'Update Configured Facility' },
      { id: 'config_verifier_workflow', name: 'Verifier Work Flow' },
    ],
  },
  {
    id: 'EmissionStatus',
    name: 'Emission Status',
    description: 'Lifecycle states, compliance flags & status updates',
    permissions: [
      { id: 'em_status_update', name: 'Update Emission Status' },
    ],
  },
  {
    id: 'AuditLogs',
    name: 'AuditLogs',
    description: 'Audit trail records, activity logs & access logs',
    permissions: [
      { id: 'audit_view_logs', name: 'View Audit Logs' },
    ],
  },
  {
    id: 'EmissionReports',
    name: 'EmissionReports',
    description: 'Emission summary reports, breakdowns & entity comparisons',
    permissions: [
      { id: 'em_rep_breakdown', name: 'View Emission Breakdown' },
      { id: 'em_rep_comparison', name: 'View Emission Comparison' },
      { id: 'em_rep_summary', name: 'View EmissionSummary Report' },
      { id: 'em_rep_facility_entity', name: 'View Facility EmissionsBy Entity' },
    ],
  },
  {
    id: 'General',
    name: 'General',
    description: 'General emission data viewing and common portal utilities',
    permissions: [
      { id: 'gen_view_emissions', name: 'View Emissions Data' },
    ],
  },
];

// ============================================================================
// SAMPLE DATA FROM USER REFERENCE IMAGES
// ============================================================================
const INITIAL_ENTITIES: EntityRecord[] = [
  {
    id: 'ent-1',
    name: 'Abu Dhabi Municipality',
    type: 'Single',
    parentEntity: '—',
    address: 'Al Salam Street, Abu Dhabi, UAE',
    contactName: 'Madab',
    contactTitle: 'Head',
    contactEmail: 'Madab@adm.ae',
    contactPhone: '546676272',
    description: 'Municipal authority for public services, urban planning and regional infrastructure.',
    status: 'Active',
    createdDate: '12-Jan-2026',
  },
  {
    id: 'ent-2',
    name: 'Abu Dhabi Police',
    type: 'Single',
    parentEntity: '—',
    address: 'Muroor Road, Abu Dhabi, UAE',
    contactName: 'capt Zeinab',
    contactTitle: 'Head',
    contactEmail: 'ksaaalkaabi@gmail.com',
    contactPhone: '543937739',
    description: 'Law enforcement, emergency logistics and public safety administration.',
    status: 'Active',
    createdDate: '15-Jan-2026',
  },
  {
    id: 'ent-3',
    name: 'Abu Dhabi Ports',
    type: 'Single',
    parentEntity: '—',
    address: 'Zayed Port, Abu Dhabi, UAE',
    contactName: 'Meera',
    contactTitle: 'Head',
    contactEmail: 'meera@adports.com',
    contactPhone: '971343434344',
    description: 'Maritime trade, maritime port facilities and commercial logistics zones.',
    status: 'Active',
    createdDate: '18-Jan-2026',
  },
  {
    id: 'ent-4',
    name: 'AD Airports',
    type: 'Single',
    parentEntity: '—',
    address: 'Abu Dhabi International Airport Zone, UAE',
    contactName: 'Lasya',
    contactTitle: 'Manager',
    contactEmail: 'Lasya@adairport.com',
    contactPhone: '97145634567',
    description: 'Aviation hub infrastructure, passenger terminals and airside ground operations.',
    status: 'Active',
    createdDate: '20-Jan-2026',
  },
  {
    id: 'ent-5',
    name: 'AD Aviation',
    type: 'Single',
    parentEntity: '—',
    address: 'Al Bateen Executive Airport, Abu Dhabi, UAE',
    contactName: 'Sijha Basheer Ahammed',
    contactTitle: 'Head of Tax and ESG',
    contactEmail: 's.bahammed@ada.ae',
    contactPhone: '971564187406',
    description: 'Commercial helicopter aviation, offshore flight support and search and rescue services.',
    status: 'Active',
    createdDate: '25-Jan-2026',
  },
  {
    id: 'ent-6',
    name: 'ADAFSA',
    type: 'Single',
    parentEntity: '—',
    address: 'Al Ain Road, Abu Dhabi Agriculture and Food Safety Authority, UAE',
    contactName: 'Abdullah',
    contactTitle: 'Operator',
    contactEmail: 'Abdullah@adafsa.com',
    contactPhone: '975434545467',
    description: 'Agricultural sustainability, food biosecurity and livestock emissions compliance.',
    status: 'Active',
    createdDate: '02-Feb-2026',
  },
  {
    id: 'ent-7',
    name: 'ADNOC',
    type: 'Parent',
    parentEntity: '—',
    address: 'ADNOC Headquarters, Corniche Road, Abu Dhabi, UAE',
    contactName: 'Shameedli',
    contactTitle: 'Head',
    contactEmail: 'shameedli@adnoc.ae',
    contactPhone: '5367843244',
    description: 'Abu Dhabi National Oil Company parent sovereign energy corporation.',
    status: 'Active',
    createdDate: '05-Feb-2026',
  },
  {
    id: 'ent-8',
    name: 'ADNOC Distribution',
    type: 'Single',
    parentEntity: 'ADNOC',
    address: 'Sheikh Zayed Street, Abu Dhabi, UAE',
    contactName: 'shahidi',
    contactTitle: 'MANAGER',
    contactEmail: 'shahidi@adnoc.ae',
    contactPhone: '5353422211',
    description: 'Downstream fuels distribution, wholesale commercial fuel depots and retail network.',
    status: 'Active',
    createdDate: '10-Feb-2026',
  },
  {
    id: 'ent-9',
    name: 'ADQ',
    type: 'Single',
    parentEntity: '—',
    address: 'Capital Gate Tower, Abu Dhabi, UAE',
    contactName: 'Mariam',
    contactTitle: 'ADQ',
    contactEmail: 'Mariam@ADQ.ae',
    contactPhone: '547282222',
    description: 'Strategic sovereign holding company for critical infrastructure assets.',
    status: 'Active',
    createdDate: '15-Feb-2026',
  },
];

const INITIAL_ROLES: RoleRecord[] = [
  {
    id: 'role-1',
    name: 'Data Provider',
    description: 'Can manage tenants and organizations.',
    userCount: 14,
    status: 'Active',
    permissions: {
      aqp_activity_facility: true,
      ghg_activity_facility: true,
      em_create: true,
      em_update: true,
      ent_view: true,
    },
    createdDate: '01-Jan-2026',
  },
  {
    id: 'role-2',
    name: 'Data Reviewer',
    description: 'Can manage categories and their contents.',
    userCount: 8,
    status: 'Active',
    permissions: {
      aqp_facility_emission: true,
      ghg_facility_emission: true,
      em_revert: true,
      em_reject: true,
      em_approve: true,
      ent_view: true,
    },
    createdDate: '01-Jan-2026',
  },
  {
    id: 'role-3',
    name: 'Data Verifier',
    description: 'Can manage categories and their contents.',
    userCount: 6,
    status: 'Active',
    permissions: {
      aqp_facility_detailed: true,
      ghg_facility_detailed: true,
      em_approve: true,
      em_update: true,
      ent_view: true,
    },
    createdDate: '01-Jan-2026',
  },
  {
    id: 'role-4',
    name: 'EadAdmin',
    description: 'Can manage and edit content across the platform.',
    userCount: 4,
    status: 'Active',
    permissions: {
      aqp_activity_facility: true,
      aqp_activity_sector: true,
      ghg_activity_facility: true,
      ghg_activity_sector: true,
      em_approve: true,
      em_create: true,
      em_delete: true,
      em_reject: true,
      em_revert: true,
      em_update: true,
      ent_create: true,
      ent_update: true,
      ent_view: true,
    },
    createdDate: '01-Jan-2026',
  },
  {
    id: 'role-5',
    name: 'SystemAdmin',
    description: 'System Admin',
    userCount: 2,
    status: 'Active',
    permissions: PERMISSION_MODULES.reduce((acc, mod) => {
      mod.permissions.forEach((p) => {
        acc[p.id] = true;
      });
      return acc;
    }, {} as Record<string, boolean>),
    createdDate: '01-Jan-2026',
  },
];

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-1',
    firstName: 'Aaal',
    lastName: 'ahmed',
    name: 'Aaal ahmed',
    email: 'aaalahmed@doe.gov.ae',
    phone: '0533323323',
    userType: 'Internal User',
    roleName: 'EadAdmin',
    entityName: 'Abu Dhabi Municipality',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 11:42',
  },
  {
    id: 'usr-2',
    firstName: 'abdelaleem',
    lastName: 'khan',
    name: 'abdelaleem khan',
    email: 'abdelaleem.khan@dmt.gov.ae',
    phone: '0543930000',
    userType: 'Internal User',
    roleName: 'Data Reviewer',
    entityName: 'Abu Dhabi Municipality',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 13:10',
  },
  {
    id: 'usr-3',
    firstName: 'abdelrahman',
    lastName: 'elsherif',
    name: 'abdelrahman elsherif',
    email: 'abdelrahman.elsherif@agthia.com',
    phone: '05436762665',
    userType: 'Internal User',
    roleName: 'Data Provider',
    entityName: 'Agthia',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '22-Sep-2026 16:30',
  },
  {
    id: 'usr-4',
    firstName: 'abdulwaasay',
    lastName: 'khan',
    name: 'abdulwaasay khan',
    email: 'abdulwaasay.khan@enec.ae',
    phone: '054323456',
    userType: 'Internal User',
    roleName: 'Data Provider',
    entityName: 'ADNOC',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 09:15',
  },
  {
    id: 'usr-5',
    firstName: 'abeer',
    lastName: 'sajwani',
    name: 'abeer sajwani',
    email: 'abeer.sajwani@dmt.gov.ae',
    phone: '5439394381111',
    userType: 'External User',
    roleName: 'Data Provider',
    entityName: 'Abu Dhabi Ports',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '21-Sep-2026 14:20',
  },
  {
    id: 'usr-6',
    firstName: 'abhisek',
    lastName: 'sarkar',
    name: 'abhisek sarkar',
    email: 'abhisek.sarkar@algharbiapipe.com',
    phone: '0875433',
    userType: 'Internal User',
    roleName: 'Data Provider',
    entityName: 'AD Airports',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 14:02',
  },
  {
    id: 'usr-7',
    firstName: 'Activity',
    lastName: 'data',
    name: 'Activity data',
    email: 'Activitydata@aramex.ae',
    phone: '05031119543',
    userType: 'External User',
    roleName: 'Data Provider',
    entityName: 'AD Aviation',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '20-Sep-2026 10:15',
  },
  {
    id: 'usr-8',
    firstName: 'Activitydata',
    lastName: 'EMSTEEL',
    name: 'Activitydata EMSTEEL',
    email: 'Activitydata@EMSTEEL.ae',
    phone: '54392222',
    userType: 'External User',
    roleName: 'Data Provider',
    entityName: 'ADAFSA',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '19-Sep-2026 08:30',
  },
  {
    id: 'usr-9',
    firstName: 'Activitydata',
    lastName: 'Activitydata',
    name: 'Activitydata Activitydata',
    email: 'Activitydata@adairports.ae',
    phone: '543939438',
    userType: 'External User',
    roleName: 'Data Provider',
    entityName: 'AD Airports',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '18-Sep-2026 15:45',
  },
  {
    id: 'usr-10',
    firstName: 'Ahmed',
    lastName: 'Al Zaabi',
    name: 'Ahmed Al Zaabi',
    email: 'ahmed.zaabi@alnoor-energy.ae',
    phone: '+971 50 123 4567',
    userType: 'Internal User',
    roleName: 'Data Provider',
    entityName: 'Al Noor Industrial Facility',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 11:42',
  },
  {
    id: 'usr-11',
    firstName: 'Fatima',
    lastName: 'Al Suwaidi',
    name: 'Fatima Al Suwaidi',
    email: 'fatima.suwaidi@ead.gov.ae',
    phone: '+971 50 987 6543',
    userType: 'Internal User',
    roleName: 'Data Reviewer',
    entityName: 'Environment Agency - Abu Dhabi',
    isMultiEntity: false,
    enableMFA: false,
    status: 'Active',
    lastLogin: '23-Sep-2026 13:10',
  },
  {
    id: 'usr-12',
    firstName: 'Sultan',
    lastName: 'Al Nuaimi',
    name: 'Sultan Al Nuaimi',
    email: 'sultan.admin@ead.gov.ae',
    phone: '+971 50 334 4556',
    userType: 'Internal User',
    roleName: 'SystemAdmin',
    entityName: 'Environment Agency - Abu Dhabi',
    isMultiEntity: true,
    enableMFA: true,
    status: 'Active',
    lastLogin: '23-Sep-2026 14:02',
  },
];

export const INITIAL_PERMISSIONS: PermissionRecord[] = [
  {
    id: 'aqp_activity_facility',
    displayName: 'Activity Data by Facility Report AQP',
    description: 'Allows view of Activity Data by Facility Report AQP',
    permissionName: 'ActivityDatabyFacilityReportAQP',
    moduleId: 'AQPReports',
  },
  {
    id: 'ghg_activity_facility',
    displayName: 'Activity Data by Facility Report GHG',
    description: 'Allows view of Activity Data by Facility Report GHG',
    permissionName: 'ActivityDatabyFacilityReportGHG',
    moduleId: 'GHGReports',
  },
  {
    id: 'aqp_activity_sector',
    displayName: 'Activity Data by Sector Report AQP',
    description: 'Allows view of Activity Data by Sector Report AQP',
    permissionName: 'ActivityDatabySectorReportAQP',
    moduleId: 'AQPReports',
  },
  {
    id: 'ghg_activity_sector',
    displayName: 'Activity Data by Sector Report GHG',
    description: 'Allows view of Activity Data by Sector Report GHG',
    permissionName: 'ActivityDatabySectorReportGHG',
    moduleId: 'GHGReports',
  },
  {
    id: 'em_approve',
    displayName: 'Approve Emission Data',
    description: 'Allows creation of Emission',
    permissionName: 'ApproveEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'emr_create',
    displayName: 'Create Emirates',
    description: 'Allows creation of a new emirates.',
    permissionName: 'CreateEmirates',
    moduleId: 'Emirates',
  },
  {
    id: 'em_create',
    displayName: 'Create Emission Data',
    description: 'Allows creation of Emission',
    permissionName: 'CreateEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'tech_create',
    displayName: 'CreateEmissionTechnology',
    description: 'Allows creation of emission technology data',
    permissionName: 'CreateEmissionTechnology',
    moduleId: 'EmissionTechnology',
  },
  {
    id: 'ent_create',
    displayName: 'Create Entity',
    description: 'Allows creation of a new entity.',
    permissionName: 'CreateEntity',
    moduleId: 'Entity',
  },
  {
    id: 'faqs_create',
    displayName: 'Create FAQs',
    description: 'Allows creation of FAQs',
    permissionName: 'CreateFAQs',
    moduleId: 'FAQs',
  },
  {
    id: 'fuel_create',
    displayName: 'Create FuelManager',
    description: 'Allows creation of FuelManager',
    permissionName: 'CreateFuelManager',
    moduleId: 'FuelManager',
  },
  {
    id: 'gas_create',
    displayName: 'Create Gas',
    description: 'Allows creation of Gas',
    permissionName: 'CreateGas',
    moduleId: 'Gas',
  },
  {
    id: 'loc_create',
    displayName: 'Create Location',
    description: 'Allows creation of Location',
    permissionName: 'CreateLocation',
    moduleId: 'Location',
  },
  {
    id: 'perm_create',
    displayName: 'Create Permission',
    description: 'Allows creation of Permission',
    permissionName: 'CreatePermission',
    moduleId: 'Permission',
  },
  {
    id: 'plant_tech_create',
    displayName: 'Create Plant Technologies',
    description: 'Allows creation of Plant Technologies',
    permissionName: 'CreatePlantTechnologies',
    moduleId: 'PlantTechnologies',
  },
  {
    id: 'queries_create',
    displayName: 'Create Queries',
    description: 'Allows creation of Queries',
    permissionName: 'CreateQueries',
    moduleId: 'Queries',
  },
  {
    id: 'role_create',
    displayName: 'Create Role',
    description: 'Allows creation of Role',
    permissionName: 'CreateRole',
    moduleId: 'Role',
  },
  {
    id: 'tenant_create',
    displayName: 'Create Tenant',
    description: 'Allows creation of Tenant',
    permissionName: 'CreateTenant',
    moduleId: 'Tenant',
  },
  {
    id: 'user_create',
    displayName: 'Create User',
    description: 'Allows creation of User',
    permissionName: 'CreateUser',
    moduleId: 'User',
  },
  {
    id: 'emr_delete',
    displayName: 'Delete Emirates',
    description: 'Allows deletion of Emirates.',
    permissionName: 'DeleteEmirates',
    moduleId: 'Emirates',
  },
  {
    id: 'em_delete',
    displayName: 'Delete Emission Data',
    description: 'Allows deletion of Emission Data',
    permissionName: 'DeleteEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'em_delete_submitted',
    displayName: 'Delete Submitted Emission Data',
    description: 'Allows deletion of Submitted Emission Data',
    permissionName: 'DeleteSubmittedEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'em_reject',
    displayName: 'Reject Emission Data',
    description: 'Allows rejection of Emission Data',
    permissionName: 'RejectEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'em_revert',
    displayName: 'Revert Emission Data',
    description: 'Allows reverting of Emission Data',
    permissionName: 'RevertEmissionData',
    moduleId: 'FacilityConfiguration',
  },
  {
    id: 'em_update',
    displayName: 'Update Emission Data',
    description: 'Allows update of Emission Data',
    permissionName: 'UpdateEmissionData',
    moduleId: 'FacilityConfiguration',
  },
];

export const INITIAL_LOGS: ActionLogRecord[] = [
  {
    id: 'log-1',
    timestamp: '23/09/2026 11:12:04',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: '22/09/2026 17:09:57',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-3',
    timestamp: '18/09/2026 14:01:09',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-4',
    timestamp: '18/09/2026 13:26:17',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Public Electricity and Heat Production Emission Data Created for the Facility Name is T1 Emission Calculations verifying and The Assigned Category Name is Public Electricity and Heat Production',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-5',
    timestamp: '18/09/2026 12:50:01',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Public Electricity and Heat Production Emission Data Updated for the Facility Name is T1 Emission Calculations verifying and The Assigned Category Name is Public Electricity and Heat Production',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-6',
    timestamp: '18/09/2026 12:49:47',
    action: 'Emission Work Flow History',
    userName: 'System Admin',
    description: 'Updated Emission Work Flow History for the assigned Work Flow History status is Reverted',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-7',
    timestamp: '18/09/2026 12:47:51',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Public Electricity and Heat Production Emission Data Updated for the Facility Name is T1 Emission Calculations verifying and The Assigned Category Name is Public Electricity and Heat Production',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-8',
    timestamp: '18/09/2026 12:47:40',
    action: 'Emission Work Flow History',
    userName: 'System Admin',
    description: 'Updated Emission Work Flow History for the assigned Work Flow History status is Reverted',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-9',
    timestamp: '18/09/2026 12:39:19',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Public Electricity and Heat Production Emission Data Updated for the Facility Name is T1 Emission Calculations verifying and The Assigned Category Name is Public Electricity and Heat Production',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-10',
    timestamp: '18/09/2026 12:39:07',
    action: 'Emission Work Flow History',
    userName: 'System Admin',
    description: 'Updated Emission Work Flow History for the assigned Work Flow History status is Reverted',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-11',
    timestamp: '18/09/2026 11:20:15',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-12',
    timestamp: '17/09/2026 16:45:32',
    action: 'Facility Registration',
    userName: 'System Admin',
    description: 'Facility Registration Dossier Submitted for Review for Al Noor Industrial Facility',
    module: 'FacilityConfiguration',
    entityName: 'Al Noor Energy & Power Operations LLC',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-13',
    timestamp: '17/09/2026 15:20:11',
    action: 'User Management',
    userName: 'System Admin',
    description: 'Created new user account for Abdelrahman Elsherif under entity Agthia',
    module: 'User',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-14',
    timestamp: '17/09/2026 14:10:05',
    action: 'Role Management',
    userName: 'System Admin',
    description: 'Modified role permissions matrix for Data Reviewer role',
    module: 'Role',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-15',
    timestamp: '16/09/2026 11:05:40',
    action: 'Entity Management',
    userName: 'System Admin',
    description: 'Updated contact information for Abu Dhabi Municipality',
    module: 'Entity',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-16',
    timestamp: '15/09/2026 09:30:22',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-17',
    timestamp: '14/09/2026 14:15:00',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Facility Emission Data Approved for the Facility Name is Al Noor Industrial Facility',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-18',
    timestamp: '14/09/2026 11:00:34',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-19',
    timestamp: '13/09/2026 16:22:18',
    action: 'Emission Work Flow History',
    userName: 'System Admin',
    description: 'Updated Emission Work Flow History for the assigned Work Flow History status is Submitted',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-20',
    timestamp: '12/09/2026 10:05:50',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-21',
    timestamp: '11/09/2026 15:40:12',
    action: 'Monitoring Plan',
    userName: 'System Admin',
    description: 'Monitoring Plan Approved for Al Noor Industrial Facility (MP-2026-004)',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-22',
    timestamp: '10/09/2026 09:12:44',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-23',
    timestamp: '09/09/2026 14:55:30',
    action: 'Facility Emission Data',
    userName: 'System Admin',
    description: 'Public Electricity and Heat Production Emission Data Created for the Facility Name is T1 Emission Calculations verifying',
    module: 'FacilityConfiguration',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-24',
    timestamp: '08/09/2026 11:30:19',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-25',
    timestamp: '07/09/2026 16:10:05',
    action: 'Role Management',
    userName: 'System Admin',
    description: 'Created new system role EadVerifier with comprehensive verification permissions',
    module: 'Role',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-26',
    timestamp: '06/09/2026 13:45:22',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-27',
    timestamp: '05/09/2026 10:20:18',
    action: 'Entity Management',
    userName: 'System Admin',
    description: 'Registered new single entity AD Airports with aviation emission reporting capabilities',
    module: 'Entity',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-28',
    timestamp: '04/09/2026 12:00:55',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-29',
    timestamp: '03/09/2026 15:35:40',
    action: 'Permission Management',
    userName: 'System Admin',
    description: 'Updated Permission Description for Activity Data by Facility Report AQP',
    module: 'Permission',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-30',
    timestamp: '02/09/2026 09:15:10',
    action: 'Authentication',
    userName: 'System Admin',
    description: 'User Logged in Successfully for the UserEmail ID SAdmin@eadmrv.com and User Name is System Admin',
    module: 'Auth',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
  {
    id: 'log-31',
    timestamp: '01/09/2026 14:00:00',
    action: 'System Initialization',
    userName: 'System Admin',
    description: 'Annual MRV Reporting Cycle 2026 initialized successfully for Abu Dhabi Industrial Operators',
    module: 'System',
    entityName: 'Environment Agency - Abu Dhabi',
    ipAddress: '::1',
    status: 'success',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================
export const AdministrationView: React.FC = () => {
  const { currentRole, activeView } = useMRV();

  // Active sub-tab under Administration (sync with activeView)
  const getTabFromView = (view?: string): 'entity' | 'roles' | 'users' | 'permissions' | 'action-logs' => {
    if (!view) return 'entity';
    if (view === 'admin-roles' || view === 'roles') return 'roles';
    if (view === 'admin-users' || view === 'users') return 'users';
    if (view === 'admin-permissions' || view === 'permissions') return 'permissions';
    if (view === 'admin-logs' || view === 'admin-action-logs' || view === 'action-logs') return 'action-logs';
    return 'entity';
  };

  const [adminTab, setAdminTab] = useState<'entity' | 'roles' | 'users' | 'permissions' | 'action-logs'>(() =>
    getTabFromView(activeView)
  );

  // Sync tab whenever activeView changes from the left sidebar
  React.useEffect(() => {
    setAdminTab(getTabFromView(activeView));
    setEntitySubView('table');
    setRoleSubView('table');
    setUserSubView('table');
    setPermissionSubView('table');
    setSearchTerm('');
  }, [activeView]);

  // Sub-view mode for Entity, Roles, Users, Permissions (table / form / view / edit)
  const [entitySubView, setEntitySubView] = useState<'table' | 'form' | 'view'>('table');
  const [roleSubView, setRoleSubView] = useState<'table' | 'form' | 'view'>('table');
  const [userSubView, setUserSubView] = useState<'table' | 'form' | 'view'>('table');
  const [permissionSubView, setPermissionSubView] = useState<'table' | 'edit'>('table');

  // Datasets
  const [entities, setEntities] = useState<EntityRecord[]>(INITIAL_ENTITIES);
  const [roles, setRoles] = useState<RoleRecord[]>(INITIAL_ROLES);
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [permissions, setPermissions] = useState<PermissionRecord[]>(INITIAL_PERMISSIONS);
  const [actionLogs, setActionLogs] = useState<ActionLogRecord[]>(INITIAL_LOGS);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Action Logs Filter States (From Screenshot 3)
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');
  const [logSelectedUser, setLogSelectedUser] = useState('All');
  const [logActionQuery, setLogActionQuery] = useState('');

  // Selected Records for Edit / View / Delete
  const [selectedEntity, setSelectedEntity] = useState<EntityRecord | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleRecord | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<PermissionRecord | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'entity' | 'role' | 'user'; id: string; name: string } | null>(null);

  // Permission Form State
  const [permissionForm, setPermissionForm] = useState<{ displayName: string; description: string }>({
    displayName: '',
    description: '',
  });

  // Entity Form State
  const [entityForm, setEntityForm] = useState<Omit<EntityRecord, 'id' | 'createdDate'>>({
    name: '',
    type: 'Single',
    parentEntity: '—',
    address: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    status: 'Active',
  });

  // Role Form State
  const [roleForm, setRoleForm] = useState<{
    name: string;
    description: string;
    permissions: Record<string, boolean>;
  }>({
    name: '',
    description: '',
    permissions: {},
  });

  // User Form State (Dedicated page, NOT a popup)
  const [userForm, setUserForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: 'Internal User' | 'External User';
    roleName: string;
    entityName: string;
    isMultiEntity: boolean;
    selectedEntities: string[];
    updatePassword: boolean;
    password?: string;
    confirmPassword?: string;
    enableMFA: boolean;
    isActive: boolean;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userType: 'Internal User',
    roleName: 'Data Provider',
    entityName: 'Agthia',
    isMultiEntity: false,
    selectedEntities: ['Agthia'],
    updatePassword: false,
    password: '',
    confirmPassword: '',
    enableMFA: false,
    isActive: true,
  });

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3500);
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Reset pagination on tab/filter/search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [adminTab, searchTerm, filterType, logSelectedUser, logActionQuery, logStartDate, logEndDate]);

  // Distinct Users for User Action Logs
  const distinctLogUsers = useMemo(() => {
    const userSet = new Set<string>();
    actionLogs.forEach((l) => userSet.add(l.userName));
    return Array.from(userSet);
  }, [actionLogs]);

  // Filtered Lists
  const filteredEntities = useMemo(() => {
    return entities.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.contactPhone.includes(searchTerm);
      const matchType = filterType === 'All' || e.type === filterType;
      return matchSearch && matchType;
    });
  }, [entities, searchTerm, filterType]);

  const paginatedEntities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntities.slice(start, start + itemsPerPage);
  }, [filteredEntities, currentPage, itemsPerPage]);
  const totalEntityPages = Math.ceil(filteredEntities.length / itemsPerPage) || 1;

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'All' || r.status === filterType;
      return matchSearch && matchType;
    });
  }, [roles, searchTerm, filterType]);

  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRoles.slice(start, start + itemsPerPage);
  }, [filteredRoles, currentPage, itemsPerPage]);
  const totalRolePages = Math.ceil(filteredRoles.length / itemsPerPage) || 1;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);
      const matchType =
        filterType === 'All' ||
        u.status === filterType ||
        u.userType === filterType;
      return matchSearch && matchType;
    });
  }, [users, searchTerm, filterType]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const filteredPermissions = useMemo(() => {
    return permissions.filter((p) => {
      const matchSearch =
        p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.permissionName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'All' || p.moduleId === filterType;
      return matchSearch && matchType;
    });
  }, [permissions, searchTerm, filterType]);

  const paginatedPermissions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPermissions.slice(start, start + itemsPerPage);
  }, [filteredPermissions, currentPage, itemsPerPage]);
  const totalPermissionPages = Math.ceil(filteredPermissions.length / itemsPerPage) || 1;

  const filteredLogs = useMemo(() => {
    return actionLogs.filter((l) => {
      const matchUser = logSelectedUser === 'All' || l.userName === logSelectedUser;
      const matchAction =
        !logActionQuery ||
        l.action.toLowerCase().includes(logActionQuery.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(logActionQuery.toLowerCase()));
      const matchSearch =
        !searchTerm ||
        l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        l.ipAddress.includes(searchTerm);
      const matchStartDate = !logStartDate || l.timestamp.includes(logStartDate);
      const matchEndDate = !logEndDate || l.timestamp.includes(logEndDate);
      return matchUser && matchAction && matchSearch && matchStartDate && matchEndDate;
    });
  }, [actionLogs, logSelectedUser, logActionQuery, searchTerm, logStartDate, logEndDate]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);
  const totalLogPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  const renderPaginationFooter = (totalCount: number, totalPages: number, itemLabel: string) => (
    <div className="pt-2.5 pb-1 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium flex-shrink-0">
      <div className="flex items-center gap-2">
        <span>
          Showing <span className="font-bold text-slate-800">{totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of{' '}
          <span className="font-bold text-slate-800">{totalCount}</span> {itemLabel}
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
          type="button"
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
            type="button"
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
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  const getFilterOptions = () => {
    switch (adminTab) {
      case 'entity':
        return [
          { value: 'All', label: 'All Types' },
          { value: 'Single', label: 'Single' },
          { value: 'Parent', label: 'Parent' },
        ];
      case 'roles':
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
        ];
      case 'users':
        return [{ value: 'All', label: 'All' }];
      case 'action-logs':
        return [
          { value: 'All', label: 'All Statuses' },
          { value: 'Success', label: 'Success' },
          { value: 'Failed', label: 'Failed' },
        ];
      case 'permissions':
        return [
          { value: 'All', label: 'All Modules' },
          ...PERMISSION_MODULES.map((m) => ({ value: m.id, label: m.name })),
        ];
      default:
        return [{ value: 'All', label: 'All' }];
    }
  };

  // ==========================================================================
  // HANDLERS: ENTITY
  // ==========================================================================
  const handleOpenCreateEntity = () => {
    setSelectedEntity(null);
    setEntityForm({
      name: '',
      type: 'Single',
      parentEntity: '—',
      address: '',
      contactName: '',
      contactTitle: '',
      contactEmail: '',
      contactPhone: '',
      description: '',
      status: 'Active',
    });
    setEntitySubView('form');
  };

  const handleOpenEditEntity = (entity: EntityRecord) => {
    setSelectedEntity(entity);
    setEntityForm({
      name: entity.name,
      type: entity.type,
      parentEntity: entity.parentEntity,
      address: entity.address,
      contactName: entity.contactName,
      contactTitle: entity.contactTitle,
      contactEmail: entity.contactEmail,
      contactPhone: entity.contactPhone,
      description: entity.description,
      status: entity.status,
    });
    setEntitySubView('form');
  };

  const handleViewEntity = (entity: EntityRecord) => {
    setSelectedEntity(entity);
    setEntityForm({
      name: entity.name,
      type: entity.type,
      parentEntity: entity.parentEntity,
      address: entity.address,
      contactName: entity.contactName,
      contactTitle: entity.contactTitle,
      contactEmail: entity.contactEmail,
      contactPhone: entity.contactPhone,
      description: entity.description,
      status: entity.status,
    });
    setEntitySubView('view');
  };

  const handleSaveEntity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!entityForm.name || !entityForm.address || !entityForm.contactName || !entityForm.contactEmail) {
      alert('Please fill all mandatory fields (Entity Name, Address, Contact Name, Contact Email).');
      return;
    }

    if (selectedEntity) {
      // Edit
      setEntities((prev) =>
        prev.map((item) =>
          item.id === selectedEntity.id ? { ...item, ...entityForm } : item
        )
      );
      showNotice(`Entity "${entityForm.name}" updated successfully!`);
    } else {
      // Create
      const newEntity: EntityRecord = {
        ...entityForm,
        id: `ent-${Date.now()}`,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      setEntities((prev) => [newEntity, ...prev]);
      showNotice(`Entity "${entityForm.name}" created successfully!`);
    }
    setEntitySubView('table');
  };

  // ==========================================================================
  // HANDLERS: ROLES
  // ==========================================================================
  const handleOpenCreateRole = () => {
    setSelectedRole(null);
    setRoleForm({
      name: '',
      description: '',
      permissions: {},
    });
    setRoleSubView('form');
  };

  const handleOpenEditRole = (role: RoleRecord) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions },
    });
    setRoleSubView('form');
  };

  const handleViewRole = (role: RoleRecord) => {
    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions },
    });
    setRoleSubView('view');
  };

  const handleTogglePermission = (permId: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permId]: !prev.permissions[permId],
      },
    }));
  };

  const handleToggleModuleAll = (moduleId: string, enable: boolean) => {
    const mod = PERMISSION_MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    setRoleForm((prev) => {
      const updated = { ...prev.permissions };
      mod.permissions.forEach((p) => {
        updated[p.id] = enable;
      });
      return { ...prev, permissions: updated };
    });
  };

  const handleSaveRole = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!roleForm.name || !roleForm.description) {
      alert('Please provide a Role Name and Description.');
      return;
    }

    if (selectedRole) {
      setRoles((prev) =>
        prev.map((item) =>
          item.id === selectedRole.id ? { ...item, ...roleForm } : item
        )
      );
      showNotice(`Role "${roleForm.name}" updated successfully!`);
    } else {
      const newRole: RoleRecord = {
        id: `role-${Date.now()}`,
        name: roleForm.name,
        description: roleForm.description,
        userCount: 0,
        status: 'Active',
        permissions: roleForm.permissions,
        createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      };
      setRoles((prev) => [...prev, newRole]);
      showNotice(`Role "${roleForm.name}" created successfully!`);
    }
    setRoleSubView('table');
  };

  // ==========================================================================
  // HANDLERS: USERS
  // ==========================================================================
  const handleOpenCreateUser = () => {
    setSelectedUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userType: 'Internal User',
      roleName: roles[0]?.name || 'Data Provider',
      entityName: entities[0]?.name || 'Agthia',
      isMultiEntity: false,
      selectedEntities: [entities[0]?.name || 'Agthia'],
      updatePassword: false,
      password: '',
      confirmPassword: '',
      enableMFA: false,
      isActive: true,
    });
    setUserSubView('form');
  };

  const handleOpenEditUser = (u: UserRecord) => {
    setSelectedUser(u);
    setUserForm({
      firstName: u.firstName || u.name.split(' ')[0] || '',
      lastName: u.lastName || u.name.split(' ').slice(1).join(' ') || '',
      email: u.email,
      phone: u.phone,
      userType: u.userType || 'Internal User',
      roleName: u.roleName,
      entityName: u.entityName,
      isMultiEntity: Boolean(u.isMultiEntity),
      selectedEntities: u.selectedEntities || [u.entityName],
      updatePassword: false,
      password: '',
      confirmPassword: '',
      enableMFA: Boolean(u.enableMFA),
      isActive: u.status === 'Active',
    });
    setUserSubView('form');
  };

  const handleViewUser = (u: UserRecord) => {
    setSelectedUser(u);
    setUserForm({
      firstName: u.firstName || u.name.split(' ')[0] || '',
      lastName: u.lastName || u.name.split(' ').slice(1).join(' ') || '',
      email: u.email,
      phone: u.phone,
      userType: u.userType || 'Internal User',
      roleName: u.roleName,
      entityName: u.entityName,
      isMultiEntity: Boolean(u.isMultiEntity),
      selectedEntities: u.selectedEntities || [u.entityName],
      updatePassword: false,
      password: '',
      confirmPassword: '',
      enableMFA: Boolean(u.enableMFA),
      isActive: u.status === 'Active',
    });
    setUserSubView('view');
  };

  const handleSaveUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.phone) {
      alert('Please fill in all mandatory fields marked with * (First Name, Last Name, Email Address, Phone Number).');
      return;
    }

    const fullName = `${userForm.firstName} ${userForm.lastName}`.trim();
    const statusVal: 'Active' | 'Inactive' = userForm.isActive ? 'Active' : 'Inactive';

    if (selectedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                name: fullName,
                email: userForm.email,
                phone: userForm.phone,
                userType: userForm.userType,
                roleName: userForm.roleName,
                entityName: userForm.entityName,
                isMultiEntity: userForm.isMultiEntity,
                selectedEntities: userForm.selectedEntities,
                enableMFA: userForm.enableMFA,
                status: statusVal,
              }
            : u
        )
      );
      showNotice(`User "${fullName}" updated successfully!`);
    } else {
      const newUser: UserRecord = {
        id: `usr-${Date.now()}`,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        name: fullName,
        email: userForm.email,
        phone: userForm.phone,
        userType: userForm.userType,
        roleName: userForm.roleName,
        entityName: userForm.entityName,
        isMultiEntity: userForm.isMultiEntity,
        selectedEntities: userForm.selectedEntities,
        enableMFA: userForm.enableMFA,
        status: statusVal,
        lastLogin: 'Never',
      };
      setUsers((prev) => [newUser, ...prev]);
      showNotice(`User "${fullName}" created successfully!`);
    }
    setUserSubView('table');
  };

  // ==========================================================================
  // HANDLERS: PERMISSIONS & LOGS
  // ==========================================================================
  const handleOpenEditPermission = (perm: PermissionRecord) => {
    setSelectedPermission(perm);
    setPermissionForm({
      displayName: perm.displayName,
      description: perm.description,
    });
    setPermissionSubView('edit');
  };

  const handleSavePermission = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!permissionForm.displayName || !permissionForm.description) {
      alert('Please fill in both Permission Display Name and Description.');
      return;
    }

    if (selectedPermission) {
      setPermissions((prev) =>
        prev.map((item) =>
          item.id === selectedPermission.id
            ? {
                ...item,
                displayName: permissionForm.displayName,
                description: permissionForm.description,
              }
            : item
        )
      );
      showNotice(`Permission "${permissionForm.displayName}" updated successfully!`);
    }
    setPermissionSubView('table');
  };

  const handleResetLogsFilter = () => {
    setLogStartDate('');
    setLogEndDate('');
    setLogSelectedUser('All');
    setLogActionQuery('');
    setSearchTerm('');
  };

  const handleExportExcel = () => {
    showNotice('Exported User Action Logs to Excel (.xlsx) successfully!');
  };

  // ==========================================================================
  // DELETE HANDLER
  // ==========================================================================
  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'entity') {
      setEntities((prev) => prev.filter((e) => e.id !== itemToDelete.id));
      showNotice(`Entity "${itemToDelete.name}" deleted.`);
    } else if (itemToDelete.type === 'role') {
      setRoles((prev) => prev.filter((r) => r.id !== itemToDelete.id));
      showNotice(`Role "${itemToDelete.name}" deleted.`);
    } else if (itemToDelete.type === 'user') {
      setUsers((prev) => prev.filter((u) => u.id !== itemToDelete.id));
      showNotice(`User "${itemToDelete.name}" deleted.`);
    }
    setItemToDelete(null);
  };

  // Section header info based on active sub-view
  const getHeaderInfo = () => {
    switch (adminTab) {
      case 'roles':
        return {
          title: 'Roles & Access Control',
          subtitle: 'Define security roles and configure categorized system permissions matrix.',
          searchPlaceholder: 'Search roles by title...',
        };
      case 'users':
        return {
          title: 'User',
          subtitle: 'Directory of system operators, environmental auditors, verifiers and admin accounts.',
          searchPlaceholder: 'Search',
        };
      case 'permissions':
        return {
          title: 'Permissions',
          subtitle: 'Comprehensive directory of functional modules and granular platform permissions.',
          searchPlaceholder: 'Search',
        };
      case 'action-logs':
        return {
          title: 'User Actions Log',
          subtitle: 'Review tamper-proof timestamped audit trail of all portal interactions and administrative operations.',
          searchPlaceholder: 'Search',
        };
      case 'entity':
      default:
        return {
          title: 'Entity Management',
          subtitle: 'Overview of registered single & parent entities, contact focal points, and hierarchy.',
          searchPlaceholder: 'Search by entity name, contact...',
        };
    }
  };

  const headerInfo = getHeaderInfo();
  const filterOptions = getFilterOptions();

  // ==========================================================================
  // RENDER
  // =======================================================  // =========================================================================
  // RENDER 1: CREATE / EDIT / VIEW ENTITY FORM (Matches FacilityRegistrationView structure)
  // =========================================================================
  if (adminTab === 'entity' && (entitySubView === 'form' || entitySubView === 'view')) {
    const isReadOnly = entitySubView === 'view';

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Title & Actions Row */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setEntitySubView('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to entities list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
                {isReadOnly
                  ? selectedEntity ? `${selectedEntity.name} — Entity Details` : 'Entity Details'
                  : selectedEntity ? `${selectedEntity.name} — Edit Entity` : 'Create New Entity'}
              </h1>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                {selectedEntity?.status || 'Active'}
              </span>

              {noticeMessage && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in ml-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{noticeMessage}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              Overview of registered single & parent entities, contact focal points, and hierarchy.
            </p>
          </div>
        </div>

        {/* Single White Background Container (All Fields on Page, 4 per row, No Tabs) */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3.5 sm:p-5 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2.5 py-1 custom-scrollbar text-xs">
            {/* Section 1: Entity Details (4 fields in a row) */}
            <div>
              <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Entity Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Entity Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={entityForm.name}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter entity name (e.g. Abu Dhabi Municipality)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={entityForm.address}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter registered physical address"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Entity Type</label>
                  <div className="flex items-center gap-2.5 h-[38px]">
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() =>
                        setEntityForm((prev) => ({
                          ...prev,
                          type: prev.type === 'Parent' ? 'Single' : 'Parent',
                          parentEntity: prev.type === 'Parent' ? prev.parentEntity : '—',
                        }))
                      }
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 ${isReadOnly ? 'cursor-default' : 'cursor-pointer'} transition-colors shrink-0 ${
                        entityForm.type === 'Parent' ? 'bg-[#00875A]' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          entityForm.type === 'Parent' ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-semibold text-slate-700">Is Parent Entity</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Parent Entity</label>
                  <select
                    disabled={isReadOnly || entityForm.type === 'Parent'}
                    value={entityForm.parentEntity}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, parentEntity: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs font-medium disabled:opacity-50 disabled:bg-slate-50"
                  >
                    <option value="—">Select parent (optional)</option>
                    {entities
                      .filter((e) => e.type === 'Parent' || e.name === 'ADNOC' || e.name === 'ADQ')
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Details (4 fields in a row) */}
            <div>
              <h4 className="text-xs font-bold text-[#336D9F] mb-2.5">Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={entityForm.contactName}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Enter contact person name"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Title / Designation *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={entityForm.contactTitle}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, contactTitle: e.target.value }))}
                    placeholder="Enter designation (e.g. Head, Manager)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    disabled={isReadOnly}
                    value={entityForm.contactEmail}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="e.g. contact@entity.ae"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={entityForm.contactPhone}
                    onChange={(e) => setEntityForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="e.g. 0546676272"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Description */}
            <div>
              <label className="block font-bold text-[#336D9F] mb-1.5 text-xs">Description / Operational Scope</label>
              <textarea
                rows={3}
                disabled={isReadOnly}
                value={entityForm.description}
                onChange={(e) => setEntityForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Write entity operational scope, regulatory background or notes..."
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs leading-relaxed text-xs disabled:bg-slate-50 disabled:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex-shrink-0 pt-3.5 pb-2 flex items-center justify-end gap-3">
          {isReadOnly ? (
            <>
              <button
                type="button"
                onClick={() => setEntitySubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Entities</span>
              </button>
              <button
                type="button"
                onClick={() => setEntitySubView('form')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Entity</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setEntitySubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Cancel</span>
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  showNotice('Draft saved locally.');
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Save Draft</span>
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                type="button"
                onClick={handleSaveEntity}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>{selectedEntity ? 'Save Changes' : 'Create Entity'}</span>
                <Send className="w-3.5 h-3.5 fill-current opacity-90" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: CREATE / EDIT / VIEW ROLE (Single Page without tabs)
  // =========================================================================
  if (adminTab === 'roles' && (roleSubView === 'form' || roleSubView === 'view')) {
    const isReadOnly = roleSubView === 'view';

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Title & Actions Row */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setRoleSubView('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to roles list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
                {isReadOnly
                  ? selectedRole ? `${selectedRole.name} — Role Details` : 'Security Role Details'
                  : selectedRole ? `${selectedRole.name} — Edit Role` : 'Create New Security Role'}
              </h1>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                {selectedRole?.status || 'Active'}
              </span>

              {noticeMessage && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in ml-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{noticeMessage}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              Define granular access permissions, module access rights and operational authority scopes.
            </p>
          </div>
        </div>

        {/* Single White Background Container */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-2.5 py-0.5 custom-scrollbar text-xs">
            {/* Section 1: Role Profile */}
            <div>
              <h4 className="text-xs font-bold text-[#336D9F] mb-3">Security Role Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="lg:col-span-1 sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Role Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={roleForm.name}
                    onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name (e.g. Data Provider, EadAdmin)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>
                <div className="lg:col-span-3 sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Role Description *</label>
                  <input
                    type="text"
                    required
                    disabled={isReadOnly}
                    value={roleForm.description}
                    onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description (e.g. Can manage tenants and organizations)"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Granular Permissions Matrix */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-bold text-[#336D9F] text-xs">Granular Permissions Matrix</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Toggle capabilities and module access rights enabled for this role</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {PERMISSION_MODULES.map((module) => {
                  const allActive = module.permissions.every((p) => roleForm.permissions[p.id]);
                  return (
                    <div
                      key={module.id}
                      className="py-3.5 flex flex-col md:flex-row items-start gap-4 md:gap-8"
                    >
                      {/* Left: Module Name */}
                      <div className="w-full md:w-56 shrink-0 pt-1 flex items-center justify-between md:block">
                        <span className="font-semibold text-slate-800 text-[13px]">{module.name}</span>
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleToggleModuleAll(module.id, !allActive)}
                            className="text-[10px] font-bold text-[#336D9F] hover:underline cursor-pointer md:mt-1 md:block"
                          >
                            {allActive ? 'Deselect All' : 'Select All'}
                          </button>
                        )}
                      </div>

                      {/* Right: 4-column Grid matching reference screenshot */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3.5 gap-x-4 flex-1 w-full">
                        {module.permissions.map((perm) => {
                          const isChecked = Boolean(roleForm.permissions[perm.id]);
                          return (
                            <div
                              key={perm.id}
                              className="flex flex-col items-center justify-start text-center space-y-1.5 py-0.5"
                            >
                              <span
                                className="text-[11.5px] font-normal text-slate-700 leading-tight text-center select-none min-h-[28px] flex items-center justify-center px-1"
                              >
                                {perm.name}
                              </span>
                              <button
                                type="button"
                                disabled={isReadOnly}
                                onClick={() => handleTogglePermission(perm.id)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                                  isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                                } ${
                                  isChecked ? 'bg-[#004B87]' : 'bg-slate-300'
                                }`}
                                title={`${perm.name} (${isChecked ? 'Enabled' : 'Disabled'})`}
                              >
                                <div
                                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                    isChecked ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex-shrink-0 pt-3.5 pb-2 flex items-center justify-end gap-3">
          {isReadOnly ? (
            <>
              <button
                type="button"
                onClick={() => setRoleSubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Roles</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleSubView('form')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Role</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setRoleSubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Cancel</span>
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => showNotice('Role draft saved.')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Save Draft</span>
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                type="button"
                onClick={handleSaveRole}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>{selectedRole ? 'Save Changes' : 'Submit Role'}</span>
                <Send className="w-3.5 h-3.5 fill-current opacity-90" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 3: CREATE / EDIT / VIEW USER (Single Page, 4 fields per row)
  // =========================================================================
  if (adminTab === 'users' && (userSubView === 'form' || userSubView === 'view')) {
    const isReadOnly = userSubView === 'view';

    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Title & Actions Row */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setUserSubView('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to users list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
                {isReadOnly
                  ? selectedUser ? `${selectedUser.name} — User Details` : 'User Details'
                  : selectedUser ? `${selectedUser.name} — Edit User` : 'User'}
              </h1>

              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200">
                {selectedUser?.status || (userForm.isActive ? 'Active' : 'Inactive')}
              </span>

              {noticeMessage && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in ml-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{noticeMessage}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              Directory of system operators, environmental auditors, verifiers and admin accounts.
            </p>
          </div>
        </div>

        {/* Single White Background Container (4 inputs per row, remaining area empty) */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto space-y-5 pr-2.5 py-1 custom-scrollbar text-xs">
            {/* Row 1: First Name, Last Name, Email Address, Phone Number (4 fields in a row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 1: First Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">First Name *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={userForm.firstName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>

              {/* Field 2: Last Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Last Name *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={userForm.lastName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>

              {/* Field 3: Email Address */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={isReadOnly}
                  value={userForm.email}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. abdelrahman.elsherif@agthia.com"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>

              {/* Field 4: Phone Number */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Phone Number *</label>
                <input
                  type="text"
                  required
                  disabled={isReadOnly}
                  value={userForm.phone}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="admin@fea.gov.ae"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>

            {/* Row 2: User Role, Entity (with Multi Entity toggle), User Type, Empty Space (4 fields per row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Field 5: User Role */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">User Role *</label>
                <select
                  disabled={isReadOnly}
                  value={userForm.roleName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, roleName: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs font-medium disabled:bg-slate-50 disabled:text-slate-600"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 6: Entity with Multi Entity toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-semibold text-xs">Entity *</label>
                  <div className="flex items-center gap-1.5 select-none">
                    <button
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => setUserForm((prev) => ({ ...prev, isMultiEntity: !prev.isMultiEntity }))}
                      className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors ${
                        isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                      } ${userForm.isMultiEntity ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform ${
                          userForm.isMultiEntity ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      onClick={() => !isReadOnly && setUserForm((prev) => ({ ...prev, isMultiEntity: !prev.isMultiEntity }))}
                      className="text-[11px] text-slate-600 font-medium cursor-pointer"
                    >
                      Multi Entity
                    </span>
                  </div>
                </div>
                <select
                  disabled={isReadOnly}
                  value={userForm.entityName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, entityName: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs font-medium disabled:bg-slate-50 disabled:text-slate-600"
                >
                  {entities.map((ent) => (
                    <option key={ent.id} value={ent.name}>
                      {ent.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 7: User Type */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">User Type</label>
                <select
                  disabled={isReadOnly}
                  value={userForm.userType}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, userType: e.target.value as any }))}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#336D9F] shadow-xs cursor-pointer text-xs font-medium disabled:bg-slate-50 disabled:text-slate-600"
                >
                  <option value="Internal User">Internal User</option>
                  <option value="External User">External User</option>
                </select>
              </div>

              {/* Field 8: Empty Space for 4th column */}
              <div className="hidden lg:block" aria-hidden="true" />
            </div>

            {/* Row 3: Account Security & Status Toggle Switches */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center gap-8 text-xs text-slate-700 font-medium py-1">
                {/* Toggle 1: Update Password */}
                <div className="flex items-center gap-2.5 select-none">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => setUserForm((prev) => ({ ...prev, updatePassword: !prev.updatePassword }))}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                    } ${userForm.updatePassword ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        userForm.updatePassword ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    onClick={() => !isReadOnly && setUserForm((prev) => ({ ...prev, updatePassword: !prev.updatePassword }))}
                    className="cursor-pointer"
                  >
                    Update Password?
                  </span>
                </div>

                {/* Toggle 2: Enable Multi-Factor Authentication */}
                <div className="flex items-center gap-2.5 select-none">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => setUserForm((prev) => ({ ...prev, enableMFA: !prev.enableMFA }))}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                    } ${userForm.enableMFA ? 'bg-[#004B87]' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        userForm.enableMFA ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    onClick={() => !isReadOnly && setUserForm((prev) => ({ ...prev, enableMFA: !prev.enableMFA }))}
                    className="cursor-pointer"
                  >
                    Enable Multi-Factor Authentication
                  </span>
                </div>

                {/* Toggle 3: isActive */}
                <div className="flex items-center gap-2.5 select-none">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => setUserForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      isReadOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-90'
                    } ${userForm.isActive ? 'bg-[#00875A]' : 'bg-slate-300'}`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        userForm.isActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    onClick={() => !isReadOnly && setUserForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className="cursor-pointer"
                  >
                    isActive
                  </span>
                </div>
              </div>

              {/* Optional Password inputs: 2 fields in a 4-column grid + 2 empty spaces */}
              {userForm.updatePassword && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 mt-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">New Password *</label>
                    <input
                      type="password"
                      disabled={isReadOnly}
                      value={userForm.password}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter new password"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      disabled={isReadOnly}
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                  <div className="hidden lg:block" aria-hidden="true" />
                  <div className="hidden lg:block" aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar (Cancel, Save Draft, Submit User) */}
        <div className="flex-shrink-0 pt-3.5 pb-2 flex items-center justify-end gap-3">
          {isReadOnly ? (
            <>
              <button
                type="button"
                onClick={() => setUserSubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Users</span>
              </button>
              <button
                type="button"
                onClick={() => setUserSubView('form')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit User</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setUserSubView('table')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Cancel</span>
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => showNotice('User draft saved locally.')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Save Draft</span>
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>

              <button
                type="button"
                onClick={handleSaveUser}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
              >
                <span>{selectedUser ? 'Save Changes' : 'Submit User'}</span>
                <Send className="w-3.5 h-3.5 fill-current opacity-90" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 4: EDIT PERMISSION (Matches Reference Screenshot 2)
  // =========================================================================
  if (adminTab === 'permissions' && permissionSubView === 'edit') {
    return (
      <div className="h-full flex flex-col overflow-hidden font-sans py-0.5">
        {/* Title Row with Subtitle */}
        <div className="flex-shrink-0 pb-[14px] pt-0.5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPermissionSubView('table')}
                className="p-1 -ml-1 text-[#336D9F] hover:text-[#004B87] hover:bg-[#E9F1F8] rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs"
                title="Back to permissions list"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight">
                Edit Permission
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
              Configure granular system permission attributes and functional descriptions.
            </p>
          </div>
        </div>

        {/* Single White Card Container (Without inner Edit Permission title) */}
        <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-4">
            {/* Two Fields in a Row: Permission Display Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Permission Display Name *
                </label>
                <input
                  type="text"
                  value={permissionForm.displayName}
                  onChange={(e) =>
                    setPermissionForm((prev) => ({ ...prev, displayName: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">
                  Description *
                </label>
                <input
                  type="text"
                  value={permissionForm.description}
                  onChange={(e) =>
                    setPermissionForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#336D9F] shadow-xs font-medium text-xs"
                />
              </div>
            </div>
          </div>

          {/* Bottom Right Actions: Cancel and Update */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPermissionSubView('table')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>Cancel</span>
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleSavePermission}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#004B87] to-[#006BB8] text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95"
            >
              <span>Update</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 5: OVERVIEW TABLE (Default landing for Entity, Roles, Users, Permissions, Logs)
  // =========================================================================
  return (
    <div className="h-full flex flex-col overflow-hidden font-sans py-1">
      {/* Top Header Row with Title & Subtitle */}
      <div className="flex-shrink-0 pb-[14px] pt-0.5 flex items-center justify-between gap-3 min-w-0">
        <div className="min-w-0 shrink">
          <h1 className="text-[18px] font-bold font-display text-[#336D9F] tracking-tight whitespace-nowrap">
            {headerInfo.title}
          </h1>
          {headerInfo.subtitle ? (
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate max-w-lg xl:max-w-xl">
              {headerInfo.subtitle}
            </p>
          ) : null}
        </div>

        {/* Notice Alert if present */}
        {noticeMessage && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold animate-fade-in shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Controls for Entity, Roles, Users, Permissions (Right side of title row) */}
        {(adminTab === 'entity' || adminTab === 'roles' || adminTab === 'users' || adminTab === 'permissions') && (
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* Search Box */}
            <div className="relative w-36 sm:w-44 xl:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={headerInfo.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            {filterOptions && filterOptions.length > 1 && (
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-28 sm:w-32 h-9 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer truncate"
                >
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Filters */}
            {(searchTerm || filterType !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('All');
                }}
                className="h-9 px-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 font-semibold transition-colors flex items-center gap-1 cursor-pointer text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            {/* Primary Action Button */}
            {adminTab === 'entity' && (
              <button
                type="button"
                onClick={handleOpenCreateEntity}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Entity</span>
              </button>
            )}

            {adminTab === 'roles' && (
              <button
                type="button"
                onClick={handleOpenCreateRole}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            )}

            {adminTab === 'users' && (
              <button
                type="button"
                onClick={handleOpenCreateUser}
                className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
              >
                <span>Add</span>
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* User Actions Log: Title Row Export Excel button */}
        {adminTab === 'action-logs' && (
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            <button
              type="button"
              onClick={handleExportExcel}
              className="h-9 px-4 bg-gradient-to-r from-[#004B87] to-[#006BB8] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#004B87]/25 hover:shadow-lg hover:from-[#003d6e] hover:to-[#005c9e] transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Tables */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ================================================================= */}
        {/* TAB 1: ENTITY INFORMATION TABLE */}
        {/* ================================================================= */}
        {adminTab === 'entity' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                  <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                    <th className="h-[38px] px-2 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                    <th className="h-[38px] px-2.5 min-w-[170px] align-middle bg-[#D6E3EF]">Entity Name</th>
                    <th className="h-[38px] px-2.5 min-w-[90px] align-middle bg-[#D6E3EF]">Type</th>
                    <th className="h-[38px] px-2.5 min-w-[130px] align-middle bg-[#D6E3EF]">Parent Entity</th>
                    <th className="h-[38px] px-2.5 min-w-[140px] align-middle bg-[#D6E3EF]">Contact Name</th>
                    <th className="h-[38px] px-2.5 min-w-[180px] align-middle bg-[#D6E3EF]">Contact Email</th>
                    <th className="h-[38px] px-2.5 min-w-[120px] align-middle bg-[#D6E3EF]">Contact Phone</th>
                    <th className="h-[38px] px-2.5 min-w-[130px] align-middle bg-[#D6E3EF]">Contact Title</th>
                    <th className="h-[38px] px-3 w-24 text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedEntities.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                        No entities found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedEntities.map((ent, idx) => (
                      <tr key={ent.id} className={`h-[52px] sm:h-[58px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                        <td className="h-[52px] sm:h-[58px] px-2 text-center font-mono font-bold text-slate-400 align-middle">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 font-bold text-slate-900 align-middle">{ent.name}</td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 align-middle">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              ent.type === 'Parent'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-sky-50 text-[#004B87] border border-sky-200'
                            }`}
                          >
                            {ent.type}
                          </span>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 text-slate-600 align-middle">{ent.parentEntity || '—'}</td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 text-slate-800 font-semibold align-middle">{ent.contactName}</td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 font-mono text-slate-600 truncate max-w-[190px] align-middle">
                          <div className="inline-flex items-center gap-1.5 truncate max-w-full">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{ent.contactEmail}</span>
                          </div>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 font-mono text-slate-600 align-middle">
                          <div className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{ent.contactPhone}</span>
                          </div>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 text-slate-700 align-middle">{ent.contactTitle}</td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleViewEntity(ent)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Entity Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditEntity(ent)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Entity Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'entity', id: ent.id, name: ent.name })}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Entity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationFooter(filteredEntities.length, totalEntityPages, 'entities')}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: ROLES TABLE */}
        {/* ================================================================= */}
        {adminTab === 'roles' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                  <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                    <th className="h-[38px] px-2 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                    <th className="h-[38px] px-2.5 min-w-[200px] align-middle bg-[#D6E3EF]">Role Name</th>
                    <th className="h-[38px] px-2.5 min-w-[350px] align-middle bg-[#D6E3EF]">Description</th>
                    <th className="h-[38px] px-3 w-24 text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedRoles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                        No role records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedRoles.map((role, idx) => (
                      <tr key={role.id} className={`h-[52px] sm:h-[58px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                        <td className="h-[52px] sm:h-[58px] px-2 text-center font-mono font-bold text-slate-400 align-middle">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 font-bold text-[#004B87] align-middle">
                          {role.name}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-2.5 text-slate-600 align-middle">{role.description}</td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleViewRole(role)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Role Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditRole(role)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Configure Role Permissions"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'role', id: role.id, name: role.name })}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationFooter(filteredRoles.length, totalRolePages, 'roles')}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: USERS MANAGEMENT (Matches Reference Screenshot 1) */}
        {/* ================================================================= */}
        {adminTab === 'users' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                  <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                    <th className="h-[38px] px-2 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                    <th className="h-[38px] px-3 min-w-[140px] align-middle bg-[#D6E3EF]">First Name</th>
                    <th className="h-[38px] px-3 min-w-[140px] align-middle bg-[#D6E3EF]">Last Name</th>
                    <th className="h-[38px] px-3 min-w-[200px] align-middle bg-[#D6E3EF]">Email</th>
                    <th className="h-[38px] px-3 min-w-[130px] align-middle bg-[#D6E3EF]">Phone</th>
                    <th className="h-[38px] px-3 min-w-[130px] align-middle bg-[#D6E3EF]">User Type</th>
                    <th className="h-[38px] px-3 min-w-[90px] align-middle bg-[#D6E3EF]">Status</th>
                    <th className="h-[38px] px-3 w-24 text-center whitespace-nowrap align-middle bg-[#D6E3EF]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                        No user records match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user, idx) => (
                      <tr key={user.id} className={`h-[52px] sm:h-[58px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                        <td className="h-[52px] sm:h-[58px] px-2 text-center font-mono font-bold text-slate-400 align-middle">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 font-semibold text-slate-900 align-middle">
                          {user.firstName || user.name.split(' ')[0]}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-slate-700 align-middle">
                          {user.lastName || user.name.split(' ').slice(1).join(' ')}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 font-mono text-slate-600 align-middle">
                          <span className="truncate">{user.email}</span>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 font-mono text-slate-600 align-middle">
                          <span>{user.phone}</span>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-slate-600 align-middle">
                          {user.userType || 'Internal User'}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 align-middle">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-block ${
                              user.status === 'Active'
                                ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                : 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleViewUser(user)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View User Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1 rounded-lg text-slate-500 hover:text-[#336D9F] hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit User Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setItemToDelete({ type: 'user', id: user.id, name: user.name })}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationFooter(filteredUsers.length, totalUserPages, 'users')}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: PERMISSIONS CATALOG (Matches Reference Screenshot 1) */}
        {/* ================================================================= */}
        {adminTab === 'permissions' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* Permissions Table */}
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                  <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                    <th className="h-[38px] px-2 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                    <th className="h-[38px] px-3.5 min-w-[220px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>Permission Display Name</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3.5 min-w-[320px] align-middle bg-[#D6E3EF]">
                      <span>Description</span>
                    </th>
                    <th className="h-[38px] px-3.5 min-w-[240px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>Permission Name</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 w-20 text-center whitespace-nowrap align-middle bg-[#D6E3EF]">
                      <span>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedPermissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                        No permissions found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedPermissions.map((p, idx) => (
                      <tr key={p.id} className={`h-[52px] sm:h-[58px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                        <td className="h-[52px] sm:h-[58px] px-2 text-center font-mono font-bold text-slate-400 align-middle">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3.5 text-slate-800 font-medium align-middle">
                          {p.displayName}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3.5 text-slate-600 align-middle">
                          {p.description}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3.5 font-mono text-[11px] text-slate-700 align-middle">
                          {p.permissionName}
                        </td>
                        <td className="h-[52px] sm:h-[58px] px-3 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPermission(p)}
                              className="p-1 rounded-lg text-[#336D9F] hover:text-[#004B87] hover:bg-sky-50 transition-colors cursor-pointer"
                              title="Edit Permission"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationFooter(filteredPermissions.length, totalPermissionPages, 'permissions')}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: USER ACTION LOGS (Matches Reference Screenshot 3 & 4) */}
        {/* ================================================================= */}
        {adminTab === 'action-logs' && (
          <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* Dedicated Filter Card (4 fields + Reset button in the same row) */}
            <div className="flex-shrink-0 bg-white rounded-xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3.5 items-end">
                {/* 1. Start Date */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Start Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      value={logStartDate}
                      onChange={(e) => setLogStartDate(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. End Date */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">End Date</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      value={logEndDate}
                      onChange={(e) => setLogEndDate(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                    />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Select User */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Select User</label>
                  <div className="relative">
                    <select
                      value={logSelectedUser}
                      onChange={(e) => setLogSelectedUser(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all cursor-pointer"
                    >
                      <option value="All">All</option>
                      {distinctLogUsers.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 4. Actions */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs">Actions</label>
                  <input
                    type="text"
                    placeholder="Action"
                    value={logActionQuery}
                    onChange={(e) => setLogActionQuery(e.target.value)}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#336D9F]/20 focus:border-[#336D9F] transition-all font-medium shadow-xs"
                  />
                </div>

                {/* 5. Reset Button in the same row */}
                <div>
                  <button
                    type="button"
                    onClick={handleResetLogsFilter}
                    className="h-9 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-full text-xs font-semibold text-[#336D9F] hover:text-[#004B87] flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#336D9F]" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 bg-[#D6E3EF] shadow-xs">
                  <tr className="h-[38px] bg-[#D6E3EF] text-slate-800 font-bold text-xs border-b border-[#5B88B0]/30">
                    <th className="h-[38px] px-2 w-10 text-center align-middle bg-[#D6E3EF]">#</th>
                    <th className="h-[38px] px-3 min-w-[150px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>Action Date</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 min-w-[170px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>Actions</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 min-w-[140px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>User name</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 min-w-[340px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>Description</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 min-w-[100px] align-middle bg-[#D6E3EF]">
                      <div className="flex items-center gap-1">
                        <span>IP Address</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                    <th className="h-[38px] px-3 w-28 text-center align-middle bg-[#D6E3EF]">
                      <div className="flex items-center justify-center gap-1">
                        <span>Status</span>
                        <span className="text-slate-400 text-[10px]">⇅</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-[60px] py-8 text-center text-slate-400 font-semibold align-middle">
                        No action log entries match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, idx) => {
                      const isSuccess = log.status?.toLowerCase() === 'success';
                      const isWarning = log.status?.toLowerCase() === 'warning';
                      return (
                        <tr key={log.id} className={`h-[52px] sm:h-[58px] ${idx % 2 === 1 ? 'bg-slate-50/80' : 'bg-white'} hover:bg-[#EBF3FA] transition-colors group cursor-default`}>
                          <td className="h-[52px] sm:h-[58px] px-2 text-center font-mono font-bold text-slate-400 align-middle">
                            {(currentPage - 1) * itemsPerPage + idx + 1}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 font-mono text-[11px] text-slate-600 align-middle">
                            {log.timestamp}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 text-slate-800 font-semibold align-middle">
                            {log.action}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 text-slate-700 align-middle">
                            {log.userName}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 text-slate-600 text-[11px] leading-relaxed align-middle">
                            {log.description}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 font-mono text-slate-500 text-[11px] align-middle">
                            {log.ipAddress}
                          </td>
                          <td className="h-[52px] sm:h-[58px] px-3 text-center align-middle">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap inline-block ${
                                isSuccess
                                  ? 'bg-[#D1FAE5] text-[#065F46] border border-emerald-200/60'
                                  : isWarning
                                  ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300/80 font-bold'
                                  : 'bg-[#FEE2E2] text-[#DC2626] border border-rose-200/60'
                              }`}
                            >
                              {log.status === 'success' || log.status === 'Success' ? 'Success' : log.status === 'failed' || log.status === 'Failed' ? 'Failed' : log.status === 'warning' || log.status === 'Warning' ? 'Warning' : log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {renderPaginationFooter(filteredLogs.length, totalLogPages, 'logs')}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Confirm Deletion</h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete{' '}
                <strong className="text-slate-800">"{itemToDelete.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
