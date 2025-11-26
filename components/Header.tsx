import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              NeuroPrompt
            </h1>
            <p className="text-xs text-gray-400">Reverse Image Engineering</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-300 font-mono">
            Powered by Gemini 2.5 Flash
          </span>
        </div>
      </div>
    </header>
  );
};