import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Stethoscope, Leaf, CheckCircle, Eye, EyeOff, Sun, Moon, ArrowRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const steps = ['onboard_step1', 'onboard_step2', 'onboard_step3'];

const roles = [
  { key: 'onboard_cso', icon: Shield },
  { key: 'onboard_fm',  icon: Building2 },
  { key: 'onboard_com', icon: Stethoscope },
];

export default function OnboardPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', institution: '', address: '', facilityName: '', dept: 'Operations & Facilities' });

  const handleNext = async () => {
    setErrorMsg('');

    // Input Validation before moving to the next step
    if (currentStep === 0) {
      if (!form.fullName || !form.email || !form.password || !selectedRole) {
        setErrorMsg('Please fill in all personal details, including password and role.');
        return;
      }
    } else if (currentStep === 1) {
      if (!form.institution || !form.address) {
        setErrorMsg('Please fill in institution details.');
        return;
      }
    } else if (currentStep === 2) {
      if (!form.facilityName) {
        setErrorMsg('Please fill in facility details.');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            full_name: form.fullName,
            role: selectedRole,
            institution: form.institution,
            address: form.address,
            facility_name: form.facilityName,
            department: form.dept
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed');
        }

        // Store token and credentials in localStorage
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userEmail', form.email);
        localStorage.setItem('userFullName', form.fullName);
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userInstitution', form.institution);
        localStorage.setItem('userAddress', form.address);
        localStorage.setItem('userFacilityName', form.facilityName);

        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || 'Server connection failed');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#060D1F] transition-colors duration-300 relative overflow-hidden">
      
      {/* STYLE BLOCK FOR ANIMATED GRID / ECG */}
      <style>{`
        @keyframes ecg-flow-onboard {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-ecg-onboard {
          stroke-dasharray: 500;
          animation: ecg-flow-onboard 11s linear infinite;
        }
      `}</style>

      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-white dark:bg-[#060D1F] flex-col justify-between p-12 border-r border-gray-100 dark:border-navy-900 relative">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.05] dark:opacity-[0.02]">
          <svg className="absolute bottom-0 left-0 w-full h-[150px]" xmlns="http://www.w3.org/2000/svg">
            <path 
              className="animate-ecg-onboard"
              d="M 0 75 L 150 75 L 170 75 L 180 90 L 190 10 L 200 140 L 210 75 L 230 75 L 500 75" 
              fill="none" 
              stroke="#059669" 
              strokeWidth="2.5" 
            />
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => navigate('/')}>
            <Leaf size={22} className="text-emerald-500" />
            <span className="text-xl font-bold tracking-tight text-gradient">MedCarbon OS</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            {t('onboard_headline') || "Scale your clinical sustainability metrics."}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
            {t('onboard_desc') || "Start calculating emission volumes and run forecasting algorithms in seconds."}
          </p>
        </motion.div>

        {/* Global Standard Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start gap-3 relative z-10 p-4 rounded-xl bg-gray-50 dark:bg-navy-900/30 border border-gray-100 dark:border-navy-900"
        >
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle size={14} className="text-emerald-500 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase mb-0.5">
              {t('onboard_badge') || "GHG Protocol Standard"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('onboard_badge_desc') || "Pre-configured Scope 1 and Scope 2 calculation profiles."}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[90px]" />
          <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[90px]" />
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button onClick={toggleLanguage} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-navy-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors">
            {language === 'en' ? <><span>🇮🇳</span> हिं</> : <><span>🇬🇧</span> EN</>}
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-lg border border-gray-200 dark:border-navy-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        <div className="w-full max-w-md relative z-10">
          
          {/* Progress Steps Indicators */}
          <div className="flex items-center gap-0 mb-10">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`h-1.5 w-[90%] rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-emerald-500 shadow-sm shadow-emerald-500/35' : 'bg-gray-200 dark:bg-navy-900'}`} />
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${idx === currentStep ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-600'}`}>
                    {t(step) || `Step ${idx + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200/50 dark:border-red-900/30"
            >
              ⚠️ {errorMsg}
            </motion.div>
          )}

          {/* Form Step Contents with Slide Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Step 1: Personal Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                      {t('onboard_title') || "Create Administrator Account"}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {t('onboard_subtitle') || "Enter your personal credentials to manage the platform."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('onboard_fullname') || "Full Name"}</label>
                      <input
                        id="fullname-input"
                        type="text"
                        placeholder={t('onboard_fullname_ph') || "Dr. Sarah Connor"}
                        value={form.fullName}
                        onChange={e => setForm({...form, fullName: e.target.value})}
                        className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('onboard_email') || "Work Email"}</label>
                      <input
                        id="work-email-input"
                        type="email"
                        placeholder={t('onboard_email_ph') || "sarah.connor@metrohealth.org"}
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('onboard_password') || "Password"}</label>
                      <div className="relative">
                        <input
                          id="onboard-password-input"
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('onboard_password_ph') || "••••••••"}
                          value={form.password}
                          onChange={e => setForm({...form, password: e.target.value})}
                          className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 pr-12 transition-all duration-300 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('onboard_role') || "Institutional Role"}</label>
                      <div className="grid grid-cols-3 gap-3">
                        {roles.map(({ key, icon: Icon }) => (
                          <motion.button
                            key={key}
                            id={`role-${key}`}
                            type="button"
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSelectedRole(key)}
                            className={`flex flex-col items-center gap-2 py-4.5 px-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                              selectedRole === key
                                ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/5'
                                : 'border-gray-200 dark:border-navy-800 text-gray-400 dark:text-gray-500 hover:border-emerald-300 dark:hover:border-navy-700 hover:text-emerald-500'
                            }`}
                          >
                            <Icon size={20} />
                            <span>{t(key) || key.replace('onboard_', '')}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Institution Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Institution Details</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Provide your healthcare organization details.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Institution Name</label>
                      <input id="institution-name" type="text" placeholder="Metro Health System" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Headquarters Address</label>
                      <input id="institution-address" type="text" placeholder="123 Medical Center Blvd, City, State" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Institution Size</label>
                      <select id="institution-size" className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm">
                        <option>Small (&lt; 100 beds)</option>
                        <option>Medium (100–500 beds)</option>
                        <option>Large (500–1000 beds)</option>
                        <option>Enterprise (&gt; 1000 beds)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Facility Setup */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Facility Setup</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Configure your primary facility for carbon tracking.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Primary Facility Name</label>
                      <input id="facility-name" type="text" placeholder="Main Campus — Building A" value={form.facilityName} onChange={e => setForm({...form, facilityName: e.target.value})} className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Primary Department</label>
                      <select id="facility-dept" className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm" value={form.dept} onChange={e => setForm({...form, dept: e.target.value})}>
                        <option>Operations & Facilities</option>
                        <option>Clinical Services</option>
                        <option>Procurement & Supply Chain</option>
                        <option>Executive Management</option>
                      </select>
                    </div>

                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm"
                    >
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">🎉 You're ready to start monitoring carbon emissions!</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-500/80 mt-1.5 leading-relaxed font-medium">Your dashboard will be pre-loaded with baseline telemetry patterns from your selected facility type.</p>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Interactive Navigation Control Buttons */}
          <div className="mt-8 space-y-3">
            <motion.button
              id="next-step-btn"
              onClick={handleNext}
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm border-0 cursor-pointer animate-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : currentStep < steps.length - 1 ? (
                <>
                  {t('onboard_next') || "Continue"} <ArrowRight size={16} />
                </>
              ) : (
                'Launch Dashboard →'
              )}
            </motion.button>

            {/* Back Navigation Button */}
            {currentStep > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentStep(s => s - 1)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-navy-800 bg-white dark:bg-[#060D1F] text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors shadow-sm cursor-pointer border-solid"
              >
                <ChevronLeft size={16} /> Back
              </motion.button>
            )}
          </div>

          <div className="flex flex-col items-center mt-8 space-y-4">
            <p className="text-xs text-gray-400 tracking-wider text-center">{t('onboard_footer')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Login here
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
