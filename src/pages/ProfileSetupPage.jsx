import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, User, Camera, Check, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

// Predefined modern gradient avatars
const PRESET_AVATARS = [
  { id: 1, grad: "from-[#8A2387] via-[#E94057] to-[#F27121]", symbol: "💻", name: "Coder" },
  { id: 2, grad: "from-[#11998e] to-[#38ef7d]", symbol: "🌱", name: "Gardener" },
  { id: 3, grad: "from-[#FFB75E] to-[#ED8F03]", symbol: "⚡", name: "Spark" },
  { id: 4, grad: "from-[#00F2FE] to-[#4FACFE]", symbol: "☄️", name: "Meteor" },
  { id: 5, grad: "from-[#fc00ff] to-[#00dbde]", symbol: "🔮", name: "Mage" },
  { id: 6, grad: "from-[#FF416C] to-[#FF4B2B]", symbol: "🔥", name: "Blaze" }
];

const ProfileSetupPage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(null);

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
        if (profile.avatar_url.startsWith('http')) {
          setCustomAvatarUrl(profile.avatar_url);
          setSelectedAvatar({
            id: 99,
            grad: '',
            symbol: '👤',
            custom: true,
            url: profile.avatar_url
          });
        } else {
          const matched = PRESET_AVATARS.find(av => av.symbol === profile.avatar_url);
          if (matched) setSelectedAvatar(matched);
        }
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

  // Secure Cloudflare R2 Upload Pipeline
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

    setIsUploading(true);
    setUploadError('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : 'https://baithak-web-app.vercel.app');
      const fileExt = file.name.split('.').pop();
      const uniqueFilename = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      // 1. Fetch pre-signed PUT URL from FastAPI backend
      const presignedRes = await fetch(
        `${apiBaseUrl}/api/v1/storage/presigned-url?filename=${encodeURIComponent(uniqueFilename)}&content_type=${encodeURIComponent(file.type)}`
      );

      if (!presignedRes.ok) {
        throw new Error('Failed to retrieve secure presigned upload URL from backend.');
      }

      const { presigned_url, public_url } = await presignedRes.json();

      // 2. Perform direct binary upload to Cloudflare R2 from browser
      const uploadRes = await fetch(presigned_url, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadRes.ok) {
        throw new Error('Failed uploading asset binary to Cloudflare R2 storage bucket.');
      }

      // 3. Update frontend state
      setCustomAvatarUrl(public_url);
      setSelectedAvatar({
        id: 99,
        grad: '',
        symbol: '👤',
        custom: true,
        url: public_url
      });

    } catch (err) {
      console.error('R2 Pipeline Error:', err);
      setUploadError(err.message || 'R2 Secure Upload Pipeline failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
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

      // 2. Save display name, username, R2 avatar, and complete onboarding
      const avatarUrl = selectedAvatar.custom ? customAvatarUrl : selectedAvatar.symbol;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username,
          display_name: displayName,
          avatar_url: avatarUrl,
          setup_completed: true
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 3. Refresh profile state in Context (triggers router switch to /dashboard)
      await refreshProfile();

    } catch (err) {
      console.error('Profile Onboarding Failed:', err);
      setSubmitError(err.message || 'Failed saving onboarding profile details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    username.trim() !== '' && 
    displayName.trim() !== '' && 
    usernameError === '' &&
    !isUploading &&
    !isSubmitting;

  return (
    <div className="min-h-screen bg-bg-dark text-on-surface font-body flex flex-col items-center justify-center py-12 px-6 select-none relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-navy/20 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Back Button (Triggers Safe Logout) */}
      <button 
        onClick={signOut}
        className="fixed top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-accent-yellow transition-colors cursor-pointer group z-50 bg-surface-dark/60 border border-white/10 px-4 py-2 rounded-full shadow-lg"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Cancel & Sign Out</span>
      </button>

      {/* Main Glassmorphic Form Card */}
      <div className="w-full max-w-md bg-surface-dark border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_60px_rgba(255,186,9,0.1)] transition-all duration-500 overflow-hidden z-10">
        <div className="p-8 md:p-10 space-y-8">
          
          {/* Header */}
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-yellow/10 border border-accent-yellow/20 text-[11px] font-bold text-accent-yellow shadow-md uppercase tracking-wider">
              <Sparkles size={11} className="animate-pulse" />
              <span>Step 2 of 2: Onboarding</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-on-surface tracking-tight">
              Create Profile
            </h1>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed">
              Choose your display identity and pick an avatar to represent you inside campus rooms.
            </p>
          </div>

          {/* Errors */}
          {submitError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/15 rounded-xl px-4 py-3 flex gap-2 text-left items-center animate-fade-in">
              <AlertCircle size={14} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display Name Input */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-widest block">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Soumya Patnaik"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-bg-dark border border-white/10 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow/20 rounded-2xl px-5 py-4 pl-12 outline-none transition-all duration-300 text-xs font-body text-on-surface placeholder:text-on-surface-variant/35"
                  required
                />
                <User size={15} className="text-on-surface-variant/40 absolute left-4.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-widest block">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant/40 font-mono font-bold">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`w-full bg-bg-dark border focus:ring-1 rounded-2xl px-5 py-4 pl-9 outline-none transition-all duration-300 text-xs font-body text-on-surface placeholder:text-on-surface-variant/35 ${
                    usernameError 
                      ? 'border-red-400/80 focus:border-red-500 focus:ring-red-400/20' 
                      : username && !usernameError 
                        ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20' 
                        : 'border-white/10 focus:border-accent-yellow focus:ring-accent-yellow/20'
                  }`}
                  required
                />
                {username && !usernameError && (
                  <Check className="text-emerald-400 absolute right-4.5 top-1/2 -translate-y-1/2 stroke-[2.5]" size={16} />
                )}
              </div>
              
              {usernameError ? (
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-semibold mt-1">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{usernameError}</span>
                </div>
              ) : (
                <p className="text-[9px] text-on-surface-variant/50 font-medium leading-relaxed">
                  Only lowercase letters, numbers, and underscores are allowed (3-15 characters).
                </p>
              )}
            </div>

            {/* Avatar Selector Grid */}
            <div className="space-y-3.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-accent-yellow uppercase tracking-widest block">
                  Select Avatar
                </label>
                {uploadError && (
                  <span className="text-[9px] text-red-400 font-medium animate-pulse">{uploadError}</span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                {/* Custom Photo Upload Button */}
                <div className="relative group">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-square w-full rounded-full border-2 border-dashed bg-bg-dark/40 hover:bg-accent-yellow/5 flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer ${
                      selectedAvatar.custom
                        ? 'border-accent-yellow ring-4 ring-accent-yellow/20 scale-105'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 size={16} className="animate-spin text-accent-yellow" />
                    ) : customAvatarUrl ? (
                      <img 
                        src={customAvatarUrl} 
                        alt="Upload Preview" 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      <>
                        <Camera size={16} className="text-on-surface-variant/60 group-hover:text-accent-yellow transition-colors mb-1" />
                        <span className="text-[8px] text-on-surface-variant/80 group-hover:text-accent-yellow font-bold text-center leading-none">Photo</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {selectedAvatar.custom && !isUploading && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-yellow text-bg-dark rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md z-10 border border-bg-dark">
                      <Check size={11} className="stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Preset Gradient Buttons */}
                {PRESET_AVATARS.map((av) => {
                  const isSelected = selectedAvatar.id === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => handleAvatarSelect(av)}
                      className={`relative aspect-square rounded-full bg-gradient-to-tr ${av.grad} flex items-center justify-center text-xl shadow-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 ${
                        isSelected
                          ? 'border-accent-yellow ring-4 ring-accent-yellow/20 scale-105'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{av.symbol}</span>
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-yellow text-bg-dark rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-md z-10 border border-bg-dark">
                          <Check size={11} className="stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Onboarding Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid}
              className="w-full py-4 text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_35px_rgba(255,186,9,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Submitting profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default ProfileSetupPage;
