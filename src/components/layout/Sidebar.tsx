import React, { useState } from 'react';
import {
  LayoutGrid,
  Settings,
  Globe2,
  BarChart2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sparkles,
  ClipboardList,
  BarChart3,
  Users,
  ShieldCheck,
  Building2,
} from 'lucide-react';
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
    activeView,
    setActiveView,
    submissions,
    unreadNotificationCount,
  } = useMRV();

  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const pendingReviewCount = submissions.filter(
    (s) => s.status === 'Submitted' || s.status === 'Under Review'
  ).length;

  return (
    <aside
      className={`sticky top-0 h-screen z-30 flex flex-col justify-between bg-[#0C1E3A] text-white transition-all duration-300 select-none shadow-xl overflow-y-auto shrink-0 border-r border-[#1E3456] ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Top Brand Logo - Left Aligned */}
        <div className={`px-5 py-5 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <img
            src={eadLogo}
            alt="Environment Agency - Abu Dhabi"
            className={`${isCollapsed ? 'h-7 max-w-[44px]' : 'h-10 max-w-[190px]'} object-contain drop-shadow-sm transition-all`}
          />
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-2 mt-2">
          {currentRole === 'FACILITY_OPERATOR' ? (
            <>
              {/* 1. Dashboard */}
              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-white text-[#004B87] shadow-lg font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                title="Dashboard"
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Dashboard</span>}
              </button>

              {/* 2. Facility Details */}
              <button
                onClick={() => setActiveView('facility')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'facility' || activeView === 'registration'
                    ? 'bg-white text-[#004B87] shadow-lg font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                title="Facility Details & Registration"
              >
                <Building2 className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Facility Details</span>}
              </button>

              {/* 3. Data Review */}
              <button
                onClick={() => setActiveView('data-review')}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'data-review' || activeView === 'monitoring-plan' || activeView === 'emissions-data' || activeView === 'report-upload'
                    ? 'bg-white text-[#004B87] shadow-lg font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
                title="Data Review (Monitoring Plan, Emissions, Upload, Submit)"
              >
                <ClipboardList className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Data Review</span>}
              </button>

              {/* 4. Reports (Expandable) */}
              <div>
                <button
                  onClick={() => {
                    if (isCollapsed) {
                      setActiveView('mrv-reports');
                    } else {
                      setIsReportsOpen(!isReportsOpen);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeView === 'mrv-reports' || activeView === 'submissions' || activeView === 'version-history'
                      ? 'bg-white text-[#004B87] shadow-lg font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                  title="Reports"
                >
                  <div className="flex items-center gap-3.5">
                    <BarChart2 className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Reports</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isReportsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Sub-menu under Reports */}
                {!isCollapsed && isReportsOpen && (
                  <div className="pl-10 pr-2 py-1.5 space-y-1 text-xs">
                    <button
                      onClick={() => setActiveView('mrv-reports')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg font-medium transition-colors ${
                        activeView === 'mrv-reports'
                          ? 'text-cyan-300 font-bold bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      • MRV Reports
                    </button>
                    <button
                      onClick={() => setActiveView('submissions')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg font-medium transition-colors ${
                        activeView === 'submissions'
                          ? 'text-cyan-300 font-bold bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      • Submission History
                    </button>
                    <button
                      onClick={() => setActiveView('version-history')}
                      className={`w-full text-left py-2 px-2.5 rounded-lg font-medium transition-colors ${
                        activeView === 'version-history'
                          ? 'text-cyan-300 font-bold bg-white/10'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      • Version History
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* EAD REGULATOR SIDEBAR MENU */
            <div className="space-y-1.5">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200/70">
                  EAD Regulator Oversight
                </div>
              )}
              <button
                onClick={() => setActiveView('ead-dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'ead-dashboard'
                    ? 'bg-white text-[#004B87] shadow-md font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                {!isCollapsed && <span>Oversight Dashboard</span>}
              </button>

              <button
                onClick={() => setActiveView('ead-queue')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'ead-queue' || activeView === 'ead-detail'
                    ? 'bg-white text-[#004B87] shadow-md font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4" />
                  {!isCollapsed && <span>Review Queue</span>}
                </div>
                {pendingReviewCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-navy-950 font-bold text-[10px]">
                    {pendingReviewCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveView('ead-facilities')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'ead-facilities'
                    ? 'bg-white text-[#004B87] shadow-md font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                {!isCollapsed && <span>Regulated Facilities</span>}
              </button>

              <button
                onClick={() => setActiveView('ead-analytics')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'ead-analytics'
                    ? 'bg-white text-[#004B87] shadow-md font-bold'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                {!isCollapsed && <span>Sector Analytics</span>}
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Help & Logout Section */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <button
          onClick={() => setActiveView('help')}
          className={`w-full py-2 px-3.5 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2.5 ${
            activeView === 'help' ? 'bg-white/15 text-white font-bold' : ''
          }`}
          title="Help & Support"
        >
          <span className="w-4 h-4 shrink-0 flex items-center justify-center font-bold text-cyan-300">?</span>
          {!isCollapsed && <span>Help & Support</span>}
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#004B87] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <LogOut className="w-4 h-4 text-[#004B87] group-hover:-translate-x-0.5 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
