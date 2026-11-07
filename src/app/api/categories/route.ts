import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET(request: Request) {
  try {
    await ensureEcommerceTables();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === '1';

    let sql = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM product_categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
    `;

    if (activeOnly) {
      sql += ` WHERE c.is_active = 1 `;
    }

    sql += `
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.id ASC
    `;

    const [rows] = await pool.execute(sql);
    return NextResponse.json({ categories: rows });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
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

    const body = await request.json();
    const name = (body.name || '').trim();
    const description = (body.description || '').trim();
    let slug = (body.slug || '').trim() || slugify(name);

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    // Check slug uniqueness
    const [existing]: any = await pool.execute(
      'SELECT id FROM product_categories WHERE slug = ?',
      [slug]
    );
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Get max display_order
    const [maxOrder]: any = await pool.execute(
      'SELECT COALESCE(MAX(display_order), 0) as max_order FROM product_categories'
    );
    const nextOrder = (maxOrder[0]?.max_order || 0) + 1;

    const [result]: any = await pool.execute(
      `INSERT INTO product_categories (name, slug, description, display_order, is_active) VALUES (?, ?, ?, ?, 1)`,
      [name, slug, description, nextOrder]
    );

    const [newCat]: any = await pool.execute(
      'SELECT * FROM product_categories WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({ category: newCat[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

