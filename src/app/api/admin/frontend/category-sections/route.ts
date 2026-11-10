import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureHomeCategorySectionsTable } from '@/lib/frontend-db';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();

    const [rows]: any = await pool.execute(
      `SELECT 
        s.id,
        s.badge,
        s.title_prefix AS titlePrefix,
        s.title_highlight AS titleHighlight,
        s.title_suffix AS titleSuffix,
        s.subtitle,
        s.category_id AS categoryId,
        s.explore_button_text AS exploreButtonText,
        s.display_order AS displayOrder,
        s.is_active AS isActive,
        s.created_at AS createdAt,
        s.updated_at AS updatedAt,
        c.name AS categoryName,
        c.slug AS categorySlug,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = s.category_id AND p.status = 'published') AS productCount
      FROM home_category_sections s
      LEFT JOIN product_categories c ON s.category_id = c.id
      ORDER BY s.display_order ASC, s.id ASC`
    );

    return NextResponse.json({
      success: true,
      sections: rows || [],
    });
  } catch (error: any) {
    console.error('Error fetching admin category sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category sections', details: error.message },
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

    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();

    const body = await request.json();

    const categoryId = Number(body.categoryId);
    const badge = String(body.badge || 'Featured Product Category').trim();
    const titlePrefix = String(body.titlePrefix || '').trim();
    const titleHighlight = String(body.titleHighlight || '').trim();
    const titleSuffix = String(body.titleSuffix || '').trim();
    const subtitle = String(body.subtitle || '').trim();
    const exploreButtonText = String(body.exploreButtonText || 'Explore All Products').trim();
    const isActive = body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1;

    if (!categoryId) {
      return NextResponse.json({ error: 'Please select a valid product category.' }, { status: 400 });
    }
    if (!titlePrefix && !titleHighlight) {
      return NextResponse.json({ error: 'Section heading is required.' }, { status: 400 });
    }

    // Get max display order
    const [orderRow]: any = await pool.execute('SELECT MAX(display_order) as maxOrder FROM home_category_sections');
    const nextOrder = (orderRow && orderRow[0] && orderRow[0].maxOrder ? orderRow[0].maxOrder : 0) + 1;

    const [result]: any = await pool.execute(
      `INSERT INTO home_category_sections (
        badge, title_prefix, title_highlight, title_suffix, subtitle, category_id, explore_button_text, display_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        badge,
        titlePrefix,
        titleHighlight,
        titleSuffix,
        subtitle,
        categoryId,
        exploreButtonText,
        nextOrder,
        isActive,
      ]
    );

    return NextResponse.json({
      success: true,
      sectionId: result.insertId,
      message: 'Category showcase section created successfully.',
    });
  } catch (error: any) {
    console.error('Error creating category section:', error);
    return NextResponse.json(
      { error: 'Failed to create category section', details: error.message },
      { status: 500 }
    );
  }
}

