import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureHeroSlidesTable } from '@/lib/frontend-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureHeroSlidesTable();

    const [rows]: any = await pool.execute(
      `SELECT 
        id,
        tag,
        title_light AS titleLight,
        title_highlight AS titleHighlight,
        description,
        image,
        primary_btn_text AS primaryBtnText,
        primary_btn_href AS primaryBtnHref,
        secondary_btn_text AS secondaryBtnText,
        secondary_btn_href AS secondaryBtnHref,
        display_order AS displayOrder,
        is_active AS isActive
      FROM hero_slides
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC`
    );

    return NextResponse.json({
      success: true,
      slides: rows || [],
    });
  } catch (error: any) {
    console.error('Error fetching public hero slides:', error);
    // Return empty array on failure so client fallback can activate
    return NextResponse.json(
      { error: 'Failed to fetch slides', slides: [] },
      { status: 500 }
    );
  }
}

