import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Zap, Leaf, Coffee, Egg, Utensils, ChevronDown, Lock, ArrowRight, Sparkles } from '../App.js';
import { Card, Section, PageWrapper } from '../App.js';
import { RECIPES, TEAS, Tea } from '../constants.js';
import { usePremium } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { analyzeMealImage, MealScanResults } from '../services/geminiService.js';

const TeaItem: React.FC<{ tea: Tea }> = ({ tea }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails = !!(tea.description || tea.benefits || tea.preparation);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
      whileTap={hasDetails ? { scale: 0.98 } : {}}
      onClick={() => hasDetails && setIsOpen(!isOpen)}
      className={`p-10 rounded-[3rem] border border-white transition-all text-center group ${hasDetails ? 'cursor-pointer' : ''} ${isOpen ? 'bg-white border-accent/20 ring-4 ring-accent/5 shadow-2xl' : 'bg-white/40 shadow-sm'}`}
    >
      <motion.div 
        animate={isOpen ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        className={`w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-colors ${isOpen ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'bg-primary/5 text-primary'}`}
      >
        <Coffee size={28} />
      </motion.div>
      <h4 className={`text-2xl font-black text-primary mb-3 transition-colors tracking-tight ${isOpen ? 'text-accent' : 'group-hover:text-accent'}`}>{tea.name}</h4>
      <p className="text-base text-gray-500 leading-relaxed font-medium mb-4">{tea.benefit}</p>
      
      {hasDetails && (
        <div className="flex justify-center text-primary/20">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden text-left mt-4 pt-4 border-t border-primary/10"
          >
            {tea.description && <p className="text-xs text-gray-600 mb-4 leading-relaxed italic">{tea.description}</p>}
            
            {tea.benefits && (
              <div className="mb-4">
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Key Benefits</h5>
                <ul className="space-y-1">
                  {tea.benefits.map((b, i) => (
                    <li key={i} className="text-[10px] text-gray-500 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tea.preparation && (
              <div>
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Preparation</h5>
                <p className="text-[10px] text-gray-500 leading-relaxed">{tea.preparation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NutritionItem = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
    className="flex gap-8 items-start p-8 hover:shadow-2xl rounded-[2.5rem] transition-all border border-transparent hover:border-white group"
  >
    <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-accent transition-all duration-500">
      <Icon size={32} />
    </div>
    <div>
      <h4 className="text-2xl font-black text-primary mb-2 tracking-tight group-hover:text-accent transition-colors">{title}</h4>
      <p className="text-base text-gray-400 font-medium leading-[1.7]">{description}</p>
    </div>
  </motion.div>
);

export const DietaryDefenseModule: React.FC = () => {
  const isPremium = usePremium();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResults, setScanResults] = useState<MealScanResults | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    let isActive = true;
    setCameraError(null);

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not available in this browser.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        if (isActive) {
          setCameraError(error instanceof Error ? error.message : 'Unable to access the camera.');
        }
      }
    };

    void startCamera();

    return () => {
      isActive = false;
      const stream = streamRef.current;
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isScanning]);

  const analyzeCurrentMeal = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const hasLiveVideoTrack = streamRef.current?.getVideoTracks().some((track) => track.readyState === 'live');

    setAnalysisError(null);
    setScanResults(null);

    if (!video || !canvas || !hasLiveVideoTrack || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setAnalysisError('The camera is not ready yet. Wait for the live preview, then try again.');
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      setAnalysisError('The camera frame is unavailable. Please reposition the meal and try again.');
      return;
    }

    setIsLoading(true);
    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Unable to prepare the camera image. Please try again.');

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
      if (!imageBase64) throw new Error('Unable to capture the camera image. Please try again.');

      setScanResults(await analyzeMealImage(imageBase64));
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : 'Meal analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = () => {
    const stream = streamRef.current;
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    stream?.getTracks().forEach((track) => track.stop());
    setIsScanning(false);
  };

  return (
    <section className="space-y-4" aria-label="Anti-inflammatory meal combinations">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-300">Anti-inflammatory meal combinations</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">Whole-food meal ideas from the Dietary Defense library.</p>
      </div>
      {isScanning ? (
        <div
          className="bg-slate-900 border border-emerald-500/30 rounded-xl overflow-hidden relative aspect-video w-full max-w-md mx-auto my-4 flex flex-col items-center justify-center"
          role="status"
          aria-label="Camera scanner"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Live meal camera preview"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
          <div className="absolute inset-0 z-[1] bg-slate-950/30" aria-hidden="true" />
          <div className="absolute inset-5 z-10 rounded-lg border border-emerald-400/40 animate-pulse" aria-hidden="true">
            <div className="absolute inset-1/3 rounded-full border border-emerald-400/30" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-emerald-400/20" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-emerald-400/20" />
            <div className="absolute left-1/4 top-0 h-full w-px bg-emerald-400/10" />
            <div className="absolute left-3/4 top-0 h-full w-px bg-emerald-400/10" />
            <div className="absolute left-0 top-1/4 h-px w-full bg-emerald-400/10" />
            <div className="absolute left-0 top-3/4 h-px w-full bg-emerald-400/10" />
          </div>
          <p className="relative z-20 max-w-[85%] rounded-lg bg-slate-900/80 px-3 py-2 text-center text-xs font-semibold tracking-wide text-emerald-200">
            {cameraError ? `📸 ${cameraError}` : '📸 STANDBY: PLACE MEAL IN VIEW...'}
          </p>
          <button
            type="button"
            onClick={stopScanner}
            className="absolute bottom-3 z-20 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
          >
            ⏹️ Stop Scanner
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsScanning(true);
            setScanResults(null);
            setAnalysisError(null);
          }}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium rounded-xl transition duration-200 shadow-md shadow-emerald-900/20 text-center cursor-pointer"
        >
          📸 Scan Anti-Inflammatory Meal/Drink with Camera
        </button>
      )}
      {isScanning && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={analyzeCurrentMeal}
            disabled={isLoading}
            className="w-full max-w-md rounded-xl border border-emerald-500/40 bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-900/20 transition-colors duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            🔍 Analyze Meal with Gemini AI
          </button>
        </div>
      )}
      {isLoading && (
        <div
          className="w-full max-w-md mx-auto rounded-xl border border-slate-700 bg-slate-900 p-4 animate-pulse"
          role="status"
          aria-live="polite"
        >
          <p className="text-center text-xs font-bold tracking-wide text-emerald-200">
            🧬 GEMINI AI INTEL CORE: DEEP SCANNING FOOD ATOMS...
          </p>
          <div className="mt-4 space-y-2" aria-hidden="true">
            <div className="h-3 w-2/3 rounded bg-slate-700" />
            <div className="h-3 w-full rounded bg-slate-800" />
            <div className="h-3 w-5/6 rounded bg-slate-800" />
          </div>
        </div>
      )}
      {analysisError && (
        <p className="mx-auto w-full max-w-md rounded-xl border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-200" role="alert">
          {analysisError}
        </p>
      )}
      {scanResults && (
        <article className="w-full max-w-md mx-auto rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 shadow-lg shadow-emerald-950/20">
          <h4 className="text-sm font-black uppercase tracking-wider text-emerald-200">Gemini meal scan results</h4>
          <div className="mt-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected items</h5>
            {scanResults.detected_items.length ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {scanResults.detected_items.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-100">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-300">No identifiable food items were found in this frame.</p>
            )}
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Anti-inflammatory index</span>
              <span className="text-slate-100">{scanResults.score}/100</span>
            </div>
            <div
              className="mt-2 h-3 overflow-hidden rounded-full bg-slate-700"
              role="meter"
              aria-label="Anti-inflammatory index"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={scanResults.score}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${
                  scanResults.score >= 70 ? 'bg-emerald-400' : scanResults.score >= 40 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${scanResults.score}%` }}
              />
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-slate-700 pt-4 sm:grid-cols-2">
            <section className="rounded-xl border border-emerald-500/20 bg-slate-800 p-4">
              <h5 className="text-sm font-bold text-emerald-200">🥗 Quick Anti-Inflammatory Recipe</h5>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-100">{scanResults.quick_recipe}</p>
            </section>
            <section className="rounded-xl border border-sky-500/20 bg-slate-800 p-4">
              <h5 className="text-sm font-bold text-sky-200">☕ Warming Therapeutic Beverage</h5>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-100">{scanResults.beverage_pairing}</p>
            </section>
          </div>
        </article>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {RECIPES.map((recipe, index) => (
          isPremium || index === 0 ? (
            <article key={recipe.name} className="rounded-xl border border-slate-700/80 bg-slate-950/60 p-4">
              <h4 className="text-sm font-bold text-slate-100">{recipe.name}</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{recipe.description}</p>
            </article>
          ) : (
            <button
              key={recipe.name}
              type="button"
              onClick={() => navigate('/checkout')}
              className="bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm rounded-xl p-6 text-center text-xs text-amber-400 font-bold"
            >
              🔒 Premium Feature: Unlock Technical Library
            </button>
          )
        ))}
      </div>
    </section>
  );
};

export const ThermalInfusionsModule: React.FC = () => {
  const isPremium = usePremium();
  const navigate = useNavigate();
  const date = new Date();
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const storageKey = `knee-care-tea-log-${dateKey}`;
  const [loggedTeas, setLoggedTeas] = useState<Set<string>>(
    () => new Set(localStorage.getItem(storageKey)?.split('\n').filter(Boolean) ?? [])
  );

  const toggleTeaLog = (teaName: string) => {
    const updatedLogs = new Set(loggedTeas);
    if (updatedLogs.has(teaName)) {
      updatedLogs.delete(teaName);
    } else {
      updatedLogs.add(teaName);
    }
    setLoggedTeas(updatedLogs);
    localStorage.setItem(storageKey, [...updatedLogs].join('\n'));
  };

  return (
    <section className="space-y-4" aria-label="Daily warming fluid log">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-300">Daily warm infusion log</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">Tap a tea to record or update today’s warming-fluid log.</p>
      </div>
      <ul className="space-y-2">
        {TEAS.map((tea, index) => {
          const isLogged = loggedTeas.has(tea.name);
          if (!isPremium && index > 0) {
            return (
              <li key={tea.name}>
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm rounded-xl p-6 text-center text-xs text-amber-400 font-bold w-full"
                >
                  🔒 Premium Feature: Unlock Technical Library
                </button>
              </li>
            );
          }

          return (
            <li key={tea.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-950/60 p-3">
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-100">{tea.name}</h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{tea.benefit}</p>
              </div>
              <button
                type="button"
                aria-pressed={isLogged}
                onClick={() => toggleTeaLog(tea.name)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  isLogged
                    ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
                    : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isLogged ? 'Logged today' : 'Log infusion'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export const DietSection: React.FC = () => {
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [herbalOpen, setHerbalOpen] = useState(false);
  const isPremium = usePremium();


  const navigate = useNavigate();

  const handleLockedClick = () => {
    navigate('/checkout');
  };

  return (
    <PageWrapper>
      <header className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-accent/20">
          <Utensils size={14} /> Structural Nutrition
        </div>
        <h1 className="text-4xl font-black text-primary mb-4 tracking-tight">Joint Preservation Fuel</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto text-lg leading-relaxed">Optimize your biochemistry with foods that reduce inflammation and build collagen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="px-4 mb-4">
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Phase 1: Foundation</h3>
          </div>
          <div className="space-y-2">
            <NutritionItem 
              icon={Droplets} 
              title="Liquid Integrity" 
              description="Hydration is the primary driver of synovial fluid production, ensuring smooth joint mechanics." 
            />
            <NutritionItem 
              icon={Leaf} 
              title="Anti-Inflammatory Hub" 
              description="Polyphenols found in deep pigments neutralize oxidative stress in joint tissues." 
            />
            <NutritionItem 
              icon={Zap} 
              title="Electrolyte Balance" 
              description="Critical mineral ratios prevent muscular pull and maintain nerve conductivity." 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="px-4 mb-4">
            <h3 className="text-xs font-black text-accent uppercase tracking-[0.3em]">Phase 2: Joint Shielding</h3>
          </div>
          <div className="space-y-2">
            <NutritionItem 
              icon={Egg} 
              title="Amino Reconstruction" 
              description="High-density proteins provide the literal bricks for cartilaginous preservation and muscle synthesis." 
            />
            <NutritionItem 
              icon={Coffee} 
              title="Strategic Restriction" 
              description="Eliminating metabolic friction by minimizing refined sugars and artificial additives." 
            />
            <NutritionItem 
              icon={Utensils} 
              title="Lipid Lubrication" 
              description="Omega-3 fatty acids act as high-grade internal lubricant for structural hinges." 
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md rounded-[3.5rem] overflow-hidden relative group/card border border-white">
          <button 
            onClick={() => setRecipesOpen(!recipesOpen)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${isPremium ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-inner`}>
                {isPremium ? <Utensils size={28} /> : <Lock size={28} />}
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-black text-primary group-hover:text-accent transition-colors tracking-tight">Anti-Inflammatory Recipes</h2>
                {!isPremium ? (
                  <div className="inline-flex items-center gap-1.5 mt-1 bg-accent/10 px-2 py-0.5 rounded-lg">
                    <span className="text-[10px] text-accent font-black uppercase tracking-widest">Premium Resource</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-medium mt-1">Anti-inflammatory meal frameworks</p>
                )}
              </div>
            </div>
            <motion.div
              animate={{ rotate: recipesOpen ? 180 : 0 }}
              className="text-gray-300 group-hover:text-accent transition-all bg-muted rounded-full p-2"
            >
              {isPremium ? <ChevronDown size={24} /> : <ArrowRight size={20} />}
            </motion.div>
          </button>
          
          <AnimatePresence>
            {recipesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {RECIPES.map((recipe, i) => (
                    isPremium || i === 0 ? (
                      <motion.div
                        key={recipe.name}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="p-8 rounded-[2.5rem] bg-white border border-white shadow-sm hover:shadow-2xl transition-all group/item"
                      >
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent">
                          <Leaf size={20} />
                        </div>
                        <h4 className="text-xl font-bold text-primary mb-3 group-hover/item:text-accent transition-colors tracking-tight">
                          {recipe.name}
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{recipe.description}</p>
                      </motion.div>
                    ) : (
                      <button
                        key={recipe.name}
                        type="button"
                        onClick={handleLockedClick}
                        className="bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm rounded-xl p-6 text-center text-xs text-amber-400 font-bold"
                      >
                        🔒 Premium Feature: Unlock Technical Library
                      </button>
                    )
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isPremium && (
            <div className="relative mt-6 mb-2 w-full flex flex-col items-center justify-center p-4">
  <div 
    onClick={handleLockedClick}
    className="bg-primary text-secondary px-8 py-4 rounded-[2rem] text-sm font-bold shadow-2xl flex items-center gap-3 animate-bounce cursor-pointer transform transition active:scale-95 hover:bg-primary/90"
  >
    <Sparkles size={20} className="text-accent" /> Unlock Structural Recipes
  </div>



              <p className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest">Premium Content</p>
            </div>
          )}
        </Card>

        <Card className="p-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-md rounded-[3.5rem] overflow-hidden relative group/card border border-white">
          <button 
            onClick={() => setHerbalOpen(!herbalOpen)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl ${isPremium ? 'bg-primary/5 text-primary' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-inner`}>
                {isPremium ? <Coffee size={28} /> : <Lock size={28} />}
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-black text-primary group-hover:text-accent transition-colors tracking-tight">Herbal Infusions</h2>
                {!isPremium ? (
                  <div className="inline-flex items-center gap-1.5 mt-1 bg-accent/10 px-2 py-0.5 rounded-lg">
                    <span className="text-[10px] text-accent font-black uppercase tracking-widest">Premium Resource</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 font-medium mt-1">Specific joint-support teas</p>
                )}
              </div>
            </div>
            <motion.div
              animate={{ rotate: herbalOpen ? 180 : 0 }}
              className="text-gray-300 group-hover:text-accent transition-all bg-muted rounded-full p-2"
            >
              {isPremium ? <ChevronDown size={24} /> : <ArrowRight size={20} />}
            </motion.div>
          </button>
          
          <AnimatePresence>
            {herbalOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {TEAS.map((tea, i) => (
                    isPremium || i === 0 ? (
                      <TeaItem key={tea.name} tea={tea} />
                    ) : (
                      <button
                        key={tea.name}
                        type="button"
                        onClick={handleLockedClick}
                        className="bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm rounded-xl p-6 text-center text-xs text-amber-400 font-bold"
                      >
                        🔒 Premium Feature: Unlock Technical Library
                      </button>
                    )
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!isPremium && (
            <div className="relative mt-6 mb-2 w-full flex flex-col items-center justify-center p-4">
  <div 
    onClick={handleLockedClick}
    className="bg-primary text-secondary px-8 py-4 rounded-[2rem] text-sm font-bold shadow-2xl flex items-center gap-3 cursor-pointer transform transition active:scale-95 hover:bg-primary/90"
  >
    <Coffee size={20} className="text-accent" /> Unlock Herbal Infusions
  </div>



              <p className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest">Premium Content</p>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
};

export default DietSection;
