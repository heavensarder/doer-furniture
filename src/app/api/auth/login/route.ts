import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUsername = body.username ?? '';
    const rawPassword = body.password ?? '';

    const username = String(rawUsername).trim();
    const password = String(rawPassword);
    const passwordTrimmed = password.trim();

    console.log(`[LOGIN ATTEMPT] Received username: "${username}"`);

    if (!username || !passwordTrimmed) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Query MySQL database for admin user
    const [rows]: any = await pool.execute(
      'SELECT id, username, password_hash, name FROM admins WHERE username = ? LIMIT 1',
      [username]
    );

    if (!rows || rows.length === 0) {
      console.warn(`[LOGIN FAILED] User not found in MySQL: "${username}"`);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const admin = rows[0];

    // Check both exact password and trimmed password against stored hash
    const matchExact = await bcrypt.compare(password, admin.password_hash);
    const matchTrimmed = await bcrypt.compare(passwordTrimmed, admin.password_hash);
    const isPasswordValid = matchExact || matchTrimmed;

    if (!isPasswordValid) {
      console.warn(`[LOGIN FAILED] Password mismatch for user: "${username}"`);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log(`[LOGIN SUCCESS] Admin authenticated via MySQL: "${username}"`);

    const adminUser = {
      id: admin.id,
      username: admin.username,
      name: admin.name || 'DOER Administrator',
    };

    // Generate JWT token
    const token = signToken(adminUser);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: adminUser,
    });

    // Determine if request is over HTTPS
    const isHttps = request.url.startsWith('https://');

    // Set HTTP-only cookie.
    // IMPORTANT: On http://localhost, secure must be FALSE or browsers will discard it.
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Database login verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed due to database error' },
      { status: 500 }
    );
  }
}
