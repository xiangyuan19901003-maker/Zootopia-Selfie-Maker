import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, AlertCircle, Camera } from 'lucide-react';
import { generateZootopiaImage } from './services/geminiService';
import { ScenarioSelector } from './components/ScenarioSelector';
import { ImageUpload } from './components/ImageUpload';
import { Scenario, AppState } from './types';

// Define the available scenarios based on user request
const SCENARIOS: Scenario[] = [
  {
    id: 'city',
    name: 'Zootopia City',
    description: 'A casual selfie with Judy and Nick in downtown Zootopia.',
    icon: '🏙️',
    color: 'blue',
    promptModifier: 'Background: Zootopia city street in bright daylight. Mood: Casual, fun, urban. Judy and Nick look friendly and excited.',
  },
  {
    id: 'christmas',
    name: 'Winter Holiday',
    description: 'Festive vibes with Santa hats and snowy decorations.',
    icon: '🎄',
    color: 'red',
    promptModifier: 'Background: Snowy winter street with Christmas trees, fairy lights, and holiday decorations. Characters: Judy and Nick are wearing red Santa hats and cozy sweaters. Mood: Warm, festive, Christmas celebration.',
  },
  {
    id: 'cny',
    name: 'Lunar New Year',
    description: 'Traditional celebration with lanterns and fireworks.',
    icon: '🧧',
    color: 'amber',
    promptModifier: 'Background: Vibrant street with red lanterns, glowing lights, and fireworks in the distance. Characters: Judy and Nick are wearing traditional Chinese festive clothing (Tang suit/Qipao). Mood: Celebratory, Lunar New Year festival.',
  },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    generatedImage: null,
    isGenerating: false,
    selectedScenarioId: 'city',
    error: null,
  });

  const handleImageChange = (base64: string | null) => {
    setState((prev) => ({ 
      ...prev, 
      originalImage: base64, 
      generatedImage: null, // Reset generated image on new upload
      error: null 
    }));
  };

  const handleScenarioSelect = (id: string) => {
    setState((prev) => ({ ...prev, selectedScenarioId: id }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) return;

    setState((prev) => ({ ...prev, isGenerating: true, error: null }));

    const selectedScenario = SCENARIOS.find(s => s.id === state.selectedScenarioId);
    if (!selectedScenario) return;

    try {
      const result = await generateZootopiaImage(
        state.originalImage,
        selectedScenario.promptModifier
      );

      setState((prev) => ({
        ...prev,
        generatedImage: result,
        isGenerating: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Something went wrong while generating the image.",
      }));
    }
  };

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `zootopia-selfie-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const activeColor = SCENARIOS.find(s => s.id === state.selectedScenarioId)?.color || 'indigo';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-orange-400 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-2">
            Zootopia Selfie <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Maker</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transport yourself into the world of Zootopia! Upload a photo and get a custom group selfie with Judy Hopps and Nick Wilde.
          </p>
        </div>

        {/* Scenarios */}
        <ScenarioSelector 
          scenarios={SCENARIOS}
          selectedId={state.selectedScenarioId}
          onSelect={handleScenarioSelect}
          disabled={state.isGenerating}
        />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="flex flex-col h-full">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
              <ImageUpload 
                image={state.originalImage} 
                onImageChange={handleImageChange}
                disabled={state.isGenerating}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col h-full">
            <div className={`
              relative bg-white p-2 rounded-2xl shadow-sm border border-slate-200 h-[400px] lg:h-full flex flex-col items-center justify-center overflow-hidden
              ${!state.generatedImage && !state.isGenerating ? 'bg-slate-50' : ''}
            `}>
              {state.isGenerating ? (
                <div className="flex flex-col items-center p-6 text-center z-10">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-bold text-slate-800 animate-pulse">Creating Magic...</h3>
                  <p className="text-slate-500 mt-2">Inviting Judy and Nick to your photo.</p>
                  <p className="text-xs text-slate-400 mt-4">This might take 10-20 seconds.</p>
                </div>
              ) : state.generatedImage ? (
                <div className="relative w-full h-full group">
                  <img 
                    src={state.generatedImage} 
                    alt="Zootopia Generated" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end rounded-b-xl">
                    <button 
                      onClick={handleDownload}
                      className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      Save Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Your masterpiece will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {state.error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{state.error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!state.originalImage || state.isGenerating}
            className={`
              relative overflow-hidden group w-full max-w-md py-4 px-8 rounded-full font-bold text-lg text-white shadow-xl transition-all duration-300 transform
              ${!state.originalImage || state.isGenerating 
                ? 'bg-slate-300 cursor-not-allowed' 
                : `bg-gradient-to-r from-orange-500 to-purple-600 hover:scale-[1.02] hover:shadow-2xl`
              }
            `}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></div>
            <div className="relative flex items-center justify-center gap-2">
              {state.isGenerating ? (
                <span>Processing...</span>
              ) : (
                <>
                  <RefreshCw className={`w-5 h-5 ${state.generatedImage ? '' : 'animate-spin-slow'}`} />
                  <span>{state.generatedImage ? 'Generate Another' : 'Generate Selfie'}</span>
                </>
              )}
            </div>
          </button>
          
          {!state.originalImage && (
            <p className="text-sm text-slate-400 animate-pulse">
              Upload a photo to get started
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
