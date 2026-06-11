import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, Sun, Moon, Leaf, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, language, toggleLanguage } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [fullName, setFullName] = useState(localStorage.getItem('userFullName') || '');
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch profile');
      })
      .then(data => {
        setUserRole(data.role || '');
        setFullName(data.full_name || '');
        setEmail(data.email || '');
        
        if (data.full_name) localStorage.setItem('userFullName', data.full_name);
        if (data.role) localStorage.setItem('userRole', data.role);
        if (data.email) localStorage.setItem('userEmail', data.email);
      })
      .catch(err => {
        console.error("Error loading profile in navbar:", err);
      });
  }, []);

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (email) {
      const prefix = email.split('@')[0];
      const parts = prefix.split(/[\._\-]/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return prefix.substring(0, 2).toUpperCase();
    }
    return 'MH';
  };

  const initials = getInitials();

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

        <button className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors">
          <Settings size={16} />
        </button>
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cobalt-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer hover:shadow-md transition-all duration-200 select-none"
          >
            {initials}
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700 rounded-xl shadow-xl py-2 z-50 animate-slide-up">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2.5 transition-colors font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cobalt-500 to-teal-400 flex items-center justify-center text-white text-[9px] font-bold">
                  {initials}
                </div>
                Profile
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/admin');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800 flex items-center gap-2.5 transition-colors font-medium border-t border-gray-50 dark:border-navy-800"
                >
                  <Settings size={15} className="text-gray-400" />
                  Admin Console
                </button>
              )}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('userFullName');
                  localStorage.removeItem('userRole');
                  localStorage.removeItem('userInstitution');
                  localStorage.removeItem('userAddress');
                  localStorage.removeItem('userFacilityName');
                  navigate('/login', { replace: true });
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2.5 transition-colors font-semibold border-t border-gray-50 dark:border-navy-800 mt-1"
              >
                <LogOut size={15} className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
