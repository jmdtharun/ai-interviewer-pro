'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopicType, DifficultyType } from '@/types';
import { Sparkles, Code, Database, Cpu, Layers, Network, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { startInterviewSession } from '@/lib/api';

export default function SetupInterviewPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<TopicType>('DSA');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType>('Medium');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [isInitializing, setIsInitializing] = useState(false);

  const topics: { id: TopicType; title: string; desc: string; icon: any }[] = [
    { id: 'DSA', title: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Dynamic Programming, Hash Maps & Graphs', icon: Code },
    { id: 'DBMS', title: 'Database Management Systems', desc: 'SQL, Normalization, ACID Transactions, B-Tree Indexing', icon: Database },
    { id: 'OOP', title: 'Object-Oriented Programming', desc: 'Inheritance, Polymorphism, Design Patterns & SOLID', icon: Layers },
    { id: 'OS', title: 'Operating Systems', desc: 'Processes, Threads, Virtual Memory, Deadlocks & Synchronization', icon: Cpu },
    { id: 'CN', title: 'Computer Networks', desc: 'TCP/IP Handshake, OSI Layers, DNS, HTTP/3 & Sockets', icon: Network },
    { id: 'HR', title: 'HR & Behavioral', desc: 'STAR Method, Leadership, Conflict Resolution & Fit', icon: Users },
  ];

  const difficulties: DifficultyType[] = ['Easy', 'Medium', 'Hard'];

  const handleStart = async () => {
    setIsInitializing(true);
    try {
      const session = await startInterviewSession(selectedTopic, selectedDifficulty, totalQuestions);
      router.push(`/interview/${session.interview_id}`);
    } catch (err) {
      console.error('Session start error:', err);
      // Local fallback navigation
      router.push(`/interview/int_demo_${Date.now()}`);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      <div className="flex flex-col gap-2 border-b border-dark-border pb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Placement Simulation Setup
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Configure Your Mock Placement Interview</h1>
        <p className="text-sm text-gray-400">Select your target technical domain, challenge level, and question length.</p>
      </div>

      {/* 1. Select Topic */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-white uppercase tracking-wide">1. Select Interview Subject Domain</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-brand-600/15 border-brand-500 text-white shadow-xl shadow-brand-500/10'
                    : 'bg-dark-card border-dark-border text-gray-400 hover:border-gray-600 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-brand-500 text-white' : 'bg-dark-bg text-gray-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-dark-bg border border-dark-border">{t.id}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{t.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Select Difficulty */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-white uppercase tracking-wide">2. Select Difficulty Level</label>
        <div className="grid grid-cols-3 gap-4">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`py-4 px-6 rounded-xl border text-center font-bold text-sm transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-brand-500 text-white shadow-lg'
                    : 'bg-dark-card border-dark-border text-gray-400 hover:text-white'
                }`}
              >
                {diff} Difficulty
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Question Count */}
      <div className="flex flex-col gap-4">
        <label className="text-sm font-bold text-white uppercase tracking-wide">3. Interview Question Count</label>
        <div className="flex items-center gap-4">
          {[3, 5, 8, 10].map((count) => (
            <button
              key={count}
              onClick={() => setTotalQuestions(count)}
              className={`py-2.5 px-6 rounded-xl border font-mono font-bold text-sm transition-all ${
                totalQuestions === count
                  ? 'bg-brand-500 text-white border-brand-400'
                  : 'bg-dark-card border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {count} Questions
            </button>
          ))}
        </div>
      </div>

      {/* Media Permission Notice */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
        <span>Webcam and microphone access will be requested on the next screen to compute live eye contact, head stability, and speech analytics.</span>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        disabled={isInitializing}
        className="w-full py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
      >
        {isInitializing ? 'Initializing AI Pipeline & Question Engine...' : 'Launch Live Placement Simulation'} <ArrowRight className="w-5 h-5" />
      </button>

    </div>
  );
}
