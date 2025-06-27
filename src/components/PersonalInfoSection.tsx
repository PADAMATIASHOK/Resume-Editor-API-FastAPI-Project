import React from 'react';
import { User, Sparkles } from 'lucide-react';
import { PersonalInfo } from '../types/resume';
import { ApiService } from '../services/api';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  onUpdate: (info: Partial<PersonalInfo>) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  onUpdate,
}) => {
  const [isEnhancing, setIsEnhancing] = React.useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const content = `${personalInfo.name} - ${personalInfo.email} - ${personalInfo.phone} - ${personalInfo.location}`;
      const enhanced = await ApiService.enhanceWithAI('personal_info', content);
      // For demo purposes, we'll just show the enhanced content in an alert
      alert(`AI Enhanced Personal Info:\n${enhanced}`);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        </div>
        <button
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
        >
          <Sparkles className={`h-4 w-4 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={personalInfo.linkedin}
            onChange={(e) => onUpdate({ linkedin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={personalInfo.website}
            onChange={(e) => onUpdate({ website: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            placeholder="johndoe.dev"
          />
        </div>
      </div>
    </div>
  );
};