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

    const [pageRows]: any = await pool.execute(
      'SELECT COUNT(*) as cnt FROM seo_pages WHERE robots_index = 1'
    );
    const [catRows]: any = await pool.execute(
      'SELECT COUNT(*) as cnt FROM product_categories WHERE is_active = 1'
    );
    const [prodRows]: any = await pool.execute(
      "SELECT COUNT(*) as cnt FROM products WHERE status = 'published'"
    );

    let jobsCount = 0;
    try {
      const [jobRows]: any = await pool.execute(
        'SELECT COUNT(*) as cnt FROM career_jobs WHERE is_active = 1'
      );
      jobsCount = jobRows && jobRows[0] ? jobRows[0].cnt : 0;
    } catch {
      // Ignore if table not present
    }

    const pagesCount = pageRows && pageRows[0] ? pageRows[0].cnt : 0;
    const categoriesCount = catRows && catRows[0] ? catRows[0].cnt : 0;
    const productsCount = prodRows && prodRows[0] ? prodRows[0].cnt : 0;
    const totalUrls = pagesCount + categoriesCount + productsCount + jobsCount;

    return NextResponse.json({
      success: true,
      stats: {
        pagesCount,
        categoriesCount,
        productsCount,
        jobsCount,
        totalUrls,
        sitemapUrl: 'http://doerbd.com/sitemap.xml',
        robotsUrl: 'http://doerbd.com/robots.txt',
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching sitemap stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

