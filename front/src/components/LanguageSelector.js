import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import franceFlag from '../images/france.png';
import polandFlag from '../images/poland.png';
import ukFlag from '../images/united-kingdom.png';

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, languages } = useLanguage();

  const flagImages = {
    'france.png': franceFlag,
    'poland.png': polandFlag,
    'united-kingdom.png': ukFlag
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
  };

  // Filter out the current language to only show alternatives
  const availableLanguages = languages.filter(lang => lang.code !== currentLanguage);

  return (
    <div className="flex items-center space-x-2">
      {/* Available language flags (excluding current one) */}
      {availableLanguages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className="w-10 h-10 rounded-full overflow-hidden transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-purple-300"
          aria-label={`Switch to ${language.name}`}
          title={language.name}
        >
          <img 
            src={flagImages[language.flag]} 
            alt={`${language.name} flag`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
