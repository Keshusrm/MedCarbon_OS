import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function LoginPage() {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`${API_BASE}${endpoint}`, {
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

      if (isSignUp) {
        navigate('/onboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-navy-950 transition-colors duration-300">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/60 to-navy-900/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=900&q=80"
          alt="Sustainable Hospital"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Badge */}
        <div className="absolute top-8 left-8 z-20">
          <span className="bg-yellow-400/90 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full tracking-wider">
            {t('login_report_label')}
          </span>
        </div>

        {/* Quote Content */}
        <div className="relative z-20 flex flex-col justify-center px-12 py-16">
          <p className="text-white text-4xl font-bold leading-tight mb-6 mt-16">
            {t('login_quote')}
          </p>
          <p className="text-gray-300 text-sm">{t('login_quote_attr')}</p>
        </div>

        {/* Bottom Footer */}
        <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-center">
          <span className="text-gray-400 text-xs">{t('login_copyright')}</span>
          <span className="text-gray-400 text-xs tracking-widest">{t('login_gov_tier')}</span>
        </div>
      </div>

      {/* Right Auth Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-white dark:bg-navy-950">
        {/* Top controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-navy-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
          >
            {language === 'en' ? <><span>🇮🇳</span> हिं</> : <><span>🇬🇧</span> EN</>}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-gray-200 dark:border-navy-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={24} className="text-teal-400" />
            <span className="text-xl font-bold text-cobalt-500 dark:text-cobalt-400">MedCarbon OS</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {isSignUp ? "Create a password for your account." : t('login_tagline')}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-900/50">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-1.5">
                {t('login_email_label')}
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('login_email_placeholder')}
                  className="input-field pr-10"
                  required
                />
                <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                  {isSignUp ? "NEW PASSWORD" : t('login_pass_label')}
                </label>
                {!isSignUp && (
                  <button type="button" className="text-xs text-cobalt-500 dark:text-cobalt-400 hover:underline">
                    {t('login_forgot')}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            {!isSignUp && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember-device"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-navy-600 text-cobalt-500 focus:ring-cobalt-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('login_remember')}</span>
              </label>
            )}

            {/* Submit Button */}
            <button
              id="signin-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                'Create Account & Login →'
              ) : (
                t('login_btn')
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-navy-700" />
              <span className="text-xs text-gray-400 tracking-wider">{t('login_or')}</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-navy-700" />
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="google-signin"
                className="btn-secondary flex items-center justify-center gap-2 py-2.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('login_google')}
              </button>
              <button
                type="button"
                id="saml-signin"
                className="btn-secondary flex items-center justify-center gap-2 py-2.5"
              >
                <div className="w-4 h-4 bg-cobalt-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                {t('login_saml')}
              </button>
            </div>

            {/* Toggle Link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
                    className="text-cobalt-500 dark:text-cobalt-400 font-medium hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  {t('login_no_access')}{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
                    className="text-cobalt-500 dark:text-cobalt-400 font-medium hover:underline"
                  >
                    {t('login_signup')}
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

