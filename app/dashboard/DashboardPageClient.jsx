"use client";

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Award, MessageSquare, ShieldCheck, ChevronRight, Hash, Sparkles } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';

const DashboardPageClient = () => {
  const { user, profile, signOut } = useAuth();

  const MOCK_ROOMS = [
    { name: 'operating-systems', desc: 'Prof. Sharma\'s grading tips & exam notes', count: 42 },
    { name: 'dbms-questions', desc: 'SQL internals & lab assignments solutions', count: 28 },
    { name: 'canteen-hacks', desc: 'Midnight snack routes and quick food hacks', count: 119 },
    { name: 'placement-prep', desc: 'Mock interviews & alumni referral logs', count: 64 }
  ];

  return (
    <ProtectedRoute type="protected">
      <div className="min-h-screen bg-bg-dark text-on-surface font-body hero-grid flex flex-col items-center justify-start pb-12 selection:bg-accent-yellow selection:text-bg-dark">
        {/* Background radial glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-primary-navy/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-accent-yellow/5 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Premium Header */}
        <header className="w-full max-w-5xl border-b border-white/5 bg-surface-dark/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between static md:sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Baithak" className="h-10 w-auto object-contain" />
            <span className="text-[10px] bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              VSSUT Circle
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={signOut}
              className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 border border-white/10 px-4 py-2 rounded-full cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Grid Content */}
        <main className="w-full max-w-5xl px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
          
          {/* Left Column: User Profile Card */}
          <section className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-yellow/5 rounded-full blur-2xl"></div>

              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                {/* Profile Picture */}
                {profile?.avatar_url?.startsWith('http') ? (
                  <div className="relative w-20 h-20 rounded-full border-2 border-accent-yellow shadow-md overflow-hidden">
                    <Image 
                      src={profile.avatar_url} 
                      alt={profile.display_name || 'User'} 
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8A2387] via-[#E94057] to-[#F27121] flex items-center justify-center text-4xl shadow-md border-2 border-white/10">
                    <span>{profile?.avatar_url || '👤'}</span>
                  </div>
                )}

                <div className="space-y-1 text-left flex flex-col items-center">
                  <h2 className="text-lg font-bold text-on-surface flex items-center justify-center gap-1.5">
                    <span>{profile?.display_name}</span>
                    <ShieldCheck size={16} className="text-accent-yellow" />
                  </h2>
                  <p className="text-xs text-accent-yellow font-mono font-semibold">@{profile?.username}</p>
                  <p className="text-[10px] text-on-surface-variant/60 font-semibold">{user?.email}</p>
                </div>

                <div className="w-full border-t border-white/5 pt-4 flex justify-around items-center text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent-yellow/10 text-accent-yellow flex items-center justify-center">
                      <Award size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">100 HP</p>
                      <p className="text-[9px] text-on-surface-variant/60">Honour Points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/5 text-on-surface-variant flex items-center justify-center">
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">1st Rank</p>
                      <p className="text-[9px] text-on-surface-variant/60">Starter Level</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Honor Rewards Banner */}
            <div className="border border-accent-yellow/15 bg-accent-yellow/5 rounded-3xl p-5 text-left relative overflow-hidden flex items-start gap-3">
              <Sparkles size={16} className="text-accent-yellow shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold text-accent-yellow uppercase tracking-wider animate-pulse">Reputation System Active</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                  Every time you answer a junior's academic query or post valuable study resources, you gain Honour Points. Maintain top status to earn verified roles!
                </p>
              </div>
            </div>
          </section>

          {/* Right Column: Community Rooms & Feeds */}
          <section className="lg:col-span-8 space-y-6">
            <div className="space-y-3 text-left">
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Active Campus Rooms</h3>
              <p className="text-xs text-on-surface-variant/80">Select a room to enter discussion, read class sheets, or ask seniors.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MOCK_ROOMS.map((room) => (
                <div 
                  key={room.name}
                  className="glass-card p-5 rounded-3xl border border-white/10 text-left hover:border-accent-yellow/30 hover:bg-accent-yellow/5 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs font-bold text-accent-yellow font-mono">
                        <Hash size={13} />
                        {room.name}
                      </span>
                      <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-on-surface-variant font-mono">
                        {room.count} posts
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors">
                      {room.desc}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center text-[10px] font-bold text-accent-yellow opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    <span>Enter Room</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              ))}
            </div>

            {/* Sample Academic Query Feed */}
            <div className="space-y-4 text-left pt-2">
              <h3 className="text-base font-bold text-on-surface tracking-tight">Recent Midnight Queries</h3>
              
              <div className="glass-card p-5 rounded-3xl border border-white/5 space-y-3 bg-[#0A1228]/45">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#11998e] to-[#38ef7d] flex items-center justify-center text-xs">🌱</div>
                    <span className="text-xs font-bold text-on-surface">Amit Patel</span>
                    <span className="text-[9px] text-on-surface-variant/50">2nd Year • Metallurgy</span>
                  </div>
                  <span className="text-[10px] text-accent-yellow font-mono">+10 HP offered</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed font-semibold">
                  Does anyone have the laboratory manual for Materials Processing-I? Prof. Dash wants the physical copy submitted tomorrow morning by 8:00 AM!
                </p>
                <div className="flex justify-between items-center text-[10px] text-on-surface-variant/60 pt-2 border-t border-white/5">
                  <span>Posted 20 mins ago</span>
                  <span className="text-accent-yellow hover:underline cursor-pointer font-bold">Answer Query →</span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPageClient;
