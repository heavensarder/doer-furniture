import pool from './db';

let initialized = false;

export async function ensureSeoTables() {
  if (initialized) return;

  try {
    // 1. seo_settings table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        site_name VARCHAR(255) NOT NULL DEFAULT 'DOER',
        title_template VARCHAR(255) NOT NULL DEFAULT '%s | DOER – Console Tables & Control Room Interior',
        default_meta_title VARCHAR(255) NOT NULL,
        default_meta_description TEXT NOT NULL,
        default_keywords TEXT NULL,
        canonical_base_url VARCHAR(255) NOT NULL DEFAULT 'http://doerbd.com',
        default_og_image VARCHAR(500) NULL,
        twitter_card_type VARCHAR(50) NOT NULL DEFAULT 'summary_large_image',
        twitter_handle VARCHAR(100) NULL,
        google_site_verification VARCHAR(255) NULL,
        bing_site_verification VARCHAR(255) NULL,
        robots_default_index TINYINT(1) NOT NULL DEFAULT 1,
        robots_default_follow TINYINT(1) NOT NULL DEFAULT 1,
        robots_custom_directives TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. seo_pages table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS seo_pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_path VARCHAR(255) NOT NULL UNIQUE,
        page_name VARCHAR(255) NOT NULL,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        focus_keywords TEXT NULL,
        canonical_url VARCHAR(500) NULL,
        robots_index TINYINT(1) NOT NULL DEFAULT 1,
        robots_follow TINYINT(1) NOT NULL DEFAULT 1,
        og_title VARCHAR(255) NULL,
        og_description TEXT NULL,
        og_image VARCHAR(500) NULL,
        twitter_title VARCHAR(255) NULL,
        twitter_description TEXT NULL,
        twitter_image VARCHAR(500) NULL,
        custom_schema LONGTEXT NULL,
        sitemap_changefreq VARCHAR(20) NOT NULL DEFAULT 'weekly',
        sitemap_priority DECIMAL(2,1) NOT NULL DEFAULT 0.8,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_page_path (page_path)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Alter products table to ensure all SEO columns exist
    const columnsToAdd = [
      { name: 'meta_title', definition: 'VARCHAR(255) NULL' },
      { name: 'meta_description', definition: 'TEXT NULL' },
      { name: 'focus_keywords', definition: 'TEXT NULL' },
      { name: 'canonical_url', definition: 'VARCHAR(500) NULL' },
      { name: 'og_image', definition: 'VARCHAR(500) NULL' },
      { name: 'sku', definition: 'VARCHAR(100) NULL' },
      { name: 'mpn', definition: 'VARCHAR(100) NULL' },
      { name: 'schema_rating_value', definition: 'DECIMAL(3,2) NOT NULL DEFAULT 4.90' },
      { name: 'schema_review_count', definition: 'INT NOT NULL DEFAULT 28' },
      { name: 'robots_index', definition: 'TINYINT(1) NOT NULL DEFAULT 1' },
    ];

    for (const col of columnsToAdd) {
      try {
        await pool.execute(`ALTER TABLE products ADD COLUMN ${col.name} ${col.definition}`);
      } catch (err: any) {
        // Error code 1060: Duplicate column name (already exists)
        if (err.errno !== 1060 && !String(err.message).includes('Duplicate column')) {
          console.warn(`Note on adding column ${col.name}:`, err.message);
        }
      }
    }

    // 4. Seed default global settings if empty
    const [settingsRows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM seo_settings');
    if (!settingsRows || settingsRows[0]?.cnt === 0) {
      await pool.execute(
        `INSERT INTO seo_settings (
          site_name,
          title_template,
          default_meta_title,
          default_meta_description,
          default_keywords,
          canonical_base_url,
          default_og_image,
          twitter_card_type,
          twitter_handle,
          robots_default_index,
          robots_default_follow
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'DOER',
          '%s | DOER – Console Tables & Control Room Interior',
          'DOER – High-End Console Tables, Control Room Interior & Metal Art Supply',
          'DOER manufactures 24/7 mission-critical console tables, turnkey control room interiors, and signature Water Bubble Stainless Steel metal art in Khilkhet, Dhaka.',
          'console tables, control room interior, metal art supply, command center consoles, 24/7 operator desks, water bubble stainless steel, ergonomic workstations bangladesh',
          'http://doerbd.com',
          '/images/introduction-image.png',
          'summary_large_image',
          '@doerbd',
          1,
          1,
        ]
      );
    }

    // 5. Seed default page metadata focused on Console Tables, Control Room Interior, and Metal Art Supply
    const defaultPages = [
      {
        path: '/',
        name: 'Home Page',
        title: 'DOER – High-Performance Console Tables, Control Room Interior & Metal Art Supply',
        desc: 'DOER manufactures mission-critical command console tables, turnkey control room interiors, and architectural water bubble stainless steel metal art in Khilkhet, Dhaka.',
        keywords: 'console tables, control room interior, metal art supply, command consoles, 24/7 operator desks, water bubble stainless steel, control room design bangladesh, ergonomic modular workstations',
        canonical: 'http://doerbd.com/',
        ogImage: '/images/introduction-image.png',
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        path: '/products',
        name: 'Console Tables & Products Catalog',
        title: 'Console Tables & Ergonomic Command Workstations Catalog | DOER',
        desc: 'Explore precision-engineered modular console tables, multi-screen operator command desks, and motorized workstations with 24/7 heavy-duty chassis.',
        keywords: 'console tables bangladesh, control room desks, command center furniture, multi-monitor console, modular workstations, operator desks',
        canonical: 'http://doerbd.com/products',
        ogImage: '/images/products/04-hg-b1-executive-modular-control-console.jpg',
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        path: '/services',
        name: 'Control Room Interior & Fit-Out Services',
        title: 'Control Room Interior Design & Turnkey Fit-Out Solutions | DOER',
        desc: 'Complete turnkey control room interior solutions in Bangladesh: spatial planning, command console fabrication, video wall mounts, raised flooring, and acoustic wall cladding.',
        keywords: 'control room interior, turnkey control room fitout, command center design, video wall mounting, acoustic cladding dhaka, control room setup',
        canonical: 'http://doerbd.com/services',
        ogImage: '/images/services/controlroom-servicej.jpg',
        changefreq: 'weekly',
        priority: 0.85,
      },
      {
        path: '/workshop',
        name: 'Factory & Metal Art Supply',
        title: 'In-House Factory, Metal Art Supply & Precision Machinery | DOER',
        desc: 'Visit our Khilkhet Dhaka factory. Direct supplier of Water Bubble Stainless Steel sheets, architectural metal art, CNC precision cutting, and timber joinery.',
        keywords: 'metal art supply, water bubble stainless steel, architectural metalwork dhaka, cnc routing, industrial joinery, sheet metal fabrication, luxury brass trims',
        canonical: 'http://doerbd.com/workshop',
        ogImage: '/images/workshop/metal-section.jpg',
        changefreq: 'weekly',
        priority: 0.85,
      },
      {
        path: '/projects',
        name: 'Our Projects Portfolio',
        title: 'Control Room Interiors & Commercial Architecture Projects | DOER',
        desc: 'Explore delivered mission-critical control room interiors, executive console table setups, and luxury interior fit-outs engineered by DOER in Bangladesh.',
        keywords: 'control room projects, command center installation, interior execution dhaka, commercial space design portfolio',
        canonical: 'http://doerbd.com/projects',
        ogImage: '/images/projects/walton-showroom-1.jpg',
        changefreq: 'weekly',
        priority: 0.8,
      },
      {
        path: '/about',
        name: 'About DOER',
        title: 'About DOER – Leader in Console Tables, Control Room Interiors & Metal Fabrication',
        desc: 'DOER operates an integrated manufacturing factory in Khilkhet, Dhaka with 33+ permanent craftsmen delivering zero-subcontracting control rooms and metal art.',
        keywords: 'about doer, control room furniture manufacturer, interior design company dhaka, console desk factory',
        canonical: 'http://doerbd.com/about',
        ogImage: '/images/introduction-image.png',
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        path: '/contact',
        name: 'Contact & Layout Request',
        title: 'Contact DOER – Request Console Table & Control Room Interior Layout',
        desc: 'Connect with our control room engineers. Request bespoke console table dimensional drawings or architectural metal art samples. Hotline: +8801976535654.',
        keywords: 'contact doer, control room quote, console table manufacturer contact, khilkhet workshop visit, custom console dimensions',
        canonical: 'http://doerbd.com/contact',
        ogImage: '/images/introduction-image.png',
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        path: '/career',
        name: 'Careers & Opportunities',
        title: 'Careers at DOER – Join Our Engineering & Interior Craft Team',
        desc: 'Build mission-critical control rooms and architectural metal art. View career openings for project engineers, draftsmen, and CNC technicians at DOER Dhaka.',
        keywords: 'doer careers, interior engineering jobs dhaka, furniture manufacturing careers',
        canonical: 'http://doerbd.com/career',
        ogImage: '/images/introduction-image.png',
        changefreq: 'monthly',
        priority: 0.6,
      },
    ];

    for (const page of defaultPages) {
      const [existing]: any = await pool.execute('SELECT id FROM seo_pages WHERE page_path = ?', [page.path]);
      if (!existing || existing.length === 0) {
        await pool.execute(
          `INSERT INTO seo_pages (
            page_path, page_name, meta_title, meta_description, focus_keywords, canonical_url,
            og_title, og_description, og_image, sitemap_changefreq, sitemap_priority
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            page.path,
            page.name,
            page.title,
            page.desc,
            page.keywords,
            page.canonical,
            page.title,
            page.desc,
            page.ogImage,
            page.changefreq,
            page.priority,
          ]
        );
      }
    }

    initialized = true;
  } catch (error) {
    console.error('Error ensuring SEO tables:', error);
    throw error;
  }
}

