"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {}
});

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the public profile record for the authenticated user
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('JSON object requested, multiple (or no) rows returned')) {
          // Profile row does not exist yet. Returning fallback onboarding state.
          console.warn('Profile not found for authenticated user. Returning fallback onboarding state.');
          return { id: userId, setup_completed: false };
        }
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      return { id: userId, setup_completed: false, error: true };
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timed out. Forcing load completion.');
        setLoading(false);
      }
    }, 8000);

    // 1. Explicit Session Fetch (Bypasses Strict Mode drops)
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (isMounted) {
          setSession(session);
          setUser(session?.user || null);
        }

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (isMounted) setProfile(profileData);
        }
      } catch (error) {
        console.error("Critical Auth Initialization Error:", error);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    initializeAuth();

    // 2. Background Listener for Future Events Only
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Ignore INITIAL_SESSION as it is handled by getSession() above
      if (!isMounted || event === 'INITIAL_SESSION') return; 

      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        if (isMounted) setProfile(profileData);
      } else {
        if (isMounted) setProfile(null);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Google sign-up/login failed:', err.message);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Logout failed:', err.message);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setLoading(false);
      router.refresh();
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
