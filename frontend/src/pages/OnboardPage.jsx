import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Stethoscope, Leaf, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

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
  const [form, setForm] = useState({ fullName: '', email: '', institution: '', address: '', facilityName: '', dept: '' });

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-navy-950 transition-colors duration-300">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-white dark:bg-navy-950 flex-col justify-between p-12 border-r border-gray-100 dark:border-navy-800">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <Leaf size={22} className="text-teal-400" />
            <span className="text-lg font-bold text-cobalt-500">MedCarbon OS</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            {t('onboard_headline')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('onboard_desc')}
          </p>
        </div>

        {/* Global Standard Badge */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cobalt-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle size={14} className="text-cobalt-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-widest mb-0.5">{t('onboard_badge')}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('onboard_badge_desc')}</p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={toggleLanguage} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-navy-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
            {language === 'en' ? <><span>🇮🇳</span> हिं</> : <><span>🇬🇧</span> EN</>}
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-lg border border-gray-200 dark:border-navy-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        <div className="w-full max-w-md">
          {/* Progress Bar */}
          <div className="flex items-center gap-0 mb-10">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className={`h-1 w-full rounded-full transition-all duration-500 ${idx <= currentStep ? 'bg-cobalt-500' : 'bg-gray-200 dark:bg-navy-700'}`} />
                  <span className={`text-xs font-bold tracking-wider ${idx === currentStep ? 'text-cobalt-500' : 'text-gray-400'}`}>
                    {t(step)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {currentStep === 0 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t('onboard_title')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">{t('onboard_subtitle')}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('onboard_fullname')}</label>
                  <input
                    id="fullname-input"
                    type="text"
                    placeholder={t('onboard_fullname_ph')}
                    value={form.fullName}
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('onboard_email')}</label>
                  <input
                    id="work-email-input"
                    type="email"
                    placeholder={t('onboard_email_ph')}
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('onboard_role')}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map(({ key, icon: Icon }) => (
                      <button
                        key={key}
                        id={`role-${key}`}
                        onClick={() => setSelectedRole(key)}
                        className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 text-xs font-bold tracking-wider transition-all duration-200 ${
                          selectedRole === key
                            ? 'border-cobalt-500 bg-cobalt-50 dark:bg-cobalt-900/20 text-cobalt-600 dark:text-cobalt-400'
                            : 'border-gray-200 dark:border-navy-600 text-gray-500 dark:text-gray-400 hover:border-cobalt-300 hover:text-cobalt-500'
                        }`}
                      >
                        <Icon size={20} />
                        {t(key)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Institution Details</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">Provide your healthcare institution information.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Institution Name</label>
                  <input id="institution-name" type="text" placeholder="Metro Health System" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Headquarters Address</label>
                  <input id="institution-address" type="text" placeholder="123 Medical Center Blvd, City, State" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Institution Size</label>
                  <select id="institution-size" className="input-field">
                    <option>Small (&lt; 100 beds)</option>
                    <option>Medium (100–500 beds)</option>
                    <option>Large (500–1000 beds)</option>
                    <option>Enterprise (&gt; 1000 beds)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Facility Setup</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-7">Configure your primary facility for carbon tracking.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Facility Name</label>
                  <input id="facility-name" type="text" placeholder="Main Campus — Building A" value={form.facilityName} onChange={e => setForm({...form, facilityName: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Primary Department</label>
                  <select id="facility-dept" className="input-field">
                    <option>Operations & Facilities</option>
                    <option>Clinical Services</option>
                    <option>Procurement & Supply Chain</option>
                    <option>Executive Management</option>
                  </select>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                  <p className="text-sm text-teal-700 dark:text-teal-400 font-medium">🎉 You're ready to start monitoring carbon emissions!</p>
                  <p className="text-xs text-teal-600 dark:text-teal-500 mt-1">Your dashboard will be pre-loaded with baseline data from your facility type.</p>
                </div>
              </div>
            </div>
          )}

          <button
            id="next-step-btn"
            onClick={handleNext}
            className="btn-primary w-full mt-8 py-3 text-sm tracking-wider"
          >
            {currentStep < steps.length - 1 ? t('onboard_next') : 'Launch Dashboard →'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6 tracking-wider">{t('onboard_footer')}</p>
        </div>
      </div>
    </div>
  );
}
