"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, type = 'protected' }) => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // 1. Unauthenticated users handling
    if (!user) {
      if (type !== 'public-only') {
        router.replace('/');
      }
      return;
    }

    // 2. Authenticated but profile onboarding is NOT completed yet
    if (profile && !profile.setup_completed) {
      if (type !== 'onboarding-only') {
        router.replace('/profile-setup');
      }
      return;
    }

    // 3. Authenticated and profile onboarding is fully completed
    if (profile && profile.setup_completed) {
      if (type !== 'protected') {
        router.replace('/dashboard');
      }
      return;
    }
  }, [user, profile, loading, type, router]);

  useEffect(() => {
    let retryTimer;
    if (user && !profile && !loading) {
      // Attempt to fetch profile again after 3 seconds if stuck
      retryTimer = setTimeout(() => {
        if (typeof refreshProfile === 'function') {
          refreshProfile();
        }
      }, 3000);
    }
    return () => clearTimeout(retryTimer);
  }, [user, profile, loading, refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent-yellow" size={32} />
          <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
            Initializing Baithak...
          </p>
        </div>
      </div>
    );
  }

  // Handle intermediate profile sync state loading
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4 text-center">
          <Loader2 className="animate-spin text-accent-yellow" size={32} />
          <div className="space-y-1">
            <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
              Syncing Profile Data...
            </p>
            <p className="text-[10px] text-on-surface-variant/50 max-w-[200px]">
              If this takes too long, your session might be broken.
            </p>
          </div>
          <button 
            onClick={signOut}
            className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Clear Session
          </button>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated
  if (!user && type === 'public-only') {
    return children;
  }

  // 1.5 Unauthenticated but requesting protected route - force loader while replacing
  if (!user && type !== 'public-only') {
    return (
      <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent-yellow" size={32} />
          <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  // 2. Authenticated, onboarding incomplete
  if (user && profile && !profile.setup_completed && type === 'onboarding-only') {
    return children;
  }

  // 3. Authenticated, onboarding complete
  if (user && profile && profile.setup_completed && type === 'protected') {
    return children;
  }

  // While redirecting, show loader to prevent layout flashing
  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent-yellow" size={32} />
        <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
          Redirecting...
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
