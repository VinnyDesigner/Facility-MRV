import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  UserCheck,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { SidebarToggleIcon } from '../icons/NavIcons';
import { useMRV } from '../../context/MRVContext';
import eadLogo from '../../assets/logo.svg';

interface HeaderProps {
  onLogout: () => void;
  isSidebarCollapsed?: boolean;
  setIsSidebarCollapsed?: (collapsed: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLogout,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  const {
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activeView,
    setActiveView,
  } = useMRV();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-r from-[#4A6E9E] via-[#3B5B88] to-[#2E4D77] text-white border-b border-white/15 transition-all shrink-0 shadow-sm h-11 max-h-11 min-h-[44px]">
      <div className="h-full px-3 sm:px-4 flex items-center justify-between gap-3 max-w-full font-sans">
        {/* Left Section: Sidebar Toggle Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {setIsSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-lg text-white hover:text-white/80 hover:bg-white/10 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <SidebarToggleIcon className="w-5 h-5 text-white" />
            </button>
          )}

          {isSidebarCollapsed && (
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0 hover:opacity-90 transition-opacity"
              onClick={() => setActiveView(currentRole === 'EAD_REVIEWER' ? 'ead-dashboard' : 'dashboard')}
              title="Go to Dashboard"
            >
              <img
                src={eadLogo}
                alt="Environment Agency Abu Dhabi"
                className="h-7 w-auto object-contain drop-shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 ml-auto h-full">
          {/* Notifications Bell Button with Badge */}
          <div className="relative flex items-center" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-1 text-white hover:text-white/80 hover:bg-white/10 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white stroke-[1.8]" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#E94E77] text-[10px] font-bold text-white shadow-xs leading-none">
                {notifications.filter((n) => !n.read).length || 3}
              </span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-navy-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-slide-up">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-navy-900">Regulatory Notifications</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-primary-600 hover:underline font-semibold cursor-pointer"
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
                            <span className="text-[10px] text-slate-400">{notif.timestamp.slice(11)}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Name with Dropdown */}
          <div className="relative flex items-center" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer text-left shrink-0"
              title="User Profile Menu"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="User Profile"
                className="w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full object-cover border border-white/30 shrink-0 block"
              />
              <span className="text-sm font-semibold text-white tracking-tight">Ahmed Mohammed</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-navy-900 rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-slide-up text-xs font-sans">
                <div className="p-3 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">Ahmed Mohammed</p>
                  <p className="text-[11px] text-slate-500">ahmed.mohammed@alnoor-energy.ae</p>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentRole('FACILITY_OPERATOR');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      currentRole === 'FACILITY_OPERATOR'
                        ? 'bg-primary-50 text-primary-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>Facility Operator View</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('EAD_REVIEWER');
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      currentRole === 'EAD_REVIEWER'
                        ? 'bg-primary-50 text-primary-800 font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>EAD Regulator View</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
