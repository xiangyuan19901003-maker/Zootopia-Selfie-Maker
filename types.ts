export interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or simple icon representation
  color: string;
  promptModifier: string;
}

export interface AppState {
  originalImage: string | null; // Base64 string
  generatedImage: string | null; // Base64 string
  isGenerating: boolean;
  selectedScenarioId: string;
  error: string | null;
}
