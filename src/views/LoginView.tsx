import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  FileCheck,
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Layers,
  Fingerprint,
  LogIn,
} from 'lucide-react';
import { useMRV } from '../context/MRVContext';
import { AmbientBackground } from '../components/ui/AmbientBackground';
import { UserRole } from '../types/mrv';
import eadLogo from '../assets/logo.svg';
import loginBg from '../assets/login-bg.png';
import loginRightRibbedBg from '../assets/login-right-ribbed-bg.png';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { setCurrentRole } = useMRV();
  const [email, setEmail] = useState('umasri.m@alnoor-energy.ae');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authMethod, setAuthMethod] = useState<'standard' | 'uaepass'>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (role: UserRole = 'FACILITY_OPERATOR') => {
    setIsLoading(true);
    setCurrentRole(role);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-[#06182B] text-white overflow-hidden select-none">
      {/* Dynamic Particle Canvas */}
      <AmbientBackground dark={true} />



      {/* LEFT SIDE: Visual Hero Area with Attached Background Image (58% width on desktop) */}
      <div
        className="relative lg:w-[58%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 z-10 bg-cover bg-center bg-no-repeat overflow-hidden"
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
              Verify with Precision.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 mt-5 leading-relaxed font-normal max-w-xl">
            A secure enterprise digital platform for facility-level GHG emissions monitoring, verified reporting submissions, third-party assurance audits, and regulatory compliance.
          </p>

          {/* 3 Feature Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
            {/* Card 1: Facility Registration */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              {/* Top Specular Edge Flare */}
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              {/* Bottom Ambient Glow */}
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

            {/* Card 2: Emissions & Plans */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              {/* Top Specular Edge Flare */}
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              {/* Bottom Ambient Glow */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-3 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">Emissions & Plans</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Structured Monitoring Plans & Tier 1/2/3 calculations
                </p>
              </div>
            </div>

            {/* Card 3: EAD Verification */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-b from-white/15 via-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_1px_0_rgba(255,255,255,0.3)] hover:border-[#00B2FE]/60 hover:bg-white/20 hover:shadow-[0_12px_36px_rgba(0,178,254,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1.5 group overflow-hidden">
              {/* Top Specular Edge Flare */}
              <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
              {/* Bottom Ambient Glow */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#00B2FE]/15 to-transparent pointer-events-none rounded-b-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="mb-3 text-[#00B2FE] drop-shadow-[0_2px_10px_rgba(0,178,254,0.5)] group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white tracking-wide">EAD Verification</h4>
                <p className="text-[11px] text-slate-300/90 mt-1 leading-snug font-normal">
                  Accredited third-party audits & 30-day review cycles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Floating Authentication Panel (42% width on desktop, aligned leftward) */}
      <div className="relative lg:w-[42%] flex items-center justify-center lg:justify-start lg:pl-10 p-6 sm:p-8 lg:p-10 z-20 bg-[#041221] overflow-hidden">
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

        <div className="w-full max-w-sm sm:max-w-md relative z-20 lg:-translate-x-6">
          {/* Glass Login Card with Rich Blue Gradient & Pulsating Bluish Inner Shadow Vignette */}
          <div
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0B4079] via-[#062954] to-[#031836] border-0 relative overflow-hidden animate-pulse-inner-shadow shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-300/80 mt-1 font-medium">
                Sign in to your Facility MRV Platform
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignIn('FACILITY_OPERATOR');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 rounded-xl bg-white text-black placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-white text-black placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00B2FE] transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-start text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#061626] border-[#163857] text-[#00B2FE] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-medium text-slate-300">Remember Me</span>
                </label>
              </div>

              {/* 3D Tactile CTA Button matching Application Linear Gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#004B87] via-[#006EAF] to-[#009CEB] border-t border-white/40 border-x border-white/10 border-b-2 border-[#002B52] shadow-[0_8px_20px_-4px_rgba(0,75,135,0.5),inset_0_1px_1px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.3)] hover:brightness-110 hover:shadow-[0_10px_24px_-4px_rgba(0,75,135,0.65),inset_0_1px_1px_rgba(255,255,255,0.75)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_3px_10px_rgba(0,75,135,0.4),inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all duration-200 flex items-center justify-center gap-2 mt-3 cursor-pointer select-none group"
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
            </form>

            {/* Divider: Login with */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#14324F]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-slate-400 font-medium bg-[#071B2F] rounded-full">
                  Login with
                </span>
              </div>
            </div>

            {/* Azure AD / UAE Pass SSO Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleSignIn('FACILITY_OPERATOR')}
                className="w-13 h-13 p-3 rounded-2xl bg-[#00B2FE] hover:bg-[#00C2FF] text-white shadow-lg shadow-[#00B2FE]/40 hover:scale-105 transition-transform flex items-center justify-center"
                title="Single Sign-On with Azure AD / UAE Pass"
              >
                {/* Azure AD Hub Connection Icon */}
                <svg
                  className="w-6 h-6 fill-current text-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="19" r="2" />
                  <line x1="7" y1="12" x2="8.5" y2="12" stroke="white" strokeWidth="1.5" />
                  <line x1="15.5" y1="12" x2="17" y2="12" stroke="white" strokeWidth="1.5" />
                  <line x1="12" y1="7" x2="12" y2="8.5" stroke="white" strokeWidth="1.5" />
                  <line x1="12" y1="15.5" x2="12" y2="17" stroke="white" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
