import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Automatically load .env.local or .env when running via `node scripts/init-db.mjs` on VPS
function loadEnvFile() {
  const candidates = ['.env.local', '.env'];
  for (const fileName of candidates) {
    const fullPath = path.resolve(process.cwd(), fileName);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (process.env[key] === undefined) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile();

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'doer-furniture';

const ADMIN_USER = process.env.ADMIN_DEFAULT_USER || 'doer-admin';
const ADMIN_PASS = process.env.ADMIN_DEFAULT_PASS || 'V2gU*k)v7v8drHIsvT';

/**
 * Helper for safe live-server schema migrations:
 * Ensures a column exists on an existing table without dropping data.
 */
async function ensureColumn(db, tableName, columnName, columnDef) {
  const [cols] = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [DB_NAME, tableName, columnName]
  );
  if (cols.length === 0) {
    await db.query(`ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${columnDef}`);
    console.log(`Added missing column \`${columnName}\` to \`${tableName}\`.`);
  }
}

async function init() {
  console.log(`Connecting to MySQL at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);

  // 1. Ensure database exists
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  console.log(`Database \`${DB_NAME}\` verified.`);
  await connection.end();

  // 2. Connect to the target database
  const db = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  // 3. Create admins table
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) DEFAULT 'Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('Admins table ready.');

  // 4. Create inquiries table
  await db.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(150) NOT NULL,
      company_name VARCHAR(150) DEFAULT NULL,
      email VARCHAR(150) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      service_interested VARCHAR(100) NOT NULL,
      project_location VARCHAR(150) DEFAULT NULL,
      project_details TEXT NOT NULL,
      status ENUM('new', 'contacted', 'in_progress', 'completed') DEFAULT 'new',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('Inquiries table ready.');

  // 5. Create product_categories table (eCommerce)
  await db.query(`
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
  console.log('Product Categories table ready.');

  // 6. Create products table (eCommerce)
  await db.query(`
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
  console.log('Products table ready.');

  // 7. Create orders table (eCommerce)
  await db.query(`
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
  console.log('Orders table ready.');

  // 8. Seed / Verify Admin User
  const [adminRows] = await db.query('SELECT * FROM admins WHERE username = ?', [ADMIN_USER]);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(ADMIN_PASS, salt);

  if (adminRows.length === 0) {
    await db.query(
      'INSERT INTO admins (username, password_hash, name) VALUES (?, ?, ?)',
      [ADMIN_USER, hash, 'DOER Administrator']
    );
    console.log(`Admin user "${ADMIN_USER}" created successfully.`);
  } else {
    await db.query(
      'UPDATE admins SET password_hash = ? WHERE username = ?',
      [hash, ADMIN_USER]
    );
    console.log(`Admin user "${ADMIN_USER}" credentials verified.`);
  }

  // 9. Seed Initial Inquiries if empty
  const [inquiryCount] = await db.query('SELECT COUNT(*) as count FROM inquiries');
  if (inquiryCount[0].count === 0) {
    await db.query(`
      INSERT INTO inquiries (full_name, company_name, email, phone, service_interested, project_location, project_details, status)
      VALUES 
      ('Mohammad Rahman', 'Apex Innovations Ltd.', 'm.rahman@apexinno.com', '01711223344', 'Corporate Office Interior', 'Gulshan-2, Dhaka', 'Full turnkey interior design and 25-workstation fabrication for our new 3,500 sqft floor.', 'new'),
      ('Nusrat Jahan', 'Bistro Cafe & Deli', 'nusrat@bistrodeli.com', '01819876543', 'Commercial Space Design', 'Dhanmondi 27, Dhaka', 'Aesthetic café layout with custom wooden furniture, decorative steel elements, and lighting.', 'contacted'),
      ('Tanvir Ahmed', 'Skyline Holdings', 'tanvir@skylinebd.net', '01912345678', 'Furniture Customization & Fabrication', 'Uttara Sector 3, Dhaka', 'Looking for custom conference table (20-seater) with integrated cable management and executive desks.', 'in_progress')
    `);
    console.log('Initial demo inquiries seeded.');
  }

  // 10. Seed Initial eCommerce Categories & Products if empty
  const [catCount] = await db.query('SELECT COUNT(*) as count FROM product_categories');
  if (catCount[0].count === 0) {
    console.log('Seeding initial eCommerce categories and products...');
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

    const categoryMap = {};
    for (const cat of categories) {
      const [res] = await db.query(
        'INSERT INTO product_categories (name, slug, description, display_order, is_active) VALUES (?, ?, ?, ?, 1)',
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
• Flexible modular customization according to site dimensions, radians, and multi-operator layouts`,
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
• Reinforced 1.5mm cold-rolled steel internal chassis supporting heavy-duty multi-operator loads`,
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
        description: `The HG-A2 Modular Smart Control Console combines elegant design, practical storage, and advanced functionality to create an efficient and comfortable working environment. Special attention has been given to cable management and heat dissipation to support the smooth 24/7 operation of electronic equipment.`,
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
        description: `The HG-A1 Modular Smart Control Console is a modern, ergonomically designed workstation that combines advanced technology, stylish aesthetics, and practical functionality. Featuring a sleek ice-blue lighting design and a premium full-metal exterior, it offers a distinctive and professional appearance for modern control rooms.`,
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
        description: `The HG-B4 Multi-Position Modular Control Console is designed for large-scale control rooms that require flexible workstation arrangements and efficient space utilization. Its modular structure allows multiple workstation units to be combined freely, making it suitable for different team sizes and operational layouts.`,
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
        description: `The Model H is a premium modular workstation designed with a modern appearance, durable construction, and practical functionality. It features a quick-assembly frame with a snap-and-screw system ensuring easy, secure installation and flexible configurations to meet diverse workspace and control room requirements.`,
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
        description: `The Model D is a premium modular workstation designed to provide flexibility, durability, and convenience in modern office and control room environments. It features an innovative screw-free snap-fit frame that allows quick, easy, and flexible assembly without conventional screws.`,
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
        description: `The U-Shaped Modular Conference Console is designed for professional meeting rooms, command centers, and collaborative working environments. Its spacious layout provides comfortable seating for multiple users while maintaining clear communication and visibility among participants.`,
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
        description: `The Extended Modular Control & Conference Console is designed for large-scale operational environments that require multiple workstations and coordinated team activities. Its extended modular structure combines individual operator stations into a continuous workspace.`,
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
        description: `The Large Rectangular Conference Table is designed to accommodate 14 to 28+ participants in corporate meeting rooms, boardrooms, and collaborative workspaces. Its streamlined structure and clean surface design create a modern, authoritative presence.`,
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
      await db.query(
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
    console.log('Seeded 3 categories and 10 products into MySQL.');
  } else {
    console.log(`Product categories already exist (${catCount[0].count} categories). Skipping seed.`);
  }

  // 11. Ensure VPS local upload directories exist with proper read/write permissions
  const uploadDirs = [
    path.join(process.cwd(), 'public', 'uploads', 'products'),
    path.join(process.cwd(), 'public', 'uploads', 'videos'),
    path.join(process.cwd(), 'uploads', 'products'),
    path.join(process.cwd(), 'uploads', 'videos'),
  ];
  for (const dir of uploadDirs) {
    try {
      fs.mkdirSync(dir, { recursive: true, mode: 0o775 });
    } catch {
      // Ignore permission warning if already exists
    }
  }
  console.log('VPS local upload directories verified.');

  // 12. Normalize any existing `/uploads/` URLs in products/orders to `/api/uploads/` for Next.js production
  await db.query(`
    UPDATE products
    SET main_image = REPLACE(main_image, '/uploads/', '/api/uploads/')
    WHERE main_image LIKE '/uploads/%'
  `);
  await db.query(`
    UPDATE products
    SET gallery_images = REPLACE(gallery_images, '"/uploads/', '"/api/uploads/')
    WHERE gallery_images LIKE '%"/uploads/%'
  `);
  await db.query(`
    UPDATE products
    SET video_url = REPLACE(video_url, '/uploads/', '/api/uploads/')
    WHERE video_url LIKE '/uploads/%'
  `);
  await db.query(`
    UPDATE orders
    SET product_image = REPLACE(product_image, '/uploads/', '/api/uploads/')
    WHERE product_image LIKE '/uploads/%'
  `);
  console.log('Existing uploaded media URLs normalized for production.');

  await db.end();
  console.log('All database tables and migrations completed successfully!');
}

init().catch((err) => {
  console.error('Failed to initialize/migrate database:', err);
  process.exit(1);
});
