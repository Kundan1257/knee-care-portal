import React from 'react';

interface HomeSectionProps {
  setActiveSection?: (section: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveSection }) => {
  const handleNavigation = (target: string) => {
    if (setActiveSection) {
      setActiveSection(target);
    } else {
      window.location.hash = target;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8 font-sans antialiased text-gray-800">
      
      {/* 1. PSYCHOLOGICAL SENIOR RELATION CARD */}
      <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4 relative min-h-fit pb-6 overflow-visible">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug">
            Does Your Knee Feel Unstable During Daily Tasks? 🏡
          </h3>
          <p className="text-sm text-gray-500 font-semibold mt-1">
            If you experience these common frustrations, you are in the right place:
          </p>
        </div>

        <div className="flex flex-col gap-3 my-1">
          {/* 💡 Box 1: Changed bg-gray-50 to Medical Blue styling */}
          <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100/30 shadow-sm rounded-xl">
            <span className="text-xl shrink-0">🛌</span>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              <strong>Morning Stiffness:</strong> Feeling hesitation or sharp discomfort during your very first steps out of bed.
            </p>
          </div>
          
          {/* 💡 Box 2: Changed bg-gray-50 to Medical Blue styling */}
          <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100/30 shadow-sm rounded-xl">
            <span className="text-xl shrink-0">🪜</span>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              <strong>Stairway Hesitation:</strong> Lacking confidence or holding tightly to handrails when walking downstairs.
            </p>
          </div>
          
          {/* 💡 Box 3: Changed bg-gray-50 to Medical Blue styling */}
          <div className="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100/30 shadow-sm rounded-xl">
            <span className="text-xl shrink-0">🛋️</span>
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              <strong>Rising Strain:</strong> Feeling deep joint pressure when pushing yourself up from a deep couch or low chair.
            </p>
          </div>
</div>


        <div className="pt-2 border-t border-gray-100">
          <h4 className="font-extrabold text-sm text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            🌿 How Knee-Lace Restores Your Freedom
          </h4>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed font-medium">
            Knee-Lace is your daily companion. It wraps joints in immediate structural security, cushioning cartilage and absorbing impacts before strain reaches sensitive tissues. It gives you the physical confidence to move freely.
          </p>
        </div>
      </div>

      {/* 2. STABILITY BREAKTHROUGH CARD */}
      <div className="w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#06301e] to-[#041d13] p-8 text-white shadow-xl flex flex-col items-start">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold tracking-wider text-yellow-400 uppercase">
          <span>★</span> STABILITY BREAKTHROUGH
        </div>
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight uppercase leading-tight">
          Natural Stability <span className="inline-block animate-pulse">🦵</span>
        </h2>
        <p className="mt-5 text-sm md:text-base font-bold text-yellow-400 bg-white/5 border border-yellow-500/30 px-5 py-4 rounded-xl w-full leading-relaxed">
          💡 DIRECTIVE: Please put on Knee-Lace before running, exercise, and heavy weight lifting to safeguard joints.
        </p>
        <p className="mt-5 text-sm md:text-base leading-relaxed text-gray-200 font-medium">
          Knee-Lace acts as a natural support system for your knees, helping reduce strain and improve stability during daily activities.
        </p>
                   {/* --- COPIED THE OPEN, CLICKABLE BUTTONS ZONE --- */}
        <div className="mt-8 w-full flex flex-col gap-3 relative z-50 pointer-events-auto block clear-both">
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('ex');
            }}
            className="w-full rounded-full bg-white py-4 text-center text-sm md:text-base font-black text-gray-900 shadow transition hover:bg-gray-100 active:scale-[0.98] cursor-pointer block relative z-50 pointer-events-auto"
          >
            Explore Movement Guides
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('about');
            }}
            className="w-full rounded-full border border-gray-600 bg-white/5 py-4 text-center text-sm md:text-base font-bold text-white transition hover:bg-white/10 active:scale-[0.98] cursor-pointer block relative z-50 pointer-events-auto"
          >
            Learn More
          </button>
          
        </div>
     

      </div>

      {/* 3. DUAL BENEFIT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-start gap-2.5">
          <span className="text-3xl">🛡️</span>
          <h4 className="font-extrabold text-base text-gray-900">Stability & Confidence</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">Dynamic protection designed to reinforce joints.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-start gap-2.5">
          <span className="text-3xl">⚡</span>
          <h4 className="font-extrabold text-base text-gray-900">Natural Support</h4>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">Targeted pathways that minimize direct joint loading friction.</p>
        </div>
      </div>

      {/* 4. DAILY ROUTINE HABITS */}
      <div className="w-full flex flex-col gap-4 mt-2">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">Daily Routine Habits</h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-5 p-5 rounded-xl bg-white border border-gray-100 shadow-xs">
            <span className="text-2xl shrink-0">🚶</span>
            <div>
              <p className="font-black text-sm text-gray-900">Walking</p>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">Step up with the stronger leg, down with the weak.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-5 rounded-xl bg-white border border-gray-100 shadow-xs">
            <span className="text-2xl shrink-0">🪜</span>
            <div>
              <p className="font-black text-sm text-gray-900">Stairways</p>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">Always use handrails for added stability.</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-5 rounded-xl bg-white border border-gray-100 shadow-xs">
            <span className="text-2xl shrink-0">🪑</span>
            <div>
              <p className="font-black text-sm text-gray-900">Posture</p>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">Avoid crossing legs. Keep a 90-degree angle.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BIOLOGICAL RECOVERY */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight">Biological Recovery</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-xs flex gap-4">
            <span className="text-2xl shrink-0">🧊</span>
            <div>
              <p className="font-black text-sm text-gray-900">Ice Therapy</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Apply for 15-20 mins after activity.</p>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-xs flex gap-4">
            <span className="text-2xl shrink-0">🩹</span>
            <div>
              <p className="font-black text-sm text-gray-900">Compression</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Use a light wrap to maintain stability.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. EXPERT BANNER */}
      <div className="w-full mt-6 p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center flex flex-col gap-2.5">
        <div className="text-xs font-black tracking-widest uppercase text-emerald-800">Consistency Is Key • Expert Support Required</div>
        <p className="text-sm md:text-base text-emerald-950 font-bold leading-relaxed italic">
          "Your Recovery Journey: Every small action contributes to long-term joint health."
        </p>
      </div>

      {/* 7. PERFECT COMPACT FOOTER */}
      {/*
      <footer className="w-full mt-10 pt-6 border-t border-gray-200 flex flex-col items-center gap-5 text-center text-sm font-medium text-gray-400">
        <div className="flex items-center gap-1.5 font-black text-gray-700 text-base"><span>🦵</span> Knee-Care</div>
        <div className="flex justify-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span className="cursor-pointer" onClick={() => handleNavigation('privacy')}>PRIVACY</span>
          <span>|</span>
          <span className="cursor-pointer" onClick={() => handleNavigation('contact')}>CONTACT</span>
          <span>|</span>
          <span className="cursor-pointer" onClick={() => handleNavigation('support')}>SUPPORT</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          <p>© 2026 Knee-Care. All rights reserved.</p>
          <p className="font-bold text-emerald-700/80 mt-1 uppercase text-xs">All clinical movement recovery strategies are registered post-surgical protocols.</p>
        </div>
      </footer>
*/}
    </div>
  );
};

export default HomeSection;
