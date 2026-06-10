import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, TrendingUp, ClipboardCheck, 
  Zap, HelpCircle, CheckCircle2, Leaf, Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { key: 'sidebar_executive',           path: '/dashboard',    icon: LayoutDashboard },
  { key: 'sidebar_facility_telemetry',  path: '/telemetry',    icon: Activity },
  { key: 'sidebar_carbon_forecasting',  path: '/forecasting',  icon: TrendingUp },
  { key: 'sidebar_compliance_audit',    path: '/compliance',   icon: ClipboardCheck },
  { key: 'sidebar_carbon_predictor',     path: '/predict',      icon: Sparkles },
];

export default function Sidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-navy-900 border-r border-gray-100 dark:border-navy-700 flex flex-col transition-colors duration-300">
      {/* Facility Header */}
      <div className="p-5 border-b border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded bg-teal-400/20 flex items-center justify-center">
            <Leaf size={14} className="text-teal-500" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">Metro Health</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-9">Carbon Management Unit</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ key, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? 'sidebar-link-active flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-400/20'
                : 'sidebar-link'
            }
          >
            <Icon size={16} />
            {t(key)}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 border-t border-gray-100 dark:border-navy-700 space-y-1">
        <button className="sidebar-link w-full">
          <HelpCircle size={16} />
          {t('sidebar_help')}
        </button>
        <button className="sidebar-link w-full">
          <CheckCircle2 size={16} className="text-emerald-500" />
          {t('sidebar_status')}
          <span className="ml-auto text-xs text-emerald-500 font-semibold">●</span>
        </button>
      </div>
    </aside>
  );
}
