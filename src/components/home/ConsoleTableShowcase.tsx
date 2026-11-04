'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  X,
  Phone,
  Sparkles,
  Building2,
  Ruler,
  Cpu,
  Layers,
  Wrench,
  Check,
  Zap,
} from 'lucide-react';

interface ProductSpec {
  label: string;
  value: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  category: 'workstation' | 'console' | 'conference';
  categoryLabel: string;
  image: string;
  specs: string;
  dimensions: string;
  capacity: string;
  overview: string;
  features: string[];
  cableManagement: string[];
  materialsSpecs: ProductSpec[];
  targetFacilities: string;
  warranty: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'model-h',
    code: 'DOER-WS-01',
    name: 'Model H Modular Executive Workstation',
    category: 'workstation',
    categoryLabel: 'Executive Workstation',
    image: '/images/products/01-model-h-modular-executive-workstation.jpg',
    specs: 'Modular Wire Trays • Solid Steel Chassis',
    dimensions: 'Custom L-Shape / Linear Sizing',
    capacity: '1–2 Executives',
    overview:
      'The Model H is a premium modular workstation designed with a modern appearance, durable construction, and practical functionality. It features a quick-assembly frame with a snap-and-screw system ensuring easy, secure installation and flexible configurations to meet diverse workspace and control room requirements.',
    features: [
      'Quick-assembly frame with innovative snap-and-screw system for fast, secure installation and modular reconfiguration',
      'Front-mounted black rubber armrest integrated along the control panel for superior wrist support and ergonomic comfort',
      'Tiffany Blue anti-glare light strips on both metal side panels, improving visual comfort and modern aesthetic appeal',
      '200 mm high aluminum profile screen supporting multiple monitor mounting systems and flexible display layouts',
      'Adjustable horizontal support feet ensuring balanced leveling and vibration stability across any floor surface',
    ],
    cableManagement: [
      'Sealed base cover plate with standard 86-type socket openings and wiring ports for convenient electrical connections',
      'Integrated transverse wiring groove situated directly beneath cover opening for neat, organized cable routing',
      'Internal wire isolation preventing power and data line tangling and electromagnetic interference',
    ],
    materialsSpecs: [
      { label: 'Worktop Material', value: '25 mm thick E0-grade solid wood surface' },
      { label: 'Main Metal Frame', value: '1.5 mm premium cold-rolled steel' },
      { label: 'Door Panels (Front/Rear)', value: '1.0 mm cold-rolled steel plate' },
      { label: 'Aluminum Screen Profile', value: '2.0 mm thick architectural aluminum profile' },
      { label: 'Assembly Mechanism', value: 'Quick-assembly snap-and-screw system' },
      { label: 'Ambient Lighting', value: 'Tiffany Blue anti-glare LED illumination strips' },
    ],
    targetFacilities: 'Modern Corporate Offices, Executive Suites, and Control Room Environments',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'model-d',
    code: 'DOER-WS-02',
    name: 'Model D Modular Executive Workstation',
    category: 'workstation',
    categoryLabel: 'Executive Workstation',
    image: '/images/products/02-model-d-modular-executive-workstation.jpg',
    specs: 'Double-Bay Workstation • Cable Management',
    dimensions: 'Bespoke Dual Pod Dimensions',
    capacity: '2 Person Workstation Pod',
    overview:
      'The Model D is a premium modular workstation designed to provide flexibility, durability, and convenience in modern office and control room environments. It features an innovative screw-free snap-fit frame that allows quick, easy, and flexible assembly without the need for conventional screws.',
    features: [
      'Innovative screw-free snap-fit frame enabling quick, toolless assembly and flexible modular expansion',
      'Integrated black rubber handrail contoured along the front edge of the worktop for sustained arm comfort',
      'Built-in slide-out keyboard drawer, 19-inch equipment rack, and dedicated CPU utility tray for organized storage',
      '200 mm high aluminum screen panel supporting diverse monitor mounting configurations according to operational needs',
      'Adjustable horizontal support feet ensuring balanced load distribution and proper positioning',
    ],
    cableManagement: [
      'Dual integrated high-capacity power raceways routing cables cleanly through the internal sub-frame',
      'Under-desk wire management trough eliminating tangled cords and accidental disconnections',
      'Rear service panels allowing quick equipment maintenance without moving the workstation',
    ],
    materialsSpecs: [
      { label: 'Operating Worktop', value: '25 mm thick E1-grade eco-friendly solid wood particle board' },
      { label: 'Main Metal Frame', value: '1.5 mm cold-rolled steel plate with flexible matte coating' },
      { label: 'Door Panels', value: '1.0 mm steel plate with magnetic latching' },
      { label: 'Aluminum Profile', value: '2.0 mm architectural grade aluminum' },
      { label: 'Built-In Hardware', value: 'Slide-out keyboard drawer & 19-inch equipment rack' },
      { label: 'Surface Finish', value: 'Anti-scratch flexible matte protective finish' },
    ],
    targetFacilities: 'Corporate Offices, Multi-Operator Workspaces, and Command Hubs',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'office-control-console-yq-dz-01',
    code: 'DOER-CC-01',
    name: 'Office Control Console YQ-DZ-01',
    category: 'console',
    categoryLabel: 'Control Room Console',
    image: '/images/products/03-office-control-console-yq-dz-01.jpg',
    specs: 'Multi-Monitor Rails • High-Density Core',
    dimensions: 'Custom Length & Radians',
    capacity: 'Continuous 24/7 Operations',
    overview:
      'Engineered for mission-critical command hubs, the YQ-DZ-01 features an advanced cable management system that physically separates high-voltage and low-voltage wiring to reduce electromagnetic interference (EMI) and maintain reliable signal quality for sensitive electronic equipment.',
    features: [
      'Patented screwless fastener modular assembly system for rapid, cost-effective on-site installation and global shipping',
      'Heavy-duty 1.5 mm structural steel frame backed by a 10-year structural warranty',
      'Complies with international RoHS environmental safety standards with low formaldehyde emissions',
      'Eco-friendly zero-VOC electrostatic coating supporting superior indoor air quality in closed monitoring centers',
      'Standardized components making maintenance easier and ensuring convenient access to replacement parts',
      'Flexible modular customization according to site dimensions, radians, and multi-operator layouts',
    ],
    cableManagement: [
      'Advanced physical separation of high-voltage and low-voltage wiring conduits to eliminate electromagnetic interference (EMI)',
      'Optimized internal cable raceways routing power and signal lines directly to floor access points',
      'Rear access service doors allowing cable maintenance without interrupting active operations',
    ],
    materialsSpecs: [
      { label: 'Core Board', value: 'E0-grade particle board (RoHS Compliant, Low Formaldehyde)' },
      { label: 'Structural Steel', value: 'Heavy-duty 1.5 mm cold-rolled structural steel chassis' },
      { label: 'Fastening System', value: 'Patented screwless interlocking fasteners' },
      { label: 'Surface Coating', value: 'Eco-friendly zero-VOC electrostatic powder finish' },
      { label: 'EMI Protection', value: 'Dual-chamber physical power/data segregation' },
      { label: 'Warranty Standard', value: '10-Year Comprehensive Structural Warranty' },
    ],
    targetFacilities: 'Mission-Critical Command Centers, Dispatch Hubs, Network Operation Centers (NOC)',
    warranty: '10-Year Comprehensive Structural Warranty',
  },
  {
    id: 'hg-b1-executive-modular-control-console',
    code: 'DOER-CC-02',
    name: 'HG-B1 Executive Modular Control Console',
    category: 'console',
    categoryLabel: 'Control Room Console',
    image: '/images/products/04-hg-b1-executive-modular-control-console.jpg',
    specs: 'Command Desk • Acoustic Dampening',
    dimensions: 'Ergonomic Curved Profile',
    capacity: '1–3 Operators',
    overview:
      'The HG-B1 Executive Modular Control Console is designed to provide practical storage, organized equipment management, and a sophisticated appearance. It features functional storage cabinets on both sides, a step-style control panel, and an integrated rear backlighting strip that adds distinctive visual appeal.',
    features: [
      'Functional storage cabinets on both sides offering convenient space for documents, accessories, and operational equipment',
      'Step-style control panel and side storage cabinets creating an architectural layered appearance while maintaining clean organization',
      'Integrated backlighting strip at the rear adding distinctive modern illumination and enhanced visual comfort',
      'Minimalist modern design approach engineered to keep all monitoring screens within natural eye level and reach',
      'Reinforced cold-rolled steel internal chassis supporting heavy-duty multi-operator loads',
    ],
    cableManagement: [
      'Concealed high-volume cable trays with dedicated separation for high and low voltage lines',
      'Vertical cable risers connecting directly into raised computer access flooring or cable ducts',
      'Rear access doors allowing fast maintenance access to internal electronics and power units',
    ],
    materialsSpecs: [
      { label: 'Main Structural Frame', value: '1.5 mm heavy-duty cold-rolled steel chassis' },
      { label: 'Control Panel Style', value: 'Step-style multi-tier ergonomic profile' },
      { label: 'Storage Enclosures', value: 'Dual-sided functional storage cabinets with flush doors' },
      { label: 'Illumination', value: 'Integrated ambient rear backlighting LED strip' },
      { label: 'Surface Finish', value: 'Anti-glare commercial electrostatic powder finish' },
    ],
    targetFacilities: 'Command Centers, Security Monitoring Rooms, and Professional Operation Facilities',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'hg-a2-modular-smart-control-console',
    code: 'DOER-CC-03',
    name: 'HG-A2 Modular Smart Control Console',
    category: 'console',
    categoryLabel: 'Smart Control Console',
    image: '/images/products/05-hg-a2-modular-smart-control-console.jpg',
    specs: 'Smart Riser • Precision Powder-Coated',
    dimensions: 'Modular Linkable Sections',
    capacity: 'Multi-Station Setup',
    overview:
      'The HG-A2 Modular Smart Control Console combines elegant design, practical storage, and advanced functionality to create an efficient and comfortable working environment. Special attention has been given to cable management and heat dissipation to support the smooth operation of electronic equipment.',
    features: [
      'Well-organized internal structure providing convenient storage space while maintaining a clean, professional appearance',
      'Specialized thermal management channels and ventilation grills supporting the smooth, uninterrupted 24/7 operation of electronic equipment',
      'Full compatibility with adjustable multi-axis monitor arms, allowing users to position displays at diverse angles and heights',
      'Flexible display adjustment helping improve working posture, reduce physical fatigue, and enhance overall operator comfort',
      'Linkable modular design allowing seamless side-by-side expansion across large control rooms',
    ],
    cableManagement: [
      'Dedicated segregated cable pathways isolating power, video, and network lines',
      'Quick-access internal cable management cavities for rapid maintenance without disassembling the desk',
      'Top-surface cable brush ports for clean desktop peripheral connections',
    ],
    materialsSpecs: [
      { label: 'Sub-Frame Structure', value: 'High-strength cold-rolled structural steel chassis' },
      { label: 'Worktop Surface', value: 'Scratch-resistant high-pressure commercial laminate' },
      { label: 'Thermal Engineering', value: 'Passive & active thermal dissipation channels' },
      { label: 'Display Compatibility', value: 'Multi-axis articulating arm mounting track' },
      { label: 'Operating Standard', value: 'Engineered for continuous 24/7 technical operations' },
    ],
    targetFacilities: 'Command Centers, Monitoring Rooms, and Professional Control Environments',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'hg-a1-modular-smart-control-console',
    code: 'DOER-CC-04',
    name: 'HG-A1 Modular Smart Control Console',
    category: 'console',
    categoryLabel: 'Smart Control Console',
    image: '/images/products/06-hg-a1-modular-smart-control-console.jpg',
    specs: 'Integrated Power Hub • Precision Edge',
    dimensions: 'Standard & Extended Spans',
    capacity: 'Single or Linked Arrays',
    overview:
      'The HG-A1 Modular Smart Control Console is a modern, ergonomically designed workstation that combines advanced technology, stylish aesthetics, and practical functionality. Featuring a sleek ice-blue lighting design and a premium full-metal exterior, it offers a distinctive and professional appearance for modern control rooms.',
    features: [
      'Innovative aerodynamic swallow-tail silhouette moving beyond traditional boxy workstation designs',
      'Sleek ice-blue ambient lighting design providing visual comfort and high-tech styling in low-light control rooms',
      'Premium full-metal exterior with refined industrial finishing and exceptional structural rigidity',
      'Rear-mounted smart display system that supports convenient customization and integration of display equipment',
      'Modular configuration allowing flexible straight and curved arrangements to accommodate diverse room requirements',
    ],
    cableManagement: [
      'Concealed high-capacity cable conduits routed inside the aerodynamic swallow-tail frame',
      'Rear-accessible equipment cavities with brush grommets for continuous cable additions',
      'Integrated grounding bars protecting connected computer and display hardware',
    ],
    materialsSpecs: [
      { label: 'Exterior Construction', value: 'Premium full-metal chassis with laser-cut detailing' },
      { label: 'Ambient Lighting', value: 'Integrated ice-blue anti-glare LED illumination' },
      { label: 'Display System', value: 'Rear-mounted smart display rail system' },
      { label: 'Structural Profile', value: 'Aerodynamic swallow-tail structural engineering' },
      { label: 'Finish Quality', value: 'Refined industrial metallic coating' },
    ],
    targetFacilities: 'Command Centers, Security Monitoring Rooms, Operation Control Centers (OCC)',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'u-shaped-modular-conference-console',
    code: 'DOER-CONF-01',
    name: 'U-Shaped Modular Conference Console',
    category: 'conference',
    categoryLabel: 'Conference & Meeting',
    image: '/images/products/07-u-shaped-modular-conference-console.jpg',
    specs: 'U-Layout • Panoramic Sightlines',
    dimensions: 'Custom 12–30+ Delegates Span',
    capacity: 'Large Delegations & Boardrooms',
    overview:
      'The U-Shaped Modular Conference Console is designed for professional meeting rooms, command centers, and collaborative working environments. Its spacious layout provides comfortable seating for multiple users while maintaining clear communication and visibility among participants.',
    features: [
      'Spacious U-shaped layout providing comfortable seating for multiple delegates with unobstructed sightlines',
      'Integrated central structure offering convenient space for audio-visual equipment placement and wire routing',
      'Combination of smooth work surfaces, durable structural panels, and elegant accent lighting',
      'Modular configuration fully customizable according to room dimensions and specific operational requirements',
      'Optimized acoustic geometry enhancing vocal clarity during high-level executive meetings and discussions',
    ],
    cableManagement: [
      'Centralized equipment channels routing cables invisibly directly into floor access boxes',
      'Integrated tabletop recesses for conference delegate microphones, translation ports, and pop-up power modules',
      'Full-length continuous wire raceway keeping the workspace impeccably organized and functional',
    ],
    materialsSpecs: [
      { label: 'Delegate Capacity', value: '12 to 30+ participants (custom CAD scaled)' },
      { label: 'Surface Panels', value: 'Durable architectural structural panels with smooth worktops' },
      { label: 'Accent Lighting', value: 'Integrated contour LED accent lighting' },
      { label: 'Central Structure', value: 'Heavy-load steel equipment and cable housing' },
      { label: 'Configuration', value: 'Modular sections tailored to room dimensions' },
    ],
    targetFacilities: 'Executive Meeting Rooms, Boardrooms, Command Centers, Collaborative Environments',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'extended-modular-control-conference-console',
    code: 'DOER-CONF-02',
    name: 'Extended Modular Control & Conference Console',
    category: 'conference',
    categoryLabel: 'Conference & Meeting',
    image: '/images/products/08-extended-modular-control-conference-console.jpg',
    specs: 'Continuous Linear Span • Hidden Conduits',
    dimensions: 'Expandable Multi-Segment Layout',
    capacity: '10–24 Delegates',
    overview:
      'The Extended Modular Control & Conference Console is designed for large-scale operational environments that require multiple workstations and coordinated team activities. Its extended modular structure combines individual operator stations into a continuous workspace, allowing multiple users to work simultaneously while maintaining an organized layout.',
    features: [
      'Extended modular structure combining individual operator stations into a unified, continuous workspace',
      'Supports comprehensive monitor installation, equipment integration, and efficient cable management',
      'Integrated accent lighting enhancing its modern technological appearance and ambient visibility',
      'Flexible configuration allowing straight, curved, and extended arrangements according to available space',
      'Promotes seamless team collaboration across emergency response and large-scale control operations',
    ],
    cableManagement: [
      'High-capacity full-length cable management channels routing power, video, and network lines',
      'Accessible service hatches along the console for rapid equipment installation and maintenance',
      'Independent power and data distribution to every operator bay',
    ],
    materialsSpecs: [
      { label: 'Modularity Type', value: 'Interlocking straight, curved, and extended segments' },
      { label: 'Chassis Construction', value: 'Heavy-duty structural steel with anti-vibration leveling' },
      { label: 'Accent Lighting', value: 'Integrated modern technological LED accent strips' },
      { label: 'Display Mounting', value: 'Full-span heavy-duty display rail system' },
      { label: 'Surface Coating', value: 'High-durability anti-glare commercial finish' },
    ],
    targetFacilities: 'Command Centers, Security Monitoring Facilities, Emergency Response Rooms',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'hg-b4-multi-position-modular-control-console',
    code: 'DOER-CC-05',
    name: 'HG-B4 Multi-Position Modular Control Console',
    category: 'console',
    categoryLabel: 'Control Room Console',
    image: '/images/products/09-hg-b4-multi-position-modular-control-console.jpg',
    specs: '4-Operator Command Hub • Dual Mounts',
    dimensions: 'Quad-Station Array',
    capacity: '4 Dedicated Operators',
    overview:
      'The HG-B4 Multi-Position Modular Control Console is designed for large-scale control rooms that require flexible workstation arrangements and efficient space utilization. Its modular structure allows multiple workstation units to be combined freely, making it suitable for different team sizes and operational layouts.',
    features: [
      'Modular structure allowing multiple workstation units to be combined freely for different team sizes',
      'Individual workstation partitions providing privacy and a more organized, focused working environment for each operator',
      'Integrated lighting enhancing its modern, technology-focused appearance and shift comfort',
      'Supports both individual focused tasks and coordinated team-based operations effortlessly',
      'Multi-monitor VESA rail supports accommodating dual and triple screen configurations per operator',
    ],
    cableManagement: [
      'Independent segregated wiring pathways for each operator position',
      'Integrated CPU and hardware mounting compartments with optimal ventilation',
      'Direct floor access conduit drops for clean, invisible infrastructure wiring',
    ],
    materialsSpecs: [
      { label: 'Pod Configuration', value: 'Multi-operator modular cluster freely combinable' },
      { label: 'Privacy System', value: 'Integrated acoustic and visual workstation partitions' },
      { label: 'Illumination', value: 'Integrated technological ambient lighting strips' },
      { label: 'Chassis Material', value: 'Heavy-gauge cold-rolled structural steel' },
      { label: 'Operational Standard', value: 'Engineered for continuous 24/7 team operations' },
    ],
    targetFacilities: 'Command Centers, Security Operations, Emergency Response Centers, Large Monitoring Facilities',
    warranty: '5-Year Structural Integrity Warranty',
  },
  {
    id: 'large-rectangular-conference-table',
    code: 'DOER-CONF-03',
    name: 'Large Rectangular Conference Table',
    category: 'conference',
    categoryLabel: 'Conference & Meeting',
    image: '/images/products/10-large-rectangular-conference-table.jpg',
    specs: 'Solid Hardwood • Flush Conference Ports',
    dimensions: 'Up to 24ft Custom Span',
    capacity: '14–28 Delegates',
    overview:
      'The Large Rectangular Conference Table is designed to accommodate multiple participants in corporate meeting rooms, boardrooms, and collaborative workspaces. Its spacious tabletop provides sufficient working space for meetings, discussions, and presentations. The streamlined structure and clean surface design create a modern, elegant appearance.',
    features: [
      'Spacious expansive tabletop providing generous working space for meetings, discussions, and presentations',
      'Streamlined structure and clean surface design creating a modern and elegant appearance complementing diverse office interiors',
      'Long rectangular configuration allowing participants to sit comfortably along both sides, promoting effective communication and teamwork',
      'Fully customizable in terms of dimensions, seating capacity, materials, and finishing options to meet specific project requirements',
      'Ergonomically beveled edges providing forearm comfort during extended board meetings',
    ],
    cableManagement: [
      'Integrated concealed wire management channels routing through hollow pedestal support columns',
      'Flush pop-up connectivity hubs supporting HDMI, USB-C, power, and network connections',
      'Under-table cable management baskets preventing loose wires and floor hazards',
    ],
    materialsSpecs: [
      { label: 'Seating Capacity', value: 'Custom scalable dimensions to accommodate 10 to 30+ participants' },
      { label: 'Worktop Material', value: 'Premium solid wood or architectural timber veneer with protective matte lacquer' },
      { label: 'Subframe Backbone', value: 'Reinforced internal steel truss preventing any center deflection' },
      { label: 'Customization Options', value: 'Dimensions, capacity, wood species, and connectivity ports' },
      { label: 'Edge Profile', value: 'Soft-touch beveled solid hardwood perimeter edge' },
    ],
    targetFacilities: 'Corporate Meeting Rooms, Executive Boardrooms, and Collaborative Workspaces',
    warranty: '5-Year Structural Integrity Warranty',
  },
];

