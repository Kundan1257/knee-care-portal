import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackToDashboardProps {
  setActiveBox: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function BackToDashboard({ setActiveBox }: BackToDashboardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        setActiveBox(null);
        navigate('/');
      }}
      className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 font-bold text-sm mb-6 cursor-pointer transition-all"
    >
      <ChevronLeft size={18} />
      <span>Back to Dashboard</span>
    </button>
  );
}
