import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, languages, getTranslation } from '../translations';

// Create the language context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get initial language from URL or saved preference
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Check URL path first
    const path = window.location.pathname;
    const urlLang = path.substring(1); // Remove leading slash
    
    // If URL has a valid language code, use it
    if (['fr', 'en', 'pl'].includes(urlLang)) {
      return urlLang;
    }
    
    // Otherwise use saved preference or default to French
    const saved = localStorage.getItem('baby-roulette-language');
    return saved || 'fr';
  });

  // Save language preference and update URL
  useEffect(() => {
    localStorage.setItem('baby-roulette-language', currentLanguage);
    
    // Update URL without page reload
    const newPath = `/${currentLanguage}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [currentLanguage]);

  // Handle root path redirect on initial load
  useEffect(() => {
    if (window.location.pathname === '/') {
      const newPath = `/${currentLanguage}`;
      window.history.replaceState({}, '', newPath);
    }
  }, []); // Only run once on mount

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const urlLang = path.substring(1);
      
      if (['fr', 'en', 'pl'].includes(urlLang) && urlLang !== currentLanguage) {
        setCurrentLanguage(urlLang);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLanguage]);

  // Translation function
  const t = (key) => getTranslation(currentLanguage, key);

  // Update document title based on language
  useEffect(() => {
    const title = getTranslation(currentLanguage, 'tabTitle');
    if (title) {
      document.title = title;
    }
  }, [currentLanguage]);

  // Get current language info
  const getCurrentLanguage = () => languages.find(lang => lang.code === currentLanguage);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t,
    languages,
    getCurrentLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
