import React, { useState, useEffect } from 'react';

export default function Header() {
  const [showGuide, setShowGuide] = useState(false);

  // 🚀 HARDCODED EVENT LISTENER: Catches the browser token the exact millisecond it fires
  useEffect(() => {
    const savePrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', savePrompt);
    return () => window.removeEventListener('beforeinstallprompt', savePrompt);
  }, []);

  // 🎯 USER-FIRST EXECUTION TRIGGER: Bypasses the silent hijack and handles the patient directly
  const handleUserInstallClick = () => {
    if (typeof window !== 'undefined') {
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the native install sheet');
          }
          (window as any).deferredPrompt = null;
        });
      } else {
        // Fallback: If Chrome intercepts the hardware prompt, show the beautiful popup manual guide instantly!
        setShowGuide(true);
      }
    }
  };

  return (
    <div className="relative w-full z-50">
      {/* 📥 USER-FRIENDLY POPUP OVERLAY GUIDE (Fires if native prompt is hijacked) */}
      {showGuide ? (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-sm w-full border border-slate-700 shadow-2xl relative block">
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📥</span>
              <h3 className="text-lg font-bold tracking-wide m-0">Install Knee-Care App</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed mb-5 m-0">
              Access your clinical Gemini AI joint routines instantly from your phone's home screen or laptop desktop!
            </p>
            
            <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-slate-800 text-sm mb-6">
              <div className="flex gap-3 items-center">
                <span className="bg-emerald-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">1</span>
                <span>Tap the <strong className="text-emerald-400">Three Dots Menu (⋮)</strong> or the <strong className="text-emerald-400">Install Icon (📥)</strong> in your browser's top bar layout row.</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="bg-emerald-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">2</span>
                <span>Select <strong className="text-emerald-400">"Install app"</strong> or <strong className="text-emerald-400">"Add to Home screen"</strong> to pin it flawlessly.</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold tracking-wider transition-all duration-150 active:scale-[0.98] shadow-md text-sm border-none cursor-pointer"
            >
              Got It, Close Instructions
            </button>
          </div>
        </div>
      ) : null}

      {/* 🌐 PERMANENTLY VISIBLE NAVIGATION HEADER FOR THE PATIENT */}
      <header className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦾</span>
            <span className="font-bold text-lg tracking-wide">Knee-Care</span>
          </div>
          
          <nav className="flex items-center gap-4 ml-auto">
            {/* 🚀 THE FIXED INDEPENDENT INSTALLATION BUTTON: Unconditional visibility for real users */}
            <button 
              onClick={handleUserInstallClick}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold border border-emerald-400 animate-pulse flex items-center gap-2 text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              title="Install Knee-Care Application"
            >
              📥 Install App
            </button>
          </nav>

        </div>
      </header>
    </div>
  );
}
