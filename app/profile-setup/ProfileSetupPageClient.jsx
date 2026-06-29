"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, User, Camera, Check, AlertCircle, ArrowRight, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';

const R2_BASE_URL = (process.env.NEXT_PUBLIC_R2_URL || 'https://pub-a45e2aa5add24ba0a8813221a09a64a9.r2.dev').replace(/\/$/, '');

const PRESET_AVATARS = Array.from({ length: 24 }, (_, i) => 
  `${R2_BASE_URL}/avatars/preset/avatar${i + 1}.png`
);

const SwipeToSubmit = ({ isSubmitting, disabled, onSubmit }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleStart = (clientX) => {
    if (disabled || isSubmitting) return;
    isDragging.current = true;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current || !containerRef.current || !sliderRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRef.current.offsetWidth;
    const maxScroll = containerRect.width - sliderWidth - 8;
    let newX = clientX - containerRect.left - sliderWidth / 2;
    newX = Math.max(0, Math.min(newX, maxScroll));
    setSliderPosition(newX);
  };

  const handleEnd = () => {
    if (!isDragging.current || !containerRef.current || !sliderRef.current) return;
    isDragging.current = false;
    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRef.current.offsetWidth;
    const maxScroll = containerRect.width - sliderWidth - 8;
    
    if (sliderPosition > maxScroll * 0.8) {
      setSliderPosition(maxScroll);
      onSubmit();
    } else {
      setSliderPosition(0);
    }
  };

  useEffect(() => {
    if (!isSubmitting && sliderPosition > 0) {
      setSliderPosition(0);
    }
  }, [isSubmitting]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-12 bg-bg-dark/80 rounded-xl border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden select-none flex md:hidden ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest z-0 pointer-events-none">
        {isSubmitting ? (
           <span className="flex items-center gap-2 text-accent-yellow"><Loader2 size={14} className="animate-spin" /> Submitting...</span>
        ) : (
           "Slide to complete"
        )}
      </div>
      <div 
        ref={sliderRef}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        style={{ transform: `translateX(${sliderPosition}px)` }}
        className={`absolute top-1 left-1 bottom-1 w-12 bg-accent-yellow rounded-lg flex items-center justify-center z-10 ${disabled || isSubmitting ? 'cursor-not-allowed' : 'cursor-grab'} ${!isDragging.current ? 'transition-transform duration-300' : ''}`}
      >
        <ArrowRight size={16} className="text-bg-dark" />
      </div>
    </div>
  );
};

