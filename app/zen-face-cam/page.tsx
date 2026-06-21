'use client';

import React from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FunnyCameraPickEat from '@/components/dashboard/FunnyCameraPickEat';
import { useStudentData } from '@/hooks/useStudentData';

export default function ZenFaceCamPage() {
  const { addXP } = useStudentData();

  const handleAddXp = (amount: number) => {
    addXP(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto py-4" role="main" aria-label="Zen Face Cam Page">
      {/* Header */}
      <div className="glass-panel bg-white/40 border border-card-border p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Camera size={24} className="text-primary animate-pulse" />
            Zen Face Cam
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Turn on your webcam, apply funny filters, and interact with stress-buster fruits to refresh your mood!
          </p>
        </div>
        <Link
          href="/"
          className="bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-bold text-xs px-4 py-2 rounded-xl transition-all focus:ring-2 focus:ring-primary outline-none cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>

      <div className="w-full">
        <FunnyCameraPickEat onAddXp={handleAddXp} />
      </div>
    </div>
  );
}
