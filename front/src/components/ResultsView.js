import { useState, useEffect } from 'react';

const ResultsView = () => {
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalGuesses: 0 });

  useEffect(() => {
    fetchGuesses();
    fetchStats();
  }, []);

  const fetchGuesses = async () => {
    try {
      const response = await fetch('/api/guesses');
      if (!response.ok) {
        throw new Error('Failed to fetch guesses');
      }
      const data = await response.json();
      setGuesses(data.guesses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/guesses/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getGenderEmoji = (gender) => {
    switch (gender) {
      case 'boy': return '👦';
      case 'girl': return '👧';
      case 'surprise': return '🎁';
      default: return '👶';
    }
  };

  const getGenderStats = () => {
    const stats = { boy: 0, girl: 0, surprise: 0 };
    guesses.forEach(guess => {
      stats[guess.gender] = (stats[guess.gender] || 0) + 1;
    });
    return stats;
  };

  const getAverageWeight = () => {
    if (guesses.length === 0) return 0;
    const total = guesses.reduce((sum, guess) => sum + parseFloat(guess.weightPounds), 0);
    return (total / guesses.length).toFixed(1);
  };

  const getAverageHeight = () => {
    if (guesses.length === 0) return 0;
    const total = guesses.reduce((sum, guess) => sum + parseInt(guess.heightInches), 0);
    return Math.round(total / guesses.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading guesses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">Error Loading Guesses</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (guesses.length === 0) {
    return (
      <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📝</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Guesses Yet</h2>
        <p className="text-gray-600">Be the first to make a prediction about the baby!</p>
      </div>
    );
  }

  const genderStats = getGenderStats();

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Guess Statistics ({stats.totalGuesses} total)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center bg-purple-50 rounded-xl p-4">
            <div className="text-2xl mb-2">👦</div>
            <div className="text-xl font-bold text-purple-600">{genderStats.boy}</div>
            <div className="text-sm text-gray-600">Boy Predictions</div>
          </div>
          
          <div className="text-center bg-pink-50 rounded-xl p-4">
            <div className="text-2xl mb-2">👧</div>
            <div className="text-xl font-bold text-pink-600">{genderStats.girl}</div>
            <div className="text-sm text-gray-600">Girl Predictions</div>
          </div>
          
          <div className="text-center bg-blue-50 rounded-xl p-4">
            <div className="text-2xl mb-2">⚖️</div>
            <div className="text-xl font-bold text-blue-600">{getAverageWeight()} lbs</div>
            <div className="text-sm text-gray-600">Average Weight</div>
          </div>
          
          <div className="text-center bg-green-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📏</div>
            <div className="text-xl font-bold text-green-600">{getAverageHeight()}"</div>
            <div className="text-sm text-gray-600">Average Height</div>
          </div>
        </div>
      </div>

      {/* Individual Guesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guesses.map((guess) => (
          <div key={guess.id} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{guess.guesserName}</h3>
              <span className="text-2xl">{getGenderEmoji(guess.gender)}</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Birth Date:</span>
                  <div className="font-medium">{formatDate(guess.birthDate)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <div className="font-medium">{formatTime(guess.birthTime)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Weight:</span>
                  <div className="font-medium">{guess.weightPounds} lbs</div>
                </div>
                <div>
                  <span className="text-gray-600">Height:</span>
                  <div className="font-medium">{guess.heightInches}"</div>
                </div>
              </div>
              
              {(guess.firstName || guess.middleName) && (
                <div>
                  <span className="text-gray-600">Name Guess:</span>
                  <div className="font-medium">
                    {guess.firstName} {guess.middleName}
                  </div>
                </div>
              )}
              
              {(guess.eyeColor || guess.hairColor) && (
                <div className="grid grid-cols-2 gap-4">
                  {guess.eyeColor && (
                    <div>
                      <span className="text-gray-600">Eyes:</span>
                      <div className="font-medium capitalize">{guess.eyeColor}</div>
                    </div>
                  )}
                  {guess.hairColor && (
                    <div>
                      <span className="text-gray-600">Hair:</span>
                      <div className="font-medium capitalize">{guess.hairColor}</div>
                    </div>
                  )}
                </div>
              )}
              
              {guess.specialMessage && (
                <div className="bg-gray-50 rounded-lg p-3 mt-4">
                  <span className="text-gray-600">Message:</span>
                  <div className="font-medium italic">"{guess.specialMessage}"</div>
                </div>
              )}
              
              <div className="text-xs text-gray-400 text-right mt-4">
                Submitted {new Date(guess.submittedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView; 