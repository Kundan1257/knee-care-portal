import React, { useState } from 'react';

export default function Header() {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <>
      {/* 📥 USER-FRIENDLY PWA INSTALLATION GUIDANCE POPUP MODAL */}
      {showGuide ? (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-sm w-full border border-slate-700 shadow-2xl relative block z-50">
            
            {/* Animated Arrow Pointing up toward Chrome's Top-Right Menu Row */}
            <div className="absolute -top-3 right-4 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-emerald-500 animate-bounce" />
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📥</span>
              <h3 className="text-lg font-bold tracking-wide">Install Knee-Care App</h3>
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Access your clinical Gemini AI routines instantly right from your phone's desktop app vault grid!
            </p>
            
            <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-slate-700 text-sm mb-6">
              <div className="flex gap-3 items-center">
                <span className="bg-emerald-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                <span>Tap the <strong className="text-emerald-400">Three Dots Menu (⋮)</strong> in the absolute top right corner of Chrome.</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="bg-emerald-500 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                <span>Select <strong className="text-emerald-400">"Add to Home screen"</strong> or <strong className="text-emerald-400">"Install app"</strong>.</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold tracking-wider transition-all duration-150 active:scale-[0.98] shadow-md text-sm border border-emerald-400/20"
            >
              Got It, Close Guide
            </button>
          </div>
        </div>
      ) : null}

      {/* 🌐 MAIN APPLICATION NAVIGATION LAYOUT ROW */}
      <header className="bg-slate-900 text-white p-4 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦾</span>
            <span className="font-bold text-lg tracking-wide">Knee-Care</span>
          </div>
          
          <nav className="flex items-center gap-4">
            {/* Trigger Guide Manual Activation Button */}
            <button 
              onClick={() => setShowGuide(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
              title="View Installation Instructions"
            >
              📥 Install
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
