import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Home, Compass, Phone } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | DOER',
  description: 'The requested page could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-architectural-grid-dark">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF3D00]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto text-center relative z-10 space-y-8">
        
        {/* 404 Visual Image */}
        <div className="relative w-full max-w-lg mx-auto h-64 sm:h-80 md:h-96">
          <Image
            src="/images/404.png"
            alt="404 Page Not Found"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-xs font-bold uppercase tracking-wider">
            <span>Error 404</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Lost in Space?
          </h1>

          <p className="max-w-md mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            The page you are looking for doesn&apos;t exist, has been relocated, or is temporarily unavailable. Let&apos;s guide you back.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xl shadow-[#FF3D00]/25 transition-all transform hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-800 transition-all"
          >
            <Compass className="w-4 h-4 text-[#FF3D00]" />
            <span>Explore Projects</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-800 transition-all"
          >
            <Phone className="w-4 h-4 text-[#FF3D00]" />
            <span>Contact Studio</span>
          </Link>
        </div>

        {/* Studio Help Line */}
        <div className="pt-6 border-t border-slate-900 text-xs text-slate-500">
          Need immediate interior assistance? Reach DOER hotline at{' '}
          <a href="tel:01976535654" className="text-slate-300 hover:text-[#FF3D00] font-semibold transition-colors">
            01976535654
          </a>
        </div>
      </div>
    </div>
  );
}

