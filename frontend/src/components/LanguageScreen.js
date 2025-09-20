import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Globe } from 'lucide-react';
import axios from 'axios';

const LanguageScreen = ({ selectedLanguage, setSelectedLanguage }) => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/supported-languages`);
      setLanguages(response.data.languages);
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback languages
      setLanguages([
        { code: 'english', name: 'English', native_name: 'English' },
        { code: 'hindi', name: 'Hindi', native_name: 'हिंदी' },
        { code: 'tamil', name: 'Tamil', native_name: 'தமிழ்' },
        { code: 'telugu', name: 'Telugu', native_name: 'తెలుగు' },
        { code: 'bengali', name: 'Bengali', native_name: 'বাংলা' },
        { code: 'marathi', name: 'Marathi', native_name: 'मराठी' },
        { code: 'gujarati', name: 'Gujarati', native_name: 'ગુજરાતી' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate('/chat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 fade-in">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Globe className="w-16 h-16 text-health-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-health-dark mb-2">
            Choose Your Language
          </h1>
          <p className="text-gray-600">
            Select your preferred language for a better experience
          </p>
        </div>

        {/* Language Options */}
        <div className="space-y-3 mb-8">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-gray-800">
                  {language.native_name}
                </span>
                <span className="text-sm text-gray-500">
                  {language.name}
                </span>
              </div>
              <ChevronRight 
                className={`w-5 h-5 transition-colors duration-200 ${
                  selectedLanguage === language.code 
                    ? 'text-health-primary' 
                    : 'text-gray-400'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
            selectedLanguage
              ? 'btn-primary transform hover:scale-[1.02] shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Chat
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 py-3 text-health-primary hover:text-health-accent font-medium transition-colors duration-200"
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
};

export default LanguageScreen;