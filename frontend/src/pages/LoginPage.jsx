import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Leaf, Sun, Moon, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';


export default function LoginPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', email);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#060D1F] transition-colors duration-300 relative overflow-hidden">
      
      {/* STYLE BLOCK FOR ECG & DRIFT ANIMATIONS */}
      <style>{`
        @keyframes ecg-flow-login {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-ecg-login {
          stroke-dasharray: 500;
          animation: ecg-flow-login 10s linear infinite;
        }
      `}</style>

      {/* Left Hero Panel with Ken Burns Slow Zoom */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/60 to-[#060D1F]/90 z-10" />
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 16, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=80"
          alt="Sustainable Hospital"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Badge */}
        <div className="absolute top-8 left-8 z-20">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-lg"
          >
            {t('login_report_label') || "SUSTAINABILITY REPORT 2026"}
          </motion.span>
        </div>

        {/* Quote Content with Slide Up */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 flex flex-col justify-center px-12 py-16 h-full"
        >
          <p className="text-white text-4xl font-extrabold leading-tight mb-6 max-w-lg">
            "{t('login_quote') || "The health of our patients is inextricably linked to the health of our planet."}"
          </p>
          <p className="text-emerald-400 font-medium text-sm tracking-wider uppercase">
            {t('login_quote_attr') || "Chief Sustainability Officer, Metro Health"}
          </p>
        </motion.div>

        {/* Bottom Footer */}
        <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center text-gray-400 text-xs">
          <span>{t('login_copyright') || "© 2026 MedCarbon OS"}</span>
          <span className="tracking-widest uppercase">{t('login_gov_tier') || "Institutional Governance Tier"}</span>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-white dark:bg-[#060D1F] relative">
        
        {/* Subtle Ambient Glow and ECG Background Line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-[80px]" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px]" />
          
          {/* ECG Wave flowing at the bottom */}
          <svg className="absolute bottom-0 right-0 w-full h-[150px] opacity-[0.04] dark:opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <path 
              className="animate-ecg-login"
              d="M 0 75 L 200 75 L 220 75 L 230 90 L 240 10 L 250 140 L 260 75 L 280 75 L 600 75 L 620 75 L 630 90 L 640 10 L 650 140 L 660 75 L 680 75 L 1200 75" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2" 
            />
          </svg>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-navy-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors"
          >
            {language === 'en' ? <><span>🇮🇳</span> हिं</> : <><span>🇬🇧</span> EN</>}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-navy-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        {/* Interactive Form Card Wrapper */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Logo with rotation animation */}
          <div className="flex items-center gap-2.5 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            >
              <Leaf size={26} className="text-emerald-500" />
            </motion.div>
            <span className="text-2xl font-black tracking-tight text-gradient">MedCarbon OS</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
            {t('login_tagline') || "Sign in to your institutional workspace."}
          </p>

          {errorMsg && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-200/50 dark:border-red-900/30 shadow-sm"
            >
              ⚠️ {errorMsg}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field with Focus Animation */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t('login_email_label') || "Institutional Email"}
              </label>
              <div className="relative group">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('login_email_placeholder') || "name@hospital.org"}
                  className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-navy-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                  required
                />
                <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {t('login_pass_label') || "Password"}
                </label>
                <button type="button" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                  {t('login_forgot') || "Forgot password?"}
                </button>
              </div>
              <div className="relative group">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-navy-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 shadow-sm"
                  required
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

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
              <input
                type="checkbox"
                id="remember-device"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-4.5 h-4.5 rounded-md border-gray-300 dark:border-navy-800 text-emerald-500 focus:ring-emerald-500 bg-white dark:bg-navy-900 cursor-pointer"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {t('login_remember') || "Remember this device for 30 days"}
              </span>
            </label>

            {/* Interactive Submit Button */}
            <motion.button
              id="signin-btn"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm border-0 cursor-pointer animate-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('login_btn') || "Sign In"} <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-navy-800" />
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{t('login_or') || "Or continue with"}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-navy-800" />
            </div>

            {/* Interactive OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                id="google-signin"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800/80 transition-colors shadow-sm cursor-pointer border-solid"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('login_google') || "Google"}
              </motion.button>
              
              <motion.button
                type="button"
                id="saml-signin"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800/80 transition-colors shadow-sm cursor-pointer border-solid"
              >
                <div className="w-4 h-4 bg-emerald-500 rounded flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">S</span>
                </div>
                {t('login_saml') || "SAML SSO"}
              </motion.button>
            </div>

            {/* Toggle Link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2 font-medium">
              {t('login_no_access') || "Need access?"}{' '}
              <button
                type="button"
                onClick={() => navigate('/onboard')}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                {t('login_signup') || "Sign up for an institutional account"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
