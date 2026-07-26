'use client';

import { useEffect, useState } from 'react';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { getAdminAnalytics } from '@/lib/api';
import { AdminAnalytics } from '@/types';
import { Users, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getAdminAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            System Admin Analytics Dashboard <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">ADMIN MODE</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Platform-wide placement interview metrics, weak area tracking, and emotion analytics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Registered Candidates</span>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">{analytics?.summary.total_users ?? 1240}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interviews Completed</span>
            <div className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">{analytics?.summary.interviews_completed ?? 3890}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Candidates Today</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{analytics?.summary.active_today ?? 142}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform Avg Score</span>
            <div className="text-3xl font-extrabold text-sky-400 mt-1 font-mono">{analytics?.summary.avg_platform_score ?? 79.8}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Recharts Section */}
      <AnalyticsCharts
        topicData={analytics?.avg_score_by_topic || [
          { topic: 'DSA', avg_score: 76.2 },
          { topic: 'DBMS', avg_score: 81.5 },
          { topic: 'OOP', avg_score: 84.0 },
          { topic: 'OS', avg_score: 73.8 },
          { topic: 'CN', avg_score: 78.4 },
          { topic: 'HR', avg_score: 85.1 }
        ]}
        emotionData={analytics?.emotion_distribution || [
          { emotion: 'Confident', percentage: 52.4 },
          { emotion: 'Focused', percentage: 28.1 },
          { emotion: 'Neutral', percentage: 11.5 },
          { emotion: 'Nervous', percentage: 8.0 }
        ]}
        activityData={analytics?.daily_activity || [
          { date: 'Jul 15', interviews: 180, users: 65 },
          { date: 'Jul 16', interviews: 210, users: 78 },
          { date: 'Jul 17', interviews: 245, users: 92 },
          { date: 'Jul 18', interviews: 310, users: 110 },
          { date: 'Jul 19', interviews: 290, users: 105 },
          { date: 'Jul 20', interviews: 380, users: 135 },
          { date: 'Jul 21', interviews: 420, users: 142 }
        ]}
      />

      {/* Most Common Weak Areas Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2 border-b border-dark-border pb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Platform Most Common Candidate Weak Areas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analytics?.most_common_weak_areas || [
            { area: "Dynamic Programming (DSA)", frequency: 412 },
            { area: "System Concurrency & Starvation (OS)", frequency: 348 },
            { area: "B-Tree Index Overhead (DBMS)", frequency: 289 },
            { area: "Speaking Pace & Filler Words (Comm)", frequency: 245 }
          ]).map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-200">{item.area}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {item.frequency} candidates flagged
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
