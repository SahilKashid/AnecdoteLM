import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LOADING_MESSAGES } from '../constants';

const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full"></div>
        <Loader2 className="relative w-12 h-12 text-teal-200 animate-spin" />
      </div>
      
      <h3 className="text-xl font-semibold text-stone-200 mb-2 tracking-tight">
        Analyzing Context
      </h3>
      
      <div className="h-6 overflow-hidden relative w-full max-w-sm">
        <p className="text-rose-200/80 text-sm font-medium animate-pulse transition-all duration-500 absolute w-full left-0 top-0">
          {LOADING_MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="mt-6 flex gap-1.5 justify-center">
        <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse delay-0"></span>
        <span className="w-1 h-1 rounded-full bg-teal-300 animate-pulse delay-150"></span>
        <span className="w-1 h-1 rounded-full bg-teal-200 animate-pulse delay-300"></span>
      </div>
    </div>
  );
};

export default LoadingState;