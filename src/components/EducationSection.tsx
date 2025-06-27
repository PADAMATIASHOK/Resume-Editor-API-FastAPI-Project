import React from 'react';
import { GraduationCap, Plus, Trash2, Sparkles } from 'lucide-react';
import { Education } from '../types/resume';
import { ApiService } from '../services/api';

interface EducationSectionProps {
  education: Education[];
  onAdd: (education: Omit<Education, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onRemove: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const [enhancingId, setEnhancingId] = React.useState<string | null>(null);

  const handleAddEducation = () => {
    onAdd({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  };

  const handleEnhance = async (id: string, edu: Education) => {
    const content = `${edu.degree} in ${edu.field} from ${edu.institution}`;
    if (!content.trim()) {
      alert('Please fill in education details first before enhancing');
      return;
    }

    setEnhancingId(id);
    try {
      const enhanced = await ApiService.enhanceWithAI('education', content);
      alert(`AI Enhanced Education:\n${enhanced}`);
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance education. Please try again.');
    } finally {
      setEnhancingId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        </div>
        <button
          onClick={handleAddEducation}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => onUpdate(edu.id, { institution: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="University Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => onUpdate(edu.id, { degree: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => onUpdate(edu.id, { field: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Computer Science"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GPA (Optional)
                    </label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => onUpdate(edu.id, { gpa: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="3.8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => onUpdate(edu.id, { startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => onUpdate(edu.id, { endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleEnhance(edu.id, edu)}
                    disabled={enhancingId === edu.id}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    <Sparkles className={`h-3 w-3 mr-1 ${enhancingId === edu.id ? 'animate-spin' : ''}`} />
                    {enhancingId === edu.id ? 'Enhancing...' : 'Enhance'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => onRemove(edu.id)}
                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No education added yet. Click "Add Education" to get started.
          </div>
        )}
      </div>
    </div>
  );
};