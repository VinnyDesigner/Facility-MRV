import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  Lock,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Layers,
  LogIn,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { UserRole } from '../types/mrv';
import { FieldTooltip } from '../components/ui/FieldTooltip';
import eadLogo from '../assets/logo.svg';
import loginBg from '../assets/login-bg.png';
import loginRightRibbedBg from '../assets/login-right-ribbed-bg.png';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'register_details' | 'register_otp' | 'register_success';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole } = useMRV();

  // Mode State: login | register_details | register_otp | register_success
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('ahmed.zaabi@alnoor-energy.ae');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State (Prefilled for demo purpose)
  const [regForm, setRegForm] = useState({
    firstName: 'Ahmed',
    lastName: 'Al Zaabi',
    email: 'ahmed.zaabi@alnoor-energy.ae',
    phone: '50 123 4567',
    password: '••••••••••••',
    confirmPassword: '••••••••••••',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regErrors, setRegErrors] = useState<{ [key: string]: string }>({});

  // OTP State (6 Digits - prefilled for demo purpose)
  const [otpDigits, setOtpDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authMode === 'register_otp' && otpCountdown > 0) {
      timer = setTimeout(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setCanResendOtp(true);
    }
    return () => clearTimeout(timer);
  }, [authMode, otpCountdown]);

  // Handle Standard Login
  const handleSignIn = (role: UserRole = 'FACILITY_OPERATOR') => {
    setIsLoading(true);
    setCurrentRole(role);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  // Step 1: Validate Details and Send OTP (Demo Flow)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRegErrors({});
    setIsLoading(true);

    // Simulate sending OTP SMS & Email
    setTimeout(() => {
      setIsLoading(false);
      setOtpDigits(['1', '2', '3', '4', '5', '6']);
      setOtpError('');
      setOtpCountdown(60);
      setCanResendOtp(false);
      setAuthMode('register_otp');
    }, 600);
  };

  // Handle OTP Input Change & Auto-Advance
  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-advance to next input if digit entered
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP Backspace & Arrow Navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);
    setOtpError('');

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Quick Auto-fill Sample OTP (123456)
  const handleQuickFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
  };

  // Resend OTP Code
  const handleResendOtp = () => {
    if (!canResendOtp) return;
    setOtpCountdown(60);
    setCanResendOtp(false);
    setOtpError('');
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    // focus first
    otpInputRefs.current[0]?.focus();
  };

  // Step 2: Confirm OTP & Complete Registration (Demo Flow)
  const handleConfirmOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpVerifying(true);
    setOtpError('');

    // Simulate OTP verification
    setTimeout(() => {
      setIsOtpVerifying(false);
      setAuthMode('register_success');
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#06182B] text-white overflow-hidden select-none">
      {/* LEFT SIDE: Visual Hero Area with Attached Background Image (58% width on desktop) */}
      <div
        className="relative lg:w-[56%] xl:w-[58%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
        }}
      >
        {/* Seamless Rightward Feathering Gradient (Desktop) */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-48 sm:w-64 lg:w-80 bg-gradient-to-r from-transparent via-[#06182B]/60 to-[#041221] z-10 pointer-events-none" />

        {/* Seamless Bottom Feathering Gradient (Mobile / Tablet) */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#041221]/80 to-[#041221] z-10 pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center z-10">
          <img
            src={eadLogo}
            alt="Environment Agency - Abu Dhabi"
            className="h-16 sm:h-20 w-auto max-w-[280px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Center Hero Copy */}
        <div className="my-10 lg:my-auto max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#082235]/80 backdrop-blur-md border border-[#00B2FE]/30 text-[#00B2FE] text-xs font-semibold mb-6 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00B2FE]" />
            <span>Environment Agency – Abu Dhabi Subnational MRV Framework</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-white">
            Monitor. Report. <br />
            <span className="text-[#00B2FE]">
              Comply with Precision.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 mt-5 leading-relaxed font-normal max-w-xl">
            A secure enterprise digital platform for facility-level GHG emissions monitoring, verified reporting submissions, third-party assurance audits, and regulatory compliance.
          </p>

          {/* 3 Feature Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
            {/* Card 1: Facility Registration */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-3 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Facility Registration</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Annual renewal, permits & plant boundary definitions
                </p>
              </div>
            </div>

            {/* Card 2: Emission & Plans */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-3 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Emission & Plans</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Manage monitoring plans, activity data & emissions
                </p>
              </div>
            </div>

            {/* Card 3: Annual Emission Reporting */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-3 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Annual Emission Reporting</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Submit annual data, calculate emissions & track status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Floating Authentication Panel */}
      <div className="relative lg:w-[44%] xl:w-[42%] flex items-center justify-center lg:justify-start lg:pl-8 xl:pl-10 p-5 sm:p-8 lg:p-10 z-20 bg-[#041221] overflow-y-auto">
        {/* Seamless Leftward Feathering Gradient (Desktop) */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 sm:w-48 lg:w-64 bg-gradient-to-r from-[#041221] via-[#041221]/70 to-transparent z-10 pointer-events-none" />

        {/* Seamless Top Feathering Gradient (Mobile / Tablet) */}
        <div className="lg:hidden absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#041221] via-[#041221]/80 to-transparent z-10 pointer-events-none" />

        {/* Background Image Overlay with Smooth Opacity Blend */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url(${loginRightRibbedBg})`,
          }}
        />

        {/* Radial Ambient Glow behind Card */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,50,100,0.4)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm sm:max-w-md relative z-20 my-auto py-4">
          {/* Glass Card with Rich Blue Gradient & Pulsating Bluish Inner Shadow Vignette */}
          <div className="p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-[#0B4079] via-[#062954] to-[#031836] border border-white/10 relative overflow-hidden animate-pulse-inner-shadow shadow-2xl backdrop-blur-md">

            {/* ============================================================= */}
            {/* VIEW 1: LOGIN FORM */}
            {/* ============================================================= */}
            {authMode === 'login' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Welcome back
                  </h2>
                  <p className="text-xs text-slate-300/80 mt-1.5 font-normal">
                    Sign in to your Facility MRV Platform
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignIn('FACILITY_OPERATOR');
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email
                    </label>
                    <FieldTooltip
                      content="Enter your registered corporate or government MRV account email."
                      example="ahmed.zaabi@alnoor-energy.ae"
                    >
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm"
                      />
                    </FieldTooltip>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <FieldTooltip content="Enter your confidential account password.">
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter Password"
                          className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FieldTooltip>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 pb-0.5 whitespace-nowrap">
                    <FieldTooltip content="Keep your authentication session persistent on this browser workstation.">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 whitespace-nowrap select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#061626] border-[#163857] text-[#00B2FE] focus:ring-0 cursor-pointer shrink-0"
                        />
                        <span className="font-medium text-slate-300 whitespace-nowrap">Remember Me</span>
                      </label>
                    </FieldTooltip>

                    <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#00B2FE] hover:text-cyan-300 font-medium transition-colors whitespace-nowrap shrink-0 ml-2">
                      Forgot Password?
                    </a>
                  </div>

                  {/* 3D Tactile CTA Button matching Application Linear Gradient with generous gap from inputs */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.5),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.65),inset_0_1px_1px_rgba(255,255,255,0.75)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_10px_rgba(0,75,135,0.4),inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none group"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 group-hover:translate-x-0.5" />
                          <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] tracking-wide font-bold">Login</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider: or */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#14324F]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-slate-400 font-medium bg-[#071B2F] rounded-full">
                      or
                    </span>
                  </div>
                </div>

                {/* Azure AD SSO Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleSignIn('FACILITY_OPERATOR')}
                    className="w-11 h-11 p-2 rounded-2xl bg-[#00B2FE] hover:bg-[#009CEB] text-white shadow-lg shadow-[#00B2FE]/35 hover:scale-105 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                    title="Single Sign-On with Azure Active Directory (Azure AD)"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="50" y1="21" x2="21" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="79" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="21" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="79" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <circle cx="50" cy="21" r="10.5" fill="currentColor" />
                      <circle cx="21" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="79" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="50" cy="79" r="10.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Don't have an account? Register Link (close to Azure button) */}
                <div className="mt-4 text-center text-xs">
                  <span className="text-slate-300">Don't have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setRegErrors({});
                      setRegForm({
                        firstName: 'Ahmed',
                        lastName: 'Al Zaabi',
                        email: 'ahmed.zaabi@alnoor-energy.ae',
                        phone: '50 123 4567',
                        password: '••••••••••••',
                        confirmPassword: '••••••••••••',
                      });
                      setAuthMode('register_details');
                    }}
                    className="text-[#00B2FE] hover:text-cyan-300 font-bold underline cursor-pointer transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 2: REGISTRATION - STEP 1: USER DETAILS */}
            {/* ============================================================= */}
            {authMode === 'register_details' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Create an Account
                  </h2>
                  <p className="text-xs text-slate-300/80 mt-1.5 font-normal">
                    Register your data provider account for the MRV Platform
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3.5">
                  {/* First Name & Last Name in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        First Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        placeholder="Enter first name"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                          regErrors.firstName ? 'border border-rose-500' : ''
                        }`}
                      />
                      {regErrors.firstName && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Last Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        placeholder="Enter last name"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                          regErrors.lastName ? 'border border-rose-500' : ''
                        }`}
                      />
                      {regErrors.lastName && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Work Email & Phone Number in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Work Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="name@company.ae"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                          regErrors.email ? 'border border-rose-500' : ''
                        }`}
                      />
                      {regErrors.email && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-2.5 rounded-lg bg-white/85 border border-white/20 text-slate-800 text-xs font-bold shrink-0 shadow-sm">
                          +971
                        </span>
                        <input
                          type="tel"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          placeholder="50 123 4567"
                          className={`w-full min-w-0 px-3 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                            regErrors.phone ? 'border border-rose-500' : ''
                          }`}
                        />
                      </div>
                      {regErrors.phone && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Password & Confirm Password in 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          placeholder="Enter password"
                          className={`w-full pl-3 pr-8 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                            regErrors.password ? 'border border-rose-500' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {regErrors.password && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Confirm password"
                        className={`w-full px-3 py-2.5 rounded-lg bg-white/85 text-black placeholder-slate-500 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm ${
                          regErrors.confirmPassword ? 'border border-rose-500' : ''
                        }`}
                      />
                      {regErrors.confirmPassword && (
                        <p className="text-[10px] text-rose-400 mt-0.5">{regErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Send OTP CTA Button with generous gap */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.5),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.65)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none group"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <ArrowRight className="w-4 h-4 text-white/90 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider: or */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#14324F]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 text-slate-400 font-medium bg-[#071B2F] rounded-full">
                      or
                    </span>
                  </div>
                </div>

                {/* Azure AD SSO Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleSignIn('FACILITY_OPERATOR')}
                    className="w-11 h-11 p-2 rounded-2xl bg-[#00B2FE] hover:bg-[#009CEB] text-white shadow-lg shadow-[#00B2FE]/35 hover:scale-105 transition-all flex items-center justify-center cursor-pointer active:scale-95"
                    title="Register with Azure Active Directory (Azure AD)"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="50" y1="21" x2="21" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="79" y2="50" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="50" y1="21" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="21" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <line x1="79" y1="50" x2="50" y2="79" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                      <circle cx="50" cy="21" r="10.5" fill="currentColor" />
                      <circle cx="21" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="79" cy="50" r="10.5" fill="currentColor" />
                      <circle cx="50" cy="79" r="10.5" fill="currentColor" />
                    </svg>
                  </button>
                </div>

                {/* Already have an account? Sign in */}
                <div className="mt-4 text-center text-xs">
                  <span className="text-slate-300">Already have an account?</span>{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-[#00B2FE] hover:text-cyan-300 font-bold underline cursor-pointer transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 3: REGISTRATION - STEP 2: CONFIRM OTP */}
            {/* ============================================================= */}
            {authMode === 'register_otp' && (
              <div className="animate-in fade-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Confirm OTP
                  </h2>
                  <p className="text-xs text-slate-300/80 mt-1.5 font-normal leading-relaxed max-w-xs mx-auto">
                    We sent a 6-digit verification code to <span className="font-semibold text-white">{regForm.email || 'your email'}</span>
                  </p>
                </div>

                <form onSubmit={handleConfirmOtp} className="space-y-4">
                  {/* 6-Digit OTP Boxes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 text-center mb-2.5">
                      Enter 6-Digit Code
                    </label>
                    <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="w-[42px] h-[42px] min-w-[42px] min-h-[42px] text-center text-base font-bold font-mono rounded-xl bg-white/85 text-black border-2 border-transparent focus:border-[#00B2FE] focus:bg-white focus:ring-2 focus:ring-[#00B2FE]/40 focus:outline-none transition-all shadow-md p-0"
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-rose-400 text-center font-medium mt-2">{otpError}</p>
                    )}
                  </div>

                  {/* Resend & Demo Helper Row */}
                  <div className="flex items-center justify-between text-xs pt-1 px-1">
                    <button
                      type="button"
                      onClick={handleQuickFillOtp}
                      className="text-[11px] text-cyan-300 hover:text-cyan-200 underline cursor-pointer"
                      title="Auto-fill sample OTP code"
                    >
                      Quick Fill (123456)
                    </button>

                    <div>
                      {canResendOtp ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-[#00B2FE] hover:text-cyan-300 font-bold underline flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resend Code</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">
                          Resend in <span className="font-bold text-slate-200">{otpCountdown}s</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Secondary [Back] + Primary [Confirm OTP] */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('register_details')}
                      className="w-full py-3.5 px-4 text-xs sm:text-sm font-semibold text-slate-200 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isOtpVerifying}
                      className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.5),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.65)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer select-none group"
                    >
                      {isOtpVerifying ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Confirm OTP</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================= */}
            {/* VIEW 4: REGISTRATION SUCCESS */}
            {/* ============================================================= */}
            {authMode === 'register_success' && (
              <div className="text-center py-2 animate-in zoom-in-95 duration-200">
                {/* Success Icon */}
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Successfully Registered!
                </h2>

                <p className="text-xs text-slate-300/90 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                  Welcome, <span className="font-bold text-white">{regForm.firstName || 'Ahmed'} {regForm.lastName || 'Al Zaabi'}</span>. Your data provider account has been created and verified.
                </p>

                {/* Account Summary Chip */}
                <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/15 text-left text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account:</span>
                    <span className="font-semibold text-white truncate max-w-[180px]">{regForm.email || 'ahmed.zaabi@alnoor-energy.ae'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Role:</span>
                    <span className="font-semibold text-[#00B2FE]">Data Provider</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Proceed to Dashboard CTA Button */}
                <button
                  type="button"
                  onClick={() => handleSignIn('FACILITY_OPERATOR')}
                  className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#00875A] via-[#00A86B] to-[#10B981] border-t border-white/40 border-x border-white/10 border-b-2 border-[#005A3C] shadow-[0_8px_20px_-4px_rgba(0,135,90,0.5),inset_0_1px_1px_rgba(255,255,255,0.65)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,135,90,0.65)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-5 cursor-pointer select-none"
                >
                  <span>Proceed to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (regForm.email) setLoginEmail(regForm.email);
                      setAuthMode('login');
                    }}
                    className="text-xs text-slate-300 hover:text-white underline cursor-pointer transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
