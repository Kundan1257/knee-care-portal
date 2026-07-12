import React, { useState } from 'react';

export default function Header() {
  const [showGuide, setShowGuide] = useState(true);

  // 🎯 CORE BYPASS FUNCTION: Explicitly commands Chrome to open the hardware installation sheet
  const handleDirectInstall = () => {
    if (typeof window !== 'undefined') {
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
        alert("To install Knee-Care: Tap the 3 dots menu (⋮) in your browser's top corner and select 'Add to Home screen' or 'Install app'!");
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', zIndex: 99 }}>
      {/* 📥 COMPILER-SAFE INLINE STYLE INSTALLATION POPUP MODAL */}
      {showGuide ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          itemsAlign: 'center',
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
            position: 'relative',
            marginTop: 'auto',
            marginBottom: 'auto'
          }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>📥</span>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Install Knee-Care App</h3>
            </div>
            
            <p style={{ fontSize: '14px', color: '#d1fae5', lineHeight: '1.6', marginBottom: '20px', margin: 0 }}>
              Access your clinical Gemini AI routines instantly right from your phone's desktop app vault grid!
            </p>
            
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</span>
                <span>Tap the <strong>Three Dots Menu (⋮)</strong> in the absolute top right corner of Chrome.</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ backgroundColor: '#10b981', color: '#ffffff', fontWeight: 'bold', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</span>
                <span>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</span>
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
              Got It, Close Guide
            </button>
          </div>
        </div>
      ) : null}

      {/* 🌐 MAIN HEADER NAVIGATION LAYOUT */}
      <header style={{
        backgroundColor: '#1E3A34',
        color: '#ffffff',
        padding: '16px',
        borderBottom: '1px solid #064e3b',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🦾</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Knee-Care</span>
          </div>
          
          <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={handleDirectInstall}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'semibold',
                border: '1px solid #34d399',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📥 Install App
            </button>
          </nav>
        </div>
      </header>
    </div>
  );
}
