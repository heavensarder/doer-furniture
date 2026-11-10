import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Compass, Award, ArrowRight, Quote, ShieldCheck, Factory, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { getDynamicPageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return getDynamicPageMetadata('/about', {
    title: 'About DOER – Leader in Console Tables, Control Room Interiors & Metal Fabrication',
    description:
      'DOER operates an integrated manufacturing factory in Khilkhet, Dhaka with 33+ permanent craftsmen delivering zero-subcontracting control rooms and metal art.',
    path: '/about',
  });
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 selection:bg-[#FF3D00] selection:text-white relative overflow-hidden">
      {/* 01. Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-[#05070B] text-white overflow-hidden bg-circuit-grid border-b border-cyan-500/20">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt="About DOER Banner"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/80 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span>Commanding Architectural Craft</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            About DOER
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-normal px-2 sm:px-0 leading-relaxed">
            Creating Spaces That Inspire and Perform.
          </p>
        </div>
      </section>

      {/* 02. Company Introduction / Who We Are */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#070A12] bg-cyber-grid text-white relative border-b border-cyan-500/20">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 items-center">
            
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span>Who We Are</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Innovative Interior Solutions with Complete In-House Execution
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
                We design and deliver ergonomically optimized control room environments that enhance operator comfort, efficiency, and performance. From workstation layouts and control consoles to lighting and equipment integration, every detail is planned for seamless monitoring and uninterrupted 24/7 operations. Our solutions combine functional design, advanced engineering, and human-centered planning to support critical decision-making.
              </p>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_35px_rgba(0,0,0,0.8)] bg-[#0B101D] cyber-corner">
                <Image
                  src="/images/about/doer-logo-showcase.jpg"
                  alt="DOER Brand Showcase"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-60" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03. Vision & Mission */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#05070E] text-white relative bg-circuit-grid border-b border-cyan-500/20">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Vision */}
            <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 flex flex-col justify-between hover:border-[#FF3D00]/60 hover:shadow-[0_0_25px_rgba(255,61,0,0.35)] transition-all shadow-2xl cyber-corner">
              <div className="space-y-4 sm:space-y-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Our Vision
                </h3>
                <div className="space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  <p>
                    To be a globally respected leader in interior design, fit-out, and manufacturing, setting new benchmarks for innovation, quality, and craftsmanship.
                  </p>
                  <p>
                    We aspire to transform ideas into exceptional environments that inspire people, empower businesses, and enrich communities.
                  </p>
                  <p>
                    Through design excellence, advanced manufacturing, and sustainable practices, we are committed to delivering enduring value and building trusted partnerships.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 flex flex-col justify-between hover:border-[#FF3D00]/60 transition-all shadow-2xl cyber-corner">
              <div className="space-y-4 sm:space-y-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Our Mission
                </h3>
                <div className="space-y-3 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  <p>
                    To deliver innovative, high-quality interior design and manufacturing solutions that transform ideas into functional, inspiring, and sustainable spaces.
                  </p>
                  <p>
                    Through creative excellence, precision craftsmanship, and efficient execution, we aim to exceed client expectations, build lasting partnerships, and create enduring value.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 04. Message from the Founder */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#070A12] bg-cyber-grid relative border-b border-cyan-500/20 text-white">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-white/10 relative overflow-hidden shadow-2xl cyber-corner">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/5 pointer-events-none">
              <Quote className="w-20 h-20 sm:w-32 sm:h-32" />
            </div>

            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Leadership</span>
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  A Message of Vision and Commitment
                </h2>
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-slate-300 text-xs sm:text-base lg:text-lg leading-relaxed font-normal">
                <p className="text-[#FF3D00] font-semibold italic text-sm sm:text-lg lg:text-xl border-l-4 border-[#FF3D00] bg-[#0E1526]/80 pl-3 sm:pl-4 py-2 rounded-r-xl">
                  &ldquo;Every great achievement begins with a simple idea.&rdquo;
                </p>
                <p>
                  DOER was founded to redefine how spaces are designed, built, and experienced. Through innovative interior solutions and precision manufacturing, we create functional, inspiring, and lasting environments.
                </p>
                <p>
                  Guided by creativity, integrity, and quality, we deliver designs that solve problems, enhance experiences, and add value.
                </p>
                <p>
                  Our team works collaboratively to bring each client&apos;s vision to life with precision and excellence.
                </p>
                <p>
                  As we grow, we remain committed to innovation, sustainability, and continuous improvement.
                </p>
                <p>
                  We thank our clients, partners, and team for their trust and support. Together, we will continue creating spaces that inspire and endure.
                </p>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    MD. Sharifuzzaman
                  </h4>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF3D00] mt-0.5">
                    Founder, DOER
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05. Our Commitment */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#05070B] text-white relative bg-circuit-grid">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5 relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,61,0,0.4)]">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Our Commitment
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            We believe successful projects are built on strong relationships, clear communication, and a commitment to quality.
          </p>
          <p className="text-sm sm:text-lg font-bold text-[#FF3D00]">
            Every project is an opportunity to create something meaningful, functional, and lasting.
          </p>
          <div className="pt-2 sm:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(255,61,0,0.45)] border border-[#FF3D00]"
            >
              <span>Work With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
