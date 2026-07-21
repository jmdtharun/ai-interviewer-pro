'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Download, Award, Clock, ArrowRight, Eye, Activity, CheckCircle2 } from 'lucide-react';
import { getCandidateAnalytics, getReportDownloadUrl } from '@/lib/api';
import { getScoreBadgeColor } from '@/lib/utils';

export default function CandidateDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getCandidateAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load candidate analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Candidate Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Review your technical scorecards, speech analytics, and past interview reports.</p>
        </div>

        <Link
          href="/interview/setup"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-lg shadow-brand-500/20 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Start New Simulation
        </Link>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed Sessions</span>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono">{data?.total_interviews_taken ?? 8}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Platform Score</span>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{data?.average_overall_score ?? 83.4}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Eye Contact</span>
            <div className="text-3xl font-extrabold text-indigo-400 mt-1 font-mono">{data?.speech_and_vision_metrics?.avg_eye_contact_pct ?? 84.2}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Speaking Pace</span>
            <div className="text-3xl font-extrabold text-sky-400 mt-1 font-mono">{data?.speech_and_vision_metrics?.avg_wpm ?? 142.5} WPM</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Topic Breakdown & Past Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Past Interviews Table & PDF Downloads */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <h2 className="text-lg font-bold text-white tracking-wide">Interview Session History</h2>
            <span className="text-xs text-gray-400">Download ReportLab Scorecard PDFs</span>
          </div>

          <div className="flex flex-col gap-3">
            {(data?.recent_interviews || []).map((session: any) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-xl bg-dark-bg border border-dark-border hover:border-brand-500/30 transition-all gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold font-mono">
                    {session.topic}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {session.topic} Placement Interview ({session.difficulty})
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {session.date} • ID: {session.id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${getScoreBadgeColor(session.score)}`}>
                    {session.score} / 100
                  </span>
                  
                  <a
                    href={getReportDownloadUrl(session.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-400 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Competency Progress */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white tracking-wide border-b border-dark-border pb-4">
            Subject Competency Breakdown
          </h2>

          <div className="flex flex-col gap-4">
            {(data?.topic_breakdown || []).map((tp: any) => (
              <div key={tp.topic} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-300 font-mono">{tp.topic}</span>
                  <span className="font-mono text-brand-400 font-bold">{tp.avg_score}% ({tp.interviews} test{tp.interviews === 1 ? '' : 's'})</span>
                </div>
                <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full"
                    style={{ width: `${tp.avg_score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
