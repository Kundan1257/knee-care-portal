import React from 'react';

export default function Header() {
  
  // 🎯 CORE BYPASS FUNCTION: Explicitly commands Chrome to open the hardware installation sheet
  const handleDirectInstall = () => {
    if (typeof window !== 'undefined') {
      // Direct native browser prompt trigger command fallback path
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          (window as any).deferredPrompt = null;
        });
      } else {
        // Fallback: If hardware is locked, trigger the browser's native share/install menu layer directly
        alert("To install Knee-Care: Tap the 3 dots menu (⋮) in your browser's top corner and select 'Add to Home screen' or 'Install app'!");
      }
    }
  };

  return (
    <header className="bg-[#1E3A34] text-white p-4 border-b border-emerald-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* App Title Branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦾</span>
          <span className="font-bold text-lg tracking-wide">Knee-Care</span>
        </div>
        
        {/* Navigation Action Bar */}
        <nav className="flex items-center gap-4">
          
          {/* 🚀 THE FIXED INDEPENDENT INSTALLATION BUTTON */}
          <button 
            onClick={handleDirectInstall}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold border border-emerald-400 animate-pulse flex items-center gap-2 text-sm shadow-md transition-all active:scale-95"
            title="Install Knee-Care Portal App"
          >
            📥 Install App
          </button>

        </nav>
      </div>
    </header>
  );
}
