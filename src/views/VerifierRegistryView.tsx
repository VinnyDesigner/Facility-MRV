import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Mail,
  Phone,
  Star,
  ExternalLink,
  Award,
  Filter,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { AccreditedVerifier } from '../types/mrv';

export const VerifierRegistryView: React.FC = () => {
  const { verifiers, activeFacility, currentRole } = useMRV();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [selectedVerifier, setSelectedVerifier] = useState<AccreditedVerifier | null>(null);
  const [isAssignedNotice, setIsAssignedNotice] = useState<string | null>(null);

  const filteredVerifiers = verifiers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.accreditationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      sectorFilter === 'ALL' || v.sectors.includes(sectorFilter as any);
    return matchesSearch && matchesSector;
  });

  const handleAssignVerifier = (verifier: AccreditedVerifier) => {
    setIsAssignedNotice(`Assigned ${verifier.name} to ${activeFacility.name} for 2026 Reporting Cycle.`);
    setTimeout(() => setIsAssignedNotice(null), 3500);
    setSelectedVerifier(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* Fixed Sticky Header */}
      <div className="flex-shrink-0 pb-3 pt-1 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Accredited Third-Party Verifier Registry
          </h1>
          {isAssignedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{isAssignedNotice}</span>
            </div>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-500">
          ISO 14065:2020 / ENAS Accredited • {verifiers.length} Bodies
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6 pb-12">
        {/* Search & Filter Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-mrv-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search verifiers by name, accreditation #, or organization..."
            className="w-full pl-10 pr-4 py-2 glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-mrv-muted" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="glass-input py-2 text-xs font-semibold cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">All Sectors</option>
            <option value="Energy">Energy Sector</option>
            <option value="IPPU">IPPU Sector</option>
            <option value="Waste">Waste Sector</option>
            <option value="Transport">Transport Sector</option>
          </select>
        </div>
      </GlassCard>

      {/* Verifier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVerifiers.map((ver) => (
          <GlassCard key={ver.id} className="p-6 flex flex-col justify-between" hoverEffect>
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-700 flex items-center justify-center font-bold font-display text-lg">
                    {ver.organization.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-navy-900 leading-tight">
                      {ver.name}
                    </h3>
                    <p className="text-xs text-mrv-muted">{ver.organization}</p>
                  </div>
                </div>
                <Badge variant="success" dot size="sm">
                  {ver.accreditationStatus}
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100/60 my-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Accreditation Number:</span>
                  <span className="font-mono font-bold text-navy-900">{ver.accreditationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Accreditation Body:</span>
                  <span className="font-semibold text-primary-700">{ver.accreditationBody}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mrv-muted">Accreditation Validity:</span>
                  <span className="font-semibold text-navy-900">{ver.validUntil}</span>
                </div>
              </div>

              {/* Sector tags */}
              <div className="flex items-center gap-1.5 flex-wrap my-3">
                {ver.sectors.map((sec) => (
                  <span
                    key={sec}
                    className="px-2 py-0.5 rounded-md bg-white border border-primary-200 text-primary-800 text-[10px] font-semibold"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-primary-100/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{ver.rating.toFixed(1)}</span>
                <span className="text-mrv-muted font-normal">({ver.verifiedFacilitiesCount} audits)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedVerifier(ver)}
                  className="btn-secondary text-xs font-semibold py-2 px-3"
                >
                  View Details
                </button>
                {currentRole === 'FACILITY_OPERATOR' && (
                  <button
                    onClick={() => handleAssignVerifier(ver)}
                    className="btn-primary text-xs font-bold py-2 px-3"
                  >
                    Assign
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Verifier Detail Modal */}
      {selectedVerifier && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedVerifier(null)}
          title={selectedVerifier.name}
          subtitle={`Accredited Verification Body • ${selectedVerifier.accreditationNumber}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-teal-950 text-sm">Official EAD Accreditation Recognized</h4>
                <p className="text-teal-800 mt-1 leading-relaxed">
                  Accredited under ISO 14065:2020 for Greenhouse Gas assertion audits, baseline validations, and Annual MRV report certifications in the Emirate of Abu Dhabi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Lead GHG Auditor</span>
                <p className="font-bold text-navy-900 mt-0.5">{selectedVerifier.leadAuditor}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Contact Email</span>
                <p className="font-bold text-primary-700 mt-0.5">{selectedVerifier.contactEmail}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Phone</span>
                <p className="font-bold text-navy-900 mt-0.5">{selectedVerifier.phone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-mrv-muted uppercase">Accreditation Expiry</span>
                <p className="font-bold text-emerald-700 mt-0.5">{selectedVerifier.validUntil}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedVerifier(null)}
                className="btn-secondary text-xs"
              >
                Close
              </button>
              {currentRole === 'FACILITY_OPERATOR' && (
                <button
                  onClick={() => handleAssignVerifier(selectedVerifier)}
                  className="btn-primary text-xs font-bold py-2.5 px-4"
                >
                  Confirm Assignment for 2026 Cycle
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};
