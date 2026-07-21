'use client';

import { useState } from 'react';
import { HelpCircle, CheckCircle2, Circle, Lightbulb, Clock, ShieldAlert } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface QuestionsSidebarProps {
  topic: string;
  difficulty: string;
  currentIndex: number;
  totalQuestions: number;
  currentQuestion?: string;
  userTranscript?: string;
}

export default function QuestionsSidebar({
  topic,
  difficulty,
  currentIndex,
  totalQuestions,
  currentQuestion,
  userTranscript
}: QuestionsSidebarProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const handleFetchHint = async () => {
    if (!currentQuestion) return;
    setIsLoadingHint(true);
    try {
      // Fetch dynamic hint from API
      const res = await apiFetch<{ hint: string }>('/interview/answer', {
        method: 'POST',
        body: new URLSearchParams({
          interview_id: 'temp',
          current_question: currentQuestion,
          user_transcript: userTranscript || 'Help needed'
        }) as any
      });
      setHint((res as any).hint || (res as any).evaluation || 'Focus on time complexity trade-offs and edge case constraints.');
    } catch {
      setHint('Hint: Consider using a Hash Map or Two-Pointer approach to optimize loop overhead.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      
      {/* Session Header */}
      <div className="flex flex-col gap-2 border-b border-dark-border pb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interview Parameters</span>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-bold font-mono uppercase">
            {topic}
          </span>
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold font-mono">
            {difficulty}
          </span>
        </div>
      </div>

      {/* Question Stepper */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span>Question Progress</span>
          <span className="text-brand-400 font-mono font-bold">{currentIndex} / {totalQuestions}</span>
        </span>

        <div className="flex flex-col gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentIndex;
            const isCurrent = stepNum === currentIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  isCurrent
                    ? 'bg-brand-500/10 border-brand-500/40 text-white font-semibold shadow-md'
                    : isCompleted
                    ? 'bg-dark-bg/60 border-dark-border text-emerald-400'
                    : 'bg-dark-bg/30 border-dark-border text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-600 shrink-0" />
                )}
                <span className="flex-1">Question {stepNum}</span>
                {isCurrent && <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500 text-white font-mono uppercase">ACTIVE</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint Engine Button */}
      <div className="pt-2 border-t border-dark-border flex flex-col gap-3">
        <button
          onClick={handleFetchHint}
          disabled={isLoadingHint}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all active:scale-98"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>{isLoadingHint ? 'Generating Hint...' : 'Need a Hint?'}</span>
        </button>

        {hint && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-400">AI Hint: </span>
            {hint}
          </div>
        )}
      </div>

    </div>
  );
}
