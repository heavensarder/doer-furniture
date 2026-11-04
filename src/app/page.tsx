import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedProjectsShowcase from '@/components/home/FeaturedProjectsShowcase';
import ConsoleTableShowcase from '@/components/home/ConsoleTableShowcase';
import MaterialsShowcase from '@/components/home/MaterialsShowcase';
import {
  ArrowRight,
  ArrowUpRight,
  Building,
  Briefcase,
  Armchair,
  Hammer,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Factory,
  Users,
  Compass,
  CheckCircle2,
  MapPin,
  Cpu,
  Layers,
  Utensils,
} from 'lucide-react';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  path: '/',
});

export default function HomePage() {
  const services = [
    {
      number: '01',
      title: 'Commercial Space Design',
      tagline: 'Brand Identity & Retail Spaces',
      description:
        'Creative and functional interior solutions for commercial environments, designed to enhance business identity and customer experience.',
      icon: Building,
      image: '/images/services/commercial-space-design.jpg',
      badge: 'Commercial',
      scope: ['Space Planning', '3D Visualization', 'Customer Experience'],
    },
    {
      number: '02',
      title: 'Corporate Office Interior',
      tagline: 'Ergonomic Workplaces & Suites',
      description:
        'Modern and professional office interiors that encourage productivity and create comfortable, collaborative working environments.',
      icon: Briefcase,
      image: '/images/services/corporate-office-interior.jpg',
      badge: 'Corporate',
      scope: ['Executive Suites', 'Acoustic Partitioning', 'Power Routing'],
    },
    {
      number: '03',
      title: 'Furniture Customization & Fabrication',
      tagline: 'In-House Khilkhet Workshop',
      description:
        'Custom-designed furniture manufactured to match your space, requirements, and corporate identity with precision joinery.',
      icon: Armchair,
      image: '/images/services/furniture-customization-fabrication.jpg',
      badge: 'Fabrication',
      scope: ['Modular Workstations', 'Solid Hardwoods', 'Steel Sub-Frames'],
    },
    {
      number: '04',
      title: 'Interior Project Execution',
      tagline: 'Turnkey Civil & Fit-Out Delivery',
      description:
        'End-to-end project execution, including civil, electrical, fabrication, HVAC, and final interior fit-out under one accountable roof.',
      icon: Hammer,
      image: '/images/services/interior-project-execution.jpg',
      badge: 'Turnkey Fit-Out',
      scope: ['Civil Works', 'Electrical Engineering', 'Site Supervision'],
    },
    {
      number: '05',
      title: 'Remodeling & Renovation',
      tagline: 'Space Reconfiguration',
      description:
        'Transforming existing spaces through thoughtful redesign, modern materials, acoustic optimization, and efficient fast-track execution.',
      icon: RotateCcw,
      image: '/images/services/remodeling-renovation.jpg',
      badge: 'Renovation',
      scope: ['Layout Redesign', 'Facade Refresh', 'Acoustic Upgrades'],
    },
    {
      number: '06',
      title: 'Restaurant & Café Interior',
      tagline: 'Atmospheric Dining & Lounges',
      description:
        'Unique and welcoming dining environments with creative layouts, customized furniture, decorative lighting, and premium finishes.',
      icon: Utensils,
      image: '/images/services/restaurant-cafe-interior.jpg',
      badge: 'Hospitality',
      scope: ['Mood Illumination', 'Bar & Counter Joinery', 'Dining Tables'],
    },
  ];

  const workshopPillars = [
    {
      number: '01',
      title: 'Wood Section',
      subtitle: 'Joinery & Custom Furniture',
      desc: 'Handcrafted executive desks, solid timber crafting, architectural wall paneling & fluted woodwork.',
      image: '/images/workshop/wood-section.jpg',
      icon: Armchair,
      machinery: 'Circular Saws • Multi-Boring',
    },
    {
      number: '02',
      title: 'Board Section',
      subtitle: 'Panel Processing & Joinery',
      desc: 'Automated panel sizing, high-speed edge banding, laminate pressing & custom interior cabinetry components.',
      image: '/images/workshop/board-section.jpg',
      icon: Layers,
      machinery: 'Panel Saw Machine • Edge Bander',
    },
    {
      number: '03',
      title: 'Metal Section',
      subtitle: 'Architectural Steel & Metalwork',
      desc: 'Custom metal structural frames, decorative brass trims, and signature Water Bubble Stainless Steel cladding.',
      image: '/images/workshop/metal-section.jpg',
      icon: Factory,
      machinery: 'MIG/TIG Welding • Industrial Grinders',
    },
    {
      number: '04',
      title: 'Glass & Aluminium',
      subtitle: 'Partitions & Storefronts',
      desc: 'Precision aluminium framing, acoustic laminated glass partitions, tempered glass doors & bespoke signage.',
      image: '/images/workshop/glass-aluminium.jpg',
      icon: Building,
      machinery: 'Profile Cutters • Assembly Rigs',
    },
  ];

  const capabilities = [
    { title: 'Woodworking and furniture manufacturing', icon: Armchair, tag: 'Joinery Atelier' },
    { title: 'Board processing and fabrication', icon: Layers, tag: 'Automated Line' },
    { title: 'Metal fabrication & steel structures', icon: Factory, tag: 'MIG/TIG & SS' },
    { title: 'Glass and aluminium fabrication', icon: Building, tag: 'Acoustic Glazing' },
    { title: 'CNC machining and precision cutting', icon: Cpu, tag: 'Automated Routing' },
    { title: 'Electrical and civil works', icon: Hammer, tag: 'Licensed Engineers' },
    { title: 'Installation and turnkey project execution', icon: CheckCircle2, tag: 'Zero Outsourcing' },
  ];

  const whyChooseUs = [
    {
      num: '01',
      title: 'Complete Solutions',
      desc: 'From design to final execution.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'In-house Manufacturing',
      desc: 'Dedicated fabrication and production facilities.',
      icon: Factory,
    },
    {
      num: '03',
      title: 'Skilled Workforce',
      desc: 'Experienced professionals across multiple disciplines.',
      icon: Users,
    },
    {
      num: '04',
      title: 'Customized Approach',
      desc: 'Solutions designed around your requirements.',
      icon: Sparkles,
    },
    {
      num: '05',
      title: 'Attention to Detail',
      desc: 'Focus on precision, quality, and craftsmanship.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 01. HERO SECTION */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {/* Focused Architectural Interior Backdrop */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2600&q=90"
            alt="DOER Luxury Interior Design and Architecture"
            fill
            priority
            className="object-cover object-center scale-100"
          />
          {/* Subtle Warm Scrim Overlay - Keeps the interior photo clearly focused & visible while text is crisp */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 py-12 sm:py-16 md:py-20">
          {/* Studio Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white shadow-sm max-w-[92vw]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FF3D00] shrink-0" />
            <span className="truncate">DOER • Interior Architecture & Turnkey Execution</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.1] sm:leading-[1.08] drop-shadow-sm">
            Designing Spaces.{' '}
            <span className="text-[#FF3D00] block sm:inline">
              Creating Experiences.
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-xl text-slate-100/90 leading-relaxed font-normal drop-shadow-sm px-1 sm:px-0">
            DOER delivers innovative interior design, commercial fit-out, furniture manufacturing, and project execution solutions. We transform ideas into functional, elegant, and inspiring spaces.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 w-auto mx-auto">
            <Link
              href="/projects"
              className="w-auto min-w-[190px] sm:min-w-0 inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-black/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Explore Our Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="w-auto min-w-[190px] sm:min-w-0 inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/30 backdrop-blur-md transition-all duration-300 hover:border-white/50"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4 text-[#FF3D00]" />
            </Link>
          </div>

          {/* Studio Highlights Ribbon */}
          <div className="pt-6 sm:pt-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-left shadow-2xl">
              <div className="p-2 sm:p-3 border-r border-b md:border-b-0 border-white/10">
                <span className="text-xl sm:text-2xl font-black text-[#FF3D00] block">100%</span>
                <span className="text-[11px] sm:text-xs font-semibold text-white block mt-0.5">In-House Manufacturing</span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 block">Khilkhet workshop facility</span>
              </div>
              <div className="p-2 sm:p-3 border-b md:border-b-0 md:border-r border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white block">33+</span>
                <span className="text-[11px] sm:text-xs font-semibold text-white block mt-0.5">Skilled Technical Team</span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 block">Artisans & engineers</span>
              </div>
              <div className="p-2 sm:p-3 border-r border-white/10">
                <span className="text-xl sm:text-2xl font-black text-white block">Turnkey</span>
                <span className="text-[11px] sm:text-xs font-semibold text-white block mt-0.5">Project Execution</span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 block">Design to final delivery</span>
              </div>
              <div className="p-2 sm:p-3">
                <span className="text-xl sm:text-2xl font-black text-[#FF3D00] block">Bespoke</span>
                <span className="text-[11px] sm:text-xs font-semibold text-white block mt-0.5">Custom Furniture</span>
                <span className="text-[10px] sm:text-[11px] text-slate-300 block">CNC & metal fabrication</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02. INTRODUCTION SECTION */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white relative bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-xs font-bold uppercase tracking-wider">
                <span>Introduction</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Turning Ideas Into Exceptional Spaces
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed font-normal">
                At DOER, we believe every space has a purpose and a story to tell. We bring creativity, technical expertise, and precision craftsmanship together to create interiors that reflect your vision and meet your functional needs.
              </p>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
                From initial concept and 3D visualization to manufacturing, installation, and final execution, we provide complete solutions under one roof.
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-950 hover:bg-[#FF3D00] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm"
                >
                  <span>Learn More About DOER</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Architectural Image Showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[280px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
                <Image
                  src="/images/modern-interior-design-studio-showcase.jpg"
                  alt="Modern Interior Design Studio Showcase"
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Floating Studio Badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/10 text-white">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF3D00]" />
                    <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-[#FF3D00]">Integrated Studio</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    Concept development, woodworking, CNC cutting, and on-site fit-out seamlessly orchestrated.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 03. OUR SERVICES SECTION - COMPACT SINGLE-SCREEN SHOWCASE */}
      <section className="py-8 lg:py-10 bg-slate-50/70 border-y border-slate-200/80 w-full overflow-hidden">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 lg:mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00]" />
                <span>Our Core Services</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Complete Solutions for <span className="text-[#FF3D00]">Every Space</span>
              </h2>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#FF3D00] transition-colors self-start sm:self-end pb-0.5 group"
            >
              <span>View All Services</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 6-Column Single Row on Desktop (Small Square Cards, Fits in One Screen) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-3.5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.number}
                  href="/services"
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#FF3D00] p-2.5 sm:p-3 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Square Size Image Container */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Micro Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                        <span className="px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold border border-white/10">
                          {service.number}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FF3D00] text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                          {service.badge}
                        </span>
                      </div>

                      {/* Bottom Micro Icon */}
                      <div className="absolute bottom-2 right-2 z-10">
                        <span className="w-6 h-6 rounded-md bg-black/75 backdrop-blur-md text-white flex items-center justify-center border border-white/10 group-hover:bg-[#FF3D00] group-hover:border-[#FF3D00] transition-colors">
                          <Icon className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF3D00] transition-colors leading-snug line-clamp-1">
                        {service.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Micro Footer Indicator */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-[#FF3D00] transition-colors">
                    <span className="font-semibold">Explore</span>
                    <ArrowUpRight className="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 03B. HIGHEND CONSOLE TABLE */}
      <ConsoleTableShowcase />

      {/* 03C. MATERIALS - WATER BUBBLE STAINLESS STEEL */}
      <MaterialsShowcase />

      {/* 04. FEATURED PROJECTS SECTION - INTERACTIVE MONOGRAPH SHOWCASE */}
      <FeaturedProjectsShowcase />

      {/* 05. OUR CAPABILITIES SECTION - INDUSTRIAL LUXURY DARK SHOWCASE */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#070A0F] text-white relative overflow-hidden border-y border-white/10 w-full bg-architectural-grid-dark">
        {/* Ambient Industrial Atmospheric Glows */}
        <div className="absolute top-1/4 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#FF3D00]/12 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[140px] sm:blur-[180px] pointer-events-none" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-3 sm:space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
                <span className="text-[#FF3D00] font-bold">Industrial Capabilities</span>
                <span className="text-white/40">|</span>
                <span className="text-slate-300">Khilkhet, Dhaka Factory</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Design. Manufacture. Execute. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  Under One Roof.
                </span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg font-normal max-w-2xl leading-relaxed">
                We eliminate middleman markups and fabrication delays by operating our own comprehensive woodworking, board processing, metal fabrication, and CNC precision lines.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/workshop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#FF3D00]/25 group"
              >
                <span>Explore Facilities & Machinery</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Row 1: The 4 In-House Workshop Pillars (Visual Bento) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
            {workshopPillars.map((pillar) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group relative h-[340px] sm:h-[380px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl hover:border-[#FF3D00] transition-all duration-500 flex flex-col justify-between p-5 sm:p-6 lg:p-7"
                >
                  {/* Photo Background with Zoom */}
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover img-zoom transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/70 to-black/30" />

                  {/* Top Bar Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15">
                      {pillar.number}
                    </span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center shadow-lg shadow-[#FF3D00]/30">
                      <PillarIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 space-y-2 sm:space-y-2.5">
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#FF3D00] uppercase tracking-wider">
                      {pillar.subtitle}
                    </p>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white group-hover:text-white transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-3">
                      {pillar.desc}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-400 border-t border-white/10">
                      <Cpu className="w-3 h-3 text-[#FF3D00]" />
                      <span className="truncate">{pillar.machinery}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2: Capabilities Matrix + Craft Workforce Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: 7 Integrated Capabilities (7 cols) */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between pb-2 px-1 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-white/10">
                <span>Integrated Technical Capabilities</span>
                <span className="text-[#FF3D00] font-mono">7 Disciplines</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {capabilities.map((cap) => {
                  const Icon = cap.icon;
                  return (
                    <div
                      key={cap.title}
                      className="p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-[#FF3D00]/60 hover:bg-white/[0.08] transition-all duration-300 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/15 text-[#FF3D00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3D00] group-hover:text-white transition-colors shadow-sm">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF3D00] transition-colors leading-snug truncate">
                            {cap.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="truncate">{cap.tag}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Additional Turnkey Value Card */}
                <div className="p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FF3D00]/20 to-transparent border border-[#FF3D00]/40 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-[#FF3D00] uppercase tracking-wider">Turnkey Guarantee</p>
                    <p className="text-xs sm:text-sm font-bold text-white truncate">Zero Third-Party Dependency</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">Concept to final site cleaning</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF3D00] shrink-0" />
                </div>
              </div>
            </div>

            {/* Right Column: Workforce & Material Spotlight Card (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Users className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>Permanent Factory Team</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  33+ Dedicated Master Craftsmen
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Our multidisciplinary workforce works side-by-side with architects and project engineers to ensure strict fabrication standards.
                </p>
              </div>

              {/* Workforce Trades Badges */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                {[
                  { role: 'Carpenters & Joiners', count: '12' },
                  { role: 'Polishers & Painters', count: '06' },
                  { role: 'Licensed Electricians', count: '04' },
                  { role: 'Civil & Masonry Staff', count: '04' },
                  { role: 'Plumbing Specialists', count: '03' },
                  { role: 'Glass & Aluminium', count: '02' },
                  { role: 'Bespoke Signage', count: '02' },
                  { role: 'Project Engineers', count: 'Team' },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px] sm:text-xs"
                  >
                    <span className="text-slate-300 truncate">{item.role}</span>
                    <span className="font-mono font-bold text-[#FF3D00] pl-1.5 shrink-0">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Machinery & Heavy Equipment Solutions */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-[#FF3D00]/30 space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#FF3D00]" />
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF3D00]">
                    About Our Machinery Solutions
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Industrial Heavy Equipment & CNC Tech
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  We provide a comprehensive range of industrial machinery and heavy equipment designed to support modern manufacturing, construction, fabrication, and production industries. From CNC machinery and automated production systems to woodworking and metalworking equipment, our solutions help achieve consistent quality.
                </p>
              </div>

              <div className="pt-1 sm:pt-2">
                <Link
                  href="/workshop"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-[#FF3D00] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  <span>View All Machinery Specs & Workforce</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom Industrial Credibility Strip */}
          <div className="mt-12 sm:mt-16 lg:mt-20 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-bold">4 In-House Workshops</p>
                <p className="text-slate-400 text-[11px] sm:text-xs">Wood, Board, Metal & Glass lines</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-bold">9+ Heavy Machines</p>
                <p className="text-slate-400 text-[11px] sm:text-xs">CNC, panel saw & edge bander</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/20 text-[#FF3D00] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-xs sm:text-sm font-bold">33 Permanent Tradesmen</p>
                <p className="text-slate-400 text-[11px] sm:text-xs">Zero labor supply subcontracting</p>
              </div>
            </div>

            <div className="flex items-center sm:justify-end pt-2 sm:pt-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FF3D00]/25"
              >
                <span>Schedule Workshop Tour</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 06. WHY CHOOSE DOER? SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF3D00] text-xs font-bold uppercase tracking-wider">
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Why Choose DOER?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-[#FF3D00] hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#FF3D00] transition-colors">
                        {item.num}
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 text-[#FF3D00] group-hover:bg-[#FF3D00] group-hover:text-white group-hover:border-[#FF3D00] transition-all flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#FF3D00] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1.5 sm:pt-2 font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FF3D00]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Let&apos;s Create Something Exceptional.
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
            Have a project in mind? Let&apos;s work together to transform your ideas into functional and inspiring spaces.
          </p>
          <div className="pt-2 sm:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xl shadow-[#FF3D00]/40 transition-all transform hover:-translate-y-1"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
