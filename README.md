# Resume Editor

A modern, full-featured resume editor with AI enhancement capabilities. Built with React.js frontend and FastAPI backend.

## Features

### Frontend (React.js)
- **File Upload**: Drag-and-drop interface for PDF and DOCX files
- **Resume Editing**: Comprehensive editing for all resume sections
  - Personal Information
  - Professional Summary
  - Work Experience
  - Education
  - Skills
  - Projects
- **AI Enhancement**: One-click AI improvements for each section
- **Save & Download**: Save to backend and download as JSON
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Clean, professional interface with smooth animations

### Backend (FastAPI)
- **AI Enhancement API**: Mock AI service for content improvement
- **Resume Storage**: Save and retrieve resume data
- **CORS Support**: Configured for local development
- **RESTful APIs**: Clean, documented API endpoints

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Python, FastAPI, Pydantic
- **Build Tool**: Vite
- **Styling**: Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the FastAPI server**:
   ```bash
   python main.py
   ```

The backend API will be available at `http://localhost:8000`

## API Endpoints

### POST /ai-enhance
Enhance resume section content with AI.

**Request Body**:
```json
{
  "section": "summary",
  "content": "Experienced developer with 5 years of experience..."
}
```

**Response**:
```json
{
  "enhanced_content": "Results-driven professional with proven expertise..."
}
```

### POST /save-resume
Save complete resume data.

**Request Body**:
```json
{
  "personalInfo": { "name": "John Doe", ... },
  "summary": "Professional summary...",
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...]
}
```

### GET /resumes
List all saved resumes.

### GET /resume/{resume_id}
Retrieve specific resume by ID.

## Usage

1. **Start both servers**: Run the frontend (`npm run dev`) and backend (`python main.py`)
2. **Upload Resume**: Drag and drop a PDF/DOCX file or click "Load Demo Resume"
3. **Edit Content**: Use the intuitive interface to edit all resume sections
4. **Enhance with AI**: Click "Enhance with AI" buttons to improve content
5. **Save**: Click "Save Resume" to store data on the backend
6. **Download**: Click "Download JSON" to get your resume as a JSON file

## Project Structure

```
resume-editor/
├── src/
│   ├── components/          # React components
│   │   ├── FileUpload.tsx
│   │   ├── PersonalInfoSection.tsx
│   │   ├── SummarySection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   └── SkillsSection.tsx
│   ├── hooks/              # React hooks
│   │   └── useResume.ts
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript types
│   │   └── resume.ts
│   └── App.tsx
├── backend/
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── data/              # Resume storage (created automatically)
└── README.md
```

## Development

### Frontend Development
- Hot reload enabled with Vite
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons

### Backend Development
- FastAPI with automatic API documentation
- Visit `http://localhost:8000/docs` for interactive API docs
- Pydantic for request/response validation
- In-memory storage with file persistence

## Production Deployment

### Frontend
```bash
npm run build
```
Serve the `dist` folder with any static file server.

### Backend
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.