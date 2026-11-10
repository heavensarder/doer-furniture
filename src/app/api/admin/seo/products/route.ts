import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';
import { ensureSeoTables } from '@/lib/seo-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureEcommerceTables();
    await ensureSeoTables();

    const [rows]: any = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.price,
        p.main_image,
        p.status,
        p.meta_title,
        p.meta_description,
        p.focus_keywords,
        p.canonical_url,
        p.og_image,
        p.sku,
        p.mpn,
        p.schema_rating_value,
        p.schema_review_count,
        p.robots_index,
        p.updated_at,
        c.name AS category_name
      FROM products p
      LEFT JOIN product_categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);

    // Calculate SEO health score per product
    const enriched = (rows || []).map((prod: any) => {
      let score = 0;
      const issues: string[] = [];

      if (prod.meta_title && prod.meta_title.length >= 30) score += 25;
      else if (prod.meta_title) score += 15;
      else issues.push('Missing Meta Title');

      if (prod.meta_description && prod.meta_description.length >= 100) score += 25;
      else if (prod.meta_description) score += 15;
      else issues.push('Missing Meta Description');

      if (prod.focus_keywords && prod.focus_keywords.length > 5) score += 20;
      else issues.push('Missing Focus Keywords');

      if (prod.sku || prod.mpn) score += 15;
      else issues.push('Missing SKU/Model');

      if (prod.main_image) score += 15;

      return {
        ...prod,
        seo_score: Math.min(100, score),
        seo_issues: issues,
      };
    });

    return NextResponse.json({
      success: true,
      products: enriched,
    });
  } catch (error: any) {
    console.error('Error fetching SEO products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

