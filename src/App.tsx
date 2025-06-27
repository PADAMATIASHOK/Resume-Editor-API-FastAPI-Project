import React, { useState } from 'react';
import { FileUp, Save, Download, Eye, FileText } from 'lucide-react';
import { useResume } from './hooks/useResume';
import { FileUpload } from './components/FileUpload';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ApiService } from './services/api';

function App() {
  const {
    resume,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    loadDummyResume,
  } = useResume();

  const [isUploaded, setIsUploaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          // Validate minimal structure (optional: add more checks)
          if (json.personalInfo && json.experience && json.education && json.skills) {
            // Directly set resume state using your hook's setResume
            if (typeof updatePersonalInfo === 'function') updatePersonalInfo(json.personalInfo);
            if (typeof updateSummary === 'function') updateSummary(json.summary || '');
            if (typeof addExperience === 'function' && Array.isArray(json.experience)) {
              // Remove all and add new (if needed)
              json.experience.forEach((exp: any) => addExperience(exp));
            }
            if (typeof addEducation === 'function' && Array.isArray(json.education)) {
              json.education.forEach((edu: any) => addEducation(edu));
            }
            if (typeof addSkill === 'function' && Array.isArray(json.skills)) {
              json.skills.forEach((skill: any) => addSkill(skill));
            }
            setIsUploaded(true);
          } else {
            alert('Invalid resume JSON structure.');
          }
        } catch (err) {
          alert('Failed to parse JSON resume.');
        }
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // PDF upload: send to backend for parsing
      const formData = new FormData();
      formData.append('file', file);
      fetch('http://localhost:8000/parse-resume', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.text) {
            // --- Personal Info ---
            const nameMatch = data.text.match(/Name[:\-]?\s*(.*)/i);
            const emailMatch = data.text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
            const phoneMatch = data.text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
            const locationMatch = data.text.match(/Location[:\-]?\s*(.*)/i);
            const linkedinMatch = data.text.match(/linkedin\.com\/[^\s)]+/i);
            const websiteMatch = data.text.match(/(https?:\/\/[^\s)]+)/i);

            const personalInfo = {
              name: nameMatch ? nameMatch[1].trim() : '',
              email: emailMatch ? emailMatch[0] : '',
              phone: phoneMatch ? phoneMatch[0] : '',
              location: locationMatch ? locationMatch[1].trim() : '',
              linkedin: linkedinMatch ? linkedinMatch[0] : '',
              website: websiteMatch ? websiteMatch[0] : '',
            };
            if (typeof updatePersonalInfo === 'function') updatePersonalInfo(personalInfo);

            // --- Section Splitting ---
            const sections = data.text.split(/(?:\n|^)(?=Experience|Education|Skills|Summary)/gi);
            let summary = '';
            let experience = [];
            let education = [];
            let skills = [];

            // --- Summary ---
            const summarySection = data.text.match(/Summary[:\-]?\s*([\s\S]*?)(?=\n(?:Experience|Education|Skills|$))/i);
            if (summarySection) summary = summarySection[1].trim();
            if (typeof updateSummary === 'function') updateSummary(summary);

            // --- Experience ---
            const experienceSection = data.text.match(/Experience[:\-]?\s*([\s\S]*?)(?=\n(?:Education|Skills|$))/i);
            if (experienceSection) {
              experience = experienceSection[1]
                .split(/\n{2,}/)
                .map(block => {
                  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                  return {
                    id: Math.random().toString(36).substr(2, 9),
                    company: lines[0] || '',
                    position: lines[1] || '',
                    startDate: '',
                    endDate: '',
                    description: lines.slice(2).join(' ')
                  };
                })
                .filter(exp => exp.company || exp.position);
              if (typeof addExperience === 'function') experience.forEach(exp => addExperience(exp));
            }

            // --- Education ---
            const educationSection = data.text.match(/Education[:\-]?\s*([\s\S]*?)(?=\n(?:Experience|Skills|$))/i);
            if (educationSection) {
              education = educationSection[1]
                .split(/\n{2,}/)
                .map(block => {
                  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                  return {
                    id: Math.random().toString(36).substr(2, 9),
                    institution: lines[0] || '',
                    degree: lines[1] || '',
                    startDate: '',
                    endDate: '',
                    description: lines.slice(2).join(' ')
                  };
                })
                .filter(edu => edu.institution || edu.degree);
              if (typeof addEducation === 'function') education.forEach(edu => addEducation(edu));
            }

            // --- Skills ---
            const skillsSection = data.text.match(/Skills[:\-]?\s*([\s\S]*?)(?=\n(?:Experience|Education|$))/i);
            if (skillsSection) {
              skills = skillsSection[1]
                .split(/,|\n/)
                .map(skill => skill.trim())
                .filter(Boolean)
                .map(skill => ({ id: Math.random().toString(36).substr(2, 9), name: skill }));
              if (typeof addSkill === 'function') skills.forEach(skill => addSkill(skill));
            }

            setIsUploaded(true);
          } else {
            alert('Failed to extract text from PDF.');
          }
        })
        .catch(() => alert('Failed to parse PDF resume.'));
    } else {
      alert('Please upload a valid JSON or PDF resume file.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await ApiService.saveResume(resume);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${resume.personalInfo.name || 'resume'}_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLoadDemo = () => {
    loadDummyResume();
    setIsUploaded(true);
  };

  if (!isUploaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-blue-600 p-3 rounded-full">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Editor</h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, edit, and enhance your professional resume with AI assistance
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />
            
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={handleLoadDemo}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Eye className="h-5 w-5 mr-2" />
                Load Demo Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Editor</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsUploaded(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <FileUp className="h-4 w-4 mr-2" />
                Upload New
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors duration-200"
              >
                <Save className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? 'Saving...' : 'Save Resume'}
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <PersonalInfoSection
            personalInfo={resume.personalInfo}
            onUpdate={updatePersonalInfo}
          />

          <SummarySection
            summary={resume.summary}
            onUpdate={updateSummary}
          />

          <ExperienceSection
            experience={resume.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />

          <EducationSection
            education={resume.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />

          <SkillsSection
            skills={resume.skills}
            onAdd={addSkill}
            onUpdate={updateSkill}
            onRemove={removeSkill}
          />
        </div>
      </div>
    </div>
  );
}

export default App;