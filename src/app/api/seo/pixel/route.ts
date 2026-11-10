import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureSeoTables } from '@/lib/seo-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureSeoTables();
    const [rows]: any = await pool.execute('SELECT facebook_pixel_id FROM seo_settings LIMIT 1');
    const pixelId =
      (rows && rows[0] && rows[0].facebook_pixel_id) ||
      process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
      '';
    return NextResponse.json({ pixelId: String(pixelId).trim() });
  } catch {
    return NextResponse.json({ pixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '' });
  }
}

