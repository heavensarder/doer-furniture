'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  titleLight: string;
  titleHighlight: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
}

const SLIDES: Slide[] = [
  {
    id: 'console-tables',
    tag: 'Command Center Consoles • Turnkey Control Room Fit-Out',
    titleLight: 'Smart Console Tables &',
    titleHighlight: 'Control Room Design.',
    description:
      'DOER manufactures mission-critical command consoles, ergonomic modular workstations, and complete control room interiors. Custom-engineered in our in-house Khilkhet workshop with heavy-duty steel chassis, multi-monitor arrays, and smart cable management.',
    image: '/images/hero-slider-one.jpg',
    primaryBtnText: 'Explore Console Tables',
    primaryBtnHref: '/products',
    secondaryBtnText: 'Design Your Control Room',
    secondaryBtnHref: '/contact',
  },
  {
    id: 'architectural-materials',
    tag: 'Architectural Materials • Patinas & Surface Textures',
    titleLight: 'Architectural Patinas &',
    titleHighlight: 'Surface Textures.',
    description:
      'A premium decorative material collection combining artistic textures with sophisticated metallic and mineral finishes. Engineered for stylish partitions, feature walls, decorative panels, and statement luxury interiors.',
    image: '/images/hero-slider-two.jpg',
    primaryBtnText: 'Explore Materials',
    primaryBtnHref: '#materials',
    secondaryBtnText: 'Request Sample Kit',
    secondaryBtnHref: '/contact?subject=Inquiry%20for%20Architectural%20Materials',
  },
];

const SLIDE_DURATION = 5500; // 5.5s auto-slide

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
  };

  // Reliable Auto-slide Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [activeSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const current = SLIDES[activeSlide];

  return (
    <section
      className="relative h-screen min-h-[100vh] min-h-[100dvh] flex items-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 bg-slate-950 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="DOER Featured Highlights"
    >
      <style jsx>{`
        @keyframes sliderLineFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      {/* 01. FULL-BLEED BACKGROUND SLIDER WITH SMOOTH CROSSFADE (NO OVERLAY) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.titleLight} ${slide.titleHighlight}`}
              fill
              priority={idx === 0}
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* 02. MAIN CONTENT STACK WITH TRANSLUCENT OVERLAY BOX BEHIND TEXT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full py-8 sm:py-10 md:py-12 flex flex-col items-start justify-center">
        <div className="max-w-xl lg:max-w-2xl text-left space-y-4 sm:space-y-6 p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-slate-950/80 sm:bg-slate-950/75 backdrop-blur-md border border-white/15 shadow-2xl">
          {/* Studio Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white shadow-sm transition-all duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse shrink-0" />
            <span>{current.tag}</span>
          </div>

          {/* Main Headline with Smooth Text Transition */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md min-h-[2.4em] sm:min-h-[2.3em] flex flex-col justify-center transition-all duration-500">
            <span>{current.titleLight}</span>
            <span className="text-[#FF3D00] block mt-1">
              {current.titleHighlight}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200/95 leading-relaxed font-normal drop-shadow-sm max-w-xl min-h-[3.6em] transition-all duration-500">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2.5 sm:gap-3.5 pt-1 w-full sm:w-auto">
            <Link
              href={current.primaryBtnHref}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF3D00]/25 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>{current.primaryBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={current.secondaryBtnHref}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/25 backdrop-blur-md transition-all duration-300 hover:border-white/40"
            >
              <span>{current.secondaryBtnText}</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF3D00]" />
            </Link>
          </div>

          {/* 03. SIMPLE SLIDER INDICATOR LINES */}
          <div className="pt-3 sm:pt-4 flex items-center gap-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className="group py-2 focus:outline-none flex items-center cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1 sm:h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${isActive
                          ? 'w-16 sm:w-24 bg-white/25'
                          : 'w-6 sm:w-8 bg-white/35 hover:bg-white/60'
                        }`}
                    >
                      {isActive && (
                        <div
                          key={`bar-${activeSlide}-${idx}`}
                          className="h-full bg-[#FF3D00] rounded-full"
                          style={{
                            animation: `sliderLineFill ${SLIDE_DURATION}ms linear forwards`,
                          }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Slide Indicator */}
            <div className="text-[11px] font-bold tracking-wider text-slate-300/80 pl-1 select-none flex items-center gap-1.5">
              <span className="text-[#FF3D00] font-black">{`0${activeSlide + 1}`}</span>
              <span className="text-white/30">/</span>
              <span>{`0${SLIDES.length}`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Floating Side Navigation Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-[#FF3D00] text-white/70 hover:text-white items-center justify-center border border-white/10 hover:border-[#FF3D00] backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-[#FF3D00] text-white/70 hover:text-white items-center justify-center border border-white/10 hover:border-[#FF3D00] backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
