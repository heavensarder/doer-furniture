import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Target, Compass, Award, ArrowRight, Quote, ShieldCheck, Factory, Users } from 'lucide-react';

export const metadata = {
  title: 'About DOER – Creating Spaces That Inspire and Perform',
  description: 'Learn about DOER, our vision, mission, leadership, and our commitment to excellence in interior design, fit-out, and furniture manufacturing.',
  openGraph: {
    title: 'About DOER – Creating Spaces That Inspire and Perform',
    description: 'Learn about DOER, our vision, mission, leadership, and our commitment to excellence in interior design, fit-out, and furniture manufacturing.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1734,
        height: 907,
        alt: 'About DOER',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DOER – Creating Spaces That Inspire and Perform',
    description: 'Learn about DOER, our vision, mission, leadership, and our commitment to excellence in interior design, fit-out, and furniture manufacturing.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-slate-950 text-white overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80"
            alt="About DOER Banner"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span>About Us</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            About DOER
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-light px-2 sm:px-0 leading-relaxed">
            Creating Spaces That Inspire and Perform.
          </p>
        </div>
      </section>

      {/* Company Introduction / Who We Are */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white bg-architectural-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20 items-center">
            
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <span>Who We Are</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Innovative Interior Solutions with Complete In-House Execution
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-800 leading-relaxed font-medium">
                DOER is a professional interior design and execution firm dedicated to delivering innovative, functional, and aesthetically refined spaces.
              </p>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  We specialize in commercial interiors, corporate office solutions, furniture customization, manufacturing, and complete project execution.
                </p>

                <p>
                  With a strong focus on quality, precision, and client satisfaction, we transform ideas into reality through modern design approaches, advanced manufacturing capabilities, and efficient project management.
                </p>

                <p>
                  Our approach begins with understanding our clients&apos; vision and requirements. We then develop customized solutions that combine aesthetics, functionality, and practicality.
                </p>

                <p>
                  From concept development and 3D visualization to material selection, fabrication, and installation, we manage every stage with attention to detail.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[500px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
                <Image
                  src="/images/about/doer-logo-showcase.jpg"
                  alt="DOER Brand Showcase"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white relative bg-architectural-grid-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Vision */}
            <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-800 flex flex-col justify-between hover:border-[#FF3D00]/50 transition-all shadow-xl">
              <div className="space-y-4 sm:space-y-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00]/15 text-[#FF3D00] flex items-center justify-center">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
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
            <div className="bg-slate-900/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-800 flex flex-col justify-between hover:border-[#FF3D00]/50 transition-all shadow-xl">
              <div className="space-y-4 sm:space-y-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00]/15 text-[#FF3D00] flex items-center justify-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
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

      {/* Message from the Founder */}
      <section className="py-16 sm:py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 border border-slate-200 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-200/60 pointer-events-none">
              <Quote className="w-20 h-20 sm:w-32 sm:h-32" />
            </div>

            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Leadership</span>
                </div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  A Message of Vision and Commitment
                </h2>
              </div>

              <div className="space-y-3.5 sm:space-y-4 text-slate-700 text-xs sm:text-base lg:text-lg leading-relaxed font-normal">
                <p className="text-slate-900 font-semibold italic text-sm sm:text-lg lg:text-xl border-l-4 border-[#FF3D00] pl-3 sm:pl-4 py-0.5">
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

              <div className="pt-4 sm:pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
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

      {/* Our Commitment */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-950 text-white border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FF3D00] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#FF3D00]/30">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF3D00]/25"
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
