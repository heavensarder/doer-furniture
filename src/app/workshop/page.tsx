import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Factory,
  Cpu,
  Users,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench,
  CheckCircle2,
  HardHat,
  Monitor,
  Flame,
  ShieldCheck,
  Disc,
  ArrowUpRight,
} from 'lucide-react';

export const metadata = {
  title: 'Workshop & Capabilities – DOER Manufacturing & Facilities',
  description: 'Explore DOER in-house manufacturing facilities, modern machinery, multidisciplinary workforce, and materials like Water Bubble Stainless Steel.',
  openGraph: {
    title: 'Workshop & Capabilities – DOER Manufacturing & Facilities',
    description: 'Explore DOER in-house manufacturing facilities, modern machinery, multidisciplinary workforce, and materials like Water Bubble Stainless Steel.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1734,
        height: 907,
        alt: 'DOER Workshop & Capabilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workshop & Capabilities – DOER Manufacturing & Facilities',
    description: 'Explore DOER in-house manufacturing facilities, modern machinery, multidisciplinary workforce, and materials like Water Bubble Stainless Steel.',
    images: ['/og-image.jpg'],
  },
};

export default function WorkshopPage() {
  const sections = [
    {
      title: 'Wood Section',
      desc: 'Our woodworking facility supports customized furniture production and interior fabrication requirements.',
      image: '/images/workshop/wood-section.jpg',
    },
    {
      title: 'Board Section',
      desc: 'Our board processing section supports furniture manufacturing, panel preparation, and customized interior components.',
      image: '/images/workshop/board-section.jpg',
    },
    {
      title: 'Metal Section',
      desc: 'Our metal fabrication capabilities support customized metal components and interior applications.',
      image: '/images/workshop/metal-section.jpg',
    },
    {
      title: 'Glass & Aluminium Fabrication',
      desc: 'Our glass and aluminium fabrication section supports customized interior installations, partitions, frames, and related applications.',
      image: '/images/workshop/glass-aluminium.jpg',
    },
  ];

  const machinery = [
    { name: 'Panel Saw Machine', desc: 'Used for accurate cutting and processing of boards and panels.' },
    { name: 'Edge Banding Machine', desc: 'Supports professional finishing of furniture panel edges.' },
    { name: 'Multi Boring Machine', desc: 'Used for precise drilling and furniture assembly preparation.' },
    { name: 'CNC Router Machine', desc: 'Supports precision cutting, shaping, and detailed fabrication work.' },
    { name: 'Router Machine', desc: 'Used for shaping, profiling, and finishing different materials.' },
    { name: 'Grinder Machine', desc: 'Supports surface finishing and metalworking tasks.' },
    { name: 'Heat Gun', desc: 'Used for different fabrication and finishing applications.' },
    { name: 'Circular Saw Machine', desc: 'Supports cutting requirements in woodworking.' },
    { name: 'Drilling Machine', desc: 'Used for drilling and installation-related work.' },
  ];

  const workforce = [
    { role: 'Carpenters', count: 12 },
    { role: 'Electricians', count: 4 },
    { role: 'Painters', count: 6 },
    { role: 'Civil Workers', count: 4 },
    { role: 'Plumbers', count: 3 },
    { role: 'Glass Workers', count: 2 },
    { role: 'Signage Workers', count: 2 },
  ];

  const bubbleSteelApplications = [
    'Decorative partitions',
    'Feature walls',
    'Decorative panels',
    'Restaurant and hotel interiors',
    'Commercial spaces',
    'Office interiors',
    'Luxury residences',
  ];

  const partners = [
    'ANNEX',
    'Design Muse',
    'Door Lock Bangladesh',
    'REX',
    'CZCD',
    'Greenlam Laminates',
  ];

  return (
    <div className="pt-20 sm:pt-28 min-h-screen bg-white">
      {/* Page Banner */}
      <section className="relative py-16 sm:py-20 lg:py-28 bg-slate-950 text-white overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=80"
            alt="DOER Workshop & Machinery"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Manufacturing Facilities</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Built with Precision. Crafted with Care.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-light px-2 sm:px-0 leading-relaxed">
            Our Manufacturing Facilities, Machinery & Skilled Team.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-100 bg-architectural-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-900 font-bold leading-relaxed">
            Our manufacturing and fabrication facilities play an important role in delivering customized interior and furniture solutions.
          </p>
          <p className="text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
            With dedicated production sections, specialized machinery, and skilled professionals, we manage various fabrication and manufacturing requirements under one roof.
          </p>
        </div>
      </section>

      {/* Manufacturing Sections */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Production Facilities</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Manufacturing Sections
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sections.map((sec) => (
              <div
                key={sec.title}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-200 group flex flex-col justify-between hover:border-[#FF3D00]/50 transition-all duration-300"
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                  <Image
                    src={sec.image}
                    alt={sec.title}
                    fill
                    className="object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white font-bold text-base sm:text-lg">
                    {sec.title}
                  </span>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {sec.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machinery & Equipment */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white relative bg-architectural-grid-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Workshop Equipment</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Machinery & Equipment
            </h2>
            <p className="text-slate-400 text-xs sm:text-base lg:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
              Our workshop is equipped with machinery and tools that support different stages of manufacturing and fabrication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {machinery.map((m) => (
              <div
                key={m.name}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#FF3D00]/50 transition-all flex items-start gap-3.5 sm:gap-4 group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0 group-hover:bg-[#FF3D00] group-hover:text-white transition-colors">
                  <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF3D00] transition-colors truncate">
                    {m.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design & Software */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span>CAD & Workflow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Design & Software
              </h2>
              <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-normal">
                Our design and development workflow includes digital design and visualization tools to support project planning and execution.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-5">
              <div className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5 sm:space-y-2 hover:border-[#FF3D00] transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md shadow-[#FF3D00]/25">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">AutoCAD</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Drafting & spatial planning</p>
              </div>

              <div className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5 sm:space-y-2 hover:border-[#FF3D00] transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md shadow-[#FF3D00]/25">
                  <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">SketchUp</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">3D architectural modeling</p>
              </div>

              <div className="p-4 sm:p-7 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5 sm:space-y-2 hover:border-[#FF3D00] transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md shadow-[#FF3D00]/25">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">3D Visualization</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">High-fidelity rendering</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Skilled Workforce */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Human Craftsmanship</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Our Skilled Workforce
            </h2>
            <p className="text-sm sm:text-lg font-bold text-[#FF3D00]">
              A Team Behind Every Project
            </p>
            <p className="text-xs sm:text-base text-slate-600 font-normal">
              Our team includes skilled professionals from different technical and manufacturing disciplines.
            </p>
          </div>

          {/* Workforce Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-5">
            {workforce.map((w) => (
              <div
                key={w.role}
                className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-[#FF3D00] hover:bg-white hover:shadow-xl transition-all"
              >
                <span className="text-2xl sm:text-4xl font-black text-[#FF3D00] block mb-1">
                  {w.count}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider block leading-tight">
                  {w.role}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Our multidisciplinary workforce supports different stages of interior construction, fabrication, installation, and finishing.
            </p>
          </div>
        </div>
      </section>

      {/* Materials: Water Bubble Stainless Steel */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white relative overflow-hidden bg-architectural-grid-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span>Materials Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Water Bubble Stainless Steel
              </h2>

              <p className="text-slate-300 text-xs sm:text-base lg:text-lg leading-relaxed font-normal">
                Water Bubble Stainless Steel is a premium decorative metal design that combines artistic patterns with a sophisticated metallic finish.
              </p>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed font-normal">
                Featuring distinctive bubble-inspired textures and a contemporary appearance, it brings depth, character, and visual interest to interior spaces.
              </p>

              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 bg-slate-900/90 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-800">
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200">
                  Applications:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {bubbleSteelApplications.map((app) => (
                    <div key={app} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-400 italic pt-1 sm:pt-2">
                Its distinctive metallic appearance makes it an attractive choice for modern architectural and decorative applications.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-[260px] xs:h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                  alt="Water Bubble Stainless Steel Texture"
                  fill
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/10">
                  <p className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider leading-snug">
                    Architectural Grade Metallic Finishing & Partition Solutions
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Partner Network & Sourcing Support */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
          <div className="space-y-2.5 sm:space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Alliances</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Partner Network & Sourcing Support
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              We work with a network of partners and suppliers to support our project requirements, material sourcing, and interior solutions.
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Our portfolio includes collaborations and sourcing connections with:
            </p>
          </div>

          {/* Partner Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 pt-2 sm:pt-4">
            {partners.map((partner) => (
              <div
                key={partner}
                className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-center hover:border-[#FF3D00] hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <span className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-[#FF3D00] transition-colors tracking-tight">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white text-center relative overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 bg-[#FF3D00]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Looking for Customized Manufacturing Solutions?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with our team to discuss your furniture, fabrication, and interior requirements.
          </p>
          <div className="pt-2 sm:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#FF3D00]/30 transition-all transform hover:-translate-y-1"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
