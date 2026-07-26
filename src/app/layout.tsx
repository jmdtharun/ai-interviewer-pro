import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'AI Interviewer Pro — AI Placement Interview Simulation SaaS',
  description: 'Practice real-time technical & HR placement interviews using voice, webcam analysis, MediaPipe vision metrics, faster-whisper STT, and GPT-4o adaptive scoring.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-dark-bg text-gray-100 antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
