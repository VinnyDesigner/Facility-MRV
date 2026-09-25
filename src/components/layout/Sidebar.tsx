import React, { useState } from 'react';
import {
  Building2,
  ClipboardList,
  Flame,
  Lock,
  HelpCircle,
  ArrowRight,
  Info,
  LayoutDashboard,
  BarChart3,
  Shield,
  ShieldCheck,
  Users,
  KeyRound,
  History,
  ChevronDown,
} from 'lucide-react';
import { LogoutNavIcon } from '../icons/NavIcons';
import { useMRV } from '../../context/MRVContext';
import eadLogo from '../../assets/logo.svg';
import eadLogoMark from '../../assets/logo-mark.svg';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  onLogout,
}) => {
  const {
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    submissions,
    isMonitoringPlanUnlocked,
    isAnnualEmissionUnlocked,
    getLockReason,
  } = useMRV();

  const [lockedModalInfo, setLockedModalInfo] = useState<{
    title: string;
    reason: string;
    prerequisiteView: string;
    prerequisiteName: string;
  } | null>(null);

  const [isAdminExpanded, setIsAdminExpanded] = useState(false);

  const pendingReviewCount = (submissions || []).filter(
    (s) => s.status === 'Submitted' || s.status === 'Under Review'
  ).length;

  // Active view match flags
  const isDashboardActive = activeView === 'dashboard' && currentRole === 'FACILITY_OPERATOR';
  const isFacilityActive =
    activeView === 'facility' ||
    activeView === 'registration' ||
    activeView === 'annual-renewal' ||
    activeView === 'report-change' ||
    activeView === 'compliance-checker' ||
    activeView === 'data-entry' ||
    activeView === 'monitoring-plan' ||
    activeView === 'monitoring-plan-module' ||
    activeView === 'ead-facilities';
  const isAnnualEmissionActive =
    activeView === 'annual-emission-data' ||
    activeView === 'emissions-data';
  const isReportsActive =
    activeView === 'reports' ||
    activeView === 'mrv-reports' ||
    activeView === 'submissions' ||
    activeView === 'version-history';
  const isAdministrationActive =
    activeView === 'administration' ||
    activeView === 'admin' ||
    activeView.startsWith('admin-') ||
    activeView === 'entity' ||
    activeView === 'roles' ||
    activeView === 'users' ||
    activeView === 'permissions' ||
    activeView === 'action-logs';

  const isEadDashboardActive =
    activeView === 'ead-dashboard' || (currentRole === 'EAD_REVIEWER' && activeView === 'dashboard');
  const isEadFacilitiesActive = activeView === 'ead-facilities';
  const isEadAnnualEmissionActive =
    activeView === 'annual-emission-data' ||
    activeView === 'emissions-data' ||
    activeView === 'ead-queue' ||
    activeView === 'ead-review-detail';
  const isEadReportsActive =
    activeView === 'ead-[#analytics]' ||
    activeView === 'ead-analytics' ||
    (currentRole === 'EAD_REVIEWER' && (activeView === 'reports' || activeView === 'mrv-reports'));

  return (
    <>
      <aside
        className={`sticky top-0 h-screen z-30 flex flex-col justify-between bg-gradient-to-b from-[#4A6E9E] via-[#3B5B88] to-[#2E4D77] text-white transition-all duration-300 select-none shadow-xl shrink-0 border-r border-[#5B7EA9]/50 ${
          isCollapsed ? 'w-16' : 'w-52'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top Brand Logo Header */}
          <div
            className={`px-3.5 py-3.5 border-b border-white/15 flex items-center justify-center shrink-0`}
          >
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setActiveView(currentRole === 'EAD_REVIEWER' ? 'ead-dashboard' : 'registration')}
              title="Abu Dhabi MRV Portal"
            >
              <img
                src={isCollapsed ? eadLogoMark : eadLogo}
                alt="Environment Agency Abu Dhabi"
                className={`${
                  isCollapsed ? 'h-8 w-8 object-contain' : 'h-11 max-w-[170px] object-contain'
                } drop-shadow-md transition-all`}
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-2.5 space-y-3 font-sans">
            {currentRole === 'FACILITY_OPERATOR' ? (
              /* DATA PROVIDER SIDEBAR MENU: Facility Registration, Annual Emission Data, Reports */
              <>
                {/* 1. Facility Registration */}
                <button
                  onClick={() => setActiveView('registration')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isFacilityActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Facility Registration"
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${isFacilityActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Facility Registration</span>}
                </button>

                {/* 2. Annual Emission Data */}
                <button
                  onClick={() => {
                    if (isAnnualEmissionUnlocked) {
                      setActiveView('annual-emission-data');
                    } else {
                      setLockedModalInfo(getLockReason('annual-emission-data'));
                    }
                  }}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full justify-between px-3 py-2'
                  } ${
                    isAnnualEmissionActive
                      ? isAnnualEmissionUnlocked
                        ? 'bg-white text-[#365785] shadow-sm font-bold'
                        : 'bg-white/90 text-amber-950 font-bold shadow-sm border border-amber-300'
                      : isAnnualEmissionUnlocked
                      ? 'text-white/90 hover:text-white hover:bg-white/15'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  }`}
                  title={
                    isAnnualEmissionUnlocked
                      ? 'Annual Emission Data'
                      : `Annual Emission Data Locked (${getLockReason('annual-emission-data').reason})`
                  }
                >
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 truncate'}`}>
                    <Flame className={`w-4 h-4 shrink-0 ${isAnnualEmissionActive ? 'text-[#365785]' : 'text-white/85'}`} />
                    {!isCollapsed && <span className="truncate">Annual Emission Data</span>}
                  </div>
                  {!isCollapsed && !isAnnualEmissionUnlocked && (
                    <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  )}
                </button>

                {/* 3. Reports */}
                <button
                  onClick={() => setActiveView('reports')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isReportsActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports"
                >
                  <BarChart3 className={`w-4 h-4 shrink-0 ${isReportsActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Reports</span>}
                </button>
              </>
            ) : (
              /* ADMIN SIDEBAR MENU: Dashboard, Facility Management, Annual Emission Data, Reports, Administration */
              <>
                {/* 1. Dashboard */}
                <button
                  onClick={() => setActiveView('ead-dashboard')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isEadDashboardActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className={`w-4 h-4 shrink-0 ${isEadDashboardActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Dashboard</span>}
                </button>

                {/* 2. Facility Management */}
                <button
                  onClick={() => setActiveView('registration')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isFacilityActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Facility Management"
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${isFacilityActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Facility Management</span>}
                </button>

                {/* 3. Annual Emission Data */}
                <button
                  onClick={() => setActiveView('annual-emission-data')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isEadAnnualEmissionActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Annual Emission Data"
                >
                  <Flame className={`w-4 h-4 shrink-0 ${isEadAnnualEmissionActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Annual Emission Data</span>}
                </button>

                {/* 4. Reports */}
                <button
                  onClick={() => setActiveView('ead-analytics')}
                  className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full gap-2.5 px-3 py-2'
                  } ${
                    isEadReportsActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports"
                >
                  <BarChart3 className={`w-4 h-4 shrink-0 ${isEadReportsActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Reports</span>}
                </button>

                {/* 5. Administration Accordion */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setIsAdminExpanded(!isAdminExpanded);
                      if (!isAdministrationActive) {
                        setActiveView('admin-entity');
                      }
                    }}
                    className={`flex items-center rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                      isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full justify-between px-3 py-2'
                    } ${
                      isAdministrationActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`}
                    title="Administration"
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5 truncate'}`}>
                      <Shield className={`w-4 h-4 shrink-0 ${isAdministrationActive ? 'text-cyan-200' : 'text-white/85'}`} />
                      {!isCollapsed && <span className="truncate">Administration</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                          isAdminExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Administration Sub-items (Timeline Stepper Style matching reference image) */}
                  {!isCollapsed && isAdminExpanded && (
                    <div className="relative ml-5 my-1.5 py-1 pl-4">
                      {/* Continuous Vertical Connecting Line */}
                      <div className="absolute left-[5.5px] top-2.5 bottom-2.5 w-[1.5px] bg-white/20 rounded-full pointer-events-none" />

                      <div className="space-y-2">
                        {/* 1. Entity */}
                        <button
                          type="button"
                          onClick={() => setActiveView('admin-entity')}
                          className={`group relative flex items-center w-full text-left text-xs transition-all cursor-pointer py-1 ${
                            activeView === 'admin-entity' || activeView === 'administration' || activeView === 'entity'
                              ? 'text-cyan-200 font-bold'
                              : 'text-white/75 hover:text-white font-medium'
                          }`}
                          title="Entity"
                        >
                          {/* Dot Node */}
                          <span className="absolute -left-4 w-3 h-3 rounded-full flex items-center justify-center">
                            <span
                              className={`rounded-full transition-all ${
                                activeView === 'admin-entity' || activeView === 'administration' || activeView === 'entity'
                                  ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-2 ring-[#3B5B88]'
                                  : 'w-2 h-2 bg-white/35 group-hover:bg-white/65 ring-2 ring-[#3B5B88]'
                              }`}
                            />
                          </span>
                          <span className="truncate">Entity</span>
                        </button>

                        {/* 2. Roles */}
                        <button
                          type="button"
                          onClick={() => setActiveView('admin-roles')}
                          className={`group relative flex items-center w-full text-left text-xs transition-all cursor-pointer py-1 ${
                            activeView === 'admin-roles' || activeView === 'roles'
                              ? 'text-cyan-200 font-bold'
                              : 'text-white/75 hover:text-white font-medium'
                          }`}
                          title="Roles"
                        >
                          <span className="absolute -left-4 w-3 h-3 rounded-full flex items-center justify-center">
                            <span
                              className={`rounded-full transition-all ${
                                activeView === 'admin-roles' || activeView === 'roles'
                                  ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-2 ring-[#3B5B88]'
                                  : 'w-2 h-2 bg-white/35 group-hover:bg-white/65 ring-2 ring-[#3B5B88]'
                              }`}
                            />
                          </span>
                          <span className="truncate">Roles</span>
                        </button>

                        {/* 3. Users */}
                        <button
                          type="button"
                          onClick={() => setActiveView('admin-users')}
                          className={`group relative flex items-center w-full text-left text-xs transition-all cursor-pointer py-1 ${
                            activeView === 'admin-users' || activeView === 'users'
                              ? 'text-cyan-200 font-bold'
                              : 'text-white/75 hover:text-white font-medium'
                          }`}
                          title="Users"
                        >
                          <span className="absolute -left-4 w-3 h-3 rounded-full flex items-center justify-center">
                            <span
                              className={`rounded-full transition-all ${
                                activeView === 'admin-users' || activeView === 'users'
                                  ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-2 ring-[#3B5B88]'
                                  : 'w-2 h-2 bg-white/35 group-hover:bg-white/65 ring-2 ring-[#3B5B88]'
                              }`}
                            />
                          </span>
                          <span className="truncate">Users</span>
                        </button>

                        {/* 4. Permissions */}
                        <button
                          type="button"
                          onClick={() => setActiveView('admin-permissions')}
                          className={`group relative flex items-center w-full text-left text-xs transition-all cursor-pointer py-1 ${
                            activeView === 'admin-permissions' || activeView === 'permissions'
                              ? 'text-cyan-200 font-bold'
                              : 'text-white/75 hover:text-white font-medium'
                          }`}
                          title="Permissions"
                        >
                          <span className="absolute -left-4 w-3 h-3 rounded-full flex items-center justify-center">
                            <span
                              className={`rounded-full transition-all ${
                                activeView === 'admin-permissions' || activeView === 'permissions'
                                  ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-2 ring-[#3B5B88]'
                                  : 'w-2 h-2 bg-white/35 group-hover:bg-white/65 ring-2 ring-[#3B5B88]'
                              }`}
                            />
                          </span>
                          <span className="truncate">Permissions</span>
                        </button>

                        {/* 5. User Action Logs */}
                        <button
                          type="button"
                          onClick={() => setActiveView('admin-logs')}
                          className={`group relative flex items-center w-full text-left text-xs transition-all cursor-pointer py-1 ${
                            activeView === 'admin-logs' || activeView === 'admin-action-logs' || activeView === 'action-logs'
                              ? 'text-cyan-200 font-bold'
                              : 'text-white/75 hover:text-white font-medium'
                          }`}
                          title="User Action Logs"
                        >
                          <span className="absolute -left-4 w-3 h-3 rounded-full flex items-center justify-center">
                            <span
                              className={`rounded-full transition-all ${
                                activeView === 'admin-logs' || activeView === 'admin-action-logs' || activeView === 'action-logs'
                                  ? 'w-2.5 h-2.5 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)] ring-2 ring-[#3B5B88]'
                                  : 'w-2 h-2 bg-white/35 group-hover:bg-white/65 ring-2 ring-[#3B5B88]'
                              }`}
                            />
                          </span>
                          <span className="truncate">User Action Logs</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Logout */}
        <div className="px-2.5 pt-2.5 pb-[20px] border-t border-white/15 shrink-0">
          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`rounded-[6px] bg-white text-[#365785] hover:bg-slate-50 transition-all flex items-center cursor-pointer shadow-sm font-bold text-xs ${
                isCollapsed ? 'w-9 h-9 mx-auto justify-center px-0 py-0' : 'w-full py-2 px-3 gap-2.5'
              }`}
              title="Logout"
            >
              <LogoutNavIcon className="w-4 h-4 shrink-0 text-[#365785]" />
              {!isCollapsed && <span className="font-bold text-[#365785] text-xs">Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Workflow Step Locked Modal */}
      {lockedModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {lockedModalInfo.title}
                </h3>
                <p className="text-[11px] text-amber-700 font-semibold">
                  Prerequisite Workflow Step Incomplete
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lockedModalInfo.reason}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Info className="w-4 h-4 text-[#004B87] shrink-0" />
                <span>Next required step: <strong>{lockedModalInfo.prerequisiteName}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLockedModalInfo(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  const target = lockedModalInfo.prerequisiteView;
                  setLockedModalInfo(null);
                  setActiveView(target as any);
                }}
                className="px-4 py-1.5 bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to {lockedModalInfo.prerequisiteName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
