'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Factory,
  Users,
  Cpu,
  Layers,
  Sparkles,
  Pause,
  Play,
  X,
  Maximize2,
} from 'lucide-react';

interface Project {
  number: string;
  title: string;
  tagline: string;
  category: string;
  location: string;
  scope: string[];
  description: string;
  keyFeature: string;
  image: string;
  href: string;
}

const projects: Project[] = [
  {
    number: '01',
    title: 'South Pole Coffee',
    tagline: 'Artisanal Commercial Hospitality Fit-Out',
    category: 'Commercial Hospitality',
    location: 'Jashimuddin, Uttara, Dhaka',
    scope: ['Interior Design', 'Civil Works', 'Electrical Solutions', 'Turnkey Fit-Out'],
    description:
      'A warm, contemporary café space engineered with custom fluted timber panels, precision mood illumination, and high-traffic commercial counter fixtures designed and built in our workshop.',
    keyFeature: 'Full Turnkey Civil & Acoustic Woodwork',
    image: '/images/projects/south-pole-coffee-completed.jpg',
    href: '/projects',
  },
  {
    number: '02',
    title: 'Door Lock Bangladesh',
    tagline: 'High-Security Retail Showroom & Experience Center',
    category: 'Retail Experience Center',
    location: 'Jamuna Future Park, Dhaka',
    scope: ['Interior Architecture', 'Electrical Lighting', 'Custom Display Fixtures'],
    description:
      'Engineered an architectural gallery retail space that showcases modern electronic locking systems and architectural hardware in a sleek, organized, high-visibility environment.',
    keyFeature: 'Custom Interactive Product Display Millwork',
    image: '/images/projects/door-lock-bangladesh-completed.jpg',
    href: '/projects',
  },
  {
    number: '03',
    title: 'Walton Signature Showrooms',
    tagline: 'Experiential Brand Display Architecture',
    category: 'Brand Showroom',
    location: 'Rupganj & Beldi',
    scope: ['Modular Display Units', 'Commercial Electrical', 'Brand Architecture'],
    description:
      'Designed and executed comprehensive commercial showroom environments featuring bespoke illumination zones, premium product podiums, and seamless brand journey flow.',
    keyFeature: 'Turnkey Commercial Showroom Delivery',
    image: '/images/projects/walton-signature-showrooms-completed.jpg',
    href: '/projects',
  },
  {
    number: '04',
    title: 'CDPL Control Rooms',
    tagline: 'Mission-Critical Government Command Infrastructure',
    category: 'Government Project',
    location: 'Rupganj, Narayanganj, Cumilla & Chittagong',
    scope: ['High-Tech Consoles', 'Acoustic Soundproofing', 'Electrical Infrastructure'],
    description:
      'Multi-divisional command hubs engineered for 24/7 continuous operations, integrating ergonomic technical desks, sound dampening walls, and clean electrical distributions.',
    keyFeature: 'Multi-Location Nationwide Execution',
    image: '/images/projects/cdpl.jpeg',
    href: '/projects',
  },
  /* Hidden for now:
  {
    number: '05',
    title: '40-Person Conference Suite',
    tagline: 'Monumental Custom Executive Boardroom Table',
    category: 'Custom Millwork Fabrication',
    location: 'Sylhet Cantonment, Sylhet',
    scope: ['Custom 40-Seat Seating', 'Hidden Cable & Media Channels', 'Solid Hardwood'],
    description:
      'Handcrafted and assembled a massive 40-capacity executive boardroom table featuring seamless integrated audio-visual ports, hidden conduits, and high-durability matte lacquer finish.',
    keyFeature: 'Precision Factory Joinery for 40 Delegates',
    image: '/images/projects/custom-conference-table-completed.jpg',
    href: '/projects',
  },
  */
];

