import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { ensureSeoTables } from '@/lib/seo-db';
import { deleteUploadedFiles } from '@/lib/file-storage';

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

    await ensureSeoTables();
    const id = Number(params?.id);

    const [rows]: any = await pool.execute('SELECT * FROM seo_pages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, page: rows[0] });
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

    await ensureSeoTables();
    const id = Number(params?.id);
    const body = await request.json();

    // Toggle index only shortcut
    if (body.toggleIndex !== undefined) {
      await pool.execute('UPDATE seo_pages SET robots_index = ? WHERE id = ?', [
        body.robots_index ? 1 : 0,
        id,
      ]);
      return NextResponse.json({ success: true, message: 'Indexing status updated.' });
    }

    const pageName = String(body.page_name || '').trim();
    const metaTitle = String(body.meta_title || '').trim();
    const metaDescription = String(body.meta_description || '').trim();
    const focusKeywords = String(body.focus_keywords || '').trim();
    const canonicalUrl = String(body.canonical_url || '').trim();
    const ogTitle = String(body.og_title || metaTitle).trim();
    const ogDescription = String(body.og_description || metaDescription).trim();
    const ogImage = String(body.og_image || '').trim();
    const sitemapChangefreq = String(body.sitemap_changefreq || 'weekly').trim();
    const sitemapPriority = Number(body.sitemap_priority) || 0.8;
    const robotsIndex = body.robots_index !== undefined ? (body.robots_index ? 1 : 0) : 1;
    const robotsFollow = body.robots_follow !== undefined ? (body.robots_follow ? 1 : 0) : 1;
    const customSchema = body.custom_schema ? String(body.custom_schema).trim() : null;

    await pool.execute(
      `UPDATE seo_pages SET
        page_name = ?,
        meta_title = ?,
        meta_description = ?,
        focus_keywords = ?,
        canonical_url = ?,
        og_title = ?,
        og_description = ?,
        og_image = ?,
        sitemap_changefreq = ?,
        sitemap_priority = ?,
        robots_index = ?,
        robots_follow = ?,
        custom_schema = ?
      WHERE id = ?`,
      [
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
        customSchema,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Page SEO updated successfully.',
    });
  } catch (error: any) {
    console.error('Error updating SEO page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    await ensureSeoTables();
    const id = Number(params?.id);

    // Prevent deletion of homepage '/'
    const [rows]: any = await pool.execute('SELECT page_path, og_image, twitter_image FROM seo_pages WHERE id = ?', [id]);
    if (rows && rows[0] && rows[0].page_path === '/') {
      return NextResponse.json({ error: 'Cannot delete the Home Page SEO record.' }, { status: 400 });
    }

    if (rows && rows.length > 0) {
      await deleteUploadedFiles([rows[0].og_image, rows[0].twitter_image]);
    }

    await pool.execute('DELETE FROM seo_pages WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Page SEO record and associated images removed.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

