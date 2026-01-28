
import React from 'react';


const LogoutConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-smart-dark/60 dark:bg-black/80 backdrop-blur-[2px]" 
        onClick={onCancel}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-[28px] shadow-2xl border border-gray-100 dark:border-white/5 p-6 animate-slide-up overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 text-red-500">
            <span className="material-symbols-outlined text-3xl">logout</span>
          </div>
          
          <h2 className="text-lg font-bold text-smart-dark dark:text-white mb-2 leading-tight">
            Log out of SmartBot?
          </h2>
          <p className="text-slate-gray/60 dark:text-gray-400 text-xs font-medium leading-relaxed mb-8">
            You'll need to sign back in to continue personalizing your shopping journey.
          </p>
          
          <div className="flex flex-col w-full gap-2.5">
            <button 
              onClick={onConfirm}
              className="w-full h-11 bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white text-xs font-bold rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              Log Out
            </button>
            <button 
              onClick={onCancel}
              className="w-full h-11 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-[0.98] text-smart-dark dark:text-gray-300 text-xs font-bold rounded-2xl transition-all"
            >
              Keep Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
