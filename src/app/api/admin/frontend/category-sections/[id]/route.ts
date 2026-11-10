import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureHomeCategorySectionsTable } from '@/lib/frontend-db';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();
    const id = Number(params?.id);

    const [rows]: any = await pool.execute('SELECT * FROM home_category_sections WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json({ section: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch section', details: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();
    const id = Number(params?.id);
    const body = await request.json();

    // Check if toggle active status only
    if (body.toggleActive !== undefined) {
      await pool.execute('UPDATE home_category_sections SET is_active = ? WHERE id = ?', [
        body.isActive ? 1 : 0,
        id,
      ]);
      return NextResponse.json({ success: true, message: 'Section status updated.' });
    }

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

    await pool.execute(
      `UPDATE home_category_sections SET
        badge = ?,
        title_prefix = ?,
        title_highlight = ?,
        title_suffix = ?,
        subtitle = ?,
        category_id = ?,
        explore_button_text = ?,
        is_active = ?
      WHERE id = ?`,
      [
        badge,
        titlePrefix,
        titleHighlight,
        titleSuffix,
        subtitle,
        categoryId,
        exploreButtonText,
        isActive,
        id,
      ]
    );

    return NextResponse.json({ success: true, message: 'Section updated successfully.' });
  } catch (error: any) {
    console.error('Error updating category section:', error);
    return NextResponse.json(
      { error: 'Failed to update category section', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();
    const id = Number(params?.id);

    await pool.execute('DELETE FROM home_category_sections WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Section deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting category section:', error);
    return NextResponse.json(
      { error: 'Failed to delete category section', details: error.message },
      { status: 500 }
    );
  }
}

