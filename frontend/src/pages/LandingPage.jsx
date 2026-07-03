import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Leaf, 
  Activity, 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  ChevronRight, 
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Database
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const targetRef = useRef(null);
  
  // Hook into page scroll for background parallax animations
  const { scrollYProgress } = useScroll();
  
  // Transform values for floating ecological & medical particles
  const yLeaf1 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const yLeaf2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yCross1 = useTransform(scrollYProgress, [0, 1], [0, -280]);
  const yCross2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rot1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rot2 = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scale1 = useTransform(scrollYProgress, [0, 1], [0.9, 1.25]);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-[#060D1F] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* ── PARALLAX BACKGROUND PARTICLES ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Floating Mint Leaf (Right Top) */}
        <motion.div 
          style={{ y: yLeaf1, rotate: rot1, scale: scale1 }}
          className="absolute top-36 right-[10%] text-emerald-400/10 dark:text-emerald-500/15"
        >
          <Leaf size={180} />
        </motion.div>

        {/* Floating Medical Cross / Heartbeat (Left Middle) */}
        <motion.div 
          style={{ y: yCross1, rotate: rot2 }}
          className="absolute top-[40%] left-[8%] text-teal-400/10 dark:text-teal-400/10"
        >
          <Activity size={140} />
        </motion.div>

        {/* Floating Small Leaf (Left Bottom) */}
        <motion.div 
          style={{ y: yLeaf2, rotate: rot1 }}
          className="absolute bottom-[20%] left-[12%] text-emerald-400/5 dark:text-emerald-500/10"
        >
          <Leaf size={90} />
        </motion.div>

        {/* Floating Small Cross (Right Bottom) */}
        <motion.div 
          style={{ y: yCross2, rotate: rot2 }}
          className="absolute bottom-[10%] right-[15%] text-teal-400/10 dark:text-teal-500/10"
        >
          <Activity size={80} />
        </motion.div>

        {/* Top-Right Glowing Orb */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/5 dark:bg-teal-500/5 blur-[120px]" />
        
        {/* Left-Middle Glowing Orb */}
        <div className="absolute top-[35%] left-[-15%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[100px]" />
      </div>

      {/* ── STICKY GLASSMORPHIC HEADER ────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-navy-900/50 bg-white/70 dark:bg-[#060D1F]/70 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf size={24} className="text-emerald-500" />
            <span className="text-xl font-bold tracking-tight text-gradient">MedCarbon OS</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-navy-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-900 transition-colors"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {isLoggedIn ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex items-center gap-1 text-sm py-2 px-4 shadow-md bg-gradient-to-r from-emerald-600 to-teal-700 border-0"
              >
                Go to Dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="btn-primary flex items-center gap-1 text-sm py-2 px-4 shadow-md bg-gradient-to-r from-emerald-600 to-teal-700 border-0"
              >
                Enter App <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          {/* Eco Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={12} className="animate-pulse" /> Decarbonizing Healthcare with AI
          </motion.div>

          {/* Main Title */}
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            The Green Hospital <br />
            <span className="text-gradient">Operating System</span>
          </motion.h1>

          {/* Description */}
          <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            MedCarbon OS empowers medical facilities to audit sub-system utility telemetry, calculate Scope 1 & 2 carbon footprints in real-time, and forecast emissions 48 hours into the future using neural networks.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-0"
              >
                Go to Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-0"
                >
                  Login to Platform <ChevronRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/onboard')}
                  className="btn-secondary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 border border-gray-300 dark:border-navy-800"
                >
                  Register Facility
                </button>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Floating Telemetry Screen Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-5xl mt-16 p-4 rounded-2xl border border-gray-200/60 dark:border-navy-900 bg-white/50 dark:bg-navy-950/40 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 px-3 pb-3 border-b border-gray-200/50 dark:border-navy-900/50 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase ml-2 select-none">Live Telemetry Dials & ML Validation console</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="p-5 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-gray-100 dark:border-navy-800/80 shadow-sm flex flex-col items-center">
              <Activity size={32} className="text-teal-500 mb-3" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scope 1 Direct</h3>
              <p className="text-2xl font-black text-gradient">0.2747 tCO2e</p>
              <p className="text-[10px] text-gray-400 mt-2 font-mono">1,360 kWh Boiler consumption</p>
            </div>
            <div className="p-5 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-gray-100 dark:border-navy-800/80 shadow-sm flex flex-col items-center">
              <Leaf size={32} className="text-emerald-500 mb-3" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Carbon Index</h3>
              <p className="text-2xl font-black text-gradient">Optimal</p>
              <p className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1 font-semibold"><span className="live-dot" /> Telemetry Live</p>
            </div>
            <div className="p-5 rounded-xl bg-white/70 dark:bg-navy-900/60 border border-gray-100 dark:border-navy-800/80 shadow-sm flex flex-col items-center">
              <TrendingUp size={32} className="text-blue-500 mb-3" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scope 2 Indirect</h3>
              <p className="text-2xl font-black text-gradient">0.7180 tCO2e</p>
              <p className="text-[10px] text-gray-400 mt-2 font-mono">1,860 kWh Grid baseline</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CORE PROBLEM & SOLUTION SECTION ───────────────────────────────── */}
      <section className="relative z-10 py-24 bg-white/50 dark:bg-navy-950/20 border-y border-gray-200/50 dark:border-navy-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <h2 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-widest">The Ecological Imperative</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
              The Healthcare Sector's Hidden Climate Cost
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Medical facilities operate 24/7, consuming massive volumes of electricity and natural gas to power cleanrooms, chillers, and hospital ventilation. Globally, the healthcare sector is responsible for nearly **5% of net global greenhouse gas emissions**.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 mt-1">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">HVAC Inefficiencies</h4>
                  <p className="text-xs text-gray-400">Heating, ventilation, and air conditioning account for up to 60% of hospital energy waste.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 mt-1">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Ephemeral Audits</h4>
                  <p className="text-xs text-gray-400">Traditional utility tracking relies on monthly spreadsheets, missing real-time spikes.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative lg:ml-12"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl blur-2xl pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80" 
              alt="Medical Telemetry Screen"
              className="relative z-10 w-full rounded-2xl border border-gray-200/80 dark:border-navy-800 shadow-xl object-cover h-[350px]"
            />
          </motion.div>

        </div>
      </section>

      {/* ── MACHINE LEARNING PREDICTIVE CARDS ───────────────────────────────── */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Algorithmic Decarbonization</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Core Prediction & Forecast Engines</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            MedCarbon OS utilizes a three-tier machine learning pipeline to validate telemetry, score system configurations, and forecast future emissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Random Forest */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 rounded-2xl border border-gray-200/60 dark:border-navy-900 bg-white/40 dark:bg-navy-950/40 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <Cpu size={24} />
              </div>
              <h4 className="text-lg font-bold mb-3">Random Forest Regressor</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Generates instant footprint predictions by evaluating complex relationships between 10 electrical/gas subsystem parameters. Built with Scikit-Learn.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-navy-900/50 pt-4">
              <span className="text-xs text-gray-400 font-mono">Accuracy (R²)</span>
              <span className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">0.9998</span>
            </div>
          </motion.div>

          {/* Card 2: XGBoost */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 rounded-2xl border border-gray-200/60 dark:border-navy-900 bg-white/40 dark:bg-navy-950/40 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <Compass size={24} />
              </div>
              <h4 className="text-lg font-bold mb-3">XGBoost Regressor</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Provides extreme gradient boosting calculations to understand feature importances and determine which subsystems are leaking the most energy.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-navy-900/50 pt-4">
              <span className="text-xs text-gray-400 font-mono">Accuracy (R²)</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.9997</span>
            </div>
          </motion.div>

          {/* Card 3: LSTM */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="p-8 rounded-2xl border border-gray-200/60 dark:border-navy-900 bg-white/40 dark:bg-navy-950/40 backdrop-blur-md flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-lg font-bold mb-3">LSTM Neural Network</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                A 2-layer Long Short-Term Memory network in PyTorch designed for sequence processing. Forecasts emission curves 48 hours into the future.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200/50 dark:border-navy-900/50 pt-4">
              <span className="text-xs text-gray-400 font-mono">Accuracy (R²)</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">0.9885</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── CALL TO ACTION & FOOTER ───────────────────────────────────────── */}
      <section className="relative z-10 py-32 bg-gradient-to-b from-gray-50/0 via-teal-950/10 to-emerald-950/20 dark:from-[#060D1F]/0 dark:via-[#041c2c]/30 dark:to-[#052b2b]/40 border-t border-gray-200/50 dark:border-navy-900/50 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 space-y-8"
        >
          <Leaf size={48} className="text-emerald-500 mx-auto animate-bounce" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Decarbonize Your Facility?
          </h2>
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Register your institution, configure your subsystems, and deploy machine learning models in minutes to track and forecast your hospital emissions.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-0"
              >
                Enter Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border-0"
                >
                  Sign In to App <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => navigate('/onboard')}
                  className="btn-secondary w-full sm:w-auto px-8 py-3 text-base flex items-center justify-center gap-2 border border-gray-300 dark:border-navy-800"
                >
                  Register Facility
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Simple Footer */}
        <div className="max-w-7xl mx-auto px-6 mt-32 pt-8 border-t border-gray-200/20 dark:border-navy-900/30 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <span>&copy; 2026 MedCarbon OS. All rights reserved.</span>
          <span className="tracking-widest uppercase">Decarbonizing Hospital Infrastructure Globally</span>
        </div>
      </section>

    </div>
  );
}
