import React, { useState, useEffect } from 'react';

export default function Header() {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const savePrompt = (e: Event) => {
      e.preventDefault();
      (window as any).stashedInstallPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', savePrompt);
    return () => window.removeEventListener('beforeinstallprompt', savePrompt);
  }, []);

  const handleCustomInstallClick = () => {
    const promptEvent = (window as any).stashedInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User successfully installed Knee-Care via custom UI button');
        }
        (window as any).stashedInstallPrompt = null;
      });
    } else {
      setShowGuide(true);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 99 }}>
      {/* 📥 COMPILER-SAFE POPUP MODAL DIRECTIONS */}
      {showGuide ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#1E3A34',
            color: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            maxWidth: '384px',
            width: '100%',
            border: '1px solid #10b981',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📥</span>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Install Knee-Care App</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#d1fae5', lineHeight: '1.6', marginBottom: '20px', margin: 0 }}>
              Access your clinical Gemini AI joint routines instantly from your phone's home screen or laptop desktop!
            </p>
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
                <span>Tap the <strong>Three Dots Menu (⋮)</strong> or the <strong>Install Icon (📥)</strong> in your browser's top bar layout row.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
                <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> to pin it flawlessly.</span>
              </div>
            </div>
            <button 
              onClick={() => setShowGuide(false)}
              style={{
                width: '100%',
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '12px 0',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
                fontSize: '14px'
              }}
            >
              Got It, Close Instructions
            </button>
          </div>
        </div>
      ) : null}

      <header style={{
        backgroundColor: '#020617',
        color: '#f1f5f9',
        padding: '16px',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ 
          maxWidth: '1152px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: '12px' 
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🦾</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#f1f5f9' }}>Knee-Care</span>
          </div>
          
          <button
            onClick={handleCustomInstallClick}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all duration-200 dynamic-pulse"
          >
            INSTALL APP
          </button>
        </div>
      </header>
    </div>
  );
}
