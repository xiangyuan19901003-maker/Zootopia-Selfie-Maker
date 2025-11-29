import React from 'react';
import { Scenario } from '../types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ 
  scenarios, 
  selectedId, 
  onSelect,
  disabled 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {scenarios.map((scenario) => {
        const isSelected = selectedId === scenario.id;
        return (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 text-left group
              ${isSelected 
                ? `border-${scenario.color}-500 bg-${scenario.color}-50 shadow-md` 
                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3
              ${isSelected ? `bg-${scenario.color}-200` : 'bg-slate-100 group-hover:bg-slate-200'}
            `}>
              {scenario.icon}
            </div>
            <h3 className={`font-bold text-lg mb-1 ${isSelected ? `text-${scenario.color}-900` : 'text-slate-800'}`}>
              {scenario.name}
            </h3>
            <p className="text-sm text-slate-500 leading-snug">
              {scenario.description}
            </p>
            
            {isSelected && (
              <div className={`absolute top-3 right-3 w-4 h-4 rounded-full bg-${scenario.color}-500`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
