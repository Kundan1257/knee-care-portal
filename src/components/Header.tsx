// 🎯 STEP A: Paste this import line right at the very top row of Header.tsx:
import { usePWAInstall } from '@/src/hooks/usePWAInstall.ts';

// 🎯 STEP B: Paste this trigger execution line right inside your main Header function component block:
const { isInstallable, triggerInstall } = usePWAInstall();

// 🎯 STEP C: Drop this button markup directly inside your header row HTML layout tree:
{isInstallable && (
  <button 
    onClick={triggerInstall}
    className="bg-[#1E3A34] text-white px-4 py-2 rounded-lg font-semibold border border-emerald-500 animate-pulse flex items-center gap-2 text-sm"
  >
    📥 Install App
  </button>
)}
