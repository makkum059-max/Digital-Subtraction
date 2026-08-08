import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-5 py-4 rounded-2xl shadow-2xl bg-gray-900/95 backdrop-blur-xl text-white border border-emerald-500/40 max-w-md animate-slide-up ring-4 ring-emerald-500/10"
    >
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>নোটিফিকেশন সেভ সিস্টেম</span>
        </div>
        <p className="text-xs font-bold leading-snug text-gray-100">{toast.message}</p>
      </div>
    </div>
  );
};

