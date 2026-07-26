import Link from 'next/link';
import { Sparkles, Shield, Cpu, Mic, Eye, FileText, ArrowRight, CheckCircle, BarChart, Bot, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-20 pb-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/30 via-indigo-500/20 to-purple-500/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen Placement Interview AI Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl">
          Master Your Placement Technical Interviews with <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">AI Voice & Vision Analytics</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
          Simulate real technical and HR placement interviews with adaptive LLM questions, real-time eye-contact & emotion analysis, speech pace evaluation, and instant ReportLab PDF scorecard generation.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/interview/setup"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-all scale-100 hover:scale-105 active:scale-95"
          >
            Start Free Mock Interview <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-200 bg-dark-card hover:bg-dark-hover border border-dark-border transition-all"
          >
            View Admin Analytics <BarChart className="w-5 h-5 text-brand-400" />
          </Link>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { label: 'Technical Topics', value: 'DSA, DBMS, OS, OOP, CN, HR' },
            { label: 'Speech Analysis', value: 'Whisper STT & WPM' },
            { label: 'Vision Engine', value: 'MediaPipe Eye & Pose' },
            { label: 'Scoring Precision', value: '100-Pt Weighted Score' }
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-dark-card/60 border border-dark-border/60 backdrop-blur-md flex flex-col items-center">
              <span className="text-sm font-bold text-brand-400 font-mono">{stat.value}</span>
              <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Feature Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Full-Stack AI Placement Interview Pipeline</h2>
          <p className="text-gray-400 mt-2">Built for placement candidates, university hiring cells, and tech recruiters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Adaptive LLM Questions</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              GPT-4o adaptive engine dynamically adjusts question difficulty based on your turn score. It probes edge cases when you perform well and offers targeted hints when you struggle.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time Computer Vision</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              MediaPipe Face Mesh and OpenCV evaluate eye contact percentage, head pose stability, smile score, engagement index, and demeanor in real time over WebRTC streams.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-500/40 transition-all flex flex-col gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">ReportLab PDF Scorecard</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instantly generate and download professional PDF evaluation reports featuring 5-metric weighted score breakdown (Technical 40%, Problem Solving 20%, Communication 20%, Confidence 10%, Professionalism 10%).
            </p>
          </div>

        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-dark-card via-slate-900 to-dark-card border border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Enterprise Architecture</span>
            <h3 className="text-2xl font-bold text-white">Next.js 15 + FastAPI + MongoDB Atlas + WebRTC</h3>
            <p className="text-sm text-gray-400">Dockerized container stack ready for Render and Vercel deployment.</p>
          </div>
          <Link
            href="/interview/setup"
            className="px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors shrink-0"
          >
            Try Interview Demo Now
          </Link>
        </div>
      </section>

    </div>
  );
}
