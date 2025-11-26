import React, { useState } from 'react';
import { Wand2, Loader2, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ResultCard } from './components/ResultCard';
import { generatePromptFromImage } from './services/geminiService';
import { ImageFile, AnalysisResult, AppState } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (image: ImageFile | null) => {
    setSelectedImage(image);
    // Reset state when new image is selected
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAppState(AppState.ANALYZING);
    setError(null);

    try {
      const data = await generatePromptFromImage(selectedImage.base64, selectedImage.mimeType);
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        
        {/* Intro Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Turn Images into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Prompts</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload any image, illustration, or design. Our AI analyzes the composition, style, and subject to generate a perfect text prompt for recreation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <UploadZone 
              onImageSelected={handleImageSelected} 
              selectedImage={selectedImage} 
              disabled={appState === AppState.ANALYZING}
            />

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || appState === AppState.ANALYZING}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
                ${!selectedImage 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : appState === AppState.ANALYZING
                    ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5'
                }
              `}
            >
              {appState === AppState.ANALYZING ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Details...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" />
                  Generate Prompt
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-start gap-3 text-red-300 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {appState === AppState.SUCCESS && result ? (
              <ResultCard result={result} />
            ) : (
              /* Empty State / Placeholder */
              <div className={`
                h-full min-h-[400px] border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-900/30
                ${appState === AppState.ANALYZING ? 'animate-pulse' : ''}
              `}>
                {appState === AppState.ANALYZING ? (
                  <div className="space-y-6 max-w-sm">
                     <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-0"></div>
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                     </div>
                     <p className="text-gray-400">
                       Dissecting visual elements, identifying artistic styles, and composing the perfect prompt...
                     </p>
                  </div>
                ) : (
                  <div className="max-w-md space-y-4 opacity-50">
                    <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto flex items-center justify-center">
                      <Wand2 className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300">Ready to Analyze</h3>
                    <p className="text-gray-500">
                      Upload an image on the left and hit generate to see the reverse-engineered prompt here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;