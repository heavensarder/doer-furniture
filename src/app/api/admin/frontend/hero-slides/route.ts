import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureHeroSlidesTable } from '@/lib/frontend-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        is_active AS isActive,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM hero_slides
      ORDER BY display_order ASC, id ASC`
    );

    return NextResponse.json({
      success: true,
      slides: rows || [],
    });
  } catch (error: any) {
    console.error('Error fetching admin hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureHeroSlidesTable();
    const body = await request.json();

    const tag = String(body.tag || '').trim();
    const titleLight = String(body.titleLight || '').trim();
    const titleHighlight = String(body.titleHighlight || '').trim();
    const description = String(body.description || '').trim();
    const image = String(body.image || '').trim();
    const primaryBtnText = String(body.primaryBtnText || 'Explore Console Tables').trim();
    const primaryBtnHref = String(body.primaryBtnHref || '/products').trim();
    const secondaryBtnText = String(body.secondaryBtnText || 'Design Your Control Room').trim();
    const secondaryBtnHref = String(body.secondaryBtnHref || '/contact').trim();
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1;

    if (!titleLight && !titleHighlight) {
      return NextResponse.json(
        { error: 'Slide title is required (either white bold or glowing highlight text).' },
        { status: 400 }
      );
    }
    if (!image) {
      return NextResponse.json({ error: 'Background image is required.' }, { status: 400 });
    }

    // Determine highest display order
    const [orderRow]: any = await pool.execute('SELECT MAX(display_order) as maxOrder FROM hero_slides');
    const nextOrder = (orderRow && orderRow[0] && orderRow[0].maxOrder ? orderRow[0].maxOrder : 0) + 1;

    const [result]: any = await pool.execute(
      `INSERT INTO hero_slides (
        tag, title_light, title_highlight, description, image,
        primary_btn_text, primary_btn_href, secondary_btn_text, secondary_btn_href,
        display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tag,
        titleLight,
        titleHighlight,
        description,
        image,
        primaryBtnText,
        primaryBtnHref,
        secondaryBtnText,
        secondaryBtnHref,
        nextOrder,
        isActive,
      ]
    );

    return NextResponse.json({
      success: true,
      slideId: result.insertId,
      message: 'Hero slide created successfully.',
    });
  } catch (error: any) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide', details: error.message },
      { status: 500 }
    );
  }
}

