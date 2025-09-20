import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Users, Stethoscope } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 fade-in">
      <div className="text-center max-w-md w-full">
        {/* Health Icons Animation */}
        <div className="flex justify-center mb-8 space-x-4">
          <div className="health-icon animate-bounce" style={{ animationDelay: '0s' }}>
            <Stethoscope className="w-12 h-12 text-health-primary" />
          </div>
          <div className="health-icon animate-bounce" style={{ animationDelay: '0.2s' }}>
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <div className="health-icon animate-bounce" style={{ animationDelay: '0.4s' }}>
            <Shield className="w-12 h-12 text-health-secondary" />
          </div>
          <div className="health-icon animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Users className="w-12 h-12 text-health-accent" />
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-health-dark mb-4 leading-tight">
          AI-Driven Public Health Chatbot
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your intelligent health companion for disease prevention, vaccination reminders, and health awareness
        </p>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/50 rounded-lg p-3 border border-health-primary/20">
            <Stethoscope className="w-6 h-6 text-health-primary mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Symptom Check</p>
          </div>
          <div className="bg-white/50 rounded-lg p-3 border border-health-secondary/20">
            <Shield className="w-6 h-6 text-health-secondary mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Vaccination</p>
          </div>
          <div className="bg-white/50 rounded-lg p-3 border border-red-500/20">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Health Tips</p>
          </div>
          <div className="bg-white/50 rounded-lg p-3 border border-health-accent/20">
            <Users className="w-6 h-6 text-health-accent mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">Community</p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => navigate('/language')}
          className="btn-primary w-full text-lg py-4 transform hover:scale-[1.02] transition-transform duration-200 shadow-lg"
        >
          Get Started
        </button>

        {/* Navigation Links */}
        <div className="mt-6 flex justify-center space-x-4 text-sm">
          <button
            onClick={() => navigate('/benefits')}
            className="text-health-primary hover:text-health-accent underline"
          >
            Learn Benefits
          </button>
          <span className="text-gray-400">•</span>
          <button
            onClick={() => navigate('/contact')}
            className="text-health-primary hover:text-health-accent underline"
          >
            Get Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;