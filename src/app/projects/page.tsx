'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  categoryFilter: 'commercial' | 'showroom' | 'government' | 'furniture';
  location: string;
  capacity?: string;
  scope: string[];
  description: string;
  keyFeatures?: string[];
  designImage: string;
  completedImage: string;
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'commercial' | 'showroom' | 'government' | 'furniture'>('all');
  const [galleryViews, setGalleryViews] = useState<Record<string, 'completed' | 'design'>>({
    'south-pole': 'completed',
    'door-lock': 'completed',
    'cdpl': 'completed',
    'walton': 'completed',
    'conference': 'completed',
  });

  const projects: ProjectItem[] = [
    {
      id: 'south-pole',
      number: '01',
      title: 'South Pole Coffee',
      category: 'Commercial Interior',
      categoryFilter: 'commercial',
      location: 'Jashimuddin, Uttara, Dhaka',
      scope: ['Interior design', 'Civil works', 'Electrical works', 'Interior fit-outs'],
      description:
        'DOER delivered a commercial interior solution for South Pole Coffee, bringing together thoughtful design, civil works, electrical solutions, and interior fit-outs to create an inviting café environment.',
      designImage:
        '/images/projects/south-pole-coffee-visualization.jpg',
      completedImage:
        '/images/projects/south-pole-coffee-completed.jpg',
    },
    {
      id: 'door-lock',
      number: '02',
      title: 'Door Lock Bangladesh',
      category: 'Commercial Interior / Retail Showroom',
      categoryFilter: 'showroom',
      location: 'Jamuna Future Park, Dhaka',
      scope: ['Interior design', 'Electrical works', 'Interior fit-outs'],
      description:
        'DOER worked on the interior design and execution of the Door Lock Bangladesh showroom at Jamuna Future Park, creating a modern retail environment that presents products in an organized and attractive setting.',
      designImage:
        '/images/projects/door-lock-bangladesh-visualization.jpg',
      completedImage:
        '/images/projects/door-lock-bangladesh-completed.jpg',
    },
    {
      id: 'cdpl',
      number: '03',
      title: 'CDPL Control Rooms',
      category: 'Government Project',
      categoryFilter: 'government',
      location: 'Rupganj, Narayanganj, Cumilla & Chittagong',
      scope: ['Electrical solutions', 'Interior solutions'],
      description:
        'DOER delivered electrical and interior solutions for CDPL control room projects across multiple locations, focusing on functional layouts and professional working environments.',
      designImage:
        '/images/projects/cdpl-control-rooms-visualization.jpg',
      completedImage:
        '/images/projects/cdpl-control-rooms-completed.jpg',
    },
    {
      id: 'walton',
      number: '04',
      title: 'Walton Signature Showrooms',
      category: 'Showroom Project',
      categoryFilter: 'showroom',
      location: 'Rupganj & Beldi',
      scope: ['Electrical solutions', 'Interior solutions'],
      description:
        'DOER worked on the electrical and interior solutions for Walton Signature showrooms, creating modern commercial spaces that support product presentation and brand identity.',
      designImage:
        '/images/projects/walton-signature-showrooms-visualization.jpg',
      completedImage:
        '/images/projects/walton-signature-showrooms-completed.jpg',
    },
    {
      id: 'conference',
      number: '05',
      title: 'Custom Conference Table',
      category: 'Custom Furniture Manufacturing',
      categoryFilter: 'furniture',
      location: 'Sylhet Cantonment, Sylhet',
      capacity: '40-Person Seating',
      scope: ['Furniture design', 'Manufacturing', 'Installation'],
      description:
        "A custom-built 40-seater conference table designed to meet the client's workspace requirements and corporate identity.",
      keyFeatures: [
        'Optimized seating arrangement for clear communication and visibility.',
        'Integrated cable management system for a clean workspace.',
        'Provision for power outlets, data ports, and multimedia connectivity.',
        'Durable construction using selected materials for long-term performance.',
      ],
      designImage:
        '/images/projects/custom-conference-table-visualization.jpg',
      completedImage:
        '/images/projects/custom-conference-table-completed.jpg',
    },
  ];

  const filteredProjects =
    activeTab === 'all'
      ? projects
      : projects.filter((p) => p.categoryFilter === activeTab);

  const toggleGallery = (projectId: string, view: 'completed' | 'design') => {
    setGalleryViews((prev) => ({ ...prev, [projectId]: view }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-slate-950 text-white overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
            alt="DOER Projects Banner"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Portfolio</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Our Projects
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-light px-2 sm:px-0 leading-relaxed">
            Transforming Ideas into Real Spaces.
          </p>
        </div>
      </section>

      {/* Introduction & Filter Bar */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-100 bg-architectural-grid">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-900 font-bold leading-relaxed">
            Every project represents our commitment to creativity, functionality, and quality execution.
          </p>
          <p className="text-xs sm:text-base text-slate-600">
            Explore our selected commercial, government, showroom, and customized furniture projects.
          </p>

          {/* Filter Pills */}
          <div className="pt-4 sm:pt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
            {[
              { label: 'All Projects', value: 'all' },
              { label: 'Commercial Interior', value: 'commercial' },
              { label: 'Retail & Showrooms', value: 'showroom' },
              { label: 'Government', value: 'government' },
              { label: 'Custom Furniture', value: 'furniture' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-[#FF3D00] text-white shadow-lg shadow-[#FF3D00]/25'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 lg:space-y-20">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 1;
            const currentView = galleryViews[project.id] || 'completed';
            const displayImage =
              currentView === 'design' ? project.designImage : project.completedImage;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-12 border border-slate-200 shadow-xl"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image View & Toggle Switcher */}
                  <div className={`lg:col-span-6 space-y-3 sm:space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative h-[260px] xs:h-[300px] sm:h-[400px] lg:h-[440px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                      <Image
                        src={displayImage}
                        alt={project.title}
                        fill
                        className="object-cover img-zoom"
                      />
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-slate-950/80 backdrop-blur-md rounded-lg text-white font-mono text-[10px] sm:text-xs font-bold border border-white/10">
                        Project {project.number}
                      </div>

                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-slate-950/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md border border-white/10">
                        {currentView === 'design' ? 'Design Visualization' : 'Completed Project'}
                      </div>
                    </div>

                    {/* Interactive Gallery Toggle */}
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between p-1.5 sm:p-2 bg-slate-100 rounded-xl border border-slate-200 gap-1.5 sm:gap-2 text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] sm:text-[11px] px-1 sm:pl-2 text-center xs:text-left">
                        Gallery View:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleGallery(project.id, 'completed')}
                          className={`flex-1 xs:flex-none px-3 sm:px-4 py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all ${
                            currentView === 'completed'
                              ? 'bg-[#FF3D00] text-white shadow-sm'
                              : 'text-slate-700 hover:text-slate-900 bg-white/60 xs:bg-transparent'
                          }`}
                        >
                          Completed Project
                        </button>
                        <button
                          onClick={() => toggleGallery(project.id, 'design')}
                          className={`flex-1 xs:flex-none px-3 sm:px-4 py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all ${
                            currentView === 'design'
                              ? 'bg-[#FF3D00] text-white shadow-sm'
                              : 'text-slate-700 hover:text-slate-900 bg-white/60 xs:bg-transparent'
                          }`}
                        >
                          Design Visualization
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Meta & Details */}
                  <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${isEven ? 'lg:order-1' : ''}`}>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-[#FF3D00]/10 text-[#FF3D00] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          {project.category}
                        </span>
                        {project.capacity && (
                          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md bg-slate-900 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                            {project.capacity}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        {project.title}
                      </h2>

                      <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-1.5 sm:mt-2">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3D00] shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </p>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                      {project.description}
                    </p>

                    {/* Scope of Work */}
                    <div className="space-y-1.5 sm:space-y-2 pt-1">
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900">
                        Scope of Work:
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {project.scope.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-100 rounded-lg text-[11px] sm:text-xs font-semibold text-slate-800 border border-slate-200"
                          >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3D00] shrink-0" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Features for Custom Conference Table */}
                    {project.keyFeatures && (
                      <div className="space-y-2 sm:space-y-2.5 pt-2 sm:pt-3 bg-slate-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200">
                        <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-900">
                          Key Features:
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {project.keyFeatures.map((feat, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] shrink-0 mt-1.5" />
                              <span className="font-medium leading-relaxed">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3D00] hover:text-slate-900 transition-colors py-1"
                      >
                        <span>Discuss a Similar Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Project Gallery CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white text-center relative overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 bg-[#FF3D00]/10 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            See More of Our Work
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore our completed projects and discover how we combine design, materials, and craftsmanship to create functional spaces.
          </p>
          <div className="pt-2 sm:pt-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#FF3D00]/30 transition-all transform hover:-translate-y-1"
            >
              <span>Start a Project With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
