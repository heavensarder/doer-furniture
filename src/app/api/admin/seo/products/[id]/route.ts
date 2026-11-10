import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { ensureSeoTables } from '@/lib/seo-db';

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
    await ensureSeoTables();
    const id = Number(params?.id);

    const [rows]: any = await pool.execute(
      `SELECT 
        p.id,
        p.name,
        p.slug,
        p.main_image,
        p.meta_title,
        p.meta_description,
        p.focus_keywords,
        p.canonical_url,
        p.og_image,
        p.sku,
        p.mpn,
        p.schema_rating_value,
        p.schema_review_count,
        p.robots_index
      FROM products p
      WHERE p.id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    await ensureSeoTables();
    const id = Number(params?.id);
    const body = await request.json();

    const metaTitle = String(body.meta_title || '').trim();
    const metaDescription = String(body.meta_description || '').trim();
    const focusKeywords = String(body.focus_keywords || '').trim();
    const canonicalUrl = String(body.canonical_url || '').trim();
    const ogImage = body.og_image ? String(body.og_image).trim() : null;
    const sku = String(body.sku || '').trim();
    const mpn = String(body.mpn || '').trim();
    const schemaRatingValue = body.schema_rating_value ? Number(body.schema_rating_value) : 4.90;
    const schemaReviewCount = body.schema_review_count ? Number(body.schema_review_count) : 28;
    const robotsIndex = body.robots_index !== undefined ? (body.robots_index ? 1 : 0) : 1;

    await pool.execute(
      `UPDATE products SET
        meta_title = ?,
        meta_description = ?,
        focus_keywords = ?,
        canonical_url = ?,
        og_image = ?,
        sku = ?,
        mpn = ?,
        schema_rating_value = ?,
        schema_review_count = ?,
        robots_index = ?
      WHERE id = ?`,
      [
        metaTitle,
        metaDescription,
        focusKeywords,
        canonicalUrl,
        ogImage,
        sku,
        mpn,
        schemaRatingValue,
        schemaReviewCount,
        robotsIndex,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Product SEO & Rich Snippets updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating product SEO:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

