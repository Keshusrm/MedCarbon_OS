import { createContext, useContext, useState } from 'react';
import en from '../translations/en';
import hi from '../translations/hi';

const LanguageContext = createContext();

const translations = { en, hi };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('medcarbon-lang') || 'en';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('medcarbon-lang', next);
      return next;
    });
  };

  const t = (key) => {
    return translations[language]?.[key] ?? translations['en']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
