import React from 'react';
import { Briefcase, Plus, Trash2, Sparkles } from 'lucide-react';
import { Experience } from '../types/resume';
import { ApiService } from '../services/api';

interface ExperienceSectionProps {
  experience: Experience[];
  onAdd: (experience: Omit<Experience, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onRemove: (id: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const [enhancingId, setEnhancingId] = React.useState<string | null>(null);

  const handleAddExperience = () => {
    onAdd({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
  };

  const handleEnhance = async (id: string, description: string) => {
    if (!description.trim()) {
      alert('Please write a description first before enhancing');
      return;
    }

    setEnhancingId(id);
    try {
      const enhanced = await ApiService.enhanceWithAI('experience', description);
      onUpdate(id, { description: enhanced });
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance description. Please try again.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
        </div>
        <button
          onClick={handleAddExperience}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => onUpdate(exp.id, { company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => onUpdate(exp.id, { position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Job Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => onUpdate(exp.id, { startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => onUpdate(exp.id, { endDate: e.target.value })}
                        disabled={exp.current}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-colors duration-200"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => onUpdate(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Current</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <button
                      onClick={() => handleEnhance(exp.id, exp.description)}
                      disabled={enhancingId === exp.id}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                    >
                      <Sparkles className={`h-3 w-3 mr-1 ${enhancingId === exp.id ? 'animate-spin' : ''}`} />
                      {enhancingId === exp.id ? 'Enhancing...' : 'Enhance'}
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => onUpdate(exp.id, { description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors duration-200"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>

              <button
                onClick={() => onRemove(exp.id)}
                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {experience.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No experience added yet. Click "Add Experience" to get started.
          </div>
        )}
      </div>
    </div>
  );
};