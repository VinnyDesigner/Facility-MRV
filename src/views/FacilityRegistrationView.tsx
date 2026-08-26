import React, { useState, useRef } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
  Send,
  Building2,
  MapPin,
  FileCheck,
  Award,
  User,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  ArrowRight,
  Upload,
  FileText,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { EmirateType, SectorType, TierLevel } from '../types/mrv';

export const FacilityRegistrationView: React.FC = () => {
  const { activeFacility, updateFacility, setActiveView } = useMRV();

  const [searchTerm, setSearchTerm] = useState('');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Changes Saved!');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data vs Blank data definitions
  const sampleRegistrationData = {
    // 1. Operator Details
    operatorName: 'Green Mountain Holding LLC',
    operatorId: 'OP-000125',
    licenseNumber: 'CN-456987321',
    registeredAddress: 'P.O. Box 12456, Abu Dhabi, UAE',
    correspondenceAddress: 'Same as Registered Address',
    operatorCountry: 'UAE',

    // 2. Facility Details & Location
    facilityName: 'Green Mountain Cement Plant',
    facilityId: 'FAC-000451',
    facilityType: 'Manufacturing Plant',
    facilityCountry: 'UAE',
    facilityDescription:
      'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
    activityDescription:
      'Green Mountain Cement Factory produces clinker and Portland cement for the construction industry. The facility operates one rotary kiln, cement grinding units, raw material storage, and packing lines.',
    address: 'Mussafah Industrial Area, Abu Dhabi, UAE',
    emirate: 'Abu Dhabi',
    coordinates: '23.44, 56.37',

    // 3. Activities & Products
    primaryActivity: 'Cement Manufacturing',
    secondaryActivity: 'Warehouse & Storage',
    additionalActivityDesc: 'Storage and packaging of finished products',
    mainProduct: 'Cement',
    hasOtherProducts: true,
    productDescription: 'Required only when "Other Product" is checked',

    // 4. Environmental Permit
    permitAvailable: true,
    permitNumber: 'EP-2026-001245',
    permitStatus: 'Active',
    permitIssueDate: '01-Jan-2026',
    permitExpiryDate: '31-Dec-2026',
    voluntaryParticipation: true,
    emissionCategory: 'Above Threshold',
    reportingSector: 'Energy, IPPU',
    mrvIssueDate: '01-Jan-2026',
    mrvExpiryDate: '31-Dec-2026',
    environmentalRemarks:
      'Facility operates under a valid environmental permit and is subject to annual MRV reporting requirements.',

    // 5. Contact Persons
    primaryName: 'Sara Mohammed Al Kaabi',
    primaryTitle: 'Environmental Manager',
    primaryEmail: 'sara.alkaabi@gmcf.ae',
    primaryPhone: '+971 50 123 4567',
    alternateName: 'Sara Mohammed Al Kaabi',
    alternateTitle: 'Environmental Manager',
    alternateEmail: 'sara.alkaabi@gmcf.ae',
    alternatePhone: '+971 50 123 4567',

    // 6. Annual Renewal & Report a Change
    confirmDetailsCorrect: true,
    confirmUpdateDetails: false,
    declarationConfirmed: false,
    changeType: 'Change of Operator',
    changeEffectiveDate: '01-Jan-2026',
    changeDescription: 'Additional production line commissioned in July 2026.',
    attachedFiles: [
      { name: 'Uncertainty Guidance.PDF', size: '3MB', status: 'Completed' },
    ],
  };

  const blankRegistrationData = {
    operatorName: '',
    operatorId: 'OP-000125',
    licenseNumber: '',
    registeredAddress: '',
    correspondenceAddress: '',
    operatorCountry: 'UAE',

    facilityName: '',
    facilityId: 'FAC-000451',
    facilityType: 'Manufacturing Plant',
    facilityCountry: 'UAE',
    facilityDescription: '',
    activityDescription: '',
    address: '',
    emirate: 'Abu Dhabi',
    coordinates: '',

    primaryActivity: '',
    secondaryActivity: '',
    additionalActivityDesc: '',
    mainProduct: '',
    hasOtherProducts: false,
    productDescription: '',

    permitAvailable: true,
    permitNumber: '',
    permitStatus: 'Active',
    permitIssueDate: '',
    permitExpiryDate: '',
    voluntaryParticipation: false,
    emissionCategory: 'Above Threshold',
    reportingSector: 'Energy',
    mrvIssueDate: '',
    mrvExpiryDate: '',
    environmentalRemarks: '',

    primaryName: '',
    primaryTitle: '',
    primaryEmail: '',
    primaryPhone: '',
    alternateName: '',
    alternateTitle: '',
    alternateEmail: '',
    alternatePhone: '',

    confirmDetailsCorrect: false,
    confirmUpdateDetails: false,
    declarationConfirmed: false,
    changeType: 'Change of Operator',
    changeEffectiveDate: '',
    changeDescription: '',
    attachedFiles: [],
  };

  // Form State initialized with sample data (easy toggle to blank available)
  const [formData, setFormData] = useState(sampleRegistrationData);

  const loadSampleData = () => {
    setFormData(sampleRegistrationData);
    setNoticeMessage('Loaded Sample Example Data!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const clearToBlank = () => {
    setFormData(blankRegistrationData);
    setNoticeMessage('Form Reset to Blank!');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        status: 'Completed',
      }));
      setFormData((prev) => ({
        ...prev,
        attachedFiles: [...prev.attachedFiles, ...newFiles],
      }));
      setNoticeMessage(`Attached ${newFiles.length} file(s)`);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex],
    }));
    setActiveStep(sectionIndex);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateFacility({
      name: formData.facilityName,
      operatorName: formData.operatorName,
      tradeLicense: formData.licenseNumber,
      sector: 'IPPU' as SectorType,
      emirate: formData.emirate as EmirateType,
      address: formData.address,
      primaryActivity: formData.primaryActivity,
      secondaryActivities: formData.secondaryActivity,
      products: formData.mainProduct,
      permitNumber: formData.permitNumber,
      permitIssueDate: formData.permitIssueDate,
      permitExpiryDate: formData.permitExpiryDate,
      contactPerson: {
        name: formData.primaryName,
        position: formData.primaryTitle,
        email: formData.primaryEmail,
        phone: formData.primaryPhone,
      },
      environmentalManager: {
        name: formData.alternateName,
        email: formData.alternateEmail,
        phone: formData.alternatePhone,
      },
      lastRenewalDate: new Date().toISOString().slice(0, 10),
    });

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleSaveAndContinue = (currentSection: number) => {
    handleSave();
    const nextSection = currentSection + 1;
    if (nextSection <= 6) {
      setOpenSections((prev) => ({
        ...prev,
        [currentSection]: false,
        [nextSection]: true,
      }));
      setActiveStep(nextSection);
    }
  };

  const steps = [
    { num: 1, label: 'Operator Details' },
    { num: 2, label: 'Facility Details & Location' },
    { num: 3, label: 'Activities & Products' },
    { num: 4, label: 'Environmental Permit' },
    { num: 5, label: 'Contact Persons' },
    { num: 6, label: 'Annual Renewal & Report a Change' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden font-sans">
      {/* Hidden file input for actual interactive file uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Fixed Title & Actions Row (No outer scroll) */}
      <div className="flex-shrink-0 pb-2.5 pt-1 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title & Saved Notice */}
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold font-display text-[#004B87] tracking-tight">
            Facility Registration & Compliance
          </h1>
          {isSavedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{noticeMessage}</span>
            </div>
          )}
        </div>

        {/* Right: Search Box + Actions Button */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sections..."
              className="w-full pl-9 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-xs text-navy-900 placeholder-slate-400 focus:outline-none focus:border-[#004B87] shadow-sm transition-all"
            />
            <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <span>Actions</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 z-50 animate-slide-up text-xs font-medium text-navy-900">
                <button
                  onClick={() => {
                    loadSampleData();
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sky-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Fill Sample Example Data</span>
                </button>
                <button
                  onClick={() => {
                    clearToBlank();
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All (Start Blank)</span>
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    handleSave();
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Save Current Draft
                </button>
                <button
                  onClick={() => {
                    setActiveView('data-review');
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Go to Data Review
                </button>
                <button
                  onClick={() => {
                    setActiveView('mrv-reports');
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Go to Reports
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main White Card Container (Fixed Frame) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 flex flex-col overflow-hidden">
        {/* Stepper (Fixed at top of card) */}
        <div className="flex-shrink-0 overflow-x-auto pb-4 border-b border-slate-100/80">
          <div className="relative flex items-start justify-between min-w-[760px] max-w-5xl mx-auto px-6 pt-1">
            {/* Connecting Horizontal Line passing right through the middle of circles (14px from top = center of 28px circle) */}
            <div className="absolute left-10 right-10 top-[18px] -translate-y-1/2 h-[2px] bg-slate-200 z-0" />

            {steps.map((step) => {
              const isCompleted = activeStep > step.num;
              const isCurrent = activeStep === step.num;

              return (
                <div
                  key={step.num}
                  onClick={() => toggleSection(step.num)}
                  className="flex flex-col items-center cursor-pointer group z-10 px-2 flex-1"
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all bg-white relative z-10 shadow-xs ${
                      isCurrent
                        ? 'border-[#004B87] ring-4 ring-[#004B87]/15'
                        : isCompleted
                        ? 'border-[#007749] text-[#007749]'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#007749]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#004B87]" />
                    ) : null}
                  </div>

                  <span
                    className={`text-[12px] mt-2.5 text-center whitespace-nowrap font-medium transition-colors ${
                      isCurrent ? 'font-bold text-[#004B87]' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable Accordions Frame (Top & Bottom 10px padding, scrolls ONLY within this frame) */}
        <div className="flex-1 min-h-0 overflow-y-auto py-[10px] space-y-2.5 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          {/* ========================================================================= */}
          {/* Accordion 1: Operator Details */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(1)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Operator Details</span>
                {openSections[1] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[1] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Operator Name *</label>
                      <input
                        type="text"
                        value={formData.operatorName}
                        onChange={(e) => handleInputChange('operatorName', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Operator ID (Auto)</label>
                      <input
                        type="text"
                        value={formData.operatorId}
                        disabled
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Registration / License Number *</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Registered Address *</label>
                      <input
                        type="text"
                        value={formData.registeredAddress}
                        onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Correspondence Address</label>
                      <input
                        type="text"
                        value={formData.correspondenceAddress}
                        onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Country</label>
                      <select
                        value={formData.operatorCountry}
                        onChange={(e) => handleInputChange('operatorCountry', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      >
                        <option value="UAE">UAE</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Oman">Oman</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(1)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* Accordion 2: Facility Details & Location */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(2)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Facility Details & Location</span>
                {openSections[2] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[2] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Facility Name</label>
                      <input
                        type="text"
                        value={formData.facilityName}
                        onChange={(e) => handleInputChange('facilityName', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Facility ID (Auto)</label>
                      <input
                        type="text"
                        value={formData.facilityId}
                        disabled
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Facility Type</label>
                      <select
                        value={formData.facilityType}
                        onChange={(e) => handleInputChange('facilityType', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      >
                        <option value="Manufacturing Plant">Manufacturing Plant</option>
                        <option value="Power Plant">Power Plant</option>
                        <option value="Refinery">Refinery</option>
                        <option value="Chemical Plant">Chemical Plant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Country</label>
                      <select
                        value={formData.facilityCountry}
                        onChange={(e) => handleInputChange('facilityCountry', e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                      >
                        <option value="UAE">UAE</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Facility Description</label>
                    <textarea
                      rows={2}
                      value={formData.facilityDescription}
                      onChange={(e) => handleInputChange('facilityDescription', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1.5">Description of Activities</label>
                    <textarea
                      rows={2}
                      value={formData.activityDescription}
                      onChange={(e) => handleInputChange('activityDescription', e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                    />
                  </div>

                  {/* Subsection: Location Details */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Location Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Emirate / Region</label>
                        <select
                          value={formData.emirate}
                          onChange={(e) => handleInputChange('emirate', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Abu Dhabi">Abu Dhabi</option>
                          <option value="Al Ain">Al Ain</option>
                          <option value="Al Dhafra">Al Dhafra</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Location Coordinates</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.coordinates}
                            onChange={(e) => handleInputChange('coordinates', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm font-mono text-xs"
                          />
                          <MapPin className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => alert(`Opening GIS map view for ${formData.facilityName} (${formData.coordinates})`)}
                          className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-bold text-xs shadow-sm flex items-center justify-center gap-1 transition-all"
                        >
                          <span>Locate on Map</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(2)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* Accordion 3: Activities & Products */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(3)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Activities & Products</span>
                {openSections[3] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[3] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                  {/* Economic Activities */}
                  <div>
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Economic Activities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Primary Economic Activity</label>
                        <select
                          value={formData.primaryActivity}
                          onChange={(e) => handleInputChange('primaryActivity', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Cement Manufacturing">Cement Manufacturing</option>
                          <option value="Power Generation">Power Generation</option>
                          <option value="Chemical Processing">Chemical Processing</option>
                          <option value="Iron & Steel">Iron & Steel</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Secondary Economic Activity</label>
                        <select
                          value={formData.secondaryActivity}
                          onChange={(e) => handleInputChange('secondaryActivity', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Warehouse & Storage">Warehouse & Storage</option>
                          <option value="Distribution">Distribution</option>
                          <option value="Flaring & Waste Heat">Flaring & Waste Heat</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-slate-600 font-semibold mb-1.5">Additional Activity Description</label>
                      <textarea
                        rows={2}
                        value={formData.additionalActivityDesc}
                        onChange={(e) => handleInputChange('additionalActivityDesc', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Products */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Products</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Main Product(s)</label>
                        <select
                          value={formData.mainProduct}
                          onChange={(e) => handleInputChange('mainProduct', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Cement">Cement</option>
                          <option value="Clinker">Clinker</option>
                          <option value="Portland Cement">Portland Cement</option>
                        </select>
                      </div>
                      <div className="pt-6">
                        <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={formData.hasOtherProducts}
                            onChange={(e) => handleInputChange('hasOtherProducts', e.target.checked)}
                            className="rounded text-[#004B87] focus:ring-[#004B87]"
                          />
                          <span className="font-semibold text-slate-800">Other Products</span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-slate-600 font-semibold mb-1.5">Product Description</label>
                      <textarea
                        rows={2}
                        value={formData.productDescription}
                        onChange={(e) => handleInputChange('productDescription', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(3)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* Accordion 4: Environmental Permit (Screenshot 2) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(4)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Environmental Permit</span>
                {openSections[4] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[4] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-5 animate-fade-in text-xs">
                  {/* Economic Activities */}
                  <div>
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Economic Activities</h4>

                    {/* Toggle: Environmental Permit Available */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-slate-600 font-semibold">Environmental Permit Available</span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className={`font-semibold ${formData.permitAvailable ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('permitAvailable', !formData.permitAvailable)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            formData.permitAvailable ? 'bg-[#004B87]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.permitAvailable ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`font-semibold ${!formData.permitAvailable ? 'text-[#004B87]' : 'text-slate-400'}`}>No</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Environmental Permit Number</label>
                        <input
                          type="text"
                          value={formData.permitNumber}
                          onChange={(e) => handleInputChange('permitNumber', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Permit Status</label>
                        <select
                          value={formData.permitStatus}
                          onChange={(e) => handleInputChange('permitStatus', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Active">Active</option>
                          <option value="Under Renewal">Under Renewal</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Permit Issue Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.permitIssueDate}
                            onChange={(e) => handleInputChange('permitIssueDate', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Permit Expiry Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.permitExpiryDate}
                            onChange={(e) => handleInputChange('permitExpiryDate', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participation */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Participation</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 font-semibold">Voluntary Participation</span>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className={`font-semibold ${formData.voluntaryParticipation ? 'text-[#004B87]' : 'text-slate-400'}`}>Yes</span>
                        <button
                          type="button"
                          onClick={() => handleInputChange('voluntaryParticipation', !formData.voluntaryParticipation)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            formData.voluntaryParticipation ? 'bg-[#004B87]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              formData.voluntaryParticipation ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`font-semibold ${!formData.voluntaryParticipation ? 'text-[#004B87]' : 'text-slate-400'}`}>No</span>
                      </div>
                    </div>
                  </div>

                  {/* MRV Reporting Information */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">MRV Reporting Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Emission Reporting Category</label>
                        <select
                          value={formData.emissionCategory}
                          onChange={(e) => handleInputChange('emissionCategory', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Above Threshold">Above Threshold</option>
                          <option value="Below Threshold">Below Threshold</option>
                          <option value="Voluntary Participant">Voluntary Participant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Reporting Sector</label>
                        <select
                          value={formData.reportingSector}
                          onChange={(e) => handleInputChange('reportingSector', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Energy, IPPU">Energy, IPPU</option>
                          <option value="Energy">Energy</option>
                          <option value="IPPU">IPPU</option>
                          <option value="Waste">Waste</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Permit Issue Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.mrvIssueDate}
                            onChange={(e) => handleInputChange('mrvIssueDate', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Permit Expiry Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.mrvExpiryDate}
                            onChange={(e) => handleInputChange('mrvExpiryDate', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Remarks */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-2">Additional Remarks</h4>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Environmental Remarks</label>
                      <textarea
                        rows={2}
                        value={formData.environmentalRemarks}
                        onChange={(e) => handleInputChange('environmentalRemarks', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(4)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* Accordion 5: Contact Persons */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(5)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Contact Persons</span>
                {openSections[5] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[5] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-4 animate-fade-in text-xs">
                  {/* Primary Contact Person */}
                  <div>
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Primary Contact Person</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Name</label>
                        <input
                          type="text"
                          value={formData.primaryName}
                          onChange={(e) => handleInputChange('primaryName', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Title / Designation</label>
                        <input
                          type="text"
                          value={formData.primaryTitle}
                          onChange={(e) => handleInputChange('primaryTitle', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.primaryEmail}
                            onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.primaryPhone}
                            onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                          />
                          <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alternate Contact Person */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Alternate Contact Person</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Name</label>
                        <input
                          type="text"
                          value={formData.alternateName}
                          onChange={(e) => handleInputChange('alternateName', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Title / Designation</label>
                        <input
                          type="text"
                          value={formData.alternateTitle}
                          onChange={(e) => handleInputChange('alternateTitle', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.alternateEmail}
                            onChange={(e) => handleInputChange('alternateEmail', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Mail className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.alternatePhone}
                            onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm font-mono"
                          />
                          <Phone className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(5)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* Accordion 6: Annual Renewal & Report a Change (Screenshot 3) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all">
              <button
                onClick={() => toggleSection(6)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-slate-800">Annual Renewal & Report a Change</span>
                {openSections[6] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openSections[6] && (
                <div className="p-6 pt-2 border-t border-slate-100 space-y-5 animate-fade-in text-xs">
                  {/* Annual Renewal Section */}
                  <div>
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Annual Renewal</h4>
                    <div className="space-y-2 mb-4">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.confirmDetailsCorrect}
                          onChange={(e) => handleInputChange('confirmDetailsCorrect', e.target.checked)}
                          className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87] border-slate-300"
                        />
                        <span className="text-slate-700 font-semibold">Confirm registration details are correct</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.confirmUpdateDetails}
                          onChange={(e) => handleInputChange('confirmUpdateDetails', e.target.checked)}
                          className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87] border-slate-300"
                        />
                        <span className="text-slate-700 font-semibold">Confirm and update registration details</span>
                      </label>
                    </div>

                    {/* Declaration Sub-box */}
                    <div>
                      <h4 className="text-xs font-bold text-[#004B87] mb-1.5">Declaration</h4>
                      <div className="p-3.5 rounded-xl bg-[#F4F7FB] border border-slate-200">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.declarationConfirmed}
                            onChange={(e) => handleInputChange('declarationConfirmed', e.target.checked)}
                            className="w-4 h-4 rounded text-[#004B87] focus:ring-[#004B87] border-slate-300"
                          />
                          <span className="text-slate-700 font-semibold">I confirm that the information provided is true and accurate</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Report a Change Section */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-3">Report a Change</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Change Type</label>
                        <select
                          value={formData.changeType}
                          onChange={(e) => handleInputChange('changeType', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                        >
                          <option value="Change of Operator">Change of Operator</option>
                          <option value="Change of Facility Boundary">Change of Facility Boundary</option>
                          <option value="Change of Fuel / Material Mix">Change of Fuel / Material Mix</option>
                          <option value="Operational Capacity Modification">Operational Capacity Modification</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1.5">Effective Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.changeEffectiveDate}
                            onChange={(e) => handleInputChange('changeEffectiveDate', e.target.value)}
                            className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm"
                          />
                          <Calendar className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1.5">Change Description</label>
                      <textarea
                        rows={2}
                        value={formData.changeDescription}
                        onChange={(e) => handleInputChange('changeDescription', e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-navy-900 focus:outline-none focus:border-[#004B87] shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Supporting Documents Section */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#004B87] mb-2">Supporting Documents</h4>
                    <label className="block text-slate-600 font-semibold mb-2">Attach Files</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      {/* Drag & Drop Upload Box */}
                      <div className="border border-dashed border-sky-300 bg-sky-50/40 rounded-xl p-3 px-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium truncate">
                          <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="truncate">Drag and drop files here or upload</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 rounded-lg shadow-xs transition-colors flex-shrink-0"
                        >
                          Upload
                        </button>
                      </div>

                      {/* Attached File Badge */}
                      {formData.attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="border border-slate-200 bg-white rounded-xl p-2.5 px-3.5 flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-rose-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                                <span>{file.size}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-emerald-600 font-bold">{file.status}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleInputChange('attachedFiles', formData.attachedFiles.filter((_, i) => i !== idx))}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => handleSaveAndContinue(6)}
                      className="px-5 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>Save & Continue</span>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Fixed Bottom 3 Action Buttons */}
      <div className="flex-shrink-0 pt-3 pb-1 flex items-center justify-end gap-3">
        <button
          onClick={() => setActiveView('dashboard')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Cancel</span>
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#004B87] text-xs font-bold text-[#004B87] flex items-center gap-1.5 shadow-sm transition-all"
        >
          <span>Save</span>
          <Bookmark className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={() => {
            handleSave();
            setActiveView('data-review');
          }}
          className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003866] text-xs font-bold text-white flex items-center gap-2 shadow-md transition-all"
        >
          <span>Submit</span>
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};
