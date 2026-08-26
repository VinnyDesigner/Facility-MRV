import React from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  CheckCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveView } = useMRV();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-primary-900 to-navy-850 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-brand/20 text-cyan-300 text-xs font-bold">
              Communications Center
            </span>
            <span className="text-xs text-slate-300">Regulatory Broadcasts & Workflow Alerts</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Notifications & Regulatory Deadlines
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
            Direct regulatory alerts from Environment Agency – Abu Dhabi regarding submission milestones, revert notices, and compliance decisions.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="btn-secondary text-xs font-bold py-2.5 px-4 bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center gap-1.5 shrink-0"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <GlassCard className="p-6 space-y-4">
        {notifications.map((notif) => {
          return (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.link) setActiveView(notif.link);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                !notif.read
                  ? 'bg-primary-50/60 border-primary-200 shadow-sm'
                  : 'bg-white/80 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white shadow-sm shrink-0 mt-0.5">
                    {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                    {notif.type === 'action_required' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
                    {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {notif.type === 'info' && <Info className="w-5 h-5 text-primary-500" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-mrv-muted mt-1 leading-relaxed">{notif.message}</p>

                    {notif.deadline && (
                      <div className="flex items-center gap-1 mt-2 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg inline-flex">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Action Required by: {notif.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-mrv-muted block">{notif.timestamp}</span>
                  {notif.link && (
                    <span className="text-xs font-bold text-primary-600 mt-2 inline-flex items-center gap-1 hover:underline">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </GlassCard>
    </div>
  );
};