export default function FeaturedProjectsShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const imageStageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProject = projects[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // When selecting a project, switch index and auto-scroll to the image on mobile
  const handleSelectProject = (idx: number) => {
    setActiveIndex(idx);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        imageStageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 50);
    }
  };

  // Close lightbox on Escape key, allow arrow key navigation, and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && isLightboxOpen) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && isLightboxOpen) {
        handlePrev();
      }
    };

    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  // Auto-cycle through projects every 7 seconds if playing and lightbox is not open
  useEffect(() => {
    if (!isPlaying || isLightboxOpen) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length);
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIndex, isLightboxOpen]);

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#05070E] text-white border-y border-cyan-500/20 w-full overflow-hidden relative bg-circuit-grid">
      {/* Vertical Neon Laser Lines */}
      <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
      <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#FF3D00]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]">
              Spaces Designed with Vision. <br className="hidden sm:inline" />
              <span className="text-[#FF3D00] drop-shadow-[0_0_15px_rgba(255,61,0,0.5)]">Executed with Precision.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-normal max-w-2xl leading-relaxed">
              Explore our landmark commercial fit-outs, specialized retail showrooms, mission-critical installations, and bespoke furniture built in our factory.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 group shadow-[0_0_25px_rgba(255,61,0,0.45)] border border-[#FF3D00]"
            >
              <span>Explore Complete Archive (15+ Works)</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Interactive Editorial Studio Showcase */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Left Column: Interactive Monograph Directory (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between pb-2 px-1 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/10">
                <span>Selected Project Index</span>
                <span className="font-mono text-[#FF3D00]">0{activeIndex + 1} / 0{projects.length}</span>
              </div>

              {projects.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.number}
                    onClick={() => handleSelectProject(idx)}
                    className={`w-full text-left p-3.5 sm:p-5 lg:p-6 rounded-2xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden border ${
                      isActive
                        ? 'bg-[#0E162B] border-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.35)] text-white translate-x-1 sm:translate-x-2'
                        : 'bg-[#0B101D]/75 hover:bg-[#0E1527] border-white/10 hover:border-[#FF3D00]/60 text-slate-300 shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
                    }`}
                  >
                    {/* Active Left Indicator Strip */}
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF3D00] shadow-[0_0_10px_#FF3D00]" />
                    )}

                    <div className="flex items-center gap-3 sm:gap-5 min-w-0 pr-2">
                      <span
                        className={`font-mono text-sm sm:text-base lg:text-lg font-black transition-colors shrink-0 ${
                          isActive ? 'text-[#FF3D00]' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      >
                        {item.number}
                      </span>

                      <div className="space-y-0.5 sm:space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm sm:text-lg lg:text-xl font-black transition-colors truncate ${
                              isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#FF3D00] shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'bg-[#FF3D00] text-white shadow-[0_0_12px_rgba(255,61,0,0.5)]'
                          : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Stage Controls & Timeline */}
            <div className="pt-3 sm:pt-4 flex items-center justify-between px-1 sm:px-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF3D00] hover:text-[#FF3D00] text-slate-300 flex items-center justify-center shadow-sm transition-all"
                  aria-label="Previous Project"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF3D00] hover:text-[#FF3D00] text-slate-300 flex items-center justify-center shadow-sm transition-all"
                  aria-label="Next Project"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-[11px] sm:text-xs font-semibold hover:border-[#FF3D00]/60 hover:text-[#FF3D00] transition-all shadow-sm"
                  title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3D00]" />
                      <span>Auto</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-6 sm:w-7 bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Unobstructed Architectural Showcase with Lightbox (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between" ref={imageStageRef}>
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative w-full h-[320px] sm:h-[460px] lg:h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.95)] border border-cyan-500/30 group bg-slate-950 cursor-pointer cyber-corner"
            >
              {/* Active Image - Unobstructed Full View */}
              <Image
                key={activeProject.image}
                src={activeProject.image}
                alt={activeProject.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              {/* Top Floating Badges */}
              <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between gap-2 z-10 pointer-events-none">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-black/75 backdrop-blur-md text-white font-mono text-[10px] sm:text-xs font-bold border border-white/10 shadow-sm">
                    {activeProject.number} / 05
                  </span>
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#FF3D00] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md truncate max-w-[120px] sm:max-w-none">
                    {activeProject.category}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-md text-slate-800 text-[10px] sm:text-xs font-semibold border border-slate-200 shadow-md">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3D00] shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-none">{activeProject.location}</span>
                </div>
              </div>

              {/* Bottom Floating Click to Expand Pill */}
              <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-10">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-black/75 hover:bg-[#FF3D00] backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-white/20 shadow-xl transition-all transform group-hover:scale-105">
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Click to Expand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal Rendered Direct to Body (Cannot be hidden by Navbar) */}
        {mounted && isLightboxOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Prominent Close Button */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-30 pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-2xl">
                <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00] text-white font-mono text-xs font-bold">
                  {activeProject.number} / 05
                </span>
                <span className="text-white text-sm sm:text-base font-bold">
                  {activeProject.title}
                </span>
                <span className="hidden sm:inline-block text-slate-300 text-xs">
                  • {activeProject.location}
                </span>
              </div>

              {/* Highly Visible Main Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                className="pointer-events-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF3D00] hover:bg-[#eb3800] text-white border-2 border-white shadow-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-all hover:scale-105 active:scale-95"
                aria-label="Close Lightbox"
                title="Close Lightbox (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
                <span>Close</span>
              </button>
            </div>

            {/* Image Container with Prev/Next Controls */}
            <div
              className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                <Image
                  src={activeProject.image}
                  alt={activeProject.title}
                  fill
                  priority
                  className="object-contain"
                />

                {/* Secondary Corner Close Button directly on the image card */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(false);
                  }}
                  className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/80 hover:bg-[#FF3D00] text-white flex items-center justify-center border-2 border-white/40 transition-all shadow-2xl cursor-pointer"
                  title="Close (ESC)"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Previous Project Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-[#FF3D00] text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl z-20 cursor-pointer"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Project Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/80 hover:bg-[#FF3D00] text-white flex items-center justify-center border border-white/20 transition-all shadow-2xl z-20 cursor-pointer"
                aria-label="Next Project"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption / Dismiss Hint */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 border border-white/15 text-slate-300 text-xs text-center pointer-events-none shadow-xl">
              <span>Click outside or press <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">ESC</kbd> to close</span>
            </div>
          </div>,
          document.body
        )}

        {/* Bottom Architectural Credibility Strip */}
        <div className="mt-12 sm:mt-16 lg:mt-20 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-[#090D18]/90 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,61,0,0.3)]">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">In-House Manufacturing</p>
              <p className="text-slate-400 text-[11px] sm:text-xs">Direct woodworking & metal factory</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,61,0,0.3)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">33+ Dedicated Craftsmen</p>
              <p className="text-slate-400 text-[11px] sm:text-xs">Master joiners, technicians & engineers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,61,0,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white text-xs sm:text-sm font-bold">Precision CNC & Machinery</p>
              <p className="text-slate-400 text-[11px] sm:text-xs">Laser, edging & cold press tech</p>
            </div>
          </div>

          <div className="flex items-center sm:justify-end pt-2 sm:pt-0">
            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(255,61,0,0.45)] border border-[#FF3D00]"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

