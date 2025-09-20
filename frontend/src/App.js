import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import LanguageScreen from './components/LanguageScreen';
import ChatScreen from './components/ChatScreen';
import BenefitsScreen from './components/BenefitsScreen';
import ContactScreen from './components/ContactScreen';
import './App.css';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Generate session ID on app start
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-health-light via-white to-blue-50 font-health">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route 
            path="/language" 
            element={
              <LanguageScreen 
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ChatScreen 
                selectedLanguage={selectedLanguage}
                sessionId={sessionId}
              />
            } 
          />
          <Route path="/benefits" element={<BenefitsScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;