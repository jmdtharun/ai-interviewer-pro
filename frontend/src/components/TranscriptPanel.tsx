'use client';

import { TranscriptTurn } from '@/types';
import { Bot, User, CheckCircle2, Award, Lightbulb } from 'lucide-react';
import { getScoreBadgeColor } from '@/lib/utils';

interface TranscriptPanelProps {
  turns: TranscriptTurn[];
  currentQuestion?: string;
}

export default function TranscriptPanel({ turns, currentQuestion }: TranscriptPanelProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex flex-col gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
      
      <div className="flex items-center justify-between border-b border-dark-border pb-3">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Bot className="w-4 h-4 text-brand-500" /> Live Interview Dialogue Stream
        </h3>
        <span className="text-xs text-gray-400 font-mono">
          {turns.length} Turn{turns.length === 1 ? '' : 's'} Recorded
        </span>
      </div>

      {/* Past Transcript Turns */}
      <div className="flex flex-col gap-5">
        {turns.map((turn, index) => (
          <div key={index} className="flex flex-col gap-3 p-4 rounded-xl bg-dark-bg border border-dark-border">
            
            {/* AI Question */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-400">AI Senior Technical Interviewer</span>
                  <span className="text-[10px] text-gray-500 font-mono">Turn {index + 1}</span>
                </div>
                <p className="text-sm text-gray-200 mt-1 font-medium leading-relaxed">{turn.question}</p>
              </div>
            </div>

            {/* Candidate Spoken Response */}
            <div className="flex items-start gap-3 pl-4 border-l-2 border-indigo-500/30">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">Candidate Response</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${getScoreBadgeColor(turn.score)}`}>
                    Score: {turn.score}/100
                  </span>
                </div>
                <p className="text-sm text-gray-300 italic mt-1 bg-dark-card/50 p-2.5 rounded-lg border border-dark-border">
                  "{turn.user_transcript}"
                </p>
              </div>
            </div>

            {/* Turn Evaluation Feedback */}
            {turn.ai_evaluation && (
              <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-lg text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-emerald-400">AI Evaluation: </span>
                  {turn.ai_evaluation}
                </div>
              </div>
            )}

          </div>
        ))}

        {/* Current Active Question */}
        {currentQuestion && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-500/5 border border-brand-500/30 shadow-lg shadow-brand-500/5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Current Active Question</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono">AWAITING AUDIO RESPONSE</span>
              </div>
              <p className="text-sm text-white font-semibold mt-1.5 leading-relaxed">{currentQuestion}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
