import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, Files } from 'lucide-react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
  }, [disabled]);

  const validateAndProcessFiles = (fileList: FileList) => {
    setError(null);
    const files = Array.from(fileList);
    
    if (files.length === 0) return;

    const validTypes = ['application/pdf', 'text/markdown', 'text/plain'];
    const validFiles: File[] = [];

    for (const file of files) {
      const isMarkdown = file.name.endsWith('.md') || file.name.endsWith('.markdown');
      
      if (!validTypes.includes(file.type) && !isMarkdown) {
        setError("Invalid file type. Please upload PDF or Markdown (.md) files.");
        return;
      }
      
      if (file.size > 20 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Max 20MB.`);
        return;
      }

      validFiles.push(file);
    }

    onFilesSelect(validFiles);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  }, [disabled, onFilesSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto group">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-300 ease-out
          border border-dashed
          ${isDragging 
            ? 'border-teal-400/50 bg-teal-950/20 scale-[1.01] shadow-2xl shadow-teal-900/20' 
            : 'border-stone-800 bg-stone-900/30 hover:bg-stone-900/50 hover:border-rose-300/30'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".pdf,.md,.txt"
          multiple
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-50"
        />
        
        {/* Decorative background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px] transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}></div>

        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className={`
            p-4 rounded-xl transition-all duration-500 ring-1
            ${isDragging ? 'bg-teal-950 text-teal-300 rotate-3 scale-110 ring-teal-500/30' : 'bg-stone-900 text-stone-500 ring-stone-800 group-hover:text-rose-200 group-hover:scale-105 group-hover:shadow-lg'}
          `}>
            {isDragging ? (
              <Files className="w-6 h-6" />
            ) : (
              <Upload className="w-6 h-6 transition-colors" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-stone-200 tracking-tight">
              {isDragging ? "Drop files now" : "Upload notes"}
            </h3>
            <p className="text-stone-500 text-xs max-w-[200px] mx-auto leading-relaxed">
              Drag & drop PDF or Markdown.
            </p>
          </div>

          {!isDragging && (
            <div className="flex gap-2 opacity-50 pt-2">
              {['PDF', 'MD', 'TXT'].map(type => (
                <span key={type} className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-[9px] uppercase tracking-wider text-stone-500 font-medium">
                  {type}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-center p-3 text-red-200 bg-red-900/10 border border-red-500/20 rounded-lg animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 text-red-400" />
          <span className="text-xs font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;