
import React from 'react';
import { ArchNode } from '../types';

interface Props {
  selectedNode: ArchNode | null;
  explanation: string;
  isLoading: boolean;
  onClear: () => void;
}

const InfoSidebar: React.FC<Props> = ({ selectedNode, explanation, isLoading, onClear }) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto custom-scrollbar">
      {selectedNode ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{selectedNode.name}</h2>
            <button 
              onClick={onClear}
              className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <span className="px-3 py-1 bg-blue-900/40 text-blue-400 rounded-full text-xs font-semibold w-fit border border-blue-800">
            {selectedNode.type}
          </span>
          <p className="text-slate-300 leading-relaxed italic">
            "{selectedNode.description}"
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">System Insight</h2>
          <p className="text-slate-400">
            Select a node in the diagram to explore technical traffic flows and security considerations.
          </p>
        </div>
      )}

      <hr className="border-slate-800" />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l1.418 10.55a.5.5 0 00.916.223l2.848-4.524a1 1 0 011.666 1.096l-3.333 5.305a1.5 1.5 0 01-2.548-.135l-1.31-2.185-1.31 2.185a1.5 1.5 0 01-2.548.135l-3.333-5.305a1 1 0 011.666-1.096l2.848 4.524a.5.5 0 00.916-.223l1.418-10.55a1 1 0 01.897-.95z" clipRule="evenodd" />
            </svg>
            Gemini Architect Analysis
          </h3>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-slate-800 rounded animate-pulse w-4/6"></div>
          </div>
        ) : explanation ? (
          <div className="prose prose-invert prose-slate max-w-none">
            {explanation.split('\n').map((line, i) => {
              if (line.startsWith('#')) {
                return <h4 key={i} className="text-white font-bold mt-4 mb-2">{line.replace(/^#+ /, '')}</h4>;
              }
              if (line.startsWith('-') || line.startsWith('*')) {
                return <li key={i} className="text-slate-300 ml-4 mb-1">{line.replace(/^[-*] /, '')}</li>;
              }
              return <p key={i} className="text-slate-300 mb-2">{line}</p>;
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-6 border-2 border-dashed border-slate-800 rounded-xl">
             <p className="text-slate-500 text-sm">
               The AI architect is ready to explain the infrastructure.
             </p>
          </div>
        )}
      </div>
      
      <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">
          Powered by Gemini 3 Pro & Cloud Architecture Insights
        </p>
      </div>
    </div>
  );
};

export default InfoSidebar;
