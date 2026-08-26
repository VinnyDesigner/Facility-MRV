import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Building2,
  MapPin,
  ShieldCheck,
  Award,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Facility } from '../types/mrv';

export const EADFacilitiesView: React.FC = () => {
  const { facilities, setActiveFacilityId, setActiveView } = useMRV();

  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [emirateFilter, setEmirateFilter] = useState('ALL');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const filteredFacilities = facilities.filter((fac) => {
    const matchesSearch =
      fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.facilityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fac.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'ALL' || fac.sector === sectorFilter;
    const matchesEmirate = emirateFilter === 'ALL' || fac.emirate === emirateFilter;
    return matchesSearch && matchesSector && matchesEmirate;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-[#0B2238] to-[#143E65] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-brand/20 text-cyan-300 text-xs font-bold">
              Master Environmental Registry
            </span>
            <span className="text-xs text-slate-300">Abu Dhabi Regulated Industrial Entities</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Regulated Facilities Directory
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 mt-1 max-w-xl">
            Directory of all permitted installations, assigned accounting tiers, statutory environmental permits, and compliance records.
          </p>
        </div>

        <Badge variant="cyan" size="lg">
          {facilities.length} Active Facilities
        </Badge>
      </div>

      {/* Search and Filters */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mrv-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by facility name, identifier code, or operator..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-mrv-muted" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="glass-input py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="ALL">All Sectors</option>
            <option value="Energy">Energy</option>
            <option value="IPPU">IPPU</option>
            <option value="Waste">Waste</option>
          </select>

          <select
            value={emirateFilter}
            onChange={(e) => setEmirateFilter(e.target.value)}
            className="glass-input py-2 text-xs font-semibold cursor-pointer"
          >
            <option value="ALL">All Regions</option>
            <option value="Abu Dhabi">Abu Dhabi</option>
            <option value="Al Ain">Al Ain</option>
            <option value="Al Dhafra">Al Dhafra</option>
          </select>
        </div>
      </GlassCard>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((fac) => (
          <GlassCard key={fac.id} className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary-500/15 text-primary-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display text-navy-900 leading-tight">
                      {fac.name}
                    </h3>
                    <p className="text-[11px] text-mrv-muted font-mono">{fac.facilityCode}</p>
                  </div>
                </div>
                <Badge variant="success" dot size="sm">
                  {fac.status}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-primary-50/40 border border-primary-100/60 my-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Sector / Tier:</span>
                  <span className="font-bold text-navy-900">{fac.sector} • {fac.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Region:</span>
                  <span className="font-semibold text-primary-700">{fac.emirate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Permit Number:</span>
                  <span className="font-mono text-navy-900 font-semibold">{fac.permitNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Permit Expiry:</span>
                  <span className="font-semibold text-emerald-700">{fac.permitExpiryDate}</span>
                </div>
              </div>

              <p className="text-[11px] text-mrv-muted line-clamp-2 leading-relaxed">
                {fac.primaryActivity}
              </p>
            </div>

            <div className="pt-4 border-t border-primary-100/60 flex items-center justify-between gap-3 mt-4">
              <div className="text-xs">
                <span className="text-mrv-muted">Compliance: </span>
                <span className="font-bold text-emerald-700">{fac.complianceScore}%</span>
              </div>

              <button
                onClick={() => {
                  setActiveFacilityId(fac.id);
                  setActiveView('registration');
                }}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <span>View Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
