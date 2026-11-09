import pool from './db';

let initialized = false;

export async function ensureCareerTables() {
  if (initialized) return;

  try {
    // 1. jobs table (title, position, slug, job_type, details, deadline, is_active)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        position VARCHAR(255) NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        job_type ENUM('Full-Time', 'Part-Time', 'Internship', 'Contractual') NOT NULL DEFAULT 'Full-Time',
        details LONGTEXT NOT NULL,
        deadline DATE NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe migration: Add position column to jobs if missing
    try {
      const [cols]: any = await pool.execute(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jobs' AND COLUMN_NAME = 'position'
      `);
      if (!cols || cols.length === 0) {
        await pool.execute('ALTER TABLE jobs ADD COLUMN position VARCHAR(255) NULL AFTER title');
      }
    } catch {
      // Ignore if column already exists
    }

    // 2. job_positions table (Managed list of positions / designations)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS job_positions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed default standard positions if empty
    try {
      const [posRows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM job_positions');
      if (posRows && posRows[0] && posRows[0].cnt === 0) {
        const defaultPositions = [
          'Control Room Interior Architect',
          'Console Ergonomics & 3D CAD Designer',
          'Senior Interior Project Execution Engineer',
          'CNC Machine & Steel Fabrication Specialist',
          'Electrical & Integrated Wiring Engineer',
          'Commercial Space Interior Designer',
          'Site Operations & Quality Assurance Supervisor',
          'Turnkey Project Coordinator',
        ];
        for (const pos of defaultPositions) {
          await pool.execute('INSERT IGNORE INTO job_positions (name) VALUES (?)', [pos]);
        }
      }
    } catch {
      // Ignore seed error
    }

    // 3. job_applications table (Exact required application fields + position)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id INT NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        position VARCHAR(255) NULL,
        photo_url VARCHAR(500) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        current_address TEXT NOT NULL,
        highest_qualification VARCHAR(255) NOT NULL,
        institution VARCHAR(255) NOT NULL,
        experience_years VARCHAR(50) NOT NULL,
        cv_url VARCHAR(500) NOT NULL,
        why_join TEXT NOT NULL,
        status ENUM('new', 'reviewing', 'shortlisted', 'rejected', 'hired') DEFAULT 'new',
        admin_notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_job_id (job_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe migration: Add position column to job_applications if missing
    try {
      const [appCols]: any = await pool.execute(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_applications' AND COLUMN_NAME = 'position'
      `);
      if (!appCols || appCols.length === 0) {
        await pool.execute('ALTER TABLE job_applications ADD COLUMN position VARCHAR(255) NULL AFTER job_title');
      }
    } catch {
      // Ignore if column already exists
    }

    // 4. Seed initial job postings if empty
    const [rows]: any = await pool.execute('SELECT COUNT(*) as cnt FROM jobs');
    if (rows && rows[0] && rows[0].cnt === 0) {
      await pool.execute(
        `INSERT INTO jobs (title, position, slug, job_type, details, deadline, is_active)
         VALUES (?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 1)`,
        [
          'Lead CAD & 3D Visualization Designer',
          'Console Ergonomics & 3D CAD Designer',
          'control-room-console-cad-designer',
          'Full-Time',
          `<h2>Role Overview</h2>
<p>We are seeking a talented and detail-oriented CAD &amp; 3D Visualization Designer to join our engineering and interior team at our Khilkhet facility. You will design next-generation mission-critical control room console tables, command workstations, and turnkey monitoring room layouts.</p>

<h3>Key Responsibilities</h3>
<ul>
  <li>Develop precision millimeter-scale 2D drafting and 3D architectural models for control consoles using AutoCAD and SketchUp.</li>
  <li>Produce high-fidelity photorealistic renders for government and enterprise control room proposals.</li>
  <li>Coordinate with our in-house steel fabrication and woodworking workshop to prepare accurate manufacturing cut lists and assembly plans.</li>
  <li>Integrate cable management conduits, monitor arm tracks, and thermal ventilation airflow channels into product designs.</li>
</ul>

<h3>Qualifications &amp; Requirements</h3>
<ul>
  <li>Diploma or Bachelor's in Architecture, Mechanical Engineering, Interior Design, or related discipline.</li>
  <li>Strong proficiency in AutoCAD, SketchUp, Lumion / V-Ray, and Photoshop.</li>
  <li>Sound understanding of ergonomic standards and modular furniture fabrication.</li>
  <li>Strong communication and team-collaboration skills.</li>
</ul>`,
        ]
      );

      await pool.execute(
        `INSERT INTO jobs (title, position, slug, job_type, details, deadline, is_active)
         VALUES (?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 45 DAY), 1)`,
        [
          'Senior Turnkey Project Execution Engineer',
          'Senior Interior Project Execution Engineer',
          'senior-interior-project-execution-engineer',
          'Full-Time',
          `<h2>Role Overview</h2>
<p>DOER is looking for an experienced Interior Project Execution Engineer to supervise turnkey site fit-outs, command centers, and corporate interiors across Bangladesh.</p>

<h3>Key Responsibilities</h3>
<ul>
  <li>Oversee on-site execution including civil works, electrical power routing, acoustic wall paneling, and technical ceiling integration.</li>
  <li>Supervise multidisciplinary site teams (electricians, joinery craftsmen, glass fabricators) to ensure uncompromising quality standards.</li>
  <li>Maintain project milestone schedules, material requisitions, and client site coordination.</li>
  <li>Ensure strict compliance with occupational safety and quality assurance protocols.</li>
</ul>

<h3>Qualifications &amp; Requirements</h3>
<ul>
  <li>B.Sc or Diploma in Civil Engineering / Architecture with minimum 2-3 years site management experience.</li>
  <li>Hands-on knowledge of commercial space MEP, modular joinery, and architectural finishes.</li>
  <li>Proactive leadership and problem-solving capability under critical timelines.</li>
</ul>`,
        ]
      );
    }

    initialized = true;
  } catch (error) {
    console.error('Error initializing career tables:', error);
  }
}
