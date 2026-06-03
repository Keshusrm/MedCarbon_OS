import { useState, useEffect, useRef } from 'react';
import { Flame, Zap, Truck, Target, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Mock forecast data — replaced by real API when available
function generateForecast(hours = 48) {
  const data = [];
  for (let i = 0; i < hours; i++) {
    const hour = i % 24;
    // Realistic hospital emission pattern
    const base = 8 + Math.sin((hour - 6) * Math.PI / 12) * 4;
    const noise = (Math.random() - 0.5) * 1.5;
    data.push({
      hour: `${String(i % 24).padStart(2,'0')}:00`,
      emissions: Math.max(4, parseFloat((base + noise).toFixed(2))),
      label: i === 14 ? 'Peak' : null,
    });
  }
  return data;
}

function CircularProgress({ percent, size = 100 }) {
  const radius = (size - 12) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" className="dark:stroke-navy-700" />
      <circle
        cx={size/2} cy={size/2} r={radius} fill="none"
        stroke="#00BFA5" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-1000"
      />
    </svg>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800 dark:bg-navy-700 border border-navy-600 rounded-lg px-3 py-2 text-xs text-white shadow-xl">
        <p className="font-semibold text-teal-400">{label}</p>
        <p className="text-gray-300">Emissions: <span className="text-white font-bold">{payload[0].value} tCO2e</span></p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [forecastRange, setForecastRange] = useState('48H');
  const [forecastData, setForecastData] = useState([]);
  const [scopes, setScopes] = useState({
    scope1_gas: 42.4, scope1_process: 12.1,
    scope2_electricity: 128.9, scope2_hvac: 48.2,
    scope3_pharma: 88.5, scope3_waste: 22.3,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setForecastData(generateForecast(forecastRange === '48H' ? 48 : 24));
    setTimeout(() => setAnimated(true), 200);

    // Try to load real API data
    fetch(`${API_BASE}/api/emissions/scopes`)
      .then(r => r.json())
      .then(d => setScopes(s => ({ ...s, ...d })))
      .catch(() => {});
    fetch(`${API_BASE}/api/forecast/48h`)
      .then(r => r.json())
      .then(d => { if (d.data?.length) setForecastData(d.data); })
      .catch(() => {});
  }, [forecastRange]);

  const hours = forecastRange === '48H' ? 48 : 24;
  const displayData = forecastData.slice(0, hours);
  const peakIdx = displayData.reduce((best, d, i) => d.emissions > (displayData[best]?.emissions || 0) ? i : best, 0);

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in">
        {/* Hero Banner */}
        <div className="hero-gradient rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute right-8 top-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute right-20 bottom-4 w-32 h-32 rounded-full bg-teal-400/10 blur-xl" />
          <h1 className="text-white text-2xl font-bold leading-tight max-w-2xl mb-4 relative z-10">
            {t('dash_hero_title')}
          </h1>
          <div className="flex flex-wrap gap-2 relative z-10">
            {[t('dash_badge1'), t('dash_badge2'), t('dash_badge3')].map(badge => (
              <span key={badge} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <CheckCircle size={12} /> {badge}
              </span>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Scope 1 */}
          <div className={`card p-5 transition-all duration-700 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('dash_scope1_label')}</span>
              <Flame size={16} className="text-orange-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dash_gas_facility')}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">42.4 <span className="text-sm font-normal text-gray-500">tCO2e</span></span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-navy-700" />
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('dash_process_gas')}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">12.1 tCO2e</span>
              </div>
            </div>
          </div>

          {/* Scope 2 */}
          <div className={`card p-5 transition-all duration-700 delay-100 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('dash_scope2_label')}</span>
              <Zap size={16} className="text-yellow-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dash_electricity')}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">128.9 <span className="text-sm font-normal text-gray-500">tCO2e</span></span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-navy-700" />
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('dash_hvac')}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">48.2 tCO2e</span>
              </div>
            </div>
          </div>

          {/* Scope 3 */}
          <div className={`card p-5 transition-all duration-700 delay-200 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('dash_scope3_label')}</span>
              <Truck size={16} className="text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('dash_pharma')}</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">88.5 <span className="text-sm font-normal text-gray-500">tCO2e</span></span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-navy-700" />
              <div className="flex justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('dash_medical_waste')}</span>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">22.3 tCO2e</span>
              </div>
            </div>
          </div>

          {/* SBTi Card */}
          <div className={`card p-5 transition-all duration-700 delay-300 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('dash_sbti_label')}</span>
              <Target size={16} className="text-teal-400" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <CircularProgress percent={75} size={88} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-gray-900 dark:text-white">75%</span>
                </div>
              </div>
              <span className="text-sm font-bold text-teal-500 tracking-wider">{t('dash_sbti_track')}</span>
              <span className="text-xs text-gray-400">{t('dash_sbti_horizon')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-5 gap-5">
          {/* Forecast Chart */}
          <div className="col-span-3 card p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('dash_forecast_title')}</h2>
                <p className="text-xs text-gray-400 mt-0.5 max-w-xs">{t('dash_forecast_desc')}</p>
              </div>
              <div className="flex gap-1 bg-gray-100 dark:bg-navy-700 rounded-lg p-0.5">
                {['24H','48H'].map(r => (
                  <button
                    key={r}
                    id={`forecast-${r}`}
                    onClick={() => setForecastRange(r)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
                      forecastRange === r
                        ? 'bg-teal-400 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00BFA5" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-navy-700" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={forecastRange === '24H' ? 3 : 7} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  {peakIdx > 0 && (
                    <ReferenceLine
                      x={displayData[peakIdx]?.hour}
                      stroke="#F59E0B"
                      strokeDasharray="4 4"
                      label={{ value: `Peak: ${displayData[peakIdx]?.emissions} tCO2e`, position: 'top', fontSize: 10, fill: '#F59E0B' }}
                    />
                  )}
                  <Area type="monotone" dataKey="emissions" stroke="#00BFA5" strokeWidth={2} fill="url(#emissionsGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ML Validation Table */}
          <div className="col-span-2 card p-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">{t('dash_ml_title')}</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-navy-700">
                  <th className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 pb-2 tracking-wider">{t('dash_ml_model')}</th>
                  <th className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 pb-2 tracking-wider">{t('dash_ml_confidence')}</th>
                  <th className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 pb-2 tracking-wider">{t('dash_ml_task')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { model: t('dash_ml_rf'),   conf: '94.2%', task: t('dash_ml_rf_task')   },
                  { model: t('dash_ml_lstm'), conf: '89.5%', task: t('dash_ml_lstm_task') },
                  { model: t('dash_ml_xgb'),  conf: '91.8%', task: t('dash_ml_xgb_task')  },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-navy-800 last:border-0">
                    <td className="py-3 text-gray-800 dark:text-gray-200 font-medium text-xs">{row.model}</td>
                    <td className="py-3 text-teal-600 dark:text-teal-400 font-bold text-sm">{row.conf}</td>
                    <td className="py-3 text-gray-500 dark:text-gray-400 text-xs">{row.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Ensemble Banner */}
            <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800 flex items-start gap-2">
              <Sparkles size={14} className="text-teal-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-teal-700 dark:text-teal-400">{t('dash_ml_ensemble')}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
