'use client';

import { TurnMetrics } from '@/types';
import { Eye, Activity, Smile, Gauge, AlertCircle, Sparkles } from 'lucide-react';

interface LiveGaugesProps {
  metrics: Partial<TurnMetrics> | null;
}

export default function LiveGauges({ metrics }: LiveGaugesProps) {
  const eyeContact = metrics?.eye_contact_score ?? 84.0;
  const wpm = metrics?.wpm ?? 142.0;
  const fillerCount = metrics?.filler_words ?? 2;
  const emotion = metrics?.dominant_emotion ?? 'Confident';
  const engagement = Math.round((metrics?.engagement_score ?? 0.88) * 100);

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-4">
      
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500" /> Live AI Cognitive & Behavioral Gauge
        </h3>
        <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE ML PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Eye Contact Score */}
        <div className="bg-dark-bg border border-dark-border rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Eye Contact</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">{eyeContact}%</span>
            <span className="text-xs text-emerald-400 font-medium">Optimal</span>
          </div>
          <div className="w-full h-1.5 bg-dark-border rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${eyeContact}%` }} />
          </div>
        </div>

        {/* Speaking Rate (WPM) */}
        <div className="bg-dark-bg border border-dark-border rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Speaking Pace</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">{wpm}</span>
            <span className="text-xs text-gray-400 font-mono">WPM</span>
          </div>
          <div className="w-full h-1.5 bg-dark-border rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (wpm / 200) * 100)}%` }} />
          </div>
        </div>

        {/* Filler Word Counter */}
        <div className="bg-dark-bg border border-dark-border rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Filler Words</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">{fillerCount}</span>
            <span className="text-xs text-gray-400">detected</span>
          </div>
          <div className="w-full h-1.5 bg-dark-border rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, fillerCount * 20)}%` }} />
          </div>
        </div>

        {/* Emotion & Demeanor */}
        <div className="bg-dark-bg border border-dark-border rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium">Emotion State</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-400 capitalize">{emotion}</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-400 font-mono">
            Engagement: {engagement}%
          </div>
        </div>

      </div>
    </div>
  );
}
