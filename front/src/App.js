import { useState } from 'react';
import './App.css';
import GuessForm from './components/GuessForm';
import ResultsView from './components/ResultsView';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'results'
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-6 shadow-lg">
            <span className="text-4xl">👶</span>
          </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {t('headerTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('headerSubtitle')} <span className="font-semibold text-purple-600">{t('headerMonth')}</span>{t('headerDescription')}
          </p>
        </header>

        {/* Navigation */}
        <nav className="mb-8 px-4 sm:px-0 sm:flex sm:justify-center">
          <div className="w-full sm:w-auto bg-white rounded-2xl sm:rounded-full p-2 shadow-lg sm:inline-flex">
            {/* Mobile: Stack vertically with full width, Desktop: Side by side */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <button
                onClick={() => setCurrentView('form')}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 rounded-xl sm:rounded-full font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  currentView === 'form'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-500 hover:bg-gray-50 sm:hover:bg-transparent'
                }`}
              >
                <span className="sm:hidden">{t('navMakeGuess')}</span>
                <span className="hidden sm:inline">{t('navMakeGuess')}</span>
              </button>
              <button
                onClick={() => setCurrentView('results')}
                className={`w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-3 rounded-xl sm:rounded-full font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  currentView === 'results'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-500 hover:bg-gray-50 sm:hover:bg-transparent'
                }`}
              >
                <span className="sm:hidden">{t('navViewResultsShort')}</span>
                <span className="hidden sm:inline">{t('navViewResults')}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-4xl mx-auto">
          {currentView === 'form' ? (
            <GuessForm 
              onSuccess={() => {
                setSubmitted(true);
                setTimeout(() => setCurrentView('results'), 2000);
              }}
              submitted={submitted}
            />
          ) : (
            <ResultsView />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p>{t('footer')}</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}