export default function ConsoleTableShowcase() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'workstation' | 'console' | 'conference'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock and ESC key listener when modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };

    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewProduct]);

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const categories = [
    { id: 'all' as const, label: 'All Tables & Consoles', count: PRODUCTS.length },
    { id: 'workstation' as const, label: 'Executive Workstations', count: PRODUCTS.filter(p => p.category === 'workstation').length },
    { id: 'console' as const, label: 'Control Room Consoles', count: PRODUCTS.filter(p => p.category === 'console').length },
    { id: 'conference' as const, label: 'Conference & Meeting', count: PRODUCTS.filter(p => p.category === 'conference').length },
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white border-b border-slate-200/80 w-full overflow-hidden relative">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-orange-50 border border-orange-200 text-slate-800 text-[11px] sm:text-xs font-semibold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
              <span className="text-[#FF3D00] font-bold">Bespoke Furniture</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Highend Console Table & <br className="hidden sm:inline" />
              <span className="text-[#FF3D00]">Signature Millwork.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base lg:text-lg font-normal max-w-2xl leading-relaxed">
              Handcrafted in our Khilkhet workshop, our signature console tables unite solid hardwoods with architectural metal joinery to create striking statement pieces for executive suites and luxury interiors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-slate-950 hover:bg-[#FF3D00] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group"
            >
              <span>Request Custom Furniture Quote</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* E-Commerce Standards Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 mb-6 sm:mb-10 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">In-House Manufacturing</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Khilkhet Workshop, Dhaka</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
              <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Bespoke Millimeter Sizing</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Built to your CAD floor plan</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Cable & Power Conduits</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Integrated hidden wire trays</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">Commercial Warranty</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">Up to 10-Year Coverage</p>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-6 sm:pb-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-mono ${
                      isSelected ? 'bg-[#FF3D00] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of{' '}
            <strong className="text-slate-900">{PRODUCTS.length}</strong> Factory Models
          </div>
        </div>

        {/* E-Commerce Product Grid: 2 columns on Mobile, 3 on Tablet, 4-5 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6 pt-6 sm:pt-10">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setQuickViewProduct(product)}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#FF3D00] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Square Product Image Container (aspect-square) */}
              <div className="relative aspect-square w-full bg-slate-50/80 group-hover:bg-slate-100/60 transition-colors p-2 sm:p-4 flex items-center justify-center overflow-hidden border-b border-slate-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority={product.id === 'model-h'}
                  className="object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-10 pointer-events-none gap-1">
                  <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-white/95 backdrop-blur-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-800 border border-slate-200 shadow-sm truncate max-w-[90px] sm:max-w-none">
                    {product.categoryLabel}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-[9px] sm:text-[10px] font-semibold shrink-0">
                    {product.code}
                  </span>
                </div>

                {/* Quick-View Tag on Hover */}
                <div className="absolute bottom-2.5 inset-x-2 sm:inset-x-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-10">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-white/10">
                    <Eye className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>View Specifications</span>
                  </span>
                </div>
              </div>

              {/* Product Meta & Details */}
              <div className="p-3 sm:p-5 space-y-1.5 sm:space-y-2.5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-[11px] font-mono text-[#FF3D00] font-semibold uppercase tracking-wider">
                    {product.capacity}
                  </p>
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-[#FF3D00] transition-colors leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="pt-1">
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg bg-slate-50 border border-slate-200/80 text-[10px] sm:text-[11px] font-medium text-slate-700 w-full">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF3D00] shrink-0" />
                    <span className="truncate">{product.specs}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Customization Banner */}
        <div className="mt-12 sm:mt-16 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-slate-950 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom CAD Architectural Sizing</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Require Custom Dimensions, Monitor Arrays, or Exotic Finishes?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Our in-house Khilkhet workshop builds every workstation, command console, and boardroom table to your exact architectural CAD drawings, complete with custom finishes, power boxes, and acoustic privacy screens.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#e03600] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF3D00]/25"
              >
                <span>Submit Floor Plan For Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:01716535654"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/15 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF3D00]" />
                <span>Hotline: 01716535654</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Professional Pop-up Specification Modal Mounted via Portal to Avoid Stacking Traps */}
      {mounted && quickViewProduct && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Bar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#FF3D00] text-white font-mono text-[11px] sm:text-xs font-bold shrink-0">
                  {quickViewProduct.code}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline shrink-0">
                  {quickViewProduct.categoryLabel}
                </span>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <h3 className="text-xs sm:text-base font-bold text-slate-900 truncate">
                  {quickViewProduct.name}
                </h3>
              </div>

              <button
                onClick={() => setQuickViewProduct(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-[#FF3D00] hover:text-white text-slate-700 flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              
              {/* Product Hero Block */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-center">
                <div className="md:col-span-5">
                  <div className="relative aspect-square w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-inner group">
                    <Image
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      fill
                      className="object-contain p-3 sm:p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/95 text-[9px] sm:text-[10px] font-bold text-slate-800 shadow-sm border border-slate-200">
                        Square 1:1 View
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#FF3D00] uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">DOER Workshop Fabrication • Khilkhet, Dhaka</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {quickViewProduct.name}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {quickViewProduct.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Dimensions</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 pt-0.5">{quickViewProduct.dimensions}</p>
                    </div>
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">Warranty</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 pt-0.5">{quickViewProduct.warranty}</p>
                    </div>
                  </div>

                  {/* Target Environment Badge */}
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 block leading-snug">
                      Recommended Environments: <strong className="text-slate-800 font-bold">{quickViewProduct.targetFacilities}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Structured Sections */}
              <div className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
                
                {/* 01. Key Architectural Features & Ergonomics */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
                      <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Key Features & Ergonomic Engineering
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 gap-2 sm:gap-2.5 pt-1">
                    {quickViewProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3D00] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 02. Cable Management & Equipment Integration */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
                      <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Integrated Cable Management & Power Routing
                    </h4>
                  </div>
                  <ul className="grid grid-cols-1 gap-2 sm:gap-2.5 pt-1">
                    {quickViewProduct.cableManagement.map((cable, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <Check className="w-4 h-4 text-[#FF3D00] shrink-0 mt-0.5" />
                        <span>{cable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 03. Technical Material Specifications Table */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                      Technical Material Specifications
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 pt-1">
                    {quickViewProduct.materialsSpecs.map((spec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 flex flex-col justify-between"
                      >
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {spec.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 pt-0.5">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Sticky Bottom Action Footer */}
            <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 shadow-lg">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#FF3D00] shrink-0" />
                <span className="truncate">Custom CAD sizing & finishes available upon request.</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="tel:01716535654"
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-800 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3D00]" />
                  <span>01716535654</span>
                </a>

                <Link
                  href={`/contact?subject=Inquiry%20for%20${encodeURIComponent(quickViewProduct.name)}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#FF3D00] hover:bg-[#e03600] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3D00]/25"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
