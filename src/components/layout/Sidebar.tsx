import React, { useState } from 'react';
import {
  Building2,
  ClipboardList,
  Flame,
  Lock,
  HelpCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DashboardBentoIcon, ReportsChartIcon, LogoutNavIcon } from '../icons/NavIcons';
import { useMRV } from '../../context/MRVContext';
import eadLogo from '../../assets/logo.svg';

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
    activeView === 'compliance-checker';
  const isDataEntryActive =
    activeView === 'data-entry' ||
    activeView === 'monitoring-plan-module' ||
    activeView === 'monitoring-plan' ||
    activeView === 'report-upload';
  const isAnnualEmissionActive =
    activeView === 'annual-emission-data' ||
    activeView === 'emissions-data';
  const isReportsActive =
    activeView === 'reports' ||
    activeView === 'mrv-reports' ||
    activeView === 'submissions' ||
    activeView === 'version-history';

  const isEadDashboardActive =
    activeView === 'ead-dashboard' || (currentRole === 'EAD_REVIEWER' && activeView === 'dashboard');
  const isEadQueueActive = activeView === 'ead-queue' || activeView === 'ead-review-detail';
  const isEadFacilitiesActive = activeView === 'ead-facilities';
  const isEadAnalyticsActive =
    activeView === 'ead-[#analytics]' || activeView === 'ead-analytics' || (currentRole === 'EAD_REVIEWER' && activeView === 'reports');

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
              onClick={() => setActiveView(currentRole === 'EAD_REVIEWER' ? 'ead-dashboard' : 'dashboard')}
              title="Abu Dhabi MRV Portal"
            >
              <img
                src={eadLogo}
                alt="Environment Agency Abu Dhabi"
                className={`${
                  isCollapsed ? 'h-8 max-w-[46px]' : 'h-11 max-w-[170px]'
                } object-contain drop-shadow-md transition-all`}
              />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-2.5 space-y-3 font-sans">
            {currentRole === 'FACILITY_OPERATOR' ? (
              <>
                {/* 1. Dashboard */}
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isDashboardActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Dashboard"
                >
                  <DashboardBentoIcon className={`w-4 h-4 shrink-0 ${isDashboardActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Dashboard</span>}
                </button>

                {/* 2. Facility Registration */}
                <button
                  onClick={() => setActiveView('registration')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isFacilityActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Facility Registration"
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${isFacilityActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Facility Registration</span>}
                </button>

                {/* 3. Monitoring Plan */}
                <button
                  onClick={() => {
                    if (isMonitoringPlanUnlocked) {
                      setActiveView('data-entry');
                    } else {
                      setLockedModalInfo(getLockReason('data-entry'));
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isDataEntryActive
                      ? isMonitoringPlanUnlocked
                        ? 'bg-white text-[#365785] shadow-sm font-bold'
                        : 'bg-white/90 text-amber-950 font-bold shadow-sm border border-amber-300'
                      : isMonitoringPlanUnlocked
                      ? 'text-white/90 hover:text-white hover:bg-white/15'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                  }`}
                  title={
                    isMonitoringPlanUnlocked
                      ? 'Monitoring Plan'
                      : `Monitoring Plan Locked (${getLockReason('data-entry').reason})`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ClipboardList className={`w-4 h-4 shrink-0 ${isDataEntryActive ? 'text-[#365785]' : 'text-white/85'}`} />
                    {!isCollapsed && <span className="truncate">Monitoring Plan</span>}
                  </div>
                  {!isMonitoringPlanUnlocked && (
                    <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  )}
                </button>

                {/* 4. Annual Emission Data */}
                <button
                  onClick={() => {
                    if (isAnnualEmissionUnlocked) {
                      setActiveView('annual-emission-data');
                    } else {
                      setLockedModalInfo(getLockReason('annual-emission-data'));
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
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
                  <div className="flex items-center gap-2.5 truncate">
                    <Flame className={`w-4 h-4 shrink-0 ${isAnnualEmissionActive ? 'text-[#365785]' : 'text-white/85'}`} />
                    {!isCollapsed && <span className="truncate">Annual Emission Data</span>}
                  </div>
                  {!isAnnualEmissionUnlocked && (
                    <Lock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  )}
                </button>

                {/* 5. Reports */}
                <button
                  onClick={() => setActiveView('reports')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isReportsActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports"
                >
                  <ReportsChartIcon className={`w-4 h-4 shrink-0 ${isReportsActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Reports</span>}
                </button>
              </>
            ) : (
              /* EAD REGULATOR SIDEBAR MENU */
              <>
                {/* 1. Dashboard */}
                <button
                  onClick={() => setActiveView('ead-dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isEadDashboardActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Oversight Dashboard"
                >
                  <DashboardBentoIcon className={`w-4 h-4 shrink-0 ${isEadDashboardActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Dashboard</span>}
                </button>

                {/* 2. Review Queue */}
                <button
                  onClick={() => setActiveView('ead-queue')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isEadQueueActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Review Queue"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <ClipboardList className={`w-4 h-4 shrink-0 ${isEadQueueActive ? 'text-[#365785]' : 'text-white/85'}`} />
                    {!isCollapsed && <span className="truncate">Review Queue</span>}
                  </div>
                  {pendingReviewCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-900 font-bold text-[9px]">
                      {pendingReviewCount}
                    </span>
                  )}
                </button>

                {/* 3. Regulated Facilities */}
                <button
                  onClick={() => setActiveView('ead-facilities')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isEadFacilitiesActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Regulated Facilities"
                >
                  <Building2 className={`w-4 h-4 shrink-0 ${isEadFacilitiesActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Facilities</span>}
                </button>

                {/* 4. Sector Analytics & Reports */}
                <button
                  onClick={() => setActiveView('ead-analytics')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                    isEadAnalyticsActive
                      ? 'bg-white text-[#365785] shadow-sm font-bold'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports & Analytics"
                >
                  <ReportsChartIcon className={`w-4 h-4 shrink-0 ${isEadAnalyticsActive ? 'text-[#365785]' : 'text-white/85'}`} />
                  {!isCollapsed && <span className="truncate">Reports</span>}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Section: Help & Support & Logout */}
        <div className="px-2.5 pt-2.5 pb-[20px] border-t border-white/15 space-y-3 shrink-0">
          {/* Help & Support Button */}
          <button
            onClick={() => setActiveView('help')}
            className={`w-full py-2 px-3 rounded-[6px] text-xs font-medium text-white/90 hover:text-white hover:bg-white/15 transition-all flex items-center gap-2.5 cursor-pointer ${
              activeView === 'help' ? 'bg-white/20 text-white font-bold' : ''
            } ${isCollapsed ? 'justify-center px-1.5' : ''}`}
            title="Help & Guidance"
          >
            <HelpCircle className="w-4 h-4 text-cyan-200 shrink-0" />
            {!isCollapsed && <span className="truncate font-semibold">Help & Support</span>}
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className={`w-full py-2 px-3 rounded-[6px] bg-white text-[#365785] hover:bg-slate-50 transition-all flex items-center gap-2.5 cursor-pointer shadow-sm font-bold text-xs ${
                isCollapsed ? 'justify-center px-1.5' : ''
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
