import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Search, 
  Shield, 
  Users, 
  Heart, 
  Stethoscope,
  Calendar,
  AlertTriangle,
  Globe
} from 'lucide-react';

const BenefitsScreen = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Brain,
      title: "AI-Powered Health Awareness",
      description: "Get instant, accurate health information powered by advanced AI technology that understands your local context and health concerns.",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Search,
      title: "Early Disease Detection",
      description: "Identify potential health issues early through symptom analysis and get guidance on when to seek professional medical help.",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Shield,
      title: "Vaccination Reminders",
      description: "Never miss important vaccinations with personalized reminders for children and adults based on government schedules.",
      color: "text-health-primary",
      bgColor: "bg-health-light"
    },
    {
      icon: Users,
      title: "Community Health Inclusivity",
      description: "Access health information in your native language, making healthcare knowledge accessible to all community members.",
      color: "text-health-secondary",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "Preventive Care Focus",
      description: "Learn prevention strategies for common diseases like dengue, malaria, and seasonal health issues specific to your region.",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Stethoscope,
      title: "Professional Medical Guidance",
      description: "Receive guidance on when to consult healthcare professionals and what questions to ask during medical visits.",
      color: "text-health-accent",
      bgColor: "bg-green-50"
    },
    {
      icon: Calendar,
      title: "Health Schedule Management",
      description: "Keep track of vaccination schedules, health checkups, and seasonal health precautions with intelligent reminders.",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      icon: AlertTriangle,
      title: "Real-time Health Alerts",
      description: "Stay informed about disease outbreaks, health advisories, and government health recommendations in your area.",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description: "Access health information in English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and other regional languages.",
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-light via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-health-dark">Health Chatbot Benefits</h1>
          <p className="text-sm text-gray-600">Discover how AI can improve your health journey</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-health-dark mb-4">
            Empowering Communities Through AI Health Technology
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Our AI Health Chatbot bridges the gap between technology and healthcare, making quality health information accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="health-card hover:scale-[1.02] transition-transform duration-200 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="px-4 py-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-health-dark text-center mb-8">
            Key Features That Make a Difference
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-health-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Image Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Upload photos for health-related analysis including symptoms, medical documents, and prescriptions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-health-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Voice Interaction</h4>
                <p className="text-gray-600 text-sm">
                  Speak naturally to get health advice, perfect for users who prefer voice communication.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-health-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Contextual Understanding</h4>
                <p className="text-gray-600 text-sm">
                  AI understands local health contexts, seasonal diseases, and regional health challenges.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">24/7 Availability</h4>
                <p className="text-gray-600 text-sm">
                  Get health guidance anytime, anywhere, without waiting for appointment slots.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-health-dark mb-4">
            Ready to Start Your Health Journey?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of users who are already benefiting from AI-powered health assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/language')}
              className="btn-primary text-lg py-4 px-8"
            >
              Start Chatting Now
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="btn-secondary text-lg py-4 px-8"
            >
              Get Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsScreen;