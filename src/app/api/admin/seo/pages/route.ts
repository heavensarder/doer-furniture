import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureSeoTables } from '@/lib/seo-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSeoTables();

    const [rows]: any = await pool.execute(
      'SELECT * FROM seo_pages ORDER BY sitemap_priority DESC, id ASC'
    );

    return NextResponse.json({
      success: true,
      pages: rows || [],
    });
  } catch (error: any) {
    console.error('Error fetching SEO pages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSeoTables();
    const body = await request.json();

    let pagePath = String(body.page_path || '').trim();
    if (!pagePath.startsWith('/')) {
      pagePath = `/${pagePath}`;
    }

    const pageName = String(body.page_name || pagePath).trim();
    const metaTitle = String(body.meta_title || '').trim();
    const metaDescription = String(body.meta_description || '').trim();
    const focusKeywords = String(body.focus_keywords || '').trim();
    const canonicalUrl = String(body.canonical_url || `http://doerbd.com${pagePath}`).trim();
    const ogTitle = String(body.og_title || metaTitle).trim();
    const ogDescription = String(body.og_description || metaDescription).trim();
    const ogImage = String(body.og_image || '/images/introduction-image.png').trim();
    const sitemapChangefreq = String(body.sitemap_changefreq || 'weekly').trim();
    const sitemapPriority = Number(body.sitemap_priority) || 0.8;
    const robotsIndex = body.robots_index !== undefined ? (body.robots_index ? 1 : 0) : 1;
    const robotsFollow = body.robots_follow !== undefined ? (body.robots_follow ? 1 : 0) : 1;

    const [result]: any = await pool.execute(
      `INSERT INTO seo_pages (
        page_path, page_name, meta_title, meta_description, focus_keywords, canonical_url,
        og_title, og_description, og_image, sitemap_changefreq, sitemap_priority, robots_index, robots_follow
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pagePath,
        pageName,
        metaTitle,
        metaDescription,
        focusKeywords,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        sitemapChangefreq,
        sitemapPriority,
        robotsIndex,
        robotsFollow,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'New page SEO created.',
      id: result.insertId,
    });
  } catch (error: any) {
    console.error('Error creating SEO page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

