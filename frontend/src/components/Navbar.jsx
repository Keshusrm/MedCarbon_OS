import { NavLink } from 'react-router-dom';
import { Search, Shield, Bell, Settings, Sun, Moon, Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="h-14 bg-white dark:bg-navy-900 border-b border-gray-100 dark:border-navy-700 flex items-center px-6 gap-4 transition-colors duration-300 sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <Leaf size={20} className="text-teal-400" />
        <span className="font-bold text-gray-900 dark:text-white text-sm whitespace-nowrap">MedCarbon OS</span>
      </div>

      {/* Nav Tabs */}
      <nav className="flex items-center gap-1">
        {[
          { label: t('nav_executive'), path: '/dashboard' },
          { label: t('nav_telemetry'), path: '/telemetry' },
          { label: t('nav_compliance'), path: '/compliance' },
        ].map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-64 ml-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('nav_search')}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500 transition-all"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-navy-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
          title="Toggle Language"
        >
          {language === 'en' ? (
            <><span className="text-base">🇮🇳</span> हिं</>
          ) : (
            <><span className="text-base">🇬🇧</span> EN</>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Shield size={16} />
        </button>
        <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Settings size={16} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cobalt-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer">
          MH
        </div>
      </div>
    </header>
  );
}
