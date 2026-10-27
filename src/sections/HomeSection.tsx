import React from 'react';
import { DietaryDefenseModule, ThermalInfusionsModule } from './DietSection.js';
import { ExerciseLifestyleModule, RelaxationLifestyleModule } from './ExerciseSection.js';

interface PreventativeStabilityProtocolProps {
  movementIntensityScore: number;
  dailyRoutineStrainScore: number;
}

function PreventativeStabilityProtocol({
  movementIntensityScore,
  dailyRoutineStrainScore,
}: PreventativeStabilityProtocolProps) {
  const activityScore = Number.isFinite(movementIntensityScore) ? movementIntensityScore : 0;
  const routineScore = Number.isFinite(dailyRoutineStrainScore) ? dailyRoutineStrainScore : 0;
  const activitySeverity = Math.max(activityScore, routineScore);

  const zone = activitySeverity <= 3
    ? {
        style: "border-emerald-500/30 bg-emerald-950/50 text-emerald-100",
        message: "🟢 Routine Support: Baseline Comfort. Action: Your knees are moving comfortably through light daily tasks. Incorporating a light, flexible compression sleeve or knee support during prolonged standing or walks can help maintain natural joint warmth and thermal comfort."
      }
    : activitySeverity <= 7
      ? {
          style: "border-amber-500/30 bg-amber-950/50 text-amber-100",
          message: "🟡 Routine Support: Active Load Awareness. Action: Your daily routine works are adding standard structural load to your joints. Utilizing a standard supportive knee brace during daily errands or your office commute is an everyday approach to assist joint tracking, retain heat, and support overall stability while moving."
        }
      : {
          style: "border-rose-500/30 bg-rose-950/50 text-rose-100",
          message: "🔴 Routine Support: Elevated Activity Notice. Action: Sports activities or heavy routine moving increase daily joint exertion. Wearing a structured preventative knee brace during heavy physical tasks or high-impact routines serves as a supportive external wrap, helping manage mechanical stress and preserving daily movement comfort."
        };

  return (
    <section className="mt-6 max-w-md mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 text-slate-100 shadow-sm sm:p-6">
      <h2 className="text-base font-black text-slate-100 tracking-tight flex items-center gap-1.5">🛡️ Active Preventative Protocol</h2>
      <p className="mt-2 text-xs leading-5 text-slate-300 font-medium">
        The Power of Joint Compression: Utilizing a supportive knee brace or wrap during active routines is a common worldwide lifestyle habit to retain natural body heat, support local ligaments, and maintain structural comfort during your normal daily routine works.
      </p>
      <div role="status" className={`mt-4 rounded-xl border p-4 text-xs leading-5 font-bold ${zone.style}`}>{zone.message}</div>
    </section>
  );
}

