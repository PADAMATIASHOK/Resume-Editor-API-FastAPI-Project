import { useState } from 'react';
import { Resume, PersonalInfo, Experience, Education, Skill, Project } from '../types/resume';

const initialPersonalInfo: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
};

const initialResume: Resume = {
  personalInfo: initialPersonalInfo,
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export const useResume = () => {
  const [resume, setResume] = useState<Resume>(initialResume);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const updateSummary = (summary: string) => {
    setResume(prev => ({ ...prev, summary }));
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString(),
    };
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: Date.now().toString(),
    };
    setResume(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString(),
    };
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, ...updates } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const loadDummyResume = () => {
    setResume({
      personalInfo: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe',
        website: 'johndoe.dev',
      },
      summary: 'Experienced full-stack developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and leading development teams.',
      experience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: 'Led development of microservices architecture, implemented CI/CD pipelines, and mentored junior developers.',
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          startDate: '2020-06',
          endDate: '2021-12',
          current: false,
          description: 'Built responsive web applications using React and Node.js, integrated payment systems, and optimized database performance.',
        },
      ],
      education: [
        {
          id: '1',
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '3.8',
        },
      ],
      skills: [
        { id: '1', name: 'JavaScript', level: 'Expert' },
        { id: '2', name: 'React', level: 'Expert' },
        { id: '3', name: 'Node.js', level: 'Advanced' },
        { id: '4', name: 'Python', level: 'Intermediate' },
        { id: '5', name: 'AWS', level: 'Advanced' },
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL.',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
          url: 'https://github.com/johndoe/ecommerce',
        },
      ],
    });
  };

  return {
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
    addProject,
    updateProject,
    removeProject,
    loadDummyResume,
  };
};