const ProfileSetupPageClient = () => {
  const { user, session, profile, signOut, refreshProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Status & Validation States
  const [usernameError, setUsernameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  
  const fileInputRef = useRef(null);

  // Initialize fields once profile loads
  useEffect(() => {
    if (profile) {
      if (profile.display_name) setDisplayName(profile.display_name);
      if (profile.username) setUsername(profile.username);
      
      // If profile already had a custom avatar set
      if (profile.avatar_url) {
        setCustomAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile]);

  // Validate Username rules
  const validateUsername = (val) => {
    const cleanVal = val.startsWith('@') ? val.slice(1) : val;
    
    if (cleanVal.trim() === '') {
      return 'Username is required.';
    }
    if (/[A-Z]/.test(cleanVal)) {
      return 'Username must be lowercase only.';
    }
    if (/\s/.test(cleanVal)) {
      return 'Username cannot contain spaces.';
    }
    if (!/^[a-z0-9_]+$/.test(cleanVal)) {
      return 'Only lowercase letters, numbers, and underscores are allowed.';
    }
    if (cleanVal.length < 3) {
      return 'Username must be at least 3 characters.';
    }
    if (cleanVal.length > 15) {
      return 'Username cannot exceed 15 characters.';
    }
    return '';
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/\s/g, '');
    setUsername(val);
    const errorMsg = validateUsername(val);
    setUsernameError(errorMsg);
  };

  // Just validate and hold the file locally
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict validation: max 4MB, must be image
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('Image size must be less than 4MB.');
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Instantly show local preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    
    const errorMsg = validateUsername(username);
    if (errorMsg || !username || !displayName) {
      if (errorMsg) setUsernameError(errorMsg);
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Verify Username Uniqueness
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id);

      if (checkError) throw checkError;

      if (existingUser && existingUser.length > 0) {
        setUsernameError('This username is already claimed by another user.');
        setIsSubmitting(false);
        return;
      }

      // 2. Upload to Cloudflare R2 if a new file is selected
      let finalAvatarUrl = customAvatarUrl;

      if (selectedFile) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split('.').pop();
        const uniqueFilename = `avatars/user_uploaded/${user.id}-${Date.now()}.${fileExt}`;

        const presignedRes = await fetch(
          `/api/v1/storage/presigned-url?filename=${encodeURIComponent(uniqueFilename)}&content_type=${encodeURIComponent(selectedFile.type)}`,
          { headers: { 'Authorization': `Bearer ${session?.access_token || ''}` } }
        );

        if (!presignedRes.ok) throw new Error('Failed to retrieve secure presigned upload URL.');

        const { presigned_url, public_url } = await presignedRes.json();

        const uploadRes = await fetch(presigned_url, {
          method: 'PUT',
          headers: { 'Content-Type': selectedFile.type },
          body: selectedFile
        });

        if (!uploadRes.ok) throw new Error('Failed uploading asset binary to Cloudflare R2.');
        
        finalAvatarUrl = public_url;
      }

      // 3. Save profile and complete onboarding
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          display_name: displayName,
          avatar_url: finalAvatarUrl,
          setup_completed: true
        });

      if (updateError) throw updateError;

      // 4. Refresh profile state in Context (triggers router switch to /dashboard)
      await refreshProfile();

    } catch (err) {
      console.error('Profile Onboarding Failed:', err);
      setSubmitError(err.message || 'Failed saving onboarding profile details.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const isFormValid = 
    username.trim() !== '' && 
    displayName.trim() !== '' && 
    usernameError === '' &&
    !isUploading &&
    !isSubmitting;

  return (
    <ProtectedRoute type="onboarding-only">
      <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center py-12 px-6 select-none relative overflow-hidden">
        {/* Subtle SVG Noise Grain */}
        <div className="noise-overlay"></div>

        {/* Organic Glow Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-primary-navy/15 blur-[120px] rounded-[100%] pointer-events-none transform -rotate-6"></div>
        <div className="absolute bottom-10 left-10 w-[300px] h-[200px] bg-accent-yellow/5 blur-[90px] rounded-[100%] pointer-events-none transform rotate-12"></div>

        {/* Back Button (Triggers Safe Logout) */}
        <button 
          onClick={signOut}
          className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer group z-50 premium-glass px-4 py-2 rounded-full shadow-lg"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Cancel & Sign Out</span>
        </button>

        {/* Main Glassmorphic Form Card */}
        <div className="w-full max-w-4xl premium-glass rounded-[32px] hover:shadow-[0_25px_60px_rgba(255,186,9,0.08)] transition-all duration-500 overflow-hidden z-10 animate-fade-in relative mx-auto">
          <div className="p-8 md:p-12 space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-12">
            
            {/* Left Column: Info & Text Inputs */}
            <div className="flex flex-col space-y-8">
              {/* Header */}
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-xs font-bold text-accent-yellow shadow-[inset_0_1px_0_rgba(255,186,9,0.3)] uppercase tracking-wider">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>Step 2 of 2: Onboarding</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-heading font-bold text-on-surface/95 tracking-tighter">
                  Create Profile
                </h1>
                <p className="text-xs text-on-surface-variant/80 leading-relaxed max-w-sm">
                  Choose your display identity and pick an avatar to represent you inside campus rooms.
                </p>
              </div>

              {/* Errors */}
              {submitError && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/15 rounded-xl px-4 py-3 flex gap-2 text-left items-center animate-fade-in">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Text Form */}
              <form id="profile-form" onSubmit={handleSubmit} className="space-y-6 flex-1">
              
                {/* Display Name Input */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-accent-yellow uppercase tracking-widest block">
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Soumya Patnaik"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-bg-dark/80 border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] focus:border-accent-yellow/50 focus:ring-2 focus:ring-accent-yellow/10 rounded-2xl px-5 py-4 md:py-4 pl-14 outline-none transition-all duration-300 text-xs md:text-sm font-body text-on-surface placeholder:text-on-surface-variant/35"
                      required
                    />
                    <User size={16} className="text-on-surface-variant/40 absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Username Input */}
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold text-accent-yellow uppercase tracking-widest block">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs md:text-sm text-on-surface-variant/40 font-mono font-bold">@</span>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={handleUsernameChange}
                      className={`w-full bg-bg-dark/80 border shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] rounded-2xl px-5 py-4 md:py-4 pl-10 outline-none transition-all duration-300 text-xs md:text-sm font-body text-on-surface placeholder:text-on-surface-variant/35 ${
                        usernameError 
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' 
                          : username && !usernameError 
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10' 
                            : 'border-white/5 focus:border-accent-yellow/50 focus:ring-2 focus:ring-accent-yellow/10'
                      }`}
                      required
                    />
                    {username && !usernameError && (
                      <Check className="text-emerald-400 absolute right-5 top-1/2 -translate-y-1/2 stroke-[2.5]" size={16} />
                    )}
                  </div>
                  
                  {usernameError ? (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-1">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{usernameError}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant/50 font-medium leading-relaxed">
                      Only lowercase letters, numbers, and underscores are allowed (3-15 characters).
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: Avatar Selection */}
            <div className="flex flex-col space-y-6 bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/5">
              
              {/* Square Avatar Uploader */}
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-accent-yellow uppercase tracking-widest block">
                    Profile Photo
                  </label>
                  {uploadError && (
                    <span className="text-xs text-red-400 font-medium animate-pulse">{uploadError}</span>
                  )}
                </div>

                <div className="relative group w-32 h-32 md:w-40 md:h-40">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-full rounded-[24px] border-2 border-dashed bg-bg-dark/60 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] hover:bg-accent-yellow/5 flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer overflow-hidden ${
                      (customAvatarUrl || localPreviewUrl) && !PRESET_AVATARS.includes(customAvatarUrl)
                        ? 'border-accent-yellow shadow-[0_0_30px_rgba(255,186,9,0.2)] scale-105'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    {localPreviewUrl || (customAvatarUrl && !PRESET_AVATARS.includes(customAvatarUrl)) ? (
                      <>
                        <Image 
                          src={localPreviewUrl || customAvatarUrl} 
                          alt="Upload Preview" 
                          fill
                          sizes="160px"
                          className="object-cover"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <Camera size={24} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <UploadCloud size={28} className="text-on-surface-variant/60 group-hover:text-accent-yellow transition-colors" />
                        <span className="text-xs text-on-surface-variant/80 group-hover:text-accent-yellow font-bold text-center leading-none">Custom Photo</span>
                      </div>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {(localPreviewUrl || (customAvatarUrl && !PRESET_AVATARS.includes(customAvatarUrl))) && (
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-accent-yellow text-bg-dark rounded-full flex items-center justify-center text-sm font-extrabold shadow-xl z-10 border-[3px] border-bg-dark">
                      <Check size={18} className="stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Preset Avatars Selection */}
              <div className="pt-2 flex-1">
                <p className="text-[11px] text-on-surface-variant/70 uppercase tracking-wider font-bold mb-4">Or choose a preset</p>
                <div className="grid grid-cols-4 gap-4 md:gap-5 place-items-center max-w-sm mx-auto md:mx-0">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLocalPreviewUrl('');
                        setSelectedFile(null);
                        setCustomAvatarUrl(url);
                      }}
                      className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:scale-110 cursor-pointer shadow-md ${
                        customAvatarUrl === url && !localPreviewUrl
                          ? 'border-accent-yellow shadow-[0_0_20px_rgba(255,186,9,0.3)] scale-110 z-10'
                          : 'border-transparent hover:border-white/20'
                      }`}
                    >
                      <Image src={url} alt={`Preset ${idx + 1}`} fill sizes="56px" className="object-cover" unoptimized={true} />
                      {customAvatarUrl === url && !localPreviewUrl && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[1px]">
                          <Check size={18} className="text-accent-yellow stroke-[4]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Footer */}
          <div className="p-6 md:p-8 border-t border-white/10 bg-black/20 flex flex-col md:justify-end items-center md:items-end w-full">
            {/* Desktop Button (Hidden on Mobile) */}
            <Button
              form="profile-form"
              type="submit"
              variant="primary"
              disabled={!isFormValid || isSubmitting}
              className="hidden md:flex w-full md:w-auto px-8 py-3.5 text-xs md:text-sm font-bold tracking-widest uppercase hover:shadow-[0_0_30px_rgba(255,186,9,0.3)] transition-all items-center justify-center gap-2 group cursor-pointer rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Mobile Swipe to Submit (Hidden on Desktop) */}
            <SwipeToSubmit 
              isSubmitting={isSubmitting} 
              disabled={!isFormValid || isSubmitting} 
              onSubmit={() => {
                // Manually trigger the form submission via event since we are not a standard submit button
                const form = document.getElementById('profile-form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }} 
            />
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
};

export default ProfileSetupPageClient;
