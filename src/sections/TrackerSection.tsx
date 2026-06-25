import React, { useState } from 'react';
import { saveKneeLog } from '../services/logService.ts';

export const TrackerSection: React.FC = () => {
  const [painScore, setPainScore] = useState<number>(3);
  const [stiffness, setStiffness] = useState<boolean>(false);
  const [swelling, setSwelling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  const getPainColor = (score: number) => {
    if (score <= 3) return 'from-blue-400 to-emerald-400 text-emerald-600';
    if (score <= 7) return 'from-yellow-400 to-orange-400 text-orange-500';
    return 'from-orange-500 to-rose-500 text-rose-600';
  };

  const handleLogSubmit = async () => {
    setLoading(true);
    setSaved(false);
    
    const result = await saveKneeLog({
      user_id: "test-user-1257",
      pain_score: painScore,
      stiffness: stiffness
    });

    setLoading(false);
    if (result) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 bg-white border border-blue-100 shadow-xl rounded-2xl text-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Knee Vital Tracker</h2>
      </div>

      <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-gray-700">Daily Pain Spectrum</label>
          <span className={`text-lg font-black px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-slate-100 ${getPainColor(painScore)}`}>
            Level {painScore}
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={painScore}
          onChange={(e) => setPainScore(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-bold text-gray-700 block mb-2">Joint Indicators</label>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStiffness(!stiffness)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition duration-200 active:scale-95 ${
              stiffness ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            🛌 Morning Stiffness
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleLogSubmit}
        className="w-full py-4 rounded-xl text-center font-black text-white bg-gray-900 shadow-md"
      >
        {loading ? 'Transmitting... ⏳' : saved ? 'Entry Logged! ✓' : 'Save Daily Log'}
      </button>
    </div>
  );
};
