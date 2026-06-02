import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, type = 'protected' }) => {
  const { user, profile, loading } = useAuth();
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

  // 1. Unauthenticated users handling
  if (!user) {
    if (type === 'public-only') {
      return children;
    }
    return <Navigate to="/" replace />;
  }

  if (user && !profile) {
    return (
      <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
        <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent-yellow" size={32} />
          <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
            Syncing Profile Data...
          </p>
        </div>
      </div>
    );
  }

  // 2. Authenticated but profile onboarding is NOT completed yet
  if (profile && !profile.setup_completed) {
    if (type === 'onboarding-only') {
      return children;
    }
    return <Navigate to="/profile-setup" replace />;
  }

  // 3. Authenticated and profile onboarding is fully completed
  if (profile && profile.setup_completed) {
    if (type === 'protected') {
      return children;
    }
    // Authenticated and set-up users trying to access Landing/Login or Setup go straight to Feed
    return <Navigate to="/dashboard" replace />;
  }

  // Final fallback safety net
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;