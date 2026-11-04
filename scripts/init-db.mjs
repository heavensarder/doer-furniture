import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'doer-furniture';

const ADMIN_USER = process.env.ADMIN_DEFAULT_USER || 'doer-admin';
const ADMIN_PASS = process.env.ADMIN_DEFAULT_PASS || 'V2gU*k)v7v8drHIsvT';

async function init() {
  console.log(`Connecting to MySQL at ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);
  
  // First ensure database exists
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  console.log(`Database \`${DB_NAME}\` verified.`);
  await connection.end();

  // Connect to the specific database
  const db = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  // Create admins table
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) DEFAULT 'Admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Admins table ready.');

  // Create inquiries table
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('Inquiries table ready.');

  // Check / seed admin
  const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [ADMIN_USER]);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(ADMIN_PASS, salt);

  if (rows.length === 0) {
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
    console.log(`Admin user "${ADMIN_USER}" credentials updated/verified.`);
  }

  // Insert demo initial inquiries if empty so dashboard looks populated
  const [inquiryCount] = await db.query('SELECT COUNT(*) as count FROM inquiries');
  if (inquiryCount[0].count === 0) {
    await db.query(`
      INSERT INTO inquiries (full_name, company_name, email, phone, service_interested, project_location, project_details, status)
      VALUES 
      ('Mohammad Rahman', 'Apex Innovations Ltd.', 'm.rahman@apexinno.com', '01711223344', 'Corporate Office Interior', 'Gulshan-2, Dhaka', 'Full turnkey interior design and 25-workstation fabrication for our new 3,500 sqft floor.', 'new'),
      ('Nusrat Jahan', 'Bistro Cafe & Deli', 'nusrat@bistrodeli.com', '01819876543', 'Commercial Space Design', 'Dhanmondi 27, Dhaka', 'Aesthetic café layout with custom wooden furniture, decorative steel elements, and lighting.', 'contacted'),
      ('Tanvir Ahmed', 'Skyline Holdings', 'tanvir@skylinebd.net', '01912345678', 'Furniture Customization & Fabrication', 'Uttara Sector 3, Dhaka', 'Looking for custom conference table (20-seater) with integrated cable management and executive desks.', 'in_progress')
    `);
    console.log('Demo inquiries inserted for admin dashboard preview.');
  }

  await db.end();
  console.log('Database initialization complete!');
}

init().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

