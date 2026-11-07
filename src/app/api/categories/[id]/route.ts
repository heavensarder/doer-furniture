import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();
    const isActive = body.is_active !== undefined ? (body.is_active ? 1 : 0) : 1;
    let slug = (body.slug || '').trim() || slugify(name);

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Check slug uniqueness excluding current ID
    const [existing]: any = await pool.execute(
      'SELECT id FROM product_categories WHERE slug = ? AND id != ?',
      [slug, id]
    );
    if (existing.length > 0) {
      slug = `${slug}-${id}`;
    }

    await pool.execute(
      `UPDATE product_categories SET name = ?, slug = ?, description = ?, is_active = ? WHERE id = ?`,
      [name, slug, description, isActive, id]
    );

    const [updated]: any = await pool.execute(
      'SELECT * FROM product_categories WHERE id = ?',
      [id]
    );

    return NextResponse.json({ category: updated[0] });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
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

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
    }

    // Set products in this category to null category_id
    await pool.execute('UPDATE products SET category_id = NULL WHERE category_id = ?', [id]);
    await pool.execute('DELETE FROM product_categories WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}

