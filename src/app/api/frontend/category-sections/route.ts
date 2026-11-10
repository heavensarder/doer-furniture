import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureHomeCategorySectionsTable } from '@/lib/frontend-db';
import { ensureEcommerceTables } from '@/lib/ecommerce-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureEcommerceTables();
    await ensureHomeCategorySectionsTable();

    // 1. Fetch active sections joined with product category details
    const [sections]: any = await pool.execute(
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
        c.name AS categoryName,
        c.slug AS categorySlug
      FROM home_category_sections s
      LEFT JOIN product_categories c ON s.category_id = c.id
      WHERE s.is_active = 1
      ORDER BY s.display_order ASC, s.id ASC`
    );

    // 2. For each section, fetch the latest 4 published products in that category
    const enrichedSections = await Promise.all(
      sections.map(async (sec: any) => {
        let products: any[] = [];
        if (sec.categoryId) {
          const [prods]: any = await pool.execute(
            `SELECT 
              id,
              name,
              slug,
              main_image,
              price,
              is_call_for_price,
              short_description,
              description,
              video_type,
              video_url,
              created_at
            FROM products
            WHERE category_id = ? AND status = 'published'
            ORDER BY created_at DESC, id DESC
            LIMIT 4`,
            [sec.categoryId]
          );
          products = prods || [];
        }

        return {
          ...sec,
          products,
        };
      })
    );

    return NextResponse.json({
      success: true,
      sections: enrichedSections,
    });
  } catch (error: any) {
    console.error('Error fetching home category sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category sections', sections: [] },
      { status: 500 }
    );
  }
}

