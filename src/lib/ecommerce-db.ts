import pool from './db';

let initialized = false;

export async function ensureEcommerceTables() {
  if (initialized) return;

  try {
    // 1. product_categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS product_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NULL,
        display_order INT NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. products table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        short_description TEXT NULL,
        description LONGTEXT NULL,
        price DECIMAL(12, 2) NULL,
        is_call_for_price TINYINT(1) NOT NULL DEFAULT 0,
        main_image VARCHAR(500) NOT NULL,
        gallery_images LONGTEXT NULL,
        video_type VARCHAR(20) NOT NULL DEFAULT 'none',
        video_url VARCHAR(500) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'published',
        display_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category_id),
        INDEX idx_slug (slug),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. orders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        product_id INT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_slug VARCHAR(255) NULL,
        product_image VARCHAR(500) NULL,
        product_price DECIMAL(12, 2) NULL,
        quantity INT NOT NULL DEFAULT 1,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NULL,
        delivery_address TEXT NOT NULL,
        notes TEXT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order_status (status),
        INDEX idx_order_created (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if categories table is empty — if so, seed default categories & products
    const [catRows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM product_categories');
    if (catRows[0]?.cnt === 0) {
      await seedInitialEcommerceData();
    }

    initialized = true;
  } catch (err) {
    console.error('Error initializing eCommerce tables:', err);
  }
}

async function seedInitialEcommerceData() {
  try {
    const categories = [
      {
        name: 'Control Room Consoles',
        slug: 'control-room-consoles',
        description:
          'Mission-critical 24/7 command center consoles engineered with heavy-duty cold-rolled steel chassis, multi-monitor rails, and EMI-isolated cable management.',
        display_order: 1,
      },
      {
        name: 'Executive Workstations',
        slug: 'executive-workstations',
        description:
          'Modular executive workstations featuring ergonomic contours, quick-assembly frames, ambient LED accents, and integrated power raceways.',
        display_order: 2,
      },
      {
        name: 'Conference & Boardroom',
        slug: 'conference-boardroom',
        description:
          'Monumental U-shaped and linear conference tables with integrated audio-visual conduits, pop-up connectivity ports, and custom delegate seating capacities.',
        display_order: 3,
      },
    ];

    const categoryMap: Record<string, number> = {};

    for (const cat of categories) {
      const [res]: any = await pool.execute(
        `INSERT INTO product_categories (name, slug, description, display_order, is_active) VALUES (?, ?, ?, ?, 1)`,
        [cat.name, cat.slug, cat.description, cat.display_order]
      );
      categoryMap[cat.slug] = res.insertId;
    }

    const products = [
      {
        category_slug: 'control-room-consoles',
        name: 'Office Control Console YQ-DZ-01',
        slug: 'office-control-console-yq-dz-01',
        short_description:
          'Mission-critical command console with physical high/low-voltage EMI wire separation, multi-monitor rails, and 1.5mm cold-rolled steel chassis.',
        description: `Engineered for mission-critical command hubs, the YQ-DZ-01 features an advanced cable management system that physically separates high-voltage and low-voltage wiring to reduce electromagnetic interference (EMI) and maintain reliable signal quality for sensitive electronic equipment.

Key Features:
• Patented screwless fastener modular assembly system for rapid on-site installation
• Heavy-duty 1.5 mm structural steel frame backed by a 10-year structural warranty
• Complies with international RoHS environmental safety standards with E0-grade low formaldehyde core
• Eco-friendly zero-VOC electrostatic powder coating supporting indoor air quality
• Flexible modular customization according to site dimensions, radians, and multi-operator layouts

Technical Specifications:
• Core Board: E0-grade particle board (RoHS Compliant)
• Structural Steel: Heavy-duty 1.5 mm cold-rolled structural steel chassis
• Fastening System: Patented screwless interlocking fasteners
• EMI Protection: Dual-chamber physical power/data segregation
• Target Facilities: Mission-Critical Command Centers, Dispatch Hubs, Network Operation Centers (NOC)`,
        price: null,
        is_call_for_price: 1,
        main_image: '/images/products/03-office-control-console-yq-dz-01.jpg',
        gallery_images: JSON.stringify([
          '/images/products/04-hg-b1-executive-modular-control-console.jpg',
          '/images/products/05-hg-a2-modular-smart-control-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 1,
      },
      {
        category_slug: 'control-room-consoles',
        name: 'HG-B1 Executive Modular Control Console',
        slug: 'hg-b1-executive-modular-control-console',
        short_description:
          'Ergonomic curved profile command desk with dual-sided storage enclosures, step-style control panel, and ambient rear LED backlighting.',
        description: `The HG-B1 Executive Modular Control Console is designed to provide practical storage, organized equipment management, and a sophisticated appearance. It features functional storage cabinets on both sides, a step-style control panel, and an integrated rear backlighting strip that adds distinctive visual appeal.

Key Features:
• Functional storage cabinets on both sides offering convenient space for operational equipment
• Step-style control panel creating an architectural layered appearance
• Integrated backlighting strip at the rear adding modern illumination and visual comfort
• Minimalist modern design keeping all monitoring screens within natural eye level
• Reinforced 1.5mm cold-rolled steel internal chassis supporting heavy-duty multi-operator loads

Technical Specifications:
• Main Structural Frame: 1.5 mm heavy-duty cold-rolled steel chassis
• Control Panel Style: Step-style multi-tier ergonomic profile
• Storage Enclosures: Dual-sided functional storage cabinets with flush doors
• Illumination: Integrated ambient rear backlighting LED strip
• Warranty: 5-Year Structural Integrity Warranty`,
        price: 185000,
        is_call_for_price: 0,
        main_image: '/images/products/04-hg-b1-executive-modular-control-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/03-office-control-console-yq-dz-01.jpg',
          '/images/products/06-hg-a1-modular-smart-control-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 2,
      },
      {
        category_slug: 'control-room-consoles',
        name: 'HG-A2 Modular Smart Control Console',
        slug: 'hg-a2-modular-smart-control-console',
        short_description:
          'Linkable smart control console featuring specialized thermal dissipation channels, multi-axis monitor arm tracks, and high-pressure commercial laminate.',
        description: `The HG-A2 Modular Smart Control Console combines elegant design, practical storage, and advanced functionality to create an efficient and comfortable working environment. Special attention has been given to cable management and heat dissipation to support the smooth 24/7 operation of electronic equipment.

Key Features:
• Specialized thermal management channels and ventilation grills for continuous 24/7 operation
• Full compatibility with adjustable multi-axis monitor arms
• Flexible display adjustment helping improve working posture and reduce operator fatigue
• Linkable modular design allowing seamless side-by-side expansion across large control rooms
• Dedicated segregated cable pathways isolating power, video, and network lines`,
        price: 165000,
        is_call_for_price: 0,
        main_image: '/images/products/05-hg-a2-modular-smart-control-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/06-hg-a1-modular-smart-control-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 3,
      },
      {
        category_slug: 'control-room-consoles',
        name: 'HG-A1 Modular Smart Control Console',
        slug: 'hg-a1-modular-smart-control-console',
        short_description:
          'Aerodynamic swallow-tail silhouette console with ice-blue anti-glare LED illumination, full-metal laser-cut exterior, and smart display rail.',
        description: `The HG-A1 Modular Smart Control Console is a modern, ergonomically designed workstation that combines advanced technology, stylish aesthetics, and practical functionality. Featuring a sleek ice-blue lighting design and a premium full-metal exterior, it offers a distinctive and professional appearance for modern control rooms.

Key Features:
• Innovative aerodynamic swallow-tail silhouette moving beyond boxy workstation designs
• Sleek ice-blue ambient lighting design providing visual comfort in low-light control rooms
• Premium full-metal exterior with refined industrial finishing and exceptional structural rigidity
• Rear-mounted smart display system supporting convenient integration of display equipment
• Modular configuration allowing flexible straight and curved arrangements`,
        price: null,
        is_call_for_price: 1,
        main_image: '/images/products/06-hg-a1-modular-smart-control-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/05-hg-a2-modular-smart-control-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 4,
      },
      {
        category_slug: 'control-room-consoles',
        name: 'HG-B4 Multi-Position Modular Control Console',
        slug: 'hg-b4-multi-position-modular-control-console',
        short_description:
          '4-operator quad-station command cluster with acoustic privacy partitions, dual/triple VESA monitor mounts, and independent wiring ducts.',
        description: `The HG-B4 Multi-Position Modular Control Console is designed for large-scale control rooms that require flexible workstation arrangements and efficient space utilization. Its modular structure allows multiple workstation units to be combined freely, making it suitable for different team sizes and operational layouts.

Key Features:
• Modular structure allowing multiple workstation units to be combined freely
• Individual workstation partitions providing acoustic privacy and focused workspace
• Integrated technological ambient lighting strips
• Multi-monitor VESA rail supports accommodating dual and triple screen setups per operator
• Independent segregated wiring pathways and ventilated CPU compartments`,
        price: null,
        is_call_for_price: 1,
        main_image: '/images/products/09-hg-b4-multi-position-modular-control-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/03-office-control-console-yq-dz-01.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 5,
      },
      {
        category_slug: 'executive-workstations',
        name: 'Model H Modular Executive Workstation',
        slug: 'model-h-modular-executive-workstation',
        short_description:
          'Premium modular workstation with 25mm E0-grade solid wood surface, Tiffany Blue anti-glare side lighting, and rubber wrist armrest.',
        description: `The Model H is a premium modular workstation designed with a modern appearance, durable construction, and practical functionality. It features a quick-assembly frame with a snap-and-screw system ensuring easy, secure installation and flexible configurations to meet diverse workspace and control room requirements.

Key Features:
• Quick-assembly frame with innovative snap-and-screw system for fast, secure installation
• Front-mounted black rubber armrest integrated along the control panel for wrist comfort
• Tiffany Blue anti-glare light strips on both metal side panels
• 200 mm high aluminum profile screen supporting multiple monitor mounting systems
• Sealed base cover plate with standard 86-type socket openings and internal wire isolation

Specifications:
• Worktop Material: 25 mm thick E0-grade solid wood surface
• Main Metal Frame: 1.5 mm premium cold-rolled steel
• Door Panels: 1.0 mm cold-rolled steel plate
• Aluminum Screen Profile: 2.0 mm thick architectural aluminum`,
        price: 125000,
        is_call_for_price: 0,
        main_image: '/images/products/01-model-h-modular-executive-workstation.jpg',
        gallery_images: JSON.stringify([
          '/images/products/02-model-d-modular-executive-workstation.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 1,
      },
      {
        category_slug: 'executive-workstations',
        name: 'Model D Modular Executive Workstation',
        slug: 'model-d-modular-executive-workstation',
        short_description:
          'Double-bay executive workstation pod with toolless snap-fit steel frame, built-in 19-inch equipment rack, and contoured handrail.',
        description: `The Model D is a premium modular workstation designed to provide flexibility, durability, and convenience in modern office and control room environments. It features an innovative screw-free snap-fit frame that allows quick, easy, and flexible assembly without conventional screws.

Key Features:
• Innovative screw-free snap-fit frame enabling quick, toolless assembly
• Integrated black rubber handrail contoured along the front edge of the worktop
• Built-in slide-out keyboard drawer, 19-inch equipment rack, and dedicated CPU utility tray
• 200 mm high aluminum screen panel supporting diverse monitor mounting configurations
• Dual integrated high-capacity power raceways and rear service panels`,
        price: 140000,
        is_call_for_price: 0,
        main_image: '/images/products/02-model-d-modular-executive-workstation.jpg',
        gallery_images: JSON.stringify([
          '/images/products/01-model-h-modular-executive-workstation.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 2,
      },
      {
        category_slug: 'conference-boardroom',
        name: 'U-Shaped Modular Conference Console',
        slug: 'u-shaped-modular-conference-console',
        short_description:
          'Custom 12–30+ delegate U-shaped conference suite with panoramic sightlines, recessed microphone/power ports, and contour LED lighting.',
        description: `The U-Shaped Modular Conference Console is designed for professional meeting rooms, command centers, and collaborative working environments. Its spacious layout provides comfortable seating for multiple users while maintaining clear communication and visibility among participants.

Key Features:
• Spacious U-shaped layout providing comfortable seating for 12 to 30+ delegates
• Integrated central structure for audio-visual equipment placement and invisible wire routing
• Combination of smooth architectural work surfaces, durable structural panels, and contour LED lighting
• Tabletop recesses for conference delegate microphones, translation ports, and pop-up power modules
• Custom CAD scaled in our Khilkhet manufacturing facility to fit your exact boardroom footprint`,
        price: null,
        is_call_for_price: 1,
        main_image: '/images/products/07-u-shaped-modular-conference-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/08-extended-modular-control-conference-console.jpg',
          '/images/products/10-large-rectangular-conference-table.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 1,
      },
      {
        category_slug: 'conference-boardroom',
        name: 'Extended Modular Control & Conference Console',
        slug: 'extended-modular-control-conference-console',
        short_description:
          'Expandable multi-segment command and conference table for 10–24 delegates with full-span display rails and hidden power conduits.',
        description: `The Extended Modular Control & Conference Console is designed for large-scale operational environments that require multiple workstations and coordinated team activities. Its extended modular structure combines individual operator stations into a continuous workspace.

Key Features:
• Extended modular structure combining individual stations into a continuous command workspace
• Supports comprehensive monitor installation, equipment integration, and high-capacity cable routing
• Integrated modern technological LED accent strips
• Flexible straight, curved, and extended arrangements tailored to available room geometry
• Accessible service hatches along the console for rapid equipment installation`,
        price: null,
        is_call_for_price: 1,
        main_image: '/images/products/08-extended-modular-control-conference-console.jpg',
        gallery_images: JSON.stringify([
          '/images/products/07-u-shaped-modular-conference-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 2,
      },
      {
        category_slug: 'conference-boardroom',
        name: 'Large Rectangular Conference Table',
        slug: 'large-rectangular-conference-table',
        short_description:
          'Up to 24ft custom-span executive boardroom table crafted with architectural timber veneer, internal steel truss, and flush connectivity hubs.',
        description: `The Large Rectangular Conference Table is designed to accommodate 14 to 28+ participants in corporate meeting rooms, boardrooms, and collaborative workspaces. Its streamlined structure and clean surface design create a modern, authoritative presence.

Key Features:
• Expansive tabletop providing generous workspace for executive meetings and presentations
• Reinforced internal steel truss backbone preventing any center deflection across long spans
• Integrated concealed wire management routing through hollow pedestal support columns
• Flush pop-up connectivity hubs supporting HDMI, USB-C, power, and gigabit network ports
• Soft-touch beveled solid hardwood perimeter edges for sustained forearm comfort`,
        price: 245000,
        is_call_for_price: 0,
        main_image: '/images/products/10-large-rectangular-conference-table.jpg',
        gallery_images: JSON.stringify([
          '/images/products/07-u-shaped-modular-conference-console.jpg',
        ]),
        video_type: 'none',
        video_url: '',
        display_order: 3,
      },
    ];

    for (const prod of products) {
      const catId = categoryMap[prod.category_slug] || null;
      await pool.execute(
        `INSERT INTO products (
          category_id, name, slug, short_description, description,
          price, is_call_for_price, main_image, gallery_images,
          video_type, video_url, status, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
        [
          catId,
          prod.name,
          prod.slug,
          prod.short_description,
          prod.description,
          prod.price,
          prod.is_call_for_price,
          prod.main_image,
          prod.gallery_images,
          prod.video_type,
          prod.video_url,
          prod.display_order,
        ]
      );
    }
  } catch (err) {
    console.error('Error seeding initial eCommerce data:', err);
  }
}

