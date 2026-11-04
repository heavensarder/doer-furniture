'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Layers,
  Building,
  CheckCircle2,
  Utensils,
  Hotel,
  Briefcase,
  Home,
  Sparkles,
  Check,
} from 'lucide-react';

export default function MaterialsShowcase() {
  const [activeMaterial, setActiveMaterial] = useState<'rust-marble' | 'emerald-patina' | 'weathered-gold' | 'rust-verdigris'>('rust-marble');

  const materials = [
    {
      id: 'rust-marble' as const,
      name: 'Luxury Brown Bronze Marble',
      shortName: 'Rust Marble',
      tone: 'Brown Bronze Marble',
      image: '/images/materials/showcase/luxury-brown-bronze-marble-interior.jpg',
      thumb: '/images/materials/abstract-rust-toned-marble.jpg',
      desc: 'An artistic fusion of warm rust tones, earthen marble veins, and rich bronze textures that add dramatic warmth and sculptural character to modern interiors.',
      spec: 'Architectural Stone & Patina',
    },
    {
      id: 'emerald-patina' as const,
      name: 'Textured Green Patina Finish',
      shortName: 'Green Patina',
      tone: 'Textured Green Patina',
      image: '/images/materials/showcase/textured-green-patina-finish-showcase.jpg',
      thumb: '/images/materials/textured-emerald-patina.jpg',
      desc: 'Striking oxidized emerald crystallization layered over deep volcanic charcoal, crafted for statement hospitality lounges and luxury dining feature walls.',
      spec: 'Oxidized Mineral Finish',
    },
    {
      id: 'weathered-gold' as const,
      name: 'Luxury Gold & Black Texture',
      shortName: 'Gold & Black',
      tone: 'Luxury Gold & Black',
      image: '/images/materials/showcase/luxury-gold-black-texture-showcase.jpg',
      thumb: '/images/materials/weathered-gold-black-patina.jpg',
      desc: 'Lustrous weathered gold motifs juxtaposed against deep shadow hues, creating multidimensional ambient light reflections across custom partitions.',
      spec: 'Metallic Leaf & Patina',
    },
    {
      id: 'rust-verdigris' as const,
      name: 'Rustic Patina Interior Finish',
      shortName: 'Rustic Patina',
      tone: 'Rustic Patina Finish',
      image: '/images/materials/showcase/rustic-patina-interior-showcase.jpg',
      thumb: '/images/materials/weathered-rust-verdigris.jpg',
      desc: 'Authentic verdigris turquoise accents blended with industrial corten-rust textures, offering an elevated industrial-luxury aesthetic for bespoke decorative panels.',
      spec: 'Aged Architectural Alloy',
    },
  ];

  const current = materials.find((m) => m.id === activeMaterial) || materials[0];

  const applications = [
    'Stylish partitions',
    'Feature walls',
    'Decorative panels',
    'Statement interior elements',
  ];

  const spaces = [
    { name: 'Restaurants & Dining', icon: Utensils },
    { name: 'Hotels & Hospitality', icon: Hotel },
    { name: 'Commercial Spaces', icon: Building },
    { name: 'Offices & Boardrooms', icon: Briefcase },
    { name: 'Luxury Residences', icon: Home },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-slate-50/70 border-b border-slate-200/80 w-full overflow-hidden relative">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-orange-50 border border-orange-200 text-slate-800 text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
              <span className="text-[#FF3D00] font-bold">Architectural Materials</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Architectural Patinas & <br className="hidden sm:inline" />
              <span className="text-[#FF3D00]">Surface Textures.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal max-w-2xl leading-relaxed">
              A premium decorative material collection combining artistic textures with sophisticated metallic and mineral finishes to bring depth and character to modern interiors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-slate-950 hover:bg-[#FF3D00] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group"
            >
              <span>Request Material Sample Kit</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 2-Column Content Layout: Left Specs (6 cols) + Right Square Showcase (6 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Exact Document Content & Applications */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-7">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3D00]">
                <Sparkles className="w-4 h-4" />
                <span>Tactile Surface Engineering</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Artistic Patterns with a Sophisticated Metallic Finish
              </h3>
              
              {/* Exact Paragraph 1 from PDF */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-relaxed font-normal">
                Our architectural materials collection is a premium decorative design solution combining artistic patterns with sophisticated metallic and mineral finishes. Featuring distinctive tactile textures and contemporary styling, it brings depth, character, and visual interest to interior spaces.
              </p>

              {/* Exact Paragraph 2 from PDF */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
                Designed for modern architectural and decorative applications, it offers an attractive solution for creating stylish partitions, feature walls, decorative panels, and statement interior elements. Its elegant appearance makes it an excellent choice for restaurants, hotels, commercial spaces, offices, and luxury residences.
              </p>
            </div>

            {/* Recommended Applications (Exact from PDF) */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span>Recommended Architectural Applications:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {applications.map((app) => (
                  <div
                    key={app}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-800 p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:border-[#FF3D00]/50 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Spaces (Exact from PDF) */}
            <div className="space-y-2.5 sm:space-y-3 pt-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span>Ideal Environments:</span>
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {spaces.map((sp) => {
                  const Icon = sp.icon;
                  return (
                    <span
                      key={sp.name}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:border-[#FF3D00]/40 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#FF3D00]" />
                      <span>{sp.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Material Engineering Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Finish Spec</p>
                <p className="text-[11px] sm:text-sm font-bold text-slate-900 pt-0.5 truncate">{current.spec}</p>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Coating</p>
                <p className="text-[11px] sm:text-sm font-bold text-slate-900 pt-0.5 truncate">Zero-VOC Seal</p>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Workshop</p>
                <p className="text-[11px] sm:text-sm font-bold text-slate-900 pt-0.5 truncate">Khilkhet, Dhaka</p>
              </div>
            </div>
          </div>

          {/* Right Column: Square Stage + 4 Square Pattern Swatches */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Square Picture Stage Container (Aspect Square 1:1) */}
            <div className="relative w-full aspect-square max-w-[540px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950 group">
              <Image
                key={current.image}
                src={current.image}
                alt={current.name}
                fill
                priority
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Floating Swatch Metadata - Top Bar */}
              <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-20 gap-2">
                <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-black/75 backdrop-blur-md text-white font-mono text-[10px] sm:text-xs font-bold border border-white/10 shadow-sm flex items-center gap-1.5 sm:gap-2 truncate max-w-[200px] sm:max-w-none">
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-md overflow-hidden border border-white/30 shrink-0">
                    <Image src={current.thumb} alt={current.shortName} fill className="object-cover" />
                  </div>
                  <span className="truncate">{current.tone}</span>
                </span>
                <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#FF3D00] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md shrink-0">
                  In-House
                </span>
              </div>

              {/* Bottom Scrim Content - Glassmorphic Title Bar */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 px-3.5 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-white flex items-center justify-between z-20 shadow-xl gap-2">
                <h4 className="text-sm sm:text-lg font-black text-white truncate">{current.name}</h4>
                <span className="text-[10px] sm:text-xs font-mono text-[#FF3D00] font-semibold shrink-0">{current.spec}</span>
              </div>
            </div>

            {/* 4 Square Pattern Swatches */}
            <div className="space-y-2 max-w-[540px] mx-auto pt-1">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>Select Pattern Swatch:</span>
                </p>
                <span className="text-[11px] sm:text-xs font-bold text-[#FF3D00] truncate max-w-[180px] sm:max-w-none">
                  {current.name}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {materials.map((mat) => {
                  const isSelected = mat.id === activeMaterial;
                  return (
                    <button
                      key={mat.id}
                      onClick={() => setActiveMaterial(mat.id)}
                      className={`group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all duration-300 focus:outline-none ${
                        isSelected
                          ? 'border-[#FF3D00] ring-2 sm:ring-4 ring-[#FF3D00]/25 shadow-xl scale-[1.03]'
                          : 'border-slate-200/90 hover:border-slate-400 opacity-80 hover:opacity-100 hover:scale-[1.02] shadow-sm'
                      }`}
                      aria-label={mat.name}
                    >
                      <Image
                        src={mat.thumb}
                        alt={mat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Vignette overlay */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isSelected ? 'bg-black/10' : 'bg-black/25 group-hover:bg-black/10'
                        }`}
                      />

                      {/* Active Checkmark Indicator */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FF3D00] text-white flex items-center justify-center shadow-md z-10">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Bottom Short Name Label */}
                      <div className="absolute bottom-0 inset-x-0 p-1 sm:p-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10">
                        <p className="text-[9px] sm:text-[11px] font-bold text-white text-center truncate leading-tight">
                          {mat.shortName}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
