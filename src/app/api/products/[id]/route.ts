import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { cleanHtmlStyles } from '@/components/admin/RichTextEditor';

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ensureEcommerceTables();

    const identifier = params.id;
    const isNumeric = /^\d+$/.test(identifier);

    const sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE ${isNumeric ? 'p.id = ?' : 'p.slug = ?'}
      LIMIT 1
    `;

    const [rows]: any = await pool.execute(sql, [
      isNumeric ? Number(identifier) : identifier,
    ]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const row = rows[0];
    let gallery: string[] = [];
    if (row.gallery_images) {
      try {
        gallery =
          typeof row.gallery_images === 'string'
            ? JSON.parse(row.gallery_images)
            : row.gallery_images;
      } catch {
        gallery = [];
      }
    }

    const product = {
      ...row,
      price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
      is_call_for_price:
        Boolean(row.is_call_for_price) || row.price === null || Number(row.price) <= 0,
      gallery_images: Array.isArray(gallery) ? gallery : [],
    };

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
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

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    const name = (body.name || '').trim();
    const shortDescription = cleanHtmlStyles((body.short_description || '').trim());
    const description = cleanHtmlStyles((body.description || '').trim());
    const categoryId = body.category_id ? Number(body.category_id) : null;
    const mainImage = (body.main_image || '').trim();
    const galleryImages: string[] = Array.isArray(body.gallery_images) ? body.gallery_images : [];
    const videoType = body.video_type || 'none';
    const videoUrl = (body.video_url || '').trim();
    const status = body.status || 'published';

    const rawPrice = body.price;
    const hasPrice =
      rawPrice !== null &&
      rawPrice !== undefined &&
      String(rawPrice).trim() !== '' &&
      !isNaN(Number(rawPrice)) &&
      Number(rawPrice) > 0;

    const price = hasPrice && !body.is_call_for_price ? Number(rawPrice) : null;
    const isCallForPrice = body.is_call_for_price || !hasPrice ? 1 : 0;

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!mainImage) {
      return NextResponse.json({ error: 'Main product image is required' }, { status: 400 });
    }

    let slug = (body.slug || '').trim() || slugify(name);
    if (!slug) {
      slug = `product-${id}`;
    }

    const [existing]: any = await pool.execute(
      'SELECT id FROM products WHERE slug = ? AND id != ?',
      [slug, id]
    );
    if (existing.length > 0) {
      slug = `${slug}-${id}`;
    }

    await pool.execute(
      `UPDATE products SET
        category_id = ?,
        name = ?,
        slug = ?,
        short_description = ?,
        description = ?,
        price = ?,
        is_call_for_price = ?,
        main_image = ?,
        gallery_images = ?,
        video_type = ?,
        video_url = ?,
        status = ?
      WHERE id = ?`,
      [
        categoryId,
        name,
        slug,
        shortDescription,
        description,
        price,
        isCallForPrice,
        mainImage,
        JSON.stringify(galleryImages),
        videoType,
        videoUrl,
        status,
        id,
      ]
    );

    const [updated]: any = await pool.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN product_categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    return NextResponse.json({ product: updated[0] });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

