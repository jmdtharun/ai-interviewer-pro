'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, LayoutDashboard, BarChart3, User, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/interview/setup', label: 'New Interview', icon: Sparkles },
    { href: '/admin', label: 'Admin Panel', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-dark-bg/80 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              AI Interviewer <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">PRO</span>
            </span>
            <span className="text-xs text-gray-400">Placement Simulation Platform</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-dark-hover'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-dark-hover transition-colors"
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>
          <Link
            href="/interview/setup"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 transition-all scale-100 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Start Mock Interview
          </Link>
        </div>

      </div>
    </header>
  );
}
