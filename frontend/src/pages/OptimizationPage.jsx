import { useState } from 'react';
import { Filter, Zap, Plus, Download, Building2, Leaf } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';

const recommendations = [
  {
    id: 'opt-1',
    category: 'CLINICAL OPS',
    priority: 'High Priority',
    priorityColor: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    title: 'Reschedule Elective Surgeries',
    desc: 'Cluster energy-intensive procedures during peak renewable energy generation windows (10AM – 3PM).',
    savings: 12.4,
    roi: '$4,200',
    difficulty: 3,
  },
  {
    id: 'opt-2',
    category: 'INFRASTRUCTURE',
    priority: 'Automation Ready',
    priorityColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    title: 'HVAC Dynamic Setback',
    desc: 'Adjust thermostat settings in non-patient zones based on real-time occupancy and external weather data.',
    savings: 8.2,
    roi: '$2,850',
    difficulty: 2,
  },
  {
    id: 'opt-3',
    category: 'ENERGY',
    priority: 'Quick Win',
    priorityColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    title: 'Lighting Optimization',
    desc: 'Upgrade and integrate intelligent motion-sensing LED controls in administrative wings and parking structures.',
    savings: 5.7,
    roi: '$1,400',
    difficulty: 2,
  },
  {
    id: 'opt-4',
    category: 'PROCUREMENT',
    priority: 'High Impact',
    priorityColor: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    title: 'Low-Carbon Vendor Switch',
    desc: 'Transition medical laundry services to a localized, zero-emissions logistics partner to reduce Scope 3 footprint.',
    savings: 22.1,
    roi: '−$500',
    difficulty: 3,
  },
  {
    id: 'opt-5',
    category: 'CLINICAL',
    priority: 'Specialist Required',
    priorityColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
    title: 'Desflurane Elimination',
    desc: 'Phase out high-GWP desflurane in favor of sevoflurane or total intravenous anesthesia (TIVA) alternatives.',
    savings: 45.0,
    roi: '$1,200',
    difficulty: 1,
  },
];

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-1">
      {[1,2,3].map(i => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${i <= level ? 'bg-cobalt-500' : 'bg-gray-200 dark:bg-navy-700'}`}
        />
      ))}
    </div>
  );
}

function OptimizationCard({ rec, t, onExecute }) {
  const [executed, setExecuted] = useState(false);

  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-cobalt-500 dark:text-cobalt-400 tracking-wider">{rec.category}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rec.priorityColor}`}>
          {rec.priority}
        </span>
      </div>

      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{rec.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">{rec.desc}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('opt_savings')}</span>
          <span className="text-sm font-black text-teal-600 dark:text-teal-400">{rec.savings} <span className="text-xs text-gray-400">tCO2e</span></span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('opt_roi')}</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{rec.roi}<span className="text-xs text-gray-400">/mo</span></span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{t('opt_impl')}</span>
          <DifficultyDots level={rec.difficulty} />
        </div>
      </div>

      <button
        id={`execute-${rec.id}`}
        onClick={() => { setExecuted(true); onExecute?.(rec); }}
        className={`w-full py-2.5 rounded-lg text-sm font-semibold border transition-all duration-300 ${
          executed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-cobalt-300 dark:border-cobalt-700 text-cobalt-600 dark:text-cobalt-400 hover:bg-cobalt-500 hover:text-white'
        }`}
      >
        {executed ? '✓ Action Queued' : t('opt_execute')}
      </button>
    </div>
  );
}

export default function OptimizationPage() {
  const { t } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-cobalt-500 dark:text-cobalt-400 tracking-widest mb-1">{t('opt_engine')}</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('opt_title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl">{t('opt_subtitle')}</p>
          </div>
          <div className="flex gap-3">
            <button id="filter-btn" className="btn-secondary flex items-center gap-2 py-2.5">
              <Filter size={14} /> {t('opt_filter')}
            </button>
            <button id="auto-optimize-btn" className="btn-primary flex items-center gap-2 py-2.5">
              <Zap size={14} /> {t('opt_auto')}
            </button>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-3 gap-5">
          {recommendations.map(rec => (
            <OptimizationCard key={rec.id} rec={rec} t={t} />
          ))}

          {/* Custom Analysis Card */}
          <div className="card p-5 border-2 border-dashed border-gray-200 dark:border-navy-600 flex flex-col items-center justify-center text-center gap-3 hover:border-cobalt-300 dark:hover:border-cobalt-700 cursor-pointer transition-colors group">
            <div className="w-12 h-12 rounded-full border-2 border-cobalt-300 dark:border-cobalt-700 flex items-center justify-center group-hover:border-cobalt-500 transition-colors">
              <Plus size={20} className="text-cobalt-400 group-hover:text-cobalt-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('opt_custom_title')}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{t('opt_custom_desc')}</p>
            </div>
          </div>
        </div>

        {/* Predicted Impact Portfolio */}
        <div className="card p-6">
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('opt_impact_title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                {t('opt_impact_desc')} <span className="font-bold text-teal-600 dark:text-teal-400">93.4 tCO2e</span> {t('opt_impact_desc2')} <span className="font-bold text-cobalt-500">$10,000</span> {t('opt_impact_desc3')}
              </p>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: t('opt_carbon_offset'), value: '~12%',   color: 'teal' },
                  { label: t('opt_energy_offset'),  value: '180 MWh', color: 'blue' },
                  { label: t('opt_payback'),         value: '4.2mo',   color: 'amber' },
                  { label: t('opt_compliance_score'),value: '+15pts',  color: 'emerald' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-1">{label}</p>
                    <p className={`text-2xl font-black text-${color}-600 dark:text-${color}-400`}>{value}</p>
                  </div>
                ))}
              </div>

              <button
                id="download-strategy-btn"
                className="mt-6 flex items-center gap-2 btn-secondary py-2.5 text-sm"
              >
                <Download size={14} /> {t('opt_download')}
              </button>
            </div>

            {/* Hospital Image */}
            <div className="w-56 h-44 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80"
                alt="Hospital with solar panels"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
