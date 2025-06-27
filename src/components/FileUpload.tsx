import React, { useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    if (validFile) {
      onFileUpload(validFile);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
      <p className="text-gray-600 mb-4">
        Drag and drop your resume file here, or click to browse
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
        <FileText className="h-4 w-4" />
        <span>Supports PDF and DOCX files</span>
      </div>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileInput}
        className="hidden"
        id="resume-upload"
      />
      <label
        htmlFor="resume-upload"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-200"
      >
        Choose File
      </label>
    </div>
  );
};