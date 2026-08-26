import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  Search,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  UserCheck,
  ShieldCheck,
  HelpCircle,
  LayoutGrid,
  Building2,
  ClipboardList,
  BarChart2,
  BarChart3,
  FileText,
  History,
  Globe,
} from 'lucide-react';
import { useMRV } from '../../context/MRVContext';
import colorLogo from '../../assets/color-logo.svg';

interface HeaderProps {
  onLogout: () => void;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    activeView,
    setActiveView,
    activeFacility,
    reportingYear,
    submissions,
  } = useMRV();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isReportsMenuOpen, setIsReportsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'العربية'>('English');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);

  const pendingReviewCount = (submissions || []).filter(
    (s) => s.status === 'Submitted' || s.status === 'Under Review'
  ).length;

  // Active view match flags
  const isDashboardActive = activeView === 'dashboard';
  const isFacilityActive =
    activeView === 'facility' ||
    activeView === 'registration' ||
    activeView === 'annual-renewal' ||
    activeView === 'report-change' ||
    activeView === 'compliance-checker';
  const isDataEntryActive =
    activeView === 'data-entry' ||
    activeView === 'monitoring-plan' ||
    activeView === 'emissions-data' ||
    activeView === 'report-upload';
  const isDataReviewActive = activeView === 'data-review';
  const isReportsActive =
    activeView === 'reports' ||
    activeView === 'mrv-reports' ||
    activeView === 'submissions' ||
    activeView === 'version-history';

  const isEadDashboardActive = activeView === 'ead-dashboard' || (currentRole === 'EAD_REVIEWER' && activeView === 'dashboard');
  const isEadQueueActive = activeView === 'ead-queue' || activeView === 'ead-review-detail';
  const isEadFacilitiesActive = activeView === 'ead-facilities';
  const isEadAnalyticsActive = activeView === 'ead-[#analytics]' || activeView === 'ead-analytics' || activeView === 'reports';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (reportsRef.current && !reportsRef.current.contains(event.target as Node)) {
        setIsReportsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#E5E8ED] text-[#0D0E12] border-b border-slate-300/40 transition-all shrink-0">
      <div className="px-4 sm:px-8 py-2.5 flex items-center justify-between relative">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center shrink-0">
          <div
            className="flex items-center cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
            onClick={() => setActiveView(currentRole === 'EAD_REVIEWER' ? 'ead-dashboard' : 'dashboard')}
            title="Go to Dashboard"
          >
            <img
              src={colorLogo}
              alt="Environment Agency Abu Dhabi"
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Center Section: Top Navigation Bar */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
          <nav className="h-[46px] flex items-center gap-1 p-1 bg-gradient-to-b from-[#5575A3] to-[#365785] backdrop-blur-md rounded-full shadow-lg border border-white/60 transition-all duration-300">
            {currentRole === 'FACILITY_OPERATOR' ? (
              <>
                {/* 1. Dashboard */}
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isDashboardActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Dashboard"
                >
                  <span>Dashboard</span>
                </button>

                {/* 2. Registration */}
                <button
                  onClick={() => setActiveView('registration')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isFacilityActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Registration"
                >
                  <span>Registration</span>
                </button>

                {/* 3. Data Entry */}
                <button
                  onClick={() => setActiveView('data-entry')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isDataEntryActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Data Entry"
                >
                  <span>Data Entry</span>
                </button>

                {/* 4. Data Review */}
                <button
                  onClick={() => setActiveView('data-review')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isDataReviewActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Data Review"
                >
                  <span>Data Review</span>
                </button>

                {/* 5. Reports */}
                <button
                  onClick={() => setActiveView('reports')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isReportsActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports"
                >
                  <span>Reports</span>
                </button>
              </>
            ) : (
              /* EAD Regulator View Categories */
              <>
                {/* 1. Dashboard */}
                <button
                  onClick={() => setActiveView('ead-dashboard')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isEadDashboardActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Oversight Dashboard"
                >
                  <span>Dashboard</span>
                </button>

                {/* 2. Review Queue */}
                <button
                  onClick={() => setActiveView('ead-queue')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isEadQueueActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Review Queue"
                >
                  <span>Review Queue</span>
                  {pendingReviewCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-white font-bold text-[10px]">
                      {pendingReviewCount}
                    </span>
                  )}
                </button>

                {/* 3. Facilities */}
                <button
                  onClick={() => setActiveView('ead-facilities')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isEadFacilitiesActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Regulated Facilities"
                >
                  <span>Facilities</span>
                </button>

                {/* 4. Reports */}
                <button
                  onClick={() => setActiveView('ead-analytics')}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isEadAnalyticsActive
                      ? 'bg-white text-[#3B5B88] font-bold shadow-sm'
                      : 'text-white/85 hover:text-white hover:bg-white/15'
                  }`}
                  title="Reports & Analytics"
                >
                  <span>Reports</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Section: Header Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Language Selection: English <-> العربية */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="h-9 px-3.5 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center gap-2 text-slate-700 hover:text-[#004B87] hover:border-[#004B87]/30 hover:bg-slate-50 transition-all text-xs font-semibold cursor-pointer"
              title={language === 'English' ? 'التحويل إلى اللغة العربية' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 text-[#004B87]" />
              <span className="font-bold text-xs text-[#004B87]">
                {language === 'English' ? 'العربية' : 'English'}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-slide-up text-xs font-medium text-navy-900">
                <button
                  onClick={() => {
                    setLanguage('English');
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    language === 'English' ? 'bg-[#004B87]/10 text-[#004B87] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {language === 'English' && <CheckCircle2 className="w-3.5 h-3.5 text-[#004B87]" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('العربية');
                    setIsLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                    language === 'العربية' ? 'bg-[#004B87]/10 text-[#004B87] font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-semibold">العربية</span>
                  {language === 'العربية' && <CheckCircle2 className="w-3.5 h-3.5 text-[#004B87]" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative w-9 h-9 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:shadow transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-navy-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-slide-up">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-navy-900">Regulatory Notifications</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-primary-600 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 mt-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) setActiveView(notif.link);
                        setIsNotifOpen(false);
                      }}
                      className="p-3 text-left hover:bg-primary-50/60 transition-colors cursor-pointer rounded-xl"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {notif.type === 'action_required' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {notif.type === 'info' && <Info className="w-4 h-4 text-primary-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-navy-900">{notif.title}</p>
                            <span className="text-[10px] text-mrv-muted">{notif.timestamp.slice(11)}</span>
                          </div>
                          <p className="text-xs text-mrv-muted mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 ring-black/20 transition-all text-left"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-9 h-9 rounded-full object-cover shadow-xs border border-white"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white text-navy-900 rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-slide-up text-xs">
                <div className="p-3 border-b border-slate-100">
                  <p className="font-bold text-navy-900">Abdul (Umasri M.)</p>
                  <p className="text-[11px] text-mrv-muted">umasri.m@alnoor-energy.ae</p>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded bg-primary-50 text-primary-800 font-semibold text-[10px]">
                    Al Noor Facility • Energy
                  </span>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentRole('FACILITY_OPERATOR');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                      currentRole === 'FACILITY_OPERATOR'
                        ? 'bg-primary-50 text-primary-800 font-bold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-primary-600" />
                    Facility Operator View
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('EAD_REVIEWER');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                      currentRole === 'EAD_REVIEWER'
                        ? 'bg-teal-50 text-teal-800 font-bold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    EAD Regulator View
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle (Hamburger) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
            title="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0C1E3A] px-4 py-3 space-y-2 animate-slide-down">
          {currentRole === 'FACILITY_OPERATOR' ? (
            <>
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isDashboardActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('registration');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isFacilityActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Registration
              </button>
              <button
                onClick={() => {
                  setActiveView('data-entry');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isDataEntryActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Data Entry
              </button>
              <button
                onClick={() => {
                  setActiveView('data-review');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isDataReviewActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Data Review
              </button>

              <div className="pt-2 border-t border-white/10">
                <div className="px-3.5 py-1 text-[10px] uppercase tracking-wider text-cyan-200/70 font-bold">
                  Reports
                </div>
                <button
                  onClick={() => {
                    setActiveView('mrv-reports');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium rounded-lg ${
                    activeView === 'mrv-reports' ? 'text-cyan-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  • MRV Reports
                </button>
                <button
                  onClick={() => {
                    setActiveView('submissions');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium rounded-lg ${
                    activeView === 'submissions' ? 'text-cyan-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  • Submission History
                </button>
                <button
                  onClick={() => {
                    setActiveView('version-history');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium rounded-lg ${
                    activeView === 'version-history' ? 'text-cyan-300 font-bold' : 'text-slate-300'
                  }`}
                >
                  • Version History
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setActiveView('ead-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isEadDashboardActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Oversight Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('ead-queue');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isEadQueueActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4" />
                  Review Queue
                </div>
                {pendingReviewCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-navy-950 font-bold text-[10px]">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveView('ead-facilities');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isEadFacilitiesActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Regulated Facilities
              </button>
              <button
                onClick={() => {
                  setActiveView('ead-analytics');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isEadAnalyticsActive ? 'bg-white text-[#004B87]' : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Sector Analytics
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

