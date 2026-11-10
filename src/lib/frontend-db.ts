import pool from './db';

let heroInitialized = false;
let categorySectionsInitialized = false;

export async function ensureHeroSlidesTable() {
  if (heroInitialized) return;

  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tag VARCHAR(255) NOT NULL,
        title_light VARCHAR(255) NOT NULL,
        title_highlight VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(500) NOT NULL,
        primary_btn_text VARCHAR(100) NOT NULL DEFAULT 'Explore Console Tables',
        primary_btn_href VARCHAR(255) NOT NULL DEFAULT '/products',
        secondary_btn_text VARCHAR(100) NOT NULL DEFAULT 'Design Your Control Room',
        secondary_btn_href VARCHAR(255) NOT NULL DEFAULT '/contact',
        display_order INT NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if table is empty. If so, seed with the existing 2 production slides
    const [rows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM hero_slides');
    if (rows && rows[0] && rows[0].cnt === 0) {
      await pool.execute(
        `INSERT INTO hero_slides (
          tag, title_light, title_highlight, description, image,
          primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href,
          display_order, is_active
        ) VALUES 
        (
          'Command Center Consoles • Turnkey Control Room Fit-Out',
          'Smart Console Tables &',
          'Control Room Design.',
          'DOER manufactures mission-critical command consoles, ergonomic modular workstations, and complete control room interiors. Custom-engineered in our in-house Khilkhet workshop with heavy-duty steel chassis, multi-monitor arrays, and smart cable management.',
          '/images/hero-slider-one.jpg',
          'Explore Console Tables',
          '/products',
          'Design Your Control Room',
          '/contact',
          1,
          1
        ),
        (
          'Architectural Materials • Patinas & Surface Textures',
          'Architectural Patinas &',
          'Surface Textures.',
          'A premium decorative material collection combining artistic textures with sophisticated metallic and mineral finishes. Engineered for stylish partitions, feature walls, decorative panels, and statement luxury interiors.',
          '/images/hero-slider-two.jpg',
          'Explore Materials',
          '#materials',
          'Request Sample Kit',
          '/contact?subject=Inquiry%20for%20Architectural%20Materials',
          2,
          1
        )`
      );
    }

    heroInitialized = true;
  } catch (error) {
    console.error('Error ensuring hero_slides table:', error);
  }
}

export async function ensureHomeCategorySectionsTable() {
  if (categorySectionsInitialized) return;

  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS home_category_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        badge VARCHAR(255) NOT NULL DEFAULT 'Featured Product Category',
        title_prefix VARCHAR(255) NOT NULL DEFAULT 'High-Performance',
        title_highlight VARCHAR(255) NOT NULL DEFAULT 'Console Tables',
        title_suffix VARCHAR(255) NULL DEFAULT '& Command Workstations',
        subtitle TEXT NULL,
        category_id INT NOT NULL,
        explore_button_text VARCHAR(255) NOT NULL DEFAULT 'Explore All Console Tables',
        display_order INT NOT NULL DEFAULT 1,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_active (is_active),
        INDEX idx_order (display_order),
        INDEX idx_category (category_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if table is empty. If so, seed with the existing Console Tables category section
    const [rows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM home_category_sections');
    if (rows && rows[0] && rows[0].cnt === 0) {
      // Find category ID for Control Room Consoles or first available category
      const [cats]: any = await pool.execute(
        "SELECT id FROM product_categories WHERE slug = 'control-room-consoles' OR name LIKE '%Console%' LIMIT 1"
      );
      const defaultCatId = cats && cats[0] ? cats[0].id : 2;

      await pool.execute(
        `INSERT INTO home_category_sections (
          badge, title_prefix, title_highlight, title_suffix, subtitle, category_id, explore_button_text, display_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Featured Product Category',
          'High-Performance',
          'Console Tables',
          '& Command Workstations',
          'Heavy-duty 24/7 mission-critical console tables, multi-monitor command desks, and modular control stations manufactured under one roof at our Khilkhet facility.',
          defaultCatId,
          'Explore All Console Tables',
          1,
          1,
        ]
      );
    }

    categorySectionsInitialized = true;
  } catch (error) {
    console.error('Error ensuring home_category_sections table:', error);
  }
}
