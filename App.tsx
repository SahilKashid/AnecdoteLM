import React, { useState } from 'react';
import { AppState, GeneratedContent } from './types';
import FileUpload from './components/FileUpload';
import LoadingState from './components/LoadingState';
import ResultView from './components/ResultView';
import { generateScenariosFromNotes, FileInput } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to read files as Base64
  const readFileAsBase64 = (file: File): Promise<FileInput> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let mimeType = file.type;
        // Fallback MIME type detection
        if (file.name.endsWith('.md')) mimeType = 'text/markdown';
        else if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (!mimeType) mimeType = 'text/plain';

        resolve({
          data: reader.result as string,
          mimeType: mimeType
        });
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelect = async (files: File[]) => {
    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const processedFiles = await Promise.all(files.map(readFileAsBase64));
      const markdown = await generateScenariosFromNotes(processedFiles);
      
      setContent({ rawMarkdown: markdown });
      setAppState(AppState.SUCCESS);

    } catch (e: any) {
      console.error(e);
      setError("Failed to generate scenarios. Please try again or ensure your API key is valid.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setContent(null);
    setError(null);
  };

  const isInteractive = [AppState.IDLE, AppState.GENERATING, AppState.ERROR].includes(appState);

  return (
    <div className={`bg-black text-stone-200 font-sans flex flex-col relative min-h-screen selection:bg-teal-500/30 selection:text-teal-100`}>
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* Ambient Background */}
      {isInteractive && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-teal-900/10 rounded-full blur-[120px] animate-pulse duration-[8s]"></div>
            <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-rose-900/10 rounded-full blur-[120px]"></div>
         </div>
      )}

      {/* Main Layout */}
      <div className={`relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col flex-grow transition-all duration-700 ${isInteractive ? 'justify-center py-12' : 'py-12'}`}>
        
        {/* Header */}
        {isInteractive && (
          <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 font-['Space_Grotesk'] text-stone-200">
              Anecdote<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-rose-400">LM</span>
            </h1>
            <p className="text-base text-stone-400 max-w-lg mx-auto font-light tracking-wide">
              Transform passive notes into <span className="text-teal-100/90 font-medium">active scenarios</span>.
            </p>
          </div>
        )}

        {/* View Switching */}
        <main className="w-full flex flex-col items-center justify-center">
          {appState === AppState.IDLE && (
            <div className="w-full animate-in fade-in zoom-in-95 duration-500">
              <FileUpload onFilesSelect={handleFilesSelect} />
            </div>
          )}

          {appState === AppState.GENERATING && (
            <div className="animate-in fade-in duration-700">
              <LoadingState />
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="text-center max-w-md mx-auto animate-in fade-in duration-300">
              <div className="bg-red-950/20 border border-red-500/20 p-6 rounded-2xl text-red-200 backdrop-blur-md">
                <p className="font-semibold mb-2 text-lg text-red-100">Generation Failed</p>
                <p className="text-sm opacity-80 mb-6 text-red-200/70">{error}</p>
                <button 
                  onClick={handleReset}
                  className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm font-medium transition-colors text-red-100"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {appState === AppState.SUCCESS && content && (
            <ResultView content={content} onReset={handleReset} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;