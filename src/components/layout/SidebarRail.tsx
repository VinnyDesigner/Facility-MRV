import React from 'react';
import {
  ChevronLeft,
  Share2,
  Upload,
  Star,
  Plus,
  Smartphone,
  Database,
  Calendar,
  Send,
  AlertCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { useMRV } from '../../context/MRVContext';

export const SidebarRail: React.FC = () => {
  const { setActiveView, activeView } = useMRV();
  const [isDark, setIsDark] = React.useState(false);

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-12 py-4 my-auto bg-white/70 backdrop-blur-md rounded-full border border-slate-200/80 shadow-xs z-30 shrink-0 self-center transition-all">
      {/* Top Action Icons */}
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <button
          onClick={() => setActiveView('dashboard')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Back to Main Dashboard"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => alert('Share report view link copied to clipboard!')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('report-upload')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Upload Document"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={() => alert('Saved to favorites')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Bookmark / Favorite"
        >
          <Star className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('data-entry')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Add New Entry"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={() => alert('Responsive View Enabled')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Mobile View Preview"
        >
          <Smartphone className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('mrv-reports')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Emissions Database"
        >
          <Database className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('annual-renewal')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Reporting Calendar"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('submissions')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-black transition-all"
          title="Submit Report"
        >
          <Send className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveView('help')}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/60 hover:text-rose-600 transition-all"
          title="Compliance Alert"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Theme Toggle Button */}
      <div className="pt-2 border-t border-slate-200/60 flex flex-col items-center gap-2">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-[#0D0E12] hover:text-white transition-all shadow-xs"
          title="Toggle Theme Mode"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
