import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GuessForm = ({ onSuccess, submitted }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    guesserName: '',
    guesserEmail: '',
    birthDate: '',
    gender: '',
    firstNameBoy: '',
    middleName1Boy: '',
    middleName2Boy: '',
    middleName3Boy: '',
    middleName4Boy: '',
    firstNameGirl: '',
    middleName1Girl: '',
    middleName2Girl: '',
    middleName3Girl: '',
    middleName4Girl: '',
    weightGrams: '',
    heightCm: '',
    birthTime: '',
    eyeColor: '',
    hairColor: '',
    specialMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  // Focus on error message when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing again
    if (error) {
      setError('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Clean the form data - remove empty strings for optional fields
      const cleanedFormData = {
        ...formData,
        guesserEmail: formData.guesserEmail.trim() || undefined,
        firstNameBoy: formData.firstNameBoy.trim() || undefined,
        middleName1Boy: formData.middleName1Boy.trim() || undefined,
        middleName2Boy: formData.middleName2Boy.trim() || undefined,
        middleName3Boy: formData.middleName3Boy.trim() || undefined,
        middleName4Boy: formData.middleName4Boy.trim() || undefined,
        firstNameGirl: formData.firstNameGirl.trim() || undefined,
        middleName1Girl: formData.middleName1Girl.trim() || undefined,
        middleName2Girl: formData.middleName2Girl.trim() || undefined,
        middleName3Girl: formData.middleName3Girl.trim() || undefined,
        middleName4Girl: formData.middleName4Girl.trim() || undefined,
        birthTime: formData.birthTime || undefined,
        eyeColor: formData.eyeColor || undefined,
        hairColor: formData.hairColor || undefined,
        specialMessage: formData.specialMessage.trim() || undefined,
      };

      const response = await fetch('/api/guesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'envoi du pronostic');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('guessSubmitted')}</h2>
          <p className="text-gray-600 mb-6">{t('thankYou')}</p>
          
          {/* Password reveal section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <span className="text-lg mr-2">🔑</span>
              <h3 className="font-semibold text-blue-800">{t('accessResults')}</h3>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              {t('usePassword')}
            </p>
            <div className="bg-white border-2 border-blue-300 rounded-lg px-4 py-3">
              <div className="text-xs text-gray-500 mb-1">{t('userPassword')}</div>
              <div className="text-lg font-mono font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded">
                {process.env.REACT_APP_USER_PASSWORD || 'user'}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            {t('clickViewResults')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('formTitle')}</h2>
        
        {error && (
          <div 
            ref={errorRef}
            tabIndex="-1"
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <span className="mr-2 text-lg">❌</span>
              <div>
                <strong>Erreur :</strong> {error}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">👤</span> {t('personalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('yourName')} {t('required')}
                </label>
                <input
                  type="text"
                  name="guesserName"
                  value={formData.guesserName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('yourNamePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')} <span className="text-sm font-normal text-gray-500">{t('emailOptional')}</span>
                </label>
                <input
                  type="email"
                  name="guesserEmail"
                  value={formData.guesserEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">📅</span> {t('birthPredictions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('birthDate')} {t('required')}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  min="2025-01-01"
                  max="2026-12-31"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('birthTime')}
                </label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gender')} {t('required')}
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'boy', label: t('boy') },
                    { value: 'girl', label: t('girl') }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={handleChange}
                        required
                        className="mr-2 text-purple-500 focus:ring-purple-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Details */}
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <span className="mr-2">📏</span> {t('physicalCharacteristics')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('weight')} {t('required')}
                </label>
                <input
                  type="number"
                  name="weightGrams"
                  value={formData.weightGrams}
                  onChange={handleChange}
                  required
                  min="1500"
                  max="7000"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="3500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('height')} {t('required')}
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  required
                  min="30"
                  max="70"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('eyeColor')}
                </label>
                <select
                  name="eyeColor"
                  value={formData.eyeColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t('eyeColorPlaceholder')}</option>
                  <option value="brown">{t('brown')}</option>
                  <option value="blue">{t('blue')}</option>
                  <option value="green">{t('green')}</option>
                  <option value="hazel">{t('hazel')}</option>
                  <option value="gray">{t('gray')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hairColor')}
                </label>
                <select
                  name="hairColor"
                  value={formData.hairColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">{t('hairColorPlaceholder')}</option>
                  <option value="black">{t('black')}</option>
                  <option value="brown">{t('brownHair')}</option>
                  <option value="blonde">{t('blonde')}</option>
                  <option value="red">{t('red')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boy Names */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">👦</span> {t('boyNames')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  name="firstNameBoy"
                  value={formData.firstNameBoy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('firstNameBoyPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('middleNames')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="middleName1Boy"
                    value={formData.middleName1Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('middleName1')}
                  />
                  <input
                    type="text"
                    name="middleName2Boy"
                    value={formData.middleName2Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('middleName2')}
                  />
                  <input
                    type="text"
                    name="middleName3Boy"
                    value={formData.middleName3Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('middleName3')}
                  />
                  <input
                    type="text"
                    name="middleName4Boy"
                    value={formData.middleName4Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('middleName4')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Girl Names */}
          <div className="bg-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">👧</span> {t('girlNames')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  name="firstNameGirl"
                  value={formData.firstNameGirl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder={t('firstNameGirlPlaceholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('middleNames')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="middleName1Girl"
                    value={formData.middleName1Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('middleName1')}
                  />
                  <input
                    type="text"
                    name="middleName2Girl"
                    value={formData.middleName2Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('middleName2')}
                  />
                  <input
                    type="text"
                    name="middleName3Girl"
                    value={formData.middleName3Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('middleName3')}
                  />
                  <input
                    type="text"
                    name="middleName4Girl"
                    value={formData.middleName4Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder={t('middleName4')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Message */}
          <div className="bg-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">💝</span> {t('specialMessage')}
            </h3>
            <textarea
              name="specialMessage"
              value={formData.specialMessage}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={t('specialMessagePlaceholder')}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('submitting')}
            </span>
          ) : (
            t('submitGuess')
          )}
        </button>
      </form>
    </div>
  );
};

export default GuessForm; 