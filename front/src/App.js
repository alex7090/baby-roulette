import { useState } from 'react';
import './App.css';
import GuessForm from './components/GuessForm';
import ResultsView from './components/ResultsView';

export default function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'results'
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mb-6 shadow-lg">
            <span className="text-4xl">👶</span>
          </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Roulette Bébé
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Notre petit miracle arrive en <span className="font-semibold text-purple-600">janvier 2026</span> ! 
            Aidez-nous à deviner les détails de notre précieux bout de chou.
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <button
              onClick={() => setCurrentView('form')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentView === 'form'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              Faire mon pronostic
            </button>
            <button
              onClick={() => setCurrentView('results')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentView === 'results'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-500'
              }`}
            >
              Voir tous les pronostics
            </button>
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
          <p>Fait avec 💗 pour notre famille qui s'agrandit</p>
        </footer>
      </div>
    </div>
  );
}