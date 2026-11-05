import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ConsoleTableShowcase from '@/components/home/ConsoleTableShowcase';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Factory,
  Cpu,
  Layers,
  Phone,
  Ruler,
  CheckCircle2,
} from 'lucide-react';

export default function ProductsPage() {
  const highlights = [
    {
      title: 'In-House Khilkhet Workshop',
      desc: 'Joinery, metalworking & powder coating under one roof',
      icon: Factory,
    },
    {
      title: 'Millimeter CAD Customization',
      desc: 'Bespoke dimensions matching your architectural floor plan',
      icon: Ruler,
    },
    {
      title: 'Heavy-Duty Steel Subframes',
      desc: 'Structural steel chassis preventing deflection under heavy loads',
      icon: Layers,
    },
    {
      title: 'Integrated Cable Routing',
      desc: 'Concealed wire ducts, brush grommets & pop-up power modules',
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 01. PAGE BANNER */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-slate-950 text-white overflow-hidden bg-architectural-grid-dark">
        {/* Focused Architectural Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/products/07-u-shaped-modular-conference-console.jpg"
            alt="DOER Bespoke Furniture & Products"
            fill
            priority
            className="object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FF3D00] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DOER Signature Product Lines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Bespoke Commercial Furniture &{' '}
            <span className="text-[#FF3D00]">Smart Consoles</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Precision-manufactured at our in-house Khilkhet workshop facility. We engineer ergonomic modular workstations, 24/7 command center consoles, luxury conference tables, and architectural console furniture customized to your exact CAD specifications.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#FF3D00]/50 transition-all"
                >
                  <div className="flex items-center gap-2 text-[#FF3D00] mb-1.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-white line-clamp-1">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 02. BESPOKE FURNITURE SHOWCASE (MOVED FROM HOME PAGE) */}
      <ConsoleTableShowcase />

      {/* 03. CUSTOM ARCHITECTURAL SIZING & CAD CONSULTATION CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden bg-architectural-grid-dark border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-10 lg:p-14 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/15 text-[#FF3D00] text-xs font-bold uppercase tracking-wider border border-[#FF3D00]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Custom Engineering Available</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                  Require Custom Dimensions, Monitor Mounts, or Bespoke Finishes?
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Our multidisciplinary workforce of carpenters, CNC machinists, and electrical engineers fabricates every unit to your project&apos;s architectural layout. Contact our technical team for custom CAD 3D modeling and factory quotes.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Free CAD drawing review</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Factory sample inspection</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Turnkey nationwide delivery</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FF3D00]/25 group"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:01716535654"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/15 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#FF3D00]" />
                  <span>Hotline: 01716535654</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

