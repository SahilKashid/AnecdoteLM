import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Printer, ArrowLeft, FileEdit } from 'lucide-react';
import { GeneratedContent } from '../types';

interface ResultViewProps {
  content: GeneratedContent;
  onReset: () => void;
}

const PRINT_CSS = `
  @page { margin: 2cm; size: auto; }
  html, body { margin: 0; padding: 0; background: #fff; width: 100%; }
  body { font-family: 'Georgia', 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.6; }
  .print-container { display: block; max-width: 800px; margin: 0 auto; }
  h1 { font-size: 24pt; font-weight: bold; margin: 0 0 20px 0; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
  h2 { font-size: 18pt; font-weight: bold; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #ddd; }
  h3 { font-size: 14pt; font-weight: bold; margin-top: 25px; margin-bottom: 10px; }
  p { margin-bottom: 1em; text-align: justify; }
  ul, ol { margin-bottom: 1em; margin-left: 2em; }
  li { margin-bottom: 0.5em; }
  blockquote { border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; font-style: italic; background-color: #f9fafb; padding: 12px 16px; color: #374151; display: block; }
  code { font-family: monospace; background-color: #f3f4f6; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; color: #111827; border: 1px solid #e5e7eb; }
  pre { background-color: #f3f4f6; padding: 1em; border-radius: 4px; overflow-x: auto; margin-bottom: 1em; }
  strong { font-weight: 700; color: #000; }
  a { color: #000 !important; text-decoration: none !important; border-bottom: 1px dotted #000; }
  hr { border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0; }
`;

const ResultView: React.FC<ResultViewProps> = ({ content, onReset }) => {
  const [filename, setFilename] = useState('anecdote-scenarios');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = filename || 'Anecdote Scenarios';
    return () => { document.title = previousTitle; };
  }, [filename]);

  const handleDownloadMarkdown = () => {
    const safeFilename = filename.trim() || 'anecdote-scenarios';
    const blob = new Blob([content.rawMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const contentElement = document.querySelector('.prose');
    if (!contentElement) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Pop-up blocked. Please allow popups to save as PDF.");
        return;
    }

    const doc = printWindow.document;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${filename || 'Anecdote Scenarios'}</title>
            <style>${PRINT_CSS}</style>
        </head>
        <body>
            <div class="print-container">
                <h1>${filename || 'Anecdote Scenarios'}</h1>
                ${contentElement.innerHTML}
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() { window.print(); }, 500);
                };
            </script>
        </body>
        </html>
    `);
    doc.close();
    printWindow.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Action Bar */}
      <div className="sticky top-4 z-50 mb-4 p-3 bg-stone-950/90 backdrop-blur-md rounded-xl border border-stone-800 shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors px-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        
        <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20 transition-all w-full sm:w-auto">
             <FileEdit className="w-3.5 h-3.5 text-stone-500 mr-2" />
             <input 
                type="text" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="bg-transparent border-none outline-none text-stone-200 text-sm w-full sm:w-40 placeholder-stone-600"
                placeholder="filename"
              />
              <span className="text-stone-600 text-xs select-none ml-1">.md</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-lg text-xs font-medium transition-colors border border-stone-800 flex-1 sm:flex-none"
            >
              <Download className="w-3.5 h-3.5" />
              MD
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-teal-900/30 hover:bg-teal-900/50 border border-teal-800/50 text-teal-100 rounded-lg text-xs font-medium transition-colors flex-1 sm:flex-none"
            >
              <Printer className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (Dark Mode) */}
      <div className="bg-stone-950 text-stone-200 p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl min-h-[60vh] border border-stone-900">
        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:text-teal-200 prose-h1:mb-8 prose-h1:pb-4 prose-h1:border-b prose-h1:border-stone-800
          prose-h2:text-2xl prose-h2:text-rose-200 prose-h2:mt-10
          prose-h3:text-xl prose-h3:text-teal-100/80 prose-h3:mt-8
          prose-p:text-stone-300 prose-p:leading-relaxed
          prose-blockquote:bg-stone-900 prose-blockquote:border-l-4 prose-blockquote:border-teal-500/50 prose-blockquote:text-stone-300 prose-blockquote:not-italic prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-6
          prose-strong:text-rose-100 prose-strong:font-bold
          prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-teal-600
          prose-hr:my-10 prose-hr:border-stone-800 prose-hr:border-t-2
        ">
           <ReactMarkdown>{content.rawMarkdown}</ReactMarkdown>
        </div>
      </div>

      <div className="mt-8 text-center text-stone-600 text-xs">
        Generated by AnecdoteLM
      </div>
    </div>
  );
};

export default ResultView;