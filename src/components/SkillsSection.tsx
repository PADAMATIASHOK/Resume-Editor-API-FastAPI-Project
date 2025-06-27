import React from 'react';
import { Zap, Plus, Trash2, Sparkles } from 'lucide-react';
import { Skill } from '../types/resume';
import { ApiService } from '../services/api';

interface SkillsSectionProps {
  skills: Skill[];
  onAdd: (skill: Omit<Skill, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Skill>) => void;
  onRemove: (id: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const [isEnhancing, setIsEnhancing] = React.useState(false);

  const handleAddSkill = () => {
    onAdd({
      name: '',
      level: 'Intermediate',
    });
  };

  const handleEnhance = async () => {
    if (skills.length === 0) {
      alert('Please add some skills first before enhancing');
      return;
    }

    setIsEnhancing(true);
    try {
      const skillsContent = skills.map(skill => `${skill.name} (${skill.level})`).join(', ');
      const enhanced = await ApiService.enhanceWithAI('skills', skillsContent);
      alert(`AI Enhanced Skills:\n${enhanced}`);
    } catch (error) {
      console.error('Enhancement failed:', error);
      alert('Failed to enhance skills. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            <Sparkles className={`h-4 w-4 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
          </button>
          <button
            onClick={handleAddSkill}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => onUpdate(skill.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 transition-colors duration-200"
                placeholder="Skill name"
              />
              <select
                value={skill.level}
                onChange={(e) => onUpdate(skill.id, { level: e.target.value as Skill['level'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button
              onClick={() => onRemove(skill.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No skills added yet. Click "Add Skill" to get started.
        </div>
      )}
    </div>
  );
};