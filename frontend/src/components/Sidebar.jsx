import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Activity, TrendingUp, ClipboardCheck, 
  CheckCircle2, Leaf, Sparkles, User 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { key: 'sidebar_executive',           path: '/dashboard',    icon: LayoutDashboard, title: 'High-level executive overview' },
  { key: 'sidebar_facility_telemetry',  path: '/telemetry',    icon: Activity,        title: 'Real-time carbon emissions telemetry' },
  { key: 'sidebar_carbon_forecasting',  path: '/forecasting',  icon: TrendingUp,      title: 'Predictive emission trends' },
  { key: 'sidebar_compliance_audit',    path: '/compliance',   icon: ClipboardCheck,  title: 'Regulatory compliance reporting' },
  { key: 'sidebar_carbon_predictor',    path: '/predict',      icon: Sparkles,        title: 'AI-driven carbon reduction suggestions' },
];

export default function Sidebar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const institution = localStorage.getItem('userInstitution') || 'Organization';

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-navy-900 border-r border-gray-100 dark:border-navy-700 flex flex-col transition-colors duration-300">
      {/* Facility Header */}
      <div className="p-5 border-b border-gray-100 dark:border-navy-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded bg-teal-400/20 flex items-center justify-center">
            <Leaf size={14} className="text-teal-500" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-sm" title="Your registered institution">{institution}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 ml-9">Carbon Management Unit</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ key, path, icon: Icon, title }) => (
          <NavLink
            key={path}
            to={path}
            title={title}
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
        <button onClick={() => navigate('/profile')} className="sidebar-link w-full" title="View and edit your profile">
          <User size={16} />
          Profile
        </button>
        <button className="sidebar-link w-full" title="Platform systems are fully operational">
          <CheckCircle2 size={16} className="text-emerald-500" />
          {t('sidebar_status')}
          <span className="ml-auto text-xs text-emerald-500 font-semibold">●</span>
        </button>
      </div>
    </aside>
  );
}
