import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

const ContactScreen = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('emergency');

  const emergencyContacts = [
    {
      name: "National Emergency Helpline",
      number: "108",
      description: "24/7 medical emergency services",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      name: "COVID-19 Helpline",
      number: "1075",
      description: "COVID-19 related queries and support",
      icon: Heart,
      color: "text-blue-500"
    },
    {
      name: "Mental Health Helpline",
      number: "9152987821",
      description: "Mental health support and counseling",
      icon: Users,
      color: "text-purple-500"
    }
  ];

  const healthCenters = [
    {
      name: "Primary Health Centre (PHC)",
      description: "Basic healthcare services, vaccinations",
      timing: "9:00 AM - 5:00 PM",
      services: ["General consultation", "Vaccinations", "Basic treatments"]
    },
    {
      name: "Community Health Centre (CHC)",
      description: "Advanced healthcare services, specialist consultation",
      timing: "24/7 Emergency, 9:00 AM - 5:00 PM OPD",
      services: ["Specialist consultation", "Laboratory services", "Emergency care"]
    },
    {
      name: "District Hospital",
      description: "Comprehensive healthcare services",
      timing: "24/7",
      services: ["All specialties", "Surgery", "ICU", "Emergency care"]
    }
  ];

  const supportChannels = [
    {
      title: "AI Chatbot Support",
      description: "Get help with using the AI Health Chatbot",
      action: "Chat Now",
      icon: MessageCircle,
      color: "bg-health-primary",
      onClick: () => navigate('/chat')
    },
    {
      title: "Technical Issues",
      description: "Report bugs or technical problems",
      action: "Report Issue",
      icon: AlertCircle,
      color: "bg-orange-500",
      onClick: () => window.open('mailto:support@aihealthbot.com?subject=Technical Issue')
    },
    {
      title: "Feature Request",
      description: "Suggest new features or improvements",
      action: "Send Feedback",
      icon: Heart,
      color: "bg-pink-500",
      onClick: () => window.open('mailto:feedback@aihealthbot.com?subject=Feature Request')
    }
  ];

  const categories = [
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'centers', label: 'Health Centers', icon: MapPin },
    { id: 'support', label: 'App Support', icon: MessageCircle }
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
          <h1 className="text-xl font-bold text-health-dark">Contact & Help</h1>
          <p className="text-sm text-gray-600">Get support and find health resources</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-health-dark mb-4">
            Need Help or Support?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Find emergency contacts, locate nearby health centers, or get support with the AI Health Chatbot.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-health-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-health-primary'
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                <span className="font-medium text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on selected category */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Emergency Contacts */}
          {selectedCategory === 'emergency' && (
            <div className="space-y-6 fade-in">
              <div className="text-center mb-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-health-dark mb-2">Emergency Contacts</h3>
                <p className="text-gray-600">Important helpline numbers for medical emergencies</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="health-card text-center">
                    <div className="mb-4">
                      <contact.icon className={`w-8 h-8 ${contact.color} mx-auto mb-2`} />
                      <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                    </div>
                    <div className="mb-4">
                      <a
                        href={`tel:${contact.number}`}
                        className="text-2xl font-bold text-health-primary hover:text-health-accent transition-colors"
                      >
                        {contact.number}
                      </a>
                    </div>
                    <p className="text-sm text-gray-600">{contact.description}</p>
                    <button
                      onClick={() => window.open(`tel:${contact.number}`)}
                      className="mt-4 w-full btn-primary py-2 text-sm"
                    >
                      <Phone className="w-4 h-4 inline mr-2" />
                      Call Now
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Important Emergency Guidelines</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Call 108 for any medical emergency</li>
                      <li>• Keep these numbers saved in your phone</li>
                      <li>• Provide clear location information when calling</li>
                      <li>• Stay calm and follow dispatcher instructions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Centers */}
          {selectedCategory === 'centers' && (
            <div className="space-y-6 fade-in">
              <div className="text-center mb-8">
                <MapPin className="w-12 h-12 text-health-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-health-dark mb-2">Health Centers</h3>
                <p className="text-gray-600">Find nearby healthcare facilities and services</p>
              </div>

              <div className="space-y-6">
                {healthCenters.map((center, index) => (
                  <div key={index} className="health-card">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{center.name}</h4>
                        <p className="text-gray-600 mb-3">{center.description}</p>
                      </div>
                      <MapPin className="w-6 h-6 text-health-primary flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      {center.timing}
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-800 mb-2">Services Available:</h5>
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, serviceIndex) => (
                          <span
                            key={serviceIndex}
                            className="px-3 py-1 bg-health-light text-health-dark text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full btn-secondary py-2 text-sm">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Find Nearest Location
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-health-light border border-health-primary/20 rounded-lg p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-health-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-health-dark mb-2">How to Find Health Centers</h4>
                    <ul className="text-sm text-health-dark space-y-1">
                      <li>• Use government health facility locator websites</li>
                      <li>• Contact your local ASHA worker for guidance</li>
                      <li>• Ask at the nearest Anganwadi center</li>
                      <li>• Call the district health office for information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App Support */}
          {selectedCategory === 'support' && (
            <div className="space-y-6 fade-in">
              <div className="text-center mb-8">
                <MessageCircle className="w-12 h-12 text-health-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-health-dark mb-2">App Support</h3>
                <p className="text-gray-600">Get help with using the AI Health Chatbot</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportChannels.map((channel, index) => (
                  <div key={index} className="health-card text-center">
                    <div className={`w-12 h-12 ${channel.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <channel.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-3">{channel.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
                    <button
                      onClick={channel.onClick}
                      className="w-full btn-primary py-2 text-sm"
                    >
                      {channel.action}
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="health-card">
                  <h4 className="font-semibold text-gray-800 mb-3">Frequently Asked Questions</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Q: How accurate is the AI health advice?</p>
                      <p className="text-gray-600">A: Our AI provides educational information. Always consult healthcare professionals for medical decisions.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Q: Is my health data secure?</p>
                      <p className="text-gray-600">A: Yes, we follow strict privacy guidelines and don't store personal health information.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Q: Can I use this in offline mode?</p>
                      <p className="text-gray-600">A: Currently, internet connection is required for AI responses.</p>
                    </div>
                  </div>
                </div>

                <div className="health-card">
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-health-primary mr-3" />
                      <span className="text-gray-600">support@aihealthbot.com</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-health-primary mr-3" />
                      <span className="text-gray-600">24/7 AI Support Available</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-health-primary mr-3" />
                      <span className="text-gray-600">Community health focused</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;