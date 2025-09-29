import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultsView = () => {
  const { t } = useLanguage();
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalGuesses: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'admin' or 'user'
  const [password, setPassword] = useState('');
  const [authErrors, setAuthErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantNames, setParticipantNames] = useState([]);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    // Check if user is already authenticated from sessionStorage
    const savedAuth = sessionStorage.getItem('baby-roulette-auth');
    const savedUserType = sessionStorage.getItem('baby-roulette-user-type');
    if (savedAuth === 'true' && savedUserType) {
      setIsAuthenticated(true);
      setUserType(savedUserType);
    } else {
      // If not authenticated, fetch participant names for the animation
      fetchParticipantNames();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuesses();
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchGuesses = async () => {
    try {
      const response = await fetch('/api/guesses');
      if (!response.ok) {
        throw new Error(t('failedToFetchPredictions'));
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
      console.error(t('failedToFetchStats'), err);
    }
  };

  const fetchParticipantNames = async () => {
    try {
      const response = await fetch('/api/guesses');
      if (response.ok) {
        const data = await response.json();
        const names = data.guesses ? data.guesses.map(guess => guess.guesserName) : [];
        setParticipantNames([...new Set(names)]); // Remove duplicates
      }
    } catch (err) {
      // Silently fail - animation is not critical
      console.log(t('failedToFetchNames'));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return t('notSpecified');
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('fr-FR', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getGenderEmoji = (gender) => {
    switch (gender) {
      case 'boy': return '👦';
      case 'girl': return '👧';
      default: return '👶';
    }
  };

  const translateColor = (color) => {
    const translations = {
      'brown': 'Marron',
      'blue': 'Bleu', 
      'green': 'Vert',
      'hazel': 'Noisette',
      'gray': 'Gris',
      'black': 'Noir',
      'blonde': 'Blond',
      'red': 'Roux'
    };
    return translations[color] || color;
  };

  const getGenderStats = () => {
    const stats = { boy: 0, girl: 0 };
    guesses.forEach(guess => {
      stats[guess.gender] = (stats[guess.gender] || 0) + 1;
    });
    return stats;
  };

  const getAverageWeight = () => {
    if (guesses.length === 0) return 0;
    const total = guesses.reduce((sum, guess) => sum + parseInt(guess.weightGrams), 0);
    return Math.round(total / guesses.length);
  };

  const getAverageHeight = () => {
    if (guesses.length === 0) return 0;
    const total = guesses.reduce((sum, guess) => sum + parseInt(guess.heightCm), 0);
    return Math.round(total / guesses.length);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!password.trim()) {
      errors.push({
        field: 'password',
        message: t('passwordRequired')
      });
    } else if (password.length < 3) {
      errors.push({
        field: 'password', 
        message: t('passwordMinLength')
      });
    }
    
    return errors;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthErrors([]);
    
    // Validate form first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setAuthErrors(validationErrors);
      setIsSubmitting(false);
      // Focus on the first error field
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      // Multiple password types
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin';
      const userPassword = process.env.REACT_APP_USER_PASSWORD || 'user';
      
      let authenticatedUserType = null;
      
      if (password === adminPassword) {
        authenticatedUserType = 'admin';
      } else if (password === userPassword) {
        authenticatedUserType = 'user';
      }
      
      if (authenticatedUserType) {
        setIsAuthenticated(true);
        setUserType(authenticatedUserType);
        setAuthErrors([]);
        // Remember authentication and user type for the session
        sessionStorage.setItem('baby-roulette-auth', 'true');
        sessionStorage.setItem('baby-roulette-user-type', authenticatedUserType);
      } else {
        setAuthErrors([{
          field: 'password',
          message: t('incorrectPassword')
        }]);
        setPassword('');
        // Focus back to password field on error
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
      setIsSubmitting(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    sessionStorage.removeItem('baby-roulette-auth');
    sessionStorage.removeItem('baby-roulette-user-type');
    setPassword('');
    setAuthErrors([]);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        {/* Animated participant names */}
        {participantNames.length > 0 && (
          <div className="mb-8 overflow-hidden">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 font-medium">
                {t('theyAlreadyParticipated')}
              </p>
            </div>
            <div className="relative h-12 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full flex items-center overflow-hidden">
              <div className="animate-scroll whitespace-nowrap">
                {[...participantNames, ...participantNames].map((name, index) => (
                  <span 
                    key={`${name}-${index}`}
                    className="inline-block mx-6 px-3 py-1 bg-white rounded-full text-sm font-medium text-purple-600 shadow-sm"
                  >
                    👤 {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t('privateZone')}
            </h2>
            <p className="text-gray-600 mb-4">
              {t('enterPassword')}
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  authErrors.some(error => error.field === 'password') 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-purple-500'
                }`}
                placeholder={t('enterPasswordPlaceholder')}
                disabled={isSubmitting}
              />
              {/* Field-specific errors */}
              {authErrors
                .filter(error => error.field === 'password')
                .map((error, index) => (
                  <div key={index} className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {error.message}
                  </div>
                ))
              }
            </div>
            
            {/* General errors (not field-specific) */}
            {authErrors.filter(error => !error.field).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5">❌</span>
                  <div>
                    {authErrors
                      .filter(error => !error.field)
                      .map((error, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                          {error.message}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('verifying')}
                </span>
              ) : (
                t('accessPredictions')
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingPredictions')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
        <h3 className="font-semibold mb-2">{t('errorLoadingPredictions')}</h3>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('noPredictionsYet')}</h2>
        <p className="text-gray-600">{t('beFirstToPredict')}</p>
      </div>
    );
  }

  const genderStats = getGenderStats();

  // Get popular names for recap view
  const getPopularNames = () => {
    const boyNames = [];
    const girlNames = [];
    
    guesses.forEach(guess => {
      if (guess.firstNameBoy) boyNames.push(guess.firstNameBoy);
      if (guess.firstNameGirl) girlNames.push(guess.firstNameGirl);
    });
    
    const countNames = (names) => {
      const counts = {};
      names.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
      return Object.entries(counts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }));
    };
    
    return {
      boys: countNames(boyNames),
      girls: countNames(girlNames)
    };
  };

  const getMostPopularDate = () => {
    const dateCounts = {};
    guesses.forEach(guess => {
      const date = guess.birthDate;
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    if (Object.keys(dateCounts).length === 0) return null;
    
    const [mostPopularDate, count] = Object.entries(dateCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    return { date: mostPopularDate, count };
  };

  // Render recap view for regular users
  const renderUserRecapView = () => {
    const popularNames = getPopularNames();
    const popularDate = getMostPopularDate();
    
    return (
      <div className="space-y-8">
        {/* Header with logout button and user type indicator */}
        <div className="flex justify-between items-center">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('summaryView')}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
          >
            <span className="mr-2">🔓</span>
            {t('disconnect')}
          </button>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {t('predictionsSummary')} ({stats.totalGuesses} {t('participants')})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-purple-50 rounded-xl p-4">
              <div className="text-2xl mb-2">👦</div>
              <div className="text-xl font-bold text-purple-600">{genderStats.boy}</div>
              <div className="text-sm text-gray-600">{t('boyPredictions')}</div>
            </div>
            
            <div className="text-center bg-pink-50 rounded-xl p-4">
              <div className="text-2xl mb-2">👧</div>
              <div className="text-xl font-bold text-pink-600">{genderStats.girl}</div>
              <div className="text-sm text-gray-600">{t('girlPredictions')}</div>
            </div>
            
            <div className="text-center bg-blue-50 rounded-xl p-4">
              <div className="text-2xl mb-2">⚖️</div>
              <div className="text-xl font-bold text-blue-600">{getAverageWeight()} g</div>
              <div className="text-sm text-gray-600">{t('averageWeight')}</div>
            </div>
            
            <div className="text-center bg-green-50 rounded-xl p-4">
              <div className="text-2xl mb-2">📏</div>
              <div className="text-xl font-bold text-green-600">{getAverageHeight()} cm</div>
              <div className="text-sm text-gray-600">{t('averageHeight')}</div>
            </div>
          </div>
        </div>

        {/* Popular Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">👦</span> {t('popularBoyNames')}
            </h3>
            {popularNames.boys.length > 0 ? (
              <div className="space-y-2">
                {popularNames.boys.map((nameData, index) => (
                  <div key={index} className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-2">
                    <span className="font-medium">{nameData.name}</span>
                    <span className="text-sm text-gray-600">{nameData.count} {nameData.count > 1 ? t('votes') : t('vote')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('noBoyNameSuggested')}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">👧</span> {t('popularGirlNames')}
            </h3>
            {popularNames.girls.length > 0 ? (
              <div className="space-y-2">
                {popularNames.girls.map((nameData, index) => (
                  <div key={index} className="flex justify-between items-center bg-pink-50 rounded-lg px-4 py-2">
                    <span className="font-medium">{nameData.name}</span>
                    <span className="text-sm text-gray-600">{nameData.count} {nameData.count > 1 ? t('votes') : t('vote')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('noGirlNameSuggested')}</p>
            )}
          </div>
        </div>

        {/* Most Popular Date */}
        {popularDate && (
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center justify-center">
              <span className="mr-2">📅</span> {t('mostPopularDate')}
            </h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatDate(popularDate.date)}
            </div>
            <p className="text-gray-600">
              {popularDate.count} {popularDate.count > 1 ? t('people') : t('person')} {popularDate.count > 1 ? t('choseThisDatePlural') : t('choseThisDate')}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render admin view (full detailed view)
  const renderAdminView = () => {
    const popularNames = getPopularNames();
    const popularDate = getMostPopularDate();
    
    return (
      <div className="space-y-8">
        {/* Header with logout button and admin indicator */}
        <div className="flex justify-between items-center">
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {t('adminView')}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
          >
            <span className="mr-2">🔓</span>
            {t('disconnect')}
          </button>
        </div>

        {/* Statistics Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {t('statisticsSummary')} ({stats.totalGuesses} {t('totalCount')})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-purple-50 rounded-xl p-4">
              <div className="text-2xl mb-2">👦</div>
              <div className="text-xl font-bold text-purple-600">{genderStats.boy}</div>
              <div className="text-sm text-gray-600">{t('boyPredictions')}</div>
            </div>
            
            <div className="text-center bg-pink-50 rounded-xl p-4">
              <div className="text-2xl mb-2">👧</div>
              <div className="text-xl font-bold text-pink-600">{genderStats.girl}</div>
              <div className="text-sm text-gray-600">{t('girlPredictions')}</div>
            </div>
            
            <div className="text-center bg-blue-50 rounded-xl p-4">
              <div className="text-2xl mb-2">⚖️</div>
              <div className="text-xl font-bold text-blue-600">{getAverageWeight()} g</div>
              <div className="text-sm text-gray-600">{t('averageWeight')}</div>
            </div>
            
            <div className="text-center bg-green-50 rounded-xl p-4">
              <div className="text-2xl mb-2">📏</div>
              <div className="text-xl font-bold text-green-600">{getAverageHeight()} cm</div>
              <div className="text-sm text-gray-600">{t('averageHeight')}</div>
            </div>
          </div>
        </div>

        {/* Popular Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">👦</span> {t('popularBoyNames')}
            </h3>
            {popularNames.boys.length > 0 ? (
              <div className="space-y-2">
                {popularNames.boys.map((nameData, index) => (
                  <div key={index} className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-2">
                    <span className="font-medium">{nameData.name}</span>
                    <span className="text-sm text-gray-600">{nameData.count} {nameData.count > 1 ? t('votes') : t('vote')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('noBoyNameSuggested')}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">👧</span> {t('popularGirlNames')}
            </h3>
            {popularNames.girls.length > 0 ? (
              <div className="space-y-2">
                {popularNames.girls.map((nameData, index) => (
                  <div key={index} className="flex justify-between items-center bg-pink-50 rounded-lg px-4 py-2">
                    <span className="font-medium">{nameData.name}</span>
                    <span className="text-sm text-gray-600">{nameData.count} {nameData.count > 1 ? t('votes') : t('vote')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">{t('noGirlNameSuggested')}</p>
            )}
          </div>
        </div>

        {/* Most Popular Date */}
        {popularDate && (
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center justify-center">
              <span className="mr-2">📅</span> {t('mostPopularDate')}
            </h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatDate(popularDate.date)}
            </div>
            <p className="text-gray-600">
              {popularDate.count} {popularDate.count > 1 ? t('people') : t('person')} {popularDate.count > 1 ? t('choseThisDatePlural') : t('choseThisDate')}
            </p>
          </div>
        )}

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
                  <span className="text-gray-600">{t('birthDate')} :</span>
                  <div className="font-medium">{formatDate(guess.birthDate)}</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('birthTime')} :</span>
                  <div className="font-medium">{formatTime(guess.birthTime)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">{t('weight')} :</span>
                  <div className="font-medium">{guess.weightGrams} g</div>
                </div>
                <div>
                  <span className="text-gray-600">{t('height')} :</span>
                  <div className="font-medium">{guess.heightCm} cm</div>
                </div>
              </div>
              
              {/* Boy Names */}
              {(guess.firstNameBoy || guess.middleName1Boy || guess.middleName2Boy || guess.middleName3Boy || guess.middleName4Boy) && (
                <div>
                  <span className="text-gray-600">👦 {t('boyNames')} :</span>
                  <div className="font-medium text-blue-700">
                    {[guess.firstNameBoy, guess.middleName1Boy, guess.middleName2Boy, guess.middleName3Boy, guess.middleName4Boy]
                      .filter(name => name && name.trim())
                      .join(' ')
                    }
                  </div>
                </div>
              )}
              
              {/* Girl Names */}
              {(guess.firstNameGirl || guess.middleName1Girl || guess.middleName2Girl || guess.middleName3Girl || guess.middleName4Girl) && (
                <div>
                  <span className="text-gray-600">👧 {t('girlNames')} :</span>
                  <div className="font-medium text-pink-700">
                    {[guess.firstNameGirl, guess.middleName1Girl, guess.middleName2Girl, guess.middleName3Girl, guess.middleName4Girl]
                      .filter(name => name && name.trim())
                      .join(' ')
                    }
                  </div>
                </div>
              )}
              
              {(guess.eyeColor || guess.hairColor) && (
                <div className="grid grid-cols-2 gap-4">
                  {guess.eyeColor && (
                    <div>
                      <span className="text-gray-600">{t('eyes')} :</span>
                      <div className="font-medium">{translateColor(guess.eyeColor)}</div>
                    </div>
                  )}
                  {guess.hairColor && (
                    <div>
                      <span className="text-gray-600">{t('hair')} :</span>
                      <div className="font-medium">{translateColor(guess.hairColor)}</div>
                    </div>
                  )}
                </div>
              )}
              
              {guess.specialMessage && (
                <div className="bg-gray-50 rounded-lg p-3 mt-4">
                  <span className="text-gray-600">{t('message')} :</span>
                  <div className="font-medium italic">"{guess.specialMessage}"</div>
                </div>
              )}
              
              <div className="text-xs text-gray-400 text-right mt-4">
                {t('submittedOn')} {new Date(guess.submittedAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    );
  };

  // Main render based on user type
  return userType === 'admin' ? renderAdminView() : renderUserRecapView();
};

export default ResultsView; 