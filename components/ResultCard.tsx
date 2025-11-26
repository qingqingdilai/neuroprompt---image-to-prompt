import React, { useState } from 'react';
import { Copy, Check, Terminal, Palette, Layers } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-gray-200">Generated Prompt</span>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${copied 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-transparent'
              }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Prompt */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-20"></div>
            <div className="relative bg-gray-950 rounded-lg p-5 border border-gray-800">
              <p className="text-gray-300 font-mono leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {result.prompt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Style Badge */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Palette className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Art Style</h3>
              </div>
              <p className="text-gray-300 text-sm">{result.style}</p>
            </div>

            {/* Elements Badge */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <Layers className="w-4 h-4" />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Key Elements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.elements.map((element, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300 border border-gray-600/30"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};