import { useState } from 'react';

const GuessForm = ({ onSuccess, submitted }) => {
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
    weightKg: '',
    heightCm: '',
    birthTime: '',
    eyeColor: '',
    hairColor: '',
    specialMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      const response = await fetch('/api/guesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit guess');
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pronostic envoyé !</h2>
          <p className="text-gray-600">Merci pour votre prédiction. Nous avons hâte de voir à quel point vous vous êtes approché !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Faites votre pronostic</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Personal Info */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <span className="mr-2">👤</span> Vos informations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre nom *
                </label>
                <input
                  type="text"
                  name="guesserName"
                  value={formData.guesserName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Entrez votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (facultatif)
                </label>
                <input
                  type="email"
                  name="guesserEmail"
                  value={formData.guesserEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                />
              </div>
            </div>
          </div>

          {/* Birth Details */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">📅</span> Prédictions de naissance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance *
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
                  Heure de naissance
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
                  Sexe *
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'boy', label: 'Garçon' },
                    { value: 'girl', label: 'Fille' }
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
              <span className="mr-2">📏</span> Caractéristiques physiques
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg) *
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={handleChange}
                  required
                  min="1.5"
                  max="7"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="3.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille (cm) *
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
                  Couleur des yeux
                </label>
                <select
                  name="eyeColor"
                  value={formData.eyeColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choisir la couleur des yeux</option>
                  <option value="brown">Marron</option>
                  <option value="blue">Bleu</option>
                  <option value="green">Vert</option>
                  <option value="hazel">Noisette</option>
                  <option value="gray">Gris</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur des cheveux
                </label>
                <select
                  name="hairColor"
                  value={formData.hairColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choisir la couleur des cheveux</option>
                  <option value="black">Noir</option>
                  <option value="brown">Châtain</option>
                  <option value="blonde">Blond</option>
                  <option value="red">Roux</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boy Names */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
              <span className="mr-2">👦</span> Prénoms si c'est un garçon
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom principal
                </label>
                <input
                  type="text"
                  name="firstNameBoy"
                  value={formData.firstNameBoy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prénom de garçon"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deuxièmes prénoms (jusqu'à 4)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="middleName1Boy"
                    value={formData.middleName1Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1er deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName2Boy"
                    value={formData.middleName2Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2ème deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName3Boy"
                    value={formData.middleName3Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3ème deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName4Boy"
                    value={formData.middleName4Boy}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4ème deuxième prénom"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Girl Names */}
          <div className="bg-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">👧</span> Prénoms si c'est une fille
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom principal
                </label>
                <input
                  type="text"
                  name="firstNameGirl"
                  value={formData.firstNameGirl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Prénom de fille"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deuxièmes prénoms (jusqu'à 4)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="middleName1Girl"
                    value={formData.middleName1Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="1er deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName2Girl"
                    value={formData.middleName2Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="2ème deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName3Girl"
                    value={formData.middleName3Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="3ème deuxième prénom"
                  />
                  <input
                    type="text"
                    name="middleName4Girl"
                    value={formData.middleName4Girl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="4ème deuxième prénom"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Special Message */}
          <div className="bg-pink-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
              <span className="mr-2">💝</span> Message spécial
            </h3>
            <textarea
              name="specialMessage"
              value={formData.specialMessage}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Laissez un doux message aux futurs parents..."
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
              Envoi en cours...
            </span>
          ) : (
            'Envoyer mon pronostic 🎯'
          )}
        </button>
      </form>
    </div>
  );
};

export default GuessForm; 