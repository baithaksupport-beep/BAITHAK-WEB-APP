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
          // Profile row does not exist yet (waiting for trigger/sync)
          console.warn('Profile not found for authenticated user. Auto-creating fallback row.');
          return null;
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

    // 1. Check active session on mount
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!isMounted) return;

      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
        const profileData = await fetchProfile(initialSession.user.id);
        if (isMounted) setProfile(profileData);
      }
      setLoading(false);
    });

    // 2. Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      setLoading(true);
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        if (isMounted) setProfile(profileData);
      } else {
        if (isMounted) setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
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
