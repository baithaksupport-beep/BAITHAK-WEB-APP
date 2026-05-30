import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, type = 'protected' }) => {
  const { user, profile, loading } = useAuth();

  // Premium glassmorphic loading spinner
  if (loading) {
    return null;
  }

  // 1. Unauthenticated users
  if (!user) {
    if (type === 'public-only') {
      return children;
    }
    return <Navigate to="/" replace />;
  }

  // 2. Authenticated but profile is not completed yet
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
    // Authenticated and set-up users trying to access Landing/Login or Setup
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback: profile is null on initial sign-up state (waiting for DB trigger to complete)
  // Render loading while profile row is synced
  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent-yellow" size={32} />
        <p className="text-xs text-on-surface-variant font-semibold tracking-wider">
          Provisioning Community Profile...
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
