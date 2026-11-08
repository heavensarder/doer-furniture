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

export async function GET(request: Request) {
  try {
    await ensureEcommerceTables();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.display_order as category_order
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(Number(categoryId));
    }

    if (categorySlug && categorySlug !== 'all') {
      sql += ' AND c.slug = ?';
      params.push(categorySlug);
    }

    if (status && status !== 'all') {
      sql += ' AND p.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY COALESCE(c.display_order, 9999) ASC, p.display_order ASC, p.id DESC';

    const [rows]: any = await pool.execute(sql, params);

    const parsedProducts = rows.map((row: any) => {
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
      return {
        ...row,
        price: row.price !== null && row.price !== undefined ? Number(row.price) : null,
        is_call_for_price: Boolean(row.is_call_for_price) || row.price === null || Number(row.price) <= 0,
        gallery_images: Array.isArray(gallery) ? gallery : [],
      };
    });

    return NextResponse.json({ products: parsedProducts });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
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
      slug = `product-${Date.now()}`;
    }

    // Ensure unique slug
    const [existing]: any = await pool.execute('SELECT id FROM products WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const [result]: any = await pool.execute(
      `INSERT INTO products (
        category_id, name, slug, short_description, description,
        price, is_call_for_price, main_image, gallery_images,
        video_type, video_url, status, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
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
      ]
    );

    const [newProd]: any = await pool.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN product_categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ product: newProd[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

