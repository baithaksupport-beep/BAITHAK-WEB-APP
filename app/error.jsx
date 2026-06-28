"use client"; // Error components must be Client Components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error('Baithak Application Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-red-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full animate-fade-in">
        
        <div className="relative w-24 h-24 flex items-center justify-center mb-2">
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse blur-xl"></div>
          <div className="relative w-20 h-20 bg-surface-dark border border-red-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertOctagon size={32} className="text-red-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-heading font-bold tracking-tight text-on-surface">
            System Malfunction
          </h1>
          <p className="text-sm text-on-surface-variant/80 leading-relaxed px-2">
            A critical component crashed while trying to load this page. We've logged the error.
          </p>
          <div className="bg-black/30 border border-white/5 rounded-xl p-4 mt-4 w-full text-left overflow-hidden">
            <p className="text-[10px] font-mono text-red-400/80 truncate">
              {error?.message || "Unknown rendering exception"}
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </button>
          
          <Link 
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home size={16} />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
