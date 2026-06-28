"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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
        if (error.code === 'PGRST116') {
          // Profile row does not exist yet. Returning fallback onboarding state.
          console.warn('Profile not found for authenticated user. Returning fallback onboarding state.');
          return { id: userId, setup_completed: false };
        }
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err.message);
      return null;
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

    // Safety fallback: if auth takes longer than 8 seconds, force stop loading
    // This prevents users from getting permanently stuck on "Initializing Baithak..."
    const safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth initialization timed out. Forcing load completion.');
        setLoading(false);
      }
    }, 8000);

    // In Supabase v2, onAuthStateChange immediately fires an 'INITIAL_SESSION' event.
    // By relying solely on this listener, we prevent race conditions with getSession() during React 18 StrictMode.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      try {
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          if (isMounted) setProfile(profileData);
        } else {
          if (isMounted) setProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
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
      const redirectUrl = window.location.origin;

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
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
