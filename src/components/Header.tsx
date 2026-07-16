import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if the early interceptor already caught the token
    if ((window as any).stashedInstallPrompt) {
      setIsInstallable(true);
    }
    // Define a fallback trigger function if the event fires during mount
    (window as any).updateCustomInstallButton = () => {
      setIsInstallable(true);
    };
    return () => {
      (window as any).updateCustomInstallButton = null;
    };
  }, []);

  const handleCustomInstallClick = () => {
    const promptEvent = (window as any).stashedInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstallable(false);
        }
        (window as any).stashedInstallPrompt = null;
      });
    }
  };

  return (
    <header className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦾</span>
          <span className="font-bold text-lg tracking-wide">Knee-Care</span>
        </div>
        
        <nav className="flex items-center gap-4 ml-auto">
          {/* 🚀 TARGETED SHOW: Only displays if the early hardware handshake passes perfectly */}
          {isInstallable && (
            <button 
              onClick={handleCustomInstallClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold border border-emerald-400 animate-pulse flex items-center gap-2 text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              📥 Install App
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