interface HomeSectionProps {
  setActiveSection?: (section: string) => void;
  activeBox?: string | null;
  setActiveBox?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveSection, activeBox, setActiveBox }) => {
    const handleNavigation = (target: string) => {
    // 1. Try to find the exact container ID on the page (e.g., id="ex" or id="about")
    let element = document.getElementById(target);
    
    // 2. Foolproof Fallback: If the ID isn't found, search for the actual components by their names
    if (!element) {
      if (target === 'ex') {
        // Looks for your Exercise or AI Help section wrapper tags
        element = document.querySelector('section, [class*="HelpSection"], [class*="help"]');
      } else if (target === 'about') {
        // Looks for your informational card panels or footer elements
        element = document.querySelector('footer, [class*="about"], [class*="About"]');
      }
    }

    // 3. Perform a smooth native browser scroll transition down to the section
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (setActiveSection) {
      setActiveSection(target);
    } else {
      window.location.hash = target;
    }
  };

  const lifestyleCards = [
    {
      id: 'diet',
      title: 'Dietary Defense',
      icon: '🌿',
      style: 'bg-emerald-950/40 border-emerald-500/30 hover:border-emerald-400',
    },
    {
      id: 'tea',
      title: 'Thermal Infusions',
      icon: '☕',
      style: 'bg-amber-950/40 border-amber-500/30 hover:border-amber-400',
    },
    {
      id: 'exercise',
      title: 'Mobility Loops',
      icon: '🏋️‍♂️',
      style: 'bg-indigo-950/40 border-indigo-500/30 hover:border-indigo-400',
    },
    {
      id: 'relaxation',
      title: 'Recovery Rest',
      icon: '🧘‍♂️',
      style: 'bg-purple-950/40 border-purple-500/30 hover:border-purple-400',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8 font-sans antialiased text-slate-100">
      
      {/* 1. PSYCHOLOGICAL SENIOR RELATION CARD */}
      <div className="w-full rounded-[2rem] border border-slate-800/80 bg-slate-900/60 p-6 shadow-sm flex flex-col gap-4 relative min-h-fit pb-6 overflow-visible">
        <div>
          <h3 className="text-xl font-black text-slate-100 tracking-tight leading-snug">
            Does Your Knee Feel Unstable During Daily Tasks? 🏡
          </h3>
          <p className="text-sm text-slate-300 font-semibold mt-1">
            If you experience these common frustrations, you are in the right place:
          </p>
        </div>

        <section className="w-full flex flex-col gap-4" aria-label="Lifestyle support">
          <h4 className="text-base font-extrabold text-slate-100 uppercase tracking-tight">Lifestyle Support</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lifestyleCards.map((card) => {
              const isActive = activeBox === card.id;

              return (
                <div key={card.id} className={`w-full rounded-2xl border p-4 text-white shadow-sm transition-colors ${card.style} ${isActive ? 'ring-2 ring-white/20' : ''}`}>
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`lifestyle-${card.id}`}
                    onClick={() => setActiveBox?.(isActive ? null : card.id)}
                    className="w-full rounded-xl p-1 text-left hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-4">
                        <span className="text-2xl shrink-0" aria-hidden="true">{card.icon}</span>
                        <span className="font-black text-sm">{card.title}</span>
                      </span>
                      <span className="text-slate-200 text-lg" aria-hidden="true">{isActive ? '−' : '+'}</span>
                    </span>
                  </button>
                  <div
                    id={`lifestyle-${card.id}`}
                    hidden={!isActive}
                    className="mt-4 border-t border-white/10 pt-4"
                  >
                    {activeBox === 'diet' && <DietaryDefenseModule />}
                    {activeBox === 'tea' && <ThermalInfusionsModule />}
                    {activeBox === 'exercise' && <ExerciseLifestyleModule />}
                    {activeBox === 'relaxation' && <RelaxationLifestyleModule />}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
          💡 PRIVACY TRACKING PROTOCOL: Use this independent checklist interface to log your daily stabilization braces, joint alignment exercises, and recovery parameters with 100% data anonymity.

        </p>
                <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-200 font-medium">
          Knee-Care Portal functions as a secure, local-first utility to map structural habit consistency over time without bloated third-party tracking scripts.
        </p>

                   {/* --- COPIED THE OPEN, CLICKABLE BUTTONS ZONE --- */}
        <div className="mt-8 w-full flex flex-col gap-3 relative z-50 pointer-events-auto block clear-both">
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation('ex');
            }}
            className="w-full rounded-full border border-slate-700 bg-slate-900/60 py-4 text-center text-sm md:text-base font-black text-slate-100 shadow transition hover:bg-slate-800 active:scale-[0.98] cursor-pointer block relative z-50 pointer-events-auto"
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

      <PreventativeStabilityProtocol movementIntensityScore={3} dailyRoutineStrainScore={0} />

      {/* 3. DUAL BENEFIT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-sm flex flex-col items-start gap-2.5">
          <span className="text-3xl">🛡️</span>
          <h4 className="font-extrabold text-base text-slate-100">Stability & Confidence</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">Dynamic protection designed to reinforce joints.</p>
        </div>
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-sm flex flex-col items-start gap-2.5">
          <span className="text-3xl">⚡</span>
          <h4 className="font-extrabold text-base text-slate-100">Natural Support</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">Targeted pathways that minimize direct joint loading friction.</p>
        </div>
      </div>

      {/* 6. EXPERT BANNER */}
      <div className="w-full mt-6 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center flex flex-col gap-2.5">
        <div className="text-xs font-black tracking-widest uppercase text-emerald-200">Consistency Is Key • Expert Support Required</div>
        <p className="text-sm md:text-base text-emerald-100 font-bold leading-relaxed italic">
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
