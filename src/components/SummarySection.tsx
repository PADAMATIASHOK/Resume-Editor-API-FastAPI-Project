import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { ApiService } from '../services/api';

interface SummarySectionProps {
  summary: string;
  onUpdate: (summary: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  onUpdate,
}) => {
  const [isEnhancing, setIsEnhancing] = React.useState(false);

  const handleEnhance = async () => {
    if (!summary.trim()) {
      alert('Please write a summary first before enhancing');
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await ApiService.enhanceWithAI('summary', summary);
      onUpdate(enhanced);
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance summary. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => onUpdate(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
          placeholder="Write a brief professional summary highlighting your key skills, experience, and career objectives..."
        />
      </div>
    </div>
  );
};