"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, ShieldCheck, Lock, BadgeCheck, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';
import HonorWidget from '../profile/HonorWidget';
import { getCurrentHonorBadge, getNextHonorBadge } from '../../lib/badges';

const RightSidebar = () => {
  const { user, profile } = useAuth();


  return (
    <aside className="hidden lg:flex flex-col h-screen sticky top-0 py-6 pl-4 border-l border-white/5 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* Honor Points Widget */}
      <HonorWidget isOwnProfile={false} />



      
    </aside>
  );
};

export default RightSidebar;
