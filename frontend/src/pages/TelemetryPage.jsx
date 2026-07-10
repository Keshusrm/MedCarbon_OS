import { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Wifi, ExternalLink, Download } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { useLanguage } from '../context/LanguageContext';
import TelemetryDetailModal from '../components/TelemetryDetailModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const WS_BASE = API_BASE.replace('http', 'ws');

// Status badge component
function StatusBadge({ status }) {
  const map = {
    LIVE:       'badge-live',
    STANDBY:    'badge-standby',
    ANOMALY:    'badge-anomaly',
    STABLE:     'badge-stable',
    OPTIMAL:    'badge-optimal',
    ACTIVE:     'badge-active',
    MONITORING: 'badge-monitoring',
  };
  return <span className={map[status] || 'badge-stable'}>{status}</span>;
}

// Mini sparkline generator
function mkSparkline(base, count = 12, variance = 0.1) {
  return Array.from({ length: count }, (_, i) => ({
    v: parseFloat((base * (1 + (Math.random() - 0.5) * variance)).toFixed(2))
  }));
}

// Initial telemetry cards
const initialCards = [
  { id: 'GRID-INF-01', category: 'ELECTRICITY', status: 'LIVE',   name: 'Main Grid Inflow',       primary: 12.4,   unit: 'MWh',  secondary: '24h Peak: 14.1 MW', color: '#3B82F6', variance: '+0.02%', timestamp: '14:03:18 UTC', ref: 'Main Electrical Intake' },
  { id: 'AUX-GEN-02',  category: 'ELECTRICITY', status: 'STANDBY',name: 'Auxiliary Gen-Set',       primary: 0.02,   unit: 'kW',   secondary: 'Fuel Reserve: 94%', color: '#EAB308', variance: '+0.0%',  timestamp: '14:03:20 UTC', ref: 'Backup Generator' },
  { id: 'GAS-STM-B4',  category: 'NATURAL GAS', status: 'ANOMALY',name: 'Steam Plant B-4',         primary: 142,    unit: 'PSI',  secondary: 'Exceeds Normal Threshold', color: '#EF4444', variance: '+14.2%', timestamp: '14:21:45 UTC', ref: 'Steam Pressure (Lower)' },
  { id: 'WTR-POT-01',  category: 'WATER SYSTEMS',status: 'STABLE', name: 'Potable Inlet',           primary: 82.5,   unit: 'm³/h', secondary: 'Daily Total: 1,980㎥', color: '#60A5FA', variance: '+0.8%',  timestamp: '14:19:02 UTC', ref: 'Potable Water Feed' },
  { id: 'HVAC-CHL-A',  category: 'HVAC SYSTEMS',status: 'LIVE',   name: 'Chilled Loop A',          primary: 4.2,    unit: '°C',   secondary: 'Delta T: 5.1°C', color: '#00BFA5', variance: '+0.0%',  timestamp: '14:15:32 UTC', ref: 'Chilled Water Return' },
  { id: 'WTR-REC-FLT', category: 'WATER SYSTEMS',status: 'OPTIMAL',name: 'Greywater Reclamation',  primary: 92,     unit: '% Rec.',secondary: 'Filter Health: 81%', color: '#10B981', variance: '-1.2%',  timestamp: '14:19:50 UTC', ref: 'Greywater Filtration' },
  { id: 'GAS-AIR-MED', category: 'GASES',       status: 'LIVE',   name: 'Medical Air Supply',      primary: 55.2,   unit: 'PSI',  secondary: 'Stability: 99.9%', color: '#8B5CF6', variance: '+0.0%',  timestamp: '14:21:01 UTC', ref: 'Medical Air Compressor' },
  { id: 'SOL-PV-TOP',  category: 'RENEWABLES',  status: 'ACTIVE', name: 'Rooftop Photovoltaic',    primary: 428,    unit: 'kW',   secondary: 'Cloud Cover: 13%', color: '#F59E0B', variance: '+12.1%', timestamp: '14:18:56 UTC', ref: 'Solar Array Roof' },
  { id: 'GAS-LN2-VLT', category: 'GASES',       status: 'MONITORING',name: 'Liquid Nitrogen Vault',primary: -196,   unit: '°C',   secondary: 'Level: 62.3%', color: '#6366F1', variance: '+0.0%',  timestamp: '14:20:44 UTC', ref: 'LN2 Storage' },
  { id: 'HEAT-REC-WHR',category: 'COGENERATION',status: 'LIVE',   name: 'Waste Heat Recovery',    primary: 12.1,   unit: 'GJ/d', secondary: 'Efficiency: 88%', color: '#EC4899', variance: '+3.1%',  timestamp: '14:22:11 UTC', ref: 'Exhaust Heat Capture' },
];

