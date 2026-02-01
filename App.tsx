
import React, { useState, useEffect, useCallback } from 'react';
import ArchitectureGraph from './components/ArchitectureGraph';
import InfoSidebar from './components/InfoSidebar';
import { INITIAL_NODES, INITIAL_LINKS } from './constants';
import { ArchNode } from './types';
import { getTrafficExplanation } from './services/geminiService';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchGlobalExplanation = useCallback(async () => {
    setIsLoading(true);
    const result = await getTrafficExplanation(INITIAL_NODES, INITIAL_LINKS);
    setExplanation(result || 'No explanation generated.');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchGlobalExplanation();
  }, [fetchGlobalExplanation]);

  const handleNodeClick = async (node: ArchNode) => {
    if (selectedNode?.id === node.id) return;
    
    setSelectedNode(node);
    setIsLoading(true);
    setExplanation('');
    
    const result = await getTrafficExplanation(INITIAL_NODES, INITIAL_LINKS, node.name);
    setExplanation(result || 'No specific explanation found for this node.');
    setIsLoading(false);
  };

  const clearSelection = () => {
    setSelectedNode(null);
    fetchGlobalExplanation();
  };

  return (
    <div className="h-screen w-screen flex bg-[#020617] text-slate-100 overflow-hidden font-sans">
      {/* Visual Canvas Area */}
      <main className="flex-1 flex flex-col p-6 gap-6 min-w-0">
        <header className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                CloudFlow <span className="text-blue-500">Map</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all">
              EXPORT PDF
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
            >
              RESET LAYOUT
            </button>
          </div>
        </header>

        <div className="flex-1 relative">
          <ArchitectureGraph 
            nodes={INITIAL_NODES} 
            links={INITIAL_LINKS} 
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id}
          />
        </div>

        {/* Status bar */}
        <footer className="h-12 border-t border-slate-800/50 flex items-center px-4 justify-between bg-slate-900/30 rounded-xl">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compute Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ef4444"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-8b5cf6"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gemini API</span>
              </div>
           </div>
           <div className="text-[10px] font-mono text-slate-600">
             V2.4.0-STABLE // LATENCY: 24MS // REGION: GLOBAL
           </div>
        </footer>
      </main>

      {/* Detail Sidebar */}
      <aside className="w-[480px] border-l border-slate-800/80 bg-slate-950 flex-shrink-0">
        <InfoSidebar 
          selectedNode={selectedNode} 
          explanation={explanation}
          isLoading={isLoading}
          onClear={clearSelection}
        />
      </aside>
    </div>
  );
};

export default App;
