import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Image as ImageIcon, 
  Menu, 
  ArrowLeft,
  Volume2,
  VolumeX,
  AlertCircle,
  Shield,
  Calendar,
  Users
} from 'lucide-react';

const ChatScreen = ({ selectedLanguage, sessionId }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: getWelcomeMessage(),
      timestamp: new Date(),
      messageType: 'text'
    };
    setMessages([welcomeMessage]);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      english: "Hello! I'm your AI Health Assistant. I can help you with disease symptoms, vaccination reminders, health tips, and answer your health-related questions. You can type, speak, or even send images for health analysis. How can I assist you today?",
      hindi: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। मैं बीमारी के लक्षणों, टीकाकरण रिमाइंडर, स्वास्थ्य सुझावों और आपके स्वास्थ्य संबंधी प्रश्नों में आपकी मदद कर सकता हूँ। आप टाइप कर सकते हैं, बोल सकते हैं, या स्वास्थ्य विश्लेषण के लिए चित्र भी भेज सकते हैं। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
      tamil: "வணக்கம்! நான் உங்கள் AI ஆரோக்கிய உதவியாளர். நோய் அறிகுறிகள், தடுப்பூசி நினைவூட்டல்கள், ஆரோக்கிய குறிப்புகள் மற்றும் உங்கள் ஆரோக்கிய தொடர்பான கேள்விகளில் உங்களுக்கு உதவ முடியும். நீங்கள் தட்டச்சு செய்யலாம், பேசலாம் அல்லது ஆரோக்கிய பகுப்பாய்விற்கு படங்களையும் அனுப்பலாம். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
      telugu: "నమస్కారం! నేను మీ AI ఆరోగ్య సహాయకుడిని. వ్యాధి లక్షణాలు, వ్యాక్సినేషన్ రిమైండర్లు, ఆరోగ్య చిట్కాలు మరియు మీ ఆరోగ్య సంబంధిత ప్రశ్నలలో మీకు సహాయం చేయగలను. మీరు టైప్ చేయవచ్చు, మాట్లాడవచ్చు లేదా ఆరోగ్య విశ్లేషణ కోసం చిత్రాలను కూడా పంపవచ్చు. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      bengali: "নমস্কার! আমি আপনার AI স্বাস্থ্য সহায়ক। রোগের লক্ষণ, টিকাদানের অনুস্মারক, স্বাস্থ্য পরামর্শ এবং আপনার স্বাস্থ্য সম্পর্কিত প্রশ্নে সাহায্য করতে পারি। আপনি টাইপ করতে পারেন, কথা বলতে পারেন বা স্বাস্থ্য বিশ্লেষণের জন্য ছবিও পাঠাতে পারেন। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      marathi: "नमस्कार! मी तुमचा AI आरोग्य सहाय्यक आहे। रोगाची लक्षणे, लसीकरण स्मरणे, आरोग्य टिप्स आणि तुमच्या आरोग्य संबंधित प्रश्नांमध्ये मदत करू शकतो. तुम्ही टाइप करू शकता, बोलू शकता किंवा आरोग्य विश्लेषणासाठी चित्रे देखील पाठवू शकता. आज मी तुम्हाला कशी मदत करू शकतो?",
      gujarati: "નમસ્તે! હું તમારો AI આરોગ્ય સહાયક છું. રોગના લક્ષણો, રસીકરણ રિમાઇન્ડર, આરોગ્ય ટીપ્સ અને તમારા આરોગ્ય સંબંધિત પ્રશ્નોમાં મદદ કરી શકું છું. તમે ટાઇપ કરી શકો છો, બોલી શકો છો અથવા આરોગ્ય વિશ્લેષણ માટે ચિત્રો પણ મોકલી શકો છો. આજે હું તમારી કેવી રીતે મદદ કરી શકું?"
    };
    return welcomeMessages[selectedLanguage] || welcomeMessages.english;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = inputMessage, messageType = 'text', imageFile = null) => {
    if (!message.trim() && !imageFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      messageType: messageType,
      image: imageFile ? URL.createObjectURL(imageFile) : null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      let response;
      
      if (imageFile) {
        // Handle image analysis
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('question', message || 'What health information can you provide from this image?');
        formData.append('language', selectedLanguage);
        formData.append('session_id', sessionId);

        response = await axios.post(`${backendUrl}/api/analyze-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.analysis,
          timestamp: new Date(),
          messageType: 'image_analysis'
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle regular text message
        response = await axios.post(`${backendUrl}/api/chat`, {
          message,
          language: selectedLanguage,
          session_id: sessionId
        });

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.response,
          timestamp: new Date(),
          messageType: 'text'
        };

        setMessages(prev => [...prev, aiMessage]);

        // Auto-speak AI response if enabled
        if (isSpeaking) {
          speakText(response.data.response);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        messageType: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        handleVoiceMessage(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleVoiceMessage = async (audioBlob) => {
    // For now, we'll show a placeholder for voice processing
    const voiceMessage = {
      id: Date.now(),
      type: 'user',
      content: '🎤 Voice message',
      timestamp: new Date(),
      messageType: 'voice'
    };

    setMessages(prev => [...prev, voiceMessage]);

    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      content: 'I received your voice message! Voice processing is being implemented. For now, please type your question.',
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, aiResponse]);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Auto-send image with default question
      handleSendMessage('Analyze this health-related image', 'image', file);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedLanguage);
      speechSynthesis.speak(utterance);
    }
  };

  const getLanguageCode = (language) => {
    const languageCodes = {
      english: 'en-US',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      telugu: 'te-IN',
      bengali: 'bn-IN',
      marathi: 'mr-IN',
      gujarati: 'gu-IN'
    };
    return languageCodes[language] || 'en-US';
  };

  const handleQuickAction = async (action) => {
    const quickQuestions = {
      symptoms: {
        english: "What are the common symptoms of dengue fever?",
        hindi: "डेंगू बुखार के सामान्य लक्षण क्या हैं?",
        tamil: "டெங்கு காய்ச்சலின் பொதுவான அறிகுறிகள் என்ன?",
        telugu: "డెంగ్యూ జ్వరం యొక్క సాధారణ లక్షణాలు ఏమిటి?",
        bengali: "ডেঙ্গু জ্বরের সাধারণ লক্ষণগুলি কী?",
        marathi: "डेंग्यू तापाची सामान्य लक्षणे काय आहेत?",
        gujarati: "ડેન્ગ્યુ તાવના સામાન્ય લક્ષણો શું છે?"
      },
      vaccination: {
        english: "When is the next vaccination due for children?",
        hindi: "बच्चों के लिए अगला टीकाकरण कब होना चाहिए?",
        tamil: "குழந்தைகளுக்கு அடுத்த தடுப்பூசி எப்போது?",
        telugu: "పిల్లలకు తదుపరి వ్యాక్సినేషన్ ఎప్పుడు?",
        bengali: "শিশুদের পরবর্তী টিকা কখন দেওয়া উচিত?",
        marathi: "मुलांसाठी पुढील लसीकरण कधी आहे?",
        gujarati: "બાળકો માટે આગામી રસીકરણ ક્યારે છે?"
      },
      prevention: {
        english: "How can I prevent malaria?",
        hindi: "मैं मलेरिया से कैसे बच सकता हूँ?",
        tamil: "மலேரியாவை எவ்வாறு தடுக்கலாம்?",
        telugu: "మలేరియాను ఎలా నివారించవచ్చు?",
        bengali: "আমি কীভাবে ম্যালেরিয়া প্রতিরোধ করতে পারি?",
        marathi: "मी मलेरिया कसा टाळू शकतो?",
        gujarati: "હું મેલેરિયાને કેવી રીતે અટકાવી શકું?"
      }
    };

    const question = quickQuestions[action][selectedLanguage] || quickQuestions[action].english;
    handleSendMessage(question);
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/language')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-800">Health AI Assistant</h1>
            <p className="text-sm text-gray-500">
              Language: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`p-2 rounded-full transition-colors ${
              isSpeaking ? 'bg-health-primary text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Quick Actions Menu */}
      {showMenu && (
        <div className="bg-white border-b p-4 slide-up">
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickAction('symptoms')}
              className="flex flex-col items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
              <span className="text-xs text-red-700 font-medium">Symptoms</span>
            </button>
            <button
              onClick={() => handleQuickAction('vaccination')}
              className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Shield className="w-6 h-6 text-blue-500 mb-1" />
              <span className="text-xs text-blue-700 font-medium">Vaccines</span>
            </button>
            <button
              onClick={() => handleQuickAction('prevention')}
              className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Users className="w-6 h-6 text-green-500 mb-1" />
              <span className="text-xs text-green-700 font-medium">Prevention</span>
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-appear`}
          >
            <div
              className={`chat-message ${
                message.type === 'user' ? 'chat-message-user' : 'chat-message-ai'
              }`}
            >
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Uploaded" 
                  className="max-w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-message chat-message-ai">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          {/* Image Upload */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-3 text-gray-500 hover:text-health-primary hover:bg-health-light rounded-full transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Type your health question..."
              className="w-full p-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-health-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Voice Recording */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 text-white recording' 
                : 'text-gray-500 hover:text-health-primary hover:bg-health-light'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-3 rounded-full transition-all duration-200 ${
              inputMessage.trim() && !isLoading
                ? 'bg-health-primary text-white hover:bg-health-accent shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;