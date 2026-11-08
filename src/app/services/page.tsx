import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Building,
  Briefcase,
  Armchair,
  Hammer,
  RotateCcw,
  Coffee,
  ShoppingBag,
  Hotel,
  Layers,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { constructMetadata } from '@/lib/metadata';

export const metadata = constructMetadata({
  title: 'Our Services – DOER Interior Design, Manufacturing & Execution',
  description: 'Complete interior design, commercial fit-out, customized furniture manufacturing, and project execution solutions by DOER.',
  path: '/services',
});

export default function ServicesPage() {
  const mainServices = [
    {
      id: 'commercial',
      number: '01',
      title: 'Commercial Space Design',
      description:
        'We design commercial environments that combine creativity, functionality, and modern aesthetics. Our approach focuses on understanding your business requirements, brand identity, and customer expectations to create spaces that make a lasting impression.',
      image: '/images/services/commercial-space-design.jpg',
      solutions: [
        'Commercial space planning',
        'Interior concept development',
        '3D visualization',
        'Material and finish selection',
        'Customized interior solutions',
      ],
      icon: Building,
    },
    {
      id: 'corporate',
      number: '02',
      title: 'Corporate Office Interior',
      description:
        'We create smart, functional, and professional office environments designed to encourage productivity and reflect your corporate identity. From workstations and meeting rooms to reception areas and collaborative spaces, we focus on creating comfortable and efficient workplaces.',
      image: '/images/services/corporate-office-interior.jpg',
      solutions: [
        'Office space planning',
        'Workstation design',
        'Conference and meeting rooms',
        'Reception and waiting areas',
        'Customized office furniture',
        'Electrical and interior fit-outs',
      ],
      icon: Briefcase,
    },
    {
      id: 'furniture',
      number: '03',
      title: 'Furniture Customization & Fabrication',
      description:
        'We specialize in customized furniture design, manufacturing, and installation. Our in-house production capabilities allow us to develop furniture that meets specific space requirements, functional needs, and design preferences.',
      image: '/images/services/furniture-customization-fabrication.jpg',
      solutions: [
        'Office furniture',
        'Conference tables',
        'Workstations',
        'Reception desks',
        'Custom cabinets and storage',
        'Commercial furniture',
      ],
      icon: Armchair,
    },
    {
      id: 'execution',
      number: '04',
      title: 'Interior Project Execution',
      description:
        'We provide comprehensive interior project execution services, coordinating different trades and activities to bring approved designs to life. Our team focuses on proper coordination, workmanship, and efficient project delivery.',
      image: '/images/services/interior-project-execution.jpg',
      solutions: [
        'Civil works',
        'Electrical works',
        'Interior fit-outs',
        'Furniture manufacturing and installation',
        'Glass and aluminium fabrication',
        'Finishing and installation',
      ],
      icon: Hammer,
    },
    {
      id: 'renovation',
      number: '05',
      title: 'Remodeling & Renovation',
      description:
        'We help transform existing spaces into modern, functional, and attractive environments. Whether updating an office, showroom, restaurant, or commercial property, we provide renovation solutions based on your requirements.',
      image: '/images/services/remodeling-renovation.jpg',
      solutions: [
        'Interior remodeling',
        'Space improvements',
        'Furniture replacement and customization',
        'Electrical upgrades',
        'Interior finishing',
        'Renovation execution',
      ],
      icon: RotateCcw,
    },
    {
      id: 'restaurant-cafe',
      number: '06',
      title: 'Restaurant & Café Interior',
      description:
        'We create unique, welcoming dining environments with creative layouts, customized furniture, decorative lighting, and premium finishes tailored for culinary and hospitality brands.',
      image: '/images/services/restaurant-cafe-interior.jpg',
      solutions: [
        'Dining and seating layout planning',
        'Custom bar, counter, and cashier joinery',
        'Atmospheric and accent lighting design',
        'Customized banquettes, booths, and dining tables',
        'Kitchen integration and service workflow',
        'Turnkey fit-out and acoustic wall paneling',
      ],
      icon: Coffee,
    },
  ];

  const additionalSolutions = [
    {
      title: 'Restaurant & Café Interior',
      desc: 'Unique and welcoming dining environments with creative layouts, customized furniture, decorative lighting, and premium finishes.',
      icon: Coffee,
      image: '/images/services/restaurant-cafe-interior.jpg',
    },
    {
      title: 'Retail & Showroom Interior',
      desc: 'Modern and attractive retail spaces designed to highlight products, strengthen brand identity, and improve customer engagement.',
      icon: ShoppingBag,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Hotel & Hospitality Interior',
      desc: 'Elegant and comfortable interior solutions for hotels, lounges, reception areas, and hospitality spaces.',
      icon: Hotel,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Corporate & Business Interior',
      desc: 'Sophisticated interior solutions for corporate offices, conference rooms, reception areas, and business facilities.',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 selection:bg-[#FF3D00] selection:text-white relative overflow-hidden">
      {/* 01. Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-[#05070B] text-white overflow-hidden bg-circuit-grid border-b border-cyan-500/20">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="DOER Services Banner"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/80 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Industrial Fit-Out Capabilities</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Our Services
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-normal px-2 sm:px-0 leading-relaxed">
            Complete Interior Design, Manufacturing & Execution Solutions.
          </p>
        </div>
      </section>

      {/* 02. Introduction */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#070A12] border-b border-cyan-500/20 bg-cyber-grid text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <p className="text-lg sm:text-xl lg:text-2xl text-white font-bold leading-relaxed">
            At DOER, we provide integrated solutions for commercial interiors, corporate spaces, customized furniture, and renovation projects.
          </p>
          <p className="text-xs sm:text-base lg:text-lg text-slate-400 leading-relaxed font-normal">
            Our multidisciplinary capabilities allow us to manage projects from initial planning and design through manufacturing, installation, and final delivery.
          </p>
        </div>
      </section>

      {/* 03. Main 6 Core Services */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#05070B] bg-circuit-grid relative border-b border-cyan-500/20">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20 lg:space-y-24 relative z-10">
          {mainServices.map((service, index) => {
            const isEven = index % 2 === 1;
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-20 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image Showcase */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="relative h-[260px] xs:h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8)] border border-cyan-500/30 group cyber-corner">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 px-3 sm:px-3.5 py-1 sm:py-1.5 bg-[#080C16]/90 backdrop-blur-md rounded-lg text-cyan-300 font-mono text-[10px] sm:text-xs font-bold border border-cyan-500/30">
                      Service {service.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FF3D00] block mb-1">
                      Service {service.number}
                    </span>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      {service.title}
                    </h2>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                    {service.description}
                  </p>

                  <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 bg-[#0B101D]/90 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl cyber-corner text-white">
                    <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                      Our solutions include:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {service.solutions.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 sm:pt-2">
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,61,0,0.4)] border border-[#FF3D00] transition-all"
                    >
                      <span>Inquire About This Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04. Additional Commercial Interior Solutions */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#070A12] bg-cyber-grid border-b border-cyan-500/20 relative text-white">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Additional Commercial Interior Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {additionalSolutions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#0B101D]/90 text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between group hover:border-[#FF3D00]/60 hover:shadow-[0_0_25px_rgba(255,61,0,0.35)] transition-all duration-300 cyber-corner"
                >
                  <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover img-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-[#0B101D]/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-bold text-xs sm:text-sm tracking-tight truncate">{item.title}</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05. Call to Action */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#05070B] text-white text-center relative overflow-hidden bg-circuit-grid">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="absolute inset-0 bg-[#FF3D00]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Planning a New Interior Project?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Let us help you bring your ideas to life with thoughtful design and professional execution.
          </p>
          <div className="pt-2 sm:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(255,61,0,0.45)] border border-[#FF3D00] transition-all transform hover:-translate-y-1"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