function TelemetryCard({ card, t, onLearnMore }) {
  const sparkData = mkSparkline(Math.abs(card.primary), 14, 0.08);
  const lineColor = card.status === 'ANOMALY' ? '#EF4444' : card.color;

  return (
    <div className={`card p-4 hover:shadow-md transition-all duration-300 ${card.status === 'ANOMALY' ? 'ring-1 ring-red-300 dark:ring-red-800' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">{card.category}</span>
        <StatusBadge status={card.status} />
      </div>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 leading-tight">{card.name}</p>

      <div className="flex items-end justify-between gap-2">
        <div>
          <span className={`text-3xl font-black ${card.status === 'ANOMALY' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
            {card.primary}
          </span>
          <span className="text-sm text-gray-400 ml-1">{card.unit}</span>
        </div>
        <div className="w-28 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400 dark:text-gray-500">{card.secondary}</p>
        <button 
          onClick={() => onLearnMore(card.id)}
          className="text-xs text-cobalt-500 dark:text-teal-400 hover:underline font-medium flex items-center gap-0.5"
        >
          {card.status === 'ANOMALY' ? t('tele_investigate') : t('tele_learn')}
          <ExternalLink size={10} />
        </button>
      </div>
    </div>
  );
}

export default function TelemetryPage() {
  const { t } = useLanguage();
  const [cards, setCards] = useState(initialCards);
  const [selectedTelemetryId, setSelectedTelemetryId] = useState(null);
  const [wsStatus, setWsStatus] = useState('connecting');
  const wsRef = useRef(null);

  // WebSocket live updates
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(`${WS_BASE}/ws/telemetry`);
      ws.onopen = () => setWsStatus('connected');
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setCards(prev => prev.map(c => {
            const update = data[c.id];
            if (!update) return c;
            return { ...c, primary: update.value, timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC' };
          }));
        } catch {}
      };
      ws.onerror = () => setWsStatus('mock');
      ws.onclose = () => setWsStatus('mock');
    } catch {
      setWsStatus('mock');
    }

    // Mock live updates every 3s
    const interval = setInterval(() => {
      setCards(prev => prev.map(c => ({
        ...c,
        primary: c.status === 'ANOMALY'
          ? parseFloat((c.primary * (1 + (Math.random() - 0.45) * 0.02)).toFixed(c.unit === '°C' ? 1 : 2))
          : parseFloat((c.primary * (1 + (Math.random() - 0.5) * 0.01)).toFixed(c.unit === '°C' ? 1 : 2)),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
      })));
    }, 3000);

    return () => {
      ws?.close();
      clearInterval(interval);
    };
  }, []);

  const statusDotColor = {
    LIVE: '#10B981', ACTIVE: '#10B981', OPTIMAL: '#00BFA5',
    STABLE: '#3B82F6', MONITORING: '#8B5CF6',
    STANDBY: '#EAB308', ANOMALY: '#EF4444',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
              Internal Archive #{Math.floor(Math.random() * 900) + 100}.4
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              wsStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {wsStatus === 'connected' ? '● LIVE WS' : '● MOCK LIVE'}
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{t('tele_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-2xl">{t('tele_subtitle')}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-1">{t('tele_global_health')}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">98.2%</p>
                <p className="text-xs text-emerald-500 font-semibold mt-1">▲ +0.4% from 24h</p>
              </div>
              <Activity size={20} className="text-emerald-400" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-1">{t('tele_carbon_intensity')}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">242 <span className="text-lg font-semibold text-gray-400">g/kWh</span></p>
                <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                  <AlertTriangle size={10} /> {t('tele_anomaly')}
                </p>
              </div>
              <div className="live-dot" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-1">{t('tele_active_sensors')}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">1,402</p>
                <p className="text-xs text-blue-400 font-semibold mt-1 flex items-center gap-1">
                  <Wifi size={10} /> {t('tele_synced')}
                </p>
              </div>
              <Wifi size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-3 gap-4">
          {cards.map(card => (
            <TelemetryCard key={card.id} card={card} t={t} onLearnMore={setSelectedTelemetryId} />
          ))}
        </div>

        {/* Historical Logs Table */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{t('tele_historical')}</h2>
            <button
              id="export-pdf-btn"
              className="flex items-center gap-2 btn-secondary text-sm py-2 px-4"
            >
              <Download size={14} />
              {t('tele_export')}
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-navy-700">
                {[t('tele_system_ref'), t('tele_status'), t('tele_current_val'), t('tele_variance'), t('tele_timestamp')].map(h => (
                  <th key={h} className="text-left text-xs font-bold text-gray-400 dark:text-gray-500 pb-3 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map(c => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-navy-800 last:border-0 hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                  <td className="py-3">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{c.id}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.ref}</p>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusDotColor[c.status] || '#6B7280' }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{c.status.charAt(0) + c.status.slice(1).toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-gray-900 dark:text-white text-sm">{c.primary} {c.unit}</td>
                  <td className={`py-3 text-xs font-semibold ${c.variance.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{c.variance}</td>
                  <td className="py-3 text-xs text-gray-400 dark:text-gray-500 font-mono">{c.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-navy-700 flex justify-center">
            <p className="text-xs text-gray-400 tracking-wider">MEDCARBON OS — FACILITY INTELLIGENCE CORE v4.1.0 — SECURE SCHOLARLY ENVIRONMENT</p>
          </div>
        </div>
      </div>

      <TelemetryDetailModal 
        isOpen={!!selectedTelemetryId} 
        onClose={() => setSelectedTelemetryId(null)} 
        telemetryId={selectedTelemetryId} 
      />
    </DashboardLayout>
  );
}
